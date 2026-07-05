/* The group bot: Wednesday poll → Friday tally+Zoom invite, announce endpoint,
   and BIL replies when tagged. Runs on the VPS under pm2. */
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import cron from "node-cron";
import express from "express";
import pino from "pino";
import { cfg } from "../config.js";
import { postWeeklyPoll, onPollUpdates, tallyAndInvite } from "./poll.js";

const log = pino({ level: "info" });
const LIST_ONLY = process.argv.includes("--list-groups");

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth-state");
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, auth: state, printQRInTerminal: false, logger: pino({ level: "warn" }) });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", async (u) => {
    if (u.qr) { console.log("\nScan with the BOT's dedicated number (WhatsApp → Linked devices):\n"); qrcode.generate(u.qr, { small: true }); }
    if (u.connection === "open") {
      log.info("connected");
      if (LIST_ONLY) {
        const groups = await sock.groupFetchAllParticipating();
        console.log("\nGroups this number is in:");
        for (const [jid, g] of Object.entries(groups)) console.log(`  ${jid}   ${g.subject}`);
        process.exit(0);
      }
    }
    if (u.connection === "close") {
      const code = u.lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) { log.warn({ code }, "reconnecting"); start(); }
      else log.error("logged out — delete ./auth-state and re-pair");
    }
  });

  // Poll votes arrive as message updates
  sock.ev.on("messages.update", (updates) => onPollUpdates(sock, updates).catch(e => log.error(e)));

  // BIL: reply when a group message starts with "bil"/"@bil" or "BIL,"
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const m of messages) {
      try {
        if (m.key.remoteJid !== cfg.waGroup || m.key.fromMe) continue;
        const text = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
        const hit = text.match(/^\s*@?bil[\s,:-]+(.+)/is);
        if (!hit) continue;
        await sock.sendPresenceUpdate("composing", cfg.waGroup);
        const r = await fetch(`http://127.0.0.1:${cfg.bil.port}/ask`, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${cfg.bil.token}` },
          body: JSON.stringify({ question: hit[1].slice(0, 800), channel: "whatsapp" }),
        });
        const j = r.ok ? await r.json() : { answer: "BIL is travelling (service down). Try later." };
        await sock.sendMessage(cfg.waGroup, { text: j.answer.slice(0, 3500) }, { quoted: m });
      } catch (e) { log.error(e, "bil reply failed"); }
    }
  });

  if (!LIST_ONLY) {
    // Schedules (IST)
    cron.schedule(cfg.pollCron, () => postWeeklyPoll(sock).catch(e => log.error(e)), { timezone: cfg.tz });
    cron.schedule(cfg.tallyCron, () => tallyAndInvite(sock).catch(e => log.error(e)), { timezone: cfg.tz });
    log.info({ poll: cfg.pollCron, tally: cfg.tallyCron, tz: cfg.tz }, "crons armed");

    // Announce endpoint — the pipeline posts here; manual use: curl -X POST .../announce -H "Authorization: Bearer $ANNOUNCE_TOKEN" -d '{"text":"..."}'
    const app = express();
    app.use(express.json());
    app.post("/announce", async (req, res) => {
      if (req.headers.authorization !== `Bearer ${cfg.announce.token}`) return res.status(401).end();
      const t = (req.body?.text || "").trim();
      if (!t) return res.status(400).json({ error: "text required" });
      await sock.sendMessage(cfg.waGroup, { text: t });
      res.json({ ok: true });
    });
    // Manual triggers for testing: /trigger/poll, /trigger/tally
    app.post("/trigger/:what", async (req, res) => {
      if (req.headers.authorization !== `Bearer ${cfg.announce.token}`) return res.status(401).end();
      if (req.params.what === "poll") await postWeeklyPoll(sock);
      else if (req.params.what === "tally") await tallyAndInvite(sock);
      else return res.status(404).end();
      res.json({ ok: true });
    });
    app.listen(cfg.announce.port, "127.0.0.1", () => log.info(`announce endpoint on :${cfg.announce.port}`));
  }
}
start();
