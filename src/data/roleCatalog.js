export const rolePageSize = 12;

export const industryOptions = [
  "全部行业", "成人教育", "K12教育", "教育培训", "医疗健康", "保险服务", "金融理财", "房产家居", "汽车服务", "零售电商", "旅游酒店", "企业服务"
];

export const ROLE_DEMO_DATA = [
  ["成人教育课程顾问", "成人教育", "学历提升", "面向在职人群提供学历提升咨询，帮助用户梳理报考条件、专业选择和学习计划。", "avatar-sales.svg"],
  ["K12升学规划师", "K12教育", "升学规划", "围绕中小学生的学段目标、学科短板和升学节点，提供专业且有温度的家庭教育咨询。", "avatar-zhang.svg"],
  ["医疗健康咨询师", "医疗健康", "健康咨询", "负责健康服务初步咨询与就医需求分诊，不做诊断承诺，清晰引导用户完成预约或转人工。", "avatar-liu.svg"],
  ["保险保障顾问", "保险服务", "保障规划", "从家庭成员、收入结构和风险偏好出发，帮助客户理解保障缺口并匹配合适的咨询服务。", "avatar-wang.svg"],
  ["家庭理财顾问", "金融理财", "资产配置", "以稳健、合规为前提，了解客户资金目标与风险承受能力，提供资产配置方向和人工服务衔接。", "avatar-sales.svg"],
  ["房产置业顾问", "房产家居", "置业咨询", "围绕区域、预算、家庭需求和购房阶段，为客户筛选房源并安排专业顾问跟进。", "avatar-zhang.svg"],
  ["家装设计顾问", "房产家居", "装修咨询", "通过了解户型、预算和居住偏好，帮助客户建立装修需求清单并预约量房设计。", "avatar-group.svg"],
  ["新能源汽车顾问", "汽车服务", "购车转化", "解答车型、续航、权益和试驾问题，识别购车时机，推动预约试驾与门店到店。", "avatar-wang.svg"],
  ["汽车售后服务专员", "汽车服务", "售后服务", "负责保养提醒、维修进度和服务回访，快速识别紧急问题并及时转人工处理。", "avatar-liu.svg"],
  ["零售会员运营", "零售电商", "会员运营", "根据会员偏好和消费记录进行商品推荐、权益提醒与复购唤醒，保持自然克制的沟通节奏。", "avatar-group.svg"],
  ["电商售前导购", "零售电商", "售前导购", "帮助客户快速理解商品差异、适用场景和优惠规则，减少选择成本并促进下单。", "avatar-sales.svg"],
  ["旅行行程顾问", "旅游酒店", "旅行规划", "根据出行人数、预算和偏好设计旅行方向，完成行程咨询、产品推荐和预订信息收集。", "avatar-zhang.svg"],
  ["酒店预订管家", "旅游酒店", "预订服务", "围绕入住日期、房型偏好与服务需求提供预订协助，处理改期、取消和特殊要求。", "avatar-liu.svg"],
  ["SaaS售前顾问", "企业服务", "方案咨询", "理解企业规模、业务流程与系统现状，匹配产品方案并推进演示预约与销售线索交接。", "avatar-wang.svg"],
  ["企业服务客户成功", "企业服务", "客户成功", "围绕客户使用目标、上线进度和续费风险提供主动服务，沉淀问题并推动专业团队介入。", "avatar-group.svg"]
].map(([name, industry, positioning, description], index) => ({
  key: `demo-role-${index + 1}`,
  name,
  type: positioning,
  industry,
  roleDescription: description,
  avatar: `assets/role-avatars/role-${index + 1}.png`,
  sales: index % 3,
  status: index % 5 === 0 ? "停用" : "启用"
}));

const extraRoleSeeds = [
  ["专升本规划顾问", "成人教育", "专升本规划"], ["职业技能课程顾问", "成人教育", "职业教育"], ["留学语言顾问", "教育培训", "语言培训"],
  ["少儿编程顾问", "K12教育", "素质教育"], ["家庭教育指导师", "K12教育", "家庭教育"], ["青少年心理服务顾问", "K12教育", "心理服务"],
  ["体检服务顾问", "医疗健康", "体检预约"], ["口腔健康顾问", "医疗健康", "口腔服务"], ["慢病管理专员", "医疗健康", "健康管理"],
  ["寿险规划顾问", "保险服务", "寿险规划"], ["企业团险顾问", "保险服务", "企业保障"], ["车险续保顾问", "保险服务", "车险续保"],
  ["基金投教顾问", "金融理财", "投教服务"], ["贷款方案顾问", "金融理财", "融资咨询"], ["高净值客户顾问", "金融理财", "财富服务"],
  ["新房渠道顾问", "房产家居", "新房咨询"], ["二手房交易顾问", "房产家居", "二手房服务"], ["家居软装顾问", "房产家居", "软装设计"],
  ["汽车金融顾问", "汽车服务", "金融购车"], ["汽车精品顾问", "汽车服务", "精品服务"], ["门店试驾顾问", "汽车服务", "试驾邀约"],
  ["私域复购顾问", "零售电商", "复购运营"], ["直播间转化顾问", "零售电商", "直播转化"], ["跨境电商顾问", "零售电商", "跨境服务"]
];

export const ROLE_EXTRA_DATA = extraRoleSeeds.map(([name, industry, type], index) => ({
  key: `extra-role-${index + 1}`,
  name,
  type,
  industry,
  roleDescription: `面向${industry}场景的${type}角色，负责需求识别、方案讲解、意向判断和后续跟进，保持专业、可信、克制的销售沟通。`,
  avatar: `assets/role-avatars/role-${(index % 18) + 1}.png`,
  sales: (index + 1) % 3,
  status: index % 6 === 0 ? "停用" : "启用"
}));

export const ROLE_CATALOG_DATA = [...ROLE_DEMO_DATA, ...ROLE_EXTRA_DATA];

export function filterRoles(rows, industry = "全部行业", keyword = "") {
  const normalizedKeyword = keyword.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesIndustry = industry === "全部行业" || row.industry === industry;
    const searchable = `${row.roleName || row.name || ""}${row.positioning || row.type || ""}${row.description || row.roleDescription || ""}`.toLowerCase();
    return matchesIndustry && (!normalizedKeyword || searchable.includes(normalizedKeyword));
  });
}

export function getRolePage(rows, page = 1, pageSize = rolePageSize) {
  const start = Math.max(0, page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
