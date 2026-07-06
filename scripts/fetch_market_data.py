#!/usr/bin/env python3
"""Morning market refresh for the Bloomburger Terminal.

Updates the LIVE metrics in _data/macro.json ("auto" block) and _data/markets.yml
from FRED (needs FRED_API_KEY) + Yahoo Finance. If a source fails, the previous
value is kept — the page never blanks. The MANUAL India prints (repo, CPI, WPI,
GDP, REER, Fed rate) are deliberately left untouched; you update those on their
release days.

  FRED  → USD/INR (DEXINUS), Brent (DCOILBRENTEU), US 10Y (DGS10)
  Yahoo → NIFTY 50 (^NSEI), SENSEX (^BSESN), Gold (GC=F)
"""
import datetime
import json
import os
import sys
import urllib.parse
import urllib.request

FRED_KEY = os.environ.get("FRED_API_KEY", "").strip()
UA = {"User-Agent": "Mozilla/5.0 (gze-market-bot)"}
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8")


def fred_series(series_id, n=10):
    """Recent (date, float) closes, oldest→newest, or [] on failure."""
    if not FRED_KEY:
        print("no FRED_API_KEY — skipping", series_id, file=sys.stderr)
        return []
    try:
        q = urllib.parse.urlencode({
            "series_id": series_id, "api_key": FRED_KEY, "file_type": "json",
            "sort_order": "desc", "limit": n * 4,
        })
        data = json.loads(_get("https://api.stlouisfed.org/fred/series/observations?" + q))
        out = []
        for o in data.get("observations", []):
            if o.get("value") in (".", "", None):
                continue
            try:
                out.append((o["date"], float(o["value"])))
            except ValueError:
                continue
        return out[:n][::-1]
    except Exception as e:  # noqa: BLE001
        print("FRED", series_id, "failed:", e, file=sys.stderr)
        return []


def yahoo_series(symbol, n=10):
    """Recent daily closes from Yahoo, oldest→newest, or [] on failure."""
    try:
        url = ("https://query1.finance.yahoo.com/v8/finance/chart/"
               + urllib.parse.quote(symbol) + "?interval=1d&range=1mo")
        data = json.loads(_get(url))
        res = data["chart"]["result"][0]
        ts = res["timestamp"]
        closes = res["indicators"]["quote"][0]["close"]
        pairs = [(datetime.date.fromtimestamp(t).isoformat(), c)
                 for t, c in zip(ts, closes) if c is not None]
        return pairs[-n:]
    except Exception as e:  # noqa: BLE001
        print("Yahoo", symbol, "failed:", e, file=sys.stderr)
        return []


def last(series):
    return series[-1][1] if series else None


def last_date(series):
    return series[-1][0] if series else None


def pct_chg(series):
    if len(series) < 2 or not series[-2][1]:
        return 0.0
    return round((series[-1][1] - series[-2][1]) / series[-2][1] * 100, 2)


def abs_chg(series):
    if len(series) < 2:
        return 0.0
    return series[-1][1] - series[-2][1]


def spark(series, k=8):
    return [round(v, 3) for _, v in series][-k:]


def grp(x, dec=2):
    return f"{x:,.{dec}f}"


def signed(x, dec=2):
    return ("+" if x >= 0 else "−") + f"{abs(x):,.{dec}f}"


# ── fetch ───────────────────────────────────────────────────────────
series = {
    "nifty":  yahoo_series("^NSEI"),
    "sensex": yahoo_series("^BSESN"),
    "gold":   yahoo_series("GC=F"),
    "usdinr": fred_series("DEXINUS") or yahoo_series("INR=X"),
    "brent":  fred_series("DCOILBRENTEU") or yahoo_series("BZ=F"),
    "ust10y": fred_series("DGS10") or yahoo_series("^TNX"),
}

# ── macro.json "auto" block ─────────────────────────────────────────
mj_path = os.path.join(HERE, "_data", "macro.json")
mj = json.load(open(mj_path, encoding="utf-8"))
auto = mj.setdefault("auto", {})

FMT = {
    "nifty":  lambda v: grp(v, 2),
    "sensex": lambda v: grp(v, 2),
    "usdinr": lambda v: grp(v, 2),
    "brent":  lambda v: "$" + grp(v, 2),
    "gold":   lambda v: "$" + grp(v, 0),
    "ust10y": lambda v: grp(v, 2) + "%",
}
for key, s in series.items():
    if s and key in auto:
        auto[key]["v"] = FMT[key](last(s))
        auto[key]["chg"] = pct_chg(s)
        auto[key]["spark"] = spark(s)

newest = max([d for d in (last_date(series["nifty"]), last_date(series["usdinr"]),
                          last_date(series["ust10y"])) if d] or [None])
if newest:
    mj["as_of"] = datetime.date.fromisoformat(newest).strftime("%-d %b %Y") + " close"
json.dump(mj, open(mj_path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
open(mj_path, "a", encoding="utf-8").write("\n")
print("macro.json updated; as_of =", mj.get("as_of"))

# ── markets.yml (NIFTY, SENSEX, USD/INR live; India 10Y left as-is) ──
try:
    import yaml  # PyYAML — installed in the workflow
    mk_path = os.path.join(HERE, "_data", "markets.yml")
    mk = yaml.safe_load(open(mk_path, encoding="utf-8")) or {}
    old = {t.get("symbol"): t for t in mk.get("tickers", [])}

    def ticker(symbol, code, s, dec=2, suffix=""):
        prev = old.get(symbol, {})
        if not s:
            return prev  # keep last good snapshot
        v = last(s)
        return {
            "symbol": symbol, "code": code,
            "value": grp(v, dec) + suffix,
            "change": signed(abs_chg(s), dec),
            "pct": signed(pct_chg(s), 2) + "%",
            "dir": "up" if abs_chg(s) >= 0 else "down",
            "spark": spark(s),
        }

    mk["tickers"] = [
        ticker("NIFTY 50", "^NSEI", series["nifty"]),
        ticker("SENSEX", "BSE", series["sensex"]),
        ticker("USD / INR", "FX", series["usdinr"]),
        old.get("10Y G-Sec", {"symbol": "10Y G-Sec", "code": "IN10Y",
                              "value": "6.72%", "change": "0.00", "pct": "0.00%",
                              "dir": "down", "spark": [6.72]}),  # India 10Y: manual
    ]
    if newest:
        mk["as_of"] = datetime.date.fromisoformat(newest).strftime("%-d %b %Y")
    header = ("# Market snapshot for the ticker widget. LIVE tickers (NIFTY, SENSEX,\n"
              "# USD/INR) are refreshed each weekday morning by the market-data workflow;\n"
              "# the India 10Y G-Sec line is maintained by hand. Do not hand-edit the\n"
              "# live tickers — the job overwrites them.\n")
    with open(mk_path, "w", encoding="utf-8") as f:
        f.write(header)
        yaml.safe_dump(mk, f, sort_keys=False, allow_unicode=True, default_flow_style=False)
    print("markets.yml updated")
except Exception as e:  # noqa: BLE001
    print("markets.yml update skipped:", e, file=sys.stderr)
