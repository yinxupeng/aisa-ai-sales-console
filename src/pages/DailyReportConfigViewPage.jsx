import React from "react";
import { Card, Descriptions, Tag, Typography } from "antd";
import { TaskConfigHeader } from "../components/TaskConfigChrome";
import { aiSkills } from "../data/appData";
import { getNextAnalysisRun } from "../data/analysisSchedule";
import { defaultDailyReportConfig, dailyReportDataSources } from "./DailyReportConfigPage";

const { Text } = Typography;

export function DailyReportConfigSummary({ config }) {
  const current = { ...defaultDailyReportConfig, ...config };
  const items = [
    { key: "status", label: "任务状态", children: <Tag color={current.scheduleEnabled ? "blue" : "default"}>{current.scheduleEnabled ? "已启用" : "已停用"}</Tag> },
    { key: "schedule", label: "执行计划", children: `每天${current.dailyTimes.length}次 · ${current.dailyTimes.join("、")}（北京时间）` },
    { key: "next", label: "下次生成时间", children: getNextAnalysisRun(current) },
    { key: "role", label: "企微角色", children: !current.wecomRole || current.wecomRole === "all" ? "全部" : current.wecomRole },
    { key: "stage", label: "用户阶段", children: current.userStage },
    { key: "hosting", label: "托管状态", children: current.hostingStatus },
    { key: "history", label: "历史聊天数", children: current.historicalChatThreshold },
    { key: "today", label: "当天聊天数", children: current.todayChatThreshold },
    { key: "sources", label: "数据来源", children: dailyReportDataSources.join("、") },
    { key: "skill", label: "日报对话总结 Skill", children: aiSkills.find((skill) => skill.key === current.summarySkillKey)?.name || "未配置或已删除" },
    { key: "window", label: "统计周期", children: "上一次计划执行时间至本次计划执行时间" },
    { key: "rule", label: "统计口径", children: "仅分析周期内有客户回复的用户；当天聊天数按本周期客户消息统计，不含 AI 或销售单向发送。" }
  ];
  return <Card size="small" className="daily-report-readonly-card" title="已保存的日报配置"><Descriptions size="small" column={{ xs: 1, md: 2 }} items={items} /></Card>;
}

export default function DailyReportConfigViewPage({ config, onBack = () => {} }) {
  return <div className="daily-report-config-view-page">
    <TaskConfigHeader title="日报配置结果" backLabel="返回用户沟通日报" onBack={onBack} actions={<Tag color="blue">普通员工 · 只读</Tag>} />
    <Text type="secondary">查看管理员已保存的配置；如需调整，请联系管理员。</Text>
    <DailyReportConfigSummary config={config} />
  </div>;
}
