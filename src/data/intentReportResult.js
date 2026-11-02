import { intentAnalysisUsers, followUpByLevel } from "./intentAnalysisData.js";
import { filterIntentUsersByScope, evaluateIntentRules, describeIntentRule } from "./intentRules.js";

export function buildIntentReportResult(definition, visibleKeys, accounts, generatedAt, suppliedUsers) {
  const config = definition.intentConfig;
  if (!config?.rules?.length) throw new Error("意向度报表缺少分档配置");
  const rules = config.rules.slice().sort((a, b) => a.level - b.level);
  const rows = suppliedUsers || filterIntentUsersByScope(intentAnalysisUsers, config, accounts).filter((user) => visibleKeys.includes(user.accountKey)).map((user) => {
    const result = evaluateIntentRules(user.metrics, rules), rule = rules.find((item) => item.level === result.level);
    const rank = rules.findIndex((item) => item.level === result.level);
    const suggestionLevel = rules.length === 6 ? result.level : rank === 0 ? 0 : rank + 6 - rules.length;
    return { ...user, level: result.level ?? -1, analysisAt: generatedAt, levelInfo: rule ? { ...rule, description: describeIntentRule(rule) } : { label: "待确认", color: "warning", description: result.reason }, followUp: result.level === null ? "补充关键数据或等待判断，暂不按低意向处理。" : followUpByLevel[suggestionLevel] };
  });
  const chart = rules.slice().reverse().map((rule) => ({ name: `${rule.level}档`, value: rows.filter((user) => user.level === rule.level).length }));
  return JSON.parse(JSON.stringify({ title: "用户意向度分析", presentation: "intentAnalysis", definition, rows, groups: [], chart,
    metrics: [["分析用户数", rows.length], ["最高档用户", chart[0]?.value || 0], ["次高档用户", chart[1]?.value || 0], ["待确认用户", rows.filter((row) => row.level < 0).length]],
    range: `${config.userStages.join("、")} · ${config.wecomRole === "all" ? "全部角色" : config.wecomRole || "全部角色"}`,
    generatedAt, intentSnapshot: { batch: { config, runAt: generatedAt }, users: rows } }));
}
