import { buildIntentReportResult } from "./intentReportResult.js";
import { buildCohortConversionReport } from "./cohortConversionReport.js";
import { buildOrderQueryReport, orderQueryDefinition } from "./orderQueryReport.js";
export const reportTypes = { communication: "沟通分析", intent: "意向分析", followup: "跟进分析", conversion: "转化分析" };
export const reportStages = ["开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];
export const reportAccounts = [
  { key: "wecom-li", name: "李明", role: "销售A类" }, { key: "wecom-chen", name: "陈欣", role: "销售B类" },
  { key: "wecom-zhou", name: "周悦", role: "销售C类" }, { key: "wecom-wu", name: "吴尚宇", role: "销售B类" }, { key: "wecom-lin", name: "林晓", role: "销售A类" }
];
export const reportDemoUsers = Array.from({ length: 291 }, (_, index) => {
  const account = reportAccounts[index % reportAccounts.length];
  return { key: `demo-parent-${index}`, name: `${["张", "李", "王", "刘", "陈", "赵", "周", "林"][index % 8]}${index % 3 ? "妈妈" : "爸爸"} ${String(index + 1).padStart(3, "0")}`, accountKey: account.key, owner: account.name, role: account.role,
    stage: reportStages[index % 7], intent: index % 6, daysAgo: index % 35, messages: index % 5 ? 4 + index % 43 : 0,
    followup: ["已发送", "待发送", "待人工确认", "因冲突取消"][index % 4], enrolled: index % 6 >= 3 && index % 4 === 0,
    concern: ["孩子情绪波动，关注亲子沟通", "希望改善家庭互动方式", "关注孩子入睡困难与家长陪伴", "想了解课程安排与后续评估"][index % 4] };
});
export const defaultReportDefinition = { type: "communication", days: 7, stage: "all", role: "all", group: "owner" };
export function interpretReportRequest(text, current = defaultReportDefinition) {
  if (/预测|营收|利润|退款|其他企业|其他公司|SQL|删除用户|修改订单|到课|完课|时长/.test(text)) return { error: "当前演示支持沟通、意向、跟进和报名转化分析。该请求的数据或操作能力尚未接入，请调整分析问题。" };
  if (/订单/.test(text) && /昨天|昨日|10月29|10-29/.test(text)) return { definition: { ...orderQueryDefinition } };
  const recognized = /沟通|聊天|回复|意向|分档|跟进|任务|转化|报名|最近|近[一二三七十\d]|本周|阶段|节课|课后|开课前|销售[ABC]|按.*分|全部|所有/.test(text);
  if (!recognized) return { error: "请说明需要分析的指标、时间或用户范围，例如“最近7天各销售的有效沟通人数”，我会据此生成报表预览。" };
  const next = { ...current };
  if (/体验课/.test(text) && /转化/.test(text)) { next.type = "conversion"; next.presentation = "cohortConversion"; next.days = 7; }
  if (/转化|报名/.test(text)) next.type = "conversion";
  else if (/跟进|任务/.test(text)) next.type = "followup";
  else if (/意向|分档/.test(text)) next.type = "intent";
  else if (/沟通|聊天|回复/.test(text)) next.type = "communication";
  if (next.presentation === "cohortConversion" && next.type !== "conversion") delete next.presentation;
  const days = text.match(/(?:最近|近)\s*(\d+)\s*天/);
  if (days && ![7, 30].includes(Number(days[1]))) return { error: "当前演示支持最近7天或最近30天，请选择其中一个时间范围。" };
  if (days) next.days = Number(days[1]);
  if (/本周|近一周/.test(text)) next.days = 7;
  if (/近一个月/.test(text)) next.days = 30;
  if (/全部阶段|不限阶段/.test(text)) next.stage = "all";
  else { const stage = reportStages.find((value) => text.includes(value)) || (/第五节课/.test(text) ? "第5节课" : null); if (stage) next.stage = stage; }
  const role = text.match(/销售([ABC])类?/i);
  if (role) next.role = `销售${role[1].toUpperCase()}类`;
  if (/全部角色|不限角色/.test(text)) next.role = "all";
  if (/按.*角色|按角色/.test(text)) next.group = "role";
  if (/按.*销售|按.*企微|按.*账号/.test(text) && !/角色/.test(text)) next.group = "owner";
  if (next.presentation === "cohortConversion" && next.days !== 7) return { error: "期次转化演示目前提供最近一周（2026-10-23至10-29）的样本数据。" };
  return { definition: next };
}
export const reportTime = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
const percent = (a, b) => b ? `${(a / b * 100).toFixed(1)}%` : "0.0%";
export function computeSalesReport(definition, visibleKeys, users = reportDemoUsers) {
  if (definition.presentation === "orderQuery") return buildOrderQueryReport(definition, reportTime());
  if (definition.presentation === "cohortConversion") return buildCohortConversionReport(definition, visibleKeys, reportAccounts, reportTime());
  if (definition.presentation === "intentAnalysis") return buildIntentReportResult(definition, visibleKeys, reportAccounts, reportTime());
  const scoped = users.filter((row) => visibleKeys.includes(row.accountKey) && (definition.stage === "all" || row.stage === definition.stage) && (definition.role === "all" || row.role === definition.role));
  const rows = scoped.filter((row) => row.daysAgo < definition.days);
  const chatting = rows.filter((row) => row.messages > 0), high = rows.filter((row) => row.intent >= 4), enrolled = chatting.filter((row) => row.enrolled);
  const totalMessages = chatting.reduce((sum, row) => sum + row.messages, 0);
  const sent = rows.filter((row) => row.followup === "已发送");
  const metrics = definition.type === "communication" ? [["范围内总用户", scoped.length], ["有效沟通用户", chatting.length], ["聊天总条数", totalMessages], ["人均聊天条数", chatting.length ? (totalMessages / chatting.length).toFixed(1) : 0]]
    : definition.type === "intent" ? [["本期分析用户", rows.length], ["高意向用户", high.length], ["5档用户", rows.filter((row) => row.intent === 5).length], ["高意向占比", percent(high.length, rows.length)]]
    : definition.type === "followup" ? [["本期跟进任务", rows.length], ["已发送", sent.length], ["待处理", rows.filter((row) => ["待发送", "待人工确认"].includes(row.followup)).length], ["因冲突取消", rows.filter((row) => row.followup === "因冲突取消").length]]
    : [["有效沟通用户", chatting.length], ["高意向用户", chatting.filter((row) => row.intent >= 4).length], ["报名用户", enrolled.length], ["沟通至报名转化率", percent(enrolled.length, chatting.length)]];
  const dimension = definition.group === "role" ? "role" : "owner";
  const groups = [...new Set(rows.map((row) => row[dimension]))].map((name) => {
    const group = rows.filter((row) => row[dimension] === name), active = group.filter((row) => row.messages > 0);
    return { key: name, name, users: group.length, active: active.length, high: group.filter((row) => row.intent >= 4).length, enrolled: active.filter((row) => row.enrolled).length, sent: group.filter((row) => row.followup === "已发送").length };
  });
  const chart = definition.type === "intent" ? [5, 4, 3, 2, 1, 0].map((tier) => ({ name: `${tier}档`, value: rows.filter((row) => row.intent === tier).length }))
    : groups.map((group) => ({ name: group.name, value: definition.type === "communication" ? group.active : definition.type === "conversion" ? group.enrolled : group.sent }));
  return { definition, title: `观心实验室 · ${reportTypes[definition.type]}`, metrics, groups, rows, chart,
    period: `${definition.days === 30 ? "2026-09-29" : "2026-10-22"}—2026-10-28`,
    range: `最近${definition.days}天 · ${definition.stage === "all" ? "全部阶段" : definition.stage} · ${definition.role === "all" ? "全部角色" : definition.role}`,
    conclusion: rows.length ? `本期纳入 ${rows.length} 位家长，其中 ${chatting.length} 位有有效沟通，${high.length} 位处于4—5档意向。建议优先核对高意向家长的实际诉求和跟进记录，再安排人工承接；这些统计仅描述模拟样本，不代表课程效果或真实业绩。` : "当前筛选范围内暂无数据，可扩大时间或用户范围。", generatedAt: reportTime() };
}
export function workspaceStorageKey(userKey, company, keys) { return `sales-report-workspace-v1:${company}:${userKey}:${[...keys].sort().join(",")}`; }
export function seedReportWorkspace(keys) {
  return { sessions: [], reports: Object.keys(reportTypes).map((type, i) => { const definition = { ...defaultReportDefinition, type }; return { id: `seed-report-${i}`, name: `家长${reportTypes[type]}周报`, definition, result: computeSalesReport(definition, keys), creator: "平台管理员", createdAt: "2026-10-28 09:00" }; }) };
}
