# Olympic Analytics Project — Tableau Field Configuration & Role Specifications

This document outlines the field metadata, role classifications, data types, geographic roles, default aggregations, and calculated field formulas for all fields across the Tableau data model.

---

## 1. Data Source 1: `Olympic Games and Medal Results`

Root Table: `medal_results.csv` | Related Table: `games_summary.csv`

### 1.1. Field Configuration Matrix

| Field Name | Source Table | Inferred Raw Type | Tableau Data Type | Tableau Role | Default Aggregation | Geographic Role | Description / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `country` | `medal_results` | String | String | Dimension | None | **Country/Region** | Primary geographic identifier for choropleth maps. Matches Tableau geocoding 100%. |
| `host_country` | `medal_results` | String | String | Dimension | None | **Country/Region** | Host nation identifier. |
| `host_city` | `medal_results` | String | String | Dimension | None | **City** | Host city. Maps directly to Tableau world cities. |
| `noc_code` | `medal_results` | String | String | Dimension | None | *None (Categorical)* | 3-letter IOC code. IOC codes are not ISO standard and lack native Tableau geo-coding; use `country` for mapping. |
| `region` | `medal_results` | String | String | Dimension | None | *None (Categorical)* | Continental region (7 categories). **No native Tableau geographic role exists for global continents/regions.** Use as categorical dimension or create custom geographic territories. |
| `season` | `medal_results` | String | String | Dimension | None | None | Categorical dimension: `Summer` vs. `Winter`. |
| `year` | `medal_results` | Integer | Number (whole) | Dimension | None | None | Discrete dimension for bar/column headers; convert to Continuous (`Date` or green measure) for trendlines. |
| `gdp_tier` | `medal_results` | String | String | Dimension | None | None | Socioeconomic tier: `High`, `Medium`, `Low`. |
| `sports_investment`| `medal_results` | String | String | Dimension | None | None | Institutional investment tier: `High`, `Medium`, `Low`. |
| `top_sport` | `medal_results` | String | String | Dimension | None | None | Nation's most successful discipline in that edition. |
| `host_nation` | `medal_results` | Integer | Number (whole) / Boolean | Dimension | None | None | Binary flag. Raw data contains 2012 UK mismatch. |
| `athletes_sent` | `medal_results` | Integer | Number (whole) | Measure | `SUM` | None | Delegation headcount sent by this country to this edition. |
| `gold` | `medal_results` | Integer | Number (whole) | Measure | `SUM` | None | Gold medal count. |
| `silver` | `medal_results` | Integer | Number (whole) | Measure | `SUM` | None | Silver medal count. |
| `bronze` | `medal_results` | Integer | Number (whole) | Measure | `SUM` | None | Bronze medal count. |
| `total_medals` | `medal_results` | Integer | Number (whole) | Measure | `SUM` | None | Total medals (`gold + silver + bronze`). |
| `medal_points` | `medal_results` | Integer | Number (whole) | Measure | `SUM` | None | Weighted medal score (`gold*3 + silver*2 + bronze*1`). |
| `medal_efficiency_pct`| `medal_results` | Float | Number (decimal) | Measure | `AVG` | None | Pre-calculated efficiency ratio: `(total_medals / athletes_sent) * 100`. |
| `population_million` | `medal_results` | Integer | Number (whole) | Measure | **`AVG`** | None | **Warning:** Must default to `AVG`. Summing across multiple editions artificially inflates national population. |
| `total_athletes` | `games_summary` | Integer | Number (whole) | Measure | **`AVG` / `MAX`** | None | Global Olympic headcount for the games edition. |
| `participating_nations`| `games_summary` | Integer | Number (whole) | Measure | **`AVG` / `MAX`** | None | Total participating NOCs in the games edition. |
| `total_medals_awarded` | `games_summary` | Integer | Number (whole) | Measure | **`AVG` / `MAX`** | None | Global medal pool awarded in that edition. |
| `gold_medals_awarded` | `games_summary` | Integer | Number (whole) | Measure | **`AVG` / `MAX`** | None | Total gold medals awarded in that edition. |
| `nations_won_medal` | `games_summary` | Integer | Number (whole) | Measure | **`AVG` / `MAX`** | None | Number of nations winning at least 1 medal. |
| `top_country` | `games_summary` | String | String | Dimension | None | **Country/Region** | Edition gold-medal champion. |

---

## 2. Data Source 2: `Olympic Athletes`

Root Table: `athletes.csv` (Independent Data Source)

### 2.1. Field Configuration Matrix

| Field Name | Inferred Raw Type | Tableau Data Type | Tableau Role | Default Aggregation | Geographic Role | Description / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `athlete_id` | String | String | Dimension | `COUNTD` | None | **Primary Key.** 8,000 unique records. Always use `COUNTD([athlete_id])` for athlete counts. |
| `name` | String | String | Dimension | None | None | Athlete name. Shared across synthetic profiles (1,720 unique names); never use `COUNTD([name])`. |
| `gender` | String | String | Dimension | None | None | Categorical: `Female`, `Male`. |
| `country` | String | String | Dimension | None | **Country/Region** | Athlete's represented nation. Used for dashboard cross-filters. |
| `noc_code` | String | String | Dimension | None | None | 3-letter IOC code. |
| `region` | String | String | Dimension | None | None | Continental region. Categorical dimension. |
| `sport` | String | String | Dimension | None | None | Specific sport (50 distinct). |
| `sport_category`| String | String | Dimension | None | None | Grouping category (21 distinct). |
| `season` | String | String | Dimension | None | None | `Summer` vs. `Winter`. |
| `first_games_year`| Integer | Number (whole) | Dimension | None | None | Debut Olympic year. |
| `last_games_year` | Integer | Number (whole) | Dimension | None | None | Final/most recent Olympic year. |
| `world_record_holder`| Integer | Number / Boolean | Dimension | None | None | Binary flag: `1` if world record holder. |
| `professional_athlete`| Integer | Number / Boolean | Dimension | None | None | Binary flag: `1` if professional. |
| `doping_violation`| Integer | Number / Boolean | Dimension | None | None | Binary flag: `1` if doping violation incurred. |
| `most_recent_medal_2020plus`| Integer | Number / Boolean | Dimension | None | None | Binary flag: `1` if medal won $\ge$ 2020. |
| `age_at_peak` | Integer | Number (whole) | Measure | `AVG` | None | Age at career peak. |
| `height_cm` | Integer | Number (whole) | Measure | `AVG` | None | Athlete height (cm). |
| `weight_kg` | Integer | Number (whole) | Measure | `AVG` | None | Athlete weight (kg). |
| `bmi` | Float | Number (decimal) | Measure | `AVG` | None | Body mass index. |
| `training_hours_per_week`| Integer | Number (whole) | Measure | `AVG` | None | Weekly training dedication. |
| `personal_best_rank_world`| Integer | Number (whole) | Measure | `MIN` / `AVG` | None | Best world rank achieved. |
| `games_participated`| Integer | Number (whole) | Measure | `AVG` | None | Olympic career appearances. |
| `gold_medals` | Integer | Number (whole) | Measure | `SUM` | None | Career gold medals. |
| `silver_medals`| Integer | Number (whole) | Measure | `SUM` | None | Career silver medals. |
| `bronze_medals`| Integer | Number (whole) | Measure | `SUM` | None | Career bronze medals. |
| `total_medals` | Integer | Number (whole) | Measure | `SUM` | None | Career total medals. |

---

## 3. Geographic Role Audit & Limitation Notes

### Supported Geographic Roles
- **`country` & `host_country`:** Assigned Tableau's native **Country/Region** role. Tableau's internal geocoding database matches all 60 sovereign countries (e.g., United States, China, Germany, Brazil, Kenya, Australia) with 100% accuracy, generating Latitude and Longitude.
- **`host_city`:** Assigned Tableau's native **City** role. All 17 host cities (Barcelona, Lillehammer, Atlanta, Nagano, Sydney, Salt Lake City, Athens, Turin, Beijing, Vancouver, London, Sochi, Rio de Janeiro, PyeongChang, Tokyo, Paris, Milan-Cortina) match Tableau's internal world city coordinates.

### Fields Without Reliable Geographic Roles
- **`region` (Continental Region):**
  - **Limitation:** Tableau has no built-in geographic role for `"Europe"`, `"Asia"`, `"Africa"`, `"Oceania"`, `"North America"`, `"South America"`, or `"Europe/Asia"`.
  - **Handling:** Treat `region` as a **Categorical Dimension**. If regional filled maps are required, analysts should create a **Custom Territory / Geographic Group** inside Tableau by right-clicking `country` $\rightarrow$ Create $\rightarrow$ Group $\rightarrow$ Group by Region.
- **`noc_code` (IOC 3-Letter Code):**
  - **Limitation:** Tableau natively recognizes ISO 3166-1 alpha-3 country codes, but several IOC codes differ from ISO standards (e.g., `GER` vs `DEU`, `GRE` vs `GRC`, `SUI` vs `CHE`, `NED` vs `NLD`). Assigning a geographic role to `noc_code` can lead to unmatched geocoding errors.
  - **Handling:** Always use the full `country` name field for map visualizations. Use `noc_code` strictly as a concise label dimension for charts and tooltips.

---

## 4. Required Calculated Fields Specification

### Calculation 1: Host Nation Indicator (Remediates UK 2012 Anomaly)
- **Data Source:** `Olympic Games and Medal Results`
- **Field Name:** `[Host Nation (Corrected)]`
- **Formula:**
  ```tableau
  // Re-classifies Great Britain (2012) as host nation
  IF [country] = [host_country] 
     OR ([country] = "Great Britain" AND [host_country] = "United Kingdom") 
  THEN 1 
  ELSE 0 
  END
  ```
- **Verification:** Increases total host nation count from 17 to exactly 18 (1 host nation per edition).

### Calculation 2: Games Edition Composite Label
- **Data Source:** `Olympic Games and Medal Results`
- **Field Name:** `[Games Edition]`
- **Formula:**
  ```tableau
  // Differentiates duplicate cities (e.g. Beijing 2008 Summer vs Beijing 2022 Winter)
  [host_city] + " " + STR([year]) + " (" + [season] + ")"
  ```

### Calculation 3: Dynamic Weighted Medal Efficiency Ratio
- **Data Source:** `Olympic Games and Medal Results`
- **Field Name:** `[Weighted Medal Efficiency]`
- **Formula:**
  ```tableau
  // Computes aggregate points per athlete sent rather than average of percentages
  SUM([medal_points]) / SUM([athletes_sent])
  ```

### Calculation 4: BMI Category Classification
- **Data Source:** `Olympic Athletes`
- **Field Name:** `[BMI Category]`
- **Formula:**
  ```tableau
  IF [bmi] < 18.5 THEN "Underweight"
  ELSEIF [bmi] < 25.0 THEN "Normal Weight"
  ELSEIF [bmi] < 30.0 THEN "Overweight"
  ELSE "Obese"
  END
  ```

### Calculation 5: Career Longevity Tier
- **Data Source:** `Olympic Athletes`
- **Field Name:** `[Career Longevity Tier]`
- **Formula:**
  ```tableau
  IF [games_participated] = 1 THEN "1 Edition (Debut / Single)"
  ELSEIF [games_participated] = 2 THEN "2 Editions (Returning)"
  ELSE "3+ Editions (Veteran)"
  END
  ```
