/**
 * OLYMPIC ANALYTICS — CLIENT CONTROLLER & CHART ENGINE
 * Integrates Chart.js, dynamic REST filtering, Tableau Story navigator, and biometrics
 */

// Global Chart References to allow seamless updates
let chartTopCountries = null;
let chartMedalDistribution = null;
let chartMedalTrends = null;
let chartSeasonComparison = null;

// Initialize Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }
});

// Chart.js Global Default Theme Settings
if (window.Chart) {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(7, 13, 30, 0.95)';
    Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
    Chart.defaults.plugins.tooltip.bodyColor = '#cbd5e1';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.15)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
}

// ==========================================================================
// DASHBOARD INITIALIZATION & FILTER CONTROLLER
// ==========================================================================
function initDashboard() {
    const filterSeason = document.getElementById('filterSeason');
    const filterYear = document.getElementById('filterYear');
    const filterCountry = document.getElementById('filterCountry');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const toggleTableauEmbedBtn = document.getElementById('toggleTableauEmbedBtn');
    const tableauEmbedSection = document.getElementById('tableauEmbedSection');

    if (toggleTableauEmbedBtn && tableauEmbedSection) {
        toggleTableauEmbedBtn.addEventListener('click', () => {
            if (tableauEmbedSection.style.display === 'none') {
                tableauEmbedSection.style.display = 'block';
                toggleTableauEmbedBtn.textContent = '❌ Close Tableau Embed View';
            } else {
                tableauEmbedSection.style.display = 'none';
                toggleTableauEmbedBtn.textContent = '🌐 Toggle Tableau Public Embed';
            }
        });
    }

    function reloadAll() {
        const season = filterSeason ? filterSeason.value : 'All';
        const year = filterYear ? filterYear.value : 'All';
        const country = filterCountry ? filterCountry.value : 'All';

        fetchKpis(season, year, country);
        fetchTopCountries(season, year);
        fetchTrends(season, country);
        fetchSeasonComparison(country);
    }

    if (filterSeason) filterSeason.addEventListener('change', reloadAll);
    if (filterYear) filterYear.addEventListener('change', reloadAll);
    if (filterCountry) filterCountry.addEventListener('change', reloadAll);

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (filterSeason) filterSeason.value = 'All';
            if (filterYear) filterYear.value = 'All';
            if (filterCountry) filterCountry.value = 'All';
            reloadAll();
        });
    }

    // Initial load
    reloadAll();
}

function fetchKpis(season, year, country) {
    const url = `/api/kpis?season=${encodeURIComponent(season)}&year=${encodeURIComponent(year)}&country=${encodeURIComponent(country)}`;
    fetch(url)
        .then(r => r.json())
        .then(data => {
            document.getElementById('kpiMedals').textContent = Number(data.total_medals).toLocaleString();
            document.getElementById('kpiGold').textContent = Number(data.gold).toLocaleString();
            document.getElementById('kpiSilver').textContent = Number(data.silver).toLocaleString();
            document.getElementById('kpiBronze').textContent = Number(data.bronze).toLocaleString();
            document.getElementById('kpiPoints').textContent = Number(data.points).toLocaleString();
            document.getElementById('kpiAthletes').textContent = Number(data.athletes_sent).toLocaleString();
            document.getElementById('kpiEfficiency').textContent = data.efficiency.toFixed(2);
            document.getElementById('kpiNationsCount').textContent = `${data.nations_count} Nations`;
        })
        .catch(err => console.error('Error fetching KPIs:', err));
}

function fetchTopCountries(season, year) {
    const url = `/api/top-countries?season=${encodeURIComponent(season)}&year=${encodeURIComponent(year)}&limit=10`;
    fetch(url)
        .then(r => r.json())
        .then(data => {
            renderTopCountriesChart(data);
            renderMedalDistributionChart(data);
        })
        .catch(err => console.error('Error fetching Top Countries:', err));
}

function renderTopCountriesChart(data) {
    const ctx = document.getElementById('chartTopCountries');
    if (!ctx) return;

    const labels = data.map(d => d.country);
    const totalMedals = data.map(d => d.total_medals);
    const medalPoints = data.map(d => d.medal_points);

    if (chartTopCountries) chartTopCountries.destroy();

    chartTopCountries = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Medals',
                    data: totalMedals,
                    backgroundColor: 'rgba(59, 130, 246, 0.75)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Weighted Points',
                    data: medalPoints,
                    backgroundColor: 'rgba(245, 158, 11, 0.65)',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function renderMedalDistributionChart(data) {
    const ctx = document.getElementById('chartMedalDistribution');
    if (!ctx) return;

    const labels = data.map(d => d.country);
    const gold = data.map(d => d.gold);
    const silver = data.map(d => d.silver);
    const bronze = data.map(d => d.bronze);

    if (chartMedalDistribution) chartMedalDistribution.destroy();

    chartMedalDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gold 🥇',
                    data: gold,
                    backgroundColor: '#f59e0b',
                    borderWidth: 0,
                    borderRadius: 3
                },
                {
                    label: 'Silver 🥈',
                    data: silver,
                    backgroundColor: '#cbd5e1',
                    borderWidth: 0,
                    borderRadius: 3
                },
                {
                    label: 'Bronze 🥉',
                    data: bronze,
                    backgroundColor: '#d97706',
                    borderWidth: 0,
                    borderRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function fetchTrends(season, country) {
    const url = `/api/trends?season=${encodeURIComponent(season)}&country=${encodeURIComponent(country)}`;
    fetch(url)
        .then(r => r.json())
        .then(data => {
            renderTrendsChart(data);
        })
        .catch(err => console.error('Error fetching trends:', err));
}

function renderTrendsChart(data) {
    const ctx = document.getElementById('chartMedalTrends');
    if (!ctx) return;

    const labels = data.map(d => d.edition_label);
    const medals = data.map(d => d.total_medals);
    const points = data.map(d => d.medal_points);

    if (chartMedalTrends) chartMedalTrends.destroy();

    chartMedalTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Medals Awarded',
                    data: medals,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Weighted Points Score',
                    data: points,
                    borderColor: '#f59e0b',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.35,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { maxRotation: 45, minRotation: 20 },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function fetchSeasonComparison(country) {
    const url = `/api/season-comparison?country=${encodeURIComponent(country)}`;
    fetch(url)
        .then(r => r.json())
        .then(data => {
            renderSeasonComparisonChart(data);
        })
        .catch(err => console.error('Error fetching season comparison:', err));
}

function renderSeasonComparisonChart(data) {
    const ctx = document.getElementById('chartSeasonComparison');
    if (!ctx) return;

    const seasons = data.map(d => d.season);
    const gold = data.map(d => d.gold);
    const silver = data.map(d => d.silver);
    const bronze = data.map(d => d.bronze);
    const total = data.map(d => d.total_medals);

    if (chartSeasonComparison) chartSeasonComparison.destroy();

    chartSeasonComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: seasons,
            datasets: [
                {
                    label: 'Gold 🥇',
                    data: gold,
                    backgroundColor: '#f59e0b',
                    borderRadius: 4
                },
                {
                    label: 'Silver 🥈',
                    data: silver,
                    backgroundColor: '#cbd5e1',
                    borderRadius: 4
                },
                {
                    label: 'Bronze 🥉',
                    data: bronze,
                    backgroundColor: '#d97706',
                    borderRadius: 4
                },
                {
                    label: 'Total Medals',
                    data: total,
                    backgroundColor: 'rgba(59, 130, 246, 0.4)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

// ==========================================================================
// TABLEAU STORY NARRATIVE ENGINE
// ==========================================================================
function initStory() {
    const tabs = document.querySelectorAll('.story-tab');
    const scenes = document.querySelectorAll('.story-scene-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sceneId = tab.getAttribute('data-scene');

            tabs.forEach(t => t.classList.remove('active'));
            scenes.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const targetScene = document.getElementById(`scene-${sceneId}`);
            if (targetScene) targetScene.classList.add('active');

            // Render scene-specific chart when viewed
            renderSceneChart(sceneId);
        });
    });

    // Render Scene 1 chart initially
    renderSceneChart('1');
}

const renderedScenes = {};

function renderSceneChart(sceneId) {
    if (renderedScenes[sceneId]) return;

    if (sceneId === '1') {
        const ctx = document.getElementById('scene1Chart');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Gold Medals (1,959)', 'Silver Medals (1,917)', 'Bronze Medals (2,149)'],
                datasets: [{
                    data: [1959, 1917, 2149],
                    backgroundColor: ['#f59e0b', '#cbd5e1', '#d97706'],
                    borderWidth: 2,
                    borderColor: '#070d1e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
        renderedScenes['1'] = true;
    } else if (sceneId === '2') {
        const ctx = document.getElementById('scene2Chart');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['United States', 'China', 'Russia', 'Great Britain', 'Germany', 'Japan', 'Australia', 'France', 'Italy', 'South Korea'],
                datasets: [{
                    label: 'Total Medals',
                    data: [735, 696, 429, 401, 336, 308, 280, 260, 198, 190],
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }, {
                    label: 'Gold Medals',
                    data: [250, 230, 130, 120, 116, 98, 101, 86, 59, 58],
                    backgroundColor: '#f59e0b',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
        renderedScenes['2'] = true;
    } else if (sceneId === '3') {
        const ctx = document.getElementById('scene3Chart');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1992 (S)', '1994 (W)', '1996 (S)', '1998 (W)', '2000 (S)', '2002 (W)', '2004 (S)', '2006 (W)', '2008 (S)', '2010 (W)', '2012 (S)', '2014 (W)', '2016 (S)', '2018 (W)', '2020 (S)', '2022 (W)', '2024 (S)', '2026 (W)'],
                datasets: [{
                    label: 'Total Medals Awarded Per Games',
                    data: [329, 340, 326, 328, 305, 342, 348, 313, 357, 339, 324, 342, 358, 332, 363, 326, 319, 334],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
        renderedScenes['3'] = true;
    } else if (sceneId === '4') {
        const ctx = document.getElementById('scene4Chart');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Summer Games (10 Editions)', 'Winter Games (8 Editions)'],
                datasets: [
                    { label: 'Gold Medals', data: [999, 960], backgroundColor: '#f59e0b' },
                    { label: 'Silver Medals', data: [957, 960], backgroundColor: '#cbd5e1' },
                    { label: 'Bronze Medals', data: [1073, 1076], backgroundColor: '#d97706' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
        renderedScenes['4'] = true;
    }
}

// ==========================================================================
// ATHLETES BIOMETRICS INITIALIZATION
// ==========================================================================
function initAthletes() {
    fetch('/api/athlete-biometrics')
        .then(r => r.json())
        .then(data => {
            // BMI Donut
            const bmiCtx = document.getElementById('chartBmiDistribution');
            if (bmiCtx) {
                new Chart(bmiCtx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(data.bmi_counts),
                        datasets: [{
                            data: Object.values(data.bmi_counts),
                            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                            borderWidth: 2,
                            borderColor: '#070d1e'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'right' } }
                    }
                });
            }

            // Sport Biometrics Bar
            const sportCtx = document.getElementById('chartSportBiometrics');
            if (sportCtx) {
                const categories = Object.keys(data.category_height).slice(0, 10);
                const heights = categories.map(c => data.category_height[c]);
                const weights = categories.map(c => data.category_weight[c]);

                new Chart(sportCtx, {
                    type: 'bar',
                    data: {
                        labels: categories,
                        datasets: [
                            {
                                label: 'Avg Height (cm)',
                                data: heights,
                                backgroundColor: '#3b82f6',
                                borderRadius: 4
                            },
                            {
                                label: 'Avg Weight (kg)',
                                data: weights,
                                backgroundColor: '#f59e0b',
                                borderRadius: 4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: { ticks: { maxRotation: 45, minRotation: 20 }, grid: { display: false } },
                            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                        },
                        plugins: { legend: { position: 'top' } }
                    }
                });
            }
        })
        .catch(err => console.error('Error fetching athletes data:', err));
}
