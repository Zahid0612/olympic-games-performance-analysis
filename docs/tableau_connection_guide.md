# Olympic Analytics Project — Tableau Desktop Connection Guide

## 1. Connection Philosophy & Environment Notice
> **Important Environment Verification:** In this Phase 1 setup, Tableau Desktop is the target visual analytics platform. We have verified the directory structure, file formats, schemas, and data integrity using our Python inspection suite. The step-by-step instructions below guide the Tableau developer on exactly how to configure the connection inside Tableau Desktop.

---

## 2. Live Connection vs. Tableau Extract (.hyper)

### Recommendation: **Tableau Data Extract (.hyper)**

| Criterion | Live Connection | Tableau Data Extract (.hyper) | Recommendation & Rationale |
| :--- | :--- | :--- | :--- |
| **Data Size** | Total CSV files = ~1.08 MB (8,988 total rows). | Very small, lightweight footprint. | An extract will compile into a fast, portable `.hyper` file (< 500 KB). |
| **Performance** | File locking issues on Windows text files; slow text parsing. | In-memory columnar storage; sub-second query rendering. | **Extract is strongly recommended.** Tableau's Hyper engine optimizes string lookups and aggregations. |
| **Portability & Course Delivery** | Requires absolute file paths; breaks when moving to another PC. | Packaged Workbook (`.twbx`) embeds the extract seamlessly. | **Extract is essential for academic/course submission** so grading instructors can open the workbook without broken file links. |
| **Flask Integration (Phase 8)** | Not applicable. | Can be exported, queried, or published to Tableau Public / Tableau Server / embedded via JS API. | Extracts ensure stability during web embedding. |

---

## 3. Recommended Tableau Data Source Architecture

To preserve grain integrity and prevent Cartesian row inflation, we configure **two distinct data sources** in Tableau Desktop:

### Data Source 1: `Olympic Games & Medal Analysis` (Primary)
- **Primary Logical Table:** `medal_results.csv`
- **Related Logical Table:** `games_summary.csv`
- **Relationship Definition (Noodle):**
  - Match Field 1: `[year]` = `[year]`
  - Match Field 2: `[season]` = `[season]`
  - Cardinality: Many-to-One ($N : 1$).
- **Optional Related Table:** `alltime_country_rankings.csv`
  - Match Field: `[noc_code]` = `[noc_code]`
  - Cardinality: Many-to-One ($N : 1$).

### Data Source 2: `Olympic Athletes Analytics` (Demographic Deep-Dive)
- **Single Logical Table:** `athletes.csv`
- **Rationale:** Isolated data source. Prevents 8,000 athlete records from multiplying across 910 country-edition rows. Interactivity between data sources is handled seamlessly using **Cross-Data Source Filter Actions** on `[country]` or `[noc_code]` on dashboards.

---

## 4. Step-by-Step Connection Instructions in Tableau Desktop

### Step 1: Open Tableau and Connect to Text File
1. Launch Tableau Desktop.
2. In the **Connect** pane on the left, click **Text file**.
3. Navigate to the project directory: `c:\Users\Hp\Desktop\olympic\`.
4. Select `medal_results.csv` and click **Open**.

### Step 2: Establish the Logical Relationship with `games_summary`
1. In the left data panel under **Files**, locate `games_summary.csv` (Tableau automatically recognizes other CSVs in the same directory).
2. Drag `games_summary.csv` onto the Data Source canvas to the right of `medal_results.csv`.
3. Tableau will open the **Edit Relationship** modal with an orange noodle:
   - Primary table field: `year` $\longleftrightarrow$ Related table field: `year`
   - Click **Add more fields**: `season` $\longleftrightarrow$ `season`.
4. Close the relationship dialog.

### Step 3: (Optional) Establish Relationship with `alltime_country_rankings`
1. Drag `alltime_country_rankings.csv` onto the canvas next to `medal_results.csv`.
2. Set relationship fields:
   - `noc_code` $\longleftrightarrow$ `noc_code`.

### Step 4: Add the Secondary Data Source for Athletes
1. Click **Data** in the top menu bar $\rightarrow$ **New Data Source**.
2. Select **Text file** $\rightarrow$ choose `athletes.csv` $\rightarrow$ click **Open**.
3. Rename this data source tab: `Olympic Athletes`.

### Step 5: Convert Connection to Extract
1. In the upper-right corner of the Data Source tab, toggle the connection radio button from **Live** to **Extract**.
2. Switch to `Sheet 1`. Tableau will prompt for the location to save the `.hyper` extract file. Save it as `olympic_analytics.hyper` in the workspace directory.

---

## 5. Field Categorization, Geographic Roles, and Data Types

### Data Source 1: `Olympic Games & Medal Analysis`

#### Dimensions
- `country`: String $\rightarrow$ **Geographic Role: Country/Region**
- `host_country`: String $\rightarrow$ **Geographic Role: Country/Region**
- `host_city`: String $\rightarrow$ **Geographic Role: City**
- `noc_code`: String (3-letter IOC code)
- `region`: String (Geographic continent/region)
- `season`: String (`Summer`, `Winter`)
- `year`: Number (whole) or Date (Continuous/Discrete)
- `gdp_tier`: String (`High`, `Medium`, `Low`)
- `sports_investment`: String (`High`, `Medium`, `Low`)
- `top_sport`: String (Discipline name)

#### Measures
- `athletes_sent`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `gold`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `silver`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `bronze`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `total_medals`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `medal_points`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `medal_efficiency_pct`: Number (decimal) $\rightarrow$ Default Aggregation: `AVG` (or custom weighted calculation)
- `population_million`: Number (whole) $\rightarrow$ Default Aggregation: `AVG` (not SUM across years)
- `total_athletes` (from `games_summary`): Number (whole) $\rightarrow$ Default Aggregation: `AVG` or `MAX`
- `participating_nations` (from `games_summary`): Number (whole) $\rightarrow$ Default Aggregation: `AVG` or `MAX`
- `total_medals_awarded` (from `games_summary`): Number (whole) $\rightarrow$ Default Aggregation: `AVG` or `MAX`

### Data Source 2: `Olympic Athletes Analytics`

#### Dimensions
- `athlete_id`: String (Unique identifier, 8,000 distinct)
- `name`: String
- `gender`: String (`Male`, `Female`)
- `country`: String $\rightarrow$ **Geographic Role: Country/Region**
- `noc_code`: String
- `sport`: String
- `sport_category`: String
- `season`: String
- `first_games_year`: Number (whole) / Date
- `last_games_year`: Number (whole) / Date
- `world_record_holder`: Number / Boolean
- `professional_athlete`: Number / Boolean
- `doping_violation`: Number / Boolean
- `most_recent_medal_2020plus`: Number / Boolean

#### Measures
- `age_at_peak`: Number (whole) $\rightarrow$ Default Aggregation: `AVG`
- `height_cm`: Number (whole) $\rightarrow$ Default Aggregation: `AVG`
- `weight_kg`: Number (whole) $\rightarrow$ Default Aggregation: `AVG`
- `bmi`: Number (decimal) $\rightarrow$ Default Aggregation: `AVG`
- `training_hours_per_week`: Number (whole) $\rightarrow$ Default Aggregation: `AVG`
- `personal_best_rank_world`: Number (whole) $\rightarrow$ Default Aggregation: `MIN` or `AVG`
- `games_participated`: Number (whole) $\rightarrow$ Default Aggregation: `AVG`
- `gold_medals`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `silver_medals`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `bronze_medals`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`
- `total_medals`: Number (whole) $\rightarrow$ Default Aggregation: `SUM`

---

## 6. Required Tableau Calculated Fields

### Calculation 1: Corrected Host Nation Flag (Resolves 2012 UK Anomaly)
```tableau
// Name: [Host Nation (Corrected)]
// Resolves Great Britain (2012) host country labeling mismatch
IF [country] = [host_country] 
   OR ([country] = "Great Britain" AND [host_country] = "United Kingdom") 
THEN 1 
ELSE 0 
END
```

### Calculation 2: Games Edition Display Label
```tableau
// Name: [Games Edition]
// Avoids conflating Beijing 2008 and Beijing 2022
[host_city] + " " + STR([year]) + " (" + [season] + ")"
```

### Calculation 3: Dynamic Weighted Medal Efficiency
```tableau
// Name: [Weighted Efficiency Score]
// Evaluates medal points output per athlete sent
SUM([medal_points]) / SUM([athletes_sent])
```

### Calculation 4: BMI Category (Athletes Data Source)
```tableau
// Name: [BMI Classification]
IF [bmi] < 18.5 THEN "Underweight"
ELSEIF [bmi] < 25.0 THEN "Normal Weight"
ELSEIF [bmi] < 30.0 THEN "Overweight"
ELSE "Obese"
END
```

### Calculation 5: Career Longevity Category (Athletes Data Source)
```tableau
// Name: [Career Longevity]
IF [games_participated] = 1 THEN "Single Edition (1)"
ELSEIF [games_participated] = 2 THEN "Returning Competitor (2)"
ELSE "Olympic Veteran (3-4)"
END
```

---

## 7. Data Cleaning Decision: In Tableau vs. Prior to Tableau

| Cleaning Task | Where to Execute | Rationale |
| :--- | :--- | :--- |
| **Fix Great Britain 2012 Host Flag** | Inside Tableau (Calculated Field) | The underlying CSV files must remain completely pristine and unaltered as per project audit rules. Tableau calculated field provides transparent, reproducible documentation of the fix. |
| **Geographic Role Assignment** | Inside Tableau | Tableau natively assigns geographic coordinates (Latitude / Longitude generated) to `country`, `host_country`, and `host_city`. |
| **BMI Category Grouping** | Inside Tableau | Easily adjusted for sensitivity analysis and visual binning without writing new CSV columns. |
| **Data Filtering / Subsetting** | Inside Tableau (Extract / Context Filters) | Preserves full raw records while allowing interactive dashboard slicing (e.g., Summer vs. Winter). |
| **Extract Compilation** | In Tableau Desktop | Pre-aggregates calculations for performance optimization. |
