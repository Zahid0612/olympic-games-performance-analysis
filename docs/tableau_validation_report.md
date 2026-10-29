# Olympic Analytics Project — Tableau Data Validation Report

## 1. Executive Summary & Validation Objective
This validation report provides quantitative proof that the proposed Tableau data connection architecture preserves data integrity, avoids metric inflation, and accurately reflects historical Olympic totals. All tests were executed against the actual source CSV files using Python 3.12 and pandas 3.0.5 to simulate Tableau's relational query behavior.

### Validation Scorecard

| Validation Test | Scope | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Medal Component Consistency** | `medal_results.csv` | Gold + Silver + Bronze = Total | $1,959 + 1,917 + 2,149 = 6,025$ | **PASS** |
| **Cross-Table Edition Sums** | `games_summary` vs `medal_results` | 18 editions match exactly | 18 of 18 editions match 100% | **PASS** |
| **Referential Integrity (Keys)** | `(year, season)` composite key | 0 unmatched records | 0 unmatched in both directions | **PASS** |
| **Country/NOC Key Matching** | Rankings, Medals, Athletes | 60 of 60 countries align | 60 of 60 NOCs match across all files | **PASS** |
| **Grain Inflation Protection** | Logical vs. Physical Join | 0% metric distortion | Inflation avoided via Logical Model | **PASS** |
| **2012 UK Host Status** | 2012 London Olympics | 18 host nations total | Corrected from 17 to 18 nations | **PASS** |

---

## 2. Baseline Medal Totals & Arithmetic Consistency

A baseline aggregation of `medal_results.csv` (910 records across 18 editions) establishes the ground truth:

$$\text{Gold (1,959)} + \text{Silver (1,917)} + \text{Bronze (2,149)} = \text{Total Medals (6,025)}$$

- **Total Transactional Records:** 910 rows
- **Sum of Gold Medals:** 1,959
- **Sum of Silver Medals:** 1,917
- **Sum of Bronze Medals:** 2,149
- **Sum of Total Medals:** 6,025
- **Sum of Weighted Medal Points:** 11,860
  - Verified: $(1,959 \times 3) + (1,917 \times 2) + (2,149 \times 1) = 5,877 + 3,834 + 2,149 = 11,860$
- **Total Athletes Sent (Delegations):** 47,208 athlete appearances

---

## 3. Edition-by-Edition Cross-Table Integrity

Every Olympic Games edition in `games_summary.csv` was compared against the sum of country results in `medal_results.csv`:

| Year | Season | Host City | Host Country | Games Summary Gold | Medals Sum Gold | Games Summary Total | Medals Sum Total | Nations Won Medal | Medals Table Rows | Match Status |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1992** | Summer | Barcelona | Spain | 107 | 107 | 329 | 329 | 56 | 56 | **EXACT MATCH** |
| **1994** | Winter | Lillehammer | Norway | 117 | 117 | 340 | 340 | 47 | 47 | **EXACT MATCH** |
| **1996** | Summer | Atlanta | United States | 99 | 99 | 326 | 326 | 53 | 53 | **EXACT MATCH** |
| **1998** | Winter | Nagano | Japan | 105 | 105 | 328 | 328 | 45 | 45 | **EXACT MATCH** |
| **2000** | Summer | Sydney | Australia | 102 | 102 | 305 | 305 | 55 | 55 | **EXACT MATCH** |
| **2002** | Winter | Salt Lake City | United States | 111 | 111 | 342 | 342 | 47 | 47 | **EXACT MATCH** |
| **2004** | Summer | Athens | Greece | 124 | 124 | 348 | 348 | 54 | 54 | **EXACT MATCH** |
| **2006** | Winter | Turin | Italy | 100 | 100 | 313 | 313 | 46 | 46 | **EXACT MATCH** |
| **2008** | Summer | Beijing | China | 109 | 109 | 357 | 357 | 56 | 56 | **EXACT MATCH** |
| **2010** | Winter | Vancouver | Canada | 97 | 97 | 339 | 339 | 47 | 47 | **EXACT MATCH** |
| **2012** | Summer | London | United Kingdom | 103 | 103 | 324 | 324 | 56 | 56 | **EXACT MATCH** |
| **2014** | Winter | Sochi | Russia | 112 | 112 | 342 | 342 | 44 | 44 | **EXACT MATCH** |
| **2016** | Summer | Rio de Janeiro | Brazil | 125 | 125 | 358 | 358 | 58 | 58 | **EXACT MATCH** |
| **2018** | Winter | PyeongChang | South Korea | 114 | 114 | 332 | 332 | 44 | 44 | **EXACT MATCH** |
| **2020** | Summer | Tokyo | Japan | 126 | 126 | 363 | 363 | 60 | 60 | **EXACT MATCH** |
| **2022** | Winter | Beijing | China | 109 | 109 | 326 | 326 | 43 | 43 | **EXACT MATCH** |
| **2024** | Summer | Paris | France | 104 | 104 | 319 | 319 | 52 | 52 | **EXACT MATCH** |
| **2026** | Winter | Milan-Cortina | Italy | 95 | 95 | 334 | 334 | 47 | 47 | **EXACT MATCH** |
| **TOTAL** | — | — | — | **1,959** | **1,959** | **6,025** | **6,025** | **910** | **910** | **100% MATCH** |

---

## 4. Logical Relationship vs. Physical Join Simulation

To demonstrate why **Tableau Logical Relationships** must be used instead of a physical SQL join, we simulated a physical Inner Join between `medal_results.csv` and `games_summary.csv` on `[year, season]`:

```
Physical Join Result: 910 merged rows
```

| Metric | Ground Truth (Native Table) | Naive Sum Under Physical Join | Inflation Factor | Distortion Risk |
| :--- | :---: | :---: | :---: | :--- |
| **Macro Athlete Count (`total_athletes`)** | 119,120 | 6,390,912 | **53.65x (5,365%)** | Massive overcounting; replicates edition headcount across every medal-winning country. |
| **Total Medals Awarded (`total_medals_awarded`)**| 6,025 | 305,054 | **50.63x (5,063%)** | Gross duplication of global medal pool. |
| **Country Total Medals (`total_medals`)** | 6,025 | 6,025 | 1.00x | Country medals remain accurate, but macro context is completely corrupted. |

### How Tableau Logical Relationships Prevent This
Tableau's **Logical Model** keeps `medal_results` and `games_summary` as distinct logical entities. When a visualization queries `total_athletes`, Tableau issues:
```sql
SELECT year, season, total_athletes FROM games_summary
```
Tableau never multiplies the parent table rows by the child table rows, preserving the exact 119,120 headcount.

---

## 5. Unmatched Relationship Keys Verification

Referential integrity was programmatically verified across all entity keys:

1. **`medal_results` $\longleftrightarrow$ `games_summary` on `(year, season)`:**
   - Keys in `medal_results` but missing in `games_summary`: **0**
   - Keys in `games_summary` but missing in `medal_results`: **0**
2. **`medal_results` $\longleftrightarrow$ `alltime_country_rankings` on `noc_code`:**
   - NOC codes in `medal_results` missing in `rankings`: **0**
   - NOC codes in `rankings` missing in `medal_results`: **0**
   - Exact 1-to-1 matching across all 60 sovereign nations.
3. **`athletes` $\longleftrightarrow$ `medal_results` on `noc_code`:**
   - NOC codes in `athletes` missing in `medal_results`: **0**
   - NOC codes in `medal_results` missing in `athletes`: **0**
   - All 8,000 athlete profiles map to the 60 countries in the medal tables.

---

## 6. Audit and Remediation of the 2012 UK Host Status

### Diagnostic Findings
- **Edition:** 2012 Summer Olympic Games, London
- **`games_summary.host_country`:** `"United Kingdom"`
- **`medal_results.country`:** `"Great Britain"` (`noc_code = "GBR"`)
- **Raw Flag Value:** `medal_results.host_nation = 0` (Failed string match on `"United Kingdom"` vs `"Great Britain"`)
- **Great Britain 2012 Performance:**
  - Gold: 8
  - Silver: 9
  - Bronze: 12
  - Total Medals: 29
  - Athletes Sent: 282
- **Raw Total Host Nation Flags in Dataset:** 17 (expected 18)

### Remediation Impact
Applying the Tableau calculated field:
```tableau
IF [country] = [host_country] 
   OR ([country] = "Great Britain" AND [host_country] = "United Kingdom") 
THEN 1 
ELSE 0 
END
```
- Restores the 2012 host flag for Great Britain.
- Brings total host nation occurrences to **exactly 18** (1 per edition).
- Enables host-nation advantage analysis without omitting the 2012 host.

---

## 7. Sign-off and Readiness for Phase 3

All quantitative validation criteria for Phase 2 have passed with 100% precision. The data model is mathematically validated and ready for Phase 3 (Data Preparation & Calculated Fields).
