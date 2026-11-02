import React, { useMemo, useState } from "react";
import { App, Button, Card, Col, DatePicker, Empty, Input, Popconfirm, Row, Select, Space, Statistic, Table, Tag, Tooltip, Typography } from "antd";
import { ArrowLeftOutlined, EyeOutlined, HistoryOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { autoFollowupStages, autoStatusColors, autoStatusLabels, cancelAutoTask, confirmAutoTask, editAutoTask, executeAutoTask, findAutoConflicts, formatAutoTime, openAutoStatuses, saveAutoConfig, updateDemoUser } from "../domain/autoFollowup";
import { createAutoFollowupDemo } from "../data/autoFollowupData";
import AutoScheduledTaskConfigPage from "./AutoScheduledTaskConfigPage";
import AutoScheduledTaskDrawer from "../components/AutoScheduledTaskDrawer";
import { AutoScheduledConfigViewPage } from "./CollaborationConfigViewPage";
import { GenerationScheduleStrip } from "../components/TaskConfigReadOnly";

const { Title, Paragraph, Text } = Typography;

export default function AutoScheduledTasksPage({ onViewConversation = () => {}, initialView = "tasks" }) {
  const { message } = App.useApp();
  const [state, setState] = useState(() => createAutoFollowupDemo());
  const [view, setView] = useState(["tasks", "config", "config-view", "records"].includes(initialView) ? initialView : "tasks");
  const [keyword, setKeyword] = useState("");
  const [account, setAccount] = useState("all");
  const [stage, setStage] = useState("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [editOnOpen, setEditOnOpen] = useState(false);
  const records = view === "records";
  const accounts = Array.from(new Map(state.users.map((user) => [user.accountKey, { value: user.accountKey, label: user.accountName }])).values());
  const task = state.tasks.find((item) => item.id === selectedId);
  const today = formatAutoTime(state.now).slice(0, 10);
  const currentUser = (item) => state.users.find((user) => user.id === item.userId && user.accountKey === item.accountKey);
  const changeView = (value) => { setSelectedId(null); setView(value); setStatus("all"); setPage(1); };
  const resetFilters = () => { setKeyword(""); setAccount("all"); setStage("all"); setStatus("all"); setDate(""); setPage(1); };
  const openTask = (item, editing = false) => { setEditOnOpen(editing); setSelectedId(item.id); };
  const shownTasks = useMemo(() => state.tasks.filter((item) => {
    const user = state.users.find((user) => user.id === item.userId && user.accountKey === item.accountKey);
    return (records ? !openAutoStatuses.includes(item.status) : openAutoStatuses.includes(item.status))
      && (!keyword || `${item.user} ${item.purpose} ${item.content}`.includes(keyword.trim()))
      && (account === "all" || item.accountKey === account)
      && (stage === "all" || (user?.stage || item.stage) === stage)
      && (status === "all" || item.status === status)
      && (!date || formatAutoTime(item.plannedAt).startsWith(date));
  }).sort((a, b) => records ? Date.parse(b.finishedAt) - Date.parse(a.finishedAt) : Date.parse(a.plannedAt) - Date.parse(b.plannedAt)), [state, records, keyword, account, stage, status, date]);

  const edit = (id, patch) => {
    try { const next = editAutoTask(state, id, patch, state.now); setState(next); message.success("任务已修改，将按最新条件复核；审核模式需重新确认"); return true; }
    catch (error) { message.warning(error.message); return false; }
  };
  const cancel = (id) => { setState(cancelAutoTask(state, id, state.now)); message.success("任务已取消，可在查看记录中追溯"); };
  const confirm = (id) => {
    try {
      const next = confirmAutoTask(state, id, state.now); setState(next);
      const updated = next.tasks.find((item) => item.id === id);
      if (updated.status === "pending") message.success("发送计划已确认，到期仍将重新检查"); else message.warning(updated.reason);
    } catch (error) { message.warning(error.message); }
  };
  const simulate = (id, scenario) => {
    const target = state.tasks.find((item) => item.id === id);
    const now = new Date(Math.max(Date.parse(state.now), Date.parse(target.plannedAt))).toISOString();
    const justBefore = new Date(Date.parse(now) - 300000).toISOString();
    let next = { ...state, now };
    const patches = { reply: { lastUserAt: justBefore }, human: { lastHumanAt: justBefore }, takeover: { humanTakenOver: true }, risk: { risk: true }, refused: { refused: true }, resolved: { topicResolved: true } };
    if (patches[scenario]) next = updateDemoUser(next, target.userId, patches[scenario]);
    if (scenario === "manual-task") next = { ...next, relatedTasks: [...next.relatedTasks, { id: `manual-sim-${globalThis.crypto.randomUUID()}`, userId: target.userId, accountKey: target.accountKey, source: "manual", status: "pending", plannedAt: now, purpose: "人工配置的课程跟进", topicKey: "manual-followup", content: "今天课程中的沟通方法，您有空可以继续交流。" }] };
    next = executeAutoTask(next, id, now, scenario === "failed");
    setState(next);
    const updated = next.tasks.find((item) => item.id === id);
    message.info(updated.status === "sent" ? "已模拟发送成功，没有发送真实企微消息" : updated.reason);
  };

  if (view === "config") return <AutoScheduledTaskConfigPage initialConfig={state.config} accountOptions={accounts} onBack={() => setView("tasks")} onSave={(config) => { setState(saveAutoConfig(state, config, state.now)); setView("tasks"); setPage(1); message.success("配置已保存，待执行AI任务已按新限制复核，人工任务不受影响"); }} />;
  if (view === "config-view") return <AutoScheduledConfigViewPage config={state.config} onBack={() => setView("tasks")} />;
  const latestGeneratedTask = state.tasks.filter((item) => Number.isFinite(Date.parse(item.createdAt))).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];

  const columns = [
    { title: "用户", dataIndex: "user", width: 100, render: (value) => <Text strong>{value}</Text> },
    { title: "所属企微账号", dataIndex: "accountName", width: 135 },
    { title: "当前阶段", key: "stage", width: 100, render: (_, item) => records ? item.stage : currentUser(item)?.stage || item.stage },
    { title: "跟进目的", dataIndex: "purpose", width: 165 },
    { title: "计划发送时间", dataIndex: "plannedAt", width: 155, render: formatAutoTime },
    ...(records ? [{ title: "实际发送时间", dataIndex: "actualSentAt", width: 155, render: formatAutoTime }] : []),
    { title: records ? "实际发送内容" : "拟发送内容", key: "content", width: 300, render: (_, item) => <div className="auto-task-message-preview">{records ? item.actualContent || "未发送" : item.content}</div> },
    { title: "任务状态", dataIndex: "status", width: 120, render: (value) => <Tag color={autoStatusColors[value]}>{autoStatusLabels[value]}</Tag> },
    records ? { title: "执行结果 / 原因", dataIndex: "reason", width: 270 } : { title: "冲突情况", key: "conflict", width: 160, render: (_, item) => {
      const conflicts = findAutoConflicts(state, item, state.now);
      const user = currentUser(item);
      const human = user?.lastHumanAt && Date.parse(user.lastHumanAt) > Date.parse(item.createdAt);
      return <Tooltip title={conflicts.length || human ? "发送前会取消或重新评估AI计划，不修改人工任务" : "仅代表当前演示快照，执行前将再次检查"}><Tag color={conflicts.length || human ? "warning" : "default"}>{human ? "人工已沟通" : conflicts.length ? "存在任务冲突" : "当前无冲突"}</Tag></Tooltip>;
    } },
    { title: "操作", key: "actions", fixed: "right", width: records ? 90 : 175, render: (_, item) => <Space size={0} wrap><Button type="link" onClick={() => openTask(item)}>查看</Button>{!records ? <><Button type="link" onClick={() => openTask(item, true)}>编辑</Button><Popconfirm title="取消这条AI跟进任务？" onConfirm={() => cancel(item.id)} okText="取消任务" cancelText="保留"><Button type="link" danger>取消</Button></Popconfirm></> : null}</Space> }
  ];

  return <div className="user-insight-page auto-scheduled-page">
    <div className="user-insight-header"><div>{records ? <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => changeView("tasks")}>返回自动定时任务</Button> : null}<Title level={3}>{records ? "自动定时任务记录" : "自动定时任务"}</Title><Paragraph type="secondary">{records ? "追溯已结束任务的实际发送内容、检查结果及取消原因。" : "AI根据家长聊天规划单次主动跟进；人工任务优先，到期重新检查。"}</Paragraph></div>{!records ? <Space wrap><Button icon={<SettingOutlined />} onClick={() => { setSelectedId(null); setView("config"); }}>任务配置（管理员）</Button><Button icon={<EyeOutlined />} onClick={() => changeView("config-view")}>查看配置（普通员工）</Button><Button icon={<HistoryOutlined />} onClick={() => changeView("records")}>查看记录</Button></Space> : null}</div>
    {!records ? <GenerationScheduleStrip lastGeneratedAt={formatAutoTime(latestGeneratedTask?.createdAt)} nextGeneratedAt={state.config.enabled ? "按用户沟通条件触发" : "—"} /> : null}
    {!records ? <Row gutter={[12, 12]}>{[
      ["待发送任务数", state.tasks.filter((item) => item.status === "pending").length],
      ["待人工确认任务数", state.tasks.filter((item) => item.status === "review").length],
      ["今日已发送任务数", state.tasks.filter((item) => item.status === "sent" && formatAutoTime(item.actualSentAt).startsWith(today)).length],
      ["今日因冲突取消任务数", state.tasks.filter((item) => item.status === "cancelled" && ["conflict", "human"].includes(item.reasonCode) && formatAutoTime(item.finishedAt).startsWith(today)).length]
    ].map(([title, value]) => <Col xs={12} lg={6} key={title}><Card className="user-insight-stat-card"><Statistic title={title} value={value} suffix="条" /></Card></Col>)}</Row> : null}
    <Card className="user-insight-filter-card"><Space wrap size={[10, 12]}>
      <Input aria-label="搜索自动跟进用户" prefix={<SearchOutlined />} placeholder="搜索用户或跟进内容" value={keyword} allowClear onChange={(event) => { setKeyword(event.target.value); setPage(1); }} style={{ width: 230 }} />
      <Select aria-label="企微账号筛选" value={account} onChange={(value) => { setAccount(value); setPage(1); }} options={[{ value: "all", label: "全部企微账号" }, ...accounts]} style={{ width: 160 }} />
      <Select aria-label="阶段筛选" value={stage} onChange={(value) => { setStage(value); setPage(1); }} options={[{ value: "all", label: "全部阶段" }, ...autoFollowupStages.map((value) => ({ value, label: value }))]} style={{ width: 130 }} />
      <Select aria-label="任务状态筛选" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ value: "all", label: "全部状态" }, ...(records ? ["sent", "cancelled", "failed"] : openAutoStatuses).map((value) => ({ value, label: autoStatusLabels[value] }))]} style={{ width: 140 }} />
      <DatePicker aria-label="计划发送日期" placeholder="计划发送日期" value={date ? dayjs(date) : null} onChange={(value) => { setDate(value?.format("YYYY-MM-DD") || ""); setPage(1); }} />
      <Button onClick={resetFilters}>重置</Button>
    </Space></Card>
    <Card className="user-insight-table-card" title={<Space><span>{records ? "历史任务记录" : "AI自动跟进任务"}</span><Text type="secondary">共 {shownTasks.length} 条</Text></Space>}><Table rowKey="id" dataSource={shownTasks} columns={columns} scroll={{ x: records ? 1620 : 1510 }} pagination={{ current: page, pageSize: 8, showSizeChanger: false, total: shownTasks.length, onChange: setPage }} locale={{ emptyText: <Empty description={records ? "暂无符合条件的历史记录" : "暂无待处理任务；不必为每位用户生成跟进"} /> }} /></Card>
    <AutoScheduledTaskDrawer task={task} state={state} startEditing={editOnOpen} onClose={() => setSelectedId(null)} onEdit={edit} onCancel={cancel} onConfirm={confirm} onSimulate={simulate} onViewConversation={(item) => onViewConversation({ ...item, name: item.user })} />
  </div>;
}
