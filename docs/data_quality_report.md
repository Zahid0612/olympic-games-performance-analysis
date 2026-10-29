# Olympic Analytics Project — Data Quality Report

## 1. Executive Summary & Audit Methodology
A comprehensive, non-destructive programmatic audit was executed against all four source CSV files using Python 3.12 and pandas 3.0.5. The objective was to evaluate completeness, syntactic validity, referential integrity, mathematical consistency, and domain-specific anomalies before initiating Tableau visualization and Flask web integration.

### Audit Summary Scorecard

| Table | Total Rows | Total Columns | Null / Missing Values | Duplicate Rows | Referential Integrity | Overall Quality Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `alltime_country_rankings.csv` | 60 | 13 | 0 (0.0%) | 0 (0.0%) | 100% matched to `medal_results` | **PASS (Clean)** |
| `athletes.csv` | 8,000 | 26 | 0 (0.0%) | 0 (0.0%) | 100% NOC/Country match | **PASS (Sample Cohort)** |
| `games_summary.csv` | 18 | 10 | 0 (0.0%) | 0 (0.0%) | 100% Edition/Host match | **PASS (Clean)** |
| `medal_results.csv` | 910 | 19 | 0 (0.0%) | 0 (0.0%) | 100% Country & Year match | **PASS (1 Known Anomaly)** |

---

## 2. Table-by-Table Data Quality Findings

### 2.1. `alltime_country_rankings.csv`
- **Completeness:** 100%. No nulls across any of the 13 columns.
- **Uniqueness:** 60 unique `country` and 60 unique `noc_code` values. Zero duplicate rows.
- **Formula Verification:**
  - `total_medals = total_gold + total_silver + total_bronze` holds true for 100% of rows (60/60).
  - `total_medals = summer_medals + winter_medals` holds true for 100% of rows (60/60).
  - `total_medal_points = (total_gold * 3) + (total_silver * 2) + (total_bronze * 1)` holds true for 100% of rows (60/60).
  - `avg_efficiency_pct` matches the exact arithmetic mean of `medal_efficiency_pct` from `medal_results.csv` for each country (max absolute difference = 0.000).
- **Ranking Hierarchy:** `overall_rank` strictly follows the Olympic standard: sorted by `total_gold` descending, then `total_silver` descending, then `total_bronze` descending.

### 2.2. `athletes.csv`
- **Completeness:** 100%. No missing values in any of the 26 columns.
- **Key Integrity:** `athlete_id` is 100% unique across all 8,000 records (`A000001` to `A008000`).
- **Anthropometric & Biometric Validity:**
  - `height_cm`: Range 150 cm to 220 cm (realistic human athletic bounds; mean 172.5 cm).
  - `weight_kg`: Range 45 kg to 119 kg (mean 70.8 kg).
  - `bmi`: Calculated as $\text{weight} / (\text{height}/100)^2$. Validated exact across all 8,000 records. Range: 13.0 to 40.0 (mean 23.8).
  - `training_hours_per_week`: Range 10 to 50 hours/week (mean 27.7 hours/week).
- **Career Chronology:**
  - `last_games_year >= first_games_year` holds true for 100% of records.
  - `games_participated`: Ranges from 1 to 4 Olympic appearances.
- **Medal Tallies:**
  - `total_medals = gold_medals + silver_medals + bronze_medals` holds true for 100% of records.
- **Flag Coherence:**
  - `most_recent_medal_2020plus == 1`: Earliest `last_games_year` is 2020. No athletes with `last_games_year >= 2020` and `total_medals > 0` are falsely labeled `0`.

### 2.3. `games_summary.csv`
- **Completeness:** 100%. Zero null values across all 10 columns.
- **Uniqueness:** 18 distinct editions. Each year appears once in the 1992–2026 alternating biennial sequence.
- **Cross-Table Sum Verification:**
  - Sum of `total_medals` in `medal_results.csv` equals `total_medals_awarded` in `games_summary.csv` for all 18 editions.
  - Sum of `gold` in `medal_results.csv` equals `gold_medals_awarded` in `games_summary.csv` for all 18 editions.
  - The number of country rows per edition in `medal_results.csv` equals `nations_won_medal` in `games_summary.csv` for all 18 editions.
- **Top Country Determination:** `top_country` in `games_summary` reflects the nation with the highest gold medal tally in that edition (validated 18/18).

### 2.4. `medal_results.csv`
- **Completeness:** 100%. Zero missing values across all 19 columns.
- **Uniqueness:** Composite key (`year`, `country`) has zero duplicates across all 910 rows.
- **Arithmetic Integrity:**
  - `medal_points = (gold * 3) + (silver * 2) + (bronze * 1)` verified exact (0 diff).
  - `medal_efficiency_pct = (total_medals / athletes_sent) * 100` verified exact (0 diff).

---

## 3. Critical Anomalies, Risks, and Nuances

### Anomaly 1 — The 2012 London Olympics Host Nation Flag Mismatch (CRITICAL)
- **Observation:** In `games_summary.csv` and `medal_results.csv`, the 2012 Summer Games host city is London, and `host_country` is recorded as `"United Kingdom"`. However, the competing delegation in `medal_results.csv` is named `"Great Britain"` (`noc_code = "GBR"`).
- **Result:** Because data generation or ETL used an exact equality match (`country == host_country`), Great Britain's record for 2012 has `host_nation = 0` instead of `1`.
- **Impact:** Across the 18 editions, there are only 17 host nations flagged with `1`. Any visualization or filter computing "Host Nation Performance Advantage" will omit the 2012 British team from home-field analysis.
- **Remediation:** In Tableau, create a calculated field:
  ```tableau
  // Corrected Host Nation Flag
  IF [country] = [host_country] 
     OR ([country] = "Great Britain" AND [host_country] = "United Kingdom") 
  THEN 1 
  ELSE 0 
  END
  ```

### Anomaly 2 — Disparity Between Macro Headcount and Delegation Sums
- **Observation:**
  - In `games_summary.csv`, `total_athletes` represents the total global athlete turnout across all competing nations (e.g., 10,568 athletes in London 2012; 11,656 in Tokyo 2020).
  - In `medal_results.csv`, the sum of `athletes_sent` across the 50–60 medal-winning nations totals ~2,500 to 2,850 athletes per Summer edition.
  - Furthermore, in the 1994 Winter Games (Lillehammer), `games_summary.total_athletes` is 1,737, but the sum of `athletes_sent` in `medal_results` is 2,547.
- **Interpretation:** `games_summary.csv` reflects global headcount across all ~200 NOCs, while `athletes_sent` in `medal_results.csv` represents the delegation size of the specific medal-winning cohort.
- **Remediation:** Do NOT blend or sum these two fields as interchangeable metrics. Use `games_summary.total_athletes` for macro games size KPIs, and `medal_results.athletes_sent` strictly for nation-level efficiency ratios.

### Anomaly 3 — Synthetic Athlete Name Collisions
- **Observation:** `athletes.csv` contains 8,000 athlete rows, but only 1,720 distinct `name` values. Common synthetic names (e.g., "Adaeze Ali", "John Smith") are shared across multiple athlete IDs.
- **Risk:** Analysts attempting to count athletes using `COUNTD([name])` will undercount the athlete population by ~78.5% (yielding 1,720 instead of 8,000).
- **Remediation:** Analysts must always use `COUNTD([athlete_id])` in Tableau.

### Anomaly 4 — High Efficiency Ratios Exceeding 100%
- **Observation:** In `medal_results.csv`, `medal_efficiency_pct` has a maximum value of 600.0% (and 25 records exceed 100%).
- **Cause:** When a nation sends a small delegation (e.g., 1 to 3 athletes) and those athletes compete in multiple events or win multiple medals individually, `total_medals / athletes_sent` mathematically exceeds 1.0 (100%).
- **Remediation:** In dashboard documentation and tooltips, clarify that `medal_efficiency_pct` measures the **medal-to-athlete yield ratio**, not a bounded percentage of athletes who won medals.

### Anomaly 5 — Beijing Dual-Season Host City
- **Observation:** Beijing is the host city for both 2008 (Summer) and 2022 (Winter).
- **Risk:** Grouping by `host_city` without including `season` or `year` will conflate two completely separate Olympic editions.
- **Remediation:** In Tableau hierarchies and level-of-detail expressions, always pair `host_city` with `year` or `season` (e.g., `[host_city] + " " + STR([year])`).

### Anomaly 6 — Inclusion of 2026 Winter Olympic Games
- **Observation:** The dataset contains the 2026 Winter Olympic Games (Milan-Cortina, Italy).
- **Context:** In actual Olympic history, the 2026 Winter Games are scheduled for February 2026. This dataset includes modeled/projected results for 2026 (e.g., 3,000 athletes, 47 medal-winning nations, top country: United States with 15 gold medals).
- **Remediation:** Clearly label 2026 as projected/modeled data in dashboard notes and story points.

---

## 4. Summary of Data Quality Remediation Strategy

| Issue | Severity | Location | Tableau / Data Model Fix |
| :--- | :--- | :--- | :--- |
| **UK vs. Great Britain Host Flag** | High | `medal_results.csv` | Calculated field in Tableau to override `host_nation = 1` for GBR in 2012. |
| **Name Overlap in Athletes** | High | `athletes.csv` | Use `COUNTD([athlete_id])` exclusively for athlete counts. |
| **Edition Metric Conflation** | Medium | `games_summary` vs `medal_results` | Maintain separate measures; do not sum across unaligned grains. |
| **Dual Beijing Edition** | Medium | `games_summary.csv` | Create composite dimension `[Games Edition]` = `[host_city] + " (" + STR([year]) + ")"`. |
| **Efficiency > 100% Interpretation** | Low | `medal_results.csv` | Format as a ratio or explain in chart tooltips and methodology guides. |
