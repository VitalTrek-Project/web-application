export function summarizeSignStats(signs) {
  const list = signs ?? [];
  const rates = list
    .map((s) => Number(s.heartRate))
    .filter((n) => !Number.isNaN(n) && n > 0);
  const avgHeartRate = rates.length
    ? Math.round(rates.reduce((sum, n) => sum + n, 0) / rates.length)
    : 0;
  return { total: list.length, avgHeartRate };
}

export function getAlertSeverityKey(severity) {
  const value = String(severity ?? "").toLowerCase();
  if (value === "critical" || value === "high") return "critical";
  if (value === "medium" || value === "moderate") return "warning";
  if (value === "low") return "low";
  return "neutral";
}

export function getAlertStatusKey(status) {
  const value = String(status ?? "").toLowerCase();
  if (value === "open" || value === "active" || value === "pending") return "active";
  if (value === "resolved" || value === "closed") return "resolved";
  if (value === "acknowledged") return "acknowledged";
  return "neutral";
}

export function formatAlertType(type) {
  const value = String(type ?? "");
  return value.replace(/_/g, " ");
}

export function summarizeAlertStats(alerts) {
  const list = alerts ?? [];
  const open = list.filter(
    (a) => getAlertStatusKey(a.status) === "active"
  ).length;
  const critical = list.filter(
    (a) => getAlertSeverityKey(a.severity) === "critical"
  ).length;
  return { total: list.length, open, critical };
}

export function formatMonitoringDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}
