import React from "react";
import { Card, Empty, Table, Typography } from "antd";
import IntentAnalysisPage from "../pages/IntentAnalysisPage";
import CohortConversionReport from "./CohortConversionReport";
import OrderQueryReport from "./OrderQueryReport";
const { Text, Paragraph } = Typography;
export default function SalesReportPreview({ report }) {
  if (!report) return <div className="sales-report-empty"><Empty description="通过对话生成报表，预览将在这里展示" /></div>;
  if (report.presentation === "orderQuery") return <OrderQueryReport report={report} />;
  if (report.presentation === "cohortConversion") return <CohortConversionReport report={report} />;
  if (report.presentation === "intentAnalysis") return <IntentAnalysisPage key={report.generatedAt} embedded reportSnapshot={report.intentSnapshot} />;
  const max = Math.max(1, ...report.chart.map((row) => row.value));
  return <div className="sales-report-preview">
    <div className="sales-report-metrics">{report.metrics.map(([name, value]) => <div key={name}><Text type="secondary">{name}</Text><strong>{value}</strong></div>)}</div>
    <Card size="small" title={report.definition.type === "intent" ? "用户意向分布" : report.definition.type === "conversion" ? "报名用户分布" : report.definition.type === "followup" ? "已发送任务分布" : "有效沟通用户分布"}>
      {report.chart.length ? <div className="sales-report-bars">{report.chart.map((row) => <div key={row.name}><span>{row.name}</span><div><i style={{ width: `${row.value / max * 100}%` }} /></div><strong>{row.value}</strong></div>)}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
    <Card size="small" title="分组数据"><Table size="small" rowKey="key" dataSource={report.groups} pagination={false} scroll={{ x: 520 }} columns={[
      { title: report.definition.group === "role" ? "企微角色" : "销售", dataIndex: "name" }, { title: "用户数", dataIndex: "users" }, { title: "有效沟通", dataIndex: "active" }, { title: "高意向", dataIndex: "high" }, { title: "报名", dataIndex: "enrolled" }, { title: "已跟进", dataIndex: "sent" }
    ]} /></Card>
    <Card size="small" title="用户明细"><Table size="small" rowKey="key" dataSource={report.rows} pagination={{ pageSize: 5, size: "small", showSizeChanger: false }} scroll={{ x: 650 }} columns={[
      { title: "用户", dataIndex: "name", width: 110 }, { title: "所属销售", dataIndex: "owner", width: 90 }, { title: "当前阶段", dataIndex: "stage", width: 100 }, { title: "聊天条数", dataIndex: "messages", width: 85 }, { title: "意向", dataIndex: "intent", render: (value) => `${value}档`, width: 60 }, { title: "关注内容", dataIndex: "concern", width: 210 }
    ]} /></Card>
    <Card size="small" title="分析与建议"><Paragraph>{report.conclusion}</Paragraph></Card>
    <details className="sales-report-method"><summary>数据来源与统计口径</summary><p>观心实验室儿童心理健康课程模拟样本，数据截止2026-10-28；最近30天为2026-09-29至2026-10-28。有效沟通：区间内用户有回复；聊天条数包含双方消息。高意向：4档或5档；报名转化率：有效沟通且已报名用户÷有效沟通用户；跟进样本每位用户对应一条任务。范围内总用户不受日期影响，其余指标按日期筛选。原型未连接真实模型或业务接口。</p></details>
    <Text type="secondary">最近计算：{report.generatedAt}</Text>
  </div>;
}
