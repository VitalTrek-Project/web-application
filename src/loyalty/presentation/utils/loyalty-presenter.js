export function formatLoyaltyDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

export function getRedemptionStatusKey(status) {
  const value = String(status ?? "").toLowerCase();
  if (value === "pending") return "active";
  if (value === "used") return "resolved";
  if (value === "expired") return "neutral";
  return "neutral";
}

export function tierProgressPercentage(profile) {
  if (!profile) return 0;
  if (!profile.nextTierName || profile.pointsToNextTier == null) return 100;
  const total = profile.pointsToNextTier + profile.totalPoints;
  if (total <= 0) return 0;
  return Math.min(100, Math.round((profile.totalPoints / total) * 100));
}

export function transactionSign(points) {
  return points > 0 ? "+" : "";
}
