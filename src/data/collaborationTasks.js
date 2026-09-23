export const collaborationTaskTypes = {
  highIntent: { label: "高意向客户承接", direction: "ai_to_human", sla: "15分钟" },
  complaint: { label: "投诉 / 情绪升级", direction: "ai_to_human", sla: "15分钟" },
  sensitive: { label: "敏感业务确认", direction: "ai_to_human", sla: "30分钟" },
  lowConfidence: { label: "AI无法回答", direction: "ai_to_human", sla: "30分钟" },
  toolFailure: { label: "工具调用失败", direction: "ai_to_human", sla: "30分钟" },
  replyReview: { label: "AI回复人工审核", direction: "ai_to_human", sla: "15分钟" },
  summary: { label: "会话总结", direction: "human_to_ai", sla: "2小时" },
  profile: { label: "客户画像提取", direction: "human_to_ai", sla: "2小时" },
  intent: { label: "客户意向判断", direction: "human_to_ai", sla: "2小时" },
  replySuggestion: { label: "回复建议生成", direction: "human_to_ai", sla: "30分钟" },
  recommendation: { label: "产品 / 课程推荐", direction: "human_to_ai", sla: "2小时" },
  followUp: { label: "跟进计划生成", direction: "human_to_ai", sla: "2小时" }
};

export const collaborationTaskStatuses = [
  { value: "待处理", label: "待处理", color: "blue" },
  { value: "处理中", label: "处理中", color: "processing" },
  { value: "待人工确认", label: "待人工确认", color: "gold" },
  { value: "已完成", label: "已完成", color: "success" },
  { value: "已驳回", label: "已驳回", color: "default" },
  { value: "已超时", label: "已超时", color: "error" },
  { value: "执行失败", label: "执行失败", color: "error" },
  { value: "已转派", label: "已转派", color: "purple" },
  { value: "已取消", label: "已取消", color: "default" }
];

export const collaborationPriorities = [
  { value: "urgent", label: "紧急", color: "red", sla: "15分钟" },
  { value: "high", label: "高", color: "orange", sla: "30分钟" },
  { value: "normal", label: "普通", color: "blue", sla: "2小时" },
  { value: "low", label: "低", color: "default", sla: "24小时" }
];

export const collaborationRoles = {
  employee: { label: "销售 / 班主任", assignee: "林晓" },
  operator: { label: "运营人员", assignee: "运营中心" },
  platform_admin: { label: "平台管理员", assignee: "平台管理员" }
};

const people = [
  ["家长陈女士", "杭州知行教育", "K12教育", "陈女士", "高意向（AI）"],
  ["李先生", "上海启航医疗", "医疗", "李先生", "情绪敏感"],
  ["王女士", "安心保险服务", "保险", "王女士", "保障咨询"],
  ["周同学家长", "深圳优学中心", "成人教育", "林晓", "试听后未报名"],
  ["赵总", "云帆企业服务", "企业服务", "周宁", "高意向（AI）"],
  ["孙女士", "悦生活本地服务", "本地生活", "林晓", "价格敏感"]
];

const outputs = {
  highIntent: "客户连续询问班型、价格和开课时间，建议由销售及时承接并推进预约。",
  complaint: "识别到客户对服务体验有明显不满，建议人工先共情并确认具体问题。",
  sensitive: "该问题涉及专业判断和服务边界，AI已暂停直接结论，等待人工确认。",
  lowConfidence: "知识库未检索到足够可靠的依据，建议人工补充答案后再回复。",
  toolFailure: "订单查询工具连续两次超时，建议人工核实业务系统后回复客户。",
  replyReview: "AI已生成一版回复，包含课程权益说明，发送前需要人工审核。",
  summary: "客户已完成体验课，主要关注孩子学习动力和家庭沟通方式，下一步适合安排复盘。",
  profile: "客户画像：家长焦虑程度中等，孩子存在学习动力不足，愿意接受阶段性陪跑方案。",
  intent: "成交意向：高。客户已主动询问价格和名额，但仍需要专家背书。",
  replySuggestion: "建议先回应客户对效果的顾虑，再引用相似家庭案例，最后邀请参加公开课。",
  recommendation: "推荐家庭成长陪跑方案，匹配客户对长期关系改善和持续反馈的需求。",
  followUp: "建议 24 小时内发送课堂复盘，48 小时后由班主任进行一次轻量回访。"
};

const typeKeys = Object.keys(collaborationTaskTypes);
const statuses = ["待处理", "处理中", "待人工确认", "已完成", "已驳回", "已超时", "执行失败", "已转派"];
const priorities = ["urgent", "high", "normal", "low"];

const createTask = (index, typeKey, personIndex, status = statuses[index % statuses.length], priority = priorities[index % priorities.length]) => {
  const type = collaborationTaskTypes[typeKey];
  const person = people[personIndex % people.length];
  const direction = type.direction;
  const role = direction === "ai_to_human" ? (index % 3 === 0 ? "operator" : "employee") : (index % 2 === 0 ? "employee" : "operator");
  const needsConfirmation = ["sensitive", "replyReview", "recommendation", "followUp"].includes(typeKey);
  return {
    id: `collab-${index + 1}`,
    direction,
    type: typeKey,
    title: type.label,
    customer: { name: person[0], tags: [person[4], person[2]] },
    conversationKey: ["c1", "c2", "c3", "c4", "c5", "c6"][personIndex % 6],
    enterprise: person[1],
    industry: person[2],
    agent: direction === "ai_to_human" ? `${person[2]}成交顾问` : "客户经营策略智能体",
    priority,
    status,
    assignee: role === "employee" ? person[3] : "运营中心",
    assigneeRole: role,
    createdAt: `2026-09-${String(23 - (index % 8)).padStart(2, "0")} ${String(9 + (index % 9)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`,
    dueAt: priority === "urgent" ? "15分钟内" : priority === "high" ? "30分钟内" : priority === "normal" ? "2小时内" : "24小时内",
    aiReason: direction === "ai_to_human" ? outputs[typeKey] : "销售主动发起 AI 分析任务，希望快速获得可执行的客户经营建议。",
    aiConfidence: `${78 + (index * 3) % 19}%`,
    input: direction === "ai_to_human" ? "最近一轮客户会话与客户标签" : `请分析${person[0]}最近 7 天的沟通记录，并给出下一步建议。`,
    output: outputs[typeKey],
    requiresHumanConfirmation: needsConfirmation,
    auditLogs: [
      { time: `2026-09-${String(23 - (index % 8)).padStart(2, "0")} 10:12`, actor: "AI智能体", action: direction === "ai_to_human" ? "识别并创建人工协作任务" : "接收人工任务" },
      { time: `2026-09-${String(23 - (index % 8)).padStart(2, "0")} 10:15`, actor: role === "employee" ? person[3] : "运营中心", action: status === "待人工确认" ? "查看 AI 结果，等待确认" : "任务进入当前处理队列" }
    ]
  };
};

const fixtureTypes = [
  "highIntent", "complaint", "sensitive", "lowConfidence", "toolFailure", "replyReview",
  "summary", "profile", "intent", "replySuggestion", "recommendation", "followUp"
];

export const collaborationTasks = Array.from({ length: 24 }, (_, index) => createTask(
  index,
  fixtureTypes[index % fixtureTypes.length],
  index % people.length,
  statuses[index % statuses.length],
  priorities[index % priorities.length]
));

export const getCollaborationTaskType = (typeKey) => collaborationTaskTypes[typeKey] || { label: typeKey, direction: "ai_to_human", sla: "2小时" };
export const getCollaborationStatus = (status) => collaborationTaskStatuses.find((item) => item.value === status) || collaborationTaskStatuses[0];
export const getCollaborationPriority = (priority) => collaborationPriorities.find((item) => item.value === priority) || collaborationPriorities[2];
