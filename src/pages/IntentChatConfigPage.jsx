import React, { useEffect, useRef, useState } from "react";
import { Alert, App, Avatar, Button, Card, Checkbox, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Switch, Table, Tag, TimePicker, Typography } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined, ExperimentOutlined, RobotOutlined, SaveOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import WecomRoleSelect from "../components/WecomRoleSelect";
import { appendIntentChatRequirements, changeIntentChatDraft, chatStageOptions, chatThresholdOptions, createIntentChatState, enableIntentChatDemo, intentChatDataSourceOptions, intentChatStorageKey, intentPromptMaxLength, migrateIntentChatDraft, setIntentChatTaskEnabled, tryIntentChatDemo, validateIntentChatDraft } from "../data/intentChatConfig";

const { Title, Text, Paragraph } = Typography;
const freshState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(intentChatStorageKey));
    if (saved?.draft) saved.draft = migrateIntentChatDraft(saved.draft);
    if (saved?.active?.config) saved.active.config = migrateIntentChatDraft(saved.active.config);
    if (saved?.draft && !validateIntentChatDraft(saved.draft) && Array.isArray(saved.messages) && saved.messages.every((item) => ["user", "assistant"].includes(item.role) && typeof item.content === "string") && (!saved.active || (!validateIntentChatDraft(saved.active.config) && Number.isInteger(saved.active.version)))) return { ...saved, trial: null, taskEnabled: saved.taskEnabled === true && Boolean(saved.active) };
  } catch { /* 未保存或存储不可用时使用演示初始状态 */ }
  return createIntentChatState();
};

export default function IntentChatConfigPage({ onBack = () => {}, renderHeader }) {
  const { message } = App.useApp();
  const [state, setState] = useState(freshState);
  const [input, setInput] = useState("");
  const [trialOpen, setTrialOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const chatEnd = useRef(null);
  const chatPanel = useRef(null);
  const draft = state.draft;
  useEffect(() => { chatEnd.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [state.messages.length]);
  useEffect(() => {
    let frame;
    const measure = () => {
      const panel = chatPanel.current;
      if (!panel || !panel.getClientRects().length) return;
      const offset = Math.max(16, (document.querySelector(".app-header")?.getBoundingClientRect().bottom || 72) + 16);
      panel.style.setProperty("--intent-chat-sticky-top", `${offset}px`);
      panel.style.setProperty("--intent-chat-panel-height", `${Math.max(320, window.innerHeight - Math.max(panel.getBoundingClientRect().top, offset) - 16)}px`);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    if (chatPanel.current) observer?.observe(chatPanel.current);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener("resize", schedule); window.removeEventListener("scroll", schedule, true); };
  }, []);
  const change = (patch) => {
    setState((current) => changeIntentChatDraft(current, { ...current.draft, ...patch }));
    setSaved(false);
  };
  const persist = (next) => {
    try {
      localStorage.setItem(intentChatStorageKey, JSON.stringify({ ...next, trial: null }));
      setSaved(true);
      return true;
    } catch { message.warning("本地存储不可用，内容仅保留在当前页面"); return false; }
  };
  const save = () => {
    const error = validateIntentChatDraft(draft);
    if (error) return message.warning(error);
    if (persist(state)) message.success("方案二草稿已独立保存，不影响方案一");
  };
  const toggleTask = (enabled) => {
    try {
      const next = setIntentChatTaskEnabled(state, enabled);
      setState(next);
      const incompleteDraft = Boolean(validateIntentChatDraft(next.draft));
      persist(incompleteDraft ? { ...next, draft: next.active.config } : next);
      if (incompleteDraft) setSaved(false);
      message.success(enabled ? "模拟定时分析已开启，不执行真实任务" : "模拟定时分析已关闭，配置和已有结果保留");
    } catch (error) { message.warning(error.message); }
  };
  const send = (text = input) => {
    const content = text.trim();
    if (!content) return;
    let prompt;
    try { prompt = appendIntentChatRequirements(state.draft.prompt, `\n## 沟通补充要求（待确认）\n${content}`); }
    catch (error) { return message.warning(error.message); }
    setState((current) => ({
      ...changeIntentChatDraft(current, { ...current.draft, prompt }),
      messages: [...current.messages, { role: "user", content }, { role: "assistant", content: "已将本条需求记录到左侧「完整分档提示词」末尾，标记为待确认。当前为本地演示，尚未通过 AI 自动归纳合并；你可直接编辑左侧全文，确认各档标准与输出要求后再保存、试跑。" }]
    }));
    setInput(""); setSaved(false);
  };
  const loadExample = () => {
    setState((current) => ({ ...changeIntentChatDraft(current, { ...current.draft, prompt: createIntentChatState().draft.prompt }), messages: [...current.messages, { role: "assistant", content: "已加载完整分档提示词示例（非 AI 生成），包含任务目标、数据来源、分档标准、标签、异常处理和输出要求。请直接编辑左侧全文，确认后保存。" }] }));
    setSaved(false);
  };
  const trial = () => {
    try { setState(tryIntentChatDemo(state)); setTrialOpen(true); }
    catch (error) { message.warning(error.message); }
  };
  const enable = () => {
    try {
      const next = enableIntentChatDemo(state);
      setState(next);
      persist(next);
      setTrialOpen(false);
      message.success("方案二已模拟启用，不会执行任务或更新正式标签");
    } catch (error) { message.warning(error.message); }
  };
  const headerActions = <Space wrap><Tag color={state.taskEnabled ? "blue" : "default"}>{state.active ? `模拟${state.taskEnabled ? "已启用" : "已停用"} v${state.active.version}` : "对比原型 · 未启用"}</Tag><Button icon={<ExperimentOutlined />} onClick={trial}>模拟小样本试跑</Button><Button type="primary" icon={<SaveOutlined />} onClick={save}>保存草稿</Button></Space>;
  return <div className="intent-chat-config-page">
    {renderHeader ? renderHeader(headerActions) : <div className="user-insight-config-header">
      <div><Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>返回意向度分析</Button><Title level={3}>AI 对话配置</Title><Paragraph type="secondary">通过对话梳理业务标准，确认方案后进行分层分析。每家企业一套方案。</Paragraph></div>
      {headerActions}
    </div>}
    <div className="intent-chat-workspace">
    <div className="intent-chat-config-column">
    <Card size="small" className="intent-chat-settings" title="执行与分析范围" extra={<Space size={8}><Text>启用定时分析</Text><Switch aria-label="方案二模拟定时分析" checked={state.taskEnabled} checkedChildren="开启" unCheckedChildren="关闭" onChange={toggleTask} /></Space>}>
      <Form layout="horizontal" labelAlign="left" labelCol={{ flex: "84px" }} wrapperCol={{ flex: "auto" }} colon={false}>
      <Row gutter={16} aria-label="选择执行节奏">
        <Col xs={24} md={12}><Form.Item label="执行节奏"><Select aria-label="方案二每日执行次数" value={draft.dailyTimes.length} options={[{ value: 1, label: "每天1次" }, { value: 2, label: "每天2次" }]} onChange={(count) => change({ dailyTimes: count === 1 ? [draft.dailyTimes[0]] : [draft.dailyTimes[0], draft.dailyTimes[0] === "18:00" ? "09:00" : "18:00"] })} /></Form.Item></Col>
        {draft.dailyTimes.map((time, index) => <Col xs={24} md={12} key={index}><Form.Item label={`执行时间${draft.dailyTimes.length > 1 ? index + 1 : ""}`}><TimePicker aria-label={`方案二执行时间${index + 1}`} allowClear={false} format="HH:mm" value={dayjs(`2000-01-01T${time}:00`)} onChange={(value) => value && change({ dailyTimes: draft.dailyTimes.map((item, i) => i === index ? value.format("HH:mm") : item) })} /></Form.Item></Col>)}
      </Row>
      <Row gutter={16} aria-label="分析用户范围">
        <Col xs={24} md={12}><Form.Item label="企微角色"><WecomRoleSelect value={draft.wecomRole} onChange={(wecomRole) => change({ wecomRole })} /></Form.Item></Col>
        <Col xs={24} md={12}><Form.Item label="用户阶段" tooltip="阶段选项当前使用观心实验室演示数据；正式接入后读取当前企业的业务阶段。"><Select mode="multiple" maxTagCount="responsive" aria-label="方案二用户阶段" value={draft.stages} onChange={(stages) => change({ stages })} options={chatStageOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
        <Col xs={24} md={12}><Form.Item label="托管状态"><Select value={draft.hostingStatus} onChange={(hostingStatus) => change({ hostingStatus })} options={["不限", "已托管", "未托管"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
        {[{ key: "historicalChatThreshold", label: "历史聊天数" }, { key: "todayChatThreshold", label: "当天聊天数" }].map((field) => <Col xs={24} md={12} key={field.key}><Form.Item label={field.label}><Select value={draft[field.key]} onChange={(value) => change({ [field.key]: value })} options={chatThresholdOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>)}
        <Col span={24}><Form.Item label="数据来源" tooltip="仅使用已勾选的数据来源，优先于提示词中的数据描述；平台数据包含用户档案与聊天记录，业务数据来自甲方业务系统。至少选择一项。"><Checkbox.Group aria-label="方案二数据来源" value={draft.dataSources} options={intentChatDataSourceOptions} onChange={(dataSources) => change({ dataSources })} /></Form.Item></Col>
      </Row>
      </Form>
    </Card>
      <Card className="intent-chat-plan" title="完整分档提示词" extra={<Tag color="gold">{saved ? "草稿已保存" : "可编辑草稿"}</Tag>}>
        <Input.TextArea className="intent-chat-prompt-editor" aria-label="完整分档提示词" value={draft.prompt} maxLength={intentPromptMaxLength} showCount placeholder="在这里整理并编辑最终确认的完整分档提示词……" onChange={(event) => change({ prompt: event.target.value })} />
      </Card>
    </div>
      <Card ref={chatPanel} className="intent-chat-assistant" title={<Space><RobotOutlined /><span>意向分层配置助手</span><Tag>模拟对话</Tag></Space>} extra={<Popconfirm title="替换当前提示词为示例？" description="会替换当前编辑内容，执行时间与用户范围不变。" onConfirm={loadExample} okText="替换" cancelText="取消"><Button type="link">加载示例提示词</Button></Popconfirm>}>
        <div className="intent-chat-messages" role="log" aria-label="方案配置对话" aria-live="polite">
          {state.messages.map((item, index) => <div className={`intent-chat-message intent-chat-message-${item.role}`} key={index}><Avatar size={30} icon={item.role === "user" ? <UserOutlined /> : <RobotOutlined />} /><div><Text type="secondary">{item.role === "user" ? "我" : "配置助手 · 演示"}</Text><div className="intent-chat-bubble">{item.content}</div></div></div>)}
          <div ref={chatEnd} />
        </div>
        <div className="intent-chat-composer"><Input.TextArea aria-label="输入分档要求" value={input} maxLength={2000} showCount autoSize={{ minRows: 3, maxRows: 6 }} placeholder="描述业务目标、分档标准，或补充需要调整的要求……" onChange={(event) => setInput(event.target.value)} /><div className="intent-chat-send"><Text type="secondary">发送后记录要求，演示不会自动解析规则。</Text><Button type="primary" icon={<SendOutlined />} disabled={!input.trim()} onClick={() => send()}>发送</Button></div></div>
      </Card>
    </div>
    <Modal title="小样本试跑 · 演示结果" open={trialOpen} onCancel={() => setTrialOpen(false)} footer={<Space><Button onClick={() => setTrialOpen(false)}>返回配置</Button><Button type="primary" icon={<CheckCircleOutlined />} disabled={!state.trial} onClick={enable}>确认模拟启用</Button></Space>} width={900}>
      <Alert showIcon type="warning" message="以下为固定演示样例，并非真实 AI 按当前规则的判断；不按筛选范围真实取数，不写入用户标签。" />
      <Table rowKey="id" size="small" dataSource={state.trial?.rows || []} pagination={false} scroll={{ x: 650 }} columns={[{ title: "用户", dataIndex: "name", width: 90 }, { title: "拟分档标签", dataIndex: "tag", width: 160, render: (value) => <Tag color={value === "待判断" ? "warning" : "blue"}>{value}</Tag> }, { title: "判断依据", dataIndex: "reason" }, { title: "数据来源", dataIndex: "source", width: 180 }]} />
    </Modal>
  </div>;
}
