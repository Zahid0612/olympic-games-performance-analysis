# Olympic Games Performance and Medal History (1992–2026) — Final Project Documentation

## 1. Project Background & Executive Overview

The **Olympic Games Performance and Medal History (1992–2026)** analytics project is an end-to-end business intelligence and data engineering solution designed to evaluate international athletic competition across 34 years of Olympic history. Spanning 18 games editions (10 Summer, 8 Winter) from Barcelona 1992 to Milan-Cortina 2026, the project unifies transactional country delegations, macro edition summaries, historical nation benchmark rankings, and competitor biometrics.

### Core Project Capabilities
- **Relational Data Modeling:** Eliminates Cartesian fan-out and join inflation ($53.65\times$ risk) by implementing Tableau's Logical Data Model ("noodles") and isolating native granularities.
- **Data Quality Remediation:** Resolves historical anomalies (such as the 2012 London Olympics UK host flag) and establishes weighted scoring models ($11,860$ total medal points).
- **Executive Tableau Dashboard:** Features the polished command center titled **GLOBAL OLYMPIC PERFORMANCE**, providing multi-dimensional filtering, KPI scorecards, and interactive cross-views.
- **Narrative Data Story:** Formats insights into a 4-chapter Tableau Story (`Olympic Games Performance Story`) with evidence-based takeaways.
- **Web Application Integration:** Provides a Python Flask application (`app.py`) with responsive styling, REST API endpoints, client-side interactive charts, and Tableau embed capabilities.

---

## 2. Dataset Inventory & Provenance

The workspace incorporates four structured CSV datasets residing in `c:\Users\Hp\Desktop\olympic\`:

```
c:\Users\Hp\Desktop\olympic\
├── alltime_country_rankings.csv   (60 rows × 13 columns, 3,385 bytes)
├── athletes.csv                   (8,000 rows × 26 columns, 986,235 bytes)
├── games_summary.csv              (18 rows × 10 columns, 1,204 bytes)
└── medal_results.csv              (910 rows × 19 columns, 89,084 bytes)
```

### 2.1. Dataset Provenance & Grain Definitions

| Dataset | Provenance / Collection Methodology | Native Grain | Key Fields |
| :--- | :--- | :--- | :--- |
| `games_summary.csv` | Official IOC historical archives and Olympic host city registries (1992–2026). | 1 row per Olympic Games Edition | Composite: `(year, season)` |
| `medal_results.csv` | National Olympic Committee (NOC) delegation records per edition. | 1 row per Country-Edition Result | Composite: `(year, country)` |
| `alltime_country_rankings.csv` | Cumulative all-time historical leaderboard compiled across 18 editions. | 1 row per Sovereign Nation | `noc_code` / `country` |
| `athletes.csv` | Individual athlete biometric, demographic, and career medal registry. | 1 row per Elite Competitor | `athlete_id` |

---

## 3. Data Preparation, Anomaly Remediation & Relational Architecture

### 3.1. Fan-Out & Join Inflation Protection

A foundational data engineering requirement was preventing **metric inflation**:
- `games_summary.csv` records macro edition statistics (e.g., $119,120$ total global athletes across 18 games).
- `medal_results.csv` records national delegation outcomes (910 rows across 60 countries).
- If joined via naive physical SQL joins, edition totals duplicate across every winning country ($43$ to $60$ countries per games), artificially inflating the athlete pool to **6,390,912** ($53.65\times$ inflation).

Similarly, `athletes.csv` contains 8,000 career profiles. A physical join to `medal_results.csv` on `country` would replicate each athlete 15 to 18 times, creating over 120,000 rows and completely falsifying national medal totals.

#### The Logical Solution:
1. `medal_results.csv` is designated as the **Root Fact Table** (910 rows).
2. `games_summary.csv` is related via a **Logical Relationship (Noodle)** on `[year] = [year]` and `[season] = [season]`. Tableau dynamically queries each table at its native grain without physical row duplication.
3. `athletes.csv` is maintained as an **Isolated Secondary Data Source**, synchronized on dashboards via Tableau Dashboard Filter Actions on `[country]`.

### 3.2. Calculated Fields Catalog

| Calculated Field Name | Target Data Source | Formula | Business Purpose |
| :--- | :--- | :--- | :--- |
| **`[Calculation_HostNation_Fixed]`** | `federated.medal_analysis` | `IF [country] = [host_country] OR ([country] = "Great Britain" AND [host_country] = "United Kingdom") THEN 1 ELSE 0 END` | Resolves London 2012 UK naming disparity, restoring host nation count from 17 to exactly 18. |
| **`[Calculation_Games_Edition]`** | `federated.medal_analysis` | `[host_city] + " " + STR([year]) + " (" + [season] + ")"` | Differentiates multi-games host cities (e.g., Beijing 2008 Summer vs. Beijing 2022 Winter). |
| **`[Calculation_Weighted_Efficiency]`**| `federated.medal_analysis` | `SUM([medal_points]) / SUM([athletes_sent])` | Calculates aggregate weighted medal points per athlete appearance ($0.25$ pts/athlete globally). |
| **`[Calculation_BMI_Category]`** | `federated.athletes` | `IF [bmi] < 18.5 THEN "Underweight" ELSEIF [bmi] < 25.0 THEN "Normal Weight" ELSEIF [bmi] < 30.0 THEN "Overweight" ELSE "Obese" END` | Classifies athlete biometrics into standard World Health Organization health tiers. |
| **`[Calculation_Career_Longevity]`** | `federated.athletes` | `IF [games_participated] = 1 THEN "1 Edition (Debut)" ELSEIF [games_participated] = 2 THEN "2 Editions (Returning)" ELSE "3+ Editions (Veteran)" END` | Tiers athletes by Olympic career longevity. |

---

## 4. Tableau Worksheets & Visualizations Catalog

The final workbook `olympic_analytics_final.twb` contains seven specialized worksheets:

1. **`Olympic Overview KPIs`**:
   - Displays verified global metrics: 6,025 Medals, 1,959 Gold, 1,917 Silver, 2,149 Bronze, 11,860 Medal Points, and 18 Editions.
2. **`Top 10 Countries by Total Medals`**:
   - Horizontal bar chart ranking countries by total medals won with weighted medal points color encoding.
3. **`Medal Distribution (Gold Silver Bronze)`**:
   - Stacked bar chart showing the composition of Gold, Silver, and Bronze podium finishes across top delegations.
4. **`Medal Trends Across Editions`**:
   - Multi-line trend chart displaying total medals awarded over time from 1992 to 2026, segmented by season.
5. **`Summer vs Winter Performance`**:
   - Side-by-side comparative bar chart contrasting 10 Summer games ($3,029$ medals) against 8 Winter games ($2,996$ medals).
6. **`Host Nation Advantage`**:
   - Grouped bar chart comparing medals won when nations host versus non-hosting games editions.
7. **`Athlete Biometrics by Sport`**:
   - Scatter plot correlating athlete Height (cm) against Weight (kg) colored by BMI category across sporting categories.

---

## 5. Executive Dashboard Design: `GLOBAL OLYMPIC PERFORMANCE`

The workbook features an executive dashboard titled **GLOBAL OLYMPIC PERFORMANCE**:

### 5.1. Layout Hierarchy
- **Header Band:** Dashboard title, subtitle, and metadata.
- **Top Section (KPI Cards):** High-contrast cards displaying Total Medals, Gold Medals, Weighted Points, Participating Nations, and Delegations.
- **Middle Section (National Dominance):**
  - Left Container: `Top 10 Countries by Total Medals` horizontal ranking.
  - Right Container: `Medal Distribution (Gold Silver Bronze)` stacked breakdown.
- **Bottom Section (Trends & Seasons):**
  - Left Container: `Medal Trends Across Editions` historical trajectory.
  - Right Container: `Summer vs Winter Performance` seasonal dynamics.

### 5.2. Visual Styling & Design System
- **Theme:** Professional dark slate navy (`#070d1e`, `#0e1838`).
- **Accents:** Gold (`#f59e0b`), Silver (`#cbd5e1`), Bronze (`#d97706`), Olympic Blue (`#3b82f6`).
- **Typography:** Outfit (headings) and Plus Jakarta Sans (body/labels).
- **Responsiveness:** Dynamic layout bounds ($1000 \times 700$ min to $1400 \times 900$ max).

---

## 6. Tableau Story: `Olympic Games Performance Story`

The Tableau Story provides a guided, 4-chapter narrative presentation:

### Chapter 1: Global Olympic Overview (1992–2026)
- **Captured Sheet:** `Olympic Overview KPIs`
- **Narrative Takeaway:** Over 34 years across 18 Olympic editions (10 Summer, 8 Winter), 6,025 total medals were awarded—generating 11,860 weighted points across 60 sovereign nations.

### Chapter 2: Leading Nations & Podium Dominance
- **Captured Sheet:** `Top 10 Countries by Total Medals`
- **Narrative Takeaway:** The Top 10 countries account for over 52% of all Olympic medals awarded since 1992, led by the United States (735 medals) and China (696 medals).

### Chapter 3: Historical Trajectory & Medal Pool Growth
- **Captured Sheet:** `Medal Trends Across Editions`
- **Narrative Takeaway:** The Olympic medal pool expanded from 329 medals in Barcelona 1992 to a peak of 363 in Tokyo 2020 due to new sporting disciplines and mixed-gender relays.

### Chapter 4: Summer vs. Winter Seasonal Dynamics
- **Captured Sheet:** `Summer vs Winter Performance`
- **Narrative Takeaway:** Winter competition is concentrated among cold-climate specialists (Norway, Austria, Canada), while equatorial nations capture their medals exclusively in Summer games.

---

## 7. Flask Web Application Integration

### 7.1. Web Architecture & File Structure

```
c:\Users\Hp\Desktop\olympic\
├── app.py                       # Flask application backend & REST endpoints
├── templates/
│   ├── base.html                # Common layout, Olympic rings nav, dropdown downloads
│   ├── index.html               # Home page with hero, KPIs, pillars, top 10 table
│   ├── dashboard.html           # Interactive dashboard with filters & Tableau embed
│   ├── story.html               # 4-scene narrative story navigator
│   └── athletes.html            # Athlete biometrics & physical profiles
└── static/
    ├── css/
    │   └── style.css            # Responsive dark-theme stylesheet
    └── js/
        └── main.js              # Chart.js engine & dynamic filter controller
```

### 7.2. REST API Endpoints
- `GET /api/kpis`: Returns dynamic medal counts, points, delegations, and efficiency based on active filters (`year`, `season`, `country`).
- `GET /api/top-countries`: Returns ranked country records with gold/silver/bronze breakdown.
- `GET /api/trends`: Returns edition-by-edition time-series data.
- `GET /api/season-comparison`: Returns aggregated Summer vs. Winter comparative metrics.
- `GET /api/athlete-biometrics`: Returns BMI counts, category height/weight averages, and sample athlete profiles.

---

## 8. Setup & Execution Instructions

### 8.1. Opening in Tableau Desktop / Public
1. Double-click or open `c:\Users\Hp\Desktop\olympic\olympic_analytics_final.twbx` in Tableau Desktop or Tableau Public 2025.2.
2. The packaged workbook opens self-contained with all four datasets loaded.
3. Switch between the **GLOBAL OLYMPIC PERFORMANCE** dashboard tab and the **Olympic Games Performance Story** story tab.

### 8.2. Running the Flask Web Application
1. Open PowerShell or Terminal in `c:\Users\Hp\Desktop\olympic\`.
2. Run the application:
   ```powershell
   python app.py
   ```
3. Open a browser and navigate to:
   ```
   http://localhost:5000
   ```
4. Explore the interactive dashboard, story flipboard, and download the `.twbx` extract directly from the navigation bar.
