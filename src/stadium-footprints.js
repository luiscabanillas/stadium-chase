// Detailed top-down architectural footprint SVGs matching the scratch-off chart style
// Each returns an SVG string at the given size, with optional color theming
// viewBox 0 0 200 200 for detail, rendered at requested pixel size

export function getStadiumFootprint(stadiumId, { size = 200, stroke = '#8a8d8f', fill = '#d4d1c6', fieldFill = '#c4c1b6', diamondFill = '#b8b5a8' } = {}) {
  const fn = FOOTPRINTS[stadiumId];
  if (!fn) return null;
  const inner = fn({ stroke, fill, fieldFill, diamondFill });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" style="overflow:visible">${inner}</svg>`;
}

// Shared diamond shape centered on a point
function diamond(cx, cy, s, fill, stroke) {
  return `<polygon points="${cx},${cy-s} ${cx+s},${cy} ${cx},${cy+s} ${cx-s},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}

const FOOTPRINTS = {
  // ═══════════════ AL EAST ═══════════════
  "camden-yards": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M55 45 Q60 30 80 25 L120 25 Q145 28 155 45 L160 70 Q162 85 155 100 L140 130 Q130 145 115 150 L85 150 Q65 148 55 135 L45 110 Q38 90 42 70 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M70 55 Q75 42 90 38 L115 38 Q130 40 138 55 L142 75 Q143 88 138 98 L128 118 Q120 130 108 134 L92 134 Q78 132 70 120 L62 100 Q56 85 60 72 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 85, 12, diamondFill, stroke)}
    <rect x="160" y="30" width="12" height="120" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1.5" opacity="0.6"/>
  `,

  "fenway-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M40 35 L40 140 L60 155 L100 160 L140 155 L165 130 L165 70 L145 45 L100 30 L60 32 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M50 50 L50 125 L65 140 L100 145 L130 140 L150 120 L150 75 L135 55 L100 42 L68 45 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    <line x1="50" y1="50" x2="50" y2="125" stroke="${stroke}" stroke-width="3"/>
    ${diamond(95, 90, 12, diamondFill, stroke)}
  `,

  "yankee-stadium": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 25 Q55 25 35 55 L30 80 Q28 110 40 135 Q55 160 85 168 L115 168 Q145 160 160 135 Q172 110 170 80 L165 55 Q145 25 100 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 50 Q70 50 55 70 L50 88 Q48 108 58 125 Q68 142 90 148 L110 148 Q132 142 142 125 Q152 108 150 88 L145 70 Q130 50 100 50 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  "tropicana-field": ({ stroke, fill, fieldFill, diamondFill }) => `
    <circle cx="100" cy="100" r="72" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <circle cx="100" cy="100" r="55" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
    <circle cx="100" cy="100" r="72" fill="none" stroke="${stroke}" stroke-width="1" stroke-dasharray="8,4" opacity="0.5"/>
  `,

  "rogers-centre": ({ stroke, fill, fieldFill, diamondFill }) => `
    <circle cx="100" cy="100" r="72" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 28 Q140 28 162 55 L170 80" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6,4"/>
    <path d="M100 28 Q60 28 38 55 L30 80" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6,4"/>
    <path d="M100 50 Q70 50 55 72 L52 90 Q50 115 62 135 Q75 150 100 155 Q125 150 138 135 Q150 115 148 90 L145 72 Q130 50 100 50 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  // ═══════════════ AL CENTRAL ═══════════════
  "guaranteed-rate": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M45 40 L35 65 L32 100 L38 135 Q50 162 80 170 L120 170 Q150 162 162 135 L168 100 L165 65 L155 40 L120 28 L80 28 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M60 55 L52 75 L50 100 L55 125 Q62 145 85 152 L115 152 Q138 145 145 125 L150 100 L148 75 L140 55 L115 45 L85 45 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  "progressive-field": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M50 35 L35 60 L30 90 L35 125 Q45 155 80 165 L115 165 Q148 155 158 130 L165 95 L162 65 L150 40 L115 28 L75 30 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M62 52 L50 72 L48 95 L52 120 Q58 142 82 150 L112 150 Q135 142 142 122 L148 95 L146 72 L138 52 L112 42 L78 44 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
  `,

  "comerica-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M55 32 L35 58 L30 90 L35 125 Q48 160 85 170 L120 168 Q155 158 165 125 L168 90 L162 55 L145 32 L100 22 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M65 50 L50 70 L46 95 L50 120 Q60 148 88 155 L115 153 Q140 145 148 120 L152 95 L148 70 L135 50 L100 40 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
  `,

  "kauffman-stadium": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 30 Q50 30 25 65 L20 100 Q22 140 45 162 Q70 178 100 178 Q130 178 155 162 Q178 140 180 100 L175 65 Q150 30 100 30 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 55 Q65 55 45 80 L42 105 Q44 135 60 150 Q78 162 100 162 Q122 162 140 150 Q156 135 158 105 L155 80 Q135 55 100 55 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 100, 12, diamondFill, stroke)}
  `,

  "target-field": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M55 30 L35 55 L28 85 L32 120 L42 148 Q55 168 85 172 L125 170 Q155 162 165 138 L170 105 L168 72 L158 45 L135 28 L90 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M65 48 L50 68 L45 92 L48 118 Q55 142 80 150 L115 148 Q138 142 148 122 L152 98 L150 75 L142 55 L122 42 L85 40 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
    <path d="M155 28 L170 40 L172 55" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.5"/>
  `,

  // ═══════════════ AL WEST ═══════════════
  "minute-maid": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M40 35 L30 65 L28 100 L35 140 Q48 168 85 175 L130 172 Q160 162 168 130 L172 95 L170 60 L160 35 L130 22 L70 22 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M55 50 L45 75 L44 100 L48 130 Q58 152 85 158 L122 155 Q145 148 152 125 L155 95 L153 68 L145 48 L122 38 L75 38 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
    <line x1="30" y1="35" x2="170" y2="22" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
  `,

  "angel-stadium": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 28 Q55 28 35 58 L28 90 Q28 125 42 150 Q60 172 100 172 Q140 172 158 150 Q172 125 172 90 L165 58 Q145 28 100 28 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 50 Q70 50 55 72 L50 95 Q50 120 60 140 Q72 155 100 155 Q128 155 140 140 Q150 120 150 95 L145 72 Q130 50 100 50 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  "oakland-coliseum": ({ stroke, fill, fieldFill, diamondFill }) => `
    <ellipse cx="100" cy="100" rx="75" ry="70" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <ellipse cx="100" cy="100" rx="58" ry="52" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
    <path d="M160 50 Q180 60 182 100 Q180 140 160 150" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  `,

  "t-mobile-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M50 30 L32 58 L28 90 L32 128 Q42 162 82 172 L125 170 Q158 160 168 128 L172 90 L168 55 L155 30 L110 20 L65 22 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M62 48 L48 70 L45 95 L48 122 Q55 148 82 155 L118 153 Q142 145 150 122 L153 95 L150 70 L140 48 L112 38 L75 40 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
    <path d="M25 25 L172 18" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
  `,

  "globe-life": ({ stroke, fill, fieldFill, diamondFill }) => `
    <rect x="25" y="25" width="150" height="150" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <rect x="25" y="25" width="150" height="150" rx="8" fill="none" stroke="${stroke}" stroke-width="1" stroke-dasharray="8,4" opacity="0.4"/>
    <path d="M50 55 L42 80 L42 120 Q48 148 78 158 L125 158 Q148 150 155 125 L158 90 L155 65 L142 48 L110 40 L70 42 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  // ═══════════════ NL EAST ═══════════════
  "truist-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M55 32 L38 58 L30 90 L35 128 Q48 162 85 172 L120 170 Q155 160 165 128 L170 90 L165 55 L148 32 L110 22 L70 24 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M65 50 L52 70 L48 95 L50 120 Q60 148 85 155 L115 153 Q138 145 145 120 L148 95 L145 70 L135 50 L108 40 L78 42 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
  `,

  "loandepot-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M35 30 L28 60 L25 100 L30 140 Q42 170 80 178 L125 175 Q160 165 170 135 L175 95 L172 55 L165 30 L125 18 L65 20 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M35 30 L175 18" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4"/>
    <path d="M52 50 L45 72 L42 100 L46 130 Q55 155 82 162 L118 160 Q145 152 152 128 L156 98 L154 68 L148 48 L120 38 L72 40 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 92, 12, diamondFill, stroke)}
  `,

  "citi-field": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 25 Q55 25 35 55 L28 85 Q25 120 38 148 Q55 172 90 178 L110 178 Q145 172 162 148 Q175 120 172 85 L165 55 Q145 25 100 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 48 Q68 48 52 70 L46 92 Q44 118 52 138 Q65 158 90 162 L110 162 Q135 158 148 138 Q156 118 154 92 L148 70 Q132 48 100 48 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
    <circle cx="100" cy="25" r="12" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  `,

  "citizens-bank": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 28 Q55 28 35 55 L28 85 Q26 118 38 145 Q55 170 88 175 L112 175 Q145 170 162 145 Q174 118 172 85 L165 55 Q145 28 100 28 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 50 Q68 50 52 72 L48 95 Q46 120 55 140 Q65 158 90 162 L110 162 Q135 158 145 140 Q154 120 152 95 L148 72 Q132 50 100 50 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  "nationals-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M60 30 L38 55 L28 85 L30 122 L42 152 Q58 172 90 178 L120 175 Q152 168 165 142 L172 108 L170 72 L158 42 L130 25 L80 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M70 48 L52 68 L45 90 L46 118 Q52 142 78 152 L108 150 Q132 145 142 125 L148 100 L146 75 L138 55 L118 42 L82 42 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(96, 92, 12, diamondFill, stroke)}
  `,

  // ═══════════════ NL CENTRAL ═══════════════
  "wrigley-field": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M55 35 L38 58 L32 88 L35 120 Q45 152 80 162 L120 162 Q155 152 165 120 L168 88 L162 58 L145 35 L120 25 L80 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M65 52 L52 70 L48 92 L50 115 Q58 140 82 148 L118 148 Q142 140 150 115 L152 92 L148 70 L135 52 L115 42 L85 42 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 92, 12, diamondFill, stroke)}
  `,

  "great-american": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M55 30 L35 55 L28 88 L32 125 Q45 160 85 172 L115 172 Q155 160 168 125 L172 88 L165 55 L145 30 L115 20 L85 20 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M65 48 L50 68 L45 92 L48 120 Q55 148 82 155 L118 155 Q142 148 150 120 L152 92 L148 68 L135 48 L112 38 L88 38 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
  `,

  "american-family": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 18 Q48 18 22 55 Q8 82 12 115 Q18 150 50 172 Q75 188 100 188 Q125 188 150 172 Q182 150 188 115 Q192 82 178 55 Q152 18 100 18 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 18 L145 40" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.5"/>
    <path d="M100 18 L55 40" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.5"/>
    <path d="M100 50 Q65 50 48 75 Q38 95 42 118 Q48 145 70 158 Q82 165 100 165 Q118 165 130 158 Q152 145 158 118 Q162 95 152 75 Q135 50 100 50 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 98, 12, diamondFill, stroke)}
  `,

  "pnc-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M60 30 L38 55 L30 85 L32 122 Q42 158 80 168 L115 168 Q148 158 160 128 L168 92 L165 60 L152 35 L120 22 L75 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M70 48 L52 68 L48 90 L48 115 Q55 142 80 150 L110 150 Q135 142 142 118 L148 92 L146 68 L138 50 L115 40 L82 42 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(96, 92, 12, diamondFill, stroke)}
  `,

  "busch-stadium": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 25 Q55 25 35 55 L28 85 Q25 118 38 148 Q55 172 90 178 L110 178 Q145 172 162 148 Q175 118 172 85 L165 55 Q145 25 100 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 48 Q68 48 52 72 L48 95 Q46 118 55 140 Q68 158 92 162 L108 162 Q132 158 145 140 Q154 118 152 95 L148 72 Q132 48 100 48 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  // ═══════════════ NL WEST ═══════════════
  "chase-field": ({ stroke, fill, fieldFill, diamondFill }) => `
    <rect x="25" y="28" width="150" height="148" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <rect x="25" y="28" width="150" height="148" rx="10" fill="none" stroke="${stroke}" stroke-width="1" stroke-dasharray="8,4" opacity="0.4"/>
    <path d="M50 55 L42 78 L40 108 Q45 142 72 158 L105 162 Q138 158 152 135 L160 102 L158 72 L148 50 L115 38 L72 40 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 95, 12, diamondFill, stroke)}
  `,

  "coors-field": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M55 28 L35 55 L28 88 L32 128 Q45 162 85 175 L118 175 Q155 162 168 128 L172 88 L165 55 L145 28 L115 18 L82 18 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M65 48 L50 68 L45 92 L48 122 Q55 148 82 158 L112 158 Q138 148 148 122 L152 92 L148 68 L135 48 L112 38 L85 38 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(98, 92, 12, diamondFill, stroke)}
  `,

  "dodger-stadium": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M100 20 Q45 20 22 55 L15 90 Q12 128 28 158 Q50 185 100 185 Q150 185 172 158 Q188 128 185 90 L178 55 Q155 20 100 20 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M100 20 Q75 18 55 25" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.4"/>
    <path d="M100 20 Q125 18 145 25" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.4"/>
    <path d="M100 48 Q62 48 45 72 L38 98 Q36 125 48 148 Q65 168 100 168 Q135 168 152 148 Q164 125 162 98 L155 72 Q138 48 100 48 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(100, 98, 12, diamondFill, stroke)}
  `,

  "petco-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M60 28 L38 52 L28 82 L30 120 Q40 158 80 172 L118 172 Q152 160 165 128 L170 92 L168 58 L155 35 L125 22 L75 24 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M68 48 L52 65 L45 88 L46 118 Q52 145 78 155 L112 155 Q135 148 145 122 L150 95 L148 68 L138 50 L118 40 L80 42 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(96, 92, 12, diamondFill, stroke)}
    <rect x="155" y="22" width="18" height="35" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1.5" opacity="0.6"/>
  `,

  "oracle-park": ({ stroke, fill, fieldFill, diamondFill }) => `
    <path d="M60 25 L38 50 L28 82 L30 120 Q40 155 78 168 L115 170 Q148 162 162 135 L170 100 L170 65 L155 38 L125 22 L75 22 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M68 45 L52 62 L45 85 L46 115 Q52 142 78 152 L108 155 Q132 148 142 128 L148 98 L148 72 L138 52 L118 40 L80 40 Z" fill="${fieldFill}" stroke="${stroke}" stroke-width="1"/>
    ${diamond(96, 90, 12, diamondFill, stroke)}
    <path d="M162 135 Q175 148 178 168 L180 180" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>
  `,
};
