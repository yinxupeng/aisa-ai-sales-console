import { build } from "esbuild";
import { join } from "path";
import { rmSync } from "fs";

const tmpBundle = join(process.cwd(), ".runtime-test-bundle.mjs");
const runnerCode = `
import React from 'react';
import { Form } from 'antd';
import { renderToString } from 'react-dom/server';
import assert from 'node:assert/strict';

import DashboardPage from './src/pages/DashboardPage.jsx';
import ConversationsPage from './src/pages/ConversationsPage.jsx';
import CustomerCourseStudyTable from './src/components/CustomerCourseStudyTable.jsx';
import SalesPage from './src/pages/SalesPage.jsx';
import WecomChannelPage, { JuziAccountForm } from './src/pages/WecomChannelPage.jsx';
import { defaultJuziAccounts } from './src/data/juziChannelAccounts.js';
import HumanCollaborationPage from './src/pages/HumanCollaborationPage.jsx';
import AutoScheduledTasksPage from './src/pages/AutoScheduledTasksPage.jsx';
import AutoScheduledTaskConfigPage from './src/pages/AutoScheduledTaskConfigPage.jsx';
import { createAutoFollowupDemo } from './src/data/autoFollowupData.js';
import { createAutoTask, executeAutoTask, openAutoStatuses } from './src/domain/autoFollowup.js';
import WecomAccountPage from './src/pages/WecomAccountPage.jsx';
import IntelligentAgentPage, { RoleReplyConfigFields } from './src/pages/IntelligentAgentPage.jsx';
import StrategyPage from './src/pages/StrategyPage.jsx';
import StrategyEditor from './src/pages/StrategyEditor.jsx';
import AISkillPage from './src/pages/AISkillPage.jsx';
import ToolsPage from './src/pages/ToolsPage.jsx';
import KnowledgePage from './src/pages/KnowledgePage.jsx';
import HumanizationPage from './src/pages/HumanizationPage.jsx';
import TagLibraryPage from './src/pages/TagLibraryPage.jsx';
import DataDictionaryPage from './src/pages/DataDictionaryPage.jsx';
import StrategyInsightPage from './src/pages/StrategyInsightPage.jsx';
import MassMessagePage from './src/pages/MassMessagePage.jsx';
import SettingsPage from './src/pages/SettingsPage.jsx';
import TokenCostDashboardPage from './src/pages/TokenCostDashboardPage.jsx';
import PromptStudioPage from './src/pages/PromptStudioPage.jsx';
import SalesReportingPage from './src/pages/SalesReportingPage.jsx';
import SalesReportDetailPage from './src/pages/SalesReportDetailPage.jsx';
import CohortConversionReport from './src/components/CohortConversionReport.jsx';
import OrderQueryReport from './src/components/OrderQueryReport.jsx';
import { orderQueryDefinition } from './src/data/orderQueryReport.js';
import { cohortConversionDefinition } from './src/data/cohortConversionReport.js';
import SalesReportPreview from './src/components/SalesReportPreview.jsx';
import SalesAssistantProgress from './src/components/SalesAssistantProgress.jsx';
import ReportScheduleFields from './src/components/ReportScheduleFields.jsx';
import ReportAutomationPanel from './src/components/ReportAutomationPanel.jsx';
import { defaultReportSchedule } from './src/data/reportSchedules.js';
import { computeSalesReport, defaultReportDefinition, reportAccounts } from './src/data/salesReports.js';
import CustomersPage from './src/pages/CustomersPage.jsx';
import CompanyPage from './src/pages/CompanyPage.jsx';
import WecomPage from './src/pages/WecomPage.jsx';
import SuggestionsPage from './src/pages/SuggestionsPage.jsx';
import IntentAnalysisPage from './src/pages/IntentAnalysisPage.jsx';
import IntentAnalysisConfigPage, { defaultIntentConfig, getIntentNextRun } from './src/pages/IntentAnalysisConfigPage.jsx';
import IntentConfigComparisonPage from './src/pages/IntentConfigComparisonPage.jsx';
import IntentChatConfigPage from './src/pages/IntentChatConfigPage.jsx';
import { createIntentChatState, intentChatStorageKey } from './src/data/intentChatConfig.js';
import DailyReportPage from './src/pages/DailyReportPage.jsx';
import DailyReportConfigViewPage, { DailyReportConfigSummary } from './src/pages/DailyReportConfigViewPage.jsx';
import DailyReportConfigPage, { defaultDailyReportConfig } from './src/pages/DailyReportConfigPage.jsx';
import UserInsightConfigPage, { defaultConfig as defaultUserInsightConfig } from './src/pages/UserInsightConfigPage.jsx';
import UserInsightPage, { UserInsightGenerationRecordsPage, InsightGenerationRecordDetail } from './src/pages/UserInsightPage.jsx';
import { IntentConfigViewPage, UserInsightConfigViewPage, AutoScheduledConfigViewPage } from './src/pages/CollaborationConfigViewPage.jsx';
import { userInsightGenerationRecords } from './src/data/userInsightData.js';
import AnalysisGenerationRecordsPage from './src/pages/AnalysisGenerationRecordsPage.jsx';
import { intentGenerationRecords, dailyReportGenerationRecords } from './src/data/analysisGenerationRecords.js';
import { strategies } from './src/data/appData.js';
import { defaultIntentRules, legacyIntentRules, removeIntentTier } from './src/data/intentRules.js';
import WecomRoleSelect from './src/components/WecomRoleSelect.jsx';

globalThis.window = { location: { search: '' }, matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }) };

const pages = [
  ['Sales19aCourseStudy', React.createElement(CustomerCourseStudyTable, { customer: { key: 'c1' }, order: { key: 'demo-a', type: '体验课', status: '已支付' }, role: '销售A类' })],
  ['Sales19bCourseStudy', React.createElement(CustomerCourseStudyTable, { customer: { key: 'c2' }, order: { key: 'demo-b', type: '体验课', status: '已支付' }, role: '销售B类' })],
  ['TeacherCourseStudy', React.createElement(CustomerCourseStudyTable, { customer: { key: 'c3' }, order: { key: 'demo-family', type: '正价课', status: '已支付' }, role: '班主任' })],
  ['OrderQueryReport', React.createElement(OrderQueryReport, { report: computeSalesReport(orderQueryDefinition, ['wecom-li']) })],
  ['CohortConversionChatResult', React.createElement(CohortConversionReport, { report: computeSalesReport(cohortConversionDefinition, ['wecom-li']), inChat: true })],
  ['CohortConversionPage', React.createElement(CohortConversionReport, { report: computeSalesReport(cohortConversionDefinition, ['wecom-li']) })],
  ['SalesReportDetailPage', React.createElement(SalesReportDetailPage, { report: { name: '家长沟通周报', creator: '平台管理员', createdAt: '2026-10-29 09:00', result: computeSalesReport(defaultReportDefinition, ['wecom-li']) }, onBack: () => {}, onContinue: () => {} })],
  ['SalesAssistantUnderstanding', React.createElement(SalesAssistantProgress, { stage: 0, text: '' })],
  ['SalesAssistantStreaming', React.createElement(SalesAssistantProgress, { stage: 2, text: '已整理家长沟通分析' })],
  ['ReportScheduleFields', React.createElement(ReportScheduleFields, { value: defaultReportSchedule(), onChange: () => {} })],
  ['ReportScheduledTasks', React.createElement(ReportAutomationPanel, { workspace: { reports: [{ id: 'demo', name: '家长沟通周报', schedule: defaultReportSchedule(), result: { range: '最近7天' } }], records: [] }, tab: 'tasks', onTabChange: () => {}, onConfigure: () => {}, onSimulate: () => {}, onToggle: () => {} })],
  ['ReportGenerationRecords', React.createElement(ReportAutomationPanel, { workspace: { reports: [], records: [] }, tab: 'records', onTabChange: () => {} })],
  ['SalesAssistant', React.createElement(SalesReportingPage, { visibleWecomKeys: ['wecom-li'] })],
  ['DataReports', React.createElement(SalesReportingPage, { mode: 'reports', visibleWecomKeys: ['wecom-li'] })],
  ['SalesReportPreview', React.createElement(SalesReportPreview, { report: computeSalesReport(defaultReportDefinition, reportAccounts.map((item) => item.key)) })],
  ['DashboardPage', React.createElement(DashboardPage, { setRoute: () => {}, conversationsData: [] })],
  ['CustomersPage', React.createElement(CustomersPage, { onViewConversation: () => {}, visibleWecomKeys: [] })],
  ['CompanyPage', React.createElement(CompanyPage, { platform: true })],
  ['IntelligentAgentPage', React.createElement(IntelligentAgentPage)],
  ['StrategyPage', React.createElement(StrategyPage)],
  ['StrategyEditor', React.createElement(StrategyEditor, { skill: strategies[0], onBack: () => {} })],
  ['AISkillPage', React.createElement(AISkillPage)],
  ['ToolsPage', React.createElement(ToolsPage)],
  ['KnowledgePage', React.createElement(KnowledgePage)],
  ['TagLibraryPage', React.createElement(TagLibraryPage, { onViewConversation: () => {} })],
  ['DataDictionaryPage', React.createElement(DataDictionaryPage)],
  ['StrategyInsightPage', React.createElement(StrategyInsightPage, { onViewConversation: () => {} })],
  ['MassMessagePage', React.createElement(MassMessagePage)],
  ['WecomPage', React.createElement(WecomPage)],
  ['SalesPage', React.createElement(SalesPage)],
  ['WecomChannelPage', React.createElement(WecomChannelPage)],
  ['JuziAccountForm', React.createElement(JuziAccountForm, { accounts: defaultJuziAccounts, onFinish: () => {} })],
  ['WecomAccountPage', React.createElement(WecomAccountPage)],
  ['AutoScheduledTasksPage', React.createElement(AutoScheduledTasksPage)],
  ['AutoScheduledTasksRecordsPage', React.createElement(AutoScheduledTasksPage, { initialView: 'records' })],
  ['AutoScheduledTaskConfigPage', React.createElement(AutoScheduledTaskConfigPage)],
  ['AutoScheduledTaskConfigInFlow', React.createElement(AutoScheduledTasksPage, { initialView: 'config' })],
  ['HumanizationPage', React.createElement(HumanizationPage)],
  ['ConversationsPage', React.createElement(ConversationsPage, { activeWecom: 'wecom-li', activeConversationKey: 'c1', autoOpenCustomerDrawerToken: 0, visibleWecomKeys: ['wecom-li'], onActiveWecomChange: () => {} })],
  ['ConversationsPageTeacher', React.createElement(ConversationsPage, { activeWecom: 'wecom-chen', activeConversationKey: 'c3', autoOpenCustomerDrawerToken: 0, visibleWecomKeys: ['wecom-chen'], onActiveWecomChange: () => {} })],
  ['ConversationsPageListMode', React.createElement(ConversationsPage, { activeWecom: 'wecom-li', activeConversationKey: 'c1', autoOpenCustomerDrawerToken: 0, visibleWecomKeys: ['wecom-li'], conversationViewMode: 'list', onActiveWecomChange: () => {} })],
  ['SuggestionsPage', React.createElement(SuggestionsPage)],
  ['IntentAnalysisPage', React.createElement(IntentAnalysisPage, { onViewConversation: () => {} })],
  ['IntentAnalysisConfigPage', React.createElement(IntentAnalysisConfigPage, { initialConfig: defaultIntentConfig, onSave: () => {}, onBack: () => {} })],
  ['IntentConfigComparisonPage', React.createElement(IntentConfigComparisonPage, { initialConfig: defaultIntentConfig, onSave: () => {}, onBack: () => {} })],
  ['IntentChatConfigPage', React.createElement(IntentChatConfigPage)],
  ['DailyReportPage', React.createElement(DailyReportPage)],
  ['DailyReportConfigPage', React.createElement(DailyReportConfigPage)],
  ['DailyReportConfigViewPage', React.createElement(DailyReportConfigViewPage, { config: defaultDailyReportConfig })],
  ['IntentConfigViewPage', React.createElement(IntentConfigViewPage, { config: defaultIntentConfig })],
  ['UserInsightConfigViewPage', React.createElement(UserInsightConfigViewPage, { config: defaultUserInsightConfig })],
  ['AutoScheduledConfigViewPage', React.createElement(AutoScheduledConfigViewPage, { config: createAutoFollowupDemo().config })],
  ['AutoScheduledConfigViewInFlow', React.createElement(AutoScheduledTasksPage, { initialView: 'config-view' })],
  ['UserInsightConfigPage', React.createElement(UserInsightConfigPage)],
  ['IntentGenerationRecordsPage', React.createElement(AnalysisGenerationRecordsPage, { type: 'intent', records: intentGenerationRecords })],
  ['DailyGenerationRecordsPage', React.createElement(AnalysisGenerationRecordsPage, { type: 'daily', records: dailyReportGenerationRecords })],
  ['EmptyGenerationRecordsPage', React.createElement(AnalysisGenerationRecordsPage, { type: 'intent', records: [] })],
  ['SettingsPage', React.createElement(SettingsPage, { platform: true })],
  ['TokenCostDashboardPage', React.createElement(TokenCostDashboardPage)],
  ['PromptStudioPage', React.createElement(PromptStudioPage)]
];

for (const [name, el] of pages) {
  try {
    renderToString(el);
  } catch (err) {
    console.error('FAIL: ' + name, err);
    process.exit(1);
  }
}

for (const [type, records, pageTitle] of [['intent', intentGenerationRecords, '意向度分析记录'], ['daily', dailyReportGenerationRecords, '沟通日报生成记录']]) {
  const recordsHtml = renderToString(React.createElement(AnalysisGenerationRecordsPage, { type, records }));
  assert.ok(recordsHtml.includes(pageTitle) && recordsHtml.includes('历史执行记录'), '生成记录必须有独立页面标题');
  assert.ok(recordsHtml.includes(records[0].executedAt), '记录页面必须展示最近批次');
  assert.ok(!recordsHtml.includes('当天聊天用户') && !recordsHtml.includes('用户意向度列表'), '记录页不混入结果主列表');
  const emptyHtml = renderToString(React.createElement(AnalysisGenerationRecordsPage, { type, records: [] }));
  assert.ok(emptyHtml.includes('暂无执行记录'), '记录页必须处理空列表');
}

assert.ok(renderToString(React.createElement(HumanCollaborationPage)).includes('自动定时任务'), '人机协作须新增自动定时任务tab');
const agentEditorHtml = renderToString(React.createElement(StrategyEditor, { skill: strategies[0], onBack: () => {} }));
const initialSalesAssistantHtml = renderToString(React.createElement(SalesReportingPage, { visibleWecomKeys: ['wecom-li'] }));
assert.ok(initialSalesAssistantHtml.includes('昨日销售订单查询 · 10月29日') && initialSalesAssistantHtml.includes('is-report-empty') && initialSalesAssistantHtml.includes('106,500.00') && !initialSalesAssistantHtml.includes('sales-assistant-report-scroll'), '销售助理默认展示昨日订单查询模拟结果，未请求生成页面时不展示右侧报表');
assert.ok(initialSalesAssistantHtml.includes('更多操作：用户意向度分析'), '历史分析展示记录操作入口');
assert.ok(!agentEditorHtml.includes('工具配置'), '智能体详情移除工具配置页签');
assert.ok(agentEditorHtml.includes('agent-version-table') && agentEditorHtml.includes('版本中心'), '智能体详情直接展示版本列表');
assert.ok(!agentEditorHtml.includes('agent-version-toolbar') && !agentEditorHtml.includes('agent-selected-version-detail'), '移除抽屉入口和重复版本详情栏');
for (const tab of ['模型配置', '逻辑与任务编排', 'Skill配置', '知识库配置', '预览调试']) assert.ok(agentEditorHtml.includes(tab), '其他智能体配置页签保持不变：' + tab);
const autoHtml = renderToString(React.createElement(AutoScheduledTasksPage));
for (const label of ['任务配置', '查看记录', '待发送任务数', '待人工确认任务数', '今日已发送任务数', '今日因冲突取消任务数', '拟发送内容', '冲突情况']) assert.ok(autoHtml.includes(label), '自动任务主页面缺少功能：' + label);
assert.ok(!autoHtml.includes('生成流程演示') && !autoHtml.includes('模拟AI分析') && !autoHtml.includes('重置演示'), '主页面移除生成流程演示模块');
assert.ok(!autoHtml.includes('新增任务'), '自动任务页不提供人工新增任务入口');
const autoRecordsHtml = renderToString(React.createElement(AutoScheduledTasksPage, { initialView: 'records' }));
for (const label of ['自动定时任务记录', '返回自动定时任务', '实际发送内容', '实际发送时间', '执行结果 / 原因']) assert.ok(autoRecordsHtml.includes(label), '自动任务记录页缺少字段：' + label);
assert.ok(!autoRecordsHtml.includes('生成流程演示') && !autoRecordsHtml.includes('AI自动跟进任务'), '独立历史页不混入待处理任务和生成操作');
const autoConfigHtml = renderToString(React.createElement(AutoScheduledTaskConfigPage));
assert.ok(autoConfigHtml.includes('aria-label="托管状态"') && autoConfigHtml.includes('不限'), '自动任务支持托管状态配置，默认不限');
const unhostedConfigHtml = renderToString(React.createElement(AutoScheduledTaskConfigPage, { initialConfig: { ...createAutoFollowupDemo().config, hostingStatus: '未托管' } }));
assert.ok(unhostedConfigHtml.includes('未托管'), '保存后再次编辑应回显托管状态');
for (const label of ['启用自动跟进', '所属企微账号', '用户阶段', '用户沉默时长', '冲突保护间隔', '人工确认后发送']) assert.ok(autoConfigHtml.includes(label), '自动任务配置缺少字段：' + label);
assert.ok(autoConfigHtml.includes('选择生成的skill') && autoConfigHtml.includes('跟进判断与话术规划 Skill'), 'Skill配置恢复并放入独立模块');
assert.ok(!autoConfigHtml.includes('允许发送时间') && !autoConfigHtml.includes('发送开始时间') && !autoConfigHtml.includes('发送结束时间'), '自动任务移除允许发送时间控件');
assert.ok(autoConfigHtml.includes('跟进策略') && autoConfigHtml.includes('执行保护'), '自动任务配置按用户范围和跟进策略整理');
for (const [Component, defaults, title, label] of [[DailyReportConfigPage, defaultDailyReportConfig, '沟通日报配置', '启用定时分析'], [UserInsightConfigPage, defaultUserInsightConfig, '洞察生成配置', '启用定时分析']]) {
  assert.equal(defaults.scheduleEnabled, false, title + '默认关闭定时任务');
  for (const enabled of [true, false]) {
    const html = renderToString(React.createElement(Component, { initialConfig: { ...defaults, scheduleEnabled: enabled } }));
    assert.ok(html.includes('intent-config-toolbar') && html.includes(title), title + '统一返回按钮和紧凑标题');
    assert.ok(!html.includes('user-insight-config-header'), title + '不保留重复的大标题区');
    assert.ok(html.includes(label) && html.includes('aria-checked="' + enabled + '"'), title + '开关正确回显');
    assert.ok(html.includes('保存配置') && html.includes('选择分析的skill'), title + '保留原配置功能');
    assert.ok(!html.includes('AI 对话配置'), title + '不扩大为双方案改造');
  }
}
assert.ok(autoConfigHtml.includes('intent-config-toolbar') && !autoConfigHtml.includes('user-insight-config-header'), '自动定时任务统一紧凑标题');
const demo = createAutoFollowupDemo('2026-10-23T11:00:00+08:00');
assert.equal(demo.tasks.filter((item) => openAutoStatuses.includes(item.status)).length, 5);
const newTaskResult = createAutoTask(demo, 'auto-user-6', demo.now);
assert.equal(newTaskResult.created, true, '默认演示用户应能生成任务');
const generatedTask = newTaskResult.state.tasks.at(-1);
const executedDemo = executeAutoTask(newTaskResult.state, generatedTask.id, generatedTask.plannedAt);
assert.equal(executedDemo.tasks.at(-1).status, 'sent');
assert.equal(createAutoTask(executedDemo, 'auto-user-6', generatedTask.plannedAt).created, false, '演示数据也遵守未回复不重复跟进');
const channelHtml = renderToString(React.createElement(WecomChannelPage));
const wecomAccountsHtml = renderToString(React.createElement(WecomAccountPage));
assert.ok(wecomAccountsHtml.includes('可托管账号数') && wecomAccountsHtml.includes('企业统一到期时间'), '账号额度和到期日以企业为单位展示');
assert.ok(!wecomAccountsHtml.includes('AI到期时间') && !wecomAccountsHtml.includes('aiSeatOpenedAt'), '账号列表不再提供独立到期时间');
assert.ok(wecomAccountsHtml.includes('批量分配席位') && wecomAccountsHtml.includes('批量释放席位'), '保留多账号分配操作，不创建授权批次');
assert.ok(wecomAccountsHtml.includes('AI托管') && !wecomAccountsHtml.includes('AI 运行'), '企微账号管理列名应为AI托管');
assert.ok(wecomAccountsHtml.includes('全部开启') && wecomAccountsHtml.includes('全部关闭'), 'AI托管开关须展示全部开启和全部关闭');
assert.ok(wecomAccountsHtml.includes('需人工介入数据'), '企微账号列表须展示需人工介入数据');
assert.ok(wecomAccountsHtml.indexOf('需人工介入数据') > wecomAccountsHtml.indexOf('托管客户数') && wecomAccountsHtml.indexOf('需人工介入数据') < wecomAccountsHtml.indexOf('在线状态'), '需人工介入数据列应位于托管客户数之后');
assert.ok(channelHtml.includes('配置账号') && channelHtml.includes('配置标识') && channelHtml.includes('Base URL'), '句子通道配置须以账号列表和配置账号入口展示');
assert.ok(!channelHtml.includes('句子互动 App Secret') && !channelHtml.includes('回调校验 Token'), '旧通道参数表单须移除');
for (const field of ['App Key', '激活状态', '最近同步', '操作', '取消激活', '编辑', '删除']) assert.ok(channelHtml.includes(field), '账号列表缺少字段或操作：' + field);
for (const account of defaultJuziAccounts) assert.ok(!channelHtml.includes(account.appKey), '列表不得泄露完整App Key');
const accountFormHtml = renderToString(React.createElement(JuziAccountForm, { accounts: defaultJuziAccounts, onFinish: () => {} }));
for (const field of ['配置标识', 'Base URL', '句子互动 App Key']) assert.ok(accountFormHtml.includes(field), '账号表单缺少字段：' + field);
assert.ok(accountFormHtml.includes('type="password"'), 'App Key表单须使用密码框');

const dailyReportHtml = renderToString(React.createElement(DailyReportPage));
for (const [Component, adminLabel] of [[IntentAnalysisPage, '分析配置（管理员）'], [UserInsightPage, '洞察生成配置（管理员）'], [AutoScheduledTasksPage, '任务配置（管理员）']]) {
  const html = renderToString(React.createElement(Component));
  for (const label of [adminLabel, '查看配置（普通员工）', '最近生成时间', '下次生成时间']) assert.ok(html.includes(label), '配置查看交互须统一：' + label);
}
for (const [Component, config, requiredFields] of [[IntentConfigViewPage, defaultIntentConfig, ['意向分档规则', '意向度分析', '跟进策略与行动']], [UserInsightConfigViewPage, defaultUserInsightConfig, ['聊天总结', '用户洞察', '数据来源']], [AutoScheduledConfigViewPage, createAutoFollowupDemo().config, ['用户沉默时长', '冲突保护间隔', '发送方式', '跟进判断与话术规划']]]) {
  const html = renderToString(React.createElement(Component, { config: { ...config, wecomRole: '销售B类' } }));
  for (const field of ['普通员工 · 只读', '企微角色', '销售B类', ...requiredFields]) assert.ok(html.includes(field), '只读配置须完整展示：' + field);
  assert.ok(!html.includes('<input') && !html.includes('<textarea') && !html.includes('role="switch"') && !html.includes('保存配置'), '员工配置页不得有编辑、保存或开关操作');
}
const autoMainHtml = renderToString(React.createElement(AutoScheduledTasksPage));
assert.ok(autoMainHtml.includes('按用户沟通条件触发'), '自动跟进非固定周期任务，不编造下次生成时间');
const privateChatDraft = createIntentChatState();
privateChatDraft.draft.prompt = '不应向员工展示的未发布草稿';
privateChatDraft.messages.push({ role: 'user', content: '不应泄露的管理员对话' });
globalThis.localStorage = { getItem: (key) => key === intentChatStorageKey ? JSON.stringify(privateChatDraft) : null };
const privateViewHtml = renderToString(React.createElement(IntentConfigViewPage, { config: defaultIntentConfig }));
assert.ok(!privateViewHtml.includes('不应向员工展示的未发布草稿') && !privateViewHtml.includes('不应泄露的管理员对话'), '员工只读页不泄露方案二草稿或管理员对话');
delete globalThis.localStorage;
for (const field of ['最近生成时间', '下次生成时间', '日报配置（管理员）', '查看配置（普通员工）']) assert.ok(dailyReportHtml.includes(field), '日报主页面缺少：' + field);
assert.ok(!dailyReportHtml.includes('<details') && !dailyReportHtml.includes('当前配置'), '主页面不再展示完整配置摘要');
const readonlyDailyConfigHtml = renderToString(React.createElement(DailyReportConfigViewPage, { config: defaultDailyReportConfig }));
for (const field of ['普通员工 · 只读', '任务状态', '执行计划', '企微角色', '用户阶段', '托管状态', '历史聊天数', '当天聊天数', '数据来源', '日报对话总结 Skill']) assert.ok(readonlyDailyConfigHtml.includes(field), '只读配置页缺少：' + field);
assert.ok(!readonlyDailyConfigHtml.includes('<input') && !readonlyDailyConfigHtml.includes('role="switch"') && !readonlyDailyConfigHtml.includes('保存配置'), '普通员工配置页不提供编辑、开关和保存操作');
const customDailyConfigHtml = renderToString(React.createElement(DailyReportConfigSummary, { config: { ...defaultDailyReportConfig, scheduleEnabled: true, dailyTimes: ['09:00', '18:00'], wecomRole: '销售B类', userStage: '第二节课', hostingStatus: '已托管', historicalChatThreshold: '大于5条', todayChatThreshold: '大于2条' } }));
for (const value of ['已启用', '每天2次', '09:00、18:00', '销售B类', '第二节课', '已托管', '大于5条', '大于2条', '用户画像总结']) assert.ok(customDailyConfigHtml.includes(value), '日报概览应展示已保存配置值：' + value);
assert.ok(dailyReportHtml.includes('查看记录'), '沟通日报须提供独立记录页入口');
const dailyTableStart = dailyReportHtml.indexOf('<table', dailyReportHtml.indexOf('daily-report-table-card'));
const dailyReportTable = dailyReportHtml.slice(dailyTableStart, dailyReportHtml.indexOf('</table>', dailyTableStart));
assert.ok(dailyReportTable.includes('当前阶段') && !dailyReportTable.includes('当前课程'), '沟通日报列表以当前阶段作为列名');
assert.ok(!dailyReportTable.includes('儿童心理健康医疗课程'), '沟通日报阶段列不再显示课程介绍');

const fourRules = removeIntentTier(defaultIntentRules, 2);
const threeRules = removeIntentTier(fourRules, 2);
for (const rules of [threeRules, fourRules, defaultIntentRules, legacyIntentRules]) {
  const config = { ...defaultIntentConfig, rules };
  globalThis.localStorage = { getItem: () => JSON.stringify({ config, batch: { config, runAt: '2026-10-20 09:00' } }) };
  const html = renderToString(React.createElement(IntentAnalysisPage));
  assert.ok(html.includes('查看记录'), '意向度分析须提供独立记录页入口');
  assert.ok(!html.includes('立即更新') && !html.includes('导出分析'), '意向度分析移除立即更新与导出分析按钮');
  const intentTable = html.slice(html.indexOf('<table'), html.indexOf('</table>'));
  assert.ok(intentTable.includes('当前阶段') && !intentTable.includes('当前课程'), '意向度列表以当前阶段作为列名');
  assert.ok(!intentTable.includes('儿童心理健康医疗课程'), '意向度阶段列不再显示课程介绍');
  assert.equal((html.match(/intent-level-card-heading/g) || []).length, rules.length, '结果卡片数量需跟随批次规则');
  assert.ok(html.includes('42'), '读取已有批次时不能丢失演示用户');
  const editableRules = rules.length === 6 ? defaultIntentRules : rules;
  const configHtml = renderToString(React.createElement(IntentAnalysisConfigPage, { initialConfig: { ...config, rules: editableRules } }));
  assert.ok(configHtml.includes('新增档位') && configHtml.includes('删除此档位'), '配置页须保留增删入口');
  assert.equal((configHtml.match(/删除此档位/g) || []).length, editableRules.length, '每个档位标题栏均须显示删除入口，折叠时也可操作');
  assert.ok(!configHtml.includes('当前规则：'), '档位标题不再展示当前规则摘要');
  assert.ok(configHtml.includes('全部满足（且）'), '配置页必须明确条件全部满足');
  for (const removedControl of ['条件组之间的关系', '添加条件组', '删除条件组', '满足任一（或）']) {
    assert.ok(!configHtml.includes(removedControl), '配置页不应再显示：' + removedControl);
  }
  if (rules.length === 6) assert.ok(html.includes('新规则待生效'), '旧规则迁移不能立即篡改历史结果');
}
for (const enabled of [true, false]) {
  const roleConfigHtml = renderToString(React.createElement(Form, { initialValues: { analysisConversationRounds: 100, replyQualityEnabled: enabled, replyQualitySkillKey: 'aiskill-5', quietHoursEnabled: enabled, quietHoursStart: '00:00', quietHoursEnd: '06:00' } }, React.createElement(RoleReplyConfigFields)));
  assert.ok(roleConfigHtml.includes('基于对话轮数') && roleConfigHtml.includes('value="100"'), '角色配置须展示默认对话轮数');
  assert.ok(roleConfigHtml.includes('回复内容质检'), '角色配置须提供质检开关');
  assert.equal(roleConfigHtml.includes('回复内容质检 Skill'), enabled, '仅开启质检时展示Skill选择');
  if (enabled) assert.ok(roleConfigHtml.includes('回复合规检查'), '已选择的质检Skill须正确回显');
  assert.ok(roleConfigHtml.includes('免打扰时段'), '编辑角色须提供免打扰开关');
  assert.equal(roleConfigHtml.includes('免打扰开始时间'), enabled, '仅开启免打扰时展示时段选择');
  if (enabled) assert.ok(roleConfigHtml.includes('value="00:00"') && roleConfigHtml.includes('value="06:00"') && roleConfigHtml.includes('不发送消息'), '已保存的免打扰时段须正确回显');
}
const overnightRoleHtml = renderToString(React.createElement(Form, { initialValues: { quietHoursEnabled: true, quietHoursStart: '22:00', quietHoursEnd: '06:00' } }, React.createElement(RoleReplyConfigFields)));
assert.ok(overnightRoleHtml.includes('次日'), '跨午夜时须明确展示次日');
const comparisonHtml = renderToString(React.createElement(IntentConfigComparisonPage, { initialConfig: defaultIntentConfig }));
for (const [Component, defaults] of [[IntentAnalysisConfigPage, defaultIntentConfig], [DailyReportConfigPage, defaultDailyReportConfig], [UserInsightConfigPage, defaultUserInsightConfig], [AutoScheduledTaskConfigPage, createAutoFollowupDemo('2026-10-27T11:00:00+08:00').config]]) {
  const html = renderToString(React.createElement(Component, { initialConfig: { ...defaults, wecomRole: '销售A类' } }));
  assert.ok(html.includes('aria-label="企微角色"') && html.includes('销售A类'), '用户范围配置须支持企微角色及保存回显');
}
const allRolesHtml = renderToString(React.createElement(WecomRoleSelect));
assert.ok(allRolesHtml.includes('全部'), '企微角色默认全部');
assert.equal(defaultIntentConfig.scheduleEnabled, false, '定时分析默认关闭');
assert.equal(getIntentNextRun(defaultIntentConfig), '—', '停用时不显示下次执行时间');
assert.notEqual(getIntentNextRun({ ...defaultIntentConfig, scheduleEnabled: true }), '—', '开启后显示下次执行时间');
assert.ok(comparisonHtml.includes('方案一定时分析'), '方案一配置提供任务开关');
const enabledFormHtml = renderToString(React.createElement(IntentAnalysisConfigPage, { initialConfig: { ...defaultIntentConfig, scheduleEnabled: true } }));
assert.ok(enabledFormHtml.includes('aria-checked="true"'), '保存后的方案一开关应回显开启');
assert.ok(comparisonHtml.includes('方案一：表单配置') && comparisonHtml.includes('方案二：AI 对话配置'), '两套方案须有独立切换入口');
assert.ok(comparisonHtml.includes('意向分档规则'), '默认仍展示原有表单配置');
assert.ok(comparisonHtml.includes('aria-label="切换配置方案"'), '方案切换应使用紧凑且可访问的分段控件');
assert.ok(!comparisonHtml.includes('配置执行时间、分析用户范围、意向分档规则和分析 Skill。'), '配置页移除重复描述，压缩顶部层级');
assert.equal((comparisonHtml.match(/intent-config-toolbar"/g) || []).length, 1, '配置页仅显示一个统一工具栏');
assert.ok(comparisonHtml.includes('保存配置') && comparisonHtml.includes('返回意向度分析'), '精简后保留保存及返回入口');
const chatConfigHtml = renderToString(React.createElement(IntentChatConfigPage));
assert.ok(chatConfigHtml.includes('aria-label="企微角色"'), 'AI对话配置也支持角色范围');
assert.ok(chatConfigHtml.includes('方案二模拟定时分析'), '方案二配置提供独立模拟开关');
for (const field of ['选择执行节奏', '分析用户范围', '意向分层配置助手', '完整分档提示词', '保存草稿', '模拟小样本试跑', '分档标准', '输出要求']) assert.ok(chatConfigHtml.includes(field), '方案二缺少：' + field);
assert.ok(!chatConfigHtml.includes('intent-chat-actions'), '方案二移除左侧底部操作卡片');
assert.ok(!chatConfigHtml.includes('方案二分档数量') && !chatConfigHtml.includes('intent-chat-tier'), '分档方案整合为单个提示词编辑器');
const sourceControlsHtml = chatConfigHtml.slice(chatConfigHtml.indexOf('aria-label="方案二数据来源"'), chatConfigHtml.indexOf('完整分档提示词'));
assert.ok(sourceControlsHtml.includes('平台数据') && sourceControlsHtml.includes('业务数据'), '数据来源须独立展示为上方配置项');
assert.equal((sourceControlsHtml.match(/checked=""/g) || []).length, 2, '两种来源默认选中');
assert.ok(!chatConfigHtml.includes('独立演示环境：'), '方案二移除顶部蓝色提示条');
assert.ok(!chatConfigHtml.includes('添加条件'), '方案二不混入原方案的条件编辑器');
const savedChatState = createIntentChatState();
savedChatState.draft.prompt = '已保存的独立对比方案要求';
globalThis.localStorage = { getItem: (key) => key === intentChatStorageKey ? JSON.stringify(savedChatState) : null };
assert.ok(renderToString(React.createElement(IntentChatConfigPage)).includes('已保存的独立对比方案要求'), '方案二须从独立存储恢复草稿');
const oldChatState = createIntentChatState();
delete oldChatState.draft.prompt;
oldChatState.draft.requirements = '原草稿的分析限制必须保留';
oldChatState.draft.tiers = [{ level: 3, name: '明确预约', criteria: '家长主动预约服务沟通' }];
globalThis.localStorage = { getItem: (key) => key === intentChatStorageKey ? JSON.stringify(oldChatState) : null };
const migratedChatHtml = renderToString(React.createElement(IntentChatConfigPage));
assert.ok(migratedChatHtml.includes('原草稿的分析限制必须保留') && migratedChatHtml.includes('家长主动预约服务沟通'), '旧版草稿合并为完整提示词且不丢失自定义内容');
delete globalThis.localStorage;
const insightRecordsHtml = renderToString(React.createElement(UserInsightGenerationRecordsPage));
assert.ok(insightRecordsHtml.includes('洞察失败人数'), '洞察记录列表须展示失败人数');
for (const record of userInsightGenerationRecords) {
  const detailHtml = renderToString(React.createElement(InsightGenerationRecordDetail, { record }));
  assert.ok(detailHtml.includes('洞察失败人数') && detailHtml.includes('失败原因'), '详情须展示失败人数及原因');
  for (const reason of record.failureReasons) assert.ok(detailHtml.includes(reason.reason), '详情应展示本批次失败原因');
  if (!record.failedInsightUsers) assert.ok(detailHtml.includes('暂无失败记录'), '零失败批次须展示明确空态');
  for (const removed of ['本次生成摘要', '重点洞察', '本次结果中的用户']) assert.ok(!detailHtml.includes(removed), '详情移除冗余区域：' + removed);
}
const promptRules = JSON.parse(JSON.stringify(defaultIntentRules));
promptRules[4].mode = 'prompt';
promptRules[4].prompt = '家长主动咨询儿童心理支持服务费用，并希望预约沟通。';
const promptConfig = { ...defaultIntentConfig, rules: promptRules };
const promptConfigHtml = renderToString(React.createElement(IntentAnalysisConfigPage, { initialConfig: promptConfig }));
assert.ok(promptConfigHtml.includes('5档配置方式') && promptConfigHtml.includes('条件配置') && promptConfigHtml.includes('提示词配置'), '每档可选择配置方式');
assert.ok(promptConfigHtml.includes('5档分档提示词') && promptConfigHtml.includes(promptRules[4].prompt), '重新打开配置应显示已保存提示词');
assert.ok(!promptConfigHtml.includes('判断字段'), '展开的提示词档位不展示未启用的条件控件');
globalThis.localStorage = { getItem: () => JSON.stringify({ config: promptConfig, batch: { config: promptConfig, runAt: '2026-10-23 09:00' } }) };
assert.ok(renderToString(React.createElement(IntentAnalysisPage)).includes('待 AI 判断'), '提示词批次不得伪造AI结果或标记为未匹配');
delete globalThis.localStorage;
console.log(\`ALL \${pages.length} PAGE CASES RENDERED CLEANLY (0 WHITE SCREEN / 0 REFERENCE ERROR)\`);
console.log('INTENT 3/4/5 TIERS AND LEGACY BATCH RENDERED CLEANLY');
`;

await build({
  stdin: {
    contents: runnerCode,
    resolveDir: process.cwd(),
    loader: 'jsx',
  },
  bundle: true,
  external: ['node:assert/strict'],
  format: 'esm',
  target: 'es2020',
  outfile: tmpBundle,
  loader: { '.js': 'jsx' }
});

try {
  await import(tmpBundle);
} finally {
  try { rmSync(tmpBundle); } catch {}
}

process.exit(0);
