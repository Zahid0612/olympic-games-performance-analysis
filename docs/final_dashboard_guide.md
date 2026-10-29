# Olympic Analytics Project — Final Dashboard & Story User Guide

## 1. Introduction & Deliverables Overview

This user guide provides instructions for accessing, navigating, and interpreting the Tableau deliverables and web dashboards in the **Olympic Games Performance and Medal History (1992–2026)** analytics suite.

### Available Deliverable Files:
1. **`olympic_analytics_final.twbx` (Recommended):** Packaged Tableau Workbook containing the pre-configured logical data model, all seven worksheets, the executive dashboard, the 4-scene narrative story, and embedded data extracts.
2. **`olympic_analytics_final.twb`:** Unpackaged Tableau Workbook XML file referencing the local CSV files in `c:\Users\Hp\Desktop\olympic\`.
3. **Flask Web Application (`app.py`):** Browser-accessible portal providing interactive charts, REST APIs, and Tableau embed bridge.

---

## 2. Opening the Workbooks in Tableau Desktop or Tableau Public

### Method A: Opening the Packaged Workbook (`.twbx`) — Recommended
1. Locate `c:\Users\Hp\Desktop\olympic\olympic_analytics_final.twbx`.
2. Double-click the file, or launch **Tableau Public 2025.2** (or Tableau Desktop) and select **File** $\rightarrow$ **Open...** $\rightarrow$ choose `olympic_analytics_final.twbx`.
3. Because this is a packaged workbook, all four underlying data tables (`medal_results.csv`, `games_summary.csv`, `athletes.csv`, `alltime_country_rankings.csv`) are bundled internally. No file reconnect prompts will appear.

### Method B: Opening the Unpackaged Workbook (`.twb`)
1. Open `c:\Users\Hp\Desktop\olympic\olympic_analytics_final.twb` in Tableau Public.
2. Tableau will look for the CSV files in `c:\Users\Hp\Desktop\olympic\`. Ensure the four source CSV files remain in the same directory.

---

## 3. Navigating the Executive Dashboard: `GLOBAL OLYMPIC PERFORMANCE`

Click the dashboard tab titled **GLOBAL OLYMPIC PERFORMANCE** at the bottom of the Tableau workspace.

```
+-----------------------------------------------------------------------------------+
|                           GLOBAL OLYMPIC PERFORMANCE                              |
|           1992–2026 Historical Medal Analysis & Athletic Benchmarks              |
+-----------------------------------------------------------------------------------+
| [Filter: Season]             [Filter: Year]             [Filter: Country]        |
+-----------------------------------------------------------------------------------+
|  [ 6,025 Medals ]   [ 1,959 Gold ]   [ 11,860 Pts ]   [ 60 Nations ]  [ 18 Games ]|
+-----------------------------------------------------------------------------------+
| [ Top 10 Countries by Total Medals ]    | [ Medal Distribution (G/S/B) ]          |
|  - USA (735), China (696), Russia (429) |  - Stacked bar breakdown                |
|  - Colored by weighted points           |  - Hover for gold/silver/bronze ratios  |
+-----------------------------------------------------------------------------------+
| [ Medal Trends Across Editions ]        | [ Summer vs. Winter Performance ]       |
|  - 34-year trajectory (1992-2026)       |  - Summer (3,029) vs Winter (2,996)     |
|  - Growth from 329 to 363 peak medals   |  - Comparative seasonal dynamics        |
+-----------------------------------------------------------------------------------+
```

### 3.1. Interactive Filter Controls

1. **Season Filter (`[season]`):**
   - **`All` (Default):** Displays combined performance across all 18 editions.
   - **`Summer`:** Isolates the 10 Summer Olympic Games (Barcelona 1992 to Paris 2024), awarding 3,029 total medals.
   - **`Winter`:** Isolates the 8 Winter Olympic Games (Lillehammer 1994 to Milan-Cortina 2026), awarding 2,996 total medals.
2. **Year Filter (`[year]`):**
   - Allows multi-select or single-edition isolation (e.g., selecting `2008` to review Beijing Summer Games performance).
3. **Country / NOC Filter (`[country]`):**
   - Filters the entire dashboard to any of the 60 participating sovereign nations (e.g., selecting `Norway` demonstrates acute Winter specialization; selecting `Kenya` demonstrates pure Summer track-and-field dominance).

### 3.2. Reading the Visualizations

- **Top 10 Leaderboard:**
  - Ranked in descending order of total medals won.
  - Hover over any bar to view the exact breakdown of Gold, Silver, Bronze, and Weighted Medal Points ($(G \times 3) + (S \times 2) + (B \times 1)$).
- **Medal Distribution:**
  - Visually illustrates the proportion of champion gold finishes versus runners-up.
- **Medal Trends:**
  - Multi-line trajectory highlighting the expansion of the global Olympic medal pool over time.
- **Summer vs. Winter:**
  - Demonstrates near-equal historical medal volume between Summer ($50.3\%$) and Winter ($49.7\%$) programs in the post-1992 staggered quadrennial era.

---

## 4. Navigating the Tableau Story: `Olympic Games Performance Story`

Click the story tab titled **Olympic Games Performance Story** at the bottom of the Tableau window.

The Story is structured into 4 sequential presentation frames (Story Points) accessible via the top navigation bar:

### Story Point 1: Global Overview (1992–2026)
- **Focus:** Macro scale of modern Olympic competition.
- **Key Evidence:** 6,025 total medals awarded across 18 editions to 60 sovereign countries from 47,208 athlete appearances.
- **Action:** Review the macro scorecard validating baseline mathematical integrity.

### Story Point 2: Leading Nations & Podium Dominance
- **Focus:** Concentration of international athletic success.
- **Key Evidence:** The Top 10 nations account for 3,844 of the 6,025 medals ($63.8\%$). The United States (735 medals) and China (696 medals) occupy the top two positions.
- **Action:** Observe the dominance gradient across the top 10 delegations.

### Story Point 3: Historical Trajectory & Pool Growth
- **Focus:** Growth of events and disciplines over 34 years.
- **Key Evidence:** Total medals awarded per games rose from 329 in 1992 to a peak of 363 in Tokyo 2020 due to new sporting categories and mixed events.
- **Action:** Trace the expansion curve and note host nation performance bumps (e.g., Sydney 2000, Beijing 2008, London 2012, Tokyo 2020, Paris 2024).

### Story Point 4: Summer vs. Winter Seasonal Dynamics
- **Focus:** Climatic and institutional specialization.
- **Key Evidence:** Summer editions award an average of 302.9 medals, while Winter editions award 374.5 medals per games. Cold-climate nations (Norway, Germany, Canada) capture their primary medal share in Winter, while tropical nations excel exclusively in Summer.
- **Action:** Contrast national performance splits between seasons.

---

## 5. Publishing to Tableau Public Online (Optional Sharing)

If you wish to share the workbook online via an interactive browser URL:

1. In Tableau Public or Tableau Desktop, click **Server** $\rightarrow$ **Tableau Public** $\rightarrow$ **Save to Tableau Public As...**
2. Enter your Tableau Public login credentials.
3. Choose workbook title: `Olympic Games Performance & Medal History`.
4. Check **Show sheets as tabs** to enable viewers to toggle between the dashboard and story.
5. Click **Save**. Tableau will compile the extract and open the live URL in your default browser.
6. Copy the resulting URL and paste it into `app.py` or export it as an environment variable:
   ```powershell
   $env:TABLEAU_EMBED_URL="https://public.tableau.com/views/YourWorkbook/GLOBALOLYMPICPERFORMANCE"
   ```

---

## 6. Accessing via the Flask Web Portal

To view the dashboard and story via the built-in web portal:

1. Launch the server in terminal:
   ```powershell
   python app.py
   ```
2. Navigate to `http://localhost:5000/dashboard` for live interactive filters.
3. Navigate to `http://localhost:5000/story` for the story flipboard.
4. Navigate to `http://localhost:5000/athletes` for physical biometrics.
5. Download workbook extracts directly via the **Tableau Files** navigation dropdown.
