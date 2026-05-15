/** Static content for platform pages (fallback when API is unavailable). */

export const HOME_STATS = [
  { value: "340+", labelKey: "platform.stats.routes" },
  { value: "12K", labelKey: "platform.stats.trekkers" },
  { value: "98.5%", labelKey: "platform.stats.uptime" },
  { value: "4.9", labelKey: "platform.stats.rating" }
];

export const HOME_FEATURES = [
  {
    icon: "⌚",
    titleKey: "platform.features.watch.title",
    subtitleKey: "platform.features.watch.subtitle"
  },
  {
    icon: "🗺️",
    titleKey: "platform.features.routes.title",
    subtitleKey: "platform.features.routes.subtitle"
  },
  {
    icon: "🆘",
    titleKey: "platform.features.sos.title",
    subtitleKey: "platform.features.sos.subtitle"
  },
  {
    icon: "🏅",
    titleKey: "platform.features.agencies.title",
    subtitleKey: "platform.features.agencies.subtitle"
  }
];

export const STATIC_ROUTES = [
  {
    id: 1,
    title: "Circuito Lares",
    region: "CUSCO",
    description: "Trek alternativo con paisajes andinos y comunidades quechua.",
    difficulty: "medium",
    distanceKm: 46,
    days: 4,
    maxAltitudeM: 4720,
    headerClass: "route-card-header--mint",
    icon: "🏔️"
  },
  {
    id: 2,
    title: "Santa Cruz",
    region: "ANCASH",
    description: "Uno de los trekkings más icónicos de la Cordillera Blanca.",
    difficulty: "hard",
    distanceKm: 50,
    days: 4,
    maxAltitudeM: 4760,
    headerClass: "route-card-header--sky",
    icon: "❄️"
  },
  {
    id: 3,
    title: "Montaña de Colores",
    region: "CUSCO",
    description: "Caminata de altura hasta Vinicunca con vistas espectaculares.",
    difficulty: "hard",
    distanceKm: 12,
    days: 1,
    maxAltitudeM: 5200,
    headerClass: "route-card-header--pink",
    icon: "🌿"
  },
  {
    id: 4,
    title: "Cruz del Cóndor",
    region: "AREQUIPA",
    description: "Mirador del Cañón del Colca y avistamiento de cóndores.",
    difficulty: "easy",
    distanceKm: 8,
    days: 1,
    maxAltitudeM: 3700,
    headerClass: "route-card-header--sun",
    icon: "🦅"
  },
  {
    id: 5,
    title: "Machu Picchu Full Experience",
    region: "CUSCO",
    description: "Visita guiada a la ciudadela inca con logística completa.",
    difficulty: "hard",
    distanceKm: 32,
    days: 2,
    maxAltitudeM: 2430,
    headerClass: "route-card-header--mint",
    icon: "🏔️"
  },
  {
    id: 6,
    title: "Paracas y Huacachina",
    region: "ICA",
    description: "Islas Ballestas, dunas y sandboard en el desierto costero.",
    difficulty: "easy",
    distanceKm: 24,
    days: 2,
    maxAltitudeM: 400,
    headerClass: "route-card-header--sky",
    icon: "🌊"
  }
];

export const STATIC_POSTS = [
  {
    id: "s1",
    author: "Ana Quispe",
    initials: "AQ",
    timeKey: "platform.community.time.hours",
    timeCount: 2,
    badgeKey: "platform.community.badge.route",
    badgeClass: "community-badge--success",
    contentKey: "platform.community.posts.ana"
  },
  {
    id: "s2",
    author: "Carlos Mendoza",
    initials: "CM",
    timeKey: "platform.community.time.hours",
    timeCount: 5,
    badgeKey: "platform.community.badge.tip",
    badgeClass: "community-badge--info",
    contentKey: "platform.community.posts.carlos"
  },
  {
    id: "s3",
    author: "María Torres",
    initials: "MT",
    timeKey: "platform.community.time.yesterday",
    badgeKey: "platform.community.badge.record",
    badgeClass: "community-badge--success",
    contentKey: "platform.community.posts.maria"
  }
];

export const TOP_TREKKERS = [
  { rank: 1, name: "Luis Ramírez", initials: "LR", statsKey: "platform.community.trekker.stats1", badgeKey: "platform.community.rank.legend" },
  { rank: 2, name: "Elena Vargas", initials: "EV", statsKey: "platform.community.trekker.stats2", badgeKey: "platform.community.rank.expert" },
  { rank: 3, name: "Pedro Soto", initials: "PS", statsKey: "platform.community.trekker.stats3", badgeKey: "platform.community.rank.veteran" },
  { rank: 4, name: "Sofía Díaz", initials: "SD", statsKey: "platform.community.trekker.stats4", badgeKey: "platform.community.rank.active" },
  { rank: 5, name: "Jorge Luna", initials: "JL", statsKey: "platform.community.trekker.stats5", badgeKey: "platform.community.rank.rising" }
];

export const GLOBAL_STATS = [
  { labelKey: "platform.community.global.trekkers", value: "12,480", percent: 88 },
  { labelKey: "platform.community.global.routes-today", value: "234", percent: 62 },
  { labelKey: "platform.community.global.km-week", value: "18,920", percent: 74 },
  { labelKey: "platform.community.global.sos", value: "3", percent: 18 }
];

const TOURIST_NAMES = {
  1: "Ana Quispe",
  2: "Carlos Mendoza",
  3: "María Torres",
  4: "Jorge Luna",
  5: "Sofía Díaz"
};

export function experienceToPost(exp, index) {
  const touristId = Number(exp.touristId) || 1;
  const author = TOURIST_NAMES[touristId] ?? `Trekker ${touristId}`;
  const initials = author
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: exp.id ?? `exp-${index}`,
    author,
    initials,
    timeLabel: exp.createdAt ?? "",
    badgeKey: "platform.community.badge.route",
    badgeClass: "community-badge--success",
    content: exp.note ?? "",
    likes: 12 + (index % 40),
    comments: 3 + (index % 8),
    shares: 1 + (index % 4),
    fromApi: true
  };
}
