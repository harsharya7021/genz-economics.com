---
layout: post
title: "Tantri's fintech series, Part 1: what your savings account knows about your credit"
dek: "On May 29, 2025, Tantri sent his own working paper into the WhatsApp group — an algorithm trained on savings-account transactions that out-predicts traditional credit scores. Here's the abstract, the four research questions, and the policy implication, in his words."
date: 2025-05-29
tags: [fintech, credit-scoring, machine-learning, banking, india, tantri-research, tantri-files]
excerpt_override: "The first installment of Tantri's promised fintech series — kicked off with the abstract and full four-question summary of his own first-draft paper on using savings-account transactions to predict loan performance for credit-thin borrowers."
authors:
  - tantri
editors:
  - harsh
series: tantri-files
---

*From **The Tantri Files** — verbatim writing from Prof. Tantri's WhatsApp messages, with his blessing. On May 29, 2025, he announced the start of a new fintech series and led with his own working paper.*

---

## How it started

**Tantri** *(May 29, 1:52 AM)*.

> Starting a series on fintech as promised. I will start with my paper, the first draft I finished just now. The idea is to use **savings account transactions to predict loan performance for borrowers not having credit scores.**
>
> Will write more about this tomorrow. Here is the paper.

He attached the PDF. The next message, sent immediately after, was the abstract.

## The abstract — in his words

> With the advent of open banking, data on savings transactions are now increasingly available. However, the lack of outcomes for rejected loan applicants — *selective labels problem* — and filtering of data due to consent requirements introduce selection into screening and monitoring algorithms based on this data.
>
> We overcome these problems using a unique policy experiment where the **Indian government forced banks to lend to all street vendors** as a part of its post-COVID-19 policy.
>
> Our model that uses savings transactions of all borrowers as inputs achieves an **AUC of 77.6** (85.79–93.32). It outperforms models that use only credit scores or borrower demographics. The model also identifies *which* transactions matter most — recurring inflows, expense volatility, and the timing of large outflows do most of the work.

## The four questions the paper asks

A few hours later, Tantri sent the long-form summary of the paper, structured as a walkthrough of four questions. This is reproduced essentially in full.

### Question 1 — Do savings transactions before the loan predict loan performance?

> First, do savings account transactions *before* the issue of a loan predict eventual loan performance?
>
> **The answer is yes.**
>
> An algorithm trained on savings account transactions has an AUC of 75.6. Adding borrower demographics and credit scores increases the AUC to 77.6.

### Question 2 — Are savings transactions useful for monitoring after a loan is issued?

> Second, is the data on savings account transactions *after* a loan is issued useful for monitoring?
>
> **Again, the answer is yes.**
>
> Our monitoring model achieves AUCs between 85.79 and 92.32, depending on the loan month under consideration.

### Question 3 — How does the savings-account model compare with credit scores?

> Next, we compare the economic impact of savings account data with credit scores and demographic information.
>
> Our analysis that fixes the loan rejection rate at the optimal level applicable to the full-data model that uses all three sources of data shows that **using savings account information leads to 46.5% (18.5 to 9.9) lower NPAs** when compared to models that do not use savings account data.
>
> Similarly, we also show that the use of savings account data could lead to a reduction in loan rejection rate from 84.6% to 44.5% — a decline of an economically meaningful 47% — without changing the NPA rate.

### Question 4 — What does this mean for fintech policy?

> The point is **open banking practiced well has great potential.**
>
> But right now, fintechs are not using this information efficiently.

## What this means for the rest of us

Three things to take away from how Tantri framed this paper, even if you never read it:

**One.** The "credit thin file" problem in India — the millions of borrowers with no formal credit history — is solvable with data the borrowers themselves are already generating. The bottleneck is consent and infrastructure, not signal.

**Two.** Even when the signal exists, the algorithms have to work around the *selective labels problem*: lenders only see what happens to the borrowers they actually lent to, which makes any model trained on observed defaults systematically biased. The paper's policy experiment — the post-COVID rule that forced banks to lend to *all* street vendors — was the rare moment when this bias could be cleaned out. If you ever build a credit model, this is the trick: find the natural experiment that removes the selection.

**Three.** The economic effect is large in *both* directions. You can keep the same default rate and reject 47% fewer borrowers, *or* keep the same rejection rate and cut NPAs nearly in half. Either tail of that trade-off changes how much credit gets to small businesses in India.

If you want to work in fintech and you've been wondering what unsexy, important problem still has room — this is it.

---

## Editor's notes

The abstract and four research questions are reproduced **verbatim** from Tantri's messages in the INFS Co25 WhatsApp group on May 29, 2025. The "what this means" section is editorial commentary, not Tantri's. The paper itself is Tantri's own working draft; once it is publicly posted on SSRN we'll link it here.

Tantri's continuing fintech series — promised in this announcement — will be added to this page or as separate posts under the [`tantri-research` tag](#) as it appears.
