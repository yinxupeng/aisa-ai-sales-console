import React from "react";
import { FileTextOutlined, RightOutlined } from "@ant-design/icons";

export default function SalesReportArtifactLink({ artifact, onOpen }) {
  if (!artifact) return null;
  return <button type="button" className="sales-report-artifact-link" onClick={() => onOpen(artifact)} aria-label={`打开报表：${artifact.title}`}>
    <span className="sales-report-artifact-icon"><FileTextOutlined /></span>
    <span className="sales-report-artifact-info"><strong>{artifact.title}</strong><small>已生成报表 · 点击在右侧查看</small></span>
    <RightOutlined />
  </button>;
}
