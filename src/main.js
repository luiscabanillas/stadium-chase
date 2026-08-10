import { ALL_MLB_STADIUMS, VISITS, TEAM_COLORS, TEAM_IDS, EXTRA_GAMES } from './stadiums.js';
import { t, getLang, setLang, getDateLocale, detectLang, langPath } from './i18n.js';

const STADIUM_BLUEPRINTS = {
  'yankee-stadium': '/stadium-blueprints/100/yankee-stadium.png',
  'fenway-park': '/stadium-blueprints/100/fenway-park.png',
  'camden-yards': '/stadium-blueprints/100/camden-yards.png',
  'tropicana-field': '/stadium-blueprints/100/tropicana-field.png',
  'rogers-centre': '/stadium-blueprints/100/rogers-centre.png',
  'guaranteed-rate': '/stadium-blueprints/100/guaranteed-rate.png',
  'progressive-field': '/stadium-blueprints/100/progressive-field.png',
  'comerica-park': '/stadium-blueprints/100/comerica-park.png',
  'kauffman-stadium': '/stadium-blueprints/100/kauffman-stadium.png',
  'target-field': '/stadium-blueprints/100/target-field.png',
  'minute-maid': '/stadium-blueprints/100/daikin-park.png',
  'angel-stadium': '/stadium-blueprints/100/angel-stadium.png',
  'oakland-coliseum': '/stadium-blueprints/100/oakland-coliseum.png',
  't-mobile-park': '/stadium-blueprints/100/t-mobile-park.png',
  'globe-life': '/stadium-blueprints/100/globe-life-field.png',
  'truist-park': '/stadium-blueprints/100/truist-park.png',
  'loandepot-park': '/stadium-blueprints/100/loandepot-park.png',
  'citi-field': '/stadium-blueprints/100/citi-field.png',
  'citizens-bank': '/stadium-blueprints/100/citizens-bank-park.png',
  'nationals-park': '/stadium-blueprints/100/nationals-park.png',
  'wrigley-field': '/stadium-blueprints/100/wrigley-field.png',
  'great-american': '/stadium-blueprints/100/great-american-ballpark.png',
  'american-family': '/stadium-blueprints/100/american-family-field.png',
  'pnc-park': '/stadium-blueprints/100/pnc-park.png',
  'busch-stadium': '/stadium-blueprints/100/busch-stadium.png',
  'chase-field': '/stadium-blueprints/100/chase-field.png',
  'coors-field': '/stadium-blueprints/100/coors-field.png',
  'dodger-stadium': '/stadium-blueprints/100/dodger-stadium.png',
  'petco-park': '/stadium-blueprints/100/petco-park.png',
  'oracle-park': '/stadium-blueprints/100/oracle-park.png',
};

function teamLogo(teamName, size = 24) {
  const id = TEAM_IDS[teamName];
  if (!id) return '';
  return `<img src="https://www.mlbstatic.com/team-logos/team-cap-on-dark/${id}.svg" width="${size}" height="${size}" alt="" style="vertical-align:middle" />`;
}

// Light color overrides for teams whose primary is too dark on dark backgrounds
const PANEL_COLOR_OVERRIDES = {
  "Chicago White Sox": "#C4CED4",
  "Pittsburgh Pirates": "#FDB827",
  "San Diego Padres": "#FFC425",
  "Oakland Athletics": "#EFB21E",
  "Detroit Tigers": "#FA4616",
  "Tampa Bay Rays": "#8FBCE6",
  "Cleveland Guardians": "#E31937",
  "Seattle Mariners": "#005C5C",
  "New York Yankees": "#5A8DBE",
  "Houston Astros": "#EB6E1F",
  "Minnesota Twins": "#D31145",
  "New York Mets": "#FF5910",
  "Colorado Rockies": "#8686b3",
};

function panelTeamColor(team) {
  return PANEL_COLOR_OVERRIDES[team] || TEAM_COLORS[team]?.primary;
}

const visitMap = new Map();
VISITS.forEach(v => visitMap.set(v.stadiumId, v));

const visitOrder = new Map();
[...VISITS].sort((a, b) => a.date.localeCompare(b.date)).forEach((v, i) => {
  visitOrder.set(v.stadiumId, i + 1);
});

const visitedYears = [...new Set(VISITS.map(v => v.year))].sort();

const extraGamesMap = new Map();
EXTRA_GAMES.forEach(g => {
  if (!extraGamesMap.has(g.stadiumId)) extraGamesMap.set(g.stadiumId, []);
  extraGamesMap.get(g.stadiumId).push(g);
});

// Places I lived (home base over time), sorted by move-in date.
const HOMES = [
  { id: 'bellevue',    city: 'Bellevue, WA',    lat: 47.6101, lng: -122.2015, start: '2015-02-01', teams: ['Seattle Mariners'] },
  { id: 'san-jose',    city: 'San Jose, CA',    lat: 37.3382, lng: -121.8863, start: '2016-11-01', teams: ['San Francisco Giants', 'Oakland Athletics'] },
  { id: 'bloomington', city: 'Bloomington, MN', lat: 44.8408, lng:  -93.2983, start: '2017-08-01', teams: ['Minnesota Twins'] },
  { id: 'lynnwood',    city: 'Lynnwood, WA',    lat: 47.8279, lng: -122.3054, start: '2019-05-01', teams: ['Seattle Mariners'] },
];

// The home base in effect on a given date string ("YYYY-MM-DD").
function homeAtDate(dateStr) {
  let home = HOMES[0];
  for (const h of HOMES) {
    if (dateStr >= h.start) home = h; else break;
  }
  return home;
}

const CURRENT_HOME = HOMES[HOMES.length - 1];

// Visits grouped by date, for the playback travel animation.
const visitsByDate = new Map();
VISITS.forEach(v => {
  if (!visitsByDate.has(v.date)) visitsByDate.set(v.date, []);
  visitsByDate.get(v.date).push(v);
});

// Multi-stadium trips I did by car in a single roadtrip. These animate as one
// continuous drive (home → stops → home) instead of separate trips, fired on
// the first stop's date.
// `transit` is how I got between home and the region: 'car' for the Midwest
// drives, 'plane' for trips I flew to and then drove between cities.
const ROADTRIPS = [
  { homeId: 'bloomington', stops: ['guaranteed-rate', 'wrigley-field'], transit: 'car' },   // Chicago: White Sox + Cubs
  { homeId: 'bloomington', stops: ['busch-stadium', 'kauffman-stadium'], transit: 'car' },   // St. Louis + Kansas City
  { homeId: 'lynnwood', stops: ['nationals-park', 'citizens-bank', 'camden-yards'], transit: 'plane' }, // DC + Philly + Baltimore
];

const roadtripStopIds = new Set();           // stadiumIds handled as part of a roadtrip
const roadtripByTriggerDate = new Map();     // first-stop date -> { homeId, transit, stops (date-ordered) }
ROADTRIPS.forEach(rt => {
  const dated = rt.stops.filter(id => visitMap.get(id)?.date);
  if (dated.length < 2) return;
  const ordered = dated.slice().sort((a, b) => visitMap.get(a).date.localeCompare(visitMap.get(b).date));
  ordered.forEach(id => roadtripStopIds.add(id));
  roadtripByTriggerDate.set(visitMap.get(ordered[0]).date, { homeId: rt.homeId, transit: rt.transit || 'car', stops: ordered });
});

// Generic great-circle distance in km between two lat/lng points.
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const SHORT_NAMES = {
  "Red Sox": "Red Sox", "White Sox": "White Sox", "Blue Jays": "Blue Jays",
  "National League": "NL", "American League": "AL",
};
function shortName(fullTeam) {
  for (const [k, v] of Object.entries(SHORT_NAMES)) {
    if (fullTeam.endsWith(k)) return v;
  }
  return fullTeam.split(' ').pop();
}

const DEFAULT_VIEW = { center: [40, -97], zoom: 5 };

const map = L.map('map', {
  center: DEFAULT_VIEW.center,
  zoom: DEFAULT_VIEW.zoom,
  minZoom: 3,
  maxZoom: 18,
  zoomControl: false,
});
window.__map = map;

L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20,
}).addTo(map);

function makeMarkerIcon(stadium, visited) {
  if (visited === undefined) visited = visitMap.has(stadium.id);
  const blueprint = STADIUM_BLUEPRINTS[stadium.id];

  if (blueprint) {
    const size = 44;
    const glow = visited ? 'filter: drop-shadow(0 0 8px rgba(0,212,170,0.6));' : '';
    const borderColor = visited ? '#00d4aa' : '#3a4560';
    const html = `<div class="blueprint-marker ${visited ? 'visited' : ''}" style="${glow}">
      <img src="${blueprint}" width="${size}" height="${size}" alt="" />
    </div>`;

    return L.divIcon({
      html,
      className: 'leaflet-stadium-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  }

  const borderColor = visited ? '#00d4aa' : '#3a4560';
  const dotColor = visited ? '#00d4aa' : '#3a4560';
  const glow = visited ? 'filter: drop-shadow(0 0 6px rgba(0,212,170,0.5));' : '';
  const pulseRing = visited
    ? `<circle cx="20" cy="20" r="16" fill="none" stroke="#00d4aa" stroke-width="1.5" opacity="0.4">
         <animate attributeName="r" from="16" to="26" dur="2s" repeatCount="indefinite"/>
         <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
       </circle>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" style="${glow}">
    ${pulseRing}
    <circle cx="20" cy="20" r="13" fill="#0a0e17" stroke="${borderColor}" stroke-width="2.5"/>
    <circle cx="20" cy="20" r="4.5" fill="${dotColor}"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'leaflet-stadium-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(getDateLocale(), { month: 'short', day: 'numeric', year: 'numeric' });
}

const HERMOSILLO_LAT = 29.0729;
const HERMOSILLO_LNG = -110.9559;

function distanceFromHermosillo(lat, lng) {
  const R = 6371;
  const dLat = (lat - HERMOSILLO_LAT) * Math.PI / 180;
  const dLng = (lng - HERMOSILLO_LNG) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(HERMOSILLO_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return km;
}

function formatDistance(km) {
  if (getLang() === 'es') {
    return `${Math.round(km).toLocaleString('es-MX')} km de HMO`;
  }
  const miles = km * 0.621371;
  return `${Math.round(miles).toLocaleString('en-US')} mi away from HMO`;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatAttendance(n) {
  return n ? n.toLocaleString(getDateLocale()) : '—';
}

function getStadiumImage(stadium) {
  const colors = TEAM_COLORS[stadium.team];
  if (!colors) return '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">
    <defs>
      <linearGradient id="bg-${stadium.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary}"/>
        <stop offset="100%" style="stop-color:${colors.secondary}"/>
      </linearGradient>
    </defs>
    <rect width="420" height="280" fill="url(#bg-${stadium.id})"/>
    <text x="210" y="120" text-anchor="middle" fill="rgba(255,255,255,0.1)" font-family="Oswald,sans-serif" font-size="72" font-weight="700">${shortName(stadium.team)}</text>
    <text x="210" y="170" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Oswald,sans-serif" font-size="16" font-weight="600" letter-spacing="4">${stadium.name.toUpperCase()}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const WEATHER_ES = {
  'Sunny': 'Soleado',
  'Clear': 'Despejado',
  'Partly Cloudy': 'Parcialmente Nublado',
  'Cloudy': 'Nublado',
  'Overcast': 'Cubierto',
  'Rain': 'Lluvia',
  'Roof Closed': 'Techo Cerrado',
};

function translateWeather(weather) {
  if (!weather) return '';
  if (getLang() === 'es') return WEATHER_ES[weather] || weather;
  return weather;
}

function getWeatherEmoji(weather) {
  if (!weather) return '';
  const w = weather.toLowerCase();
  if (w.includes('sunny') || w.includes('clear')) return '☀️';
  if (w.includes('partly')) return '⛅';
  if (w.includes('cloudy') || w.includes('overcast')) return '☁️';
  if (w.includes('rain')) return '🌧️';
  if (w.includes('roof')) return '🏟️';
  return '🌤️';
}

function getGamePk(url) {
  const m = url.match(/gameday\/(\d+)/);
  return m ? m[1] : null;
}

const boxscoreCache = new Map();

async function fetchBoxScore(gamePk) {
  if (boxscoreCache.has(gamePk)) return boxscoreCache.get(gamePk);

  const [lsRes, bsRes] = await Promise.all([
    fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/linescore`),
    fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`),
  ]);
  const [linescore, boxscore] = await Promise.all([lsRes.json(), bsRes.json()]);

  const result = { linescore, boxscore };
  boxscoreCache.set(gamePk, result);
  return result;
}

function renderLinescore(ls, visit) {
  const innings = ls.innings || [];
  const awayShort = shortName(visit.awayTeam);
  const homeShort = shortName(visit.homeTeam);
  const awayWon = visit.awayScore > visit.homeScore;

  let html = '<table class="linescore-table"><thead><tr><th></th>';
  innings.forEach(inn => { html += `<th>${inn.num}</th>`; });
  html += '<th>R</th><th>H</th><th>E</th></tr></thead><tbody>';

  html += '<tr>';
  html += `<td>${teamLogo(visit.awayTeam, 16)} ${awayShort}</td>`;
  innings.forEach(inn => { html += `<td>${inn.away?.runs ?? ''}</td>`; });
  html += `<td class="ls-total ${awayWon ? 'ls-winner' : ''}">${ls.teams?.away?.runs ?? ''}</td>`;
  html += `<td class="ls-total">${ls.teams?.away?.hits ?? ''}</td>`;
  html += `<td class="ls-total">${ls.teams?.away?.errors ?? ''}</td>`;
  html += '</tr>';

  html += '<tr>';
  html += `<td>${teamLogo(visit.homeTeam, 16)} ${homeShort}</td>`;
  innings.forEach(inn => { html += `<td>${inn.home?.runs ?? ''}</td>`; });
  html += `<td class="ls-total ${!awayWon ? 'ls-winner' : ''}">${ls.teams?.home?.runs ?? ''}</td>`;
  html += `<td class="ls-total">${ls.teams?.home?.hits ?? ''}</td>`;
  html += `<td class="ls-total">${ls.teams?.home?.errors ?? ''}</td>`;
  html += '</tr>';

  html += '</tbody></table>';
  return html;
}

function renderLineups(boxscore, visit) {
  let html = '';

  // Position a player entered the game at (their starting position when a
  // starter, or the role they came in as for a sub), falling back to their
  // final position if the per-game history is unavailable.
  const enterPos = p => p.allPositions?.[0]?.abbreviation || p.position?.abbreviation;

  ['away', 'home'].forEach(side => {
    const team = boxscore.teams[side];
    const teamName = side === 'away' ? visit.awayTeam : visit.homeTeam;
    const players = team.players;

    // Starting pitcher = first pitcher to appear in the game.
    const spId = team.pitchers?.[0];
    const sp = spId != null ? players['ID' + spId] : null;
    const spName = sp?.person?.fullName;

    // Each player's battingOrder code encodes who actually started: the
    // hundreds digit is the lineup spot (1-9) and the last two digits are the
    // substitution sequence. Starters end in "00" (e.g. "600"); anyone with a
    // non-zero suffix (e.g. "601") entered the game as a substitute. The
    // team-level battingOrder array can't be used here because it reflects the
    // FINAL occupant of each spot, so a late sub would masquerade as a starter.
    const batted = Object.values(players).filter(
      p => p.battingOrder && String(p.person?.id) !== String(spId)
    );

    const starters = batted
      .filter(p => parseInt(p.battingOrder, 10) % 100 === 0)
      .sort((a, b) => parseInt(a.battingOrder, 10) - parseInt(b.battingOrder, 10))
      .map(p => ({
        spot: parseInt(p.battingOrder, 10) / 100,
        name: p.person.fullName,
        pos: enterPos(p),
      }));

    // Position-player subs: batted, but entered after the original starter.
    const subPositionPlayers = batted
      .filter(p => parseInt(p.battingOrder, 10) % 100 !== 0)
      .sort((a, b) => parseInt(a.battingOrder, 10) - parseInt(b.battingOrder, 10))
      .map(p => ({ name: p.person.fullName, pos: enterPos(p) }));

    // Relief pitchers: every pitcher after the starter, in appearance order.
    const subPitchers = (team.pitchers || [])
      .filter(id => String(id) !== String(spId))
      .map(id => players['ID' + id])
      .filter(Boolean)
      .map(p => ({ name: p.person.fullName }));

    html += `<div class="lineup-team">`;
    html += `<div class="lineup-header">${teamLogo(teamName, 16)} ${teamName}</div>`;

    // Starting lineup
    html += `<div class="lineup-section-label">${t('startingLineup')}</div>`;
    html += `<div class="lineup-list">`;
    starters.forEach(s => {
      html += `<div class="lineup-player"><span class="lineup-order">${s.spot}</span><span class="lineup-name">${s.name}</span><span class="lineup-pos">${s.pos}</span></div>`;
    });
    if (spName) {
      html += `<div class="lineup-player lineup-sp"><span class="lineup-order">P</span><span class="lineup-name">${spName}</span><span class="lineup-pos">SP</span></div>`;
    }
    html += `</div>`;

    // Substitutes
    if (subPositionPlayers.length > 0 || subPitchers.length > 0) {
      html += `<div class="lineup-section-label">${t('substitutes')}</div>`;
      html += `<div class="lineup-list lineup-subs">`;
      subPositionPlayers.forEach(s => {
        html += `<div class="lineup-player"><span class="lineup-order"></span><span class="lineup-name">${s.name}</span><span class="lineup-pos">${s.pos}</span></div>`;
      });
      subPitchers.forEach(s => {
        html += `<div class="lineup-player"><span class="lineup-order"></span><span class="lineup-name">${s.name}</span><span class="lineup-pos">P</span></div>`;
      });
      html += `</div>`;
    }

    html += `</div>`;
  });

  return html;
}

async function loadBoxScore(visit) {
  const section = document.getElementById('panel-boxscore-section');
  const loading = document.getElementById('boxscore-loading');
  const linescoreWrap = document.getElementById('linescore-table-wrap');
  const lineupsWrap = document.getElementById('lineups-wrap');

  section.style.display = '';
  loading.style.display = '';
  linescoreWrap.innerHTML = '';
  lineupsWrap.innerHTML = '';

  const gamePk = getGamePk(visit.boxscoreUrl);
  if (!gamePk) { loading.textContent = t('gameIdNotFound'); return; }

  try {
    const { linescore, boxscore } = await fetchBoxScore(gamePk);
    linescoreWrap.innerHTML = renderLinescore(linescore, visit);
    lineupsWrap.innerHTML = renderLineups(boxscore, visit);
    loading.style.display = 'none';
  } catch (e) {
    loading.textContent = t('boxScoreError');
  }
}

function showPanel(stadium) {
  const panel = document.getElementById('stadium-panel');
  const visit = visitMap.get(stadium.id);
  const colors = TEAM_COLORS[stadium.team];
  const fallbackSrc = getStadiumImage(stadium);
  const photoSrc = visit?.photo || null;

  const questNum = visitOrder.get(stadium.id);
  const numBadge = questNum ? `<span class="panel-quest-num">#${questNum}</span>` : '';

  const blueprint = STADIUM_BLUEPRINTS[stadium.id];
  const blueprintDetail = blueprint ? blueprint.replace('/100/', '/512/') : null;

  const detailBpEl = document.getElementById('panel-blueprint-detail');
  if (blueprintDetail) {
    detailBpEl.innerHTML = `<div class="img-spinner"></div><img src="${blueprintDetail}" alt="${stadium.name} blueprint" style="visibility:hidden" />`;
    detailBpEl.style.display = '';
    const bpImg = detailBpEl.querySelector('img');
    const bpSpinner = detailBpEl.querySelector('.img-spinner');
    const revealBp = () => { bpImg.style.visibility = ''; bpSpinner.remove(); };
    bpImg.onload = revealBp;
    bpImg.onerror = revealBp;
    if (bpImg.complete) revealBp();
  } else {
    detailBpEl.innerHTML = '';
    detailBpEl.style.display = 'none';
  }

  document.getElementById('panel-title').innerHTML = `${teamLogo(stadium.team, 26)} ${stadium.name} ${numBadge}`;
  document.getElementById('panel-team').textContent = stadium.team;
  document.getElementById('panel-team').style.color = panelTeamColor(stadium.team) || '#888';

  const img = document.getElementById('panel-image');
  const heroSpinner = document.getElementById('hero-spinner');
  img.alt = stadium.name;
  heroSpinner.classList.remove('hidden');
  img.onload = () => heroSpinner.classList.add('hidden');
  img.onerror = () => { img.onerror = null; img.src = fallbackSrc; img.dataset.fullSrc = ''; };
  img.dataset.fullSrc = photoSrc || '';
  img.src = photoSrc || fallbackSrc;

  const badge = document.getElementById('panel-badge');
  const photoHint = document.getElementById('photo-hint');
  const scoreboard = document.getElementById('panel-scoreboard');
  const pitchersSection = document.getElementById('panel-pitchers-section');
  const detailsSection = document.getElementById('panel-details-section');
  const boxscoreBtn = document.getElementById('panel-boxscore');

  if (visit) {
    badge.textContent = t('visited').toUpperCase();
    badge.className = 'visited-badge';
    photoHint.style.display = 'none';

    // Scoreboard
    scoreboard.style.display = 'flex';
    document.getElementById('score-away-logo').innerHTML = teamLogo(visit.awayTeam, 28);
    document.getElementById('score-home-logo').innerHTML = teamLogo(visit.homeTeam, 28);
    document.getElementById('score-away-name').textContent = shortName(visit.awayTeam);
    document.getElementById('score-home-name').textContent = shortName(visit.homeTeam);
    const awayRuns = document.getElementById('score-away-runs');
    const homeRuns = document.getElementById('score-home-runs');
    awayRuns.textContent = visit.awayScore;
    homeRuns.textContent = visit.homeScore;
    awayRuns.className = 'score-runs' + (visit.awayScore > visit.homeScore ? ' winner' : '');
    homeRuns.className = 'score-runs' + (visit.homeScore > visit.awayScore ? ' winner' : '');
    document.getElementById('score-final-label').textContent = visit.extra || t('final');

    // Pitchers
    pitchersSection.style.display = '';
    document.querySelector('#pitcher-wp .pitcher-name').textContent = visit.wp || '—';
    document.querySelector('#pitcher-lp .pitcher-name').textContent = visit.lp || '—';
    const svLine = document.getElementById('pitcher-sv');
    if (visit.sv) {
      svLine.style.display = 'flex';
      svLine.querySelector('.pitcher-name').textContent = visit.sv;
    } else {
      svLine.style.display = 'none';
    }

    // Hero date overlay
    const heroDate = document.getElementById('hero-date');
    heroDate.textContent = formatDate(visit.date);
    heroDate.style.display = 'block';

    // Details
    detailsSection.style.display = '';
    const km = distanceFromHermosillo(stadium.lat, stadium.lng);
    document.querySelector('#detail-distance .detail-value').textContent = formatDistance(km);
    document.querySelector('#detail-attendance .detail-value').textContent = formatAttendance(visit.attendance);
    const weatherText = translateWeather(visit.weather);
    const tempVal = visit.temp
      ? (getLang() === 'es' ? `${Math.round((visit.temp - 32) * 5 / 9)}°C` : `${visit.temp}°F`)
      : '';
    const tempText = tempVal;
    document.querySelector('#detail-weather .detail-value').textContent = [weatherText, tempText].filter(Boolean).join(', ');
    document.querySelector('#detail-weather .detail-icon').textContent = getWeatherEmoji(visit.weather);
    document.querySelector('#detail-duration .detail-value').textContent = visit.duration ? formatDuration(visit.duration) : '—';

    boxscoreBtn.style.display = 'flex';
    boxscoreBtn.href = visit.boxscoreUrl;

    loadBoxScore(visit);
  } else {
    badge.textContent = t('notYetVisited');
    badge.className = 'visited-badge not-visited';
    photoHint.style.display = 'none';
    document.getElementById('hero-date').style.display = 'none';
    scoreboard.style.display = 'none';
    pitchersSection.style.display = 'none';
    detailsSection.style.display = 'none';
    boxscoreBtn.style.display = 'none';
    document.getElementById('panel-boxscore-section').style.display = 'none';
  }

  renderExtraGames(stadium.id);

  panel.classList.remove('hidden');
  panel.querySelector('.panel-scroll').scrollTop = 0;
  panel.style.animation = 'none';
  panel.offsetHeight;
  panel.style.animation = '';

  document.querySelectorAll('.visit-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === stadium.id);
  });

  markerEntries.forEach(e => {
    const el = e.marker.getElement();
    if (!el) return;
    el.classList.toggle('marker-active', e.stadium.id === stadium.id);
  });
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(getDateLocale(), { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderExtraGames(stadiumId) {
  const section = document.getElementById('panel-extra-games');
  const list = document.getElementById('extra-games-list');
  const games = extraGamesMap.get(stadiumId);

  if (!games || games.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = '';
  const sorted = [...games].sort((a, b) => new Date(b.date) - new Date(a.date));

  list.innerHTML = sorted.map(g => {
    const badgeHtml = g.event
      ? `<span class="event-badge ${g.event}">${g.label}</span>`
      : '';

    if (g.event === 'hr-derby') {
      return `<div class="extra-game">
        <div class="extra-game-info">
          <div class="extra-game-score">${g.description}</div>
          <div class="extra-game-date">${formatShortDate(g.date)}</div>
        </div>
        ${badgeHtml}
      </div>`;
    }

    const awayLogo = teamLogo(g.awayTeam, 18);
    const homeLogo = teamLogo(g.homeTeam, 18);
    const awayShort = shortName(g.awayTeam);
    const homeShort = shortName(g.homeTeam);

    return `<div class="extra-game">
      <div class="extra-game-logos">${awayLogo}</div>
      <div class="extra-game-info">
        <div class="extra-game-score">${awayShort} ${g.awayScore} - ${g.homeScore} ${homeShort}</div>
        <div class="extra-game-date">${formatShortDate(g.date)}</div>
      </div>
      <div class="extra-game-logos">${homeLogo}</div>
      ${badgeHtml}
    </div>`;
  }).join('');
}

function hidePanel() {
  document.getElementById('stadium-panel').classList.add('hidden');
  document.querySelectorAll('.visit-item.active').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.marker-active').forEach(el => el.classList.remove('marker-active'));
}

// Lightbox
function openLightbox(src) {
  if (!src || src.startsWith('data:')) return;
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  lb.classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
}

document.getElementById('panel-hero').addEventListener('click', () => {
  const img = document.getElementById('panel-image');
  const src = img.dataset.fullSrc || img.src;
  if (src && !src.startsWith('data:')) openLightbox(src);
});

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id !== 'lightbox-img') closeLightbox();
});

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!document.getElementById('lightbox').classList.contains('hidden')) {
      closeLightbox();
    } else {
      hidePanel();
    }
  }
});

function buildSidebar() {
  const filterContainer = document.getElementById('year-filters');

  const allChip = document.createElement('button');
  allChip.className = 'filter-chip active';
  allChip.textContent = t('all');
  allChip.dataset.year = 'all';
  filterContainer.appendChild(allChip);

  visitedYears.forEach(year => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.textContent = year;
    chip.dataset.year = year;
    filterContainer.appendChild(chip);
  });

  filterContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    filterContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderVisitList(chip.dataset.year === 'all' ? null : parseInt(chip.dataset.year));
  });

  renderVisitList(null);
}

function renderVisitList(yearFilter) {
  const list = document.getElementById('visit-list');
  list.innerHTML = '';

  const filtered = yearFilter
    ? VISITS.filter(v => v.year === yearFilter)
    : VISITS;

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach(visit => {
    const stadium = ALL_MLB_STADIUMS.find(s => s.id === visit.stadiumId);
    if (!stadium) return;

    const colors = TEAM_COLORS[stadium.team];
    const scoreText = `${shortName(visit.awayTeam)} ${visit.awayScore} - ${visit.homeScore} ${shortName(visit.homeTeam)}`;

    const li = document.createElement('li');
    li.className = 'visit-item';
    li.dataset.id = stadium.id;
    const num = visitOrder.get(stadium.id);
    li.innerHTML = `
      <span class="visit-item-num">${num}</span>
      <div class="visit-item-logo">${teamLogo(stadium.team, 22)}</div>
      <div class="visit-item-info">
        <div class="visit-item-name">${stadium.name}</div>
        <div class="visit-item-detail">${scoreText}</div>
      </div>
      <div class="visit-item-year">${visit.year}</div>
    `;

    li.addEventListener('click', () => {
      // map.flyTo([stadium.lat, stadium.lng], 13, { duration: 1.5 });
      showPanel(stadium);
    });

    list.appendChild(li);
  });
}

function updateProgress() {
  const count = VISITS.length;
  const total = 30;
  const pct = count / total;

  document.getElementById('visited-count').textContent = count;

  const circle = document.querySelector('.progress-ring-fill');
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - pct);

  requestAnimationFrame(() => {
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${offset}`;
  });
}

const markerEntries = [];

ALL_MLB_STADIUMS.forEach(stadium => {
  const visited = visitMap.has(stadium.id);
  const icon = makeMarkerIcon(stadium);

  const marker = L.marker([stadium.lat, stadium.lng], { icon, zIndexOffset: visited ? 500 : 0 })
    .addTo(map);

  const visit = visitMap.get(stadium.id);

  if (visit) {
    const photoSrc = visit.photo || getStadiumImage(stadium);
    const awayWon = visit.awayScore > visit.homeScore;
    const homeWon = visit.homeScore > visit.awayScore;

    const popupContent = `
      <div class="hovercard">
        <div class="hovercard-hero">
          <img class="hovercard-img" src="${photoSrc}" alt="${stadium.name}" />
          <div class="hovercard-hero-overlay"></div>
        </div>
        <div class="hovercard-body">
          <div class="hovercard-title">${teamLogo(stadium.team, 20)} ${stadium.name}</div>
          <div class="hovercard-team" style="color:${panelTeamColor(stadium.team) || '#888'}">${stadium.team}</div>
          <div class="hovercard-score">
            <span class="hovercard-score-final">${visit.extra || t('final')}</span>
            <div class="hovercard-score-line">
              ${teamLogo(visit.awayTeam, 18)}
              <span class="hovercard-score-name">${shortName(visit.awayTeam)}</span>
              <span class="hovercard-score-runs ${awayWon ? 'winner' : ''}">${visit.awayScore}</span>
              <span class="hovercard-score-dash">-</span>
              <span class="hovercard-score-runs ${homeWon ? 'winner' : ''}">${visit.homeScore}</span>
              <span class="hovercard-score-name">${shortName(visit.homeTeam)}</span>
              ${teamLogo(visit.homeTeam, 18)}
            </div>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      className: 'stadium-hovercard-popup',
      closeButton: false,
      offset: [0, -20],
      maxWidth: 280,
      minWidth: 260,
    });
  } else {
    const popupContent = `
      <div class="popup-name">${stadium.name}</div>
      <div class="popup-team">${stadium.team}</div>
      <div class="popup-status unvisited">${t('notYet')}</div>
    `;

    marker.bindPopup(popupContent, {
      className: 'stadium-popup',
      closeButton: false,
      offset: [0, -5],
    });
  }

  const entry = {
    marker,
    stadium,
    origLatLng: L.latLng(stadium.lat, stadium.lng),
    _spiderLeg: null,
  };

  marker.on('click', () => {
    showPanel(stadium);
  });

  marker.on('mouseover', () => {
    marker.openPopup();
    highlightLeg(entry);
    showHomeLine(entry);
  });
  marker.on('mouseout', () => {
    marker.closePopup();
    unhighlightLeg(entry);
    hideHomeLine();
  });

  markerEntries.push(entry);
});

const entryById = new Map();
markerEntries.forEach(e => entryById.set(e.stadium.id, e));

// ---- Home base marker & travel animations -------------------------------

function homeIcon(home, moving) {
  return L.divIcon({
    html: `<div class="home-marker ${moving ? 'moving' : ''}"><span class="home-glyph">🏠</span></div>`,
    className: 'home-marker-wrap',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

// The home marker is only shown on the map while the timeline is playing.
const homeMarker = L.marker([CURRENT_HOME.lat, CURRENT_HOME.lng], {
  icon: homeIcon(CURRENT_HOME),
  zIndexOffset: 1500,
  interactive: false,
});

let currentHomeId = CURRENT_HOME.id;
let homeAnimating = false;

// Screen-space heading (degrees, 0 = east) from one latlng to another.
function headingDeg(from, to) {
  const p1 = map.latLngToContainerPoint(from);
  const p2 = map.latLngToContainerPoint(to);
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

// Animate a Leaflet marker from one point to another along a screen-space arc.
function flyMarker(marker, from, to, duration, curveAmt) {
  return new Promise(resolve => {
    const p1 = map.latLngToContainerPoint(from);
    const p2 = map.latLngToContainerPoint(to);
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;          // perpendicular unit vector
    const bump = curveAmt * len;
    let startTs = null;
    function frame(now) {
      if (startTs === null) startTs = now;
      const t = Math.min(1, (now - startTs) / duration);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad
      const arc = bump * Math.sin(Math.PI * e);
      const x = p1.x + dx * e + px * arc;
      const y = p1.y + dy * e + py * arc;
      marker.setLatLng(map.containerPointToLatLng([x, y]));
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

function travelIcon(kind, angle) {
  let inner;
  if (kind === 'plane') {
    inner = `<span class="travel-glyph" style="transform:rotate(${angle + 45}deg)">✈️</span>`;
  } else {
    const flip = (angle > -90 && angle < 90) ? 'scaleX(-1)' : '';
    inner = `<span class="travel-glyph" style="transform:${flip}">🚗</span>`;
  }
  return L.divIcon({ html: inner, className: 'travel-marker', iconSize: [26, 26], iconAnchor: [13, 13] });
}

// Fly an airplane (long trips) or drive a car (short trips) from home to the
// stadium and back. Used during timeline playback.
async function animateTravel(home, entry) {
  const from = L.latLng(home.lat, home.lng);
  const to = entry.marker.getLatLng();
  const km = haversineKm(home.lat, home.lng, to.lat, to.lng);
  const plane = km > 500;
  const kind = plane ? 'plane' : 'car';
  const curve = plane ? 0.22 : 0.05;
  const dur = plane ? 1700 : 750;

  const ghost = L.marker(from, {
    icon: travelIcon(kind, headingDeg(from, to)),
    zIndexOffset: 3000,
    interactive: false,
  }).addTo(map);

  await flyMarker(ghost, from, to, dur, curve);
  ghost.setIcon(travelIcon(kind, headingDeg(to, from)));
  await flyMarker(ghost, to, from, dur, -curve);
  map.removeLayer(ghost);
}

// A single continuous trip: home → each stop in order → home. The home↔region
// legs use `transit` ('plane' if I flew there); legs between stops are always
// driven.
async function animateRoadtrip(home, entries, transit) {
  const pts = [
    L.latLng(home.lat, home.lng),
    ...entries.map(e => e.marker.getLatLng()),
    L.latLng(home.lat, home.lng),
  ];
  const ghost = L.marker(pts[0], {
    icon: travelIcon(transit, headingDeg(pts[0], pts[1])),
    zIndexOffset: 3000,
    interactive: false,
  }).addTo(map);

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const isTransit = i === 0 || i === pts.length - 2; // home→region / region→home
    const kind = isTransit ? transit : 'car';
    ghost.setIcon(travelIcon(kind, headingDeg(a, b)));
    const legKm = haversineKm(a.lat, a.lng, b.lat, b.lng);
    const dur = kind === 'plane' ? 1700 : Math.max(550, Math.min(2000, legKm * 2.2));
    const curve = kind === 'plane' ? 0.22 : 0.06;
    const last = i === pts.length - 2;
    await flyMarker(ghost, a, b, dur, last ? -curve : curve);
  }
  map.removeLayer(ghost);
}

function showToast(text) {
  let toast = document.getElementById('move-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'move-toast';
    toast.className = 'move-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.remove('show');
  // restart the CSS animation
  void toast.offsetWidth;
  toast.classList.add('show');
}

// Place / move the home marker for the given home base. When `animate` is set
// and the home actually changed, slide the marker over (a "move" animation).
// Returns a promise that resolves once any move animation has finished.
function setHome(home, animate) {
  if (animate && currentHomeId && currentHomeId !== home.id && !homeAnimating) {
    const from = homeMarker.getLatLng();
    const to = L.latLng(home.lat, home.lng);
    homeAnimating = true;
    homeMarker.setIcon(homeIcon(home, true));
    showToast(`${getLang() === 'es' ? 'Mudanza a' : 'Moved to'} ${home.city}`);
    currentHomeId = home.id;
    return flyMarker(homeMarker, from, to, 1500, 0.12).then(() => {
      homeMarker.setLatLng(to);
      homeMarker.setIcon(homeIcon(home));
      homeAnimating = false;
    });
  } else if (!homeAnimating) {
    homeMarker.setLatLng([home.lat, home.lng]);
    homeMarker.setIcon(homeIcon(home));
  }
  currentHomeId = home.id;
  return Promise.resolve();
}

// ---- Hover line from a stadium back to the home I traveled from ----------

let hoverLine = null;

function showHomeLine(entry) {
  const stadium = entry.stadium;
  const visit = visitMap.get(stadium.id);
  const home = visit ? homeAtDate(visit.date)
    : (currentHomeId ? HOMES.find(h => h.id === currentHomeId) || CURRENT_HOME : CURRENT_HOME);
  const to = entry.marker.getLatLng();
  const km = haversineKm(home.lat, home.lng, to.lat, to.lng);

  hideHomeLine();
  hoverLine = L.polyline([[home.lat, home.lng], [to.lat, to.lng]], {
    color: '#00d4aa',
    weight: 2,
    dashArray: '7 7',
    opacity: 0.85,
    interactive: false,
    className: 'home-travel-line',
  }).addTo(map);

  const fromWord = getLang() === 'es' ? 'Desde' : 'From';
  hoverLine.bindTooltip(`${fromWord} ${home.city} · ${formatDistance(km)}`, {
    permanent: true,
    direction: 'center',
    className: 'home-line-tip',
  }).openTooltip();
}

function hideHomeLine() {
  if (hoverLine) { map.removeLayer(hoverLine); hoverLine = null; }
}

// Spiderfy: auto-expand overlapping markers with dotted lines to origin
const SPIDER_PIXEL_THRESHOLD = 45;
const SPIDER_LEG_PX = 50;

// Manual direction overrides (dx, dy in pixel-space) for stadiums whose
// auto-computed bearing from the group centroid is counterintuitive.
// Manual direction overrides (dx, dy in pixel-space) for stadiums whose
// auto-computed bearing from the group centroid is counterintuitive.
const SPIDER_DIR_HINTS = {
  'dodger-stadium': { dx: -1, dy: 0.3 },
  'angel-stadium':  { dx: 1, dy: -0.3 },
  'yankee-stadium': { dx: 1, dy: -0.4 },
  'citi-field':     { dx: 1, dy: 0.2 },
  'wrigley-field':  { dx: 1, dy: -0.3 },
  'guaranteed-rate': { dx: -1, dy: -0.5 },
};

// Stadiums that should stay at their real location and never be spiderfied.
const SPIDER_EXCLUDE = new Set(['progressive-field', 'comerica-park']);
let spiderLegs = [];

function findOverlapGroups() {
  const assigned = new Set();
  const groups = [];

  markerEntries.forEach(entry => {
    if (assigned.has(entry)) return;
    if (SPIDER_EXCLUDE.has(entry.stadium.id)) { assigned.add(entry); return; }
    const pt = map.latLngToContainerPoint(entry.origLatLng);
    const group = [entry];
    assigned.add(entry);

    markerEntries.forEach(other => {
      if (assigned.has(other)) return;
      if (SPIDER_EXCLUDE.has(other.stadium.id)) return;
      const otherPt = map.latLngToContainerPoint(other.origLatLng);
      if (pt.distanceTo(otherPt) < SPIDER_PIXEL_THRESHOLD) {
        group.push(other);
        assigned.add(other);
      }
    });

    if (group.length > 1) groups.push(group);
  });

  return groups;
}

let _spiderDebounce = null;
let _spiderfyRunning = false;

function scheduleSpiderfy() {
  if (_spiderfyRunning) return;
  clearTimeout(_spiderDebounce);
  _spiderDebounce = setTimeout(autoSpiderfy, 50);
}

function autoSpiderfy() {
  _spiderfyRunning = true;
  spiderLegs.forEach(leg => map.removeLayer(leg));
  spiderLegs = [];
  markerEntries.forEach(entry => {
    entry.marker.setLatLng(entry.origLatLng);
    entry.marker.setZIndexOffset(visitMap.has(entry.stadium.id) ? 500 : 0);
    entry.marker.getElement()?.classList.remove('spiderfied');
    entry._spiderLeg = null;
  });

  const groups = findOverlapGroups();

  groups.forEach(entries => {
    const count = entries.length;
    const pts = entries.map(e => map.latLngToContainerPoint(e.origLatLng));
    const centerPt = pts.reduce(
      (acc, pt) => L.point(acc.x + pt.x / count, acc.y + pt.y / count),
      L.point(0, 0)
    );

    const minSeparation = SPIDER_PIXEL_THRESHOLD;
    const placed = [];

    entries.forEach((entry, i) => {
      const pt = pts[i];
      const hint = SPIDER_DIR_HINTS[entry.stadium.id];
      let dx, dy;

      if (hint) {
        const hLen = Math.sqrt(hint.dx * hint.dx + hint.dy * hint.dy);
        dx = hint.dx / hLen;
        dy = hint.dy / hLen;
      } else {
        dx = pt.x - centerPt.x;
        dy = pt.y - centerPt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) {
          const fallbackAngle = (2 * Math.PI * i) / count - Math.PI / 2;
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
        } else {
          dx /= dist;
          dy /= dist;
        }
      }

      let radius = SPIDER_LEG_PX + (count - 2) * 6;
      let candidate = L.point(centerPt.x + dx * radius, centerPt.y + dy * radius);

      for (let attempt = 0; attempt < 8; attempt++) {
        let tooClose = false;
        for (const prev of placed) {
          if (candidate.distanceTo(prev) < minSeparation) {
            tooClose = true;
            break;
          }
        }
        if (!tooClose) break;
        radius += 12;
        candidate = L.point(centerPt.x + dx * radius, centerPt.y + dy * radius);
      }

      placed.push(candidate);
      const newLatLng = map.containerPointToLatLng(candidate);
      entry.marker.setLatLng(newLatLng);
      entry.marker.setZIndexOffset(1000);
      entry.marker.getElement()?.classList.add('spiderfied');

      const leg = L.polyline([entry.origLatLng, newLatLng], {
        color: '#5a6478',
        weight: 1.5,
        dashArray: '4 4',
        opacity: 0.5,
        interactive: false,
      }).addTo(map);
      spiderLegs.push(leg);
      entry._spiderLeg = leg;
    });
  });
  _spiderfyRunning = false;
}

function unspiderfy() {
  spiderLegs.forEach(leg => map.removeLayer(leg));
  spiderLegs = [];

  markerEntries.forEach(entry => {
    entry.marker.setLatLng(entry.origLatLng);
    entry.marker.setZIndexOffset(visitMap.has(entry.stadium.id) ? 500 : 0);
    entry.marker.getElement()?.classList.remove('spiderfied');
    entry._spiderLeg = null;
  });
}

function highlightLeg(entry) {
  if (!entry._spiderLeg) return;
  entry._spiderLeg.setStyle({ color: '#00d4aa', weight: 2.5, opacity: 0.9 });
}

function unhighlightLeg(entry) {
  if (!entry._spiderLeg) return;
  entry._spiderLeg.setStyle({ color: '#5a6478', weight: 1.5, opacity: 0.5 });
}

map.on('zoomend', scheduleSpiderfy);
map.whenReady(() => setTimeout(autoSpiderfy, 200));

// Reset zoom button
const resetBtn = L.Control.extend({
  options: { position: 'bottomright' },
  onAdd() {
    const btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control reset-zoom-btn');
    btn.innerHTML = '<a href="#" title="Reset view" role="button" aria-label="Reset view"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg></a>';
    btn.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hidePanel();
      map.flyTo(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom, { duration: 1 });
    });
    L.DomEvent.disableClickPropagation(btn);
    return btn;
  }
});
map.addControl(new resetBtn());

document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

document.getElementById('panel-close').addEventListener('click', hidePanel);

buildSidebar();
updateProgress();

// Timeline
const allVisitDates = [...VISITS, ...EXTRA_GAMES]
  .filter(g => g.date)
  .map(g => g.date)
  .sort();
const uniqueDates = [...new Set(allVisitDates)];

const timelineSlider = document.getElementById('timeline-slider');
const timelineLabel = document.getElementById('timeline-label');
timelineSlider.min = 0;
timelineSlider.max = uniqueDates.length;
timelineSlider.value = uniqueDates.length;

function formatTimelineDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(getDateLocale(), { month: 'short', year: 'numeric' });
}

function applyTimeline(idx) {
  const showAll = idx >= uniqueDates.length;
  const cutoffDate = showAll ? null : uniqueDates[idx];

  timelineLabel.textContent = showAll ? t('allTime') : formatTimelineDate(cutoffDate);

  const visitedAtTime = new Set();
  if (showAll) {
    VISITS.forEach(v => visitedAtTime.add(v.stadiumId));
  } else {
    VISITS.forEach(v => {
      if (v.date <= cutoffDate) visitedAtTime.add(v.stadiumId);
    });
  }

  markerEntries.forEach(e => {
    const wasVisited = visitedAtTime.has(e.stadium.id);
    const icon = makeMarkerIcon(e.stadium, wasVisited);
    e.marker.setIcon(icon);
    e.marker.setZIndexOffset(wasVisited ? 500 : 0);

    const popupContent = `
      <div class="popup-name">${e.stadium.name}</div>
      <div class="popup-team">${e.stadium.team}</div>
      <div class="popup-status ${wasVisited ? 'visited' : 'unvisited'}">
        ${wasVisited ? '✓ ' + t('visited') : t('notYet')}
      </div>
    `;
    e.marker.setPopupContent(popupContent);
  });

  const count = visitedAtTime.size;
  document.getElementById('visited-count').textContent = count;
  const circle = document.querySelector('.progress-ring-fill');
  const circumference = 2 * Math.PI * 34;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference * (1 - count / 30)}`;
}

// Update the home marker (and, during playback, fire travel animations) for a
// given timeline index.
async function playStep(idx, animate) {
  if (idx >= uniqueDates.length) {
    setHome(CURRENT_HOME, animate);
    return;
  }
  const date = uniqueDates[idx];
  const home = homeAtDate(date);
  // Finish the "move" animation before any trips depart from the new home.
  await setHome(home, animate);
  if (animate) {
    (visitsByDate.get(date) || []).forEach(v => {
      if (roadtripStopIds.has(v.stadiumId)) return; // part of a consolidated roadtrip
      const entry = entryById.get(v.stadiumId);
      if (entry) animateTravel(home, entry);
    });
    const rt = roadtripByTriggerDate.get(date);
    if (rt) {
      const rtHome = HOMES.find(h => h.id === rt.homeId) || home;
      const entries = rt.stops.map(id => entryById.get(id)).filter(Boolean);
      if (entries.length) animateRoadtrip(rtHome, entries, rt.transit);
    }
  }
}

timelineSlider.addEventListener('input', () => {
  stopPlayback();
  const idx = parseInt(timelineSlider.value);
  applyTimeline(idx);
  playStep(idx, false);
});

const playBtn = document.getElementById('timeline-play');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
let playInterval = null;
let playRaf = null;

function startPlayback() {
  const total = uniqueDates.length;
  let current = parseInt(timelineSlider.value);
  if (current >= total) current = -1;

  playBtn.classList.add('playing');
  playIcon.style.display = 'none';
  pauseIcon.style.display = '';

  const stepDuration = 3600;
  let lastStep = performance.now();
  current++;
  timelineSlider.value = current;
  // Snap the home marker to the starting home (no move animation), then reveal
  // it for the duration of playback.
  const startHome = current < uniqueDates.length ? homeAtDate(uniqueDates[current]) : CURRENT_HOME;
  homeAnimating = false;
  setHome(startHome, false);
  if (!map.hasLayer(homeMarker)) map.addLayer(homeMarker);
  applyTimeline(current);
  playStep(current, true);

  function tick(now) {
    if (!playInterval) return;
    if (now - lastStep >= stepDuration) {
      current++;
      if (current > total) {
        stopPlayback();
        return;
      }
      timelineSlider.value = current;
      applyTimeline(current);
      playStep(current, true);
      lastStep = now;
    }
    playRaf = requestAnimationFrame(tick);
  }

  playInterval = true;
  playRaf = requestAnimationFrame(tick);
}

function stopPlayback() {
  playInterval = null;
  if (playRaf) { cancelAnimationFrame(playRaf); playRaf = null; }
  playBtn.classList.remove('playing');
  playIcon.style.display = '';
  pauseIcon.style.display = 'none';
  if (map.hasLayer(homeMarker)) map.removeLayer(homeMarker);
}

playBtn.addEventListener('click', () => {
  if (playInterval) {
    stopPlayback();
  } else {
    startPlayback();
  }
});

setTimeout(() => {
  document.getElementById('sidebar').classList.remove('collapsed');
  map.invalidateSize();
}, 500);

// i18n: update all static text
function applyLanguage() {
  document.documentElement.lang = getLang();
  document.title = t('pageTitle');
  document.querySelector('.logo h1').textContent = t('appName');
  document.querySelector('.tagline').textContent = t('tagline');
  document.querySelector('.sidebar-header h2').textContent = t('myVisits');
  document.getElementById('timeline-label').textContent = t('allTime');
  document.getElementById('lang-toggle').textContent = getLang().toUpperCase();
  document.getElementById('scratchcard-btn-label').textContent = t('scratchCard');
  document.getElementById('legend-title').textContent = t('legendTitle');
  document.getElementById('legend-text').innerHTML = t('legendText');
  const scTitle = document.querySelector('.scratchcard-title');
  if (scTitle) scTitle.textContent = t('scratchCardTitle');
  const scSub = document.getElementById('sc-subtitle');
  if (scSub) scSub.textContent = t('scratchCardSubtitle');

  const legendItems = document.querySelectorAll('.legend-item');
  if (legendItems[0]) legendItems[0].lastChild.textContent = ' ' + t('visited');
  if (legendItems[1]) legendItems[1].lastChild.textContent = ' ' + t('notYet');

  // Panel section headers
  const pitchingH3 = document.querySelector('#panel-pitchers-section h3');
  if (pitchingH3) pitchingH3.textContent = t('pitching');
  const gameDayH3 = document.querySelector('#panel-details-section h3');
  if (gameDayH3) gameDayH3.textContent = t('gameDay');
  const boxScoreH3 = document.querySelector('#panel-boxscore-section h3');
  if (boxScoreH3) boxScoreH3.textContent = t('boxScore');
  const otherGamesH3 = document.querySelector('#panel-extra-games h3');
  if (otherGamesH3) otherGamesH3.textContent = t('otherGames');

  const mlbLink = document.getElementById('panel-boxscore');
  if (mlbLink) {
    const svg = mlbLink.querySelector('svg');
    mlbLink.textContent = '';
    mlbLink.append(t('viewOnMlb') + ' ', svg);
  }

  const loadingEl = document.getElementById('boxscore-loading');
  if (loadingEl && loadingEl.style.display !== 'none') {
    loadingEl.textContent = t('loadingBoxScore');
  }

  // Rebuild year filter chips
  const filterContainer = document.getElementById('year-filters');
  const activeYear = filterContainer.querySelector('.filter-chip.active')?.dataset.year || 'all';
  filterContainer.innerHTML = '';
  const allChip = document.createElement('button');
  allChip.className = 'filter-chip' + (activeYear === 'all' ? ' active' : '');
  allChip.textContent = t('all');
  allChip.dataset.year = 'all';
  filterContainer.appendChild(allChip);
  visitedYears.forEach(year => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip' + (activeYear === String(year) ? ' active' : '');
    chip.textContent = year;
    chip.dataset.year = year;
    filterContainer.appendChild(chip);
  });

  renderVisitList(activeYear === 'all' ? null : parseInt(activeYear));
}

function switchLang(lang) {
  setLang(lang);
  applyLanguage();
  applyTimeline(parseInt(timelineSlider.value));
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  const next = getLang() === 'en' ? 'es' : 'en';
  history.pushState({ lang: next }, '', langPath(next) + location.search + location.hash);
  switchLang(next);
});

window.addEventListener('popstate', () => switchLang(detectLang()));

applyLanguage();

// ── Scratch Card ──
const STADIUM_CITIES = {
  'yankee-stadium': 'Bronx, New York',
  'fenway-park': 'Boston, Massachusetts',
  'camden-yards': 'Baltimore, Maryland',
  'tropicana-field': 'St. Petersburg, Florida',
  'rogers-centre': 'Toronto, Ontario',
  'guaranteed-rate': 'Chicago, Illinois',
  'progressive-field': 'Cleveland, Ohio',
  'comerica-park': 'Detroit, Michigan',
  'kauffman-stadium': 'Kansas City, Missouri',
  'target-field': 'Minneapolis, Minnesota',
  'minute-maid': 'Houston, Texas',
  'angel-stadium': 'Anaheim, California',
  'oakland-coliseum': 'Oakland, California',
  't-mobile-park': 'Seattle, Washington',
  'globe-life': 'Arlington, Texas',
  'truist-park': 'Atlanta, Georgia',
  'loandepot-park': 'Miami, Florida',
  'citi-field': 'Queens, New York',
  'citizens-bank': 'Philadelphia, Pennsylvania',
  'nationals-park': 'Washington, D.C.',
  'wrigley-field': 'Chicago, Illinois',
  'great-american': 'Cincinnati, Ohio',
  'american-family': 'Milwaukee, Wisconsin',
  'pnc-park': 'Pittsburgh, Pennsylvania',
  'busch-stadium': 'St. Louis, Missouri',
  'chase-field': 'Phoenix, Arizona',
  'coors-field': 'Denver, Colorado',
  'dodger-stadium': 'Los Angeles, California',
  'petco-park': 'San Diego, California',
  'oracle-park': 'San Francisco, California',
};

const SC_DIVISIONS = {
  'al-east': ALL_MLB_STADIUMS.slice(0, 5),
  'al-central': ALL_MLB_STADIUMS.slice(5, 10),
  'al-west': ALL_MLB_STADIUMS.slice(10, 15),
  'nl-east': ALL_MLB_STADIUMS.slice(15, 20),
  'nl-central': ALL_MLB_STADIUMS.slice(20, 25),
  'nl-west': ALL_MLB_STADIUMS.slice(25, 30),
};

function buildScratchCard() {
  Object.entries(SC_DIVISIONS).forEach(([key, stadiums]) => {
    const grid = document.getElementById('sc-' + key);
    if (!grid) return;
    grid.innerHTML = stadiums.map(s => {
      const bp = STADIUM_BLUEPRINTS[s.id];
      const isVisited = visitMap.has(s.id);
      const city = STADIUM_CITIES[s.id] || '';
      const visit = visitMap.get(s.id);
      const dateOverlay = visit
        ? `<span class="sc-date">${formatShortDate(visit.date)}</span>`
        : '';
      return `<div class="sc-stadium ${isVisited ? 'visited' : ''}">
        <div class="sc-blueprint">
          ${bp ? `<img src="${bp.replace('/100/', '/512/')}" alt="${s.name}" />` : ''}
          ${dateOverlay}
        </div>
        <div class="sc-name">${s.name}</div>
        <div class="sc-city">${city}</div>
      </div>`;
    }).join('');
  });
}

buildScratchCard();

document.getElementById('scratchcard-btn').addEventListener('click', () => {
  document.getElementById('scratchcard').classList.remove('hidden');
});

document.getElementById('scratchcard-close').addEventListener('click', () => {
  document.getElementById('scratchcard').classList.add('hidden');
});

// Ritual legend slide-in (mobile)
const ritualLegend = document.getElementById('sidebar-legend');
const ritualBackdrop = document.getElementById('ritual-backdrop');
const openRitual = () => {
  ritualLegend.classList.add('open');
  ritualBackdrop.classList.add('open');
};
const closeRitual = () => {
  ritualLegend.classList.remove('open');
  ritualBackdrop.classList.remove('open');
};
document.getElementById('ritual-toggle').addEventListener('click', openRitual);
document.getElementById('ritual-close').addEventListener('click', closeRitual);
ritualBackdrop.addEventListener('click', closeRitual);
