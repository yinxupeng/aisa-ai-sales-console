import React, { useState } from "react";
import {
  App as AntApp,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload
} from "antd";
import {
  AlertOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileSearchOutlined,
  PlusOutlined,
  RobotOutlined,
  TagsOutlined,
  UploadOutlined,
  UserOutlined
} from "@ant-design/icons";
import { CommonTagPickerModal, CommonTagSelectButton } from "../components/CommonTagPicker";
import {
  aiGeneratedTagValues,
  knowledgeBases,
  strategies,
  tagGroupsSeed,
  tagRoleOptions
} from "../data/appData";
import { PanelTitle } from "../components/PageChrome";


const { Paragraph, Text, Title } = Typography;

const buildKnowledgeResourceRows = () => knowledgeBases.flatMap((base) => [
  {
    key: `base:${base.key}`,
    name: base.name,
    path: `${base.category} / ${base.name}`,
    relationType: "文件夹",
    contentType: "目录",
    status: base.status,
    desc: base.desc,
    category: base.category,
    updatedAt: base.updated,
    entries: base.entries || []
  },
  ...(base.entries || []).map((entry) => ({
    key: `entry:${entry.key}`,
    name: entry.title,
    path: `${base.category} / ${base.name} / ${entry.title}`,
    relationType: "资源",
    contentType: entry.media === "文本" ? "text/markdown" : entry.media,
    knowledgeType: entry.type,
    status: entry.status,
    desc: entry.content || `${entry.title}：用于 ${base.name} 场景，回答时需以知识库内容为准，不编造未维护的信息。`,
    category: base.category,
    updatedAt: base.updated
  }))
]);


function TagLibraryPage({ onViewConversation }) {
  const { message } = AntApp.useApp();
  const [groups, setGroups] = useState(tagGroupsSeed);
  const [roleFilter, setRoleFilter] = useState("全部部门角色");
  const [keyword, setKeyword] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [aiTagAgentOpen, setAiTagAgentOpen] = useState(false);
  const [activeAiTagAgentDataSourceKey, setActiveAiTagAgentDataSourceKey] = useState(null);
  const [selectedAiTagKnowledgeFiles, setSelectedAiTagKnowledgeFiles] = useState(["entry:ke-1", "entry:ke-4"]);
  const [selectedAiTagPromptAgents, setSelectedAiTagPromptAgents] = useState(["s1", "s2", "s5"]);
  const [aiAutoTagConfigOpen, setAiAutoTagConfigOpen] = useState(false);
  const [aiAutoTagRecordOpen, setAiAutoTagRecordOpen] = useState(false);
  const [activeAutoTagDataSourceKey, setActiveAutoTagDataSourceKey] = useState(null);
  const [tagGroupReason, setTagGroupReason] = useState(null);
  const [tagRuleDetail, setTagRuleDetail] = useState(null);
  const [manualTagRules, setManualTagRules] = useState({});
  const [manualTagSources, setManualTagSources] = useState({});
  const [aiApprovedTagSources, setAiApprovedTagSources] = useState({});
  const [tagReviewModalOpen, setTagReviewModalOpen] = useState(false);
  const [aiAutoTagRecordDetail, setAiAutoTagRecordDetail] = useState(null);
  const [tagReviewDetailBatchKey, setTagReviewDetailBatchKey] = useState(null);
  const [activeTagReviewBatchKey, setActiveTagReviewBatchKey] = useState("tag-review-batch-20260826");
  const [selectedTagReviewChangeKeys, setSelectedTagReviewChangeKeys] = useState([]);
  const [tagReviewDecisions, setTagReviewDecisions] = useState({});
  const [reviewRuleDrafts, setReviewRuleDrafts] = useState({});
  const [tagRuleDraft, setTagRuleDraft] = useState("");
  const [tagDrafts, setTagDrafts] = useState({});
  const [form] = Form.useForm();
  const [autoTagConfigForm] = Form.useForm();
  const [selectedAutoTagVariables, setSelectedAutoTagVariables] = useState({
    用户沟通数据: ["conversation.recent_messages", "conversation.user_messages", "conversation.sales_messages", "conversation.sensitive_words", "conversation.last_contact_time"],
    客户档案: ["profile.child_grade", "profile.core_problem", "profile.parent_demand", "profile.current_summary", "profile.risk_note"]
  });
  const [autoTagFriendDayRules, setAutoTagFriendDayRules] = useState([3, 5]);
  const [autoTagMessageCountRules, setAutoTagMessageCountRules] = useState([10, 20]);
  const aiTagAgentPrompt = `# 角色定位

你是“AI标签库生成管理智能体”，同时具备青少年心理教育行业客户洞察、用户运营标签体系设计、销售转化分析和标签规则治理经验。

你的任务不是直接修改正式标签库，而是基于已授权的数据和业务规则，生成一批可供人工审核的 AI生成标签提案，形成候选标签库变更记录。所有结果必须经过人工审核，通过后才允许写入正式标签库。

# 业务背景

本业务服务对象主要是存在学业适应、亲子沟通、情绪行为或成长支持需求的孩子家庭，沟通对象通常是家长。平台通过企业微信托管、销售跟进、课程服务、客户档案、标签库和策略洞察来支持体验课用户转化为正价课用户。

标签库的目标是帮助运营、销售和 AI 智能体稳定识别用户特征、需求阶段、购买意向、产品兴趣、跟进策略和风险预警。标签必须能被业务人员理解，也必须能被后续 AI 自动打标规则执行。

# 输入数据

你只能使用本次任务已授权的数据来源和已选择的变量字段。常见数据包括但不限于：

1. 企业知识库：产品服务清单、课程类型、价格区间、适用人群、服务边界、业务SOP。
2. 智能体提示词：会话智能体、策略智能体、Skill 中已经定义的业务规则和服务流程。
3. 用户沟通数据：家长与销售、班主任、AI托管账号的企微会话记录、最近沟通摘要、敏感词命中信息。
4. 客户档案：孩子年龄/年级、核心问题、家长诉求、最近跟进摘要、风险备注、人工维护信息。
5. 用户业务数据：用户状态、用户等级、服务阶段、课程行为、订单状态、运营导入字段。
6. 现有标签数据：正式标签库、已有标签组、已生效标签、人工标签、AI历史打标记录、标签规则版本。

如果某类数据没有被授权或变量字段没有被选择，禁止基于该类数据做判断，也禁止假设其存在。

# 生成目标

你需要输出结构化的标签库候选变更，变更类型只允许包括：

1. 新增标签：发现现有标签库未覆盖、具备稳定业务价值、满足样本量要求的新标签。
2. 修改标签规则：现有标签名称仍然合理，但 AI打标依据、判断条件、排除条件或证据要求需要优化。
3. 建议删除：现有标签长期低频、语义重复、业务不可执行、风险过高或不适合继续自动打标。

当前阶段不主动新增标签组。你只能在已选择的已有标签组下生成标签提案或规则变更，也就是只在已选择的已有标签组下生成候选标签。如果发现现有标签组无法承载某类高价值特征，只输出“标签组优化建议”，不得直接生成新标签组。

# 与现有标签和人工标签的关系

1. 现有正式标签库优先：生成任何新增标签前，必须与现有标签逐一去重。
2. 人工标签优先：人工创建、人工修改、人工确认过的标签和规则优先级高于 AI 生成结果，不得覆盖人工维护标签。
3. AI历史标签仅作参考：可以用于发现趋势和冲突，但不能作为新增标签的唯一依据。
4. 语义相似度≥70%时，不允许新增标签，应输出“修改标签规则”或“合并建议”。
5. 如果新发现的标签与已有标签语义接近但业务口径不同，必须解释差异，例如适用人群、判断依据、跟进策略或风险等级不同。
6. 如果标签之间存在互斥或冲突，必须在输出中说明冲突关系和建议保留口径。
7. 已经由人工明确驳回过的标签，不得再次以相同名称或同义表达重复提出，除非新增数据能证明业务情况发生明显变化。

# 标签生成标准

每个新增标签必须同时满足以下条件：

1. 业务价值明确：能服务用户分层、销售跟进、课程推荐、风险识别、运营触达或智能体沟通策略。
2. 标签含义单一：一个标签只能表达一个清晰特征，不能把多个判断混在一起。
3. 可被业务人员理解：命名使用业务语言，避免技术词、模型词、过度抽象词。
4. 可被 AI 自动判断：必须能写出明确的 AI打标依据，包括触发条件、排除条件和证据要求。
5. 最小样本量：同一类特征至少需要≥10个独立用户稳定出现，少于10个用户只记录观察，不生成标签提案。
6. 跨用户稳定：不能因为单个用户、单条极端对话或一次偶发提及生成标签。
7. 与现有标签不重复：与现有标签语义相似度≥70%时不新增。
8. 不替代状态字段：订单状态、课程阶段、用户等级、托管状态等客观系统状态，优先作为状态字段，不建议生成画像标签。

# 标签规则生成要求

每个新增标签或修改标签规则都必须给出可执行的 AI打标依据。规则必须包含：

1. 正向判断条件：哪些表达、行为、档案字段或业务数据共同出现时可以打标。
2. 关键词或语义特征：列出3-5个核心关键词、典型表达或语义模式。
3. 证据要求：说明至少需要几类证据、几次出现、是否需要历史数据印证。
4. 排除条件：哪些情况不能打标，例如偶然提及、引用他人观点、销售主动引导、用户明确否认。
5. 置信度建议：高/中/低置信度如何区分。
6. 人工审核条件：哪些情况下必须进入人工审核，不能自动生效。
7. 规则版本说明：如果是修改规则，需要说明旧规则的问题和新规则的变化。

规则必须是“可执行判断”，不能只写概念解释。例如不要只写“用户有焦虑”，而要写“用户或客户档案中多次出现担心孩子状态、睡眠/上学/沟通问题，并伴随求助或解决方案询问，且不是单次情绪宣泄”。

# 分析步骤

请严格按以下流程完成分析：

步骤1：数据准备
- 读取已授权数据和已选择变量字段。
- 按用户维度聚合沟通记录、客户档案、课程行为、订单状态和已有标签。
- 区分用户主动表达、销售引导表达、AI托管消息、人工档案和系统状态。

步骤2：高频特征扫描
- 统计高频出现的痛点、诉求、行为、情绪词、产品兴趣、购买顾虑和风险信号。
- 每个候选特征都要统计独立用户数，不能只统计消息条数。
- 对极端词、敏感词和风险词单独标记，不进入普通标签生成。

步骤3：聚类归因
- 将相似诉求或行为聚合为候选特征簇。
- 每个特征簇至少需要≥10个独立用户支持。
- 提炼该特征簇的业务含义、适用场景和可能所属标签组。

步骤4：现有标签比对
- 与现有标签库、人工标签、AI历史标签逐一比对。
- 如果语义相似度≥70%，不要新增标签，改为输出修改标签规则或合并建议。
- 如果已有标签由人工维护，必须尊重人工口径，不得覆盖，只能提出优化建议。

步骤5：风险与合规检查
- 检查是否涉及医疗诊断、隐私侵犯、负面定性、歧视性表述或过度推断。
- 检查是否会误导销售做出不恰当承诺。
- 检查是否适合 AI 自动打标，敏感或高风险标签必须建议人工审核。

步骤6：生成候选变更
- 按“新增标签 / 修改标签规则 / 建议删除”输出。
- 每条变更必须包含 AI判断原因和 AI打标依据。
- 每条变更必须说明所属标签组、样本量、证据来源、建议审核方式。
- 所有结果都只是候选提案，不得直接写入正式标签库。

# 禁止行为

1. 禁止生成明确医疗诊断标签，例如“抑郁症”“ADHD”“焦虑症”等；可替换为行为或状态描述，例如“情绪低落表达”“注意力分散表现”“焦虑表达明显”。
2. 禁止生成隐私侵犯标签，例如真实姓名、学校名称、具体住址、联系方式、身份证明等。
3. 禁止生成负面定性标签，例如“差生”“问题家长”“不配合家长”“难搞客户”等。
4. 禁止基于单条对话、单个用户、销售主观判断或AI托管消息单独生成标签。
5. 禁止为了覆盖更多人群而生成含义宽泛、无法执行的标签。
6. 禁止把纯系统状态包装成标签，例如“已支付”“已退款”“已上课”，除非它承载明确运营策略且无法用状态字段表达。
7. 禁止直接修改、删除或覆盖正式标签库，必须生成待审核提案。
8. 禁止输出没有打标规则的标签。

# 敏感风险处理

如果数据中出现自杀、自残、伤人、极端崩溃、严重失控、疑似医疗风险等内容：

1. 不纳入普通标签分析。
2. 单独输出风险预警。
3. 不生成医疗诊断。
4. 建议转人工或专业人员介入。
5. 如果确实需要标签表达，只能使用行为描述和风险级别，例如“高危风险需人工介入”，并标记必须人工审核。

# 输出格式

请严格输出结构化结果，字段如下：

## 一、生成摘要
- 本次分析数据范围：
- 覆盖用户数：
- 有效样本用户数：
- 发现候选特征数：
- 输出新增标签数：
- 输出修改标签规则数：
- 输出建议删除数：
- 需要人工重点审核的问题：

## 二、候选变更列表
每条变更按以下字段输出：

- 变更类型：新增标签 / 修改标签规则 / 建议删除
- 所属标签组：
- 标签名称：
- AI判断原因：
- 独立用户样本量：
- 主要证据来源：
- 与现有标签关系：新增 / 与某标签相似 / 建议合并 / 人工标签冲突 / 无冲突
- AI打标依据：
  - 正向判断条件：
  - 关键词或语义特征：
  - 证据要求：
  - 排除条件：
  - 置信度建议：
  - 必须人工审核条件：
- 建议操作：通过 / 修改后通过 / 驳回 / 合并到已有标签 / 保留观察

## 三、标签组优化建议
如果发现已有标签组无法承载某类业务特征，只输出建议，不直接创建标签组。

## 四、风险预警
列出不进入普通标签库的高风险内容、原因和建议处理方式。

## 五、不生成说明
列出因为样本量不足、与现有标签重复、风险过高、含义不清或不适合作为标签而未生成的候选项。

# 最终原则

你生成的是候选标签库变更，不是正式标签库。审核通过后才允许写入正式标签库；人工标签、人工修改规则和人工审核结论永远优先于 AI 生成结果。`;
  const totalTags = groups.reduce((sum, group) => sum + group.tags.length, 0);
  const roleFilterOptions = [{ label: "全部部门角色", value: "全部部门角色" }, ...tagRoleOptions];
  const filteredGroups = groups.filter((group) => {
    const keywordText = keyword.trim().toLowerCase();
    const matchesRole = roleFilter === "全部部门角色" || group.roles.includes(roleFilter);
    const matchesKeyword = !keywordText || [group.name, ...group.tags].some((item) => String(item).toLowerCase().includes(keywordText));
    return matchesRole && matchesKeyword;
  });
  const aiTagAgentDataSourceConfigs = [
    {
      key: "企业知识库",
      name: "企业知识库",
      desc: "选择现有知识库中的文件，作为生成标签组、标签内容和规则的业务背景。",
      configTitle: "选择知识库文件"
    },
    {
      key: "智能体提示词",
      name: "智能体提示词",
      desc: "选择现有智能体，代表读取该智能体的角色逻辑、业务边界和提示词规则。",
      configTitle: "选择智能体提示词"
    },
    {
      key: "用户沟通数据",
      name: "用户沟通数据",
      desc: "配置用于分析的代表性用户对话样本，也支持上传导入企业提供的用户对话数据文件。",
      configTitle: "用户沟通数据配置"
    }
  ];
  const activeAiTagAgentDataSource = aiTagAgentDataSourceConfigs.find((item) => item.key === activeAiTagAgentDataSourceKey);
  const aiTagKnowledgeFileRows = buildKnowledgeResourceRows().filter((item) => item.relationType === "资源");
  const aiTagPromptAgentRows = strategies.map((item) => ({
    key: item.key,
    name: item.name,
    category: item.agentCategory || "会话智能体",
    type: item.type,
    input: item.input,
    output: item.output,
    status: item.status
  }));
  const aiAutoTagDataSourceConfigs = [
    {
      key: "用户沟通数据",
      name: "用户沟通数据",
      source: "企微会话记录、AI托管消息记录",
      fields: ["客户ID", "发送人类型", "消息内容", "消息类型", "发送时间", "是否AI消息", "敏感词命中"],
      variables: [
        { key: "conversation.recent_messages", variable: "{{conversation.recent_messages}}", meaning: "最近沟通记录", defaultValue: "最近7天，最多100条，包含用户消息和销售消息" },
        { key: "conversation.user_messages", variable: "{{conversation.user_messages}}", meaning: "用户发送的消息", defaultValue: "排除销售消息和AI托管消息，仅保留用户表达" },
        { key: "conversation.sales_messages", variable: "{{conversation.sales_messages}}", meaning: "销售发送的消息", defaultValue: "人工销售消息，用于判断跟进承诺和服务上下文" },
        { key: "conversation.ai_messages", variable: "{{conversation.ai_messages}}", meaning: "AI托管消息", defaultValue: "AI自动回复内容，用于避免重复沟通和识别托管边界" },
        { key: "conversation.sensitive_words", variable: "{{conversation.sensitive_words}}", meaning: "敏感词命中", defaultValue: "仅输出命中词和上下文片段，不进入普通标签判断" },
        { key: "conversation.last_contact_time", variable: "{{conversation.last_contact_time}}", meaning: "最近沟通时间", defaultValue: "当前客户最近一条有效消息时间" }
      ],
      params: ["数据范围：要打标签用户的全部对话数据", "消息角色：用户消息、销售消息、AI托管消息", "消息类型：文本、语音转写", "脱敏：开启"],
      usage: "默认读取要打标签用户的全部对话数据，用于识别用户核心表达、痛点、购买意向、风险词和反复出现的诉求；单条偶发内容不能直接作为打标依据。"
    },
    {
      key: "客户档案",
      name: "客户档案",
      source: "客户资料、销售维护档案、AI摘要档案",
      fields: ["客户ID", "孩子年龄/年级", "核心问题", "家长诉求", "负责销售", "最近跟进摘要", "风险备注"],
      variables: [
        { key: "profile.child_grade", variable: "{{profile.child_grade}}", meaning: "孩子年龄/年级", defaultValue: "客户档案中最新有效年龄或年级字段" },
        { key: "profile.core_problem", variable: "{{profile.core_problem}}", meaning: "核心问题", defaultValue: "人工档案和AI档案摘要中的稳定问题描述" },
        { key: "profile.parent_demand", variable: "{{profile.parent_demand}}", meaning: "家长诉求", defaultValue: "销售维护或AI总结出的主要求助目标" },
        { key: "profile.current_summary", variable: "{{profile.current_summary}}", meaning: "最近跟进摘要", defaultValue: "最近一次有效跟进摘要，人工维护优先" },
        { key: "profile.risk_note", variable: "{{profile.risk_note}}", meaning: "风险备注", defaultValue: "客户档案中已确认的风险备注" }
      ],
      params: ["数据范围：企业给到的客户档案数据", "读取范围：当前客户最新档案", "历史摘要：最近一次有效摘要", "脱敏：开启"],
      usage: "默认读取企业给到的客户档案数据，用于校验会话判断是否与客户长期背景一致，避免只凭最近一次对话误打标签。"
    },
    {
      key: "课程行为",
      name: "课程行为",
      source: "课程进度、听课记录、课节行为数据",
      fields: ["课程ID", "课程名称", "完课率", "看课时长", "最近上课时间", "缺课次数", "课后反馈"],
      variables: [
        { key: "course.current_stage", variable: "{{course.current_stage}}", meaning: "当前课程阶段", defaultValue: "体验课、正价课或课后服务阶段" },
        { key: "course.completion_rate", variable: "{{course.completion_rate}}", meaning: "完课率", defaultValue: "当前课程已完成课节占比" },
        { key: "course.watch_duration", variable: "{{course.watch_duration}}", meaning: "看课时长", defaultValue: "最近30天累计有效观看时长" },
        { key: "course.absence_count", variable: "{{course.absence_count}}", meaning: "缺课次数", defaultValue: "最近30天未按计划完成课节次数" },
        { key: "course.feedback", variable: "{{course.feedback}}", meaning: "课后反馈", defaultValue: "最近一次课后反馈或班主任记录" }
      ],
      params: ["课程范围：体验课与正价课", "时间范围：最近30天", "异常行为：缺课、低完课率、重复观看"],
      usage: "用于判断体验后未报名、课程参与度、复盘触达价值等运营标签。"
    },
    {
      key: "订单状态",
      name: "订单状态",
      source: "订单系统、支付系统、退款记录",
      fields: ["订单ID", "课程商品", "支付状态", "支付金额", "下单时间", "退款状态", "优惠使用"],
      variables: [
        { key: "order.paid_status", variable: "{{order.paid_status}}", meaning: "支付状态", defaultValue: "当前客户最新有效订单支付状态" },
        { key: "order.product_name", variable: "{{order.product_name}}", meaning: "课程商品", defaultValue: "体验课、正价课或其他已购商品名称" },
        { key: "order.paid_amount", variable: "{{order.paid_amount}}", meaning: "支付金额", defaultValue: "按权限脱敏后的订单金额区间" },
        { key: "order.refund_status", variable: "{{order.refund_status}}", meaning: "退款状态", defaultValue: "是否存在退款申请、退款中或已退款" },
        { key: "order.last_paid_time", variable: "{{order.last_paid_time}}", meaning: "最近下单时间", defaultValue: "最近一笔有效订单时间" }
      ],
      params: ["订单范围：当前客户全部有效订单", "退款订单：仅读状态不进入销售推断", "金额字段：按权限脱敏"],
      usage: "用于确认客户购买阶段、是否已报名、是否存在退款或价格敏感相关判断。"
    },
    {
      key: "已有标签",
      name: "已有标签",
      source: "当前已生效用户标签、人工标签、AI历史打标记录",
      fields: ["标签名", "标签组", "来源", "生效状态", "更新时间", "人工修改标记"],
      variables: [
        { key: "tag.current_tags", variable: "{{tag.current_tags}}", meaning: "当前已生效标签", defaultValue: "当前客户全部生效标签，按标签组聚合" },
        { key: "tag.manual_tags", variable: "{{tag.manual_tags}}", meaning: "人工标签", defaultValue: "销售或运营人工维护的标签" },
        { key: "tag.ai_tags", variable: "{{tag.ai_tags}}", meaning: "AI历史打标", defaultValue: "AI自动打标历史结果及置信度" },
        { key: "tag.rule_versions", variable: "{{tag.rule_versions}}", meaning: "规则版本", defaultValue: "当前生效标签对应的打标规则版本" },
        { key: "tag.conflicts", variable: "{{tag.conflicts}}", meaning: "标签冲突", defaultValue: "语义冲突或互斥标签的当前状态" }
      ],
      params: ["读取范围：当前客户全部已生效标签", "来源区分：AI、人工", "冲突处理：人工标签优先"],
      usage: "用于避免重复打标、识别标签冲突，并在规则冲突时优先保留人工维护结果。"
    },
    {
      key: "用户业务数据",
      name: "用户业务数据",
      source: "业务系统扩展字段、运营导入数据",
      fields: ["用户状态", "用户等级", "服务阶段", "业务分层", "运营备注", "外部导入字段"],
      variables: [
        { key: "business.user_status", variable: "{{business.user_status}}", meaning: "用户状态", defaultValue: "纯新用户、体验课用户、正价课用户等业务状态" },
        { key: "business.user_level", variable: "{{business.user_level}}", meaning: "用户等级", defaultValue: "S/A/B/C等客户分层" },
        { key: "business.service_stage", variable: "{{business.service_stage}}", meaning: "服务阶段", defaultValue: "当前角色流程或业务服务阶段" },
        { key: "business.latest_followup_stage", variable: "{{business.latest_followup_stage}}", meaning: "最近跟进阶段", defaultValue: "销售或班主任最近一次跟进后的阶段结果" },
        { key: "business.operation_note", variable: "{{business.operation_note}}", meaning: "运营备注", defaultValue: "已授权运营导入字段或备注信息" }
      ],
      params: ["字段范围：仅读取已授权业务字段", "缺失处理：不参与对应标签判断", "脱敏：按字段权限执行"],
      usage: "用于补充系统化业务状态，避免 AI 把稳定状态类字段误当成普通语义标签。"
    }
  ];
  const autoTagVisibleDataSourceConfigs = aiAutoTagDataSourceConfigs.filter((item) => ["用户沟通数据", "客户档案"].includes(item.key));
  const activeAutoTagDataSource = autoTagVisibleDataSourceConfigs.find((item) => item.key === activeAutoTagDataSourceKey);
  const aiTagReviewBatches = [
    {
      key: "tag-review-batch-20260826",
      name: "2026-08-26 09:00 AI生成批次",
      generatedAt: "2026-08-26 09:00",
      trigger: "定时生成",
      status: "待审核",
      dataScope: "企业知识库、智能体提示词、用户沟通数据、客户档案、用户业务数据、现有标签数据",
      summary: { newTags: 3, modified: 2, deleted: 1 },
      changes: [
        {
          key: "new-tag-return-school",
          type: "新增标签",
          groupKey: "tag-group-child-problem",
          groupName: "孩子问题画像",
          tagName: "返校困难",
          aiSuggestion: "近30天沟通中有较多家长反复提到孩子请假、拒绝上学、担心返校后再次冲突，独立用户数超过10人。",
          ruleText: "AI打标依据：家长明确描述孩子存在不愿返校、返校后情绪明显波动、因学校场景持续逃避上学等情况，并且该问题是当前沟通核心诉求。排除条件：仅短期请假、偶发不想上学，或主要问题已由其他标签覆盖。"
        },
        {
          key: "new-tag-parent-cooperation",
          type: "新增标签",
          groupKey: "tag-group-parent-awareness",
          groupName: "家长认知阶段",
          tagName: "愿意配合家庭作业",
          aiSuggestion: "多名家长明确表示愿意按老师建议完成家庭沟通练习，适合后续班主任服务跟进。",
          currentValue: "家长认知阶段中暂无该标签",
          proposedValue: "新增标签：愿意配合家庭作业",
          ruleText: "AI打标依据：家长明确表示愿意按建议完成家庭沟通练习、课后记录或亲子互动任务，并在后续对话中持续配合。排除条件：仅礼貌性回复“可以”但没有具体配合动作。"
        },
        {
          key: "new-tag-case-sensitive",
          type: "新增标签",
          groupKey: "tag-group-purchase-intent",
          groupName: "购买意向",
          tagName: "重视同类案例",
          aiSuggestion: "咨询转化中反复出现“有没有类似孩子案例”“别人家改善了吗”等决策信号。",
          currentValue: "购买意向中暂无该标签",
          proposedValue: "新增标签：重视同类案例",
          ruleText: "AI打标依据：家长主动询问相似孩子、相似家庭或同类问题的服务案例，并把案例结果作为继续了解或购买决策依据。排除条件：销售单方面发送案例但家长没有表达关注。"
        },
        {
          key: "modify-rule-price-sensitive",
          type: "修改标签规则",
          groupKey: "tag-group-purchase-intent",
          groupName: "购买意向",
          tagName: "价格敏感",
          aiSuggestion: "原规则只关注价格提问，容易误判正常询价；建议增加预算压力、反复比较、优惠依赖等判定条件。",
          currentValue: "当前生效：用户询问价格即可打标。",
          proposedValue: "AI建议：需出现预算压力、反复比较或明确优惠诉求之一，且不是单次正常询价。",
          ruleText: "AI打标依据：用户多次追问价格、分期、优惠、退款保障，或明确表达预算有限、需要比较其他机构。排除条件：仅首次了解价格、没有表现出预算压力或成交阻碍。"
        },
        {
          key: "delete-tag-psychiatry",
          type: "建议删除",
          groupKey: "tag-group-product-interest",
          groupName: "产品兴趣",
          tagName: "精神科问诊意向",
          aiSuggestion: "该标签容易与医疗诊断服务边界混淆，不适合作为销售运营标签直接启用。",
          ruleText: "AI打标依据：该标签容易引导销售进入医疗诊断或问诊承诺边界，建议从标签库删除，相关内容只作为风险提醒或人工备注处理。"
        }
      ]
    },
    {
      key: "tag-review-batch-20260819",
      name: "2026-08-19 09:00 AI生成批次",
      generatedAt: "2026-08-19 09:00",
      trigger: "手动生成",
      status: "已通过",
      dataScope: "用户沟通数据、客户档案、现有标签数据",
      summary: { newTags: 2, modified: 1, deleted: 0 },
      changes: []
    }
  ];
  const activeTagReviewBatch = aiTagReviewBatches.find((item) => item.key === activeTagReviewBatchKey) || aiTagReviewBatches[0];
  const tagReviewDetailBatch = aiTagReviewBatches.find((item) => item.key === tagReviewDetailBatchKey);
  const pendingReviewCount = aiTagReviewBatches.filter((item) => item.status === "待审核").length;
  const tagReviewBatchColumns = [
    { title: "AI生成批次", dataIndex: "name", width: 190 },
    { title: "生成方式", dataIndex: "trigger", width: 86 },
    {
      title: "待审核变更",
      dataIndex: "summary",
      width: 190,
      render: (summary) => `新增${summary.newTags} / 修改${summary.modified} / 删除${summary.deleted}`
    },
    { title: "状态", dataIndex: "status", width: 86, render: (status) => <Tag color={status === "待审核" ? "processing" : "success"}>{status}</Tag> },
    { title: "操作", width: 90, render: (_, record) => <Button type="link" size="small" onClick={() => openTagReviewDetail(record)}>查看详情</Button> }
  ];
  const aiAutoTagRecords = [
    {
      key: "auto-tag-record-20260826-0900",
      name: "2026-08-26 09:00 自动打标批次",
      executedAt: "2026-08-26 09:00",
      trigger: "定时执行",
      scannedUsers: 286,
      addedTags: 43,
      removedTags: 8,
      modifiedTags: 16,
      details: [
        { key: "auto-tag-detail-1", customerKey: "c1", customerName: "张妈妈", role: "销售", operation: "新增", tag: "高意向", reason: "最近完整对话中主动询问班型、课时安排和报名路径，客户档案显示已完成体验课但未确认正价课，符合高意向规则。" },
        { key: "auto-tag-detail-2", customerKey: "c2", customerName: "王妈妈", role: "销售", operation: "修改", tag: "适合推测评", reason: "原标签依据为单次咨询，本次结合多轮用户主动表达阅读理解困难和希望先了解孩子水平，规则依据更新为测评承接。" },
        { key: "auto-tag-detail-3", customerKey: "c3", customerName: "赵妈妈", role: "班主任", operation: "删除", tag: "低意向", reason: "用户后续主动补充希望了解正价课服务和老师安排，低意向标签与最新沟通证据冲突，建议移除。" }
      ]
    },
    {
      key: "auto-tag-record-20260825-0900",
      name: "2026-08-25 09:00 自动打标批次",
      executedAt: "2026-08-25 09:00",
      trigger: "定时执行",
      scannedUsers: 251,
      addedTags: 36,
      removedTags: 5,
      modifiedTags: 11,
      details: [
        { key: "auto-tag-detail-4", customerKey: "c4", customerName: "陈妈妈", role: "销售", operation: "新增", tag: "需要案例验证", reason: "用户多次询问是否有类似孩子改善案例，且未继续追问价格，符合案例验证型决策规则。" },
        { key: "auto-tag-detail-5", customerKey: "c5", customerName: "许妈妈", role: "班主任", operation: "新增", tag: "家长高焦虑", reason: "对话中反复出现担心孩子状态、怕错过干预时间等表达，客户档案中也记录家长焦虑明显。" }
      ]
    }
  ];
  const openAiAutoTagRecordDetail = (record) => {
    setAiAutoTagRecordDetail(record);
  };
  const viewAiAutoTagCustomerTags = (record) => {
    onViewConversation?.({ key: record.customerKey, name: record.customerName });
    setAiAutoTagRecordDetail(null);
    setAiAutoTagRecordOpen(false);
  };
  const aiAutoTagRecordColumns = [
    { title: "打标批次", dataIndex: "name", width: 220 },
    { title: "执行方式", dataIndex: "trigger", width: 90 },
    { title: "扫描用户", dataIndex: "scannedUsers", width: 90, align: "right" },
    { title: "新增标签", dataIndex: "addedTags", width: 90, align: "right" },
    { title: "移除标签", dataIndex: "removedTags", width: 90, align: "right" },
    { title: "修改标签", dataIndex: "modifiedTags", width: 90, align: "right" },
    { title: "操作", width: 92, render: (_, record) => <Button type="link" size="small" onClick={() => openAiAutoTagRecordDetail(record)}>查看详情</Button> }
  ];
  const aiAutoTagRecordDetailColumns = [
    { title: "打标对象", dataIndex: "customerName", width: 100, render: (value, record) => <Button type="link" size="small" onClick={() => viewAiAutoTagCustomerTags(record)}>{value}</Button> },
    { title: "角色", dataIndex: "role", width: 80, render: (value) => <Tag color={value === "班主任" ? "cyan" : "blue"}>{value}</Tag> },
    { title: "操作类型", dataIndex: "operation", width: 92, render: (value) => <Tag color={value === "新增" ? "success" : value === "删除" ? "error" : "processing"}>{value}</Tag> },
    { title: "标签", dataIndex: "tag", width: 120 },
    { title: "打标原因", dataIndex: "reason", render: (value) => <Text type="secondary">{value}</Text> },
    { title: "操作", width: 118, render: (_, record) => <Button type="link" size="small" onClick={() => viewAiAutoTagCustomerTags(record)}>查看用户标签</Button> }
  ];
  const toggleAutoTagVariable = (sourceKey, variableKey) => {
    setSelectedAutoTagVariables((current) => {
      const selectedKeys = current[sourceKey] || [];
      const nextKeys = selectedKeys.includes(variableKey)
        ? selectedKeys.filter((key) => key !== variableKey)
        : [...selectedKeys, variableKey];
      return { ...current, [sourceKey]: nextKeys };
    });
  };
  const addAutoTagTriggerRule = (type) => {
    if (type === "friendDay") {
      setAutoTagFriendDayRules((items) => [...items, (items[items.length - 1] || 0) + 2]);
      return;
    }
    setAutoTagMessageCountRules((items) => [...items, (items[items.length - 1] || 0) + 10]);
  };
  const removeAutoTagTriggerRule = (type, index) => {
    if (type === "friendDay") {
      setAutoTagFriendDayRules((items) => items.filter((_, itemIndex) => itemIndex !== index));
      return;
    }
    setAutoTagMessageCountRules((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };
  const autoTagVariableColumns = [
    {
      title: "选择",
      width: 62,
      render: (_, record) => (
        <Checkbox
          checked={(selectedAutoTagVariables[activeAutoTagDataSource?.key] || []).includes(record.key)}
          onChange={() => toggleAutoTagVariable(activeAutoTagDataSource.key, record.key)}
        />
      )
    },
    { title: "变量字段", dataIndex: "meaning", width: 150 },
    { title: "变量标识", dataIndex: "variable", width: 220, render: (value) => <Text code>{value}</Text> },
    { title: "默认取数", dataIndex: "defaultValue" }
  ];

  const openGroupModal = (group = null) => {
    setEditingGroup(group);
    form.setFieldsValue({
      name: group?.name || "",
      roles: group?.roles || ["销售"],
      aiWritable: group?.aiWritable ?? true,
      status: group?.status || "启用",
      tags: group?.tags || []
    });
    setGroupModalOpen(true);
  };
  const saveGroup = async () => {
    const values = await form.validateFields();
    const nextGroup = {
      key: editingGroup?.key || `tag-group-${Date.now()}`,
      name: values.name,
      roles: values.roles || [],
      aiWritable: Boolean(values.aiWritable),
      status: values.status || "启用",
      tags: values.tags || []
    };
    setGroups((items) => editingGroup
      ? items.map((item) => (item.key === editingGroup.key ? nextGroup : item))
      : [nextGroup, ...items]);
    setGroupModalOpen(false);
  };
  const addTag = (groupKey) => {
    const tagName = (tagDrafts[groupKey] || "").trim();
    if (!tagName) return;
    setGroups((items) => items.map((group) => {
      if (group.key !== groupKey || group.tags.includes(tagName)) return group;
      return { ...group, tags: [...group.tags, tagName] };
    }));
    setManualTagSources((items) => ({ ...items, [`${groupKey}:${tagName}`]: true }));
    setTagDrafts((items) => ({ ...items, [groupKey]: "" }));
  };
  const removeTag = (groupKey, tagName) => {
    setGroups((items) => items.map((group) => (
      group.key === groupKey ? { ...group, tags: group.tags.filter((item) => item !== tagName) } : group
    )));
  };
  const deleteGroup = (group) => {
    Modal.confirm({
      title: "删除标签组",
      content: `确认删除 ${group.name}？该组下标签也会从当前原型数据中移除。`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => setGroups((items) => items.filter((item) => item.key !== group.key))
    });
  };
  const moveGroup = (groupKey, direction) => {
    setGroups((items) => {
      const currentIndex = items.findIndex((item) => item.key === groupKey);
      const nextIndex = currentIndex + direction;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) return items;
      const nextItems = [...items];
      [nextItems[currentIndex], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[currentIndex]];
      return nextItems;
    });
  };
  const generateAiTagSuggestion = () => {
    setAiTagAgentOpen(false);
    setTagReviewModalOpen(true);
    setActiveTagReviewBatchKey("tag-review-batch-20260826");
    message.success("已生成标签体系建议，请在AI生成标签库记录中审核后生效");
  };
  function openTagReviewDetail(record) {
    setActiveTagReviewBatchKey(record.key);
    setTagReviewDetailBatchKey(record.key);
    setSelectedTagReviewChangeKeys([]);
    setTagReviewModalOpen(false);
  }
  const getTagRuleKey = (group, tag) => `${group.key}:${tag}`;
  const getReviewChangeKey = (batch, change) => `${batch.key}:${change.key}`;
  const updateAiSourceForTags = (groupKey, tags) => {
    setAiApprovedTagSources((items) => {
      const next = { ...items };
      tags.forEach((tag) => {
        next[`${groupKey}:${tag}`] = true;
      });
      return next;
    });
  };
  const applyTagReviewChange = (batch, change, options = {}) => {
    if (change.type === "新增标签") {
      setGroups((items) => items.map((group) => {
        if (group.key !== change.groupKey || group.tags.includes(change.tagName)) return group;
        return { ...group, tags: [...group.tags, change.tagName] };
      }));
      updateAiSourceForTags(change.groupKey, [change.tagName]);
      if (options.ruleText) {
        setManualTagRules((items) => ({ ...items, [`${change.groupKey}:${change.tagName}`]: options.ruleText }));
      }
      return;
    }
    if (change.type === "修改标签规则") {
      setManualTagRules((items) => ({ ...items, [`${change.groupKey}:${change.tagName}`]: options.ruleText || change.ruleText }));
      return;
    }
    if (change.type === "建议删除") {
      setGroups((items) => items.map((group) => (
        group.key === change.groupKey ? { ...group, tags: group.tags.filter((tag) => tag !== change.tagName) } : group
      )));
    }
  };
  const reviewChangeDecision = (batch, change, decision) => {
    const key = getReviewChangeKey(batch, change);
    const ruleText = reviewRuleDrafts[key] || change.ruleText;
    setTagReviewDecisions((items) => ({ ...items, [key]: decision }));
    if (decision === "通过") {
      applyTagReviewChange(batch, change, { ruleText });
      message.success(`${change.type}已${decision}，已同步到当前标签库`);
    } else {
      message.info(`${change.type}已驳回`);
    }
  };
  const batchReviewChangeDecision = (batch, decision) => {
    const selectedChanges = (batch?.changes || []).filter((change) => selectedTagReviewChangeKeys.includes(change.key));
    if (!selectedChanges.length) return;
    selectedChanges.forEach((change) => reviewChangeDecision(batch, change, decision));
    setSelectedTagReviewChangeKeys([]);
    message.success(`已批量${decision}${selectedChanges.length}条标签变更`);
  };
  const getTagMeta = (group, tag) => {
    const key = getTagRuleKey(group, tag);
    const isManual = Boolean(manualTagSources[key]) || (!aiGeneratedTagValues.has(tag) && !aiApprovedTagSources[key]);
    const isRuleEdited = Boolean(manualTagRules[key]);
    return {
      source: isManual ? "人工新增" : "AI生成",
      ruleStatus: isRuleEdited ? "人工已改" : "AI规则",
      status: group.status === "停用" ? "已停用" : "已生效",
      sourceIcon: isManual ? <UserOutlined /> : <RobotOutlined />,
      ruleIcon: isRuleEdited ? <EditOutlined /> : null
    };
  };
  const tagSourceIcon = (meta) => (
    <Tooltip title={meta.source}>
      <span className={`tag-source-icon ${meta.source === "AI生成" ? "is-ai" : "is-manual"}`} aria-label={meta.source}>
        {meta.sourceIcon}
      </span>
    </Tooltip>
  );
  const tagRuleEditedIcon = (meta) => meta.ruleIcon ? (
    <Tooltip title="人工已改，优先使用人工规则">
      <span className="tag-rule-edited-icon" aria-label="人工已改">
        {meta.ruleIcon}
      </span>
    </Tooltip>
  ) : null;
  const openTagRuleDetail = (group, tag) => {
    const detail = { group, tag };
    const rule = getTagRuleDetail(detail);
    setTagRuleDetail(detail);
    setTagRuleDraft(manualTagRules[getTagRuleKey(group, tag)] || rule.ruleText);
  };
  const getTagGroupReason = (group) => ({
    title: `${group.name} · AI生成逻辑`,
    reason: `AI 根据企业知识库、用户沟通数据、客户档案、用户业务数据和现有标签数据，将高频且具备销售跟进价值的用户特征聚类为「${group.name}」。`,
    data: ["近30天家长沟通记录", "体验课与课程行为", "客户档案中的核心诉求", "现有标签库去重结果"],
    logic: ["按用户维度聚合核心诉求", "过滤少于10个独立用户提及的偶发样本", "排除医疗诊断、隐私和负面定性标签", "保留可被销售、班主任或市场用于服务跟进的标签"]
  });
  const getTagRuleDetail = (detail) => {
    if (!detail) return null;
    const { group, tag } = detail;
    return {
      title: `${tag} · 标签AI打标规则`,
      description: `用于识别「${group.name}」下的「${tag}」用户特征，辅助销售和班主任判断后续沟通策略。`,
      ruleText: `AI打标依据：
1. 用户在沟通中明确表达与「${tag}」相关的核心问题或决策顾虑。
2. 该特征在最近多轮会话中反复出现，或与课程行为、客户档案信息相互印证。
3. 表达强度达到核心痛点，不是偶尔提及或泛泛抱怨。

排除条件：
1. 只在单条消息中偶然出现，缺少上下文支撑。
2. 语义更接近已有标签，应优先合并到已有标签。
3. 涉及医疗诊断、隐私信息或负面定性，不直接生成标签。

证据样例：
1. “孩子现在主要问题就是${tag}，我们不知道怎么处理。”
2. “老师反馈也提到${tag}这块比较明显。”
3. “如果后面课程能解决${tag}，我们愿意继续了解。”`
    };
  };
  const saveTagRuleDetail = () => {
    if (!tagRuleDetail) return;
    setManualTagRules((items) => ({
      ...items,
      [getTagRuleKey(tagRuleDetail.group, tagRuleDetail.tag)]: tagRuleDraft
    }));
    setTagRuleDetail(null);
    message.success("标签打标规则已保存，人工修改后优先于AI生成规则");
  };
  const getReviewChangeContent = (change) => `${change.groupName}${change.tagName ? ` / ${change.tagName}` : ""}`;
  const tagReviewDetailColumns = [
    {
      title: "变更类型",
      dataIndex: "type",
      width: 116,
      render: (type) => <Tag color={type === "建议删除" ? "error" : type === "修改标签规则" ? "warning" : "blue"}>{type}</Tag>
    },
    {
      title: "变更内容",
      width: 180,
      render: (_, record) => <Text>{getReviewChangeContent(record)}</Text>
    },
    {
      title: "AI判断原因",
      dataIndex: "aiSuggestion",
      width: 260,
      render: (value) => <Text className="tag-review-wrap-text">{value}</Text>
    },
    {
      title: "AI打标依据",
      dataIndex: "ruleText",
      width: 360,
      render: (value, record) => {
        const decisionKey = getReviewChangeKey(tagReviewDetailBatch, record);
        return (
          <Input.TextArea
            rows={4}
            value={reviewRuleDrafts[decisionKey] ?? value ?? ""}
            onChange={(event) => setReviewRuleDrafts((items) => ({ ...items, [decisionKey]: event.target.value }))}
          />
        );
      }
    },
    {
      title: "操作",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const decision = tagReviewDecisions[getReviewChangeKey(tagReviewDetailBatch, record)];
        return decision ? (
          <Tag color={decision === "驳回" ? "default" : "success"}>{decision}</Tag>
        ) : (
          <Space size={4}>
            <Button type="link" size="small" onClick={() => reviewChangeDecision(tagReviewDetailBatch, record, "驳回")}>驳回</Button>
            <Button type="link" size="small" onClick={() => reviewChangeDecision(tagReviewDetailBatch, record, "通过")}>通过</Button>
          </Space>
        );
      }
    }
  ];
  const renderTagReviewDetailPage = () => {
    if (!tagReviewDetailBatch) return null;
    const reviewedChangeKeys = new Set(Object.keys(tagReviewDecisions)
      .filter((key) => key.startsWith(`${tagReviewDetailBatch.key}:`))
      .map((key) => key.replace(`${tagReviewDetailBatch.key}:`, "")));
    const rowSelection = {
      selectedRowKeys: selectedTagReviewChangeKeys,
      onChange: setSelectedTagReviewChangeKeys,
      getCheckboxProps: (record) => ({ disabled: reviewedChangeKeys.has(record.key) })
    };
    const tagReviewBatchActions = (
      <div className="tag-review-batch-actions">
        <Text type="secondary">已选择 {selectedTagReviewChangeKeys.length} 条</Text>
        <Space size={8}>
          <Button disabled={!selectedTagReviewChangeKeys.length} onClick={() => batchReviewChangeDecision(tagReviewDetailBatch, "驳回")}>批量驳回</Button>
          <Button type="primary" disabled={!selectedTagReviewChangeKeys.length} onClick={() => batchReviewChangeDecision(tagReviewDetailBatch, "通过")}>批量通过</Button>
        </Space>
      </div>
    );
    return (
      <Space direction="vertical" size={16} className="page-stack tag-review-page">
        <Card>
          <div className="tag-review-page-head">
            <Space size={10}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => setTagReviewDetailBatchKey(null)}>返回标签库</Button>
              <div>
                <Text className="tag-review-page-title">{tagReviewDetailBatch.name}</Text>
                <Text type="secondary">AI生成记录审核详情</Text>
              </div>
            </Space>
            <Tag color={tagReviewDetailBatch.status === "待审核" ? "processing" : "success"}>{tagReviewDetailBatch.status}</Tag>
          </div>
        </Card>
        <Card className="tag-review-summary-card">
          <Text className="tag-review-title">批次摘要</Text>
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="生成时间">{tagReviewDetailBatch.generatedAt}</Descriptions.Item>
            <Descriptions.Item label="生成方式">{tagReviewDetailBatch.trigger}</Descriptions.Item>
            <Descriptions.Item label="新增标签">{tagReviewDetailBatch.summary.newTags}</Descriptions.Item>
            <Descriptions.Item label="修改规则">{tagReviewDetailBatch.summary.modified}</Descriptions.Item>
            <Descriptions.Item label="建议删除">{tagReviewDetailBatch.summary.deleted}</Descriptions.Item>
            <Descriptions.Item label="数据范围" span={2}>{tagReviewDetailBatch.dataScope}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card className="tag-review-table-card">
          {tagReviewBatchActions}
          <Table
            size="small"
            rowKey="key"
            rowSelection={rowSelection}
            columns={tagReviewDetailColumns}
            dataSource={tagReviewDetailBatch.changes}
            pagination={false}
            scroll={{ x: 1120 }}
            className="tag-review-detail-table"
          />
        </Card>
      </Space>
    );
  };

  if (tagReviewDetailBatchKey) {
    return renderTagReviewDetailPage();
  }

  return (
    <Space direction="vertical" size={16} className="page-stack tag-library-page">
      <Card>
        <div className="tag-filter-panel">
          <Space className="tag-filter-actions">
            <Button icon={<RobotOutlined />} onClick={() => setAiTagAgentOpen(true)}>AI智能生成标签</Button>
            <Badge count={pendingReviewCount} size="small">
              <Button icon={<FileSearchOutlined />} onClick={() => setTagReviewModalOpen(true)}>AI生成标签库记录</Button>
            </Badge>
            <Button icon={<ClockCircleOutlined />} onClick={() => setAiAutoTagConfigOpen(true)}>AI自动打标配置</Button>
            <Button icon={<TagsOutlined />} onClick={() => setAiAutoTagRecordOpen(true)}>AI打标记录</Button>
          </Space>
          <Space wrap size={16} className="tag-filter-fields">
            <Space>
              <Text>部门角色：</Text>
              <Select value={roleFilter} options={roleFilterOptions} onChange={setRoleFilter} className="tag-role-select" />
            </Space>
            <Space>
              <Text>搜索：</Text>
              <Input.Search value={keyword} placeholder="请输入标签组或标签" allowClear onChange={(event) => setKeyword(event.target.value)} className="tag-search-input" />
            </Space>
            <Button onClick={() => { setRoleFilter("全部部门角色"); setKeyword(""); }}>重置</Button>
          </Space>
        </div>
        <div className="tag-library-summary">
          <Text className="tag-library-summary-text">共{totalTags}个标签</Text>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openGroupModal()}>新增标签组</Button>
        </div>
        <div className="tag-group-list">
          {filteredGroups.map((group) => {
            const groupIndex = groups.findIndex((item) => item.key === group.key);
            return (
              <Card
                key={group.key}
                className="tag-group-card"
              >
                <div className="tag-group-head">
                  <div className="tag-group-main">
                    <Space wrap size={8} className="tag-group-title">
                      <span className="tag-group-accent" />
                      <Title level={4}>{group.name}</Title>
                      <Tooltip title="查看AI生成逻辑">
                        <Button
                          type="link"
                          size="small"
                          className="tag-group-ai-reason"
                          onClick={() => setTagGroupReason(getTagGroupReason(group))}
                        >
                          AI
                        </Button>
                      </Tooltip>
                      <Text type="secondary">（共{group.tags.length}个标签）</Text>
                    </Space>
                    <Space size={6} className="tag-group-actions">
                      <Text type="secondary">允许AI自动打标</Text>
                      <Switch size="small" checked={group.aiWritable} onChange={(checked) => setGroups((items) => items.map((item) => item.key === group.key ? { ...item, aiWritable: checked } : item))} />
                      <Button type="link" size="small" disabled={groupIndex <= 0} onClick={() => moveGroup(group.key, -1)}>上移</Button>
                      <Button type="link" size="small" disabled={groupIndex === groups.length - 1} onClick={() => moveGroup(group.key, 1)}>下移</Button>
                      <Button type="link" size="small" onClick={() => openGroupModal(group)}>编辑</Button>
                      <Button type="link" size="small" danger onClick={() => deleteGroup(group)}>删除</Button>
                    </Space>
                  </div>
                </div>
                <div className="tag-group-content">
                  <div className="tag-group-meta">
                    <Text type="secondary">适用部门角色：</Text>
                    <Space wrap size={[6, 6]}>{group.roles.map((role) => <Tag color="blue" key={role}>{role}</Tag>)}</Space>
                    <Tag color={group.aiWritable ? "success" : "default"}>{group.aiWritable ? "允许AI自动打标" : "禁止AI自动打标"}</Tag>
                  </div>
                  <div className="tag-chip-row">
                    {group.tags.map((tag) => {
                      const meta = getTagMeta(group, tag);
                      return (
                        <Tooltip title="点击标签查看AI打标规则" key={tag}>
                          <Tag
                            closable
                            className="tag-rule-chip"
                            onClick={() => openTagRuleDetail(group, tag)}
                            onClose={(event) => { event.preventDefault(); event.stopPropagation(); removeTag(group.key, tag); }}
                          >
                            <span className="tag-rule-chip-content">
                              <span>{tag}</span>
                              {tagSourceIcon(meta)}
                              {tagRuleEditedIcon(meta)}
                            </span>
                          </Tag>
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="tag-add-row">
                    <Button icon={<PlusOutlined />} onClick={() => addTag(group.key)}>添加</Button>
                    <Input
                      value={tagDrafts[group.key] || ""}
                      placeholder="输入后回车"
                      onChange={(event) => setTagDrafts((items) => ({ ...items, [group.key]: event.target.value }))}
                      onPressEnter={() => addTag(group.key)}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
      <Modal
        title={editingGroup ? "编辑标签组" : "新建标签组"}
        open={groupModalOpen}
        onCancel={() => setGroupModalOpen(false)}
        onOk={saveGroup}
        okText="确定"
        cancelText="取消"
        width={760}
      >
        <AlertOutlined className="tag-modal-tip-icon" />
        <div className="tag-modal-tip">管理员可根据不同部门角色展示不同标签组；开启后，AI 可在符合规则时自动给客户打上该标签组下的标签。关闭后，AI 只能给出打标建议，不能直接写入客户标签。</div>
        <Form form={form} layout="vertical" className="tag-group-form">
          <Form.Item label="标签组名称" name="name" rules={[{ required: true, message: "请输入标签组名称" }]}>
            <Input placeholder="请输入标签组名称" />
          </Form.Item>
          <Form.Item label="适用部门角色" name="roles" rules={[{ required: true, message: "请选择适用部门角色" }]}>
            <Checkbox.Group options={tagRoleOptions} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="允许AI自动给客户打标签" name="aiWritable" valuePropName="checked"><Switch checkedChildren="允许" unCheckedChildren="禁止" /></Form.Item></Col>
            <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
          </Row>
          <Form.Item label="初始标签" name="tags">
            <Select mode="tags" placeholder="输入标签后回车，例如：高意向、价格敏感" />
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title="AI标签生成管理智能体"
        open={aiTagAgentOpen}
        onClose={() => setAiTagAgentOpen(false)}
        width={860}
        className="ai-tag-agent-drawer"
        extra={<Space><Button onClick={() => setAiTagAgentOpen(false)}>关闭</Button><Button type="primary" icon={<RobotOutlined />} onClick={generateAiTagSuggestion}>生成标签体系</Button></Space>}
      >
        <Space direction="vertical" size={16} className="full-width">
          <Card size="small" title="生成配置" className="ai-tag-agent-card">
            <Form layout="vertical" initialValues={{
              dataScope: ["企业知识库", "智能体提示词", "用户沟通数据"],
              roles: ["市场", "销售", "班主任"],
              goals: ["生成标签组", "生成标签内容", "生成AI打标规则"],
              conversationFriendMonths: 3,
              conversationMessageMinCount: 20
            }}>
              <Form.Item label="输入数据范围" name="dataScope">
                <Checkbox.Group className="ai-tag-agent-data-source-list">
                  {aiTagAgentDataSourceConfigs.map((item) => (
                    <div className="ai-tag-agent-data-source-row" key={item.key}>
                      <Checkbox value={item.key}>{item.name}</Checkbox>
                      <Text type="secondary">{item.desc}</Text>
                      <Button type="link" size="small" onClick={() => setActiveAiTagAgentDataSourceKey(item.key)}>配置</Button>
                    </div>
                  ))}
                </Checkbox.Group>
              </Form.Item>
              <Form.Item label="适用部门角色" name="roles">
                <Select mode="multiple" options={tagRoleOptions} />
              </Form.Item>
              <Form.Item label="生成目标" name="goals">
                <Select mode="multiple" options={["生成标签组", "生成标签内容", "生成AI打标规则"].map((value) => ({ value }))} />
              </Form.Item>
              <Form.Item label="提示词配置">
                <Input.TextArea
                  rows={24}
                  defaultValue={aiTagAgentPrompt}
                />
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Drawer>
      <Modal
        title={activeAiTagAgentDataSource?.configTitle || "输入数据配置"}
        open={Boolean(activeAiTagAgentDataSource)}
        onCancel={() => setActiveAiTagAgentDataSourceKey(null)}
        footer={<Button type="primary" onClick={() => setActiveAiTagAgentDataSourceKey(null)}>确定</Button>}
        width={820}
        className="ai-tag-agent-data-source-modal"
      >
        {activeAiTagAgentDataSourceKey === "企业知识库" ? (
          <div className="ai-tag-agent-source-config">
            <div className="ai-tag-agent-config-tip">选择现有知识库里的文件作为标签生成依据。文件内容会进入 AI 标签生成的业务背景，不直接作为最终标签结果。</div>
            <Checkbox.Group value={selectedAiTagKnowledgeFiles} onChange={setSelectedAiTagKnowledgeFiles} className="ai-tag-agent-resource-list">
              {aiTagKnowledgeFileRows.map((item) => (
                <div className="ai-tag-agent-resource-row" key={item.key}>
                  <Checkbox value={item.key}>{item.name}</Checkbox>
                  <Text type="secondary">{item.path}</Text>
                  <Tag>{item.contentType}</Tag>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        ) : null}
        {activeAiTagAgentDataSourceKey === "智能体提示词" ? (
          <div className="ai-tag-agent-source-config">
            <Checkbox.Group value={selectedAiTagPromptAgents} onChange={setSelectedAiTagPromptAgents} className="ai-tag-agent-prompt-list">
              {aiTagPromptAgentRows.map((item) => (
                <div className="ai-tag-agent-prompt-row" key={item.key}>
                  <Checkbox value={item.key}>{item.name}</Checkbox>
                  <Tag color={item.category === "策略智能体" ? "purple" : "blue"}>{item.category}</Tag>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        ) : null}
        {activeAiTagAgentDataSourceKey === "用户沟通数据" ? (
          <div className="ai-tag-agent-source-config">
            <div className="ai-tag-agent-config-tip">配置用于 AI 分析的真实用户对话样本。系统会筛选最近 x 个月加好友、且用户发出的对话条数超过 x 条的用户，并提供这些人群与 AI 的完整对话内容。</div>
            <Form layout="vertical" className="ai-tag-agent-conversation-form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="最近 x 个月加的好友">
                    <InputNumber min={1} max={24} defaultValue={3} addonAfter="个月" className="full-width" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="用户发出的对话条数超过 x 条">
                    <InputNumber min={1} max={500} defaultValue={20} addonAfter="条" className="full-width" />
                  </Form.Item>
                </Col>
              </Row>
              <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="数据口径">用户发出的消息用于筛选样本；给 AI 的数据输入为筛选后用户与 AI 的完整对话内容。</Descriptions.Item>
                <Descriptions.Item label="适用场景">用于发现真实沟通中的高频痛点、需求表达、产品兴趣、购买顾虑和风险信号。</Descriptions.Item>
              </Descriptions>
              <div className="ai-tag-agent-upload-block">
                <Text className="ai-tag-agent-upload-title">上传导入用户对话数据文件</Text>
                <Upload.Dragger multiple beforeUpload={() => false} accept=".csv,.xlsx,.xls,.txt,.json,.doc,.docx">
                  <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持企业提供的代表性用户对话数据，原型阶段仅展示导入入口。</p>
                </Upload.Dragger>
              </div>
            </Form>
          </div>
        ) : null}
      </Modal>
      <Modal
        title="AI生成标签库记录"
        open={tagReviewModalOpen}
        onCancel={() => setTagReviewModalOpen(false)}
        footer={<Button onClick={() => setTagReviewModalOpen(false)}>关闭</Button>}
        width={860}
        className="tag-review-record-modal"
      >
        <Table
          size="small"
          rowKey="key"
          columns={tagReviewBatchColumns}
          dataSource={aiTagReviewBatches}
          pagination={false}
          rowClassName={(record) => record.key === activeTagReviewBatch.key ? "tag-review-batch-row active" : "tag-review-batch-row"}
          onRow={(record) => ({ onClick: () => setActiveTagReviewBatchKey(record.key) })}
        />
      </Modal>
      <Drawer
        title="AI自动打标配置"
        open={aiAutoTagConfigOpen}
        onClose={() => setAiAutoTagConfigOpen(false)}
        width={760}
        className="ai-auto-tagging-drawer"
        extra={<Space><Button onClick={() => setAiAutoTagConfigOpen(false)}>关闭</Button><Button type="primary" onClick={() => { setAiAutoTagConfigOpen(false); message.success("AI自动打标配置已保存"); }}>保存配置</Button></Space>}
      >
        <Form form={autoTagConfigForm} layout="vertical" initialValues={{
          enabled: true,
          roleScope: ["销售", "班主任"],
          executeDelayDays: "后 1 天",
          executeTime: "00:00",
          dataScope: ["用户沟通数据", "客户档案"],
          logic: `请基于已生效标签库和每个标签的AI打标规则，对符合执行范围的用户进行自动打标判断。

执行原则：
1. 仅允许对已开启“允许AI自动打标”的标签组执行自动打标。
2. 每个标签必须依据该标签当前生效的打标规则判断，人工修改过的规则优先于AI生成规则。
3. 判断依据必须来自用户沟通数据或客户档案，不得凭空推断。
   用户沟通数据默认读取要打标签用户的全部对话数据；客户档案默认读取企业给到的客户档案数据。
4. 用户只在单条消息中偶然提及，不应直接打标，除非与历史沟通或客户档案相互印证。
5. 新增标签、移除标签、保持不变都需要输出判断原因。
6. 对低置信度、敏感风险、可能涉及医疗诊断或负面定性的结果，不自动写入敏感结论，仅记录为待关注原因。
7. 如果多个标签语义冲突，优先保留证据更充分、业务含义更明确的标签。
8. 输出结果必须包含：用户、角色、标签、变更类型、判断依据、置信度、触发规则和执行时间。`
        }}>
          <Card size="small" title="执行配置" className="ai-auto-tagging-card">
            <Row gutter={16}>
              <Col span={12}><Form.Item label="启用自动打标" name="enabled" valuePropName="checked"><Switch checkedChildren="启用" unCheckedChildren="停用" /></Form.Item></Col>
              <Col span={12}><Form.Item label="角色选择" name="roleScope"><Select mode="multiple" options={["销售", "班主任"].map((value) => ({ value }))} /></Form.Item></Col>
              <Col span={24}>
                <Form.Item label="执行对象规则">
                  <div className="ai-auto-tag-trigger-panel">
                    <div className="ai-auto-tag-trigger-tip">满足任一条件即执行：加好友天数规则和用户发出消息条数规则是或的关系。</div>
                    <div className="ai-auto-tag-trigger-grid">
                      <div className="ai-auto-tag-trigger-card">
                        <div className="ai-auto-tag-trigger-card-head">
                          <Text className="ai-auto-tag-trigger-title">加好友第 X 天</Text>
                          <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => addAutoTagTriggerRule("friendDay")}>添加</Button>
                        </div>
                        <div className="ai-auto-tag-trigger-list">
                          {autoTagFriendDayRules.map((value, index) => (
                            <div className="ai-auto-tag-trigger-row" key={`friend-day-${index}`}>
                              <Text className="ai-auto-tag-trigger-prefix">加好友第</Text>
                              <InputNumber min={1} max={365} value={value} onChange={(nextValue) => setAutoTagFriendDayRules((items) => items.map((item, itemIndex) => itemIndex === index ? nextValue || 1 : item))} />
                              <Text className="ai-auto-tag-trigger-suffix">天打一次标签</Text>
                              <Button type="link" size="small" danger onClick={() => removeAutoTagTriggerRule("friendDay", index)}>删除</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="ai-auto-tag-trigger-card">
                        <div className="ai-auto-tag-trigger-card-head">
                          <Text className="ai-auto-tag-trigger-title">用户发出的会话信息条数超过 X 条</Text>
                          <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => addAutoTagTriggerRule("messageCount")}>添加</Button>
                        </div>
                        <div className="ai-auto-tag-trigger-list">
                          {autoTagMessageCountRules.map((value, index) => (
                            <div className="ai-auto-tag-trigger-row" key={`message-count-${index}`}>
                              <Text className="ai-auto-tag-trigger-prefix">用户发出消息超过</Text>
                              <InputNumber min={1} max={1000} value={value} onChange={(nextValue) => setAutoTagMessageCountRules((items) => items.map((item, itemIndex) => itemIndex === index ? nextValue || 1 : item))} />
                              <Text className="ai-auto-tag-trigger-suffix">条打一次标签</Text>
                              <Button type="link" size="small" danger onClick={() => removeAutoTagTriggerRule("messageCount", index)}>删除</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="满足以上条件自然日后" name="executeDelayDays">
                  <Select options={["后 1 天", "后 2 天", "后 3 天"].map((value) => ({ value }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="执行时间" name="executeTime">
                  <Input placeholder="例如：00:00" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card size="small" title="标签与数据范围" className="ai-auto-tagging-card">
            <div className="ai-auto-tagging-tip">自动打标仅作用于已开启“允许AI自动打标”的标签组；标签组开关在外部标签组列表中维护。</div>
            <Form.Item label="数据来源授权" name="dataScope">
              <Checkbox.Group className="ai-auto-tag-data-source-list">
                {autoTagVisibleDataSourceConfigs.map((item) => (
                  <div className="ai-auto-tag-data-source-row" key={item.key}>
                    <Checkbox value={item.key}>{item.name}</Checkbox>
                    <Text type="secondary">{item.usage}</Text>
                  </div>
                ))}
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              label="自动打标逻辑说明"
              name="logic"
              extra="这里填写业务判断逻辑；AI执行时会自动读取已授权数据来源下勾选的变量字段。"
            >
              <Input.TextArea rows={12} />
            </Form.Item>
          </Card>
        </Form>
      </Drawer>
      <Modal
        title={activeAutoTagDataSource ? `${activeAutoTagDataSource.name}配置` : "输入数据项配置"}
        open={Boolean(activeAutoTagDataSource)}
        onCancel={() => setActiveAutoTagDataSourceKey(null)}
        footer={<Button type="primary" onClick={() => setActiveAutoTagDataSourceKey(null)}>确定</Button>}
        width={760}
        className="ai-auto-tag-data-source-modal"
      >
        {activeAutoTagDataSource ? (
          <div className="ai-auto-tag-data-source-config">
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="数据来源">{activeAutoTagDataSource.source}</Descriptions.Item>
              <Descriptions.Item label="AI使用方式">{activeAutoTagDataSource.usage}</Descriptions.Item>
            </Descriptions>
            <div className="ai-auto-tag-data-section">
              <Text className="ai-auto-tag-data-title">可用字段</Text>
              <Space wrap size={[6, 6]}>{activeAutoTagDataSource.fields.map((field) => <Tag key={field}>{field}</Tag>)}</Space>
            </div>
            <div className="ai-auto-tag-data-section">
              <div className="ai-auto-tag-data-title-row">
                <Text className="ai-auto-tag-data-title">选择变量字段</Text>
                <Tag color="blue">已选择 {(selectedAutoTagVariables[activeAutoTagDataSource.key] || []).length} 项</Tag>
              </div>
              <Table
                size="small"
                rowKey="key"
                columns={autoTagVariableColumns}
                dataSource={activeAutoTagDataSource.variables || []}
                pagination={false}
                className="ai-auto-tag-variable-table"
              />
            </div>
            <div className="ai-auto-tag-data-section">
              <Text className="ai-auto-tag-data-title">取数参数</Text>
              <Form layout="vertical" className="ai-auto-tag-data-param-form">
                {activeAutoTagDataSource.params.map((param) => {
                  const [label, value] = param.split("：");
                  return (
                    <Form.Item label={label} key={param}>
                      <Input defaultValue={value || param} />
                    </Form.Item>
                  );
                })}
              </Form>
            </div>
          </div>
        ) : null}
      </Modal>
      <Modal
        title="AI打标记录"
        open={aiAutoTagRecordOpen}
        onCancel={() => setAiAutoTagRecordOpen(false)}
        footer={<Button onClick={() => setAiAutoTagRecordOpen(false)}>关闭</Button>}
        width={980}
        className="ai-auto-tag-record-modal"
      >
        <Table
          size="small"
          rowKey="key"
          columns={aiAutoTagRecordColumns}
          dataSource={aiAutoTagRecords}
          pagination={false}
          scroll={{ x: 850 }}
        />
      </Modal>
      <Modal
        title={aiAutoTagRecordDetail ? `${aiAutoTagRecordDetail.name}详情` : "AI打标详情"}
        open={Boolean(aiAutoTagRecordDetail)}
        onCancel={() => setAiAutoTagRecordDetail(null)}
        footer={<Button onClick={() => setAiAutoTagRecordDetail(null)}>关闭</Button>}
        width={1080}
        className="ai-auto-tag-record-detail-modal"
      >
        <Table
          size="small"
          rowKey="key"
          columns={aiAutoTagRecordDetailColumns}
          dataSource={aiAutoTagRecordDetail?.details || []}
          pagination={false}
          scroll={{ x: 980 }}
        />
      </Modal>
      <Modal
        title={tagGroupReason?.title}
        open={Boolean(tagGroupReason)}
        onCancel={() => setTagGroupReason(null)}
        footer={<Button type="primary" onClick={() => setTagGroupReason(null)}>知道了</Button>}
        width={680}
      >
        {tagGroupReason ? (
          <div className="tag-ai-detail">
            <Paragraph>{tagGroupReason.reason}</Paragraph>
            <div className="tag-ai-detail-section">
              <Text className="tag-ai-detail-title">数据依据</Text>
              <ul>{tagGroupReason.data.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="tag-ai-detail-section">
              <Text className="tag-ai-detail-title">生成逻辑</Text>
              <ul>{tagGroupReason.logic.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        ) : null}
      </Modal>
      <Modal
        title={getTagRuleDetail(tagRuleDetail)?.title}
        open={Boolean(tagRuleDetail)}
        onCancel={() => setTagRuleDetail(null)}
        okText="保存规则"
        cancelText="取消"
        onOk={saveTagRuleDetail}
        width={720}
      >
        {getTagRuleDetail(tagRuleDetail) ? (
          <div className="tag-ai-detail">
            <Paragraph>{getTagRuleDetail(tagRuleDetail).description}</Paragraph>
            <div className="tag-meta-line">
              {(() => {
                const meta = getTagMeta(tagRuleDetail.group, tagRuleDetail.tag);
                return (
                  <>
                    <Tag icon={meta.sourceIcon} color={meta.source === "AI生成" ? "blue" : "default"}>{meta.source}</Tag>
                    <Tag color={meta.ruleStatus === "人工已改" ? "processing" : "default"}>{meta.ruleStatus}</Tag>
                    <Tag color={meta.status === "已生效" ? "success" : "default"}>{meta.status}</Tag>
                  </>
                );
              })()}
              <Text type="secondary">手动新增的标签默认进入人工来源，人工修改后的规则优先级高于 AI 生成规则。</Text>
            </div>
            <Input.TextArea
              className="tag-rule-editor"
              rows={16}
              value={tagRuleDraft}
              onChange={(event) => setTagRuleDraft(event.target.value)}
            />
            <Text type="secondary">人工修改后优先于AI生成规则，后续 AI 自动打标签时按人工保存的规则执行。</Text>
          </div>
        ) : null}
      </Modal>
    </Space>
  );
}
export default TagLibraryPage;
