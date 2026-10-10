import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
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
  Tooltip,
  Typography
} from "antd";
import {
  ClockCircleOutlined,
  CommentOutlined,
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  intentAnalysisSchedule,
  intentAnalysisUsers,
  intentLevelDefinitions
} from "../data/intentAnalysisData";

const { Title, Paragraph, Text } = Typography;

function MetricTag({ children, color }) {
  return <Tag color={color}>{children}</Tag>;
}

function IntentDetailDrawer({ user, open, onClose, onViewConversation }) {
  if (!user) return null;
  const { metrics } = user;
  return (
    <Drawer
      title={<Space><span>{user.name}的意向分析</span><Tag color={user.levelInfo.color}>{user.level}档 · {user.levelInfo.label}</Tag></Space>}
      width={560}
      open={open}
      onClose={onClose}
      extra={<Button type="primary" icon={<CommentOutlined />} onClick={() => onViewConversation(user)}>查看聊天</Button>}
    >
      <div className="intent-detail-profile">
        <Avatar size={56} icon={<UserOutlined />} />
        <div><Title level={4}>{user.name}</Title><Text type="secondary">{user.relation} · 课程第{user.currentLesson}节 · {user.manager}负责</Text></div>
      </div>
      <Card size="small" title="当前判断" className="intent-detail-card">
        <div className="intent-level-highlight"><Tag color={user.levelInfo.color}>{user.level}档</Tag><div><Text strong>{user.levelInfo.label}</Text><Paragraph type="secondary">{user.levelInfo.description}</Paragraph></div></div>
        <div className="intent-detail-conclusion">{user.followUp}</div>
      </Card>
      <Card size="small" title="到课分析" className="intent-detail-card">
        <div className="intent-detail-grid"><Text type="secondary">当前课程</Text><Text>{user.courseName} · 第{user.currentLesson}节</Text><Text type="secondary">到课天数</Text><Text>{metrics.attendanceDays}天</Text><Text type="secondary">连续到课</Text><Text>{metrics.consecutiveAttendanceDays}天</Text><Text type="secondary">累计观看</Text><Text>{metrics.totalWatchMinutes}分钟</Text><Text type="secondary">第三节后沟通</Text><Text>{metrics.chattedAfterLesson3 ? "是" : "否"}</Text></div>
      </Card>
      <Card size="small" title="聊天与意向信号" className="intent-detail-card">
        <div className="intent-detail-grid"><Text type="secondary">累计聊天</Text><Text>{metrics.chatCount}条</Text><Text type="secondary">病情相关词</Text><Text>{metrics.hasIllnessKeyword ? "已出现" : "未出现"}</Text><Text type="secondary">命中内容</Text><Text>{user.concern}</Text><Text type="secondary">是否询价</Text><Text>{metrics.askedPrice ? "已询价" : "未询价"}</Text><Text type="secondary">课后感受</Text><Text>{metrics.expressedAfterAllLessons ? "每节课后均有表达" : metrics.expressedAfterLessons123 ? "前1、2、3节课后有表达" : "暂未表达"}</Text></div>
      </Card>
      <Card size="small" title="分析说明" className="intent-detail-card"><Paragraph>分析时间：{user.analysisAt}</Paragraph><Paragraph type="secondary">系统按照每日 09:00 的规则更新，当前分析范围为第 3、4、5 节课用户。</Paragraph></Card>
    </Drawer>
  );
}

export default function IntentAnalysisPage({ onViewConversation = () => {} }) {
  const [keyword, setKeyword] = useState("");
  const [level, setLevel] = useState("all");
  const [lesson, setLesson] = useState("all");
  const [manager, setManager] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const managers = Array.from(new Set(intentAnalysisUsers.map((user) => user.manager)));
  const filteredUsers = useMemo(() => intentAnalysisUsers.filter((user) => {
    const searchText = `${user.name} ${user.concern} ${user.courseName}`.toLowerCase();
    return (!keyword || searchText.includes(keyword.toLowerCase()))
      && (level === "all" || user.level === Number(level))
      && (lesson === "all" || user.currentLesson === Number(lesson))
      && (manager === "all" || user.manager === manager);
  }), [keyword, level, lesson, manager]);
  const pageUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  const levelCounts = intentLevelDefinitions.map((item) => filteredUsers.filter((user) => user.level === item.level).length);
  const openUser = (user) => { setSelectedUser(user); setDrawerOpen(true); };
  const clearFilters = () => { setKeyword(""); setLevel("all"); setLesson("all"); setManager("all"); setPage(1); };

  const columns = [
    { title: "用户", dataIndex: "name", width: 180, render: (_, user) => <Space><Avatar icon={<UserOutlined />} /><div><Text strong>{user.name}</Text><div><Text type="secondary">{user.relation} · {user.manager}</Text></div></div></Space> },
    { title: "当前课程", dataIndex: "currentLesson", width: 150, render: (value) => <div><Text>第{value}节课</Text><div><Text type="secondary">儿童心理健康医疗课程</Text></div></div> },
    { title: "意向档位", dataIndex: "level", width: 130, render: (value, user) => <Space direction="vertical" size={2}><Tag color={user.levelInfo.color}>{value}档 · {user.levelInfo.label}</Tag><Text type="secondary">{user.levelInfo.description}</Text></Space> },
    { title: "到课表现", key: "attendance", width: 180, render: (_, user) => <Space wrap><MetricTag color="cyan">到课{user.metrics.attendanceDays}天</MetricTag><MetricTag color="blue">观看{user.metrics.totalWatchMinutes}分钟</MetricTag></Space> },
    { title: "意向信号", key: "signals", width: 200, render: (_, user) => <Space wrap>{user.metrics.hasIllnessKeyword ? <MetricTag color="orange">病情词</MetricTag> : null}{user.metrics.askedPrice ? <MetricTag color="red">已询价</MetricTag> : null}{user.metrics.expressedAfterLessons123 ? <MetricTag color="purple">表达感受</MetricTag> : null}</Space> },
    { title: "聊天", key: "chat", width: 100, render: (_, user) => <Text>{user.metrics.chatCount} 条</Text> },
    { title: "最近沟通", dataIndex: "recentChatAt", width: 145, render: (value) => <Text type="secondary">{value}</Text> },
    { title: "操作", key: "action", fixed: "right", width: 110, render: (_, user) => <Button type="link" icon={<EyeOutlined />} onClick={() => openUser(user)}>查看分析</Button> }
  ];

  return (
    <div className="intent-analysis-page">
      <div className="intent-analysis-header"><div><Title level={3}>用户意向度分析</Title><Paragraph type="secondary">观心实验室 · 儿童心理健康医疗课程用户意向度分层与跟进建议</Paragraph></div><Space><Tag color="blue"><ClockCircleOutlined /> 每天 09:00 自动更新</Tag><Button icon={<ReloadOutlined />}>立即更新</Button><Button icon={<DownloadOutlined />}>导出分析</Button></Space></div>
      <Card className="intent-schedule-card" bordered={false}><Space size={28} wrap><div><Text type="secondary">分析范围</Text><div><Text strong>{intentAnalysisSchedule.scope}</Text></div></div><div><Text type="secondary">最近更新</Text><div><Text strong>{intentAnalysisSchedule.lastRunAt}</Text></div></div><div><Text type="secondary">下次更新</Text><div><Text strong>{intentAnalysisSchedule.nextRunAt}</Text></div></div><div><Text type="secondary">分析用户</Text><div><Text strong>{intentAnalysisUsers.length} 人</Text></div></div></Space></Card>
      <Row gutter={[12, 12]} className="intent-level-summary">{intentLevelDefinitions.map((item, index) => <Col xs={12} sm={8} lg={4} key={item.level}><Card className={`intent-level-card intent-level-card-${item.level}`} bordered={false} onClick={() => { setLevel(String(item.level)); setPage(1); }}><Statistic title={`${item.level}档 · ${item.label}`} value={levelCounts[index]} suffix="人" /><Text type="secondary">{item.description}</Text></Card></Col>)}</Row>
      <Card className="intent-filter-card" bordered={false}><Space wrap size={[8, 10]}><Input allowClear value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} placeholder="搜索用户、问题或课程" style={{ width: 230 }} /><Select value={level} onChange={(value) => { setLevel(value); setPage(1); }} options={[{ value: "all", label: "全部意向档位" }, ...intentLevelDefinitions.map((item) => ({ value: String(item.level), label: `${item.level}档 · ${item.label}` }))]} /><Select value={lesson} onChange={(value) => { setLesson(value); setPage(1); }} options={[{ value: "all", label: "全部课程节次" }, { value: "3", label: "第3节课" }, { value: "4", label: "第4节课" }, { value: "5", label: "第5节课" }]} /><Select value={manager} onChange={(value) => { setManager(value); setPage(1); }} options={[{ value: "all", label: "全部负责人" }, ...managers.map((value) => ({ value, label: value }))]} /><Button onClick={clearFilters}>重置</Button></Space></Card>
      <Card className="intent-table-card" bordered={false} title={<Space><span>用户意向度列表</span><Text type="secondary">共 {filteredUsers.length} 人</Text></Space>}><Table rowKey="id" columns={columns} dataSource={pageUsers} pagination={false} scroll={{ x: 1250 }} locale={{ emptyText: <Empty description="暂无符合条件的用户" /> }} onRow={(user) => ({ onClick: () => openUser(user), className: "intent-table-row" })} /><div className="intent-pagination"><Pagination current={page} pageSize={pageSize} total={filteredUsers.length} showSizeChanger onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }} /></div></Card>
      <IntentDetailDrawer user={selectedUser} open={drawerOpen} onClose={() => setDrawerOpen(false)} onViewConversation={onViewConversation} />
    </div>
  );
}
