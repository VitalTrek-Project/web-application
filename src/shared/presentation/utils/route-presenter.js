const REGION_RULES = [
  { region: "CUSCO", keywords: ["cusco", "machu", "inca", "sacred", "rainbow", "salkantay", "choquequirao", "vinicunca"] },
  { region: "LIMA", keywords: ["lima", "gastronomy", "night"] },
  { region: "AREQUIPA", keywords: ["arequipa", "colca", "volcano"] },
  { region: "PUNO", keywords: ["titicaca", "puno", "uros"] },
  { region: "ICA", keywords: ["paracas", "huacachina", "nazca", "pisco", "ica"] },
  { region: "AMAZONAS", keywords: ["amazon", "iquitos", "tambopata", "jungle"] },
  { region: "ANCASH", keywords: ["huaraz", "cordillera", "pastoruri"] },
  { region: "LA LIBERTAD", keywords: ["trujillo", "chan", "lambayeque", "sican"] },
  { region: "PIURA", keywords: ["mancora", "piura", "punta sal", "beach"] },
  { region: "JUNÍN", keywords: ["huancayo", "andes escape"] },
  { region: "CAJAMARCA", keywords: ["cajamarca", "hot springs"] },
  { region: "PASCO", keywords: ["oxapampa"] },
  { region: "APURÍMAC", keywords: ["ayacucho"] }
];

const CARD_THEMES = [
  { headerClass: "route-card-header--mint", icon: "🏔️" },
  { headerClass: "route-card-header--sky", icon: "❄️" },
  { headerClass: "route-card-header--pink", icon: "🌿" },
  { headerClass: "route-card-header--sun", icon: "🦅" }
];

const DIFFICULTY_LABEL_KEYS = {
  easy: "platform.difficulty.easy",
  medium: "platform.difficulty.moderate",
  hard: "platform.difficulty.difficult",
  difficult: "platform.difficulty.difficult"
};

function inferRegion(title = "") {
  const text = String(title).toLowerCase();
  const match = REGION_RULES.find((rule) =>
    rule.keywords.some((keyword) => text.includes(keyword))
  );
  return match?.region ?? "PERÚ";
}

function normalizeDifficulty(difficulty) {
  const value = String(difficulty ?? "medium").toLowerCase();
  if (value === "easy") return "easy";
  if (value === "hard" || value === "difficult") return "hard";
  return "medium";
}

function statsForDifficulty(difficulty, id) {
  const seed = Number(id) || 1;
  if (difficulty === "easy") {
    return { distanceKm: 18 + (seed % 12), days: 2 + (seed % 2), maxAltitudeM: 2800 + (seed % 600) };
  }
  if (difficulty === "hard") {
    return { distanceKm: 42 + (seed % 18), days: 4 + (seed % 3), maxAltitudeM: 4600 + (seed % 800) };
  }
  return { distanceKm: 30 + (seed % 20), days: 3 + (seed % 2), maxAltitudeM: 3800 + (seed % 700) };
}

/**
 * Maps a tour resource (API or static) to a route card view model.
 * @param {Object} tour
 * @param {number} index
 * @returns {Object}
 */
export function toRouteCard(tour, index = 0) {
  const id = tour.id ?? index + 1;
  const difficulty = normalizeDifficulty(tour.difficulty);
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const stats = statsForDifficulty(difficulty, id);
  const price = 780 + ((Number(id) * 37) % 420);

  return {
    id,
    title: tour.title ?? `Ruta ${id}`,
    description: tour.description ?? "",
    region: tour.region ?? inferRegion(tour.title),
    difficulty,
    difficultyLabelKey: DIFFICULTY_LABEL_KEYS[difficulty] ?? DIFFICULTY_LABEL_KEYS.medium,
    priceLabel: `S/ ${price}`,
    distanceKm: tour.distanceKm ?? stats.distanceKm,
    days: tour.days ?? stats.days,
    maxAltitudeM: tour.maxAltitudeM ?? stats.maxAltitudeM,
    headerClass: tour.headerClass ?? theme.headerClass,
    icon: tour.icon ?? theme.icon,
    status: tour.status ?? "available"
  };
}

export function filterRoutes(routes, { query = "", difficulty = "all" } = {}) {
  const q = query.trim().toLowerCase();
  return routes.filter((route) => {
    const matchesQuery =
      !q ||
      route.title.toLowerCase().includes(q) ||
      route.region.toLowerCase().includes(q) ||
      route.description.toLowerCase().includes(q);

    const matchesDifficulty =
      difficulty === "all" ||
      route.difficulty === difficulty ||
      (difficulty === "hard" && route.difficulty === "hard");

    return matchesQuery && matchesDifficulty;
  });
}
