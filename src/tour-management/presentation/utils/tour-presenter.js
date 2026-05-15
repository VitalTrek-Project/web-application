export function getTourStatusKey(status) {
  const value = String(status ?? "").toLowerCase();
  if (value === "published" || value === "available") return "published";
  if (value === "draft") return "draft";
  if (value === "full" || value === "unavailable") return "neutral";
  return "neutral";
}

export function summarizeTourStats(tours) {
  const list = tours ?? [];
  const published = list.filter(
    (t) => getTourStatusKey(t.status) === "published"
  ).length;
  const draft = list.filter((t) => getTourStatusKey(t.status) === "draft").length;
  return {
    total: list.length,
    published,
    draft
  };
}

export function summarizeTouristAssignmentStats(tours, tourists) {
  const touristList = tourists ?? [];
  const assignedIds = new Set();

  for (const tour of tours ?? []) {
    const ids = Array.isArray(tour.assignedTourists) ? tour.assignedTourists : [];
    ids.forEach((id) => assignedIds.add(String(id)));
  }

  const assigned = assignedIds.size;
  return {
    total: touristList.length,
    assigned,
    unassigned: Math.max(touristList.length - assigned, 0)
  };
}
