# Olympic Games Performance and Medal History (1992–2026)

[![Tableau Public](https://img.shields.io/badge/Tableau_Public-2025.2-E97627?logo=tableau&logoColor=white)](https://public.tableau.com/)
[![Python](https://img.shields.io/badge/Python-3.12.4-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.3-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Status](https://img.shields.io/badge/Validation-100%25_Verified-10B981)](#verified-metric-scorecard)

A comprehensive, enterprise-grade business intelligence and web integration project analyzing **34 years of modern Olympic competition (1992–2026)** across **18 games editions** (10 Summer, 8 Winter), **60 sovereign nations**, and **8,000 elite competitors**.

---

## 🏅 Project Overview & Key Metrics

- **Total Medals Awarded:** **6,025** (1,959 Gold • 1,917 Silver • 2,149 Bronze)
- **Weighted Medal Points:** **11,860** (Gold ×3 + Silver ×2 + Bronze ×1)
- **Delegation Athlete Appearances:** **47,208**
- **Timespan:** 18 Editions from Barcelona 1992 to Milan-Cortina 2026
- **Participating Sovereign Nations:** 60 National Olympic Committees (NOCs)
- **Cartesian Join Inflation Risk:** **$53.65\times$ fan-out eliminated** via Tableau Logical Data Modeling.
- **Historical Remediation:** 2012 London Olympics UK host flag anomaly corrected, restoring 18 of 18 host nations.

---

## 📦 Project Deliverables

### 1. Tableau Workbooks
- [`olympic_analytics_final.twbx`](file:///c:/Users/Hp/Desktop/olympic/olympic_analytics_final.twbx) (221.6 KB) — **Packaged Tableau Workbook** bundled with self-contained CSV extracts, pre-configured logical relationships, 7 analytical worksheets, the executive dashboard, and the 4-scene narrative story.
- [`olympic_analytics_final.twb`](file:///c:/Users/Hp/Desktop/olympic/olympic_analytics_final.twb) (22.8 KB) — Unpackaged Tableau Workbook XML referencing local datasets.
- [`olympic_analytics_starter.twb`](file:///c:/Users/Hp/Desktop/olympic/olympic_analytics_starter.twb) (7.0 KB) — Preserved Phase 2 starter workbook.

### 2. Python Flask Web Application
- [`app.py`](file:///c:/Users/Hp/Desktop/olympic/app.py) — RESTful backend serving interactive endpoints for dynamic filtering, KPIs, and biometric stats.
- `templates/` — Jinja2 HTML templates:
  - [`base.html`](file:///c:/Users/Hp/Desktop/olympic/templates/base.html) — Navigation bar with Olympic rings, dropdown downloads, responsive footer.
  - [`index.html`](file:///c:/Users/Hp/Desktop/olympic/templates/index.html) — Executive landing page, KPI cards, top 10 leaderboard, edition timeline.
  - [`dashboard.html`](file:///c:/Users/Hp/Desktop/olympic/templates/dashboard.html) — **GLOBAL OLYMPIC PERFORMANCE** dashboard with live filter controls and Tableau embed bridge.
  - [`story.html`](file:///c:/Users/Hp/Desktop/olympic/templates/story.html) — 4-chapter guided narrative story navigator.
  - [`athletes.html`](file:///c:/Users/Hp/Desktop/olympic/templates/athletes.html) — Athlete biometric profiles, BMI tiers, and physical requirements by sport.
- `static/` — Assets:
  - [`css/style.css`](file:///c:/Users/Hp/Desktop/olympic/static/css/style.css) — Custom modern dark theme, glassmorphic cards, Olympic color accents.
  - [`js/main.js`](file:///c:/Users/Hp/Desktop/olympic/static/js/main.js) — Chart.js client engine and dynamic REST filtering.

### 3. Comprehensive Documentation Suite
- [`docs/final_project_documentation.md`](file:///c:/Users/Hp/Desktop/olympic/docs/final_project_documentation.md) — Step-by-step development manual, data sources, relational modeling, calculated fields, dashboard design, and execution instructions.
- [`docs/final_validation_report.md`](file:///c:/Users/Hp/Desktop/olympic/docs/final_validation_report.md) — Quantitative validation scorecard, arithmetic verification, and sub-50ms latency performance testing report.
- [`docs/demo_video_script.md`](file:///c:/Users/Hp/Desktop/olympic/docs/demo_video_script.md) — Professional video recording script with timestamped narration and screen actions.
- [`docs/final_dashboard_guide.md`](file:///c:/Users/Hp/Desktop/olympic/docs/final_dashboard_guide.md) — End-user operating guide for filters, tooltips, Story navigation, and Tableau Public publishing.
- [`docs/project_phase_tracker.md`](file:///c:/Users/Hp/Desktop/olympic/docs/project_phase_tracker.md) — Requirement-by-requirement governance checklist.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.12+** with `flask` and `pandas`
- **Tableau Public 2025.2** or **Tableau Desktop**

### 1. Run the Flask Web Application
Open PowerShell or your preferred terminal in the project directory:

```powershell
cd c:\Users\Hp\Desktop\olympic
python app.py
```

Open your browser and navigate to:
```
http://localhost:5000
```

- Navigate to `/dashboard` to interact with live filters (Season, Year, Country).
- Navigate to `/story` to step through the 4 narrative scenes.
- Download the `.twbx` extract directly from the **Tableau Files** navigation menu.

### 2. Open in Tableau Public / Desktop
- Double-click [`olympic_analytics_final.twbx`](file:///c:/Users/Hp/Desktop/olympic/olympic_analytics_final.twbx).
- Switch to the **GLOBAL OLYMPIC PERFORMANCE** tab to interact with the executive dashboard.
- Switch to the **Olympic Games Performance Story** tab to step through the guided presentation points.

---

## 📊 Verified Metric Scorecard

| Analytical Metric | Ground Truth Value | Verification Method | Status |
| :--- | :---: | :--- | :---: |
| **Gold Medals** | 1,959 | Sum of `medal_results.gold` | **VERIFIED** |
| **Silver Medals** | 1,917 | Sum of `medal_results.silver` | **VERIFIED** |
| **Bronze Medals** | 2,149 | Sum of `medal_results.bronze` | **VERIFIED** |
| **Total Medals** | 6,025 | $1,959 + 1,917 + 2,149$ | **VERIFIED** |
| **Medal Points** | 11,860 | $(G \times 3) + (S \times 2) + (B \times 1)$ | **VERIFIED** |
| **Total Athletes Sent** | 47,208 | Sum of delegation appearances | **VERIFIED** |
| **Olympic Games Editions** | 18 | 10 Summer, 8 Winter (1992–2026) | **VERIFIED** |
| **Sovereign Nations** | 60 | 60 distinct NOC codes | **VERIFIED** |
| **Host Nations Corrected** | 18 / 18 | Reclassified London 2012 UK host | **VERIFIED** |
| **Cartesian Join Inflation** | 0.0% | $53.65\times$ fan-out eliminated via Logical Model | **VERIFIED** |

---

## 👥 Authorship & Governance
- **Role:** Senior Data Analyst, Tableau Developer, and Full-Stack Integration Specialist
- **Workspace:** `c:\Users\Hp\Desktop\olympic\`
- **Project Completion:** 100% of Course Requirements Delivered & Validated.
