export const insightRows = [
  {
    key: "insight-1",
    name: "2026-08-21 用户洞察日报",
    task: "用户洞察日报",
    audience: "当前服务用户 / 体验课转化阶段",
    total: 50,
    focus: 12,
    type: "用户洞察日报",
    generatedAt: "2026-08-21 09:30",
    status: "待处理",
    conclusion: "本次共分析 50 名体验课用户，其中 12 名用户表现出较强转化意愿，主要集中在“完整看课超过30分钟”“主动咨询正价课”“表达孩子问题紧迫”三类行为。建议销售在 24 小时内优先人工跟进高意向用户，AI 继续对观望用户做价值引导。",
    metrics: [
      { label: "覆盖用户", value: 50, suffix: "人" },
      { label: "高意向用户", value: 12, suffix: "人" },
      { label: "风险关注用户", value: 5, suffix: "人" },
      { label: "建议人工跟进", value: 14, suffix: "人" },
      { label: "建议AI继续培育", value: 26, suffix: "人" },
      { label: "已生成定时任务", value: 31, suffix: "条" }
    ],
    segments: [
      { name: "高意向用户", count: 12, percent: "24%", feature: "看课超过30分钟，主动咨询价格、名额或后续方案", basis: "会话命中“怎么报名”“价格多少”“还有名额吗”；标签命中高意向、体验后未报名、关注效果保障。", action: "销售优先人工跟进，围绕体验课反馈确认班型和报名顾虑。", handoff: "分配给销售人工跟进，写入用户侧边栏销售策略，并生成明早二次触达任务。", color: "red" },
      { name: "观望培育用户", count: 26, percent: "52%", feature: "完成部分课程，有孩子问题描述，但尚未明确购买意愿", basis: "看课时长 10-30 分钟，表达孩子问题但没有咨询价格或报名路径。", action: "由AI继续发送案例、课程价值和家长课片段，降低决策压力。", handoff: "加入观望培育人群，可后续进入用户群发任务。", color: "orange" },
      { name: "风险关注用户", count: 5, percent: "10%", feature: "亲子冲突高、孩子状态风险、家长情绪波动明显", basis: "标签命中亲子冲突高、孩子状态风险、家长高焦虑，且会话中出现明显无助表达。", action: "提醒人工谨慎介入，先共情和收集事实，不直接推动成交。", handoff: "进入人工重点关注清单，限制AI自动强触达。", color: "purple" }
    ],
    actionResults: [
      { key: "result-1", item: "AI标签", count: "38个", target: "客户标签", review: "部分需要" },
      { key: "result-2", item: "个人销售策略", count: "12条", target: "客户档案-销售策略", review: "不需要" },
      { key: "result-3", item: "个性化提示词", count: "12条", target: "会话智能体上下文", review: "需要审核" },
      { key: "result-4", item: "定时任务", count: "31条", target: "流程阶段定时任务", review: "需要确认" }
    ],
    customers: [
      { key: "c1", name: "张妈妈", level: "A", tags: ["高意向（AI）", "体验后未报名", "关注效果保障"], reason: "看课52分钟，主动询问班型，已购买398但未确认正价课", action: "今晚发送体验课复盘，明早人工确认班型", status: "待跟进" },
      { key: "li-demo-6", name: "周女士", level: "S", tags: ["高意向（AI）", "待付款", "需要家人商量"], reason: "看课74分钟，已进入待付款状态，但最近一次回复提到需要和家人确认", action: "销售今天 18:00 前人工跟进，重点处理决策人异议", status: "处理中" },
      { key: "li-demo-5", name: "郑妈妈", level: "C", tags: ["风险关注（AI）", "亲子冲突高", "已删除企微"], reason: "看课不足10分钟且已删除企微，亲子冲突高，不适合继续自动触达", action: "停止AI触达，转人工评估是否通过其他渠道温和联系", status: "待处理" }
    ]
  },
  {
    key: "insight-2",
    name: "2026-08-20 用户洞察日报",
    task: "用户洞察日报",
    audience: "当前服务用户 / 亲子冲突关注人群",
    total: 38,
    focus: 9,
    type: "用户洞察日报",
    generatedAt: "2026-08-20 18:00",
    status: "已处理",
    conclusion: "本周高冲突用户主要集中在休学、手机成瘾和拒绝沟通场景。9 名用户需要人工重点关注，其中 3 名用户不建议继续使用强转化话术，应先进入家长情绪承接和问题澄清流程。",
    metrics: [
      { label: "覆盖用户", value: 38, suffix: "人" },
      { label: "需要人工介入", value: 9, suffix: "人" },
      { label: "适合课程培育", value: 18, suffix: "人" },
      { label: "低响应用户", value: 11, suffix: "人" },
      { label: "高风险提醒", value: 3, suffix: "条" },
      { label: "已写入策略", value: 9, suffix: "条" }
    ],
    segments: [
      { name: "需要人工介入", count: 9, percent: "24%", feature: "家长情绪强烈，孩子问题描述复杂，AI 不宜独立推进", basis: "多轮会话出现冲突升级、失控、无助等表达，且标签组允许AI写入风险预警标签。", action: "主管分配销售人工跟进，先做风险确认和服务边界说明。", handoff: "生成会话中心提醒，暂停自动催单类话术。", color: "red" },
      { name: "适合课程培育", count: 18, percent: "47%", feature: "家长认可问题存在，但仍在观望课程价值", basis: "家长开始接受心理因素，但对服务周期、孩子配合度仍有疑虑。", action: "推送家长课片段和同类案例，避免高频催单。", handoff: "进入AI培育流程，定期更新个人销售策略。", color: "blue" },
      { name: "低响应用户", count: 11, percent: "29%", feature: "近7天仅少量互动，未形成明确诉求", basis: "会话响应低、未完整看课、没有明确表达报名或咨询动作。", action: "降低触达频率，等待课程节点或直播活动再唤醒。", handoff: "加入低响应观察人群。", color: "default" }
    ],
    actionResults: [
      { key: "result-1", item: "AI标签", count: "21个", target: "客户标签", review: "高风险需确认" },
      { key: "result-2", item: "个人销售策略", count: "9条", target: "客户档案-销售策略", review: "不需要" },
      { key: "result-3", item: "人工提醒", count: "9条", target: "会话中心提醒", review: "需要处理" },
      { key: "result-4", item: "触达限制", count: "3条", target: "会话智能体上下文", review: "需要审核" }
    ],
    customers: [
      { key: "risk-1", name: "李女士", level: "B", tags: ["亲子冲突高（AI）", "孩子拒绝沟通", "家长高焦虑"], reason: "连续三次提到孩子不沟通和家庭冲突升级", action: "人工先确认安全边界，再邀请参加家长沟通课", status: "待处理" },
      { key: "risk-2", name: "陈爸爸", level: "B", tags: ["手机成瘾（AI）", "父母教育理念不一致"], reason: "父母对处理方式分歧明显，孩子手机使用问题反复出现", action: "发送父母共识建立内容，不直接推正价课", status: "已跟进" }
    ]
  },
  {
    key: "insight-3",
    name: "2026-08-19 用户洞察日报",
    task: "用户洞察日报",
    audience: "当前服务用户 / 体验后未报名人群",
    total: 86,
    focus: 21,
    type: "用户洞察日报",
    generatedAt: "2026-08-19 20:10",
    status: "待处理",
    conclusion: "体验后未报名用户主要分为价格顾虑、等待家人决策、未理解课程价值三类。21 名用户仍有转化机会，其中已完整看课且表达认可的用户应优先进入人工跟进。",
    metrics: [
      { label: "覆盖用户", value: 86, suffix: "人" },
      { label: "仍有机会", value: 21, suffix: "人" },
      { label: "价格顾虑", value: 18, suffix: "人" },
      { label: "等待决策", value: 21, suffix: "人" },
      { label: "价值未建立", value: 31, suffix: "人" },
      { label: "建议群发", value: 39, suffix: "人" }
    ],
    segments: [
      { name: "价格顾虑用户", count: 18, percent: "21%", feature: "认可课程但反复询价或询问优惠", basis: "会话中多次出现价格、优惠、少报课时等表达。", action: "销售用课程规划和服务价值解释价格，不直接降价。", handoff: "生成价值解释话术和人工跟进任务。", color: "orange" },
      { name: "等待决策用户", count: 21, percent: "24%", feature: "需要和家人商量，或等待孩子反馈", basis: "会话表达“商量一下”“问问孩子”“晚点决定”，未明确拒绝。", action: "生成二次跟进任务，补充孩子课堂反馈和家长决策材料。", handoff: "归入等待决策人群，后续可发送体验课复盘材料。", color: "blue" },
      { name: "价值未建立用户", count: 31, percent: "36%", feature: "看课少、问题描述浅、对服务理解不足", basis: "看课时长不足10分钟或会话缺少明确痛点。", action: "AI继续培育，不进入高频人工销售跟进。", handoff: "进入长期培育池，等待直播或课程节点唤醒。", color: "default" }
    ],
    actionResults: [
      { key: "result-1", item: "AI标签", count: "64个", target: "客户标签", review: "部分需要" },
      { key: "result-2", item: "销售策略", count: "21条", target: "客户档案-销售策略", review: "不需要" },
      { key: "result-3", item: "群发人群", count: "39人", target: "用户群发草稿", review: "需要确认" },
      { key: "result-4", item: "定时任务", count: "46条", target: "流程阶段定时任务", review: "需要确认" }
    ],
    customers: [
      { key: "review-1", name: "王妈妈", level: "A", tags: ["体验后未报名", "关注效果保障", "需要案例验证"], reason: "体验课后认可老师，但担心孩子是否能坚持", action: "发送同类孩子变化案例，约人工复盘", status: "待跟进" },
      { key: "review-2", name: "赵女士", level: "B", tags: ["价格敏感", "需要家人商量"], reason: "反复询问优惠和课时组合，尚未明确拒绝", action: "销售解释服务内容和分阶段方案", status: "待处理" }
    ]
  }
];

export const strategyEvolutionRecords = [
  {
    key: "evo-1",
    name: "价格异议三步化解法",
    category: "优化规则",
    agentName: "19元A类体验课转化智能体",
    stage: "催单阶段",
    status: "待审核",
    generatedAt: "2026-09-14 09:30",
    sampleCount: 328,
    winCount: 42,
    lossCount: 118,
    projectedLift: "+32%",
    summary: "针对客户表达‘太贵/超出预算’时，严禁过早直接发大额优惠券，改为‘共情不易 + 每天拆解几块钱 + 制造名额紧迫感’三步推进。",
    beforeRule: {
      title: "原执行策略（掉单组高频模式）",
      diagnosis: "客户一旦提到价格高，AI 直接回复课程原价高，并立即抛出 500 元限时大额优惠券。导致客户产生‘水分很大、还可再砍’的防备心理，直接推券后 24 小时已读不回率高达 68.4%。",
      promptSnippet: `// 原Prompt规则 (Before)
当用户提到学费贵、没预算时：
1. 解释我们的正价课包含名师1对1定制辅导，原价 3980 元物有所值；
2. 立即发送 500 元体验课专属优惠券链接：“张妈妈，现在报名可立减500元，您可以点此链接领取”；
3. 催促用户在当天 24:00 前完成支付。`
    },
    afterRule: {
      title: "AI 自主进化销冠策略（成单组萃取模式）",
      highlights: "严禁直接降价推券！先通过共情解除心理防备，再将 3980 元学费拆解到孩子 90 天备考每天仅 44 元（一顿健康早餐钱），最后以体验课优秀学员限时奖学金（仅剩2席）促单。",
      promptSnippet: `// 建议更新Prompt规则 (After) - 胜率预估 +32%
当用户表达价格高/预算顾虑时，严格执行三步化解法则：
1. 【第一步·共情接纳】：认可家长赚钱辛苦与家庭开销压力，消除对立情绪：“张妈妈太理解您了，现在养育孩子各项开销确实不小，每一分钱都要花在刀刃上。”
2. 【第二步·重塑价值比】：将学费拆解为长期教育回报与每天边际成本：“咱们整个90天陪伴计划算下来，每天大概就 40 块钱，相当于少在外面喝两杯咖啡，却能帮小明彻底把初二关键期的学习主动性抓起来，比后续高昂的单科一对一补课省下几万元。”
3. 【第三步·稀缺托底促成】：以教研组名额机制促成小步决策：“因为小明这次4节体验课全勤且作业优秀，老师特意向教学主管申请了本期仅有的2个‘青苗激励名额’，今晚我先帮您把名额锁住好吗？”`
    },
    evidence: {
      winCase: {
        customer: "张妈妈 (初二·已成单¥3980)",
        conversationKey: "c1",
        accountKey: "wecom-li",
        description: "销冠企微采用三步化解，成功促成张妈妈全款报名",
        dialogue: [
          { sender: "customer", text: "老师，课程确实挺好，但是将近4000块钱对我们普通家庭来说还是有点贵了…" },
          { sender: "ai", text: "张妈妈太理解您了！现在的家庭开销确实很大，每一分钱花在孩子身上都要看到实在的效果。❤️" },
          { sender: "ai", text: "不过咱们算一笔账：整个90天系统辅导平均到每天大概就40多块钱，少下一次馆子，却能帮小明在初二关键期把抗拒学习的坏习惯改过来。要是到了初三再找机构一对一单科补习，动辄几千上万还治标不治本。" },
          { sender: "customer", text: "也是这么个道理…那你们能保证有效果吗？" },
          { sender: "ai", text: "小明这次4节体验课全勤，老师专门向主管申请了咱们这期仅剩2个的‘成长激励名额’，还有前两周不满意随时退的保障。今晚我先帮小明把这个名额锁住，您看可以吗？" },
          { sender: "customer", text: "行吧李老师，那你发我付款二维码，我先定下来！" }
        ]
      },
      lossCase: {
        customer: "刘女士 (初一·直接推券后流失)",
        conversationKey: "c2",
        accountKey: "wecom-chen",
        description: "老策略直接甩优惠券，客户感知廉价套路后彻底断联",
        dialogue: [
          { sender: "customer", text: "正价课将近四千太贵了，我们再考虑考虑吧。" },
          { sender: "ai", text: "刘女士，我们原价是3980元的，包含名师1对1定制。现在体验课学员立减500元，只要3480元！" },
          { sender: "ai", text: "优惠券链接：https://sabuddy.com/coupon/500，今天24点前有效，您赶紧领了付款吧。" },
          { sender: "customer", text: "（已读未回，后续24小时发3条催促消息均无响应）" }
        ]
      }
    }
  },
  {
    key: "evo-2",
    name: "“跟爸爸商量”转述三要点破局法",
    category: "优化规则",
    agentName: "19元A类体验课转化智能体",
    stage: "决策确认阶段",
    status: "待审核",
    generatedAt: "2026-09-14 09:30",
    sampleCount: 245,
    winCount: 36,
    lossCount: 92,
    projectedLift: "+28%",
    summary: "家长表达‘需要和老公/爸爸商量’时，不再被动等待，而是主动帮母亲梳理 3 条沟通要点并锁定今晚回访时间。",
    beforeRule: {
      title: "原执行策略（掉单组高频模式）",
      diagnosis: "AI 直接回复‘好的，您商量好了随时告诉我’，对话瞬间陷入被动终止。90%的家长脱离对话环境后不再主动联系。",
      promptSnippet: `// 原Prompt规则 (Before)
当用户说需要和家人/老公商量时：
1. 回复好的，表示理解；
2. 告知对方商量好了随时在微信上联系老师。`
    },
    afterRule: {
      title: "AI 自主进化销冠策略（成单组萃取模式）",
      highlights: "极力赞成父母共同决策，主动提供3点极简汇报要点（解决妈妈转述不清痛点），并约定今晚 21:30 回访锚点。",
      promptSnippet: `// 建议更新Prompt规则 (After) - 胜率预估 +28%
当用户表达需要与配偶/家人商量时：
1. 【肯定共同决策】：极大化赞扬父母同频关爱孩子：“特别支持您！教育孩子最怕父母步调不一致，爸爸的意见对小明特别重要。”
2. 【提供转述要点】：主动为妈妈减负，提供爸爸最关心的3个硬核指标（孩子课堂改善点、机构退费保障、每天仅占20分钟）；
3. 【锁定时间锚点】：约定具体时间：“今晚9点半爸爸应该到家了，您商量好了我随时在线，哪怕不报也没关系，我把老师给小明的课后评语发您带给爸爸看。”`
    },
    evidence: {
      winCase: {
        customer: "周女士 (初二·已成单¥3980)",
        conversationKey: "li-demo-6",
        accountKey: "wecom-li",
        description: "为母亲提供3条硬核论据，晚上成功二次破冰成单",
        dialogue: [
          { sender: "customer", text: "李老师，课程很认可，但我得晚上跟孩子爸爸商量一下再决定。" },
          { sender: "ai", text: "特别支持您周女士！孩子的教育大事确实需要爸爸妈妈达成共识。👨‍👩‍👦" },
          { sender: "ai", text: "爸爸平时可能工作忙没听体验课，您跟他沟通时，抓这3点爸爸最关心的就行：1.小明在课上第一次主动发言了；2.每天只花20分钟不占用周末刷题时间；3.前两周有不满意无条件退费兜底。" },
          { sender: "ai", text: "今晚9点半等爸爸忙完，我再给您发一份老师给小明的专门评语，您跟爸爸一起看看！" },
          { sender: "customer", text: "太感谢李老师了，你替我想得太周到了，我晚上就这么跟他说！" }
        ]
      },
      lossCase: {
        customer: "陈妈妈 (初一·被动等待后流失)",
        conversationKey: "c3",
        accountKey: "wecom-chen",
        description: "被动回复‘商量好叫我’，家长晚上未回复，第二天彻底失联",
        dialogue: [
          { sender: "customer", text: "我要跟孩子爸爸商量商量。" },
          { sender: "ai", text: "好的陈妈妈，那您跟爸爸商量好了随时叫我哈，我们都在的。" },
          { sender: "customer", text: "（无后续消息，断联已超72小时）" }
        ]
      }
    }
  },
  {
    key: "evo-3",
    name: "开课前15分钟专属克隆语音催到课",
    category: "新增策略",
    agentName: "A类课班主任带班智能体",
    stage: "体验课交付阶段",
    status: "待审核",
    generatedAt: "2026-09-14 09:30",
    sampleCount: 412,
    winCount: 88,
    lossCount: 142,
    projectedLift: "+35%",
    summary: "体验课开课前15分钟由纯文本催到课升级为自主发送12秒克隆语音条，大幅提高进房率与到课全勤率。",
    beforeRule: {
      title: "原执行策略（掉单组高频模式）",
      diagnosis: "开课前15分钟仅发送一条含房间号的长文本通知，家长群消息多容易折叠忽视，首课未到课率达 41.2%。",
      promptSnippet: `// 原Prompt规则 (Before)
开课前 15 分钟触发定时提醒：
发送文字：“【上课提醒】家长好，今晚19:30直播课即将开始，请提前下载客户端，房间号：889-210，点击链接进入。”`
    },
    afterRule: {
      title: "AI 自主进化销冠策略（成单组萃取模式）",
      highlights: "自主调用企微绑定音色，发送一段12秒真人语音提醒，亲切感极强，家长回复率提升超3倍。",
      promptSnippet: `// 建议新增Prompt规则 (After) - 到课率提升 +35%
在体验课第1课、第4课开课前15分钟：
1. 触发自适应语音合成模块，调用对应负责老师的音色；
2. 发送 10-15 秒真实语音条：“张妈妈晚上好～咱们今晚7点半的直播课马上就要开始了，我已经把小明的名字登在首屏互动席位上了，您和孩子准备好设备进房，老师在直播间等你们哦！”
3. 紧接着发一条带有快速进房卡片链接的短气泡。`
    },
    evidence: {
      winCase: {
        customer: "赵妈妈 (初一·到课率100%全勤)",
        conversationKey: "c4",
        accountKey: "wecom-lin",
        description: "听到老师专属语音后迅速进房，并在课后主动致谢",
        dialogue: [
          { sender: "ai", text: "🎙️ [语音消息 12秒] “赵妈妈晚上好呀，今晚第一节课马上开始了，我已经把小明的互动名额留好了，快带孩子进房间，老师等你们哦！”" },
          { sender: "ai", text: "点击快速进入直播间 🔗 https://live.sabuddy.com/room/101" },
          { sender: "customer", text: "刚忙完做饭差点忘了！听到李老师语音马上上线了，谢谢老师这么上心！" }
        ]
      },
      lossCase: {
        customer: "孙女士 (初二·长文本被淹没未到课)",
        conversationKey: "c5",
        accountKey: "wecom-zhou",
        description: "发冷冰冰的房间号文字，家长手机静音未查阅直接缺席",
        dialogue: [
          { sender: "ai", text: "【上课提醒】今晚19:30直播课即将开始，房间号889-210，请准时参加。" },
          { sender: "customer", text: "（次日早晨回复：哎呀昨天晚上在辅导孩子写作业，微信消息太多根本没看见，错过了…）" }
        ]
      }
    }
  },
  {
    key: "evo-4",
    name: "初二初三家长焦虑痛点共情先行",
    category: "优化规则",
    agentName: "19元A类体验课转化智能体",
    stage: "破冰建信阶段",
    status: "已生效",
    generatedAt: "2026-09-12 18:00",
    sampleCount: 380,
    winCount: 65,
    lossCount: 88,
    projectedLift: "+24%",
    summary: "加好友首日不再调查期末具体分数，先以‘初中阶段中考分水岭心理变化’为切入点建立同理心，已于上周全量生效。",
    beforeRule: {
      title: "历史已废弃策略",
      diagnosis: "一上来就盘问‘期末考了多少分、排多少名’，容易激发高焦虑家长的戒备甚至反感。",
      promptSnippet: `// 历史废弃规则
新客破冰第一轮：直接询问孩子上学期期末成绩和各单科薄弱项。`
    },
    afterRule: {
      title: "已生效策略（运行中）",
      highlights: "先肯定家长付出的不易，结合初中心理分水岭做专业疏导，再引导家长主动吐露学情。",
      promptSnippet: `// 当前生效规则 (In Production)
加好友第一轮：
1. 肯定家长责任感，建立专家顾问心智；
2. 探讨青春期心理沟通障碍，让家长感受到被理解；
3. 家长情绪平复后再顺势询问年级与主要困扰。`
    },
    evidence: {
      winCase: {
        customer: "王妈妈 (已成单)",
        conversationKey: "review-1",
        accountKey: "wecom-li",
        description: "共情先行让妈妈敞开心扉聊了近1小时，为后续成交奠定深厚信任",
        dialogue: [
          { sender: "ai", text: "王妈妈好，特别理解您初二这个阶段的操心，很多家长都跟我反映初二孩子突然叛逆、不愿沟通，其实这都是孩子心理进入独立期的正常信号…" },
          { sender: "customer", text: "李老师您太懂我了！家里爸爸不管，就我一个人天天盯着，真的快崩溃了…" }
        ]
      },
      lossCase: {
        customer: "郑妈妈 (直接问分数拉黑)",
        conversationKey: "li-demo-5",
        accountKey: "wecom-li",
        description: "直接盘问成绩，家长觉得是查户口的销售，直接删除了企微",
        dialogue: [
          { sender: "ai", text: "郑妈妈您好，孩子期末各科考了多少分？班级排名多少？" },
          { sender: "customer", text: "（提示：对方开启了朋友验证，已删除企微）" }
        ]
      }
    }
  }
];

export function buildInsightUserRows(insight, source, conversationPool = []) {
  const seedCustomers = insight.customers || [];
  const targetCount = source.count || seedCustomers.length || insight.focus || 0;
  return Array.from({ length: targetCount }, (_, index) => {
    const sourceCustomer = seedCustomers[index % Math.max(seedCustomers.length, 1)] || {};
    const conversation = conversationPool.find((item) => item.key === sourceCustomer.key || item.name === sourceCustomer.name) || conversationPool[index % conversationPool.length];
    return {
      key: `${source.key}-${index}`,
      name: sourceCustomer.name || conversation?.name || `客户${index + 1}`,
      level: sourceCustomer.level || (index % 5 === 0 ? "S" : index % 3 === 0 ? "A" : "B"),
      lifecycle: conversation?.lifecycle || "体验课跟进",
      tags: sourceCustomer.tags || ["高意向（AI）", "体验后未报名"],
      reason: sourceCustomer.reason || source.reason || "命中该指标对应的人群条件",
      action: sourceCustomer.action || source.action || "按策略洞察建议继续跟进",
      owner: conversation?.owner || "李销售",
      status: sourceCustomer.status || "待跟进",
      accountKey: conversation?.accountKey,
      conversationKey: conversation?.key
    };
  });
}
