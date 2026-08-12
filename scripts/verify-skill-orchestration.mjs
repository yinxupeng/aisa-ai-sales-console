import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../src/app.css", import.meta.url), "utf8");

const effectiveIndex = source.indexOf("Skill 生效条件配置");
const scheduleIndex = source.indexOf("Skill 定时任务配置");
const endIndex = source.indexOf("Skill 结束条件配置");
const menuStartIndex = source.indexOf("const menuItems = [");
const menuEndIndex = source.indexOf("];", menuStartIndex);
const menuSource = source.slice(menuStartIndex, menuEndIndex);

assert.ok(effectiveIndex >= 0, "编排表单应包含 Skill 生效条件配置");
assert.ok(scheduleIndex > effectiveIndex, "Skill 定时任务配置应展示在生效条件配置下方");
assert.ok(endIndex > scheduleIndex, "Skill 结束条件配置应展示在定时任务配置下方");
assert.ok(menuStartIndex >= 0 && menuEndIndex > menuStartIndex, "页面应包含左侧导航配置");

[
  "工作台",
  "会话中心",
  "企微托管",
  "智能体管理",
  "Skill 管理",
  "工具管理",
  "知识库管理",
  "拟人化设置",
  "角色管理",
  "系统管理"
].reduce((previousIndex, label) => {
  const currentIndex = menuSource.indexOf(`label: "${label}"`);
  assert.ok(currentIndex > previousIndex, `左侧导航顺序错误：${label}`);
  return currentIndex;
}, -1);

[
  "height: 46px;",
  "margin: 0 0 8px;",
  "line-height: 46px;"
].forEach((token) => {
  assert.ok(styles.includes(token), `左侧导航间距样式缺少 ${token}`);
});

[
  "endTriggerMode",
  "endAmount",
  "endUnit",
  "该定时任务会在 Skill 生效后，按照下方相对时间执行。",
  "taskEffectiveCondition",
  "任务生效时间条件",
  "加好友自然日",
  "agent生效",
  "逻辑与任务编排",
  "预览调试",
  "资源管理",
  "Tool 管理",
  "关联知识库",
  "已关联知识库",
  "关联工具",
  "已关联工具",
  "用户预设",
  "运行逻辑",
  "阶段1",
  "进行中",
  "查看配置",
  "计划",
  "进入",
  "08-09 17:32",
  "08-09 17:36",
  "至今",
  "定时任务 · 3",
  "触发",
  "08-09 17:33",
  "销售-阶段1-添加用户微信-了解用户",
  "查看逻辑",
  "工具管理",
  "知识库管理",
  "知识库列表",
  "知识条目",
  "新增知识库",
  "新增知识条目",
  "管理条目",
  "返回知识库列表",
  "文本知识",
  "图片素材",
  "语音素材",
  "文件素材",
  "AI工具提示词",
  "编辑工具提示词",
  "提示词内容",
  "工具提示词保存后可用于 AI Agent 调用。",
  "智能体管理",
  "智能体列表",
  "新增智能体",
  "所属角色",
  "阶段配置",
  "模型配置",
  "提示词",
  "工具配置",
  "Skill配置",
  "系统提示词",
  "Provider",
  "max_iterations",
  "保存配置",
  "智能体基础信息",
  "模型基础配置",
  "常用参数",
  "绑定 Skill",
  "按角色创建智能体并绑定阶段 Skill",
  "任务管理",
  "Skill：",
  "定时任务",
  "开始：",
  "结束：",
  "收起阶段",
  "展开阶段",
  "客户状态检查",
  "阶段结果同步"
].forEach((token) => {
  assert.ok(source.includes(token), `页面缺少 ${token}`);
});

assert.ok(!source.includes("knowledge-layout"), "知识库列表和知识条目不应放在同一个双栏页面");
assert.ok(!source.includes("绑定智能体"), "知识库不应出现绑定智能体");
assert.ok(!source.includes("bindAgents"), "知识库数据结构不应再包含 bindAgents");
assert.ok(!source.includes("bindSkills"), "知识库数据结构不应再包含 bindSkills");
assert.ok(!source.includes('name="bindSkills"'), "知识库编辑弹窗不应提供绑定 Skill 字段");
assert.ok(!source.includes('dataIndex: "bindSkills"'), "知识库列表不应展示绑定 Skill 列");
assert.ok(source.includes("选择该 Skill 可引用的知识库"), "资源管理 Tab 应说明知识库关联方向");

[
  "Statistic title=\"知识库\"",
  "Statistic title=\"知识条目\"",
  "Statistic title=\"媒体类型\"",
  "Statistic title=\"绑定 Skill\""
].forEach((token) => {
  assert.ok(!source.includes(token), `知识库管理页不应展示顶部统计卡片：${token}`);
});

[
  "Tooltip title={record.desc}",
  "overlayClassName=\"knowledge-base-tooltip\"",
  "width: 520",
  "knowledge-base-title",
].forEach((token) => {
  assert.ok(source.includes(token) || styles.includes(token), `知识库说明应只在标题 hover 时显示全文：${token}`);
});

assert.ok(!source.includes("knowledge-base-desc"), "知识库说明文案不应默认展示在列表里");

[
  "knowledge-entry-back",
  "knowledge-base-info-strip",
  "知识库说明"
].forEach((token) => {
  assert.ok(source.includes(token) || styles.includes(token), `知识条目管理页布局缺少 ${token}`);
});

assert.ok(!source.includes('title={<PanelTitle title="知识条目"'), "条目管理页标题应使用当前知识库名称，不应固定显示知识条目");

[
  "minRows: 18",
  "flex: 1 1 auto;",
  "overflow-y: auto;",
  "margin-top: auto;"
].forEach((token) => {
  assert.ok(source.includes(token) || styles.includes(token), `预览调试布局缺少 ${token}`);
});

[
  "label=\"孩子年级\" name=\"grade\"",
  "label=\"英语基础\" name=\"level\"",
  "label=\"咨询意向\" name=\"intent\"",
  "label=\"生命周期\" name=\"lifecycle\"",
  "label=\"用户标签\" name=\"tags\""
].forEach((token) => {
  assert.ok(!source.includes(token), `用户预设不应再包含选项字段：${token}`);
});

assert.ok(source.includes("输入用户预设的文本描述"), "用户预设应保留文本描述输入框");
assert.ok(source.includes("保存用户预设"), "用户预设输入框下方应提供保存按钮");
