# Nuclear Project Economics Framework

> Status: draft for review. Working framework behind the nucleargo pivot —
> from newcomer-country tracking toward data-driven cost/decision support
> spanning newcomer and established nuclear nations.

## The question this framework answers

Every nuclear plant owner is really asking one question: **how do we build
this economically without going bankrupt?** That question doesn't resolve to
reactor technology alone — the data suggests technology choice explains
surprisingly little of the cost variance between projects. It resolves to a
set of execution, financing, and lifecycle variables that can be observed and
compared across every country that has actually built a plant — newcomer and
established alike. Newcomers are the ones asking; established nations are
where the evidence lives. The platform's value is putting both in the same
dataset.

Three distinct sub-questions sit inside "economically without going
bankrupt," and they should stay separate rather than collapsing into one cost
number:

0. **Pre-FID viability** — does this program ever reach Final Investment
   Decision (the binding commitment to build) with a credible vendor,
   financing package, site, and regulator in place — or does it stall or
   reverse before a shovel ever moves?
1. **Construction-phase solvency** — will this specific project stay on
   budget and schedule and actually get finished?
2. **Lifecycle economic resilience** — once built, is the program
   economically sound over the plant's 60+ year life (fuel, waste,
   decommissioning)?

A project can be strong on one and exposed on another. Most newcomer
programs currently tracked on nucleargo are still answering question 0 —
Groups A–D below assume FID has already happened.

## Group 0 — Pre-Construction Readiness (Pre-FID)

*Determines whether a program ever reaches Final Investment Decision. This is
where most newcomer projects actually die — reversed, stalled, or restarted
before construction risk (Group A) even becomes relevant.*

| Dimension | What it captures |
|---|---|
| Political commitment durability (pre-FID) | Does the decision to go nuclear survive elections, referenda, and fiscal cycles long enough to reach FID? (Distinct from Group B's political durability, which assumes FID already happened.) |
| Vendor and technology selection | Has a reactor design and vendor actually been locked in, or is the program still comparing options — with real risk of a late reset (e.g. a bidder withdrawing after years of work) |
| Financing arrangement pre-FID | Can the country close financing — sovereign guarantees, export credit agencies, multilateral development banks — before committing capital? |
| Regulatory and legal readiness | Does a nuclear regulator with real legal authority and technical capacity exist? Are safeguards agreements and bilateral nuclear cooperation agreements (e.g. a 123 Agreement) in place? |
| Site licensing and environmental approval | Environmental impact assessment, public consultation, land acquisition, seismic/hydrological surveys — a site can be rejected mid-process |
| Grid readiness | Can the national grid absorb a large single unit (roughly 5–10% of total grid capacity is a common ceiling), or does this force a rethink toward SMRs or grid reinforcement first? |

**This isn't a new data model to build from scratch.** The IAEA's Milestones
Approach already formalizes this phase as the "19 Infrastructure Issues," and
nucleargo already tracks it for newcomer countries via the `infrastructure_issues`
table and the IAEA-phase country profiles (`CountryProfileLayout.tsx`). Group
0 here is the conceptual bridge, not a duplicate schema — a project's full
record should link its pre-FID newcomer-tracker data to its post-FID Groups
A–D data once (if) it reaches construction.

## Group A — Build-Phase Execution Risk

*Determines whether construction stays on budget and schedule.*

| Dimension | What it captures |
|---|---|
| Design maturity before construction | Was the design frozen before groundbreaking, or did engineering and construction run concurrently (Vogtle, Flamanville)? |
| Reference plant vs. first-of-a-kind | Has this exact design been licensed and built anywhere before, or is this the global first application? |
| Fleet effect / repetition | Is this one of a series of same-design builds (Korea's APR1400 fleet) or a one-off? |
| Contracting and risk allocation | Fixed-price EPC vs. cost-plus/alliance — who eats the overrun, and what does that do to vendor pricing and incentives? |
| Site selection and site-specific engineering | Seismic, cooling water, grid connection distance, geotechnical conditions, permitting complexity |
| Owner project-management capability | Has this utility/owner run a comparable megaproject before? |
| Domestic workforce and human capital | Does the country have existing nuclear engineers, operators, and regulatory staff, or is it starting from zero? |
| Currency and inflation exposure | Foreign-currency-denominated financing over a decade-long build; contract indexing quality |

## Group B — Financeability & Political Durability

*Determines whether the project can be funded and survives to completion.*

| Dimension | What it captures |
|---|---|
| Financing structure and cost of capital | Public/sovereign-backed vs. merchant/private financing — a major share of total lifecycle cost for a long-payback capital asset |
| Revenue and market structure | Regulated rate base with cost recovery, contract-for-differences (Hinkley Point C), state-backed PPA, or open merchant exposure |
| Regulatory stability during construction | Does licensing change mid-build? Does the regulator have precedent with this design? |
| Political and public acceptance durability | Risk of election/referendum/policy reversal cancelling the program outright — the binary go/no-go risk, distinct from cost inflation |

## Group C — Long-Term Lifecycle Liability

*Costs and risks that emerge after commissioning, over the plant's operating
life — lower weight for construction-phase solvency, higher weight for
lifecycle resilience.*

| Dimension | What it captures |
|---|---|
| Fuel cycle economics | Front-end (mining, conversion, enrichment, fabrication) supply security and cost; back-end (spent fuel storage, eventual disposal) as an open-ended liability where no permanent repository exists |
| Decommissioning fund adequacy | Whether a ring-fenced fund accumulates during operation to cover eventual dismantling, or whether it's unfunded |

## Group D — Context Modifier (not a cost dimension)

*Reweights how much cost/risk premium is rational for a given country —
applied across all of the above rather than sitting alongside them.*

**Energy security and natural resource context.** A pure cost comparison asks
whether nuclear is cheaper than the next-best alternative in that market. But
a country with no domestic fossil fuel resources and heavy import dependence
is also buying a hedge against price volatility and geopolitical supply
disruption — value that never appears in a construction-cost spreadsheet.
That's why countries build nuclear even when it isn't the cheapest marginal
source on paper. Two related effects to model:

- **Domestic uranium reserves** (Kazakhstan, Canada, Australia, Niger) reduce
  front-end fuel supply risk — a sub-factor feeding into the fuel-cycle
  dimension in Group C, not a separate axis.
- **Import dependence / resource endowment** changes the bar a country
  *should* accept. A country with cheap domestic gas or hydro faces a higher
  bar to justify nuclear on economics alone; a resource-poor, import-dependent
  country should rationally tolerate a higher cost premium for the same
  resilience benefit. The same overrun that looks irrational in one country
  is a reasonable investment in another — this axis is what recalibrates the
  read on Groups A–C per country.

## How this should shape the data model

Rather than a single cost-per-MW figure, each tracked project should carry a
value (or qualitative rating, where hard numbers aren't public) on every
dimension in Groups A–C, plus the Group D context tags for the country. That
lets a user filter/compare: "show me every first-of-a-kind AP1000-class build
regardless of country" or "show me every project with regulated-rate-base
financing vs. merchant exposure" — and see which dimensions actually
correlate with staying on budget, rather than just seeing a cost league
table.

Group 0 (pre-FID) data already has a home in the existing `infrastructure_issues`
and `plant_milestones` tables — it doesn't need a new schema, just an explicit
link from a newcomer program's record to its Groups A–D record once (if) it
reaches FID. That link is what turns nucleargo from two separate products
(newcomer tracker + established-nation benchmarks) into one continuous
lifecycle view: a newcomer country should eventually be able to see its own
Group 0 status *and* the Group A–D outcomes of every comparable country that
made it past FID, in one place.

## Open items

- No single public database covers all of these dimensions across countries —
  will require compiling from IAEA PRIS (status/schedule, not cost),
  academic cost datasets (Lovering et al., MIT), national regulator/audit
  filings, and utility disclosures on a project-by-project basis.
- Need to decide: quantitative fields where data exists, qualitative
  ratings/tags where it doesn't, or both with a confidence/sourcing flag per
  field (similar to the verification convention already used in
  `supply-chain-directory-draft.md`, and now demonstrated per-dimension in
  `lib/data/established-programs.ts`).
- Country scope for v1 of the comparison set still open — established nuclear
  nations (US, France, UK, Canada, South Korea, Japan, China, Russia, India,
  Sweden, etc.) vs. phasing in a subset first.
- Group A–D dimensions are the best-evidenced set from one populated case
  (Vogtle), not a closed taxonomy — module/component supply chain quality,
  transmission/grid buildout cost, long-horizon interest-rate risk, and
  insurance/liability regime are currently folded into other dimensions
  rather than broken out; revisit once a second country (e.g. South Korea) is
  populated.
- Group 0 dimensions are drafted from general knowledge of the IAEA Milestones
  Approach and are not yet individually sourced/verified the way the Vogtle
  entry's Groups A–C are.
