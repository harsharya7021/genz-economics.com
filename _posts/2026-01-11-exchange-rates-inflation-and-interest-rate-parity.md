---
layout: post
title: "Exchange Rates, Inflation & Interest Rate Parity"
dek: "The central paradox: how inflation, nominal depreciation, and interest differentials are all telling the same story."
date: 2026-01-11
session: 7
tags: [exchange-rates, inflation, interest-rate-parity, irp, fisher]
excerpt_override: "Session 6 — inflation, nominal depreciation, and interest-rate parity: three apparently contradictory facts reconciled."
authors:
  - harsh
editors: []
---

# **The Central Paradox**

Three seemingly contradictory statements that confuse many:

> 1\. **Higher inflation → Currency depreciation** (intuitive: goods become more expensive)
> 
> 2\. **Higher inflation → Higher interest rates** (Fisher equation: i = r + E[π])
> 
> 3\. **Higher interest rates → Currency appreciation** (news narrative: capital inflows)

These three statements are all correct when properly understood through distinguishing anticipated versus unanticipated rate changes. We now develop a systematic 3-step framework to resolve this apparent paradox.

# **Step 1: Inflation and Exchange Rate Depreciation**

**The Goods Market Logic**

When one country experiences higher inflation than another, its currency depreciates to maintain purchasing power parity. Let's work through a concrete example:

| **Year 0 (Today)** | **Year 1 (After Inflation)**          |
| ------------------ | ------------------------------------- |
| Dosa in India      | 100 Rs → 110 Rs (10% inflation)       |
| Dosa in USA        | $2 → $2.04 (2% inflation)             |
| Exchange rate      | 50 Rs/$ → 54 Rs/$ (~8% depreciation) |

*Real Exchange Rate Analysis*

Real exchange rate = Nominal exchange rate × (Price level abroad / Price level home)

Initially: 50 × (2/100) = 1.0 dosa equivalent

After one year with unchanged real rate: 54 × (2.04/110) = 1.0 dosa equivalent

|                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- |
| The currency of the higher-inflation country depreciates by approximately the inflation differential (10% - 2% = 8%). |

![Title: Exchange Rates - Description: Whiteboard showing exchange rate calculations](/assets/img/notes/image14.jpg)

Figure 1: Initial setup showing dosa prices and exchange rate

# **Step 2: Interest Rates and Exchange Rates**

**The Financial Market Logic**

## **The Fisher Equation** 

<table>
<tbody>
<tr class="odd">
<td><p><strong>i = r + E[π]</strong></p>
<p>Where:</p>
<p>i = nominal interest rate</p>
<p>r = real interest rate</p>
<p>E[π] = expected inflation</p></td>
</tr>
</tbody>
</table>

Assuming real rates are equal in both countries:

|                      | **India** | **United States** |
| -------------------- | --------- | ----------------- |
| Real rate (r)        | 2%        | 2%                |
| Expected inflation   | 10%       | 2%                |
| **Nominal rate (i)** | **12%**   | **4%**            |

Interest rate differential = 12% - 4% = 8% = inflation differential

## **Uncovered Interest Rate Parity**

This is the crucial insight that resolves the paradox:

<table>
<tbody>
<tr class="odd">
<td><p><strong>UNCOVERED INTEREST RATE PARITY (UIRP):</strong></p>
<p>Expected exchange rate depreciation ≈ Interest rate differential</p>
<p><strong>The currency with HIGHER interest rates is expected to DEPRECIATE</strong></p></td>
</tr>
</tbody>
</table>

## **Example**

Consider an investor choosing between Indian bonds (12%) and US bonds (4%):

> 4\. Invest $100 in India at 12% → Get 112 units of rupees
> 
> 5\. But rupee depreciates 8% → When converting back to dollars, gain only ~4%
> 
> 6\. Result equals investing in US bonds at 4% → No arbitrage profit

This arbitrage condition ensures the relationship holds:

*Higher yield is offset by currency depreciation*

![Title: India vs US Comparison - Description: Whiteboard showing interest rate calculations and comparison](/assets/img/notes/image2.jpg)

Figure 2: India vs US comparison with interest rate calculations

**Resolving the Paradox**

The resolution hinges on a critical distinction:

## **ANTICIPATED vs UNANTICIPATED Rate Changes**

<table>
<tbody>
<tr class="odd">
<td><p><strong>ANTICIPATED RATE INCREASES</strong></p>
<p>If the RBI raises rates because inflation is expected (market already knows):</p>
<blockquote>
<p>• Currency continues to depreciate as expected</p>
<p>• Higher rates = higher expected inflation = MORE depreciation</p>
<p>• No contradiction</p>
</blockquote></td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr class="odd">
<td><p><strong>UNANTICIPATED RATE INCREASES (Surprise)</strong></p>
<p>If the RBI raises rates UNEXPECTEDLY:</p>
<blockquote>
<p>• Markets re-evaluate expectations</p>
<p>• Capital flows in (higher returns with unexpected strength)</p>
<p>• Currency appreciates in the SHORT TERM</p>
</blockquote></td>
</tr>
</tbody>
</table>

## **Why News Narratives Say 'Rate Hike = Currency Appreciation'**

News stories focus on the SURPRISE component of rate hikes:

> • "RBI unexpectedly raises rates → rupee appreciates" (short-term reaction to news)
> 
> • But the LEVEL of rates reflects long-term inflation expectations
> 
> • These long-term expectations drive ongoing depreciation

<table>
<tbody>
<tr class="odd">
<td><p><strong>THE RESOLUTION</strong></p>
<p>All three statements are correct:</p>
<blockquote>
<p>High inflation → depreciation (PPP logic: goods parity)</p>
<p>High inflation → high rates (Fisher equation)</p>
<p>Surprise rate hike → short-term appreciation (market surprise)</p>
</blockquote>
<p>The key: Distinguishing the level of rates (reflects inflation) from rate changes (markets react to surprises).</p></td>
</tr>
</tbody>
</table>

**Real-World Application: India vs United States**

Understanding rupee depreciation through the framework we've developed:

## **Current Market Levels**

| **Metric**                   | **India**                    | **United States** |
| ---------------------------- | ---------------------------- | ----------------- |
| Nominal rate                 | ~12%                        | ~4%              |
| Expected annual depreciation | **~8% per year**            | —                 |
| Exchange rate progression    | 40 → 43.2 → 46.7 → ... → 90+ | (stable baseline) |

## **Why Rupee Goes from 40 to 90: It's NORMAL**

Rather than being a problem or sign of economic weakness, this depreciation is:

> • A natural consequence of India having higher inflation than the US
> 
> • Consistent with interest rate parity—investors aren't being cheated
> 
> • Expected by the market, reflected in interest rate differentials
> 
> • Mechanism for maintaining PPP and competitive balance

# **Class Discussion & Student Questions**

Key questions raised during the lecture:

## **On Expectations and FII Flows**

*Maneshwar's question:*

How do FII inflows affect the framework, and how are expectations formed?

The expectations of depreciation embedded in interest rate differentials already account for flows that markets anticipate. Surprises—like unexpected policy changes or capital flow reversals—create deviations from this equilibrium path.

## **On Inflation Expectations**

*Lakshit's question:*

How do we anchor inflation expectations, and what happens if inflation expectations change?

Central banks anchor expectations through credible commitment to inflation targets. If expectations shift (e.g., inflation expected to rise from 7% to 12%), the entire interest rate level adjusts upward, and the equilibrium depreciation path steepens accordingly.

## **On the Nature of Real Rates**

*Bharat's question:*

Can the RBI control real interest rates?

**Answer:** Not fully. Real rates depend on people's willingness to postpone consumption (time preference). The RBI controls nominal rates; real rates adjust through inflation expectations. In the short run, policy can affect real rates, but long-term real equilibrium depends on preferences and productivity growth.

## **On Cross-Country Real Rate Differences**

*Dipesh's question:*

What if real interest rates differ between countries?

The framework extends naturally. If India's real rate (3%) exceeds the US's (2%), then:

> • India: i = 3% + 10% = 13%
> 
> • US: i = 2% + 2% = 4%
> 
> • Interest rate differential: 9% (includes both inflation difference AND real rate difference)
> 
> • Expected depreciation: ~9% per year

## **On Structural Factors**

*Bharat's question:*

How do Trump tariffs and trade policy affect long-term growth and depreciation paths?

Trade policies affect real growth potential and real interest rates through supply effects. If tariffs reduce long-term US growth potential, that could lower the equilibrium real rate and require depreciation in other directions to maintain balance. These are structural shifts operating alongside the inflation-expectation mechanisms we've discussed today.

**Takeaways**

## **Three-Step Framework**

> **Goods Market (PPP):** Higher inflation → Currency depreciation by approximately the inflation differential
> 
> **Financial Market (UIRP):** Higher interest rates → Currency expected to depreciate; arbitrage ensures yields equalize
> 
> **Resolution:** Distinguish anticipated (consistent with framework) from unanticipated (surprise) changes

## **Insights**

<table>
<tbody>
<tr class="odd">
<td><blockquote>
<p>• Currency depreciation is often normal, not pathological—a consequence of inflation differentials</p>
<p>• Interest rate differentials encode expectations about depreciation</p>
<p>• News narratives about rate hikes causing appreciation are describing short-term market reactions to surprises, not long-term equilibrium</p>
<p>• The framework reconciles three apparently contradictory statements about inflation, interest rates, and exchange rates</p>
<p>• Real interest rates depend on fundamentals (preferences, productivity); central banks manage nominal rates and inflation expectations</p>
</blockquote></td>
</tr>
</tbody>
</table>

This lecture completed the short-term macroeconomics portion. The next session will provide a summary of core short-term macro concepts and book recommendations for deeper study. Future classes will extend to medium-term (growth, productivity) and long-term (institutions, development) perspectives.
