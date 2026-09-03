const rawConversations = [
  {
    key: "g1",
    accountKey: "wecom-chen",
    type: "group",
    name: "三年级英语试听群",
    avatar: "群",
    avatarImage: "./images/矩形 3.png",
    avatarColors: ["#4ade80", "#138a59"],
    unread: 6,
    owner: "陈销售",
    intent: "中",
    status: "AI接待中",
    last: "老师发了今晚自然拼读试听提醒",
    phone: "-",
    wecomId: "room_aisa_trial",
    lifecycle: "提升认知",
    lifecycleStage: 2,
    tags: ["直播课用户", "父母成长营意向", "适合邀约直播课"],
    order: "3位学员已预约试听课",
    matchedSkills: ["19元A类课-第一课", "19元A类课-课后"],
    sendMode: "自动发送",
    hosted: true,
    remark: "三年级英语试听群",
    consultant: "陈销售",
    addedAt: "2026-06-08 10:20",
    crmSource: "SCRM同步",
    suggestion: "各位家长晚上好，今晚 19:30 是三年级自然拼读试听课，主要看孩子的单词拼读、听力反应和课堂参与度。课后我会把每个孩子的课堂反馈发给大家，方便判断适合从哪个班型开始。",
    reason: "试听课前集中提醒，适合用课程顾问口吻说明课堂目标和课后反馈安排。",
    messages: [
      { from: "system", text: "你已同步三年级英语试听群，现在可以开始群聊。", time: "10:18" },
      { from: "customer", sender: "王女士", text: "今晚试听主要讲什么？孩子基础一般能跟上吗？", time: "10:20" },
      { from: "ai", sender: "陈销售", text: "可以跟上的。今晚会从自然拼读和简单听说互动开始，老师会观察孩子的发音、词汇量和课堂反应。", time: "10:21" },
      { from: "customer", sender: "刘先生", text: "试听后会给具体建议吗？", time: "10:23" }
    ],
    orders: [
      { id: "GROUP-DEMO", product: "小学英语自然拼读试听课", amount: "免费试听", status: "3位学员已预约", paidAt: "-" }
    ]
  },
  {
    key: "c1",
    accountKey: "wecom-li",
    type: "single",
    name: "张妈妈",
    avatar: "张",
    avatarImage: "./images/矩形 8.png",
    avatarColors: ["#8fc7ff", "#1b63d9"],
    unread: 3,
    owner: "李销售",
    intent: "高",
    status: "待确认发送",
    last: "三年级孩子词汇量少，适合报哪个班？",
    phone: "138****7788",
    wecomId: "wm_cust_1024",
    lifecycle: "定义用户",
    tags: ["学习动力弱", "家长高焦虑", "高意向"],
    order: "自然拼读提升班待报价",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    lifecycleStage: 1,
    remark: "张妈妈-三年级词汇薄弱",
    consultant: "李销售",
    addedAt: "2026-05-27 14:56",
    crmSource: "SCRM同步",
    suggestion: "张妈妈，三年级词汇量少的话，我建议先从自然拼读提升班开始，先把单词拼读和记忆方法补起来。孩子如果能坚持 6-8 周，通常会先看到背单词效率和阅读信心的变化。我可以先给您发一份班型和课时安排，您看下是否匹配孩子时间。",
    reason: "家长明确提出年级和薄弱点，适合先定义需求，再推荐自然拼读提升班。",
    messages: [
      { from: "system", text: "你已添加了张妈妈，现在可以开始聊天了。", time: "09:58" },
      { from: "customer", text: "孩子三年级，英语一直不太敢开口。", time: "10:02" },
      { from: "ai", text: "三年级这个阶段很适合先看发音和词汇基础。孩子现在主要是单词记不住，还是听不懂老师课堂指令？", time: "10:03" },
      { from: "customer", text: "单词记得慢，阅读也有点吃力。", time: "10:06" },
      { from: "customer", text: "三年级孩子词汇量少，适合报哪个班？", time: "10:20" }
    ],
    orders: [
      { id: "C-20260612-01", product: "三年级自然拼读提升班", amount: "¥3,980", status: "待确认班型", paidAt: "-" }
    ]
  },
  {
    key: "c2",
    accountKey: "wecom-chen",
    type: "single",
    name: "王妈妈",
    avatar: "王",
    avatarImage: "./images/矩形 10.png",
    avatarColors: ["#f9c74f", "#d97706"],
    unread: 0,
    owner: "陈销售",
    intent: "中",
    status: "AI接待中",
    last: "四年级想提升阅读理解，有试听课吗？",
    phone: "139****6621",
    wecomId: "wm_cust_2031",
    lifecycle: "了解阶段",
    tags: ["厌学", "开始接受心理因素", "适合推测评"],
    order: "未报名",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    lifecycleStage: 0,
    remark: "王妈妈-四年级阅读提升",
    consultant: "陈销售",
    addedAt: "2026-06-02 11:12",
    crmSource: "SCRM同步",
    suggestion: "有的王妈妈，四年级阅读理解我们会先安排一节测评试听，看看孩子是词汇量、长句理解还是做题方法的问题。试听后老师会给一份学习建议，再判断适合进阅读提升班还是综合能力班。",
    reason: "家长咨询试听课，风险低，适合先引导测评试听并收集孩子薄弱点。",
    messages: [
      { from: "customer", text: "四年级想提升阅读理解，有试听课吗？", time: "10:20" },
      { from: "ai", text: "有的，我们会先安排测评试听，看孩子是词汇、长句理解还是做题方法需要加强。", time: "10:20" }
    ],
    orders: [
      { id: "NO-ORDER", product: "阅读测评试听课", amount: "免费试听", status: "待预约", paidAt: "-" }
    ]
  },
  {
    key: "c3",
    accountKey: "wecom-li",
    type: "single",
    name: "刘爸爸",
    avatar: "刘",
    avatarImage: "./images/矩形 12.png",
    avatarColors: ["#fda4af", "#be123c"],
    unread: 1,
    owner: "李销售",
    intent: "高",
    status: "待确认发送",
    last: "如果今天报名，寒假班还有名额吗？",
    phone: "137****5609",
    wecomId: "wm_cust_3098",
    lifecycle: "催单阶段",
    tags: ["手机成瘾", "关注孩子是否配合", "高意向"],
    order: "寒假冲刺班报价已发送",
    matchedSkills: ["19元A类课-课前", "通知真人销售"],
    sendMode: "人工确认",
    hosted: true,
    lifecycleStage: 3,
    remark: "刘爸爸-五年级寒假班",
    consultant: "李销售",
    addedAt: "2026-06-01 16:42",
    crmSource: "SCRM同步",
    suggestion: "刘爸爸，五年级寒假冲刺班目前还有 2 个名额。今天报名的话可以优先锁定周末班时段，我先帮您确认孩子适合的班型和上课时间，确认后再发报名链接给您。",
    reason: "家长询问名额和报名，已进入催单阶段，涉及名额和报名链接，建议人工确认后发送。",
    messages: [
      { from: "customer", text: "试听课孩子说还挺喜欢的。", time: "09:30" },
      { from: "ai", text: "那挺好，老师反馈孩子课堂参与度不错，主要是阅读速度还可以再提升。", time: "09:31" },
      { from: "customer", text: "如果今天报名，寒假班还有名额吗？", time: "10:20" }
    ],
    orders: [
      { id: "O-20260610-18", product: "五年级英语寒假冲刺班", amount: "¥5,680", status: "待报名付款", paidAt: "-" }
    ]
  },
  {
    key: "c4",
    accountKey: "wecom-wu",
    type: "single",
    name: "赵妈妈",
    avatar: "赵",
    avatarImage: "./images/矩形 9.png",
    unread: 2,
    owner: "吴销售",
    intent: "中",
    status: "AI接待中",
    last: "一年级可以先学自然拼读吗？",
    phone: "136****9012",
    wecomId: "wm_cust_4102",
    lifecycle: "了解阶段",
    lifecycleStage: 0,
    tags: ["叛逆对抗", "家长高控制", "测评用户"],
    order: "启蒙测评课待预约",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "赵妈妈-一年级英语启蒙",
    addedAt: "2026-06-12 09:18",
    suggestion: "赵妈妈，一年级可以先做启蒙测评，看看孩子字母认知、发音模仿和课堂专注度，再判断是否直接进自然拼读启蒙班。",
    reason: "家长咨询低年级启蒙，适合先引导测评，不直接推长期班。",
    messages: [
      { from: "customer", text: "一年级可以先学自然拼读吗？", time: "09:18" },
      { from: "ai", text: "可以先测一下字母和发音基础，再判断适不适合进自然拼读启蒙班。", time: "09:19" }
    ],
    orders: [
      { id: "T-20260612-02", product: "一年级英语启蒙测评课", amount: "免费测评", status: "待预约", paidAt: "-" }
    ]
  },
  {
    key: "c5",
    accountKey: "wecom-lin",
    type: "single",
    name: "孙爸爸",
    avatar: "孙",
    avatarImage: "./images/矩形 11.png",
    unread: 4,
    owner: "林销售",
    intent: "高",
    status: "待确认发送",
    last: "暑假班现在报名有什么安排？",
    phone: "135****4432",
    wecomId: "wm_cust_5109",
    lifecycle: "催单阶段",
    lifecycleStage: 3,
    tags: ["休学", "同行者计划意向", "高意向"],
    order: "小升初暑假衔接班待报名",
    matchedSkills: ["19元A类课-第四课", "19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    remark: "孙爸爸-六年级小升初",
    addedAt: "2026-06-11 20:08",
    suggestion: "孙爸爸，暑假小升初衔接班主要补阅读、语法和写作表达，现在报名可以优先选择周末上午班。我先帮您确认一下孩子目前英语成绩和可上课时间，再给您匹配班型。",
    reason: "家长询问暑假班报名安排，已接近下单，需要确认班型和时间后发送。",
    messages: [
      { from: "customer", text: "孩子六年级，暑假想提前衔接初中英语。", time: "20:08" },
      { from: "ai", text: "这个阶段很适合提前补阅读和语法框架，暑假班会更系统。", time: "20:09" },
      { from: "customer", text: "暑假班现在报名有什么安排？", time: "20:12" }
    ],
    orders: [
      { id: "O-20260611-06", product: "小升初英语暑假衔接班", amount: "¥6,280", status: "待报名付款", paidAt: "-" }
    ]
  },
  {
    key: "c6",
    accountKey: "wecom-li",
    type: "single",
    name: "陈妈妈",
    avatar: "陈",
    avatarImage: "./images/矩形 4.png",
    unread: 5,
    owner: "李销售",
    intent: "中",
    status: "AI接待中",
    last: "二年级现在学英语会不会太早？",
    phone: "132****9081",
    wecomId: "wm_cust_6118",
    lifecycle: "了解阶段",
    lifecycleStage: 0,
    tags: ["睡眠问题", "尚未意识到问题本质", "新线索"],
    order: "未报名",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "陈妈妈-二年级启蒙咨询",
    addedAt: "2026-06-13 09:12",
    suggestion: "陈妈妈，二年级不算早，关键是不要一上来就刷题，可以先从听说兴趣、自然拼读和简单阅读开始。我们可以先给孩子做一次启蒙测评，看适合从哪个阶段接入。",
    reason: "家长担心学习时机，适合先降低焦虑并引导测评。",
    messages: [
      { from: "customer", text: "二年级现在学英语会不会太早？", time: "09:12" },
      { from: "ai", text: "不算早，但建议先看孩子兴趣和字母基础，不急着做难题。", time: "09:13" }
    ],
    orders: [
      { id: "NO-ORDER-C6", product: "二年级英语启蒙测评", amount: "免费测评", status: "待预约", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-1",
    accountKey: "wecom-li",
    type: "single",
    name: "许妈妈",
    avatar: "许",
    avatarImage: "./images/矩形 5.png",
    unread: 2,
    owner: "李销售",
    intent: "高",
    status: "待确认发送",
    last: "今晚能约试听吗？孩子放学后有时间",
    phone: "138****1201",
    wecomId: "wm_li_demo_001",
    lifecycle: "催单阶段",
    lifecycleStage: 3,
    tags: ["体验课用户", "适合邀约专家连麦", "高意向"],
    order: "自然拼读试听课待确认",
    matchedSkills: ["19元A类课-第四课", "19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    remark: "许妈妈-今晚试听",
    addedAt: "2026-06-13 08:42",
    suggestion: "许妈妈，今晚可以约试听。我先帮您看 19:00 和 20:00 两个时间段是否还有名额，确认后把试听链接和课前准备发您。",
    reason: "家长主动约试听，需确认时段后发送。",
    messages: [
      { from: "customer", text: "今晚能约试听吗？孩子放学后有时间。", time: "08:42" },
      { from: "ai", text: "可以的，我先帮您确认今晚可约时间段。", time: "08:43" }
    ],
    orders: [
      { id: "T-LI-001", product: "三年级自然拼读试听课", amount: "免费试听", status: "待确认", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-2",
    accountKey: "wecom-li",
    type: "single",
    name: "郭爸爸",
    avatar: "郭",
    avatarImage: "./images/矩形 6.png",
    unread: 0,
    owner: "李销售",
    intent: "中",
    status: "AI接待中",
    last: "孩子单词背了就忘，有办法吗？",
    phone: "136****8820",
    wecomId: "wm_li_demo_002",
    lifecycle: "定义用户",
    lifecycleStage: 1,
    tags: ["学习动力弱", "需要案例验证", "中意向"],
    order: "词汇方法课待推荐",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "郭爸爸-单词记忆",
    addedAt: "2026-06-12 18:16",
    suggestion: "郭爸爸，单词背了就忘通常和自然拼读、词根联想和复习节奏有关。我建议先看孩子是不会拼读，还是记忆方法不稳定，再匹配词汇提升课。",
    reason: "家长明确词汇痛点，适合追问原因并推荐测评。",
    messages: [
      { from: "customer", text: "孩子单词背了就忘，有办法吗？", time: "18:16" },
      { from: "ai", text: "可以先看孩子是拼读基础弱，还是复习方法不稳定。", time: "18:17" }
    ],
    orders: [
      { id: "C-LI-002", product: "四年级词汇方法提升课", amount: "¥2,680", status: "待推荐", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-3",
    accountKey: "wecom-li",
    type: "single",
    name: "邓妈妈",
    avatar: "邓",
    avatarImage: "./images/矩形 7.png",
    unread: 4,
    owner: "李销售",
    intent: "高",
    status: "AI接待中",
    last: "孩子校内英语 85 分，想冲 95",
    phone: "139****4577",
    wecomId: "wm_li_demo_003",
    lifecycle: "了解阶段",
    lifecycleStage: 0,
    tags: ["厌学", "认可专业咨询", "高意向"],
    order: "校内同步提升班待测评",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "邓妈妈-五年级提分",
    addedAt: "2026-06-13 10:18",
    suggestion: "邓妈妈，85 分冲 95 需要看扣分点是在听力、阅读、语法还是作文表达。我先帮孩子约一节校内同步测评，老师看完卷面问题后再给您规划提升路径。",
    reason: "家长有明确分数目标，适合引导测评。",
    messages: [
      { from: "customer", text: "孩子校内英语 85 分，想冲 95。", time: "10:18" },
      { from: "ai", text: "这个目标可以先拆扣分点，我建议先做一次同步测评。", time: "10:19" }
    ],
    orders: [
      { id: "T-LI-003", product: "五年级校内同步测评", amount: "免费测评", status: "待预约", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-4",
    accountKey: "wecom-li",
    type: "single",
    name: "潘妈妈",
    avatar: "潘",
    avatarImage: "./images/矩形 8.png",
    unread: 1,
    owner: "李销售",
    intent: "中",
    status: "待确认发送",
    last: "价格有点贵，可以少报一点课时吗？",
    phone: "135****0192",
    wecomId: "wm_li_demo_004",
    lifecycle: "催单阶段",
    lifecycleStage: 3,
    tags: ["价格敏感", "适合转人工深聊", "中意向"],
    order: "阅读提升小课包待确认",
    matchedSkills: ["19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    remark: "潘妈妈-价格异议",
    addedAt: "2026-06-11 14:26",
    suggestion: "潘妈妈，可以先从小课包开始，重点解决孩子当前最影响分数的阅读理解问题。我们先确认一个 8 次课的阶段目标，孩子适应后再决定是否续报。",
    reason: "涉及价格和课时方案，应人工确认后发送。",
    messages: [
      { from: "customer", text: "价格有点贵，可以少报一点课时吗？", time: "14:26" },
      { from: "ai", text: "可以先做阶段课包，我帮您看下适合的课时方案。", time: "14:27" }
    ],
    orders: [
      { id: "O-LI-004", product: "阅读提升 8 次小课包", amount: "¥2,480", status: "待确认", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-5",
    accountKey: "wecom-li",
    type: "single",
    name: "谢爸爸",
    avatar: "谢",
    avatarImage: "./images/矩形 9.png",
    unread: 3,
    owner: "李销售",
    intent: "低",
    status: "AI接待中",
    last: "我先和孩子妈妈商量一下",
    phone: "137****5308",
    wecomId: "wm_li_demo_005",
    lifecycle: "提升认知",
    lifecycleStage: 2,
    tags: ["需要家人商量", "暂不强销售", "低意向"],
    order: "未报名",
    matchedSkills: ["19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "谢爸爸-家庭决策",
    addedAt: "2026-06-10 20:32",
    suggestion: "谢爸爸，没问题。您可以先和孩子妈妈沟通一下，我把试听反馈和建议班型整理给您，方便一起判断是否适合孩子。",
    reason: "客户需要家庭决策，降低压迫感并提供材料。",
    messages: [
      { from: "customer", text: "我先和孩子妈妈商量一下。", time: "20:32" },
      { from: "ai", text: "可以的，我把试听反馈和建议班型整理给您。", time: "20:33" }
    ],
    orders: [
      { id: "NO-ORDER-LI-005", product: "试听反馈资料", amount: "-", status: "待跟进", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-6",
    accountKey: "wecom-li",
    type: "single",
    name: "蒋妈妈",
    avatar: "蒋",
    avatarImage: "./images/矩形 10.png",
    unread: 7,
    owner: "李销售",
    intent: "高",
    status: "待确认发送",
    last: "报名链接发我吧，先占周六班",
    phone: "152****8619",
    wecomId: "wm_li_demo_006",
    lifecycle: "催单阶段",
    lifecycleStage: 3,
    tags: ["父母成长营意向", "关注效果保障", "高意向"],
    order: "周六自然拼读班待付款",
    matchedSkills: ["19元A类课-第一课", "19元A类课-课后"],
    sendMode: "人工确认",
    hosted: true,
    remark: "蒋妈妈-周六班报名",
    addedAt: "2026-06-13 11:05",
    suggestion: "蒋妈妈，好的。我先帮您锁定周六班名额，报名链接发您后按页面提示填写孩子信息并完成付款即可。付款后我会同步上课群和课前准备。",
    reason: "客户要求报名链接，必须人工确认后发送。",
    messages: [
      { from: "customer", text: "报名链接发我吧，先占周六班。", time: "11:05" },
      { from: "ai", text: "好的，我先帮您确认周六班名额。", time: "11:06" }
    ],
    orders: [
      { id: "O-LI-006", product: "三年级周六自然拼读班", amount: "¥3,980", status: "待付款", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-7",
    accountKey: "wecom-li",
    type: "single",
    name: "袁妈妈",
    avatar: "袁",
    avatarImage: "./images/矩形 11.png",
    unread: 0,
    owner: "李销售",
    intent: "中",
    status: "AI接待中",
    last: "阅读课和自然拼读课有什么区别？",
    phone: "180****2206",
    wecomId: "wm_li_demo_007",
    lifecycle: "提升认知",
    lifecycleStage: 2,
    tags: ["需要专家背书", "关注隐私安全", "中意向"],
    order: "课程方案待选择",
    matchedSkills: ["19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "袁妈妈-课程对比",
    addedAt: "2026-06-08 16:10",
    suggestion: "袁妈妈，自然拼读更偏单词拼读和记忆方法，阅读课更偏文章理解、长句分析和答题方法。孩子四年级如果单词基础还不稳，建议先测一下再决定从哪门课开始。",
    reason: "家长对课程差异有疑问，适合做价值解释。",
    messages: [
      { from: "customer", text: "阅读课和自然拼读课有什么区别？", time: "16:10" },
      { from: "ai", text: "自然拼读偏单词拼读，阅读课偏文章理解和做题方法。", time: "16:11" }
    ],
    orders: [
      { id: "C-LI-007", product: "阅读/自然拼读课程方案", amount: "-", status: "待选择", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-8",
    accountKey: "wecom-li",
    type: "single",
    name: "梁爸爸",
    avatar: "梁",
    avatarImage: "./images/矩形 12.png",
    unread: 2,
    owner: "李销售",
    intent: "中",
    status: "AI接待中",
    last: "孩子不愿意开口说英语怎么办？",
    phone: "181****7702",
    wecomId: "wm_li_demo_008",
    lifecycle: "定义用户",
    lifecycleStage: 1,
    tags: ["社交困难", "孩子拒绝沟通", "适合先共情安抚"],
    order: "口语互动试听待预约",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "梁爸爸-口语胆怯",
    addedAt: "2026-06-07 09:28",
    suggestion: "梁爸爸，孩子不愿意开口通常不是不会，而是怕说错。我们试听课会先用低压力互动观察发音和反应，再逐步引导孩子说完整句子。",
    reason: "家长描述表达问题，适合解释课堂方法并引导试听。",
    messages: [
      { from: "customer", text: "孩子不愿意开口说英语怎么办？", time: "09:28" },
      { from: "ai", text: "很多孩子是怕说错，可以先通过低压力互动建立信心。", time: "09:29" }
    ],
    orders: [
      { id: "T-LI-008", product: "小学英语口语互动试听", amount: "免费试听", status: "待预约", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-9",
    accountKey: "wecom-li",
    type: "group",
    name: "李老师试听排课群",
    avatar: "群",
    avatarImage: "./images/矩形 3.png",
    unread: 12,
    owner: "李销售",
    intent: "中",
    status: "AI接待中",
    last: "本周试听排课表已更新",
    phone: "-",
    wecomId: "room_li_trial_schedule",
    lifecycle: "了解阶段",
    lifecycleStage: 0,
    tags: ["直播课用户", "适合邀约直播课", "新线索"],
    order: "本周 18 位家长待试听",
    matchedSkills: ["19元A类课-第四课", "19元A类课-课后"],
    sendMode: "自动发送",
    hosted: true,
    remark: "李老师试听排课群",
    addedAt: "2026-06-13 08:00",
    suggestion: "各位家长，本周试听排课表已经更新。请确认孩子可试听时间，如需调整请直接在群里回复，我会帮大家同步老师档期。",
    reason: "群排课通知，适合自动发送。",
    messages: [
      { from: "customer", sender: "许妈妈", text: "周六上午还有位置吗？", time: "08:10" },
      { from: "ai", sender: "李销售", text: "我帮您确认下周六上午档期，稍后同步。", time: "08:11" }
    ],
    orders: [
      { id: "GROUP-LI-009", product: "本周试听排课", amount: "18 位待试听", status: "排课中", paidAt: "-" }
    ]
  },
  {
    key: "li-demo-10",
    accountKey: "wecom-li",
    type: "single",
    name: "夏妈妈",
    avatar: "夏",
    avatarImage: "./images/矩形 4.png",
    unread: 4,
    owner: "李销售",
    intent: "高",
    status: "待确认发送",
    last: "孩子下周考试前还能补几节吗？",
    phone: "159****3109",
    wecomId: "wm_li_demo_010",
    lifecycle: "催单阶段",
    lifecycleStage: 3,
    tags: ["家长高焦虑", "适合推测评", "高意向"],
    order: "考前冲刺课待排课",
    matchedSkills: ["19元A类课-第四课", "19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    remark: "夏妈妈-考前冲刺",
    addedAt: "2026-06-13 12:05",
    suggestion: "夏妈妈，下周考试前可以安排 2-3 次短期冲刺，重点看孩子最近错题和阅读语法薄弱点。我先帮您确认老师这几天的可排课时间。",
    reason: "考前短期排课涉及老师档期，需要人工确认。",
    messages: [
      { from: "customer", text: "孩子下周考试前还能补几节吗？", time: "12:05" },
      { from: "ai", text: "可以看老师档期，建议重点补最近错题和阅读语法。", time: "12:06" }
    ],
    orders: [
      { id: "O-LI-010", product: "考前英语冲刺 3 次课", amount: "¥1,280", status: "待排课", paidAt: "-" }
    ]
  },
  {
    key: "c7",
    accountKey: "wecom-chen",
    type: "single",
    name: "周妈妈",
    avatar: "周",
    avatarImage: "./images/矩形 5.png",
    unread: 1,
    owner: "陈销售",
    intent: "高",
    status: "待确认发送",
    last: "试听完感觉不错，怎么报名？",
    phone: "186****2390",
    wecomId: "wm_cust_7029",
    lifecycle: "催单阶段",
    lifecycleStage: 3,
    tags: ["体验后未报名", "关注效果保障", "高意向"],
    order: "自然拼读班待付款",
    matchedSkills: ["19元A类课-第四课", "19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    remark: "周妈妈-试听后报名",
    addedAt: "2026-06-12 19:40",
    suggestion: "周妈妈，孩子今天试听反馈挺好，老师建议先报三年级自然拼读提升班。报名流程很简单，我先帮您确认周末班和周中班哪个时间更适合，再发报名链接。",
    reason: "家长已经表达报名意向，涉及报名链接，建议人工确认。",
    messages: [
      { from: "customer", text: "试听完感觉不错，怎么报名？", time: "19:40" },
      { from: "ai", text: "我先帮您确认孩子适合的班型和上课时间，再发报名方式。", time: "19:41" }
    ],
    orders: [
      { id: "O-20260612-09", product: "三年级自然拼读提升班", amount: "¥3,980", status: "待付款", paidAt: "-" }
    ]
  },
  {
    key: "c8",
    accountKey: "wecom-zhou",
    type: "single",
    name: "何爸爸",
    avatar: "何",
    avatarImage: "./images/矩形 6.png",
    unread: 2,
    owner: "周销售",
    intent: "中",
    status: "AI接待中",
    last: "你们是线上课还是线下课？",
    phone: "188****6610",
    wecomId: "wm_cust_8130",
    lifecycle: "了解阶段",
    lifecycleStage: 0,
    tags: ["新线索", "对心理咨询抵触", "低意向"],
    order: "未报名",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "何爸爸-市场渠道线索",
    addedAt: "2026-06-13 10:08",
    suggestion: "何爸爸，我们小学英语课支持线上小班和校区面授两种形式，具体会看孩子年级、基础和您方便的上课时间来匹配。孩子现在几年级呢？",
    reason: "市场线索咨询课程形式，适合先解释并追问年级。",
    messages: [
      { from: "customer", text: "你们是线上课还是线下课？", time: "10:08" },
      { from: "ai", text: "两种都有，会根据孩子年级、基础和时间来匹配。", time: "10:09" }
    ],
    orders: [
      { id: "NO-ORDER-C8", product: "课程形式咨询", amount: "-", status: "待留资", paidAt: "-" }
    ]
  },
  {
    key: "c9",
    accountKey: "wecom-wu",
    type: "single",
    name: "黄妈妈",
    avatar: "黄",
    avatarImage: "./images/矩形 7.png",
    unread: 0,
    owner: "吴销售",
    intent: "中",
    status: "AI接待中",
    last: "孩子语法总错，有专项课吗？",
    phone: "133****0198",
    wecomId: "wm_cust_9018",
    lifecycle: "定义用户",
    lifecycleStage: 1,
    tags: ["焦虑倾向", "家长高焦虑", "1V1心理咨询意向"],
    order: "语法专项课待推荐",
    matchedSkills: ["19元A类课-课前", "19元A类课-第一课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "黄妈妈-五年级语法",
    addedAt: "2026-06-10 15:31",
    suggestion: "黄妈妈，有语法专项课。五年级建议先看孩子主要错在时态、句型还是阅读中的语法理解，我可以先发您一份语法测评题，老师看完再推荐课包。",
    reason: "家长明确痛点，适合先细分语法问题再推荐。",
    messages: [
      { from: "customer", text: "孩子语法总错，有专项课吗？", time: "15:31" },
      { from: "ai", text: "有的，可以先看孩子主要错在时态、句型还是阅读理解里的语法。", time: "15:32" }
    ],
    orders: [
      { id: "C-20260610-05", product: "五年级语法专项课", amount: "¥2,980", status: "待测评", paidAt: "-" }
    ]
  },
  {
    key: "c10",
    accountKey: "wecom-lin",
    type: "single",
    name: "马妈妈",
    avatar: "马",
    avatarImage: "./images/矩形 8.png",
    unread: 3,
    owner: "林销售",
    intent: "高",
    status: "待确认发送",
    last: "老学员续报有没有优惠？",
    phone: "177****2806",
    wecomId: "wm_cust_1006",
    lifecycle: "催单阶段",
    lifecycleStage: 3,
    tags: ["老客户复购", "家庭守护计划意向", "高意向"],
    order: "春季续报待确认",
    matchedSkills: ["19元A类课-第四课", "19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    remark: "马妈妈-老学员续报",
    addedAt: "2026-05-20 18:24",
    suggestion: "马妈妈，老学员续报目前有续班权益，我先帮您确认孩子当前班级、剩余课时和适合衔接的春季班，再把续报方案发您确认。",
    reason: "涉及优惠权益和续报方案，建议人工确认后发送。",
    messages: [
      { from: "customer", text: "老学员续报有没有优惠？", time: "18:24" },
      { from: "ai", text: "我先帮您查一下当前课时和适合衔接的班型，再给您发续报方案。", time: "18:25" }
    ],
    orders: [
      { id: "R-20260609-03", product: "春季英语阅读提升续报", amount: "¥4,680", status: "待确认", paidAt: "-" }
    ]
  },
  {
    key: "g2",
    accountKey: "wecom-li",
    type: "group",
    name: "四年级阅读打卡群",
    avatar: "群",
    avatarImage: "./images/矩形 9.png",
    unread: 8,
    owner: "李销售",
    intent: "中",
    status: "AI接待中",
    last: "今晚阅读打卡题已发送",
    phone: "-",
    wecomId: "room_reading_g4",
    lifecycle: "提升认知",
    lifecycleStage: 2,
    tags: ["直播课用户", "愿意长期陪伴改善", "适合案例教育"],
    order: "12位学员参与打卡",
    matchedSkills: ["19元A类课-第一课", "19元A类课-课后"],
    sendMode: "自动发送",
    hosted: true,
    remark: "四年级阅读打卡群",
    addedAt: "2026-06-03 08:30",
    suggestion: "各位家长，今晚阅读打卡题已经发出，孩子完成后可以把答案发群里，老师会重点看长句理解和信息定位能力。",
    reason: "群运营提醒，低风险，适合自动发送。",
    messages: [
      { from: "customer", sender: "赵女士", text: "今天打卡题需要多长时间完成？", time: "18:05" },
      { from: "ai", sender: "李销售", text: "一般 15-20 分钟，重点看孩子能不能定位关键信息。", time: "18:06" }
    ],
    orders: [
      { id: "GROUP-G4", product: "四年级阅读打卡营", amount: "群运营", status: "进行中", paidAt: "-" }
    ]
  },
  {
    key: "c11",
    accountKey: "wecom-chen",
    type: "single",
    name: "曹爸爸",
    avatar: "曹",
    avatarImage: "./images/矩形 10.png",
    unread: 2,
    owner: "陈销售",
    intent: "低",
    status: "人工接管",
    last: "先看看资料，暂时不试听",
    phone: "131****7780",
    wecomId: "wm_cust_1108",
    lifecycle: "提升认知",
    lifecycleStage: 2,
    tags: ["沉默客户", "适合案例教育", "低意向"],
    order: "未报名",
    matchedSkills: ["19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: false,
    remark: "曹爸爸-观望客户",
    addedAt: "2026-06-09 12:18",
    suggestion: "曹爸爸，没问题。我先把三年级课程安排和试听说明发您，您可以先看看孩子是否适合，后面如果想测一下基础，我再帮您约试听。",
    reason: "客户暂不试听，应降低催促感，保留后续入口。",
    messages: [
      { from: "customer", text: "先看看资料，暂时不试听。", time: "12:18" },
      { from: "ai", text: "可以的，我先发您课程安排，您有问题随时问我。", time: "12:19" }
    ],
    orders: [
      { id: "NO-ORDER-C11", product: "课程资料", amount: "-", status: "资料已发", paidAt: "-" }
    ]
  },
  {
    key: "c12",
    accountKey: "wecom-zhou",
    type: "single",
    name: "罗妈妈",
    avatar: "罗",
    avatarImage: "./images/矩形 11.png",
    unread: 6,
    owner: "周销售",
    intent: "高",
    status: "AI接待中",
    last: "朋友推荐来的，想约个测评",
    phone: "189****3201",
    wecomId: "wm_cust_1201",
    lifecycle: "了解阶段",
    lifecycleStage: 0,
    tags: ["高价值客户", "测评解读意向", "高意向"],
    order: "测评课待预约",
    matchedSkills: ["19元A类课-课前", "19元A类课-第四课"],
    sendMode: "自动发送",
    hosted: true,
    remark: "罗妈妈-转介绍测评",
    addedAt: "2026-06-13 11:20",
    suggestion: "罗妈妈，欢迎您。转介绍来的家长我们会先安排一次英语基础测评，主要看孩子年级、词汇、阅读和听说情况。方便说下孩子几年级，以及平时英语大概是什么水平吗？",
    reason: "转介绍高意向线索，先确认年级和基础，再安排测评。",
    messages: [
      { from: "customer", text: "朋友推荐来的，想约个测评。", time: "11:20" },
      { from: "ai", text: "可以的，方便先说下孩子几年级和目前英语基础吗？", time: "11:21" }
    ],
    orders: [
      { id: "T-20260613-01", product: "英语基础测评课", amount: "免费测评", status: "待预约", paidAt: "-" }
    ]
  },
  {
    key: "c13",
    accountKey: "wecom-wu",
    type: "single",
    name: "彭爸爸",
    avatar: "彭",
    avatarImage: "./images/矩形 12.png",
    unread: 1,
    owner: "吴销售",
    intent: "中",
    status: "待确认发送",
    last: "周末班时间能不能固定？",
    phone: "150****6328",
    wecomId: "wm_cust_1308",
    lifecycle: "定义用户",
    lifecycleStage: 1,
    tags: ["需要家人商量", "父母教育理念不一致", "中意向"],
    order: "周末阅读班待排课",
    matchedSkills: ["19元A类课-第四课", "19元A类课-第一课"],
    sendMode: "人工确认",
    hosted: true,
    remark: "彭爸爸-周末班排课",
    addedAt: "2026-06-07 21:14",
    suggestion: "彭爸爸，周末班一般会固定时段上课。您方便的话我先帮您看周六上午和周日下午两个班的剩余名额，再确认哪个更适合孩子。",
    reason: "涉及班级名额和排课，需要人工确认。",
    messages: [
      { from: "customer", text: "周末班时间能不能固定？", time: "21:14" },
      { from: "ai", text: "一般是固定时段，我可以帮您查一下可选班级。", time: "21:15" }
    ],
    orders: [
      { id: "C-20260607-04", product: "四年级周末阅读提升班", amount: "¥4,280", status: "待排课", paidAt: "-" }
    ]
  },
  {
    key: "g3",
    accountKey: "wecom-lin",
    type: "group",
    name: "小升初暑假班家长群",
    avatar: "群",
    avatarImage: "./images/矩形 3.png",
    unread: 9,
    owner: "林销售",
    intent: "高",
    status: "AI接待中",
    last: "暑假班课表和入班测已同步",
    phone: "-",
    wecomId: "room_xsc_summer",
    lifecycle: "完单阶段",
    lifecycleStage: 4,
    tags: ["已报名未转化高客单", "家庭守护计划意向", "高价值客户"],
    order: "8位学员已报名",
    matchedSkills: ["19元A类课-第四课", "19元A类课-课后"],
    sendMode: "自动发送",
    hosted: true,
    remark: "小升初暑假班家长群",
    addedAt: "2026-06-06 17:30",
    suggestion: "各位家长，暑假班课表和入班测安排已经同步，入班测主要用于分层，不影响报名结果。完成后老师会给每位孩子一份学习建议。",
    reason: "已报名家长群通知，适合自动发送。",
    messages: [
      { from: "customer", sender: "孙爸爸", text: "入班测会不会影响分班？", time: "17:32" },
      { from: "ai", sender: "林销售", text: "会用于更准确分层，帮助孩子匹配合适难度，不影响报名结果。", time: "17:33" }
    ],
    orders: [
      { id: "GROUP-XSC", product: "小升初暑假衔接班", amount: "8位已报名", status: "已成团", paidAt: "2026-06-12" }
    ]
  }
];

const youthConversationOverrides = {
  g1: {
    name: "初中家长沟通群",
    last: "今晚会发家庭沟通自测表和直播提醒",
    lifecycle: "提升认知",
    tags: ["直播课用户", "父母成长营意向", "适合邀约直播课"],
    order: "3位家长已预约直播课",
    remark: "初中家长沟通群",
    suggestion: "各位家长晚上好，今晚 19:30 是青少年沟通直播课，主要讲孩子拒绝沟通、拖延作业和情绪爆发时，家长如何先降低冲突再推动改变。课后我会把家庭沟通自测表发给大家，方便判断下一步适合测评还是咨询。",
    reason: "直播课前集中提醒，适合用顾问口吻说明直播目标和后续测评安排。",
    messages: [
      { from: "system", text: "你已同步初中家长沟通群，现在可以开始群聊。", time: "10:18" },
      { from: "customer", sender: "王女士", text: "今晚主要讲厌学吗？孩子初一，最近一说作业就发火。", time: "10:20" },
      { from: "ai", sender: "陈销售", text: "会讲到厌学和亲子冲突。今晚重点是先帮家长判断孩子是学习压力、关系对抗，还是情绪状态影响。", time: "10:21" },
      { from: "customer", sender: "刘先生", text: "听完后能不能给一份具体建议？", time: "10:23" }
    ],
    orders: [{ id: "GROUP-DEMO", product: "青少年沟通直播课", amount: "免费直播", status: "3位家长已预约", paidAt: "-" }]
  },
  c1: {
    name: "张妈妈",
    last: "孩子初二，最近总说不想去学校，怎么办？",
    lifecycle: "定义用户",
    tags: ["厌学", "家长高焦虑", "高意向"],
    order: "家庭情况评估待确认",
    remark: "张妈妈-初二厌学倾向",
    suggestion: "张妈妈，孩子反复说不想去学校，先别急着讲道理或强压。建议先确认三个信息：从什么时候开始、是否和同学老师冲突有关、睡眠和情绪有没有明显变化。我可以先发您一份家庭情况评估表，顾问看完后再判断适合家庭沟通方案还是一对一咨询。",
    reason: "家长明确描述厌学信号，先收集关键背景并引导评估，不直接承诺效果。",
    messages: [
      { from: "system", text: "你已添加了张妈妈，现在可以开始聊天了。", time: "09:58" },
      { from: "customer", text: "孩子初二，最近早上起床就说肚子疼，不想去学校。", time: "10:02" },
      { from: "ai", text: "先理解一下，这种情况大概持续多久了？最近学校、人际关系或考试压力有没有明显变化？", time: "10:03" },
      { from: "customer", text: "差不多两周了，一提学习就烦，说我们只看成绩。", time: "10:06" },
      { from: "customer", text: "孩子初二，最近总说不想去学校，怎么办？", time: "10:20" }
    ],
    orders: [{ id: "C-20260612-01", product: "青少年家庭情况评估", amount: "¥398", status: "待确认", paidAt: "-" }]
  },
  c2: {
    name: "王妈妈",
    last: "孩子天天刷手机到半夜，能做干预吗？",
    lifecycle: "了解阶段",
    tags: ["手机成瘾", "家长高控制", "适合推测评"],
    order: "未报名",
    remark: "王妈妈-手机使用失控",
    suggestion: "王妈妈，可以先做一次手机使用和家庭互动评估。我们会看孩子每天使用时长、是否影响睡眠上学、家长目前怎么管，以及孩子对规则的接受度，再给出分阶段干预建议。",
    reason: "家长咨询手机问题，适合先评估行为和家庭规则，不使用诊断口径。",
    messages: [
      { from: "customer", text: "孩子天天刷手机到半夜，能做干预吗？", time: "10:20" },
      { from: "ai", text: "可以先评估使用时长、睡眠影响和家庭规则执行情况，再判断适合的干预节奏。", time: "10:20" }
    ],
    orders: [{ id: "NO-ORDER", product: "手机使用评估", amount: "免费测评", status: "待预约", paidAt: "-" }]
  },
  c3: {
    name: "刘爸爸",
    last: "如果今天报名，家庭守护计划还有名额吗？",
    lifecycle: "催单阶段",
    tags: ["叛逆对抗", "关注孩子是否配合", "高意向"],
    order: "家庭守护计划报价已发送",
    remark: "刘爸爸-亲子冲突干预",
    suggestion: "刘爸爸，家庭守护计划本周还可以安排 2 个家庭进入服务。今天确认的话，我先帮您锁定顾问初访时间，再让老师根据孩子抗拒沟通和作息情况做初步方案。涉及名额和付款，我建议由真人顾问确认后发您报名链接。",
    reason: "家长询问名额和报名，已进入催单阶段，涉及付款和服务承诺，建议人工确认后发送。",
    messages: [
      { from: "customer", text: "昨天跟老师聊完，感觉孩子的问题确实不能只靠骂。", time: "09:30" },
      { from: "ai", text: "是的，老师判断目前重点是先降低正面冲突，再建立一套孩子愿意参与的家庭规则。", time: "09:31" },
      { from: "customer", text: "如果今天报名，家庭守护计划还有名额吗？", time: "10:20" }
    ],
    orders: [{ id: "O-20260610-18", product: "家庭守护计划", amount: "¥5,680", status: "待报名付款", paidAt: "-" }]
  },
  c4: {
    name: "赵妈妈",
    last: "孩子一写作业就哭，说自己很笨，这种能咨询吗？",
    lifecycle: "了解阶段",
    tags: ["焦虑倾向", "家长高焦虑", "测评用户"],
    order: "情绪状态初筛待预约",
    remark: "赵妈妈-作业焦虑",
    suggestion: "赵妈妈，这种情况可以先做情绪和学习压力初筛，重点看孩子是害怕犯错、任务太难，还是亲子沟通压力太大。先别急着纠正孩子说法，可以先记录出现频率和触发场景。",
    reason: "家长描述孩子自我否定和哭泣，适合先初筛并提醒降低压力。",
    messages: [
      { from: "customer", text: "孩子一写作业就哭，说自己很笨，这种能咨询吗？", time: "09:18" },
      { from: "ai", text: "可以先做情绪和学习压力初筛，看看触发点主要在作业难度还是亲子沟通。", time: "09:19" }
    ],
    orders: [{ id: "T-20260612-02", product: "青少年情绪状态初筛", amount: "免费测评", status: "待预约", paidAt: "-" }]
  },
  c5: {
    name: "孙爸爸",
    last: "孩子已经请假一周了，还能先做线上咨询吗？",
    lifecycle: "催单阶段",
    tags: ["休学", "同行者计划意向", "高意向"],
    order: "同行者计划待报名",
    remark: "孙爸爸-短期拒学",
    suggestion: "孙爸爸，可以先做线上初访。孩子已经请假一周，建议先确认安全、睡眠、情绪和学校压力来源，再设计返校节奏。今天我可以先帮您预约顾问初访时间，后续是否进入同行者计划由老师评估后再定。",
    reason: "家长描述拒学并询问咨询安排，优先初访评估，不直接承诺返校。",
    messages: [
      { from: "customer", text: "孩子初三，这周一直不肯去学校。", time: "20:08" },
      { from: "ai", text: "先别急着强推返校，我们需要先了解孩子不去学校背后的压力点和当前安全状态。", time: "20:09" },
      { from: "customer", text: "孩子已经请假一周了，还能先做线上咨询吗？", time: "20:12" }
    ],
    orders: [{ id: "O-20260611-06", product: "同行者计划初访", amount: "¥6,280", status: "待报名付款", paidAt: "-" }]
  },
  c6: {
    name: "陈妈妈",
    last: "孩子晚上睡不着，白天没精神，会影响学习吗？",
    lifecycle: "了解阶段",
    tags: ["睡眠问题", "尚未意识到问题本质", "新线索"],
    order: "未报名",
    remark: "陈妈妈-睡眠与学习状态",
    suggestion: "陈妈妈，会影响。睡眠不足会让孩子更难集中、情绪更容易爆、学习效率也会下降。我们可以先做一次睡眠和压力情况梳理，看看是作息习惯、学习压力还是情绪困扰导致。",
    reason: "家长从睡眠切入，适合解释影响并引导评估。",
    messages: [
      { from: "customer", text: "孩子晚上睡不着，白天没精神，会影响学习吗？", time: "09:12" },
      { from: "ai", text: "会影响专注和情绪稳定，建议先梳理睡眠、压力和作息情况。", time: "09:13" }
    ],
    orders: [{ id: "NO-ORDER-C6", product: "睡眠与压力评估", amount: "免费测评", status: "待预约", paidAt: "-" }]
  },
  "li-demo-1": {
    name: "许妈妈",
    last: "今晚能约老师聊一下吗？孩子放学后有时间",
    tags: ["体验课用户", "适合邀约专家连麦", "高意向"],
    order: "专家初访待确认",
    remark: "许妈妈-今晚初访",
    suggestion: "许妈妈，今晚可以约老师做一次初访。我先帮您看 19:00 和 20:00 两个时间段是否还有空档，确认后把连麦链接和需要提前填写的家庭情况表发您。",
    reason: "家长主动约初访，需确认老师时段后发送。",
    messages: [
      { from: "customer", text: "今晚能约老师聊一下吗？孩子放学后有时间。", time: "08:42" },
      { from: "ai", text: "可以的，我先帮您确认今晚老师可约时间段。", time: "08:43" }
    ],
    orders: [{ id: "T-LI-001", product: "青少年问题专家初访", amount: "免费初访", status: "待确认", paidAt: "-" }]
  },
  "li-demo-2": {
    name: "郭爸爸",
    last: "孩子总拖延作业，说了也不动，有办法吗？",
    tags: ["学习动力弱", "需要案例验证", "中意向"],
    order: "学习动力评估待推荐",
    remark: "郭爸爸-作业拖延",
    suggestion: "郭爸爸，作业拖延通常要看是任务太难、缺少成就感，还是孩子用拖延和家长对抗。建议先做学习动力评估，再给您一个家庭执行建议。",
    reason: "家长明确作业拖延痛点，适合追问原因并推荐测评。",
    messages: [
      { from: "customer", text: "孩子总拖延作业，说了也不动，有办法吗？", time: "18:16" },
      { from: "ai", text: "可以先看拖延背后是任务难、动力弱，还是亲子对抗在起作用。", time: "18:17" }
    ],
    orders: [{ id: "C-LI-002", product: "学习动力评估", amount: "¥268", status: "待推荐", paidAt: "-" }]
  },
  "li-demo-3": {
    name: "邓妈妈",
    last: "孩子成绩从班级前十掉到中游，情绪也低落",
    tags: ["厌学", "认可专业咨询", "高意向"],
    order: "学习压力测评待预约",
    remark: "邓妈妈-成绩下降与情绪低落",
    suggestion: "邓妈妈，成绩下降叠加情绪低落，需要先看最近是否有考试、人际或家庭压力变化。我建议先约一次学习压力测评，老师会结合孩子状态和家长反馈给出下一步方案。",
    reason: "家长描述成绩和情绪双重变化，适合引导测评。",
    messages: [
      { from: "customer", text: "孩子成绩从班级前十掉到中游，情绪也低落。", time: "10:18" },
      { from: "ai", text: "这种情况建议先看压力来源和情绪变化，再决定从学习还是家庭沟通切入。", time: "10:19" }
    ],
    orders: [{ id: "T-LI-003", product: "学习压力测评", amount: "免费测评", status: "待预约", paidAt: "-" }]
  },
  "li-demo-4": {
    name: "潘妈妈",
    last: "费用有点超预算，可以先做短期陪跑吗？",
    tags: ["价格敏感", "适合转人工深聊", "中意向"],
    order: "短期陪跑方案待确认",
    remark: "潘妈妈-价格异议",
    suggestion: "潘妈妈，可以先从短期陪跑开始，重点解决当前最影响家庭关系的一个问题，比如作业冲突或手机规则。我们先确认 4 周阶段目标，孩子和家长适应后再决定是否升级长期方案。",
    reason: "涉及价格和服务方案，应人工确认后发送。",
    messages: [
      { from: "customer", text: "费用有点超预算，可以先做短期陪跑吗？", time: "14:26" },
      { from: "ai", text: "可以先做阶段陪跑，我帮您看下适合的服务方案。", time: "14:27" }
    ],
    orders: [{ id: "O-LI-004", product: "4周家庭沟通陪跑", amount: "¥2,480", status: "待确认", paidAt: "-" }]
  },
  "li-demo-5": {
    name: "谢爸爸",
    last: "我先和孩子妈妈商量一下",
    tags: ["需要家人商量", "暂不强销售", "低意向"],
    order: "未报名",
    remark: "谢爸爸-家庭决策",
    suggestion: "谢爸爸，没问题。您可以先和孩子妈妈沟通一下，我把孩子情况摘要、老师初步建议和服务路径整理给您，方便家里一起判断是否适合继续做评估。",
    reason: "客户需要家庭决策，降低压迫感并提供材料。",
    messages: [
      { from: "customer", text: "我先和孩子妈妈商量一下。", time: "20:32" },
      { from: "ai", text: "可以的，我把初步建议和服务路径整理给您，方便一起判断。", time: "20:33" }
    ],
    orders: [{ id: "NO-ORDER-LI-005", product: "家庭沟通建议资料", amount: "-", status: "待跟进", paidAt: "-" }]
  },
  "li-demo-6": {
    name: "蒋妈妈",
    last: "报名链接发我吧，先约周六初访",
    tags: ["父母成长营意向", "关注效果保障", "高意向"],
    order: "周六专家初访待付款",
    remark: "蒋妈妈-周六初访报名",
    suggestion: "蒋妈妈，好的。我先帮您锁定周六初访名额，报名链接发您后按页面提示填写家庭信息并完成付款即可。付款后我会同步老师安排和初访前准备。",
    reason: "客户要求报名链接，必须人工确认后发送。",
    messages: [
      { from: "customer", text: "报名链接发我吧，先约周六初访。", time: "11:05" },
      { from: "ai", text: "好的，我先帮您确认周六老师初访名额。", time: "11:06" }
    ],
    orders: [{ id: "O-LI-006", product: "周六专家初访", amount: "¥398", status: "待付款", paidAt: "-" }]
  },
  "li-demo-7": {
    name: "袁妈妈",
    last: "家庭守护计划和一对一咨询有什么区别？",
    tags: ["需要专家背书", "关注隐私安全", "中意向"],
    order: "服务方案待选择",
    remark: "袁妈妈-服务对比",
    suggestion: "袁妈妈，一对一咨询更聚焦孩子或家长单次议题，家庭守护计划会包含评估、阶段目标、家长陪跑和复盘，更适合问题已经影响上学、作息或亲子关系的家庭。建议先初访后再选。",
    reason: "家长对服务差异有疑问，适合做价值解释。",
    messages: [
      { from: "customer", text: "家庭守护计划和一对一咨询有什么区别？", time: "16:10" },
      { from: "ai", text: "一对一咨询偏单次议题，家庭守护计划会包含评估、陪跑和阶段复盘。", time: "16:11" }
    ],
    orders: [{ id: "C-LI-007", product: "咨询/家庭守护方案", amount: "-", status: "待选择", paidAt: "-" }]
  },
  "li-demo-8": {
    name: "梁爸爸",
    last: "孩子不愿意和我们说话，问什么都说没事",
    tags: ["社交困难", "孩子拒绝沟通", "适合先共情安抚"],
    order: "亲子沟通初访待预约",
    remark: "梁爸爸-孩子拒绝沟通",
    suggestion: "梁爸爸，孩子不愿意说话时，通常先不要密集追问。我们会先帮家长调整开场方式，再观察孩子是否愿意从低压力话题开始表达。",
    reason: "家长描述沟通关闭，适合先共情并引导初访。",
    messages: [
      { from: "customer", text: "孩子不愿意和我们说话，问什么都说没事。", time: "09:28" },
      { from: "ai", text: "先别密集追问，可以从低压力话题和稳定回应开始恢复沟通。", time: "09:29" }
    ],
    orders: [{ id: "T-LI-008", product: "亲子沟通初访", amount: "免费初访", status: "待预约", paidAt: "-" }]
  },
  "li-demo-9": {
    name: "李老师评估排期群",
    last: "本周家庭评估排期表已更新",
    tags: ["直播课用户", "适合邀约直播课", "新线索"],
    order: "本周 18 位家长待评估",
    remark: "李老师评估排期群",
    suggestion: "各位家长，本周家庭评估排期表已经更新。请确认可连麦时间，如需调整请直接在群里回复，我会帮大家同步老师档期。",
    reason: "群排期通知，适合自动发送。",
    messages: [
      { from: "customer", sender: "许妈妈", text: "周六上午还有老师时间吗？", time: "08:10" },
      { from: "ai", sender: "李销售", text: "我帮您确认下周六上午档期，稍后同步。", time: "08:11" }
    ],
    orders: [{ id: "GROUP-LI-009", product: "本周家庭评估排期", amount: "18 位待评估", status: "排期中", paidAt: "-" }]
  },
  "li-demo-10": {
    name: "夏妈妈",
    last: "孩子下周开学前还能先做几次沟通吗？",
    tags: ["家长高焦虑", "适合推测评", "高意向"],
    order: "开学适应陪跑待排期",
    remark: "夏妈妈-开学适应",
    suggestion: "夏妈妈，下周开学前可以安排 2-3 次短期沟通，重点看孩子返校压力、作息恢复和家长沟通方式。我先帮您确认老师这几天的可排期时间。",
    reason: "开学前短期排期涉及老师档期，需要人工确认。",
    messages: [
      { from: "customer", text: "孩子下周开学前还能先做几次沟通吗？", time: "12:05" },
      { from: "ai", text: "可以看老师档期，建议重点围绕返校压力和作息恢复。", time: "12:06" }
    ],
    orders: [{ id: "O-LI-010", product: "开学适应短期陪跑", amount: "¥1,280", status: "待排期", paidAt: "-" }]
  },
  c7: {
    name: "周妈妈",
    last: "初访完感觉有方向了，怎么报名？",
    tags: ["体验后未报名", "关注效果保障", "高意向"],
    order: "家庭守护计划待付款",
    remark: "周妈妈-初访后报名",
    suggestion: "周妈妈，孩子今天初访反馈比较清晰，老师建议先进入家庭守护计划，从亲子沟通和作息规则开始。报名流程我先帮您确认服务周期和可约时间，再发报名链接。",
    reason: "家长已经表达报名意向，涉及报名链接，建议人工确认。",
    messages: [
      { from: "customer", text: "初访完感觉有方向了，怎么报名？", time: "19:40" },
      { from: "ai", text: "我先帮您确认适合的服务周期和老师时间，再发报名方式。", time: "19:41" }
    ],
    orders: [{ id: "O-20260612-09", product: "家庭守护计划", amount: "¥3,980", status: "待付款", paidAt: "-" }]
  },
  c8: {
    name: "何爸爸",
    last: "你们是线上咨询还是线下咨询？",
    tags: ["新线索", "对心理咨询抵触", "低意向"],
    order: "未报名",
    remark: "何爸爸-市场渠道线索",
    suggestion: "何爸爸，我们支持线上咨询和线下服务两种形式，具体会看孩子问题类型、家庭所在城市和您方便的时间来匹配。孩子目前主要是学习动力、情绪状态，还是亲子沟通问题？",
    reason: "市场线索咨询服务形式，适合先解释并追问核心问题。",
    messages: [
      { from: "customer", text: "你们是线上咨询还是线下咨询？", time: "10:08" },
      { from: "ai", text: "两种都有，会根据孩子情况、城市和时间来匹配。", time: "10:09" }
    ],
    orders: [{ id: "NO-ORDER-C8", product: "服务形式咨询", amount: "-", status: "待留资", paidAt: "-" }]
  },
  c9: {
    name: "黄妈妈",
    last: "孩子总说活着没意思，我该怎么办？",
    tags: ["自伤风险", "家长高焦虑", "1V1心理咨询意向"],
    order: "高风险人工接管",
    remark: "黄妈妈-风险表达",
    suggestion: "黄妈妈，这类表达需要优先保证安全。请先确认孩子现在是否在您身边，身边是否有刀具、药物、窗台等风险物品；如果孩子已经有明确自伤行为或无法保证安全，请立即联系当地急救或带孩子去最近医院。这里我会同步真人顾问优先接管。",
    reason: "出现高风险表达，必须人工接管并提示即时安全处理，不做普通销售转化。",
    messages: [
      { from: "customer", text: "孩子总说活着没意思，我该怎么办？", time: "15:31" },
      { from: "ai", text: "先确保孩子当下安全，并尽快让真人顾问接管；如有立即风险，请联系急救或就近就医。", time: "15:32" }
    ],
    orders: [{ id: "C-20260610-05", product: "高风险个案人工接管", amount: "-", status: "立即处理", paidAt: "-" }]
  },
  c10: {
    name: "马妈妈",
    last: "老客户续报家庭守护计划有没有优惠？",
    tags: ["老客户复购", "家庭守护计划意向", "高意向"],
    order: "家庭守护计划续报待确认",
    remark: "马妈妈-老客户续报",
    suggestion: "马妈妈，老客户续报目前有续报权益。我先帮您确认孩子当前服务进展、剩余陪跑次数和适合衔接的下一阶段方案，再把续报方案发您确认。",
    reason: "涉及优惠权益和续报方案，建议人工确认后发送。",
    messages: [
      { from: "customer", text: "老客户续报家庭守护计划有没有优惠？", time: "18:24" },
      { from: "ai", text: "我先帮您查一下当前服务进展和适合衔接的方案，再给您发续报说明。", time: "18:25" }
    ],
    orders: [{ id: "R-20260609-03", product: "家庭守护计划续报", amount: "¥4,680", status: "待确认", paidAt: "-" }]
  },
  g2: {
    name: "亲子沟通打卡群",
    last: "今晚亲子沟通打卡任务已发送",
    tags: ["直播课用户", "愿意长期陪伴改善", "适合案例教育"],
    order: "12位家长参与打卡",
    remark: "亲子沟通打卡群",
    suggestion: "各位家长，今晚的亲子沟通打卡已经发出，完成后可以把孩子反应和自己的感受发群里，老师会重点看开场方式和冲突升级点。",
    reason: "群运营提醒，低风险，适合自动发送。",
    messages: [
      { from: "customer", sender: "赵女士", text: "今天打卡需要和孩子聊多久？", time: "18:05" },
      { from: "ai", sender: "李销售", text: "一般 10-15 分钟就可以，重点不是讲道理，而是观察孩子是否愿意继续回应。", time: "18:06" }
    ],
    orders: [{ id: "GROUP-G4", product: "亲子沟通打卡营", amount: "群运营", status: "进行中", paidAt: "-" }]
  },
  c11: {
    name: "曹爸爸",
    last: "先看看资料，暂时不约咨询",
    tags: ["沉默客户", "适合案例教育", "低意向"],
    order: "未报名",
    remark: "曹爸爸-观望客户",
    suggestion: "曹爸爸，没问题。我先把青少年问题常见类型和初访说明发您，您可以先看看是否匹配孩子情况。后面如果想进一步判断，我再帮您约老师。",
    reason: "客户暂不咨询，应降低催促感，保留后续入口。",
    messages: [
      { from: "customer", text: "先看看资料，暂时不约咨询。", time: "12:18" },
      { from: "ai", text: "可以的，我先发您初访说明，您有问题随时问我。", time: "12:19" }
    ],
    orders: [{ id: "NO-ORDER-C11", product: "青少年问题资料", amount: "-", status: "资料已发", paidAt: "-" }]
  },
  c12: {
    name: "罗妈妈",
    last: "朋友推荐来的，想约个评估",
    tags: ["高价值客户", "测评解读意向", "高意向"],
    order: "家庭评估待预约",
    remark: "罗妈妈-转介绍评估",
    suggestion: "罗妈妈，欢迎您。转介绍来的家长我们会先安排一次家庭情况评估，主要了解孩子年级、当前问题、持续时间和家长已经尝试过的方法。方便说下孩子几年级，以及目前最困扰您的是哪件事吗？",
    reason: "转介绍高意向线索，先确认年级和核心问题，再安排评估。",
    messages: [
      { from: "customer", text: "朋友推荐来的，想约个评估。", time: "11:20" },
      { from: "ai", text: "可以的，方便先说下孩子几年级，以及目前最困扰您的是哪件事吗？", time: "11:21" }
    ],
    orders: [{ id: "T-20260613-01", product: "家庭情况评估", amount: "免费评估", status: "待预约", paidAt: "-" }]
  },
  c13: {
    name: "彭爸爸",
    last: "周末咨询时间能不能固定？",
    tags: ["需要家人商量", "父母教育理念不一致", "中意向"],
    order: "周末咨询待排期",
    remark: "彭爸爸-周末咨询排期",
    suggestion: "彭爸爸，周末咨询一般可以固定时段。您方便的话我先帮您看周六上午和周日下午两个老师的剩余档期，再确认哪个更适合孩子和家长共同参与。",
    reason: "涉及老师档期和排期，需要人工确认。",
    messages: [
      { from: "customer", text: "周末咨询时间能不能固定？", time: "21:14" },
      { from: "ai", text: "一般可以固定时段，我可以帮您查一下可选老师档期。", time: "21:15" }
    ],
    orders: [{ id: "C-20260607-04", product: "周末家庭咨询", amount: "¥4,280", status: "待排期", paidAt: "-" }]
  },
  g3: {
    name: "同行者计划家长群",
    last: "本周陪跑安排和家庭任务已同步",
    tags: ["已报名未转化高客单", "家庭守护计划意向", "高价值客户"],
    order: "8位家庭已报名",
    remark: "同行者计划家长群",
    suggestion: "各位家长，本周陪跑安排和家庭任务已经同步。任务主要用于观察孩子作息、沟通和学习启动情况，不做公开比较。完成后老师会给每个家庭单独反馈。",
    reason: "已报名家长群通知，适合自动发送。",
    messages: [
      { from: "customer", sender: "孙爸爸", text: "家庭任务会不会给孩子压力？", time: "17:32" },
      { from: "ai", sender: "林销售", text: "不会公开比较，任务是帮助老师观察家庭互动和孩子状态，后续会单独反馈。", time: "17:33" }
    ],
    orders: [{ id: "GROUP-XSC", product: "同行者计划", amount: "8位已报名", status: "已成团", paidAt: "2026-06-12" }]
  }
};

export const conversations = rawConversations.map((item) => ({
  ...item,
  ...(youthConversationOverrides[item.key] || {})
}));

export const lifecycleStages = [
  { title: "了解阶段", desc: "初步沟通，了解孩子年级、基础和家长期望。", skills: ["19元A类课-课前", "19元A类课-第一课"] },
  { title: "定义用户", desc: "明确孩子的主要学习问题和课程诉求。", skills: ["19元A类课-课前", "19元A类课-课后"] },
  { title: "提升认知", desc: "结合测评或试听反馈，说明课程价值。", skills: ["19元A类课-第一课"] },
  { title: "催单阶段", desc: "处理价格、名额、时间和报名顾虑。", skills: ["19元A类课-第一课", "19元A类课-第四课"] },
  { title: "完单阶段", desc: "家长已完成报名。", skills: ["19元A类课-第四课", "19元A类课-课后"] }
];

export const customerServiceStages = [
  "A类课前",
  "A类第一节课",
  "A类第二节课",
  "A类第三节课",
  "A类第四节课",
  "A类第五节课",
  "A类课后"
];
