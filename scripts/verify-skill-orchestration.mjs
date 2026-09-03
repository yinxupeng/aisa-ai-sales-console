import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const appDataSource = fs.readFileSync(new URL("../src/data/appData.js", import.meta.url), "utf8");
const conversationDataSource = fs.readFileSync(new URL("../src/data/conversations.js", import.meta.url), "utf8");
const tagLibrarySource = fs.readFileSync(new URL("../src/pages/TagLibraryPage.jsx", import.meta.url), "utf8");
const strategyInsightSource = fs.readFileSync(new URL("../src/pages/StrategyInsightPage.jsx", import.meta.url), "utf8");
const conversationPageSource = fs.readFileSync(new URL("../src/pages/ConversationsPage.jsx", import.meta.url), "utf8");
const customersPageSource = fs.readFileSync(new URL("../src/pages/CustomersPage.jsx", import.meta.url), "utf8");
const dataDictionarySource = fs.readFileSync(new URL("../src/pages/DataDictionaryPage.jsx", import.meta.url), "utf8");
const wecomPageSource = fs.readFileSync(new URL("../src/pages/WecomPage.jsx", import.meta.url), "utf8");
const suggestionsPageSource = fs.readFileSync(new URL("../src/pages/SuggestionsPage.jsx", import.meta.url), "utf8");
const humanizationPageSource = fs.readFileSync(new URL("../src/pages/HumanizationPage.jsx", import.meta.url), "utf8");
const settingsPageSource = fs.readFileSync(new URL("../src/pages/SettingsPage.jsx", import.meta.url), "utf8");
const commonTagPickerSource = fs.readFileSync(new URL("../src/components/CommonTagPicker.jsx", import.meta.url), "utf8");
const wecomAvatarSource = fs.readFileSync(new URL("../src/components/WecomAvatar.jsx", import.meta.url), "utf8");
const dashboardPageSource = fs.readFileSync(new URL("../src/pages/DashboardPage.jsx", import.meta.url), "utf8");
const intelligentAgentPageSource = fs.readFileSync(new URL("../src/pages/IntelligentAgentPage.jsx", import.meta.url), "utf8");
const strategyPageSource = fs.readFileSync(new URL("../src/pages/StrategyPage.jsx", import.meta.url), "utf8");
const strategyEditorSource = fs.readFileSync(new URL("../src/pages/StrategyEditor.jsx", import.meta.url), "utf8");
const aiSkillPageSource = fs.readFileSync(new URL("../src/pages/AISkillPage.jsx", import.meta.url), "utf8");
const toolsPageSource = fs.readFileSync(new URL("../src/pages/ToolsPage.jsx", import.meta.url), "utf8");
const knowledgePageSource = fs.readFileSync(new URL("../src/pages/KnowledgePage.jsx", import.meta.url), "utf8");
const salesPageSource = fs.readFileSync(new URL("../src/pages/SalesPage.jsx", import.meta.url), "utf8");
const massMessagePageSource = fs.readFileSync(new URL("../src/pages/MassMessagePage.jsx", import.meta.url), "utf8");
const companyPageSource = fs.readFileSync(new URL("../src/pages/CompanyPage.jsx", import.meta.url), "utf8");
const knowledgePickerSource = fs.readFileSync(new URL("../src/components/KnowledgeResourcePickerModal.jsx", import.meta.url), "utf8");
const skillLogicRichEditorSource = fs.readFileSync(new URL("../src/components/SkillLogicRichEditor.jsx", import.meta.url), "utf8");
const sourceWithData = [
  source,
  appDataSource,
  conversationDataSource,
  tagLibrarySource,
  strategyInsightSource,
  conversationPageSource,
  customersPageSource,
  dataDictionarySource,
  wecomPageSource,
  suggestionsPageSource,
  humanizationPageSource,
  settingsPageSource,
  commonTagPickerSource,
  wecomAvatarSource,
  dashboardPageSource,
  intelligentAgentPageSource,
  strategyPageSource,
  strategyEditorSource,
  aiSkillPageSource,
  toolsPageSource,
  knowledgePageSource,
  salesPageSource,
  massMessagePageSource,
  companyPageSource,
  knowledgePickerSource,
  skillLogicRichEditorSource
].join("\n");
const styles = fs.readFileSync(new URL("../src/app.css", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.ok(!fs.existsSync(new URL("../script.js", import.meta.url)), "根目录旧版 script.js 已无入口引用，应移除");
assert.ok(!fs.existsSync(new URL("../styles.css", import.meta.url)), "根目录旧版 styles.css 已无入口引用，应移除");
assert.equal(packageJson.scripts?.build, "node scripts/build.mjs", "构建应使用直接 Node 脚本，避免包管理器触发 install 检查");
assert.ok(fs.existsSync(new URL("./build.mjs", import.meta.url)), "应提供 scripts/build.mjs 作为低消耗直接构建入口");

const menuStartIndex = source.indexOf("const menuItems = [");
const menuEndIndex = source.indexOf("];", menuStartIndex);
const menuSource = source.slice(menuStartIndex, menuEndIndex);
const intelligentAgentModalStartIndex = intelligentAgentPageSource.indexOf("function IntelligentAgentModal");
const intelligentAgentStageModalStartIndex = intelligentAgentPageSource.indexOf("function IntelligentAgentStageModal");
const intelligentAgentModalSource = intelligentAgentPageSource.slice(intelligentAgentModalStartIndex, intelligentAgentStageModalStartIndex);
const rolePageStartIndex = intelligentAgentPageSource.indexOf("function IntelligentAgentPage");
const roleModalStartIndex = intelligentAgentPageSource.indexOf("function IntelligentAgentModal");
const rolePageSource = intelligentAgentPageSource.slice(rolePageStartIndex, roleModalStartIndex);
const strategyPageStartIndex = strategyPageSource.indexOf("function StrategyPage");
const strategyEditorStartIndex = strategyPageSource.indexOf("function StrategyBasicModal");
const agentEditorStartIndex = strategyEditorSource.indexOf("function StrategyEditor");
const agentEditorSource = strategyEditorSource;
const effectiveIndex = agentEditorSource.indexOf("2. 生效条件配置");
const scheduleIndex = agentEditorSource.indexOf("3. 策略任务配置");
const aiSkillPageStartIndex = aiSkillPageSource.indexOf("function AISkillPage");
const toolPageStartIndex = toolsPageSource.indexOf("function ToolsPage");
const aiSkillColumnsStartIndex = aiSkillPageSource.indexOf("const columns = [");
const aiSkillColumnsEndIndex = aiSkillPageSource.indexOf("  ];", aiSkillColumnsStartIndex);
const aiSkillColumnsSource = aiSkillPageSource.slice(aiSkillColumnsStartIndex, aiSkillColumnsEndIndex);
const aiSkillTabsStartIndex = aiSkillPageSource.indexOf("if (configSkill)");
const aiSkillTabsEndIndex = aiSkillPageSource.length;
const aiSkillTabsSource = aiSkillPageSource.slice(aiSkillTabsStartIndex, aiSkillTabsEndIndex);
const strategyPromptDataSourceStartIndex = agentEditorSource.indexOf("const strategyPromptDataSourceConfigs = [");
const strategyAudienceTagStartIndex = agentEditorSource.indexOf("const strategyAudienceTagOptions", strategyPromptDataSourceStartIndex);
const strategyPromptDataSourceSource = strategyPromptDataSourceStartIndex >= 0 && strategyAudienceTagStartIndex > strategyPromptDataSourceStartIndex
  ? agentEditorSource.slice(strategyPromptDataSourceStartIndex, strategyAudienceTagStartIndex)
  : "";
const massMessageStartIndex = massMessagePageSource.indexOf("function MassMessagePage");
const aiTagAgentDrawerStartIndex = tagLibrarySource.indexOf('title="AI标签生成管理智能体"');
const aiTagAgentRecordModalStartIndex = tagLibrarySource.indexOf('title="AI生成标签库记录"', aiTagAgentDrawerStartIndex);
const aiTagAgentDrawerSource = aiTagAgentDrawerStartIndex >= 0 && aiTagAgentRecordModalStartIndex > aiTagAgentDrawerStartIndex
  ? tagLibrarySource.slice(aiTagAgentDrawerStartIndex, aiTagAgentRecordModalStartIndex)
  : "";
const aiAutoTagDrawerStartIndex = tagLibrarySource.indexOf('title="AI自动打标配置"');
const aiAutoTagRecordModalStartIndex = tagLibrarySource.indexOf('title="AI打标记录"', aiAutoTagDrawerStartIndex);
const aiAutoTagDrawerSource = aiAutoTagDrawerStartIndex >= 0 && aiAutoTagRecordModalStartIndex > aiAutoTagDrawerStartIndex
  ? tagLibrarySource.slice(aiAutoTagDrawerStartIndex, aiAutoTagRecordModalStartIndex)
  : "";
const aiAutoTagRecordColumnsStartIndex = tagLibrarySource.indexOf("const aiAutoTagRecordColumns = [");
const aiAutoTagVariableColumnsStartIndex = tagLibrarySource.indexOf("const toggleAutoTagVariable", aiAutoTagRecordColumnsStartIndex);
const aiAutoTagRecordColumnsSource = aiAutoTagRecordColumnsStartIndex >= 0 && aiAutoTagVariableColumnsStartIndex > aiAutoTagRecordColumnsStartIndex
  ? tagLibrarySource.slice(aiAutoTagRecordColumnsStartIndex, aiAutoTagVariableColumnsStartIndex)
  : "";
const aiAutoTagRecordModalEndIndex = tagLibrarySource.indexOf('title={tagGroupReason?.title}', aiAutoTagRecordModalStartIndex);
const aiAutoTagRecordModalSource = aiAutoTagRecordModalStartIndex >= 0 && aiAutoTagRecordModalEndIndex > aiAutoTagRecordModalStartIndex
  ? tagLibrarySource.slice(aiAutoTagRecordModalStartIndex, aiAutoTagRecordModalEndIndex)
  : "";
const commonTagPickerStartIndex = commonTagPickerSource.indexOf("function CommonTagPickerModal");
const tagLibraryPageStartIndex = tagLibrarySource.indexOf("function TagLibraryPage");
const strategyInsightStartIndex = strategyInsightSource.indexOf("function StrategyInsightPage");
const knowledgePageStartIndex = knowledgePageSource.indexOf("function KnowledgePage");
const salesPageStartIndex = salesPageSource.indexOf("function SalesPage");
const conversationPageStartIndex = conversationPageSource.indexOf("function ConversationsPage");
const sessionFilterPanelStartIndex = conversationPageSource.indexOf("const renderSessionFilterPanel = () =>");
const addComposerItemStartIndex = conversationPageSource.indexOf("const addComposerItem =", sessionFilterPanelStartIndex);
const sessionFilterPanelSource = conversationPageSource.slice(sessionFilterPanelStartIndex, addComposerItemStartIndex);
const sessionStageTimelineStartIndex = conversationPageSource.indexOf("const renderSelectedStageTimeline = () =>");
const sessionConversationListStartIndex = conversationPageSource.indexOf("const renderConversationList = () =>");
const sessionMainChatStartIndex = conversationPageSource.indexOf("const renderMainChatPanel = () =>");
const sessionMainReturnStartIndex = conversationPageSource.indexOf("<div className=\"session-chat-layout\">", sessionMainChatStartIndex);
const sessionWorkspaceSource = conversationPageSource.slice(sessionStageTimelineStartIndex, conversationPageSource.indexOf("<Drawer", sessionMainReturnStartIndex));
const customerStrategyTabStartIndex = conversationPageSource.indexOf("<div className=\"sales-strategy-panel\">");
const customerStrategyTabEndIndex = conversationPageSource.indexOf('key: "lifecycle"', customerStrategyTabStartIndex);
const customerStrategyTabSource = conversationPageSource.slice(customerStrategyTabStartIndex, customerStrategyTabEndIndex);
const contentMapStartIndex = source.indexOf("const content = useMemo(() => ({");
const contentMapEndIndex = source.indexOf("  })[route]", contentMapStartIndex);
const contentMapSource = source.slice(contentMapStartIndex, contentMapEndIndex);
const dataDictionaryPageStartIndex = dataDictionarySource.indexOf("function DataDictionaryPage");
const dataDictionaryPageSource = dataDictionarySource;

assert.ok(effectiveIndex >= 0, "智能体编排应包含生效条件配置");
assert.ok(scheduleIndex > effectiveIndex, "策略任务配置应展示在生效条件配置下方");
assert.ok(menuStartIndex >= 0 && menuEndIndex > menuStartIndex, "页面应包含左侧导航配置");
assert.ok(source.includes('from "./data/conversations"'), "会话 mock 数据应从独立模块导入，避免 App.jsx 持续膨胀");
assert.ok(!source.includes("const rawConversations = ["), "App.jsx 不应继续内联会话 mock 数据");
assert.ok(source.includes('from "./data/appData"'), "通用 mock 配置应从独立模块导入，避免 App.jsx 顶部继续堆积业务数据");
assert.ok(!source.includes("const userProfileSkillPrompt = `"), "App.jsx 不应继续内联长篇 Skill prompt 配置");
assert.ok(source.includes('from "./pages/TagLibraryPage"'), "标签库管理页应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function TagLibraryPage"), "App.jsx 不应继续内联标签库管理页组件");
assert.ok(source.includes('from "./pages/StrategyInsightPage"'), "策略洞察页应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function StrategyInsightPage"), "App.jsx 不应继续内联策略洞察页组件");
assert.ok(source.includes('from "./pages/ConversationsPage"'), "会话中心页应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function ConversationsPage"), "App.jsx 不应继续内联会话中心页组件");
assert.ok(source.includes('from "./pages/CustomersPage"'), "客户中心页应从独立页面模块导入，避免路由引用未定义组件");
assert.ok(!source.includes("function CustomersPage"), "App.jsx 不应继续内联客户中心页组件");
assert.ok(source.includes('from "./pages/DataDictionaryPage"'), "数据字典页应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function DataDictionaryPage"), "App.jsx 不应继续内联数据字典页组件");
assert.ok(source.includes('from "./pages/WecomPage"'), "企微通道页应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function WecomPage"), "App.jsx 不应继续内联企微通道页组件");
assert.ok(source.includes('from "./pages/SuggestionsPage"'), "待发送建议页应从独立页面模块导入，避免路由引用未定义组件");
assert.ok(source.includes('from "./pages/HumanizationPage"'), "拟人化设置页应从独立页面模块导入，避免路由引用未定义组件");
assert.ok(source.includes('from "./pages/SettingsPage"'), "系统管理页应从独立页面模块导入，避免路由引用未定义组件");
assert.ok(source.includes('from "./pages/DashboardPage"'), "工作台页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function Dashboard("), "App.jsx 不应继续内联工作台组件");
assert.ok(source.includes('from "./pages/CompanyPage"'), "企业管理页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function CompanyPage"), "App.jsx 不应继续内联企业管理页组件");
assert.ok(source.includes('from "./pages/IntelligentAgentPage"'), "角色管理页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function IntelligentAgentPage"), "App.jsx 不应继续内联角色管理页组件");
assert.ok(source.includes('from "./pages/StrategyPage"'), "智能体管理页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function StrategyPage"), "App.jsx 不应继续内联智能体管理页组件");
assert.ok(!source.includes("function StrategyEditor"), "App.jsx 不应继续内联智能体编排组件");
assert.ok(source.includes('from "./pages/AISkillPage"'), "Skill管理页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function AISkillPage"), "App.jsx 不应继续内联 Skill管理页组件");
assert.ok(source.includes('from "./pages/ToolsPage"'), "工具管理页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function ToolsPage"), "App.jsx 不应继续内联工具管理页组件");
assert.ok(source.includes('from "./pages/KnowledgePage"'), "知识库管理页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function KnowledgePage"), "App.jsx 不应继续内联知识库管理页组件");
assert.ok(source.includes('from "./pages/SalesPage"'), "企微托管页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function SalesPage"), "App.jsx 不应继续内联企微托管页组件");
assert.ok(source.includes('from "./pages/MassMessagePage"'), "用户群发页面应从独立页面模块导入，降低 App.jsx 单文件成本");
assert.ok(!source.includes("function MassMessagePage"), "App.jsx 不应继续内联用户群发页组件");
assert.ok(!source.includes("function AgentPage"), "App.jsx 不应包含废弃的 AgentPage 死代码");
assert.ok(!source.includes("function RoleLifecyclePage"), "App.jsx 不应包含废弃的 RoleLifecyclePage 死代码");
assert.ok(!source.includes("function ActionModal"), "App.jsx 不应包含无调用的 ActionModal 死代码");
assert.ok(strategyEditorSource.includes('from "../components/CommonTagPicker"'), "通用标签选择器应从独立组件模块导入");
assert.ok(!source.includes("function CommonTagPickerModal"), "App.jsx 不应继续内联通用标签选择弹窗组件");
assert.ok(conversationPageSource.includes('from "../components/WecomAvatar"'), "会话中心应导入企微头像通用组件");
assert.ok(customersPageSource.includes('from "../components/WecomAvatar"'), "客户中心应导入企微头像通用组件");
assert.ok(
  intelligentAgentModalStartIndex >= 0 && intelligentAgentStageModalStartIndex > intelligentAgentModalStartIndex,
  "页面应包含智能体编辑弹窗组件"
);
assert.ok(rolePageStartIndex >= 0 && roleModalStartIndex > rolePageStartIndex, "页面应包含角色管理组件");
assert.ok(strategyPageStartIndex >= 0 && strategyEditorStartIndex > strategyPageStartIndex, "页面应包含智能体管理列表组件");
assert.ok(agentEditorStartIndex >= 0, "页面应包含智能体编辑调试组件");
assert.ok(aiSkillPageStartIndex >= 0, "页面应包含 Skill 管理组件");
assert.ok(toolPageStartIndex >= 0, "页面应包含工具管理组件");
assert.ok(aiSkillColumnsStartIndex >= 0 && aiSkillColumnsEndIndex > aiSkillColumnsStartIndex, "Skill 管理页应包含列表字段配置");
assert.ok(aiSkillTabsStartIndex >= 0 && aiSkillTabsEndIndex > aiSkillTabsStartIndex, "Skill 管理页应包含编辑页签配置");
assert.ok(tagLibraryPageStartIndex >= 0, "页面应包含标签库管理组件");
assert.ok(aiTagAgentDrawerStartIndex >= 0 && aiTagAgentRecordModalStartIndex > aiTagAgentDrawerStartIndex, "标签库管理页应包含 AI 标签生成管理侧边栏");
assert.ok(aiAutoTagDrawerStartIndex >= 0 && aiAutoTagRecordModalStartIndex > aiAutoTagDrawerStartIndex, "标签库管理页应包含 AI 自动打标配置侧边栏");
assert.ok(aiAutoTagRecordColumnsStartIndex >= 0 && aiAutoTagVariableColumnsStartIndex > aiAutoTagRecordColumnsStartIndex, "标签库管理页应包含 AI 打标记录列表字段");
assert.ok(aiAutoTagRecordModalStartIndex >= 0 && aiAutoTagRecordModalEndIndex > aiAutoTagRecordModalStartIndex, "标签库管理页应包含 AI 打标记录弹窗");
assert.ok(strategyInsightStartIndex >= 0, "页面应包含策略洞察组件");
assert.ok(commonTagPickerStartIndex >= 0, "页面应包含通用标签选择弹窗组件");
assert.ok(conversationPageStartIndex >= 0, "页面应包含会话中心组件");
assert.ok(sessionFilterPanelStartIndex >= 0 && addComposerItemStartIndex > sessionFilterPanelStartIndex, "会话中心应包含默认筛选区");
assert.ok(sessionStageTimelineStartIndex >= 0 && sessionConversationListStartIndex > sessionStageTimelineStartIndex, "会话中心应包含课程服务阶段条");
assert.ok(sessionConversationListStartIndex >= 0 && sessionMainChatStartIndex > sessionConversationListStartIndex, "会话中心应包含左侧用户会话列表");
assert.ok(sessionMainChatStartIndex >= 0 && sessionMainReturnStartIndex > sessionMainChatStartIndex, "会话中心应包含右侧聊天面板");
assert.ok(customerStrategyTabStartIndex >= 0 && customerStrategyTabEndIndex > customerStrategyTabStartIndex, "客户详情应包含销售策略 Tab 内容");
assert.ok(contentMapStartIndex >= 0 && contentMapEndIndex > contentMapStartIndex, "页面应包含路由内容映射");
[
  "Dashboard",
  "CustomersPage",
  "CompanyPage",
  "IntelligentAgentPage",
  "StrategyPage",
  "AISkillPage",
  "ToolsPage",
  "KnowledgePage",
  "TagLibraryPage",
  "DataDictionaryPage",
  "StrategyInsightPage",
  "MassMessagePage",
  "WecomPage",
  "SalesPage",
  "HumanizationPage",
  "ConversationsPage",
  "SuggestionsPage",
  "SettingsPage"
].forEach((componentName) => {
  assert.ok(
    sourceWithData.includes(`function ${componentName}`) || source.includes(`import ${componentName} from`),
    `路由内容映射引用了未定义页面组件：${componentName}`
  );
});
assert.ok(contentMapSource.includes("agentManager: <IntelligentAgentPage />"), "角色管理菜单 agentManager 应渲染原智能体管理页面");
assert.ok(contentMapSource.includes("strategy: <StrategyPage />"), "智能体管理菜单 strategy 应渲染原 Skill 管理页面");
assert.ok(contentMapSource.includes("skills: <AISkillPage />"), "Skill 管理菜单 skills 应渲染 Skill 管理页面");
assert.ok(contentMapSource.includes("dataDictionary: <DataDictionaryPage />"), "数据字典 / 变量配置菜单 dataDictionary 应渲染数据字典页面");
assert.ok(contentMapSource.includes("strategyInsight: <StrategyInsightPage"), "策略洞察菜单 strategyInsight 应渲染策略洞察页面");
assert.ok(!customerStrategyTabSource.includes("已写入客户档案"), "客户详情销售策略 Tab 不应展示已写入客户档案标签");
assert.ok(!customerStrategyTabSource.includes("AI写入标签"), "客户详情销售策略 Tab 不应展示 AI 写入标签模块");
assert.ok(!customerStrategyTabSource.includes("个性化提示词摘要"), "客户详情销售策略 Tab 应将个性化提示词摘要合并到用户洞察与销售建议");
assert.ok(customerStrategyTabSource.includes("strategyInsightEditing"), "客户详情销售策略 Tab 应支持编辑态");
assert.ok(customerStrategyTabSource.includes("保存"), "客户详情销售策略 Tab 应支持保存编辑内容");
assert.ok(customerStrategyTabSource.includes("取消"), "客户详情销售策略 Tab 应支持取消编辑");
assert.ok(customerStrategyTabSource.includes("Input.TextArea"), "客户详情销售策略 Tab 合并内容应使用可编辑文本域");

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
  { key: "tagLibrary", label: "标签库管理" },
  { key: "dataDictionary", label: "数据字典 / 变量配置" },
  { key: "strategyInsight", label: "策略洞察" },
  { key: "massMessage", label: "用户群发" },
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
  "function DataDictionaryPage",
  "数据对象",
  "字段字典",
  "AI变量",
  "变量测试",
  "{{conversation.recent_user_messages}}",
  "{{customer_file.need_summary}}",
  "{{profile.lifecycle_stage}}",
  "{{tag.current_tags}}",
  "测试解析",
  "data-dictionary-page",
  "variable-test-toolbar"
].forEach((token) => {
  assert.ok(dataDictionaryPageSource.includes(token) || styles.includes(token), `数据字典 / 变量配置页面缺少：${token}`);
});

[
  "策略洞察",
  "洞察列表",
  "用户洞察日报",
  "AI生成洞察",
  "insightGenerateModalOpen",
  "AI生成用户洞察日报",
  "洞察类型",
  "分析人群",
  "指定标签人群",
  "指定阶段人群",
  "数据范围",
  "用户沟通数据",
  "客户档案",
  "课程行为",
  "标签数据",
  "生成时间",
  "立即生成",
  "定时生成",
  "输出内容",
  "人群整体结论",
  "分层洞察",
  "重点用户清单",
  "销售建议",
  "生成逻辑",
  "任务提示词",
  "insightGeneratePrompt",
  "请基于所选用户沟通数据、客户档案、课程行为和标签数据，生成用户洞察日报",
  "不要基于单条对话做过度判断",
  "重点用户必须说明判断依据",
  "审核方式",
  "生成后直接进入洞察列表",
  "需人工确认后入库",
  "覆盖人数",
  "重点人数",
  "人群整体结论",
  "人群分层",
  "重点用户清单",
  "洞察摘要",
  "用户清单",
  "insight-clickable-count",
  "insight-user-list-modal",
  "userListColumns",
  "insight-user-list-table",
  "insight-wrap-cell",
  "openInsightUserList",
  "onViewConversation",
  "openInsightCustomerChat",
  "strategy-insight-detail-drawer",
  "建议动作",
  "处理状态",
  "高意向用户",
  "观望培育用户",
  "风险关注用户",
  "查看会话",
  "创建跟进任务"
].forEach((token) => {
  assert.ok(strategyInsightSource.includes(token) || styles.includes(token), `策略洞察页面缺少：${token}`);
});

assert.ok(!strategyInsightSource.includes(">生成日报</Button>"), "策略洞察页按钮应改为 AI生成洞察");

[
  "AI生成动作结果",
  "输出项",
  "写入位置",
  "是否需要确认",
  "下一步处理建议",
  "加入群发人群",
  "标记已处理",
  "全部输出类型",
  "风险预警 / 人工提醒",
  "转化分析 / 跟进任务",
  "insight-action-result-table",
  "insight-next-actions",
  "actionResultColumns"
].forEach((token) => {
  assert.ok(!strategyInsightSource.includes(token) && !styles.includes(token), `策略洞察页面不应再包含旧详情内容：${token}`);
});

[
  "height: 46px;",
  "margin: 0 0 8px;",
  "line-height: 46px;"
].forEach((token) => {
  assert.ok(styles.includes(token), `左侧导航间距样式缺少 ${token}`);
});
[
  "padding: 0 16px;",
  "padding: 16px 16px 32px;"
].forEach((token) => {
  assert.ok(styles.includes(token), `全局页面左右边距应收窄，缺少 ${token}`);
});
assert.ok(!styles.includes("padding: 0 32px;"), "页面头部左右边距不应继续使用 32px");
assert.ok(!styles.includes("padding: 24px 32px 40px;"), "页面内容区左右边距不应继续使用 32px");

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
  "资源目录",
  "新建文件夹",
  "新增资源",
  "资源类型",
  "资源内容",
  "资源说明",
  "链接集合",
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
  assert.ok(sourceWithData.includes(token), `页面缺少 ${token}`);
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
  assert.ok(sourceWithData.includes(token), `角色管理或智能体配置页缺少必要内容：${token}`);
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
  'label: "角色流程管理"',
  "<IntelligentAgentStageModal",
  "onSave={saveStage}"
].forEach((token) => {
  assert.ok(rolePageSource.includes(token), `角色管理页缺少截图内容：${token}`);
});

[
  "编辑流程阶段",
  "新增流程阶段",
  "阶段标识",
  "阶段名称",
  "智能体",
  "展示名称",
  "排序",
  "阶段状态",
  "知识库检索",
  "本阶段启用",
  "配置知识库",
  "已选 ${selectedKnowledgeRows.length} 个知识资源",
  "未选择知识库文件",
  "agent-stage-knowledge-tags",
  "KnowledgeResourcePickerModal",
  "knowledgeResourceKeys",
  "getKnowledgeBaseKeysFromResources",
  ".agent-stage-knowledge-config"
].forEach((token) => {
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `角色流程阶段编辑弹窗缺少：${token}`);
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
assert.ok(sourceWithData.includes("选择该 Skill 可引用的知识库"), "资源管理 Tab 应说明知识库关联方向");
[
  "buildKnowledgeResourceRows",
  "getKnowledgeBaseKeysFromResources",
  "selectedKeys = []",
  "onSelectedChange",
  "checkable",
  "checkStrictly",
  "checkedKeys={{ checked: selectedKeys, halfChecked: [] }}",
  "已选 {selectedKeys.length}",
  "加入已选",
  "移出已选",
  "已选资源",
  "确认关联"
].forEach((token) => {
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `知识库选择弹窗应支持多选关联：${token}`);
});
assert.ok(!source.includes("selectedKey={knowledgePickerKey}"), "Skill 关联知识库不应再使用单选 selectedKey");
assert.ok(!source.includes("onSelect={setKnowledgePickerKey}"), "Skill 关联知识库不应再使用单选 onSelect");
[
  "agentKnowledgePickerOpen",
  "agentKnowledgePickerKeys",
  "saveAgentKnowledgeResources",
  "setAgentKnowledgePickerKeys(selectedKnowledgeResourceKeys)",
  "selectedKnowledgeResourceKeys",
  "个知识资源"
].forEach((token) => {
  assert.ok(agentEditorSource.includes(token), `智能体知识库配置应复用多选知识库弹窗：${token}`);
});
[
  "toolPickerOpen",
  "toolPickerKeys",
  "openSkillToolPicker",
  "toggleSkillToolSelection",
  "saveSkillTools",
  "renderSkillToolPickerModal",
  "选择工具",
  "搜索工具名称、类型或说明",
  "确认关联",
  "当前 Skill 暂未配置工具",
  "agent-relation-picker-modal",
  "agent-relation-resource-card",
  "适用场景",
  "输入摘要",
  "输出摘要"
].forEach((token) => {
  assert.ok(aiSkillTabsSource.includes(token), `Skill 关联工具应使用统一弹窗卡片选择交互：${token}`);
});
assert.ok(!aiSkillTabsSource.includes("options={toolOptions}"), "Skill 关联工具不应继续使用下拉多选工具 options");

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
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `技能逻辑编辑器格式识别缺少 ${token}`);
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
  "customer-profile-tab",
  "customer-basic-table",
  "customer-phone-input",
  "updateCustomerPhone",
  "customer-course-table",
  "sales-strategy-panel",
  "策略智能体输出结果",
  "用户洞察与销售建议",
  "strategyInsightDrafts",
  "strategyInsightEditing",
  "startEditStrategyInsight",
  "saveStrategyInsight",
  "sales-strategy-editor",
  "用户对话数据",
  "用户上课信息",
  "体验课共 4 节课",
  "用户发送",
  "用户接收",
  "待上课"
].forEach((token) => {
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `客户资料缺少新版资料结构：${token}`);
});
assert.ok(!sourceWithData.includes("个性化定时任务"), "会话中心客户资料销售策略tab已删除个性化定时任务");
[
  "个人标签",
  "销售自己手动打的标签",
  "customerTagValues.personal",
  "输入个人标签后回车"
].forEach((token) => {
  assert.ok(!customerStrategyTabSource.includes(token) && !conversationPageSource.slice(conversationPageSource.indexOf("customer-profile-tab"), conversationPageSource.indexOf('key: "course"', conversationPageSource.indexOf("customer-profile-tab"))).includes(token), `客户详情侧边栏不应展示个人标签：${token}`);
});
assert.ok(!styles.includes(".course-progress-item > span"), "上课情况进度圆点不应使用直接 span 选择器，避免影响 Ant Text 标签");

[
  "孩子问题画像",
  "家庭关系画像",
  "家长认知阶段",
  "购买意向",
  "产品兴趣",
  "跟进策略",
  "风险预警",
  "运营人群",
  "厌学",
  "休学",
  "手机成瘾",
  "亲子冲突高",
  "开始接受心理因素",
  "父母成长营意向",
  "适合邀约专家连麦",
  "孩子高危风险",
  "体验后未报名"
].forEach((token) => {
  assert.ok(sourceWithData.includes(token), `标签体系缺少青春同行业务标签：${token}`);
});

[
  "CommonTagPickerModal",
  "CommonTagSelectButton",
  "common-tag-picker-modal",
  "tagSelectionGroups",
  "tagPickerState",
  "openSessionTagPicker",
  "openTagPicker(\"audienceTags\")",
  "openTagPicker(\"excludeTags\")",
  "closable",
  "onTagRemove"
].forEach((token) => {
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `通用标签选择能力缺少：${token}`);
});

[
  "搜索客户、群或消息",
  "sessionFilters.lifecycle",
  "CommonTagSelectButton",
  "全部用户",
  "筛选托管",
  "筛选阶段",
  "已托管",
  "未托管"
].forEach((token) => {
  assert.ok(sessionFilterPanelSource.includes(token), `会话中心默认筛选区缺少字段：${token}`);
});
assert.ok(!sessionFilterPanelSource.includes("筛选排课"), "会话中心默认筛选区已下线筛选排课");
assert.ok(!sessionFilterPanelSource.includes("筛选上课"), "会话中心默认筛选区已下线筛选上课");
[
  "getScheduleStatus",
  "getAttendanceStatus"
].forEach((token) => {
  assert.ok(conversationPageSource.includes(token), `会话中心默认筛选区缺少筛选逻辑：${token}`);
});
assert.ok(
  sessionFilterPanelSource.indexOf("sessionFilters.hostingStatus") < sessionFilterPanelSource.indexOf("sessionFilters.lifecycle") &&
    sessionFilterPanelSource.indexOf("sessionFilters.lifecycle") < sessionFilterPanelSource.indexOf("CommonTagSelectButton"),
  "会话中心阶段筛选应位于托管状态和标签筛选之间"
);

[
  "客户类型",
  "用户等级",
  "看课时长",
  "亲子冲突",
  "意向等级",
  "当前阶段",
  "课程状态",
  "未读状态"
].forEach((token) => {
  assert.ok(!sessionFilterPanelSource.includes(token), `会话中心默认筛选区不应再展示旧字段：${token}`);
});

[
  "conversation-list-item",
  "conversation-list-recent",
  "manual-takeover-icon",
  "manualTakeover",
  "人工接管",
  "system-status-tag",
  "insights.relationStatus === \"已删除企微\"",
  "className=\"system-status-tag\">删</Tag>",
  "renderSelectedStageTimeline",
  "renderMainChatPanel",
  "chat-header-top",
  "chat-schedule-pill",
  "同步资料",
  "客户资料"
].forEach((token) => {
  assert.ok(sessionWorkspaceSource.includes(token), `会话中心新工作台缺少内容：${token}`);
});

[
  "customerServiceStages",
  "当前服务阶段",
  "getCustomerServiceStage",
  "getCourseStageAttendance",
  "formatStageDate",
  "formatStageDateTime",
  "getServiceStageTimeRange",
  "renderCourseStagePopoverContent",
  "流程阶段",
  "timeRange",
  "chat-stage-main",
  "chat-stage-time",
  "阶段进度",
  "阶段开始",
  "阶段结束",
  "课程开始",
  "课程结束",
  "到课时间",
  "上课老师",
  "已排课未上课",
  "未上课",
  "MinusCircleOutlined",
  "chat-stage-attendance-icon",
  "chat-stage-timeline",
  "chat-stage-segment",
  "chat-header-stage-row"
].forEach((token) => {
  assert.ok(conversationPageSource.includes(token) || styles.includes(token), `会话中心阶段进度缺少：${token}`);
});

[
  "<Text>意向</Text>",
  "<Text>当前阶段</Text>",
  "<Text>课程状态</Text>",
  "<Text>行为数据</Text>",
  "<Text>AI判断</Text>",
  "className=\"session-time\"",
  "看课${insights.watchMinutes}分钟",
  "暂无看课",
  "条未读",
  "openCustomerDetail(item, \"lifecycle\")}>阶段"
].forEach((token) => {
  assert.ok(!sessionWorkspaceSource.includes(token), `会话中心客户列表不应再展示旧字段：${token}`);
});

[
  ".session-chat-layout",
  ".conversation-list-item",
  ".chat-stage-timeline",
  ".chat-stage-segment.current",
  ".chat-schedule-pill",
  ".wecom-chat-panel",
  ".chat-header-actions"
].forEach((token) => {
  assert.ok(styles.includes(token), `会话中心应包含聊天工作台样式：${token}`);
});
assert.ok(!sessionWorkspaceSource.includes("chat-current-stage-pill"), "会话中心聊天头部不应重复展示当前阶段胶囊");
assert.ok(!styles.includes(".chat-current-stage-pill"), "会话中心聊天头部不应保留当前阶段胶囊样式");
[
  ".session-stage-timeline",
  ".session-stage-step"
].forEach((token) => {
  assert.ok(!styles.includes(token), `会话中心课程阶段已移入聊天头部，不应保留顶部横条样式：${token}`);
});

[
  "搜索客户、群或消息",
  "筛选托管",
  "筛选阶段",
  "选择客户标签",
  "客户资料"
].forEach((token) => {
  assert.ok(sessionWorkspaceSource.includes(token) || sessionFilterPanelSource.includes(token), `会话中心新结构缺少：${token}`);
});
[
  "全部托管状态",
  "全部阶段",
  "全部排课",
  "全部到课"
].forEach((token) => {
  assert.ok(!sessionFilterPanelSource.includes(token), `会话中心默认筛选项应统一显示全部用户，不应包含：${token}`);
});
[
  "<Text type=\"secondary\">客户搜索</Text>",
  "<Text type=\"secondary\">托管状态</Text>",
  "<Text type=\"secondary\">阶段筛选</Text>",
  "<Text type=\"secondary\">标签筛选</Text>"
].forEach((token) => {
  assert.ok(!sessionFilterPanelSource.includes(token), `会话中心默认筛选区不应展示筛选标题：${token}`);
});

assert.ok(!sessionWorkspaceSource.includes('key: "chat"'), "客户详情抽屉不应再包含聊天内容 Tab");

[
  "客户状态",
  "用户画像",
  "咨询产品",
  "学习问题",
  "自然拼读",
  "同步企微标签"
].forEach((token) => {
  assert.ok(!tagLibrarySource.includes(token), `标签库管理不应再使用旧标签体系：${token}`);
});

[
  "AI智能生成标签",
  "aiTagAgentOpen",
  "AI标签生成管理智能体",
  "AI生成标签库记录",
  "tagReviewModalOpen",
  "tagReviewDetailBatchKey",
  "openTagReviewDetail",
  "renderTagReviewDetailPage",
  "tagReviewDetailColumns",
  "selectedTagReviewChangeKeys",
  "batchReviewChangeDecision",
  "tagReviewBatchActions",
  "rowSelection",
  "activeTagReviewBatchKey",
  "aiTagReviewBatches",
  "reviewChangeDecision",
  "applyTagReviewChange",
  "AI生成批次",
  "待审核变更",
  "新增标签",
  "修改标签规则",
  "建议删除",
  "查看详情",
  "审核详情",
  "已选择",
  "批量驳回",
  "批量通过",
  "返回标签库",
  "批次摘要",
  "变更类型",
  "变更内容",
  "AI判断原因",
  "AI建议",
  "当前生效",
  "通过",
  "驳回",
  "tagGroupReason",
  "tagRuleDetail",
  "manualTagRules",
  "getTagMeta",
  "tagSourceIcon",
  "tagRuleEditedIcon",
  "tag-meta-line",
  "tagRuleDraft",
  "saveTagRuleDetail",
  "AI生成逻辑",
  "标签AI打标规则",
  "AI打标依据",
  "排除条件",
  "证据样例",
  "人工修改后优先于AI生成规则",
  "人工新增",
  "AI生成",
  "人工已改",
  "AI规则",
  "手动新增的标签默认进入人工来源",
  "点击标签查看AI打标规则",
  "openTagRuleDetail",
  "AI智能生成标签",
  "输入数据范围",
  "aiTagAgentDataSourceConfigs",
  "activeAiTagAgentDataSourceKey",
  "ai-tag-agent-data-source-list",
  "ai-tag-agent-data-source-row",
  "ai-tag-agent-prompt-list",
  "ai-tag-agent-prompt-row",
  "企业知识库",
  "智能体提示词",
  "用户沟通数据",
  "选择知识库文件",
  "选择智能体提示词",
  "用户沟通数据配置",
  "最近",
  "个月加的好友",
  "用户发出的对话条数超过",
  "上传导入用户对话数据文件",
  "适用部门角色",
  'roles: ["市场", "销售", "班主任"]',
  "生成标签组",
  "生成标签内容",
  "生成AI打标规则",
  "提示词配置",
  "AI标签库生成管理智能体",
  "生成标签提案",
  "至少需要≥10个独立用户稳定出现",
  "禁止生成明确医疗诊断标签",
  "人工标签、人工修改规则和人工审核结论永远优先于 AI 生成结果",
  "自杀",
  "自残"
].forEach((token) => {
  assert.ok(tagLibrarySource.includes(token), `标签库管理缺少 AI 智能标签配置：${token}`);
});
[
  "客户档案",
  "用户业务数据",
  "现有标签数据",
  "生成周期配置",
  "生成时间",
  "生成频率",
  'name="generateAt"',
  'name="generateFrequency"',
  "每周一次",
  "仅新增标签需审核",
  "高风险标签必须审核",
  "审核规则",
  'name="reviewMode"',
  "不需要人工审核",
  "优化已有标签",
  "识别重复标签"
].forEach((token) => {
  assert.ok(!aiTagAgentDrawerSource.includes(token), `AI标签生成管理配置不应保留旧项：${token}`);
});
[
  "输入：{item.input}",
  "输出：{item.output}",
  "{item.type}",
  "statusTag(item.status)"
].forEach((token) => {
  assert.ok(!aiTagAgentDrawerSource.includes(token), `选择智能体提示词弹窗不应展示冗余信息：${token}`);
});

assert.ok(!tagLibrarySource.includes('"新增标签组"'), "AI生成标签内容不应再包含新增标签组");
assert.ok(!tagLibrarySource.includes("编辑后通过"), "AI生成标签审核操作不应再包含编辑后通过");
assert.ok(!tagLibrarySource.includes("单标签AI自动打标"), "标签库管理不应控制到单个标签是否允许 AI 自动打标");
assert.ok(!tagLibrarySource.includes("getTagRuleDetail(tagRuleDetail).basis.map"), "标签规则弹窗不应再拆分展示 AI打标依据列表");
assert.ok(!tagLibrarySource.includes("getTagRuleDetail(tagRuleDetail).excludes.map"), "标签规则弹窗不应再拆分展示排除条件列表");
assert.ok(!tagLibrarySource.includes("getTagRuleDetail(tagRuleDetail).examples.map"), "标签规则弹窗不应再拆分展示证据样例列表");

[
  "标签库策略智能体",
  "基于业务服务情况，生成标签组、标签内容和AI打标判定规则",
  "AI生成建议",
  "ai-tag-suggestion-table"
].forEach((token) => {
  assert.ok(!tagLibrarySource.includes(token), `AI智能标签配置不应再展示：${token}`);
});

[
  "mass-audience-tags",
  "items.slice(0, 2)",
  "items.length > 2",
  "mass-estimate-count-cell",
  "scroll={{ x: 1180 }}",
  "width: 146",
  "audienceStatusFields",
  "audienceStatuses",
  "所处阶段",
  "全部阶段",
  "lifecycle",
  "全部托管状态",
  "getAudienceStatusSummary",
  "mass-audience-status-summary",
  "openTagPicker(\"audienceTags\")",
  "openTagPicker(\"excludeTags\")",
  "openTaskDrawer(\"view\", record)",
  "openTaskDrawer(\"edit\", record)",
  "查看群发任务",
  "编辑群发任务",
  "saveTask",
  "disabled={isViewMode}"
].forEach((token) => {
  assert.ok(massMessagePageSource.includes(token) || styles.includes(token), `用户群发表格缺少紧凑样式或展示规则：${token}`);
});
[
  "全部用户状态",
  "用户等级",
  "全部等级",
  "看课时长",
  "全部时长",
  "课程状态",
  "全部课程状态"
].forEach((token) => {
  assert.ok(!massMessagePageSource.includes(token), `用户群发选择客户筛选不应再包含：${token}`);
});
[
  'title={<PanelTitle title="用户群发"',
  'desc="人工创建群发任务，按标签和基础条件筛选客户，支持立即发送或定时发送。"'
].forEach((token) => {
  assert.ok(!massMessagePageSource.includes(token), `用户群发页不应再包含重复页面标题：${token}`);
});
[
  'label: "企微关系"',
  'name: "wecomRelation"',
  'title="基础信息"',
  'title="选择客户"',
  'title="群发内容"',
  'title="发送设置"',
  "mass-audience-section-title",
  "原型中编辑会复用创建表单"
].forEach((token) => {
  assert.ok(!massMessagePageSource.includes(token), `用户群发创建任务不应再包含占位标题或企微关系：${token}`);
});

[
  "Statistic title=\"知识库\"",
  "Statistic title=\"知识条目\"",
  "Statistic title=\"媒体类型\"",
  "Statistic title=\"绑定 Skill\""
].forEach((token) => {
  assert.ok(!source.includes(token), `知识库管理页不应展示顶部统计卡片：${token}`);
});

[
  'title={<PanelTitle title="标签库管理"',
  "维护受控标签体系，标签组可按部门角色使用"
].forEach((token) => {
  assert.ok(!tagLibrarySource.includes(token), `标签库管理页不应再包含重复页面标题：${token}`);
});
[
  "新增标签组",
  "AI智能生成标签",
  "AI生成标签库记录",
  "AI自动打标配置",
  "AI打标记录",
  "aiAutoTagConfigOpen",
  "aiAutoTagRecordOpen",
  "角色选择",
  "执行对象规则",
  "加好友第 X 天",
  "用户发出的会话信息条数超过 X 条",
  "满足任一条件即执行",
  "ai-auto-tag-trigger-grid",
  "ai-auto-tag-trigger-card",
  "满足以上条件自然日后",
  "后 1 天",
  "后 2 天",
  "后 3 天",
  "执行时间",
  "addAutoTagTriggerRule",
  "removeAutoTagTriggerRule",
  "数据来源授权",
  "自动打标仅作用于已开启",
  "自动打标逻辑说明",
  "aiAutoTagDataSourceConfigs",
  "activeAutoTagDataSourceKey",
  "autoTagConfigForm",
  "selectedAutoTagVariables",
  "toggleAutoTagVariable",
  "ai-auto-tag-data-source-list",
  "ai-auto-tag-data-source-row",
  "输入数据项配置",
  "数据来源",
  "可用字段",
  "变量字段",
  "变量标识",
  "默认取数",
  "已选择",
  "选择变量字段",
  "{{conversation.recent_messages}}",
  "{{profile.current_summary}}",
  "取数参数",
  "AI使用方式",
  "企微会话记录、AI托管消息记录",
  "要打标签用户的全部对话数据",
  "企业给到的客户档案数据",
  "AI生成标签提案",
  "候选标签库",
  "只在已选择的已有标签组下生成",
  "人工标签优先",
  "最小样本量",
  "语义相似度≥70%",
  "新增标签 / 修改标签规则 / 建议删除",
  "修改后通过",
  "审核通过后才允许写入正式标签库",
  "不得覆盖人工维护标签",
  "人工修改过的规则优先于AI生成规则",
  "判断依据必须来自用户沟通数据或客户档案",
  "输出结果必须包含：用户、角色、标签、变更类型、判断依据、置信度、触发规则和执行时间",
  "AI打标记录",
  "aiAutoTagRecordDetail",
  "aiAutoTagRecordDetailColumns",
  "openAiAutoTagRecordDetail",
  "查看用户标签",
  "打标对象",
  "操作类型",
  "打标原因",
  "新增",
  "删除",
  "修改",
  "tag-library-summary-text",
  "tag-filter-panel",
  "tag-filter-fields",
  "tag-filter-actions"
].forEach((token) => {
  assert.ok(tagLibrarySource.includes(token) || styles.includes(token), `标签库管理页应保留筛选和主操作：${token}`);
});
assert.ok(!tagLibrarySource.includes(">AI智能标签</Button>"), "标签库管理入口应改为 AI智能生成标签");
assert.ok(!tagLibrarySource.includes(">生成记录</Button>"), "标签库管理入口应改为 AI生成标签库记录");
assert.ok(!tagLibrarySource.includes('name="tagGroupScope"'), "AI自动打标配置不应重复配置允许自动打标的标签组");
assert.ok(!tagLibrarySource.includes("insertAutoTagVariable"), "变量配置不应继续使用插入变量逻辑");
assert.ok(!tagLibrarySource.includes("插入变量"), "变量配置操作应改为勾选变量字段");
assert.ok(!aiAutoTagRecordColumnsSource.includes("pendingReview"), "AI打标记录列表不应展示待审核内容");
assert.ok(!aiAutoTagRecordColumnsSource.includes('dataIndex: "status"'), "AI打标记录列表不应展示状态列");
[
  "执行用户范围",
  "执行频率",
  "审核方式",
  'name="reviewMode"',
  "课程行为",
  "订单状态",
  "已有标签",
  "用户业务数据",
  "最近7天有互动用户",
  "每天一次"
].forEach((token) => {
  assert.ok(!aiAutoTagDrawerSource.includes(token), `AI自动打标配置不应保留旧项：${token}`);
});
assert.ok(!aiAutoTagDrawerSource.includes("onClick={() => setActiveAutoTagDataSourceKey(item.key)}"), "AI自动打标数据来源授权不应再展示配置入口");
assert.ok(styles.includes(".ai-auto-tag-trigger-grid") && styles.includes("grid-template-columns: 1fr;"), "AI自动打标执行对象规则应上下排列");
[
  'title={<PanelTitle title="知识库管理"',
  "知识库列表以资源目录方式维护"
].forEach((token) => {
  assert.ok(!knowledgePageSource.includes(token), `知识库管理页不应再包含重复页面标题：${token}`);
});
[
  "resource-sidebar-head",
  "新建文件夹",
  "新增资源",
  "资源内容"
].forEach((token) => {
  assert.ok(knowledgePageSource.includes(token) || styles.includes(token), `知识库管理页应保留资源操作：${token}`);
});

[
  "Tooltip title={record.desc}",
  "overlayClassName=\"knowledge-base-tooltip\"",
  "width: 520",
  "knowledge-base-title",
].forEach((token) => {
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `知识库说明应只在标题 hover 时显示全文：${token}`);
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
  assert.ok(sourceWithData.includes(token), `智能体管理列表缺少 SOP 会话智能体示例：${token}`);
});

assert.ok(!strategyPageSource.includes(">工具配置</Button>"), "智能体管理列表不应再单独展示工具配置操作");

[
  'label: "模型配置"',
  'label: "逻辑与任务编排"',
  'label: "工具配置"',
  'label: "Skill配置"',
  'label: "知识库配置"',
  "relationPicker",
  "openRelationPicker",
  "renderRelationConfigTab",
  "renderRelationPickerModal",
  "当前版本暂未配置工具",
  "当前版本暂未配置 Skill",
  "当前版本暂未配置知识库",
  "添加工具",
  "添加 Skill",
  "添加知识库",
  "选择工具",
  "选择 Skill",
  "选择知识库",
  "适用场景",
  "输入摘要",
  "输出摘要",
  "已选择",
  "agent-relation-empty",
  "agent-relation-picker-modal",
  "agent-relation-card-list",
  "agent-relation-resource-card",
  'label: "预览调试"',
  'label="Provider"',
  'label="模型"',
  'label="Base URL"',
  "选择该智能体可关联的 Skill",
  "查看该智能体已关联的 Skill 默认能力定义，具体调用时机由智能体编排和提示词策略共同决定。",
  'title: "名称"',
  'title: "类型"',
  'title: "说明"',
  'title: "适用场景"',
  'title: "操作"',
  "agent-version-center",
  "agent-version-table",
  "selectedVersionKey",
  "selectedVersion",
  "versionRows",
  "版本中心",
  "当前已发布版本与草稿版本配置快照",
  "创建版本",
  "当前发布版本",
  "草稿版本",
  "历史版本",
  "设为发布版本",
  "选择版本后，下方配置内容会切换为该版本快照。",
  "agent-selected-version-detail",
  "版本详情",
  "currentVersionModelConfig",
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
  "目标人群",
  "任务描述",
  "新增任务",
  "新增策略任务",
  "编辑策略任务",
  "agent-task-drawer",
  "taskTagPicker",
  "targetAudienceMode",
  "全部用户",
  "标签选择",
  "选择任务目标人群",
  "从素材库选择",
  "远程地址",
  "结束事件",
  "endRefType",
  "endValue",
  "endUnit"
].forEach((token) => {
  assert.ok(agentEditorSource.includes(token), `智能体编辑调试页缺少：${token}`);
});
assert.ok(!agentEditorSource.includes("agent-task-modal"), "会话智能体定时任务编辑器应改为侧边栏 Drawer，不应继续使用 Modal");

assert.ok(!agentEditorSource.includes('placeholder="选择该智能体可调用的 AI 工具"'), "工具配置不应再使用多选下拉作为主选择交互");
assert.ok(!agentEditorSource.includes('placeholder="选择该智能体可关联的 Skill"'), "Skill配置不应再使用多选下拉作为主选择交互");

[
  "agent-config-overview",
  "agent-basic-summary",
  'label="智能体名称"',
  'label="工具 / Skill"'
].forEach((token) => {
  assert.ok(!agentEditorSource.includes(token), `智能体编辑调试页不应再展示旧基础信息区：${token}`);
});

[
  'title: "测试状态"',
  "runVersionDebug",
  "版本对比能力为原型占位",
  ">对比</Button>",
  ">试跑</Button>",
  "复制为新版本"
].forEach((token) => {
  assert.ok(!agentEditorSource.includes(token), `智能体版本列表不应再展示：${token}`);
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
  "生成个性化策略提示词",
  "当前仅保留“生成个性化策略提示词”任务",
  "在侧边栏中维护任务字段",
  "strategy-task-config-card",
  "strategyTaskTagPicker",
  "openStrategyTaskTagPicker",
  "CommonTagSelectButton",
  "CommonTagPickerModal",
  "strategy-task-editor-drawer",
  "strategy-task-editor-card",
  "提示词生成对象",
  "执行对象规则",
  "加好友第 X 天",
  "用户发出的会话信息条数超过 X 条",
  "满足以上条件自然日后",
  "执行时间",
  "数据来源授权",
  "strategyPromptDataSourceConfigs",
  "addStrategyPromptTriggerRule",
  "friendDayRules",
  "messageCountRules",
  "生成内容",
  "写入位置",
  "个性化提示词逻辑",
  "策略提示词",
  "系统提示词",
  "客户档案"
].forEach((token) => {
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `策略智能体配置缺少：${token}`);
});
[
  "周期性AI打标",
  "自动生成跟进任务",
  "生成定时任务"
].forEach((token) => {
  assert.ok(!agentEditorSource.includes(token), `策略智能体任务配置应只保留生成个性化策略提示词，不应包含：${token}`);
});
assert.ok(!agentEditorSource.includes("<Modal\n                          title={strategyTaskEditor"), "策略任务编辑器应改为侧边栏 Drawer，不应继续使用 Modal");
assert.ok(agentEditorSource.includes("<Drawer\n                          title={strategyTaskEditor"), "策略任务编辑器应使用侧边栏 Drawer");
assert.ok(styles.includes(".strategy-task-editor-card .ant-card-head"), "策略任务侧边栏模块标题应有压缩样式");
assert.ok(strategyPromptDataSourceSource.includes('key: "用户沟通数据"'), "策略任务数据来源应包含用户沟通数据");
assert.ok(strategyPromptDataSourceSource.includes('key: "客户档案"'), "策略任务数据来源应包含客户档案");
[
  'key: "流程阶段"',
  'key: "最近10轮会话"',
  'key: "用户标签"',
  'key: "销售策略"'
].forEach((token) => {
  assert.ok(!strategyPromptDataSourceSource.includes(token), `策略任务数据来源授权不应再包含：${token}`);
});
assert.ok(!agentEditorSource.includes('<Select mode="multiple" value={strategyTaskDraft.audienceTags}'), "策略任务适用标签人群应使用统一标签选择弹窗");
assert.ok(agentEditorSource.includes('strategyTaskDraft.scope !== "全部客户"'), "执行对象为全部客户时应隐藏适用标签人群");
assert.ok(!agentEditorSource.includes('const strategyScopeOptions = ["单个客户"'), "策略任务执行对象不应包含单个客户");
assert.ok(!agentEditorSource.includes('scope: "单个客户"'), "策略任务示例不应继续使用单个客户");
assert.ok(!agentEditorSource.includes("strategyReviewModeOptions"), "策略任务配置不应保留输出审核方式选项");
assert.ok(!agentEditorSource.includes('label="输出审核方式"'), "策略任务配置弹窗不应展示输出审核方式");
assert.ok(!agentEditorSource.includes('key: "daily-report"'), "策略智能体任务配置不应再包含日报任务");
assert.ok(!agentEditorSource.includes("客户销售策略日报"), "策略智能体任务配置不应再展示客户销售策略日报");
assert.ok(!agentEditorSource.includes("高意向客户晚间日报"), "策略任务配置弹窗不应再使用日报示例");
assert.ok(!agentEditorSource.includes('"销售策略总结"'), "策略任务类型不应再保留日报对应的销售策略总结");
[
  'label="固定执行时间"',
  'label="执行周期"',
  'label="输入数据范围"',
  'label="提示词生成数据范围"',
  'label="输出去向"',
  'label="任务逻辑描述"'
].forEach((token) => {
  assert.ok(!agentEditorSource.includes(token), `策略任务编辑器应使用个性化提示词配置文案，不应保留：${token}`);
});
[
  "打标理由",
  "会话智能体上下文",
  "定时任务",
  "人工提醒",
  "客户档案-销售策略",
  "客户档案-策略记录",
  "打标记录",
  "聊天计划",
  "人工工作台",
  "会话中心提醒"
].forEach((token) => {
  assert.ok(!agentEditorSource.includes(`"${token}"`), `策略任务输出结果/去向不应再包含旧选项：${token}`);
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
  "compact-card-toolbar",
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
  'title="Skill管理"',
  'desc="维护可复用 AI Skill 能力，供智能体按场景组合调用。"'
].forEach((token) => {
  assert.ok(!aiSkillPageSource.includes(token), `Skill 管理页不应再包含重复页面标题：${token}`);
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
  assert.ok(sourceWithData.includes(token), `Skill 管理示例数据缺少：${token}`);
});

[
  "resource-original-preview",
  "resource-readable-editor",
  "资源说明"
].forEach((token) => {
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `知识条目管理页布局缺少 ${token}`);
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
  assert.ok(sourceWithData.includes(token) || styles.includes(token), `预览调试布局缺少 ${token}`);
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

assert.ok(sourceWithData.includes("输入用户信息描述"), "预览调试左侧应保留用户信息描述输入框");
assert.ok(sourceWithData.includes("保存用户信息描述"), "用户信息描述输入框下方应提供保存按钮");

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
