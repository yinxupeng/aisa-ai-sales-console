const labels = {
  model: "模型", provider: "服务商", baseUrl: "服务地址", temperature: "温度", topP: "Top P",
  name: "名称", title: "标题", enabled: "启用状态", key: "标识", content: "内容", prompt: "提示词",
  scheduleRules: "定时任务", message: "消息内容", trigger: "触发条件", delayValue: "延迟数值", delayUnit: "延迟单位",
  inputScope: "输入数据范围", outputResults: "输出结果", writeTargets: "写入位置", executeDelayDays: "执行延迟",
  messageCountRules: "消息数量规则", effectiveEvent: "生效事件", effectiveTag: "生效标签",
  effectiveTriggerMode: "生效方式", effectiveAmount: "延迟数值", effectiveUnit: "时间单位",
  endRefType: "结束参考事件", endValue: "结束数值", endUnit: "结束单位"
};
const display = (value) => value === undefined ? "未配置" : value === null ? "空值" : typeof value === "boolean" ? (value ? "是" : "否") : String(value);
export function getVersionDiffFields(source, target, resolveResource = (_, key) => key) {
  if (!source || !target) return [];
  const fields = [];
  const visit = (before, after, path) => {
    const complex = [before, after].some((item) => item !== null && typeof item === "object");
    if (complex) {
      const keys = [...new Set([...Object.keys(before || {}), ...Object.keys(after || {})])].sort();
      if (!keys.length) return;
      for (const key of keys) visit(before?.[key], after?.[key], [...path, /^\d+$/.test(key) ? `第 ${Number(key) + 1} 项` : labels[key] || key]);
    } else if (before !== after) fields.push({ key: path.join(" / "), label: path.join(" / "), before: display(before), after: display(after), type: before === undefined ? "新增" : after === undefined ? "移除" : "修改" });
  };
  visit(source.modelConfig || { model: source.model }, target.modelConfig || { model: target.model }, ["模型配置"]);
  visit(source.logic || "", target.logic || "", ["回复逻辑"]);
  visit(source.orchestration || {}, target.orchestration || {}, ["逻辑与任务编排"]);
  visit(source.strategyTasks || [], target.strategyTasks || [], ["策略任务"]);
  for (const [group, before, after] of [
    ["Skill", source.aiSkillKeys || [], target.aiSkillKeys || []],
    ["知识资源", source.knowledgeResourceKeys || (source.knowledgeBaseKeys || []).map((key) => `base:${key}`), target.knowledgeResourceKeys || (target.knowledgeBaseKeys || []).map((key) => `base:${key}`)],
    ["工具关联", source.toolKeys || [], target.toolKeys || []]
  ]) {
    const previous = [...new Set(before)].sort(), current = [...new Set(after)].sort();
    if (JSON.stringify(previous) !== JSON.stringify(current)) fields.push({ key: group, label: group, before: previous.map((key) => resolveResource(group, key)).join("\n") || "未配置", after: current.map((key) => resolveResource(group, key)).join("\n") || "未配置", type: !previous.length ? "新增" : !current.length ? "移除" : "修改" });
  }
  return fields;
}

// Use bounded LCS to mark separate edits; long text falls back to its changed span.
export function diffVersionText(before, after) {
  const a = Array.from(before), b = Array.from(after);
  const left = [], right = [];
  const append = (list, text, changed) => {
    if (!text) return;
    if (list.at(-1)?.changed === changed) list.at(-1).text += text;
    else list.push({ text, changed });
  };
  if (a.length * b.length <= 200000) {
    const table = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
    for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    let i = 0, j = 0;
    while (i < a.length || j < b.length) {
      if (i < a.length && j < b.length && a[i] === b[j]) { append(left, a[i++], false); append(right, b[j++], false); }
      else if (i < a.length && (j === b.length || table[i + 1][j] >= table[i][j + 1])) append(left, a[i++], true);
      else append(right, b[j++], true);
    }
  } else {
    let start = 0, end = 0;
    while (start < Math.min(a.length, b.length) && a[start] === b[start]) start++;
    while (end < Math.min(a.length, b.length) - start && a[a.length - 1 - end] === b[b.length - 1 - end]) end++;
    for (const [chars, list] of [[a, left], [b, right]]) {
      append(list, chars.slice(0, start).join(""), false);
      append(list, chars.slice(start, chars.length - end).join(""), true);
      append(list, end ? chars.slice(-end).join("") : "", false);
    }
  }
  return { before: left, after: right };
}
