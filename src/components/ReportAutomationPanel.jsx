import React, { useState } from "react";
import { Button, Card, Empty, Modal, Space, Switch, Table, Tabs, Tag, Typography } from "antd";
import { describeReportSchedule, nextReportRun } from "../data/reportSchedules";
import SalesReportPreview from "./SalesReportPreview";

export default function ReportAutomationPanel({ children, workspace, tab, onTabChange, onConfigure, onSimulate, onToggle }) {
  const [record, setRecord] = useState(null);
  const tasks = workspace.reports.filter((report) => report.schedule);
  return <><Tabs activeKey={tab} onChange={onTabChange} items={[
    { key: "reports", label: "报表列表", children },
    { key: "tasks", label: `定时任务（${tasks.length}）`, children: <Card>
      <Typography.Paragraph type="secondary">配置好报表后按节奏生成，支持暂停和恢复。此处为原型演示，自动调度尚未接入；“模拟执行”可查看结果保存过程。</Typography.Paragraph>
      <Table rowKey="id" dataSource={tasks} size="middle" scroll={{ x: 1180 }} pagination={{ pageSize: 8, showSizeChanger: false }} locale={{ emptyText: <Empty description="暂无定时任务，请在报表列表点击“定时生成”" /> }} columns={[
        { title: "报表名称", dataIndex: "name", width: 200 },
        { title: "执行节奏（北京时间）", render: (_, item) => describeReportSchedule(item.schedule), width: 230 },
        { title: "分析范围", render: (_, item) => item.result.range, width: 240 },
        { title: "任务状态", width: 110, render: (_, item) => <Switch checked={item.schedule.enabled} checkedChildren="开启" unCheckedChildren="暂停" onChange={(enabled) => onToggle(item.id, enabled)} /> },
        { title: "下次生成时间", width: 165, render: (_, item) => nextReportRun(item.schedule) || (item.schedule.enabled ? "配置无效" : "已暂停") },
        { title: "最近生成", width: 170, render: (_, item) => <Space direction="vertical" size={2}><span>{item.lastRunAt || "尚未执行"}</span>{item.lastRunStatus ? <Tag color={item.lastRunStatus === "成功" ? "success" : "error"}>{item.lastRunStatus}</Tag> : null}</Space> },
        { title: "操作", width: 180, fixed: "right", render: (_, item) => <Space size={0}><Button type="link" onClick={() => onConfigure(item)}>配置</Button><Button type="link" disabled={!item.schedule.enabled} onClick={() => onSimulate(item)}>模拟执行</Button></Space> }
      ]} />
    </Card> },
    { key: "records", label: "生成记录", children: <Card><Typography.Paragraph type="secondary">每次生成独立保留结果，查看历史记录不会被后续报表更新覆盖。模拟数据截止2026-10-28。</Typography.Paragraph><Table rowKey="id" dataSource={workspace.records || []} size="middle" scroll={{ x: 950 }} pagination={{ pageSize: 10, showSizeChanger: false }} columns={[
      { title: "报表名称", dataIndex: "reportName", width: 220 }, { title: "执行时间", dataIndex: "executedAt", width: 165 }, { title: "触发方式", dataIndex: "trigger", width: 110 },
      { title: "生成状态", dataIndex: "status", width: 100, render: (status) => <Tag color={status === "成功" ? "success" : "error"}>{status}</Tag> },
      { title: "分析人数", dataIndex: "users", width: 90 }, { title: "失败原因", dataIndex: "reason", render: (reason) => reason || "—" },
      { title: "操作", width: 100, render: (_, item) => <Button type="link" disabled={!item.result} onClick={() => setRecord(item)}>查看结果</Button> }
    ]} /></Card> }
  ]} /><Modal title={record ? `${record.reportName} · ${record.executedAt}` : "生成结果"} open={Boolean(record)} onCancel={() => setRecord(null)} width={1080} styles={{ body: { maxHeight: "72vh", overflow: "auto" } }} footer={<Button onClick={() => setRecord(null)}>关闭</Button>}><SalesReportPreview report={record?.result} /></Modal></>;
}
