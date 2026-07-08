---
layout: post
title: "Rising Rates: Is It Supply, or Is It Demand?"
dek: "India's interest rates are climbing. RBI says it's a plumbing problem. Tantri thinks it's a spending problem — and the rupee is the tie-breaker."
date: 2026-01-18
session: 9
tags: [monetary-policy, interest-rates, fiscal-policy, mundell-fleming, india]
excerpt_override: "Session 9 — a live diagnosis: are Indian interest rates rising because of a temporary liquidity squeeze, or because state and central governments are quietly printing money through borrowing? The rupee tells you which."
authors:
  - harsh
editors: []
stream_id: a2881c1d3bc6f1b883e5cf3d7d3b337f
description: "Interest rates in India are going up. RBI's diagnosis: transient liquidity squeeze — festival cash withdrawals, tax-payment timing, nothing structural,…"
---

Interest rates in India are going up. RBI's diagnosis: transient liquidity squeeze — festival cash withdrawals, tax-payment timing, nothing structural, hence the open market operations. Tantri's diagnosis, argued for three hours on WhatsApp with the Chief Economic Advisor the same week: it's demand, not supply — and demand problems don't fix themselves with OMOs. The two diagnoses make different predictions about the one thing nobody can fake: the exchange rate.

## Four reasons a rate can move

Before the diagnosis, the mechanics. An interest rate is where money supply meets money demand, and it can move for exactly four reasons: demand up, supply down — both push it up; demand down, supply up — both pull it down. The trouble, as Tantri put it, is that *"if RBI changed money supply, they would know."* Demand is the one that sneaks past you.

His example, already in the notes but worth repeating because it recurs constantly: pay your advance tax, and the bank transfers reserve money — not deposits — to the government. That money sits idle in the RBI's government account until spent, so for a few weeks, money supply has fallen with nobody touching a lever. *"December 15th was the last advance tax payment. Now it's been a month after that — government has already spent that."* Same story with festival cash withdrawals: money leaves the banking system, and *"when the cash is in the bank, it's a raw material — it can be used for CRR, and it creates a lot of money. When the cash is outside the bank, one rupee equals one rupee."* Either way, this is real, but it's temporary, and the correct response is exactly what RBI is doing: buy bonds, replace the missing reserves, wait for it to unwind on its own.

That is RBI's story for January 2026. Tantri's problem with it: the numbers don't fit a temporary story.

## The bill nobody sent

*"Almost all state governments, across all parties, are now in a freebie mode."* Manifestos promising cash transfers, buses, subsidies — funded, on paper, by borrowing the center has quietly allowed under the banner of "infrastructure reform." The catch, in his words: *"Who will check what infrastructure they have done? You can always show some books and say that I did infrastructure."* Pass a law requiring electricity meters, tick the compliance box, borrow another half a percentage point of headroom — nobody audits whether the meters actually got installed.

The result: state government borrowing is up 20% year-on-year, against a budgeted *nominal* GDP growth of 8%. Layer the center's own tax cut on top — popular, easy, and, in his framing, only half a policy: *"Cutting tax is not the big deal — anybody can do it. Cutting tax and cutting expenditure is a big deal."* Cut taxes without cutting spending and the deficit has to be financed from somewhere, which means competing for the same pool of savers, which means paying them more. *"Fund tax cuts through borrowings, and make central banks lend — central bank lending your borrowing is money printing. You could have done it more blatantly — just print money and distribute. It's the same thing."* He's explicit that this isn't a uniquely Indian failure: he draws the direct parallel to the UK's 2022 mini-budget — unfunded tax cuts, a borrowing spree, gilt yields spiking, a currency wobble — the textbook case of exactly this mechanism breaking in public.

Both stories — RBI's plumbing story and Tantri's spending story — predict higher interest rates. That's precisely why you can't settle the argument by staring at the rate itself. You need a second instrument. That's what the exchange rate is for.

## The tie-breaker: Mundell-Fleming

An interest rate is always real rate plus expected inflation, and the two halves point the currency in opposite directions. Real rate up → the currency appreciates (foreign money chases the higher risk-adjusted return, and it keeps chasing until the extra return is arbitraged away). Expected inflation up → the currency depreciates by roughly the same amount, because otherwise anyone could borrow in dollars at 2%, park it in rupees at 12%, and walk away with a free lunch that markets don't leave lying around.

Walk his own numbers: $1 = ₹100, US real rate 2% with 0% expected inflation, India real rate 2% too — but with expected inflation now drifting from 8% toward 10%. If the *entire* gap between the US and Indian rate is inflation expectation, the rupee has to depreciate by almost exactly that differential over the year, purely so that the dollar-converted return still comes out to 2% on both sides. Nobody arbitrages anything; the currency just does the arithmetic for you. But if the gap were instead a *real* rate increase — RBI genuinely tightening, inflation expectations flat — money would flood in chasing the higher real return, and the rupee would appreciate until the free lunch disappeared. Same rising interest rate, opposite currency prediction, depending entirely on which half of the rate is doing the moving.

<div class="widget" id="w-mundell">
  <p class="w-head">Model — Mundell-Fleming, his own numbers</p>
  <p class="w-note" style="margin:0 0 .6rem">$1 = ₹100. US: 2% real, 0% expected inflation. Slide how much of the widening India-US rate gap is expected inflation versus a genuine real-rate increase, and watch which way the rupee moves a year out.</p>
  <div class="w-row"><label>Share of the gap that is inflation expectation</label><input type="range" data-share min="0" max="100" step="5" value="100"><output data-share-label></output></div>
  <p class="w-big" data-out></p>
  <p class="w-note" data-verdict></p>
</div>
<script>
(function(){
  var root = document.getElementById("w-mundell"); if (!root) return;
  var share = root.querySelector("[data-share]");
  var out = root.querySelector("[data-out]"), verdict = root.querySelector("[data-verdict]");
  var GAP = 10; // India 12% vs US 2%, a 10pp gap to attribute
  function draw(){
    var s = +share.value / 100;
    root.querySelector("[data-share-label]").textContent = Math.round(s * 100) + "%";
    var inflPart = GAP * s, realPart = GAP * (1 - s);
    var rupeeMove = inflPart - realPart; // net: inflation depreciates, real appreciation offsets
    var level = 100 * (1 + rupeeMove / 100);
    out.textContent = "₹/$ a year out: " + level.toFixed(1) + (rupeeMove > 0 ? " (depreciation)" : rupeeMove < 0 ? " (appreciation)" : " (flat)");
    out.style.color = rupeeMove > 0 ? "var(--w-bad)" : (rupeeMove < 0 ? "var(--w-good)" : "");
    if (s >= 0.99) verdict.textContent = "All inflation expectation, his base case: the rupee depreciates by almost the full gap, purely to keep the dollar-converted return equal on both sides. No default fear needed — just the Fisher/Mundell-Fleming arithmetic.";
    else if (s <= 0.01) verdict.textContent = "All real rate: RBI genuinely tightening with inflation expectations flat. Foreign money chases the higher real return, and the chasing itself appreciates the rupee until the extra return is gone.";
    else verdict.textContent = "A blend — realistic, and exactly why you can't read a single rising rate and know which story is true. You need the exchange rate as the second data point.";
  }
  share.addEventListener("input", draw); draw();
})();
</script>

## What actually happened

January 2026's data, by his reading, breaks the tie. The 10-year bond yield rose roughly 45 basis points. If that were purely RBI's liquidity story, the rupee should have held steady or firmed — a temporary supply squeeze says nothing about future inflation. Instead the rupee kept sliding *alongside* the rate rise. Higher rates and a weaker currency, moving together, is precisely the depreciation-not-appreciation signature Mundell-Fleming predicts when the driver is inflation expectations, not a genuine tightening. *"If it was because of real rate, currency would have appreciated... So it's not default. What they're expecting is inflation."* He's careful to rule out the other obvious alternative: at roughly $700 billion of reserves, nobody is pricing Indian sovereign default — so the rate rise isn't a credit story either. By elimination, it's expectations.

Maneshwar's question sharpened the point further: doesn't this put India in competition with Japan, where yields have *also* risen — by around 75 basis points — for capital chasing the best risk-adjusted return? Tantri's answer: Japan shows the identical signature. Rising yields there are *also* depreciating the yen, not appreciating it, meaning Tokyo has the same inflation-expectation problem, driven by its own version of the same fight — a government wanting to expand defense spending against a central bank trying to tighten. Two economies, continents apart, showing the same diagnostic pattern, for recognisably the same underlying disease.

## What You Can Now Do

Next time a rate rise makes headlines anywhere, resist the urge to read it off a single number. Ask what the currency did in the same window. Rate up, currency up — that's a real tightening, money chasing genuine return. Rate up, currency down — that's expectations catching up with a government that borrowed more than it could credibly repay at stable prices, no matter how official the explanation sounds. The test costs nothing and requires no inside information: it's sitting in the same data terminal as the rate itself. And when you hear "cutting tax will pay for itself through growth," ask the one question that survives every election cycle: what, exactly, got cut on the expenditure side to match it? If the honest answer is nothing, you already know which story you're in.

Next: {% post_url 2026-01-25-the-z-variable-and-japan %} — short-term macro closes here; medium-term opens by relaxing the one assumption this whole arc depended on — that inflation expectations stay put.
