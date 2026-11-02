export function getAiSeatUsage(rows, license) {
  const enabled = rows.filter((item) => item.aiSeatEnabled).length;
  return {
    total: license.total,
    enabled,
    remaining: Math.max(license.total - enabled, 0)
  };
}
