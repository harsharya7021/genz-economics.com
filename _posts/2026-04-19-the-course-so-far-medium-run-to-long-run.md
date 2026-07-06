---
layout: post
title: "The Phillips Curve, Finally Derived — and Why India Has Only Bad Choices Right Now"
dek: "Tantri returns after a gap, rebuilds the medium-term machinery live against the Iran crude shock and a forecast monsoon deficit, then formally derives the Phillips curve from first principles."
date: 2026-04-19
session: 13
tags: [phillips-curve, supply-shock, inflation-expectations, monetary-policy, india, crude-oil]
excerpt_override: "Session 13 — the formal Phillips curve derivation, and why a supply shock leaves policymakers with two bad options and no good one."
authors:
  - harsh
editors: []
---

It had been a while. Attendance had "completely collapsed" the last time he ran the wage- and price-setting equations on a whiteboard, so Prof. Tantri opens by rebuilding the medium-term apparatus quickly for the new joiners, with a promise to the regulars that the payoff is coming. Then he delivers it: the formal algebraic derivation of the Phillips curve, run alongside the sharpest live case study the course has had yet — an actual, ongoing supply shock (crude near $130, a forecast 8% monsoon deficit) that shows why India's policymakers are choosing between two bad outcomes, with no good one on the table.

## The Setup, Rebuilt in One Breath

The short/medium/long-run distinction gets restated almost as a single sentence this time: *"In the short run, the lens is demand is everything, prices are perfectly rigid... Medium term is something where prices are not perfectly flexible, but there is inflation expectation... long-term is something where people are able to perfectly expect prices... and therefore demand becomes irrelevant."*

Then the two equations the whole model rests on. **Wage-setting**, from the worker's side: *W = Pᵉ · F(U, Z)*. A worker's wage demand rises with expected prices — you're negotiating for next year's rupees, not today's: *"wage itself is a futuristic concept... you have to worry about, when I get this money, what will be the price of rice"* — falls when unemployment is high, and rises with Z, the institutional catch-all for labor law and union strength.

**Price-setting**, from the firm's side: *P = W(1 + M)*. Price is wage plus markup, and the firm doesn't care what unemployment is doing — it charges what the customer will bear. This is the line he wants remembered above all: *"Cost more cost does not mean more price... price comes from utility. Whatever people are willing to pay is the price."* Where the two curves cross is the natural rate of unemployment and potential GDP — the point where nobody is surprised, because expected price equals actual price.

None of this is new to the archive — it's the machinery [Session 11]({% post_url 2026-02-15-medium-term-inflation-labor-markets-phillips-curve %}) already built. What's new is what he does with it next.

## A Live Supply Shock, Run Through the Model

Rather than a textbook example, Tantri points at the news. Crude has spiked — he puts India's effective import cost near $130 a barrel — on the back of an escalating Iran situation, and IMD and SkyMet are both forecasting an 8% monsoon deficit: two separate, simultaneous supply shocks. *"If this Iran thing does not stop, you're going to have supply shock from crude, you're going to have supply shock from monsoon."*

He's precise about what a supply shock actually *is*, mechanically: it is markup (M) rising. *"Supply shock is nothing but M going up... M goes up, real wage will fall, and you'll have higher unemployment rate."* The intuitive story people tell — crude oil goes up, so the driver's salary goes up to compensate — is backwards. *"That doesn't go up. Actually, salaries fall. They don't go up... that happens only when you print money."* Nobody's willingness to pay went up just because oil got expensive: *"Just because Iran war has happened, my utility function hasn't changed. Why will I work more? I would rather prefer leisure... unless I am destitute."* Which is exactly why the price-setting line stays flat, and the whole adjustment has to happen through unemployment instead.

This is also where the counterintuitive result from Session 11 gets sharpened with a live number: a supply shock *raises* the neutral rate, not lowers it, because potential GDP itself has fallen. *"It's very counterintuitive, and this is where I struggle to convince... your potential GDP goes down, which means the neutral rate... will be higher now."* If potential GDP is now a 5% economy rather than a 7% one, holding the policy rate at a level calibrated for 7% growth isn't neutral — it's stimulus, and stimulus into a supply shock is exactly how inflation expectations de-anchor.

## Two Bad Choices, No Good One

Given the shock, he lays out the policy fork with unusual bluntness — no hedging about a "soft landing":

> *"This is a situation — supply shock is something where you will only have bad choices. There's absolutely no good choice. Let's not pretend as if we are having a good choice."*

**Pass the shock through:** let petrol prices rise to whatever the import cost demands. Growth slows to 5%, maybe 4%, politicians take the heat immediately — but *"you will come out unscathed in the long run. In the short run, you are proper."*

**Shield consumers and print money to cover the gap:** what he says is actually happening right now — *"they will not increase petrol prices... which means what? They'll print money."* It works for a while, because nobody notices: *"So long as inflation expectations... he doesn't realize it. He somehow thinks that by dancing the same one hour, he's going to be able to ride 1 kilometer."* Growth prints look fine for a year or two while people are, in his phrase, still "in that Maya" — but the moment wage-earners whose incomes haven't kept pace start demanding raises, the temporary shock becomes permanent, generalized inflation, baked into every rent and wage contract.

A third option, one policymakers had raised with him directly — fund the subsidy by cutting other government spending instead of running a deficit — only relocates the tradeoff: *"That will also lead to same story, because whatever demand that other government expenditure would have created will not come in."* Either slower growth for a year or two, or several years of high inflation — his reference point is India in 2013-14, rupee collapsing, rates forced up painfully to correct course.

The history backing this up is the 1970s oil shock: the US, under Nixon, imposed wage-and-price controls; Japan let prices adjust. *"After 10 years... the countries which passed on prices had very stable 2% inflation... countries which imposed price caps ended up having 10, 15, 18% inflation for the next ten years."* Theory and history agree.

## The Phillips Curve, Derived

With the scaffolding and the live example both in place, he does the algebra. Take the wage-setting equation with an explicit linear functional form, *W = Pᵉ(1 − aU + Z)*, and substitute it into the price-setting equation:

*P = Pᵉ(1 − aU + Z)(1 + M)*

Divide through by last period's price to convert levels into growth rates, take logs (using the small-number approximation that log(1+x) ≈ x), and the ones cancel:

*π = πᵉ + (M + Z) − aU*

Now use the equilibrium condition from before — at the natural rate of unemployment, expected inflation equals actual inflation, which forces *M + Z = aUₙ*. Substitute that back in and rearrange, and out comes the Phillips curve:

**π = πᵉ − a(U − Uₙ)**

*"This is absolutely central for medium-term economics. Phillips curve is nothing but: inflation is equal to expected inflation, and if unemployment is more than the natural rate, then you have inflation falling. If unemployment is less than natural rate — GDP is more than potential GDP — you have inflation rising."* Every input has a place in the story he's just told: unemployment above target pulls inflation down toward the anchor; a shock that raises M or Z (crude oil, a bad monsoon, stricter labor law) pushes the anchor itself, πᵉ, in whichever direction expectations are drifting.

He closes on the open question that separates short, medium, and long run in one line: how does expected inflation actually behave? *"In the medium term, it's adaptive. In the long term, it is rational — it will immediately adjust."* That's the seam the next session picks up.

<div class="widget" id="w-apr19">
  <p class="w-head">The Phillips Curve Under a Supply Shock</p>
  <p class="w-note" style="margin:0 0 .6rem">Set today's unemployment gap and the size of the markup shock (crude + monsoon), and see where inflation lands relative to target.</p>
  <div class="w-row"><label>Unemployment gap (U − Uₙ, pp)</label><input type="range" data-x="gap" min="-3" max="3" step="0.5" value="-1"><output data-x-label="gap"></output></div>
  <div class="w-row"><label>Markup + Z shock (pp)</label><input type="range" data-x="shock" min="0" max="4" step="0.25" value="2"><output data-x-label="shock"></output></div>
  <div class="w-row"><label>Anchored expected inflation (%)</label><input type="range" data-x="pe" min="2" max="8" step="0.25" value="4"><output data-x-label="pe"></output></div>
  <p class="w-big" data-out></p>
  <p class="w-note" data-verdict></p>
</div>
<script>
(function(){
  var root = document.getElementById("w-apr19"); if (!root) return;
  var gap = root.querySelector('[data-x="gap"]');
  var shock = root.querySelector('[data-x="shock"]');
  var pe = root.querySelector('[data-x="pe"]');
  var out = root.querySelector("[data-out]"), verdict = root.querySelector("[data-verdict]");
  var a = 1; // slope parameter, held at 1 for the toy model
  function draw(){
    var g = +gap.value, s = +shock.value, p = +pe.value;
    root.querySelector('[data-x-label="gap"]').textContent = g.toFixed(1) + " pp";
    root.querySelector('[data-x-label="shock"]').textContent = s.toFixed(2) + " pp";
    root.querySelector('[data-x-label="pe"]').textContent = p.toFixed(2) + "%";
    // pi = pe - a*(gap) + shock  (shock pushes pe upward via M+Z pressure this period)
    var pi = p - a * g + s;
    out.textContent = "Inflation this period ≈ " + pi.toFixed(2) + "%";
    if (s >= 2.5 && g <= 0) {
      verdict.textContent = "This is the trap he described: below-target unemployment plus a live crude/monsoon shock, and the central bank is stimulating straight into it. Expectations start moving.";
    } else if (s >= 1.5) {
      verdict.textContent = "A real shock is passing through. If unemployment stays below Uₙ while this persists, the one-time shock risks becoming permanent inflation as expectations catch up.";
    } else if (g > 1) {
      verdict.textContent = "Slack in the labor market is doing its job — pulling inflation back toward the anchor, shock or no shock.";
    } else {
      verdict.textContent = "Close to potential GDP, modest shock — inflation tracks the anchor fairly closely. This is the 'nobody's surprised' equilibrium.";
    }
  }
  [gap, shock, pe].forEach(function(el){ el.addEventListener("input", draw); });
  draw();
})();
</script>

<div class="widget mcq" data-mcq data-answer="c">
  <p class="w-head">Try it</p>
  <p class="mcq-q">Crude oil prices spike sharply and India's government keeps petrol prices unchanged by running a larger fiscal deficit. According to the model Tantri built, what happens to workers' real wages in the near term, and why?</p>
  <div class="mcq-opts">
    <button type="button" data-opt="a">Real wages rise, because higher living costs force firms to raise pay to compensate workers.</button>
    <button type="button" data-opt="b">Real wages stay exactly the same, because the government's price freeze fully offsets the shock.</button>
    <button type="button" data-opt="c">Real wages fall, because the shock raises the effective markup (M) while the price-setting line stays flat — firms don't pay more just because costs rose.</button>
    <button type="button" data-opt="d">Real wages fall only if the central bank raises interest rates in response.</button>
  </div>
  <p class="w-note" data-explain hidden>A supply shock operates through M, not through wages directly. Real wage is W/P = 1/(1+M): when the shock pushes effective costs (and hence M) up, real wage falls immediately — regardless of what the government does with the retail price of petrol, because firms' willingness to pay was never a function of the crude oil price to begin with. Government absorbing the price shock via deficit spending delays the *visible* pain (headline petrol price doesn't move) but doesn't change the underlying real-wage arithmetic — it just buys time before people notice, per Tantri's "dancing the same one hour" line.</p>
</div>
<script>
(function(){
  document.querySelectorAll('[data-mcq]').forEach(function(root){
    var answer = root.getAttribute('data-answer');
    var opts = root.querySelectorAll('[data-opt]');
    var explain = root.querySelector('[data-explain]');
    var done = false;
    opts.forEach(function(b){
      b.addEventListener('click', function(){
        if (done) return; done = true;
        var chosen = b.getAttribute('data-opt');
        opts.forEach(function(x){
          var o = x.getAttribute('data-opt');
          if (o === answer) x.classList.add('is-right');
          else if (o === chosen) x.classList.add('is-wrong');
          x.disabled = true;
        });
        if (explain) explain.hidden = false;
      });
    });
  });
})();
</script>

## What You Can Now Do

You have the full Phillips curve derivation from first principles, not just the graph — so you can trace any inflation headline to which term is actually moving: the unemployment gap (U − Uₙ), the anchor itself (πᵉ), or a fresh markup/institutional shock (M or Z). That's a genuinely different read than "inflation is up, rates should rise."

Next time crude oil or a monsoon forecast leads the business news, run the two-bad-choices framework yourself: is the government passing the shock through (short-term pain, clean exit) or shielding and financing it (deferred pain, sticky exit)? Watch petrol pricing and the fiscal deficit together, not either alone, and you'll know which path India is actually on before the commentary catches up.

And you can now say precisely why a policy rate that looks "low" isn't automatically stimulative: it depends on where potential GDP — the neutral rate's anchor — has just moved to. A supply shock lowers potential GDP and therefore *raises* the neutral rate; holding rates steady through that shift isn't neutral policy, it's easing.

Next: {% post_url 2026-04-26-rbis-real-rate-mistake %} — the curve derived here gets pointed at India's actual policy stance, live, and RBI's own real-rate math turns out to have the same expectations problem baked in.
