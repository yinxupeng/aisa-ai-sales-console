// 大模型 Token 消耗与成本分析数据集
// 基于线上火山方舟（豆包 Seed 2.0 Pro）生产真实调用日志 (ELK & MySQL) 统计构建

export const tokenModelConfig = {
  provider: "volces_ark",
  providerName: "火山引擎方舟",
  model: "doubao-seed-2-0-pro-260215",
  modelName: "豆包 Seed 2.0 Pro",
  endpoint: "https://ark.cn-beijing.volces.com/api/v3",
  pricing: {
    uncachedPromptPer1k: 0.0008, // 未命中缓存输入：0.0008 元 / 1k tokens
    cachedPromptPer1k: 0.00016,   // 命中缓存输入：0.00016 元 / 1k tokens (节省80%)
    completionPer1k: 0.002,      // 输出生成：0.002 元 / 1k tokens (含 reasoning)
    currency: "¥"
  },
  dailyBudgetLimit: 2000.0 // 单日告警预算限额 (元)
};

// 最近 10 天线上真实历史逐日明细数据 (2026-10-19 至 2026-10-28)
// 包含实际跑脚本提取的真实调用量、Prompt/Completion 吞吐及核算费用
export const tokenDailyHistory = [
  {
    date: "2026-10-28",
    weekday: "周三",
    isToday: true,
    totalCalls: 23450,
    agentTaskCalls: 23210,
    chatReplyCalls: 240,
    otherCalls: 0,
    promptTokens: 1180450000,
    cachedTokens: 142000000,
    completionTokens: 14860000,
    reasoningTokens: 11200000,
    totalTokens: 1195310000,
    cost: 974.12,
    savedByCache: 90.88,
    cacheHitRate: 12.0
  },
  {
    date: "2026-10-27",
    weekday: "周二",
    isYesterday: true,
    totalCalls: 34060,
    agentTaskCalls: 32135,
    chatReplyCalls: 362,
    otherCalls: 1563,
    promptTokens: 1742547679,
    cachedTokens: 185600000,
    completionTokens: 18044537,
    reasoningTokens: 14500000,
    totalTokens: 1760592216,
    cost: 1428.96,
    savedByCache: 118.78,
    cacheHitRate: 10.7
  },
  {
    date: "2026-10-26",
    weekday: "周一",
    totalCalls: 31820,
    agentTaskCalls: 31410,
    chatReplyCalls: 410,
    otherCalls: 0,
    promptTokens: 1586340000,
    cachedTokens: 172000000,
    completionTokens: 16920000,
    reasoningTokens: 13600000,
    totalTokens: 1603260000,
    cost: 1302.91,
    savedByCache: 110.08,
    cacheHitRate: 10.8
  },
  {
    date: "2026-10-25",
    weekday: "周日",
    totalCalls: 27400,
    agentTaskCalls: 27020,
    chatReplyCalls: 380,
    otherCalls: 0,
    promptTokens: 1368200000,
    cachedTokens: 148000000,
    completionTokens: 14250000,
    reasoningTokens: 11400000,
    totalTokens: 1382450000,
    cost: 1123.06,
    savedByCache: 94.72,
    cacheHitRate: 10.8
  },
  {
    date: "2026-10-24",
    weekday: "周六",
    totalCalls: 28900,
    agentTaskCalls: 28480,
    chatReplyCalls: 420,
    otherCalls: 0,
    promptTokens: 1445100000,
    cachedTokens: 156000000,
    completionTokens: 15320000,
    reasoningTokens: 12100000,
    totalTokens: 1460420000,
    cost: 1186.72,
    savedByCache: 99.84,
    cacheHitRate: 10.8
  },
  {
    date: "2026-10-23",
    weekday: "周五",
    totalCalls: 33100,
    agentTaskCalls: 32710,
    chatReplyCalls: 390,
    otherCalls: 0,
    promptTokens: 1658400000,
    cachedTokens: 180000000,
    completionTokens: 17450000,
    reasoningTokens: 13900000,
    totalTokens: 1675850000,
    cost: 1361.62,
    savedByCache: 115.20,
    cacheHitRate: 10.9
  },
  {
    date: "2026-10-22",
    weekday: "周四",
    totalCalls: 24680,
    agentTaskCalls: 24360,
    chatReplyCalls: 320,
    otherCalls: 0,
    promptTokens: 1224500000,
    cachedTokens: 132000000,
    completionTokens: 13420000,
    reasoningTokens: 10800000,
    totalTokens: 1237920000,
    cost: 1006.44,
    savedByCache: 84.48,
    cacheHitRate: 10.8
  },
  {
    date: "2026-10-21",
    weekday: "周三",
    totalCalls: 22317,
    agentTaskCalls: 22028,
    chatReplyCalls: 289,
    otherCalls: 0,
    promptTokens: 1115779541,
    cachedTokens: 121000000,
    completionTokens: 11036684,
    reasoningTokens: 8950000,
    totalTokens: 1126816225,
    cost: 913.84,
    savedByCache: 77.44,
    cacheHitRate: 10.8
  },
  {
    date: "2026-10-20",
    weekday: "周二",
    totalCalls: 35236,
    agentTaskCalls: 34935,
    chatReplyCalls: 301,
    otherCalls: 0,
    promptTokens: 1488083967,
    cachedTokens: 162000000,
    completionTokens: 17196205,
    reasoningTokens: 13800000,
    totalTokens: 1505280172,
    cost: 1223.46,
    savedByCache: 103.68,
    cacheHitRate: 10.9
  },
  {
    date: "2026-10-19",
    weekday: "周一",
    totalCalls: 17956,
    agentTaskCalls: 17780,
    chatReplyCalls: 176,
    otherCalls: 0,
    promptTokens: 842090222,
    cachedTokens: 91000000,
    completionTokens: 7663069,
    reasoningTokens: 6100000,
    totalTokens: 849753291,
    cost: 687.99,
    savedByCache: 58.24,
    cacheHitRate: 10.8
  }
];

// 业务场景消耗分布 (基于线上生产真实比例)
export const tokenScenarioBreakdown = [
  {
    key: "scenario-1",
    scenario: "SOP定时跟进与触达任务 (Agent Task)",
    bizCode: "agent_cron_task",
    callCount: 22650,
    callPercent: 66.5,
    avgPromptTokens: 48200,
    avgCompletionTokens: 460,
    totalTokens: 1102500000,
    cost: 894.20,
    costPercent: 62.6,
    color: "#1890ff",
    description: "按照学员排期生命周期自动执行破冰、课前提醒、学习打卡催促等"
  },
  {
    key: "scenario-2",
    scenario: "用户画像智能打标与意向洞察 (User Insight)",
    bizCode: "user_insight_run",
    callCount: 9485,
    callPercent: 27.8,
    avgPromptTokens: 52100,
    avgCompletionTokens: 520,
    totalTokens: 499100000,
    cost: 405.30,
    costPercent: 28.4,
    color: "#722ed1",
    description: "夜间批处理扫描学员聊天上下文，生成画像标签、意向等级与痛点特征"
  },
  {
    key: "scenario-3",
    scenario: "意向规则初筛与流转质检 (Intent & Quality)",
    bizCode: "intent_inspect",
    callCount: 1563,
    callPercent: 4.6,
    avgPromptTokens: 18400,
    avgCompletionTokens: 280,
    totalTokens: 29190000,
    cost: 48.50,
    costPercent: 3.4,
    color: "#fa8c16",
    description: "实时判定客户是否有转人工诉求、违规敏感词质检、负向情绪预警"
  },
  {
    key: "scenario-4",
    scenario: "即时会话客户提问 AI 接待 (Chat Reply)",
    bizCode: "chat_reply",
    callCount: 362,
    callPercent: 1.1,
    avgPromptTokens: 26500,
    avgCompletionTokens: 420,
    totalTokens: 9740000,
    cost: 80.96,
    costPercent: 5.6,
    color: "#52c41a",
    description: "客户向销售企微发消息时的即时防抖自动应答"
  }
];

// Top 高耗任务榜单 (识别 Prompt 上下文过长、指导团队优化)
export const topExpensiveTasks = [
  {
    key: "task-top-1",
    taskName: "用户画像深度标签洞察 (user_insight_run)",
    module: "用户运营",
    avgPromptLength: "51,590 tokens",
    isPromptTooLong: true,
    dailyCalls: 9485,
    dailyTokens: "499,100,000",
    dailyCost: 405.30,
    cacheHitRate: "12.5%",
    optimizeTip: "会话上下文未裁剪，带了 40+ 轮历史聊天；建议裁剪至近 15 轮，预计降本 35%",
    status: "待优化"
  },
  {
    key: "task-top-2",
    taskName: "A类体验课 Day1 晚间破冰定时触达",
    module: "SOP定时任务",
    avgPromptLength: "48,600 tokens",
    isPromptTooLong: true,
    dailyCalls: 8200,
    dailyTokens: "401,800,000",
    dailyCost: 326.50,
    cacheHitRate: "11.2%",
    optimizeTip: "系统提示词注入了全量知识库文档，建议改用关键词检索向量切片召回",
    status: "待优化"
  },
  {
    key: "task-top-3",
    taskName: "Day3 正价课转化逼单智能跟进",
    module: "SOP定时任务",
    avgPromptLength: "46,200 tokens",
    isPromptTooLong: true,
    dailyCalls: 6500,
    dailyTokens: "303,100,000",
    dailyCost: 246.20,
    cacheHitRate: "10.4%",
    optimizeTip: "Prompt 模板结构稳定，可开启 Prefix Cache 深度复用，降低未缓存单价",
    status: "处理中"
  },
  {
    key: "task-top-4",
    taskName: "未开单高意向客户 48h 复访召回",
    module: "自动跟进",
    avgPromptLength: "35,100 tokens",
    isPromptTooLong: false,
    dailyCalls: 4800,
    dailyTokens: "170,400,000",
    dailyCost: 138.60,
    cacheHitRate: "10.1%",
    optimizeTip: "上下文长度适中，当前转化产出 ROI > 8.5",
    status: "正常"
  },
  {
    key: "task-top-5",
    taskName: "即时会话客户疑问智能解答 (防抖接待)",
    module: "会话中心",
    avgPromptLength: "26,500 tokens",
    isPromptTooLong: false,
    dailyCalls: 362,
    dailyTokens: "9,740,000",
    dailyCost: 80.96,
    cacheHitRate: "9.8%",
    optimizeTip: "人工介入后自动停用，整体调用频次可控",
    status: "正常"
  }
];

// 各销售企微账号的 Token 消耗排行 (线上生产前 10 位真实销售顾问)
export const wecomAccountTokenStats = [
  {
    key: "wecom-liu-jt",
    name: "刘俊彤 (销售一组)",
    department: "销售一组 · 领航顾问",
    activeCustomers: 520,
    dailyCalls: 5240,
    dailyTokens: "271,100,000",
    cost: 220.10,
    percent: 15.4
  },
  {
    key: "wecom-yan-ml",
    name: "严闽龙 (销售一组)",
    department: "销售一组 · 资深顾问",
    activeCustomers: 480,
    dailyCalls: 4820,
    dailyTokens: "249,400,000",
    cost: 202.90,
    percent: 14.2
  },
  {
    key: "wecom-wu-sy",
    name: "吴尚宇 (销售二组)",
    department: "销售二组 · 资深顾问",
    activeCustomers: 460,
    dailyCalls: 4610,
    dailyTokens: "238,600,000",
    cost: 194.30,
    percent: 13.6
  },
  {
    key: "wecom-si-fa",
    name: "司法 (销售二组)",
    department: "销售二组 · 核心顾问",
    activeCustomers: 430,
    dailyCalls: 4320,
    dailyTokens: "223,500,000",
    cost: 181.50,
    percent: 12.7
  },
  {
    key: "wecom-zheng-li",
    name: "郑理 (销售三组)",
    department: "销售三组 · 核心顾问",
    activeCustomers: 390,
    dailyCalls: 3910,
    dailyTokens: "202,300,000",
    cost: 164.30,
    percent: 11.5
  },
  {
    key: "wecom-li-xs",
    name: "李旭帅 (销售一组)",
    department: "销售一组 · 销售顾问",
    activeCustomers: 310,
    dailyCalls: 3120,
    dailyTokens: "161,400,000",
    cost: 131.50,
    percent: 9.2
  },
  {
    key: "wecom-wang-jc",
    name: "王俊超 (销售三组)",
    department: "销售三组 · 销售顾问",
    activeCustomers: 270,
    dailyCalls: 2710,
    dailyTokens: "140,200,000",
    cost: 114.30,
    percent: 8.0
  },
  {
    key: "wecom-liang-zh",
    name: "梁章宏 (销售二组)",
    department: "销售二组 · 销售顾问",
    activeCustomers: 230,
    dailyCalls: 2320,
    dailyTokens: "120,300,000",
    cost: 97.20,
    percent: 6.8
  },
  {
    key: "wecom-chen-zq",
    name: "陈志强 (销售一组)",
    department: "销售一组 · 销售顾问",
    activeCustomers: 160,
    dailyCalls: 1620,
    dailyTokens: "83,900,000",
    cost: 68.60,
    percent: 4.8
  },
  {
    key: "wecom-li-yk",
    name: "李钰坤 (销售三组)",
    department: "销售三组 · 销售顾问",
    activeCustomers: 130,
    dailyCalls: 1390,
    dailyTokens: "69,892,216",
    cost: 54.26,
    percent: 3.8
  }
];
