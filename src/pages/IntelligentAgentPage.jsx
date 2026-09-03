import React, { useState, useEffect } from "react";
import {
  App as AntApp,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  agents,
  agentTools,
  humanizationStrategyOptions,
  knowledgeBases,
  managedWecomAccounts,
  strategies
} from "../data/appData";
import { lifecycleStages } from "../data/conversations";
import {
  KnowledgeResourcePickerModal,
  buildKnowledgeResourceRows,
  getKnowledgeBaseKeysFromResources
} from "../components/KnowledgeResourcePickerModal";

const { Text, Title } = Typography;

function PanelTitle({ title, desc, extra, before }) {
  return (
    <div className="panel-title">
      <div className={before ? "panel-title-main with-before" : "panel-title-main"}>
        {before ? <div className="panel-title-before">{before}</div> : null}
        <div>
          <Title level={4}>{title}</Title>
          {desc ? <Text type="secondary">{desc}</Text> : null}
        </div>
      </div>
      {extra ? <Space wrap>{extra}</Space> : null}
    </div>
  );
}

function IntelligentAgentPage() {
  const { message } = AntApp.useApp();
  const createDefaultModelConfig = (item = {}) => ({
    provider: item.modelConfig?.provider || "DASHSCOPE",
    model: item.modelConfig?.model || "qwen3.5-omni-flash",
    baseUrl: item.modelConfig?.baseUrl || "https://dashscope.aliyuncs.com",
    maxTokens: item.modelConfig?.maxTokens || 2048,
    temperature: item.modelConfig?.temperature ?? 0.7,
    topP: item.modelConfig?.topP ?? 0.9,
    frequencyPenalty: item.modelConfig?.frequencyPenalty ?? 0,
    presencePenalty: item.modelConfig?.presencePenalty ?? 0,
    maxIterations: item.modelConfig?.maxIterations || 10
  });
  const createDefaultPrompt = (item = {}) => item.prompt || `# ${item.name || "智能体"}系统提示词

你是企业微信场景下的AI销售智能体，需要围绕客户当前生命周期阶段完成沟通。

## 角色定位
${item.description || item.roleDescription || "根据所属角色配置完成客户接待、需求确认、产品推荐和后续跟进。"}

## 执行要求
1. 先理解客户意图，再选择合适的工具或 Skill。
2. 回答要自然、克制、专业，避免过度承诺。
3. 涉及价格、交付、合同、隐私等敏感问题时优先转人工确认。
4. 每轮沟通后判断是否需要推进生命周期阶段。`;
  const getDefaultStageSkill = (stageIndex) => strategies[stageIndex % strategies.length]?.name || strategies[0]?.name;
  const relativeTimeUnitOptions = ["分钟", "小时", "天"].map((value) => ({ value }));
  const taskEffectiveConditionOptions = ["加好友", "agent生效", "加好友自然日"].map((value) => ({ value }));
  const knowledgeBaseOptions = knowledgeBases.map((item) => ({ value: item.key, label: item.name }));
  const createAgentScheduleRule = (index = 0) => ({
    taskEffectiveCondition: index === 0 ? "agent生效" : "加好友",
    operationTaskType: index === 0 ? "客户状态检查，判断是否需要继续跟进或转人工。" : "输入该智能体的定时任务描述",
    taskEffectiveTriggerMode: "延后触发",
    taskEffectiveAmount: index + 1,
    taskEffectiveUnit: "分钟"
  });
  const buildInitialRows = () => agents.map((item, index) => ({
    key: `ia-${item.key}`,
    name: `${item.name}智能体`,
    roleName: item.name,
    positioning: item.type,
    description: item.roleDescription,
    humanizationStrategy: "",
    knowledgeBaseKeys: knowledgeBases.slice(0, Math.min(3, index + 2)).map((base) => base.key),
    agentScheduleRules: [createAgentScheduleRule(0), createAgentScheduleRule(1)],
    boundWecomKeys: managedWecomAccounts.slice(index, index + Math.max(1, item.sales || 1)).map((account) => account.key),
    enabled: item.status === "启用",
    version: "v1",
    modelConfig: createDefaultModelConfig(),
    prompt: createDefaultPrompt(item),
    toolKeys: agentTools.filter((tool) => tool.enabled).slice(0, 3).map((tool) => tool.key),
    stages: lifecycleStages.map((stage, stageIndex) => ({
      key: `ia-${item.key}-stage-${stageIndex + 1}`,
      name: stage.title,
      order: stageIndex + 1,
      description: stage.desc,
      skills: [getDefaultStageSkill(stageIndex)].filter(Boolean),
      enabled: true
    }))
  }));
  const [rows, setRows] = useState(buildInitialRows);
  const [editingAgent, setEditingAgent] = useState(null);
  const [configAgent, setConfigAgent] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [collapsedStageKeys, setCollapsedStageKeys] = useState([]);
  const skillOptions = strategies.map((item) => ({ value: item.name, label: item.name }));
  const roleOptions = agents.map((item) => ({ value: item.name, label: `${item.name}（${item.type}）` }));
  const currentConfigAgent = configAgent ? rows.find((item) => item.key === configAgent.key) || configAgent : null;

  const syncRow = (agentKey, updater) => {
    setRows((items) => items.map((item) => item.key === agentKey ? updater(item) : item));
  };

  const saveAgent = (values) => {
    const role = agents.find((item) => item.type === values.positioning || item.name === editingAgent?.roleName);
    const next = {
      ...(editingAgent || {}),
      ...values,
      roleName: editingAgent?.roleName || role?.name || values.name || "自定义",
      positioning: values.positioning || role?.type || "-",
      description: values.description || role?.roleDescription || "",
      enabled: editingAgent?.enabled ?? true,
      knowledgeBaseKeys: editingAgent?.knowledgeBaseKeys || knowledgeBases.slice(0, 2).map((base) => base.key),
      agentScheduleRules: editingAgent?.agentScheduleRules || [createAgentScheduleRule(0), createAgentScheduleRule(1)],
      boundWecomKeys: editingAgent?.boundWecomKeys || [],
      version: editingAgent?.version || "v1",
      modelConfig: createDefaultModelConfig(editingAgent),
      prompt: createDefaultPrompt({ ...role, ...editingAgent, ...values }),
      toolKeys: editingAgent?.toolKeys || agentTools.filter((tool) => tool.enabled).slice(0, 2).map((tool) => tool.key),
      stages: editingAgent?.stages || lifecycleStages.slice(0, 3).map((stage, index) => ({
        key: `ia-stage-${Date.now()}-${index}`,
        name: stage.title,
        order: index + 1,
        description: stage.desc,
        skills: [getDefaultStageSkill(index)].filter(Boolean),
        enabled: true
      }))
    };
    if (editingAgent?.key) {
      setRows((items) => items.map((item) => item.key === editingAgent.key ? next : item));
    } else {
      setRows((items) => [{ ...next, key: `ia-${Date.now()}` }, ...items]);
    }
    setEditingAgent(null);
  };

  const saveStage = (values) => {
    const knowledgeResourceKeys = values.knowledgeEnabled === false ? [] : (values.knowledgeResourceKeys || []);
    const stage = {
      ...(editingStage.stage || {}),
      ...values,
      key: editingStage.stage?.key || `ia-stage-${Date.now()}`,
      enabled: values.enabled !== false,
      skills: values.skills || [],
      knowledgeEnabled: values.knowledgeEnabled !== false,
      knowledgeResourceKeys,
      knowledgeBaseKeys: getKnowledgeBaseKeysFromResources(knowledgeResourceKeys)
    };
    syncRow(editingStage.agent.key, (agent) => ({
      ...agent,
      stages: editingStage.stage?.key
        ? agent.stages.map((item) => item.key === stage.key ? stage : item)
        : [...agent.stages, { ...stage, order: agent.stages.length + 1 }]
    }));
    setEditingStage(null);
  };

  const getStageTiming = (stageIndex) => {
    const baseDelay = Math.max(1, stageIndex + 1);
    return {
      plannedStart: stageIndex === 0 ? "BASED_ON_FRIEND_ADD 后 1分钟" : "排课时间",
      plannedEnd: stageIndex === 0 ? "agent生效 后 7天" : `agent生效 后 ${stageIndex + 1}天`,
      actualStart: "—（按客户运行）",
      actualEnd: "—（按客户运行）",
      baseDelay
    };
  };
  const buildAgentStrategyTasks = (skill, stage, stageIndex) => {
    const { baseDelay } = getStageTiming(stageIndex);
    if (stageIndex === 0) {
      return [
        { name: "自我介绍", type: "加好友", trigger: "立即触发", enabled: true },
        { name: "追问", type: "加好友", trigger: "加好友 后 1分钟", enabled: true },
        { name: "脑科学", type: "加好友", trigger: "加好友 后 30分钟", enabled: true }
      ];
    }
    return [
      { name: `${skill?.name || "智能体"}启动执行`, type: "agent生效", trigger: `agent生效 后 ${baseDelay}分钟`, enabled: true },
      { name: "客户状态检查", type: "agent生效", trigger: `agent生效 后 ${baseDelay + 2}分钟`, enabled: true },
      { name: "阶段结果同步", type: "agent生效", trigger: `agent生效 后 ${baseDelay + 4}分钟`, enabled: true }
    ];
  };

  const renderStageAgentDetails = (stage, stageIndex) => {
    const names = stage.skills || [];
    if (!names.length) {
      return <Text type="secondary">当前阶段暂未绑定智能体。</Text>;
    }
    return (
      <div className="agent-stage-skill-list">
        {names.map((skillName) => {
          const agent = strategies.find((item) => item.name === skillName) || { name: skillName, type: "消息生成", trigger: "-", channel: "AISA内部能力", input: "-", output: "-", calls: 0, status: "启用" };
          const tasks = buildAgentStrategyTasks(agent, stage, stageIndex);
          return (
            <div className="agent-stage-skill-card" key={skillName}>
              <div className="stage-skill-head">
                <div>
                  <Title level={5}>{agent.name}</Title>
                  <Text type="secondary">{tasks.length} 条策略任务 · {agent.type || "消息生成"} · {agent.trigger || "AISA内部能力"}</Text>
                </div>
                <Space>
                  <Button type="link" danger>移除</Button>
                  <Button type="link">工具配置</Button>
                  <Button type="link">策略任务 &gt;</Button>
                </Space>
              </div>
              <div className="stage-skill-task-list">
                {tasks.map((task, taskIndex) => (
                  <div className="stage-skill-task" key={`${skillName}-${task.name}`}>
                    <Badge count={taskIndex + 1} color="#dbe4f0" />
                    <Text>{task.name}</Text>
                    <Tag>{task.type}</Tag>
                    <Tag color="orange">触发：{task.trigger}</Tag>
                    <Tag color={task.enabled ? "success" : "default"}>{task.enabled ? "启用" : "停用"}</Tag>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const columns = [
    { title: "角色", dataIndex: "roleName", width: 150 },
    { title: "定位", dataIndex: "positioning", width: 150, render: (value) => <Tag color="blue" className="role-count-tag">{value}</Tag> },
    { title: "说明", dataIndex: "description", width: 440, render: (value) => <Text ellipsis={{ tooltip: value }}>{value || "-"}</Text> },
    { title: "流程阶段数", dataIndex: "stages", width: 130, render: (stages = []) => <Tag color="processing" className="role-count-tag">{stages.length} 个</Tag> },
    { title: "已配置企微", dataIndex: "boundWecomKeys", width: 130, render: (items = []) => <Tag color="processing" className="role-count-tag">{items.length} 个</Tag> },
    { title: "状态", dataIndex: "enabled", width: 90, render: (value, record) => <Switch checked={value} onChange={(checked) => syncRow(record.key, (item) => ({ ...item, enabled: checked }))} /> },
    {
      title: "操作",
      fixed: "right",
      width: 220,
      render: (_, record) => (
        <Space size={0} wrap={false}>
          <Button type="link" onClick={() => setEditingAgent(record)}>编辑</Button>
          <Button type="link" onClick={() => setConfigAgent(record)}>流程配置</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除智能体", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];

  if (currentConfigAgent) {
    const skillTabExtra = <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingStage({ agent: currentConfigAgent, stage: null })}>添加阶段</Button>;
    const roleFlowContent = (
      <Space direction="vertical" size={12} className="full-width">
        <div className="agent-skill-tab-head">
          <Text type="secondary">配置该角色的服务流程，每个流程阶段可绑定多个智能体，并配置对应策略任务。</Text>
          {skillTabExtra}
        </div>
        <div className="agent-flow-config">
          {currentConfigAgent.stages.map((stage, index) => {
            const collapsed = collapsedStageKeys.includes(stage.key);
            const timing = getStageTiming(index);
            const boundAgentCount = (stage.skills || []).length;
            return (
              <Card
                key={stage.key}
                className="agent-stage-card"
                size="small"
                title={
                  <div className="agent-stage-title-block">
                    <Space align="start" size={12}>
                      <Badge count={index + 1} color="#7c3aed" />
                      <div>
                        <Title level={4}>流程阶段 {index + 1} · {stage.name}</Title>
                        <Text type="secondary">第 {index + 1} 段 · {boundAgentCount} 个智能体 · 状态 {stage.enabled !== false ? "启用" : "停用"}</Text>
                      </div>
                    </Space>
                  </div>
                }
                extra={
                  <Space>
                    <Button type="link" onClick={() => setCollapsedStageKeys((keys) => collapsed ? keys.filter((key) => key !== stage.key) : [...keys, stage.key])}>{collapsed ? "展开阶段" : "收起阶段"}</Button>
                    <Button onClick={() => setEditingStage({ agent: currentConfigAgent, stage })}>编辑</Button>
                    <Button type="primary" ghost icon={<PlusOutlined />}>添加策略任务</Button>
                    <Button danger onClick={() => syncRow(currentConfigAgent.key, (agent) => ({ ...agent, stages: agent.stages.filter((item) => item.key !== stage.key) }))}>删除</Button>
                  </Space>
                }
              >
                {collapsed ? null : (
                  <>
                    <div className="agent-stage-timing">
                      <Text><Text type="secondary">预计开始：</Text>{timing.plannedStart}</Text>
                      <Text><Text type="secondary">预计结束：</Text>{timing.plannedEnd}</Text>
                      <Text><Text type="secondary">实际开始：</Text>{timing.actualStart}</Text>
                      <Text><Text type="secondary">实际结束：</Text>{timing.actualEnd}</Text>
                    </div>
                    <Text type="secondary">预计时间按首个绑定智能体的规则计算；实际时间按客户运行产生。</Text>
                    {renderStageAgentDetails(stage, index)}
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </Space>
    );
    return (
      <Space direction="vertical" size={16} className="page-stack intelligent-agent-page">
        <Card
          title={
            <PanelTitle
              title={(currentConfigAgent.roleName || currentConfigAgent.name) + " · 角色流程配置"}
              desc="配置该角色按什么服务流程执行，以及每个流程阶段绑定哪个智能体。"
              before={<Button icon={<ArrowLeftOutlined />} onClick={() => setConfigAgent(null)}>返回角色列表</Button>}
              extra={<Button type="primary" icon={<CheckCircleOutlined />} onClick={() => message.success("角色流程配置已保存")}>保存配置</Button>}
            />
          }
        >
          <Tabs
            className="agent-config-tabs role-flow-tabs"
            defaultActiveKey="role-flow"
            items={[{
              key: "role-flow",
              label: "角色流程管理",
              children: roleFlowContent
            }]}
          />
        </Card>
        <IntelligentAgentStageModal
          stage={editingStage?.stage}
          skillOptions={skillOptions}
          open={Boolean(editingStage)}
          onClose={() => setEditingStage(null)}
          onSave={saveStage}
        />
      </Space>
    );
  }

  return (
    <Space direction="vertical" size={16} className="page-stack intelligent-agent-page">
      <Card
        className="role-list-card"
        title={
          <PanelTitle
            title="角色列表"
            desc="管理角色主数据（名称、定位、说明）；定位用于 AI 人设，说明约束业务边界；从「流程配置」进入流程阶段编排。"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingAgent({})}>新增角色</Button>}
          />
        }
      >
        <Table className="admin-table intelligent-agent-table role-table" rowKey="key" columns={columns} dataSource={rows} pagination={false} scroll={{ x: 1120 }} />
      </Card>
      <IntelligentAgentModal agent={editingAgent} onClose={() => setEditingAgent(null)} onSave={saveAgent} />
    </Space>
  );
}

function IntelligentAgentModal({ agent, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (agent) {
      form.resetFields();
      form.setFieldsValue({
        name: agent.name?.replace(/智能体$/, "") || "",
        positioning: agent.positioning || "",
        description: agent.description || "",
        humanizationStrategy: agent.humanizationStrategy
      });
    }
  }, [agent, form]);
  return (
    <Modal
      className="intelligent-agent-edit-modal"
      title={agent?.key ? "编辑智能体" : "新增智能体"}
      open={Boolean(agent)}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={720}
    >
      <Form form={form} className="intelligent-agent-edit-form" layout="vertical" onFinish={onSave}>
        <Form.Item label="智能体名称" name="name" rules={[{ required: true, message: "请输入智能体名称" }]}>
          <Input placeholder="请输入智能体名称" />
        </Form.Item>
        <Form.Item label="定位" name="positioning" tooltip="说明智能体承担的业务定位与沟通边界" rules={[{ required: true, message: "请输入定位" }]}>
          <Input placeholder="请输入智能体定位，例如：线索获取" />
        </Form.Item>
        <Form.Item label="说明" name="description" tooltip="补充智能体的服务目标、语气要求和禁用行为">
          <Input.TextArea
            rows={8}
            placeholder="请描述该智能体在企微沟通中的定位、边界、服务目标和禁用行为。"
          />
        </Form.Item>
        <Form.Item label="拟人化策略" name="humanizationStrategy" tooltip="选择后会套用对应回复风格，不选则保持默认策略">
          <Select allowClear placeholder="不选则不启用拟人化" options={humanizationStrategyOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function IntelligentAgentStageModal({ stage, skillOptions, open, onClose, onSave }) {
  const [form] = Form.useForm();
  const [knowledgePickerOpen, setKnowledgePickerOpen] = useState(false);
  const [knowledgePickerKeys, setKnowledgePickerKeys] = useState([]);
  const [selectedKnowledgeKeys, setSelectedKnowledgeKeys] = useState([]);
  const knowledgeEnabled = Form.useWatch("knowledgeEnabled", form);
  const selectedKnowledgeRows = buildKnowledgeResourceRows().filter((item) => selectedKnowledgeKeys.includes(item.key));
  useEffect(() => {
    if (open) {
      const defaultKnowledgeKeys = stage?.knowledgeResourceKeys || (stage?.knowledgeBaseKeys || knowledgeBases.slice(0, 1).map((base) => base.key)).map((key) => `base:${key}`);
      setSelectedKnowledgeKeys(defaultKnowledgeKeys);
      form.resetFields();
      form.setFieldsValue({
        stageCode: stage?.stageCode || stage?.key || "",
        name: stage?.name || "",
        displayName: stage?.displayName || stage?.name || "",
        order: stage?.order || 0,
        description: stage?.description || "",
        skills: stage?.skills || [],
        enabled: stage?.enabled !== false,
        knowledgeEnabled: stage?.knowledgeEnabled !== false,
        knowledgeResourceKeys: defaultKnowledgeKeys
      });
    }
  }, [open, stage, form]);
  const submitStage = (values) => {
    onSave({
      ...values,
      knowledgeResourceKeys: selectedKnowledgeKeys
    });
  };
  return (
    <>
      <Modal
        title={stage?.key ? "编辑流程阶段" : "新增流程阶段"}
        open={open}
        onCancel={onClose}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={860}
        className="agent-stage-edit-modal"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submitStage}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="阶段标识" name="stageCode" tooltip="用于研发对接流程阶段编码，原型中默认沿用阶段 key。">
                <Select
                  placeholder="请选择阶段标识"
                  options={[
                    { value: stage?.key || "stage-contact", label: stage?.name || "了解阶段" },
                    ...lifecycleStages.map((item) => ({ value: item.title, label: item.title }))
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}><Form.Item label="阶段名称" name="name" rules={[{ required: true, message: "请输入阶段名称" }]}><Input placeholder="例如：了解阶段" /></Form.Item></Col>
            <Col span={24}><Form.Item label="智能体" name="skills"><Select mode="multiple" placeholder="请选择智能体" options={skillOptions} /></Form.Item></Col>
            <Col span={24}><Form.Item label="展示名称" name="displayName"><Input.TextArea rows={2} placeholder="例如：A 类体验课-day0" /></Form.Item></Col>
            <Col span={12}><Form.Item label="排序" name="order"><InputNumber min={0} className="full-input" /></Form.Item></Col>
            <Col span={12}><Form.Item label="阶段状态" name="enabled" valuePropName="checked"><Switch checkedChildren="启用" unCheckedChildren="停用" /></Form.Item></Col>
            <Col span={24}>
              <Form.Item label="知识库检索" name="knowledgeEnabled" valuePropName="checked" className="agent-stage-knowledge-switch">
                <Switch checkedChildren="本阶段启用" unCheckedChildren="停用" />
              </Form.Item>
              {knowledgeEnabled !== false ? (
                <div className="agent-stage-knowledge-config">
                  <div className="agent-stage-knowledge-summary">
                    <Text>{selectedKnowledgeRows.length ? `已选 ${selectedKnowledgeRows.length} 个知识资源` : "未选择知识库文件"}</Text>
                    <div className="agent-stage-knowledge-tags">
                      {selectedKnowledgeRows.length ? selectedKnowledgeRows.map((item) => (
                        <Tag key={item.key}>{item.name}</Tag>
                      )) : <Text type="secondary">点击右侧按钮配置本阶段可检索的知识库文件。</Text>}
                    </div>
                  </div>
                  <Button onClick={() => { setKnowledgePickerKeys(selectedKnowledgeKeys); setKnowledgePickerOpen(true); }}>配置知识库</Button>
                </div>
              ) : null}
            </Col>
            <Col span={24}><Form.Item label="阶段说明" name="description"><Input.TextArea rows={3} placeholder="说明该阶段的沟通目标、执行边界和转入下一阶段条件。" /></Form.Item></Col>
          </Row>
      </Form>
      </Modal>
      <KnowledgeResourcePickerModal
        open={knowledgePickerOpen}
        selectedKeys={knowledgePickerKeys}
        onSelectedChange={setKnowledgePickerKeys}
        onClose={() => setKnowledgePickerOpen(false)}
        onOk={() => {
          const nextKeys = Array.from(new Set(knowledgePickerKeys));
          setSelectedKnowledgeKeys(nextKeys);
          form.setFieldValue("knowledgeResourceKeys", nextKeys);
          setKnowledgePickerOpen(false);
        }}
      />
    </>
  );
}

export { IntelligentAgentPage, IntelligentAgentModal, IntelligentAgentStageModal };
export default IntelligentAgentPage;
