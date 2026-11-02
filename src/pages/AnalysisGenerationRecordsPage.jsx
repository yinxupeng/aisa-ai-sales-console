import React, { useState } from "react";
import { Button, Card, Descriptions, Drawer, Empty, Space, Table, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function AnalysisGenerationRecordsPage({ type, records = [], onBack = () => {} }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const isIntent = type === "intent";
  const title = isIntent ? "意向度分析记录" : "沟通日报生成记录";
  const parentTitle = isIntent ? "用户意向度分析" : "用户沟通日报";
  const expectedLabel = isIntent ? "应分析用户数" : "应生成日报用户数";
  const successLabel = isIntent ? "成功分析用户数" : "成功生成日报用户数";
  const statusColor = (status) => status === "已完成" ? "success" : status === "部分完成" ? "warning" : "error";
  return (
    <div className="user-insight-page user-insight-generation-records-page">
      <div className="user-insight-header">
        <div>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>返回{parentTitle}</Button>
          <Title level={3}>{title}</Title>
          <Paragraph type="secondary">查看历史执行情况，点击记录查看当次分析口径和生成摘要。以下为原型演示记录。</Paragraph>
        </div>
      </div>
      <Card className="user-insight-generation-card" variant="borderless" title={<Space><span>历史执行记录</span><Text type="secondary">共 {records.length} 次</Text></Space>}>
        <Table
          rowKey="id"
          className="user-insight-generation-table"
          dataSource={records.slice().sort((a, b) => b.executedAt.localeCompare(a.executedAt))}
          columns={[
            { title: "执行时间", dataIndex: "executedAt", width: 170, render: (value) => <Text strong>{value}</Text> },
            { title: "执行周期", dataIndex: "scheduleLabel", width: 130 },
            { title: "分析范围", dataIndex: "scope", width: 260 },
            { title: expectedLabel, dataIndex: "expectedUsers", width: 150, render: (value) => <Tag color="blue">{value} 人</Tag> },
            { title: successLabel, dataIndex: "successfulUsers", width: 160, render: (value) => <Text>{value} 人</Text> },
            { title: "未完成用户数", dataIndex: "incompleteUsers", width: 130, render: (value) => <Text type={value ? "warning" : "secondary"}>{value} 人</Text> },
            { title: "执行状态", dataIndex: "status", width: 110, render: (value) => <Tag color={statusColor(value)}>{value}</Tag> }
          ]}
          pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (total) => `共 ${total} 条` }}
          scroll={{ x: 1110 }}
          locale={{ emptyText: <Empty description="暂无执行记录" /> }}
          onRow={(record) => ({
            onClick: () => setSelectedRecord(record),
            onKeyDown: (event) => { if (event.key === "Enter") setSelectedRecord(record); },
            tabIndex: 0,
            "aria-label": `查看${record.executedAt}的执行记录`,
            style: { cursor: "pointer" }
          })}
        />
      </Card>
      <Drawer title={selectedRecord ? `${title} · ${selectedRecord.executedAt}` : title} open={Boolean(selectedRecord)} onClose={() => setSelectedRecord(null)} size={560}>
        {selectedRecord ? <Space orientation="vertical" size={18} className="user-insight-generation-detail">
          <Descriptions column={1} size="small" bordered items={[
            { key: "time", label: "执行时间", children: selectedRecord.executedAt },
            { key: "schedule", label: "执行周期", children: selectedRecord.scheduleLabel },
            { key: "scope", label: "分析范围", children: selectedRecord.scope },
            { key: "expected", label: expectedLabel, children: `${selectedRecord.expectedUsers} 人` },
            { key: "successful", label: successLabel, children: `${selectedRecord.successfulUsers} 人` },
            { key: "incomplete", label: "未完成用户数", children: `${selectedRecord.incompleteUsers} 人` },
            { key: "status", label: "执行状态", children: <Tag color={statusColor(selectedRecord.status)}>{selectedRecord.status}</Tag> },
            { key: "duration", label: "执行耗时", children: selectedRecord.duration },
            ...selectedRecord.details.map((item, index) => ({ key: `detail-${index}`, label: item.label, children: item.value }))
          ]} />
          <Card size="small" title="本次生成摘要"><Paragraph>{selectedRecord.summary}</Paragraph></Card>
        </Space> : null}
      </Drawer>
    </div>
  );
}
