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
    scratchCard: 'My Scratch Card',
    scratchCardTitle: 'MAJOR LEAGUE BALLPARKS',
    scratchCardSubtitle: 'SCRATCH CARD',
    photoCard: 'My Photo Card',
    photoCardTitle: 'MAJOR LEAGUE BALLPARKS',
    photoCardSubtitle: '\u2605 \u2605 B A L L P A R K S \u00A0 V I S I T E D \u2605 \u2605',
    downloadImage: 'Download Image',
    preparingImage: 'Preparing\u2026',
    legendTitle: 'The Ritual',
    legendText: 'Born and raised in Hermosillo, Sonora — a city where baseball runs deep. I set out to visit every MLB ballpark, always wearing my Naranjeros de Hermosillo jersey for the official photo.<br><br>At every new stadium, I arrive early to take the traditional picture, then tour the park and soak in its landmarks. I stay for the whole game, and never leave without my souvenir soda — collecting the cup is part of the ritual.',
  },
  es: {
    appName: 'Recorrido de Estadios',
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
    pageTitle: 'Recorrido de Estadios — Registro de Estadios de MLB',
    scratchCard: 'Mi Tarjeta',
    scratchCardTitle: 'ESTADIOS DE GRANDES LIGAS',
    scratchCardSubtitle: 'TARJETA DE RASPAR',
    photoCard: 'Mis Fotos',
    photoCardTitle: 'ESTADIOS DE GRANDES LIGAS',
    photoCardSubtitle: '\u2605 \u2605 E S T A D I O S \u00A0 V I S I T A D O S \u2605 \u2605',
    downloadImage: 'Descargar Imagen',
    preparingImage: 'Preparando\u2026',
    legendTitle: 'El Ritual',
    legendText: 'Nacido y criado en Hermosillo, Sonora — una ciudad donde el béisbol se lleva en la sangre. Me propuse visitar todos los estadios de MLB, siempre con mi jersey de Naranjeros de Hermosillo para la foto oficial.<br><br>En cada estadio nuevo, llego temprano para la foto tradicional, recorro el parque y conozco sus rincones. Me quedo a disfrutar todo el juego, y nunca me voy sin mi refresco de souvenir — coleccionar el vaso es parte del ritual.',
  },
};

// URL path wins over browser language so /es and /en are shareable deeplinks.
export function detectLang(pathname = window.location.pathname) {
  const match = pathname.match(/^\/(es|en)(\/|$)/);
  if (match) return match[1];
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  return browserLang.startsWith('es') ? 'es' : 'en';
}

export function langPath(lang) {
  return lang === 'es' ? '/es' : '/';
}

let currentLang = detectLang();

export function t(key) {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
}

export function getDateLocale() {
  return currentLang === 'es' ? 'es-MX' : 'en-US';
}
