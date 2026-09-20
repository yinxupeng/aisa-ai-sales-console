export const capabilityIndustryOptions = [
  "全部行业", "成人教育", "K12教育", "教育培训", "医疗健康", "保险服务", "金融理财", "房产家居", "汽车服务", "零售电商", "旅游酒店", "企业服务"
];

const capabilitySeeds = [
  ["成人教育", "学历报考条件识别", "从咨询内容中提取学历、地区、报考时间和目标专业，输出可跟进的结构化需求。", "信息总结"],
  ["成人教育", "职业课程匹配", "结合用户职业目标、基础和学习时间，匹配成人职业教育课程方向。", "产品匹配"],
  ["K12教育", "学科问题诊断", "识别年级、学科短板、学习习惯和家长焦虑点，形成初步学习画像。", "信息总结"],
  ["K12教育", "升学节点提醒", "根据升学阶段和关键时间节点，生成家长提醒任务与跟进建议。", "任务触发"],
  ["教育培训", "试听课转化判断", "判断用户是否完成试听、是否认可课程价值，并给出下一步承接动作。", "策略判断"],
  ["医疗健康", "健康咨询风险识别", "识别需要谨慎处理的健康表述，禁止诊断和疗效承诺，必要时转人工。", "合规检查"],
  ["医疗健康", "预约需求结构化", "提取科室、时间、症状描述和服务偏好，辅助预约与人工分诊。", "信息总结"],
  ["保险服务", "家庭保障缺口分析", "根据家庭成员、收入和已有保单信息，整理保障缺口与咨询优先级。", "策略判断"],
  ["保险服务", "保单续期提醒", "识别保单到期、续期和客户犹豫信号，生成分阶段提醒任务。", "任务触发"],
  ["金融理财", "风险偏好识别", "从客户表达中识别投资目标、期限和风险承受能力，避免越权推荐。", "策略判断"],
  ["金融理财", "融资材料清单", "根据企业融资场景整理材料准备清单和待确认信息。", "固定话题回复"],
  ["房产家居", "购房需求画像", "提取区域、预算、家庭结构、通勤和入住时间，形成看房推荐依据。", "信息总结"],
  ["房产家居", "装修预算评估", "整理户型、风格、预算和施工阶段，输出量房和设计沟通建议。", "产品匹配"],
  ["汽车服务", "车型需求匹配", "基于用车场景、预算、续航和家庭需求，辅助车型推荐与试驾邀约。", "产品匹配"],
  ["汽车服务", "售后异常升级", "识别维修延误、投诉和安全风险信号，自动生成转人工提醒。", "任务触发"],
  ["零售电商", "会员复购信号识别", "结合购买频次、商品偏好和最近互动，判断适合的复购触达时机。", "策略判断"],
  ["零售电商", "商品对比回复", "根据商品参数、使用场景和用户预算，生成克制清晰的售前对比说明。", "固定话题回复"],
  ["旅游酒店", "旅行偏好提取", "提取出行人数、日期、预算、目的地和兴趣偏好，生成行程咨询摘要。", "信息总结"],
  ["旅游酒店", "预订变更处理", "识别改期、取消、房型和特殊需求，输出服务处理路径与人工协同建议。", "任务触发"],
  ["企业服务", "SaaS线索评分", "根据企业规模、业务问题、预算和上线计划，输出线索阶段与跟进优先级。", "策略判断"],
  ["企业服务", "客户成功风险识别", "从使用反馈、上线进度和续费表达中识别客户成功风险并触发提醒。", "策略判断"],
  ["企业服务", "方案演示准备", "整理客户业务现状、核心问题、演示重点和参会角色，辅助售前准备。", "信息总结"],
  ["教育培训", "课程异议归因", "识别价格、效果、时间和家人意见等异议类型，给出下一步沟通建议。", "策略判断"],
  ["教育培训", "线索来源归因", "根据首次咨询内容和渠道字段整理客户来源、需求类型和转化阶段。", "数据同步"]
];

export const INDUSTRY_SKILL_DATA = capabilitySeeds.map(([industry, name, description, type], index) => ({
  key: `industry-skill-${index + 1}`,
  name,
  description,
  type,
  industry,
  outputType: type === "信息总结" ? "结构化档案" : "策略判断",
  outputTargets: ["智能体内部", "生成真人销售建议"],
  scenario: `${industry}客户咨询与服务跟进`,
  trigger: "命中行业场景 / 阶段进入时",
  input: "最近聊天记录、客户档案、用户标签、业务状态",
  output: "判断结果、下一步建议、人工跟进提醒",
  boundAgents: [],
  status: index % 8 === 0 ? "停用" : "启用",
  createdAt: "2026-08-20 10:20:00",
  updatedAt: "2026-09-18 16:42:03",
  prompt: `# Skill目标\n\n你是${industry}行业的${name}，请基于真实业务上下文完成判断。\n\n## 输出要求\n${description}\n不得编造价格、服务结果或客户信息。`,
  knowledgeBaseKeys: [],
  knowledgeResourceKeys: [],
  toolKeys: []
}));

export const INDUSTRY_TOOL_DATA = capabilitySeeds.map(([industry, name, description], index) => ({
  key: `industry-tool-${index + 1}`,
  id: 100 + index,
  name: `${industry}${name}工具`,
  industry,
  description: `面向${industry}场景，${description}`,
  prompt: `你是${industry}业务工具助手。\n\n任务：${description}\n\n请根据输入上下文返回结构化结果，并在信息不足时提醒人工确认。`,
  enabled: index % 9 !== 0,
  updatedAt: "2026-09-18T16:42:03"
}));

export const capabilityPageSize = 10;

export function filterCapabilities(rows, industry = "全部行业", keyword = "") {
  const normalizedKeyword = keyword.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesIndustry = industry === "全部行业" || row.industry === industry;
    const searchable = [row.name, row.description, row.type, row.prompt, row.industry].join(" ").toLowerCase();
    return matchesIndustry && (!normalizedKeyword || searchable.includes(normalizedKeyword));
  });
}

export function getCapabilityPage(rows, page = 1, pageSize = capabilityPageSize) {
  const start = Math.max(0, page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
