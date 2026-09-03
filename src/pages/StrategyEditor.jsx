import React, { useState, useEffect } from "react";
import {
  App as AntApp,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Upload
} from "antd";
import {
  AudioOutlined,
  BookOutlined,
  CloudSyncOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  LinkOutlined,
  PaperClipOutlined,
  PictureOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  ToolOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import { lifecycleStages } from "../data/conversations";
import {
  agentTools,
  aiSkills,
  customerTagGroups,
  getTagDisplayLabel,
  knowledgeBases
} from "../data/appData";
import {
  CommonTagPickerModal,
  CommonTagSelectButton
} from "../components/CommonTagPicker";
import {
  KnowledgeResourcePickerModal,
  buildKnowledgeResourceRows
} from "../components/KnowledgeResourcePickerModal";
import SkillLogicRichEditor from "../components/SkillLogicRichEditor";

const { Paragraph, Text, Title } = Typography;

function statusTag(status) {
  if (status === "启用" || status === "已连接" || status === true) return <Tag color="success">启用</Tag>;
  if (status === "停用" || status === false) return <Tag>停用</Tag>;
  return <Tag color="processing">{status}</Tag>;
}

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

function StrategyEditor({ skill, onBack }) {
  const { message } = AntApp.useApp();
  const lifecycleOptions = lifecycleStages.map((item) => ({ value: item.title, label: item.title }));
  const knowledgeBaseOptions = knowledgeBases.map((item) => ({ value: item.key, label: item.name }));
  const defaultKnowledgeBaseKeys = skill.name === "19元A类课-第一课"
    ? ["kb-course", "kb-policy", "kb-faq"]
    : skill.name === "19元A类课-课前"
      ? ["kb-course", "kb-faq"]
      : [];
  const defaultToolKeys = agentTools.filter((tool) => tool.enabled).slice(0, 3).map((tool) => tool.key);
  const toolOptions = agentTools.map((tool) => ({ value: tool.key, label: tool.name }));
  const aiSkillOptions = aiSkills.map((item) => ({ value: item.key, label: item.name }));
  const defaultAiSkillKeys = aiSkills.filter((item) => (item.boundAgents || []).includes(skill.name)).map((item) => item.key);
  const fallbackAiSkillKeys = defaultAiSkillKeys.length ? defaultAiSkillKeys : aiSkills.slice(0, 2).map((item) => item.key);
  const modelConfig = skill.modelConfig || {
    provider: "DASHSCOPE",
    model: "qwen3.5-omni-flash",
    baseUrl: "https://dashscope.aliyuncs.com"
  };
  const userTagOptions = [
    "高意向",
    "中意向",
    "低意向",
    "亲子冲突高",
    "家长高焦虑",
    "体验后未报名",
    "适合转人工深聊",
    ...lifecycleOptions.map((item) => item.value)
  ].map((value) => ({ value }));
  const tagAttributeOptions = ["时间标签", "状态标签"].map((value) => ({ value }));
  const relativeTimeUnitOptions = ["分钟", "小时", "天"].map((value) => ({ value }));
  const [form] = Form.useForm();
  const isStrategyAgent = skill.agentCategory === "策略智能体" || skill.type === "策略编排" || skill.name.includes("策略智能体");
  const strategyAgentLogicText = `# 角色定位
你是客户运营策略智能体，不直接给客户发送消息，也不替代会话智能体聊天。你的职责是基于客户档案、企微会话、课程状态、标签、订单和听课数据，输出可执行的销售策略、客户标签、策略提示词和后续触达任务。

# 全局工作原则
1. 所有输出都要服务人工销售和会话智能体决策，不写成直接发送给客户的话术。
2. 判断客户状态时优先使用当前用户表达，其次使用最近会话，再使用历史摘要和客户档案。
3. 涉及标签写入时，只能写入标签库中允许 AI 自动打标的标签组；不确定时输出建议，等待人工确认。
4. 涉及心理、情绪、家庭冲突等敏感内容时，只做沟通策略建议，不做医疗诊断，不承诺效果。
5. 发现强投诉、安全风险、极端表达、退款纠纷、价格承诺争议时，必须输出人工介入建议。

# 可用上下文
- 客户档案：{{customer.profile}}
- 用户标签：{{customer.tags}}
- 最近会话：{{conversation.recent_messages}}
- 历史会话摘要：{{chat_extract}}
- 当前流程阶段：{{role.stage}}
- 当前会话智能体：{{conversation_agent.name}}
- 课程状态：{{course.status}}
- 听课数据：{{course.listen_duration}}
- 订单状态：{{order.status}}
- 企微关系状态：{{wecom.relation_status}}

# 可调用工具
@tool.getCustomerProfile({ customerId: "{{customer.id}}" })
@tool.getConversationSummary({ customerId: "{{customer.id}}", range: "{{task.range}}" })
@tool.getCourseProgress({ customerId: "{{customer.id}}" })
@tool.writeCustomerTags({ customerId: "{{customer.id}}", tags: "{{task.output_tags}}" })
@tool.createFollowUpTask({ customerId: "{{customer.id}}", plan: "{{task.follow_up_plan}}" })
@tool.notifySales({ salesId: "{{customer.owner_id}}", content: "{{task.sales_notice}}" })

# 输出要求
- 输出必须结构化，说明判断依据。
- 输出要包含“建议动作”和“原因”，便于人工销售理解。
- 如果输出会影响会话智能体，必须生成一段简短策略提示词，不超过 300 字。
- 如果输出会写入客户档案，必须标记更新时间和来源任务。`;
  const strategyTaskConfigs = [
    {
      key: "personalized-prompt",
      name: "生成个性化策略提示词",
      type: "生成个性化策略提示词",
      status: "启用",
      scope: "标签人群",
      audienceTags: ["亲子冲突高", "家长高焦虑", "适合先共情安抚"],
      scheduleTime: "08:00",
      scheduleCycle: "1小时1次",
      friendDayRules: [3, 5],
      messageCountRules: [10, 20],
      executeDelayDays: "后 1 天",
      inputScope: ["用户沟通数据", "客户档案"],
      outputResults: ["策略提示词"],
      writeTargets: ["系统提示词", "客户档案"],
      logic: "当客户进入新的角色流程阶段时，生成一段面向当前会话智能体的个性化策略提示词。内容包括客户关键背景、当前最适合的沟通角度、禁止触碰的话题、是否适合推品、下一轮建议动作。比如亲子冲突高、家长焦虑明显的客户，应提示会话智能体先稳定情绪和确认事实，不要过早介绍课程价格；已完成体验课且认可老师判断的客户，可提示智能体适度引导人工确认方案。"
    }
  ];
  const strategyTaskTypeOptions = ["生成个性化策略提示词"].map((value) => ({ value }));
  const strategyScopeOptions = ["标签人群", "全部客户"].map((value) => ({ value }));
  const strategyCycleOptions = ["1小时1次", "6小时1次", "12小时1次", "每天一次", "2天一次", "1周一次"].map((value) => ({ value }));
  const strategyInputScopeOptions = ["客户档案", "最近24小时会话", "最近7天会话", "最近10轮会话", "历史会话摘要", "课程信息", "课程计划", "听课数据", "用户标签", "已有标签", "订单状态", "销售策略", "销售负责人", "流程阶段"].map((value) => ({ value }));
  const strategyOutputResultOptions = ["策略提示词"].map((value) => ({ value }));
  const strategyWriteTargetOptions = ["系统提示词", "客户档案"].map((value) => ({ value }));
  const strategyPromptDataSourceConfigs = [
    {
      key: "用户沟通数据",
      name: "用户沟通数据",
      usage: "默认读取要生成提示词用户的全部对话数据，用于识别用户核心表达、当前情绪、阻碍点、购买顾虑和反复出现的诉求。"
    },
    {
      key: "客户档案",
      name: "客户档案",
      usage: "默认读取企业给到的客户档案数据，用于校验会话判断是否与客户长期背景一致，避免只凭最近一次对话生成错误提示词。"
    }
  ];
  const strategyAudienceTagOptions = customerTagGroups.map((group) => ({
    label: group.name,
    options: group.tags.map((tag) => ({ value: tag.value, label: getTagDisplayLabel(tag.value) }))
  }));
  const createStrategyTaskDraft = (index = 0) => ({
    key: `strategy-task-${Date.now()}`,
    name: "生成个性化策略提示词",
    type: "生成个性化策略提示词",
    status: "启用",
    scope: "标签人群",
    audienceTags: ["亲子冲突高", "家长高焦虑", "适合先共情安抚"],
    scheduleTime: "08:00",
    scheduleCycle: "1小时1次",
    friendDayRules: [3, 5],
    messageCountRules: [10, 20],
    executeDelayDays: "后 1 天",
    inputScope: ["用户沟通数据", "客户档案"],
    outputResults: ["策略提示词"],
    writeTargets: ["系统提示词", "客户档案"],
    logic: "描述个性化策略提示词的生成条件、引用数据、输出结构和禁止事项。"
  });
  const [strategyTasks, setStrategyTasks] = useState(strategyTaskConfigs);
  const [strategyTaskEditor, setStrategyTaskEditor] = useState(null);
  const [strategyTaskDraft, setStrategyTaskDraft] = useState(createStrategyTaskDraft(0));
  const [strategyTaskTagPicker, setStrategyTaskTagPicker] = useState({ open: false, selected: [], keyword: "", rule: "以下标签满足其一" });
  const openStrategyTaskEditor = (index = null) => {
    setStrategyTaskEditor({ index });
    setStrategyTaskDraft(index == null ? createStrategyTaskDraft(strategyTasks.length) : { ...strategyTasks[index] });
  };
  const openStrategyTaskTagPicker = () => {
    setStrategyTaskTagPicker({
      open: true,
      selected: strategyTaskDraft.audienceTags || [],
      keyword: "",
      rule: "以下标签满足其一"
    });
  };
  const saveStrategyTaskTagPicker = () => {
    setStrategyTaskDraft((item) => ({ ...item, audienceTags: strategyTaskTagPicker.selected }));
    setStrategyTaskTagPicker((item) => ({ ...item, open: false }));
  };
  const addStrategyPromptTriggerRule = (type) => {
    setStrategyTaskDraft((item) => {
      const field = type === "friendDay" ? "friendDayRules" : "messageCountRules";
      const nextValue = type === "friendDay" ? 7 : 30;
      return { ...item, [field]: [...(item[field] || []), nextValue] };
    });
  };
  const updateStrategyPromptTriggerRule = (type, index, value) => {
    setStrategyTaskDraft((item) => {
      const field = type === "friendDay" ? "friendDayRules" : "messageCountRules";
      return { ...item, [field]: (item[field] || []).map((currentValue, itemIndex) => itemIndex === index ? value || 1 : currentValue) };
    });
  };
  const removeStrategyPromptTriggerRule = (type, index) => {
    setStrategyTaskDraft((item) => {
      const field = type === "friendDay" ? "friendDayRules" : "messageCountRules";
      const currentRules = item[field] || [];
      return { ...item, [field]: currentRules.length > 1 ? currentRules.filter((_, itemIndex) => itemIndex !== index) : currentRules };
    });
  };
  const saveStrategyTaskDraft = () => {
    if (!strategyTaskDraft.name?.trim()) {
      message.warning("请输入任务名称");
      return;
    }
    const normalizedTaskDraft = {
      ...strategyTaskDraft,
      audienceTags: strategyTaskDraft.scope === "全部客户" ? [] : strategyTaskDraft.audienceTags
    };
    if (strategyTaskEditor.index == null) {
      setStrategyTasks((items) => [...items, { ...normalizedTaskDraft, key: `strategy-task-${Date.now()}` }]);
    } else {
      setStrategyTasks((items) => items.map((item, index) => (index === strategyTaskEditor.index ? normalizedTaskDraft : item)));
    }
    setStrategyTaskEditor(null);
  };
  const createScheduleRule = (index = 0) => ({
    taskName: index === 0 ? "自我介绍" : index === 1 ? "追问客户需求" : "阶段结果同步",
    taskDescription: index === 0 ? "打招呼，说明服务身份，并承接客户当前咨询场景。" : index === 1 ? "围绕年级、英语基础、学习目标和时间安排进行需求确认。" : "同步当前阶段结果，更新客户状态并准备后续跟进。",
    targetAudienceMode: "全部用户",
    targetTags: [],
    taskType: index === 0 ? "ADD_FRIEND" : "AGENT_START",
    delayType: index === 0 ? "IMMEDIATE" : "DELAY",
    delayValue: index === 0 ? 0 : index === 1 ? 1 : 30,
    delayUnit: "分钟",
    enabled: true
  });
  const createAgentVersionRows = () => [
    {
      key: "v3",
      version: "v3",
      status: "当前发布版本",
      model: "qwen3.5-omni-flash",
      modelConfig,
      toolKeys: defaultToolKeys,
      aiSkillKeys: fallbackAiSkillKeys,
      knowledgeBaseKeys: defaultKnowledgeBaseKeys,
      taskCount: 6,
      updatedAt: "2026-08-03 17:40:34"
    },
    {
      key: "v2",
      version: "v2",
      status: "历史版本",
      model: "qwen3.5-omni-flash",
      modelConfig: { ...modelConfig, temperature: 0.6 },
      toolKeys: defaultToolKeys.slice(0, 2),
      aiSkillKeys: fallbackAiSkillKeys,
      knowledgeBaseKeys: defaultKnowledgeBaseKeys.slice(0, 1),
      taskCount: 5,
      updatedAt: "2026-07-21 11:29:22"
    },
    {
      key: "v1",
      version: "v1",
      status: "历史版本",
      model: "qwen3.5-omni-flash",
      modelConfig: { ...modelConfig, model: "qwen3.5-omni-flash", temperature: 0.8 },
      toolKeys: defaultToolKeys.slice(0, 1),
      aiSkillKeys: fallbackAiSkillKeys.slice(0, 1),
      knowledgeBaseKeys: defaultKnowledgeBaseKeys.slice(0, 1),
      taskCount: 4,
      updatedAt: "2026-07-24 13:00:05"
    }
  ];
  const [versionRows, setVersionRows] = useState(createAgentVersionRows);
  const [selectedVersionKey, setSelectedVersionKey] = useState("v3");
  const [activeAgentTab, setActiveAgentTab] = useState("model");
  const selectedVersion = versionRows.find((item) => item.key === selectedVersionKey) || versionRows[0];
  const currentVersionModelConfig = selectedVersion.modelConfig || modelConfig;
  const taskTypeOptions = [
    { value: "ADD_FRIEND", label: "加好友" },
    { value: "ADD_FRIEND_NATURAL_DAY", label: "加好友自然日" },
    { value: "AGENT_START", label: "agent生效" }
  ];
  const delayTypeOptions = [
    { value: "IMMEDIATE", label: "立即触发" },
    { value: "DELAY", label: "延后触发" },
    { value: "AT_TIME", label: "指定时间" }
  ];
  const endRefTypeOptions = [
    { value: "ADD_FRIEND", label: "加好友" },
    { value: "AGENT_START", label: "agent生效" },
    { value: "ADD_FRIEND_NATURAL_DAY", label: "加好友自然日" }
  ];
  const updateScheduleRuleValue = (ruleIndex, values) => {
    const rules = form.getFieldValue("scheduleRules") || [];
    form.setFieldsValue({
      scheduleRules: rules.map((rule, index) => (index === ruleIndex ? { ...rule, ...values } : rule))
    });
  };
  const getTaskTypeLabel = (value) => taskTypeOptions.find((item) => item.value === value)?.label || value || "—";
  const getDelayTypeLabel = (value) => delayTypeOptions.find((item) => item.value === value)?.label || value || "—";
  const formatTaskPlanTime = (task = {}) => {
    const delayType = task.delayType || "DELAY";
    if (delayType === "IMMEDIATE") return "立即触发";
    if (delayType === "AT_TIME") return `指定时间 · ${task.delayValue ?? 0} 点`;
    const value = task.delayValue ?? 0;
    if ((task.delayUnit || "分钟") === "分钟") {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      if (hours > 0 && minutes > 0) return `延后触发 · ${hours}小时${minutes}分钟`;
      if (hours > 0) return `延后触发 · ${hours}小时`;
      return `延后触发 · ${minutes}分钟`;
    }
    return `延后触发 · ${value}${task.delayUnit || "分钟"}`;
  };
  const [taskEditor, setTaskEditor] = useState(null);
  const [taskDraft, setTaskDraft] = useState(createScheduleRule(0));
  const [taskTagPicker, setTaskTagPicker] = useState({ open: false, selected: [], keyword: "", rule: "以下标签满足其一" });
  const openTaskEditor = (index = null) => {
    const rules = form.getFieldValue("scheduleRules") || [];
    setTaskEditor({ index });
    setTaskDraft(index == null ? createScheduleRule(rules.length) : { ...createScheduleRule(index), ...(rules[index] || {}) });
  };
  const openTaskTagPicker = () => {
    setTaskTagPicker({
      open: true,
      selected: taskDraft.targetTags || [],
      keyword: "",
      rule: "以下标签满足其一"
    });
  };
  const saveTaskTagPicker = () => {
    setTaskDraft((item) => ({ ...item, targetTags: taskTagPicker.selected }));
    setTaskTagPicker((item) => ({ ...item, open: false }));
  };
  const getDelayHours = () => Math.floor((taskDraft.delayValue || 0) / 60);
  const getDelayMinutes = () => (taskDraft.delayValue || 0) % 60;
  const updateTaskDelayPart = (part, value) => {
    const nextValue = Math.max(0, value || 0);
    const hours = part === "hours" ? nextValue : getDelayHours();
    const minutes = part === "minutes" ? nextValue : getDelayMinutes();
    setTaskDraft((item) => ({ ...item, delayValue: hours * 60 + minutes, delayUnit: "分钟" }));
  };
  const [selectedKnowledgeResourceKeys, setSelectedKnowledgeResourceKeys] = useState(
    selectedVersion.knowledgeResourceKeys || (selectedVersion.knowledgeBaseKeys || defaultKnowledgeBaseKeys).map((key) => `base:${key}`)
  );
  const [agentKnowledgePickerOpen, setAgentKnowledgePickerOpen] = useState(false);
  const [agentKnowledgePickerKeys, setAgentKnowledgePickerKeys] = useState([]);
  const [selectedToolKeys, setSelectedToolKeys] = useState(selectedVersion.toolKeys || defaultToolKeys);
  const [selectedAiSkillKeys, setSelectedAiSkillKeys] = useState(selectedVersion.aiSkillKeys || fallbackAiSkillKeys);
  const [relationPicker, setRelationPicker] = useState({ open: false, type: "tools", keyword: "", category: "全部类型" });
  useEffect(() => {
    if (!selectedVersion) return;
    setSelectedKnowledgeResourceKeys(selectedVersion.knowledgeResourceKeys || (selectedVersion.knowledgeBaseKeys || defaultKnowledgeBaseKeys).map((key) => `base:${key}`));
    setSelectedToolKeys(selectedVersion.toolKeys || defaultToolKeys);
    setSelectedAiSkillKeys(selectedVersion.aiSkillKeys || fallbackAiSkillKeys);
    form.setFieldsValue(selectedVersion.modelConfig || modelConfig);
  }, [selectedVersionKey]);
  const knowledgeResourceRows = buildKnowledgeResourceRows();
  const selectedKnowledgeResources = knowledgeResourceRows.filter((item) => selectedKnowledgeResourceKeys.includes(item.key));
  const selectedTools = agentTools.filter((item) => selectedToolKeys.includes(item.key));
  const skillOutputTypeDefaults = {
    "信息总结": "结构化档案",
    "用户标签": "标签",
    "意向识别": "策略判断",
    "消息生成": "建议话术",
    "任务触发": "任务结果",
    "数据同步": "结构化档案"
  };
  const skillOutputTargetDefaults = {
    "信息总结": ["客户档案", "会话记录"],
    "用户标签": ["运营标签", "企微标签"],
    "意向识别": ["智能体内部"],
    "消息生成": ["智能体内部"],
    "任务触发": ["触发后续任务"],
    "数据同步": ["客户档案"]
  };
  const buildAgentSkillUsage = (item) => ({
    ...item,
    outputType: item.outputType || skillOutputTypeDefaults[item.type] || "策略判断",
    outputTargets: item.outputTargets || skillOutputTargetDefaults[item.type] || ["智能体内部"]
  });
  const agentSkillRows = selectedAiSkillKeys
    .map((key) => {
      const item = aiSkills.find((skillItem) => skillItem.key === key);
      return item ? buildAgentSkillUsage(item) : null;
    })
    .filter(Boolean);
  const relationCatalogs = {
    tools: {
      title: "已关联工具",
      desc: "配置该版本智能体可调用的工具，用于外部查询、通知、跳转和托管动作。",
      emptyTitle: "当前版本暂未配置工具",
      emptyDesc: "添加后，智能体可在编排和提示词允许的场景中调用对应工具。",
      addText: "添加工具",
      pickerTitle: "选择工具",
      icon: <ToolOutlined />,
      selectedKeys: selectedToolKeys,
      setSelectedKeys: setSelectedToolKeys,
      rows: agentTools.map((tool) => ({
        key: tool.key,
        name: tool.name,
        type: tool.enabled ? "可用工具" : "停用工具",
        description: tool.description,
        scenario: "外部查询、通知、跳转、托管控制",
        input: "任务上下文、客户标识、会话阶段、业务参数",
        output: "调用状态、关键字段、异常信息、结构化摘要",
        status: tool.enabled ? "启用" : "停用",
        updatedAt: tool.updatedAt
      }))
    },
    skills: {
      title: "Skill调用配置",
      desc: "查看该智能体已关联的 Skill 默认能力定义，具体调用时机由智能体编排和提示词策略共同决定。",
      emptyTitle: "当前版本暂未配置 Skill",
      emptyDesc: "选择该智能体可关联的 Skill，添加后可复用标准化判断、总结、推荐和合规能力。",
      addText: "添加 Skill",
      pickerTitle: "选择 Skill",
      icon: <FileSearchOutlined />,
      selectedKeys: selectedAiSkillKeys,
      setSelectedKeys: setSelectedAiSkillKeys,
      rows: aiSkills.map((skillItem) => {
        const item = buildAgentSkillUsage(skillItem);
        return {
          key: item.key,
          name: item.name,
          type: item.type,
          description: item.description,
          scenario: item.scenario,
          input: item.input,
          output: `${item.outputType} / ${(item.outputTargets || []).join("、")}`,
          status: item.status,
          updatedAt: item.updatedAt
        };
      })
    },
    knowledge: {
      title: "知识库配置",
      desc: "配置该版本智能体可引用的知识库，作为回答、规则校验和产品说明的依据。",
      emptyTitle: "当前版本暂未配置知识库",
      emptyDesc: "添加后，智能体可在对话和 Skill 调用中引用对应知识内容。",
      addText: "添加知识库",
      pickerTitle: "选择知识库",
      icon: <BookOutlined />,
      selectedKeys: selectedKnowledgeResourceKeys,
      setSelectedKeys: setSelectedKnowledgeResourceKeys,
      rows: knowledgeResourceRows.map((resource) => ({
        key: resource.key,
        name: resource.name,
        type: resource.relationType,
        description: resource.desc,
        scenario: resource.path,
        input: resource.contentType,
        output: "可引用知识片段、资料说明、边界规则",
        status: resource.status,
        updatedAt: resource.updatedAt
      }))
    }
  };
  const openRelationPicker = (type) => {
    if (type === "knowledge") {
      setAgentKnowledgePickerKeys(selectedKnowledgeResourceKeys);
      setAgentKnowledgePickerOpen(true);
      return;
    }
    setRelationPicker({ open: true, type, keyword: "", category: "全部类型" });
  };
  const saveAgentKnowledgeResources = () => {
    const nextKeys = Array.from(new Set(agentKnowledgePickerKeys));
    setSelectedKnowledgeResourceKeys(nextKeys);
    setAgentKnowledgePickerOpen(false);
  };
  const toggleRelationSelection = (type, key) => {
    const config = relationCatalogs[type];
    config.setSelectedKeys((keys) => (
      keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key]
    ));
  };
  const renderRelationConfigTab = (type) => {
    const config = relationCatalogs[type];
    const rows = config.rows.filter((item) => config.selectedKeys.includes(item.key));
    const columns = [
      { title: "名称", dataIndex: "name", width: 180 },
      { title: "类型", dataIndex: "type", width: 110, render: (value) => <Tag color="blue">{value}</Tag> },
      { title: "说明", dataIndex: "description", width: 260, render: (value) => <Text type="secondary" className="agent-relation-desc">{value}</Text> },
      { title: "适用场景", dataIndex: "scenario", width: 220 },
      { title: "状态", dataIndex: "status", width: 80, render: statusTag },
      { title: "更新时间", dataIndex: "updatedAt", width: 160 },
      {
        title: "操作",
        fixed: "right",
        width: 84,
        render: (_, record) => <Button type="link" size="small" danger onClick={() => toggleRelationSelection(type, record.key)}>移除</Button>
      }
    ];
    return (
      <Card
        className="agent-relation-config-card"
        title={<PanelTitle title={config.title} desc={config.desc} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openRelationPicker(type)}>{config.addText}</Button>} />}
      >
        {rows.length ? (
          <Table
            className="admin-table agent-relation-table"
            rowKey="key"
            pagination={false}
            scroll={{ x: 1180 }}
            columns={columns}
            dataSource={rows}
          />
        ) : (
          <button type="button" className="agent-relation-empty" onClick={() => openRelationPicker(type)}>
            <span className="agent-relation-empty-icon">{config.icon}</span>
            <span className="agent-relation-empty-title">{config.emptyTitle}</span>
            <span className="agent-relation-empty-desc">{config.emptyDesc}</span>
            <span className="agent-relation-empty-action">{config.addText}</span>
          </button>
        )}
      </Card>
    );
  };
  const renderRelationPickerModal = () => {
    const config = relationCatalogs[relationPicker.type];
    const categories = ["全部类型", ...Array.from(new Set(config.rows.map((item) => item.type)))];
    const keywordText = relationPicker.keyword.trim().toLowerCase();
    const rows = config.rows.filter((item) => {
      const matchesCategory = relationPicker.category === "全部类型" || item.type === relationPicker.category;
      const matchesKeyword = !keywordText || [item.name, item.type, item.description, item.scenario].some((value) => String(value || "").toLowerCase().includes(keywordText));
      return matchesCategory && matchesKeyword;
    });
    return (
      <Modal
        title={config.pickerTitle}
        open={relationPicker.open}
        onCancel={() => setRelationPicker((item) => ({ ...item, open: false }))}
        footer={<Button type="primary" onClick={() => setRelationPicker((item) => ({ ...item, open: false }))}>确定</Button>}
        width={900}
        className="agent-relation-picker-modal"
      >
        <div className="agent-relation-picker-toolbar">
          <Input.Search
            allowClear
            placeholder={`搜索${config.pickerTitle}名称、类型或说明`}
            value={relationPicker.keyword}
            onChange={(event) => setRelationPicker((item) => ({ ...item, keyword: event.target.value }))}
          />
          <Select
            value={relationPicker.category}
            options={categories.map((value) => ({ value }))}
            onChange={(value) => setRelationPicker((item) => ({ ...item, category: value }))}
          />
        </div>
        <div className="agent-relation-card-list">
          {rows.map((item) => {
            const checked = config.selectedKeys.includes(item.key);
            return (
              <div className={checked ? "agent-relation-resource-card selected" : "agent-relation-resource-card"} key={item.key}>
                <div className="agent-relation-resource-head">
                  <Space size={8} wrap>
                    <span className="agent-relation-resource-icon">{config.icon}</span>
                    <Text className="agent-relation-resource-name">{item.name}</Text>
                    <Tag color="blue">{item.type}</Tag>
                    {statusTag(item.status)}
                    {checked ? <Tag color="success">已选择</Tag> : null}
                  </Space>
                  <Button size="small" type={checked ? "default" : "primary"} onClick={() => toggleRelationSelection(relationPicker.type, item.key)}>
                    {checked ? "移除" : "选择"}
                  </Button>
                </div>
                <Text type="secondary" className="agent-relation-resource-desc">{item.description}</Text>
                <div className="agent-relation-resource-meta">
                  <div><Text type="secondary">适用场景</Text><Text>{item.scenario}</Text></div>
                  <div><Text type="secondary">输入摘要</Text><Text>{item.input}</Text></div>
                  <div><Text type="secondary">输出摘要</Text><Text>{item.output}</Text></div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    );
  };
  const [debugInput, setDebugInput] = useState("");
  const [debugTrace, setDebugTrace] = useState(null);
  const defaultDebugPresetDescription = "孩子三年级，英语基础一般，阅读总丢分。想先了解试听课怎么安排，费用大概多少？";
  const [debugPresetDescription, setDebugPresetDescription] = useState(defaultDebugPresetDescription);
  const logicSections = [
    {
      title: "角色",
      content: "你是小学英语课程增长场景中的 Skill，负责在企微会话里辅助课程顾问识别家长诉求、补齐学员信息、推荐合适课程动作，并推动试听或报名转化。回复必须专业、自然、克制，不暴露系统或AI身份。\n\n可使用参数：{{customer.name}}、{{student.grade}}、{{wechat.nickname}}。"
    },
    {
      title: "技能1：客户需求挖掘与确认",
      steps: [
        "开场破冰：结合家长上下文自然承接，不重复模板化问候。",
        "需求提问：围绕年级、英语基础、校内成绩、学习目标和时间安排进行2-3个关键追问。",
        "需求总结：把家长诉求整理成结构化结论，并确认是否准确。",
        "信息调取：通过 @tool.getStudentProfile 查询学员档案，引用 @kb.小学英语课程知识库 匹配课程说明。"
      ]
    },
    {
      title: "技能2：课程匹配与价值表达",
      steps: [
        "信息调取：基于手机号、企微ID或学员ID查询学员档案和试听记录。",
        "课程推荐：优先推荐小学英语试听课、自然拼读、阅读提升或同步培优课程。",
        "价值表达：避免夸大承诺，用孩子当前问题对应课程解决路径。"
      ]
    },
    {
      title: "技能3：转化与跟进动作",
      steps: [
        "when {{customer.intent}} = 高意向：生成试听预约或报名确认话术，**必须确认试听时间**。",
        "中意向：创建定时跟进，补充课程案例或学习规划。",
        "低意向：降低压迫感，保留后续沟通入口。",
        "禁止承诺具体提分效果，敏感报价字段使用 `price_policy` 规则兜底。"
      ]
    }
  ];
  const logicText = logicSections.map((section) => {
    const lines = [`# ${section.title}`];
    if (section.content) lines.push(section.content);
    if (section.steps) lines.push(...section.steps.map((step, index) => `${index + 1}. ${step}`));
    return lines.join("\n");
  }).join("\n\n");
  const currentVersionLogicText = `${isStrategyAgent ? strategyAgentLogicText : logicText}\n\n# 版本调试说明\n当前选择版本：${selectedVersion.version}。下方模型、工具、Skill 和预览调试均使用该版本快照。`;
  const debugReply = skill.name === "19元A类课-第一课"
    ? "张妈妈，孩子三年级现在词汇和阅读跟不上是比较常见的情况。建议先约一节小学英语诊断试听课，老师会看孩子自然拼读、阅读理解和校内同步掌握情况，再给您一份具体提升建议。"
    : `${skill.name} 已完成调用：已识别学员年级、英语基础、试听状态和下一步跟进动作，可交给课程顾问继续确认。`;
  const buildDebugAiMessages = (source = "text") => [
    {
      key: `ai-${source}-1`,
      from: "ai",
      text: source === "voice" ? "我先识别到您语音里提到孩子三年级、阅读丢分和想了解试听安排。" : source === "image" ? "我先读取到图片里的练习内容，并结合当前会话判断家长在关注阅读理解和校内提分。" : "孩子三年级，英语基础一般且阅读丢分，这里更适合先做一次诊断试听。",
      trace: {
        title: "执行过程：识别客户诉求",
        steps: [
          "读取用户最新输入，提取年级、英语基础、阅读丢分、试听咨询等关键信息。",
          source === "voice" ? "模拟语音转文字后进入同一套意图识别流程。" : source === "image" ? "模拟图片OCR提取题型与错误点，再与会话上下文合并。" : "直接基于文本消息进行意图识别。",
          "命中 Skill 逻辑：客户需求挖掘与确认。"
        ],
        checks: ["没有暴露AI身份", "没有承诺具体提分效果", "先判断需求再给建议"]
      }
    },
    {
      key: `ai-${source}-2`,
      from: "ai",
      text: "建议先约一节小学英语诊断试听课，老师会看自然拼读、阅读理解和校内同步掌握情况。",
      trace: {
        title: "执行过程：匹配课程动作",
        steps: [
          "根据年级和薄弱项匹配小学英语诊断试听课。",
          "选择低压推荐方式，避免直接强推报名。",
          "说明试听课会评估的维度，让家长理解推荐依据。"
        ],
        checks: ["符合课程推荐目标", "表达专业克制", "没有乱报价"]
      }
    },
    {
      key: `ai-${source}-3`,
      from: "ai",
      text: "您方便的话，我可以先帮您看下本周可试听时间，再让老师给一份具体提升建议。",
      trace: {
        title: "执行过程：推动下一步",
        steps: [
          "判断客户处于了解阶段到试听转化阶段之间。",
          "下一步动作选择为确认试听时间，而不是直接催单。",
          "用人工老师反馈承接敏感判断，保留人工确认空间。"
        ],
        checks: ["符合服务目标：邀约试听", "语气自然", "敏感结论留给人工确认"]
      }
    }
  ];
  const [debugMessages, setDebugMessages] = useState(() => [
    { key: "u-1", from: "user", text: defaultDebugPresetDescription },
    ...buildDebugAiMessages("text")
  ]);
  const appendDebugRun = (message) => {
    setDebugMessages((items) => [
      ...items,
      message,
      ...buildDebugAiMessages(message.kind || "text").map((item, index) => ({ ...item, key: `${item.key}-${Date.now()}-${index}` }))
    ]);
  };
  const sendDebugText = () => {
    const text = debugInput.trim();
    if (!text) return;
    appendDebugRun({ key: `u-text-${Date.now()}`, from: "user", kind: "text", text });
    setDebugInput("");
  };
  const runDebugPreset = () => {
    const text = debugPresetDescription.trim();
    if (!text) return;
    appendDebugRun({ key: `u-preset-${Date.now()}`, from: "user", kind: "text", text });
  };
  const sendDebugMedia = (kind) => {
    appendDebugRun({
      key: `u-${kind}-${Date.now()}`,
      from: "user",
      kind,
      text: kind === "voice" ? "语音消息 00:08：孩子阅读理解总丢分，想问试听课。" : "图片消息：上传了一张阅读理解错题截图。"
    });
  };
  const executionSkillRows = [
    { title: "用户画像总结", tag: "信息总结", desc: "提炼孩子问题、家长痛点、家庭互动和购买意向，结果写入客户档案和会话记录" },
    { title: "推品时机判断", tag: "策略判断", desc: "判断当前应继续定需和下诊断，暂不直接介绍产品" },
    { title: "产品匹配建议", tag: "产品匹配", desc: "后续如家长认可诊断并问怎么办，可优先评估家庭守护计划或咨询服务" },
    { title: "回复合规检查", tag: "合规检查", desc: "检查未做疾病诊断、未承诺效果、未用风险压单，允许发送" }
  ];
  const executionToolRows = [
    { title: "调用三方接口获取信息", tag: "成功", desc: "读取购买状态、听课状态和客户基础档案" },
    { title: "集成AI定时任务", tag: "未触发", desc: "当前为即时调试，不创建真实跟进任务" }
  ];
  const executionKnowledgeRows = [
    { title: "家长高频问题知识库", desc: "校验课程固定问题和常见问答边界" },
    { title: "价格政策与异议处理库", desc: "本轮不报价，仅用于合规边界参考" }
  ];
  const stageTaskRows = [
    { title: "课程提醒", trigger: "agent生效", delay: "agent 生效 后 7小时30分钟", status: "启用" },
    { title: "观心实验室介绍", trigger: "agent生效", delay: "agent 生效 后 10小时", status: "启用" },
    { title: "课前提醒", trigger: "agent生效", delay: "agent 生效 后 18小时", status: "启用" },
    { title: "课前提醒", trigger: "agent生效", delay: "agent 生效 后 18小时55分钟", status: "启用" },
    { title: "课后总结问感受", trigger: "agent生效", delay: "agent 生效 后 21小时", status: "启用" },
    { title: "课后总结问感受", trigger: "agent生效", delay: "agent 生效 后 21小时", status: "启用" }
  ];
  const createVersion = (sourceVersion = selectedVersion) => {
    const nextNumber = Math.max(...versionRows.map((item) => Number(item.version.replace("v", "")) || 0)) + 1;
    const nextVersion = {
      ...sourceVersion,
      key: `v${nextNumber}`,
      version: `v${nextNumber}`,
      status: "草稿版本",
      updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ")
    };
    setVersionRows((items) => [nextVersion, ...items]);
    setSelectedVersionKey(nextVersion.key);
    message.success("已创建草稿版本");
  };
  const publishVersion = (versionKey) => {
    setVersionRows((items) => items.map((item) => ({
      ...item,
      status: item.key === versionKey ? "当前发布版本" : item.status === "当前发布版本" ? "历史版本" : item.status
    })));
    setSelectedVersionKey(versionKey);
    message.success("已切换当前发布版本");
  };
  const stopVersion = (versionKey) => {
    setVersionRows((items) => items.map((item) => (item.key === versionKey ? { ...item, status: "历史版本" } : item)));
    message.success("版本已停用");
  };
  const versionColumns = [
    {
      title: "版本",
      dataIndex: "version",
      width: 110,
      render: (value, record) => <Button type="link" className="version-name-button" onClick={() => setSelectedVersionKey(record.key)}>{value}</Button>
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 150,
      render: (value) => (
        <Space direction="vertical" size={4}>
          <Badge color={value === "当前发布版本" ? "green" : value === "草稿版本" ? "blue" : "default"} text={value === "历史版本" ? "已停用" : value} />
          {value === "当前发布版本" ? <Tag color="success">当前发布版本</Tag> : null}
        </Space>
      )
    },
    { title: "模型", dataIndex: "model", width: 210 },
    { title: "工具数", dataIndex: "toolKeys", width: 92, align: "center", render: (items = []) => <Tag color="success">{items.length}</Tag> },
    { title: "Skill数", dataIndex: "aiSkillKeys", width: 92, align: "center", render: (items = []) => <Tag color="processing">{items.length}</Tag> },
    { title: "任务数", dataIndex: "taskCount", width: 92, align: "center", render: (value) => <Tag>{value}</Tag> },
    { title: "更新时间", dataIndex: "updatedAt", width: 170 },
    {
      title: "操作",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size={4} className="table-action-group">
          <Button type="link" size="small" onClick={() => setSelectedVersionKey(record.key)}>查看</Button>
          {record.status === "当前发布版本" ? (
            <Button type="link" size="small" danger onClick={() => stopVersion(record.key)}>停用</Button>
          ) : (
            <Button type="link" size="small" onClick={() => publishVersion(record.key)}>设为发布版本</Button>
          )}
        </Space>
      )
    }
  ];
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card className="skill-editor-shell">
        <div className="skill-editor-head">
          <Space>
            <Button onClick={onBack}>返回</Button>
            <Title level={4}>{skill.name}</Title>
          </Space>
          <Space>
            <Switch checked={skill.status === "启用"} checkedChildren="启用" unCheckedChildren="停用" />
            <Button type="primary">保存智能体</Button>
          </Space>
        </div>
        <div className="agent-version-center">
          <div className="agent-version-head">
            <Space size={12}>
              <span className="agent-version-icon"><CloudSyncOutlined /></span>
              <div>
                <Text className="agent-version-title">版本中心</Text>
                <Text type="secondary" className="agent-version-desc">当前已发布版本与草稿版本配置快照。选择版本后，下方配置内容会切换为该版本快照。</Text>
              </div>
            </Space>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => createVersion()}>创建版本</Button>
              <Tooltip title="刷新版本列表"><Button icon={<CloudSyncOutlined />} onClick={() => message.success("版本列表已刷新")} /></Tooltip>
            </Space>
          </div>
          <Table
            className="admin-table agent-version-table"
            rowKey="key"
            size="small"
            columns={versionColumns}
            dataSource={versionRows}
            pagination={false}
            rowClassName={(record) => record.key === selectedVersionKey ? "agent-version-row active" : "agent-version-row"}
            onRow={(record) => ({ onClick: () => setSelectedVersionKey(record.key) })}
            scroll={{ x: 1260 }}
          />
        </div>
      </Card>
      <Card className="skill-editor-tabs-card">
        <div className="agent-selected-version-detail">
          <div>
            <Text className="agent-selected-version-title">{selectedVersion.version} 版本详情</Text>
            <Text type="secondary" className="agent-selected-version-desc">当前下方配置内容来自该版本快照，可切换上方版本查看不同配置。</Text>
          </div>
          <Space wrap size={[8, 8]}>
            <Tag color={selectedVersion.status === "当前发布版本" ? "success" : selectedVersion.status === "草稿版本" ? "processing" : "default"}>{selectedVersion.status}</Tag>
            <Tag>{selectedVersion.model}</Tag>
            <Tag>{selectedToolKeys.length} 个工具</Tag>
            <Tag>{selectedAiSkillKeys.length} 个 Skill</Tag>
            <Tag>{selectedKnowledgeResourceKeys.length} 个知识资源</Tag>
            <Tag>{selectedVersion.taskCount} 个任务</Tag>
            <Text type="secondary">更新时间：{selectedVersion.updatedAt}</Text>
          </Space>
        </div>
        <Tabs
          className="skill-editor-tabs"
          activeKey={activeAgentTab}
          onChange={setActiveAgentTab}
          items={[
            {
              key: "model",
              label: "模型配置",
              children: (
                <Card size="small" title="模型基础配置" className="agent-config-card">
                  <Form layout="vertical" initialValues={currentVersionModelConfig} key={selectedVersionKey}>
                    <Row gutter={16}>
                      <Col span={24}><Form.Item label="Provider" name="provider"><Select options={["DASHSCOPE", "OpenAI", "Azure OpenAI", "自定义模型"].map((value) => ({ value }))} /></Form.Item></Col>
                      <Col span={24}><Form.Item label="模型" name="model"><Input placeholder="请输入模型名称" /></Form.Item></Col>
                      <Col span={24}><Form.Item label="Base URL" name="baseUrl"><Input placeholder="请输入模型服务地址" /></Form.Item></Col>
                    </Row>
                  </Form>
                </Card>
              )
            },
            {
              key: "logic",
              label: "逻辑与任务编排",
              children: (
                <div className="skill-logic-config-grid">
                  <section className="skill-logic-pane">
                    <div className="builder-pane-head">
                      <Title level={4}>智能体逻辑描述</Title>
                    </div>
                    <SkillLogicRichEditor key={selectedVersionKey} defaultValue={currentVersionLogicText} />
                  </section>
                  <section className="skill-config-pane">
                    <div className="builder-pane-head">
                      <Title level={4}>{isStrategyAgent ? "策略任务配置" : "智能体编排"}</Title>
                    </div>
                    {isStrategyAgent ? (
                      <>
                        <div className="strategy-task-config-form">
                          <div className="strategy-task-config-summary">
                            <Text type="secondary">已配置 {strategyTasks.length} 个策略任务。当前仅保留“生成个性化策略提示词”任务；点击“配置任务”在侧边栏中维护任务字段。</Text>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => openStrategyTaskEditor(null)}>配置任务</Button>
                          </div>
                          <div className="strategy-task-config-list">
                            {strategyTasks.map((task, index) => (
                              <Card
                                size="small"
                                key={task.key}
                                className="strategy-task-config-card"
                                title={
                                  <Space size={8} wrap>
                                    <span>{index + 1}. {task.name}</span>
                                    <Tag color="purple">{task.type}</Tag>
                                    {statusTag(task.status)}
                                  </Space>
                                }
                                extra={
                                  <Space size={4}>
                                    <Button type="link" size="small" onClick={() => openStrategyTaskEditor(index)}>编辑</Button>
                                    <Button type="link" size="small" danger onClick={() => setStrategyTasks((items) => items.filter((_, itemIndex) => itemIndex !== index))}>删除</Button>
                                  </Space>
                                }
                              >
                                <div className="strategy-task-summary">
                                  <div className="strategy-task-summary-row">
                                    <Text type="secondary">执行规则</Text>
                                    <Text>{task.scope} · {task.scheduleTime} · {task.scheduleCycle}</Text>
                                  </div>
                                  <div className="strategy-task-summary-row">
                                    <Text type="secondary">适用标签</Text>
                                    <Space size={[4, 4]} wrap>
                                      {(task.audienceTags || []).slice(0, 4).map((item) => <Tag key={item}>{item}</Tag>)}
                                      {(task.audienceTags || []).length > 4 ? <Tag>+{task.audienceTags.length - 4}</Tag> : null}
                                    </Space>
                                  </div>
                                  <div className="strategy-task-summary-row">
                                    <Text type="secondary">输出</Text>
                                    <Space size={[4, 4]} wrap>
                                      {(task.outputResults || []).map((item) => <Tag key={item} color="blue">{item}</Tag>)}
                                    </Space>
                                  </div>
                                  <div className="strategy-task-summary-row">
                                    <Text type="secondary">去向</Text>
                                    <Space size={[4, 4]} wrap>{(task.writeTargets || []).map((item) => <Tag key={item}>{item}</Tag>)}</Space>
                                  </div>
                                </div>
                                <Paragraph className="strategy-task-logic-preview" type="secondary" ellipsis={{ rows: 1, expandable: true, symbol: "展开" }}>{task.logic}</Paragraph>
                              </Card>
                            ))}
                          </div>
                        </div>
                        <Drawer
                          title={strategyTaskEditor?.index == null ? "配置策略任务" : "编辑策略任务"}
                          open={Boolean(strategyTaskEditor)}
                          width={760}
                          onClose={() => setStrategyTaskEditor(null)}
                          className="strategy-task-editor-drawer"
                          extra={<Space><Button onClick={() => setStrategyTaskEditor(null)}>取消</Button><Button type="primary" onClick={saveStrategyTaskDraft}>保存任务</Button></Space>}
                        >
                          <Form layout="vertical" className="strategy-task-modal-form strategy-task-editor-form">
                            <Card size="small" title="基础信息" className="strategy-task-editor-card">
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item label="任务名称">
                                    <Input value={strategyTaskDraft.name} placeholder="例如：生成个性化策略提示词" onChange={(event) => setStrategyTaskDraft((item) => ({ ...item, name: event.target.value }))} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="任务类型">
                                    <Select value={strategyTaskDraft.type} options={strategyTaskTypeOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, type: value }))} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Card>
                            <Card size="small" title="生成配置" className="strategy-task-editor-card">
                              <div className="strategy-task-section-tip">用于控制哪些客户需要生成面向会话智能体的个性化策略提示词，以及按什么时间规则刷新。</div>
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item label="提示词生成对象">
                                    <Select
                                      value={strategyTaskDraft.scope}
                                      options={strategyScopeOptions}
                                      onChange={(value) => setStrategyTaskDraft((item) => ({
                                        ...item,
                                        scope: value,
                                        audienceTags: value === "全部客户" ? [] : item.audienceTags
                                      }))}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="状态">
                                    <Switch checked={strategyTaskDraft.status === "启用"} checkedChildren="启用" unCheckedChildren="停用" onChange={(checked) => setStrategyTaskDraft((item) => ({ ...item, status: checked ? "启用" : "停用" }))} />
                                  </Form.Item>
                                </Col>
                                {strategyTaskDraft.scope !== "全部客户" ? (
                                  <Col span={24}>
                                    <Form.Item label="适用标签人群">
                                      <CommonTagSelectButton
                                        value={strategyTaskDraft.audienceTags}
                                        placeholder="选择需要生成个性化提示词的客户标签"
                                        onClick={openStrategyTaskTagPicker}
                                        onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, audienceTags: value }))}
                                      />
                                    </Form.Item>
                                  </Col>
                                ) : null}
                                <Col span={24}>
                                  <Form.Item label="执行对象规则">
                                    <div className="ai-auto-tag-trigger-panel strategy-task-trigger-panel">
                                      <div className="ai-auto-tag-trigger-tip">满足任一条件即执行：加好友天数规则和用户发出消息条数规则是或的关系。</div>
                                      <div className="ai-auto-tag-trigger-grid">
                                        <div className="ai-auto-tag-trigger-card">
                                          <div className="ai-auto-tag-trigger-card-head">
                                            <Text className="ai-auto-tag-trigger-title">加好友第 X 天</Text>
                                            <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => addStrategyPromptTriggerRule("friendDay")}>添加</Button>
                                          </div>
                                          <div className="ai-auto-tag-trigger-list">
                                            {(strategyTaskDraft.friendDayRules || []).map((value, index) => (
                                              <div className="ai-auto-tag-trigger-row" key={`strategy-friend-day-${index}`}>
                                                <Text className="ai-auto-tag-trigger-prefix">加好友第</Text>
                                                <InputNumber min={1} max={365} value={value} onChange={(nextValue) => updateStrategyPromptTriggerRule("friendDay", index, nextValue)} />
                                                <Text className="ai-auto-tag-trigger-suffix">天生成一次提示词</Text>
                                                <Button type="link" size="small" danger onClick={() => removeStrategyPromptTriggerRule("friendDay", index)}>删除</Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="ai-auto-tag-trigger-card">
                                          <div className="ai-auto-tag-trigger-card-head">
                                            <Text className="ai-auto-tag-trigger-title">用户发出的会话信息条数超过 X 条</Text>
                                            <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => addStrategyPromptTriggerRule("messageCount")}>添加</Button>
                                          </div>
                                          <div className="ai-auto-tag-trigger-list">
                                            {(strategyTaskDraft.messageCountRules || []).map((value, index) => (
                                              <div className="ai-auto-tag-trigger-row" key={`strategy-message-count-${index}`}>
                                                <Text className="ai-auto-tag-trigger-prefix">用户发出消息超过</Text>
                                                <InputNumber min={1} max={1000} value={value} onChange={(nextValue) => updateStrategyPromptTriggerRule("messageCount", index, nextValue)} />
                                                <Text className="ai-auto-tag-trigger-suffix">条生成一次提示词</Text>
                                                <Button type="link" size="small" danger onClick={() => removeStrategyPromptTriggerRule("messageCount", index)}>删除</Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="满足以上条件自然日后">
                                    <Select value={strategyTaskDraft.executeDelayDays || "后 1 天"} options={["后 1 天", "后 2 天", "后 3 天"].map((value) => ({ value }))} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, executeDelayDays: value }))} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="执行时间">
                                    <Input value={strategyTaskDraft.scheduleTime} placeholder="例如：08:00" onChange={(event) => setStrategyTaskDraft((item) => ({ ...item, scheduleTime: event.target.value }))} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Card>
                            <Card size="small" title="数据与输出" className="strategy-task-editor-card">
                              <Row gutter={16}>
                                <Col span={24}>
                                  <div className="strategy-task-section-tip">选择 AI 生成个性化提示词时允许读取的数据。生成结果只服务会话智能体的沟通策略，不直接替代人工判断。</div>
                                  <Form.Item label="数据来源授权">
                                    <Checkbox.Group
                                      value={strategyTaskDraft.inputScope}
                                      className="ai-auto-tag-data-source-list strategy-task-data-source-list"
                                      onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, inputScope: value }))}
                                    >
                                      {strategyPromptDataSourceConfigs.map((item) => (
                                        <div className="ai-auto-tag-data-source-row" key={item.key}>
                                          <Checkbox value={item.key}>{item.name}</Checkbox>
                                          <Text type="secondary">{item.usage}</Text>
                                        </div>
                                      ))}
                                    </Checkbox.Group>
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="生成内容">
                                    <Select mode="multiple" value={strategyTaskDraft.outputResults} options={strategyOutputResultOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, outputResults: value }))} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="写入位置">
                                    <Select mode="multiple" value={strategyTaskDraft.writeTargets} options={strategyWriteTargetOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, writeTargets: value }))} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Card>
                            <Card size="small" title="提示词逻辑" className="strategy-task-editor-card">
                              <Form.Item label="个性化提示词逻辑">
                                <Input.TextArea rows={8} value={strategyTaskDraft.logic} showCount maxLength={1200} placeholder="描述个性化策略提示词的生成条件、引用数据、输出结构和禁止事项。" onChange={(event) => setStrategyTaskDraft((item) => ({ ...item, logic: event.target.value }))} />
                              </Form.Item>
                            </Card>
                          </Form>
                        </Drawer>
                        <CommonTagPickerModal
                          title="选择任务适用标签"
                          open={strategyTaskTagPicker.open}
                          selected={strategyTaskTagPicker.selected}
                          keyword={strategyTaskTagPicker.keyword}
                          rule={strategyTaskTagPicker.rule}
                          ruleOptions={["以下标签满足其一"]}
                          tip="策略任务会根据所选标签圈定适用人群；标签来自统一标签库，后续 AI 自动打标也会遵循标签组的 AI 写入权限。"
                          onCancel={() => setStrategyTaskTagPicker((item) => ({ ...item, open: false }))}
                          onOk={saveStrategyTaskTagPicker}
                          onKeywordChange={(keyword) => setStrategyTaskTagPicker((item) => ({ ...item, keyword }))}
                          onRuleChange={(rule) => setStrategyTaskTagPicker((item) => ({ ...item, rule }))}
                          onSelectedChange={(selected) => setStrategyTaskTagPicker((item) => ({ ...item, selected }))}
                        />
                      </>
                    ) : (
                    <Form
                      form={form}
                      layout="vertical"
                      key={skill.key}
                      initialValues={{
                        name: skill.name,
                        effectiveEvent: "企微加好友",
                        effectiveTag: "已预约体验课",
                        effectiveTagAttribute: "状态标签",
                        effectiveTriggerMode: "延后触发",
                        effectiveAmount: 1,
                        effectiveUnit: "分钟",
                        scheduleRules: [createScheduleRule(0), createScheduleRule(1), createScheduleRule(2)],
                        endRefType: "ADD_FRIEND",
                        endValue: 7,
                        endUnit: "天"
                      }}
                    >
                      <div className="orchestration-form">
                        <div className="orchestration-section">
                          <Text className="orchestration-section-title">1. 智能体名称</Text>
                          <Form.Item name="name"><Input placeholder="请输入智能体名称" /></Form.Item>
                        </div>
                        <div className="orchestration-section">
                          <Text className="orchestration-section-title">2. 生效条件配置</Text>
                          <Text type="secondary">仅支持一条生效条件。</Text>
                          <Form.Item label="选择生效触发条件" name="effectiveEvent" className="schedule-base-item">
                            <Radio.Group>
                              <Radio value="企微加好友">企微加好友</Radio>
                              <Radio value="用户标签">用户标签</Radio>
                              <Radio value="固定时间">固定时间</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate={(prev, next) => prev.effectiveEvent !== next.effectiveEvent}>
                            {({ getFieldValue }) => {
                              const effectiveEvent = getFieldValue("effectiveEvent");
                              return effectiveEvent === "用户标签" ? (
                                <div className="tag-condition-group">
                                  <Text strong>选择用户标签及标准属性</Text>
                                  <div className="tag-condition-row">
                                    <Form.Item name="effectiveTag">
                                      <Select placeholder="选择用户标签，例如：高意向、亲子冲突高、体验后未报名" options={userTagOptions} />
                                    </Form.Item>
                                    <Form.Item name="effectiveTagAttribute">
                                      <Select placeholder="选择标签属性" options={tagAttributeOptions} />
                                    </Form.Item>
                                  </div>
                                </div>
                              ) : null;
                            }}
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate={(prev, next) => prev.effectiveEvent !== next.effectiveEvent || prev.effectiveTagAttribute !== next.effectiveTagAttribute}>
                            {({ getFieldValue }) => {
                              const effectiveEvent = getFieldValue("effectiveEvent");
                              const effectiveTagAttribute = getFieldValue("effectiveTagAttribute");
                              if (effectiveEvent === "固定时间") {
                                return (
                                  <Form.Item label="设置固定生效时间" name="effectiveFixedAt" className="schedule-fixed-time-item">
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="选择具体日期时分秒" />
                                  </Form.Item>
                                );
                              }
                              if (effectiveEvent === "用户标签" && effectiveTagAttribute === "状态标签") {
                                return (
                                  <div className="effective-time-notice">
                                    <Text strong>生效时间：立即生效</Text>
                                    <Text type="secondary">当前选择的是状态标签，状态命中后会立即触发该智能体，不需要配置相对时间或固定时间。</Text>
                                  </div>
                                );
                              }
                              return (
                                <div className="relative-time-row">
                                  <Form.Item label="触发时间设置" name="effectiveTriggerMode">
                                    <Select options={["延后触发"].map((value) => ({ value }))} />
                                  </Form.Item>
                                  <div className="relative-time-value-group">
                                    <Form.Item name="effectiveAmount"><InputNumber min={1} precision={0} placeholder="请输入时间" /></Form.Item>
                                    <Form.Item name="effectiveUnit"><Select options={relativeTimeUnitOptions} /></Form.Item>
                                  </div>
                                </div>
                              );
                            }}
                          </Form.Item>
                        </div>
                        <div className="orchestration-section">
                          <Text className="orchestration-section-title">3. 策略任务配置</Text>
                          <Text type="secondary">智能体生效后按相对时间执行；列表顺序仅便于编排，实际执行看各任务计划时间。</Text>
                          <Form.List name="scheduleRules">
                            {(fields, { add, remove }) => (
                              <div className="schedule-rule-list">
                                {fields.length === 0 ? (
                                  <div className="schedule-empty-state">
                                    <Text type="secondary">暂无策略任务，可点击新增任务进行配置。</Text>
                                  </div>
                                ) : null}
                                {fields.map((field, index) => (
                                  <div className="schedule-rule-row agent-task-rule-row" key={field.key}>
                                    <div className="agent-task-rule-head">
                                      <Text className="agent-task-title">
                                        任务 {index + 1} · {form.getFieldValue(["scheduleRules", field.name, "taskName"]) || getTaskTypeLabel(form.getFieldValue(["scheduleRules", field.name, "taskType"]))}
                                      </Text>
                                      <Space size={8}>
                                        <Button type="link" size="small" onClick={() => openTaskEditor(field.name)}>编辑</Button>
                                        <Button type="link" size="small" danger onClick={() => remove(field.name)}>删除</Button>
                                      </Space>
                                    </div>
                                    <Text type="secondary">{getTaskTypeLabel(form.getFieldValue(["scheduleRules", field.name, "taskType"]))} · {formatTaskPlanTime(form.getFieldValue(["scheduleRules", field.name]))}</Text>
                                    <div className="agent-task-preview">
                                      <Text type="secondary">{form.getFieldValue(["scheduleRules", field.name, "taskDescription"])}</Text>
                                    </div>
                                  </div>
                                ))}
                                <Button type="dashed" className="schedule-add-button" icon={<PlusOutlined />} onClick={() => openTaskEditor(null)}>新增任务</Button>
                                <Drawer
                                  className="agent-task-drawer"
                                  title={taskEditor?.index == null ? "新增策略任务" : "编辑策略任务"}
                                  open={Boolean(taskEditor)}
                                  width={760}
                                  onClose={() => setTaskEditor(null)}
                                  extra={
                                    <Space>
                                      <Button onClick={() => setTaskEditor(null)}>取消</Button>
                                      <Button
                                        type="primary"
                                        onClick={() => {
                                          if (!taskDraft.taskType) {
                                            message.warning("请选择任务类型");
                                            return;
                                          }
                                          if (!taskDraft.delayType) {
                                            message.warning("请选择触发类型");
                                            return;
                                          }
                                          if (taskDraft.delayType === "DELAY" && (taskDraft.delayValue == null || taskDraft.delayValue < 0)) {
                                            message.warning("请填写延后时间");
                                            return;
                                          }
                                          if (taskDraft.delayType === "AT_TIME" && (taskDraft.delayValue == null || taskDraft.delayValue < 0 || taskDraft.delayValue > 23)) {
                                            message.warning("请填写 0-23 点的指定时间");
                                            return;
                                          }
                                          if (taskEditor.index == null) {
                                            add(taskDraft);
                                          } else {
                                            updateScheduleRuleValue(taskEditor.index, taskDraft);
                                          }
                                          setTaskEditor(null);
                                        }}
                                      >
                                        保存任务
                                      </Button>
                                    </Space>
                                  }
                                >
                                  <div className="task-dialog-form agent-task-drawer-form">
                                    <div className="task-dialog-field">
                                      <Text className="task-dialog-label">任务类型 <Tooltip title="选择任务触发的时间锚点"><QuestionCircleOutlined /></Tooltip></Text>
                                      <Select value={taskDraft.taskType} placeholder="任务类型（时间锚点）" options={taskTypeOptions} onChange={(value) => setTaskDraft((item) => ({ ...item, taskType: value }))} />
                                    </div>
                                    <div className="task-dialog-field">
                                      <Text className="task-dialog-label">触发类型 <Tooltip title="设置任务立即执行、延后执行或按指定时间执行"><QuestionCircleOutlined /></Tooltip></Text>
                                      <Select value={taskDraft.delayType} placeholder="触发类型" options={delayTypeOptions} onChange={(value) => setTaskDraft((item) => ({ ...item, delayType: value, delayValue: value === "IMMEDIATE" ? 0 : item.delayValue }))} />
                                    </div>
                                    {taskDraft.delayType === "DELAY" ? (
                                      <div className="task-dialog-field">
                                        <Text className="task-dialog-label">延后时间</Text>
                                        <div className="agent-task-delay-row">
                                          <InputNumber min={0} max={999} value={getDelayHours()} addonAfter="小时" onChange={(value) => updateTaskDelayPart("hours", value)} />
                                          <InputNumber min={0} max={59} value={getDelayMinutes()} addonAfter="分钟" onChange={(value) => updateTaskDelayPart("minutes", value)} />
                                          <Select value={taskDraft.delayUnit || "分钟"} options={relativeTimeUnitOptions} onChange={(value) => setTaskDraft((item) => ({ ...item, delayUnit: value }))} />
                                        </div>
                                      </div>
                                    ) : null}
                                    {taskDraft.delayType === "AT_TIME" ? (
                                      <div className="task-dialog-field">
                                        <Text className="task-dialog-label">指定时间</Text>
                                        <div className="task-row">
                                          <Text type="secondary">当天</Text>
                                          <InputNumber min={0} max={23} value={taskDraft.delayValue} placeholder="0-23" onChange={(value) => setTaskDraft((item) => ({ ...item, delayValue: value, delayUnit: "小时" }))} />
                                          <Text type="secondary">点（已过则次日）</Text>
                                        </div>
                                      </div>
                                    ) : null}
                                    <div className="task-dialog-field">
                                      <Text className="task-dialog-label">任务名称</Text>
                                      <Input value={taskDraft.taskName} allowClear placeholder="可选，便于在列表中识别" onChange={(event) => setTaskDraft((item) => ({ ...item, taskName: event.target.value }))} />
                                    </div>
                                    <div className="task-dialog-field">
                                      <Text className="task-dialog-label">目标人群</Text>
                                      <Radio.Group
                                        value={taskDraft.targetAudienceMode || "全部用户"}
                                        options={["全部用户", "标签选择"].map((value) => ({ value, label: value }))}
                                        onChange={(event) => setTaskDraft((item) => ({
                                          ...item,
                                          targetAudienceMode: event.target.value,
                                          targetTags: event.target.value === "全部用户" ? [] : item.targetTags
                                        }))}
                                      />
                                      {(taskDraft.targetAudienceMode || "全部用户") === "标签选择" ? (
                                        <CommonTagSelectButton
                                          value={taskDraft.targetTags || []}
                                          placeholder="选择标签筛选任务目标人群"
                                          onClick={openTaskTagPicker}
                                          onChange={(value) => setTaskDraft((item) => ({ ...item, targetTags: value }))}
                                        />
                                      ) : null}
                                    </div>
                                    <div className="task-dialog-field">
                                      <Text className="task-dialog-label">任务描述</Text>
                                      <Space wrap className="agent-task-material-actions">
                                        <Upload showUploadList={false}><Button icon={<PictureOutlined />}>本地上传图片</Button></Upload>
                                        <Upload showUploadList={false}><Button icon={<VideoCameraOutlined />}>本地上传视频</Button></Upload>
                                        <Upload showUploadList={false}><Button icon={<PaperClipOutlined />}>本地上传文件</Button></Upload>
                                        <Button type="primary" icon={<FileTextOutlined />}>从素材库选择</Button>
                                        <Button icon={<LinkOutlined />}>远程地址</Button>
                                      </Space>
                                      <Text type="secondary" className="agent-task-variable-tip">可用变量 {"{{ attended_1 }}"}~{"{{ attended_4 }}"}（第1-4节课是否到课，含直播和回放）；{"{{ attended }}"}（当前阶段是否到课）；Skill 同款 {"{{guanxin.*}}"} 摘要变量也会在任务描述进 LLM 前解析。</Text>
                                      <Input.TextArea value={taskDraft.taskDescription} rows={12} showCount maxLength={5000} placeholder="可选，可写较长说明。末尾单独一行写 [ASSET]code 或 [IMAGE]/[VIDEO]/[FILE] 标记，触发后自动发送" onChange={(event) => setTaskDraft((item) => ({ ...item, taskDescription: event.target.value }))} />
                                    </div>
                                  </div>
                                </Drawer>
                                <CommonTagPickerModal
                                  title="选择任务目标人群"
                                  open={taskTagPicker.open}
                                  selected={taskTagPicker.selected}
                                  keyword={taskTagPicker.keyword}
                                  rule={taskTagPicker.rule}
                                  ruleOptions={["以下标签满足其一"]}
                                  tip="定时任务会根据所选标签筛选目标人群；不选择标签时，默认作用于该智能体当前阶段下的全部客户。"
                                  onCancel={() => setTaskTagPicker((item) => ({ ...item, open: false }))}
                                  onOk={saveTaskTagPicker}
                                  onKeywordChange={(keyword) => setTaskTagPicker((item) => ({ ...item, keyword }))}
                                  onRuleChange={(rule) => setTaskTagPicker((item) => ({ ...item, rule }))}
                                  onSelectedChange={(selected) => setTaskTagPicker((item) => ({ ...item, selected }))}
                                />
                              </div>
                            )}
                          </Form.List>
                        </div>
                        <div className="orchestration-section">
                          <Text className="orchestration-section-title">4. 结束条件配置</Text>
                          <Text type="secondary">智能体生效后，按下方时长判定结束。</Text>
                          <div className="trigger-time-row">
                            <Form.Item name="endRefType">
                              <Select placeholder="结束事件" options={endRefTypeOptions} />
                            </Form.Item>
                            <Form.Item name="endValue">
                              <InputNumber min={1} max={9999} placeholder="时长" />
                            </Form.Item>
                            <Form.Item name="endUnit">
                              <Select placeholder="单位" options={relativeTimeUnitOptions} />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Form>
                    )}
                  </section>
                </div>
              )
            },
            {
              key: "tools",
              label: "工具配置",
              children: renderRelationConfigTab("tools")
            },
            {
              key: "agent-skills",
              label: "Skill配置",
              children: renderRelationConfigTab("skills")
            },
            {
              key: "knowledge",
              label: "知识库配置",
              children: renderRelationConfigTab("knowledge")
            },
            {
              key: "debug",
              label: "预览调试",
              children: (
                <div className="skill-debug-layout">
                  <div className="debug-user-preset">
	                    <div className="builder-pane-head">
	                      <Title level={4}>用户信息描述</Title>
	                    </div>
	                    <div className="debug-preset-input">
	                      <Input.TextArea
	                        value={debugPresetDescription}
	                        autoSize={{ minRows: 18, maxRows: 28 }}
	                        placeholder="输入用户信息描述，例如孩子年级、主要问题、家长痛点、购买状态、听课情况、历史对话摘要等模拟上下文。"
	                        onChange={(event) => setDebugPresetDescription(event.target.value)}
	                      />
	                      <Button className="debug-preset-save" type="primary" block onClick={() => message.success("用户信息描述已保存")}>保存用户信息描述</Button>
                    </div>
                  </div>
                  <section className="skill-preview-pane">
                    <div className="builder-pane-head">
	                      <Title level={4}>对话内容</Title>
                      <Space>
                        <Tooltip title="运行调试"><Button shape="circle" type="primary" icon={<CloudSyncOutlined />} onClick={runDebugPreset} /></Tooltip>
                      </Space>
                    </div>
                    <div className="skill-debug-workbench">
                      <div className="debug-chat-shell">
                        <div className="debug-chat">
                          {debugMessages.map((message) => (
                            <div key={message.key} className={message.from === "user" ? "debug-message user" : "debug-message ai"}>
                              <Text type="secondary">{message.from === "user" ? "模拟用户" : skill.name}</Text>
                              <div className={message.kind === "voice" ? "debug-media-line voice" : message.kind === "image" ? "debug-media-line image" : "debug-message-text"}>
                                {message.kind === "voice" ? <AudioOutlined /> : null}
                                {message.kind === "image" ? <PictureOutlined /> : null}
                                <span>{message.text}</span>
                              </div>
                              {message.from === "ai" ? (
                                <Button type="link" size="small" className="debug-trace-link" icon={<FileSearchOutlined />} onClick={() => setDebugTrace(message.trace)}>查看逻辑</Button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                        <div className="debug-input-bar">
                          <Tooltip title="模拟用户语音"><Button shape="circle" icon={<AudioOutlined />} onClick={() => sendDebugMedia("voice")} /></Tooltip>
                          <Tooltip title="模拟用户图片"><Button shape="circle" icon={<PictureOutlined />} onClick={() => sendDebugMedia("image")} /></Tooltip>
                          <Input value={debugInput} placeholder="输入模拟用户的聊天内容..." onChange={(event) => setDebugInput(event.target.value)} onPressEnter={sendDebugText} />
                          <Button type="primary" icon={<SendOutlined />} onClick={sendDebugText}>发送</Button>
                        </div>
                      </div>
	                      <aside className="debug-logic-panel">
	                        <div className="stage-panel-head">
	                          <Title level={4}>当前智能体流程阶段</Title>
	                          <Space size={8}>
	                            <Button type="link" size="small">收起</Button>
	                            <Button size="small">编辑</Button>
	                          </Space>
	                        </div>
	                        <div className="debug-stage-card stage-flow-card">
	                          <div className="stage-flow-title">流程阶段 2 · D1-青少年厌学休学游戏破局一周家长训练营-【0816期】</div>
	                          <div className="stage-flow-subtitle">第 2 段 · 1 个智能体 · 状态 启用</div>
	                          <div className="stage-flow-meta">
	                            <Text>预计开始：排课「D1-青少年厌学休学游戏破局一周家长训练营-【0816期】」当天</Text>
	                            <Text>预计结束：agent 生效 后 1 天</Text>
	                            <Text>实际开始：-（按客户运行）</Text>
	                            <Text>实际结束：-（按客户运行）</Text>
	                          </div>
	                          <Text type="secondary" className="stage-flow-note">预计时间按首个绑定智能体的规则计算；实际时间按客户运行产生</Text>
	                        </div>
	                        <div className="debug-task-card stage-agent-card">
	                          <div className="stage-agent-head">
	                            <div>
	                              <div className="stage-agent-title">【19a】Day1</div>
	                              <Text type="secondary">6 条策略任务 · 消息生成 · 19a A类 Day1 · 上课第一天</Text>
	                            </div>
	                            <Space size={8} className="stage-agent-actions">
	                              <Button type="link" size="small" danger>移除</Button>
	                              <Button type="link" size="small">工具配置</Button>
	                              <Button type="link" size="small">策略任务 &gt;</Button>
	                            </Space>
	                          </div>
	                          <div className="stage-task-list">
	                            {stageTaskRows.map((task, index) => (
	                              <div className="stage-task-row" key={`${task.title}-${index}`}>
	                                <div className="stage-task-name">
	                                  <Badge count={index + 1} color="#e8eef7" />
	                                  <Text>{task.title}</Text>
	                                </div>
	                                <div className="stage-task-tags">
	                                  <Tag>{task.trigger}</Tag>
	                                  <Tag color="orange">触发：{task.delay}</Tag>
	                                  <Tag color="green">{task.status}</Tag>
	                                </div>
	                              </div>
	                            ))}
	                          </div>
	                        </div>
	                      </aside>
                    </div>
                  </section>
                </div>
              )
            }
          ]}
        />
      </Card>
      {renderRelationPickerModal()}
      <KnowledgeResourcePickerModal
        open={agentKnowledgePickerOpen}
        selectedKeys={agentKnowledgePickerKeys}
        onSelectedChange={setAgentKnowledgePickerKeys}
        onClose={() => setAgentKnowledgePickerOpen(false)}
        onOk={saveAgentKnowledgeResources}
      />
      <Modal
        title={debugTrace?.title || "执行链路说明"}
        open={Boolean(debugTrace)}
        onCancel={() => setDebugTrace(null)}
        footer={<Button type="primary" onClick={() => setDebugTrace(null)}>知道了</Button>}
        width={860}
      >
        {debugTrace ? (
          <div className="execution-modal-content">
            <div className="execution-process-section">
              <Title level={5}>过程说明</Title>
              <ul className="execution-step-list">
                {debugTrace.steps.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
            <div className="execution-chain-card">
              <div className="execution-chain-head">
                <Text>执行链路</Text>
                <Tag color="processing">命中智能体：【19a】Day0</Tag>
              </div>
              <Text type="secondary" className="execution-chain-desc no-indent">当前用户仍在定需和初步判断阶段，本轮优先理解孩子问题和家长痛点，不直接推品。</Text>
              <div className="execution-chain-list">
                {executionSkillRows.map((item, index) => (
                  <div className="execution-chain-row" key={item.title}>
                    <Badge count={index + 1} color="#e8eef7" />
                    <div>
                      <Space size={6} wrap>
                        <Text>{item.title}</Text>
                        <Tag color="blue">{item.tag}</Tag>
                      </Space>
                      <Text type="secondary" className="execution-chain-desc">{item.desc}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="execution-modal-grid">
              <div className="execution-chain-card">
                <div className="execution-chain-head"><Text>工具调用</Text></div>
                {executionToolRows.map((item) => (
                  <div className="execution-resource-row" key={item.title}>
                    <ToolOutlined />
                    <div>
                      <Space size={6} wrap><Text>{item.title}</Text><Tag color={item.tag === "成功" ? "green" : "default"}>{item.tag}</Tag></Space>
                      <Text type="secondary">{item.desc}</Text>
                    </div>
                  </div>
                ))}
              </div>
              <div className="execution-chain-card">
                <div className="execution-chain-head"><Text>知识库引用</Text></div>
                {executionKnowledgeRows.map((item) => (
                  <div className="execution-resource-row" key={item.title}>
                    <BookOutlined />
                    <div>
                      <Text>{item.title}</Text>
                      <Text type="secondary">{item.desc}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="execution-process-section">
              <Title level={5}>规则校验</Title>
              <Space wrap>
                {debugTrace.checks.map((check) => <Tag color="blue" key={check}>{check}</Tag>)}
              </Space>
            </div>
            <div className="execution-chain-card final-reply-section">
              <div className="execution-chain-head"><Text>最终回复</Text></div>
              <div className="execution-final-reply">
                {debugMessages.find((item) => item.trace === debugTrace)?.text || "已根据当前执行过程生成回复。"}
              </div>
              <Space wrap>
                <Tag color="green">合规通过</Tag>
                <Tag color="blue">继续定需</Tag>
                <Tag>本轮不推品</Tag>
              </Space>
            </div>
          </div>
        ) : null}
      </Modal>
    </Space>
  );
}


export default StrategyEditor;
