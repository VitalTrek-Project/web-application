import {getExpeditionStatusKey} from "../../../navigation/presentation/utils/navigation-presenter.js";
import {getAlertSeverityKey} from "../../../monitoring/presentation/utils/monitoring-presenter.js";

export {getExpeditionStatusKey, getAlertSeverityKey};

export function formatBucketLabel(iso, bucket) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso ?? "");
  if (bucket === "month") {
    return date.toLocaleDateString(undefined, {month: "short", year: "2-digit"});
  }
  return date.toLocaleDateString(undefined, {day: "2-digit", month: "short"});
}

export function capitalize(value) {
  const text = String(value ?? "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
}

export function severityColor(severityKey) {
  if (severityKey === "critical") return "#ef4444";
  if (severityKey === "warning") return "#ff7a30";
  if (severityKey === "low") return "#22c55e";
  return "#94a3b8";
}

export function formatRelativeAge(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
