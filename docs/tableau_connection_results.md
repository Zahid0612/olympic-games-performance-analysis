# Olympic Analytics Project — Tableau Connection Results

## 1. Environment Assessment & Execution Status

To maintain 100% technical honesty and reproducibility, the current execution environment was inspected before establishing data connections:

| Component | Status | Path / Version | Details |
| :--- | :---: | :--- | :--- |
| **Tableau Desktop / Public** | **Installed** | `C:\Program Files\Tableau\Tableau Public 2025.2\bin\tabpublic.exe` | Tableau Public 2025.2 is locally installed on the Windows machine. |
| **Execution Context** | Non-Interactive Agent CLI | PowerShell / Background Process | As a terminal-based agent, interactive Windows GUI clicks (e.g., clicking inside Tableau's interactive menus to build binary extracts) cannot be run headlessly. |
| **Tableau Hyper API** | **Not Installed** | Python `tableauhyperapi` | Evaluated in Python 3.12 environment (`ImportError`). Cannot compile binary `.hyper` extract headlessly via script. |
| **Tableau XML Workbook** | **Generated & Verified** | `c:\Users\Hp\Desktop\olympic\olympic_analytics_starter.twb` | Programmatically constructed and XML-validated Tableau workbook containing connection schemas, metadata, calculated fields, and sheet layout. |

### Classification of Task Completion

- **Completed & Verified by Agent:**
  - Full relational audit and verification of relationship keys across all four CSV files.
  - Logical data model definition and duplicate-count risk proofs.
  - Creation of native, XML-validated starter workbook [`olympic_analytics_starter.twb`](file:///c:/Users/Hp/Desktop/olympic/olympic_analytics_starter.twb).
  - Quantitative simulation of Tableau logical relationship aggregation vs. physical join fan-out.
  - Comprehensive field role, geographic role, and calculation definitions.
- **Generated Instructions for Manual User Execution:**
  - Opening the starter workbook or configuring connections in Tableau Public / Desktop GUI.
  - Toggling connection to Extract (`.hyper`) within the Tableau Desktop interface and saving the `.twbx`.
- **Blocked Tasks:**
  - Direct headless creation of binary `.hyper` extract without `tableauhyperapi` package.

---

## 2. Configured Data Model Architecture

The data architecture is configured to eliminate fan-out risks while enabling seamless cross-domain analysis:

```
[ Data Source 1: Olympic Games and Medal Results ]
        medal_results.csv (Root Fact Table, 910 rows)
               |
               | Logical Relationship (Noodle)
               | Keys: [year] = [year] AND [season] = [season]
               v
        games_summary.csv (Edition Dimension, 18 rows)

[ Data Source 2: Olympic Athletes ]
        athletes.csv (Independent Grain, 8,000 rows)

[ Data Source 3 / Benchmark: All-Time Country Rankings ]
        alltime_country_rankings.csv (Pre-Aggregated Benchmark, 60 rows)
```

### 2.1. Why `medal_results.csv` is the Root Table
`medal_results.csv` provides the transactional grain of the Olympic games: one record per country per edition (910 rows). It contains both edition-level identifiers (`year`, `season`, `host_city`, `host_country`) and national delegation outcomes (`athletes_sent`, `gold`, `silver`, `bronze`, `total_medals`, `medal_points`, `medal_efficiency_pct`).

### 2.2. The Logical Relationship with `games_summary.csv`
- **Relationship Type:** Many-to-One ($N : 1$).
- **Relationship Keys:**
  - `medal_results.year` = `games_summary.year`
  - `medal_results.season` = `games_summary.season`
- **Integrity Validation:** 100% match. All 910 country-edition rows link to an edition in `games_summary`.
- **Preservation of Grain:** In Tableau's Logical Layer (Relationships), Tableau queries each table at its native grain. When visualizing `total_athletes` from `games_summary`, Tableau aggregates across the 18 editions (summing to 119,120), rather than multiplying across all 910 country rows (which would incorrectly sum to 6,390,912).

### 2.3. Handling `alltime_country_rankings.csv`
- **Decision:** Recommended as a **standalone fast-lookup table** or secondary data source.
- **Rationale:** `alltime_country_rankings.csv` already represents the cumulative historical sum of `medal_results.csv` over all 18 editions (60 rows). Relating it to `medal_results.csv` on `noc_code` is technically valid in Tableau's logical layer, but redundant for edition-level visualizations. Keeping it separate provides clean, dedicated leaderboards and KPI cards for overall historical country ranking.

### 2.4. Isolation of `athletes.csv` at Native Grain
- **Decision:** **Strictly isolated as an independent secondary data source**.
- **Crucial Warning:** `athletes.csv` contains 8,000 athlete profiles with career-aggregate medals. It does **not** contain single-game edition rows.
- **Risk Avoidance:** A physical join between `athletes.csv` and `medal_results.csv` on `country` would cause a catastrophic Cartesian explosion (multiplying 8,000 athletes by 15–18 editions, resulting in over 120,000 inflated rows) and destroy country medal counts.
- **Interactivity Strategy:** On Tableau dashboards, cross-table interactivity between the Medal Analysis source and the Athletes source is achieved using **Dashboard Filter Actions** on `[country]` or `[noc_code]`. When a user clicks a country on the medal map or leaderboard, the athlete biometrics dashboard dynamically filters to that country's athletes.

---

## 3. Step-by-Step Tableau Desktop Execution Guide

Follow these steps to finalize the connection inside Tableau Desktop or Tableau Public:

### Option A: Open the Pre-Configured Starter Workbook
1. Double-click or open [`c:\Users\Hp\Desktop\olympic\olympic_analytics_starter.twb`](file:///c:/Users/Hp/Desktop/olympic/olympic_analytics_starter.twb) with Tableau Public 2025.2.
2. Tableau will read the configured data source definitions and load `medal_results.csv` and `athletes.csv`.
3. Proceed to **Step 3** below to configure the extract.

### Option B: Configure Fresh Connection Manually in Tableau Desktop
1. **Launch Tableau Desktop / Public:**
   - Click **Connect** $\rightarrow$ **Text file**.
   - Browse to `c:\Users\Hp\Desktop\olympic\` and select `medal_results.csv`.
2. **Add Related Table:**
   - In the left pane under **Files**, drag `games_summary.csv` onto the canvas next to `medal_results`.
   - In the relationship noodle dialog, ensure:
     - Field 1: `year` = `year`
     - Click **Add more fields**: `season` = `season`.
3. **Add Athletes Data Source:**
   - In the top menu, click **Data** $\rightarrow$ **New Data Source**.
   - Select **Text file** $\rightarrow$ choose `athletes.csv` $\rightarrow$ click **Open**.
   - Rename this data source tab: `Olympic Athletes`.
4. **Create Calculated Remediation Fields:**
   - In `medal_results`, create calculated field `[Host Nation (Corrected)]`:
     ```tableau
     IF [country] = [host_country] 
        OR ([country] = "Great Britain" AND [host_country] = "United Kingdom") 
     THEN 1 
     ELSE 0 
     END
     ```
   - In `medal_results`, create calculated field `[Games Edition]`:
     ```tableau
     [host_city] + " " + STR([year]) + " (" + [season] + ")"
     ```
   - In `athletes`, create calculated field `[BMI Category]`:
     ```tableau
     IF [bmi] < 18.5 THEN "Underweight"
     ELSEIF [bmi] < 25.0 THEN "Normal Weight"
     ELSEIF [bmi] < 30.0 THEN "Overweight"
     ELSE "Obese"
     END
     ```
5. **Convert to Tableau Extract (.hyper):**
   - On the top right of the Data Source canvas, select the **Extract** radio button.
   - Click on `Sheet 1`. Tableau will prompt to save the `.hyper` extract.
   - Save the file in the workspace directory.
   - Save the final workbook as a Packaged Workbook: `olympic_analytics.twbx`.

---

## 4. Cross-Data Source Dashboard Exploration Workflow

To explore country-level athletes without joining tables:
1. Create Worksheet 1: **"Country Medal Leaderboard"** using `Olympic Games and Medal Results` data source (Rows: `country`, Columns: `SUM(total_medals)`).
2. Create Worksheet 2: **"Athlete Physical Profile"** using `Olympic Athletes` data source (Columns: `height_cm`, Rows: `weight_kg`, Detail: `athlete_id`, Color: `sport`).
3. Add both sheets to a new Dashboard.
4. Go to **Dashboard** $\rightarrow$ **Actions** $\rightarrow$ **Add Action** $\rightarrow$ **Filter**:
   - **Source Sheet:** Country Medal Leaderboard.
   - **Target Sheet:** Athlete Physical Profile.
   - **Target Data Source:** `Olympic Athletes`.
   - **Selected Fields:** Target Field: `country` = Source Field: `country`.
   - **Run action on:** Select (Click).
   - **Clearing the selection:** Show all values.
5. **Result:** Clicking any country (e.g., "Germany") instantly filters the 8,000 athletes to show only the 197 German athletes, displaying their exact biometric distribution without any row duplication in the underlying data!
