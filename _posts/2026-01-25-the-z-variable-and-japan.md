---
layout: post
title: "The Z Variable, and the Country That Just Broke a 40-Year Rule"
dek: "Labor rigidity has a name in the model — Z. Then Japan spent an hour showing what happens when a whole country's Z quietly changes underneath it."
date: 2026-01-25
session: 10
tags: [medium-term, labor-market, japan, carry-trade, wage-setting]
excerpt_override: "Session 10 — the wage-setting and price-setting equations get their formal introduction (full derivation in Session 11), then the class turns to Japan: four decades of near-zero rates, a carry trade the whole world quietly depends on, and the first sign it might be ending."
authors:
  - harsh
editors: []
stream_id: 36d1cfc3241277993b082b9adbe76775
---

Two equations get written on the board today, and Tantri is upfront that the payoff is still a class away: *"Today, we are only going to set it up. Insights will come from next class."* The setup is worth having anyway, because the last twenty minutes turn it on Japan — forty years of near-zero interest rates, a carry trade that quietly funds power projects and pension funds worldwide, and the first real sign that the rule is breaking.

## The setup, briefly

Workers ask for a wage based on three things: what they expect prices to be, how much unemployment there is around them, and Z — a catch-all for everything outside the firm's control, mostly government-set: labor law, minimum wage, how strictly it's enforced. Firms, meanwhile, set actual prices as wages plus a markup, the markup being whatever product-market competition allows them to keep. Put the two together and you get real wage — what a worker's pay is actually worth in goods — and a natural rate of unemployment: the point where what workers expected and what firms actually paid turn out to be the same number, so nobody is surprised and nothing needs to adjust. *(The full mechanics of this — including why this is the machinery underneath the Phillips curve — get their proper derivation in Session 11; this class is the first formal pass at it.)*

The one piece worth sitting with here is Z, because it does something the rest of the model doesn't: it moves wage demands *without moving productivity at all*. Tantri's example is deliberately blunt: a government passes a strict minimum-wage law, and workers duly ask for more — but the firm's markup, set by product-market competition, hasn't changed, and neither has what the worker actually produces. *"There is no equilibrium in hiring the guy. That's the equilibrium — unemployment rate will go up."* The firm cannot simply raise prices to cover it, because — as he puts it to a room full of people who'd otherwise default to cost-plus thinking — *"pricing is not cost plus... P is whatever it is. You can't do anything within the price, you have to figure out your cost."* So the only variable left to absorb a Z-driven wage floor is the number of people employed. This, he says, is *"a very, very solid empirical fact... as you tighten labor laws, unemployment rate goes up"* — the reason Europe's unemployment rate has sat persistently above America's, and, closer to home, his own research on NAREGA finds the identical mechanism in India's rural labor market.

## Then the class turns to Japan

A student's question about Japan's negative-rate era — why didn't the Bank of Japan just treat it as Japan's permanent steady state? — pulls the whole discussion into the present tense, and this is where the class earns its keep.

For decades, Japan ran the arrangement almost too well to believe: print money at essentially zero cost, invest it abroad — equities, riskier foreign bonds — and earn something like 6% doing it. *"Imagine a situation, your foreign investment gives 6% return, cost is zero for printing money."* On that spread, Japan could carry a debt-to-GDP ratio of roughly 200% without ever meaningfully taxing its own population to service it, because — in the model's own terms — Japanese inflation expectations simply never moved. Z stayed put, wages stayed put, the natural-rate machinery never had reason to reprice anything.

That stability turned into the foundation of a trade the rest of the world leans on more than most people realize: borrow cheap and short-term in yen, invest it long-term somewhere else. Tantri's own example is not hypothetical — Power Finance Corporation, where he sits on the board, borrows three- and five-year money from Japan and lends it out for twenty-year power-project loans. The arrangement works exactly as long as Japanese rates stay near zero.

They are no longer staying near zero. Post-COVID inflation expectations rose "anywhere in the world, in most places, and so is in Japan" — and for the first time in a generation, Japanese wages and prices are actually moving. *"A generation in Japan hasn't heard of something known as inflation. Now they are having 2% inflation."* The tell he points to is specific and startling: Japan's 40-year government bond, for the first time, priced at a 4% yield — *"unheard of for Japan."* The Bank of Japan, trying to catch up, has pushed its policy rate to 0.75%, which by his account is *"not sufficient, because the inflation expectation is going even higher pace."*

<div class="widget" id="w-carry">
  <p class="w-head">Machine — the carry trade's breakeven</p>
  <p class="w-note" style="margin:0 0 .6rem">Borrow in yen at Japan's rate, invest abroad at a fixed 6%. Slide Japan's own rate up from near-zero and watch the spread that made the trade worth doing.</p>
  <div class="w-row"><label>Japan's policy rate</label><input type="range" data-jrate min="0" max="6" step="0.25" value="0.75"><output data-jrate-label></output></div>
  <p class="w-big" data-out></p>
  <p class="w-note" data-verdict></p>
</div>
<script>
(function(){
  var root = document.getElementById("w-carry"); if (!root) return;
  var jr = root.querySelector("[data-jrate]");
  var out = root.querySelector("[data-out]"), verdict = root.querySelector("[data-verdict]");
  var FOREIGN = 6;
  function draw(){
    var j = +jr.value;
    root.querySelector("[data-jrate-label]").textContent = j.toFixed(2) + "%";
    var spread = FOREIGN - j;
    out.textContent = "Carry spread: " + spread.toFixed(2) + " points";
    out.style.color = spread > 2 ? "var(--w-good)" : (spread > 0 ? "" : "var(--w-bad)");
    if (j <= 0.1) verdict.textContent = "Near-zero funding cost, ~6% abroad — this is the four-decade arrangement. Cost of printing money is essentially zero, so the whole 6-point spread is close to free money, funded by nobody in particular.";
    else if (j < 0.75) verdict.textContent = "Still a wide spread, but the direction has changed — Japan's own inflation is now the thing forcing this number up, not a policy choice.";
    else if (j <= 2) verdict.textContent = "His actual number, 0.75%, is already here — and by his account still not sufficient to catch up with where inflation expectations are heading. The spread is narrowing under the trade's feet.";
    else verdict.textContent = "Push Japan's rate much further and the carry trade stops paying for itself. That's the scenario every borrower funding long-term assets with short-term yen — PFC included — now has to hedge against.";
  }
  jr.addEventListener("input", draw); draw();
})();
</script>

The risk isn't abstract for the people in the room. If Japan keeps tightening, the carry trade that funds long-dated loans everywhere from Indian power projects to global pension books gets more expensive to roll over — and, as he notes, dryly, about the cost to himself personally, *"I will lose my board membership... these guys have borrowed a lot of money."* Whether the story ends in an orderly unwind or something rougher, his honest answer to the room was that it's genuinely unresolved: *"I know it is not a very, very clean answer... I'll send you that paper, read that, and then we'll discuss again."*

## What You Can Now Do

Two separate but related habits, one from each half of this class. First: when you hear that a labor-market rule (a minimum wage, a hiring protection, a state jobs guarantee) is unambiguously good for workers, check what it does to Z — and remember that a rule which raises wage demands without raising what workers actually produce doesn't get absorbed for free; it shows up as unemployment, exactly where NAREGA's own data shows it. Second: next time a headline says "Japan is finally tightening," don't file it as a domestic Japanese story. Ask who is funding long-term assets with short-term yen — because the answer, once you start looking, tends to be a lot closer to home than you'd expect.

Next: {% post_url 2026-02-15-medium-term-inflation-labor-markets-phillips-curve %} — where these same two equations get their full formal derivation, and the natural rate stops being a setup and starts being the diagnosis.
