import React from "react";
import { Card, Table, Typography } from "antd";
const summaryColumns = [
  { title: "销售", dataIndex: "owner", width: 80 }, { title: "体验课人次", dataIndex: "participants", width: 110 },
  { title: "报名人数", dataIndex: "enrolled", width: 100 }, { title: "转化率", dataIndex: "rate", width: 95, render: (value) => `${value.toFixed(1)}%` }
];
export default function CohortConversionReport({ report, inChat = false }) {
  return <div className={inChat ? "cohort-conversion-chat-result" : "sales-report-preview cohort-conversion-page"}>
    {!inChat ? <><Typography.Title level={4}>{report.title}</Typography.Title><Typography.Text type="secondary">统计区间：{report.period} · 模拟数据</Typography.Text><div className="sales-report-metrics">{report.metrics.map(([label, value]) => <div key={label}><Typography.Text type="secondary">{label}</Typography.Text><strong>{value}</strong></div>)}</div></> : null}
    <Card size="small" title="各销售汇总"><Table size="small" rowKey="key" columns={summaryColumns} dataSource={report.groups} pagination={false} scroll={{ x: 390 }} /></Card>
    {!inChat ? <Card size="small" title="各销售转化率"><div className="sales-report-bars">{report.groups.map((group) => <div key={group.key}><span>{group.owner}</span><div><i style={{ width: `${group.rate}%` }} /></div><strong>{group.rate}%</strong></div>)}</div></Card> : null}
    <Card size="small" title="每天 / 每期次明细"><Table size="small" rowKey="key" columns={[{ title: "日期", dataIndex: "date", width: 110 }, { title: "期次", dataIndex: "cohort", width: 160 }, ...summaryColumns]} dataSource={report.rows} scroll={{ x: 660 }} pagination={{ pageSize: inChat ? 5 : 10, showSizeChanger: false, size: "small", showTotal: (total) => `共${total}条` }} /></Card>
    <Typography.Paragraph type="secondary" className="cohort-conversion-method">转化率＝该销售该期次报名人数÷体验课人数；期次内用户去重，跨期次按人次累计。汇总使用总报名人数÷总体验课人次。数据为观心实验室儿童心理健康课程模拟样本，截止2026-10-29。</Typography.Paragraph>
    {!inChat ? <Card size="small" title="分析说明"><Typography.Paragraph>{report.conclusion}</Typography.Paragraph></Card> : null}
  </div>;
}
