import React from "react";
import { Card, Descriptions, Tag, Typography } from "antd";
import { TaskConfigHeader } from "./TaskConfigChrome";

export function GenerationScheduleStrip({ lastGeneratedAt, nextGeneratedAt }) {
  return <Card className="task-generation-strip" bordered={false}><div className="daily-report-result-meta"><span><Typography.Text type="secondary">最近生成时间：</Typography.Text><Typography.Text strong>{lastGeneratedAt || "—"}</Typography.Text></span><span><Typography.Text type="secondary">下次生成时间：</Typography.Text><Typography.Text strong>{nextGeneratedAt || "—"}</Typography.Text></span></div></Card>;
}

export function ReadOnlyConfigSections({ sections }) {
  return <div className="readonly-config-sections">{sections.map((section) => <Card size="small" className="daily-report-readonly-card" key={section.title} title={section.title}><Descriptions size="small" column={{ xs: 1, md: 2 }} items={section.items.map((item, index) => ({ key: String(index), label: item.label, children: item.value ?? "—" }))} />{section.content}</Card>)}</div>;
}

export default function TaskConfigReadOnly({ title, backLabel, onBack, children }) {
  return <div className="daily-report-config-view-page"><TaskConfigHeader title={title} backLabel={backLabel} onBack={onBack} actions={<Tag color="blue">普通员工 · 只读</Tag>} /><Typography.Text type="secondary">查看管理员已保存的配置；如需调整，请联系管理员。</Typography.Text>{children}</div>;
}
