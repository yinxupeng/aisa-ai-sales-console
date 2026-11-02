import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Descriptions, Drawer, Input, Popconfirm, Select, Space, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { autoStatusColors, autoStatusLabels, checkAutoTask, formatAutoTime, openAutoStatuses } from "../domain/autoFollowup";

const { Paragraph, Text } = Typography;
export const autoDemoScenarios = [
  ["unchanged", "保持当前状态"], ["reply", "家长在发送前回复"], ["manual-task", "人工新增同时间任务"],
  ["human", "人工已主动沟通"], ["takeover", "人工已接管"], ["risk", "发现需人工关注信号"],
  ["refused", "用户拒绝联系"], ["resolved", "话题已解决"], ["failed", "模拟发送失败"]
].map(([value, label]) => ({ value, label }));

export default function AutoScheduledTaskDrawer({ task, state, onClose, onEdit, onCancel, onConfirm, onViewConversation, onSimulate, startEditing = false }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");
  const [time, setTime] = useState(null);
  const [scenario, setScenario] = useState("unchanged");
  useEffect(() => {
    setEditing(startEditing); setContent(task?.content || ""); setTime(task ? dayjs(formatAutoTime(task.plannedAt)) : null); setScenario("unchanged");
  }, [task?.id, startEditing]);
  if (!task) return null;
  const active = openAutoStatuses.includes(task.status);
  const user = state.users.find((item) => item.id === task.userId && item.accountKey === task.accountKey);
  const result = active ? checkAutoTask(state, task, state.now) : null;
  const save = () => {
    if (onEdit(task.id, { content, plannedAt: time ? `${time.format("YYYY-MM-DDTHH:mm")}:00+08:00` : "" })) setEditing(false);
  };
  return <Drawer title={<Space><span>{task.user}的自动跟进任务</span><Tag color={autoStatusColors[task.status]}>{autoStatusLabels[task.status]}</Tag></Space>} open onClose={onClose} size={660} className="auto-task-drawer" footer={<Space wrap>
    <Button onClick={() => onViewConversation(task)}>查看聊天</Button>
    {active ? <>
      {editing ? <><Button onClick={() => setEditing(false)}>放弃修改</Button><Button type="primary" onClick={save}>保存修改</Button></> : <Button onClick={() => { setContent(task.content); setTime(dayjs(formatAutoTime(task.plannedAt))); setEditing(true); }}>编辑任务</Button>}
      {task.status === "review" && !editing ? <Button type="primary" disabled={["cancel", "pause"].includes(result?.outcome)} onClick={() => onConfirm(task.id)}>确认发送计划</Button> : null}
      <Popconfirm title="取消这条AI跟进任务？" onConfirm={() => onCancel(task.id)} okText="取消任务" cancelText="保留"><Button danger>取消任务</Button></Popconfirm>
    </> : null}
  </Space>}>
    <div className="auto-task-detail-stack">
      <Descriptions size="small" bordered column={1} items={[
        { key: "account", label: "所属企微账号", children: task.accountName }, { key: "stage", label: active ? "当前阶段" : "任务生成时阶段", children: active ? user?.stage || task.stage : task.stage },
        { key: "purpose", label: "跟进目的", children: task.purpose }, { key: "created", label: "创建时间", children: formatAutoTime(task.createdAt) },
        { key: "scheduled", label: "计划发送时间", children: editing ? <DatePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" value={time} onChange={setTime} allowClear={false} /> : formatAutoTime(task.plannedAt) },
        { key: "expiry", label: "失效时间", children: formatAutoTime(task.expiresAt) },
        ...(task.actualSentAt ? [{ key: "sent", label: "实际发送时间", children: formatAutoTime(task.actualSentAt) }] : [])
      ]} />
      <Card size="small" title="生成依据">{task.evidence.map((item, index) => <div key={index} className="auto-task-evidence"><Text type="secondary">用户消息 · {formatAutoTime(item.at)}</Text><Paragraph>“{item.text}”</Paragraph></div>)}<Text>根据未解决的课程或亲子沟通话题安排一次低压力跟进，不假定家长此刻方便。</Text></Card>
      <Card size="small" title={task.status === "sent" ? "实际发送内容（模拟）" : "拟发送内容"}>{editing ? <Input.TextArea value={content} onChange={(event) => setContent(event.target.value)} maxLength={1000} showCount autoSize={{ minRows: 4, maxRows: 8 }} /> : <Paragraph className="auto-task-content">{task.actualContent || task.content}</Paragraph>}</Card>
      {active && !editing ? <Card size="small" title="执行流程演示" className="auto-task-demo-card"><Space orientation="vertical" size={12} className="auto-task-full-width"><Text type="secondary">选择发送前的情形，将演示时钟推进到不早于计划时间再检查；不会发送真实企微消息。</Text><Select aria-label="模拟执行场景" value={scenario} options={autoDemoScenarios} onChange={setScenario} /><Button onClick={() => onSimulate(task.id, scenario)}>模拟到期执行</Button></Space></Card> : null}
    </div>
  </Drawer>;
}
