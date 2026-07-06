import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

const effectiveIndex = source.indexOf("Skill 生效条件配置");
const scheduleIndex = source.indexOf("Skill 定时任务配置");
const endIndex = source.indexOf("Skill 结束条件配置");

assert.ok(effectiveIndex >= 0, "编排表单应包含 Skill 生效条件配置");
assert.ok(scheduleIndex > effectiveIndex, "Skill 定时任务配置应展示在生效条件配置下方");
assert.ok(endIndex > scheduleIndex, "Skill 结束条件配置应展示在定时任务配置下方");

[
  "endTriggerMode",
  "endAmount",
  "endUnit",
  "该定时任务会在 Skill 生效后，按照下方相对时间执行。"
].forEach((token) => {
  assert.ok(source.includes(token), `Skill 结束条件配置缺少 ${token}`);
});
