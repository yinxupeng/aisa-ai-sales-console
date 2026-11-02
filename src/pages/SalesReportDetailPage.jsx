import React from "react";
import { Button, Space, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SalesReportPreview from "../components/SalesReportPreview";

export default function SalesReportDetailPage({ report, onBack, onContinue }) {
  return <div className="sales-report-detail-page">
    <div className="sales-report-detail-header">
      <Space size={16}><Button icon={<ArrowLeftOutlined />} onClick={onBack}>返回报表列表</Button><Typography.Title level={4}>{report.name}</Typography.Title></Space>
      <Space><Tag>模拟数据</Tag><Button type="primary" onClick={() => onContinue(report)}>修改分析任务</Button></Space>
    </div>
    <div className="sales-report-detail-meta"><Typography.Text type="secondary">创建人：{report.creator}</Typography.Text><Typography.Text type="secondary">创建时间：{report.createdAt}</Typography.Text><Typography.Text type="secondary">最近计算：{report.result.generatedAt}</Typography.Text></div>
    <SalesReportPreview report={report.result} />
  </div>;
}
