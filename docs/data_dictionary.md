# Olympic Analytics Project — Data Dictionary

This data dictionary provides complete technical and business definitions for all columns across the four project CSV files.

---

## 1. Table: `alltime_country_rankings.csv`

- **Description:** Pre-aggregated all-time historical performance summary for 60 national Olympic committees from 1992 to 2026.
- **Granularity:** 1 record per Country / NOC (60 rows, 13 columns).
- **Candidate Primary Key:** `country` or `noc_code`.

| Field Name | Inferred Python Type | Tableau Recommended Type | Role | Nullable | Distinct Count | Valid Range / Categories | Description & Business Rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `country` | `object (str)` | String (Geographic: Country) | Dimension | No | 60 | 60 country names (e.g., United States, China, Germany) | Full name of the participating nation. |
| `noc_code` | `object (str)` | String | Dimension | No | 60 | 3-letter IOC codes (USA, CHN, GBR, etc.) | National Olympic Committee standard 3-letter code. |
| `region` | `object (str)` | String | Dimension | No | 7 | Africa, Asia, Europe, Europe/Asia, North America, Oceania, South America | Continental/geographic region. |
| `games_entered`| `int64` | Number (whole) | Measure | No | 11 | 7 to 18 | Total number of Olympic editions (Summer & Winter) entered between 1992 and 2026. |
| `total_gold` | `int64` | Number (whole) | Measure | No | 42 | 3 to 250 | Cumulative gold medals won across all 18 editions. |
| `total_silver` | `int64` | Number (whole) | Measure | No | 44 | 4 to 230 | Cumulative silver medals won across all 18 editions. |
| `total_bronze` | `int64` | Number (whole) | Measure | No | 45 | 4 to 277 | Cumulative bronze medals won across all 18 editions. |
| `total_medals` | `int64` | Number (whole) | Measure | No | 51 | 12 to 735 | Sum of all gold, silver, and bronze medals: `total_gold + total_silver + total_bronze`. |
| `total_medal_points` | `int64` | Number (whole) | Measure | No | 53 | 25 to 1443 | Weighted medal score: `(total_gold * 3) + (total_silver * 2) + (total_bronze * 1)`. |
| `avg_efficiency_pct` | `float64` | Number (decimal) | Measure | No | 57 | 10.96 to 14.12 | Mean efficiency ratio across all editions entered: `Average(total_medals / athletes_sent * 100)`. |
| `summer_medals`| `int64` | Number (whole) | Measure | No | 49 | 7 to 380 | Total medals won during Summer Olympic Games editions. |
| `winter_medals`| `int64` | Number (whole) | Measure | No | 44 | 0 to 380 | Total medals won during Winter Olympic Games editions. |
| `overall_rank` | `int64` | Number (whole) | Dimension / Measure | No | 60 | 1 to 60 | Official leaderboard rank, sorted primarily by `total_gold`, then `total_silver`, then `total_bronze`. |

---

## 2. Table: `athletes.csv`

- **Description:** Detailed biographical, anthropometric, athletic training, and historical achievement data for individual Olympic competitors.
- **Granularity:** 1 record per athlete (8,000 rows, 26 columns).
- **Candidate Primary Key:** `athlete_id`.

| Field Name | Inferred Python Type | Tableau Recommended Type | Role | Nullable | Distinct Count | Valid Range / Categories | Description & Business Rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `athlete_id` | `object (str)` | String | Dimension | No | 8,000 | `A000001` to `A008000` | Unique alphanumeric identifier for each athlete. |
| `name` | `object (str)` | String | Dimension | No | 1,720 | 1,720 unique names | Athlete's full name (synthetic/representative athlete profiles). |
| `gender` | `object (str)` | String | Dimension | No | 2 | `Female` (3,821), `Male` (4,179) | Biological sex / Olympic competition category. |
| `age_at_peak` | `int64` | Number (whole) | Dimension / Measure | No | 35 | 15 to 50 (Mean: 26.6, Median: 26) | Age of the athlete during peak performance / medal window. |
| `country` | `object (str)` | String (Geographic) | Dimension | No | 60 | 60 country names matching rankings/medals | Country represented by the athlete. |
| `noc_code` | `object (str)` | String | Dimension | No | 60 | 60 3-letter NOC codes matching rankings/medals | NOC code for the athlete's country. |
| `region` | `object (str)` | String | Dimension | No | 7 | 7 continental regions | Geographical region of the represented nation. |
| `sport` | `object (str)` | String | Dimension | No | 50 | 50 distinct Olympic sports | Specific Olympic sport/discipline (e.g., Diving, Swimming, Skiing, Judo). |
| `sport_category`| `object (str)` | String | Dimension | No | 21 | 21 high-level categories (Team Ball, Combat, Skiing, Racquet, Aquatics, etc.) | Grouping category of sports disciplines. |
| `season` | `object (str)` | String | Dimension | No | 2 | `Summer` (6,007), `Winter` (1,993) | Olympic Games seasonal classification. |
| `first_games_year`| `int64` | Date / Number | Dimension | No | 16 | 1992 to 2022 | First Olympic Games edition year in which the athlete competed. |
| `last_games_year` | `int64` | Date / Number | Dimension | No | 18 | 1992 to 2026 | Most recent Olympic Games edition year in which the athlete competed. |
| `games_participated`| `int64`| Number (whole) | Measure | No | 4 | 1 to 4 | Total number of Olympic Games editions attended across career. |
| `gold_medals` | `int64` | Number (whole) | Measure | No | 6 | 0 to 5 | Career Olympic gold medals won. |
| `silver_medals`| `int64` | Number (whole) | Measure | No | 6 | 0 to 5 | Career Olympic silver medals won. |
| `bronze_medals`| `int64` | Number (whole) | Measure | No | 7 | 0 to 6 | Career Olympic bronze medals won. |
| `total_medals` | `int64` | Number (whole) | Measure | No | 11 | 0 to 10 | Career total medals won (`gold + silver + bronze`). |
| `world_record_holder`| `int64` | Boolean / Number | Dimension | No | 2 | `0` (7,814), `1` (186) | Flag indicating whether athlete has held a recognized world record. |
| `personal_best_rank_world`| `int64` | Number (whole) | Measure | No | 499 | 1 to 499 | Athlete's highest global rank achieved in their discipline. |
| `height_cm` | `int64` | Number (whole) | Measure | No | 65 | 150 to 220 cm (Mean: 172.5 cm) | Athlete height in centimeters. |
| `weight_kg` | `int64` | Number (whole) | Measure | No | 72 | 45 to 119 kg (Mean: 70.8 kg) | Athlete weight in kilograms. |
| `bmi` | `float64` | Number (decimal) | Measure | No | 237 | 13.0 to 40.0 (Mean: 23.8) | Body Mass Index: `weight_kg / ((height_cm / 100) ^ 2)`. |
| `training_hours_per_week`| `int64`| Number (whole) | Measure | No | 41 | 10 to 50 hrs (Mean: 27.7 hrs) | Weekly dedicated training volume. |
| `professional_athlete` | `int64` | Boolean / Number | Dimension | No | 2 | `0` (1,507), `1` (6,493) | Flag: `1` if competitor is a full-time professional athlete, `0` if amateur/semi-pro. |
| `doping_violation` | `int64` | Boolean / Number | Dimension | No | 2 | `0` (7,881), `1` (119) | Flag: `1` if athlete incurred an official anti-doping sanction. |
| `most_recent_medal_2020plus`| `int64`| Boolean / Number | Dimension | No | 2 | `0` (6,420), `1` (1,580) | Flag: `1` if athlete won an Olympic medal in 2020 or later. |

---

## 3. Table: `games_summary.csv`

- **Description:** High-level summary of each Olympic Games edition from 1992 to 2026.
- **Granularity:** 1 record per Olympic Games Edition (18 rows, 10 columns).
- **Candidate Primary Key:** Composite (`year`, `season`) or `year` (unique in this 1992–2026 span).

| Field Name | Inferred Python Type | Tableau Recommended Type | Role | Nullable | Distinct Count | Valid Range / Categories | Description & Business Rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `year` | `int64` | Date / Number (whole) | Dimension | No | 18 | 1992 to 2026 (Even years) | Olympic Games calendar year. |
| `host_city` | `object (str)` | String (Geographic: City) | Dimension | No | 17 | Barcelona, Lillehammer, Atlanta, Beijing (x2), etc. | Official host city of the Olympic Games. Beijing hosted both Summer (2008) and Winter (2022). |
| `host_country` | `object (str)` | String (Geographic: Country) | Dimension | No | 14 | 14 host nations | Host nation name (e.g., Spain, Norway, United States, China). |
| `season` | `object (str)` | String | Dimension | No | 2 | `Summer` (9), `Winter` (9) | Olympic Games seasonal cycle. |
| `total_athletes` | `int64` | Number (whole) | Measure | No | 18 | 1,737 to 11,656 | Total global athlete headcount officially participating in the games. |
| `participating_nations`| `int64` | Number (whole) | Measure | No | 16 | 67 to 207 | Total number of National Olympic Committees officially competing. |
| `total_medals_awarded` | `int64` | Number (whole) | Measure | No | 16 | 305 to 363 | Total medals (Gold + Silver + Bronze) awarded across all events in that edition. |
| `gold_medals_awarded` | `int64` | Number (whole) | Measure | No | 17 | 95 to 126 | Total gold medals awarded in that edition. |
| `nations_won_medal` | `int64` | Number (whole) | Measure | No | 12 | 43 to 60 | Total count of nations that won at least 1 medal in that edition. Matches row count in `medal_results.csv`. |
| `top_country` | `object (str)` | String (Geographic: Country) | Dimension | No | 3 | Germany (2), United States (8), China (8) | Country finishing first on the official medal table (strictly determined by most gold medals). |

---

## 4. Table: `medal_results.csv`

- **Description:** Longitudinal edition-by-country results, delegation counts, medal distribution, efficiency ratings, and macroeconomic indicators.
- **Granularity:** 1 record per Country per Olympic Edition (910 rows, 19 columns).
- **Candidate Primary Key:** Composite (`year`, `country`) or (`year`, `noc_code`).

| Field Name | Inferred Python Type | Tableau Recommended Type | Role | Nullable | Distinct Count | Valid Range / Categories | Description & Business Rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `year` | `int64` | Date / Number (whole) | Dimension | No | 18 | 1992 to 2026 | Calendar year of the Olympic Games. |
| `host_city` | `object (str)` | String (Geographic: City) | Dimension | No | 17 | 17 host cities | Host city of the games. |
| `host_country` | `object (str)` | String (Geographic: Country) | Dimension | No | 14 | 14 host countries | Host country of the games. |
| `season` | `object (str)` | String | Dimension | No | 2 | `Summer` (490), `Winter` (420) | Seasonal edition. |
| `country` | `object (str)` | String (Geographic: Country) | Dimension | No | 60 | 60 participating countries | Competing country name. |
| `noc_code` | `object (str)` | String | Dimension | No | 60 | 60 3-letter NOC codes | National Olympic Committee code. |
| `region` | `object (str)` | String | Dimension | No | 7 | 7 continental regions | Geographic region of the competing country. |
| `gdp_tier` | `object (str)` | String | Dimension | No | 3 | `High` (392), `Medium` (356), `Low` (162) | National GDP economic classification tier. |
| `population_million` | `int64` | Number (whole) | Measure | No | 39 | 1 to 1,411 million | National population in millions. |
| `sports_investment` | `object (str)` | String | Dimension | No | 3 | `Low` (176), `Medium` (531), `High` (203) | Government/institutional athletic funding level tier. |
| `athletes_sent` | `int64` | Number (whole) | Measure | No | 192 | 1 to 398 athletes | Size of the national delegation sent to this Olympic edition. |
| `gold` | `int64` | Number (whole) | Measure | No | 20 | 0 to 22 | Gold medals won by this country in this edition. |
| `silver` | `int64` | Number (whole) | Measure | No | 23 | 0 to 27 | Silver medals won by this country in this edition. |
| `bronze` | `int64` | Number (whole) | Measure | No | 24 | 0 to 27 | Bronze medals won by this country in this edition. |
| `total_medals` | `int64` | Number (whole) | Measure | No | 49 | 1 to 63 | Total medals won by this country in this edition (`gold + silver + bronze`). Min is 1 (only medalists included). |
| `medal_points` | `int64` | Number (whole) | Measure | No | 82 | 1 to 114 | Weighted score: `(gold * 3) + (silver * 2) + (bronze * 1)`. |
| `medal_efficiency_pct` | `float64` | Number (decimal) | Measure | No | 334 | 1.562% to 600.0% | Efficiency ratio: `(total_medals / athletes_sent) * 100`. Note: Values > 100% reflect multi-medalists or team medal counting. |
| `top_sport` | `object (str)` | String | Dimension | No | 50 | 50 sports | Sport in which this nation achieved its highest medal concentration for this edition. |
| `host_nation` | `int64` | Boolean / Number | Dimension | No | 2 | `0` (893), `1` (17) | Binary indicator: `1` if competing country is the host nation; `0` otherwise. Note: Great Britain (2012) is flagged 0 due to naming mismatch (`United Kingdom`). |

---

## 5. Metric Harmonization and Calculation Logic

### 5.1. Medal Points Calculation
Across all datasets:
$$\text{Medal Points} = (\text{Gold} \times 3) + (\text{Silver} \times 2) + (\text{Bronze} \times 1)$$
Verified exact across 100% of rows in `medal_results.csv` and `alltime_country_rankings.csv`.

### 5.2. Medal Efficiency Percentage
$$\text{Medal Efficiency \%} = \left(\frac{\text{Total Medals}}{\text{Athletes Sent}}\right) \times 100$$
Verified exact across all 910 rows in `medal_results.csv`.

### 5.3. Body Mass Index (BMI)
$$\text{BMI} = \frac{\text{Weight (kg)}}{(\text{Height (m)})^2} = \frac{\text{weight\_kg}}{\left(\frac{\text{height\_cm}}{100}\right)^2}$$
Verified exact to 1 decimal place across all 8,000 rows in `athletes.csv`.
