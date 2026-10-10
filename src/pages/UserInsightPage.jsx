import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
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
  ClockCircleOutlined,
  CommentOutlined,
  SearchOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  userInsightSchedule,
  userInsightSummary,
  userInsightUsers
} from "../data/userInsightData";

const { Title, Paragraph, Text } = Typography;

function InsightSegments({ user }) {
  return (
    <div className="user-insight-segments">
      <div><Text strong>用户背景：</Text>{user.background}</div>
      <div><Text strong>用户洞察：</Text>{user.insight}</div>
      <div><Text strong>关键风险：</Text>{user.risk}</div>
      <div><Text strong>销售建议：</Text>{user.advice}</div>
      <div className="user-insight-prompt"><Text strong>提示词摘要：</Text>{user.promptSummary}</div>
    </div>
  );
}

export default function UserInsightPage({ onViewConversation = () => {} }) {
  const [keyword, setKeyword] = useState("");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const stages = Array.from(new Set(userInsightUsers.map((user) => user.stage)));
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
      render: (_, user) => <Space><Avatar icon={<UserOutlined />} /><div><Text strong>{user.name}</Text><div><Text type="secondary">{user.relation}</Text></div></div></Space>
    },
    { title: "当前阶段", dataIndex: "stage", width: 160, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "历史聊天", dataIndex: "historyMessageCount", width: 110, render: (value) => <Tag color="cyan">{value} 条</Tag> },
    { title: "聊天总结", dataIndex: "summary", width: 330, render: (value) => <div className="user-insight-summary-cell">{value}</div> },
    { title: "用户洞察", key: "insight", width: 680, render: (_, user) => <InsightSegments user={user} /> },
    { title: "操作", key: "action", fixed: "right", width: 110, render: (_, user) => <Button type="link" icon={<CommentOutlined />} onClick={() => onViewConversation({ key: user.conversationKey })}>查看</Button> }
  ];

  return (
    <div className="user-insight-page">
      <div className="user-insight-header">
        <div><Title level={3}>用户洞察与建议</Title><Paragraph type="secondary">观心实验室 · 综合用户档案与历史聊天，帮助人工快速了解儿童心理健康课程用户</Paragraph></div>
        <Tag color="blue" icon={<ClockCircleOutlined />}>{userInsightSchedule.generatedAt}</Tag>
      </div>
      <Card className="user-insight-window-card" bordered={false}><Space size={28} wrap><div><Text type="secondary">统计时间范围</Text><div><Text strong>{userInsightSchedule.label}</Text></div></div><div><Text type="secondary">分析人群</Text><div><Text strong>{userInsightSchedule.scope}</Text></div></div><div><Text type="secondary">最近生成</Text><div><Text strong>2026-06-12 18:00</Text></div></div></Space></Card>
      <Row gutter={[12, 12]} className="user-insight-summary-grid">
        <Col xs={12} sm={8} lg={6}><Card className="user-insight-stat-card" bordered={false}><Statistic title="总用户数" value={userInsightSummary.totalUsers} suffix="人" /></Card></Col>
        <Col xs={12} sm={8} lg={6}><Card className="user-insight-stat-card user-insight-stat-primary" bordered={false}><Statistic title="历史有效聊天人数" value={userInsightSummary.historicalValidChatUsers} suffix="人" /></Card></Col>
        <Col xs={12} sm={8} lg={6}><Card className="user-insight-stat-card" bordered={false}><Statistic title="历史有效聊天率" value={userInsightSummary.historicalValidChatRate} /></Card></Col>
      </Row>
      <Card className="user-insight-filter-card" bordered={false}><Space wrap size={[8, 10]}><Input prefix={<SearchOutlined />} allowClear value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} placeholder="搜索用户、聊天总结或洞察" style={{ width: 290 }} /><Select value={stage} onChange={(value) => { setStage(value); setPage(1); }} options={[{ value: "all", label: "全部当前阶段" }, ...stages.map((value) => ({ value, label: value }))]} style={{ width: 180 }} /><Button onClick={resetFilters}>重置</Button></Space></Card>
      <Card className="user-insight-table-card" bordered={false} title={<Space><span>用户综合洞察列表</span><Text type="secondary">共 {filteredUsers.length} 人</Text></Space>}>
        <Table rowKey="id" columns={columns} dataSource={pageUsers} pagination={false} scroll={{ x: 1600 }} locale={{ emptyText: <Empty description="暂无符合条件的用户" /> }} />
        <div className="user-insight-pagination"><Pagination current={page} pageSize={pageSize} total={filteredUsers.length} showSizeChanger onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }} /></div>
      </Card>
    </div>
  );
}
