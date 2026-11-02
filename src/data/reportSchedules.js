import { computeSalesReport } from "./salesReports.js";

const dayMs = 86400000;
const shifted = (now) => new Date(new Date(now).getTime() + 8 * 3600000);
export const shanghaiDate = (now = new Date()) => shifted(now).toISOString().slice(0, 10);
export const defaultReportSchedule = (now = new Date()) => ({ enabled: true, frequency: "daily", times: ["09:00"], weekdays: [1], intervalDays: 2, anchorDate: shanghaiDate(now) });
export function validateReportSchedule(schedule) {
  if (!["daily", "weekly", "interval"].includes(schedule.frequency)) throw new Error("请选择执行节奏");
  if (!Array.isArray(schedule.times) || !schedule.times.length || schedule.times.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) throw new Error("请设置有效的执行时间");
  if (new Set(schedule.times).size !== schedule.times.length) throw new Error("执行时间不能重复");
  if (schedule.times.length > 6) throw new Error("最多设置6个执行时间");
  if (schedule.frequency === "weekly" && (!schedule.weekdays?.length || schedule.weekdays.some((day) => !Number.isInteger(day) || day < 0 || day > 6))) throw new Error("请选择每周执行日");
  if (schedule.frequency === "interval" && (!Number.isInteger(schedule.intervalDays) || schedule.intervalDays < 1 || schedule.intervalDays > 30)) throw new Error("执行间隔应为1—30天");
  if (schedule.frequency === "interval" && (!/^\d{4}-\d{2}-\d{2}$/.test(schedule.anchorDate || "") || Number.isNaN(Date.parse(`${schedule.anchorDate}T00:00:00+08:00`)))) throw new Error("请选择开始日期");
  if (schedule.frequency === "interval" && shanghaiDate(Date.parse(`${schedule.anchorDate}T00:00:00+08:00`)) !== schedule.anchorDate) throw new Error("开始日期无效");
  return { ...schedule, times: [...schedule.times].sort() };
}
export function nextReportRun(schedule, now = new Date()) {
  if (!schedule?.enabled) return null;
  let config; try { config = validateReportSchedule(schedule); } catch { return null; }
  const today = shanghaiDate(now), start = Date.parse(`${today}T00:00:00+08:00`);
  const anchor = Date.parse(`${config.anchorDate}T00:00:00+08:00`);
  for (let offset = 0; offset <= 370; offset++) {
    const epoch = start + offset * dayMs, date = shanghaiDate(epoch);
    const weekday = shifted(epoch).getUTCDay();
    if (config.frequency === "weekly" && !config.weekdays.includes(weekday)) continue;
    if (config.frequency === "interval" && (epoch < anchor || Math.round((epoch - anchor) / dayMs) % config.intervalDays !== 0)) continue;
    for (const time of config.times) {
      const candidate = Date.parse(`${date}T${time}:00+08:00`);
      if (candidate > new Date(now).getTime()) return `${date} ${time}`;
    }
  }
  return null;
}
const weekNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
export function describeReportSchedule(schedule) {
  if (!schedule) return "未配置";
  const rhythm = schedule.frequency === "weekly" ? `每周 ${schedule.weekdays.map((day) => weekNames[day]).join("、")}` : schedule.frequency === "interval" ? `每${schedule.intervalDays}天（${schedule.anchorDate}起）` : "每天";
  return `${rhythm} ${[...schedule.times].sort().join("、")}`;
}
export function interpretScheduleRequest(text, now = new Date()) {
  if (!/每天|每周|每隔/.test(text)) return null;
  const config = defaultReportSchedule(now);
  const interval = text.match(/每隔\s*(\d+)\s*天/);
  if (interval) { config.frequency = "interval"; config.intervalDays = Number(interval[1]); }
  else if (/每周/.test(text)) {
    config.frequency = "weekly";
    const matches = [...text.matchAll(/(?:周|星期)([一二三四五六日天])/g)];
    config.weekdays = [...new Set(matches.map((match) => ({ 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 日: 0, 天: 0 })[match[1]]))];
  }
  const matches = [...text.matchAll(/(?:(上午|下午|晚上|早上)\s*)?(\d{1,2})(?:[:：](\d{2})|点(?:半)?)/g)];
  if (!matches.length) return { error: "请补充具体时间，例如“每天09:00生成”或“每周一18:00生成”，也可点击定时生成手动配置。" };
  config.times = matches.map((match) => {
    let hour = Number(match[2]);
    if (["下午", "晚上"].includes(match[1]) && hour < 12) hour += 12;
    return `${String(hour).padStart(2, "0")}:${match[3] || (match[0].endsWith("半") ? "30" : "00")}`;
  });
  try { return { schedule: validateReportSchedule(config) }; } catch (error) { return { error: error.message }; }
}
export function simulateReportRun(report, visibleKeys, now = new Date()) {
  const record = { id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, reportId: report.id, reportName: report.name, executedAt: new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now), trigger: "手动模拟", definition: { ...report.definition }, rhythm: describeReportSchedule(report.schedule) };
  try {
    if (!visibleKeys.length) throw new Error("当前无可用企微账号，请检查用户范围");
    const result = computeSalesReport(report.definition, visibleKeys);
    return { ...record, status: "成功", result, users: result.rows.length, reason: "" };
  } catch (error) { return { ...record, status: "失败", users: 0, reason: error.message }; }
}
