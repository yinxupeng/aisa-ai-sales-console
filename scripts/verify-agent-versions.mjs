import assert from "node:assert/strict";
import { createDraftVersion, publishDraftVersion, deleteDraftVersion, rollbackVersion, summarizeVersionChanges } from "../src/data/agentVersionLifecycle.js";

const original = [
  { key: "v3", version: "v3", status: "当前发布版本", modelConfig: { model: "current" }, toolKeys: ["tool-1"] },
  { key: "v2", version: "v2", status: "历史版本", modelConfig: { model: "previous" }, toolKeys: [] }
];
const before = JSON.stringify(original);
assert.deepEqual(summarizeVersionChanges(original[0], { ...original[0], updatedAt: "later", releaseNote: "说明" }), ["配置与来源版本一致"], "元数据不应算作配置变更");
assert.deepEqual(summarizeVersionChanges({ aiSkillKeys: ["a", "b"] }, { aiSkillKeys: ["b", "a"] }), ["配置与来源版本一致"], "资源顺序变化不应误报");
assert.deepEqual(summarizeVersionChanges({ modelConfig: { a: 1, b: 2 } }, { modelConfig: { b: 2, a: 1 } }), ["配置与来源版本一致"]);
assert.deepEqual(summarizeVersionChanges(null, original[0]), ["缺少来源配置快照，无法自动对比"]);
const drafts = createDraftVersion(original, original[0], 4, "2026-10-19 10:00:00");
assert.equal(drafts.filter((row) => row.status === "草稿版本").length, 1);
assert.throws(() => createDraftVersion(drafts, original[0], 5, "now"), /已有草稿/);
drafts[0].modelConfig.model = "edited";
drafts[0].toolKeys.push("tool-2");
assert.equal(drafts[0].comparisonSnapshot.modelConfig.model, "current", "来源快照不能跟随草稿修改");
assert.deepEqual(summarizeVersionChanges(drafts[0].comparisonSnapshot, drafts[0]), ["修改模型配置", "新增 1 个工具关联"]);
assert.equal(JSON.stringify(original), before, "编辑草稿不能改写发布快照");
const published = publishDraftVersion(drafts, "v4", "2026-10-19 10:30:00", { releaseNote: "优化家长沟通", publishedBy: "测试管理员", changeSummary: ["修改模型配置"] });
assert.equal(published[0].releaseNote, "优化家长沟通");
assert.equal(published[0].publishedBy, "测试管理员");
assert.equal(published[0].publishedAt, "2026-10-19 10:30:00");
assert.equal(published.filter((row) => row.status === "当前发布版本").length, 1);
assert.equal(published.find((row) => row.key === "v3").status, "历史版本");
assert.equal(published.find((row) => row.key === "v4").modelConfig.model, "edited");
assert.throws(() => publishDraftVersion(original, "v2", "now"), /仅草稿可以发布/);
assert.throws(() => deleteDraftVersion(original, "v3"), /只能删除草稿/);
assert.throws(() => deleteDraftVersion(original, "v2"), /只能删除草稿/);
const newDraft = createDraftVersion(published, published[0], 5, "now");
assert.equal(newDraft[0].releaseNote, "", "新草稿不能沿用上次发布说明");
assert.equal(newDraft[0].publishedBy, null);
assert.throws(() => deleteDraftVersion(newDraft.map((row) => row.key === "v5" ? { ...row, referenceCount: 1 } : row), "v5"), /仍被引用/);
assert.throws(() => deleteDraftVersion(newDraft.map((row) => row.key === "v5" ? { ...row, runningTaskCount: 1 } : row), "v5"), /运行任务/);
const reverted = rollbackVersion(newDraft, "v2", 6, "2026-10-19 11:00:00");
assert.equal(reverted[0].modelConfig.model, "previous");
assert.equal(reverted[0].sourceVersion, "v2");
assert.equal(reverted[0].releaseNote, "基于 v2 配置回退发布");
assert.equal(reverted[0].comparisonVersion, "v4");
assert.ok(reverted[0].changeSummary.includes("修改模型配置"));
assert.equal(reverted.filter((row) => row.status === "当前发布版本").length, 1);
assert.equal(reverted.find((row) => row.key === "v5").status, "草稿版本", "回退必须保留已有草稿");
assert.deepEqual(reverted.find((row) => row.key === "v2"), original[1], "回退不能改写源历史版本");
const removed = deleteDraftVersion(reverted, "v5");
assert.equal(removed.some((row) => row.key === "v5"), false);
assert.equal(removed[0].status, "当前发布版本");
console.log("AGENT_VERSION_LIFECYCLE_OK");
for (const effectiveAudience of ["all_users", "new_users"]) {
  const audienceRows = publishDraftVersion(drafts, "v4", "2026-10-31 09:00:00", { effectiveAudience });
  assert.equal(audienceRows.find((row) => row.key === "v4").effectiveAudience, effectiveAudience, "发布应保存所选生效对象");
  const copied = createDraftVersion(audienceRows, audienceRows[0], 9, "now");
  assert.equal(copied[0].effectiveAudience, null, "新草稿不得沿用上次发布对象作为已发布结果");
}
