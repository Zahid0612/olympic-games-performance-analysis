import os
import json
import pandas as pd
from flask import Flask, render_template, jsonify, request, send_from_directory

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load datasets into memory on startup
MEDALS_CSV = os.path.join(BASE_DIR, 'medal_results.csv')
GAMES_CSV = os.path.join(BASE_DIR, 'games_summary.csv')
RANKINGS_CSV = os.path.join(BASE_DIR, 'alltime_country_rankings.csv')
ATHLETES_CSV = os.path.join(BASE_DIR, 'athletes.csv')

df_medals = pd.read_csv(MEDALS_CSV)
df_games = pd.read_csv(GAMES_CSV)
df_rankings = pd.read_csv(RANKINGS_CSV)
df_athletes = pd.read_csv(ATHLETES_CSV)

# Add corrected host nation flag to medals dataframe
df_medals['host_nation_fixed'] = ((df_medals['country'] == df_medals['host_country']) |
                                  ((df_medals['country'] == 'Great Britain') & (df_medals['host_country'] == 'United Kingdom'))).astype(int)

# Add BMI Category to athletes
def categorize_bmi(bmi):
    if bmi < 18.5: return 'Underweight'
    elif bmi < 25.0: return 'Normal Weight'
    elif bmi < 30.0: return 'Overweight'
    else: return 'Obese'

df_athletes['bmi_category'] = df_athletes['bmi'].apply(categorize_bmi)

@app.route('/')
def home():
    total_medals = int(df_medals['total_medals'].sum())
    total_gold = int(df_medals['gold'].sum())
    total_points = int(df_medals['medal_points'].sum())
    total_nations = int(df_medals['country'].nunique())
    total_editions = int(len(df_games))
    total_athletes_sent = int(df_medals['athletes_sent'].sum())

    top10 = df_rankings.sort_values('total_medals', ascending=False).head(10).to_dict(orient='records')
    editions = df_games.sort_values(['year', 'season']).to_dict(orient='records')

    return render_template('index.html',
                           kpis={
                               'total_medals': total_medals,
                               'total_gold': total_gold,
                               'total_points': total_points,
                               'total_nations': total_nations,
                               'total_editions': total_editions,
                               'total_athletes': total_athletes_sent
                           },
                           top10=top10,
                           editions=editions)

@app.route('/dashboard')
def dashboard():
    years = sorted(df_medals['year'].unique().tolist())
    seasons = sorted(df_medals['season'].unique().tolist())
    countries = sorted(df_medals['country'].unique().tolist())
    
    # Check if Tableau Public Embed URL is provided in environment or config
    tableau_embed_url = os.environ.get('TABLEAU_EMBED_URL', '')

    return render_template('dashboard.html',
                           years=years,
                           seasons=seasons,
                           countries=countries,
                           tableau_embed_url=tableau_embed_url)

@app.route('/story')
def story():
    tableau_embed_url = os.environ.get('TABLEAU_STORY_URL', '')
    return render_template('story.html', tableau_embed_url=tableau_embed_url)

@app.route('/athletes')
def athletes():
    sports = sorted(df_athletes['sport'].unique().tolist())
    categories = sorted(df_athletes['sport_category'].unique().tolist())
    countries = sorted(df_athletes['country'].unique().tolist())
    
    summary = {
        'total_athletes': len(df_athletes),
        'male_count': int((df_athletes['gender'] == 'Male').sum()),
        'female_count': int((df_athletes['gender'] == 'Female').sum()),
        'avg_age': round(float(df_athletes['age_at_peak'].mean()), 1),
        'avg_height': round(float(df_athletes['height_cm'].mean()), 1),
        'avg_weight': round(float(df_athletes['weight_kg'].mean()), 1),
        'avg_bmi': round(float(df_athletes['bmi'].mean()), 1),
        'world_records': int(df_athletes['world_record_holder'].sum())
    }

    return render_template('athletes.html',
                           summary=summary,
                           sports=sports,
                           categories=categories,
                           countries=countries)

@app.route('/download/<filename>')
def download_file(filename):
    allowed_files = [
        'olympic_analytics_final.twb',
        'olympic_analytics_final.twbx',
        'olympic_analytics_repaired.twb',
        'olympic_analytics_repaired.twbx'
    ]
    if filename in allowed_files:
        return send_from_directory(BASE_DIR, filename, as_attachment=True)
    return "File not found or unauthorized", 404

# --- JSON API Endpoints for Interactive Dashboard ---

@app.route('/api/kpis')
def api_kpis():
    year = request.args.get('year')
    season = request.args.get('season')
    country = request.args.get('country')

    filtered = df_medals.copy()
    if year and year != 'All':
        filtered = filtered[filtered['year'] == int(year)]
    if season and season != 'All':
        filtered = filtered[filtered['season'] == season]
    if country and country != 'All':
        filtered = filtered[filtered['country'] == country]

    total_medals = int(filtered['total_medals'].sum())
    gold = int(filtered['gold'].sum())
    silver = int(filtered['silver'].sum())
    bronze = int(filtered['bronze'].sum())
    points = int(filtered['medal_points'].sum())
    athletes_sent = int(filtered['athletes_sent'].sum())
    efficiency = round((points / athletes_sent), 2) if athletes_sent > 0 else 0.0

    return jsonify({
        'total_medals': total_medals,
        'gold': gold,
        'silver': silver,
        'bronze': bronze,
        'points': points,
        'athletes_sent': athletes_sent,
        'efficiency': efficiency,
        'nations_count': int(filtered['country'].nunique())
    })

@app.route('/api/top-countries')
def api_top_countries():
    year = request.args.get('year')
    season = request.args.get('season')
    limit = int(request.args.get('limit', 10))

    filtered = df_medals.copy()
    if year and year != 'All':
        filtered = filtered[filtered['year'] == int(year)]
    if season and season != 'All':
        filtered = filtered[filtered['season'] == season]

    grouped = filtered.groupby('country').agg({
        'gold': 'sum',
        'silver': 'sum',
        'bronze': 'sum',
        'total_medals': 'sum',
        'medal_points': 'sum',
        'athletes_sent': 'sum'
    }).reset_index()

    grouped = grouped.sort_values(['total_medals', 'gold', 'medal_points'], ascending=False).head(limit)
    return jsonify(grouped.to_dict(orient='records'))

@app.route('/api/trends')
def api_trends():
    season = request.args.get('season')
    country = request.args.get('country')

    filtered = df_medals.copy()
    if season and season != 'All':
        filtered = filtered[filtered['season'] == season]
    if country and country != 'All':
        filtered = filtered[filtered['country'] == country]

    trend = filtered.groupby(['year', 'season', 'host_city']).agg({
        'gold': 'sum',
        'silver': 'sum',
        'bronze': 'sum',
        'total_medals': 'sum',
        'medal_points': 'sum',
        'athletes_sent': 'sum'
    }).reset_index().sort_values(['year', 'season'])

    trend['edition_label'] = trend['host_city'] + ' ' + trend['year'].astype(str) + ' (' + trend['season'] + ')'
    return jsonify(trend.to_dict(orient='records'))

@app.route('/api/season-comparison')
def api_season_comparison():
    country = request.args.get('country')
    filtered = df_medals.copy()
    if country and country != 'All':
        filtered = filtered[filtered['country'] == country]

    comp = filtered.groupby('season').agg({
        'gold': 'sum',
        'silver': 'sum',
        'bronze': 'sum',
        'total_medals': 'sum',
        'medal_points': 'sum',
        'athletes_sent': 'sum'
    }).reset_index()

    return jsonify(comp.to_dict(orient='records'))

@app.route('/api/athlete-biometrics')
def api_athlete_biometrics():
    sport_category = request.args.get('category')
    gender = request.args.get('gender')
    
    filtered = df_athletes.copy()
    if sport_category and sport_category != 'All':
        filtered = filtered[filtered['sport_category'] == sport_category]
    if gender and gender != 'All':
        filtered = filtered[filtered['gender'] == gender]

    sample = filtered[['name', 'country', 'sport', 'sport_category', 'gender', 'height_cm', 'weight_kg', 'bmi', 'bmi_category', 'total_medals']].head(300)
    
    bmi_counts = filtered['bmi_category'].value_counts().to_dict()
    category_height = filtered.groupby('sport_category')['height_cm'].mean().round(1).to_dict()
    category_weight = filtered.groupby('sport_category')['weight_kg'].mean().round(1).to_dict()

    return jsonify({
        'bmi_counts': bmi_counts,
        'category_height': category_height,
        'category_weight': category_weight,
        'sample': sample.to_dict(orient='records')
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Olympic Analytics Flask Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
