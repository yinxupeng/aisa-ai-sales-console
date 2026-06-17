import React, { useEffect, useMemo, useState } from "react";
import {
  App as AntApp,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  Layout,
  List,
  Menu,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Upload
} from "antd";
import {
  AlertOutlined,
  AudioOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloudSyncOutlined,
  CommentOutlined,
  DashboardOutlined,
  DollarOutlined,
  EditOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PaperClipOutlined,
  PictureOutlined,
  PlusOutlined,
  QrcodeOutlined,
  SendOutlined,
  SmileOutlined,
  UploadOutlined,
  RobotOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WechatOutlined
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const companies = [
  { id: "company-1", name: "星河教育科技", industry: "教育", contact: "张总", phone: "13800008888", status: "启用", wecom: "已连接企微" },
  { id: "company-2", name: "云帆家装服务", industry: "家装", contact: "李总", phone: "13900009999", status: "启用", wecom: "未配置企微" },
  { id: "company-3", name: "青木SaaS软件", industry: "SaaS", contact: "王总", phone: "13700007777", status: "停用", wecom: "试用中" }
];

const agents = [
  {
    key: "a1",
    name: "市场",
    type: "线索获取",
    personaStyles: ["亲和型", "高转化型"],
    speechTones: ["自然", "细致"],
    serviceGoals: ["引导留资", "收集需求"],
    forbiddenActions: ["不能乱报价", "不能承诺效果", "不能泄露客户隐私"],
    roleDescription: "亲和、高转化的市场线索接待角色，语气自然细致，重点引导客户留资并收集初步需求。避免乱报价、承诺效果或泄露客户隐私。",
    uncertaintyHandling: "明确说明不确定，并转人工处理",
    allowFollowUp: true,
    allowUrgeOrder: false,
    allowSendFile: true,
    sales: 2,
    status: "启用"
  },
  {
    key: "a2",
    name: "销售",
    type: "课程转化",
    personaStyles: ["专业型", "顾问型", "高转化型"],
    speechTones: ["正式", "简洁"],
    serviceGoals: ["收集需求", "推荐产品", "促成下单"],
    forbiddenActions: ["不能乱报价", "不能承诺效果", "不能越权承诺交付"],
    roleDescription: "专业、顾问型的课程销售角色，语气正式简洁，围绕客户需求收集、课程推荐和促成下单展开。不能乱报价、承诺效果或越权承诺交付。",
    uncertaintyHandling: "先澄清问题，再基于已有信息回答",
    allowFollowUp: true,
    allowUrgeOrder: true,
    allowSendFile: true,
    sales: 1,
    status: "启用"
  },
  {
    key: "a3",
    name: "班主任",
    type: "课后服务",
    personaStyles: ["亲和型", "稳重型"],
    speechTones: ["热情", "细致"],
    serviceGoals: ["收集需求", "推荐产品"],
    forbiddenActions: ["不能承诺效果", "不能泄露客户隐私"],
    roleDescription: "亲和稳重的班主任服务角色，语气热情细致，负责课后服务、需求收集和合适课程推荐。不能承诺效果或泄露客户隐私。",
    uncertaintyHandling: "收集客户信息后提醒人工跟进",
    allowFollowUp: true,
    allowUrgeOrder: false,
    allowSendFile: false,
    sales: 0,
    status: "停用"
  }
];

const strategies = [
  {
    key: "s1",
    name: "获取学员信息",
    type: "数据查询",
    trigger: "家长进线 / 课程顾问查看学员",
    channel: "请求三方系统",
    input: "手机号、企微ID、学员ID",
    output: "年级、英语基础、试听记录、报名状态",
    agent: "小学英语课程顾问",
    calls: 128,
    status: "启用"
  },
  {
    key: "s2",
    name: "生成课程顾问话术",
    type: "消息生成",
    trigger: "家长提问 / 试听后高意向标签更新",
    channel: "AISA内部能力",
    input: "聊天记录、学员年级、英语基础、课程包、角色配置",
    output: "待发送话术、课程推荐理由、确认方式",
    agent: "小学英语课程顾问",
    calls: 86,
    status: "启用"
  },
  {
    key: "s3",
    name: "创建试听跟进",
    type: "定时任务",
    trigger: "家长约定时间 / 试听课结束回调",
    channel: "调用定时系统",
    input: "学员ID、跟进时间、跟进目标",
    output: "试听跟进任务ID、企微提醒状态",
    agent: "小学英语课程顾问",
    calls: 42,
    status: "启用"
  },
  {
    key: "s4",
    name: "更新学员标签",
    type: "企微动作",
    trigger: "阶段变化 / AI识别报名意向",
    channel: "句子通道",
    input: "企微ID、年级标签、意向标签、来源Skill",
    output: "标签写入结果、同步时间",
    agent: "小学英语课程顾问",
    calls: 37,
    status: "停用"
  }
];

const knowledge = [
  { key: "k1", title: "AI销售助手产品介绍", type: "产品知识", source: "文本内容", status: "启用", updated: "2026-05-30" },
  { key: "k2", title: "企微自动接待FAQ", type: "FAQ", source: "文本内容", status: "启用", updated: "2026-05-30" },
  { key: "k3", title: "价格与套餐说明", type: "政策规则", source: "知识文件", status: "停用", updated: "2026-05-28" }
];

const salesAccounts = [
  { key: "sale1", name: "李老师", role: "课程顾问", wecom: "li_sales", wecomId: "wm_8a92", channel: "句子通道已连接", hosted: true, sendMode: "人工确认", skills: ["获取学员信息", "生成课程顾问话术"], customerTotal: 32, hostedCustomers: 18, manualCustomers: 6, sentToday: 18, abnormal: 1, syncedAt: "14:20" },
  { key: "sale2", name: "陈老师", role: "班主任", wecom: "chen_sales", wecomId: "wm_6c31", channel: "句子通道已连接", hosted: true, sendMode: "自动发送", skills: ["创建试听跟进", "更新学员标签"], customerTotal: 24, hostedCustomers: 26, manualCustomers: 2, sentToday: 26, abnormal: 0, syncedAt: "14:18" },
  { key: "sale3", name: "周老师", role: "市场", wecom: "zhou_sales", wecomId: "wm_2f17", channel: "待绑定句子", hosted: false, sendMode: "人工确认", skills: ["生成课程顾问话术"], customerTotal: 16, hostedCustomers: 0, manualCustomers: 0, sentToday: 0, abnormal: 0, syncedAt: "未同步" }
];

const managedWecomAccounts = [
  { key: "wecom-li", label: "李老师企微", owner: "李销售", employee: "李老师", department: "销售部", account: "li_sales" },
  { key: "wecom-chen", label: "陈老师企微", owner: "陈销售", employee: "陈老师", department: "班主任组", account: "chen_sales" },
  { key: "wecom-zhou", label: "周老师企微", owner: "周销售", employee: "周老师", department: "市场部", account: "zhou_sales" },
  { key: "wecom-wu", label: "吴老师企微", owner: "吴销售", employee: "吴老师", department: "销售部", account: "wu_sales" },
  { key: "wecom-lin", label: "林老师企微", owner: "林销售", employee: "林老师", department: "销售部", account: "lin_sales" }
];

const loginAccounts = {
  "1": {
    key: "account-1",
    name: "平台管理员",
    role: "platform_admin",
    badge: "平台",
    company: "全部企业",
    account: "账号1",
    menuKeys: ["dashboard", "conversations", "strategy", "customers", "sales", "agent", "humanization", "knowledge", "settings"],
    wecomKeys: managedWecomAccounts.map((item) => item.key)
  },
  "2": {
    key: "account-2",
    name: "李老师",
    role: "employee",
    badge: "员",
    company: "星河教育科技",
    account: "账号2",
    menuKeys: ["dashboard", "conversations"],
    wecomKeys: managedWecomAccounts.map((item) => item.key)
  },
  "3": {
    key: "account-3",
    name: "企业管理员",
    role: "enterprise_admin",
    badge: "企",
    company: "星河教育科技",
    account: "账号3",
    menuKeys: ["dashboard", "conversations", "strategy", "customers", "sales", "agent", "humanization", "knowledge"],
    wecomKeys: ["wecom-li", "wecom-chen", "wecom-zhou", "wecom-wu", "wecom-lin"]
  }
};

const agentOptions = [
  ...agents.map((item) => ({ value: item.name, label: item.name })),
  { value: "小学英语课程顾问", label: "小学英语课程顾问" }
];

const intentLabelMap = {
  高: "高意向",
  中: "中意向",
  低: "低意向",
  底: "低意向"
};

const accounts = [
  { key: "u1", name: "平台运营", company: "平台供应商", role: "平台管理员", phone: "136****0001", status: "启用" },
  { key: "u2", name: "张三", company: "星河教育科技", role: "企业管理员", phone: "138****8888", status: "启用" },
  { key: "u3", name: "李四", company: "星河教育科技", role: "销售主管", phone: "139****9999", status: "启用" }
];

const conversations = [
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
    tags: ["三年级", "试听课", "自然拼读"],
    order: "3位学员已预约试听课",
    matchedSkills: ["生成课程顾问话术", "更新学员标签"],
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
    tags: ["三年级", "词汇薄弱", "高意向"],
    order: "自然拼读提升班待报价",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["四年级", "阅读理解", "待试听"],
    order: "未报名",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["五年级", "寒假班", "高意向"],
    order: "寒假冲刺班报价已发送",
    matchedSkills: ["获取学员信息", "通知真人销售"],
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
    tags: ["一年级", "启蒙英语", "待测评"],
    order: "启蒙测评课待预约",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["六年级", "小升初", "高意向"],
    order: "小升初暑假衔接班待报名",
    matchedSkills: ["创建试听跟进", "生成课程顾问话术"],
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
    tags: ["二年级", "英语启蒙", "新线索"],
    order: "未报名",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["三年级", "试听预约", "高意向"],
    order: "自然拼读试听课待确认",
    matchedSkills: ["创建试听跟进", "生成课程顾问话术"],
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
    tags: ["四年级", "单词记忆", "中意向"],
    order: "词汇方法课待推荐",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["五年级", "校内提分", "高意向"],
    order: "校内同步提升班待测评",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["价格异议", "课时方案", "中意向"],
    order: "阅读提升小课包待确认",
    matchedSkills: ["生成课程顾问话术"],
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
    tags: ["观望", "家庭决策", "低意向"],
    order: "未报名",
    matchedSkills: ["生成课程顾问话术"],
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
    tags: ["报名链接", "周六班", "高意向"],
    order: "周六自然拼读班待付款",
    matchedSkills: ["生成课程顾问话术", "更新学员标签"],
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
    tags: ["课程对比", "四年级", "中意向"],
    order: "课程方案待选择",
    matchedSkills: ["生成课程顾问话术"],
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
    tags: ["口语表达", "胆怯", "三年级"],
    order: "口语互动试听待预约",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["试听排课", "家长群", "群运营"],
    order: "本周 18 位家长待试听",
    matchedSkills: ["创建试听跟进", "更新学员标签"],
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
    tags: ["考前冲刺", "短期课包", "高意向"],
    order: "考前冲刺课待排课",
    matchedSkills: ["创建试听跟进", "生成课程顾问话术"],
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
    tags: ["三年级", "试听完成", "高意向"],
    order: "自然拼读班待付款",
    matchedSkills: ["创建试听跟进", "生成课程顾问话术"],
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
    tags: ["渠道线索", "课程形式", "待留资"],
    order: "未报名",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["五年级", "语法薄弱", "专项课"],
    order: "语法专项课待推荐",
    matchedSkills: ["获取学员信息", "生成课程顾问话术"],
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
    tags: ["老学员", "续报", "高意向"],
    order: "春季续报待确认",
    matchedSkills: ["创建试听跟进", "生成课程顾问话术"],
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
    tags: ["四年级", "阅读打卡", "群运营"],
    order: "12位学员参与打卡",
    matchedSkills: ["生成课程顾问话术", "更新学员标签"],
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
    tags: ["观望", "资料已发", "低意向"],
    order: "未报名",
    matchedSkills: ["生成课程顾问话术"],
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
    tags: ["转介绍", "测评预约", "高意向"],
    order: "测评课待预约",
    matchedSkills: ["获取学员信息", "创建试听跟进"],
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
    tags: ["四年级", "周末班", "时间敏感"],
    order: "周末阅读班待排课",
    matchedSkills: ["创建试听跟进", "生成课程顾问话术"],
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
    tags: ["小升初", "暑假班", "已报名"],
    order: "8位学员已报名",
    matchedSkills: ["创建试听跟进", "更新学员标签"],
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

const lifecycleStages = [
  { title: "了解阶段", desc: "初步沟通，了解孩子年级、基础和家长期望。", skills: ["获取学员信息", "生成课程顾问话术"] },
  { title: "定义用户", desc: "明确孩子的主要学习问题和课程诉求。", skills: ["获取学员信息", "更新学员标签"] },
  { title: "提升认知", desc: "结合测评或试听反馈，说明课程价值。", skills: ["生成课程顾问话术"] },
  { title: "催单阶段", desc: "处理价格、名额、时间和报名顾虑。", skills: ["生成课程顾问话术", "创建试听跟进"] },
  { title: "完单阶段", desc: "家长已完成报名。", skills: ["创建试听跟进", "更新学员标签"] }
];

const pendingMessages = [
  {
    key: "pm1",
    customer: "张先生",
    owner: "李销售",
    scenario: "询价下单",
    stage: "高意向待报价",
    skill: "生成待发送建议",
    risk: "中",
    humanScore: 92,
    humanSignals: ["引用客户20人团队信息", "不暴露AI身份", "价格问题转人工确认"],
    sendMode: "人工确认",
    due: "5分钟内",
    expected: "确认版本与优惠，引导预约真人顾问",
    message: "张先生您好，价格会根据账号数量、服务版本和服务周期确认。我先帮您按20人销售团队整理一版企业版方案，优惠部分可以让真人顾问结合当前活动继续确认。"
  },
  {
    key: "pm2",
    customer: "刘先生",
    owner: "李销售",
    scenario: "合同确认",
    stage: "合同确认",
    skill: "通知真人销售",
    risk: "高",
    humanScore: 88,
    humanSignals: ["合同文件不自动发送", "语气像销售协助确认", "触发真人销售接管"],
    sendMode: "人工确认",
    due: "立即处理",
    expected: "确认合同抬头，避免AI直接发送敏感文件",
    message: "刘先生，我先让真人顾问为您确认合同版本和公司抬头信息，确认无误后发给您，避免合同信息有误影响后续流程。"
  },
  {
    key: "pm3",
    customer: "王女士",
    owner: "陈销售",
    scenario: "功能咨询",
    stage: "需求了解",
    skill: "生成待发送建议",
    risk: "低",
    humanScore: 95,
    humanSignals: ["自然解释能力边界", "保留销售随时接管", "继续引导团队规模"],
    sendMode: "自动发送",
    due: "已自动发送",
    expected: "解释企微托管能力，继续收集团队规模",
    message: "支持的。AISA 通过句子通道接入企业微信，可以先由AI生成回复建议，也可以按规则自动发送低风险消息，销售仍然可以随时接管。"
  },
  {
    key: "pm4",
    customer: "赵女士",
    owner: "陈销售",
    scenario: "手机号绑定",
    stage: "新接客户",
    skill: "获取客户信息",
    risk: "低",
    humanScore: 90,
    humanSignals: ["说明手机号用途", "不强迫留资", "用于后续服务档案"],
    sendMode: "人工确认",
    due: "30分钟内",
    expected: "拿到手机号打通三方系统客户档案",
    message: "为了帮您匹配已有咨询记录和后续服务进度，方便留一下手机号吗？系统会用于识别您的服务档案。"
  }
];

const proactivePlans = [
  { key: "pp1", scene: "新好友加企微", trigger: "加好友后 1 分钟", target: "收集手机号并绑定三方客户档案", skill: "获取客户信息", owner: "全部托管销售", mode: "人工确认" },
  { key: "pp2", scene: "客户约定晚间联系", trigger: "客户提到“晚上联系”", target: "创建定时跟进并在到点生成提醒话术", skill: "创建定时跟进", owner: "李销售", mode: "人工确认" },
  { key: "pp3", scene: "付款完成后跟进", trigger: "三方系统付款回调", target: "同步订单状态，发送交付引导和下一步安排", skill: "创建定时跟进", owner: "陈销售", mode: "自动发送" },
  { key: "pp4", scene: "试听课后反馈", trigger: "试听课结束后 30 分钟", target: "询问体验、收集异议并推动报名", skill: "生成待发送建议", owner: "试听课销售组", mode: "人工确认" }
];

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "工作台" },
  { key: "conversations", icon: <CommentOutlined />, label: "会话中心" },
  { key: "strategy", icon: <BarChartOutlined />, label: "Skill 管理" },
  { key: "customers", icon: <UserOutlined />, label: "客户中心" },
  { key: "sales", icon: <TeamOutlined />, label: "企微托管" },
  { key: "agent", icon: <RobotOutlined />, label: "角色配置" },
  { key: "humanization", icon: <SmileOutlined />, label: "拟人化设置" },
  { key: "knowledge", icon: <BookOutlined />, label: "资源管理" },
  { key: "settings", icon: <SettingOutlined />, label: "系统配置" }
];

const pageTitle = Object.fromEntries(menuItems.map((item) => [item.key, item.label]));

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

function ActionModal({ title, open, onClose, children }) {
  return (
    <Modal title={title} open={Boolean(open)} onCancel={onClose} onOk={onClose} okText="确认" cancelText="取消">
      {children || <Text type="secondary">当前为原型交互，后续可接入真实业务逻辑。</Text>}
    </Modal>
  );
}

function WecomAvatar({ item, size = 44, unread = 0 }) {
  return (
    <div className="wecom-avatar-wrap" style={{ width: size, height: size }}>
      <div className={item.type === "group" ? "wecom-avatar-img group" : "wecom-avatar-img"} style={{ "--avatar-a": item.avatarColors?.[0] || "#8fc7ff", "--avatar-b": item.avatarColors?.[1] || "#1b63d9", fontSize: Math.max(14, Math.round(size * 0.36)) }}>
        {item.avatarImage ? <img src={item.avatarImage} alt="" /> : item.avatar}
      </div>
      {unread ? <span className="unread-badge">{unread}</span> : null}
    </div>
  );
}

function Login({ onLogin }) {
  const [loginMode, setLoginMode] = useState("account");
  const qrCells = [0, 1, 2, 4, 5, 7, 10, 11, 13, 16, 18, 19, 20, 22, 25, 27, 28, 31, 32, 34, 36, 37, 40, 43, 45, 46, 48];
  const handleAccountLogin = (values) => {
    onLogin(values.account || "1");
  };
  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <div className="login-grid" />
        <div className="flow-line line-a" />
        <div className="flow-line line-b" />
        <div className="flow-line line-c" />
        <div className="message-stream">
          <i />
          <i />
          <i />
        </div>
      </div>
      <Card className="login-card">
        <Space direction="vertical" size={22} className="full-width">
          <div className="login-brand">
            <div className="brand-mark">AI</div>
            <div>
              <Title level={3}>AISA</Title>
              <Text type="secondary">AI销售托管平台</Text>
            </div>
          </div>
          <Radio.Group
            className="login-mode"
            value={loginMode}
            onChange={(event) => setLoginMode(event.target.value)}
            optionType="button"
            buttonStyle="solid"
            options={[
              { value: "account", label: <><UserOutlined />账号密码</> },
              { value: "wecom", label: <><WechatOutlined />企业微信扫码</> }
            ]}
          />
          {loginMode === "account" ? (
            <Form layout="vertical" onFinish={handleAccountLogin}>
              <Form.Item label="账号" name="account">
                <Input size="large" autoComplete="username" placeholder="输入 1 / 2 / 3" />
              </Form.Item>
              <Form.Item label="密码" name="password">
                <Input.Password size="large" autoComplete="current-password" />
              </Form.Item>
              <Paragraph type="secondary">演示账号：1 平台管理员，2 企业员工，3 企业管理员。系统会按账号权限展示菜单和数据。</Paragraph>
              <Button type="primary" size="large" block htmlType="submit">
                登录
              </Button>
            </Form>
          ) : (
            <div className="wecom-login">
              <div className="wecom-qr-card" aria-label="企业微信登录二维码">
                <div className="qr-corner top-left" />
                <div className="qr-corner top-right" />
                <div className="qr-corner bottom-left" />
                <div className="qr-grid" aria-hidden="true">
                  {Array.from({ length: 49 }).map((_, index) => (
                    <i key={index} className={qrCells.includes(index) ? "active" : ""} />
                  ))}
                </div>
                <QrcodeOutlined className="qr-center-icon" />
              </div>
              <Space direction="vertical" size={8} align="center" className="full-width">
                <Text strong>使用企业微信扫一扫登录</Text>
                <Text type="secondary">扫码登录后按账号权限进入对应工作台。</Text>
              </Space>
              <Button type="primary" size="large" block icon={<WechatOutlined />} onClick={() => onLogin("2")}>
                模拟扫码成功
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}

function Dashboard({ setRoute, conversationsData = conversations }) {
  const [dashboardModal, setDashboardModal] = useState("");
  const customerConversations = conversationsData.filter((item) => item.type === "single");
  const hostedWecomCount = new Set(conversationsData.filter((item) => item.hosted).map((item) => item.accountKey)).size;
  const activeChatCount = customerConversations.filter((item) => item.status === "AI接待中").length;
  const humanInterventionCount = customerConversations.filter((item) => item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认").length;
  const lifecycleDistribution = lifecycleStages.map((stage) => ({
    ...stage,
    count: conversationsData.filter((item) => item.lifecycle === stage.title).length
  }));
  const lifecycleColors = ["#1b63d9", "#0c9588", "#d97706", "#dc2626", "#7c3aed"];
  const lifecycleTotal = lifecycleDistribution.reduce((total, item) => total + item.count, 0) || 1;
  const maxLifecycleCount = Math.max(...lifecycleDistribution.map((item) => item.count), 1);
  const replyIntervalData = [
    { label: "30秒内", shortLabel: "30秒内", count: 18, color: "#138a59" },
    { label: "30-60秒", shortLabel: "30-60秒", count: 26, color: "#1b63d9" },
    { label: "1-5分钟", shortLabel: "1-5分", count: 14, color: "#0c9588" },
    { label: "5-15分钟", shortLabel: "5-15分", count: 9, color: "#d97706" },
    { label: "15-30分钟", shortLabel: "15-30分", count: 7, color: "#7c3aed" },
    { label: "30分钟-1小时", shortLabel: "30分-1h", count: humanInterventionCount, color: "#dc2626" },
    { label: "1小时-5小时", shortLabel: "1-5h", count: 4, color: "#b45309" },
    { label: "5小时以上", shortLabel: "5h以上", count: 2, color: "#334155" }
  ];
  const maxIntervalCount = Math.max(...replyIntervalData.map((item) => item.count), 1);
  const parseAmount = (amount = "") => Number(String(amount).replace(/[^\d.]/g, "")) || 0;
  const getOrderTime = (order, item) => {
    if (order.paidAt && order.paidAt !== "-") return order.paidAt;
    const dateMatch = String(order.id).match(/20\d{6}/);
    if (dateMatch) return `${dateMatch[0].slice(0, 4)}-${dateMatch[0].slice(4, 6)}-${dateMatch[0].slice(6, 8)}`;
    return item.addedAt?.slice(0, 10) || "-";
  };
  const aiOrders = conversationsData
    .filter((item) => item.hosted && item.orders?.some((order) => parseAmount(order.amount) > 0))
    .map((item) => ({ ...item, orderAmount: item.orders.reduce((total, order) => total + parseAmount(order.amount), 0) }));
  const aiOrderAmount = aiOrders.reduce((total, item) => total + item.orderAmount, 0);
  const aiOrderRows = conversationsData.flatMap((item) =>
    (item.orders || [])
      .filter((order) => item.hosted && parseAmount(order.amount) > 0)
      .map((order) => ({
        key: `${item.key}-${order.id}`,
        customer: item.name,
        owner: item.owner,
        lifecycle: item.lifecycle,
        order: order.product,
        orderStatus: order.status,
        orderAmount: parseAmount(order.amount),
        orderTime: getOrderTime(order, item)
      }))
  );
  const pendingColumns = [
    { title: "客户", dataIndex: "name", width: 92 },
    { title: "销售", dataIndex: "owner", width: 92 },
    { title: "意向", dataIndex: "intent", width: 72, render: (v) => <Tag color={v === "高" ? "red" : "gold"}>{v}</Tag> },
    { title: "状态", dataIndex: "status", width: 104, ellipsis: true },
    { title: "操作", fixed: "right", width: 72, render: () => <Button size="small" type="link" onClick={() => setRoute("conversations")}>查看</Button> }
  ];
  const orderColumns = [
    { title: "客户", dataIndex: "customer", width: 84 },
    { title: "订单", dataIndex: "order", width: 168, ellipsis: true },
    { title: "订单时间", dataIndex: "orderTime", width: 104 },
    { title: "订单金额", dataIndex: "orderAmount", width: 86, render: (value) => `¥${value.toLocaleString()}` }
  ];
  const orderModalColumns = [
    ...orderColumns,
    { title: "生命周期", dataIndex: "lifecycle", width: 116, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "订单状态", dataIndex: "orderStatus", width: 116 }
  ];
  const interventionRows = customerConversations.filter((item) => item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认");
  const metricCards = [
    { label: "托管微信数", icon: WechatOutlined, value: hostedWecomCount, previous: "昨日 4", trend: "+20%", trendType: "up", tone: "cyan" },
    { label: "总客户数", icon: TeamOutlined, value: customerConversations.length, previous: "昨日 18", trend: "+35%", trendType: "up", tone: "purple" },
    { label: "正在聊天客户", icon: CommentOutlined, value: activeChatCount, previous: "昨日 12", trend: "+23%", trendType: "up", tone: "blue" },
    { label: "需人工介入", icon: AlertOutlined, value: humanInterventionCount, previous: "昨日 6", trend: "+48%", trendType: "down", tone: "red", type: "warning" },
    { label: "AI参与订单数", icon: FileTextOutlined, value: aiOrderRows.length, previous: "昨日 8", trend: "+18%", trendType: "up", tone: "green" },
    { label: "AI参与订单金额", icon: DollarOutlined, value: `¥${aiOrderAmount.toLocaleString()}`, previous: "昨日 ¥18,640", trend: "+42%", trendType: "up", tone: "orange" }
  ];
  return (
    <>
    <Space direction="vertical" size={16} className="page-stack">
      <Row gutter={[16, 16]}>
        {metricCards.map((item) => (
          <Col xs={24} md={12} xl={4} key={item.label}>
            <Card className={`metric-card tone-${item.tone} ${item.type === "warning" ? "warning" : ""}`}>
              <div className="metric-tile">
                <div className="metric-card-head">
                  <Text type="secondary" className="metric-label">
                    <item.icon />
                    <span>{item.label}</span>
                  </Text>
                  {item.type === "warning" ? <Tag color="red">重点预警</Tag> : null}
                </div>
                <Title level={2}>{item.value}</Title>
                <div className="metric-foot">
                  <Text type="secondary">{item.previous}</Text>
                  <span className={`metric-trend ${item.trendType}`}>{item.trendType === "up" ? "↑" : "↓"} {item.trend}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="intervention-card" title={<PanelTitle title="人工介入预警" desc="需要销售确认、接管或处理敏感承诺的客户。" extra={<Button type="link" size="small" onClick={() => setDashboardModal("intervention")}>更多</Button>} />}>
            <Table size="small" className="admin-table compact-warning-table" rowKey="key" columns={pendingColumns} dataSource={interventionRows.slice(0, 5)} pagination={false} scroll={{ x: 460 }} />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="dashboard-card" title={<PanelTitle title="生命周期客户分布" desc="按AI跟进客户的阶段统计当前客户池。" />}>
            <div className="lifecycle-bar-chart">
              <div className="lifecycle-bars">
                {lifecycleDistribution.map((item, index) => (
                  <div className="lifecycle-bar-row" key={item.title}>
                    <div className="lifecycle-bar-meta">
                      <Text className="lifecycle-stage-name" strong>{item.title}</Text>
                      <Text type="secondary">{item.count}人 / {Math.round((item.count / lifecycleTotal) * 100)}%</Text>
                    </div>
                    <div className="lifecycle-bar-track">
                      <div
                        className="lifecycle-bar-fill"
                        style={{
                          width: `${Math.max(6, (item.count / maxLifecycleCount) * 100)}%`,
                          background: lifecycleColors[index]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="intervention-card ai-order-card" title={<PanelTitle title="AI参与订单" desc="统计由AI参与沟通、推荐课程或推动报名的订单。" extra={<Button type="link" size="small" onClick={() => setDashboardModal("orders")}>更多</Button>} />}>
            <Table size="small" className="admin-table compact-warning-table" rowKey="key" columns={orderColumns} dataSource={aiOrderRows.slice(0, 5)} pagination={false} scroll={{ x: 460 }} />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="dashboard-card" title={<PanelTitle title="回复平均间隔分布" desc="统计AI托管会话的平均回复间隔。" />}>
            <div className="interval-chart">
              {replyIntervalData.map((item) => (
                <div className="interval-item" key={item.label}>
                  <div className="interval-bar" style={{ height: `${Math.max(18, (item.count / maxIntervalCount) * 190)}px`, background: item.color }} />
                  <Text strong>{item.count}</Text>
                  <Text type="secondary" title={item.label}>{item.shortLabel}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
    <Modal title="人工介入预警" open={dashboardModal === "intervention"} onCancel={() => setDashboardModal("")} footer={null} width={860}>
      <Table size="small" className="admin-table" rowKey="key" columns={pendingColumns} dataSource={interventionRows} pagination={{ pageSize: 8, showSizeChanger: true }} scroll={{ x: 620 }} />
    </Modal>
    <Modal title="AI参与订单" open={dashboardModal === "orders"} onCancel={() => setDashboardModal("")} footer={null} width={980}>
      <Table size="small" className="admin-table" rowKey="key" columns={orderModalColumns} dataSource={aiOrderRows} pagination={{ pageSize: 8, showSizeChanger: true }} scroll={{ x: 760 }} />
    </Modal>
    </>
  );
}

function CompanyPage({ platform }) {
  const [editing, setEditing] = useState(null);
  const [companyRows, setCompanyRows] = useState(companies);
  const columns = [
    { title: "企业名称", dataIndex: "name" },
    { title: "行业", dataIndex: "industry" },
    { title: "联系人", dataIndex: "contact" },
    { title: "电话", dataIndex: "phone" },
    { title: "企微状态", dataIndex: "wecom" },
    { title: "状态", dataIndex: "status", render: statusTag },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" icon={<EditOutlined />} onClick={() => setEditing(record)}>编辑</Button>
          {platform ? <Button type="link" danger onClick={() => Modal.confirm({ title: "删除企业", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setCompanyRows((items) => items.filter((item) => item.id !== record.id)) })}>删除</Button> : null}
        </Space>
      )
    }
  ];
  return (
    <>
      <Card title={<PanelTitle title={platform ? "企业列表" : "本企业基础配置"} desc="维护企业资料、行业信息和启用状态。" extra={platform ? <CompanyModal /> : null} />}>
        <Table className="admin-table" rowKey="id" columns={columns} dataSource={platform ? companyRows : companyRows.slice(0, 1)} pagination={false} scroll={{ x: 980 }} />
      </Card>
      <CompanyEditModal company={editing} onClose={() => setEditing(null)} />
    </>
  );
}

function CompanyModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>新建企业</Button>
      <Modal title="企业基础信息" open={open} onCancel={() => setOpen(false)} okText="保存配置" cancelText="取消">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item label="企业名称"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="所属行业"><Select options={["教育", "家装", "医美", "SaaS", "其他"].map((value) => ({ value }))} /></Form.Item></Col>
            <Col span={12}><Form.Item label="联系人"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="联系电话"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item label="企业简介"><Input.TextArea rows={3} /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

function CompanyEditModal({ company, onClose }) {
  return (
    <Modal title="编辑企业" open={Boolean(company)} onCancel={onClose} onOk={onClose} okText="保存企业" cancelText="取消" width={720}>
      <Form layout="vertical" initialValues={company || {}} key={company?.id || "empty"}>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="企业名称" name="name"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="行业" name="industry"><Select options={["教育", "家装", "SaaS", "医美", "其他"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="联系人" name="contact"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="电话" name="phone"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="企微状态" name="wecom"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function AgentPage() {
  const [modal, setModal] = useState("");
  const [editingAgent, setEditingAgent] = useState(null);
  const [roleRows, setRoleRows] = useState(agents);
  const [lifecycleAgent, setLifecycleAgent] = useState(null);
  const [roleLifecycleStages, setRoleLifecycleStages] = useState(() => Object.fromEntries(
    agents.map((agent) => [
      agent.key,
      lifecycleStages.map((item, index) => ({ ...item, key: `${agent.key}-stage-${index + 1}`, order: index + 1, status: "启用" }))
    ])
  ));
  const updateAgentStages = (agentKey, updater) => {
    setRoleLifecycleStages((items) => {
      const currentStages = items[agentKey] || [];
      return {
        ...items,
        [agentKey]: typeof updater === "function" ? updater(currentStages) : updater
      };
    });
  };
  const columns = [
    { title: "角色", dataIndex: "name", width: 120 },
    { title: "定位", dataIndex: "type", width: 120, render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "角色说明", dataIndex: "roleDescription", width: 520, render: (value) => <Text ellipsis={{ tooltip: value }}>{value}</Text> },
    { title: "生命周期", dataIndex: "key", width: 100, render: (key) => <Tag color="processing">{(roleLifecycleStages[key] || []).length}个</Tag> },
    { title: "已配置企微", dataIndex: "sales", width: 110, render: (v) => <Tag color="blue">{v}个</Tag> },
    { title: "状态", dataIndex: "status", width: 86, render: statusTag },
    {
      title: "操作",
      fixed: "right",
      width: 260,
      render: (_, record) => (
        <Space wrap={false}>
          <Button size="small" onClick={() => { setEditingAgent(record); setModal("editTest"); }}>编辑</Button>
          <Button size="small" onClick={() => setLifecycleAgent(record)}>配置生命周期</Button>
          <Button size="small" danger onClick={() => Modal.confirm({ title: "删除角色配置", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setRoleRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  if (lifecycleAgent) {
    return (
      <RoleLifecyclePage
        agent={lifecycleAgent}
        stages={roleLifecycleStages[lifecycleAgent.key] || []}
        setStages={(updater) => updateAgentStages(lifecycleAgent.key, updater)}
        onBack={() => setLifecycleAgent(null)}
      />
    );
  }
  return (
    <>
      <Card title={<PanelTitle title="角色配置列表" desc="配置市场、销售、班主任等岗位在托管企微中的基础AI沟通能力、服务目标和动作边界。" extra={<Button type="primary" onClick={() => { setEditingAgent(null); setModal("editTest"); }}>新建角色配置</Button>} />}>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部状态" options={["全部状态", "启用", "停用"].map((value) => ({ value }))} />
          <Input.Search placeholder="搜索角色名称或角色说明" allowClear />
        </Space>
        <Table className="admin-table agent-table" rowKey="key" columns={columns} dataSource={roleRows} pagination={false} scroll={{ x: 1240 }} />
      </Card>
      <AgentModals modal={modal} setModal={setModal} editingAgent={editingAgent} />
    </>
  );
}

function AgentModals({ modal, setModal, editingAgent }) {
  const roleDescriptionPlaceholder = "请描述该角色在企微沟通中的定位与边界。例如：人设风格是专业顾问型还是亲和服务型；说话语气偏自然、热情、正式或简洁；主要服务目标是收集需求、推荐产品、促成下单、邀约到店或引导留资；禁止行为包括不能乱报价、不能承诺效果、不能贬低竞品、不能泄露客户隐私等。";
  return (
    <>
      <Modal title={editingAgent ? "角色编辑" : "新增角色"} open={modal === "editTest"} onCancel={() => setModal("")} width={820} footer={null}>
        <div className="agent-edit-pane">
            <Form
              layout="vertical"
              initialValues={{
                name: editingAgent?.name || "",
                roleDescription: editingAgent?.roleDescription || ""
              }}
              key={editingAgent?.key || "new-agent"}
            >
              <Row gutter={16}>
                <Col span={24}><Form.Item label="角色名称" name="name"><Input placeholder="请输入角色名称，例如：销售、市场、班主任" /></Form.Item></Col>
                <Col span={24}><Form.Item label="角色说明" name="roleDescription"><Input.TextArea rows={8} placeholder={roleDescriptionPlaceholder} /></Form.Item></Col>
              </Row>
              <div className="edit-action-bar">
                <Text type="secondary">保存后，角色配置将用于后续托管企微沟通。</Text>
                <Space>
                  <Button onClick={() => setModal("")}>取消</Button>
                  <Button type="primary" htmlType="submit">保存角色</Button>
                </Space>
              </div>
            </Form>
        </div>
      </Modal>
      <ActionModal title="删除角色配置" open={modal === "delete"} onClose={() => setModal("")}>
        <Text>确认删除该角色配置？删除后可在后续接入真实接口时同步处理绑定关系。</Text>
      </ActionModal>
    </>
  );
}

function StrategyPage() {
  const [editingSkill, setEditingSkill] = useState(null);
  const [strategyRows, setStrategyRows] = useState(strategies);
  const createSkillDraft = () => ({
    key: "new-skill",
    name: "新增 Skill",
    type: "消息生成",
    trigger: "家长进线 / 课程顾问跟进",
    channel: "AISA内部能力",
    input: "聊天记录、学员年级、英语基础、课程意向",
    output: "下一步沟通建议、待发送话术、触发动作",
    agent: "小学英语课程顾问",
    calls: 0,
    status: "启用"
  });
  const columns = [
    { title: "Skill", dataIndex: "name", width: 150 },
    { title: "能力类型", dataIndex: "type", width: 112, render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "触发方式", dataIndex: "trigger", width: 220 },
    { title: "调用通道", dataIndex: "channel", width: 140 },
    { title: "绑定角色", dataIndex: "agent", width: 150 },
    { title: "今日调用", dataIndex: "calls", width: 96 },
    { title: "启用", dataIndex: "status", width: 96, render: (v) => <Switch checked={v === "启用"} checkedChildren="启用" unCheckedChildren="停用" /> },
    {
      title: "操作",
      fixed: "right",
      width: 170,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setEditingSkill(record)}>编辑调试</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除 Skill", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setStrategyRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  if (editingSkill) return <StrategyEditor skill={editingSkill} onBack={() => setEditingSkill(null)} />;
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card title={<PanelTitle title="Skill 列表" desc="管理小学英语课程顾问可调用的工具能力；点击编辑调试进入配置与测试页面。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingSkill(createSkillDraft())}>新增 Skill</Button>} />}>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部能力类型" options={["全部能力类型", "数据查询", "消息生成", "定时任务", "企微动作"].map((value) => ({ value }))} />
          <Select defaultValue="全部状态" options={["全部状态", "启用", "停用"].map((value) => ({ value }))} />
          <Input.Search placeholder="搜索课程 Skill、触发方式或调用通道" allowClear />
        </Space>
        <Table
          className="admin-table"
          rowKey="key"
          columns={columns}
          dataSource={strategyRows}
          pagination={false}
          scroll={{ x: 1150 }}
        />
      </Card>
    </Space>
  );
}

function escapeMarkup(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightSkillLogic(value) {
  return escapeMarkup(value).split("\n").map((line) => {
    if (/^#{1,6}\s/.test(line)) {
      return `<span class="logic-token-heading">${line}</span>`;
    }
    return line
      .replace(/`([^`]+)`/g, '<span class="logic-token-code">`$1`</span>')
      .replace(/\{\{([^}]+)\}\}/g, '<span class="logic-token-var">{{$1}}</span>')
      .replace(/^(\s*)([-*]|\d+\.)\s/, '$1<span class="logic-token-list">$2</span> ');
  }).join("\n");
}

function SkillLogicRichEditor({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const highlighted = useMemo(() => highlightSkillLogic(value), [value]);
  return (
    <div className="skill-logic-editor-wrap">
      <pre className="skill-logic-highlight" aria-hidden="true" dangerouslySetInnerHTML={{ __html: highlighted }} />
      <textarea
        className="skill-logic-editor"
        value={value}
        spellCheck={false}
        onChange={(event) => setValue(event.target.value)}
        onScroll={(event) => {
          const highlight = event.currentTarget.previousElementSibling;
          if (highlight) {
            highlight.scrollTop = event.currentTarget.scrollTop;
            highlight.scrollLeft = event.currentTarget.scrollLeft;
          }
        }}
      />
    </div>
  );
}

function StrategyEditor({ skill, onBack }) {
  const lifecycleOptions = lifecycleStages.map((item) => ({ value: item.title, label: item.title }));
  const audienceTagOptions = [
    "新加好友",
    "已预约体验课",
    "第一节体验课完成",
    "第二节体验课完成",
    "高意向",
    "中意向",
    "低意向",
    "需人工介入",
    ...lifecycleOptions.map((item) => item.value)
  ].map((value) => ({ value }));
  const [debugInput, setDebugInput] = useState("");
  const [debugTrace, setDebugTrace] = useState(null);
  const logicSections = [
    {
      title: "角色",
      content: "你是小学英语课程增长场景中的 Skill，负责在企微会话里辅助课程顾问识别家长诉求、补齐学员信息、推荐合适课程动作，并推动试听或报名转化。回复必须专业、自然、克制，不暴露系统或AI身份。"
    },
    {
      title: "技能1：客户需求挖掘与确认",
      steps: [
        "开场破冰：结合家长上下文自然承接，不重复模板化问候。",
        "需求提问：围绕年级、英语基础、校内成绩、学习目标和时间安排进行2-3个关键追问。",
        "需求总结：把家长诉求整理成结构化结论，并确认是否准确。"
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
        "高意向：生成试听预约或报名确认话术，提醒人工确认敏感承诺。",
        "中意向：创建定时跟进，补充课程案例或学习规划。",
        "低意向：降低压迫感，保留后续沟通入口。"
      ]
    }
  ];
  const logicText = logicSections.map((section) => {
    const lines = [`# ${section.title}`];
    if (section.content) lines.push(section.content);
    if (section.steps) lines.push(...section.steps.map((step, index) => `${index + 1}. ${step}`));
    return lines.join("\n");
  }).join("\n\n");
  const debugReply = skill.name === "生成课程顾问话术"
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
    { key: "u-1", from: "user", text: "孩子三年级，英语基础一般，阅读总丢分。想先了解试听课怎么安排，费用大概多少？" },
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
  const sendDebugMedia = (kind) => {
    appendDebugRun({
      key: `u-${kind}-${Date.now()}`,
      from: "user",
      kind,
      text: kind === "voice" ? "语音消息 00:08：孩子阅读理解总丢分，想问试听课。" : "图片消息：上传了一张阅读理解错题截图。"
    });
  };
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
            <Button type="primary">保存 Skill</Button>
          </Space>
        </div>
      </Card>
      <div className="skill-builder-grid">
        <section className="skill-logic-pane">
          <div className="builder-pane-head">
            <Title level={4}>技能逻辑描述</Title>
          </div>
          <SkillLogicRichEditor defaultValue={logicText} />
        </section>
        <section className="skill-config-pane">
          <div className="builder-pane-head">
            <Title level={4}>编排</Title>
          </div>
          <Form
            layout="vertical"
            key={skill.key}
            initialValues={{
              name: skill.name,
              triggerBase: "基于添加好友时间",
              scheduleRules: [{ operationTaskType: "加好友后发送欢迎语", audienceTags: ["新加好友"], triggerMode: "延后触发", timeMode: "相对时间", amount: 1, unit: "分钟" }],
              model: "豆包 1.8 深度思考"
            }}
          >
            <div className="orchestration-form">
              <Form.Item label="Skill 名称" name="name"><Input /></Form.Item>
              <div className="schedule-config-block">
                <Text className="required-section-title">触发时间配置</Text>
                <Form.Item name="triggerBase" className="schedule-base-item">
                  <Radio.Group>
                    <Radio value="基于添加好友时间">基于添加好友时间</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.List name="scheduleRules">
                  {(fields, { add, remove }) => (
                    <div className="schedule-rule-list">
                      {fields.map((field, index) => (
                        <div className="schedule-rule-row" key={field.key}>
                          <Form.Item className="schedule-operation-item" label="运营任务类型" name={[field.name, "operationTaskType"]}>
                            <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} placeholder="描述要做的事情，例如：第一节体验课前提醒" />
                          </Form.Item>
                          <Form.Item className="schedule-audience-item" label="发送用户人群" name={[field.name, "audienceTags"]}>
                            <Select
                              mode="multiple"
                              maxTagCount="responsive"
                              placeholder="选择用户标签确定人群"
                              options={audienceTagOptions}
                            />
                          </Form.Item>
                          <Form.Item className="schedule-trigger-item" name={[field.name, "triggerMode"]}>
                            <Select options={["延后触发", "提前触发", "立即触发"].map((value) => ({ value }))} />
                          </Form.Item>
                          <Form.Item className="schedule-mode-item" name={[field.name, "timeMode"]}>
                            <Select options={["相对时间", "固定时间"].map((value) => ({ value }))} />
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate={(prev, next) => prev.scheduleRules?.[field.name]?.timeMode !== next.scheduleRules?.[field.name]?.timeMode}>
                            {({ getFieldValue }) => {
                              const timeMode = getFieldValue(["scheduleRules", field.name, "timeMode"]);
                              return timeMode === "固定时间" ? (
                                <Form.Item name={[field.name, "fixedAt"]} className="schedule-fixed-time-item">
                                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="选择年月日时分秒" />
                                </Form.Item>
                              ) : (
                                <>
                                  <Form.Item className="schedule-amount-item" name={[field.name, "amount"]}>
                                    <Input />
                                  </Form.Item>
                                  <Form.Item className="schedule-unit-item" name={[field.name, "unit"]}>
                                    <Select options={["分钟", "小时", "天"].map((value) => ({ value }))} />
                                  </Form.Item>
                                </>
                              );
                            }}
                          </Form.Item>
                          <div className="schedule-rule-actions">
                            {fields.length > 1 ? <Button type="link" danger className="schedule-remove-button" onClick={() => remove(field.name)}>删除</Button> : null}
                            <Button
                              type="dashed"
                              className="schedule-add-button"
                              icon={<PlusOutlined />}
                              onClick={() => add({ operationTaskType: "加好友后发送欢迎语", audienceTags: ["新加好友"], triggerMode: "延后触发", timeMode: "相对时间", amount: 1, unit: "分钟" })}
                            >
                              新增任务
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.List>
              </div>
              <Form.Item label="模型" name="model"><Select options={["豆包 1.8 深度思考", "通义千问 Max", "DeepSeek V3"].map((value) => ({ value }))} /></Form.Item>
            </div>
          </Form>
        </section>
        <section className="skill-preview-pane">
          <div className="builder-pane-head">
            <Title level={4}>预览与调试</Title>
            <Space>
              <Tooltip title="运行调试"><Button shape="circle" type="primary" icon={<CloudSyncOutlined />} /></Tooltip>
            </Space>
          </div>
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
                  <Button
                    type="link"
                    size="small"
                    className="debug-trace-link"
                    icon={<FileSearchOutlined />}
                    onClick={() => setDebugTrace(message.trace)}
                  >
                    查看执行过程
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
          <div className="debug-input-bar">
            <Tooltip title="模拟用户语音">
              <Button shape="circle" icon={<AudioOutlined />} onClick={() => sendDebugMedia("voice")} />
            </Tooltip>
            <Tooltip title="模拟用户图片">
              <Button shape="circle" icon={<PictureOutlined />} onClick={() => sendDebugMedia("image")} />
            </Tooltip>
            <Input
              value={debugInput}
              placeholder="输入模拟用户的聊天内容..."
              onChange={(event) => setDebugInput(event.target.value)}
              onPressEnter={sendDebugText}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={sendDebugText}>发送</Button>
          </div>
        </section>
      </div>
      <Modal
        title={debugTrace?.title || "执行过程"}
        open={Boolean(debugTrace)}
        onCancel={() => setDebugTrace(null)}
        footer={<Button type="primary" onClick={() => setDebugTrace(null)}>知道了</Button>}
      >
        {debugTrace ? (
          <Space direction="vertical" size={14} className="full-width">
            <div>
              <Text strong>过程说明</Text>
              <ul className="debug-trace-list">
                {debugTrace.steps.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
            <div>
              <Text strong>规则校验</Text>
              <Space wrap className="debug-check-tags">
                {debugTrace.checks.map((item) => <Tag color="processing" key={item}>{item}</Tag>)}
              </Space>
            </div>
          </Space>
        ) : null}
      </Modal>
    </Space>
  );
}

function RoleLifecyclePage({ agent, stages, setStages, onBack }) {
  const [editingStage, setEditingStage] = useState(null);
  const skillOptions = strategies.map((item) => ({ value: item.name, label: item.name }));
  const columns = [
    { title: "阶段", dataIndex: "title", width: 140, render: (value, record) => <Space><Badge count={record.order} color="#1b63d9" /><Text strong>{value}</Text></Space> },
    { title: "阶段说明", dataIndex: "desc", width: 360 },
    { title: "绑定 Skill", dataIndex: "skills", width: 260, render: (items = []) => <Space wrap>{items.map((item) => <Tag color="blue" key={item}>{item}</Tag>)}</Space> },
    { title: "状态", dataIndex: "status", width: 90, render: statusTag },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setEditingStage(record)}>编辑</Button>
          <Button
            type="link"
            danger
            onClick={() => Modal.confirm({
              title: "删除生命周期阶段",
              content: `确认删除 ${record.title}？`,
              okText: "删除",
              okButtonProps: { danger: true },
              cancelText: "取消",
              onOk: () => setStages((items) => items.filter((item) => item.key !== record.key).map((item, index) => ({ ...item, order: index + 1 })))
            })}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];
  const handleSave = (values) => {
    if (editingStage?.key) {
      setStages((items) => items.map((item) => item.key === editingStage.key ? { ...item, ...values } : item));
    } else {
      setStages((items) => [...items, { ...values, key: `stage-${Date.now()}`, order: items.length + 1, status: "启用" }]);
    }
    setEditingStage(null);
  };
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card
        title={
          <PanelTitle
            title={`${agent.name}生命周期配置`}
            desc="为当前角色维护多个客户阶段，每个阶段可绑定对应 Skill。"
            before={<Button icon={<ArrowLeftOutlined />} onClick={onBack}>返回角色列表</Button>}
            extra={[
              <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setEditingStage({})}>新增生命周期</Button>
            ]}
          />
        }
      >
        <Space className="toolbar" wrap>
          <Select defaultValue="全部状态" options={["全部状态", "启用", "停用"].map((value) => ({ value }))} />
          <Select defaultValue="全部Skill" options={[{ value: "全部Skill" }, ...skillOptions]} />
          <Input.Search placeholder="搜索阶段名称、说明或绑定 Skill" allowClear />
        </Space>
        <Table className="admin-table" rowKey="key" columns={columns} dataSource={stages} pagination={false} scroll={{ x: 920 }} />
      </Card>
      <LifecycleModal stage={editingStage} skillOptions={skillOptions} onClose={() => setEditingStage(null)} onSave={handleSave} />
    </Space>
  );
}

function LifecycleModal({ stage, skillOptions, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (stage) {
      form.resetFields();
      form.setFieldsValue({
        title: stage.title || "",
        desc: stage.desc || "",
        skills: stage.skills || [],
        status: stage.status || "启用"
      });
    }
  }, [stage, form]);
  return (
    <Modal
      title={stage?.key ? "编辑生命周期阶段" : "新增生命周期阶段"}
      open={Boolean(stage)}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="保存阶段"
      cancelText="取消"
      width={760}
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="阶段名称" name="title" rules={[{ required: true, message: "请输入阶段名称" }]}><Input placeholder="例如：试课邀约阶段" /></Form.Item></Col>
          <Col span={12}><Form.Item label="阶段状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={24}><Form.Item label="阶段说明" name="desc"><Input.TextArea rows={3} placeholder="说明客户在该阶段的典型状态。" /></Form.Item></Col>
          <Col span={24}><Form.Item label="绑定 Skill" name="skills"><Select mode="multiple" placeholder="选择该阶段可调用的 Skill" options={skillOptions} /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function KnowledgePage() {
  const [modal, setModal] = useState("");
  const [knowledgeRows, setKnowledgeRows] = useState(knowledge);
  const columns = [
    { title: "标题", dataIndex: "title" },
    { title: "类型", dataIndex: "type" },
    { title: "内容形式", dataIndex: "source" },
    { title: "状态", dataIndex: "status", render: statusTag },
    { title: "更新时间", dataIndex: "updated" },
    {
      title: "操作",
      fixed: "right",
      width: 130,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setModal("edit")}>编辑</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除资源", content: `确认删除 ${record.title}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setKnowledgeRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  return (
    <>
      <Card title={<PanelTitle title="资源列表" desc="维护产品知识、FAQ、销售话术和文件类素材，供角色配置和Skill调用。" extra={<><Button onClick={() => setModal("file")}>上传文件</Button><Button type="primary" onClick={() => setModal("text")}>新增资源</Button></>} />}>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部类型" options={["全部类型", "公司介绍", "产品知识", "FAQ", "销售话术"].map((value) => ({ value }))} />
          <Select defaultValue="全部状态" options={["全部状态", "启用", "停用"].map((value) => ({ value }))} />
          <Input.Search placeholder="搜索知识标题或内容" allowClear />
        </Space>
        <Table className="admin-table" rowKey="key" columns={columns} dataSource={knowledgeRows} pagination={false} scroll={{ x: 900 }} />
      </Card>
      <KnowledgeModal modal={modal} onClose={() => setModal("")} />
    </>
  );
}

function KnowledgeModal({ modal, onClose }) {
  const isFileMode = modal === "file";
  return (
    <Modal title={modal === "edit" ? "编辑知识" : isFileMode ? "上传知识文件" : "新增知识"} open={Boolean(modal)} onCancel={onClose} onOk={onClose} okText="保存知识" cancelText="取消" width={860}>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={14}><Form.Item label="标题"><Input placeholder="例如：AI销售助手产品介绍" defaultValue={modal === "edit" ? "AI销售助手产品介绍" : ""} /></Form.Item></Col>
          <Col span={10}><Form.Item label="知识类型"><Select defaultValue="产品知识" options={["公司介绍", "产品知识", "FAQ", "销售话术", "案例知识", "政策规则"].map((value) => ({ value }))} /></Form.Item></Col>
        </Row>
        <Form.Item label="富文本内容">
          <div className="rich-editor">
            <div className="rich-toolbar">
              <Button size="small">加粗</Button>
              <Button size="small">标题</Button>
              <Button size="small">列表</Button>
              <Button size="small">链接</Button>
              <Button size="small" icon={<UploadOutlined />}>插入图片</Button>
            </div>
            <Input.TextArea
              rows={8}
              placeholder="支持录入文字说明、图片描述、文件摘要和销售话术。后续可接入真实富文本编辑器。"
              defaultValue={modal === "edit" ? "适用于企微销售自动接待场景，支持客户问题识别、产品介绍、方案推荐与必要时转人工。" : ""}
            />
          </div>
        </Form.Item>
        <Form.Item label="附件素材">
          <Upload.Dragger multiple beforeUpload={() => false} accept=".png,.jpg,.jpeg,.webp,.ppt,.pptx,.pdf,.doc,.docx">
            <p className="upload-icon"><FileTextOutlined /></p>
            <p>上传图片、PPT、PDF、Word 等知识素材</p>
            <Text type="secondary">文件将作为知识内容的补充资料，便于后续解析入库。</Text>
          </Upload.Dragger>
        </Form.Item>
        {isFileMode ? <Text type="secondary">上传后仍可补充富文本说明，便于AI理解文件使用场景。</Text> : null}
      </Form>
    </Modal>
  );
}

function WecomPage() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={10}>
        <Card title={<PanelTitle title="句子通道状态" desc="检查企微消息接收、发送和客户标签同步。" extra={<><Tag color="success">已连接</Tag><Button>查看回调日志</Button></>} />}>
          <List dataSource={["消息接收正常 最近同步 2026-05-30 14:20", "消息发送正常 AI代理账号 online", "客户标签同步 今日同步128个客户"]} renderItem={(item) => <List.Item><Space><CheckCircleOutlined className="ok-icon" />{item}</Space></List.Item>} />
        </Card>
      </Col>
      <Col xs={24} xl={14}>
        <Card title="句子与企微参数">
          <Form layout="vertical">
            {["CorpID", "AgentID", "Secret", "Token", "EncodingAESKey", "AI代理账号"].map((label) => <Form.Item key={label} label={label}><Input.Password visibilityToggle={label === "Secret"} defaultValue={label === "Secret" ? "secret-value" : label.toLowerCase()} /></Form.Item>)}
            <Space><Button>测试连接</Button><Button type="primary">保存配置</Button></Space>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

function CustomersPage({ onViewConversation, visibleWecomKeys = managedWecomAccounts.map((item) => item.key) }) {
  const customerRows = conversations.filter((item) => item.type === "single" && visibleWecomKeys.includes(item.accountKey));
  const columns = [
    { title: "客户", dataIndex: "name", width: 180, render: (_, record) => <Space><WecomAvatar item={record} size={38} /><div><Text strong>{record.name}</Text><br /><Text type="secondary">{record.remark}</Text></div></Space> },
    { title: "微信号", dataIndex: "wecomId", width: 150 },
    { title: "手机号", dataIndex: "phone", width: 130 },
    { title: "所属销售", dataIndex: "owner" },
    { title: "企微标签", dataIndex: "intent", render: (v) => <Tag color={v === "高" ? "red" : "gold"}>{v}意向</Tag> },
    { title: "当前状态", dataIndex: "status" },
    { title: "最近消息", dataIndex: "last" },
    { title: "操作", fixed: "right", width: 88, render: (_, record) => <Button type="link" onClick={() => onViewConversation(record)}>查看</Button> }
  ];
  return (
    <Card title={<PanelTitle title="客户中心" desc="汇总企微好友、客户标签、最近会话和AI跟进状态，后续承接客户档案侧边栏。" />}>
      <Space className="toolbar" wrap>
        <Select defaultValue="全部销售" options={["全部销售", "李销售", "陈销售", "周销售"].map((value) => ({ value }))} />
        <Select defaultValue="全部标签" options={["全部标签", "高意向", "中意向", "待人工接管", "AI接待中"].map((value) => ({ value }))} />
        <Input.Search placeholder="搜索客户姓名、企微备注或最近消息" allowClear />
      </Space>
      <Table className="admin-table" rowKey="key" columns={columns} dataSource={customerRows} pagination={false} scroll={{ x: 1180 }} />
    </Card>
  );
}

function SalesPage() {
  const { message } = AntApp.useApp();
  const [configAccount, setConfigAccount] = useState(null);
  const [salesRows, setSalesRows] = useState(salesAccounts);
  const [syncing, setSyncing] = useState(false);
  const latestSyncAt = salesRows.find((item) => item.syncedAt && item.syncedAt !== "未同步")?.syncedAt || "未同步";
  const columns = [
    { title: "员工", dataIndex: "name", width: 92 },
    { title: "角色", dataIndex: "role", width: 90, render: (v) => <Tag color={v === "课程顾问" ? "blue" : v === "班主任" ? "green" : "gold"}>{v}</Tag> },
    { title: "企微账号", dataIndex: "wecom", width: 126, render: (_, record) => <div><Text strong>{record.wecom}</Text><br /><Text type="secondary">{record.wecomId}</Text></div> },
    { title: "句子通道", dataIndex: "channel", width: 130, render: (v) => <Tag color={v.includes("已连接") ? "success" : "warning"}>{v}</Tag> },
    { title: "AI托管", dataIndex: "hosted", width: 84, render: (v) => <Switch checked={v} checkedChildren="开启" unCheckedChildren="关闭" /> },
    { title: "客户总数", dataIndex: "customerTotal", width: 88 },
    { title: "托管客户数", dataIndex: "hostedCustomers", width: 96 },
    { title: "需人工介入客户", dataIndex: "manualCustomers", width: 124, render: (v) => <Tag color={v ? "red" : "default"}>{v}</Tag> },
    {
      title: "操作",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setConfigAccount(record)}>编辑</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除企微托管", content: `确认删除 ${record.name} 的企微托管配置？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setSalesRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  const hostedCount = salesRows.filter((item) => item.hosted).length;
  const hostedCustomerCount = salesRows.reduce((total, item) => total + item.hostedCustomers, 0);
  const sentCount = salesRows.reduce((total, item) => total + item.sentToday, 0);
  const manualCustomerCount = salesRows.reduce((total, item) => total + item.manualCustomers, 0);
  const handleSync = () => {
    setSyncing(true);
    const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
    window.setTimeout(() => {
      setSalesRows((items) =>
        items.map((item) => ({
          ...item,
          channel: item.channel === "待绑定句子" ? "句子通道已连接" : item.channel,
          syncedAt: now,
          customerTotal: item.customerTotal + (item.hosted ? 1 : 0),
          manualCustomers: Math.max(item.abnormal, item.manualCustomers)
        }))
      );
      setSyncing(false);
      message.success("已从句子通道同步企微数据");
    }, 600);
  };
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Row gutter={[16, 16]}>
        {[
          ["已托管企微", hostedCount, "员工企微交给AI生成建议"],
          ["托管客户数", hostedCustomerCount, "已由AI持续托管跟进"],
          ["今日已发送", sentCount, "自动发送与确认发送合计"],
          ["需人工介入", manualCustomerCount, "待确认、接管或异常处理"]
        ].map(([label, value, desc]) => (
          <Col xs={24} md={12} xl={6} key={label}>
            <Card>
              <Statistic title={label} value={value} suffix={<Text type="secondary">{desc}</Text>} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card title={<PanelTitle title="企微托管列表" desc="通过句子平台打通企微消息收发，为课程顾问、班主任、市场等角色配置AI托管。" extra={<Space size={12} wrap><Button className="sync-action" icon={<CloudSyncOutlined />} loading={syncing} onClick={handleSync}>刷新同步</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => setConfigAccount({})}>配置企微账号</Button></Space>} />}>
        <div className="sync-status">
          <Badge status={syncing ? "processing" : "success"} />
          <Text type="secondary">{syncing ? "正在从句子通道同步企微客户、托管和人工介入数据" : `最近同步 ${latestSyncAt}`}</Text>
        </div>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部角色" options={["全部角色", "课程顾问", "班主任", "市场"].map((value) => ({ value }))} />
          <Select defaultValue="全部托管状态" options={["全部托管状态", "已开启", "未开启"].map((value) => ({ value }))} />
          <Input.Search placeholder="搜索员工、角色、企微账号或企微ID" allowClear />
        </Space>
        <Table className="admin-table" rowKey="key" columns={columns} dataSource={salesRows} pagination={false} scroll={{ x: 980 }} />
      </Card>
      <Modal title="企微托管配置" open={Boolean(configAccount)} onCancel={() => setConfigAccount(null)} onOk={() => setConfigAccount(null)} okText="保存配置" cancelText="取消" width={720}>
        <Form
          layout="vertical"
          key={configAccount?.key || "sales-config"}
          initialValues={{
            name: configAccount?.name,
            role: configAccount?.role || "课程顾问",
            wecom: configAccount?.wecom,
            wecomId: configAccount?.wecomId,
            hosted: configAccount?.hosted,
            juzibotAccountId: configAccount?.wecom ? `jz_${configAccount.wecom}` : "",
            juzibotApiKey: "jz_live_xxxxxx"
          }}
        >
          <Row gutter={16}>
            <Col span={12}><Form.Item label="员工姓名" name="name"><Input placeholder="例如：李老师" /></Form.Item></Col>
            <Col span={12}><Form.Item label="角色" name="role"><Select options={["课程顾问", "班主任", "市场"].map((value) => ({ value }))} /></Form.Item></Col>
            <Col span={12}><Form.Item label="企微账号" name="wecom"><Input placeholder="例如：li_sales" /></Form.Item></Col>
            <Col span={12}><Form.Item label="企微ID" name="wecomId"><Input placeholder="例如：wm_8a92" /></Form.Item></Col>
            <Col span={12}><Form.Item label="AI托管状态" name="hosted" valuePropName="checked"><Switch checkedChildren="开启" unCheckedChildren="关闭" /></Form.Item></Col>
          </Row>
          <Divider orientation="left">句子通道配置</Divider>
          <Row gutter={16}>
            <Col span={24}><Form.Item label="句子账号ID" name="juzibotAccountId"><Input placeholder="例如：jz_li_sales" /></Form.Item></Col>
            <Col span={24}><Form.Item label="API Key" name="juzibotApiKey"><Input.Password placeholder="请输入句子平台 API Key" /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </Space>
  );
}

function ConversationsPage({ activeWecom, activeConversationKey, visibleWecomKeys = managedWecomAccounts.map((item) => item.key) }) {
  const visibleConversations = conversations.filter((item) => visibleWecomKeys.includes(item.accountKey));
  const filteredConversations = visibleConversations.filter((item) => item.accountKey === activeWecom);
  const [selected, setSelected] = useState(visibleConversations.find((item) => item.key === activeConversationKey) || filteredConversations[0] || visibleConversations[0] || null);
  const [hostingMode, setHostingMode] = useState(selected?.hosted ? "ai" : "manual");
  const [manualReply, setManualReply] = useState("");
  const [composerItems, setComposerItems] = useState([]);
  useEffect(() => {
    setSelected(visibleConversations.find((item) => item.key === activeConversationKey) || filteredConversations[0] || visibleConversations[0] || null);
  }, [activeWecom, activeConversationKey, visibleWecomKeys.join("|")]);
  useEffect(() => {
    if (selected) setHostingMode(selected.hosted ? "ai" : "manual");
    setManualReply("");
    setComposerItems([]);
  }, [selected?.key]);
  const confirmHostingChange = (checked) => {
    Modal.confirm({
      title: checked ? "确认开启AI托管？" : "确认关闭AI托管？",
      content: checked ? "开启后，AI将继续参与该会话的接待与回复建议。" : "关闭后，该会话将切换为人工跟进。",
      okText: checked ? "确认开启" : "确认关闭",
      cancelText: "取消",
      onOk: () => setHostingMode(checked ? "ai" : "manual")
    });
  };
  const needsHumanIntervention = (item) => item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认";
  const addComposerItem = (type) => {
    const labelMap = {
      emoji: "表情：😊",
      image: "图片：课程截图.png",
      file: "文件：学习规划.pdf"
    };
    setComposerItems((items) => [...items, { id: `${type}-${Date.now()}`, type, label: labelMap[type] }]);
  };
  const removeComposerItem = (id) => {
    setComposerItems((items) => items.filter((item) => item.id !== id));
  };
  const sendManualReply = () => {
    if (!manualReply.trim() && composerItems.length === 0) return;
    setManualReply("");
    setComposerItems([]);
  };
  if (!selected) {
    return (
      <div className="wecom-workbench">
        <aside className="wecom-session-list">
          <div className="session-search">
            <Input.Search placeholder="搜索客户、群或消息" allowClear />
            <Button icon={<PlusOutlined />} />
          </div>
          <List className="session-list" dataSource={[]} locale={{ emptyText: "当前权限下暂无同步会话" }} />
        </aside>
        <main className="wecom-chat-panel">
          <div className="empty-chat-state">
            <Text type="secondary">请选择有会话数据的企微账号。</Text>
          </div>
        </main>
      </div>
    );
  }
  const currentStageIndex = selected.lifecycleStage || 0;
  const customerMessages = (selected.messages || []).filter((message) => message.from === "customer");
  const latestCustomerMessage = customerMessages[customerMessages.length - 1] || { text: selected.last, time: "10:20" };
  const chatPlans = [
    {
      key: "plan-1",
      planTime: "明天下午 15:00",
      topic: "按约定介绍课程内容",
      content: `围绕${selected.tags?.[0] || "孩子年级"}英语基础，说明试听课流程、课程模块和适合的班型，不直接强推报名。`,
      quote: latestCustomerMessage.text,
      quoteTime: latestCustomerMessage.time
    },
    {
      key: "plan-2",
      planTime: "试听课前 30 分钟",
      topic: "试听提醒与课前准备",
      content: "提醒家长准备孩子近期英语试卷或错题，确认设备、上课链接和可参与时间。",
      quote: selected.messages?.[0]?.text || selected.last,
      quoteTime: selected.messages?.[0]?.time || "09:58"
    },
    {
      key: "plan-3",
      planTime: "试听结束后 20 分钟",
      topic: "反馈学习问题并推动下一步",
      content: "总结孩子课堂表现、薄弱点和建议课程路径，询问家长是否需要确认班型和课时安排。",
      quote: latestCustomerMessage.text,
      quoteTime: latestCustomerMessage.time
    }
  ];
  return (
      <div className="wecom-workbench">
        <aside className="wecom-session-list">
        <div className="session-search">
          <Input.Search placeholder="搜索客户、群或消息" allowClear />
          <Button icon={<PlusOutlined />} />
        </div>
        <List
          className="session-list"
          dataSource={filteredConversations}
          locale={{ emptyText: "当前企微暂无同步会话" }}
          renderItem={(item) => (
            <List.Item className={selected.key === item.key ? "session-item active" : "session-item"} onClick={() => setSelected(item)}>
              <WecomAvatar item={item} unread={item.unread} />
              <div className="session-main">
                <div className="session-title-row">
                  <Space className="session-title-main" size={6}>
                    <Text strong ellipsis>{item.name}</Text>
                    <span className={`intent-pill intent-${item.intent}`}>{intentLabelMap[item.intent] || `${item.intent}意向`}</span>
                  </Space>
                  <Text type="secondary">10:20</Text>
                </div>
                <div className="session-meta-row">
                  <Text type="secondary" ellipsis>{item.last}</Text>
                  <Space size={4}>
                    {item.type === "group" ? <Tag color="green">群</Tag> : null}
                    {needsHumanIntervention(item) ? (
                      <Tooltip title="需要人工介入">
                        <span className="session-human-alert"><AlertOutlined /></span>
                      </Tooltip>
                    ) : item.hosted ? (
                      <Tag color="processing">托管</Tag>
                    ) : (
                      <Tag>人工</Tag>
                    )}
                  </Space>
                </div>
              </div>
            </List.Item>
          )}
        />
      </aside>
        <main className="wecom-chat-panel">
        <div className="chat-header">
          <div>
            <Space size={8} align="center">
              <Title level={4}>{selected.name}</Title>
              <Tag color="success">@微信</Tag>
              {selected.type === "group" ? <Tag color="green">群聊</Tag> : null}
            </Space>
          </div>
          <div className="hosting-switch-wrap">
            <Text className="hosting-label">托管给AI</Text>
            <Switch
              className="hosting-switch"
              checked={hostingMode === "ai"}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={confirmHostingChange}
            />
          </div>
        </div>
        <div className="wecom-message-area">
          {(selected.messages || []).map((message, index) => (
            <div key={`${message.time}-${index}`} className={`wecom-message ${message.from}`}>
              {message.from === "system" ? (
                <Text type="secondary">{message.text}</Text>
              ) : (
                <>
                  <WecomAvatar item={message.from === "customer" ? selected : { avatar: selected.owner.slice(0, 1), avatarImage: "./images/矩形 6.png", avatarColors: ["#c7d2fe", "#4f46e5"] }} size={36} />
                  <div>
                    {selected.type === "group" || message.sender ? <Text type="secondary" className="message-sender">{message.sender || selected.name}</Text> : null}
                    <div className="message-bubble">{message.text}</div>
                    {message.from === "ai" ? <Tag className="ai-visible-tag" color="processing">AI回复</Tag> : null}
                    <Text type="secondary" className="message-time">{message.time}</Text>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="chat-composer">
          <Input.TextArea
            key={`${selected.key}-manual`}
            value={manualReply}
            rows={4}
            placeholder="输入人工回复内容"
            onChange={(event) => setManualReply(event.target.value)}
          />
          {composerItems.length ? (
            <div className="composer-attachments">
              {composerItems.map((item) => (
                <Tag key={item.id} closable onClose={(event) => { event.preventDefault(); removeComposerItem(item.id); }}>
                  {item.label}
                </Tag>
              ))}
            </div>
          ) : null}
          <div className="composer-actions">
            <div className="composer-toolbar">
              <Tooltip title="发送表情"><Button shape="circle" icon={<SmileOutlined />} onClick={() => addComposerItem("emoji")} /></Tooltip>
              <Tooltip title="发送图片"><Button shape="circle" icon={<PictureOutlined />} onClick={() => addComposerItem("image")} /></Tooltip>
              <Tooltip title="发送文件"><Button shape="circle" icon={<PaperClipOutlined />} onClick={() => addComposerItem("file")} /></Tooltip>
            </div>
            <Button type="primary" icon={<SendOutlined />} onClick={sendManualReply}>发送</Button>
          </div>
        </div>
        </main>
        <aside className="customer-side-panel">
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: "profile",
              label: "用户信息",
              children: (
                <Space direction="vertical" size={16} className="full-width">
                  <div className="profile-card">
                    <WecomAvatar item={selected} size={58} />
                    <div>
                      <Title level={5}>{selected.name}</Title>
                      <span className={`intent-pill intent-${selected.intent}`}>{intentLabelMap[selected.intent] || `${selected.intent}意向`}</span>
                    </div>
                  </div>
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="备注">{selected.remark}</Descriptions.Item>
                    <Descriptions.Item label="电话">{selected.phone}</Descriptions.Item>
                    <Descriptions.Item label="企微ID">{selected.wecomId}</Descriptions.Item>
                    <Descriptions.Item label="添加时间">{selected.addedAt}</Descriptions.Item>
                  </Descriptions>
                  <Divider orientation="left">企微标签</Divider>
                  <div className="tag-group-list">
                    <div><Text type="secondary">用户运营</Text><Space wrap>{selected.tags.slice(0, 2).map((item) => <Tag color="blue" key={item}>{item}</Tag>)}</Space></div>
                    <div><Text type="secondary">客户状态</Text><Space wrap>{selected.tags.slice(2).concat(selected.lifecycle).map((item) => <Tag key={item}>{item}</Tag>)}</Space></div>
                    <div><Text type="secondary">渠道来源</Text><Space wrap><Tag color="cyan">企微</Tag><Tag color="cyan">SCRM</Tag></Space></div>
                  </div>
                </Space>
              )
            },
            {
              key: "orders",
              label: "订单信息",
              children: (
                <Space direction="vertical" size={12} className="full-width">
                  {(selected.orders || []).map((order) => (
                    <Card size="small" key={order.id} className="order-mini-card">
                      <Descriptions size="small" column={1}>
                        <Descriptions.Item label="订单号">{order.id}</Descriptions.Item>
                        <Descriptions.Item label="产品">{order.product}</Descriptions.Item>
                        <Descriptions.Item label="金额">{order.amount}</Descriptions.Item>
                        <Descriptions.Item label="状态">{order.status}</Descriptions.Item>
                        <Descriptions.Item label="付款时间">{order.paidAt}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  ))}
                </Space>
              )
            },
            {
              key: "lifecycle",
              label: "生命周期",
              children: (
                <div className="lifecycle-list">
                  {lifecycleStages.map((stage, index) => (
                    <div key={stage.title} className={index === currentStageIndex ? "lifecycle-item current" : index < currentStageIndex ? "lifecycle-item done" : "lifecycle-item"}>
                      <div className="lifecycle-index">{index + 1}</div>
                      <div>
                        <Text strong>{stage.title}</Text>
                        <Paragraph type="secondary">{stage.desc}</Paragraph>
                        <Space wrap>{(stage.skills || []).map((item) => <Tag key={item}>{item}</Tag>)}</Space>
                      </div>
                    </div>
                  ))}
                </div>
              )
            },
            {
              key: "plans",
              label: "聊天计划",
              children: (
                <div className="chat-plan-list">
                  {chatPlans.map((plan) => (
                    <Card size="small" key={plan.key} className="chat-plan-card">
                      <Space direction="vertical" size={8} className="full-width">
                        <Space className="full-width" align="start" style={{ justifyContent: "space-between" }}>
                          <Text strong>{plan.topic}</Text>
                          <Tag color="processing">{plan.planTime}</Tag>
                        </Space>
                        <Text>{plan.content}</Text>
                        <div className="plan-quote">
                          <Text type="secondary">{plan.quoteTime}</Text>
                          <Paragraph>{plan.quote}</Paragraph>
                        </div>
                      </Space>
                    </Card>
                  ))}
                </div>
              )
            }
          ]}
        />
        </aside>
      </div>
  );
}

function SuggestionsPage() {
  const [selected, setSelected] = useState(pendingMessages[0]);
  const pendingCount = pendingMessages.filter((item) => item.due !== "已自动发送").length;
  const autoCount = pendingMessages.filter((item) => item.sendMode === "自动发送").length;
  const highRiskCount = pendingMessages.filter((item) => item.risk === "高").length;
  const messageColumns = [
    { title: "客户", dataIndex: "customer", width: 100 },
    { title: "业务场景", dataIndex: "scenario", width: 120, render: (v, record) => <div><Text strong>{v}</Text><br /><Text type="secondary">{record.stage}</Text></div> },
    { title: "所属销售", dataIndex: "owner", width: 100 },
    { title: "命中 Skill", dataIndex: "skill", width: 140, render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "风险", dataIndex: "risk", width: 80, render: (v) => <Tag color={v === "高" ? "red" : v === "中" ? "gold" : "green"}>{v}</Tag> },
    { title: "真人感", dataIndex: "humanScore", width: 92, render: (v) => <Tag color={v >= 92 ? "success" : "gold"}>{v}分</Tag> },
    { title: "发送模式", dataIndex: "sendMode", width: 100, render: (v) => <Tag color={v === "自动发送" ? "processing" : "blue"}>{v}</Tag> },
    { title: "处理时限", dataIndex: "due", width: 110 },
    { title: "操作", fixed: "right", width: 220, render: (_, record) => (
      <Space wrap={false}>
        <Button size="small" type="primary" onClick={() => setSelected(record)}>发送</Button>
        <Button size="small" onClick={() => setSelected(record)}>改写</Button>
        <Button size="small" danger>转人工</Button>
      </Space>
    ) }
  ];
  const planColumns = [
    { title: "触达场景", dataIndex: "scene" },
    { title: "触发条件", dataIndex: "trigger" },
    { title: "转化目标", dataIndex: "target" },
    { title: "调用 Skill", dataIndex: "skill", render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "适用销售", dataIndex: "owner" },
    { title: "发送模式", dataIndex: "mode", render: (v) => <Tag color={v === "自动发送" ? "processing" : "blue"}>{v}</Tag> }
  ];
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Row gutter={[16, 16]}>
        {[
          ["待人工确认", pendingCount, "价格、合同、承诺类消息必须确认"],
          ["自动发送", autoCount, "低风险功能解释和常规提醒"],
          ["高风险消息", highRiskCount, "合同、价格、退款等敏感场景"],
          ["主动触达计划", proactivePlans.length, "按生命周期推动成交"],
          ["真人感均分", 91, "客户感知为销售本人沟通"]
        ].map(([label, value, desc]) => (
          <Col xs={24} md={12} xl={6} key={label}>
            <Card>
              <Statistic title={label} value={value} suffix={<Text type="secondary">{desc}</Text>} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title={<PanelTitle title="待发送建议" desc="AI以销售身份生成企微话术，先通过真人感质检，再按人工确认或自动发送规则处理。" />}>
            <Tabs
              items={[
                {
                  key: "messages",
                  label: "待确认消息",
                  children: (
                    <>
                      <Space className="toolbar" wrap>
                        <Select defaultValue="全部风险" options={["全部风险", "高", "中", "低"].map((value) => ({ value }))} />
                        <Select defaultValue="全部发送模式" options={["全部发送模式", "人工确认", "自动发送"].map((value) => ({ value }))} />
                        <Input.Search placeholder="搜索客户、场景或建议内容" allowClear />
                      </Space>
                      <Table className="admin-table" rowKey="key" columns={messageColumns} dataSource={pendingMessages} pagination={false} scroll={{ x: 1180 }} rowClassName={(record) => record.key === selected.key ? "table-row-selected" : ""} onRow={(record) => ({ onClick: () => setSelected(record) })} />
                    </>
                  )
                },
                {
                  key: "plans",
                  label: "主动触达计划",
                  children: <Table className="admin-table" rowKey="key" columns={planColumns} dataSource={proactivePlans} pagination={false} scroll={{ x: 1040 }} />
                }
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card className="suggestion-detail-card" title={<PanelTitle title="建议详情" desc="用于销售快速判断是否可以发送。" extra={<Tag color={selected.risk === "高" ? "red" : selected.risk === "中" ? "gold" : "green"}>{selected.risk}风险</Tag>} />}>
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="客户">{selected.customer}</Descriptions.Item>
              <Descriptions.Item label="场景">{selected.scenario}</Descriptions.Item>
              <Descriptions.Item label="转化目标">{selected.expected}</Descriptions.Item>
              <Descriptions.Item label="Skill">{selected.skill}</Descriptions.Item>
              <Descriptions.Item label="真人感评分">{selected.humanScore} 分</Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">建议话术</Divider>
            <Paragraph className="suggestion-preview">{selected.message}</Paragraph>
            <Divider orientation="left">真人感质检</Divider>
            <div className="human-check-list">
              {selected.humanSignals.map((item) => (
                <div key={item}>
                  <CheckCircleOutlined />
                  <Text>{item}</Text>
                </div>
              ))}
            </div>
            <Card size="small" className="human-rule-card" title="发送前原则">
              不主动提及AI、机器人、系统自动回复；敏感承诺转人工确认；优先引用客户上下文，让话术像销售本人接着聊。
            </Card>
            <Space wrap className="footer-actions">
              <Button type="primary" icon={<CheckCircleOutlined />}>确认发送</Button>
              <Button icon={<EditOutlined />}>改写</Button>
              <Button>忽略</Button>
              <Button danger icon={<AlertOutlined />}>转人工</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

function HumanizationPage() {
  const [testing, setTesting] = useState(false);
  const [previewMessages, setPreviewMessages] = useState([
    "了解，三年级阅读丢分一般要先看词汇、长句理解和做题习惯。可以先约一节诊断试听，老师会边上课边看孩子具体卡在哪里。",
    "我先帮您看下这周可约时间，费用和课程包让顾问老师结合孩子情况再确认，避免给您说不准。"
  ]);
  const humanizationPrompt = [
    "请把所有角色的回复改写成真实销售/老师本人在企微里自然沟通的语气，目标是降低AI味、减少模板感。",
    "",
    "拟人化要求：",
    "1. 先承接客户原话，再补充关键信息，不要一上来总结或讲大道理。",
    "2. 多用自然短句，允许轻微停顿和口语化表达，但不要过度热情。",
    "3. 避免出现“作为AI”“我是机器人”“根据系统规则”“无法提供”“请耐心等待”“感谢您的咨询”等机械表达。",
    "4. 复杂问题拆成2-3条回复，不要一次性堆满信息。",
    "5. 涉及价格、合同、效果承诺、退费等敏感内容时，不直接下结论，提醒人工老师确认。",
    "6. 优先引用客户上下文，例如孩子年级、英语基础、已上课节次、咨询目标，让回复像接着聊。",
    "7. 不主动暴露AI身份，不提系统自动回复，不使用客服式套话。",
    "",
    "回复节奏：先短句承接，再给建议；必要时下一条再补充安排或转人工。"
  ].join("\n");
  const roleOptions = [
    { value: "全部", label: "全部角色" },
    ...agents.map((item) => ({ value: item.name, label: item.name }))
  ];
  const handleTest = () => {
    setTesting(true);
    window.setTimeout(() => {
      setPreviewMessages([
        "明白，孩子三年级阅读总丢分，先别急着定课程，得先看是词汇、长句理解，还是做题习惯卡住了。",
        "可以先安排一节诊断试听，老师会边上课边看孩子具体问题。时间和费用我先帮您对一下，再让顾问老师按孩子情况确认，避免说不准。"
      ]);
      setTesting(false);
    }, 500);
  };
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} xl={15}>
          <Card title={<PanelTitle title="全局拟人化策略" desc="用提示词统一描述所有适用角色的语气、回复节奏和去AI味要求。" extra={<Button type="primary">保存设置</Button>} />}>
            <Form
              layout="vertical"
              initialValues={{
                enabled: true,
                roles: ["全部"],
                prompt: humanizationPrompt
              }}
            >
              <Form.Item label="启用全局拟人化" name="enabled" valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="停用" />
              </Form.Item>
              <Form.Item label="适用角色" name="roles">
                <Select mode="multiple" maxTagCount="responsive" options={roleOptions} placeholder="选择适用角色" />
              </Form.Item>
              <Form.Item label="拟人化要求提示词" name="prompt">
                <Input.TextArea className="humanization-prompt-input" rows={16} placeholder="请输入拟人化要求，例如语气、节奏、禁用表达、敏感内容处理方式等" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card className="humanization-preview-card" title={<PanelTitle title="测试效果预览" desc="测试当前提示词下输出内容是否自然、合理。" extra={<Button type="primary" loading={testing} onClick={handleTest}>测试效果</Button>} />}>
            <Form layout="vertical" initialValues={{ testInput: "孩子三年级，英语基础一般，阅读总丢分。想先了解试听课怎么安排，费用大概多少？" }}>
              <Form.Item label="测试用户输入" name="testInput">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
            <div className="humanization-chat-preview">
              <div className="preview-bubble customer">孩子三年级，英语基础一般，阅读总丢分。想先了解试听课怎么安排？</div>
              {previewMessages.map((item, index) => (
                <div className={index === 0 ? "preview-bubble ai" : "preview-bubble ai secondary"} key={item}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

function SettingsPage({ platform }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [accountRows, setAccountRows] = useState(accounts);
  const columns = [
    { title: "姓名", dataIndex: "name" },
    { title: "所属企业", dataIndex: "company" },
    { title: "角色", dataIndex: "role" },
    { title: "手机号", dataIndex: "phone" },
    { title: "状态", dataIndex: "status", render: statusTag },
    {
      title: "操作",
      fixed: "right",
      width: 130,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setEditing(record)}>编辑</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除账号", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setAccountRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  return (
    <>
      <Card title={<PanelTitle title="账号列表" desc={platform ? "平台管理员可查看和维护平台下账号。" : "当前只显示本企业账号。"} extra={<Button type="primary" onClick={() => setOpen(true)}>新增账号</Button>} />}>
        <Table className="admin-table" rowKey="key" columns={columns} dataSource={platform ? accountRows : accountRows.slice(1)} pagination={false} scroll={{ x: 860 }} />
      </Card>
      <AccountModal title="新增账号" open={open} platform={platform} onClose={() => setOpen(false)} />
      <AccountModal title="编辑账号" account={editing} open={Boolean(editing)} platform={platform} onClose={() => setEditing(null)} />
    </>
  );
}

function AccountModal({ title, open, account, platform, onClose }) {
  return (
    <Modal title={title} open={open} onCancel={onClose} onOk={onClose} okText="保存账号" cancelText="取消" width={680}>
      <Form
        layout="vertical"
        key={account?.key || title}
        initialValues={{
          name: account?.name,
          company: companies.find((item) => item.name === account?.company)?.id || "company-1",
          role: account?.role || (platform ? "平台管理员" : "企业管理员"),
          phone: account?.phone,
          login: account?.key ? `${account.key}@company.com` : undefined,
          enabled: account?.status !== "停用"
        }}
      >
        <Row gutter={16}>
          <Col span={12}><Form.Item label="姓名" name="name"><Input placeholder="例如：赵经理" /></Form.Item></Col>
          <Col span={12}><Form.Item label="所属企业" name="company"><Select options={companies.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="角色" name="role"><Select options={["平台管理员", "企业管理员", "销售主管", "知识库运营", "真人销售"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="手机号" name="phone"><Input placeholder="例如：13800008888" /></Form.Item></Col>
          <Col span={24}><Form.Item label="登录账号" name="login"><Input placeholder="例如：manager@company.com" /></Form.Item></Col>
          <Col span={24}><Form.Item label="账号状态" name="enabled" valuePropName="checked"><Switch checkedChildren="启用" unCheckedChildren="停用" /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function AppShell({ user, onLogout }) {
  const initialRoute = location.hash?.replace("#", "") || "dashboard";
  const allowedMenuItems = menuItems.filter((item) => user.menuKeys.includes(item.key));
  const allowedPageTitle = Object.fromEntries(allowedMenuItems.map((item) => [item.key, item.label]));
  const [route, setRoute] = useState(allowedPageTitle[initialRoute] ? initialRoute : "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const userWecomAccounts = managedWecomAccounts.filter((item) => user.wecomKeys.includes(item.key));
  const [activeOrg, setActiveOrg] = useState("all");
  const [activeWecom, setActiveWecom] = useState(userWecomAccounts[0]?.key || managedWecomAccounts[0].key);
  const [activeConversationKey, setActiveConversationKey] = useState("");
  const platform = user.role === "platform_admin";
  const showOrgSwitch = user.role !== "employee";
  const scopedWecomAccounts = userWecomAccounts.filter((item) => activeOrg === "all" || item.department === activeOrg || item.employee === activeOrg);
  const visibleWecomAccounts = scopedWecomAccounts.length ? scopedWecomAccounts : userWecomAccounts;
  const visibleWecomKeys = visibleWecomAccounts.map((item) => item.key);
  const scopedConversations = conversations.filter((item) => visibleWecomKeys.includes(item.accountKey));
  const orgOptions = [
    { value: "all", label: user.role === "platform_admin" ? "组织架构 / 全部企业员工" : "组织架构 / 本企业员工" },
    ...Array.from(new Set(userWecomAccounts.map((item) => item.department))).map((value) => ({ value, label: `部门 / ${value}` })),
    ...userWecomAccounts.map((item) => ({ value: item.employee, label: `${item.department} / ${item.employee}` }))
  ];

  useEffect(() => {
    window.history.replaceState(null, "", `#${route}`);
  }, [route]);

  useEffect(() => {
    if (!allowedPageTitle[route]) setRoute("dashboard");
  }, [route, allowedPageTitle]);

  useEffect(() => {
    if (!visibleWecomKeys.includes(activeWecom)) {
      setActiveWecom(visibleWecomKeys[0] || managedWecomAccounts[0].key);
      setActiveConversationKey("");
    }
  }, [activeWecom, visibleWecomKeys.join("|")]);

  const handleViewConversation = (record) => {
    setActiveWecom(record.accountKey);
    setActiveConversationKey(record.key);
    setRoute("conversations");
  };

  const content = useMemo(() => ({
    dashboard: <Dashboard setRoute={setRoute} conversationsData={scopedConversations} />,
    customers: <CustomersPage onViewConversation={handleViewConversation} visibleWecomKeys={visibleWecomKeys} />,
    company: <CompanyPage platform={platform} />,
    agent: <AgentPage />,
    strategy: <StrategyPage />,
    knowledge: <KnowledgePage />,
    wecom: <WecomPage />,
    sales: <SalesPage />,
    humanization: <HumanizationPage />,
    conversations: <ConversationsPage activeWecom={activeWecom} activeConversationKey={activeConversationKey} visibleWecomKeys={visibleWecomKeys} />,
    suggestions: <SuggestionsPage />,
    settings: <SettingsPage platform={platform} />
  })[route], [route, platform, activeWecom, activeConversationKey, visibleWecomKeys.join("|")]);

  return (
    <Layout className="app-layout">
      <Sider className="app-sider" width={176} collapsedWidth={80} collapsed={collapsed} trigger={null}>
        <div className="brand">
          <div className="brand-mark">AI</div>
          {!collapsed ? <Title level={4}>AISA</Title> : null}
          <Tooltip title={collapsed ? "展开导航" : "收起导航"} placement={collapsed ? "right" : "bottom"}>
            <Button
              className="sider-collapse-button"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
            />
          </Tooltip>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[route]} items={allowedMenuItems} onClick={({ key }) => setRoute(key)} />
        {!collapsed ? <Card className="sider-status" size="small">
          <Space><Badge status="success" /><div><Text strong>企微通道正常</Text><br /><Text type="secondary">最近同步 14:20</Text></div></Space>
        </Card> : null}
      </Sider>
      <Layout>
        <Header className="app-header">
          <Space className="header-title-wrap" align="center">
            <div className="page-heading">
              <Title level={2}>{allowedPageTitle[route] || pageTitle[route]}</Title>
              {route === "conversations" ? (
                <>
                  {showOrgSwitch ? (
                    <Select
                      className="wecom-account-switch"
                      value={activeOrg}
                      onChange={(value) => {
                        setActiveOrg(value);
                        setActiveConversationKey("");
                      }}
                      options={orgOptions}
                    />
                  ) : null}
                  <Select
                    className="wecom-account-switch"
                    value={activeWecom}
                    onChange={(value) => {
                      setActiveWecom(value);
                      setActiveConversationKey("");
                    }}
                    options={visibleWecomAccounts.map((item) => ({ value: item.key, label: `${item.label}（${item.account}）` }))}
                  />
                </>
              ) : null}
            </div>
          </Space>
          <Space className="header-actions" wrap>
            {platform ? <Select className="company-select" defaultValue="星河教育科技" options={companies.map((item) => ({ value: item.name, label: item.name }))} prefix="企业" /> : <Tag color="blue">{user.company}</Tag>}
            <Button icon={<AlertOutlined />} />
            <Button shape="round" icon={<Avatar size={24}>{user.badge}</Avatar>}>{user.name}</Button>
            <Button onClick={onLogout}>退出</Button>
          </Space>
        </Header>
        <Content className="app-content">{content}</Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  const storedAccount = localStorage.getItem("sales-ai-auth-account");
  const [user, setUser] = useState(loginAccounts[storedAccount] || null);
  const handleLogin = (account) => {
    const accountKey = loginAccounts[String(account).trim()] ? String(account).trim() : "1";
    const nextUser = loginAccounts[accountKey];
    localStorage.setItem("sales-ai-auth-account", accountKey);
    localStorage.removeItem("sales-ai-auth-role");
    setUser(nextUser);
  };
  const handleLogout = () => {
    localStorage.removeItem("sales-ai-auth-account");
    localStorage.removeItem("sales-ai-auth-role");
    setUser(null);
  };

  return (
    <ConfigProvider theme={{ token: { borderRadius: 8, colorPrimary: "#1b63d9", fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif' } }}>
      <AntApp>
        {user ? <AppShell user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
      </AntApp>
    </ConfigProvider>
  );
}
