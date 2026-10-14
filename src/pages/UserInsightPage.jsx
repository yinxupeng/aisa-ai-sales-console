import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography
} from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  SearchOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  userInsightSchedule,
  userInsightGenerationRecords,
  userInsightSummary,
  userInsightUsers
} from "../data/userInsightData";
import UserInsightConfigPage from "./UserInsightConfigPage";
import { defaultConfig } from "./UserInsightConfigPage";
import { SettingOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const insightStageOptions = ["开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];

function InsightSegments({ user }) {
  return (
    <div className="user-insight-segments">
      <div><Text strong>用户背景：</Text>{user.background}</div>
      <div><Text strong>用户洞察：</Text>{user.insight}</div>
      <div><Text strong>关键风险：</Text>{user.risk}</div>
      <div><Text strong>销售建议：</Text>{user.advice}</div>
    </div>
  );
}

function UserInsightGenerationRecordsPage({ onBack = () => {} }) {
  const [selectedGenerationRecord, setSelectedGenerationRecord] = useState(null);
  return (
    <div className="user-insight-page user-insight-generation-records-page">
      <div className="user-insight-header">
        <div>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>返回用户洞察与建议</Button>
          <Title level={3}>洞察生成记录</Title>
          <Paragraph type="secondary">查看每次执行生成的用户洞察结果与当时使用的分析口径。</Paragraph>
        </div>
      </div>
      <Card className="user-insight-generation-card" bordered={false} title={<Space><span>历史执行记录</span><Text type="secondary">共 {userInsightGenerationRecords.length} 次</Text></Space>}>
        <Table
          rowKey="id"
          className="user-insight-generation-table"
          columns={[
            { title: "执行时间", dataIndex: "executedAt", width: 170, render: (value) => <Text strong>{value}</Text> },
            { title: "执行周期", dataIndex: "scheduleLabel", width: 130 },
            { title: "分析范围", dataIndex: "scope", width: 190 },
            { title: "应该洞察用户数", dataIndex: "shouldInsightUsers", width: 140, render: (value) => <Tag color="blue">{value} 人</Tag> },
            { title: "成功生成洞察数", dataIndex: "successfulInsightUsers", width: 140, render: (value) => <Text>{value} 人</Text> },
            { title: "执行状态", dataIndex: "status", width: 100, render: (value) => <Tag color="success">{value}</Tag> }
          ]}
          dataSource={userInsightGenerationRecords}
          pagination={false}
          onRow={(record) => ({ onClick: () => setSelectedGenerationRecord(record), style: { cursor: "pointer" } })}
          scroll={{ x: 980 }}
        />
      </Card>
      <Drawer
        className="user-insight-generation-drawer"
        title={selectedGenerationRecord ? `洞察生成记录 · ${selectedGenerationRecord.executedAt}` : "洞察生成记录"}
        open={Boolean(selectedGenerationRecord)}
        width={560}
        onClose={() => setSelectedGenerationRecord(null)}
      >
        {selectedGenerationRecord ? <Space orientation="vertical" size={18} className="user-insight-generation-detail">
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="执行时间">{selectedGenerationRecord.executedAt}</Descriptions.Item>
            <Descriptions.Item label="执行周期">{selectedGenerationRecord.scheduleLabel}</Descriptions.Item>
            <Descriptions.Item label="分析范围">{selectedGenerationRecord.scope}</Descriptions.Item>
            <Descriptions.Item label="有效聊天口径">{selectedGenerationRecord.validChatRule}</Descriptions.Item>
            <Descriptions.Item label="处理用户">{selectedGenerationRecord.analyzedUsers} 人</Descriptions.Item>
            <Descriptions.Item label="成功生成洞察数">{selectedGenerationRecord.successfulInsightUsers} 人 · {selectedGenerationRecord.duration}</Descriptions.Item>
          </Descriptions>
          <Card size="small" title="本次生成摘要"><Paragraph>{selectedGenerationRecord.summary}</Paragraph></Card>
          <Card size="small" title="重点洞察"><Paragraph>{selectedGenerationRecord.highlight}</Paragraph></Card>
          <Card size="small" title="本次结果中的用户"><Paragraph type="secondary">以下为本次批次生成的示例用户结果，可继续从用户综合洞察列表查看详细分析并进入对应聊天。</Paragraph><Space wrap>{userInsightUsers.slice(0, 6).map((user) => <Tag key={user.id} color="blue">{user.name}</Tag>)}</Space></Card>
        </Space> : null}
      </Drawer>
    </div>
  );
}

export default function UserInsightPage({ onViewConversation = () => {} }) {
  const [view, setView] = useState("results");
  const [generationConfig, setGenerationConfig] = useState(defaultConfig);
  const [keyword, setKeyword] = useState("");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const stages = insightStageOptions;
  const filteredUsers = useMemo(() => userInsightUsers.filter((user) => {
    const searchable = `${user.name} ${user.summary} ${user.background} ${user.insight}`.toLowerCase();
    return (!keyword || searchable.includes(keyword.toLowerCase())) && (stage === "all" || user.stage === stage);
  }), [keyword, stage]);
  const pageUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  const resetFilters = () => { setKeyword(""); setStage("all"); setPage(1); };
  const columns = [
    {
      title: "用户",
      dataIndex: "name",
      width: 180,
      fixed: "left",
      render: (_, user) => <Space><Avatar icon={<UserOutlined />} /><Text strong>{user.name}</Text></Space>
    },
    { title: "所属企微号", dataIndex: "wecomAccount", width: 150, render: (value) => <Text>{value || "未分配"}</Text> },
    { title: "当前阶段", dataIndex: "stage", width: 120, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "历史聊天", dataIndex: "historyMessageCount", width: 110, render: (value) => <Tag color="cyan">{value} 条</Tag> },
    { title: "聊天总结", dataIndex: "summary", width: 330, render: (value) => <div className="user-insight-summary-cell">{value}</div> },
    { title: "用户洞察", key: "insight", width: 680, render: (_, user) => <InsightSegments user={user} /> },
    { title: "操作", key: "action", fixed: "right", width: 110, render: (_, user) => <Button type="link" icon={<CommentOutlined />} onClick={() => onViewConversation({ key: user.conversationKey })}>查看</Button> }
  ];

  if (view === "config") {
    return <UserInsightConfigPage initialConfig={generationConfig} onSave={setGenerationConfig} onBack={() => setView("results")} />;
  }
  if (view === "records") {
    return <UserInsightGenerationRecordsPage onBack={() => setView("results")} />;
  }

  return (
    <div className="user-insight-page">
      <div className="user-insight-header">
        <div><Title level={3}>用户洞察与建议</Title><Paragraph type="secondary">观心实验室 · 综合用户档案与历史聊天，帮助人工快速了解儿童心理健康课程用户</Paragraph></div>
        <Space><Tag color="blue" icon={<ClockCircleOutlined />}>{userInsightSchedule.generatedAt}</Tag><Button icon={<SettingOutlined />} onClick={() => setView("config")}>洞察生成配置</Button><Button onClick={() => setView("records")}>查看记录</Button></Space>
      </div>
      <Card className="user-insight-window-card" bordered={false}><Space size={28} wrap><div><Text type="secondary">统计时间范围</Text><div><Text strong>{userInsightSchedule.label}</Text></div></div><div><Text type="secondary">分析人群</Text><div><Text strong>{userInsightSchedule.scope}</Text></div></div><div><Text type="secondary">最近生成</Text><div><Text strong>{userInsightGenerationRecords[0].executedAt}</Text></div></div><div><Text type="secondary">下次生成时间</Text><div><Text strong>{userInsightSchedule.nextGeneratedAt}</Text></div></div></Space></Card>
      <Row gutter={[12, 12]} className="user-insight-summary-grid">
        <Col xs={12} sm={8} lg={6}><Card className="user-insight-stat-card" bordered={false}><Statistic title="总用户数" value={userInsightSummary.totalUsers} suffix="人" /></Card></Col>
        <Col xs={12} sm={8} lg={6}><Card className="user-insight-stat-card user-insight-stat-communication" bordered={false}><Statistic title="有效沟通用户数" value={userInsightSummary.effectiveCommunicationUsers} suffix="人" /></Card></Col>
        <Col xs={12} sm={8} lg={6}><Card className="user-insight-stat-card user-insight-stat-primary" bordered={false}><Statistic title="应该洞察用户数" value={userInsightSummary.shouldInsightUsers} suffix="人" /></Card></Col>
        <Col xs={12} sm={8} lg={6}><Card className="user-insight-stat-card user-insight-stat-insight" bordered={false}><Statistic title="成功生成洞察数" value={userInsightGenerationRecords[0].successfulInsightUsers} suffix="人" /></Card></Col>
      </Row>
      <Card className="user-insight-filter-card" bordered={false}><Space wrap size={[8, 10]}><Input prefix={<SearchOutlined />} allowClear value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} placeholder="搜索用户、聊天总结或洞察" style={{ width: 290 }} /><Select value={stage} onChange={(value) => { setStage(value); setPage(1); }} options={[{ value: "all", label: "全部当前阶段" }, ...stages.map((value) => ({ value, label: value }))]} style={{ width: 180 }} /><Button onClick={resetFilters}>重置</Button></Space></Card>
      <Card className="user-insight-table-card" bordered={false} title={<Space><span>用户综合洞察列表</span><Text type="secondary">共 {filteredUsers.length} 人</Text></Space>}>
        <Table rowKey="id" columns={columns} dataSource={pageUsers} pagination={false} scroll={{ x: 1600 }} locale={{ emptyText: <Empty description="暂无符合条件的用户" /> }} />
        <div className="user-insight-pagination"><Pagination current={page} pageSize={pageSize} total={filteredUsers.length} showSizeChanger onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }} /></div>
      </Card>
    </div>
  );
}
