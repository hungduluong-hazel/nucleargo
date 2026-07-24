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

Two distinct sub-questions sit inside "economically without going bankrupt,"
and they should stay separate rather than collapsing into one cost number:

1. **Construction-phase solvency** — will this specific project stay on
   budget and schedule and actually get finished?
2. **Lifecycle economic resilience** — once built, is the program
   economically sound over the plant's 60+ year life (fuel, waste,
   decommissioning)?

A project can be strong on one and exposed on the other.

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

## Open items

- No single public database covers all of these dimensions across countries —
  will require compiling from IAEA PRIS (status/schedule, not cost),
  academic cost datasets (Lovering et al., MIT), national regulator/audit
  filings, and utility disclosures on a project-by-project basis.
- Need to decide: quantitative fields where data exists, qualitative
  ratings/tags where it doesn't, or both with a confidence/sourcing flag per
  field (similar to the verification convention already used in
  `supply-chain-directory-draft.md`).
- Country scope for v1 of the comparison set still open — established nuclear
  nations (US, France, UK, Canada, South Korea, Japan, China, Russia, India,
  Sweden, etc.) vs. phasing in a subset first.
