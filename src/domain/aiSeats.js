const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_TODAY = "2026-09-06";

const toDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export function getAiSeatUsage(rows, license) {
  const enabled = rows.filter((item) => item.aiSeatEnabled).length;
  return {
    total: license.total,
    enabled,
    remaining: Math.max(license.total - enabled, 0)
  };
}

export function getAiSeatView(row, license, today = DEFAULT_TODAY) {
  if (!row.aiSeatEnabled) {
    return {
      status: "inactive",
      label: "未开通",
      color: "default",
      expiresAt: ""
    };
  }

  const expiresAt = license.expiresAt;
  const daysRemaining = Math.ceil((toDate(expiresAt) - toDate(today)) / MS_PER_DAY);

  if (daysRemaining < 0) {
    return {
      status: "expired",
      label: "已过期",
      color: "error",
      expiresAt
    };
  }

  if (daysRemaining <= 30) {
    return {
      status: "expiring",
      label: "即将到期",
      color: "warning",
      expiresAt
    };
  }

  return {
    status: "active",
    label: "已开通",
    color: "success",
    expiresAt
  };
}

export function applyAiSeatChange(rows, license, rowKey, enabled, today = DEFAULT_TODAY) {
  const target = rows.find((item) => item.key === rowKey);
  if (!target) throw new Error("企微账号不存在");

  if (enabled && !target.aiSeatEnabled) {
    const usage = getAiSeatUsage(rows, license);
    if (usage.remaining <= 0) throw new Error("AI 席位已用完");
  }

  return rows.map((item) => {
    if (item.key !== rowKey) return item;
    if (enabled) {
      return {
        ...item,
        aiSeatEnabled: true,
        aiSeatOpenedAt: item.aiSeatOpenedAt || today,
        aiSeatClosedAt: ""
      };
    }
    return {
      ...item,
      aiSeatEnabled: false,
      aiSeatClosedAt: today
    };
  });
}
