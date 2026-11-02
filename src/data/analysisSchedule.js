// 各分析任务共用的北京时间执行计划。
export function getNextAnalysisRun(config, now = new Date()) {
  if (config?.scheduleEnabled !== true || !Array.isArray(config.dailyTimes) || !config.dailyTimes.length || config.dailyTimes.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) return "—";
  const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai" }).format(now);
  const times = config.dailyTimes.slice().sort();
  const nextToday = times.map((time) => new Date(`${date}T${time}:00+08:00`)).find((time) => time > now);
  const next = nextToday || new Date(new Date(`${date}T${times[0]}:00+08:00`).getTime() + 86400000);
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(next);
}
