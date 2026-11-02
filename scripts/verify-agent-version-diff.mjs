import assert from "node:assert/strict";
import { getVersionDiffFields, diffVersionText } from "../src/data/agentVersionDiff.js";
import { hydrateVersionLogic, createDraftVersion } from "../src/data/agentVersionLifecycle.js";

const defaultLogic = "先承接家长情绪，再了解孩子近况。";
const legacyVersion = { version: "v2", status: "历史版本" };
const existingPublished = { version: "v4", logic: defaultLogic + "补充下一步建议。", comparisonSnapshot: legacyVersion };
const hydrated = hydrateVersionLogic(existingPublished, defaultLogic);
const legacyDiff = getVersionDiffFields(hydrated.comparisonSnapshot, hydrated);
assert.equal(legacyDiff.find((field) => field.label === "回复逻辑").before, defaultLogic, "旧基准缺少逻辑字段时必须与编辑器一样使用默认内容");
assert.equal(hydrateVersionLogic({ logic: "" }, defaultLogic).logic, "", "用户主动清空不能补回默认内容");
assert.equal(legacyVersion.logic, undefined, "兼容旧数据时不能原地修改来源对象");
assert.equal(hydrateVersionLogic(null, defaultLogic), null, "不存在的历史快照不能伪造");
const copied = createDraftVersion([hydrated], { ...hydrated, comparisonVersion: "v1" }, 5, "now");
assert.equal(copied[0].comparisonVersion, "v4", "从回退版本创建草稿后应对比直接来源，不能继承更早的基准");

const source = { modelConfig: { model: "same", temperature: 0.6 }, logic: "先共情，再确认需求。", aiSkillKeys: ["a", "b"] };
const target = { modelConfig: { temperature: 0.8, model: "same" }, logic: "先共情，再确认家长需求。", aiSkillKeys: ["b", "a"] };
const fields = getVersionDiffFields(source, target);
assert.equal(fields.length, 2, "只展示变化字段，不受对象键顺序和资源顺序影响");
assert.equal(fields[0].label, "模型配置 / 温度");
assert.equal(fields[0].before, "0.6");
assert.equal(fields[0].after, "0.8");
assert.deepEqual(getVersionDiffFields(null, target), []);
assert.deepEqual(getVersionDiffFields(source, source), []);
assert.equal(getVersionDiffFields({}, { modelConfig: { model: "new" } })[0].type, "新增");
assert.equal(getVersionDiffFields({ modelConfig: { model: "old" } }, {})[0].type, "移除");
assert.equal(getVersionDiffFields({ knowledgeBaseKeys: ["a"] }, { knowledgeResourceKeys: ["base:a"] }).length, 0);
for (const [before, after] of [[source.logic, target.logic], ["abcDEFghiJKL", "abcXYZghiMNO"], ["", "新增🙂"], ["删除", ""], ["相同", "相同"], ["a".repeat(1000) + "旧", "a".repeat(1000) + "新"]]) {
  const diff = diffVersionText(before, after);
  assert.equal(diff.before.map((part) => part.text).join(""), before);
  assert.equal(diff.after.map((part) => part.text).join(""), after);
  if (before !== after) assert.ok([...diff.before, ...diff.after].some((part) => part.changed));
}
const promptDiff = diffVersionText(source.logic, target.logic);
assert.equal(promptDiff.after.filter((part) => part.changed).map((part) => part.text).join(""), "家长");
console.log("AGENT_VERSION_DIFF_OK");
