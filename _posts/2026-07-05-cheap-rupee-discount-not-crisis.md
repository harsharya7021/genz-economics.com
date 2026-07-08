---
layout: post
title: "The Cheap Rupee: A Discount, Not a Crisis"
dek: "A real exchange rate at 89 is an export edge, not a failure. The capital-account story behind the fall, the FDI–FII split nobody expected, the borrower risk that turned out small, and why the RBI's FCNR(B) was a desperate measure it didn't need."
date: 2026-07-05
session: 16
tags: [exchange-rates, rupee, reer, fdi, fii, rbi]
excerpt_override: "Session 16 — the rupee at 89 read properly: current account is fine, the capital account did the work; a cheap rupee is a discount that lifts exports; FDI turned up while FII stayed out; and the RBI's FCNR(B) grab for hot money was the one move it didn't need."
authors:
  - harsh
editors: []
description: "Rupee depreciation explained via REER: at 89 the real exchange rate is a discount, not a crisis. Why exports gain, FDI returns while FII stays out, and why RBI's FCNR(B) wasn't needed."
---

Everyone read the falling rupee as a crisis. It isn't. The current account is fine — a deficit of about 0.6% of GDP, nothing to lose sleep over. The action was on the *capital* account, and once you separate the two, the whole story changes: a real exchange rate at 89 is not a country failing, it's a country on sale. Today we work out why exports pick up, why FDI turned up exactly when FII stayed out, why the borrower risk that looked like a Southeast-Asian crisis turned out small, and why the one measure the RBI reached for — FCNR(B) — was the one it didn't need.

## The setup: current account is fine, the capital account did the work

Start with the number people panic about and set it aside. The current account deficit was about 0.6% of GDP. That's fine. The problem, if you want to call it one, sat on the capital account — the movement of investment.

Here's what happened last year. Net FDI was only about $6bn. Now, the interesting part: it isn't that gross flows dried up — gross inflow was the *highest ever*. But there was a matching outflow, and thanks to IPOs. Samsung's listing, a wave of start-up IPOs — money that came in around 2022 chasing technology went out, now chasing AI. On top of that, FII outflow continued. So the rupee depreciated. That was the diagnosis a couple of months ago: the capital account is the issue.

And what's happened since? The FII outflow keeps going. But FDI has turned surprisingly positive — the whole net FDI we got in all of last year, we've now received in the *first two and a half months*. Hold that split in your head; we'll come back to it, because it's the most useful thing in this session.

## The dosa test, again — real versus nominal

You already know the dosa test. One dosa in the US, one dosa in India. If a dosa is ₹50 here and you take it to the US and it fetches half a dollar, the real exchange rate is one-half. Fine — whatever it is, we freeze that basket in 2015-16 and call it 100. From that point, the question is never the nominal ₹/$ number on TV. The question is what happened to that *index*.

Play with it. Two things move the real rate: how far the rupee falls in nominal terms, and how much more India inflates than the US. Push them and watch which way the discount goes.

<div class="widget" id="s16-reer">
  <p class="w-head">Model №1 — the dosa test (real vs nominal)</p>
  <div class="w-row"><label>Rupee's nominal fall vs 2015-16</label><input type="range" data-nom min="0" max="45" step="1" value="32"><output data-nom-l></output></div>
  <div class="w-row"><label>India's excess inflation vs the US</label><input type="range" data-infl min="0" max="30" step="1" value="18"><output data-infl-l></output></div>
  <p class="w-big" data-reer></p>
  <div class="w-toggle" role="group" aria-label="Did India get less efficient?">
    <button type="button" data-eff="no" aria-pressed="true">We're just as efficient</button>
    <button type="button" data-eff="yes" aria-pressed="false">We got that much less efficient</button>
  </div>
  <p class="w-note" data-note></p>
</div>

Here's the arithmetic that trips people up. In nominal terms the rupee fell about 9% over nine years against the 2015 base — sounds like weakness. But in *real* terms, for most of that stretch we *appreciated* — by about 5%, and by about 8% while our earlier classes were running. Why? Because the RBI back then was a very different animal. It was obsessed with inflation — it would hold rates high on a food-inflation print, and high rates pull in money, and money in keeps the real rupee strong. Good for the prestige number; a quiet tax on every exporter. To fight it you'd have to buy dollars — build reserves the way China would have — and we chose not to, so we sat with a strong real rupee and a smaller reserve than the counterfactual. (There's no data on the counterfactual, so nobody notices the road not taken. I keep saying it: we could have built a $100bn sovereign fund and put it into US technology — take stakes, chase a technology transfer — instead of hoping the Google-types set up shop here. Anyway, coming back.)

That regime is over. Now the real rate has *fallen* to about 89 — a real depreciation of 11%. Our goods are roughly 11% cheaper than before.

## Have we become 11% less efficient?

That's the whole question, and it's an economics question, not a business-school one. If a cheaper rupee only reflected us becoming 11% worse at making things, there's no advantage — it just offsets. But is there any reason to believe India got 11% less efficient? None. If anything, more efficient. So the cheaper rupee is a genuine discount, and you should expect exactly what happened: exports pick up, goods *and* services.

Think of it as a discount from the investor's point of view. An Indian resort that peaked at 108 a year and a half ago is now available at 89 — and nothing about the resort got worse; if anything it improved. It's just cheap. Don't be surprised the buyers show up.

## The real prize isn't the export number — it's the spillover

Here's the objection I always get: exports get cheaper, imports get dearer, they cancel — what's the big deal? Fair. If it were only relative prices, it *would* be a wash.

The big deal is what exporting *does* to you. When you produce for outside India — where you're judged purely on quality and willingness to pay — you're forced to innovate, you pick up practices you wouldn't have otherwise, and the best part: you bring at least some of those practices home, because it's the same company. And once you adopt them, your domestic competitors are forced to adopt them too, or lose to you. That's the positive spillover, and it's the actual point of a cheap rupee — not the trade balance line item. (My Business Standard piece this week makes exactly this case: yes, imports get expensive, yes there's some pass-through inflation, but the prize is our firms learning to compete in world markets.)

## The other side of spillover: the borrower's stress test

Spillovers cut both ways, and I'll be honest about the one that worried me — because I sit on the board of a borrower, so this isn't abstract. Firms that borrowed in foreign currency and didn't hedge well (and hedging long-term is hard, and expensive) get hit when the rupee drops: their effective cost rises. If enough of them were big and unhedged, a financial institution could default, and then you have a crisis — the Southeast-Asian-crisis channel.

So I went to the data. Stress it yourself.

<div class="widget" id="s16-borrower">
  <p class="w-head">Model №3 — the unhedged borrower's stress test</p>
  <div class="w-row"><label>Sudden rupee depreciation</label><input type="range" data-dep min="0" max="25" step="1" value="11"><output data-dep-l></output></div>
  <div class="w-row"><label>Share of the loan hedged</label><input type="range" data-hedge min="0" max="100" step="5" value="30"><output data-hedge-l></output></div>
  <p class="w-big" data-cost></p>
  <p class="w-note" data-note></p>
</div>

The aggregate unhedged exposure is only about $550m, and most of it is long-term. I looked at the borrowers, at their margins: if their effective cost on foreign-currency borrowing goes up 30–50 basis points, a few names are pinched, but that's it. It does not look like a Southeast-Asian crisis. So I'll say plainly what changed: when I didn't know the *volume* of that cost, I gave the fear a lot of weight. Now that the numbers are in, the cost — while real — is smaller than the export benefit. That's my view today, and I'd rather revise on data than defend a prior.

The channel to respect is still the relationship one. Finance is relationship-specific: if a lender goes down, its *healthy* borrowers — who did nothing wrong — often can't just substitute another lender, and they go down too. That's the spillover to watch. It's just not where we are.

## FDI versus FII — who actually responds to a cheap rupee?

Now the sharpest thing in the session, and it explains the split from the top. FDI and FII do not think alike.

<div class="widget" id="s16-flows">
  <p class="w-head">Model №2 — who responds to a cheap rupee?</p>
  <div class="w-toggle" role="group" aria-label="Which kind of investor?">
    <button type="button" data-who="fdi" aria-pressed="true">You build things (FDI)</button>
    <button type="button" data-who="fii" aria-pressed="false">You chase prices (FII)</button>
  </div>
  <div class="w-row"><label>Rupee cheaper than 18 months ago</label><input type="range" data-cheap min="0" max="25" step="1" value="17"><output data-cheap-l></output></div>
  <p class="w-big" data-flow></p>
  <p class="w-note" data-note></p>
</div>

FDI runs the thought experiment: *if I set up a data centre in India right now, it's 15–20% cheaper than it was a year and a half ago — let me do it.* Someone thought that through and moved the money, which is why FDI is close to +$7bn in two and a half months when the whole of last year was $6.5bn. FII does no such arithmetic. It isn't pricing your data centre; it's chasing the Elon-Musk-types, the AI bet, the "as long as someone will buy from me at a higher price I'll buy" logic — a reason you can't model. So the cheap rupee doesn't pull it back. FDI turned up; FII stayed out. That dichotomy *is* the June data.

## What the RBI did — and why FCNR(B) was a desperate measure it didn't need

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"If you really want to support the rupee on the capital side, use forex reserves for volatility — that tool doesn't change. But this FCNR(B) is a desperate measure that is not required. And if you want to bring capital, make FDI capital gains exempt — they used the exemption tool, but for debt, not for equity. There is some inconsistency, I must admit."</p>
</div>

So here's the verdict. For plain volatility, the RBI already has the right tool — forex reserves — and nothing about that changes. What it should *not* do is chase hot money. FCNR(B) — relaxing terms to pull in foreign-currency deposits — is exactly that: a desperate reach for hot money, and it wasn't needed. If the goal was genuinely to attract capital, the clean move is to exempt capital gains for FDI and equity. They did use the exemption tool — but for *debt*, not equity. That's the inconsistency worth flagging.

## On volatility, and the Plaza lesson

Let me be careful about my own earlier worry, because it was about *speed*, not level. The level right now is fine. I'm not saying that when we reach 95–96 we should drag it back to 93–94; from here, let it drift 1.5–2% a year with the inflation differential — 96 to 97 to 98, slowly. What I feared was the *jolt* — going from 108 to 89 fast, because a sudden move is two prices at once, and that's what breaks unhedged balance sheets. A smooth path to the same place is harmless.

And do not treat the exchange rate as a prestige issue — read the Plaza Accord. Japan held the yen near 300 to the dollar at its peak and exported like crazy. The US got mad, pulled Japan, West Germany and the UK into a room at the Plaza Hotel in New York in 1985, and they agreed to cut the dollar by about 30% in one shot. Those currencies appreciated — and from there Japan's slide began. It limped on two or three more years, and then the whole thing collapsed. Volatility and vanity, not the level, did the damage.

## Should we crack down on LRS and retail outflows?

*Pranav asked:* retail investors are pouring into US and China markets — every other LinkedIn post is about it — will the government crack down on LRS soon?

My answer: no, and I hope not. We are not at the stage where we need to restrict outflows. Ease of doing business includes *ease of exit*, and one big reason the world keeps putting money into the US, however much people resent it, is liquidity — you can get out. We already have plenty of capital-account restrictions; tightening LRS further is problematic. China cracked down on money leaving via Hong Kong; that's their choice, not the one to copy. Can the government still do it? Yes, if FCNR(B) fails they might. Should they? No — and someone should write the article on why not. Five years from now, an FII may realise this is a market where it could enter *and* exit cleanly, and that ease of exit becomes a reason to bring money in. Don't block the exit to defend the rupee.

## The signal to watch next — the phase is changing

Here's the new thing, and it's the reason the export edge won't last forever. We had a rare window where essentially only India (and Indonesia) was depreciating. That window is closing. The Korean won has depreciated; the yen is now around 162; the dollar index is back to about 101, from 97. So even if the rupee keeps drifting *down* in nominal terms, the *real* rate can start to *appreciate* — because everyone else is getting cheaper too. When everybody depreciates, nobody has a discount, and the export benefit fades. That's the number to watch: not the daily ₹/$ headline, but the REER print relative to our trading partners.

## What you can now do

Read the next rupee headline properly. First, separate the current account (fine) from the capital account (where the story is). Second, translate the nominal number into the real rate — a fall to 89 is a discount, not a disaster, unless you truly believe we got 11% worse at making things. Third, watch the split that actually matters: FDI following cost back in, FII chasing AI back out. And fourth, remember the edge is relative — once Korea, Japan and the dollar move, our discount narrows. When the RBI reaches for hot money to prop the rupee, you'll know it's the one tool it didn't need. Onions setting the repo rate, a cheap rupee mistaken for a crisis — same reflex, and now you see past it.

<script src="{{ '/assets/js/s16-machines.js' | relative_url }}" defer></script>
