import React, { useMemo, useState } from "react";
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Statistic,
  Tabs,
  Tag,
  Tooltip,
  Typography
} from "antd";
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  PlusOutlined,
  RobotOutlined,
  SendOutlined,
  TeamOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";
import {
  collaborationPriorities,
  collaborationRoles,
  collaborationTaskTypes,
  collaborationTasks,
  collaborationTaskStatuses,
  getCollaborationPriority,
  getCollaborationStatus,
  getCollaborationTaskType
} from "../data/collaborationTasks";

const { Text, Title, Paragraph } = Typography;

const viewConfig = {
  overview: { label: "协作总览", direction: "all" },
  aiToHuman: { label: "AI转人工", direction: "ai_to_human" },
  humanToAi: { label: "人工派给AI", direction: "human_to_ai" }
};

const statisticCards = [
  { key: "mine", label: "待我处理", icon: <TeamOutlined />, color: "#1677ff" },
  { key: "soon", label: "即将超时", icon: <ClockCircleOutlined />, color: "#fa8c16" },
  { key: "overdue", label: "已超时", icon: <AlertOutlined />, color: "#ff4d4f" },
  { key: "running", label: "AI执行中", icon: <RobotOutlined />, color: "#722ed1" },
  { key: "review", label: "待人工审核", icon: <ExclamationCircleOutlined />, color: "#d48806" },
  { key: "done", label: "今日已完成", icon: <CheckCircleOutlined />, color: "#389e0d" }
];

const formatDirection = (direction) => direction === "ai_to_human" ? "AI转人工" : "人工派给AI";

function priorityTag(priority) {
  const item = getCollaborationPriority(priority);
  return <Tag color={item.color}>{item.label}</Tag>;
}

function statusTag(status) {
  const item = getCollaborationStatus(status);
  return <Tag color={item.color}>{item.label}</Tag>;
}

function getInitials(name = "任务") {
  return name.slice(0, 1);
}

function TaskRow({ task, canManage, onOpen, onAction }) {
  const type = getCollaborationTaskType(task.type);
  return (
    <Card className="collaboration-task-card" bordered={false} onClick={() => onOpen(task)}>
      <div className="collaboration-task-main">
        <div className="collaboration-task-avatar">
          <Avatar size={42} style={{ background: task.direction === "ai_to_human" ? "#e6f4ff" : "#f3e8ff", color: task.direction === "ai_to_human" ? "#1677ff" : "#722ed1" }}>
            {task.direction === "ai_to_human" ? <UserSwitchOutlined /> : <RobotOutlined />}
          </Avatar>
        </div>
        <div className="collaboration-task-content">
          <div className="collaboration-task-title-row">
            <Space size={8} wrap>
              <Text strong>{task.title}</Text>
              <Tag>{formatDirection(task.direction)}</Tag>
              {priorityTag(task.priority)}
              {statusTag(task.status)}
            </Space>
            <Text type="secondary" className="collaboration-task-time">{task.createdAt}</Text>
          </div>
          <div className="collaboration-task-meta">
            <Text>{task.customer.name}</Text>
            <Text type="secondary">{task.enterprise}</Text>
            <Text type="secondary">{task.industry}</Text>
            <Text type="secondary">{task.assignee || "未分配"}</Text>
          </div>
          <Paragraph className="collaboration-task-summary" ellipsis={{ rows: 1 }}>{task.aiReason}</Paragraph>
          <div className="collaboration-task-footer">
            <Space size={12} wrap>
              <Text type="secondary"><ClockCircleOutlined /> SLA {task.dueAt}</Text>
              <Text type="secondary">AI置信度 {task.aiConfidence}</Text>
              {task.requiresHumanConfirmation ? <Tag color="gold">需人工确认</Tag> : null}
            </Space>
            <Space size={4} onClick={(event) => event.stopPropagation()}>
              <Button type="link" size="small" onClick={() => onOpen(task)}>查看详情</Button>
              {canManage && task.status !== "已完成" ? <Button type="link" size="small" onClick={() => onAction(task, "完成")}>完成</Button> : null}
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
}

function OverviewPanel({ tasks, onOpen, onSelectView }) {
  const industries = Array.from(new Set(tasks.map((task) => task.industry)));
  return (
    <div className="collaboration-overview-panel">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="协作任务趋势" className="collaboration-chart-card">
            <div className="collaboration-trend-bars">
              {["周一", "周二", "周三", "周四", "周五", "周六", "今日"].map((day, index) => (
                <div className="collaboration-trend-item" key={day}>
                  <div className="collaboration-trend-bar" style={{ height: `${36 + ((index * 13) % 52)}%` }}><span>{8 + index * 3}</span></div>
                  <Text type="secondary">{day}</Text>
                </div>
              ))}
            </div>
            <Divider />
            <Space wrap>
              <Text type="secondary"><span className="collaboration-dot collaboration-dot-blue" />AI转人工 64%</Text>
              <Text type="secondary"><span className="collaboration-dot collaboration-dot-purple" />人工派给AI 36%</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="行业任务分布" className="collaboration-chart-card">
            {industries.slice(0, 5).map((industry, index) => {
              const count = tasks.filter((task) => task.industry === industry).length;
              return <div className="collaboration-distribution-row" key={industry} onClick={() => onSelectView("all")}>
                <Space><span className="collaboration-industry-index">{index + 1}</span><Text>{industry}</Text></Space>
                <Space><Text strong>{count}</Text><Text type="secondary">项</Text></Space>
              </div>;
            })}
          </Card>
        </Col>
      </Row>
      <Card title="最近协作任务" className="collaboration-recent-card" extra={<Button type="link" onClick={() => onSelectView("all")}>查看全部</Button>}>
        <List dataSource={tasks.slice(0, 8)} renderItem={(task) => (
          <List.Item actions={[<Button type="link" key="open" onClick={() => onOpen(task)}>查看详情</Button>]}>
            <List.Item.Meta avatar={<Avatar style={{ background: task.direction === "ai_to_human" ? "#e6f4ff" : "#f3e8ff", color: task.direction === "ai_to_human" ? "#1677ff" : "#722ed1" }}>{getInitials(task.customer.name)}</Avatar>} title={<Space>{task.title}{statusTag(task.status)}</Space>} description={`${task.customer.name} · ${task.industry} · ${task.assignee || "未分配"}`} />
            <Space>{priorityTag(task.priority)}<Text type="secondary">{task.dueAt}</Text></Space>
          </List.Item>
        )} />
      </Card>
    </div>
  );
}

function TaskDetailDrawer({ task, open, canManage, onClose, onAction, onViewConversation }) {
  if (!task) return null;
  const type = getCollaborationTaskType(task.type);
  return (
    <Drawer title={<Space><span>{task.title}</span>{statusTag(task.status)}</Space>} width={520} open={open} onClose={onClose} className="collaboration-detail-drawer" extra={task.direction === "ai_to_human" ? <Button type="link" icon={<CommentOutlined />} onClick={() => onViewConversation(task)}>打开会话</Button> : null}>
      <div className="collaboration-detail-hero">
        <Avatar size={52} style={{ background: "#e6f4ff", color: "#1677ff" }}>{getInitials(task.customer.name)}</Avatar>
        <div><Title level={4}>{task.customer.name}</Title><Text type="secondary">{task.enterprise} · {task.industry}</Text></div>
      </div>
      <div className="collaboration-detail-tags"><Tag color="blue">{formatDirection(task.direction)}</Tag>{priorityTag(task.priority)}<Tag>{task.agent}</Tag></div>
      <Card size="small" title="任务概览" className="collaboration-detail-card">
        <div className="collaboration-detail-grid"><Text type="secondary">任务类型</Text><Text>{type.label}</Text><Text type="secondary">负责人</Text><Text>{task.assignee || "未分配"}</Text><Text type="secondary">SLA</Text><Text>{task.dueAt}</Text><Text type="secondary">AI置信度</Text><Text>{task.aiConfidence}</Text></div>
      </Card>
      <Card size="small" title="AI 判断与依据" className="collaboration-detail-card"><Paragraph>{task.aiReason}</Paragraph><Text type="secondary">输入：{task.input}</Text></Card>
      <Card size="small" title={<Space><span>AI 生成结果</span><Tag color="purple">AI生成</Tag></Space>} className="collaboration-detail-card"><Paragraph>{task.output}</Paragraph>{task.requiresHumanConfirmation ? <div className="collaboration-confirm-alert"><ExclamationCircleOutlined /> 该结果可能影响客户或业务状态，需要人工确认后执行。</div> : null}</Card>
      <Card size="small" title="操作日志" className="collaboration-detail-card"><List size="small" dataSource={task.auditLogs} renderItem={(log) => <List.Item><List.Item.Meta title={`${log.actor} · ${log.action}`} description={log.time} /></List.Item>} /></Card>
      <div className="collaboration-detail-actions">
        {task.requiresHumanConfirmation && task.status === "待人工确认" ? <Button type="primary" onClick={() => onAction(task, "完成")}>确认并完成</Button> : null}
        {canManage && task.status !== "已完成" ? <Button onClick={() => onAction(task, "转派")}>转派任务</Button> : null}
        {task.status !== "已完成" ? <Button danger onClick={() => onAction(task, "驳回")}>驳回结果</Button> : null}
        <Button onClick={onClose}>关闭</Button>
      </div>
    </Drawer>
  );
}

export default function HumanMachineCollaborationPage({ userRole = "operator", onViewConversation = () => {} }) {
  const { message } = AntApp.useApp();
  const [activeView, setActiveView] = useState("overview");
  const [filters, setFilters] = useState({ keyword: "", direction: "all", status: "all", industry: "all", type: "all", priority: "all", assignee: "all" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [tasks, setTasks] = useState(collaborationTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isEmployee = userRole === "employee";
  const canManage = !isEmployee;
  const roleLabel = collaborationRoles[userRole]?.label || collaborationRoles.operator.label;

  const scopedTasks = useMemo(() => isEmployee ? tasks.filter((task) => task.assigneeRole === "employee" || task.direction === "human_to_ai") : tasks, [isEmployee, tasks]);
  const filteredTasks = useMemo(() => scopedTasks.filter((task) => {
    const view = viewConfig[activeView];
    const text = `${task.title} ${task.customer.name} ${task.enterprise} ${task.aiReason}`.toLowerCase();
    return (!view || view.direction === "all" || task.direction === view.direction)
      && (!filters.keyword || text.includes(filters.keyword.toLowerCase()))
      && (filters.direction === "all" || task.direction === filters.direction)
      && (filters.status === "all" || task.status === filters.status)
      && (filters.industry === "all" || task.industry === filters.industry)
      && (filters.type === "all" || task.type === filters.type)
      && (filters.priority === "all" || task.priority === filters.priority)
      && (filters.assignee === "all" || task.assignee === filters.assignee);
  }), [activeView, filters, scopedTasks]);
  const pageTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);
  const industries = Array.from(new Set(scopedTasks.map((task) => task.industry)));
  const assignees = Array.from(new Set(scopedTasks.map((task) => task.assignee).filter(Boolean)));
  const stats = {
    mine: scopedTasks.filter((task) => task.status === "待处理" || task.status === "待人工确认").length,
    soon: scopedTasks.filter((task) => task.status === "处理中").length,
    overdue: scopedTasks.filter((task) => task.status === "已超时").length,
    running: scopedTasks.filter((task) => task.status === "处理中" && task.direction === "human_to_ai").length,
    review: scopedTasks.filter((task) => task.status === "待人工确认").length,
    done: scopedTasks.filter((task) => task.status === "已完成").length
  };

  const changeView = (key) => { setActiveView(key === "all" ? "aiToHuman" : key); setPage(1); };
  const updateFilters = (next) => { setFilters((current) => ({ ...current, ...next })); setPage(1); };
  const handleStatisticClick = (key) => {
    const nextView = key === "running" ? "humanToAi" : "aiToHuman";
    setActiveView(nextView);
    updateFilters({ status: key === "done" ? "已完成" : key === "review" ? "待人工确认" : key === "overdue" ? "已超时" : "all" });
  };
  const openTask = (task) => { setSelectedTask(task); setDrawerOpen(true); };
  const updateTaskStatus = (task, action) => {
    const nextStatus = action === "完成" ? "已完成" : action === "驳回" ? "已驳回" : action === "转派" ? "已转派" : task.status;
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status: nextStatus, auditLogs: [...item.auditLogs, { time: "刚刚", actor: isEmployee ? "当前销售" : "运营中心", action: `${action}任务` }] } : item));
    setSelectedTask((current) => current ? { ...current, status: nextStatus } : current);
    if (action !== "转派") setDrawerOpen(false);
    message.success(`${action}成功`);
  };
  const createTask = (values) => {
    const typeKey = values.type || "summary";
    const source = scopedTasks[0] || collaborationTasks[0];
    const newTask = { ...source, id: `collab-new-${Date.now()}`, direction: "human_to_ai", type: typeKey, title: getCollaborationTaskType(typeKey).label, status: "待处理", priority: values.priority || "normal", assignee: isEmployee ? "林晓" : "运营中心", assigneeRole: isEmployee ? "employee" : "operator", aiReason: values.note || "销售主动发起 AI 分析任务。", input: values.note || "请基于客户最近会话生成一份分析结果。", requiresHumanConfirmation: Boolean(values.confirm), auditLogs: [{ time: "刚刚", actor: "当前用户", action: "创建人工派给AI任务" }] };
    setTasks((current) => [newTask, ...current]);
    setModalOpen(false);
    setActiveView("humanToAi");
    setPage(1);
    message.success("AI任务已创建");
  };

  return (
    <div className="collaboration-page">
      <div className="collaboration-page-intro"><div><Title level={3}>人机协作</Title><Paragraph type="secondary">统一管理 AI 转人工和人工派给 AI 的协作任务，让每一次交接都有明确负责人和处理结果。</Paragraph></div><Space><Tag color="blue">当前视图：{roleLabel}</Tag>{activeView !== "overview" && <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新建 AI 任务</Button>}</Space></div>
      <Row gutter={[12, 12]} className="collaboration-stat-row">{statisticCards.map((item) => <Col xs={12} sm={8} lg={4} key={item.key}><Card className="collaboration-stat-card" onClick={() => handleStatisticClick(item.key)}><Statistic title={item.label} value={stats[item.key]} prefix={<span style={{ color: item.color }}>{item.icon}</span>} /></Card></Col>)}</Row>
      {activeView === "overview" ? <OverviewPanel tasks={scopedTasks} onOpen={openTask} onSelectView={changeView} /> : <>
        <Card className="collaboration-filter-card" bordered={false}><Space wrap size={[8, 10]}><Input allowClear placeholder="搜索客户、企业或任务内容" value={filters.keyword} onChange={(event) => updateFilters({ keyword: event.target.value })} style={{ width: 240 }} /><Select value={filters.status} onChange={(value) => updateFilters({ status: value })} options={[{ value: "all", label: "全部状态" }, ...collaborationTaskStatuses.map((item) => ({ value: item.value, label: item.label }))]} /><Select value={filters.industry} onChange={(value) => updateFilters({ industry: value })} options={[{ value: "all", label: "全部行业" }, ...industries.map((value) => ({ value, label: value }))]} /><Select value={filters.type} onChange={(value) => updateFilters({ type: value })} options={[{ value: "all", label: "全部任务类型" }, ...Object.entries(collaborationTaskTypes).filter(([, type]) => type.direction === viewConfig[activeView].direction).map(([value, type]) => ({ value, label: type.label }))]} /><Select value={filters.priority} onChange={(value) => updateFilters({ priority: value })} options={[{ value: "all", label: "全部优先级" }, ...collaborationPriorities.map((item) => ({ value: item.value, label: item.label }))]} /><Select value={filters.assignee} onChange={(value) => updateFilters({ assignee: value })} options={[{ value: "all", label: "全部负责人" }, ...assignees.map((value) => ({ value, label: value }))]} /><Button onClick={() => updateFilters({ keyword: "", status: "all", industry: "all", type: "all", priority: "all", assignee: "all" })}>重置</Button></Space></Card>
        <Card className="collaboration-list-card" bordered={false}><div className="collaboration-list-head"><div><Title level={4}>{viewConfig[activeView].label}</Title><Text type="secondary">共 {filteredTasks.length} 项任务</Text></div><Tabs activeKey={activeView} onChange={changeView} items={[{ key: "aiToHuman", label: "AI转人工" }, { key: "humanToAi", label: "人工派给AI" }]} /></div>{pageTasks.length ? <div className="collaboration-task-list">{pageTasks.map((task) => <TaskRow key={task.id} task={task} canManage={canManage} onOpen={openTask} onAction={updateTaskStatus} />)}</div> : <Empty description="暂无符合条件的协作任务" />}<div className="collaboration-pagination"><Pagination current={page} pageSize={pageSize} total={filteredTasks.length} showSizeChanger onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }} /></div></Card>
      </>}
      <TaskDetailDrawer task={selectedTask} open={drawerOpen} canManage={canManage} onClose={() => setDrawerOpen(false)} onAction={updateTaskStatus} onViewConversation={onViewConversation} />
      <Modal title="新建 AI 任务" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}><Form layout="vertical" onFinish={createTask} initialValues={{ type: "summary", priority: "normal", confirm: true }}><Form.Item label="关联客户 / 会话" name="customer" rules={[{ required: true, message: "请选择关联客户" }]}><Select options={scopedTasks.slice(0, 8).map((task) => ({ value: task.id, label: `${task.customer.name} · ${task.enterprise}` }))} /></Form.Item><Form.Item label="任务类型" name="type"><Select options={Object.entries(collaborationTaskTypes).filter(([, type]) => type.direction === "human_to_ai").map(([value, type]) => ({ value, label: type.label }))} /></Form.Item><Form.Item label="优先级" name="priority"><Select options={collaborationPriorities.map((item) => ({ value: item.value, label: item.label }))} /></Form.Item><Form.Item label="补充说明" name="note"><Input.TextArea rows={3} placeholder="告诉 AI 你希望重点分析什么" /></Form.Item><Form.Item label="结果设置" name="confirm"><Select options={[{ value: true, label: "需要人工确认后执行" }, { value: false, label: "仅生成分析结果" }]} /></Form.Item><Button type="primary" htmlType="submit" block icon={<SendOutlined />}>提交 AI 任务</Button></Form></Modal>
    </div>
  );
}
