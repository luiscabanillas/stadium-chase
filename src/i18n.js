const translations = {
  en: {
    appName: 'Stadium Chase',
    tagline: 'MLB Ballpark Tracker',
    myVisits: 'My Visits',
    all: 'All',
    visited: 'Visited',
    notYet: 'Not Yet',
    notYetVisited: 'NOT YET VISITED',
    final: 'FINAL',
    pitching: 'Pitching',
    gameDay: 'Game Day',
    boxScore: 'Box Score',
    loadingBoxScore: 'Loading box score...',
    boxScoreError: 'Could not load box score',
    gameIdNotFound: 'Game ID not found',
    otherGames: 'Other Games Attended',
    viewOnMlb: 'View on MLB.com',
    allTime: 'All Time',
    startingLineup: 'Starting Lineup',
    substitutes: 'Substitutes',
    pageTitle: 'Stadium Chase — MLB Ballpark Tracker',
  },
  es: {
    appName: 'Stadium Chase',
    tagline: 'Registro de Estadios de MLB',
    myVisits: 'Mis Visitas',
    all: 'Todos',
    visited: 'Visitado',
    notYet: 'Pendiente',
    notYetVisited: 'AÚN NO VISITADO',
    final: 'FINAL',
    pitching: 'Pitcheo',
    gameDay: 'Día del Juego',
    boxScore: 'Marcador',
    loadingBoxScore: 'Cargando marcador...',
    boxScoreError: 'No se pudo cargar el marcador',
    gameIdNotFound: 'ID del juego no encontrado',
    otherGames: 'Otros Juegos Asistidos',
    viewOnMlb: 'Ver en MLB.com',
    allTime: 'Todos',
    startingLineup: 'Alineación Titular',
    substitutes: 'Suplentes',
    pageTitle: 'Stadium Chase — Registro de Estadios de MLB',
  },
};

const browserLang = navigator.language || navigator.userLanguage || 'en';
let currentLang = browserLang.startsWith('es') ? 'es' : 'en';

export function t(key) {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
}

export function getDateLocale() {
  return currentLang === 'es' ? 'es-MX' : 'en-US';
}
