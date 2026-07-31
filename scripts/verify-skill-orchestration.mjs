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
  "该定时任务会在 Skill 生效后，按照下方相对时间执行。",
  "工具管理",
  "AI工具提示词",
  "编辑工具提示词",
  "提示词内容",
  "工具提示词保存后可用于 AI Agent 调用。",
  "SOP管理",
  "SOP任务列表",
  "创建SOP",
  "启动事件",
  "时间轴策略",
  "销售范围",
  "运行明细",
  "阶段闲聊 Agent",
  "开启轮询",
  "Agent 生成",
  "固定消息",
  "目标用户范围",
  "条件策略排在前面",
  "FRIEND_ADD_DAILY_BOUNDARY",
  "DRAFT",
  "ENABLED",
  "DISABLED"
].forEach((token) => {
  assert.ok(source.includes(token), `页面缺少 ${token}`);
});
