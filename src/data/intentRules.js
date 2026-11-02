import { matchesWecomRole } from "./wecomRoleScope.js";

export const intentRuleFields = [
  { value: "chatCount", label: "累计聊天条数", type: "number", unit: "条", integer: true },
  { value: "attendanceDays", label: "有效到课天数", type: "number", unit: "天", integer: true },
  { value: "consecutiveAttendanceDays", label: "连续到课天数", type: "number", unit: "天", integer: true },
  { value: "totalWatchMinutes", label: "累计观看时长", type: "number", unit: "分钟" },
  { value: "hasIllnessKeyword", label: "出现孩子问题相关表达", type: "boolean" },
  { value: "askedPrice", label: "客户主动询价", type: "boolean" },
  { value: "expressedAfterLessons123", label: "前三节课后表达感受", type: "boolean" },
  { value: "expressedAfterAllLessons", label: "每节课后均表达感受", type: "boolean" },
  { value: "chattedAfterLesson3", label: "第三个看课日后有客户消息", type: "boolean" }
];

export const intentNumberOperators = [
  { value: "gte", label: "大于等于 ≥" }, { value: "gt", label: "大于 >" },
  { value: "eq", label: "等于 =" }, { value: "lte", label: "小于等于 ≤" }, { value: "lt", label: "小于 <" }
];
const condition = (field, operator, value) => ({ id: field, field, operator, value });
const group = (id, match, conditions) => ({ id, match, conditions });
const definition = (level, label, color, groups) => ({ level, label, color, match: "all", groups });

export const legacyIntentRules = [
  definition(0, "观察中", "default", [group("attendance", "all", [condition("attendanceDays", "eq", 0)]), group("signals", "any", [condition("chatCount", "lte", 20), condition("hasIllnessKeyword", "eq", false)])]),
  definition(1, "开始关注", "blue", [group("main", "all", [condition("attendanceDays", "eq", 0), condition("chatCount", "gt", 20), condition("hasIllnessKeyword", "eq", true)])]),
  definition(2, "开始行动", "cyan", [group("main", "all", [condition("attendanceDays", "gte", 1)])]),
  definition(3, "持续参与", "orange", [group("main", "all", [condition("attendanceDays", "gte", 2), condition("chattedAfterLesson3", "eq", true)])]),
  definition(4, "重点培育", "purple", [group("attendance", "all", [condition("consecutiveAttendanceDays", "gte", 3), condition("totalWatchMinutes", "gt", 40)]), group("signals", "any", [condition("expressedAfterLessons123", "eq", true), condition("askedPrice", "eq", true)])]),
  definition(5, "高意向", "red", [group("main", "all", [condition("consecutiveAttendanceDays", "gte", 3), condition("totalWatchMinutes", "gt", 80), condition("askedPrice", "eq", true), condition("expressedAfterAllLessons", "eq", true)])])
];

export const defaultIntentRules = [
  definition(1, "低意向", "default", [group("main", "all", [condition("attendanceDays", "eq", 0)])]),
  ...legacyIntentRules.slice(2).map((rule) => ({ ...rule, groups: [group("main", "all", rule.groups.flatMap((item) => item.conditions.map((clause) => ({ ...clause }))))] }))
];

// 仅在编辑配置时使用；历史批次按原规则快照分析，不在读取时改写。
export function simplifyIntentRules(rules) {
  return rules.map((rule) => rule.mode === "prompt" || (rule.match === "all" && rule.groups.length === 1 && rule.groups[0].match === "all") ? rule : ({
    ...rule,
    match: "all",
    groups: [group("main", "all", rule.groups.flatMap((item, groupIndex) => item.conditions.map((clause, index) => ({ ...clause, id: `condition-${groupIndex}-${index}` }))))]
  }));
}

function normalizeIntentTiers(rules) {
  const colors = ["default", "cyan", "orange", "purple", "red"];
  return rules.slice().sort((a, b) => a.level - b.level).map((rule, index) => ({ ...rule, level: index + 1, color: index === 0 ? "default" : colors[5 - rules.length + index] }));
}

export function appendIntentTier(rules) {
  if (rules.length >= 5) throw new Error("最多配置5档");
  return normalizeIntentTiers([...rules, definition(rules.length + 1, "", "red", [group("main", "all", [condition("chatCount", "gt", null)])])]);
}

export function removeIntentTier(rules, level) {
  if (rules.length <= 3) throw new Error("至少保留3档");
  if (!rules.some((rule) => rule.level === level)) throw new Error("档位不存在");
  return normalizeIntentTiers(rules.filter((rule) => rule.level !== level));
}

// 仅迁移可编辑配置；历史批次保留旧六档快照。自定义0、1档的条件以“或”合并。
export function migrateIntentRules(rules) {
  if (!Array.isArray(rules) || rules.length !== 6) return rules;
  if (validateIntentRules(rules, { allowLegacy: true })) return rules;
  if (JSON.stringify(rules) === JSON.stringify(legacyIntentRules)) return JSON.parse(JSON.stringify(defaultIntentRules));
  const toAlternatives = (rule) => {
    const alternatives = rule.groups.map((item) => item.match === "all" ? [item.conditions] : item.conditions.map((clause) => [clause]));
    return rule.match === "any" ? alternatives.flat() : alternatives.reduce((left, right) => left.flatMap((a) => right.map((b) => [...a, ...b])), [[]]);
  };
  const sorted = rules.slice().sort((a, b) => a.level - b.level);
  const alternatives = sorted.slice(0, 2).flatMap(toAlternatives);
  const low = { level: 1, label: "低意向", color: "default", match: "any", groups: alternatives.map((conditions, index) => group(`merged-${index}`, "all", conditions.map((clause, clauseIndex) => ({ ...clause, id: `merged-${index}-${clauseIndex}` })))) };
  return normalizeIntentTiers([low, ...sorted.slice(2)]);
}

export function validateIntentRules(rules, { allowLegacy = false } = {}) {
  if (!Array.isArray(rules) || rules.some((rule) => !rule || typeof rule !== "object")) return "请配置3～5个意向档位";
  const levels = rules.map((rule) => rule.level).sort((a, b) => a - b);
  const isLegacy = allowLegacy && levels.length === 6 && levels.every((level, index) => level === index);
  if (!isLegacy && (rules.length < 3 || rules.length > 5 || !levels.every((level, index) => level === index + 1))) return "需配置3～5档，档位从1开始连续编号且不能重复";
  for (const rule of rules) {
    const prefix = `${rule.level}档`;
    if (typeof rule.label !== "string" || !rule.label.trim()) return `${prefix}请填写档位名称`;
    if (rule.mode !== undefined && !["conditions", "prompt"].includes(rule.mode)) return `${prefix}请选择有效的配置方式`;
    if (rule.mode === "prompt") {
      if (typeof rule.prompt !== "string" || !rule.prompt.trim()) return `${prefix}请填写分档提示词`;
      if (rule.prompt.length > 5000) return `${prefix}分档提示词不能超过5000字`;
      continue;
    }
    if (!["all", "any"].includes(rule.match) || !Array.isArray(rule.groups) || !rule.groups.length) return `${prefix}请配置有效的分档条件`;
    if (!allowLegacy && (rule.match !== "all" || rule.groups.length !== 1 || rule.groups[0]?.match !== "all")) return `${prefix}仅支持一个条件组，所有条件须全部满足（且）`;
    for (const item of rule.groups) {
      if (!item || !["all", "any"].includes(item.match) || !Array.isArray(item.conditions) || !item.conditions.length) return `${prefix}的每个条件组至少保留一个条件`;
      for (const clause of item.conditions) {
        const field = intentRuleFields.find((entry) => entry.value === clause?.field);
        if (!field) return `${prefix}存在无效字段`;
        if (field.type === "boolean") {
          if (clause.operator !== "eq" || typeof clause.value !== "boolean") return `${prefix}的“${field.label}”请选择是或否`;
        } else if (!intentNumberOperators.some((entry) => entry.value === clause.operator) || typeof clause.value !== "number" || !Number.isFinite(clause.value) || clause.value < 0 || (field.integer && !Number.isInteger(clause.value))) return `${prefix}的“${field.label}”请填写有效的非负${field.integer ? "整数" : "数值"}`;
      }
    }
  }
  return "";
}

// 三态判断：未知值不当作false；高档位仍可能命中时，不贸然降档。
const combine = (values, match) => match === "all"
  ? values.includes(false) ? false : values.includes(null) ? null : true
  : values.includes(true) ? true : values.includes(null) ? null : false;

function evaluateCondition(metrics, clause) {
  const field = intentRuleFields.find((entry) => entry.value === clause.field);
  const actual = metrics[clause.field];
  if (field.type === "boolean") return typeof actual === "boolean" ? actual === clause.value : null;
  if (typeof actual !== "number" || !Number.isFinite(actual)) return null;
  switch (clause.operator) {
    case "gte": return actual >= clause.value;
    case "gt": return actual > clause.value;
    case "eq": return actual === clause.value;
    case "lte": return actual <= clause.value;
    case "lt": return actual < clause.value;
    default: return null;
  }
}

export function evaluateIntentRules(metrics, rules = defaultIntentRules) {
  const error = validateIntentRules(rules, { allowLegacy: true });
  if (error) return { level: null, status: "invalid", reason: error };
  for (const rule of rules.slice().sort((left, right) => right.level - left.level)) {
    // 原型尚未接入模型：不解析自由文本，也不使用未启用的条件草稿替代AI判断。
    if (rule.mode === "prompt") return { level: null, status: "pending", reason: `${rule.level}档待 AI 判断：原型尚未接入真实 AI，暂不降档` };
    const outcome = combine(rule.groups.map((item) => combine(item.conditions.map((clause) => evaluateCondition(metrics, clause)), item.match)), rule.match);
    if (outcome === null) return { level: null, status: "missing", reason: `${rule.level}档判断缺少关键数据，需补充后分析` };
    if (outcome) return { level: rule.level, status: "matched", reason: describeIntentRule(rule) };
  }
  return { level: null, status: "unmatched", reason: "未匹配任何档位，请检查规则条件是否存在空档" };
}

export function describeIntentRule(rule) {
  if (rule.mode === "prompt") return rule.prompt || "请填写分档提示词";
  const symbols = { gt: ">", gte: "≥", eq: "=", lte: "≤", lt: "<" };
  return rule.groups.map((item) => {
    const text = item.conditions.map((clause) => {
      const field = intentRuleFields.find((entry) => entry.value === clause.field);
      if (!field) return "请选择字段";
      return field.type === "boolean" ? `${field.label}：${clause.value ? "是" : "否"}` : `${field.label}${symbols[clause.operator] || "?"}${clause.value ?? "?"}${field.unit}`;
    }).join(item.match === "all" ? " 且 " : " 或 ");
    return rule.groups.length > 1 && item.conditions.length > 1 ? `（${text}）` : text;
  }).join(rule.match === "all" ? " 且 " : " 或 ");
}

export function filterIntentUsersByScope(users, config, accounts = []) {
  const stages = { 1: "第一节课", 2: "第二节课", 3: "第三节课", 4: "第四节课", 5: "第5节课" };
  const exceeds = (actual, threshold) => threshold === "不限" || (typeof actual === "number" && actual > Number(threshold.match(/\d+/)?.[0]));
  return users.filter((user) => config.userStages.includes(stages[user.currentLesson])
    && matchesWecomRole(config.wecomRole, user.accountKey, accounts)
    && (config.hostingStatus === "不限" || (config.hostingStatus === "已托管" ? user.hosted === true : user.hosted === false))
    && exceeds(user.metrics.chatCount, config.historicalChatThreshold)
    && exceeds(user.metrics.todayChatCount, config.todayChatThreshold));
}
