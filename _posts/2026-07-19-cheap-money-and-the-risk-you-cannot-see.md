---
layout: post
title: "Cheap Money and the Risk You Cannot See"
dek: "One idea, run twice. The RBI has made foreign borrowing artificially cheap by insuring the rupee, and made domestic credit artificially cheap by letting the real rate hit zero — and twenty-three million Spanish bank loans explain why the danger in both is the part nobody can observe until it defaults."
date: 2026-07-19
session: 17
tags: [monetary-policy, banks, credit-risk, rbi, risk-taking-channel]
excerpt_override: "Session 17 — the swap-window carry trade, the zero real rate, and the Econometrica paper that shows what cheap money does inside banks: not more credit, different credit. With four models you can play with, and editor's notes on 2013, carry unwinds, MSS, and the trilemma teaser for next time."
authors:
  - harsh
editors: []
description: "The RBI's 1.5% depreciation guarantee, India's near-zero real rate, and the risk-taking channel of monetary policy — Jiménez et al.'s 23 million Spanish loans, as taught by Prof. Tantri, with interactive models."
---

Here is the misconception this session exists to kill: *credit growth of 15–16% means the economy is strong.* Sounds reasonable — banks lend when they're confident, borrowers borrow when they have projects. But hold on. What if the price of money itself has been set close to zero? Then high credit growth tells you nothing about strength, the same way a crowded buffet tells you nothing about the cooking. And the session's deeper point — the one backed by an Econometrica paper built on the loan files of an entire country — is that cheap money doesn't just produce *more* credit. It produces *different* credit. Riskier credit. And the risk arrives disguised, in the one place the regulator cannot see it.

Everything below is one idea, run twice. Run one: the RBI has made *foreign* borrowing artificially cheap by insuring the exchange rate. Run two: near-zero *real* rates have made domestic credit artificially cheap. Both times, rational people respond by loading up on risk — and the dangerous part is unobservable until it isn't.

We're still en route to long-run growth (the Washington-consensus-versus-industrial-policy discussion is coming — the World Bank has just put out a book on industrial policy, and you should know which way the dominant thinking is drifting). But as always, current events first, because you cannot think about growth without diagnosing where you stand.

## First, the scoreboard — trade is genuinely fine

Pick up from where [Session 15]({% post_url 2026-06-21-reading-indias-balance-of-payments %}) and [Session 16]({% post_url 2026-07-05-cheap-rupee-discount-not-crisis %}) left off, because a new data point has landed. June goods exports came in above **$40 billion** again — roughly 41, after 45 and 47 the two months before. Don't read month-on-month; there's seasonality. Read year-on-year: an increase. And remember the rupee has *depreciated* — crossing these levels in dollar terms means the real performance is stronger than it looks, not weaker.

Run the arithmetic forward. A $40bn monthly pace is **$500 billion of goods exports this year — the highest ever, by far**. Services are running $35–37bn a month, so call it near **$400 billion** more. Together we're close to **$900 billion**, and a **trillion-dollar export year within one or two years is not implausible**. That's not just a number — it's leverage. At that scale, a lot of foreign firms depend on Indian goods and services as *inputs*, and dependence is bargaining power.

So the current account is comfortable — goods deficit, yes, but a services surplus plus the remittance machine on top. The stress sits where the last two sessions located it: the **capital account**, and specifically **outflows**. Last year: roughly **$91 billion in, $90 billion out**. The 2020–21 FDI vintage is exiting, and IPOs are the door. Watch the Jio listing like a hawk: Jio alone brought in some **$20–30 billion** of FDI around 2020. If the IPO is an *offer for sale*, that's not a fundraise — it's the exit ramp for Facebook and Google dressed up as a listing. If it's fresh issuance, new money actually enters. Same headline, opposite balance-of-payments event.

## What they did about it — and the free money it created

The diagnosis said: attract *equity*. What the government and RBI actually did was sweeten *debt*. Three measures, and you should know them cold, because two or three years from now everyone will have forgotten the cause of whatever is happening then.

**One.** Capital gains relief for foreign investment in **government securities** — of all the flows to court, sovereign debt.

**Two. The ECB swap window.** Borrow abroad, and when you repay after three years, the RBI caps your rupee depreciation at **1.5% a year**. It absorbs anything beyond that. A student asked the practical question: so if my client is doing an external commercial borrowing for a big asset, does the financial model now assume 1.5% instead of the ~3% the rupee has actually averaged for fifteen years? **Yes. Exactly.** That gap is a subsidy, the RBI is not hedging it, and it is banking on having reserves handy if the bill arrives.

**Three. The FCNR window.** Higher dollar-deposit rates for NRIs, currency risk fully insured. And carry this one line out of the whole session: **an NRI depositing money in his own name in an Indian bank is not a remittance — it is a loan.** SBI is borrowing from that NRI. Money is fungible; it has no colour.

Now the flows. SBI alone: **$2 billion**. Institutions the professor knows of: another **$6–8 billion**. In total, perhaps **$20–25 billion** through ECBs and **$30–40 billion** through FCNR in a month or two, window open to **September**. And the spectacular part — banks abroad lend you **5–8 times your own deposits** (one participant reported HSBC pitching far more; numbers like 19× came up in the chat). So a $100,000 deposit becomes a $500,000 borrowing, lands in India at ~7%, exchange rate insured.

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"This is a risk-free money. … Why will anyone not bring money? I'm telling you, call up your uncles abroad, because RBI will not default, that much I can tell you."</p>
</div>

Play with the machine. Notice what the guarantee toggle does to a trade that should be risky — and read who eats the difference when actual depreciation runs past the cap.

<div class="widget" id="s17-carry">
  <p class="w-head">Model №1 — the subsidised carry machine</p>
  <div class="w-row"><label>Leverage on your deposit</label><input type="range" data-lev min="1" max="8" step="1" value="5"><output data-lev-l></output></div>
  <div class="w-row"><label>Indian deposit rate</label><input type="range" data-inr min="5" max="9" step="0.25" value="7"><output data-inr-l></output></div>
  <div class="w-row"><label>Cost of borrowing abroad</label><input type="range" data-usd min="3" max="7" step="0.25" value="4.5"><output data-usd-l></output></div>
  <div class="w-row"><label>Actual rupee depreciation</label><input type="range" data-dep min="0" max="8" step="0.5" value="3"><output data-dep-l></output></div>
  <div class="w-toggle" role="group" aria-label="RBI guarantee">
    <button type="button" data-g="on" aria-pressed="true">RBI guarantee ON (cap 1.5%/yr)</button>
    <button type="button" data-g="off" aria-pressed="false">No guarantee (the honest world)</button>
  </div>
  <p class="w-big" data-roe></p>
  <p class="w-note" data-note></p>
</div>

<div class="ednote">
  <p class="ed-meta">Editor's note · 2013, and what Rajan actually did</p>
  <p>The precedent the class kept touching — <em>"Raghuram Rajan did this only, nothing else"</em> — deserves its footnote, because the "taper tantrum" is the cleanest dress rehearsal for today's window. On 22 May 2013 Ben Bernanke mused, almost in passing, that the Fed might <em>taper</em> its bond purchases. That single sentence repriced every emerging-market carry position on earth: money that had crawled into India for yield bolted for the exit, and the rupee went from ~54 in May to an all-time low of <strong>68.85 on 28 August 2013</strong> — with a current account deficit near 5% of GDP amplifying the panic. Rajan took office on 4 September 2013 and announced the scheme on day one: banks raising 3-year-plus FCNR(B) dollar deposits could swap them with the RBI at a concessional <strong>fixed cost of 3.5% a year</strong> — versus the 6–7% it actually cost to hedge in the market. Pure subsidy, deliberately so. The window (Sept–Nov 2013) pulled in <strong>$34 billion — $26bn via FCNR(B), $8bn via banks' overseas borrowings</strong> — and the rupee found its floor. Why did it look free? By the 2016 maturity the rupee had depreciated <em>less</em> than the 3.5% per year the RBI had charged for the swap, so the guarantee expired unexercised. That is the class's insurance-company point in one line: the 2013 put ended out of the money, and the lesson bureaucracy took was "puts are free." Today's window is the same instrument — FCNR rates pushed to ~7%, RBI bearing the hedge — minus the crisis that justified it.</p>
</div>

## The put the RBI has written — and why "it worked in 2013" is not an argument

Think about what the guarantee is. The RBI has **written a put option on the rupee**: if depreciation runs past 1.5% a year on a stock heading for **$50–60 billion** (2013's round was $20 billion), the RBI pays the difference. It has not hedged; it is betting reserves will suffice. Yes, reserves are **$670–680 billion** now against $200 billion in 2013 — we will not go broke. But price the logic, not the luck:

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"It's like an insurance company saying nobody died, so we are always profitable. … Last month nobody died, so nobody will die this month also. This is the kind of calculation."</p>
</div>

And there is a deeper problem than the arithmetic. With domestic promises you can always quietly claw back — remember the sovereign gold bonds. With **external** counterparties you cannot cheat, and you cannot print the currency you owe. Today no speculator attacks the rupee — nobody has the courage against $680 billion. But a central bank that must defend a *particular exchange-rate path on particular dates* has manufactured exactly the one-way bet the Soros trade feeds on. And all of this, for what?

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"This is a response for no reason. This is an emergency medicine applied without there being any emergency. … When you make it a regular thing, when emergency comes, it doesn't work."</p>
</div>

Had Sri Lanka done this with crowds in the president's garden, or Pakistan or Bangladesh on single-digit reserves, or India in 1991 — or 2013 — fine. Today there is no emergency. Decisions are made ex ante, on what you know; not ex post, hoping crude collapses to $30 and two wrongs cancel.

<div class="ednote">
  <p class="ed-meta">Editor's note · how carry trades end — the sewer, on schedule</p>
  <p>The class asked, half rhetorically, how these trades play out. The record is unambiguous: carry earns by the teaspoon and exits by the stampede, and the door is never big enough. The freshest autopsy is <strong>August 2024</strong>. For years the world's cheapest funding currency was the yen — borrow at ~0%, buy anything that yields. On 31 July 2024 the Bank of Japan raised rates a mere quarter point, to 0.25%. Five days later, on 5 August, the Nikkei fell <strong>12.4% in one session — the worst day since Black Monday 1987</strong> — as an estimated $1–2 <em>trillion</em> of yen-funded positions unwound at once; ¥113 trillion (~$790bn) of Tokyo market value vanished, the S&P dropped 3%, and Bitcoin briefly broke below $50,000. Nothing "happened" to the world economy that week; a funding leg twitched, and every position built on it had to run through the same exit. The 2013 taper tantrum (note above) was the identical mechanics with India on the receiving end; 1997 Asia was the same movie with fixed pegs and a body count. That is the actuarial table the RBI's put is written against — depreciation doesn't arrive at 1.5% a year on a polite schedule; it arrives all at once, precisely when everyone wants out.</p>
</div>

## Run two: the real rate is at zero — and the RBI is reading last year's inflation

Now the main topic. Repo: **5.25%**. Reported CPI: **4.38%**. Comfortable real rate of ~0.9%, says the official arithmetic. But you know the mistake by now — [Session 14]({% post_url 2026-04-26-rbis-real-rate-mistake %}) was built on it. The 5.25% you charge is for the *next* twelve months; the 4.38% you quote is from the *last* twelve. The real rate runs on **expected** inflation, and the pipeline is not subtle about direction: **WPI is at 9%**, retail is climbing. Against the inflation actually coming, the effective real rate is **under 1% — essentially zero**.

<div class="widget" id="s17-realrate">
  <p class="w-head">Model №2 — today's dashboard, two lenses</p>
  <div class="w-row"><label>Repo rate</label><input type="range" data-nom min="3" max="8" step="0.25" value="5.25"><output data-nom-l></output></div>
  <div class="w-toggle" role="group" aria-label="Which inflation?">
    <button type="button" data-lens="back" aria-pressed="false">Last year's print (4.38%)</button>
    <button type="button" data-lens="pipe" aria-pressed="true">What's in the pipeline</button>
  </div>
  <div class="w-row" data-exp-row><label>Expected inflation</label><input type="range" data-exp min="2" max="10" step="0.25" value="5.5"><output data-exp-l></output></div>
  <p class="w-big" data-real></p>
  <p class="w-note" data-note></p>
</div>

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"Zero real rate means I'm giving money for free. You borrow, you put in something, prices will rise by 5% — you don't need to value-add for non-default. Why will you not borrow?"</p>
</div>

So of course **credit growth is 15–16%**. And of course deposits look like they're lagging — though read that carefully too: every loan creates a deposit on some bank's liability side; that's accounting. What's changed is the *form*. Savings-account rates are suppressed (deposit insurance lets banks underpay), while **certificates of deposit** reprice with the bond market — so the smart money migrates from savings accounts into CDs and commercial paper. Lending grows; *conventional* deposits don't keep up. None of this is mysterious. All of it follows from one number being near zero.

## The spread squeeze — what low rates do inside a bank

Here's the piece most people never see, and the reason the session exists. **A bank does not earn the interest rate. A bank earns the spread** — what it charges *over* the risk-free rate. If spreads were constant, banks wouldn't care where the repo sat: repo 6, lend at 9; repo 1, lend at 4; same 3% either way.

But spreads are not constant. The finding — associated in class with Anil Kashyap of Chicago — is that **when rates go down, spreads go down too**. Why? When the riskless return collapses, nobody wants to hold the riskless asset; everyone crowds into risky lending at once, and the competition bids down what a risky borrower can be charged. The borrower who paid repo + 3 now borrows at repo + 2.

Now sit in the bank's chair. Your spread just fell from 3% to 2%; your shareholders are unhappy. You have exactly two levers, and both should worry you: **push leverage up** — same spread, thinner capital, a riskier bank the regulator *can* see. Or **reach for yield** — rebuild the spread by lending to riskier borrowers who still pay 3%+, a riskier book the regulator largely *cannot* see. Squeeze the machine and try both escapes:

<div class="widget" id="s17-spread">
  <p class="w-head">Model №3 — the spread squeeze, and the bank's two escapes</p>
  <div class="w-row"><label>Policy rate</label><input type="range" data-rate min="1" max="8" step="0.25" value="6"><output data-rate-l></output></div>
  <p class="w-big" data-out></p>
  <div class="w-toggle" role="group" aria-label="The bank's response">
    <button type="button" data-resp="none" aria-pressed="true">Do nothing</button>
    <button type="button" data-resp="lever" aria-pressed="false">Lever up</button>
    <button type="button" data-resp="risk" aria-pressed="false">Reach for yield</button>
  </div>
  <div class="w-bars">
    <div class="w-bar-row"><span class="w-bar-label">Earnings (index)</span><div class="w-bar"><div class="w-bar-fill" data-bar-earn></div></div><output data-earn-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Risk you can see</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-obs></div></div><output data-obs-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Risk you can't</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-hid></div></div><output data-hid-l></output></div>
  </div>
  <p class="w-note" data-note></p>
</div>

Which escape do real banks choose? That is an empirical question — and it has an answer.

## Twenty-three million loans: the paper

The evidence is a paper Tantri introduced with an honest confession about the first author's name — *"G-I-M-N-E-S… I read it as gymnast; it's not gymnast"* — **Jiménez, Ongena, Peydró and Saurina, published in Econometrica**, one of the hardest journals in economics to get into. And the reason to take it seriously is the class's standing rule for research: *"the kind of research papers that you should trust are those which get replicated in other contexts again and again."* This one has been — across countries, methods and monetary regimes, including, as a robustness test, in the professor's own work on India.

Why Spain? Two gifts. First, the **Credit Register of the Banco de España** records virtually every loan by every bank in the country — reporting threshold €6,000, 130,000+ firms, 200+ banks — and, crucially, it records **loan applications**, not just loans: 241,052 of them, monthly, 2002–2008, with the outcome of each. (The title's twenty-three million loans are the full loan universe from earlier drafts.) Second, since 1999 **Spain's interest rate is set in Frankfurt, not Madrid**. The ECB moves for euro-area reasons, not because of what Spanish banks are doing — so the policy rate is, from Spain's seat, an exogenous experiment running for two decades.

The identification problem is the one you'd raise yourself: when rates fall and risky firms get more credit, is that *demand* (their projects and collateral improved), *volume* (banks have more to lend to everyone), or *composition* (banks deliberately tilting toward risk)? The paper's answer is the cleanest trick in modern empirical finance: most Spanish firms borrow from several banks, so you can watch **the same firm, in the same month, apply to different banks** — which absorbs everything about the firm, observed or not — and ask only: *which type of bank says yes?* Then a two-stage model (granting first, then amount, collateral, and eventual default), and a horserace of the policy rate against GDP, inflation, the 10-year rate, US rates, securitisation and capital inflows. Only the short-term policy rate survives. Long rates — Bernanke's preferred culprit — show nothing.

And the fingerprint it finds is exactly Model №3's second escape, chosen by exactly the banks theory nominates — the ones with the least capital, the least skin in the game:

<div class="widget" id="s17-paper">
  <p class="w-head">Model №4 — the paper's finding, scaled to your rate cut</p>
  <div class="w-row"><label>Cut in the policy rate</label><input type="range" data-cut min="0" max="2" step="0.25" value="1"><output data-cut-l></output></div>
  <div class="w-toggle" role="group" aria-label="Which bank?">
    <button type="button" data-bank="low" aria-pressed="true">Thinly capitalised bank</button>
    <button type="button" data-bank="avg" aria-pressed="false">Average bank</button>
  </div>
  <div class="w-bars" data-mode="low">
    <div class="w-bar-row"><span class="w-bar-label">Grants to risky firms</span><div class="w-bar"><div class="w-bar-fill" data-bar-grant></div></div><output data-grant-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Credit committed</span><div class="w-bar"><div class="w-bar-fill" data-bar-amt></div></div><output data-amt-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Loans with no collateral</span><div class="w-bar"><div class="w-bar-fill is-warn" data-bar-coll></div></div><output data-coll-l></output></div>
    <div class="w-bar-row"><span class="w-bar-label">Future defaults</span><div class="w-bar"><div class="w-bar-fill is-danger" data-bar-def></div></div><output data-def-l></output></div>
  </div>
  <p class="w-note" data-note></p>
</div>

Read the four bars together and you get the whole story: when money gets cheap, the low-capital bank says yes more often to the firm with a bad credit history, lends it more, asks for less collateral — and its loans default more later. That is not accommodating demand. That is **risk-shifting**: thin capital means shareholders keep the upside while depositors — ultimately the public — hold the downside.

## The risk you cannot see

Here is the part that should genuinely worry you. The new risk is not *observably* risky — not junk-rated, not loss-making, nothing an inspector would flag:

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"Risk-taking is not a problem. The problem is unobserved risk-taking — which means nobody knows. You will know only after the fact."</p>
</div>

In class the intuition ran through ratings: banks lending precisely where the *external* rating says AAA but the bank's own *internal* file says junk — so the RBI inspector who walks the portfolio finds nothing wrong, while the bank quietly charges the higher rate it knows the borrower deserves. The published paper nails the same idea from the other end: conditional on *everything observable* — same firm, same month, every ratio — loans made when rates are low still **default more ex post**. The risk was real, the lender had priced it, and nobody outside could see it. Until the NPAs surface, years later:

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"After the fact, when NPAs go up and you start investigating — oh, this is what he did. He gave it to his friend who was AAA-rated, but he privately knew that his three orders were cancelled. All of that he knew. But he still gave, because the rating — nobody could know."</p>
</div>

Now, the careful version of the complaint — because it is *not* "never cut rates." Low real rates stimulate; that's a legitimate benefit. Every policy is costs against benefits, and a policymaker who says "short-run stimulus is worth long-run inflation and some hidden risk" is at least doing economics. The complaint is narrower and worse:

<div class="wa-aside">
  <p class="wa-meta">Prof. Tantri, in class</p>
  <p>"Read their minutes of meeting. There is not even an acknowledgement of these things."</p>
</div>

The MPC's minutes show no awareness that the risk-taking channel exists — while the US, for contrast, has just put Greg Mankiw to work designing an inflation-*expectations* survey for the Fed under Kevin Warsh: the exact forward-looking `Eπ` this whole apparatus turns on. And the old excuse — these papers are painful to read — has expired. You have LLMs. Ask one to explain the paper to you. The knowledge is now cheap; ignoring it is a choice.

<div class="ednote">
  <p class="ed-meta">Editor's note · homework follow-up — the ₹8 lakh crore, found</p>
  <p>In <a href="{% post_url 2026-04-26-rbis-real-rate-mistake %}">Session 14</a>, Tantri told us the RBI had pumped in ~8.8 lakh crore through OMOs and a CRR cut, and set homework: plot how inflation expectations behave when a central bank prints at that scale, against the historical episodes. I finally ran the numbers, and the plot says something more interesting than "printing → inflation." Of roughly <strong>₹8 lakh crore created, about ₹6 lakh crore has already been re-absorbed</strong> — and the workhorse is the <strong>USD/INR buy-sell swap</strong>. Mechanics: in the near leg the RBI buys dollars from banks and pays rupees (liquidity lands today); in the far leg, one-to-three years out, the banks buy their dollars back and the rupees come home to the RBI (liquidity dies on a preset date). The RBI has been running these at scale — $5bn in January 2025, then $10bn for three years, another $10bn three-year auction in January 2026 — which means a large slice of the "printing" carries a built-in expiry, parked in the forward book. Read it as the RBI intervening now and scheduling the mop-up for later — which also means the <em>far-leg maturity calendar</em> is now a monetary event in its own right: when those legs fall due, liquidity tightens on autopilot, exactly when the swap-window repayments (above) also land. Same 2–3 year horizon. Watch it.</p>
</div>

<div class="ednote">
  <p class="ed-meta">Editor's note · fun facts — India has drowned in the opposite problem</p>
  <p>Everything above is about money flooding <em>out</em> or credit running hot. For symmetry, two episodes where India's problem was too much money flooding <em>in</em> — because the sponges invented then are the same family of tools as today's swaps. <strong>2004, the MSS.</strong> Through 2002–04, FII and other foreign inflows surged; the RBI bought the dollars to stop the rupee appreciating, which meant printing rupees, which it then had to sterilise by selling government bonds — until it <em>ran out of bonds to sell</em>. The fix was the Market Stabilisation Scheme (MoU signed March 2004): the government issues special bills and bonds whose proceeds sit frozen in a separate account with the RBI, doing nothing — paper manufactured purely to soak up liquidity. <strong>2016, demonetisation.</strong> When ₹500/₹1,000 notes were scrapped, ~₹15 lakh crore raced into bank deposits and the system drowned in liquidity overnight. The RBI first ordered a <strong>100% incremental CRR</strong> — every rupee of deposits gathered between 16 September and 11 November parked at the RBI, at zero interest — and days later the government raised the MSS ceiling from ₹0.3 lakh crore to <strong>₹6 lakh crore</strong> so cash-management bills could take over the absorption. Moral: whichever direction the flood runs, the central bank ends up inventing paper to mop it up — and the mop is never free; someone pays the interest on it.</p>
</div>

## What you can now do

**If you advise borrowers** — take the subsidy with open eyes. Model 1.5% depreciation while the window lasts; it's the RBI's promise, and it won't default. Just keep the two ledgers separate: the trade is free for your client precisely because the risk moved to the public balance sheet.

**If you read the economy** — never again read 15–16% credit growth as strength without first asking where the real rate is. And after today, ask the better question: not how much credit, but *whose* — volume is what newspapers report; composition is where the crisis hides. (Across two centuries of data, credit booms are the best ex-ante predictor of banking crises; this paper says the dangerous part of the boom is the compositional shift.)

**If you're keeping score on the RBI** — the on-the-record call: reported inflation reaches perhaps 5–6% by year-end, and the RBI — steering by last year's print — hikes *after the fact*. The loans being written now, at a zero real rate, are the NPA vintage of two-three years from now, arriving exactly when the swap repayments and the far legs of the dollar swaps fall due. When that debate starts, remember where the vintage came from.

**And if you want to change policy** — one lesson from the professor's scar tissue: private criticism achieves nothing; the deputy governor stays your friend and does nothing. Write publicly and his boss reads it. *"The choice is between being liked and being effective."*

<div class="ednote">
  <p class="ed-meta">Editor's note · next class — the Impossible Trinity closes the loop</p>
  <p>Where this is heading. The <strong>Impossible Trinity</strong> (Mundell–Fleming): a country can pick only two of — a managed exchange rate, an open capital account, and independent monetary policy. Now look at what this session actually described: the RBI guaranteeing a rupee path (that's a soft peg, in forward form), while opening the capital account wider for debt (swap window, FCNR leverage, G-sec sweeteners), while also wanting to set interest rates for domestic reasons. That's all three corners at once, and the trilemma says one of them is an illusion — the bill is usually presented to monetary autonomy, which is precisely why <a href="{% post_url 2026-01-11-exchange-rates-inflation-and-interest-rate-parity %}">the parity session</a> warned about courting foreign money in government debt. And here's the loop closing: the Econometrica paper's identification <em>works</em> because Spain sat at a trilemma corner — open capital account, fixed rate (the euro), and therefore <strong>no monetary policy of its own</strong>; Frankfurt's rate was exogenous to Madrid. The trilemma isn't just next week's theory. It's the reason this week's evidence is clean.</p>
</div>

## Sources

- Prof. Tantri, Session 17 (19 July 2026) — quotes verbatim from the class transcript.
- Jiménez, Ongena, Peydró & Saurina, ["Hazardous Times for Monetary Policy…"](https://doi.org/10.3982/ECTA10104), *Econometrica* 82(2), 2014 — the 8% / 18% / +5% default / −7% collateral estimates per 1pp, and the ~19% average-bank effect, are the paper's published magnitudes.
- Ioannidou, Ongena & Peydró (Bolivia) and the replication literature cited therein.
- 2013 window: [SPJIMR review of the FCNR(B) swap](https://www.spjimr.org/newsroom/blog/the-2013-rbi-fcnrb-swap-window-review-takeaways/) ($34bn; 3.5% concessional swap); today's echo: [Business Standard on RBI bearing hedge costs](https://www.business-standard.com/economy/news/rbi-bears-hedging-costs-banks-may-offer-100-bps-more-on-fcnr-b-deposits-126060501146_1.html), [NRI Affairs on 7% FCNR rates, September deadline](https://www.nriaffairs.com/indian-banks-nri-fcnr-deposit-rates-7percent/).
- Yen unwind: [Foreign Policy, Aug 2024](https://foreignpolicy.com/2024/08/08/japan-crash-yen-carry-trade-global-markets/); [HDFC MF deep-dive](https://www.hdfcfund.com/learn/deep-dives/tuesday-talking-point/yen-carry-trade-unwinding-story-global-event).
- MSS & demonetisation: [Arthapedia](http://arthapedia.in/index.php?title=Market_Stabilization_Scheme_%28MSS%29); [Business Standard, Dec 2016](https://www.business-standard.com/article/finance/mss-bond-ceiling-hiked-to-rs-6-lakh-crore-116120201452_1.html).
- Dollar swaps: [The Tribune on the $10bn three-year auction](https://www.tribuneindia.com/news/business/rbi-to-inject-usd-10-billion-liquidity-through-three-year-dollar-rupee-swap/).
- Full prose notes with the boxed models live in the series folder: *Macro-Class-3-Notes.md*.

<script src="{{ '/assets/js/s17-machines.js' | relative_url }}" defer></script>
