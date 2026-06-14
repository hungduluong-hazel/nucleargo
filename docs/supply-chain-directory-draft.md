# Supply Chain Directory — Page & Seed Draft

> Status: draft for review. All supplier descriptions below are illustrative
> starting points — verify scope, current contract status, and certifications
> before publishing or marking `is_public = true`.

## Page structure: `/suppliers`

**Tier 1 (public):** directory grid — name, logo, HQ country, reactor tech tags,
category tags. No descriptions or certification detail.

**Tier 2 (registered):** full directory — descriptions, certifications,
localization flag, filter by category / reactor tech / country program.

**Tier 3 (workspace, Phase 3):** "Supply Chain" tab on a plant page — shows
`plant_suppliers` rows for that plant (role, contract status, linked milestone).

### Filters
- Category (reactor island, I&C/DCS, fuel fabrication, heavy components,
  engineering/owner's engineer, construction, training/simulators)
- Reactor technology (VVER-1200, APR-1400, AP1000, EPR)
- Supplier tier (OEM/prime, Tier 1, Tier 2, local partner)
- Country program (Vietnam, Poland)
- Local content only (toggle)

---

## Seed entries (draft — verify before use)

Verified against web search (June 2026) where noted; others still need sourcing.

| Name | HQ | Supplier tier | Categories | Reactor tech | Relevant program | Verification |
|---|---|---|---|---|---|---|
| Rosatom (ASE / Atomstroyexport) | Russia | oem_prime | reactor_island, engineering, construction | VVER-1200 | Vietnam | ✅ Intergovernmental agreement signed 23 Mar 2026 for Ninh Thuan 1, 2×VVER-1200 (Leningrad II design), 2,400 MW |
| PECC2 (Power Engineering Consulting JSC 2) | Vietnam | local_partner | engineering | VVER-1200 | Vietnam (local content) | ✅ Signed agreement with Rosatom (Sept 2025) to update the Ninh Thuan 1 feasibility study — good local-content entry, not AtkinsRéalis |
| Westinghouse Electric Company | USA | oem_prime | reactor_island, fuel_fabrication, i_c_dcs | AP1000 | Poland | ✅ Amended Engineering Development Agreement w/ PEJ signed 29 Dec 2025; EXIM financing announced Feb 2026 |
| Bechtel | USA | tier1 | engineering, construction | AP1000 | Poland | ✅ Part of Westinghouse–Bechtel Consortium delivering EDA for Lubiatowo-Kopalino site — add as separate entry, link to same project |
| Korea Hydro & Nuclear Power (KHNP) | South Korea | — | — | — | Poland | ❌ RESOLVED — DO NOT LIST. KHNP formally withdrew from the Pątnów project in **August 2025** (confirmed by KHNP President Whang Joo-ho, citing Poland's new government's energy policy change — the 4th European withdrawal since the Jan 2025 Westinghouse settlement) |
| KEPCO E&C / Doosan Enerbility | South Korea | — | — | — | Poland | ❌ RESOLVED — DO NOT LIST. "Team Korea" MOUs with Polish suppliers were tied to the APR1400/Pątnów bid, which KHNP exited Aug 2025 |
| PGE PAK Energia Jądrowa | Poland | local_partner | engineering, construction | TBD — technology unassigned | Poland (project company) | ✅ RESOLVED — keep, but **remove the APR-1400 tag**. PGE acquired ZE PAK's 50% stake (Oct 2025), taking full ownership. Pątnów's reactor technology is now open ("clearing way for US" per reporting) |
| Framatome | France | tier1 | fuel_fabrication, i_c_dcs, heavy_components | EPR, VVER-1200, AP1000 | Vietnam, Poland | ⚠️ No confirmed role found for either program — remove unless sourced |
| GE Vernova (incl. GE Hitachi Nuclear) | USA | tier1 | i_c_dcs, heavy_components | AP1000, EPR | Poland | ⚠️ Not yet verified for these specific programs |
| AtkinsRéalis | Canada | tier1 | engineering | VVER-1200, APR-1400, AP1000 | Vietnam, Poland | ⚠️ No owner's-engineer role found for Ninh Thuan — PECC2 appears to hold that role instead (see above). Keep AtkinsRéalis only if you have a separate, current source |
| LILAMA | Vietnam | local_partner | construction, heavy_components | VVER-1200 | Vietnam (local content) | ⚠️ Not yet verified for current Ninh Thuan revival |
| Polimex-Mostostal / ZRE Katowice | Poland | local_partner | construction, heavy_components | AP1000 | Poland (local content) | ⚠️ Not yet verified for current AP1000 project |

### Notes for each entry, once verified
- `description_en` / `description_vi` — 2–3 sentence summary of what they do
  and their role in the relevant program
- `certifications` — only list certs you can source/cite (ASME N-stamp,
  RCC-M, NQA-1, ISO 19443, ISO 9001)
- `is_featured` — reserve for confirmed primes/contracted suppliers, not
  prospective ones
- `is_local_content` — true only for entities domiciled in the program
  country, to support the IAEA Issue 11 localization narrative

---

## ✅ RESOLVED: KHNP / Poland status conflict

**Finding:** KHNP formally withdrew from the Pątnów (APR-1400) project in
**August 2025** — confirmed on the record by KHNP's president, citing Poland's
new government's energy policy shift. It's the 4th European bid KHNP has
dropped since settling its IP dispute with Westinghouse in January 2025
(also withdrew from Sweden, Slovenia, Netherlands). In October 2025, PGE
moved to acquire ZE PAK's 50% stake in PGE PAK Energia Jądrowa, taking full
ownership of the project company. Pątnów's reactor technology is now
unassigned — multiple reports frame this as "clearing the way for US"
(i.e. Westinghouse / AP1000, already active at Lubiatowo-Kopalino).

**Implication for your live site — DONE:** `lib/i18n/en.ts` and `vi.ts` have
been updated. `pl_kr_role`/`pl_kr_tech`/`pl_kr_agreement` now read "Withdrawn
— second-site bid" / "APR-1400 (KHNP)" / "KHNP withdrew from Pątnów bid, Aug
2025" instead of presenting APR-1400/KEPCO as an active alternative
technology with a 2022 MOU. The unsupported "April 2026 Korea Eximbank/
APR-1400" `pl_dev1` entry was replaced with the verified March 2026 PEJ
construction-permit-application story (40,000+ page PSAR submitted to PAA,
six months ahead of schedule, decision expected within 24 months).

In `components/public/PolandContent.tsx`: added a new `'withdrawn'`
`PartnerStatus` variant (gray badge, `PARTNER_BADGE_STYLES.withdrawn`), wired
the South Korea partner card to it via the new `pl_badge_withdrawn`
translation key (added to both en.ts and vi.ts), and changed `pl_dev1`'s
category from `Partnership`/`pl_cat_partnership` to `Regulatory`/
`pl_cat_regulatory` to match its new content. Checked `scripts/seed.ts` —
no Poland-KR/APR-1400 rows exist there, so no changes needed.

**Implication for the supply chain directory:** KHNP, KEPCO E&C, and Doosan
Enerbility are removed from the seed list for Poland. PGE PAK Energia Jądrowa
stays as the Pątnów project company but without an APR-1400 tag (technology
TBD).

## Next steps
1. ✅ DONE — updated `pl_kr_*` and `pl_dev1` content in `lib/i18n/en.ts` /
   `vi.ts` to reflect KHNP's withdrawal; confirmed `seed.ts` has no related
   Poland-KR rows.
2. Verify remaining ⚠️ entries above the same way the ✅ ones were checked —
   targeted searches like "[supplier] [reactor tech] [country] contract 2026"
   against World Nuclear News, World Nuclear Association country profiles,
   and the OEM's own press releases. Re-run this before each
   publish/seed pass since program status changes quickly (e.g. Vietnam went
   from "paused" to a signed intergovernmental agreement within months).
3. Source logos (use official press kit assets where available, flagcdn.com
   for country flags per existing convention)
4. Build `/suppliers` page (Tier 1/2) off the `suppliers` table, seeding only
   ✅ entries initially (Rosatom, PECC2, Westinghouse, Bechtel)
5. Phase 3: build the "Supply Chain" tab on plant pages off `plant_suppliers`
