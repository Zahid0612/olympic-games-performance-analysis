# Olympic Analytics Project — Data Inventory

## 1. Overview and Workspace Context
This document catalogs the existing raw datasets provided for the course project **"Olympic Games Performance and Medal History"**. All datasets are housed locally in the workspace directory and represent multi-dimensional data spanning historical Olympic performance, athlete-level demographics and physical metrics, country-level longitudinal rankings, and game-edition summaries.

### Technical Environment & Workspace Setup
- **Workspace Root:** `c:\Users\Hp\Desktop\olympic`
- **Operating System:** Windows 11 / Windows Server Environment
- **Current Workspace State:** Green-field workspace containing 4 source CSV files. No prior source code repository, virtual environment, or web framework exists yet in the workspace root.
- **Data Processing Stack:** Python 3.12.4 with pandas 3.0.5 (used for non-destructive data auditing and verification).
- **Target Visualization & Web Platform:** Tableau Desktop (data modeling and visual analytics) integrated with Python Flask (embedded web application delivery in Phase 8).

---

## 2. File Manifest & Storage Details

| File Name | Absolute Path | File Size | Storage Format | Encoding |
| :--- | :--- | :--- | :--- | :--- |
| `alltime_country_rankings.csv` | `c:\Users\Hp\Desktop\olympic\alltime_country_rankings.csv` | 3,385 bytes | CSV (Comma Delimited) | UTF-8 |
| `athletes.csv` | `c:\Users\Hp\Desktop\olympic\athletes.csv` | 986,235 bytes | CSV (Comma Delimited) | UTF-8 |
| `games_summary.csv` | `c:\Users\Hp\Desktop\olympic\games_summary.csv` | 1,204 bytes | CSV (Comma Delimited) | UTF-8 |
| `medal_results.csv` | `c:\Users\Hp\Desktop\olympic\medal_results.csv` | 89,084 bytes | CSV (Comma Delimited) | UTF-8 |

> **Audit Policy Compliance:** Original files remain pristine and untouched. No substitute datasets were downloaded, and no source files were deleted, moved, or renamed.

---

## 3. High-Level Dataset Profiles

### 3.1. `alltime_country_rankings.csv`
- **Domain:** Longitudinal Country-Level Performance Benchmark
- **Row Count:** 60 records
- **Column Count:** 13 attributes
- **Granularity (Grain):** One record per participating country / National Olympic Committee (NOC).
- **Primary Entity:** Nation / NOC (`country`, `noc_code`).
- **Temporal Coverage:** Cumulative aggregate over 18 Olympic editions (1992–2026).
- **Core Metrics:** `games_entered`, `total_gold`, `total_silver`, `total_bronze`, `total_medals`, `total_medal_points`, `avg_efficiency_pct`, `summer_medals`, `winter_medals`, `overall_rank`.
- **Analytical Role:** Benchmarking country dominance, historical ranking leaderboards, and seasonal medal distribution (Summer vs. Winter split).

### 3.2. `athletes.csv`
- **Domain:** Individual Athlete Profiles, Biometrics, and Career Achievements
- **Row Count:** 8,000 records
- **Column Count:** 26 attributes
- **Granularity (Grain):** One record per individual athlete (`athlete_id`).
- **Primary Entity:** Athlete (`athlete_id`, `name`).
- **Temporal Coverage:** Career span across Olympic editions from 1992 through 2026 (`first_games_year`, `last_games_year`).
- **Core Metrics:** Physical attributes (`height_cm`, `weight_kg`, `bmi`), training metrics (`training_hours_per_week`), career longevity (`games_participated`), world rank (`personal_best_rank_world`), medal totals (`gold_medals`, `silver_medals`, `bronze_medals`, `total_medals`), and flags (`world_record_holder`, `professional_athlete`, `doping_violation`, `most_recent_medal_2020plus`).
- **Analytical Role:** Athlete demographic and biometric correlation analysis, sport-specific physical profiling, training regimen impacts, and athlete longevity studies.

### 3.3. `games_summary.csv`
- **Domain:** Olympic Edition Macro Statistics & Host City Context
- **Row Count:** 18 records
- **Column Count:** 10 attributes
- **Granularity (Grain):** One record per Olympic Games edition (`year`, `season`).
- **Primary Entity:** Olympic Games Edition (`year`, `season`, `host_city`).
- **Temporal Coverage:** 18 Olympic Games editions (9 Summer, 9 Winter) from 1992 through 2026.
- **Core Metrics:** Macro athlete headcount (`total_athletes`), participating nations (`participating_nations`), total medals awarded (`total_medals_awarded`, `gold_medals_awarded`), medal-winning nations (`nations_won_medal`), and top-performing country (`top_country`).
- **Analytical Role:** Macro-level trends in Olympic expansion (participation growth over time), global medal dispersion, host nation geographic tracking, and games-level KPI cards.

### 3.4. `medal_results.csv`
- **Domain:** Country-Edition Olympic Results & Socio-Economic Indicators
- **Row Count:** 910 records
- **Column Count:** 19 attributes
- **Granularity (Grain):** One record per Country per Olympic Edition (`year`, `season`, `country` / `noc_code`).
- **Primary Entity:** National Delegation Event Result (`year`, `season`, `country`).
- **Temporal Coverage:** 18 Olympic Games editions (1992–2026 across Summer and Winter).
- **Core Metrics:** Delegation size (`athletes_sent`), medal tallies (`gold`, `silver`, `bronze`, `total_medals`), weighted performance score (`medal_points`), efficiency ratio (`medal_efficiency_pct`), socio-economic variables (`gdp_tier`, `population_million`, `sports_investment`), host nation indicator (`host_nation`), and primary discipline (`top_sport`).
- **Analytical Role:** Core transactional/fact table for time-series medal trajectories, host country advantage analysis, efficiency modeling (medals per athlete sent), and macroeconomic impact studies.

---

## 4. Dataset Role & Functional Matrix

| Requirement Area | Primary Table | Supporting Table | Notes |
| :--- | :--- | :--- | :--- |
| **All-Time Nation Rankings** | `alltime_country_rankings.csv` | `medal_results.csv` | `alltime_country_rankings` holds pre-computed totals; can also be dynamically aggregated from `medal_results`. |
| **Edition-by-Edition Trends** | `medal_results.csv` | `games_summary.csv` | Connects country outcomes with macro games dimensions (host city, total nations). |
| **Host Nation Advantage** | `medal_results.csv` | `games_summary.csv` | Uses `host_nation` flag and host city context to compare home vs. away performance. |
| **Athlete Biometrics & Sports** | `athletes.csv` | None (Independent Grain) | Contains athlete-level records; must remain unjoined or related at country level without row explosion. |
| **Macro Participation Trends** | `games_summary.csv` | None | Source of truth for total global athletes and total participating NOCs per games edition. |

---

## 5. Storage & File Access Guidelines
1. The 4 CSV files must be kept in their original workspace path: `c:\Users\Hp\Desktop\olympic\`.
2. Tableau Desktop can connect directly to this folder as a **Text File** connector.
3. Automated validation scripts or ETL routines should be isolated inside dedicated utility directories (`scripts/` or `src/`) to ensure source data files remain unaltered.
