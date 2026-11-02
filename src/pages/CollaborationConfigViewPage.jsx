import React, { useState } from "react";
import { Empty, Tabs, Typography } from "antd";
import TaskConfigReadOnly, { ReadOnlyConfigSections } from "../components/TaskConfigReadOnly";
import { aiSkills, managedWecomAccounts } from "../data/appData";
import { getNextAnalysisRun } from "../data/analysisSchedule";
import { describeIntentRule } from "../data/intentRules";
import { intentChatStorageKey, migrateIntentChatDraft, validateIntentChatDraft } from "../data/intentChatConfig";

const roleLabel = (value) => !value || value === "all" ? "全部" : value;
const skillLabel = (key) => {
  const skill = aiSkills.find((item) => item.key === key);
  return skill ? `${skill.name}${skill.status === "启用" ? "" : "（已停用）"}` : "未配置或已删除";
};
const scheduleFields = (config) => [
  { label: "任务状态", value: config.scheduleEnabled ? "已启用" : "已停用" },
  { label: "执行计划", value: `每天${config.dailyTimes.length}次 · ${config.dailyTimes.join("、")}（北京时间）` },
  { label: "下次生成时间", value: getNextAnalysisRun(config) }
];
const scopeFields = (config, stages) => [
  { label: "企微角色", value: roleLabel(config.wecomRole) },
  { label: "用户阶段", value: stages },
  { label: "托管状态", value: config.hostingStatus || "不限" },
  { label: "历史聊天数", value: config.historicalChatThreshold || "不限" },
  { label: "当天聊天数", value: config.todayChatThreshold || "不限" }
];

function readPublishedIntentChat() {
  try {
    const saved = JSON.parse(localStorage.getItem(intentChatStorageKey));
    const config = migrateIntentChatDraft(saved?.active?.config);
    if (!config || validateIntentChatDraft(config)) return null;
    // 员工只查看确认启用过的快照，不读取草稿和对话记录。
    return { config, taskEnabled: saved.taskEnabled === true, version: saved.active.version };
  } catch { return null; }
}

export function IntentConfigViewPage({ config, onBack }) {
  const [publishedChat] = useState(readPublishedIntentChat);
  const sections = [
    { title: "执行与用户范围", items: [...scheduleFields(config), ...scopeFields(config, config.userStages.join("、")), { label: "规则版本", value: `v${config.ruleVersion}` }, { label: "数据来源", value: "用户档案、历史聊天记录、课程到课记录" }] },
    { title: "意向分档规则", items: config.rules.slice().sort((a, b) => b.level - a.level).map((rule) => ({ label: `${rule.level}档 · ${rule.label}`, value: describeIntentRule(rule) })) },
    { title: "分析 Skill", items: [{ label: "意向度分析", value: skillLabel(config.analysisSkillKey) }, { label: "跟进策略与行动", value: skillLabel(config.followUpSkillKey) }] }
  ];
  const chatSections = publishedChat ? [{ title: "方案二 · 已确认配置", items: [
    ...scheduleFields({ ...publishedChat.config, scheduleEnabled: publishedChat.taskEnabled }),
    ...scopeFields(publishedChat.config, publishedChat.config.stages.join("、")),
    { label: "方案版本", value: `v${publishedChat.version}` },
    { label: "数据来源", value: publishedChat.config.dataSources.map((source) => source === "platform" ? "平台数据" : "业务数据").join("、") }
  ], content: <><Typography.Text strong>完整分档提示词</Typography.Text><pre className="readonly-config-prompt">{publishedChat.config.prompt}</pre></> }] : null;
  return <TaskConfigReadOnly title="意向度配置结果" backLabel="返回意向度分析" onBack={onBack}><Tabs items={[
    { key: "form", label: "方案一：表单配置", children: <ReadOnlyConfigSections sections={sections} /> },
    { key: "chat", label: "方案二：AI 对话配置", children: chatSections ? <ReadOnlyConfigSections sections={chatSections} /> : <Empty description="方案二暂无已确认配置，未发布草稿不对员工展示" /> }
  ]} /></TaskConfigReadOnly>;
}

export function UserInsightConfigViewPage({ config, onBack }) {
  return <TaskConfigReadOnly title="洞察配置结果" backLabel="返回用户洞察与建议" onBack={onBack}><ReadOnlyConfigSections sections={[
    { title: "执行与用户范围", items: [...scheduleFields(config), ...scopeFields(config, config.userStage), { label: "数据来源", value: (config.dataSources || ["用户档案", "历史聊天记录"]).join("、") }] },
    { title: "分析 Skill", items: [{ label: "聊天总结", value: skillLabel(config.summarySkillKey) }, { label: "用户洞察", value: skillLabel(config.insightSkillKey) }] }
  ]} /></TaskConfigReadOnly>;
}

export function AutoScheduledConfigViewPage({ config, onBack }) {
  const labels = (keys, options) => keys.includes("all") ? "全部" : keys.map((key) => options.find((item) => item.key === key)?.label || `账号不可用（${key}）`).join("、");
  return <TaskConfigReadOnly title="自动定时任务配置结果" backLabel="返回自动定时任务" onBack={onBack}><ReadOnlyConfigSections sections={[
    { title: "用户范围", items: [{ label: "任务状态", value: config.enabled ? "已启用" : "已停用" }, { label: "生成方式", value: "按用户沟通条件触发，非固定周期执行" }, { label: "企微角色", value: roleLabel(config.wecomRole) }, { label: "所属企微账号", value: labels(config.accountKeys, managedWecomAccounts) }, { label: "用户阶段", value: config.stages.includes("all") ? "全部阶段" : config.stages.join("、") }, { label: "托管状态", value: config.hostingStatus || "不限" }] },
    { title: "跟进策略", items: [{ label: "用户沉默时长", value: `${config.silenceMinutes}分钟` }, { label: "冲突保护间隔", value: `${config.protectionMinutes}分钟` }, { label: "发送方式", value: config.sendMode === "auto" ? "自动发送" : "人工确认后发送" }] },
    { title: "选择生成的skill", items: [{ label: "跟进判断与话术规划", value: skillLabel(config.skillKey) }] },
    { title: "执行保护", items: [{ label: "单次跟进", value: "每位用户最多一条待处理AI跟进；发送后未回复，不再追加。" }, { label: "发送前复核", value: "检查托管、人工接管、拒绝联系、风险及冲突；人工确认不绕过检查。" }] }
  ]} /></TaskConfigReadOnly>;
}
