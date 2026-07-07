export function getTicketPriorityKey(priority) {
  const value = String(priority ?? "").toLowerCase();
  if (value === "urgent" || value === "high") return "critical";
  if (value === "medium") return "warning";
  if (value === "low") return "low";
  return "neutral";
}

export function getTicketStatusKey(status) {
  const value = String(status ?? "").toLowerCase();
  if (value === "open" || value === "pending") return "active";
  if (value === "resolved" || value === "closed") return "resolved";
  if (value === "in_progress" || value === "in-progress") return "acknowledged";
  return "neutral";
}

export function formatTicketCategory(category) {
  const value = String(category ?? "");
  return value.replace(/_/g, " ");
}

export function summarizeTicketStats(tickets) {
  const list = tickets ?? [];
  const open = list.filter((t) => getTicketStatusKey(t.status) === "active").length;
  const urgent = list.filter((t) => getTicketPriorityKey(t.priority) === "critical").length;
  const resolved = list.filter((t) => getTicketStatusKey(t.status) === "resolved").length;
  return { total: list.length, open, urgent, resolved };
}

export function formatSupportDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}
