---
layout: post
title: "Borrowed Dollars, Printed Rupees"
dek: "The RBI opened a window in June expecting $40 billion. On 2 September it counted $136.4 billion. That money is not a gift — it is dollar debt, repayable in dollars, and paying for it released about ₹10 lakh crore of fresh rupees into a banking system with nowhere good to put them. The professor's verdict on the RBI: having done a bad thing, they have not yet done the worst thing. This session is about what they do next, and who pays."
date: 2026-09-06
session: 20
tags: [fcnr, rupee, rbi, liquidity, external-debt, vrrr, mss, india]
excerpt_override: "Session 20 — $127.2bn of FCNR(B) deposits, $136.4bn all in, against an RBI internal estimate of $80bn. Two doors on the dollars, three on the rupees, and a ₹10,31,465 crore absorption screen the RBI is now rolling over one night at a time. Five machines, a negative carry trade that costs about $3bn a year, and nine places where the class figures did not survive the check."
authors:
  - harsh
editors: []
description: "Prof. Tantri on the 2026 FCNR(B) swap window: $136.4bn raised against an $80bn expectation, external debt heading for ~$900bn, and the ₹10 lakh crore of reserve money the RBI created buying those dollars — with interactive models of the two forex doors, the LAF absorption screen, and the three ways of paying for it."
---

Here is the misconception this session exists to kill: **that money arriving is good news.** In June the rupee was at a record low, the RBI opened a window, and dollars came — not the $40 billion the market expected, not the $80 billion the RBI itself was working with, but **$136.4 billion**, most of it in the last three days. Every headline treated the overshoot as a triumph. It is not a triumph, and it is not really an inflow. It is a **loan**, denominated in dollars, repayable in dollars, three to five years out, at a rate India would not otherwise pay — and the act of accepting it printed roughly **₹10 lakh crore** of new rupees into a banking system that has nowhere sensible to lend them. The professor spent Sunday morning on it instead of China, and told us why in the first minute: *"there are people obsessed about GDP, whether it is 7.8 or something else. I think this is far more important."*

He is not neutral about it — he criticised the scheme publicly in June and [took a careful victory lap last session]({% post_url 2026-08-23-the-quiet-print-crisis-money-without-a-crisis %}) when the deadline was pulled forward. But the analysis is not a victory lap. It is a decision tree, and its most useful property is that **every branch is bad**. The question is only which bad, and who ends up holding it.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"Fortunately, they have not done the worst possible outcome. You should really, really appreciate that: having done a bad thing, they have not done the worst thing."</p>
</div>

## First, the vocabulary — because "the rupee fell" is not one claim

Before anything else he re-ran the [INFS point about what an exchange rate *is*]({% post_url 2026-04-01-rupee-real-effective-exchange-rate %}): a currency's exchange rate is against a **basket** of its trading partners, not against one currency. The dollar index is six currencies; India publishes a nominal effective rate and a real effective rate. "The price of the dollar" is the market convention, not the concept — and the two can point in opposite directions. Keep that separation; the whole argument about whether the rupee "needed defending" turns on it.

The number that started this: the rupee hit **96.96, its lifetime low, in May 2026** — and had already recovered to about **95.74** by 4 June, when the swap window was announced alongside the MPC. It trades near **94.46** today. Hold those three numbers. They will matter when we ask what the $136 billion actually bought.

## What the window was

On 5 June the RBI announced, and on 8 June operationalised, a scheme with an elegant hook: NRIs deposit dollars in an FCNR(B) account for **three to five years**, and the bank taking the deposit can swap those dollars with the RBI **at par** — the same rate on both legs — with the deposits also exempted from CRR and SLR, and the usual interest-rate ceiling lifted by [six amendment directions dated 17 June](https://website.rbi.org.in/web/rbi/notifications).

Read the "at par" slowly, because that is the entire subsidy. In a normal forward contract the rupee leg is priced at a premium over the dollar leg — roughly the interest differential, [which is what covered parity means]({% post_url 2026-01-11-exchange-rates-inflation-and-interest-rate-parity %}) — and that premium is currently worth about **2.5–3% a year**. The RBI waived it. So the depositor gets a dollar return of roughly **6–6.5%** at the large banks, up to ~7% at smaller ones, with **the currency risk carried by the central bank**. A country with higher inflation than the United States is *supposed* to see its currency depreciate against the dollar. This scheme promised the yield without the depreciation.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"Some of you may be NRIs. If you have not put money in, it's your fault. This is free money."</p>
</div>

And it behaved like free money. His estimate — offered as judgement, not data — is that **at least half of the deposits are themselves borrowed**: people levered into a risk-free spread. Indian banks were reportedly offering around 9× leverage against these deposits, foreign banks 19–29×. If that is even roughly right, it settles a question the optimists keep dodging: this money is not patient savings that might roll over. **It is a trade, and trades get closed.**

Watch how the expectation moved, because the professor's real instruction this week was methodological — *read the newspapers from June, not the histories that will be written in 2029*:

<div class="widget" id="s20-ledger">
  <p class="w-head">Model №1 — what they expected, what came, what it costs</p>
  <div class="w-toggle" role="group" aria-label="View">
    <button type="button" data-v="trail" aria-pressed="true">The expectation trail</button>
    <button type="button" data-v="ledger" aria-pressed="false">What actually came</button>
  </div>
  <div class="w-bars" data-rows></div>
  <div class="w-row"><label>Cost of carry assumed (deposit rate − Treasury yield)</label><input type="range" data-carry min="1" max="4" step="0.25" value="2.25"><output data-carry-l></output></div>
  <p class="w-big" data-verdict></p>
  <p class="w-note" data-note></p>
</div>

The RBI's own count, published **2 September**: FCNR(B) deposits **$127,226 million**, overseas foreign-currency borrowings **$5,260 million**, external commercial borrowings **$3,891 million** — **$136,377 million** all in, and marked *provisional, pending final reporting and reconciliation*. The class's "$127 billion and $136 billion" is exact. At ~94.5 to the dollar that is about **₹12.9 lakh crore**.

Two details from the plumbing that did not make it into class but sharpen the story. **ICICI Bank alone mobilised $17.88 billion.** And the RBI's **net short forward dollar position hit a record $136.77 billion at end-July**, with the over-one-year bucket jumping from $64.2bn to $91.5bn — the central bank's own balance sheet showing you exactly where the currency risk went.

## Door one on the dollars: sell them (not taken)

Now think physically, which is the method this course keeps returning to. Follow one dollar. It arrives by SWIFT into the nostro account of one of four or five large banks. That bank now owes an NRI ~6.25% a year for three to five years, and is holding a dollar it cannot lend in Chennai.

If the official story were true — that the rupee was facing a run and needed defending — the answer would be obvious: **let the bank sell the dollar.** Who buys? Importers, outward investors, and FIIs on their way out. And this is where the scheme collides with its own justification, because $136 billion of supply into a market that size does not "stabilise" a currency. It launches it. The professor's estimate: a 10–15% appreciation, taking the rupee from ~95 to **86–87**.

Slide it yourself:

<div class="widget" id="s20-doors">
  <p class="w-head">Model №2 — Door one: how much do you let the banks sell?</p>
  <div class="w-row"><label>Share of the $136bn sold into the forex market</label><input type="range" data-sell min="0" max="100" step="5" value="0"><output data-sell-l></output></div>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Forex reserves</span><div class="w-bar"><div class="w-bar-fill" data-bar-res></div></div><output data-res-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">External debt</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-debt></div></div><output data-debt-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Reserve cover of external debt</span><div class="w-bar"><div class="w-bar-fill" data-bar-cov></div></div><output data-cov-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Reserve money released at home</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-rup></div></div><output data-rup-l></output></div>
  </div>
  <p class="w-big" data-verdict></p>
  <p class="w-note" data-note></p>
</div>

Play with the extremes and you find the trap the whole session is built on: **the two costs are a see-saw.** Sell the dollars and you get a violent appreciation but no domestic liquidity problem. Keep the dollars and the rupee holds but you have printed the rupees to pay for them. There is no setting where both are quiet, because the money was always going to arrive as one or the other.

Four consequences he traced for the sell-everything branch, and they are worth having in order because each one is a live policy in its own right:

**One — the import-substitution agenda dies overnight.** At 86, imports get dramatically cheaper, gold included, and a large share of the inflow simply leaks straight back out as imports. Then you reach for tariffs and quality-control orders to stop it, and you invite retaliation. You would be using foreign borrowing to subsidise foreign production.

**Two — you accelerate the exit you were trying to stop.** This is the sharpest analytical point of the class, and it rests on a diagnosis he has repeated since June: *the FIIs are not fleeing.* Gross inflows are rising. What has changed is that money is going **home** — to the US, Korea, Japan — because home is where the AI capex boom is. It is a **net** problem, not a **gross** problem, exactly [as the balance-of-payments session taught you to read it]({% post_url 2026-06-21-reading-indias-balance-of-payments %}). And if that is the diagnosis, appreciation is precisely the wrong medicine: the FII sitting on ₹100 gets more dollars at 86 than at 95, so you have subsidised the exit.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"The motivation of FIIs is not that India is some banana republic that will close down tomorrow. It is not a Sri Lanka situation. They are moving money back because their own countries are doing well. We don't have a gross problem. We have a net problem."</p>
</div>

**Three — you kill the exporter in the month he finally recovered.** Goods exports had just risen for the first time in three or four months. Picture the exporter who spent the last quarter renegotiating dollar prices at 95, competing against Bangladesh, winning the contract on a discount he could afford — and who now collects those dollars at 86 while paying wages in rupees. Prices are sticky; he cannot reopen the contract. [The cheap-rupee session]({% post_url 2026-07-05-cheap-rupee-discount-not-crisis %}) argued that a weak rupee was a discount rather than a crisis. This is the same argument, running backwards, with borrowed money paying for it.

**Four — the safety ratio everyone quotes stops looking safe.** India's external debt was **$762.8 billion at end-March 2026** (20.8% of GDP), against reserves of about **$682 billion** in late May. Add the window and debt heads for roughly **$900 billion**. Keep the dollars in reserves and the cover ratio holds up. Sell them and reserves fall back toward $680bn against $900bn of debt — a visible deterioration in exactly the metric rating agencies and treasurers use, which then shows up in what every Indian borrower pays.

Which is a lot of damage for a benefit the professor thinks would have been temporary anyway: the fundamentals would not have changed, so the rupee drifts back toward 95 in due course — now with an extra $136 billion of debt attached.

<div class="ednote">
  <p class="ed-meta">Editor's note · the 2013 comparison, which is not a precedent</p>
  <p>The obvious retort is that India did exactly this in 2013 and it worked. Check the differences before you accept it. The 2013 window ran 4 September – 30 November and raised, in the RBI's own words, <strong>"in excess of US$ 34 billion"</strong> (the FCNR(B) leg was ~$26bn; the rest was banks' overseas borrowing) at a <strong>fixed 3.5% swap rate</strong> with a one-year lock-in — against a current-account deficit near 4.7% of GDP, a rupee that had fallen from the 50s to a record 68.36, and genuine outflows. The money was spent defending the currency, and the currency recovered. In 2026 the CAD is nothing like that, the outflow is a rotation to a booming US rather than a flight from India, and the money was <em>not</em> spent defending anything. Same instrument, opposite diagnosis. And this time there is no lock-in, and the tenor runs to five years.</p>
</div>

## Door two: what they actually did

They took the dollars. The RBI let perhaps $10–20 billion reach the market — the rupee firmed a couple of rupees off its low, and touched a ten-week high on 3 September — and bought the rest at the prevailing rate, so the exchange rate barely moved. The dollars went into short-dated US Treasuries. Reserves hit a record **$740.8 billion** in the week to 28 August, up **$11.5 billion in that week alone**.

The professor's verdict on this choice is genuinely positive, and it is worth registering because the rest of the session is not: **this was the better of two bad doors.** But notice what the transaction is, in the plumbing you learned in INFS. The bank hands dollars to the RBI. The RBI credits **reserves** to the bank's account — new central-bank money, created for the purpose. So:

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"The money that came from the US is going back to the US. This will not happen if you are facing a run."</p>
</div>

That sentence is the whole critique in fourteen words. A country under genuine currency pressure *spends* the dollars it raises. India parked them — which is the correct decision and simultaneously an admission that the emergency used to justify raising them did not exist.

And it is not free. Consolidate the balance sheet the way [Japan taught us to]({% post_url 2026-08-09-japans-debt-puzzle-the-sovereign-carry-trade %}) and the internal transfers cancel: what the RBI pays the bank in rupees is India paying India. What crosses the border is that **India pays about 6.25% on $136 billion to non-residents and earns about 3.9–4.1% on US Treasuries**. That gap — a spread of roughly 2.25 percentage points — is the real cost, and it is what your correspondent put to him in class:

<div class="wa-aside">
  <p class="wa-meta">In class</p>
  <p><strong>Harsh:</strong> "Prof, this is a negative carry trade of minus 3%."<br>
  <strong>Prof. Tantri:</strong> "Absolutely. That's the right way of putting it."</p>
</div>

Call it **$3 billion a year**, about ₹29,000 crore, and more once you price the depreciation the RBI has underwritten. The government's public line — that the RBI will *earn* 4% on the dollars — is true and irrelevant: it quotes one leg of a two-leg trade. Emkay's estimate of the cumulative indirect fiscal cost, working through years of smaller RBI dividends, runs to **"₹1 trillion-plus."**

Here is the part that should stay with you, though, because it is about how costs hide. This one will surface as a slightly smaller RBI dividend to the government, three years running. Nobody sees a counterfactual dividend. **A cost that appears as an absence is a cost that never gets debated** — and the professor was explicit that this political invisibility is a feature of the design, not an accident of it.

## The rupee side: read the screen yourself

Now the part the class was really about. Paying for those dollars released roughly **₹10 lakh crore** of reserve money into the banking system, and you can watch the RBI trying to mop it up every single morning. He put the RBI's *Money Market Operations* release on screen — go and find it yourself, it is published daily — and read it line by line. Here is that table, with what each row is actually telling you:

<div class="widget" id="s20-screen">
  <p class="w-head">Model №3 — the absorption screen, 3 September 2026</p>
  <div class="w-bars" data-rows></div>
  <p class="w-big" data-verdict></p>
  <p class="w-note" data-note></p>
</div>

Total absorbed: **₹10,31,465.50 crore**. Ten days earlier the daily figure was nearer ₹1 lakh crore. But the number that carries the argument is not the total — it is the **subscription rate**. On 1 September the RBI offered a seven-day auction for ₹6,00,000 crore and received **₹1,14,320 crore**. Both overnight auctions on 3 September were undersubscribed too: ₹6,00,000 crore notified against ₹5,18,742 accepted, and ₹1,50,000 against ₹34,652.

Banks are refusing to lock money away at ~5.24% for a week. Of course they are — they are paying about 6.25% for it.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"Banks are saying: why the hell should I lend you at 5% for seven days? This has become their <em>haalat</em> — every day they are trying to suck this money out for one day, because they are worried that banks will start lending it."</p>
</div>

So the RBI rolls it overnight, and has run **32 VRRR auctions between August and early September** to do it. The call rate has drifted to **4.93%, some 32 basis points below the policy rate** — the market telling you, in one number, that there is more money than there are places to put it. And the durable measure, the one that does not reset each morning: **net durable liquidity surplus of ₹8,05,736 crore as of 15 August.**

<div class="ednote">
  <p class="ed-meta">Editor's note · one row on that screen was misread in class</p>
  <p>The professor read three overnight VRRR auctions on 3 September: ₹5,18,000 crore, ₹34,000 crore, and "₹123 crore — I think they went really begging." The first two are right (₹5,18,742 and ₹34,652 crore). <strong>The ₹123 crore row is MSF, not a VRRR</strong> — it is the marginal standing facility at 5.50%, money the RBI <em>lent out</em>, the opposite direction. It is the smallest number on the page and it does not change a single conclusion, but if you are going to teach people to read a table for themselves, the table has to be read correctly. Everything else on that screen — the ₹10,31,465 total, the ₹2,35,571 crore in SDF, the failed seven-day auction, the ₹1,34,625 crore fifteen-day operation (auctioned 31 August, not in September), the ₹2,42,623 crore of outstanding term operations — checks out against the RBI release exactly.</p>
</div>

## What ₹10 lakh crore becomes if you leave it alone

Reserves are not loanable funds — banks do not lend reserves, they lend against them, and [loans create deposits]({% post_url 2025-10-19-the-keynesian-cross %}). So the question is what multiple this base supports. [Last session's arithmetic]({% post_url 2026-08-23-the-quiet-print-crisis-money-without-a-crisis %}) is the benchmark: about ₹5 lakh crore of extra reserves last year sat under roughly ₹41 lakh crore of money growth.

<div class="widget" id="s20-mult">
  <p class="w-head">Model №4 — ₹10 lakh crore of reserves, and the wall it meets</p>
  <div class="w-row"><label>Reserves left in the system</label><input type="range" data-res min="2" max="10" step="0.5" value="10"><output data-res-l></output></div>
  <div class="w-row"><label>Multiplier at work</label><input type="range" data-mul min="2" max="7" step="0.5" value="5"><output data-mul-l></output></div>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Credit this could support</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-imp></div></div><output data-imp-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">PFC's entire loan book, for scale</span><div class="w-bar"><div class="w-bar-fill" data-bar-pfc></div></div><output data-pfc-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">PFC's annual lending, for scale</span><div class="w-bar"><div class="w-bar-fill" data-bar-ann></div></div><output data-ann-l></output></div>
  </div>
  <p class="w-big" data-verdict></p>
  <p class="w-note" data-note></p>
</div>

And here the professor stopped being an academic and spoke as someone who spent nearly five years on the board of an infrastructure NBFC, because the standard reply to all of this is *"good, India needs investment."*

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"There are no opportunities, for God's sake. We are starved for lending opportunities — we don't have good borrowers to take ten thousand, twenty thousand, fifty thousand crores. PFC is the largest NBFC; our gross loan book is ₹5 lakh crore. We don't even lend one lakh crore a year. And these guys want us to lend fifty lakh crore."</p>
</div>

Sit with the scale problem, because it is the load-bearing claim of the session. If the largest infrastructure lender in the country deploys under ₹1 lakh crore a year, and the system has ₹10 lakh crore of base looking for a home, the money does not find good projects. **It finds worse borrowers.** That is not a moral failing of bankers; it is what a lending target does when the pipeline is empty. And what follows is a sequence this country has run before, in the order it always runs:

Banks get targets. Risk gets re-described rather than reduced — precisely the mechanism [twenty-three million Spanish loans showed you in Session 17]({% post_url 2026-07-19-cheap-money-and-the-risk-you-cannot-see %}). Loans create deposits, deposits flood in, and depositors lose bargaining power, so **real deposit rates fall** — which answers Lakshit's question in class about why banks have gone cold on ordinary Indian depositors. People save less and spend more. And prices move last: rents, then wages, then expectations.

The trap is the timing. **Year one looks excellent.** Credit growth, car sales, a GDP print nobody argues with. He reached for 2008–09 as the case study: growth of 9–10% on the old series while the world was collapsing, celebrated at the time, and the reckoning arriving years later as an 11.5–11.6% gross NPA ratio by March 2018, the IL&FS and DHFL collapses, and about **₹3.1 lakh crore** of public recapitalisation across FY17–FY21. The people who ran the policy were called visionaries. The people who paid were taxpayers, a decade later.

Which is why the election arithmetic is not a cynical aside but the actual forecasting problem. If you face state elections in February, the door that maximises your position in February is the door that does nothing.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"If you are going to face an election three months from now, this is what you should do. Who cares what will happen after three months? The effect will be super positive — credit growth will go up crazily, GDP may grow 11%."</p>
</div>

Your correspondent asked the obvious follow-up — so this ends in a bubble, and the cure later is worse than the cure now? His answer sharpened it: **the cure later is worse because expectations move in between.** India's underrated achievement of the last decade is that salary hikes and rents no longer carry an automatic 10% inflation assumption. Spend that anchor and you need a Volcker to get it back — growth at 2–3% for two or three years. Which is the entire reason [the Wage Watch]({{ '/wage-watch/' | relative_url }}) is asking about reservation wages rather than forecasts. On timing he was honest: Friedman's long and variable lags mean nobody can date it. *"Japan took twenty years. But India is not Japan, and it is never good practice to take a bet on that."*

## The three doors on the rupees — and who pays

<div class="widget" id="s20-pay">
  <p class="w-head">Model №5 — who ends up holding the cost?</p>
  <div class="w-toggle" role="group" aria-label="Choose the door">
    <button type="button" data-d="none" aria-pressed="true">Do nothing</button>
    <button type="button" data-d="crr" aria-pressed="false">Incremental CRR</button>
    <button type="button" data-d="mss" aria-pressed="false">MSS bonds</button>
  </div>
  <div class="w-row"><label>Reserves absorbed</label><input type="range" data-abs min="0" max="10.3" step="0.1" value="0"><output data-abs-l></output></div>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Cost to banks</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-bank></div></div><output data-bank-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Cost to the budget</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-gov></div></div><output data-gov-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Inflation risk left running</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-inf></div></div><output data-inf-l></output></div>
  </div>
  <p class="w-big" data-verdict></p>
  <p class="w-note" data-note></p>
</div>

**Door A — do nothing.** Keep rolling overnight auctions and hope. The professor's fear is that this is not a policy but a waiting game: bankers get tired of earning 5% on money costing 6.25%, and start lending. *"That is where the problem will start."* Cost to the exchequer today: zero. Cost later: the 2008 sequence above.

**Door B — a targeted incremental CRR.** Maneshwar's proposal in class, and a real instrument: require banks to hold the *incremental* reserves from this scheme as cash at the RBI, earning nothing. It must be targeted, because a bank that took no FCNR(B) money should not lose lending capacity for someone else's inflow — and it can be, because these reserves are traceable. The cost is precise and it lands in one place: reserves earn 5.00% in the standing deposit facility and 0% as CRR, while the bank still owes its depositor ~6.25% — so **the banks eat the full deposit cost, which on the whole $136 billion is roughly ₹90,000 crore a year.** (Price it only against the ₹10.3 lakh crore currently parked at the RBI and you get about ₹64,000 crore; Model 5 shows both, since the base you choose moves the answer by a third.) His objection is not that banks would fail; it is fairness and signal. They were leaned on to raise this money in the first place — mostly public-sector banks, under what he called phone banking — and telling them to absorb the loss now reads as a statement about the state's character to exactly the foreign institutional shareholders who own large slices of the private banks. *"You are giving a signal about your character."*

**Door C — MSS bonds, which is his recommendation.** The Market Stabilisation Scheme is a real, dormant instrument: the government issues bonds, banks buy them with the surplus reserves, the money moves to the government's account at the RBI — **and the government contractually may not spend it.** That last clause is the whole point. Ordinary G-secs would be deficit financing: the money re-enters through spending and you have achieved nothing. MSS is sterilisation with a lock on it.

Price it at ~7%, because you have to beat what banks are paying their depositors or they will lend instead. Absorb ₹8 lakh crore and you get: **~₹56,000 crore a year, about ₹1.68 lakh crore over three years.** That is roughly **1% of the Union Budget's ₹53.5 lakh crore**, about 0.16 percentage points of GDP a year on the deficit, and a debt stock addition of ~2.3% of GDP. Not catastrophic. Not small either — for scale, the entire PM-JAY health insurance allocation for 2026-27 is ₹9,500 crore.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class — the prescription</p>
  <p>"Take all the costs right away. Suffer now for the next six months. You have made a mistake — suffer, then be clean, and everything will be fine. Which no politician will agree to. Politicians postpone problems until it comes up to their neck, hoping some miracle will happen."</p>
</div>

He is candid that Door C works partly *because* nobody will notice. The precedent is demonetisation: in December 2016 the RBI raised the MSS ceiling from ₹30,000 crore to **₹6 lakh crore** to sterilise the deposit surge, and the operation unwound over the following months as people withdrew cash again. Ten years on, almost nobody arguing about demonetisation knows the sterilisation happened, let alone what it cost. This time the lock-in is three years rather than four months, which makes it more expensive and more certain.

One question from class deserves its own answer, since it is the one a sceptical reader will reach for: **won't the government just spend it before the state elections?** Under MSS, no — that is the instrument's entire design. To spend it the government would have to issue ordinary bonds instead, which is deficit financing, which is [what happened last year through state borrowing and RBI purchases]({% post_url 2026-08-23-the-quiet-print-crisis-money-without-a-crisis %}) — and which never required an FCNR(B) window in the first place. Your correspondent's follow-up, that this route also invites a ratings response and higher borrowing costs across the board, he agreed with immediately.

## What you can now do

**Watch for the tell, and know what it means.** If the RBI announces an incremental CRR or an MSS revival in the next few weeks, it has chosen to pay. If it keeps rolling overnight auctions into October, it has chosen to wait — and waiting is Door A whether or not anyone calls it that. He put the window at "a week or two."

**Add the FCNR leg to the ledger.** The standing assignment from Session 19 — track what they bring in against what they absorb — now has its biggest single entry. The [Money Printer]({{ '/macro-watch/#money-printer' | relative_url }}) gets a new dollar row (+$136.4bn), a new reserve row (+~₹10 lakh crore), and a daily absorption line from the money-market release. Reserve money that arrives through the *external* account spends exactly like reserve money that arrives through an OMO.

**Save the June–August newspaper trail while it is still findable.** This was his explicit instruction and it is the most transferable thing in the session. The estimates moved from $35–50bn at launch, to $60–70bn on 21 July, to a ~$90bn consensus by mid-August, against an internal RBI working figure of $80bn — and the actual print was $136.4bn. *"You should not read the newspapers that will come three or four years from now. This should be part of your lived experience."*

**And notice the second-order casualty.** From 1 September, ordinary FCNR(B) rates — the ones without a swap behind them — were cut to **2.95–3.50%** across HDFC, ICICI, SBI, PNB, Axis and Kotak. So an NRI is offered ~6.25% on the guaranteed product and ~3% on the unguaranteed one. The professor's read: you have taught a generation of depositors that this channel is only worth using when it is subsidised. *"When you need this, they will not come back that easily."*

Next session: open market operations — the door he ran out of time for — and the Acharya–Rajan work on why central-bank balance sheets are so much easier to expand than to shrink. Then, finally, back to Japan and China.

<div class="ednote">
  <p class="ed-meta">Editor's note · the numbers, audited</p>
  <p>Class figures against the published record. <strong>What held up exactly:</strong> the inflow ($127.2bn FCNR(B), $136.4bn total — RBI, 2 September, provisional); the ₹10,31,465 crore absorption total and its components; the failed seven-day auction (₹6,00,000 crore notified, ₹1,14,320 accepted); the 2016 MSS ceiling of ₹6 lakh crore; FY26 nominal GDP at ₹346.36 lakh crore; the deadline pulled from 30 September to 31 August; the ~3% cut to ordinary FCNR(B) rates.</p>
  <p><strong>What did not.</strong> <em>The SDF is 5.00%, not 4.75%</em> — the corridor is 5.00 / 5.25 / 5.50, and the RBI's own table on the screen he was reading prints it. <em>The ₹123 crore row is MSF, not a third VRRR.</em> <em>Reserves are $740.8bn (28 August) against $682.3bn (29 May)</em>, not the $747–750bn and $650–670bn quoted — so the scheme-era gain is about $58bn, not $80–100bn. <em>External debt of ~$900bn is arithmetic, not a publication</em>: the last release is $762.8bn at end-March 2026, and the quarter that will contain this window is not out until late September. Government external debt is ~$168bn (22% of the total), not ~$150bn. <em>The MSS was created in March 2004</em>, not 1998 — 1998 was the Resurgent India Bonds. <em>Incremental CRR was not a COVID measure</em>; the RBI <em>cut</em> the CRR to 3% in March 2020. The real episodes are November 2016 and August 2023. The 2013 window raised $34bn in total (~$26bn of it FCNR(B)), not $25bn. Peak gross NPAs were 11.5–11.6% in March 2018 and recapitalisation ran to about ₹3.1 lakh crore over FY17–FY21, not ₹3.5. The Union Budget for 2026-27 is ₹53.5 lakh crore, not ₹55. Ayushman Bharat is ₹9,500 crore for PM-JAY (₹14,620 crore for the full umbrella, which is presumably what he meant). And the rupee's record low of 96.96 was set in <em>May</em>, not June.</p>
  <p><strong>One claim we could not verify at all.</strong> That the post-demonetisation MSS cost the budget "around ₹5,000 crore" in interest. The figure circulating online traces to a 2017 book, not to an RBI or ministry publication. What the RBI <em>does</em> report for that year is a ₹8,925 crore deterioration in net domestic income driven by interest paid absorbing surplus liquidity, and a surplus transfer to the government that fell to ₹30,659 crore from ₹65,876 crore. Use those; they are sourced, larger, and make the same point.</p>
  <p><strong>And one claim the evidence contradicts.</strong> That peer currencies came through 2026 unscathed without such a scheme — "Indonesia did none of this and did not collapse." Year to date the Philippine peso is down about 6.3%, the rupee 5.8%, the rupiah 5.2% and the baht 4.9%; only the won and the ringgit are up, on semiconductor and AI export strength. Bank Indonesia meanwhile hiked twice and, from May, required documentary justification for FX purchases above $25,000 a month — de facto rationing. The common driver across all of them is an oil shock hitting energy importers plus rising US yields. The rupee's path in 2026 looks like its neighbours', with or without the window — which weakens the case for the scheme <em>and</em> the case that the scheme is why the rupee held.</p>
</div>

<div class="ednote">
  <p class="ed-meta">Editor's note · the paper for next session, cited properly</p>
  <p>The "ratchet effect" work is <strong>Acharya, Chauhan, Rajan and Steffen, "Liquidity Dependence and the Waxing and Waning of Central Bank Balance Sheets"</strong> (<a href="https://www.nber.org/papers/w31050">NBER Working Paper 31050</a>, March 2023, revised December 2024; first presented at Jackson Hole in August 2022 as "Liquidity Dependence: Why Shrinking Central Bank Balance Sheets is an Uphill Task"). Four authors, not two — and the word "ratchet" is not in the title; it comes from secondary coverage. Do not confuse it with the related but distinct Acharya–Rajan paper, <a href="https://www.nber.org/papers/w29680">"Liquidity, Liquidity Everywhere, Not a Drop to Use"</a> (NBER 29680, 2022; <em>Journal of Finance</em> 79(5), 2024), which is the theory of why flooding banks with reserves may not expand system liquidity. The mechanism the professor described in class — reserves beget short-term claims against them, which makes shrinking destabilising — is the four-author paper. There is no India-specific version of it; that gap is arguably the paper somebody in this room should write.</p>
</div>

<div class="ednote">
  <p class="ed-meta">Editor's note · on the politics</p>
  <p>The session included some pointed remarks about the incentives of politicians of every stripe and about the quality of parliamentary scrutiny. We have kept the analytical claim — that an election calendar rewards deferral, and that a cost appearing as a smaller central-bank dividend is a cost nobody debates — and left the party-political jabs in the room where they were made. The argument does not need them, and it applies to any government facing any election.</p>
</div>

## Sources

- Prof. Tantri, Session 20 (6 September 2026) — quotes verbatim from the session transcript.
- RBI: [FCNR(B) / ECB / OFCB inflows under the swap window, press release of 2 September 2026](https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63502) · [Money Market Operations as on 3 September 2026](https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63511) · [seven-day VRRR auction result, 1 September](https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63487) · [Weekly Statistical Supplement](https://website.rbi.org.in/web/rbi/publications/weekly-statistical-supplement) · [press releases](https://website.rbi.org.in/web/rbi/press-releases).
- External debt: [India's external debt at end-March 2026 — $762.8bn](https://www.business-standard.com/finance/news/india-s-external-debt-rises-to-762-8-bn-at-end-march-2026-rbi-data-126062900940_1.html); [composition and the government/private split](https://aninews.in/news/business/private-sector-drives-rise-in-indias-external-debt-as-government-debt-declines-rbi20260630114905/).
- The window as it happened: [strong response prompts $60–70bn forecasts, 21 July](https://www.business-standard.com/amp/industry/banking/strong-response-to-rbi-s-swap-scheme-prompts-60-70-bn-inflow-forecasts-126072101147_1.html) · [why it was closed early, with the leverage and hedging-cost detail, 17 August](https://www.businesstoday.in/india/story/rbis-fcnr-b-swap-window-saw-strong-inflows-why-then-was-it-closed-early-549630-2026-08-17) · [the deadline change, 17 August](https://www.business-standard.com/finance/news/rbi-fcnr-b-window-nri-dollar-swap-deposit-scheme-deadline-forex-126081700609_1.html) · [ordinary FCNR(B) rates cut from 1 September](https://www.businesstoday.in/personal-finance/story/major-banks-slash-fcnr-deposit-rates-from-september-1-hdfc-bank-sbi-pnb-axis-bank-rates-compared-552992-2026-09-03).
- Liquidity: [RBI absorbs ₹6.02 trillion via VRRR amid record surplus, 4 September](https://www.business-standard.com/finance/news/rbi-absorbs-6-02-trillion-via-vrrr-auctions-amid-record-liquidity-surplus-126090400786_1.html) · [the August MPC that left the corridor at 5.00/5.25/5.50](https://www.business-standard.com/finance/news/rbi-mpc-meet-august-repo-rate-governor-sanjay-malhotra-inflation-growth-gdp-126080500231_1.html).
- Precedents: [MSS memorandum of understanding, 25 March 2004](https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=9886) · [MSS ceiling raised to ₹6 lakh crore, 2 December 2016](https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=38766) · [incremental CRR, November 2016](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=10744&Mode=0) and [its withdrawal, 7 December 2016](https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=38819) · [the 10% incremental CRR of August 2023 and its phased exit](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=56336) · [the 2013 swap window, RBI Annual Report 2013-14](https://www.rbi.org.in/Scripts/AnnualReportPublications.aspx?Id=1120) · [gross NPAs at 11.6% in March 2018, RBI Financial Stability Report](https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/0FSR_JUNE2018A3526EF7DC8640539C1420D256A470FC.PDF) · [PSB recapitalisation of ₹3.12 lakh crore, Ministry of Finance](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1578985&reg=3&lang=2).
- Macro anchors: [FY26 nominal GDP ₹346.36 lakh crore, MoSPI provisional estimates](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2269286&reg=48&lang=1) · [Union Budget 2026-27 highlights](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2221455&lang=1&reg=3) · [PM-JAY allocation](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2221616&reg=48&lang=2) · [US Treasury par yield curve](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve) · [Fed H.10 exchange rates](https://www.federalreserve.gov/releases/h10/current/).
- Prior sessions linked throughout: [the quiet print]({% post_url 2026-08-23-the-quiet-print-crisis-money-without-a-crisis %}), [Japan's debt puzzle]({% post_url 2026-08-09-japans-debt-puzzle-the-sovereign-carry-trade %}), [cheap money and unseen risk]({% post_url 2026-07-19-cheap-money-and-the-risk-you-cannot-see %}), [the cheap rupee]({% post_url 2026-07-05-cheap-rupee-discount-not-crisis %}), [reading the balance of payments]({% post_url 2026-06-21-reading-indias-balance-of-payments %}), [interest-rate parity]({% post_url 2026-01-11-exchange-rates-inflation-and-interest-rate-parity %}), [the real effective exchange rate]({% post_url 2026-04-01-rupee-real-effective-exchange-rate %}).

<script src="{{ '/assets/js/s20-machines.js' | relative_url }}" defer></script>
