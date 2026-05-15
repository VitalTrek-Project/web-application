export function getExpeditionStatusKey(status) {
  const value = String(status ?? "").toLowerCase();
  if (value === "in_progress") return "active";
  if (value === "finished") return "finished";
  if (value === "planned" || value === "pending") return "planned";
  return "neutral";
}

export function summarizeCheckpointProgress(checkpoints, completedCount) {
  const total = checkpoints?.length ?? 0;
  const completed = Math.min(completedCount ?? 0, total);
  const pending = Math.max(total - completed, 0);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, percentage };
}

export function getWeatherIcon(condition) {
  const value = String(condition ?? "").toLowerCase();
  if (value.includes("rain") || value.includes("lluvia")) return "pi-cloud-rain";
  if (value.includes("cloud") || value.includes("nubl")) return "pi-cloud";
  if (value.includes("snow") || value.includes("nieve")) return "pi-sun";
  if (value.includes("clear") || value.includes("sole")) return "pi-sun";
  return "pi-cloud";
}

export function formatNavigationDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}
