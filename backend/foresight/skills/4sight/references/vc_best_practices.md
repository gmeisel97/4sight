# 4sight VC Best Practices Reference
## Seed to Series B — All Industries

This file is the authoritative source of investor-grade standards that 4sight
uses when analyzing, building, or reviewing financial models. Read this file
whenever the user asks about financial projections, valuations, cap tables,
fundraising, or investor readiness.

---

## Part 1: Stage-by-Stage Context

Understanding which stage a company is at shapes everything about how you
evaluate their model. Never apply Series B scrutiny to a Seed deck, and
never let a Series B founder get away with Seed-level vagueness.

### Pre-Seed / Seed Stage
At this stage, the company often has little to no revenue. The financial model
is essentially a structured hypothesis. Investors know this — they are betting
on the team and the market, not the numbers. That said, the model still matters
because it reveals how the founder *thinks*. A Seed model should clearly show:
the core business assumption (what drives revenue), a 24-36 month projection,
monthly burn rate, and how long the raise will last (runway). The most common
Seed mistake is a hockey-stick revenue curve with no explanation of what
operationally causes the inflection point.

### Series A
By Series A, the company should have some evidence of product-market fit —
early revenue, strong retention, or clear leading indicators. The model needs
to demonstrate a *repeatable* growth engine. Investors are now asking: "If we
give you $5-15M, what exactly will you do with it, and what does the business
look like in 3 years?" A Series A model must show detailed unit economics,
a hiring plan that connects to revenue goals, and a clear path to the metrics
needed to raise a Series B (usually $3-10M ARR for SaaS).

### Series B
Series B investors are doing real financial diligence. The model needs to be
a complete three-statement model (P&L, Balance Sheet, Cash Flow Statement)
with auditable assumptions. Valuations are now benchmarked against comparable
public and private companies. Gross margins, NRR (Net Revenue Retention),
and payback periods are scrutinized closely. The narrative must show a path
to profitability or a credible explanation of why growth at scale justifies
continued losses.

---

## Part 2: Pro Forma Standards

A pro forma is a projection of future financial performance. It is an argument,
not a prediction. Every number should be traceable back to an assumption.

### The Three-Statement Model (required by Series A, essential at Series B)

The three financial statements are not independent documents — they are a
single interconnected system. Changes in one flow through to the others,
and this interconnection is what makes the model trustworthy.

The **Income Statement (P&L)** shows revenue minus expenses equals net income
(or loss). It answers: "Is the business model viable?" Revenue flows from the
top, cost of goods sold (COGS) is subtracted to get gross profit, then
operating expenses (R&D, Sales & Marketing, G&A) are subtracted to get
EBITDA, and finally depreciation, interest, and taxes lead to net income.

The **Balance Sheet** shows assets, liabilities, and equity at a single point
in time. It answers: "What does the company own and owe?" The fundamental
equation is Assets = Liabilities + Equity. Cash from the cash flow statement
feeds into the Balance Sheet's cash line. Net income from the P&L feeds into
retained earnings in the equity section. If the Balance Sheet doesn't balance,
there is a modeling error somewhere.

The **Cash Flow Statement** shows actual cash moving in and out, starting
from net income and adjusting for non-cash items (like depreciation) and
working capital changes. It answers: "Will the company run out of money?"
Many profitable-looking companies have failed because they ran out of cash
before their receivables were collected. This statement is the most important
for early-stage companies.

### Revenue Model Construction

Revenue should be built from the bottom up, not the top down. "We'll capture
1% of a $10B market" is a top-down assumption that tells investors nothing.
A bottom-up model says "We have 3 salespeople, each can close 5 deals per
month, average contract value is $2,000, so monthly new ARR is $30,000."

Always break revenue into its components: the number of customers (or units)
multiplied by the average revenue per customer (or unit). For subscription
businesses, model new customer acquisition separately from expansion revenue
(existing customers paying more) and subtract churn (customers leaving).
The formula is: Ending ARR = Beginning ARR + New ARR + Expansion ARR - Churned ARR.

### Expense Model Construction

Expenses should be tied to headcount wherever possible, because people are
the primary cost driver for most early-stage companies. Build a headcount
plan first — list every role, when it's hired, and what it costs (including
benefits, which typically add 15-25% on top of salary). Then derive expenses
from that plan.

Classify expenses into three buckets that investors recognize. Cost of Goods
Sold (COGS) are costs directly tied to delivering the product — cloud hosting,
customer success staff, payment processing fees. Sales & Marketing covers
everything that drives new customer acquisition — salesperson salaries,
marketing software, ad spend, events. General & Administrative covers the
overhead of running a company — finance, legal, HR, office. Research &
Development covers building the product — engineers, designers, product managers.

### Gross Margin Benchmarks by Industry

Gross margin is revenue minus COGS, expressed as a percentage. It is one
of the most scrutinized metrics because it reveals the fundamental economics
of the business model. Flag any model where gross margins fall outside these
healthy ranges, and explain to the user why investors will question it.

Software as a Service (SaaS): 70-85% is healthy. Below 60% suggests either
high infrastructure costs that need optimization, or too much human labor
involved in delivering the product. Above 90% is unusual and may mean COGS
are being misclassified.

Marketplace / Platform businesses: 40-70%, depending on whether the company
takes the transaction on their books or acts purely as a facilitator.

Consumer subscription (media, fitness, food): 40-65%.

Hardware with software: 30-55%. The hardware component compresses margins,
which is why investors want to see a SaaS attach rate on top.

E-commerce and physical goods: 20-50%. Logistics and fulfillment are the
biggest cost drivers.

Professional services and consulting: 20-40%, because the primary cost is
human time.

Biotech and deep tech: Highly variable pre-revenue, but investors focus
on the eventual commercial margin profile, not the current R&D spend.

### Burn Rate and Runway

Monthly burn rate is the net cash leaving the company each month. Gross burn
is total cash out. Net burn is cash out minus cash in (revenue). The formula
for runway is: Runway in months = Current Cash Balance / Monthly Net Burn Rate.

Investors expect to see at least 18-24 months of runway from a raise. 
A raise that gives only 12 months of runway sends a signal that the company
will immediately be back fundraising instead of building. The ideal is 24
months — enough time to hit the milestones needed for the next round with
a buffer for things going wrong.

Always flag if a model shows the company running out of cash before reaching
the stated next milestone (e.g., "$5M ARR to raise Series A" but cash runs
out at $3M ARR). This is the most common fatal error in early-stage models.

---

## Part 3: Financial Modeling and Valuation

### Key Metrics by Stage and Business Type

These are the metrics investors use to evaluate companies for fundraising.
When a model is missing these, flag it and explain why investors will ask.

**ARR (Annual Recurring Revenue)**: The annualized value of all active
subscription contracts. The standard benchmark targets are approximately
$1-3M ARR for a solid Series A (SaaS), and $5-15M ARR for Series B.
Calculate as: ARR = MRR × 12, where MRR is Monthly Recurring Revenue.

**MoM and YoY Growth Rate**: Month-over-month growth of 10-15% is considered
strong for early-stage SaaS. Year-over-year growth of 3x (triple, triple,
double, double, double — the "T2D3" framework) is the benchmark for top-tier
Series A and B SaaS companies.

**Net Revenue Retention (NRR) / Net Dollar Retention (NDR)**: This measures
whether existing customers are spending more or less over time. The formula is:
(Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR.
Above 100% means the customer base grows revenue even without acquiring new
customers — this is the holy grail. Best-in-class SaaS companies show 120-140%.
Below 90% is a serious warning sign that the product has retention problems.

**Customer Acquisition Cost (CAC)**: Total sales and marketing spend in a
period divided by the number of new customers acquired. For a model to be
sustainable, CAC must be recoverable within a reasonable time frame.

**Lifetime Value (LTV)**: The total revenue a customer generates over their
relationship with the company. For subscription businesses:
LTV = (Average Monthly Revenue per Customer) / (Monthly Churn Rate).
So if a customer pays $500/month and you lose 2% of customers per month,
LTV = $500 / 0.02 = $25,000.

**LTV:CAC Ratio**: This single ratio tells investors whether the business
model is fundamentally sound. LTV:CAC above 3x is the minimum threshold
most investors require. Above 5x is excellent. Below 2x suggests the company
is spending too much to acquire customers relative to what those customers
are worth. Flag any model where this ratio isn't explicitly calculated and
surfaced.

**CAC Payback Period**: How many months it takes to recover the cost of
acquiring a customer from their gross margin contribution.
Formula: CAC / (Monthly Revenue per Customer × Gross Margin %).
Under 12 months is excellent. 12-18 months is acceptable for most SaaS.
Above 24 months is a concern, especially in capital-constrained environments.

**Magic Number**: A sales efficiency metric that tells you how much ARR
growth you get for every dollar of sales and marketing spend.
Formula: (Current Quarter ARR - Prior Quarter ARR) × 4 / Prior Quarter S&M Spend.
Above 0.75 is good. Above 1.0 is excellent (meaning you generate more ARR
than you spend on sales). Below 0.5 suggests the go-to-market motion
is not yet efficient.

### Valuation Methods

**Revenue Multiple (most common at Seed-Series B for growth companies)**:
Company value = ARR × Multiple. The multiple varies by growth rate, margin
profile, and market conditions. As a general framework, companies growing
at 3x YoY might command 15-25x ARR. Companies growing at 1.5x YoY might
command 8-12x ARR. These multiples compress significantly in risk-off markets.
Flag if a model implies a valuation multiple that seems inconsistent with
the company's growth rate and margin profile.

**Discounted Cash Flow (DCF) — relevant at Series B and beyond**:
DCF values a company based on the present value of its future cash flows.
The core formula is: Value = Sum of (Free Cash Flow in Year N / (1 + Discount Rate)^N).
The discount rate for venture-backed companies is typically 25-40%,
reflecting the high risk of the investment. A DCF requires the model to have
long-term projections (5-10 years) and a terminal value assumption.
For early-stage companies still burning cash, DCF is less relevant but
investors may use it to sense-check exit scenarios.

**Comparable Company Analysis (Comps)**:
Look at what similar public or recently-acquired private companies are valued
at as a multiple of revenue, ARR, or gross profit. For a B2B SaaS company,
relevant comps might be other SaaS companies with similar growth rates and
NRR. Flag if the user's implied valuation is significantly above the comps
median without a clear justification (usually: faster growth, larger TAM,
or a defensible moat).

**Pre-Money and Post-Money Valuation**:
Pre-money valuation is what investors agree the company is worth *before*
their investment. Post-money valuation is pre-money plus the new investment.
New investor ownership percentage = Investment Amount / Post-Money Valuation.
This is fundamental to cap table modeling. Flag any model where these
relationships aren't correctly calculated.

---

## Part 4: Cap Table Modeling and Analysis

The cap table (capitalization table) is the legal and mathematical record
of who owns what in the company. Errors here have real legal and financial
consequences. Treat cap table analysis with extreme care.

### Cap Table Structure

A proper cap table tracks the following for each security holder: name,
security type (common stock, preferred stock, options, warrants, SAFEs,
convertible notes), number of shares or units, ownership percentage
on a fully diluted basis, and the price paid per share.

**Fully diluted shares** means counting not just shares that currently exist,
but all shares that *could* exist if every option, warrant, SAFE, and
convertible note were exercised or converted. Investors always evaluate
ownership on a fully diluted basis. Flag any cap table that shows ownership
percentages on an undiluted (basic) basis — this is misleading.

### Funding Instruments by Stage

**SAFEs (Simple Agreement for Future Equity)**: The most common instrument
at pre-seed and seed stages. A SAFE gives an investor the right to convert
their investment into equity at a future priced round, usually at a discount
(typically 10-25%) or with a valuation cap (a maximum price at which they
convert). SAFEs do not have interest rates or maturity dates. When modeling
SAFEs, always calculate the conversion price under both the cap and the
discount and use whichever gives the investor more shares (the "most
favorable conversion"). Flag if a company has multiple SAFEs with different
caps and discounts — these need to be modeled individually.

**Convertible Notes**: Similar to SAFEs but structured as debt with an
interest rate (typically 4-8%) and a maturity date (typically 18-24 months).
Interest accrues and typically converts into equity along with the principal.
When modeling convertible notes, the conversion amount is principal plus
accrued interest, not just principal.

**Priced Rounds (Series A, B, etc.)**: These are actual equity sales at
a negotiated price per share. A priced round requires a formal 409A valuation
(for tax purposes), creates a new share class (Series A Preferred, Series B
Preferred), and typically comes with investor rights including board seats,
pro-rata rights, and protective provisions.

### Dilution and Option Pools

Every time new shares are issued — whether to new investors, employees,
or through conversion of SAFEs or notes — existing shareholders are diluted.
Their percentage ownership decreases even though their absolute number of
shares stays the same.

**Option Pool**: A reserved block of shares for employee equity compensation.
Investors typically require an option pool of 10-20% of fully diluted shares
to be created *before* their investment (pre-money), which means the dilution
falls on existing shareholders, not the new investors. This is called the
"option pool shuffle." Flag any model where the option pool is being created
post-money — this is a negotiating error that costs founders ownership.

Always check that the model has an adequate option pool for the stage.
A Seed company planning to hire 20 engineers over the next two years
with a 5% option pool will almost certainly need to expand it before
Series A, causing additional dilution. Flag this proactively.

### Liquidation Waterfall

The liquidation waterfall determines the order in which shareholders get
paid in an exit (acquisition or IPO). This is arguably the most important
part of cap table analysis, because the difference between a 1x
non-participating preferred and a 2x participating preferred can mean
millions of dollars for founders in a moderate exit.

**Non-participating preferred**: In a liquidation or acquisition, preferred
shareholders get their investment back first (the liquidation preference),
then convert to common and share in the remaining proceeds. This is the
most founder-friendly structure. Most top-tier VCs use non-participating
preferred because it aligns incentives.

**Participating preferred**: Preferred shareholders get their investment
back *and* continue to participate in the remaining proceeds as if they
had converted to common. This is more investor-friendly and significantly
dilutes founder outcomes in moderate exits.

**Liquidation preference multiple**: Most common is 1x (investors get
their money back first). Sometimes investors negotiate 1.5x or 2x,
meaning they get 1.5 or 2 times their investment before anyone else
sees a dollar. Flag any liquidation preference above 1x non-participating
as a founder-unfriendly term that should be negotiated.

When modeling exit scenarios, always build a waterfall analysis that shows
founder, employee, and investor proceeds at multiple exit values (e.g.,
$10M, $25M, $50M, $100M, $250M). This is critical for understanding
whether the cap table structure makes sense for all parties.

### Anti-Dilution Provisions

Anti-dilution provisions protect investors if future shares are issued at
a lower price than what they paid (a "down round"). There are two main types.

**Full ratchet**: The investor's conversion price adjusts to the new,
lower price. This is very aggressive and essentially means the investor
gets significantly more shares. Flag any full ratchet provision as
highly founder-unfriendly.

**Weighted average anti-dilution** (most common): Adjusts the conversion
price based on a weighted average of old and new share prices, taking into
account the size of the new issuance. This is more balanced.

### Common Cap Table Red Flags

Flag any of the following when encountered in a cap table analysis.

Founders with less than 50% combined ownership before Series A — this
will concern Series A investors who want founders to have meaningful
economic incentive.

Any single investor owning more than 40% before Series A — this suggests
the company may have given away too much equity too early.

Option pool below 10% fully diluted — insufficient for future hiring.

Multiple classes of founder stock with different vesting schedules —
may create alignment issues.

SAFEs or convertible notes that have passed their maturity date without
converting — this is a legal and financial liability.

Lack of a 409A valuation when options have been issued — creates IRS tax
liability for employees.

Waterfall analysis showing founders receiving less than investors in exits
below 2x the post-money valuation — may indicate overly aggressive
liquidation preferences.

---

## Part 5: Model Quality Checklist

When 4sight reviews any financial model, it should internally evaluate
all of the following and surface issues proactively.

**Assumptions transparency**: Are all key assumptions in a single dedicated
tab with clear labels? Can every output be traced back to an input assumption?

**Internal consistency**: Does the headcount plan support the revenue plan?
Does the sales capacity (number of salespeople × deals per rep × ACV)
mathematically produce the revenue shown?

**Three-statement linkage**: Does net income from the P&L flow into retained
earnings on the Balance Sheet? Does the ending cash on the Cash Flow Statement
match the cash line on the Balance Sheet?

**Unit economics completeness**: Are LTV, CAC, LTV:CAC, and CAC Payback
Period all explicitly calculated and displayed?

**Runway visibility**: Is monthly burn rate and runway in months clearly
shown? Does the company reach its next milestone before running out of cash?

**Scenario coverage**: Are there at least two scenarios (base and downside)?
A model with only an optimistic scenario tells investors the founder hasn't
thought carefully about what could go wrong.

**Gross margin accuracy**: Are COGS correctly classified? Is gross margin
consistent with industry benchmarks for this business model?

**Cap table completeness**: Are all outstanding securities accounted for
on a fully diluted basis? Have SAFEs and notes been properly converted?
Does the waterfall analysis show outcomes across multiple exit scenarios?

**Valuation reasonableness**: Is the implied valuation consistent with
the company's metrics, stage, and comparable company multiples?
