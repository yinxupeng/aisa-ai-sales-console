import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../src/app.css", import.meta.url), "utf8");

const menuStartIndex = source.indexOf("const menuItems = [");
const menuEndIndex = source.indexOf("];", menuStartIndex);
const menuSource = source.slice(menuStartIndex, menuEndIndex);
const intelligentAgentModalStartIndex = source.indexOf("function IntelligentAgentModal");
const intelligentAgentStageModalStartIndex = source.indexOf("function IntelligentAgentStageModal");
const intelligentAgentModalSource = source.slice(intelligentAgentModalStartIndex, intelligentAgentStageModalStartIndex);
const rolePageStartIndex = source.indexOf("function IntelligentAgentPage");
const roleModalStartIndex = source.indexOf("function IntelligentAgentModal");
const rolePageSource = source.slice(rolePageStartIndex, roleModalStartIndex);
const strategyPageStartIndex = source.indexOf("function StrategyPage");
const strategyEditorStartIndex = source.indexOf("function escapeMarkup");
const strategyPageSource = source.slice(strategyPageStartIndex, strategyEditorStartIndex);
const agentEditorStartIndex = source.indexOf("function StrategyEditor");
const lifecyclePageStartIndex = source.indexOf("function RoleLifecyclePage");
const agentEditorSource = source.slice(agentEditorStartIndex, lifecyclePageStartIndex);
const effectiveIndex = agentEditorSource.indexOf("2. 生效条件配置");
const scheduleIndex = agentEditorSource.indexOf("3. 策略任务配置");
const aiSkillPageStartIndex = source.indexOf("function AISkillPage");
const toolPageStartIndex = source.indexOf("function ToolsPage");
const aiSkillPageSource = source.slice(aiSkillPageStartIndex, toolPageStartIndex);
const aiSkillColumnsStartIndex = aiSkillPageSource.indexOf("const columns = [");
const aiSkillColumnsEndIndex = aiSkillPageSource.indexOf("  ];", aiSkillColumnsStartIndex);
const aiSkillColumnsSource = aiSkillPageSource.slice(aiSkillColumnsStartIndex, aiSkillColumnsEndIndex);
const aiSkillTabsStartIndex = aiSkillPageSource.indexOf("if (configSkill)");
const aiSkillTabsEndIndex = aiSkillPageSource.length;
const aiSkillTabsSource = aiSkillPageSource.slice(aiSkillTabsStartIndex, aiSkillTabsEndIndex);
const contentMapStartIndex = source.indexOf("const content = useMemo(() => ({");
const contentMapEndIndex = source.indexOf("  })[route]", contentMapStartIndex);
const contentMapSource = source.slice(contentMapStartIndex, contentMapEndIndex);

assert.ok(effectiveIndex >= 0, "智能体编排应包含生效条件配置");
assert.ok(scheduleIndex > effectiveIndex, "策略任务配置应展示在生效条件配置下方");
assert.ok(menuStartIndex >= 0 && menuEndIndex > menuStartIndex, "页面应包含左侧导航配置");
assert.ok(
  intelligentAgentModalStartIndex >= 0 && intelligentAgentStageModalStartIndex > intelligentAgentModalStartIndex,
  "页面应包含智能体编辑弹窗组件"
);
assert.ok(rolePageStartIndex >= 0 && roleModalStartIndex > rolePageStartIndex, "页面应包含角色管理组件");
assert.ok(strategyPageStartIndex >= 0 && strategyEditorStartIndex > strategyPageStartIndex, "页面应包含智能体管理列表组件");
assert.ok(agentEditorStartIndex >= 0 && lifecyclePageStartIndex > agentEditorStartIndex, "页面应包含智能体编辑调试组件");
assert.ok(aiSkillPageStartIndex >= 0 && toolPageStartIndex > aiSkillPageStartIndex, "页面应包含 Skill 管理组件");
assert.ok(aiSkillColumnsStartIndex >= 0 && aiSkillColumnsEndIndex > aiSkillColumnsStartIndex, "Skill 管理页应包含列表字段配置");
assert.ok(aiSkillTabsStartIndex >= 0 && aiSkillTabsEndIndex > aiSkillTabsStartIndex, "Skill 管理页应包含编辑页签配置");
assert.ok(contentMapStartIndex >= 0 && contentMapEndIndex > contentMapStartIndex, "页面应包含路由内容映射");
assert.ok(contentMapSource.includes("agentManager: <IntelligentAgentPage />"), "角色管理菜单 agentManager 应渲染原智能体管理页面");
assert.ok(contentMapSource.includes("strategy: <StrategyPage />"), "智能体管理菜单 strategy 应渲染原 Skill 管理页面");
assert.ok(contentMapSource.includes("skills: <AISkillPage />"), "Skill 管理菜单 skills 应渲染 Skill 管理页面");

[
  { key: "dashboard", label: "工作台" },
  { key: "conversations", label: "会话中心" },
  { key: "sales", label: "企微托管" },
  { key: "agentGroup", label: "智能体" },
  { key: "agentManager", label: "角色管理" },
  { key: "strategy", label: "智能体管理" },
  { key: "skills", label: "Skill管理" },
  { key: "tools", label: "工具管理" },
  { key: "knowledge", label: "知识库管理" },
  { key: "humanization", label: "拟人化设置" },
  { key: "settings", label: "系统管理" }
].reduce((previousIndex, item) => {
  const currentIndex = menuSource.indexOf(`key: "${item.key}"`);
  const itemEndIndex = menuSource.indexOf("}", currentIndex);
  const itemSource = menuSource.slice(currentIndex, itemEndIndex);
  assert.ok(currentIndex > previousIndex, `左侧导航顺序错误：${item.label}`);
  assert.ok(itemSource.includes(`label: "${item.label}"`), `左侧导航名称错误：${item.key}`);
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
  "加好友自然日",
  "agent生效",
  "逻辑与任务编排",
  "预览调试",
  "工具配置",
  "Skill配置",
  "关联知识库",
  "关联工具",
  "已关联工具",
  "用户信息描述",
  "对话内容",
  "执行链路说明",
  "当前智能体流程阶段",
  "流程阶段 2 · D1-青少年厌学休学游戏破局一周家长训练营-【0816期】",
  "预计开始：排课",
  "【19a】Day1",
  "6 条策略任务",
  "课程提醒",
  "课后总结问感受",
  "命中智能体",
  "命中 Skill",
  "工具调用",
  "知识库引用",
  "最终回复",
  "策略任务 &gt;",
  "用户画像总结",
  "推品时机判断",
  "产品匹配建议",
  "回复合规检查",
  "调用三方接口获取信息",
  "本轮不推品",
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
  "阶段配置",
  "模型配置",
  "提示词",
  "工具配置",
  "智能体管理",
  "角色流程管理",
  "角色流程配置",
  "系统提示词",
  "Provider",
  "保存配置",
  "模型基础配置",
  "绑定智能体",
  "流程阶段 {index + 1} ·",
  "预计开始",
  "预计结束",
  "实际开始",
  "实际结束",
  "添加策略任务",
  "策略任务 &gt;",
  "策略任务 ·",
  "消息生成",
  "AISA内部能力",
  "触发：",
  "收起阶段",
  "展开阶段",
  "移除",
  "自我介绍",
  "追问",
  "脑科学",
  "客户状态检查",
  "阶段结果同步"
].forEach((token) => {
  assert.ok(source.includes(token), `页面缺少 ${token}`);
});

[
  "角色列表",
  "管理角色主数据（名称、定位、说明）；定位用于 AI 人设，说明约束业务边界；从「流程配置」进入流程阶段编排。",
  "流程阶段数",
  "新增角色",
  "流程配置",
  "agentScheduleRules",
  "输入该智能体的定时任务描述"
].forEach((token) => {
  assert.ok(source.includes(token), `角色管理或智能体配置页缺少必要内容：${token}`);
});

[
  'title="角色列表"',
  'desc="管理角色主数据（名称、定位、说明）；定位用于 AI 人设，说明约束业务边界；从「流程配置」进入流程阶段编排。"',
  'extra={<Button type="primary" icon={<PlusOutlined />}',
  'title: "角色"',
  'title: "定位"',
  'title: "说明"',
  'title: "流程阶段数"',
  'title: "已配置企微"',
  'title: "状态"',
  'title: "操作"',
  "角色流程配置",
  "配置该角色按什么服务流程执行，以及每个流程阶段绑定哪个智能体。",
  'label: "角色流程管理"'
].forEach((token) => {
  assert.ok(rolePageSource.includes(token), `角色管理页缺少截图内容：${token}`);
});

[
  "角色配置列表",
  "新建角色配置",
  "搜索角色名称或角色说明",
  "全部状态",
  "配置生命周期",
  'title: "角色说明"',
  'title: "生命周期"',
  "agent-config-overview",
  "agent-basic-summary",
  'label: "模型配置"',
  'label: "提示词"',
  'label: "工具配置"',
  'label: "知识库配置"',
  'label: "定时任务配置"',
  'label: "智能体管理"'
].forEach((token) => {
  assert.ok(!rolePageSource.includes(token), `角色管理页不应再包含旧版内容：${token}`);
});

[
  'label="智能体名称" name="name"',
  'label="定位" name="positioning"',
  'label="说明" name="description"',
  'label="拟人化策略" name="humanizationStrategy"',
  "不选则不启用拟人化",
  'className="intelligent-agent-edit-modal"',
  'className="intelligent-agent-edit-form"'
].forEach((token) => {
  assert.ok(intelligentAgentModalSource.includes(token), `智能体编辑弹窗缺少截图字段或样式：${token}`);
});

[
  'label="所属角色"',
  'label="配置企微账号"',
  'label="状态"',
  'name="boundWecomKeys"',
  'name="enabled"'
].forEach((token) => {
  assert.ok(!intelligentAgentModalSource.includes(token), `智能体编辑弹窗不应再包含：${token}`);
});

assert.ok(!source.includes("knowledge-layout"), "知识库列表和知识条目不应放在同一个双栏页面");
assert.ok(!source.includes("bindAgents"), "知识库数据结构不应再包含 bindAgents");
assert.ok(!source.includes("bindSkills"), "知识库数据结构不应再包含 bindSkills");
assert.ok(!source.includes('name="bindSkills"'), "知识库编辑弹窗不应提供绑定 Skill 字段");
assert.ok(!source.includes('dataIndex: "bindSkills"'), "知识库列表不应展示绑定 Skill 列");
assert.ok(source.includes("选择该 Skill 可引用的知识库"), "资源管理 Tab 应说明知识库关联方向");

[
  "logic-token-heading-1",
  "logic-token-heading-2",
  "logic-token-heading-3",
  "logic-token-var",
  "logic-token-tool",
  "logic-token-kb",
  "logic-token-condition",
  "logic-token-strong",
  "logic-token-rule",
  "logic-token-code",
  "logic-token-list",
  "{{customer.name}}",
  "{{student.grade}}",
  "@tool.getStudentProfile",
  "@kb.小学英语课程知识库",
  "when {{customer.intent}} = 高意向",
  "**必须确认试听时间**"
].forEach((token) => {
  assert.ok(source.includes(token) || styles.includes(token), `技能逻辑编辑器格式识别缺少 ${token}`);
});

[
  "用户信息",
  "课程信息",
  "销售策略",
  "流程阶段",
  "客户标签",
  "统一标签库管理，AI打标标签以样式区分",
  "按标签组展示和编辑",
  "AI打标",
  "customer-selected-ai-tag",
  "个人标签",
  "销售自己手动打的标签",
  "customer-profile-tab",
  "customer-basic-table",
  "customer-course-table",
  "sales-strategy-panel"
].forEach((token) => {
  assert.ok(source.includes(token) || styles.includes(token), `客户资料缺少新版资料结构：${token}`);
});
assert.ok(!styles.includes(".course-progress-item > span"), "上课情况进度圆点不应使用直接 span 选择器，避免影响 Ant Text 标签");

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
  'title="智能体列表"',
  'desc="会话智能体按业务流程 SOP 阶段配置；策略智能体用于客户策略、标签和任务编排。"',
  "新增智能体",
  "搜索智能体、触发方式或调用通道",
  "搜索</Button>",
  "重置</Button>",
  'title: "智能体"',
  'title: "触发方式"',
  'title: "创建时间"',
  'title: "修改时间"',
  'title: "状态"',
  'title: "操作"',
  ">编辑</Button>",
  ">配置</Button>",
  "智能体基础信息",
  "复制",
  "删除"
].forEach((token) => {
  assert.ok(strategyPageSource.includes(token), `智能体管理列表缺少线上字段：${token}`);
});

[
  "19元A类课-课前",
  "19元A类课-第一课",
  "19元A类课-第二课",
  "19元A类课-第三课",
  "19元A类课-第四课",
  "19元A类课-课后",
  "SOP会话"
].forEach((token) => {
  assert.ok(source.includes(token), `智能体管理列表缺少 SOP 会话智能体示例：${token}`);
});

assert.ok(!strategyPageSource.includes(">工具配置</Button>"), "智能体管理列表不应再单独展示工具配置操作");

[
  'label: "模型配置"',
  'label: "逻辑与任务编排"',
  'label: "工具配置"',
  'label: "Skill配置"',
  'label: "预览调试"',
  'label="Provider"',
  'label="模型"',
  'label="Base URL"',
  "选择该智能体可关联的 Skill",
  "查看该智能体已关联的 Skill 默认能力定义，具体调用时机由智能体编排和提示词策略共同决定。",
  'title: "Skill名称"',
  'title: "Skill类型"',
  'title: "输出类型"',
  'title: "默认输出去向"',
  'title: "Skill描述"',
  'title: "操作"',
  "agent-config-overview",
  "agent-basic-summary",
  'label="智能体名称"',
  'label="工具 / Skill"',
  "智能体编排",
  "1. 智能体名称",
  "2. 生效条件配置",
  "仅支持一条生效条件。",
  "3. 策略任务配置",
  "智能体生效后按相对时间执行；列表顺序仅便于编排，实际执行看各任务计划时间。",
  "4. 结束条件配置",
  "智能体生效后，按下方时长判定结束。",
  "任务类型",
  "任务类型（时间锚点）",
  "触发类型",
  "立即触发",
  "延后时间",
  "指定时间",
  "任务名称",
  "任务描述",
  "新增任务",
  "新增策略任务",
  "编辑策略任务",
  "结束事件",
  "endRefType",
  "endValue",
  "endUnit"
].forEach((token) => {
  assert.ok(agentEditorSource.includes(token), `智能体编辑调试页缺少：${token}`);
});

[
  'title="智能体基础信息"',
  'label="Agent Code"',
  'label="名称"',
  'label="智能体分类"',
  'label="能力类型"',
  'label="状态"',
  'label="描述"',
  "智能体基础信息已保存"
].forEach((token) => {
  assert.ok(strategyPageSource.includes(token), `智能体基础信息弹窗缺少：${token}`);
});

[
  "客户运营策略智能体",
  "策略智能体",
  "策略任务配置",
  "客户销售策略日报",
  "周期性AI打标",
  "生成个性化策略提示词",
  "自动生成跟进任务",
  "任务逻辑描述",
  "左侧提示词只维护全局角色和共性规则",
  "strategy-task-config-card"
].forEach((token) => {
  assert.ok(source.includes(token) || styles.includes(token), `策略智能体配置缺少：${token}`);
});

[
  'label: "资源管理"',
  'label: "Tool 管理"',
  'label: "基础信息"',
  "Skill 生效条件配置",
  "Skill 定时任务配置",
  "Skill 结束条件配置",
  "endTriggerMode",
  "endAmount"
].forEach((token) => {
  assert.ok(!agentEditorSource.includes(token), `智能体编辑调试页不应再包含旧页签：${token}`);
});

[
  'title="Skill 列表"',
  "新增 Skill",
  'title: "Skill"',
  'title: "能力类型"',
  'title: "调用通道"',
  'title: "绑定角色"',
  'title: "今日调用"',
  'title: "启用"',
  "搜索课程 Skill、触发方式或调用通道"
].forEach((token) => {
  assert.ok(!strategyPageSource.includes(token), `智能体管理列表不应再使用旧 Skill 字段：${token}`);
});

[
  'title="Skill管理"',
  'desc="维护可复用 AI Skill 能力，供智能体按场景组合调用。"',
  "新增Skill",
  "Skill名称",
  "Skill描述",
  "类型",
  "已绑定智能体",
  "更新时间",
  "状态",
  "基本信息",
  "Skill提示词",
  "关联工具",
  "关联知识库",
  "调试测试"
].forEach((token) => {
  assert.ok(aiSkillPageSource.includes(token), `Skill 管理页缺少新功能原型内容：${token}`);
});

[
  'title: "适用场景"',
  'title: "触发方式"',
  'title: "输入信息"',
  'title: "输出结果"',
  'title: "创建时间"',
  'title: "修改时间"',
  'dataIndex: "scenario"',
  'dataIndex: "trigger"',
  'dataIndex: "input"',
  'dataIndex: "output"',
  'dataIndex: "createdAt"'
].forEach((token) => {
  assert.ok(!aiSkillColumnsSource.includes(token), `Skill 管理列表不应再包含字段：${token}`);
});

[
  'label: "基本信息"',
  'label: "Skill提示词"',
  'label: "关联知识库"',
  'label: "关联工具"',
  'label: "调试测试"'
].forEach((token) => {
  assert.ok(aiSkillTabsSource.includes(token), `Skill 编辑页缺少指定页签：${token}`);
});

[
  'label: "基础信息"',
  'label: "执行逻辑"',
  'label: "输入输出"'
].forEach((token) => {
  assert.ok(!aiSkillTabsSource.includes(token), `Skill 编辑页不应再包含旧页签：${token}`);
});

assert.ok(aiSkillColumnsSource.includes("setConfigSkill(normalizeSkillConfig(record))}>编辑"), "Skill 管理列表编辑按钮应进入配置编辑页");
assert.ok(!aiSkillColumnsSource.includes("setEditingSkill(record)}>编辑"), "Skill 管理列表编辑不应再打开弹窗");
assert.ok(!aiSkillColumnsSource.includes(">配置</Button>"), "Skill 管理列表不应再单独展示配置操作");

[
  'label="Skill名称"',
  'label="能力类型"',
  'label="Skill描述"',
  'label="输出类型"',
  'label="默认输出去向"',
  'label="状态"'
].forEach((token) => {
  assert.ok(aiSkillTabsSource.includes(token), `Skill 编辑页基本信息缺少字段：${token}`);
});

[
  "策略判断",
  "结构化档案",
  "生成真人销售建议"
].forEach((token) => {
  assert.ok(aiSkillPageSource.includes(token), `Skill 编辑页基本信息缺少选项：${token}`);
});

[
  'label="运营可见"',
  'label="人工确认"',
  'label="Skill来源"',
  'label="适用行业"',
  'label="可见范围"',
  'label="写入字段映射"',
  "平台预置",
  "企业自建",
  "客户档案字段"
].forEach((token) => {
  assert.ok(!aiSkillTabsSource.includes(token), `Skill 编辑页不应再包含字段：${token}`);
});

assert.ok(!agentEditorSource.includes('scroll={{ x: 1320 }}'), "智能体 Skill 配置表不应使用过宽横向滚动");
assert.ok(styles.includes(".agent-skill-config-table .ant-table"), "智能体 Skill 配置表应有宽度控制样式");

const agentSkillConfigStartIndex = agentEditorSource.indexOf('key: "agent-skills"');
const agentSkillDebugStartIndex = agentEditorSource.indexOf('key: "debug"', agentSkillConfigStartIndex);
const agentSkillConfigSource = agentEditorSource.slice(agentSkillConfigStartIndex, agentSkillDebugStartIndex);
[
  'title: "触发时机"',
  'title: "执行顺序"',
  'title: "输出用途"',
  'title: "输出去向"',
  'title: "运营可见"',
  'title: "人工确认"',
  "上移",
  "下移"
].forEach((token) => {
  assert.ok(!agentSkillConfigSource.includes(token), `智能体 Skill 配置表不应再包含字段：${token}`);
});

[
  "用户画像总结",
  "推品时机判断",
  "产品匹配建议",
  "固定话题回复",
  "回复合规检查",
  "不编造价格和服务次数",
  "不编造时间、链接、课程内容",
  "是否通过：通过 / 需修改 / 必须拦截",
  "## 可调用工具",
  "## 工具调用写法",
  "## 可引用知识库",
  "@tool.callThirdPartyApi",
  "@tool.createPurchaseLink",
  "@tool.getCurrentDatetime",
  "@kb.价格政策与异议处理库",
  "### 改写后回复"
].forEach((token) => {
  assert.ok(source.includes(token), `Skill 管理示例数据缺少：${token}`);
});

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
  "stage-flow-card",
  "stage-task-row",
  "execution-modal-content"
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

assert.ok(source.includes("输入用户信息描述"), "预览调试左侧应保留用户信息描述输入框");
assert.ok(source.includes("保存用户信息描述"), "用户信息描述输入框下方应提供保存按钮");

const metricChangingTokens = [
  "logic-token-heading-1",
  "logic-token-heading-2",
  "logic-token-heading-3",
  "logic-token-var",
  "logic-token-tool",
  "logic-token-kb",
  "logic-token-code",
  "logic-token-list",
  "logic-token-condition",
  "logic-token-strong",
  "logic-token-rule"
];

metricChangingTokens.forEach((className) => {
  const match = styles.match(new RegExp(`\\.${className}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `技能逻辑编辑器缺少 ${className} 样式`);
  ["font-size", "font-weight", "font-family", "padding", "border:"].forEach((property) => {
    assert.ok(!match[1].includes(property), `${className} 不应使用 ${property}，否则会导致输入层和高亮层错位`);
  });
});

const editorStyleMatch = styles.match(/\.skill-logic-editor\s*\{([\s\S]*?)\}/);
assert.ok(editorStyleMatch, "技能逻辑编辑器缺少输入层样式");
assert.ok(!editorStyleMatch[1].includes("color: transparent"), "技能逻辑编辑器输入层文字不应完全透明，避免输入时显示空白");
assert.ok(!editorStyleMatch[1].includes("-webkit-text-fill-color: transparent"), "技能逻辑编辑器输入层不应使用透明 text-fill，避免输入时显示空白");
