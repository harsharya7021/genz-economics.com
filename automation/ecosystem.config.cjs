/* pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    { name: "wa-bot", script: "src/wa/bot.js", cwd: __dirname, autorestart: true, max_restarts: 20, env: { NODE_ENV: "production" } },
    { name: "bil",    script: "src/bil/serve.js", cwd: __dirname, autorestart: true, env: { NODE_ENV: "production" } },
  ],
};
