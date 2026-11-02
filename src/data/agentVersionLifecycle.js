export const cloneVersion = (value) => JSON.parse(JSON.stringify(value));

export function hydrateVersionLogic(row, defaultLogic) {
  if (!row) return null;
  return {
    ...row,
    logic: row.logic ?? defaultLogic,
    ...(row.comparisonSnapshot ? { comparisonSnapshot: hydrateVersionLogic(row.comparisonSnapshot, defaultLogic) } : {})
  };
}

const stable = (value) => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map((key) => [key, item[key]])) : item);
const resourceKeys = (row) => row.knowledgeResourceKeys || (row.knowledgeBaseKeys || []).map((key) => `base:${key}`);
export function summarizeVersionChanges(source, target) {
  if (!source) return ["缺少来源配置快照，无法自动对比"];
  const changes = [];
  for (const [label, before, after] of [
    ["模型配置", source.modelConfig || { model: source.model }, target.modelConfig || { model: target.model }],
    ["回复逻辑", source.logic || "", target.logic || ""],
    ["逻辑与任务编排", source.orchestration || {}, target.orchestration || {}],
    ["策略任务", source.strategyTasks || [], target.strategyTasks || []]
  ]) if (stable(before) !== stable(after)) changes.push(`修改${label}`);
  for (const [label, before, after] of [
    ["Skill", source.aiSkillKeys || [], target.aiSkillKeys || []],
    ["知识资源", resourceKeys(source), resourceKeys(target)],
    ["工具关联", source.toolKeys || [], target.toolKeys || []]
  ]) {
    const previous = new Set(before), current = new Set(after);
    const added = [...current].filter((key) => !previous.has(key)).length;
    const removed = [...previous].filter((key) => !current.has(key)).length;
    if (added) changes.push(`新增 ${added} 个${label}`);
    if (removed) changes.push(`移除 ${removed} 个${label}`);
  }
  return changes.length ? changes : ["配置与来源版本一致"];
}

export function createDraftVersion(rows, source, number, timestamp) {
  if (rows.some((item) => item.status === "草稿版本")) throw new Error("已有草稿，请先发布或删除现有草稿");
  const { comparisonSnapshot, ...baseline } = cloneVersion(source);
  return [{ ...baseline, key: `v${number}`, version: `v${number}`, status: "草稿版本", archived: false, referenceCount: 0, runningTaskCount: 0, sourceVersion: source.version, comparisonVersion: source.version, comparisonSnapshot: cloneVersion(baseline), releaseNote: "", publishedAt: null, publishedBy: null, effectiveAudience: null, changeSummary: ["配置与来源版本一致"], updatedAt: timestamp }, ...rows];
}

export function publishDraftVersion(rows, key, timestamp, metadata = {}) {
  const draft = rows.find((item) => item.key === key);
  if (!draft || draft.status !== "草稿版本") throw new Error("仅草稿可以发布");
  return rows.map((item) => item.key === key
    ? { ...cloneVersion(item), ...metadata, status: "当前发布版本", updatedAt: timestamp, publishedAt: timestamp }
    : item.status === "当前发布版本" ? { ...item, status: "历史版本" } : item);
}

export function deleteDraftVersion(rows, key) {
  const draft = rows.find((item) => item.key === key);
  if (!draft || draft.status !== "草稿版本") throw new Error("只能删除草稿版本");
  if (draft.referenceCount > 0 || draft.runningTaskCount > 0) throw new Error("草稿仍被引用或有运行任务，请先解除引用并等待任务结束");
  return rows.filter((item) => item.key !== key);
}

export function rollbackVersion(rows, key, number, timestamp) {
  const source = rows.find((item) => item.key === key);
  if (!source || source.status !== "历史版本") throw new Error("只能从历史版本回退发布");
  const { comparisonSnapshot, ...snapshot } = cloneVersion(source);
  const previous = rows.find((item) => item.status === "当前发布版本");
  const published = { ...snapshot, key: `v${number}`, version: `v${number}`, status: "当前发布版本", archived: false, referenceCount: 0, runningTaskCount: 0, sourceVersion: source.version, comparisonVersion: previous?.version, comparisonSnapshot: previous ? cloneVersion({ ...previous, comparisonSnapshot: undefined }) : null, effectiveAudience: null, releaseNote: `基于 ${source.version} 配置回退发布`, changeSummary: summarizeVersionChanges(previous, source), publishedAt: timestamp, publishedBy: "平台管理员", updatedAt: timestamp };
  return [published, ...rows.map((item) => item.status === "当前发布版本" ? { ...item, status: "历史版本" } : item)];
}
