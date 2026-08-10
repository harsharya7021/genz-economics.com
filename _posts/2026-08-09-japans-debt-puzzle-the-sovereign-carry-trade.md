---
layout: post
title: "Japan's Debt Puzzle: The Government That Ran a Carry Trade"
dek: "Japan owes twice its GDP and never blew up. The answer is not discipline — it is a $2 trillion carry trade run by the state itself: borrow at 0% from your own printing press, buy the world's risky assets, and pray the market never asks to be paid for the risk. For fifteen years, it didn't ask. It is asking now."
date: 2026-08-09
session: 18
tags: [japan, carry-trade, sovereign-debt, debt-sustainability, international-finance]
excerpt_override: "Session 18 — the 200% debt puzzle solved on one consolidated balance sheet: print at zero, buy foreign equities, earn ~6% of GDP a year, and let the winnings hide every deficit. Five machines to play with — the balance sheet, the sovereign carry, the Modigliani–Miller world-switch, the duration seesaw, the deficit doctor — plus editor's notes on the July 31 joint yen intervention."
authors:
  - harsh
editors: []
description: "Chien, Du & Lustig's JEP paper on Japan's sovereign wealth fund from borrowed money, as taught by Prof. Tantri — the consolidated balance sheet, the sovereign carry trade, duration, and the primary deficit, with interactive models."
---

Here is the misconception this session exists to kill: *Japan proves that debt doesn't matter.* You have heard the argument — Japan has run **200%+ debt-to-GDP** for two decades, never defaulted, never paid high interest, never saw inflation; therefore deficit hawks are hysterics. Every fiscal-sustainability seminar on earth has someone in the back row asking, with a smile, *"what about Japan?"* This session answers that question properly — and the answer should worry you far more than a default would. Japan didn't repeal the laws of finance. It ran a **levered bet** so large, so long, and so lucky that the laws looked repealed. Every piece of that bet is now reversing on live television.

We were scheduled — for the fourth session running — to start long-term growth. The news intervened again: the yen collapsed to ~160 to the dollar, and on **31 July the United States joined Japan in buying yen**, the first joint intervention since 1998. Why does Washington spend money propping up someone else's currency? Because Japan's public sector owns roughly **$2 trillion of foreign assets** — over **$1.2 trillion of it US Treasuries** — and a Japan forced to defend the yen alone raises the money by *selling those Treasuries*, which means higher US mortgage rates in an election-adjacent economy. Prime Minister Takaichi, who wants to spend big at home, understands the leverage perfectly. To understand any of this, you need one paper.

The paper is **Chien, Du and Lustig, "Japan's Debt Puzzle: Sovereign Wealth Fund from Borrowed Money"** — [Journal of Economic Perspectives, Fall 2025](https://www.aeaweb.org/articles?id=10.1257/jep.20251452), free to read. The class's standing recommendation stands: if you have to explain the world to clients, make JEP a habit — it compresses real research into essays a consultant can actually use. And note the vintage: the paper is a **diary, not a post-mortem**. It was written before the current blow-up, predicting the mechanism. Diaries outrank histories; everyone is intelligent after the fact.

## The puzzle, in three numbers

First, vocabulary: **"general government"** means centre + states + municipalities together. India's general-government debt is ~**81–86%** of GDP (the centre alone ~56%). The US is at **~120–130%**, and everyone is writing end-of-the-world columns. Japan is at **200%+** — gross figures now run ~230–235%.

At that level the textbook makes three predictions: interest rates spiral, default eventually arrives, and if you print your way out, inflation does. For twenty-five years Japan produced none of the three — bonds at 0.25%, no missed payment, zero inflation. **What made the debt sustainable? And can other countries — can India — copy the trick?** That is the paper's question. The answer starts with a balance sheet nobody had bothered to build.

## One balance sheet for the whole state

Government is not just the finance ministry. If a bank is owned by the state, it *is* the state — when it fails, the state pays. SBI is government. LIC is government. The RBI is government. Japan's equivalents — the Bank of Japan, the **GPIF** (the world's largest pension fund), Japan Post (once the world's largest deposit-taker), the public financial institutions — are all the same borrower wearing different name-tags. The paper's first contribution is simply to **merge every entity the Japanese state controls into one consolidated balance sheet**, netting out what they owe each other. Flip through the three snapshots — 1997 (when the trouble began), 2012 (Abenomics — the year Japan industrialised the trick), and 2024 (the paper's data):

<div class="widget" id="s18-balance">
  <p class="w-head">Model №1 — the consolidated balance sheet of Japan Inc.</p>
  <div class="w-toggle" role="group" aria-label="Which year?">
    <button type="button" data-y="0" aria-pressed="true">1997</button>
    <button type="button" data-y="1" aria-pressed="false">2012 · Abenomics</button>
    <button type="button" data-y="2" aria-pressed="false">2024 · the paper</button>
  </div>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Foreign securities</span><div class="w-bar"><div class="w-bar-fill" data-bar-fx></div></div><output data-fx-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Domestic equities</span><div class="w-bar"><div class="w-bar-fill" data-bar-eq></div></div><output data-eq-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Printed money (reserves)</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-pm></div></div><output data-pm-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Market-rate borrowing</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-mkt></div></div><output data-mkt-l></output></div>
  </div>
  <p class="w-big" data-net></p>
  <p class="w-note" data-note></p>
</div>

Read the 1997→2024 change as one sentence: **risky assets up ~80 points of GDP; printed-money funding up ~80 points of GDP.** Same trade, seen from both sides of the balance sheet. The asset side of the Japanese state stopped looking like a government and started looking like a hedge fund — ~60% of GDP in (mostly unhedged) foreign securities, ~40% in domestic equities. No arm of the Indian state holds foreign equity worth mentioning; the RBI's reserves sit in foreign *bonds* and gold. Nothing else on earth looks like this.

And the funding? **Bank reserves** — the money the central bank creates when it buys government bonds. Two things make reserves the perfect fuel: the interest they pay is set by the **central bank itself, not by any market**, and Japan set it at ~0%; and as long as inflation stays away, you can expand them almost without limit. Between 2012 and 2024 that gold bar in the model goes from ~10% of GDP to **~90%**. Japan migrated its funding from the market's price to its own price.

## The machine, in five steps

Why build such a thing? Because Japan's problem started with **society, not finance**. Fertility fell below replacement in the early 1970s — among the earliest anywhere — and by the 1990s the pension, health and social-security bills were enormous. A normal government pays those bills from the budget. Japan built a machine instead: **(1)** borrow short and nearly free at home, via printed reserves; **(2)** send the nation's real resources — taxes, pension contributions, postal savings — abroad, into equities and long bonds; **(3)** when a pension claim arrives, don't touch the portfolio — *print and pay*; **(4)** collect the spread: assets earned ~5–6%, funding cost ~0, generating roughly **6% of GDP every single year** against a deficit of ~5%; **(5)** because the books balanced, nobody panicked, so the funding stayed at zero, so the machine kept running.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"You have a dedicated pension fund. You have a dedicated social security fund. When a claim comes, you are supposed to pay out of that fund. But you're not disturbing that fund — instead you are printing money and paying. Why? Because these funds are invested in extremely risky assets which are right now giving very high returns — and the market is not punishing you for that risk."</p>
</div>

The class analogy: a bank that funds itself entirely with savings-account money and lends it all to 25-year power projects. Profitable every quarter — until the day it isn't. Japan did this as a country, and skipped the power projects for **equities**. The pension funds stopped being pension funds and became **sovereign wealth funds — built from borrowed money**. That is the paper's title, and it is not a metaphor.

## The biggest carry trader on earth was not a hedge fund

You know the yen carry trade from [the parity session]({% post_url 2026-01-11-exchange-rates-inflation-and-interest-rate-parity %}): borrow at Japan's ~0%, invest at America's ~5%, and pocket the gap — which **uncovered interest parity says you shouldn't be able to do**, because the interest gap mostly reflects the inflation gap, so the dollar should depreciate against the yen by roughly the difference and eat your spread. That is the theory. Run it:

<div class="widget" id="s18-carry">
  <p class="w-head">Model №2 — ¥10,000 does the round trip</p>
  <div class="w-row"><label>Borrow in Tokyo at</label><input type="range" data-jp min="0" max="2" step="0.1" value="0.1"><output data-jp-l></output></div>
  <div class="w-row"><label>Invest abroad at</label><input type="range" data-us min="2" max="8" step="0.25" value="5"><output data-us-l></output></div>
  <div class="w-toggle" role="group" aria-label="Which world?">
    <button type="button" data-u="uip" aria-pressed="true">The world UIP promises</button>
    <button type="button" data-u="real" aria-pressed="false">The world 2013–2023 delivered</button>
  </div>
  <div class="w-row" data-fx-row><label>Yen move per year</label><input type="range" data-fxm min="-6" max="6" step="0.5" value="0"><output data-fxm-l></output></div>
  <p class="w-big" data-pl></p>
  <p class="w-note" data-note></p>
</div>

For years the yen simply refused the script — flat, or weaker. The trade paid like a fixed deposit, and the world's traders piled in. But here is the class's point, and it is the one to repeat in your industry forums:

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"The so-called carry trade done by private players is twenty, thirty billion dollars. This carry trade done by Japan itself is two trillion dollars. Even if you don't get the idea of carry trade very well, you should get this point — the Japanese government itself was doing a carry trade of two trillion dollars."</p>
</div>

The whale was the sovereign. And a whale cannot leave the pond quietly — which is precisely why the US now helps prop up the yen rather than watch Tokyo raise dollars by dumping Treasuries. When you hear "carry trade unwind" on television, remember who holds the position that actually matters.

## The part that should have been impossible

Now bring in what [corporate finance]({% post_url 2025-07-08-fifty-takeaways-corporate-finance %}) taught you. In a Modigliani–Miller world you **cannot create value by taking more risk**: investors see the risky assets, raise your discount rate exactly enough to offset the extra expected cash flow, and the trade is stillborn. Lenders should have looked at Japan's balance sheet, seen the equities, and priced the debt like the levered equity fund it was. If you scored full marks in that course, your instinct is that Model №1 cannot exist. Test the instinct — same machine, two universes:

<div class="widget" id="s18-mm">
  <p class="w-head">Model №3 — run Abenomics 2012→2024, in two universes</p>
  <div class="w-row"><label>Risky assets (% of GDP)</label><input type="range" data-alloc min="0" max="120" step="10" value="100"><output data-alloc-l></output></div>
  <div class="w-row"><label>What the bet returns, per year</label><input type="range" data-ret min="-2" max="10" step="0.5" value="8"><output data-ret-l></output></div>
  <div class="w-toggle" role="group" aria-label="Which universe?">
    <button type="button" data-univ="real" aria-pressed="true">The real world (funding at 0%)</button>
    <button type="button" data-univ="mm" aria-pressed="false">The Modigliani–Miller world</button>
  </div>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Your net debt, 2024</span><div class="w-bar"><div class="w-bar-fill" data-bar-you></div></div><output data-you-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Never-traded Japan</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-base></div></div><output data-base-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">What actually happened</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-hist></div></div><output data-hist-l></output></div>
  </div>
  <p class="w-big" data-out></p>
  <p class="w-note" data-note></p>
</div>

Sit with the real-world result: between 2012 and 2024 Japan ran a deficit **every single year**, gross debt kept climbing — and **net** debt *fell*, from ~117% of GDP to ~77%, because the asset side inflated. (The paper's counterfactual: without the risky-asset gains, net liabilities cross **180%**.) The books balanced themselves. That is why nothing looked wrong.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"My favourite example — if you win the Russian roulette, even if you make money, it won't be valued very high, because markets know that next time you may not be able to win it. People may die. This is the whole idea."</p>
</div>

Markets are supposed to price the revolver, not the lucky streak. For fifteen years, in Japan's case, they priced the streak. That is the sentence at the centre of the whole session — *"discount rates do not exist that well"* — and it cuts in every direction at once. It is why the machine worked; it is why politicians love postponable risk (the punishment lands after the retirement party); and it is why you should distrust half the risk reports you will read in your career:

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"One question you should ask — is your risk measure based on some theory, or based on market prices? If the market price itself fails to account for risk, any risk measure based on market prices will understate risk. It does not mean that risk has disappeared."</p>
</div>

The textbook was wrong about timing, never about the truth. MM couldn't tell you *when* the bill would arrive — but it told you all along **where the risk was hiding**: on the asset side, unpriced by the funding side. Which brings us to the two terms you need before next class, because next class is where the bill gets itemised.

## Term one: the primary deficit

**Fiscal deficit** counts all spending, including interest on old debt. **Primary deficit** strips the interest out — and it is the number that decides whether debt is self-sustaining or self-compounding. Revenue 100, non-interest spending 97: you have a primary *surplus* of 3, and even if a headline fiscal deficit persists, you are paying debt *down*. Revenue 100, spending 103: you cannot cover running costs before interest, so you are **borrowing to pay interest on borrowing** — debt compounds against you.

<div class="widget" id="s18-deficit">
  <p class="w-head">Model №4 — the deficit doctor (revenue fixed at 100)</p>
  <div class="w-row"><label>Spending, excl. interest</label><input type="range" data-spend min="90" max="112" step="0.5" value="103"><output data-spend-l></output></div>
  <div class="w-row"><label>Interest on old debt</label><input type="range" data-int min="0" max="8" step="0.5" value="4"><output data-int-l></output></div>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Fiscal balance</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-fis></div></div><output data-fis-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Primary balance</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-pri></div></div><output data-pri-l></output></div>
  </div>
  <p class="w-big" data-verdict></p>
  <p class="w-note" data-note></p>
</div>

Japan ran a primary deficit **every year of this story**. The carry gains papered over it. Hold both facts at once and you understand why the professor calls the primary number, not the headline, the true test of sustainability.

## Term two: duration

Duration is **not** the bond's tenure. It is the value-weighted **average arrival time of your money**. A 10-year zero-coupon bond pays everything at the end: duration = 10 = tenure. A 10-year coupon bond dribbles cash from year one: the average arrival is earlier, duration < 10. Why care? Because — the theorem arrives formally next class — **duration measures interest-rate sensitivity**. Same tenure, different duration, different pain:

<div class="widget" id="s18-duration">
  <p class="w-head">Model №5 — the duration seesaw (yield 3%)</p>
  <div class="w-row"><label>Maturity (both bonds)</label><input type="range" data-mat min="2" max="30" step="1" value="10"><output data-mat-l></output></div>
  <div class="w-row"><label>Bond B's coupon</label><input type="range" data-cpn min="0" max="12" step="1" value="8"><output data-cpn-l></output></div>
  <div class="w-row"><label>Shock rates by</label><input type="range" data-shk min="-2" max="2" step="0.5" value="1"><output data-shk-l></output></div>
  <p class="w-big" data-durs></p>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Zero-coupon price</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-za></div></div><output data-za-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Coupon-bond price</span><div class="w-bar"><div class="w-bar-fill" data-bar-zb></div></div><output data-zb-l></output></div>
  </div>
  <p class="w-note" data-note></p>
</div>

Now pre-load next class's punchline. Japan's **liabilities** are floating-rate overnight reserves — duration ≈ **0**; they reprice the day the BoJ hikes. Japan's **assets** are equities and long bonds — duration measured in **decades** (the paper's estimate for equities at current valuations: ~75 years). The consolidated Japanese state is the savings-account-funded power-project bank, at national scale, with the mismatch running to hundreds of points of GDP. *Where exactly the unpriced risk sat, and why rising rates detonate it — that is next class.*

## The reversal, live

Every condition the machine needed is flipping at once. Inflation is back, so the printing is no longer free. The BoJ's policy rate — paid instantly on ~90%-of-GDP of floating reserves — is at **1.0%, the highest since 1995**. The 10-year JGB is above **2%** for the first time in two decades; the 30-year is near **4%**; bond investors — the Apollos and BlackRocks, as the class put it — finally charge for the risk. The yen is at ~**160**. And the spread that balanced the budget is dying: a government built to *earn ~6 and pay ~0* now pays 1% on reserves and ~4% at the long end while praying its assets keep performing. Shrinking spread → deficits reappear → more printing → more inflation → lenders demand more. The loop that fed itself upward for fifteen years now feeds on itself downward. **The paper wrote this sequence down before it happened.**

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"Some of us who grew up between 2000 and 2020 were extraordinarily lucky — we were in a period when markets did not punish risk. You are going to pay for all the risk that we took. Your twenty years is not going to be as easy as our twenty years — and once markets realise they underestimated risk, they overestimate it. They go from one extreme to another."</p>
</div>

The one genuine escape hatch, stated in class with care: **AI**. If it delivers an internet-sized productivity bump (+0.5%), the bills arrive on schedule. If it delivers an electricity-sized one, GDP — the denominator under every ratio in this session — grows fast enough to forgive everything. That is explicitly the bet the Fed under Kevin Warsh is making by not hiking harder. Your career sits inside that trade. Not the end of the world, either way — a repricing, and repricings reward the people who understood the original mispricing.

## What you can now do

**If you advise anyone with Japan exposure** — currencies, rates, equities — you now know why Japanese yields can rise *without* strong growth, why the yen can weaken *while* rates rise, and why "Japan proves debt doesn't matter" was survivorship bias all along. This mechanism is barely understood in industry; presenting this paper at your firm's knowledge forum is the cheapest way to look prescient this quarter.

**If you read risk reports** — ask the question the class gave you: is the measure built on theory, or on market prices? Mispriced markets make risk *measures* fall exactly while risk rises. Japan is now the canonical example.

**If you want the publishable project** — build the **consolidated balance sheet of the Indian state**: centre + states + RBI + PSU banks + LIC + EPFO + PSUs, netted of cross-holdings. It does not exist, and the professor has offered — on the record, no co-authorship demanded — to help whoever builds it get it published. Prediction of what you'd find: heavy domestic lending, reserves in foreign bonds and gold, essentially zero foreign equity — the mirror image of Japan. Then ask Japan's questions of it. (Small print you'll need: Indian state governments cannot borrow abroad — no sovereign guarantee — but PSUs can and do at near-sovereign rates, which is the implicit-guarantee point in miniature: on a consolidated sheet, it is all the same borrower.)

**And read the paper before next class** — it is open access, and the second half is the authors warning, in real time, about exactly the reversal now underway.

<div class="ednote">
  <p class="ed-meta">Editor's note · the paper, and the smirk that started it</p>
  <p>Full citation: YiLi Chien (St. Louis Fed), Wenxin Du (Harvard Business School) and Hanno Lustig (Stanford GSB), <a href="https://www.aeaweb.org/articles?id=10.1257/jep.20251452">"Japan's Debt Puzzle: Sovereign Wealth Fund from Borrowed Money,"</a> <em>Journal of Economic Perspectives</em> 39(4), Fall 2025, 3–26 — it grew out of Chien, Cole &amp; Lustig, <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4620159">"What About Japan?"</a> (NBER WP 31850), which was the professor's assignment paper last year. Lustig's own origin story: every US fiscal-sustainability seminar featured an economist in the back row asking, with a smile, <em>"what about Japan?"</em> — and he got annoyed enough at having no sharp answer that he built one. The JEP version adds the question hanging over everything above: could the <em>US</em> run Japan's trade? The authors' answer: it is unlikely to want to — the risks land on bondholders, depositors and taxpayers. Numbers note: class figures follow the JEP table (data to 2024): foreign securities 7.5 → 29 → 60% of GDP, domestic equities ~11 → ~40, reserves ~10 → ~90, total liabilities 159 → 248 → 270, net 24 → ~117 → 77; the 2023-vintage companion paper reads a shade lower throughout. The excess return: ~4.7% a year above funding costs, 2013–2023 — about 6% of GDP per year, roughly Japan's defence and education budgets combined.</p>
</div>

<div class="ednote">
  <p class="ed-meta">Editor's note · who actually holds the portfolio — and the BoJ's accidental hedge-fund book</p>
  <p>The vehicles behind Model №1's asset side: the <strong>GPIF</strong> (~$1.87 trillion, the world's largest pension pool — half in equities since it doubled its target weight in 2014), Japan Post, the public financial institutions — and, remarkably, the <strong>Bank of Japan itself, which owns ~¥83 trillion of equity ETFs (~$530bn, roughly 7% of the entire Tokyo Stock Exchange)</strong>, bought as "monetary policy" from 2010 on, now sitting on unrealised gains of ~124% of cost. At the disposal pace it announced in September 2025, the exit takes over a century. Once you see the state as a leveraged equity investor, apparently unrelated policies snap into focus — the Tokyo Stock Exchange's famous 2023 "raise your stock price" directive to listed firms is not corporate housekeeping; when the state owns this much of the market, <em>higher share prices are fiscal policy</em>. Prequel for completists: before reserves, the cheap-funding pipe was <strong>FILP</strong> — households → postal savings → Ministry of Finance → directed lending, a "second budget" whose loan book passed 100% of GDP in 2001, dismantled by reform that year. QE reserves are FILP's successor: one polite financial repression replacing another.</p>
</div>

<div class="ednote">
  <p class="ed-meta">Editor's note · the week the creditor's threat went live</p>
  <p>Dating the news peg, because it will be an exam question someday. The yen touched ~162/$ on 30 June 2026 — its weakest since December 1986. On <strong>31 July 2026</strong> Japan and the US executed the first <em>joint</em> yen-buying intervention since 1998, confirmed by Treasury Secretary Bessent and run through the New York Fed's dealer banks; the reporting was explicit that Washington joined to stop Tokyo from raising defence-of-the-yen dollars by <strong>selling down its ~$1.2 trillion of US Treasuries</strong> into a fragile market. PM Takaichi (in office since October 2025) has meanwhile layered a ¥21.3 trillion stimulus on top — fiscal expansion into monetary tightening. The dashboard as of this week: BoJ policy rate 1.0% (0.25% in July 2024 → 0.5% → 0.75% in December 2025 → 1.0% in June 2026); 10-year JGB above 2%; 30-year near 4%. And one caution flag on the class's "$20–30bn" for private carry: treat it as a statement about <em>relative</em> scale — estimates of total yen-funded positions ran to $1–2 trillion in the August 2024 unwind (<a href="{% post_url 2026-07-19-cheap-money-and-the-risk-you-cannot-see %}">Session 17's editor's note</a> has that autopsy). The robust point survives any estimate: the sovereign's own ~$2 trillion dwarfs the layer that gets blamed on TV.</p>
</div>

<div class="ednote">
  <p class="ed-meta">Editor's note · next class — the bill, itemised</p>
  <p>Where this goes: duration gets its formal treatment (why it, and not tenure, measures rate sensitivity — and how to compute it on the iPad, properly), then debt-sustainability arithmetic built on the primary balance, then the payoff: locating exactly where the unpriced risk sat on Model №1's balance sheet, and why the market's awakening looks the way it looks — 30-year JGBs at 4% from a country that borrowed at 0.25% within living memory. The professor's forward call, on the record 9 August 2026: rates rise further, and the "stability" India should learn from Japan is <em>how long</em> mispricing can last — not that it lasts forever. Filed next to Session 17's NPA-vintage call; we check both in 2028. And the standing homework got a co-author offer attached: the consolidated balance sheet of the Indian state does not exist, and building it is a genuine publication. <em>"Let's create knowledge from this — there is no point in just talking about it."</em></p>
</div>

## Sources

- Prof. Tantri, Session 18 (9 August 2026) — quotes verbatim from the class transcript.
- Chien, Du &amp; Lustig, ["Japan's Debt Puzzle: Sovereign Wealth Fund from Borrowed Money"](https://www.aeaweb.org/articles?id=10.1257/jep.20251452), *JEP* 39(4), 2025 — the consolidated balance-sheet table, the ~4.7%/yr excess return, the >180% counterfactual, the ~75-year equity-duration estimate.
- Chien, Cole &amp; Lustig, ["What About Japan?"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4620159) (NBER WP 31850) — the 2023-vintage numbers; Lustig's [companion essay](https://thetwocents.substack.com/p/what-about-japan-part-i) on FILP and the funding migration.
- The July 31 intervention: [CNBC on the joint operation](https://www.cnbc.com/2026/08/03/yen-intervention-us-japan-trump-bessent-katayama.html); [Al Jazeera](https://www.aljazeera.com/economy/2026/8/3/japan-and-us-confirm-rare-joint-intervention-to-prop-up-yen); [OMFIF on why the US joined](https://www.omfif.org/2026/08/japans-yen-intervention-and-the-us-unusual-support/).
- Market levels: [TradingEconomics — BoJ policy rate](https://tradingeconomics.com/japan/interest-rate), [30-year JGB](https://www.tradingeconomics.com/japan/30-year-bond-yield); [Syz Group's summary](https://blog.syzgroup.com/slow-food-for-thought/japans-hidden-sovereign-wealth-fund) of the paper, GPIF and BoJ-ETF figures.
- Full prose notes and the standalone eight-module interactive companion live in the series folder: *Macro-Class-4-Notes.md*, *Japan-Debt-Puzzle-Interactive.html*.

<script src="{{ '/assets/js/s18-machines.js' | relative_url }}" defer></script>
