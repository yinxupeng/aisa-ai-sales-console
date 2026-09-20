export const agentPageSize = 10;

export const agentIndustryOptions = [
  "全部行业", "成人教育", "K12教育", "教育培训", "医疗健康", "保险服务", "金融理财", "房产家居", "汽车服务", "零售电商", "旅游酒店", "企业服务"
];

const agentSeeds = [
  ["成人教育招生顾问", "成人教育", "会话智能体", "学历咨询 / 报考条件 / 专业推荐"],
  ["成人教育续费顾问", "成人教育", "策略智能体", "课程到期 / 学习提醒 / 续费跟进"],
  ["K12学科规划师", "K12教育", "会话智能体", "学习诊断 / 课程推荐 / 试听邀约"],
  ["K12家长沟通助手", "K12教育", "策略智能体", "作业反馈 / 家长沟通 / 阶段复盘"],
  ["少儿素质教育顾问", "教育培训", "会话智能体", "兴趣测评 / 课程匹配 / 到店邀约"],
  ["医疗预约分诊助手", "医疗健康", "会话智能体", "症状初筛 / 科室推荐 / 预约挂号"],
  ["体检套餐推荐顾问", "医疗健康", "策略智能体", "体检需求 / 套餐匹配 / 到检提醒"],
  ["保险保障规划师", "保险服务", "会话智能体", "家庭保障 / 风险识别 / 方案预约"],
  ["车险续保提醒助手", "保险服务", "策略智能体", "保单到期 / 权益说明 / 续保跟进"],
  ["家庭财富顾问", "金融理财", "会话智能体", "资金目标 / 风险测评 / 方案咨询"],
  ["企业融资咨询助手", "金融理财", "策略智能体", "企业资质 / 融资需求 / 材料提醒"],
  ["新房置业顾问", "房产家居", "会话智能体", "区域筛选 / 预算匹配 / 看房预约"],
  ["家装设计方案顾问", "房产家居", "策略智能体", "户型需求 / 预算沟通 / 量房预约"],
  ["新能源汽车顾问", "汽车服务", "会话智能体", "车型对比 / 试驾邀约 / 购车跟进"],
  ["汽车售后回访助手", "汽车服务", "策略智能体", "保养提醒 / 服务回访 / 异常转人工"],
  ["零售会员运营助手", "零售电商", "策略智能体", "会员分层 / 权益触达 / 复购唤醒"],
  ["电商售前导购", "零售电商", "会话智能体", "商品对比 / 优惠说明 / 下单转化"],
  ["直播间转化助手", "零售电商", "策略智能体", "直播互动 / 意向识别 / 私域承接"],
  ["旅行线路规划师", "旅游酒店", "会话智能体", "出行偏好 / 行程设计 / 产品推荐"],
  ["酒店预订管家", "旅游酒店", "策略智能体", "房型咨询 / 预订确认 / 入住提醒"],
  ["SaaS售前方案顾问", "企业服务", "会话智能体", "业务诊断 / 方案匹配 / 演示预约"],
  ["企业客户成功助手", "企业服务", "策略智能体", "上线跟进 / 使用复盘 / 续费提醒"],
  ["HR服务顾问", "企业服务", "会话智能体", "招聘需求 / 产品咨询 / 方案邀约"],
  ["供应链服务顾问", "企业服务", "策略智能体", "采购需求 / 供应匹配 / 商务跟进"]
];

export const INDUSTRY_AGENT_DATA = agentSeeds.map(([name, industry, agentCategory, trigger], index) => ({
  key: `industry-agent-${index + 1}`,
  name,
  agentCategory,
  industry,
  type: agentCategory === "策略智能体" ? "策略编排" : "SOP会话",
  trigger,
  channel: "Sabuddy内部能力",
  input: "客户档案、最近会话、用户标签、业务状态",
  output: "下一步沟通建议、待执行任务、人工跟进提醒",
  agent: name,
  calls: 18 + index * 7,
  createdAt: "2026-08-20 10:20:16",
  updatedAt: "2026-09-18 16:42:03",
  status: index % 7 === 0 ? "停用" : "启用"
}));

export function filterAgents(rows, industry = "全部行业", keyword = "") {
  const normalizedKeyword = keyword.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesIndustry = industry === "全部行业" || row.industry === industry;
    const searchable = [row.name, row.industry, row.agentCategory, row.type, row.trigger, row.channel].join(" ").toLowerCase();
    return matchesIndustry && (!normalizedKeyword || searchable.includes(normalizedKeyword));
  });
}

export function getAgentPage(rows, page = 1, pageSize = agentPageSize) {
  const start = Math.max(0, page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
