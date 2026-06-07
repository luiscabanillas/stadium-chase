// Simplified top-down SVG footprint paths for each MLB stadium
// viewBox is 40x40, paths are designed to be recognizable at small sizes
// Each captures the distinctive seating bowl + field orientation

export const STADIUM_SHAPES = {
  // — AL East —
  "yankee-stadium": {
    // Bowl open to center, tiered decks
    path: "M20 6 C12 6 6 10 6 18 L6 28 C6 32 10 36 16 36 L24 36 C30 36 34 32 34 28 L34 18 C34 10 28 6 20 6 Z M20 12 L28 20 L24 30 L16 30 L12 20 Z",
  },
  "fenway-park": {
    // Iconic asymmetric shape with Green Monster (left wall is flat/tall)
    path: "M8 8 L8 30 L14 34 L28 34 L34 28 L34 16 L28 10 L18 8 Z M12 14 L12 28 L16 30 L26 30 L30 24 L30 16 L26 14 Z",
  },
  "camden-yards": {
    // Classic retro park, slightly asymmetric bowl
    path: "M20 6 C13 6 7 11 7 18 L7 26 C7 32 12 36 18 36 L22 36 C28 36 33 32 33 26 L33 18 C33 11 27 6 20 6 Z M20 12 L27 18 L25 28 L15 28 L13 18 Z",
  },
  "tropicana-field": {
    // Dome - circular/oval enclosed shape
    path: "M20 5 C10 5 4 11 4 20 C4 29 10 35 20 35 C30 35 36 29 36 20 C36 11 30 5 20 5 Z M20 11 C26 11 30 15 30 20 C30 25 26 29 20 29 C14 29 10 25 10 20 C10 15 14 11 20 11 Z",
  },
  "rogers-centre": {
    // Retractable dome, round shape
    path: "M20 5 C11 5 5 11 5 19 C5 28 11 35 20 35 C29 35 35 28 35 19 C35 11 29 5 20 5 Z M20 12 L27 18 L26 27 L14 27 L13 18 Z",
  },

  // — AL Central —
  "guaranteed-rate": {
    // Symmetric modern bowl
    path: "M20 7 C13 7 8 12 8 18 L8 28 C8 33 13 36 20 36 C27 36 32 33 32 28 L32 18 C32 12 27 7 20 7 Z M20 13 L26 19 L24 29 L16 29 L14 19 Z",
  },
  "progressive-field": {
    // Asymmetric with left field notch
    path: "M18 6 C12 6 6 11 6 18 L6 27 C6 33 11 36 17 36 L25 36 C31 36 34 31 34 26 L34 16 C34 10 28 6 22 6 Z M18 13 L27 17 L25 28 L14 28 L12 19 Z",
  },
  "comerica-park": {
    // Distinctive left field overhang
    path: "M20 6 C12 6 6 12 6 20 L6 28 C6 33 11 36 18 36 L24 36 C30 36 34 32 34 26 L34 18 C34 11 28 6 20 6 Z M16 13 L28 17 L26 29 L14 29 L12 20 Z",
  },
  "kauffman-stadium": {
    // Wide symmetric bowl, distinctive crown shape
    path: "M20 8 C11 8 4 14 4 22 L4 28 C4 33 10 36 20 36 C30 36 36 33 36 28 L36 22 C36 14 29 8 20 8 Z M20 14 L28 20 L26 30 L14 30 L12 20 Z",
  },
  "target-field": {
    // Open concourse, cantilevered upper deck
    path: "M19 6 L10 10 L6 18 L6 28 L10 34 L19 36 L25 36 L32 32 L34 24 L34 16 L30 10 Z M18 13 L27 17 L26 28 L14 28 L12 19 Z",
  },

  // — AL West —
  "minute-maid": {
    // Retractable roof, tall left field
    path: "M10 6 L6 14 L6 28 L10 34 L22 36 L30 34 L34 28 L34 14 L30 8 L22 6 Z M14 14 L28 16 L26 28 L14 28 Z",
  },
  "angel-stadium": {
    // Symmetric bowl with rock feature
    path: "M20 7 C12 7 7 13 7 20 L7 28 C7 33 12 36 20 36 C28 36 33 33 33 28 L33 20 C33 13 28 7 20 7 Z M20 14 L27 20 L24 29 L16 29 L13 20 Z",
  },
  "oakland-coliseum": {
    // Large symmetric oval, Mt. Davis in right
    path: "M20 5 C10 5 4 12 4 20 C4 28 10 35 20 35 C30 35 36 28 36 20 C36 12 30 5 20 5 Z M20 12 L28 18 L26 28 L14 28 L12 18 Z",
  },
  "t-mobile-park": {
    // Retractable roof, asymmetric with crane arm
    path: "M12 5 L6 12 L6 28 L10 34 L22 36 L30 34 L34 26 L34 12 L28 6 Z M14 14 L28 16 L26 28 L14 28 Z",
  },
  "globe-life": {
    // Enclosed retractable roof, boxy shape
    path: "M8 7 L6 14 L6 28 L8 34 L32 34 L34 28 L34 14 L32 7 Z M12 14 L28 14 L28 28 L12 28 Z",
  },

  // — NL East —
  "truist-park": {
    // Modern asymmetric with entertainment district
    path: "M20 6 C12 6 6 12 6 20 L6 28 C6 34 12 36 20 36 C28 36 34 32 34 26 L34 16 C34 10 28 6 20 6 Z M18 13 L28 18 L26 29 L14 29 L12 20 Z",
  },
  "loandepot-park": {
    // Retractable roof, angular modern
    path: "M10 6 L6 12 L6 30 L10 35 L30 35 L34 30 L34 12 L30 6 Z M14 14 L28 14 L28 28 L14 28 Z",
  },
  "citi-field": {
    // Open bowl with rotunda entrance
    path: "M20 6 C12 6 6 12 6 20 L8 30 C10 34 15 36 20 36 C25 36 30 34 32 30 L34 20 C34 12 28 6 20 6 Z M18 13 L27 18 L25 29 L15 29 L13 18 Z",
  },
  "citizens-bank": {
    // Open bowl, wide concourse
    path: "M20 6 C13 6 7 11 7 17 L6 26 C6 32 12 36 20 36 C28 36 34 32 34 26 L33 17 C33 11 27 6 20 6 Z M18 13 L27 18 L25 29 L15 29 L13 18 Z",
  },
  "nationals-park": {
    // Angular modern, open outfield
    path: "M18 6 L8 10 L6 20 L6 28 L12 35 L22 36 L30 34 L34 26 L34 16 L28 8 Z M16 14 L28 17 L26 28 L14 28 L12 20 Z",
  },

  // — NL Central —
  "wrigley-field": {
    // Intimate jewel box, ivy-covered walls, compact shape
    path: "M10 8 L6 16 L6 28 L10 34 L20 36 L30 34 L34 28 L34 16 L30 8 L20 6 Z M14 14 L26 14 L28 24 L22 30 L14 28 Z",
  },
  "great-american": {
    // Riverfront, open outfield to river
    path: "M20 6 C13 6 7 12 7 20 L7 28 C7 33 13 36 20 36 C27 36 33 33 33 28 L33 20 C33 12 27 6 20 6 Z M16 14 L26 14 L28 22 L24 30 L16 30 L12 22 Z",
  },
  "american-family": {
    // Fan-shaped retractable roof panels
    path: "M20 4 C10 4 4 12 4 20 C4 30 10 36 20 36 C30 36 36 30 36 20 C36 12 30 4 20 4 Z M20 12 L28 18 L26 28 L14 28 L12 18 Z",
  },
  "pnc-park": {
    // Intimate riverfront, open outfield to skyline
    path: "M18 7 L10 10 L6 18 L6 28 L10 34 L20 36 L28 34 L34 28 L34 16 L28 8 Z M16 14 L27 16 L26 28 L14 28 L12 20 Z",
  },
  "busch-stadium": {
    // Open bowl with Arch view, symmetrical
    path: "M20 6 C12 6 6 12 6 20 L6 28 C6 34 12 36 20 36 C28 36 34 34 34 28 L34 20 C34 12 28 6 20 6 Z M18 14 L26 14 L28 22 L24 30 L16 30 L12 22 Z",
  },

  // — NL West —
  "chase-field": {
    // Retractable roof, enclosed rectangular
    path: "M8 6 L5 14 L5 28 L8 35 L32 35 L35 28 L35 14 L32 6 Z M12 13 L28 13 L28 28 L12 28 Z",
  },
  "coors-field": {
    // Open bowl, asymmetric with rockpile
    path: "M20 6 C13 6 7 12 7 18 L6 26 C6 33 13 36 20 36 C27 36 34 33 34 26 L33 18 C33 12 27 6 20 6 Z M16 13 L27 16 L26 28 L14 28 L12 19 Z",
  },
  "dodger-stadium": {
    // Classic tiered bowl, wide symmetric, wavy roof
    path: "M20 5 C10 5 4 12 4 20 L4 28 C4 34 10 37 20 37 C30 37 36 34 36 28 L36 20 C36 12 30 5 20 5 Z M20 13 L28 19 L26 29 L14 29 L12 19 Z",
  },
  "petco-park": {
    // Open outfield, Western Metal building integrated
    path: "M16 6 L8 10 L6 18 L6 28 L10 34 L20 36 L30 34 L34 28 L34 16 L30 10 L22 6 Z M14 14 L28 16 L26 28 L14 28 L12 20 Z",
  },
  "oracle-park": {
    // Waterfront, open right field to McCovey Cove
    path: "M16 6 L8 10 L6 20 L6 30 L12 36 L22 36 L32 32 L34 22 L34 14 L28 8 Z M14 14 L28 17 L28 27 L16 29 L12 20 Z",
  },
};
