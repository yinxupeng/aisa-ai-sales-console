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
  CalendarOutlined,
  CommentOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined
} from "@ant-design/icons";
import { dailyReportSchedule, dailyReportSummary, dailyReportUsers } from "../data/dailyReportData";

const { Title, Paragraph, Text } = Typography;

export default function DailyReportPage({ onViewConversation = () => {} }) {
  const [keyword, setKeyword] = useState("");
  const [lesson, setLesson] = useState("all");
  const [manager, setManager] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const managers = Array.from(new Set(dailyReportUsers.map((user) => user.manager)));
  const filteredUsers = useMemo(() => dailyReportUsers.filter((user) => {
    const searchable = `${user.name} ${user.summary} ${user.courseName}`.toLowerCase();
    return (!keyword || searchable.includes(keyword.toLowerCase()))
      && (lesson === "all" || user.currentLesson === Number(lesson))
      && (manager === "all" || user.manager === manager);
  }), [keyword, lesson, manager]);
  const pageUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  const resetFilters = () => { setKeyword(""); setLesson("all"); setManager("all"); setPage(1); };
  const columns = [
    { title: "用户", dataIndex: "name", width: 190, render: (_, user) => <Space><Avatar icon={<UserOutlined />} /><div><Text strong>{user.name}</Text><div><Text type="secondary">{user.relation} · {user.manager}</Text></div></div></Space> },
    { title: "当前课程", dataIndex: "currentLesson", width: 150, render: (value) => <div><Text>第{value}节课</Text><div><Text type="secondary">儿童心理健康医疗课程</Text></div></div> },
    { title: "当天聊天", dataIndex: "userMessageCount", width: 120, render: (value) => <Tag color="blue">{value} 条</Tag> },
    { title: "AI总结对话内容", dataIndex: "summary", width: 520, render: (value) => <div className="daily-report-summary-cell">{value}</div> },
    { title: "最近沟通", dataIndex: "lastMessageAt", width: 150, render: (value) => <Text type="secondary">{value}</Text> },
    { title: "操作", key: "action", fixed: "right", width: 120, render: (_, user) => <Button type="link" icon={<CommentOutlined />} onClick={() => onViewConversation(user)}>查看聊天</Button> }
  ];

  return (
    <div className="daily-report-page">
      <div className="daily-report-header"><div><Title level={3}>用户日报分析</Title><Paragraph type="secondary">观心实验室 · 儿童心理健康医疗课程用户每日沟通情况</Paragraph></div><Space wrap><Tag color="blue" icon={<ClockCircleOutlined />}>每天 18:00 自动生成</Tag><Tag color="default"><CalendarOutlined /> {dailyReportSchedule.label}</Tag></Space></div>
      <Card className="daily-report-window-card" bordered={false}><Space size={28} wrap><div><Text type="secondary">统计时间范围</Text><div><Text strong>{dailyReportSchedule.windowStart} 至 {dailyReportSchedule.windowEnd}</Text></div></div><div><Text type="secondary">生成时间</Text><div><Text strong>{dailyReportSchedule.generatedAt}</Text></div></div><div><Text type="secondary">分析人群</Text><div><Text strong>{dailyReportSchedule.scope}</Text></div></div></Space></Card>
      <Row gutter={[12, 12]} className="daily-report-summary-grid"><Col xs={12} sm={8} lg={4}><Card className="daily-report-stat-card" bordered={false}><Statistic title="总用户数" value={dailyReportSummary.totalUsers} suffix="人" /></Card></Col><Col xs={12} sm={8} lg={4}><Card className="daily-report-stat-card daily-report-stat-primary" bordered={false}><Statistic title="当天聊天人数" value={dailyReportSummary.chatUsers} suffix="人" /></Card></Col><Col xs={12} sm={8} lg={4}><Card className="daily-report-stat-card" bordered={false}><Statistic title="当天未沟通人数" value={dailyReportSummary.uncontactedUsers} suffix="人" /></Card></Col><Col xs={12} sm={8} lg={4}><Card className="daily-report-stat-card" bordered={false}><Statistic title="用户消息总数" value={dailyReportSummary.totalUserMessages} suffix="条" /></Card></Col><Col xs={12} sm={8} lg={4}><Card className="daily-report-stat-card daily-report-stat-primary" bordered={false}><Statistic title="人均聊天条数" value={dailyReportSummary.averageMessagesPerChatUser} suffix="条/人" /></Card></Col><Col xs={12} sm={8} lg={4}><Card className="daily-report-stat-card" bordered={false}><Statistic title="沟通覆盖率" value={dailyReportSummary.coverageRate} /></Card></Col></Row>
      <Card className="daily-report-filter-card" bordered={false}><Space wrap size={[8, 10]}><Input prefix={<SearchOutlined />} allowClear value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} placeholder="搜索用户或对话内容" style={{ width: 260 }} /><Select value={lesson} onChange={(value) => { setLesson(value); setPage(1); }} options={[{ value: "all", label: "全部课程节次" }, { value: "1", label: "第1节课" }, { value: "2", label: "第2节课" }, { value: "3", label: "第3节课" }, { value: "4", label: "第4节课" }, { value: "5", label: "第5节课" }]} /><Select value={manager} onChange={(value) => { setManager(value); setPage(1); }} options={[{ value: "all", label: "全部负责人" }, ...managers.map((value) => ({ value, label: value }))]} /><Button onClick={resetFilters}>重置</Button></Space></Card>
      <Card className="daily-report-table-card" bordered={false} title={<Space><span>当天聊天用户</span><Text type="secondary">共 {filteredUsers.length} 人</Text></Space>}><Table rowKey="id" columns={columns} dataSource={pageUsers} pagination={false} scroll={{ x: 1250 }} locale={{ emptyText: <Empty description="暂无当天聊天用户" /> }} onRow={(user) => ({ onClick: () => onViewConversation(user), className: "daily-report-table-row" })} /><div className="daily-report-pagination"><Pagination current={page} pageSize={pageSize} total={filteredUsers.length} showSizeChanger onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }} /></div></Card>
    </div>
  );
}
