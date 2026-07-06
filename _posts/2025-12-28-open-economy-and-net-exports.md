---
layout: post
title: "Open Economy: Domestic Demand vs. Demand for Domestic Goods"
dek: "Imports are domestic demand that leaks abroad; exports are foreign demand that lands at home — the one distinction that turns the closed-economy Keynesian Cross into an open one."
date: 2025-12-28
session: 7
tags: [open-economy, net-exports, keynesian-cross, exchange-rates]
excerpt_override: "Session 7 — the Keynesian Cross goes open: domestic demand splits from demand for domestic goods, X and imports enter the model, and the rice example that will carry the next three sessions gets built from scratch."
authors:
  - harsh
editors: []
stream_id: a976cb1dd2413069f7a7b72a79c27e20
---

*Do you see the difference between domestic demand and demand for domestic goods?* That is the whole session in one sentence, and Tantri asks it before writing a single new symbol. Domestic demand is whatever Indians want to buy, full stop. Demand for domestic goods is whatever Indians and everyone else want to buy *from India*. The two overlap almost entirely and differ in exactly one place — and that one place is where the rest of open-economy macro lives.

## Domestic demand splits in two

Start from the closed-economy demand equation you already know:

> D = C₀ + C₁(Y − T) + G + I(Y, r)

Everything in it is still domestic demand: things Indians buy. But once trade exists, "what Indians buy" and "what gets made in India" stop being the same list. A student, Mukund, got there in one line and Tantri didn't need to correct him: *"whatever's the demand in India... demand for domestic goods would be, specifically the demand for goods produced in India."* Correct — and the asymmetry between the two is sharper than it first sounds:

> "Imports is domestic demand, because you are asking — domestic people are asking for it — but it is not demand for domestic goods. On the other hand, export is not domestic demand... but it is demand for domestic goods."

An imported phone is domestic demand (an Indian bought it) but not demand for domestic goods (nobody in India made it). An exported textile is demand for domestic goods (an Indian factory made it) but not domestic demand (no Indian is buying it). Get that backwards on an exam and you've inverted the model.

## Building the open-economy equation

The convention — **X** for exports, **E** for imports — gives demand for domestic goods as domestic demand *plus* exports *minus* imports. **Imports** depend on domestic income and the real exchange rate: richer Indians buy more of everything, including foreign goods. That single fact is why fiscal stimulus behaves differently once an economy opens up:

> "In a closed economy... when you put in more money into the system, if prices remain the same, it will lead to a big multiplier, because there is nothing going out. In an open economy, that need not be the case. Some of the extra demand will go to foreign goods."

Every rupee of stimulus that leaks into imports never enters the domestic multiplier chain — the first concrete difference between the closed model and the open one. **Exports**, by contrast, depend on *foreign* income, not domestic income, plus the real exchange rate. He's careful here, since it's easy to conflate "exports affect Y" with "exports depend on Y": *"Export is a component of your income... but it depends on other — your customer's income... your other country's income."* Both terms route through the real exchange rate, just in opposite directions — which is why it becomes the star of the rest of the session.

Put together, total demand — relabelled **Z** — becomes:

> Z = C₀ + C₁(Y − T) + G + I(Y, r) + NX(Y, Yᶠ, ε)

where NX = X − E. The closed model had two endogenous variables to solve for — GDP and the interest rate. This one has three, and Tantri flags exactly what that costs you: *"you have 3 endogenous variables to solve... you need an equation to relate real interest rate with exchange rate. So if you can relate real interest rate with exchange rate, you're done."* That missing link — interest rate parity — is deliberately left for a later session; this one earns the right to ask the question by making sure you can't dodge it.

## The real exchange rate, built from rice

Since both imports and exports run through the real exchange rate, the session pivots there for the rest of the hour — not with a definition to memorize, but with a number to compute. His definition, stripped to plain English: *a good in one country buys how many units of the same good, of the same quality, in another country.* To make that concrete he strips the world to a single good: *"let's go to a world where rice is the only thing that matters."* One good, same quality everywhere, no transport cost.

The numbers: 1 kg of rice costs ₹50 in India and $1 in the US, with a nominal exchange rate of 100 (rupees per dollar — he rounds off the real 89-ish figure so the class isn't fighting the calculator). Convert ₹50 at the nominal rate and you get $0.50 — enough to buy half a kilo of rice in the US. **The real exchange rate of the rupee is 0.5.** Run the logic from a dollar instead — $1 converts to ₹100, buying 2 kg of rice in India — and the real exchange rate of the dollar is 2. One number is the reciprocal of the other; both say Indian rice is cheap and American rice is expensive, in a world where only rice exists.

A student, Shorya, pushed on the obvious follow-up: if you needed the nominal rate just to do the conversion, is the real rate not just derived from it? Tantri's answer is the cleanest statement in the session of what "real" actually buys you:

> "There is nothing called quoted real exchange rate. Real exchange rate... is always a derived quantity. There is no quotation, nobody quotes real exchange rate. There is no trade happening at the real exchange rate. You only arrive at real exchange rate based on assumptions."

Nobody posts a real-exchange-rate ticker; what's quoted is always the nominal rate, and the real rate is what you get once you also know the price of rice (or whatever basket) on both sides. Because a real basket is never one clean good at "the same quality," the number is never precise — a feature, in his framing, not a bug: *"that is why people like you and me have a job. Otherwise, if it was programmable and put some number, who cares?"*

## Why 150 is appreciation and 300 is depreciation

This is the piece that does the most work, and it's genuinely counterintuitive on first pass. Take the same rice example and let Indian inflation run: rice in India goes from ₹50 to ₹200 (100% domestic inflation) while the US price holds at $1. The exchange rate has to move *somewhere*, and Tantri works two candidate outcomes side by side.

If it moves to **150**: converting ₹200 gets you $1.33, buying 1.33 kg of US rice — more than the 1 kg you could buy at the start. *"Rupee is appreciated... rupee's ability to buy goods in the US has gone up."* Nominally the rupee has clearly depreciated (100 → 150), but in real terms it has *appreciated*, because domestic prices rose faster than the currency weakened.

If it moves to **300** instead: ₹200 converts to only $0.67, buying less than a kilo. The rupee has genuinely lost purchasing power abroad — a **real depreciation** — even though both scenarios look identical in raw nominal terms: "the rupee went from 100 to something bigger." He drives the point home with the line that reframes everything before it:

> "There is a difference between rupee depreciation between 80 and 85 that happened, and 85 and 90 that is happening now. When rupee depreciated from 80 to 85, that was a nominal depreciation. In fact, it was a real appreciation."

The nominal number, alone, tells you almost nothing about competitiveness. What matters for whether Indian exports get cheaper or costlier to foreigners is whether the currency moved *more or less than the inflation differential* — precisely the machinery sessions 6 and 8 build out into REER and interest-rate parity.

Two practical pieces round out the session. RBI's own behavior signals what it thinks the rupee should do: the week he was teaching, RBI had just run an OMO and a VRR — both of which pump rupees into the system, weakening the currency further. His read: *"this actually tells you RBI is not too much bothered about your 89.5 as of now"* — because *"to keep the rupee high, you have to suck rupees, not flood the market with rupees."* And he flags a *category error* in the "China and Japan kept their currency weak" argument circulating in Indian policy circles: China and Japan were *fighting appreciation* their trade surplus would otherwise have caused; India's rupee is naturally weak and depreciating on its own, so "do what China did" compares two different physical forces, not the same policy lever.

<div class="widget" id="w-openecon">
  <p class="w-head">Rice, Rupees, and the Real Exchange Rate</p>
  <p class="w-note" style="margin:0 0 .6rem">Domestic rice inflation has pushed the price from ₹100 to ₹200 (100% inflation) while the US price holds at $1. Move the nominal exchange rate and watch what happens to the rupee in real terms.</p>
  <div class="w-row"><label>Nominal rate (₹ per $)</label><input type="range" data-x min="100" max="400" step="10" value="150"><output data-x-label></output></div>
  <p class="w-big" data-out></p>
  <p class="w-note" data-verdict></p>
</div>
<script>
(function(){
  var root = document.getElementById("w-openecon"); if (!root) return;
  var x = root.querySelector("[data-x]");
  var out = root.querySelector("[data-out]"), verdict = root.querySelector("[data-verdict]");
  var priceIndiaNow = 200, rateBefore = 100;
  function draw(){
    var rate = +x.value;
    var kgBought = priceIndiaNow / rate; // converting ₹200 at this rate, then buying US rice at $1/kg
    out.textContent = kgBought.toFixed(2) + " kg of US rice per ₹200 of Indian rice (was 1.00 kg at the ₹100 baseline)";
    var nominalMove = ((rate - rateBefore) / rateBefore * 100).toFixed(0);
    if (kgBought > 1.01) {
      verdict.textContent = "Nominal depreciation of " + nominalMove + "% (₹100 → ₹" + rate + "), but real APPRECIATION — the rupee buys more abroad than before. “Who cares for what number is” — his line — this is the 80-to-85 case: it looked like weakness, it was actually strength.";
    } else if (kgBought < 0.99) {
      verdict.textContent = "Nominal depreciation of " + nominalMove + "% (₹100 → ₹" + rate + "), and this time a real DEPRECIATION too — the rupee has genuinely lost purchasing power abroad. This is the 85-to-90 case: the currency is weakening faster than domestic prices are rising.";
    } else {
      verdict.textContent = "Right at the knife-edge: the exchange rate has moved exactly in line with the 100% inflation differential. Real exchange rate back to 1 — nominal depreciation with zero real effect.";
    }
    root.querySelector('[data-x-label]').textContent = rate;
  }
  x.addEventListener("input", draw); draw();
})();
</script>

## What You Can Now Do

Read a headline that says "the rupee hit an all-time low" and ask the question this session equips you to ask: relative to what inflation differential? A depreciation that lags domestic inflation is a real appreciation dressed up as bad news; one that outruns it is the real thing. You also now have the vocabulary to catch a common sloppy move — treating "domestic demand" and "demand for domestic goods" as interchangeable — the error that makes people overstate how much of a stimulus check actually stays home once imports exist.

Next time someone says a currency needs to "stay weak to help exports," pointing at China or Japan, ask whether that currency was naturally appreciating (in which case "staying weak" meant fighting that pressure) or naturally depreciating (in which case it needs no help). And when you see RBI run an OMO or a VRR, you have a lens on its tolerance for the current level of the rupee — no policy statement required.

<div class="widget mcq" data-mcq data-answer="b">
  <p class="w-head">Try it</p>
  <p class="mcq-q">An Indian retailer imports sneakers from Vietnam and sells them to Indian shoppers. In Tantri's framework, this transaction is:</p>
  <div class="mcq-opts">
    <button type="button" data-opt="a">Domestic demand, and also demand for domestic goods</button>
    <button type="button" data-opt="b">Domestic demand, but not demand for domestic goods</button>
    <button type="button" data-opt="c">Demand for domestic goods, but not domestic demand</button>
    <button type="button" data-opt="d">Neither domestic demand nor demand for domestic goods</button>
  </div>
  <p class="w-note" data-explain hidden>Indian shoppers are the ones buying — that makes it domestic demand, full stop. But the sneakers were made in Vietnam, not India, so it is not demand for domestic goods. This is exactly his line: "imports is domestic demand... but it is not demand for domestic goods." Flip it and you get exports: an Indian factory selling to a foreign buyer is demand for domestic goods but not domestic demand, since no Indian is doing the buying.</p>
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

Next: {% post_url 2026-01-11-exchange-rates-inflation-and-interest-rate-parity %} — the missing third equation from this session's model, the link between real interest rates and the exchange rate, arrives there in full.
