# Olympic Analytics Project — Demo Video Script & Recording Checklist

## 1. Video Overview & Production Specifications

- **Project Title:** Olympic Games Performance and Medal History (1992–2026)
- **Target Video Duration:** 4 minutes 30 seconds to 5 minutes 15 seconds.
- **Presenter Role:** Senior Data Analyst, Tableau Developer, and Full-Stack Integration Specialist.
- **Recommended Tools:** OBS Studio, Camtasia, Loom, or Windows Game Bar (`Win + G`).
- **Screen Resolution:** $1920 \times 1080$ (1080p Full HD) at 60 FPS.
- **Audio Quality:** Clear directional microphone with noise suppression enabled.

---

## 2. Pre-Recording Preparation Checklist

Before initiating the video recording session, ensure the following applications and windows are open and staged:

1. [ ] **Tableau Public 2025.2:** Open `olympic_analytics_final.twbx`. Have the **GLOBAL OLYMPIC PERFORMANCE** dashboard maximized and ready.
2. [ ] **Flask Web Server:** Open terminal in `c:\Users\Hp\Desktop\olympic\` and run `python app.py`. Confirm server is running at `http://localhost:5000`.
3. [ ] **Web Browser (Chrome / Edge):**
   - Tab 1: `http://localhost:5000/` (Home / Executive Overview).
   - Tab 2: `http://localhost:5000/dashboard` (Interactive Dashboard).
   - Tab 3: `http://localhost:5000/story` (Tableau Story flipboard).
   - Tab 4: `http://localhost:5000/athletes` (Athlete Biometrics).
4. [ ] **Code Editor (VS Code / Antigravity):** Open `c:\Users\Hp\Desktop\olympic\` displaying the project directory tree, `app.py`, and `docs/final_validation_report.md`.

---

## 3. End-to-End Segmented Script

### Segment 1: Executive Introduction & Project Mission (0:00 – 0:45)
- **Visual on Screen:** Browser on `http://localhost:5000/` (Home page hero section).
- **Presenter Actions:**
  - Start on the hero banner showing the Olympic Analytics brand and KPI cards.
  - Smoothly scroll down past the 5 KPI cards (Total Medals, Total Gold, Weighted Points, Nations, Editions).
  - Hover over the Top 10 All-Time Leaderboard table.
- **Spoken Narration:**
  > "Hello and welcome. Today I am presenting the final deliverables for the Olympic Games Performance and Medal History analytics project, covering 34 years of modern Olympic competition from Barcelona 1992 through to Milan-Cortina 2026.
  >
  > Across 18 games editions—10 Summer and 8 Winter—our dataset tracks 60 sovereign nations, 6,025 awarded medals, 11,860 weighted medal points, and 8,000 elite competitors.
  >
  > In this demonstration, I will walk you through our relational data architecture, our verified calculated fields, our Tableau executive dashboard and narrative story, and our responsive Flask web application."

---

### Segment 2: Data Architecture & Anomaly Remediation (0:45 – 1:30)
- **Visual on Screen:** Switch to Tableau Public 2025.2 showing the Data Source canvas, or open `docs/final_validation_report.md` in your editor.
- **Presenter Actions:**
  - Point to the logical relationship between `medal_results.csv` and `games_summary.csv`.
  - Highlight the calculated field `[Calculation_HostNation_Fixed]`.
  - Show the isolated `athletes.csv` data source.
- **Spoken Narration:**
  > "A critical requirement of this project was data integrity and avoiding metric inflation.
  >
  > If we had naively joined the athlete registry or games summary using standard physical SQL joins, the macro athlete count would have multiplied across every medal-winning country—distorting the true 119,000 athlete headcount up to 6.3 million, an inflation factor of over 53 times.
  >
  > To solve this, we implemented Tableau's Logical Data Model, relating medal results to games summaries on year and season at native grains, while keeping our 8,000-row athlete cohort isolated as a secondary data source.
  >
  > Furthermore, we remediated historical data inconsistencies: in the 2012 London Olympics, Great Britain was misclassified against the United Kingdom host name. Our calculated field corrects this anomaly, accurately restoring 18 host nations out of 18 editions."

---

### Segment 3: Tableau Executive Dashboard Walkthrough (1:30 – 2:45)
- **Visual on Screen:** Tableau Public showing the dashboard tab: **GLOBAL OLYMPIC PERFORMANCE**.
- **Presenter Actions:**
  - Point out the top KPI scorecards (Total Medals: 6,025; Gold: 1,959; Points: 11,860).
  - Hover over the top bar in **Top 10 Countries by Total Medals** (United States, 735 medals; China, 696 medals).
  - Hover over **Medal Distribution** to show the Gold/Silver/Bronze breakdown.
  - Interact with the **Season Filter**: click `Winter` to show how the view dynamically filters to Winter powerhouses like Norway, Germany, and Canada.
  - Click `Summer` to show the shift to Summer dominance.
  - Click `All` to restore the global view.
- **Spoken Narration:**
  > "Now looking at our flagship executive dashboard titled 'GLOBAL OLYMPIC PERFORMANCE'.
  >
  > Designed with a professional dark theme, high contrast typography, and balanced spacing, this dashboard provides decision-makers with comprehensive visibility into global podium performance.
  >
  > At the top, our KPI cards show our verified baselines.
  >
  > On the left, our horizontal leaderboard highlights the United States and China leading all nations, while the stacked distribution chart breaks down gold, silver, and bronze ratios.
  >
  > Notice the seasonal divergence: when we filter by Winter Games, Norway and Germany surge to the top with unmatched snow and ice efficiency. When we switch to Summer Games, equatorial and warm-climate nations capture their podium share."

---

### Segment 4: Tableau Story Narrative Presentation (2:45 – 3:45)
- **Visual on Screen:** Tableau Public showing the story tab: **Olympic Games Performance Story**.
- **Presenter Actions:**
  - Click through each of the 4 story points sequentially:
    1. Click Point 1: *Global Overview (1992–2026)* — Read the takeaway.
    2. Click Point 2: *Leading Nations & Podium Dominance* — Highlight the Top 10 share.
    3. Click Point 3: *Historical Trajectory & Pool Growth* — Trace the line from 1992 to 2020.
    4. Click Point 4: *Summer vs. Winter Seasonal Dynamics* — Highlight seasonal specialization.
- **Spoken Narration:**
  > "Next, let's explore our Tableau Story: 'Olympic Games Performance Story', structured into four sequential, evidence-based chapters.
  >
  > Chapter 1 establishes the global scope: 6,025 medals and 11,860 weighted points across 34 years.
  >
  > Chapter 2 proves concentration of athletic power: the Top 10 nations have captured over 52% of all Olympic medals awarded since 1992.
  >
  > Chapter 3 illustrates the historical expansion of the Olympic medal pool—rising from 329 medals in Barcelona 1992 to 363 medals in Tokyo 2020 as new events and disciplines were introduced.
  >
  > Finally, Chapter 4 demonstrates sharp seasonal specialization, showing how countries tailor their sporting investments specifically for Summer or Winter disciplines."

---

### Segment 5: Flask Web Application & REST Integration (3:45 – 4:45)
- **Visual on Screen:** Browser window on `http://localhost:5000/dashboard`.
- **Presenter Actions:**
  - Demonstrate interactive dropdown filters on the web dashboard (select `Winter`, select a specific country like `Norway`).
  - Watch the KPI cards and Chart.js charts update instantaneously via REST API without a full page refresh.
  - Click the **Tableau Public Web Embed** toggle to demonstrate the embed container and publication bridge.
  - Navigate to the **Athletes** page (`/athletes`) to show the BMI distribution and physical profile charts.
  - Hover over the **Tableau Files** dropdown in the navbar and click **Download .twbx**.
- **Spoken Narration:**
  > "To ensure broad accessibility without requiring every stakeholder to install Tableau Desktop, we integrated this analysis into a modern Flask web application.
  >
  > Here on our web dashboard, every chart is powered by our REST API endpoints. When I filter by season or select an individual nation, our client-side engine queries Flask and re-renders the charts in under 20 milliseconds.
  >
  > We have also built in a Tableau Public embed bridge, along with direct download links for our packaged workbook (`olympic_analytics_final.twbx`) right in the navigation header.
  >
  > On the Athletes page, stakeholders can explore BMI classifications and physical profiles across 8,000 competitors."

---

### Segment 6: Conclusion & Deliverables Summary (4:45 – 5:10)
- **Visual on Screen:** Browser on Home page or terminal showing the verified test results (`ALL FLASK ENDPOINTS RETURNED HTTP 200 OK`).
- **Presenter Actions:**
  - Show the project directory containing `.twb`, `.twbx`, documentation files, and `README.md`.
- **Spoken Narration:**
  > "In conclusion, all requirements for this project have been fully delivered, rigorously verified, and documented.
  >
  > The packaged workbook, documentation reports, and web application provide an end-to-end, enterprise-ready Olympic analytics asset.
  >
  > Thank you for watching!"

---

## 4. Post-Recording Quality Verification Checklist

- [ ] Audio is synchronized with video actions without noticeable lag.
- [ ] No personal sensitive information or background desktop clutter is visible.
- [ ] Video resolution is crisp 1080p, text on charts and dashboards is clearly legible.
- [ ] Video file is saved as `olympic_analytics_demo.mp4` or uploaded to the designated project portal.
