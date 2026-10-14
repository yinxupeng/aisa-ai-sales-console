import React, { useMemo, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Table,
  Tag,
  Typography
} from "antd";
import {
  ArrowLeftOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  ThunderboltOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;

const eventOptions = [
  { value: "assessment_completed", label: "心理评测完成" },
  { value: "course_lesson_completed", label: "课程学习任务完成" },
  { value: "customer_message_received", label: "用户发送新消息" },
  { value: "risk_signal_detected", label: "识别到需人工关注信号" }
];

const actionOptions = [
  { value: "generate_and_send", label: "生成 AI 反馈并发送给用户" },
  { value: "generate_only", label: "生成反馈并创建人工跟进任务" },
  { value: "human_review", label: "生成反馈后先由人工审核" }
];

const initialConfig = {
  id: "TRG-001",
  name: "心理评测完成后发送反馈",
  event: "assessment_completed",
  assessmentTypes: ["家庭情绪观察评估", "儿童情绪与行为筛查"],
  userScope: "all",
  hostingScope: "hosted_only",
  action: "generate_and_send",
  sendTiming: "immediate",
  quietStart: "21:00",
  quietEnd: "09:00",
  requireHumanForRisk: true,
  sendOnlyHosted: true,
  retryLimit: 2,
  enabled: true,
  updatedAt: "2026-10-12 16:00"
};

const createDefaults = {
  name: "",
  event: "assessment_completed",
  assessmentTypes: ["家庭情绪观察评估"],
  lessonStages: ["第三节课", "第四节课", "第5节课"],
  messageThreshold: 1,
  riskLevels: ["需关注"],
  userScope: "all",
  hostingScope: "hosted_only",
  action: "generate_and_send",
  sendTiming: "immediate",
  quietStart: "21:00",
  quietEnd: "09:00",
  requireHumanForRisk: true,
  sendOnlyHosted: true,
  retryLimit: 2,
  enabled: true
};

const seedConfigs = [
  initialConfig,
  { ...createDefaults, id: "TRG-002", name: "第三节课完成后收集学习感受", event: "course_lesson_completed", lessonStages: ["第三节课"], action: "generate_and_send", sendTiming: "respect_quiet", updatedAt: "2026-10-12 15:30" },
  { ...createDefaults, id: "TRG-003", name: "家长主动回复后生成跟进建议", event: "customer_message_received", messageThreshold: 3, action: "generate_only", updatedAt: "2026-10-12 14:20" },
  { ...createDefaults, id: "TRG-004", name: "关注信号出现后提醒人工介入", event: "risk_signal_detected", riskLevels: ["高风险", "紧急风险"], hostingScope: "all", action: "generate_only", updatedAt: "2026-10-12 13:10" },
  { ...createDefaults, id: "TRG-005", name: "亲子沟通自评完成后人工解读", assessmentTypes: ["亲子沟通状态自评"], action: "human_review", updatedAt: "2026-10-12 11:45" },
  { ...createDefaults, id: "TRG-006", name: "第五节课完成后安排课程回访", event: "course_lesson_completed", lessonStages: ["第5节课"], action: "generate_only", enabled: false, updatedAt: "2026-10-11 17:20" }
];

const seedTasks = [
  { id: "EVT-20261012-018", triggerName: "心理评测完成后发送反馈", eventType: "心理评测完成", user: "林女士", payload: "家庭情绪观察评估", completedAt: "2026-10-12 15:42", status: "待发送", statusColor: "processing", summary: "评估已提交，正在生成面向家长的结果说明；用户处于第三节课学习阶段。", action: "生成结果摘要并发送 AI 反馈", outcome: "系统已确认评测提交成功，AI反馈内容已生成，等待发送窗口。" },
  { id: "EVT-20261012-017", triggerName: "心理评测完成后发送反馈", eventType: "心理评测完成", user: "周同学家长", payload: "儿童情绪与行为筛查", completedAt: "2026-10-12 14:26", status: "待人工确认", statusColor: "warning", summary: "评估答案包含需要进一步关注的情绪信号，已暂停自动发送并提醒人工跟进。", action: "生成结果摘要并转人工确认", outcome: "检测到需谨慎承接的风险信号，未向用户自动发送解释性结论。" },
  { id: "EVT-20261012-016", triggerName: "心理评测完成后发送反馈", eventType: "心理评测完成", user: "陈女士", payload: "家庭情绪观察评估", completedAt: "2026-10-12 11:08", status: "已发送", statusColor: "success", summary: "已发送温和的评测反馈，并邀请家长结合课程观察记录继续沟通。", action: "生成结果摘要并发送 AI 反馈", outcome: "反馈于 11:09 发送成功，企微会话已记录发送结果。" },
  { id: "EVT-20261011-009", triggerName: "心理评测完成后发送反馈", eventType: "心理评测完成", user: "赵女士", payload: "儿童情绪与行为筛查", completedAt: "2026-10-11 22:13", status: "延迟发送", statusColor: "default", summary: "评测在夜间完成，已加入次日可发送队列，避免打扰家长休息。", action: "生成结果摘要并延迟发送", outcome: "计划在 2026-10-12 09:00 后发送。" },
  { id: "EVT-20261011-008", triggerName: "心理评测完成后发送反馈", eventType: "心理评测完成", user: "王同学家长", payload: "家庭情绪观察评估", completedAt: "2026-10-11 17:31", status: "处理失败", statusColor: "error", summary: "评测完成事件已接收，但关联不到当前企微用户，等待重试并提示运营核验。", action: "生成结果摘要并发送 AI 反馈", outcome: "用户映射缺失：评测用户标识未匹配到企微联系人。" }
];

const eventStatusFilters = ["全部状态", "待发送", "待人工确认", "已发送", "延迟发送", "处理失败"];
const userScopeOptions = [
  { value: "all", label: "当前企微账号下全部用户" },
  { value: "course_users", label: "观心实验室课程用户" }
];
const hostingOptions = [
  { value: "hosted_only", label: "仅已托管用户" },
  { value: "all", label: "不限托管状态" }
];
const assessmentOptions = ["家庭情绪观察评估", "儿童情绪与行为筛查", "亲子沟通状态自评"];
const lessonOptions = ["开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];
const riskOptions = ["需关注", "高风险", "紧急风险"];

function eventName(value) {
  return eventOptions.find((option) => option.value === value)?.label || value;
}

function actionName(value) {
  return actionOptions.find((option) => option.value === value)?.label || value;
}

function formatNow() {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
}

export default function EventTaskTriggerPage() {
  const { message } = App.useApp();
  const [configs, setConfigs] = useState(seedConfigs);
  const [view, setView] = useState("configs");
  const [tasks, setTasks] = useState(seedTasks);
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [selectedTask, setSelectedTask] = useState(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [configDrawerMode, setConfigDrawerMode] = useState("create");
  const [editingConfigId, setEditingConfigId] = useState(null);
  const [draft, setDraft] = useState(createDefaults);
  const [form] = Form.useForm();

  const filteredTasks = useMemo(
    () => statusFilter === "全部状态" ? tasks : tasks.filter((task) => task.status === statusFilter),
    [tasks, statusFilter]
  );
  const defaultEnabledConfig = configs.find((item) => item.enabled);
  const sendDescription = draft.action === "generate_only"
    ? "生成结果后创建人工跟进任务，不会自动向用户发送。"
    : draft.action === "human_review"
      ? "生成结果后进入人工审核，通过后再发送给用户。"
      : draft.sendTiming === "immediate"
        ? "事件命中后立即发送；若处于免打扰时段，则顺延至可发送时间。"
        : `事件命中后生成结果，避开 ${draft.quietStart}–${draft.quietEnd} 免打扰时段发送。`;

  const openCreate = () => {
    const nextDraft = { ...createDefaults };
    form.resetFields();
    form.setFieldsValue(nextDraft);
    setDraft(nextDraft);
    setEditingConfigId(null);
    setConfigDrawerMode("create");
    setConfigDrawerOpen(true);
  };

  const openConfig = (record, mode) => {
    const nextDraft = { ...createDefaults, ...record };
    form.resetFields();
    form.setFieldsValue(nextDraft);
    setDraft(nextDraft);
    setEditingConfigId(record.id);
    setConfigDrawerMode(mode);
    setConfigDrawerOpen(true);
  };

  const handleValuesChange = (_, values) => setDraft((current) => ({ ...current, ...values }));

  const saveConfig = async () => {
    try {
      const values = await form.validateFields();
      const nextConfig = {
        ...draft,
        ...values,
        id: editingConfigId || `TRG-${String(Date.now()).slice(-6)}`,
        enabled: draft.enabled !== false,
        updatedAt: formatNow()
      };
      if (configDrawerMode === "edit") {
        setConfigs((current) => current.map((item) => item.id === editingConfigId ? nextConfig : item));
        message.success("触发任务配置已更新");
      } else {
        setConfigs((current) => [nextConfig, ...current]);
        message.success("触发任务配置已新增");
      }
      setConfigDrawerOpen(false);
    } catch (error) {
      if (error?.errorFields) return;
      message.error("保存失败，请稍后重试");
    }
  };

  const toggleConfig = (id, enabled) => {
    setConfigs((current) => current.map((item) => item.id === id ? { ...item, enabled, updatedAt: formatNow() } : item));
    message.success(enabled ? "触发任务已启用" : "触发任务已停用");
  };

  const deleteConfig = (record) => {
    setConfigs((current) => current.filter((item) => item.id !== record.id));
    message.success("配置已删除，历史事件执行记录已保留");
  };

  const simulateEvent = () => {
    const matchedConfig = defaultEnabledConfig;
    if (!matchedConfig) {
      message.warning("当前没有已启用的触发任务，请先启用一条配置");
      return;
    }
    const waitingForHuman = matchedConfig.action !== "generate_and_send" || matchedConfig.requireHumanForRisk;
    const task = {
      id: `EVT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(tasks.length + 20).padStart(3, "0")}`,
      triggerName: matchedConfig.name,
      eventType: eventName(matchedConfig.event),
      user: "模拟用户 · 许女士",
      payload: matchedConfig.event === "assessment_completed" ? matchedConfig.assessmentTypes?.[0] : "观心实验室课程用户事件",
      completedAt: formatNow(),
      status: waitingForHuman ? "待人工确认" : matchedConfig.sendTiming === "immediate" ? "待发送" : "延迟发送",
      statusColor: waitingForHuman ? "warning" : matchedConfig.sendTiming === "immediate" ? "processing" : "default",
      summary: matchedConfig.requireHumanForRisk ? "模拟事件命中人工介入规则，系统已暂停自动发送并创建人工确认任务。" : `模拟收到“${eventName(matchedConfig.event)}”事件，系统已按触发任务“${matchedConfig.name}”创建后续任务。`,
      action: actionName(matchedConfig.action),
      outcome: "这是原型模拟任务，不会向真实用户发送消息。"
    };
    setTasks((current) => [task, ...current]);
    setSelectedTask(task);
    message.info(`已使用「${matchedConfig.name}」创建模拟任务；不会触达真实用户`);
  };

  const configColumns = [
    { title: "触发任务名称", dataIndex: "name", width: 230, render: (value, record) => <Space direction="vertical" size={0}><Text strong>{value}</Text><Text type="secondary" className="event-trigger-config-id">{record.id}</Text></Space> },
    { title: "触发类型", dataIndex: "event", width: 180, render: (value) => <Tag color="blue">{eventName(value)}</Tag> },
    { title: "执行动作", dataIndex: "action", width: 220, render: (value) => actionName(value) },
    { title: "最近修改", dataIndex: "updatedAt", width: 160 },
    { title: "状态", dataIndex: "enabled", width: 100, render: (value, record) => <Switch checked={value} checkedChildren="启用" unCheckedChildren="停用" onChange={(checked) => toggleConfig(record.id, checked)} /> },
    {
      title: "操作",
      key: "operations",
      width: 170,
      fixed: "right",
      render: (_, record) => <Space size={4}>
        <Button type="link" icon={<EyeOutlined />} onClick={() => openConfig(record, "view")}>查看</Button>
        <Button type="link" onClick={() => openConfig(record, "edit")}>编辑</Button>
        <Popconfirm title="确定删除这条触发配置吗？" description="已产生的事件任务记录不会删除。" okText="删除" cancelText="取消" onConfirm={() => deleteConfig(record)}>
          <Button type="link" danger icon={<DeleteOutlined />} aria-label={`删除${record.name}`} />
        </Popconfirm>
      </Space>
    }
  ];

  const taskColumns = [
    { title: "事件任务", dataIndex: "id", width: 190, render: (value) => <Text strong>{value}</Text> },
    { title: "触发配置", dataIndex: "triggerName", width: 220 },
    { title: "触发类型", dataIndex: "eventType", width: 150, render: (value) => <Tag>{value}</Tag> },
    { title: "用户", dataIndex: "user", width: 150 },
    { title: "事件内容", dataIndex: "payload", width: 190 },
    { title: "事件时间", dataIndex: "completedAt", width: 160 },
    { title: "任务状态", dataIndex: "status", width: 120, render: (value, record) => <Tag color={record.statusColor}>{value}</Tag> },
    { title: "操作", key: "action", width: 100, fixed: "right", render: (_, record) => <Button type="link" onClick={() => setSelectedTask(record)}>查看详情</Button> }
  ];

  const draftFinalStep = draft.action === "generate_only"
    ? { title: "等待人工跟进", description: "创建人工任务，不自动发送" }
    : draft.action === "human_review"
      ? { title: "等待人工审核", description: "审核通过后再发送给用户" }
      : draft.requireHumanForRisk
        ? { title: "风险识别与人工分流", description: "发现风险信号则暂停发送并提醒人工" }
        : { title: "发送 AI 反馈", description: "按发送规则推送到企微会话" };

  return (
    <div className="event-trigger-page">
      <div className="event-trigger-header">
        <div>
          {view === "records" ? <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => setView("configs")}>返回事件任务触发</Button> : null}
          <Title level={3}>{view === "records" ? "事件任务记录" : "事件任务触发"}</Title>
          <Paragraph type="secondary">{view === "records" ? "查看每次事件触发的处理结果与命中的任务配置。" : "按业务场景维护多条事件触发配置；事件真正发生时，系统才创建执行任务。"}</Paragraph>
        </div>
        {view === "configs" ? <Space wrap>
          <Tag color="blue" icon={<ThunderboltOutlined />}>事件驱动 · 非定时发送</Tag>
          <Button icon={<HistoryOutlined />} onClick={() => setView("records")}>事件任务记录</Button>
          <Button icon={<PlayCircleOutlined />} onClick={simulateEvent}>模拟触发</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增触发任务</Button>
        </Space> : null}
      </div>

      {view === "configs" ? <Alert
        showIcon
        type="info"
        message="触发逻辑"
        description="例如评测完成时间不确定，不需要预先创建定时发送任务。评测平台确认提交成功时，系统匹配已启用的触发配置、创建事件任务，再按动作规则发送或转人工。"
      /> : null}

      {view === "configs" ? <Card
        className="event-trigger-config-card"
        title={<Space><ThunderboltOutlined /><span>触发任务配置</span><Text type="secondary">{configs.length} 条</Text></Space>}
        extra={<Text type="secondary">删除配置不会清除已产生的执行记录</Text>}
      >
        <Table
          rowKey="id"
          columns={configColumns}
          dataSource={configs}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          scroll={{ x: 1050 }}
          locale={{ emptyText: "还没有触发任务，点击右上角新增一条配置" }}
        />
      </Card> : null}

      {view === "records" ? <Card
        className="event-trigger-records-card"
        title={<Space><span>事件任务记录</span><Text type="secondary">{filteredTasks.length} 条</Text></Space>}
        extra={<Select value={statusFilter} onChange={setStatusFilter} options={eventStatusFilters.map((value) => ({ value, label: value }))} style={{ width: 140 }} />}
      >
        <Table rowKey="id" columns={taskColumns} dataSource={filteredTasks} pagination={{ pageSize: 5, showSizeChanger: false }} scroll={{ x: 1270 }} onRow={(record) => ({ onClick: () => setSelectedTask(record), style: { cursor: "pointer" } })} />
      </Card> : null}

      <Drawer
        title={configDrawerMode === "create" ? "新增触发任务" : configDrawerMode === "edit" ? "编辑触发任务" : "触发任务配置详情"}
        width={760}
        open={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
        destroyOnHidden
        footer={<Space className="event-trigger-drawer-footer">
          <Button onClick={() => setConfigDrawerOpen(false)}>关闭</Button>
          {configDrawerMode === "view" ? <Button type="primary" onClick={() => openConfig(configs.find((item) => item.id === editingConfigId), "edit")}>编辑配置</Button> : <Button type="primary" icon={<SaveOutlined />} onClick={saveConfig}>保存配置</Button>}
        </Space>}
      >
        <Form form={form} layout="vertical" initialValues={createDefaults} disabled={configDrawerMode === "view"} onValuesChange={handleValuesChange}>
          <Form.Item label="任务名称" name="name" rules={[{ required: true, whitespace: true, message: "请填写触发任务名称" }]}>
            <Input maxLength={40} placeholder="例如：评测完成后发送结果反馈" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="触发类型" name="event" rules={[{ required: true, message: "请选择触发类型" }]}>
                <Select options={eventOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="执行动作" name="action" rules={[{ required: true, message: "请选择执行动作" }]}>
                <Select options={actionOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Card size="small" className="event-trigger-condition-card" title="触发条件">
            {draft.event === "assessment_completed" ? <Form.Item label="纳入评测" name="assessmentTypes" rules={[{ required: true, type: "array", min: 1, message: "至少选择一种心理评测" }]}>
              <Select mode="multiple" options={assessmentOptions.map((value) => ({ value, label: value }))} />
            </Form.Item> : null}
            {draft.event === "course_lesson_completed" ? <Form.Item label="适用课程阶段" name="lessonStages" rules={[{ required: true, type: "array", min: 1, message: "至少选择一个课程阶段" }]}>
              <Select mode="multiple" options={lessonOptions.map((value) => ({ value, label: value }))} />
            </Form.Item> : null}
            {draft.event === "customer_message_received" ? <Form.Item label="触发口径" name="messageThreshold" rules={[{ required: true, type: "number", min: 1, message: "请输入有效消息条数" }]}>
              <InputNumber min={1} max={20} addonAfter="条及以上" style={{ width: "100%" }} />
            </Form.Item> : null}
            {draft.event === "risk_signal_detected" ? <Form.Item label="需介入等级" name="riskLevels" rules={[{ required: true, type: "array", min: 1, message: "至少选择一个风险等级" }]}>
              <Checkbox.Group options={riskOptions.map((value) => ({ value, label: value }))} />
            </Form.Item> : null}
            <Row gutter={16}>
              <Col xs={24} md={12}><Form.Item label="用户范围" name="userScope"><Select options={userScopeOptions} /></Form.Item></Col>
              <Col xs={24} md={12}><Form.Item label="托管状态" name="hostingScope"><Select options={hostingOptions} /></Form.Item></Col>
            </Row>
          </Card>

          <Divider orientation="left" plain>任务执行规则</Divider>
          {draft.action === "generate_and_send" ? <>
            <Form.Item label="发送时机" name="sendTiming">
              <Radio.Group className="event-trigger-radio-group" optionType="button" buttonStyle="solid" options={[{ value: "immediate", label: "立即发送" }, { value: "respect_quiet", label: "避开免打扰时段" }]} />
            </Form.Item>
            {draft.sendTiming === "respect_quiet" ? <Row gutter={16}>
              <Col xs={24} md={12}><Form.Item label="免打扰开始时间" name="quietStart"><Select options={Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`).map((value) => ({ value, label: value }))} /></Form.Item></Col>
              <Col xs={24} md={12}><Form.Item label="免打扰结束时间" name="quietEnd"><Select options={Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`).map((value) => ({ value, label: value }))} /></Form.Item></Col>
            </Row> : null}
          </> : null}
          <Form.Item label="失败重试次数" name="retryLimit"><InputNumber min={0} max={5} addonAfter="次" /></Form.Item>
          <Space direction="vertical" size={12} className="event-trigger-safety-options">
            <Form.Item name="requireHumanForRisk" valuePropName="checked" noStyle><Checkbox>识别到需人工关注信号时，暂停自动发送并转人工确认</Checkbox></Form.Item>
            <Form.Item name="sendOnlyHosted" valuePropName="checked" noStyle><Checkbox>仅对已托管用户自动执行，未托管用户创建人工跟进任务</Checkbox></Form.Item>
          </Space>
        </Form>

        <Divider orientation="left" plain>执行效果预览</Divider>
        <div className="event-trigger-drawer-preview">
          <Steps direction="vertical" size="small" current={2} items={[
            { title: "接收业务事件", description: `${eventName(draft.event)}时创建任务`, status: "finish" },
            { title: "匹配触发条件", description: `${draft.name || "未命名任务"} · ${draft.userScope === "all" ? "当前企微账号全部用户" : "观心实验室课程用户"}`, status: "finish" },
            { title: "执行配置动作", description: actionName(draft.action), status: "process" },
            { ...draftFinalStep, status: "wait" }
          ]} />
          <div className="event-trigger-send-preview"><ClockCircleOutlined /><div><Text strong>处理说明</Text><Paragraph>{sendDescription}</Paragraph></div></div>
        </div>
        <div className="event-trigger-safety-note"><UserSwitchOutlined /><span>儿童心理健康场景下，AI 不做诊断、不承诺疗效；出现需关注信号时由人工核实和跟进。</span></div>
      </Drawer>

      <Drawer title={selectedTask ? `事件任务详情 · ${selectedTask.id}` : "事件任务详情"} width={560} open={Boolean(selectedTask)} onClose={() => setSelectedTask(null)}>
        {selectedTask ? <Space direction="vertical" size={18} className="event-trigger-task-detail">
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="任务状态"><Tag color={selectedTask.statusColor}>{selectedTask.status}</Tag></Descriptions.Item>
            <Descriptions.Item label="触发配置">{selectedTask.triggerName || "—"}</Descriptions.Item>
            <Descriptions.Item label="触发类型">{selectedTask.eventType || "—"}</Descriptions.Item>
            <Descriptions.Item label="用户">{selectedTask.user}</Descriptions.Item>
            <Descriptions.Item label="事件内容">{selectedTask.payload || "—"}</Descriptions.Item>
            <Descriptions.Item label="事件时间">{selectedTask.completedAt}</Descriptions.Item>
            <Descriptions.Item label="命中动作">{selectedTask.action}</Descriptions.Item>
            <Descriptions.Item label="处理结果">{selectedTask.outcome}</Descriptions.Item>
          </Descriptions>
          <Card size="small" title="AI处理摘要"><Paragraph>{selectedTask.summary}</Paragraph></Card>
          <Alert type="warning" showIcon message="心理健康沟通安全提示" description="AI反馈仅用于辅助沟通，不构成诊断或治疗建议；遇到风险信号时由人工核实和跟进。" />
        </Space> : null}
      </Drawer>
    </div>
  );
}
