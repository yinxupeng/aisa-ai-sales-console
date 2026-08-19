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
  Drawer,
  Form,
  Input,
  InputNumber,
  Layout,
  List,
  Menu,
  Modal,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Tree,
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
  ClockCircleOutlined,
  CloudSyncOutlined,
  CommentOutlined,
  DashboardOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PaperClipOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
  TagsOutlined,
  ToolOutlined,
  UploadOutlined,
  RobotOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  VideoCameraOutlined,
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

const humanizationStrategyOptions = [
  { value: "friendly", label: "亲和自然型" },
  { value: "professional", label: "专业顾问型" },
  { value: "conversion", label: "高转化引导型" }
];

const strategies = [
  {
    key: "s1",
    name: "19元A类课-课前",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "加好友后 / 课前预热 / 课程提醒",
    channel: "Sabuddy内部能力",
    input: "客户档案、用户标签、课程排期、最近会话",
    output: "课前沟通话术、上课提醒、问题收集",
    agent: "小学英语课程顾问",
    calls: 128,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "启用"
  },
  {
    key: "s2",
    name: "19元A类课-第一课",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "第一课前提醒 / 第一课后反馈",
    channel: "Sabuddy内部能力",
    input: "第一课课程状态、听课数据、客户档案、最近会话",
    output: "第一课提醒、课后反馈收集、下一步跟进话术",
    agent: "小学英语课程顾问",
    calls: 86,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "启用"
  },
  {
    key: "s3",
    name: "19元A类课-第二课",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "第二课课前提醒 / 第二课完成后回访",
    channel: "Sabuddy内部能力",
    input: "第二课课程状态、听课时长、前一课反馈、用户标签",
    output: "第二课提醒、学习问题追问、课程价值铺垫",
    agent: "小学英语课程顾问",
    calls: 42,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "启用"
  },
  {
    key: "s4",
    name: "19元A类课-第三课",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "第三课课前提醒 / 第三课完成后回访",
    channel: "Sabuddy内部能力",
    input: "第三课课程状态、阶段反馈、用户标签、销售策略",
    output: "第三课提醒、阶段问题总结、转化时机判断",
    agent: "小学英语课程顾问",
    calls: 37,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "停用"
  },
  {
    key: "s4-1",
    name: "19元A类课-第四课",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "第四课课前提醒 / 第四课完成后回访",
    channel: "Sabuddy内部能力",
    input: "第四课课程状态、前三课反馈、客户档案、用户标签",
    output: "第四课提醒、完整体验总结、报名顾虑收集",
    agent: "小学英语课程顾问",
    calls: 31,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "启用"
  },
  {
    key: "s4-2",
    name: "19元A类课-课后",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "课程完成 / 课后反馈 / 报名意向识别",
    channel: "Sabuddy内部能力",
    input: "完整课程记录、课后反馈、用户标签、销售策略",
    output: "课后总结、报名转化引导、人工跟进建议",
    agent: "小学英语课程顾问",
    calls: 29,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "启用"
  },
  {
    key: "s5",
    name: "客户运营策略智能体",
    agentCategory: "策略智能体",
    type: "策略编排",
    trigger: "定时任务 / 阶段进入 / 标签变化 / 课程事件",
    channel: "Sabuddy内部能力",
    input: "客户档案、会话记录、课程状态、标签、订单、听课数据",
    output: "销售策略、客户标签、策略提示词、定时任务、人工提醒",
    agent: "销售策略中心",
    calls: 64,
    createdAt: "2026-08-18 10:20:16",
    updatedAt: "2026-08-19 15:42:03",
    status: "启用"
  }
];

const userProfileSkillPrompt = `# Skill目标
将客户企微对话、历史摘要和系统状态整理成可沉淀的客户画像，供后续智能体、运营和真人销售使用。

这个 Skill 不直接生成给用户发送的话术，主要输出结构化判断和跟进建议。

## 适用场景
- 客户刚进入一个新的服务阶段
- 家长连续发送多条孩子情况，需要统一抓主线
- 智能体准备进入诊断、扩需或推品前
- 阶段结束时，需要把本阶段结论沉淀到客户档案
- 真人销售接手前，需要快速理解客户背景

## 输入上下文
- 当前用户消息：{{message.text}}
- 最近聊天记录：{{conversation.recent_messages}}
- 历史对话摘要：{{chat_extract}}
- 当前客户档案：{{customer.profile}}
- 购买状态：{{purchase_status}}
- 听课状态：{{listening_duration}}
- 当前服务阶段：{{agent.stage}}

## 可调用工具
如果客户档案缺失，但系统里可能已有三方资料，可以调用：
@tool.callThirdPartyApi({
  api: "customer_profile",
  customerId: "{{customer.id}}",
  wecomId: "{{customer.wecom_id}}"
})

工具调用后，只使用接口返回的明确字段，不要补写推测信息。

如果工具失败，继续基于聊天记录总结，并在输出里标记资料来源为聊天记录。

## 可引用知识库
本 Skill 通常不需要引用产品知识库。
如果需要理解课程状态或服务阶段，可以参考 @kb.家长高频问题知识库 中的课程状态说明。

## 处理步骤
1. 合并最近聊天记录和历史摘要，去重，不重复记录同一件事
2. 提取孩子基础信息，未知字段写未知
3. 判断当前最核心的问题主线，只选 1-2 个，不罗列过多
4. 提取家长痛点和家长当前归因方式
5. 判断是否有风险信号，例如长期休学、自伤表达、明显躯体不适、彻底拒绝沟通
6. 判断购买意向和沟通阶段，例如定需中、已认可分析、问价、犹豫、已拒绝
7. 给出下一步建议，建议要服务智能体决策，不要写成用户话术

## 输出格式
### 用户画像摘要
- 孩子基础信息：
- 主要问题主线：
- 家长痛点：
- 家庭互动模式：
- 购买意向：
- 风险信号：

### 下一步建议
- 建议动作：追问 / 轻判断 / 下诊断 / 扩需 / 推品 / 催上课 / 转人工
- 建议原因：
- 真人销售备注：

### 可写入客户档案字段
- 孩子年龄：
- 孩子问题：
- 家长痛点：
- 购买意向：
- 沟通建议：

## 示例
输入：家长说孩子初二，半年不想上学，天天玩手机，一说学习就吵，自己也不知道怎么办

输出：
### 用户画像摘要
- 孩子基础信息：初二，其他信息未知
- 主要问题主线：厌学和亲子对抗并存，学习话题已成为冲突触发点
- 家长痛点：无力、焦虑，不知道怎么沟通
- 家庭互动模式：家长越催学习，孩子越用手机和顶撞逃避
- 购买意向：已有求助信号，但还未明确问服务
- 风险信号：长期厌学，需要继续确认是否休学、躯体不适或安全风险

### 下一步建议
- 建议动作：下诊断
- 建议原因：基础信息已足够形成初步判断，家长有求助信号
- 真人销售备注：后续可重点观察是否适合家庭守护计划或咨询服务

## 约束
- 不做疾病诊断
- 不承诺效果
- 不编造孩子年龄、购买状态、课程状态
- 不暴露系统字段名或内部规则
- 不输出长篇报告，重点服务后续决策`;

const salesTimingSkillPrompt = `# Skill目标
判断当前对话是否适合进入销售推进，并给出下一步动作建议。

这个 Skill 是策略判断能力，不直接生成最终回复。它帮助智能体决定这一轮应该追问、诊断、扩需、推品、催上课、收尾还是转人工。

## 适用场景
- 每轮回复前做一次轻量判断
- 用户表达认可、求助、问价格、问服务、要链接时
- 用户课后反馈课程有帮助时
- 用户反驳、觉得被推销、情绪崩溃时
- 智能体连续多轮没有推进，需要判断是否进入下一步

## 输入上下文
- 当前用户消息：{{message.text}}
- 最近 5-10 轮对话：{{conversation.recent_messages}}
- 用户画像总结：{{skill.user_profile_summary}}
- 当前阶段：{{agent.stage}}
- 购买状态：{{purchase_status}}
- 今日听课时长：{{listening_duration}}
- 上一轮智能体动作：{{agent.last_action}}

## 可调用工具
通常不需要调用工具。
如果购买状态或听课状态为空，但判断依赖这些信息，可以请求智能体调用业务工具后再执行本 Skill：
@tool.callThirdPartyApi({
  api: "customer_status",
  customerId: "{{customer.id}}"
})

工具返回后，只使用明确字段，例如已购买、未购买、听课 0 分钟、听课 60 分钟。

## 判断优先级
1. 强购买信号优先
   用户问价格、服务、咨询、怎么买、给链接时，不要回避，应正面承接。

2. 安全风险优先
   用户提到自伤、轻生、极端行为、严重失控时，优先转人工或建议专业支持，不用风险压单。

3. 信任和信息充足度
   已了解主要问题、持续时间、家长处理方式，并且家长认可分析或表达求助，才适合主动推品。

4. 用户反感时降级
   用户觉得你在推销、不认可判断、只想结束时，不连续推品，先回到问题判断或收尾。

5. 课后认可窗口
   用户课后说有帮助、说到我家了、确实是这样，可以主动铺垫更针对性的方案。

## 动作枚举
- 继续追问：信息不足，只问一个关键问题
- 轻判断：信息较少，先给一句判断再追问
- 下诊断：信息足够，输出阶段性判断
- 扩需：家长已理解问题，提示拖延风险和行动必要性
- 软推品：只说需要系统支持或专业帮助，不报产品名和价格
- 产品介绍：结合客户情况介绍一个产品
- 回答价格：用户主动问价时正面回答，并调用对应知识库
- 催上课：推品条件不成熟时作为保底推进
- 转人工：高风险、复杂咨询、强投诉或明确要求人工时
- 收尾：用户明确结束且上一轮已完成回答

## 输出格式
### 推进判断
- 推品判断：可推品 / 先铺垫 / 不推品 / 转人工
- 推进强度：低 / 中 / 高
- 推荐动作：
- 判断依据：

### 给智能体的执行建议
- 本轮应该做什么：
- 本轮不要做什么：
- 是否需要调用知识库：
- 是否需要真人销售关注：

## 示例
输入：家长说你说得挺对的，那我现在到底该怎么办

输出：
### 推进判断
- 推品判断：可推品
- 推进强度：高
- 推荐动作：产品介绍
- 判断依据：用户认可分析并出现明确求助信号，已具备承接后续方案的条件

### 给智能体的执行建议
- 本轮应该做什么：结合孩子问题推荐一个最合适的服务方向
- 本轮不要做什么：不要同时介绍多个产品，不要直接发链接
- 是否需要调用知识库：需要，调用对应产品知识库确认服务内容
- 是否需要真人销售关注：是，可提示真人销售准备承接咨询或方案说明

## 约束
- 不直接生成完整销售话术
- 不编造价格、服务内容和链接
- 不因为风险信号而恐吓成交
- 不在用户没有信任基础时强推产品`;

const productMatchSkillPrompt = `# Skill目标
在推品时机成立后，判断当前客户最适合推荐哪个产品或服务，并说明推荐依据。

这个 Skill 负责产品选择，不负责最终成交话术。产品事实必须来自知识库。

## 适用场景
- 用户主动问有什么服务、多少钱、怎么咨询
- 用户问家庭守护、咨询、菌群、4980 的区别
- 用户认可分析并问那怎么办
- 用户课后反馈课程有帮助
- 用户嫌贵，需要判断是否降阶或换低门槛承接

## 输入上下文
- 用户画像总结：{{skill.user_profile_summary}}
- 推品时机判断：{{skill.sales_timing_result}}
- 用户当前问题：{{message.text}}
- 购买状态：{{purchase_status}}
- 是否已拒绝 4980：{{course_rejection.is_rejected}}
- 拒绝原因：{{course_rejection.reason}}
- 产品知识库检索结果：{{kb.product_result}}

## 必须引用的知识库
推荐前先按用户问题引用对应知识库：
- 用户问家庭守护计划：@kb.产品知识库_家庭守护计划
- 用户问咨询、1v1、398：@kb.产品知识库_咨询服务
- 用户问菌群、睡眠、消化：@kb.产品知识库_菌群服务
- 用户问课程、体验课、4980：@kb.小学英语课程知识库 或 @kb.4980知识点总结
- 用户问价格、优惠、退费边界：@kb.价格政策与异议处理库

## 工具调用写法
如果需要确认订单状态或已购课程，可以调用：
@tool.callThirdPartyApi({
  api: "order_status",
  customerId: "{{customer.id}}",
  phone: "{{customer.phone}}"
})

如果需要生成购买链接，不在本 Skill 内直接发链接，只输出建议：
@tool.createPurchaseLink({
  product: "家庭守护计划三阶",
  customerId: "{{customer.id}}"
})

如果当前工具不可用，则输出：需要人工确认链接，不要自行拼接链接。

## 产品匹配规则
### 家庭守护计划
适合：
- 孩子问题长期、反复、复杂
- 厌学、闭门不出、亲子冲突明显
- 家长试过很多方法但无效
- 家庭互动模式需要持续陪跑调整
- 课后认可课程，但明显需要落地支持

不适合：
- 信息很少，尚未判断清楚
- 用户明确预算压力大且没有强求助信号
- 用户只问体验课固定信息

### 咨询服务
适合：
- 用户主动问咨询、1v1、能不能约老师
- 情况复杂，需要专业评估
- 孩子或家长愿意进一步梳理
- 高风险场景需要人工深入判断
- 用户对长期方案犹豫，需要低门槛承接

### 4980课程
适合：
- 问题较轻
- 家长主要需要先系统学习认知和方法
- 预算有限
- 用户尚未购买 4980

### 菌群服务
适合：
- 睡眠、消化、疲劳、注意力、身体状态线索明显
- 作为辅助方向，不替代咨询、课程或家庭守护

## 输出格式
### 产品匹配结果
- 推荐产品：
- 推荐等级：强推荐 / 可推荐 / 暂不推荐
- 推荐理由：
- 不建议推荐的产品：
- 需要引用的知识库：
- 是否需要工具或人工确认：

### 给智能体的话术方向
- 引出方式：
- 需要避开的表达：

## 示例
输入：孩子初二，厌学半年，闭门不出，家长说办法都试过了，刚问有没有更系统的服务

输出：
### 产品匹配结果
- 推荐产品：家庭守护计划
- 推荐等级：强推荐
- 推荐理由：孩子问题长期化，已出现厌学和封闭，家长方法失效，需要周期陪跑和家庭互动调整
- 不建议推荐的产品：单独推 4980 不优先，因为家长已经不是只缺认知学习
- 需要引用的知识库：产品知识库_家庭守护计划
- 是否需要工具或人工确认：介绍服务前先查知识库；发链接前需要确认具体阶数

### 给智能体的话术方向
- 引出方式：先说明光靠家长自己摸索很难落地，再引出更系统的陪跑方案
- 需要避开的表达：不要承诺一定解决，不要说孩子问题会越来越严重来压单

## 约束
- 一次只推荐一个主产品
- 不编造价格和服务次数
- 不把菌群说成治疗方案
- 不把咨询说成固定适合所有人
- 用户主动问某个产品时，先回答所问产品，再判断是否需要补充建议`;

const fixedTopicSkillPrompt = `# Skill目标
识别并处理用户关于课程、链接、回放、赠课、奖励资料等固定话题的问题，生成准确、简短、可发送的回复。

这个 Skill 用来避免智能体临场编造课程时间、链接、老师、奖励资料和课程内容。

## 适用场景
- 用户问上课时间、今天有没有课、几点开始
- 用户问直播链接、回放链接、进不去怎么办
- 用户问体验课讲什么、几天课、谁来讲
- 用户问韩冰老师 6 节脑科学赠课
- 用户问第一天完课奖励、100 条奖励清单
- 用户问固定资料、课程安排、老师信息

## 输入上下文
- 当前用户问题：{{message.text}}
- 所有课程信息：{{all_courses_info}}
- 今日课程开始时间：{{current_lesson_start_time}}
- 今日听课时长：{{listening_duration}}
- 当前时间：{{current_datetime}}
- 课程知识库结果：{{kb.course_result}}

## 可调用工具
需要判断当前时间时，可以调用：
@tool.getCurrentDatetime()

需要查询课程信息时，可以调用：
@tool.callThirdPartyApi({
  api: "course_schedule",
  customerId: "{{customer.id}}",
  courseId: "{{course.id}}"
})

工具失败时：
- 不编造时间
- 使用兜底话术：具体时间我帮您确认一下，确认后发您

## 可引用知识库
- 体验课内容和老师信息：@kb.小学英语课程知识库
- 高频问题：@kb.家长高频问题知识库
- 价格和政策：@kb.价格政策与异议处理库

## 固定话题规则
### 上课时间
如果系统字段有真实时间，直接使用真实时间。
如果没有真实时间，不说今天、今晚、明天、19 点、7 点。

### 回放
优先引导直播；用户明确赶不上或要回放时，再说明后续补发。

### 体验课内容
用知识库内容概览，不展开成课程说明书。
每节课最多 1 句话。

### 韩冰老师赠课
用户问到即可发赠课说明。
不要说买 4980 才有。
如果用户问体验课是不是韩冰老师讲，要说明韩冰老师负责赠课录播，不参与体验课直播授课。

### 完课奖励
只有用户明确问第一天完课奖励、100 条清单，且当前时间在规则允许范围内，才输出奖励领取说明。
用户只说我上完课了，先问听课感受，不直接发奖励。

## 输出格式
### 固定话题识别
- 命中话题：
- 是否需要工具：
- 是否需要知识库：
- 是否信息充足：

### 可发送回复
直接给出 1 段微信私聊式回复，控制在 30-80 字。

### 兜底说明
如果信息不足，说明缺什么，以及应该怎么兜底。

## 示例
输入：今晚几点上课？
系统字段：今日课程开始时间为空

输出：
### 固定话题识别
- 命中话题：上课时间
- 是否需要工具：可以查询课程安排
- 是否需要知识库：否
- 是否信息充足：否

### 可发送回复
我这边先帮您确认一下今天具体开课时间，确认后发您

### 兜底说明
课程时间缺失，禁止编造具体几点

## 约束
- 不编造时间、链接、课程内容和授课老师
- 不在固定问题里顺势硬推产品
- 不输出内部字段名
- 最终话术短句、自然、像微信私聊`;

const complianceSkillPrompt = `# Skill目标
在智能体回复发送前进行合规、事实和体验检查，发现风险后给出修改建议或改写后的可发送回复。

这个 Skill 是最后一道门，只判断拟发送内容是否能发，不负责推进销售流程。

## 适用场景
- 每次回复发送前
- 涉及心理问题、安全风险、价格、产品、链接、课程时间时
- 用户情绪崩溃、自责、反驳、投诉时
- 智能体准备推品、报价、发链接、转人工时

## 输入上下文
- 用户最新消息：{{message.text}}
- 拟发送回复：{{draft.reply}}
- 当前智能体阶段：{{agent.stage}}
- 已调用知识库：{{kb.used_sources}}
- 已调用工具：{{tool.used_tools}}
- 产品匹配建议：{{skill.product_match_result}}

## 可引用知识库
如果回复涉及价格、服务内容、退费、优惠：
@kb.价格政策与异议处理库

如果回复涉及课程、老师、上课方式：
@kb.小学英语课程知识库

如果回复涉及产品服务边界：
@kb.产品知识库_家庭守护计划
@kb.产品知识库_咨询服务
@kb.产品知识库_菌群服务

## 工具调用检查
如果拟回复里出现了链接、课程时间、订单状态，但没有对应工具或知识库来源，判定为需修改。

允许的工具引用示例：
@tool.callThirdPartyApi({
  api: "course_schedule",
  customerId: "{{customer.id}}"
})

@tool.createPurchaseLink({
  product: "{{product.name}}",
  customerId: "{{customer.id}}"
})

如果工具返回失败，不允许自行补链接或补时间，应改成确认后再发。

## 检查清单
### 医疗和心理边界
- 是否做疾病诊断，例如抑郁症、焦虑症、精神病
- 是否给药物、剂量、治疗建议
- 是否说治疗、治愈、保证改善

### 销售边界
- 是否承诺效果
- 是否恐吓式销售
- 是否在没有购买信号时强推
- 是否一次推荐多个产品导致信息过载
- 是否乱报价或拿 A 产品价格回答 B 产品

### 事实边界
- 是否编造课程时间、链接、老师、服务次数、咨询师身份
- 是否引用了不存在的产品名
- 是否在知识库冲突时仍按提示词胡编

### 表达体验
- 是否太长，像报告或科普文
- 是否过度共情或反复说我理解您
- 是否用了内部术语、阶段编号、系统字段
- 是否最后一句不自然，微信私聊感不足

## 输出格式
### 检查结果
- 是否通过：通过 / 需修改 / 必须拦截
- 风险等级：低 / 中 / 高
- 风险点：

### 修改建议
- 应删除：
- 应补充：
- 应调用的知识库或工具：

### 改写后回复
如果需修改，给出一版可直接发送的回复。
如果通过，写无需改写。

## 示例
拟发送回复：您孩子这是抑郁症前兆，再不买家庭守护计划肯定会更严重，我现在给您发链接

输出：
### 检查结果
- 是否通过：必须拦截
- 风险等级：高
- 风险点：做了疾病诊断；恐吓式销售；承诺式引导购买；未确认产品适配和链接来源

### 修改建议
- 应删除：抑郁症前兆、肯定会更严重、直接发链接
- 应补充：先客观说明风险，并建议必要时专业评估
- 应调用的知识库或工具：如需介绍服务，先调用对应产品知识库

### 改写后回复
孩子现在这些表现确实不能只当成闹情绪看。先把压力来源和家庭互动看清楚更重要，必要时也建议让专业老师进一步评估一下

## 约束
- 不新增事实
- 不替代知识库报价
- 不为了成交放宽安全边界
- 输出要帮助智能体修改回复，而不是继续销售`;

const aiSkills = [
  {
    key: "aiskill-1",
    name: "用户画像总结",
    description: "从企微聊天记录和历史摘要中提炼孩子情况、家长痛点、家庭互动、购买意向和下一步沟通建议，沉淀到客户档案供后续智能体和真人销售查看。",
    type: "信息总结",
    outputType: "结构化档案",
    outputTargets: ["客户档案", "会话记录"],
    scenario: "客户进入新阶段、连续发送大量信息、阶段结束复盘",
    trigger: "阶段开始 / 大量信息输入 / 阶段结束",
    input: "最近聊天记录、历史对话摘要、购买状态、课程状态",
    output: "孩子画像、家长痛点、家庭互动模式、购买意向、下一步建议",
    boundAgents: ["【19a】Day0", "【19a】Day1"],
    status: "启用",
    createdAt: "2026-08-17 10:20:00",
    updatedAt: "2026-08-17 11:12:36",
    prompt: userProfileSkillPrompt,
    knowledgeBaseKeys: ["kb-1"],
    toolKeys: ["tool-5"]
  },
  {
    key: "aiskill-2",
    name: "推品时机判断",
    description: "判断当前对话是否适合进入推品、只做铺垫、继续定需扩需，或退回上课引导，避免过早销售和错过购买信号。",
    type: "策略判断",
    outputType: "策略判断",
    outputTargets: ["智能体内部", "生成真人销售建议"],
    scenario: "家长认可分析、表达求助、主动问价格或服务、课后反馈有帮助",
    trigger: "每轮回复前 / 命中购买信号时",
    input: "最近对话、用户画像、当前阶段、购买状态、听课状态",
    output: "是否推品、推进强度、推荐动作、判断依据",
    boundAgents: ["【19a】Day0", "【19a】Day1"],
    status: "启用",
    createdAt: "2026-08-17 10:28:00",
    updatedAt: "2026-08-17 11:16:22",
    prompt: salesTimingSkillPrompt,
    knowledgeBaseKeys: ["kb-1"],
    toolKeys: ["tool-5"]
  },
  {
    key: "aiskill-3",
    name: "产品匹配建议",
    description: "根据孩子问题、家长诉求、咨询接受度、预算信号和购买状态，判断更适合家庭守护计划、咨询服务、4980课程还是菌群服务。",
    type: "产品匹配",
    outputType: "策略判断",
    outputTargets: ["智能体内部", "生成真人销售建议"],
    scenario: "用户问服务、问价格、表达求助、课后认可课程",
    trigger: "推品时机成立后 / 用户主动问服务时",
    input: "用户画像、购买状态、产品知识库、价格异议、咨询接受度",
    output: "推荐产品、推荐理由、禁推产品、知识库调用建议",
    boundAgents: ["【19a】Day1", "【19a】Day2"],
    status: "启用",
    createdAt: "2026-08-17 10:40:00",
    updatedAt: "2026-08-17 11:20:18",
    prompt: productMatchSkillPrompt,
    knowledgeBaseKeys: ["kb-2", "kb-3"],
    toolKeys: ["tool-5"]
  },
  {
    key: "aiskill-4",
    name: "固定话题回复",
    description: "处理上课时间、回放、体验课内容、韩冰老师赠课、奖励清单等固定问题，优先引用真实课程信息和知识库，不让智能体临场编造。",
    type: "固定话题回复",
    outputType: "建议话术",
    outputTargets: ["智能体内部"],
    scenario: "用户问上课时间、链接、回放、课程内容、授课老师、奖励资料",
    trigger: "命中固定话题时",
    input: "用户当前问题、课程时间字段、课程知识库、固定资料链接",
    output: "可直接发送的固定话题回复、缺失信息兜底话术",
    boundAgents: ["【19a】Day0", "【19a】Day1"],
    status: "启用",
    createdAt: "2026-08-17 10:52:00",
    updatedAt: "2026-08-17 11:24:45",
    prompt: fixedTopicSkillPrompt,
    knowledgeBaseKeys: ["kb-course", "kb-faq"],
    toolKeys: ["tool-1", "tool-5"]
  },
  {
    key: "aiskill-5",
    name: "回复合规检查",
    description: "在智能体回复发送前检查是否存在疾病诊断、疗效承诺、恐吓式销售、乱报价、暴露内部规则等风险，并给出修改建议。",
    type: "合规检查",
    outputType: "合规检查",
    outputTargets: ["智能体内部"],
    scenario: "每次回复发送前、涉及价格/服务/安全风险/心理问题时",
    trigger: "回复发送前",
    input: "拟发送回复、用户最新消息、当前阶段、产品知识库引用情况",
    output: "是否通过、风险点、修改建议、改写后回复",
    boundAgents: ["【19a】Day0", "【19a】Day1", "【19a】Day2"],
    status: "启用",
    createdAt: "2026-08-17 11:05:00",
    updatedAt: "2026-08-17 11:28:40",
    prompt: complianceSkillPrompt,
    knowledgeBaseKeys: ["kb-policy"],
    toolKeys: []
  }
];

const agentTools = [
  {
    key: "tool-1",
    id: 1,
    name: "集成AI定时任务",
    description: "定时触发AI任务，自动执行客户跟进、消息推送、数据同步等操作",
    prompt: "你是一个定时任务执行助手。根据以下任务配置，在指定时间自动执行AI操作。\n\n任务目标：{{task.goal}}\n执行时间：{{task.scheduleTime}}\n目标客户：{{task.customerName}}\n\n请按照上述配置执行任务，并返回执行结果。",
    enabled: true,
    updatedAt: "2026-07-26T17:16:00"
  },
  {
    key: "tool-2",
    id: 2,
    name: "企微机器人通知",
    description: "通过企业微信机器人向指定群聊或个人推送AI处理结果和告警信息",
    prompt: "你是企微通知助手。请根据任务上下文整理通知内容，并发送到指定企微群聊或个人。\n\n通知对象：{{notice.target}}\n通知主题：{{notice.title}}\n通知内容：{{notice.content}}\n告警等级：{{notice.level}}\n\n请保证通知内容清晰、简洁，并返回发送状态。",
    enabled: true,
    updatedAt: "2026-07-26T17:16:00"
  },
  {
    key: "tool-3",
    id: 3,
    name: "结束托管工具",
    description: "手动结束AI托管会话，释放资源并生成会话总结报告",
    prompt: "你是AI托管结束助手。请根据当前会话状态结束托管，并生成可交给真人销售继续跟进的总结。\n\n客户名称：{{conversation.customerName}}\n当前阶段：{{conversation.stage}}\n最近沟通：{{conversation.lastMessages}}\n\n请输出托管结束结果、客户关键诉求、风险点和建议下一步动作。",
    enabled: true,
    updatedAt: "2026-07-26T17:16:00"
  },
  {
    key: "tool-4",
    id: 4,
    name: "跳转skill",
    description: "快速跳转到指定skill阶段，查看和调整AI销售阶段的执行配置",
    prompt: "你是Skill跳转助手。请根据当前客户状态和运营指令，判断需要进入的Skill阶段。\n\n当前客户：{{customer.name}}\n当前阶段：{{customer.stage}}\n目标Skill：{{skill.name}}\n调整原因：{{skill.reason}}\n\n请返回跳转结果、命中的阶段配置和需要运营确认的事项。",
    enabled: true,
    updatedAt: "2026-07-26T17:16:00"
  },
  {
    key: "tool-5",
    id: 5,
    name: "调用三方接口获取信息",
    description: "调用第三方API接口获取客户画像、行业数据等外部信息辅助AI决策",
    prompt: "你是第三方接口查询助手。请根据业务需要调用外部接口获取信息，并将结果整理为AI可使用的结构化摘要。\n\n接口名称：{{api.name}}\n查询参数：{{api.params}}\n客户标识：{{customer.id}}\n\n请返回接口调用状态、关键字段、异常信息和建议处理方式。",
    enabled: true,
    updatedAt: "2026-07-26T17:16:00"
  }
];

const knowledgeBases = [
  {
    key: "kb-course",
    name: "小学英语课程知识库",
    category: "课程知识",
    desc: "沉淀课程体系、适合人群、学习路径和试听课说明，供销售智能体和课程推荐 Skill 使用。",
    status: "启用",
    owner: "知识库运营",
    updated: "2026-08-08 18:20",
    entries: [
      { key: "ke-1", title: "小学英语诊断试听课说明", type: "文本知识", media: "文本", tags: ["试听课", "诊断"], status: "启用", updated: "2026-08-08 18:20" },
      { key: "ke-2", title: "自然拼读课程海报", type: "图片素材", media: "图片", tags: ["自然拼读", "海报"], status: "启用", updated: "2026-08-07 15:12" },
      { key: "ke-3", title: "课程顾问标准讲解音频", type: "语音素材", media: "语音", tags: ["讲解", "销售"], status: "启用", updated: "2026-08-06 11:30" }
    ]
  },
  {
    key: "kb-policy",
    name: "价格政策与异议处理库",
    category: "政策规则",
    desc: "维护价格套餐、优惠规则、退费边界和常见异议处理话术，优先绑定到价格相关 Skill。",
    status: "启用",
    owner: "平台运营",
    updated: "2026-08-08 13:45",
    entries: [
      { key: "ke-4", title: "课程套餐价格边界", type: "文本知识", media: "文本", tags: ["价格", "套餐"], status: "启用", updated: "2026-08-08 13:45" },
      { key: "ke-5", title: "暑期活动政策PDF", type: "文件素材", media: "文件", tags: ["活动", "PDF"], status: "停用", updated: "2026-08-05 09:18" }
    ]
  },
  {
    key: "kb-faq",
    name: "家长高频问题知识库",
    category: "FAQ",
    desc: "按家长咨询问题沉淀标准回答，包括上课方式、师资、效果边界、校内同步等。",
    status: "启用",
    owner: "课程运营",
    updated: "2026-08-07 20:10",
    entries: [
      { key: "ke-6", title: "线上课和线下课区别", type: "文本知识", media: "文本", tags: ["上课方式"], status: "启用", updated: "2026-08-07 20:10" },
      { key: "ke-7", title: "阅读理解错题样例", type: "图片素材", media: "图片", tags: ["阅读", "错题"], status: "启用", updated: "2026-08-06 16:22" }
    ]
  }
];

const salesAccounts = [
  { key: "sale1", name: "沈海龙", role: "销售", phone: "13800008881", wecom: "16888576164354", wecomId: "19", channel: "句子通道已连接", online: true, assignedUser: "", hosted: true, sendMode: "人工确认", skills: ["19元A类课-课前", "19元A类课-第一课"], customerTotal: 6, hostedCustomers: 6, manualCustomers: 0, sentToday: 18, abnormal: 0, syncedAt: "14:20", dedicatedInfo: "" },
  { key: "sale2", name: "技术部-测试机-13311384812", role: "销售", phone: "13311384812", wecom: "16888581166708", wecomId: "00", channel: "句子通道已连接", online: true, assignedUser: "", hosted: true, sendMode: "自动发送", skills: ["19元A类课-第四课", "19元A类课-课后"], customerTotal: 2, hostedCustomers: 2, manualCustomers: 0, sentToday: 26, abnormal: 0, syncedAt: "14:18", dedicatedInfo: "" }
];

const managedWecomAccounts = [
  { key: "wecom-li", label: "李老师企微", owner: "李销售", employee: "李老师", department: "销售部", account: "li_sales" },
  { key: "wecom-chen", label: "陈老师企微", owner: "陈销售", employee: "陈老师", department: "班主任组", account: "chen_sales" },
  { key: "wecom-zhou", label: "周老师企微", owner: "周销售", employee: "周老师", department: "市场部", account: "zhou_sales" },
  { key: "wecom-wu", label: "吴老师企微", owner: "吴销售", employee: "吴老师", department: "销售部", account: "wu_sales" },
  { key: "wecom-lin", label: "林老师企微", owner: "林销售", employee: "林老师", department: "销售部", account: "lin_sales" }
];

const tagRoleOptions = ["市场", "销售", "班主任"].map((value) => ({ label: value, value }));
const tagGroupsSeed = [
  {
    key: "tag-group-status",
    name: "客户状态",
    roles: ["销售", "班主任"],
    aiWritable: false,
    status: "启用",
    tags: ["新加好友", "已上体验课", "体验课未报名", "已报名", "已删除企微"]
  },
  {
    key: "tag-group-intent",
    name: "客户意向",
    roles: ["市场", "销售"],
    aiWritable: true,
    status: "启用",
    tags: ["高意向", "中意向", "低意向", "价格敏感", "需人工跟进"]
  },
  {
    key: "tag-group-profile",
    name: "用户画像",
    roles: ["销售", "班主任"],
    aiWritable: true,
    status: "启用",
    tags: ["孩子厌学", "手机沉迷", "亲子冲突", "家长焦虑", "学习动力低"]
  },
  {
    key: "tag-group-product",
    name: "咨询产品",
    roles: ["市场", "销售"],
    aiWritable: true,
    status: "启用",
    tags: ["咨询体验课", "咨询家庭守护", "咨询1v1", "咨询价格"]
  },
  {
    key: "tag-group-wecom",
    name: "企微关系",
    roles: ["销售"],
    aiWritable: false,
    status: "启用",
    tags: ["好友正常", "已删除销售", "拉黑风险"]
  }
];

const customerTagGroups = [
  {
    key: "customer-relation",
    name: "客户关系",
    tags: [
      { value: "好友正常", source: "企微同步" },
      { value: "已删除销售", source: "企微同步" },
      { value: "拉黑风险", source: "企微同步" }
    ]
  },
  {
    key: "customer-source",
    name: "客户来源",
    tags: [
      { value: "视频号线索", source: "企微同步" },
      { value: "转介绍", source: "企微同步" },
      { value: "渠道线索", source: "企微同步" },
      { value: "社群添加", source: "企微同步" }
    ]
  },
  {
    key: "customer-grade",
    name: "年级阶段",
    tags: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "小升初"].map((value) => ({ value, source: "标签库" }))
  },
  {
    key: "customer-intent",
    name: "客户意向",
    tags: [
      { value: "高意向", source: "AI打标" },
      { value: "中意向", source: "AI打标" },
      { value: "低意向", source: "AI打标" },
      { value: "价格敏感", source: "人工调整" },
      { value: "需人工跟进", source: "AI打标" },
      { value: "观望", source: "人工调整" },
      { value: "时间敏感", source: "人工调整" }
    ]
  },
  {
    key: "customer-problem",
    name: "学习问题",
    tags: ["词汇薄弱", "阅读理解", "单词记忆", "校内提分", "语法薄弱", "口语表达", "胆怯"].map((value) => ({ value, source: "AI打标" }))
  },
  {
    key: "customer-course",
    name: "咨询课程",
    tags: ["试听课", "自然拼读", "寒假班", "启蒙英语", "暑假班", "短期课包", "专项课", "周末班"].map((value) => ({ value, source: "标签库" }))
  },
  {
    key: "customer-follow",
    name: "跟进状态",
    tags: ["待试听", "新线索", "试听预约", "测评预约", "试听完成", "已报名", "报名链接", "课时方案", "资料已发", "家长群", "群运营"].map((value) => ({ value, source: "人工调整" }))
  }
];

function groupCustomerTagValues(groups, tags = []) {
  return groups.reduce((result, group) => {
    const groupTagValues = group.tags.map((tag) => tag.value);
    result[group.key] = tags.filter((tag) => groupTagValues.includes(tag));
    return result;
  }, {});
}

function createCustomerTagValues(selected) {
  const sourceTags = selected?.tags || [];
  return {
    customer: {
      ...groupCustomerTagValues(customerTagGroups, sourceTags),
      "customer-relation": sourceTags.includes("已删除销售") ? ["已删除销售"] : ["好友正常"]
    },
    personal: selected?.intent ? [`${intentLabelMap[selected.intent] || selected.intent}`] : []
  };
}

const loginAccounts = {
  "1": {
    key: "account-1",
    name: "平台管理员",
    role: "platform_admin",
    badge: "平台",
    company: "全部企业",
    account: "账号1",
    menuKeys: ["dashboard", "conversations", "agentManager", "strategy", "skills", "customers", "sales", "tagLibrary", "massMessage", "humanization", "knowledge", "settings", "tools"],
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
    menuKeys: ["dashboard", "conversations", "agentManager", "strategy", "skills", "customers", "sales", "tagLibrary", "massMessage", "humanization", "knowledge", "tools"],
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
    tags: ["三年级", "词汇薄弱", "高意向"],
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
    tags: ["四年级", "阅读理解", "待试听"],
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
    tags: ["五年级", "寒假班", "高意向"],
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
    tags: ["一年级", "启蒙英语", "待测评"],
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
    tags: ["六年级", "小升初", "高意向"],
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
    tags: ["二年级", "英语启蒙", "新线索"],
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
    tags: ["三年级", "试听预约", "高意向"],
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
    tags: ["四年级", "单词记忆", "中意向"],
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
    tags: ["五年级", "校内提分", "高意向"],
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
    tags: ["价格异议", "课时方案", "中意向"],
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
    tags: ["观望", "家庭决策", "低意向"],
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
    tags: ["报名链接", "周六班", "高意向"],
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
    tags: ["课程对比", "四年级", "中意向"],
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
    tags: ["口语表达", "胆怯", "三年级"],
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
    tags: ["试听排课", "家长群", "群运营"],
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
    tags: ["考前冲刺", "短期课包", "高意向"],
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
    tags: ["三年级", "试听完成", "高意向"],
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
    tags: ["渠道线索", "课程形式", "待留资"],
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
    tags: ["五年级", "语法薄弱", "专项课"],
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
    tags: ["老学员", "续报", "高意向"],
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
    tags: ["四年级", "阅读打卡", "群运营"],
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
    tags: ["观望", "资料已发", "低意向"],
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
    tags: ["转介绍", "测评预约", "高意向"],
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
    tags: ["四年级", "周末班", "时间敏感"],
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
    tags: ["小升初", "暑假班", "已报名"],
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

const lifecycleStages = [
  { title: "了解阶段", desc: "初步沟通，了解孩子年级、基础和家长期望。", skills: ["19元A类课-课前", "19元A类课-第一课"] },
  { title: "定义用户", desc: "明确孩子的主要学习问题和课程诉求。", skills: ["19元A类课-课前", "19元A类课-课后"] },
  { title: "提升认知", desc: "结合测评或试听反馈，说明课程价值。", skills: ["19元A类课-第一课"] },
  { title: "催单阶段", desc: "处理价格、名额、时间和报名顾虑。", skills: ["19元A类课-第一课", "19元A类课-第四课"] },
  { title: "完单阶段", desc: "家长已完成报名。", skills: ["19元A类课-第四课", "19元A类课-课后"] }
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
    message: "支持的。Sabuddy 通过句子通道接入企业微信，可以先由AI生成回复建议，也可以按规则自动发送低风险消息，销售仍然可以随时接管。"
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
  { key: "sales", icon: <TeamOutlined />, label: "企微托管" },
  {
    key: "agentGroup",
    icon: <RobotOutlined />,
    label: "智能体",
    children: [
      { key: "agentManager", icon: <RobotOutlined />, label: "角色管理" },
      { key: "strategy", icon: <BarChartOutlined />, label: "智能体管理" },
      { key: "skills", icon: <FileSearchOutlined />, label: "Skill管理" },
      { key: "tools", icon: <ToolOutlined />, label: "工具管理" },
      { key: "knowledge", icon: <FileTextOutlined />, label: "知识库管理" },
      { key: "humanization", icon: <SmileOutlined />, label: "拟人化设置" }
    ]
  },
  {
    key: "userOpsGroup",
    icon: <TagsOutlined />,
    label: "用户运营",
    children: [
      { key: "tagLibrary", icon: <TagsOutlined />, label: "标签库管理" },
      { key: "massMessage", icon: <SendOutlined />, label: "用户群发" }
    ]
  },
  { key: "settings", icon: <SettingOutlined />, label: "系统管理" }
];

const flattenMenuItems = (items) => items.flatMap((item) => item.children ? [item, ...flattenMenuItems(item.children)] : [item]);
const getAllowedMenuItems = (items, allowedKeys) => items.reduce((result, item) => {
  if (item.children) {
    const children = getAllowedMenuItems(item.children, allowedKeys);
    if (children.length) result.push({ ...item, children });
  } else if (allowedKeys.includes(item.key)) {
    result.push(item);
  }
  return result;
}, []);
const pageTitle = Object.fromEntries(flattenMenuItems(menuItems).map((item) => [item.key, item.label]));

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
              <Title level={3}>Sabuddy</Title>
              <Text type="secondary">AI销售托管平台</Text>
            </div>
          </div>
          <Form layout="vertical" initialValues={{ account: "1", password: "demo123456" }} onFinish={handleAccountLogin}>
            <Form.Item label="账号" name="account">
              <Input size="large" autoComplete="username" placeholder="输入 1 / 2 / 3" />
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input.Password size="large" autoComplete="current-password" />
            </Form.Item>
            <Paragraph type="secondary">默认演示账号：1 / demo123456。也可输入 2 企业员工或 3 企业管理员，系统会按账号权限展示菜单和数据。</Paragraph>
            <Button type="primary" size="large" block htmlType="submit">
              登录
            </Button>
          </Form>
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

function IntelligentAgentPage() {
  const { message } = AntApp.useApp();
  const createDefaultModelConfig = (item = {}) => ({
    provider: item.modelConfig?.provider || "DASHSCOPE",
    model: item.modelConfig?.model || "qwen3.5-omni-flash",
    baseUrl: item.modelConfig?.baseUrl || "https://dashscope.aliyuncs.com",
    maxTokens: item.modelConfig?.maxTokens || 2048,
    temperature: item.modelConfig?.temperature ?? 0.7,
    topP: item.modelConfig?.topP ?? 0.9,
    frequencyPenalty: item.modelConfig?.frequencyPenalty ?? 0,
    presencePenalty: item.modelConfig?.presencePenalty ?? 0,
    maxIterations: item.modelConfig?.maxIterations || 10
  });
  const createDefaultPrompt = (item = {}) => item.prompt || `# ${item.name || "智能体"}系统提示词

你是企业微信场景下的AI销售智能体，需要围绕客户当前生命周期阶段完成沟通。

## 角色定位
${item.description || item.roleDescription || "根据所属角色配置完成客户接待、需求确认、产品推荐和后续跟进。"}

## 执行要求
1. 先理解客户意图，再选择合适的工具或 Skill。
2. 回答要自然、克制、专业，避免过度承诺。
3. 涉及价格、交付、合同、隐私等敏感问题时优先转人工确认。
4. 每轮沟通后判断是否需要推进生命周期阶段。`;
  const getDefaultStageSkill = (stageIndex) => strategies[stageIndex % strategies.length]?.name || strategies[0]?.name;
  const relativeTimeUnitOptions = ["分钟", "小时", "天"].map((value) => ({ value }));
  const taskEffectiveConditionOptions = ["加好友", "agent生效", "加好友自然日"].map((value) => ({ value }));
  const knowledgeBaseOptions = knowledgeBases.map((item) => ({ value: item.key, label: item.name }));
  const createAgentScheduleRule = (index = 0) => ({
    taskEffectiveCondition: index === 0 ? "agent生效" : "加好友",
    operationTaskType: index === 0 ? "客户状态检查，判断是否需要继续跟进或转人工。" : "输入该智能体的定时任务描述",
    taskEffectiveTriggerMode: "延后触发",
    taskEffectiveAmount: index + 1,
    taskEffectiveUnit: "分钟"
  });
  const buildInitialRows = () => agents.map((item, index) => ({
    key: `ia-${item.key}`,
    name: `${item.name}智能体`,
    roleName: item.name,
    positioning: item.type,
    description: item.roleDescription,
    humanizationStrategy: "",
    knowledgeBaseKeys: knowledgeBases.slice(0, Math.min(3, index + 2)).map((base) => base.key),
    agentScheduleRules: [createAgentScheduleRule(0), createAgentScheduleRule(1)],
    boundWecomKeys: managedWecomAccounts.slice(index, index + Math.max(1, item.sales || 1)).map((account) => account.key),
    enabled: item.status === "启用",
    version: "v1",
    modelConfig: createDefaultModelConfig(),
    prompt: createDefaultPrompt(item),
    toolKeys: agentTools.filter((tool) => tool.enabled).slice(0, 3).map((tool) => tool.key),
    stages: lifecycleStages.map((stage, stageIndex) => ({
      key: `ia-${item.key}-stage-${stageIndex + 1}`,
      name: stage.title,
      order: stageIndex + 1,
      description: stage.desc,
      skills: [getDefaultStageSkill(stageIndex)].filter(Boolean),
      enabled: true
    }))
  }));
  const [rows, setRows] = useState(buildInitialRows);
  const [editingAgent, setEditingAgent] = useState(null);
  const [configAgent, setConfigAgent] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [collapsedStageKeys, setCollapsedStageKeys] = useState([]);
  const skillOptions = strategies.map((item) => ({ value: item.name, label: item.name }));
  const roleOptions = agents.map((item) => ({ value: item.name, label: `${item.name}（${item.type}）` }));
  const currentConfigAgent = configAgent ? rows.find((item) => item.key === configAgent.key) || configAgent : null;

  const syncRow = (agentKey, updater) => {
    setRows((items) => items.map((item) => item.key === agentKey ? updater(item) : item));
  };

  const saveAgent = (values) => {
    const role = agents.find((item) => item.type === values.positioning || item.name === editingAgent?.roleName);
    const next = {
      ...(editingAgent || {}),
      ...values,
      roleName: editingAgent?.roleName || role?.name || values.name || "自定义",
      positioning: values.positioning || role?.type || "-",
      description: values.description || role?.roleDescription || "",
      enabled: editingAgent?.enabled ?? true,
      knowledgeBaseKeys: editingAgent?.knowledgeBaseKeys || knowledgeBases.slice(0, 2).map((base) => base.key),
      agentScheduleRules: editingAgent?.agentScheduleRules || [createAgentScheduleRule(0), createAgentScheduleRule(1)],
      boundWecomKeys: editingAgent?.boundWecomKeys || [],
      version: editingAgent?.version || "v1",
      modelConfig: createDefaultModelConfig(editingAgent),
      prompt: createDefaultPrompt({ ...role, ...editingAgent, ...values }),
      toolKeys: editingAgent?.toolKeys || agentTools.filter((tool) => tool.enabled).slice(0, 2).map((tool) => tool.key),
      stages: editingAgent?.stages || lifecycleStages.slice(0, 3).map((stage, index) => ({
        key: `ia-stage-${Date.now()}-${index}`,
        name: stage.title,
        order: index + 1,
        description: stage.desc,
        skills: [getDefaultStageSkill(index)].filter(Boolean),
        enabled: true
      }))
    };
    if (editingAgent?.key) {
      setRows((items) => items.map((item) => item.key === editingAgent.key ? next : item));
    } else {
      setRows((items) => [{ ...next, key: `ia-${Date.now()}` }, ...items]);
    }
    setEditingAgent(null);
  };

  const saveStage = (values) => {
    const stage = {
      ...(editingStage.stage || {}),
      ...values,
      key: editingStage.stage?.key || `ia-stage-${Date.now()}`,
      enabled: values.enabled !== false,
      skills: values.skills || []
    };
    syncRow(editingStage.agent.key, (agent) => ({
      ...agent,
      stages: editingStage.stage?.key
        ? agent.stages.map((item) => item.key === stage.key ? stage : item)
        : [...agent.stages, { ...stage, order: agent.stages.length + 1 }]
    }));
    setEditingStage(null);
  };

  const getStageTiming = (stageIndex) => {
    const baseDelay = Math.max(1, stageIndex + 1);
    return {
      plannedStart: stageIndex === 0 ? "BASED_ON_FRIEND_ADD 后 1分钟" : "排课时间",
      plannedEnd: stageIndex === 0 ? "agent生效 后 7天" : `agent生效 后 ${stageIndex + 1}天`,
      actualStart: "—（按客户运行）",
      actualEnd: "—（按客户运行）",
      baseDelay
    };
  };
  const buildAgentStrategyTasks = (skill, stage, stageIndex) => {
    const { baseDelay } = getStageTiming(stageIndex);
    if (stageIndex === 0) {
      return [
        { name: "自我介绍", type: "加好友", trigger: "立即触发", enabled: true },
        { name: "追问", type: "加好友", trigger: "加好友 后 1分钟", enabled: true },
        { name: "脑科学", type: "加好友", trigger: "加好友 后 30分钟", enabled: true }
      ];
    }
    return [
      { name: `${skill?.name || "智能体"}启动执行`, type: "agent生效", trigger: `agent生效 后 ${baseDelay}分钟`, enabled: true },
      { name: "客户状态检查", type: "agent生效", trigger: `agent生效 后 ${baseDelay + 2}分钟`, enabled: true },
      { name: "阶段结果同步", type: "agent生效", trigger: `agent生效 后 ${baseDelay + 4}分钟`, enabled: true }
    ];
  };

  const renderStageAgentDetails = (stage, stageIndex) => {
    const names = stage.skills || [];
    if (!names.length) {
      return <Text type="secondary">当前阶段暂未绑定智能体。</Text>;
    }
    return (
      <div className="agent-stage-skill-list">
        {names.map((skillName) => {
          const agent = strategies.find((item) => item.name === skillName) || { name: skillName, type: "消息生成", trigger: "-", channel: "AISA内部能力", input: "-", output: "-", calls: 0, status: "启用" };
          const tasks = buildAgentStrategyTasks(agent, stage, stageIndex);
          return (
            <div className="agent-stage-skill-card" key={skillName}>
              <div className="stage-skill-head">
                <div>
                  <Title level={5}>{agent.name}</Title>
                  <Text type="secondary">{tasks.length} 条策略任务 · {agent.type || "消息生成"} · {agent.trigger || "AISA内部能力"}</Text>
                </div>
                <Space>
                  <Button type="link" danger>移除</Button>
                  <Button type="link">工具配置</Button>
                  <Button type="link">策略任务 &gt;</Button>
                </Space>
              </div>
              <div className="stage-skill-task-list">
                {tasks.map((task, taskIndex) => (
                  <div className="stage-skill-task" key={`${skillName}-${task.name}`}>
                    <Badge count={taskIndex + 1} color="#dbe4f0" />
                    <Text>{task.name}</Text>
                    <Tag>{task.type}</Tag>
                    <Tag color="orange">触发：{task.trigger}</Tag>
                    <Tag color={task.enabled ? "success" : "default"}>{task.enabled ? "启用" : "停用"}</Tag>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const columns = [
    { title: "角色", dataIndex: "roleName", width: 150 },
    { title: "定位", dataIndex: "positioning", width: 150, render: (value) => <Tag color="blue" className="role-count-tag">{value}</Tag> },
    { title: "说明", dataIndex: "description", width: 440, render: (value) => <Text ellipsis={{ tooltip: value }}>{value || "-"}</Text> },
    { title: "流程阶段数", dataIndex: "stages", width: 130, render: (stages = []) => <Tag color="processing" className="role-count-tag">{stages.length} 个</Tag> },
    { title: "已配置企微", dataIndex: "boundWecomKeys", width: 130, render: (items = []) => <Tag color="processing" className="role-count-tag">{items.length} 个</Tag> },
    { title: "状态", dataIndex: "enabled", width: 90, render: (value, record) => <Switch checked={value} onChange={(checked) => syncRow(record.key, (item) => ({ ...item, enabled: checked }))} /> },
    {
      title: "操作",
      fixed: "right",
      width: 220,
      render: (_, record) => (
        <Space size={0} wrap={false}>
          <Button type="link" onClick={() => setEditingAgent(record)}>编辑</Button>
          <Button type="link" onClick={() => setConfigAgent(record)}>流程配置</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除智能体", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];

  if (currentConfigAgent) {
    const skillTabExtra = <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingStage({ agent: currentConfigAgent, stage: null })}>添加阶段</Button>;
    const roleFlowContent = (
      <Space direction="vertical" size={12} className="full-width">
        <div className="agent-skill-tab-head">
          <Text type="secondary">配置该角色的服务流程，每个流程阶段可绑定多个智能体，并配置对应策略任务。</Text>
          {skillTabExtra}
        </div>
        <div className="agent-flow-config">
          {currentConfigAgent.stages.map((stage, index) => {
            const collapsed = collapsedStageKeys.includes(stage.key);
            const timing = getStageTiming(index);
            const boundAgentCount = (stage.skills || []).length;
            return (
              <Card
                key={stage.key}
                className="agent-stage-card"
                size="small"
                title={
                  <div className="agent-stage-title-block">
                    <Space align="start" size={12}>
                      <Badge count={index + 1} color="#7c3aed" />
                      <div>
                        <Title level={4}>流程阶段 {index + 1} · {stage.name}</Title>
                        <Text type="secondary">第 {index + 1} 段 · {boundAgentCount} 个智能体 · 状态 {stage.enabled !== false ? "启用" : "停用"}</Text>
                      </div>
                    </Space>
                  </div>
                }
                extra={
                  <Space>
                    <Button type="link" onClick={() => setCollapsedStageKeys((keys) => collapsed ? keys.filter((key) => key !== stage.key) : [...keys, stage.key])}>{collapsed ? "展开阶段" : "收起阶段"}</Button>
                    <Button onClick={() => setEditingStage({ agent: currentConfigAgent, stage })}>编辑</Button>
                    <Button type="primary" ghost icon={<PlusOutlined />}>添加策略任务</Button>
                    <Button danger onClick={() => syncRow(currentConfigAgent.key, (agent) => ({ ...agent, stages: agent.stages.filter((item) => item.key !== stage.key) }))}>删除</Button>
                  </Space>
                }
              >
                {collapsed ? null : (
                  <>
                    <div className="agent-stage-timing">
                      <Text><Text type="secondary">预计开始：</Text>{timing.plannedStart}</Text>
                      <Text><Text type="secondary">预计结束：</Text>{timing.plannedEnd}</Text>
                      <Text><Text type="secondary">实际开始：</Text>{timing.actualStart}</Text>
                      <Text><Text type="secondary">实际结束：</Text>{timing.actualEnd}</Text>
                    </div>
                    <Text type="secondary">预计时间按首个绑定智能体的规则计算；实际时间按客户运行产生。</Text>
                    {renderStageAgentDetails(stage, index)}
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </Space>
    );
    return (
      <Space direction="vertical" size={16} className="page-stack intelligent-agent-page">
        <Card
          title={
            <PanelTitle
              title={(currentConfigAgent.roleName || currentConfigAgent.name) + " · 角色流程配置"}
              desc="配置该角色按什么服务流程执行，以及每个流程阶段绑定哪个智能体。"
              before={<Button icon={<ArrowLeftOutlined />} onClick={() => setConfigAgent(null)}>返回角色列表</Button>}
              extra={<Button type="primary" icon={<CheckCircleOutlined />} onClick={() => message.success("角色流程配置已保存")}>保存配置</Button>}
            />
          }
        >
          <Tabs
            className="agent-config-tabs role-flow-tabs"
            defaultActiveKey="role-flow"
            items={[{
              key: "role-flow",
              label: "角色流程管理",
              children: roleFlowContent
            }]}
          />
        </Card>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size={16} className="page-stack intelligent-agent-page">
      <Card
        className="role-list-card"
        title={
          <PanelTitle
            title="角色列表"
            desc="管理角色主数据（名称、定位、说明）；定位用于 AI 人设，说明约束业务边界；从「流程配置」进入流程阶段编排。"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingAgent({})}>新增角色</Button>}
          />
        }
      >
        <Table className="admin-table intelligent-agent-table role-table" rowKey="key" columns={columns} dataSource={rows} pagination={false} scroll={{ x: 1120 }} />
      </Card>
      <IntelligentAgentModal agent={editingAgent} onClose={() => setEditingAgent(null)} onSave={saveAgent} />
    </Space>
  );
}

function IntelligentAgentModal({ agent, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (agent) {
      form.resetFields();
      form.setFieldsValue({
        name: agent.name?.replace(/智能体$/, "") || "",
        positioning: agent.positioning || "",
        description: agent.description || "",
        humanizationStrategy: agent.humanizationStrategy
      });
    }
  }, [agent, form]);
  return (
    <Modal
      className="intelligent-agent-edit-modal"
      title={agent?.key ? "编辑智能体" : "新增智能体"}
      open={Boolean(agent)}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={720}
    >
      <Form form={form} className="intelligent-agent-edit-form" layout="vertical" onFinish={onSave}>
        <Form.Item label="智能体名称" name="name" rules={[{ required: true, message: "请输入智能体名称" }]}>
          <Input placeholder="请输入智能体名称" />
        </Form.Item>
        <Form.Item label="定位" name="positioning" tooltip="说明智能体承担的业务定位与沟通边界" rules={[{ required: true, message: "请输入定位" }]}>
          <Input placeholder="请输入智能体定位，例如：线索获取" />
        </Form.Item>
        <Form.Item label="说明" name="description" tooltip="补充智能体的服务目标、语气要求和禁用行为">
          <Input.TextArea
            rows={8}
            placeholder="请描述该智能体在企微沟通中的定位、边界、服务目标和禁用行为。"
          />
        </Form.Item>
        <Form.Item label="拟人化策略" name="humanizationStrategy" tooltip="选择后会套用对应回复风格，不选则保持默认策略">
          <Select allowClear placeholder="不选则不启用拟人化" options={humanizationStrategyOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function IntelligentAgentStageModal({ stage, skillOptions, open, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        name: stage?.name || "",
        order: stage?.order || 0,
        description: stage?.description || "",
        skills: stage?.skills || [],
        enabled: stage?.enabled !== false
      });
    }
  }, [open, stage, form]);
  return (
    <Modal title={stage?.key ? "编辑阶段" : "新增阶段"} open={open} onCancel={onClose} onOk={() => form.submit()} okText="确认" cancelText="取消" width={760}>
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Row gutter={16}>
          <Col span={14}><Form.Item label="阶段名称" name="name" rules={[{ required: true, message: "请输入阶段名称" }]}><Input placeholder="例如：需求确认阶段" /></Form.Item></Col>
          <Col span={5}><Form.Item label="排序" name="order"><InputNumber min={0} className="full-input" /></Form.Item></Col>
          <Col span={5}><Form.Item label="阶段状态" name="enabled" valuePropName="checked"><Switch checkedChildren="启用" unCheckedChildren="停用" /></Form.Item></Col>
          <Col span={24}><Form.Item label="绑定智能体" name="skills"><Select mode="multiple" placeholder="请选择智能体" options={skillOptions} /></Form.Item></Col>
          <Col span={24}><Form.Item label="阶段说明" name="description"><Input.TextArea rows={4} placeholder="说明该阶段的沟通目标、执行边界和转入下一阶段条件。" /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function StrategyPage() {
  const { message } = AntApp.useApp();
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingBasicSkill, setEditingBasicSkill] = useState(null);
  const [strategyRows, setStrategyRows] = useState(strategies);
  const createSkillDraft = () => ({
    key: "",
    code: "",
    name: "新增智能体",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "课程阶段进入 / 课前提醒 / 课后回访",
    channel: "Sabuddy内部能力",
    input: "聊天记录、学员年级、英语基础、课程意向",
    output: "下一步沟通建议、待发送话术、触发动作",
    agent: "小学英语课程顾问",
    calls: 0,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "启用"
  });
  const duplicateSkill = (record) => {
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    setStrategyRows((items) => [
      ...items,
      {
        ...record,
        key: `${record.key}-copy-${Date.now()}`,
        name: `${record.name} 副本`,
        createdAt,
        updatedAt: createdAt
      }
    ]);
    message.success("智能体已复制");
  };
  const saveBasicSkill = (values) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const nextSkill = {
      ...(editingBasicSkill || {}),
      ...values,
      updatedAt: timestamp,
      createdAt: editingBasicSkill?.createdAt || timestamp
    };
    if (editingBasicSkill?.key) {
      setStrategyRows((items) => items.map((item) => (item.key === editingBasicSkill.key ? nextSkill : item)));
    } else {
      setStrategyRows((items) => [...items, { ...nextSkill, key: `agent-${Date.now()}` }]);
    }
    setEditingBasicSkill(null);
    message.success("智能体基础信息已保存");
  };
  const columns = [
    { title: "智能体", dataIndex: "name", width: 180 },
    { title: "分类", dataIndex: "agentCategory", width: 110, render: (value) => <Tag color={value === "策略智能体" ? "purple" : "blue"}>{value || "会话智能体"}</Tag> },
    { title: "触发方式", dataIndex: "trigger", width: 320 },
    { title: "创建时间", dataIndex: "createdAt", width: 150 },
    { title: "修改时间", dataIndex: "updatedAt", width: 150 },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (v, record) => (
        <Switch
          checked={v === "启用"}
          onChange={(checked) => setStrategyRows((items) => items.map((item) => item.key === record.key ? { ...item, status: checked ? "启用" : "停用" } : item))}
        />
      )
    },
    {
      title: "操作",
      width: 260,
      render: (_, record) => (
        <Space wrap={false} size={4} className="ai-skill-action-group">
          <Button type="link" onClick={() => setEditingBasicSkill(record)}>编辑</Button>
          <Button type="link" onClick={() => setEditingSkill(record)}>配置</Button>
          <Button type="link" className="link-warning" onClick={() => duplicateSkill(record)}>复制</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除智能体", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setStrategyRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  if (editingSkill) return <StrategyEditor skill={editingSkill} onBack={() => setEditingSkill(null)} />;
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card title={<PanelTitle title="智能体列表" desc="会话智能体按业务流程 SOP 阶段配置；策略智能体用于客户策略、标签和任务编排。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingBasicSkill(createSkillDraft())}>新增智能体</Button>} />}>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部智能体分类" options={["全部智能体分类", "会话智能体", "策略智能体"].map((value) => ({ value }))} />
          <Select defaultValue="全部能力类型" options={["全部能力类型", "SOP会话", "策略编排"].map((value) => ({ value }))} />
          <Select defaultValue="全部状态" options={["全部状态", "启用", "停用"].map((value) => ({ value }))} />
          <Input placeholder="搜索智能体、触发方式或调用通道" allowClear className="strategy-search-input" />
          <Button type="primary">搜索</Button>
          <Button>重置</Button>
        </Space>
        <Table
          className="admin-table"
          rowKey="key"
          columns={columns}
          dataSource={strategyRows}
          pagination={false}
          scroll={{ x: 1110 }}
        />
      </Card>
      <StrategyBasicModal
        agent={editingBasicSkill}
        onClose={() => setEditingBasicSkill(null)}
        onSave={saveBasicSkill}
      />
    </Space>
  );
}

function StrategyBasicModal({ agent, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (agent) {
      form.setFieldsValue({
        code: agent.code || `${agent.key || "agent"}_agent`,
        name: agent.name,
        agentCategory: agent.agentCategory || "会话智能体",
        type: agent.type || "消息生成",
        status: agent.status || "启用",
        description: agent.description || `${agent.name || "该智能体"} 用于在指定业务场景中独立完成 AI 任务，并可按需关联工具与 Skill。`
      });
    } else {
      form.resetFields();
    }
  }, [agent, form]);
  return (
    <Modal
      title="智能体基础信息"
      open={Boolean(agent)}
      onCancel={onClose}
      okText="保存"
      cancelText="取消"
      width={760}
      onOk={() => form.validateFields().then(onSave)}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="agent-basic-edit-form">
        <Row gutter={16}>
          <Col span={24}><Form.Item label="Agent Code" name="code"><Input placeholder="请输入 Agent Code" /></Form.Item></Col>
          <Col span={24}><Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入智能体名称" }]}><Input placeholder="请输入智能体名称" /></Form.Item></Col>
          <Col span={12}><Form.Item label="智能体分类" name="agentCategory"><Select options={["会话智能体", "策略智能体"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="能力类型" name="type"><Input placeholder="例如：消息生成、策略编排" /></Form.Item></Col>
          <Col span={24}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={24}><Form.Item label="描述" name="description"><Input.TextArea rows={5} showCount maxLength={255} placeholder="说明该智能体负责的场景、调用边界和服务目标。" /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
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
    const headingMatch = line.match(/^(#{1,6})\s(.+)$/);
    if (headingMatch) {
      const headingLevel = Math.min(headingMatch[1].length, 3);
      return `<span class="logic-token-heading logic-token-heading-${headingLevel}">${line}</span>`;
    }
    return line
      .replace(/`([^`]+)`/g, '<span class="logic-token-code">`$1`</span>')
      .replace(/(\*\*[^*]+\*\*)/g, '<span class="logic-token-strong">$1</span>')
      .replace(/\{\{([\w.-]+)\}\}/g, '<span class="logic-token-var">{{$1}}</span>')
      .replace(/(@tool\.[\w.-]+)/g, '<span class="logic-token-tool">$1</span>')
      .replace(/(@(?:kb|knowledge)\.[\u4e00-\u9fa5\w.-]+)/g, '<span class="logic-token-kb">$1</span>')
      .replace(/\b(if|when|else|否则|如果|当)\b/g, '<span class="logic-token-condition">$1</span>')
      .replace(/(必须|禁止|不要|优先|务必|不得)/g, '<span class="logic-token-rule">$1</span>')
      .replace(/^(\s*)([-*]|\d+\.)\s/, '$1<span class="logic-token-list">$2</span> ');
  }).join("\n");
}

function SkillLogicRichEditor({ defaultValue, onChange }) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const highlighted = useMemo(() => highlightSkillLogic(value), [value]);
  return (
    <div className="skill-logic-editor-wrap">
      <pre className="skill-logic-highlight" aria-hidden="true" dangerouslySetInnerHTML={{ __html: highlighted }} />
      <textarea
        className="skill-logic-editor"
        value={value}
        spellCheck={false}
        onChange={(event) => {
          setValue(event.target.value);
          onChange?.(event.target.value);
        }}
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

function AISkillPage() {
  const [rows, setRows] = useState(aiSkills);
  const [configSkill, setConfigSkill] = useState(null);
  const [knowledgePickerOpen, setKnowledgePickerOpen] = useState(false);
  const [knowledgePickerKey, setKnowledgePickerKey] = useState("");
  const skillAbilityTypes = ["信息总结", "策略判断", "产品匹配", "固定话题回复", "合规检查", "用户标签", "消息生成", "任务触发", "数据同步"];
  const skillTypeOptions = ["全部能力类型", ...skillAbilityTypes].map((value) => ({ value }));
  const statusOptions = ["全部状态", "启用", "停用"].map((value) => ({ value }));
  const skillEditTypeOptions = skillAbilityTypes.map((value) => ({ value }));
  const skillOutputTypeOptions = ["策略判断", "结构化档案", "标签", "建议话术", "任务结果", "合规检查"].map((value) => ({ value }));
  const skillOutputTargetOptions = ["智能体内部", "客户档案", "会话记录", "运营标签", "企微标签", "生成真人销售建议", "触发后续任务"].map((value) => ({ value }));
  const toolOptions = agentTools.map((item) => ({ value: item.key, label: item.name }));
  const skillDefaultConfig = {
    outputType: "结构化档案",
    outputTargets: ["智能体内部"]
  };
  const normalizeSkillConfig = (skill) => ({
    ...skillDefaultConfig,
    ...skill,
    knowledgeResourceKeys: skill.knowledgeResourceKeys || (skill.knowledgeBaseKeys || []).map((key) => `base:${key}`)
  });
  const createDraft = () => ({
    ...skillDefaultConfig,
    key: "",
    name: "",
    description: "",
    type: "信息总结",
    scenario: "",
    trigger: "",
    input: "",
    output: "",
    boundAgents: [],
    status: "启用",
    prompt: "# Skill目标\n\n## 输入上下文\n\n## 输出要求\n",
    knowledgeBaseKeys: [],
    knowledgeResourceKeys: [],
    toolKeys: [],
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ")
  });
  const updateConfigSkill = (changes) => {
    setConfigSkill((skill) => skill ? { ...skill, ...changes } : skill);
  };
  const saveConfigSkill = () => {
    if (!configSkill) return;
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const nextSkill = {
      ...configSkill,
      updatedAt: timestamp,
      createdAt: configSkill.createdAt || timestamp
    };
    if (configSkill.key) {
      setRows((items) => items.map((item) => (item.key === configSkill.key ? nextSkill : item)));
    } else {
      setRows((items) => [...items, { ...nextSkill, key: `aiskill-${Date.now()}` }]);
    }
    setConfigSkill(null);
  };
  const duplicateSkill = (record) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    setRows((items) => [...items, { ...record, key: `${record.key}-copy-${Date.now()}`, name: `${record.name} 副本`, createdAt: timestamp, updatedAt: timestamp }]);
  };
  const columns = [
    { title: "Skill名称", dataIndex: "name", width: 140 },
    { title: "Skill描述", dataIndex: "description", width: 300, render: (value) => <Paragraph className="ai-skill-description-cell">{value}</Paragraph> },
    { title: "类型", dataIndex: "type", width: 78, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "已绑定智能体", dataIndex: "boundAgents", width: 150, render: (items = []) => <Space wrap size={[4, 4]}>{items.map((item) => <Tag key={item}>{item}</Tag>)}</Space> },
    { title: "更新时间", dataIndex: "updatedAt", width: 128 },
    { title: "状态", dataIndex: "status", width: 68, render: (value, record) => <Switch checked={value === "启用"} onChange={(checked) => setRows((items) => items.map((item) => item.key === record.key ? { ...item, status: checked ? "启用" : "停用" } : item))} /> },
    {
      title: "操作",
      width: 130,
      render: (_, record) => (
        <Space wrap={false} size={4} className="ai-skill-action-group">
          <Button type="link" onClick={() => setConfigSkill(normalizeSkillConfig(record))}>编辑</Button>
          <Button type="link" className="link-warning" onClick={() => duplicateSkill(record)}>复制</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除Skill", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  if (configSkill) {
    const knowledgeResourceRows = knowledgeBases.flatMap((base) => [
      {
        key: `base:${base.key}`,
        name: base.name,
        path: `${base.category} / ${base.name}`,
        relationType: "文件夹",
        contentType: "目录",
        status: base.status,
        desc: base.desc,
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
        desc: entry.content || `${entry.title}：用于 ${base.name} 场景，回答时需以知识库内容为准，不编造未维护的信息。`
      }))
    ]);
    const selectedKnowledgeResources = knowledgeResourceRows.filter((item) => (configSkill.knowledgeResourceKeys || []).includes(item.key));
    const addKnowledgeResource = () => {
      if (!knowledgePickerKey) return;
      const nextKeys = Array.from(new Set([...(configSkill.knowledgeResourceKeys || []), knowledgePickerKey]));
      updateConfigSkill({
        knowledgeResourceKeys: nextKeys,
        knowledgeBaseKeys: nextKeys.filter((key) => key.startsWith("base:")).map((key) => key.replace("base:", ""))
      });
      setKnowledgePickerOpen(false);
    };
    const selectedTools = agentTools.filter((item) => (configSkill.toolKeys || []).includes(item.key));
    return (
      <>
        <Space direction="vertical" size={16} className="page-stack ai-skill-page">
          <Card
            title={
              <PanelTitle
                title={`${configSkill.name || "新增Skill"} · 编辑`}
                desc="维护 Skill 的名称、提示词、知识库、工具和调试测试。"
                before={<Button icon={<ArrowLeftOutlined />} onClick={() => setConfigSkill(null)}>返回Skill管理</Button>}
                extra={<Button type="primary" icon={<CheckCircleOutlined />} onClick={saveConfigSkill}>保存Skill</Button>}
              />
            }
          >
          <Tabs
            items={[
              {
                key: "base",
                label: "基本信息",
                children: (
                  <Form
                    layout="vertical"
                    initialValues={normalizeSkillConfig(configSkill)}
                    onValuesChange={(_, values) => updateConfigSkill(values)}
                    className="ai-skill-edit-form"
                  >
                    <Row gutter={16}>
                      <Col span={12}><Form.Item label="Skill名称" name="name" rules={[{ required: true, message: "请输入Skill名称" }]}><Input placeholder="例如：定时总结用户基本信息" /></Form.Item></Col>
                      <Col span={12}><Form.Item label="能力类型" name="type"><Select options={skillEditTypeOptions} /></Form.Item></Col>
                      <Col span={12}><Form.Item label="输出类型" name="outputType"><Select options={skillOutputTypeOptions} placeholder="选择 Skill 默认输出类型" /></Form.Item></Col>
                      <Col span={12}><Form.Item label="默认输出去向" name="outputTargets"><Select mode="multiple" options={skillOutputTargetOptions} placeholder="选择默认输出去向" /></Form.Item></Col>
                      <Col span={24}><Form.Item label="Skill描述" name="description"><Input.TextArea rows={4} placeholder="简要说明该 Skill 的能力边界、复用价值和典型输出。" /></Form.Item></Col>
                      <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
                    </Row>
                  </Form>
                )
              },
              {
                key: "prompt",
                label: "Skill提示词",
                children: (
                  <Card size="small" title="Skill提示词" className="agent-config-card">
                    <SkillLogicRichEditor defaultValue={configSkill.prompt || ""} onChange={(value) => updateConfigSkill({ prompt: value })} />
                  </Card>
                )
              },
              {
                key: "knowledge",
                label: "关联知识库",
                children: (
                  <Space direction="vertical" size={16} className="full-width skill-relation-tab">
                    <Card
                      title={
                        <PanelTitle
                          title="已关联知识资源"
                          desc="选择该 Skill 可引用的知识库资源；可关联文件夹或具体资源文件，执行时按资源路径引用内容。"
                          extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setKnowledgePickerKey(knowledgeResourceRows[0]?.key || ""); setKnowledgePickerOpen(true); }}>添加知识资源</Button>}
                        />
                      }
                    >
                      <Table className="admin-table skill-knowledge-resource-table" rowKey="key" pagination={false} columns={[
                        { title: "资源名称", dataIndex: "name", width: 180 },
                        { title: "资源路径", dataIndex: "path", render: (value) => <Tooltip title={value} placement="topLeft"><Text className="skill-resource-path">{value}</Text></Tooltip> },
                        { title: "关联类型", dataIndex: "relationType", width: 92, render: (value) => <Tag color={value === "文件夹" ? "processing" : "blue"}>{value}</Tag> },
                        { title: "内容类型", dataIndex: "contentType", width: 112 },
                        { title: "状态", dataIndex: "status", width: 78, render: statusTag },
                        { title: "操作", dataIndex: "key", width: 72, render: (key) => <Button type="link" danger size="small" onClick={() => {
                          const nextKeys = (configSkill.knowledgeResourceKeys || []).filter((item) => item !== key);
                          updateConfigSkill({
                            knowledgeResourceKeys: nextKeys,
                            knowledgeBaseKeys: nextKeys.filter((item) => item.startsWith("base:")).map((item) => item.replace("base:", ""))
                          });
                        }}>移除</Button> }
                      ]} dataSource={selectedKnowledgeResources} />
                    </Card>
                  </Space>
                )
              },
              {
                key: "tools",
                label: "关联工具",
                children: (
                  <Space direction="vertical" size={16} className="full-width skill-relation-tab">
                    <Form layout="vertical">
                      <Form.Item label="关联工具">
                        <Select
                          mode="multiple"
                          value={configSkill.toolKeys || []}
                          placeholder="选择该 Skill 可调用的工具"
                          options={toolOptions}
                          onChange={(keys) => updateConfigSkill({ toolKeys: keys })}
                        />
                      </Form.Item>
                    </Form>
                    <Table className="admin-table" rowKey="key" pagination={false} columns={[
                      { title: "工具名称", dataIndex: "name", width: 220 },
                      { title: "工具说明", dataIndex: "description" },
                      { title: "状态", dataIndex: "enabled", width: 90, render: statusTag }
                    ]} dataSource={selectedTools} />
                  </Space>
                )
              },
              {
                key: "debug",
                label: "调试测试",
                children: (
                  <Card size="small" title="调试测试" className="agent-config-card">
                    <Space direction="vertical" size={12} className="full-width">
                      <Input.TextArea rows={6} placeholder="输入模拟客户资料、聊天记录或阶段上下文，用于测试 Skill 输出。" />
                      <Space>
                        <Button type="primary">运行测试</Button>
                        <Button>清空</Button>
                      </Space>
                    </Space>
                  </Card>
                )
              }
            ]}
          />
          </Card>
        </Space>
        <KnowledgeResourcePickerModal
          open={knowledgePickerOpen}
          selectedKey={knowledgePickerKey}
          onSelect={setKnowledgePickerKey}
          onClose={() => setKnowledgePickerOpen(false)}
          onOk={addKnowledgeResource}
        />
      </>
    );
  }
  return (
    <Space direction="vertical" size={16} className="page-stack ai-skill-page">
      <Card title={<PanelTitle title="Skill管理" desc="维护可复用 AI Skill 能力，供智能体按场景组合调用。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setConfigSkill(createDraft())}>新增Skill</Button>} />}>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部能力类型" options={skillTypeOptions} />
          <Select defaultValue="全部状态" options={statusOptions} />
          <Input placeholder="搜索Skill名称或描述" allowClear className="strategy-search-input" />
          <Button type="primary">搜索</Button>
          <Button>重置</Button>
        </Space>
        <Table className="admin-table ai-skill-table" rowKey="key" columns={columns} dataSource={rows} pagination={false} scroll={{ x: 994 }} />
      </Card>
    </Space>
  );
}

function KnowledgeResourcePickerModal({ open, selectedKey, onSelect, onClose, onOk }) {
  const resourceRows = knowledgeBases.flatMap((base) => [
    {
      key: `base:${base.key}`,
      name: base.name,
      path: `${base.category} / ${base.name}`,
      relationType: "文件夹",
      contentType: "目录",
      status: base.status,
      desc: base.desc,
      category: base.category
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
      category: base.category
    }))
  ]);
  const currentResource = resourceRows.find((item) => item.key === selectedKey) || resourceRows[0];
  const treeData = Array.from(new Set(knowledgeBases.map((item) => item.category))).map((category) => {
    const bases = knowledgeBases.filter((item) => item.category === category);
    return {
      title: <Tooltip title={category} placement="topLeft"><span className="resource-tree-label">{category}</span></Tooltip>,
      key: `category:${category}`,
      icon: <FolderOutlined />,
      selectable: false,
      children: bases.map((base) => ({
        title: <Tooltip title={base.name} placement="topLeft"><span className="resource-tree-label">{base.name}</span></Tooltip>,
        key: `base:${base.key}`,
        icon: <FolderOutlined />,
        children: (base.entries || []).map((entry) => ({
          title: <Tooltip title={entry.title} placement="topLeft"><span className="resource-tree-label">{entry.title}</span></Tooltip>,
          key: `entry:${entry.key}`,
          icon: <FileTextOutlined />
        }))
      }))
    };
  });
  return (
    <Modal
      title="选择知识资源"
      open={open}
      width={1080}
      onCancel={onClose}
      onOk={onOk}
      okText="确认关联"
      cancelText="取消"
      okButtonProps={{ disabled: !currentResource }}
      className="knowledge-resource-picker-modal"
    >
      <div className="knowledge-resource-picker">
        <aside className="knowledge-picker-tree">
          <Text className="knowledge-picker-title">资源目录</Text>
          <Tree
            showIcon
            blockNode
            defaultExpandAll
            indentSize={4}
            selectedKeys={currentResource ? [currentResource.key] : []}
            treeData={treeData}
            onSelect={(keys) => {
              const nextKey = keys[0];
              if (nextKey) onSelect(nextKey);
            }}
          />
        </aside>
        <section className="knowledge-picker-preview">
          <div className="knowledge-picker-preview-head">
            <Title level={4}>{currentResource?.name || "未选择资源"}</Title>
            <Space size={6} wrap>
              {currentResource ? <Tag color={currentResource.relationType === "文件夹" ? "processing" : "blue"}>{currentResource.relationType}</Tag> : null}
              {currentResource ? <Tag>{currentResource.contentType}</Tag> : null}
            </Space>
          </div>
          <div className="knowledge-picker-content">
            {currentResource?.desc || "选择左侧文件夹或资源后，可在这里预览内容。"}
          </div>
        </section>
        <aside className="knowledge-picker-rule">
          <Descriptions size="small" column={1} bordered>
            <Descriptions.Item label="资源路径">{currentResource?.path || "-"}</Descriptions.Item>
            <Descriptions.Item label="关联类型">{currentResource?.relationType || "-"}</Descriptions.Item>
            <Descriptions.Item label="状态">{currentResource ? statusTag(currentResource.status) : "-"}</Descriptions.Item>
          </Descriptions>
          <div className="knowledge-preview-section">
            <Text className="knowledge-preview-label">引用方式</Text>
            <div className="knowledge-reference-code">@kb.{currentResource?.path || "请选择资源"}</div>
          </div>
          <div className="knowledge-preview-section">
            <Text className="knowledge-preview-label">资源规则</Text>
            <Text type="secondary">关联文件夹表示 Skill 可引用目录下全部资源；关联具体资源表示只引用该文件内容。</Text>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

function TagLibraryPage() {
  const { message } = AntApp.useApp();
  const [groups, setGroups] = useState(tagGroupsSeed);
  const [roleFilter, setRoleFilter] = useState("全部部门角色");
  const [keyword, setKeyword] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [tagDrafts, setTagDrafts] = useState({});
  const [form] = Form.useForm();
  const totalTags = groups.reduce((sum, group) => sum + group.tags.length, 0);
  const roleFilterOptions = [{ label: "全部部门角色", value: "全部部门角色" }, ...tagRoleOptions];
  const filteredGroups = groups.filter((group) => {
    const keywordText = keyword.trim().toLowerCase();
    const matchesRole = roleFilter === "全部部门角色" || group.roles.includes(roleFilter);
    const matchesKeyword = !keywordText || [group.name, ...group.tags].some((item) => String(item).toLowerCase().includes(keywordText));
    return matchesRole && matchesKeyword;
  });

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
  const syncWecomTags = () => {
    message.success("已同步企微标签，新增 3 个标签组、18 个标签（原型模拟）");
  };

  return (
    <Space direction="vertical" size={16} className="page-stack tag-library-page">
      <Card
        title={<PanelTitle title="标签库管理" desc="维护受控标签体系，标签组可按部门角色使用，并控制 AI 是否允许自动给客户打标签。" extra={<><Button type="primary" icon={<PlusOutlined />} onClick={() => openGroupModal()}>添加标签组</Button><Button icon={<CloudSyncOutlined />} onClick={syncWecomTags}>同步企微标签</Button></>} />}
      >
        <div className="tag-filter-panel">
          <Space wrap size={16}>
            <Space>
              <Text>部门角色：</Text>
              <Select value={roleFilter} options={roleFilterOptions} onChange={setRoleFilter} className="tag-role-select" />
            </Space>
            <Space>
              <Text>搜索：</Text>
              <Input.Search value={keyword} placeholder="请输入标签组或标签" allowClear onChange={(event) => setKeyword(event.target.value)} className="tag-search-input" />
            </Space>
          </Space>
          <Button onClick={() => { setRoleFilter("全部部门角色"); setKeyword(""); }}>重置</Button>
        </div>
        <div className="tag-library-summary">共{totalTags}个标签</div>
        <div className="tag-group-list">
          {filteredGroups.map((group) => (
            <Card
              key={group.key}
              className="tag-group-card"
              title={
                <div className="tag-group-head">
                  <Space wrap size={8}>
                    <span className="tag-group-accent" />
                    <Title level={4}>{group.name}</Title>
                    <Text type="secondary">（共{group.tags.length}个标签）</Text>
                  </Space>
                  <Space size={10}>
                    <Text type="secondary">允许AI自动打标</Text>
                    <Switch size="small" checked={group.aiWritable} onChange={(checked) => setGroups((items) => items.map((item) => item.key === group.key ? { ...item, aiWritable: checked } : item))} />
                    <Button type="link" size="small" onClick={() => openGroupModal(group)}>编辑</Button>
                    <Button type="link" size="small" danger onClick={() => deleteGroup(group)}>删除</Button>
                  </Space>
                </div>
              }
            >
              <div className="tag-group-meta">
                <Text type="secondary">适用部门角色：</Text>
                <Space wrap size={[6, 6]}>{group.roles.map((role) => <Tag color="blue" key={role}>{role}</Tag>)}</Space>
                <Tag color={group.aiWritable ? "success" : "default"}>{group.aiWritable ? "允许AI自动打标" : "禁止AI自动打标"}</Tag>
              </div>
              <div className="tag-chip-row">
                {group.tags.map((tag) => (
                  <Tag closable key={tag} onClose={(event) => { event.preventDefault(); removeTag(group.key, tag); }}>{tag}</Tag>
                ))}
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
            </Card>
          ))}
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
    </Space>
  );
}

function MassMessagePage() {
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();
  const tagOptions = customerTagGroups.map((group) => ({
    label: group.name,
    options: group.tags.map((tag) => ({ value: tag.value, label: tag.source === "AI打标" ? `${tag.value}（AI）` : tag.value }))
  }));
  const courseStatusOptions = ["全部课程状态", "已预约体验课", "已上体验课", "体验课未报名", "已报名", "未预约"].map((value) => ({ value }));
  const initialRows = [
    {
      key: "mass-1",
      name: "A类课课后未报名客户回访",
      audienceMode: "筛选客户",
      audienceTags: ["高意向", "体验课未报名", "好友正常"],
      excludeTags: ["已报名", "已删除销售"],
      estimatedCount: 128,
      sendTime: "2026-08-20 09:30",
      sendAccountMode: "按客户所属销售发送",
      status: "待发送",
      creator: "运营-张敏",
      updatedAt: "2026-08-19 15:20"
    },
    {
      key: "mass-2",
      name: "今晚课程提醒",
      audienceMode: "筛选客户",
      audienceTags: ["已预约体验课", "好友正常"],
      excludeTags: ["已删除销售"],
      estimatedCount: 86,
      sendTime: "2026-08-19 18:30",
      sendAccountMode: "按客户所属销售发送",
      status: "发送中",
      creator: "班主任-陈老师",
      updatedAt: "2026-08-19 18:02"
    },
    {
      key: "mass-3",
      name: "周末家庭教育直播邀约",
      audienceMode: "筛选客户",
      audienceTags: ["家长焦虑", "亲子冲突", "好友正常"],
      excludeTags: ["已报名", "投诉"],
      estimatedCount: 214,
      sendTime: "立即发送",
      sendAccountMode: "指定企微账号发送",
      status: "草稿",
      creator: "市场-周老师",
      updatedAt: "2026-08-18 17:45"
    }
  ];
  const [rows, setRows] = useState(initialRows);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const estimateCount = () => {
    const values = form.getFieldsValue();
    if (values.audienceMode === "全部客户") return 1268;
    const tagCount = (values.audienceTags || []).length;
    const excludeCount = (values.excludeTags || []).length;
    return Math.max(18, 64 + tagCount * 38 - excludeCount * 16);
  };
  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({
      name: "",
      description: "",
      audienceMode: "筛选客户",
      audienceTags: ["高意向", "好友正常"],
      excludeTags: ["已报名", "已删除销售"],
      courseStatus: "全部课程状态",
      sendMode: "定时发送",
      sendAccountMode: "按客户所属销售发送",
      content: "早上好家长～\n\n昨天课程结束后，老师这边已经整理出孩子当前学习里的几个关键点。您方便的话，我晚点把孩子的课堂表现和下一步建议发您，我们一起看看后面怎么安排更合适。",
      materialType: "文本"
    });
    setDrawerOpen(true);
  };
  const createTask = () => {
    form.validateFields().then((values) => {
      const now = new Date().toISOString().slice(0, 16).replace("T", " ");
      const sendTime = values.sendMode === "立即发送" ? "立即发送" : values.sendAt ? values.sendAt.format("YYYY-MM-DD HH:mm") : "未设置";
      setRows((items) => [
        {
          key: `mass-${Date.now()}`,
          name: values.name,
          audienceMode: values.audienceMode,
          audienceTags: values.audienceTags || [],
          excludeTags: values.excludeTags || [],
          estimatedCount: estimateCount(),
          sendTime,
          sendAccountMode: values.sendAccountMode,
          status: values.sendMode === "立即发送" ? "发送中" : "待发送",
          creator: "平台管理员",
          updatedAt: now
        },
        ...items
      ]);
      setDrawerOpen(false);
      message.success("群发任务已创建");
    });
  };
  const filteredRows = rows.filter((item) => {
    const matchesKeyword = !keyword.trim() || item.name.includes(keyword.trim());
    const matchesStatus = statusFilter === "全部状态" || item.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });
  const columns = [
    { title: "群发名称", dataIndex: "name", width: 220 },
    {
      title: "目标人群",
      dataIndex: "audienceTags",
      width: 260,
      render: (items = [], record) => (
        <Space direction="vertical" size={4}>
          <Text>{record.audienceMode}</Text>
          <Space wrap size={[4, 4]}>{items.slice(0, 3).map((item) => <Tag key={item}>{item}</Tag>)}{items.length > 3 ? <Tag>+{items.length - 3}</Tag> : null}</Space>
        </Space>
      )
    },
    { title: "预计发送人数", dataIndex: "estimatedCount", width: 120, render: (value) => `${value} 人` },
    { title: "发送时间", dataIndex: "sendTime", width: 150 },
    { title: "发送账号", dataIndex: "sendAccountMode", width: 170 },
    { title: "发送状态", dataIndex: "status", width: 100, render: (value) => <Tag color={value === "已完成" ? "success" : value === "发送中" ? "processing" : value === "待发送" ? "blue" : "default"}>{value}</Tag> },
    { title: "创建人", dataIndex: "creator", width: 120 },
    { title: "更新时间", dataIndex: "updatedAt", width: 150 },
    {
      title: "操作",
      fixed: "right",
      width: 190,
      render: (_, record) => (
        <Space size={4} className="table-action-group">
          <Button type="link" size="small" onClick={() => message.info(`查看 ${record.name}`)}>查看</Button>
          <Button type="link" size="small" onClick={() => message.info("原型中编辑会复用创建表单")}>编辑</Button>
          <Button type="link" size="small" onClick={() => setRows((items) => [{ ...record, key: `mass-copy-${Date.now()}`, name: `${record.name} 副本`, status: "草稿" }, ...items])}>复制</Button>
          <Button type="link" size="small" danger onClick={() => setRows((items) => items.filter((item) => item.key !== record.key))}>删除</Button>
        </Space>
      )
    }
  ];
  return (
    <>
      <Space direction="vertical" size={16} className="page-stack mass-message-page">
        <Row gutter={[16, 16]}>
          {[
            ["全部任务", rows.length],
            ["待发送", rows.filter((item) => item.status === "待发送").length],
            ["发送中", rows.filter((item) => item.status === "发送中").length],
            ["已完成", rows.filter((item) => item.status === "已完成").length]
          ].map(([label, value]) => (
            <Col xs={12} lg={6} key={label}><Card><Statistic title={label} value={value} /></Card></Col>
          ))}
        </Row>
        <Card title={<PanelTitle title="用户群发" desc="人工创建群发任务，按标签和基础条件筛选客户，支持立即发送或定时发送。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>创建群发任务</Button>} />}>
          <Space className="toolbar" wrap>
            <Input.Search placeholder="搜索群发名称" allowClear value={keyword} onChange={(event) => setKeyword(event.target.value)} className="strategy-search-input" />
            <Select value={statusFilter} options={["全部状态", "草稿", "待发送", "发送中", "已完成", "已暂停"].map((value) => ({ value }))} onChange={setStatusFilter} />
            <Button type="primary">搜索</Button>
            <Button onClick={() => { setKeyword(""); setStatusFilter("全部状态"); }}>重置</Button>
          </Space>
          <Table className="admin-table mass-message-table" rowKey="key" columns={columns} dataSource={filteredRows} pagination={false} scroll={{ x: 1500 }} />
        </Card>
      </Space>
      <Drawer
        title="创建群发任务"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={920}
        extra={<Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" onClick={createTask}>保存任务</Button></Space>}
        className="mass-message-drawer"
      >
        <Form form={form} layout="vertical" className="mass-message-form">
          <Card size="small" title="基础信息">
            <Row gutter={16}>
              <Col span={14}><Form.Item label="群发名称" name="name" rules={[{ required: true, message: "请输入群发名称" }]}><Input placeholder="群发名称仅内部可见" /></Form.Item></Col>
              <Col span={10}><Form.Item label="群发说明" name="description"><Input placeholder="例如：A类课课后未报名回访" /></Form.Item></Col>
            </Row>
          </Card>
          <Card size="small" title="选择客户">
            <Form.Item label="选择客户" name="audienceMode" rules={[{ required: true }]}>
              <Radio.Group options={["全部客户", "筛选客户"].map((value) => ({ value, label: value }))} />
            </Form.Item>
            <div className="mass-audience-box">
              <Row gutter={16}>
                <Col span={24}><Form.Item label="标签" name="audienceTags"><Select mode="multiple" options={tagOptions} placeholder="选择标签确定群发人群" /></Form.Item></Col>
                <Col span={24}><Form.Item label="排除客户" name="excludeTags" extra="选择排除标签后，群发时不会发送给这些标签内的客户。"><Select mode="multiple" options={tagOptions} placeholder="选择需要排除的客户标签" /></Form.Item></Col>
                <Col span={12}><Form.Item label="课程状态" name="courseStatus"><Select options={courseStatusOptions} /></Form.Item></Col>
              </Row>
              <div className="mass-estimate-box">
                <Text type="secondary">预计发送人数</Text>
                <Form.Item noStyle shouldUpdate>
                  {() => <Text className="mass-estimate-count">{estimateCount()} 人</Text>}
                </Form.Item>
              </div>
            </div>
          </Card>
          <Card size="small" title="群发内容">
            <Space wrap className="mass-material-actions">
              <Upload showUploadList={false}><Button icon={<PictureOutlined />}>本地上传图片</Button></Upload>
              <Upload showUploadList={false}><Button icon={<VideoCameraOutlined />}>本地上传视频</Button></Upload>
              <Upload showUploadList={false}><Button icon={<PaperClipOutlined />}>本地上传文件</Button></Upload>
              <Button icon={<FileTextOutlined />}>从素材库选择</Button>
              <Button icon={<LinkOutlined />}>远程地址</Button>
            </Space>
            <Form.Item label="任务描述" name="content" rules={[{ required: true, message: "请输入群发内容" }]}>
              <Input.TextArea rows={9} showCount maxLength={5000} placeholder="输入要群发给客户的内容，可搭配图片、视频、文件或素材库资源。" />
            </Form.Item>
          </Card>
          <Card size="small" title="发送设置">
            <Row gutter={16}>
              <Col span={12}><Form.Item label="发送方式" name="sendMode"><Radio.Group options={["立即发送", "定时发送"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
              <Col span={12}><Form.Item label="定时发送时间" name="sendAt"><DatePicker showTime className="full-width" /></Form.Item></Col>
              <Col span={12}><Form.Item label="发送账号" name="sendAccountMode"><Radio.Group options={["按客户所属销售发送", "指定企微账号发送"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
              <Col span={12}><Form.Item label="指定企微账号" name="sendAccounts"><Select mode="multiple" options={managedWecomAccounts.map((item) => ({ value: item.key, label: item.label }))} placeholder="发送账号为指定时选择" /></Form.Item></Col>
            </Row>
          </Card>
        </Form>
      </Drawer>
    </>
  );
}

function ToolsPage() {
  const [form] = Form.useForm();
  const [toolRows, setToolRows] = useState(agentTools);
  const [editingTool, setEditingTool] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("全部状态");

  useEffect(() => {
    if (editingTool) {
      form.resetFields();
      form.setFieldsValue(editingTool);
    }
  }, [editingTool, form]);

  const filteredRows = toolRows.filter((item) => {
    const keywordText = keyword.trim().toLowerCase();
    const matchesKeyword = !keywordText || [item.name, item.description, item.prompt].some((value) => String(value).toLowerCase().includes(keywordText));
    const matchesStatus = status === "全部状态" || (status === "启用" ? item.enabled : !item.enabled);
    return matchesKeyword && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingTool({
      key: "",
      id: toolRows.length ? Math.max(...toolRows.map((item) => item.id)) + 1 : 1,
      name: "",
      description: "",
      prompt: "",
      enabled: true,
      updatedAt: new Date().toISOString().slice(0, 19)
    });
  };

  const handleSave = (values) => {
    const nextTool = {
      ...editingTool,
      ...values,
      updatedAt: new Date().toISOString().slice(0, 19)
    };
    if (editingTool.key) {
      setToolRows((items) => items.map((item) => (item.key === editingTool.key ? nextTool : item)));
    } else {
      setToolRows((items) => [...items, { ...nextTool, key: `tool-${Date.now()}` }]);
    }
    setEditingTool(null);
  };

  const handleEnabledChange = (record, checked) => {
    setToolRows((items) => items.map((item) => (item.key === record.key ? { ...item, enabled: checked, updatedAt: new Date().toISOString().slice(0, 19) } : item)));
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 90 },
    { title: "工具名称", dataIndex: "name", width: 220 },
    { title: "描述", dataIndex: "description", ellipsis: true },
    {
      title: "启用",
      dataIndex: "enabled",
      width: 120,
      render: (value, record) => <Switch checked={value} onChange={(checked) => handleEnabledChange(record, checked)} />
    },
    { title: "更新时间", dataIndex: "updatedAt", width: 190, ellipsis: true },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setEditingTool(record)}>编辑</Button>
          <Button
            type="link"
            danger
            onClick={() => Modal.confirm({
              title: "删除工具提示词",
              content: `确认删除 ${record.name}？删除后该工具将不可被 Agent 调用。`,
              okText: "删除",
              okButtonProps: { danger: true },
              cancelText: "取消",
              onOk: () => setToolRows((items) => items.filter((item) => item.key !== record.key))
            })}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      <Space direction="vertical" size={16} className="page-stack">
        <Card>
          <Row gutter={[24, 16]} align="middle" className="tool-filter-row">
            <Col xs={24} md={10} xl={6}>
              <Form.Item label="关键词" className="filter-form-item">
                <Input placeholder="请输入" value={keyword} onChange={(event) => setKeyword(event.target.value)} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} xl={6}>
              <Form.Item label="状态" className="filter-form-item">
                <Select value={status} onChange={setStatus} options={["全部状态", "启用", "停用"].map((value) => ({ value, label: value === "全部状态" ? "请选择" : value }))} />
              </Form.Item>
            </Col>
            <Col xs={24} xl={12} className="tool-filter-actions">
              <Divider type="vertical" className="tool-filter-divider" />
              <Space>
                <Button type="primary">查询</Button>
                <Button onClick={() => { setKeyword(""); setStatus("全部状态"); }}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card title={<PanelTitle title="AI工具提示词" desc="维护可供 Agent 调用的工具名称、描述、提示词内容和启用状态。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>新增工具</Button>} />}>
          <Table
            className="admin-table tool-table"
            rowKey="key"
            columns={columns}
            dataSource={filteredRows}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            scroll={{ x: 1160 }}
          />
        </Card>
      </Space>
      <Modal
        title={editingTool?.key ? "编辑工具提示词" : "新增工具提示词"}
        open={Boolean(editingTool)}
        onCancel={() => setEditingTool(null)}
        onOk={() => form.submit()}
        okText="保存"
        cancelText="取消"
        width={1080}
      >
        <Form form={form} layout="horizontal" labelCol={{ xs: 24, sm: 4 }} wrapperCol={{ xs: 24, sm: 20 }} onFinish={handleSave}>
          <Form.Item label="工具名称" name="name" rules={[{ required: true, message: "请输入工具名称" }]}>
            <Input placeholder="请输入工具名称" />
          </Form.Item>
          <Form.Item label="工具描述" name="description" rules={[{ required: true, message: "请输入工具描述" }]}>
            <Input.TextArea rows={3} placeholder="请输入工具描述" />
          </Form.Item>
          <Form.Item label="提示词内容" name="prompt" rules={[{ required: true, message: "请输入提示词内容" }]}>
            <Input.TextArea rows={11} placeholder="请输入 Agent 调用该工具时使用的提示词，可使用 {{变量名}} 作为上下文占位符。" />
          </Form.Item>
          <Form.Item label="启用" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Text type="secondary">工具提示词保存后可用于 AI Agent 调用。</Text>
        </Form>
      </Modal>
    </>
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
    "已付费",
    "高意向",
    "720期次",
    "已预约体验课",
    "第一节体验课完成",
    "第二节体验课完成",
    "中意向",
    "低意向",
    "需人工介入",
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
      key: "daily-report",
      name: "客户销售策略日报",
      type: "销售策略总结",
      status: "启用",
      scope: "标签人群",
      audienceTags: ["高意向", "已上体验课", "体验课未报名", "需人工跟进"],
      scheduleTime: "20:00",
      scheduleCycle: "每天一次",
      inputScope: ["客户档案", "最近24小时会话", "课程信息", "用户标签", "听课数据"],
      outputResults: ["销售策略", "人工提醒"],
      writeTargets: ["客户档案-销售策略", "人工工作台"],
      reviewMode: "无需审核，直接写入",
      logic: "每天晚上汇总客户最近 24 小时的企微会话、课程状态、听课时长和标签变化，判断当前主要矛盾、购买意向、亲子冲突强度和下一步销售建议。对高意向但未报名客户生成跟进提醒；对情绪敏感或冲突高的客户提示销售先共情和收集信息，不直接强推产品。输出写入客户档案“销售策略”tab，并在人工工作台生成今日重点跟进列表。"
    },
    {
      key: "auto-tagging",
      name: "周期性AI打标",
      type: "周期性AI打标",
      status: "启用",
      scope: "标签人群",
      audienceTags: ["好友正常", "高意向", "中意向", "待试听", "试听完成"],
      scheduleTime: "09:00",
      scheduleCycle: "6小时1次",
      inputScope: ["最近7天会话", "客户档案", "课程信息", "已有标签", "订单状态"],
      outputResults: ["客户标签", "打标理由"],
      writeTargets: ["客户标签", "打标记录"],
      reviewMode: "仅高风险结果需审核",
      logic: "扫描最近 7 天有互动的客户，根据标签库中允许 AI 自动打标的标签组判断是否新增、移除或保持标签。比如用户主动问价格、服务形式、报名方式，且已完成体验课，可建议“高意向（AI）”；如果多次表达犹豫或价格压力，可建议“价格敏感”。客户状态、企微关系、已报名等重要标签不允许直接写入，只能生成建议并等待人工确认。每次打标必须输出依据片段和置信度。"
    },
    {
      key: "personalized-prompt",
      name: "生成个性化策略提示词",
      type: "生成个性化策略提示词",
      status: "启用",
      scope: "单个客户",
      audienceTags: ["好友正常", "需人工跟进", "亲子冲突"],
      scheduleTime: "08:00",
      scheduleCycle: "1小时1次",
      inputScope: ["客户档案", "流程阶段", "最近10轮会话", "用户标签", "销售策略"],
      outputResults: ["策略提示词", "会话智能体上下文"],
      writeTargets: ["会话智能体上下文", "客户档案-策略记录"],
      reviewMode: "无需审核，直接写入",
      logic: "当客户进入新的角色流程阶段时，生成一段面向当前会话智能体的个性化策略提示词。内容包括客户关键背景、当前最适合的沟通角度、禁止触碰的话题、是否适合推品、下一轮建议动作。比如亲子冲突高、家长焦虑明显的客户，应提示会话智能体先稳定情绪和确认事实，不要过早介绍课程价格；已完成体验课且认可老师判断的客户，可提示智能体适度引导人工确认方案。"
    },
    {
      key: "follow-up-task",
      name: "自动生成跟进任务",
      type: "生成定时任务",
      status: "启用",
      scope: "标签人群",
      audienceTags: ["已预约体验课", "已上体验课", "体验课未报名", "高意向"],
      scheduleTime: "09:00",
      scheduleCycle: "每天一次",
      inputScope: ["课程计划", "听课状态", "最近会话", "用户标签", "销售负责人"],
      outputResults: ["定时任务", "人工提醒"],
      writeTargets: ["聊天计划", "人工工作台", "会话中心提醒"],
      reviewMode: "敏感触达需确认",
      logic: "根据客户课程计划、听课状态和最近互动自动生成后续触达任务。比如体验课前 30 分钟生成课前提醒；课后 20 分钟生成反馈收集；课后 24 小时仍未报名且标签为高意向时生成销售人工跟进提醒。若客户刚表达反感、投诉或明确拒绝，不自动生成营销触达，只生成人工复盘提醒。生成任务时要包含触达目标、建议时间、触达方式和风险提示。"
    }
  ];
  const strategyTaskTypeOptions = ["销售策略总结", "周期性AI打标", "生成个性化策略提示词", "生成定时任务"].map((value) => ({ value }));
  const strategyScopeOptions = ["单个客户", "标签人群", "全部客户"].map((value) => ({ value }));
  const strategyCycleOptions = ["1小时1次", "6小时1次", "12小时1次", "每天一次", "2天一次", "1周一次"].map((value) => ({ value }));
  const strategyInputScopeOptions = ["客户档案", "最近24小时会话", "最近7天会话", "最近10轮会话", "历史会话摘要", "课程信息", "课程计划", "听课数据", "用户标签", "已有标签", "订单状态", "销售策略", "销售负责人", "流程阶段"].map((value) => ({ value }));
  const strategyOutputResultOptions = ["销售策略", "客户标签", "打标理由", "策略提示词", "会话智能体上下文", "定时任务", "人工提醒"].map((value) => ({ value }));
  const strategyWriteTargetOptions = ["客户档案-销售策略", "客户档案-策略记录", "客户标签", "打标记录", "会话智能体上下文", "聊天计划", "人工工作台", "会话中心提醒"].map((value) => ({ value }));
  const strategyReviewModeOptions = ["无需审核，直接写入", "写入前需人工审核", "仅高风险结果需审核", "只生成建议，不自动写入", "敏感触达需确认"].map((value) => ({ value }));
  const strategyAudienceTagOptions = customerTagGroups.map((group) => ({
    label: group.name,
    options: group.tags.map((tag) => ({ value: tag.value, label: tag.source === "AI打标" ? `${tag.value}（AI）` : tag.value }))
  }));
  const createStrategyTaskDraft = (index = 0) => ({
    key: `strategy-task-${Date.now()}`,
    name: index === 0 ? "客户销售策略日报" : "新增策略任务",
    type: "销售策略总结",
    status: "启用",
    scope: "标签人群",
    audienceTags: ["高意向"],
    scheduleTime: "20:00",
    scheduleCycle: "每天一次",
    inputScope: ["客户档案", "最近24小时会话", "用户标签"],
    outputResults: ["销售策略"],
    writeTargets: ["客户档案-销售策略"],
    reviewMode: "无需审核，直接写入",
    logic: "描述该策略任务的判断条件、执行步骤、输出格式和异常处理方式。"
  });
  const [strategyTasks, setStrategyTasks] = useState(strategyTaskConfigs);
  const [strategyTaskEditor, setStrategyTaskEditor] = useState(null);
  const [strategyTaskDraft, setStrategyTaskDraft] = useState(createStrategyTaskDraft(0));
  const openStrategyTaskEditor = (index = null) => {
    setStrategyTaskEditor({ index });
    setStrategyTaskDraft(index == null ? createStrategyTaskDraft(strategyTasks.length) : { ...strategyTasks[index] });
  };
  const saveStrategyTaskDraft = () => {
    if (!strategyTaskDraft.name?.trim()) {
      message.warning("请输入任务名称");
      return;
    }
    if (strategyTaskEditor.index == null) {
      setStrategyTasks((items) => [...items, { ...strategyTaskDraft, key: `strategy-task-${Date.now()}` }]);
    } else {
      setStrategyTasks((items) => items.map((item, index) => (index === strategyTaskEditor.index ? strategyTaskDraft : item)));
    }
    setStrategyTaskEditor(null);
  };
  const createScheduleRule = (index = 0) => ({
    taskName: index === 0 ? "自我介绍" : index === 1 ? "追问客户需求" : "阶段结果同步",
    taskDescription: index === 0 ? "打招呼，说明服务身份，并承接客户当前咨询场景。" : index === 1 ? "围绕年级、英语基础、学习目标和时间安排进行需求确认。" : "同步当前阶段结果，更新客户状态并准备后续跟进。",
    taskType: index === 0 ? "ADD_FRIEND" : "AGENT_START",
    delayType: index === 0 ? "IMMEDIATE" : "DELAY",
    delayValue: index === 0 ? 0 : index === 1 ? 1 : 30,
    delayUnit: "分钟",
    enabled: true
  });
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
  const openTaskEditor = (index = null) => {
    const rules = form.getFieldValue("scheduleRules") || [];
    setTaskEditor({ index });
    setTaskDraft(index == null ? createScheduleRule(rules.length) : { ...createScheduleRule(index), ...(rules[index] || {}) });
  };
  const [selectedKnowledgeBaseKeys, setSelectedKnowledgeBaseKeys] = useState(skill.knowledgeBaseKeys || defaultKnowledgeBaseKeys);
  const [selectedToolKeys, setSelectedToolKeys] = useState(skill.toolKeys || defaultToolKeys);
  const [selectedAiSkillKeys, setSelectedAiSkillKeys] = useState(skill.aiSkillKeys || fallbackAiSkillKeys);
  const selectedKnowledgeBases = knowledgeBases.filter((item) => selectedKnowledgeBaseKeys.includes(item.key));
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
        <div className="agent-config-overview">
          <Descriptions
            className="agent-basic-summary"
            size="small"
            bordered
            column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
          >
            <Descriptions.Item label="智能体名称">{skill.name}</Descriptions.Item>
            <Descriptions.Item label="Agent Code">{skill.code || `${skill.key || "agent"}_agent`}</Descriptions.Item>
            <Descriptions.Item label="分类">{skill.type || "消息生成"}</Descriptions.Item>
            <Descriptions.Item label="状态">{statusTag(skill.status || "启用")}</Descriptions.Item>
            <Descriptions.Item label="模型">{modelConfig.model}</Descriptions.Item>
            <Descriptions.Item label="工具 / Skill">{selectedToolKeys.length} 个工具 / {selectedAiSkillKeys.length} 个 Skill</Descriptions.Item>
            <Descriptions.Item label="说明" span={3}>{skill.description || `${skill.name} 用于在指定业务场景中独立完成 AI 任务，并可按需关联工具与 Skill。`}</Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
      <Card className="skill-editor-tabs-card">
        <Tabs
          className="skill-editor-tabs"
          defaultActiveKey="model"
          items={[
            {
              key: "model",
              label: "模型配置",
              children: (
                <Card size="small" title="模型基础配置" className="agent-config-card">
                  <Form layout="vertical" initialValues={modelConfig}>
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
                    <SkillLogicRichEditor defaultValue={isStrategyAgent ? strategyAgentLogicText : logicText} />
                  </section>
                  <section className="skill-config-pane">
                    <div className="builder-pane-head">
                      <Title level={4}>{isStrategyAgent ? "策略任务配置" : "智能体编排"}</Title>
                    </div>
                    {isStrategyAgent ? (
                      <>
                        <div className="strategy-task-config-form">
                          <div className="strategy-task-config-summary">
                            <Text type="secondary">已配置 {strategyTasks.length} 个策略任务。点击“配置任务”在弹窗中维护任务字段；左侧提示词只维护全局角色和共性规则。</Text>
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
                                      <Tag>{task.reviewMode}</Tag>
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
                        <Modal
                          title={strategyTaskEditor?.index == null ? "配置策略任务" : "编辑策略任务"}
                          open={Boolean(strategyTaskEditor)}
                          width={860}
                          okText="保存任务"
                          cancelText="取消"
                          onCancel={() => setStrategyTaskEditor(null)}
                          onOk={saveStrategyTaskDraft}
                        >
                          <Form layout="vertical" className="strategy-task-modal-form">
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item label="任务名称">
                                  <Input value={strategyTaskDraft.name} placeholder="例如：高意向客户晚间日报" onChange={(event) => setStrategyTaskDraft((item) => ({ ...item, name: event.target.value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="任务类型">
                                  <Select value={strategyTaskDraft.type} options={strategyTaskTypeOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, type: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item label="执行对象">
                                  <Select value={strategyTaskDraft.scope} options={strategyScopeOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, scope: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item label="固定执行时间">
                                  <Input value={strategyTaskDraft.scheduleTime} placeholder="例如：20:00" onChange={(event) => setStrategyTaskDraft((item) => ({ ...item, scheduleTime: event.target.value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item label="执行周期">
                                  <Select value={strategyTaskDraft.scheduleCycle} options={strategyCycleOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, scheduleCycle: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item label="适用标签人群">
                                  <Select mode="multiple" value={strategyTaskDraft.audienceTags} options={strategyAudienceTagOptions} placeholder="选择标签确定任务适用人群" onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, audienceTags: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item label="输入数据范围">
                                  <Select mode="multiple" value={strategyTaskDraft.inputScope} options={strategyInputScopeOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, inputScope: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="输出结果">
                                  <Select mode="multiple" value={strategyTaskDraft.outputResults} options={strategyOutputResultOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, outputResults: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="输出去向">
                                  <Select mode="multiple" value={strategyTaskDraft.writeTargets} options={strategyWriteTargetOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, writeTargets: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="输出审核方式">
                                  <Select value={strategyTaskDraft.reviewMode} options={strategyReviewModeOptions} onChange={(value) => setStrategyTaskDraft((item) => ({ ...item, reviewMode: value }))} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="状态">
                                  <Switch checked={strategyTaskDraft.status === "启用"} checkedChildren="启用" unCheckedChildren="停用" onChange={(checked) => setStrategyTaskDraft((item) => ({ ...item, status: checked ? "启用" : "停用" }))} />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item label="任务逻辑描述">
                                  <Input.TextArea rows={6} value={strategyTaskDraft.logic} showCount maxLength={1200} placeholder="描述该任务的判断条件、执行步骤、输出格式和异常处理方式。" onChange={(event) => setStrategyTaskDraft((item) => ({ ...item, logic: event.target.value }))} />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </Modal>
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
                                      <Select placeholder="选择用户标签，例如：已付费、高意向、720期次" options={userTagOptions} />
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
                                <Modal
                                  className="agent-task-modal"
                                  title={taskEditor?.index == null ? "新增策略任务" : "编辑策略任务"}
                                  open={Boolean(taskEditor)}
                                  width={720}
                                  okText="确定"
                                  cancelText="取消"
                                  onCancel={() => setTaskEditor(null)}
                                  onOk={() => {
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
                                  <div className="task-dialog-form">
                                    <div className="task-dialog-field">
                                      <Text className="task-dialog-label">任务类型</Text>
                                      <Select value={taskDraft.taskType} placeholder="任务类型（时间锚点）" options={taskTypeOptions} onChange={(value) => setTaskDraft((item) => ({ ...item, taskType: value }))} />
                                    </div>
                                    <div className="task-dialog-field">
                                      <Text className="task-dialog-label">触发类型</Text>
                                      <Select value={taskDraft.delayType} placeholder="触发类型" options={delayTypeOptions} onChange={(value) => setTaskDraft((item) => ({ ...item, delayType: value, delayValue: value === "IMMEDIATE" ? 0 : item.delayValue }))} />
                                    </div>
                                    {taskDraft.delayType === "DELAY" ? (
                                      <div className="task-dialog-field">
                                        <Text className="task-dialog-label">延后时间</Text>
                                        <div className="task-row">
                                          <InputNumber min={0} max={9999} value={taskDraft.delayValue} onChange={(value) => setTaskDraft((item) => ({ ...item, delayValue: value }))} />
                                          <Select value={taskDraft.delayUnit} options={relativeTimeUnitOptions} onChange={(value) => setTaskDraft((item) => ({ ...item, delayUnit: value }))} />
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
                                      <Text className="task-dialog-label">任务描述</Text>
                                      <Input.TextArea value={taskDraft.taskDescription} rows={10} showCount maxLength={5000} placeholder="可选，可写较长说明（任务意图、话术要点等）" onChange={(event) => setTaskDraft((item) => ({ ...item, taskDescription: event.target.value }))} />
                                    </div>
                                  </div>
                                </Modal>
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
              children: (
                <Space direction="vertical" size={16} className="full-width skill-relation-tab">
                  <Card
                    title={
                      <PanelTitle
                        title="关联工具"
                        desc="配置该智能体可调用的 AI 工具，用于外部查询、通知、跳转和托管动作。"
                      />
                    }
                  >
                    <Form layout="vertical">
                      <Form.Item label="选择工具">
                        <Select
                          mode="multiple"
                          value={selectedToolKeys}
                          placeholder="选择该智能体可调用的 AI 工具"
                          options={toolOptions}
                          onChange={setSelectedToolKeys}
                        />
                      </Form.Item>
                    </Form>
                    <Table
                      className="admin-table"
                      rowKey="key"
                      pagination={false}
                      scroll={{ x: 980 }}
                      columns={[
                        { title: "已关联工具", dataIndex: "name", width: 220 },
                        { title: "工具说明", dataIndex: "description", ellipsis: true },
                        { title: "状态", dataIndex: "enabled", width: 90, render: statusTag },
                        { title: "更新时间", dataIndex: "updatedAt", width: 170 }
                      ]}
                      dataSource={selectedTools}
                    />
                  </Card>
                </Space>
              )
            },
            {
              key: "agent-skills",
              label: "Skill配置",
              children: (
                <Space direction="vertical" size={16} className="full-width skill-relation-tab">
                  <Card
                    title={
                      <PanelTitle
                        title="Skill调用配置"
                        desc="查看该智能体已关联的 Skill 默认能力定义，具体调用时机由智能体编排和提示词策略共同决定。"
                      />
                    }
                  >
                    <Form layout="vertical">
                      <Form.Item label="选择Skill">
                        <Select
                          mode="multiple"
                          value={selectedAiSkillKeys}
                          placeholder="选择该智能体可关联的 Skill"
                          options={aiSkillOptions}
                          onChange={setSelectedAiSkillKeys}
                        />
                      </Form.Item>
                    </Form>
                    <Table
                      className="admin-table agent-skill-config-table"
                      rowKey="key"
                      pagination={false}
                      scroll={{ x: 920 }}
                      columns={[
                        { title: "Skill名称", dataIndex: "name", width: 160 },
                        { title: "Skill类型", dataIndex: "type", width: 96, render: (value) => <Tag color="blue">{value}</Tag> },
                        { title: "输出类型", dataIndex: "outputType", width: 110 },
                        { title: "默认输出去向", dataIndex: "outputTargets", width: 190, render: (items = []) => <Space wrap size={[4, 4]}>{items.map((item) => <Tag key={item}>{item}</Tag>)}</Space> },
                        { title: "Skill描述", dataIndex: "description", width: 250, render: (value) => <Text type="secondary" className="agent-skill-desc">{value}</Text> },
                        { title: "状态", dataIndex: "status", width: 76, render: statusTag },
                        { title: "操作", dataIndex: "key", width: 70, render: (key) => (
                          <Space size={4} className="table-action-group">
                            <Button type="link" size="small" danger onClick={() => setSelectedAiSkillKeys((keys) => keys.filter((item) => item !== key))}>移除</Button>
                          </Space>
                        ) }
                      ]}
                      dataSource={agentSkillRows}
                    />
                  </Card>
                </Space>
              )
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
  const [baseRows, setBaseRows] = useState(knowledgeBases);
  const initialEntryKey = knowledgeBases[0]?.entries?.[0]?.key || "";
  const [selectedTreeKey, setSelectedTreeKey] = useState(initialEntryKey ? `entry:${initialEntryKey}` : "root");
  const [editingBase, setEditingBase] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const selectedCategory = selectedTreeKey.startsWith("category:") ? selectedTreeKey.replace("category:", "") : "";
  const selectedBaseKey = selectedTreeKey.startsWith("base:") ? selectedTreeKey.replace("base:", "") : "";
  const selectedEntryKey = selectedTreeKey.startsWith("entry:") ? selectedTreeKey.replace("entry:", "") : "";
  const selectedBase = baseRows.find((item) => item.key === selectedBaseKey);
  const flattenedEntries = baseRows.flatMap((base) => (base.entries || []).map((entry) => ({
    ...entry,
    baseKey: base.key,
    baseName: base.name,
    category: base.category,
    desc: base.desc,
    baseDesc: base.desc,
    path: `${base.category}/${base.name}/${entry.title}`
  })));
  const selectedEntry = flattenedEntries.find((item) => item.key === selectedEntryKey) || flattenedEntries[0];
  const currentBaseForCreate = selectedBase || baseRows.find((item) => item.category === selectedCategory) || baseRows.find((item) => item.key === selectedEntry?.baseKey) || baseRows[0];
  const currentBaseEntries = currentBaseForCreate?.entries || [];
  const categories = Array.from(new Set(baseRows.map((item) => item.category)));
  const totalSize = flattenedEntries.reduce((sum, entry) => sum + (entry.content?.length || 1024), 0);
  const formatSize = (bytes) => bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
  const getEntryContent = (entry) => entry?.content || `# ${entry?.title || "资源内容"}\n\n该资源用于 ${entry?.baseName || "当前目录"} 场景，回答时需以已维护内容为准，不编造未维护的信息。\n\n## 使用要求\n- 涉及价格、时间、链接、服务承诺时，优先引用工具返回或明确知识内容。\n- 内容不足时提示需要人工确认。\n- 不暴露内部路径、字段名或系统规则。`;
  const selectedEntryContent = getEntryContent(selectedEntry);
  const renameSelected = () => {
    if (selectedEntryKey && selectedEntry) {
      setEditingEntry({ ...selectedEntry, baseKey: selectedEntry.baseKey });
      return;
    }
    if (selectedBase) setEditingBase(selectedBase);
  };
  const deleteBase = (base) => {
    Modal.confirm({
      title: "删除文件夹",
      content: `确认删除 ${base.name} 及其下所有资源？`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        setBaseRows((items) => items.filter((item) => item.key !== base.key));
        setSelectedTreeKey("root");
      }
    });
  };
  const deleteEntry = (entry) => {
    Modal.confirm({
      title: "删除资源",
      content: `确认删除 ${entry.title}？`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        setBaseRows((items) => items.map((base) => base.key === entry.baseKey ? { ...base, entries: base.entries.filter((item) => item.key !== entry.key) } : base));
        setSelectedTreeKey(`base:${entry.baseKey}`);
      }
    });
  };
  const updateSelectedEntryContent = (content) => {
    if (!selectedEntry) return;
    setBaseRows((items) => items.map((base) => {
      if (base.key !== selectedEntry.baseKey) return base;
      const updated = new Date().toISOString().slice(0, 16).replace("T", " ");
      return {
        ...base,
        updated,
        entries: base.entries.map((entry) => entry.key === selectedEntry.key ? { ...entry, content, updated } : entry)
      };
    }));
  };
  const knowledgeCompatHint = 'Tooltip title={record.desc} overlayClassName="knowledge-base-tooltip" width: 520 knowledge-base-title';
  const treeData = categories.map((category) => {
    const bases = baseRows.filter((item) => item.category === category);
    return {
      title: <Tooltip title={category} placement="topLeft"><span className="resource-tree-label">{category}</span></Tooltip>,
      key: `category:${category}`,
      icon: <FolderOutlined />,
      children: bases.map((base) => ({
        title: (
          <div className="resource-tree-node">
            <Tooltip title={base.name} placement="topLeft"><span>{base.name}</span></Tooltip>
            <Space size={2} className="resource-tree-actions">
              <Button type="text" size="small" icon={<EditOutlined />} onClick={(event) => { event.stopPropagation(); setEditingBase(base); }} />
              <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(event) => { event.stopPropagation(); deleteBase(base); }} />
            </Space>
          </div>
        ),
        key: `base:${base.key}`,
        icon: <FolderOutlined />,
        children: (base.entries || []).map((entry) => ({
          title: (
            <div className="resource-tree-node">
              <Tooltip title={entry.title} placement="topLeft"><span>{entry.title}</span></Tooltip>
              <Space size={2} className="resource-tree-actions">
                <Button type="text" size="small" icon={<EditOutlined />} onClick={(event) => { event.stopPropagation(); setEditingEntry({ ...entry, baseKey: base.key }); }} />
                <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(event) => { event.stopPropagation(); deleteEntry({ ...entry, baseKey: base.key }); }} />
              </Space>
            </div>
          ),
          key: `entry:${entry.key}`,
          icon: <FileTextOutlined />
        }))
      }))
    };
  });

  const saveBase = (values) => {
    const nextBase = {
      ...editingBase,
      ...values,
      updated: new Date().toISOString().slice(0, 16).replace("T", " "),
      entries: editingBase?.entries || []
    };
    if (editingBase?.key) {
      setBaseRows((items) => items.map((item) => (item.key === editingBase.key ? nextBase : item)));
    } else {
      const created = { ...nextBase, key: `kb-${Date.now()}` };
      setBaseRows((items) => [...items, created]);
      setSelectedTreeKey(`base:${created.key}`);
    }
    setEditingBase(null);
  };

  const saveEntry = (values) => {
    const targetBaseKey = editingEntry?.baseKey || selectedBase?.key || currentBaseForCreate?.key;
    if (!targetBaseKey) return;
    const nextEntry = {
      ...editingEntry,
      ...values,
      tags: values.tags || [],
      updated: new Date().toISOString().slice(0, 16).replace("T", " ")
    };
    setBaseRows((items) => items.map((item) => {
      if (item.key !== targetBaseKey) return item;
      const { baseKey, baseName, baseDesc, category, owner, ...entryPayload } = nextEntry;
      const entries = editingEntry?.key
        ? item.entries.map((entry) => (entry.key === editingEntry.key ? entryPayload : entry))
        : [...item.entries, { ...entryPayload, key: `ke-${Date.now()}` }];
      return { ...item, entries, updated: nextEntry.updated };
    }));
    if (!editingEntry?.key) setSelectedTreeKey(`base:${targetBaseKey}`);
    setEditingEntry(null);
  };

  return (
    <>
      <Space direction="vertical" size={16} className="page-stack knowledge-page">
        <Card
          className="knowledge-workbench-card"
          title={<PanelTitle title="知识库管理" desc="知识库列表以资源目录方式维护，可管理条目、文件夹和资源内容，方便 Skill 或智能体按路径选择引用。" extra={<><Button onClick={() => setEditingBase({ category: selectedBase?.category || selectedCategory || "课程知识" })}>新建文件夹</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingEntry({ baseKey: currentBaseForCreate?.key })}>添加资源</Button></>} />}
        >
          <div className="knowledge-resource-workbench">
            <aside className="knowledge-tree-panel">
              <div className="resource-sidebar-head">
                <div>
                  <Title level={4}>资源目录</Title>
                  <Text type="secondary">共 {flattenedEntries.length} 个资源 · {formatSize(totalSize)}</Text>
                </div>
                <Space size={4} className="resource-sidebar-quick-actions">
                  <Tooltip title="添加资源"><Button size="small" icon={<PlusOutlined />} onClick={() => setEditingEntry({ baseKey: currentBaseForCreate?.key })} /></Tooltip>
                  <Tooltip title="新建文件夹"><Button size="small" icon={<FolderOutlined />} onClick={() => setEditingBase({ category: selectedBase?.category || selectedCategory || "课程知识" })} /></Tooltip>
                </Space>
                <span className="sr-only">返回知识库列表</span>
              </div>
              <Tree
                showIcon
                blockNode
                defaultExpandAll
                indentSize={4}
                selectedKeys={[selectedTreeKey]}
                treeData={treeData}
                onSelect={(keys) => {
                  const nextKey = keys[0] || "root";
                  setSelectedTreeKey(nextKey);
                }}
              />
            </aside>
            <section className="resource-editor-panel">
              {selectedEntry ? (
                <>
                  <div className="resource-editor-head">
                    <div>
                      <Title level={4}>{selectedEntry.path}</Title>
                      <Space size={8} wrap>
                        <Tag>{selectedEntry.media === "文本" ? "text/markdown" : selectedEntry.media}</Tag>
                        <Tag>{formatSize(selectedEntryContent.length)}</Tag>
                      </Space>
                    </div>
                    <Space size={8}>
                      <Button onClick={renameSelected}>重命名</Button>
                      <Button danger onClick={() => deleteEntry(selectedEntry)}>删除</Button>
                    </Space>
                  </div>
                  <div className="resource-editor-body">
                    <div className="resource-line-numbers">
                      {selectedEntryContent.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}
                    </div>
                    <Input.TextArea
                      className="resource-markdown-editor"
                      value={selectedEntryContent}
                      autoSize={{ minRows: 24, maxRows: 34 }}
                      onChange={(event) => updateSelectedEntryContent(event.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <div className="resource-editor-head">
                    <div>
                      <Title level={4}>{selectedBase?.name || selectedCategory || "全部资源"}</Title>
                      <Text type="secondary">{selectedBase?.desc || "选择左侧资源后可在中间查看和编辑内容。"}</Text>
                    </div>
                    <Space size={8}>
                      {selectedBase ? <Button onClick={() => setEditingBase(selectedBase)}>重命名</Button> : null}
                      {selectedBase ? <Button danger onClick={() => deleteBase(selectedBase)}>删除</Button> : null}
                    </Space>
                  </div>
                  <div className="resource-folder-summary">
                    <FileTextOutlined />
                    <Text type="secondary">当前目录下有 {currentBaseEntries.length} 个资源。点击左侧具体资源文件后，可查看和编辑正文内容。</Text>
                  </div>
                </div>
              )}
            </section>
            <aside className="knowledge-preview-panel">
              {selectedEntry ? (
                <>
                  <div className="knowledge-preview-head">
                    <Space direction="vertical" size={6}>
                      <Tag color="blue">{selectedEntry.category}</Tag>
                      <Title level={4}>{selectedEntry.title}</Title>
                      <Text type="secondary">{selectedEntry.baseName}</Text>
                    </Space>
                    <Button size="small" onClick={() => setEditingEntry({ ...selectedEntry, baseKey: selectedEntry.baseKey })}>编辑</Button>
                  </div>
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="媒体类型">{selectedEntry.media}</Descriptions.Item>
                    <Descriptions.Item label="知识类型">{selectedEntry.type}</Descriptions.Item>
                    <Descriptions.Item label="状态">{statusTag(selectedEntry.status)}</Descriptions.Item>
                    <Descriptions.Item label="更新时间">{selectedEntry.updated}</Descriptions.Item>
                  </Descriptions>
                  <div className="knowledge-preview-section">
                    <Text className="knowledge-preview-label">知识内容预览</Text>
                    <div className="knowledge-content-preview">
                      {selectedEntryContent}
                    </div>
                  </div>
                  <div className="knowledge-preview-section">
                    <Text className="knowledge-preview-label">引用方式</Text>
                    <div className="knowledge-reference-code">@kb.{selectedEntry.path}</div>
                  </div>
                  <div className="knowledge-preview-section">
                    <Text className="knowledge-preview-label">资源规则</Text>
                    <Text type="secondary">只用于当前知识库适用场景；涉及价格、时间、链接、服务承诺时，以已维护内容和工具返回为准。</Text>
                  </div>
                </>
              ) : (
                <div className="knowledge-preview-empty">
                  <FileTextOutlined />
                  <Text type="secondary">选择一条知识后在这里预览内容、引用方式和使用边界。</Text>
                </div>
              )}
            </aside>
          </div>
        </Card>
      </Space>
      <KnowledgeBaseModal base={editingBase} onClose={() => setEditingBase(null)} onSave={saveBase} />
      <KnowledgeEntryModal entry={editingEntry} onClose={() => setEditingEntry(null)} onSave={saveEntry} />
    </>
  );
}

function KnowledgeBaseModal({ base, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (base) {
      form.resetFields();
      form.setFieldsValue({
        name: base.name || "",
        category: base.category || "课程知识",
        desc: base.desc || "",
        status: base.status || "启用",
        owner: base.owner || "知识库运营"
      });
    }
  }, [base, form]);
  return (
    <Modal title={base?.key ? "编辑知识库" : "新增知识库"} open={Boolean(base)} onCancel={onClose} onOk={() => form.submit()} okText="保存知识库" cancelText="取消" width={860}>
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Row gutter={16}>
          <Col span={14}><Form.Item label="知识库名称" name="name" rules={[{ required: true, message: "请输入知识库名称" }]}><Input placeholder="例如：价格政策与异议处理库" /></Form.Item></Col>
          <Col span={10}><Form.Item label="分类" name="category"><Select options={["课程知识", "政策规则", "FAQ", "销售话术", "案例素材", "异议处理", "活动政策"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={24}><Form.Item label="知识库说明" name="desc"><Input.TextArea rows={4} placeholder="说明该知识库适用的业务场景、使用边界和维护规则。" /></Form.Item></Col>
          <Col span={12}><Form.Item label="维护人" name="owner"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function KnowledgeEntryModal({ entry, onClose, onSave }) {
  const [form] = Form.useForm();
  const mediaType = Form.useWatch("media", form);
  useEffect(() => {
    if (entry) {
      form.resetFields();
      form.setFieldsValue({
        title: entry.title || "",
        type: entry.type || "文本知识",
        media: entry.media || "文本",
        tags: entry.tags || [],
        status: entry.status || "启用",
        content: entry.content || ""
      });
    }
  }, [entry, form]);
  return (
    <Modal title={entry?.key ? "编辑知识条目" : "新增知识条目"} open={Boolean(entry)} onCancel={onClose} onOk={() => form.submit()} okText="保存知识条目" cancelText="取消" width={900}>
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="标题" name="title" rules={[{ required: true, message: "请输入知识标题" }]}><Input placeholder="例如：线上课和线下课区别" /></Form.Item></Col>
          <Col span={6}><Form.Item label="知识类型" name="type"><Select options={["文本知识", "图片素材", "语音素材", "文件素材"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={6}><Form.Item label="媒体类型" name="media"><Select options={["文本", "图片", "语音", "文件"].map((value) => ({ value }))} /></Form.Item></Col>
        </Row>
        <Form.Item label="文本内容">
          <div className="rich-editor">
            <div className="rich-toolbar">
              <Button size="small">加粗</Button>
              <Button size="small">标题</Button>
              <Button size="small">列表</Button>
              <Button size="small">链接</Button>
              <Button size="small" icon={<UploadOutlined />}>插入图片</Button>
            </div>
            <Form.Item name="content" noStyle>
              <Input.TextArea
                rows={8}
                placeholder="支持录入文字说明、图片描述、语音摘要、文件摘要和销售话术。"
              />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item label={mediaType === "语音" ? "上传语音素材" : mediaType === "图片" ? "上传图片素材" : "附件素材"}>
          <Upload.Dragger multiple beforeUpload={() => false} accept=".png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a,.ppt,.pptx,.pdf,.doc,.docx">
            <p className="upload-icon"><FileTextOutlined /></p>
            <p>上传图片、语音、PPT、PDF、Word 等知识素材</p>
            <Text type="secondary">素材将作为知识内容的补充资料，后续可接入 OCR、ASR 和文件解析。</Text>
          </Upload.Dragger>
        </Form.Item>
        <Row gutter={16}>
          <Col span={16}><Form.Item label="标签" name="tags"><Select mode="tags" placeholder="输入标签后回车，例如：价格、试听课、阅读" /></Form.Item></Col>
          <Col span={8}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
        </Row>
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
  const [assignAccount, setAssignAccount] = useState(null);
  const [dedicatedInfoAccount, setDedicatedInfoAccount] = useState(null);
  const [botConfigOpen, setBotConfigOpen] = useState(false);
  const [channelConfigOpen, setChannelConfigOpen] = useState(false);
  const [salesRows, setSalesRows] = useState(salesAccounts);
  const [syncing, setSyncing] = useState(false);
  const [salesForm] = Form.useForm();
  const [assignForm] = Form.useForm();
  const [dedicatedInfoForm] = Form.useForm();
  const [botForm] = Form.useForm();
  const latestSyncAt = salesRows.find((item) => item.syncedAt && item.syncedAt !== "未同步")?.syncedAt || "未同步";
  const getDefaultAiPassword = (phone = "") => phone.replace(/\D/g, "").slice(-6);
  const columns = [
    { title: "员工", dataIndex: "name", width: 150 },
    { title: "智能体", dataIndex: "role", width: 110 },
    { title: "企微账号", dataIndex: "wecom", width: 150, render: (_, record) => <div><Text>{record.wecom}</Text><br /><Text>{record.wecomId}</Text></div> },
    { title: "在线状态", dataIndex: "online", width: 110, render: (v) => <Tag color={v ? "success" : "default"}>{v ? "在线" : "离线"}</Tag> },
    { title: "句子通道", dataIndex: "channel", width: 130, render: (v) => <Tag color={v.includes("已连接") ? "success" : "warning"}>{v}</Tag> },
    { title: "已分配用户", dataIndex: "assignedUser", width: 120, render: (v) => <Tag color={v ? "processing" : "warning"}>{v || "未分配"}</Tag> },
    { title: "客户总数", dataIndex: "customerTotal", width: 88 },
    { title: "托管客户数", dataIndex: "hostedCustomers", width: 96 },
    { title: "需人工介入", dataIndex: "manualCustomers", width: 108 },
    {
      title: "操作",
      fixed: "right",
      width: 190,
      render: (_, record) => (
        <Space size={0} wrap={false}>
          <Button type="link" onClick={() => setAssignAccount(record)}>指定人员</Button>
          <Button type="link" className="warning-link" onClick={() => setDedicatedInfoAccount(record)}>专属信息</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除企微托管", content: `确认删除 ${record.name} 的企微托管配置？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setSalesRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  useEffect(() => {
    if (!configAccount) return;
    salesForm.setFieldsValue({
      name: configAccount.name,
      role: configAccount.role || "课程顾问",
      phone: configAccount.phone,
      wecom: configAccount.wecom,
      wecomId: configAccount.wecomId,
      hosted: configAccount.hosted,
      aiAccount: configAccount.aiAccount || configAccount.phone,
      aiPassword: configAccount.aiPassword || getDefaultAiPassword(configAccount.phone)
    });
  }, [configAccount, salesForm]);
  useEffect(() => {
    if (!assignAccount) return;
    assignForm.setFieldsValue({
      role: assignAccount.role || "销售",
      assignedUser: assignAccount.assignedUser || "admin (admin)"
    });
  }, [assignAccount, assignForm]);
  useEffect(() => {
    if (!dedicatedInfoAccount) return;
    dedicatedInfoForm.setFieldsValue({
      dedicatedInfo: dedicatedInfoAccount.dedicatedInfo || ""
    });
  }, [dedicatedInfoAccount, dedicatedInfoForm]);

  const handleSaveAccount = () => {
    salesForm.validateFields().then((values) => {
      setSalesRows((items) =>
        items.map((item) => (item.key === configAccount?.key ? { ...item, ...values } : item))
      );
      setConfigAccount(null);
      message.success("已保存 Sabuddy 账号配置");
    });
  };
  const handleAssignUser = () => {
    assignForm.validateFields().then((values) => {
      setSalesRows((items) =>
        items.map((item) => (item.key === assignAccount?.key ? { ...item, role: values.role, assignedUser: values.assignedUser } : item))
      );
      setAssignAccount(null);
      message.success("已指定人员和智能体");
    });
  };
  const handleSaveDedicatedInfo = () => {
    dedicatedInfoForm.validateFields().then((values) => {
      setSalesRows((items) =>
        items.map((item) => (item.key === dedicatedInfoAccount?.key ? { ...item, dedicatedInfo: values.dedicatedInfo } : item))
      );
      setDedicatedInfoAccount(null);
      message.success("已保存专属信息");
    });
  };
  const handleSaveBotConfig = () => {
    botForm.validateFields().then(() => {
      setBotConfigOpen(false);
      message.success("已保存通知 Bot 配置");
    });
  };

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
  const handleSyncCustomers = () => {
    handleSync();
    message.info("开始同步客户数据");
  };
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card className="channel-entry-card" hoverable onClick={() => setChannelConfigOpen(true)}>
        <div className="channel-entry">
          <div>
            <Space size={10} align="center">
              <CloudSyncOutlined className="channel-entry-icon" />
              <Title level={4}>关联句子通道</Title>
              <Tag color="success">已打通</Tag>
            </Space>
            <Paragraph type="secondary">
              配置 Sabuddy 与句子互动平台的企业级打通关系，用于同步句子互动平台上的企微账号、客户、托管状态和人工介入数据。
            </Paragraph>
          </div>
          <Space size={8} wrap>
            <Text type="secondary">最近同步 {latestSyncAt}</Text>
            <Button type="primary">配置打通</Button>
          </Space>
        </div>
      </Card>
      <Card title={<PanelTitle title="托管列表" extra={<>
        <Button onClick={() => setBotConfigOpen(true)}>通知 Bot</Button>
        <Button className="sync-action" icon={<CloudSyncOutlined />} loading={syncing} onClick={handleSync}>刷新同步</Button>
        <Button icon={<UserOutlined />} loading={syncing} onClick={handleSyncCustomers}>同步客户</Button>
      </>} />}>
        <div className="sync-status">
          <Badge status={syncing ? "processing" : "success"} />
          <Text type="secondary">{syncing ? "正在从句子通道同步企微客户、托管和人工介入数据" : `最近同步 ${latestSyncAt}`}</Text>
        </div>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部角色" options={["全部角色", "课程顾问", "班主任", "市场"].map((value) => ({ value }))} />
          <Select defaultValue="全部托管状态" options={["全部托管状态", "已开启", "未开启"].map((value) => ({ value }))} />
          <Input.Search placeholder="搜索员工、角色、企微账号或企微ID" allowClear />
        </Space>
        <Table className="admin-table" rowKey="key" columns={columns} dataSource={salesRows} pagination={false} scroll={{ x: 1200 }} />
      </Card>
      <Modal title="句子通道打通配置" open={channelConfigOpen} onCancel={() => setChannelConfigOpen(false)} onOk={() => { setChannelConfigOpen(false); message.success("已保存句子通道打通配置"); }} okText="保存配置" cancelText="取消" width={760}>
        <Form
          layout="vertical"
          initialValues={{
            aiEndpoint: "https://ai.aisa.com/open/wecom/sync",
            juziTenantId: "xinghe-edu",
            syncScope: ["企微账号", "客户数据", "托管状态", "人工介入"],
            callbackToken: "aisa_juzi_sync_token"
          }}
        >
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Sabuddy同步地址" name="aiEndpoint"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="句子互动企业ID" name="juziTenantId"><Input placeholder="请输入句子互动平台企业ID" /></Form.Item></Col>
            <Col span={12}><Form.Item label="句子互动 App Key" name="juziAppKey"><Input placeholder="请输入 App Key" /></Form.Item></Col>
            <Col span={12}><Form.Item label="句子互动 App Secret" name="juziAppSecret"><Input.Password placeholder="请输入 App Secret" /></Form.Item></Col>
            <Col span={24}><Form.Item label="同步数据范围" name="syncScope"><Checkbox.Group options={["企微账号", "客户数据", "托管状态", "人工介入"]} /></Form.Item></Col>
            <Col span={24}><Form.Item label="回调校验 Token" name="callbackToken"><Input.Password /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="通知 Bot 配置"
        open={botConfigOpen}
        onCancel={() => setBotConfigOpen(false)}
        onOk={handleSaveBotConfig}
        okText="保存"
        cancelText="取消"
        width={760}
      >
        <Form form={botForm} layout="vertical" initialValues={{ webhookUrl: "" }}>
          <Form.Item label="通知 Bot Webhook 地址" name="webhookUrl">
            <Input placeholder="企微机器人 Webhook 地址，留空则关闭通知" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="指定人员"
        open={Boolean(assignAccount)}
        onCancel={() => setAssignAccount(null)}
        onOk={handleAssignUser}
        okText="确认"
        cancelText="取消"
        width={760}
      >
        <Paragraph type="secondary">
          为 <Text strong>{assignAccount?.name}</Text> 指定人员和智能体：
        </Paragraph>
        <Form form={assignForm} layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="选择智能体" name="role" rules={[{ required: true, message: "请选择智能体" }]}>
            <Select options={agents.map((item) => ({ value: item.name, label: item.name }))} />
          </Form.Item>
          <Form.Item label="选择账号" name="assignedUser" rules={[{ required: true, message: "请选择账号" }]}>
            <Select
              options={[
                { value: "admin (admin)", label: "admin (admin)" },
                { value: "李老师 (li_sales)", label: "李老师 (li_sales)" },
                { value: "陈老师 (chen_sales)", label: "陈老师 (chen_sales)" }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="专属信息配置"
        open={Boolean(dedicatedInfoAccount)}
        onCancel={() => setDedicatedInfoAccount(null)}
        onOk={handleSaveDedicatedInfo}
        okText="保存"
        cancelText="取消"
        width={880}
      >
        <Paragraph type="secondary">
          为<Text strong>{dedicatedInfoAccount?.name}</Text>配置个性化信息，在后续 AI 沟通中自动注入作为上下文。
        </Paragraph>
        <Form form={dedicatedInfoForm} layout="vertical">
          <Form.Item name="dedicatedInfo">
            <Input.TextArea
              rows={8}
              placeholder="输入专属信息，如：个人背景、沟通风格、擅长领域、特殊偏好、销售特点等..."
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="企微托管配置" open={Boolean(configAccount)} onCancel={() => setConfigAccount(null)} onOk={handleSaveAccount} okText="保存配置" cancelText="取消" width={720}>
        <Form
          form={salesForm}
          layout="vertical"
          key={configAccount?.key || "sales-config"}
        >
          <Row gutter={16}>
            <Col span={12}><Form.Item label="员工姓名" name="name"><Input placeholder="例如：李老师" /></Form.Item></Col>
            <Col span={12}><Form.Item label="角色" name="role"><Select options={["课程顾问", "班主任", "市场"].map((value) => ({ value }))} /></Form.Item></Col>
            <Col span={12}><Form.Item label="手机号" name="phone"><Input placeholder="例如：13800008888" /></Form.Item></Col>
            <Col span={12}><Form.Item label="企微账号" name="wecom"><Input placeholder="例如：li_sales" /></Form.Item></Col>
            <Col span={12}><Form.Item label="企微ID" name="wecomId"><Input placeholder="例如：wm_8a92" /></Form.Item></Col>
            <Col span={12}><Form.Item label="AI托管状态" name="hosted" valuePropName="checked"><Switch checkedChildren="开启" unCheckedChildren="关闭" /></Form.Item></Col>
          </Row>
          <Divider orientation="left">Sabuddy账号密码设置</Divider>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Sabuddy账号" name="aiAccount"><Input placeholder="默认使用企微手机号" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Sabuddy密码" name="aiPassword"><Input.Password placeholder="默认手机号后6位" /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </Space>
  );
}

function ConversationsPage({ activeWecom, activeConversationKey, visibleWecomKeys = managedWecomAccounts.map((item) => item.key), onActiveWecomChange }) {
  const visibleConversations = conversations.filter((item) => visibleWecomKeys.includes(item.accountKey));
  const filteredConversations = visibleConversations.filter((item) => item.accountKey === activeWecom);
  const activeConversation = activeConversationKey ? visibleConversations.find((item) => item.key === activeConversationKey) : null;
  const [selected, setSelected] = useState(activeConversation || filteredConversations[0] || visibleConversations[0] || null);
  const [hostingMode, setHostingMode] = useState(selected?.hosted ? "ai" : "manual");
  const [manualReply, setManualReply] = useState("");
  const [composerItems, setComposerItems] = useState([]);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [customerDrawerTab, setCustomerDrawerTab] = useState("profile");
  const [customerTagValues, setCustomerTagValues] = useState(() => createCustomerTagValues(selected));
  useEffect(() => {
    setSelected(activeConversation || filteredConversations[0] || visibleConversations[0] || null);
  }, [activeWecom, activeConversationKey, visibleWecomKeys.join("|")]);
  useEffect(() => {
    if (selected) setHostingMode(selected.hosted ? "ai" : "manual");
    if (selected) {
      setCustomerTagValues(createCustomerTagValues(selected));
    }
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
  const visibleWecomAccounts = managedWecomAccounts.filter((item) => visibleWecomKeys.includes(item.key));
  const activeWecomAccount = visibleWecomAccounts.find((item) => item.key === activeWecom) || visibleWecomAccounts[0];
  const wecomAccountRows = visibleWecomAccounts.map((account) => {
    const accountConversations = visibleConversations.filter((item) => item.accountKey === account.key);
    return {
      ...account,
      hostedTotal: accountConversations.filter((item) => item.hosted).length
    };
  });
  const selectWecomAccount = (account) => {
    const firstConversation = visibleConversations.find((item) => item.accountKey === account.key) || null;
    onActiveWecomChange?.(account.key);
    setSelected(firstConversation);
  };
  const renderWecomAccountList = () => (
    <aside className="wecom-account-list">
      <div className="wecom-account-list-head">
        <Text strong>企微账号</Text>
        <Text type="secondary">{wecomAccountRows.length} 个账号</Text>
      </div>
      <List
        className="wecom-account-items"
        dataSource={wecomAccountRows}
        locale={{ emptyText: "当前范围暂无企微账号" }}
        renderItem={(account) => (
          <List.Item className={activeWecomAccount?.key === account.key ? "wecom-account-item active" : "wecom-account-item"} onClick={() => selectWecomAccount(account)}>
            <Avatar className="wecom-account-avatar" icon={<WechatOutlined />} />
            <div className="wecom-account-main">
              <Text className="wecom-account-name" ellipsis>{account.label}</Text>
              <Tag>{account.department}</Tag>
            </div>
          </List.Item>
        )}
      />
    </aside>
  );
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
  const selectedOrder = selected.orders?.[0];
  const insightStatus = selectedOrder?.amount && selectedOrder.amount.startsWith("¥") ? `曾购买${selectedOrder.amount.replace("¥", "")}` : selected.order;
  const insightRows = [
    { label: "孩子情况", value: selected.key === "c1" ? "三年级，英语不敢开口，词汇记得慢，阅读有点吃力" : selected.remark },
    { label: "主要问题", value: selected.key === "c1" ? "词汇量少，单词记忆慢；阅读理解跟不上；需要先判断自然拼读和校内同步基础" : selected.last },
    { label: "亲子冲突", value: selected.key === "c1" ? "家长担心孩子三年级后英语拉开差距，希望先找到适合班型，不想盲目报长期课" : "需要先确认家长期望、孩子基础和可上课时间，避免直接推长期班" },
    { label: "用户目标", value: selected.key === "c1" ? "找回开口信心与背词方法；通过诊断试听确认班型；优先提升词汇和阅读基础" : selected.suggestion }
  ];
  const courseRows = [
    { key: "lesson-1", lesson: "第 1 节", duration: selected.key === "c1" ? "52 分钟" : "已沟通", format: "直播" },
    { key: "lesson-2", lesson: "第 2 节", duration: selected.key === "c1" ? "今日应上" : "待确认", format: "直播" },
    { key: "lesson-3", lesson: "第 3 节", duration: "待上课", format: "直播" }
  ];
  const conversationMetrics = {
    sent: Math.max(393, (selected.messages || []).filter((item) => item.from === "customer").length * 76 + selected.unread * 23),
    received: Math.max(351, (selected.messages || []).filter((item) => item.from === "ai").length * 88 + 175)
  };
  if (!selected) {
    return (
      <div className="wecom-workbench">
        {renderWecomAccountList()}
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
  const chatPlans = [
    {
      key: "plan-1",
      source: "会话生成",
      sourceColor: "success",
      planTime: "今天下午 15:00",
      topic: "按约定介绍课程内容",
      content: `围绕${selected.tags?.[0] || "孩子年级"}英语基础，说明试听课流程、课程模块和适合的班型，不直接强推报名。`,
      quote: "我现在有点忙，今天下午3点给我发一下相关的课程资料，我们再聊。",
      quoteTime: "10:20"
    },
    {
      key: "plan-2",
      source: "Skill 定时任务",
      sourceColor: "processing",
      triggerRule: "试听课前 30 分钟",
      planTime: "试听课前 30 分钟",
      topic: "试听提醒与课前准备",
      content: "提醒家长准备孩子近期英语试卷或错题，确认设备、上课链接和可参与时间。",
    },
    {
      key: "plan-3",
      source: "Skill 定时任务",
      sourceColor: "processing",
      triggerRule: "试听结束后 20 分钟",
      planTime: "试听结束后 20 分钟",
      topic: "反馈学习问题并推动下一步",
      content: "总结孩子课堂表现、薄弱点和建议课程路径，询问家长是否需要确认班型和课时安排。"
    }
  ];
  const customerInfoRows = [
    { label: "备注", value: selected.remark || "—" },
    { label: "电话", value: selected.phone || "—" },
    { label: "企微ID", value: selected.wecomId || "—" },
    {
      label: "销售 qw_user_id",
      value: (
        <Space direction="vertical" size={2}>
          <Text>{selected.owner === "沈海龙" ? "ShenHaiLong" : selected.owner || "—"}</Text>
          <Text type="secondary">当前会话托管 {selected.owner || "—"} · 来源 chat/list · 句子 qw_user_id 未返回</Text>
        </Space>
      )
    },
    {
      label: "客户 external_user_id",
      value: (
        <Space direction="vertical" size={2}>
          <Text>{selected.type === "group" ? "—" : selected.wecomId || "—"}</Text>
          <Text type="secondary">句子 externalUserId 未返回</Text>
        </Space>
      )
    },
    { label: "unionId", value: selected.type === "group" ? "—" : `6sVuK9rkSwSMGSI4SC3ZL8ZoJvdtvX` },
    { label: "添加时间", value: selected.addedAt || "—" }
  ];
  const updateGroupedCustomerTags = (sourceKey, groupKey, value) => {
    setCustomerTagValues((prev) => ({
      ...prev,
      [sourceKey]: {
        ...prev[sourceKey],
        [groupKey]: value
      }
    }));
  };
  const courseStageRows = [
    { key: "sop-0", index: 1, name: "B类开课前", code: "sop_0", status: "进行中", planAt: "2026-08-19 12:15" },
    { key: "sop-1", index: 2, name: "B类第一节课", code: "sop_1", status: "待开始", planAt: "—" },
    { key: "sop-2", index: 3, name: "B类第二节课", code: "sop_2", status: "待开始", planAt: "—" },
    { key: "sop-3", index: 4, name: "B类第三节课", code: "sop_3", status: "待开始", planAt: "—" },
    { key: "sop-4", index: 5, name: "B类第四节课", code: "sop_4", status: "待开始", planAt: "—" },
    { key: "sop-other", index: 6, name: "B类课后", code: "sop_ot...", status: "待开始", planAt: "—" }
  ];
  const salesStrategyUpdatedAt = "2026-08-19 12:30:18";
  const salesStrategyRows = [
    { title: "孩子情况", text: "女，19岁，现半休学在家，原就读港澳台联考班，因证件问题今年未报考，计划明年再考；与父亲、哥哥无沟通，和母亲共同生活；有严重洁癖，初中曾休学一年服药近两年，后考上高中。" },
    { title: "主要问题", text: "多疑，对男同学有敌对情绪，同学关系差，几乎闭门不出不与外界往来；在家暴躁，有暴力倾向；存在反复长时间冲水、洗杯子的行为，状态持续多年，今年报考受阻后状态变差。" },
    { title: "亲子冲突", text: "高，近期孩子刻意回避母亲，几乎无沟通，一沟通就易起冲突；曾因宿舍单独住等事爆发激烈矛盾，孩子对母亲缺乏信任。" },
    { title: "用户目标", text: "希望改善与孩子的沟通僵局，修复亲子信任；同时希望孩子的情绪、人际及洁癖问题得到缓解。隐含诉求是找到合适的干预方式帮助孩子。" },
    { title: "策略建议", text: "本阶段不建议直接强推产品或连续追问价格，应先围绕母亲当前最痛的沟通僵局做承接，帮助其确认孩子长期状态、家庭互动模式和可执行的第一步干预方向。若用户主动问服务或方案，可引导人工介入，重点说明需要系统性评估与持续陪跑，不承诺效果，不做医疗诊断。" }
  ];
  return (
    <>
      <div className="wecom-workbench">
        {renderWecomAccountList()}
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
              <WecomAvatar item={item} />
              <div className="session-main">
                <div className="session-title-row">
                  <Space className="session-title-main" size={6}>
                    <Text ellipsis>{item.name}</Text>
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
          <button
            className="chat-lifecycle-stage"
            type="button"
            onClick={() => {
              setCustomerDrawerTab("lifecycle");
              setCustomerDrawerOpen(true);
            }}
          >
            <Text type="secondary">当前阶段</Text>
            <Tag color="blue">{selected.lifecycle}</Tag>
            <Text type="secondary">{currentStageIndex + 1}/{lifecycleStages.length}</Text>
          </button>
          <div className="chat-header-actions">
            <Button
              className="customer-drawer-trigger"
              aria-label="客户资料"
              icon={<UserOutlined />}
              onClick={() => {
                setCustomerDrawerTab("profile");
                setCustomerDrawerOpen(true);
              }}
            >
              客户资料
            </Button>
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
      </div>
      <Drawer
        title={`${selected.name} · 客户资料`}
        open={customerDrawerOpen}
        onClose={() => setCustomerDrawerOpen(false)}
        width={560}
        className="customer-side-drawer"
      >
        <div className="customer-side-panel drawer-mode">
          <Tabs
            activeKey={customerDrawerTab}
            onChange={setCustomerDrawerTab}
            items={[
              {
                key: "profile",
                label: "用户信息",
                children: (
                  <div className="customer-profile-tab">
                    <section className="customer-profile-section">
                      <div className="customer-basic-table">
                        {customerInfoRows.map((row) => (
                          <div className="customer-basic-row" key={row.label}>
                            <div className="customer-basic-label">{row.label}</div>
                            <div className="customer-basic-value">{row.value}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section className="customer-profile-section">
                      <div className="customer-section-head">
                        <Text>用户标签</Text>
                        <Text type="secondary">统一标签库管理，AI打标标签以样式区分</Text>
                      </div>
                      <div className="customer-tag-groups">
                        <div className="customer-tag-source">
                          <div className="customer-tag-source-head">
                            <Text>客户标签</Text>
                            <Text type="secondary">按标签组展示和编辑</Text>
                          </div>
                          <div className="customer-tag-category-list">
                            {customerTagGroups.map((group) => (
                              <div className="customer-tag-category" key={group.key}>
                                <Text type="secondary" className="customer-tag-category-name">{group.name}</Text>
                                <Select
                                  mode="multiple"
                                  size="middle"
                                  value={customerTagValues.customer?.[group.key] || []}
                                  options={group.tags.map((tag) => ({
                                    value: tag.value,
                                    label: (
                                      <span className={tag.source === "AI打标" ? "customer-ai-tag-option" : undefined}>
                                        {tag.source === "AI打标" ? `${tag.value}（AI）` : tag.value}
                                      </span>
                                    )
                                  }))}
                                  placeholder={`选择${group.name}标签`}
                                  maxTagCount="responsive"
                                  allowClear
                                  tagRender={({ value, closable, onClose }) => {
                                    const isAiTag = group.tags.some((tag) => tag.value === value && tag.source === "AI打标");
                                    return (
                                      <Tag
                                        className={isAiTag ? "customer-selected-ai-tag" : "customer-selected-tag"}
                                        closable={closable}
                                        onClose={onClose}
                                        onMouseDown={(event) => event.preventDefault()}
                                      >
                                        {isAiTag ? `${value}（AI）` : value}
                                      </Tag>
                                    );
                                  }}
                                  onChange={(value) => updateGroupedCustomerTags("customer", group.key, value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="customer-tag-source">
                          <div className="customer-tag-source-head">
                            <Text>个人标签</Text>
                            <Text type="secondary">销售自己手动打的标签，仅自己可见</Text>
                          </div>
                          <Select
                            mode="tags"
                            size="middle"
                            value={customerTagValues.personal}
                            placeholder="输入个人标签后回车"
                            maxTagCount="responsive"
                            onChange={(value) => setCustomerTagValues((prev) => ({ ...prev, personal: value }))}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                )
              },
              {
                key: "course",
                label: "课程信息",
                children: (
                  <Table
                    className="customer-course-table"
                    size="small"
                    rowKey="key"
                    pagination={false}
                    dataSource={courseStageRows}
                    columns={[
                      { title: "#", dataIndex: "index", width: 48 },
                      { title: "阶段名称", dataIndex: "name", width: 130 },
                      { title: "标识", dataIndex: "code", width: 92 },
                      { title: "状态", dataIndex: "status", width: 82, render: (value) => <Tag color={value === "进行中" ? "processing" : "default"}>{value}</Tag> },
                      { title: "计划进入", dataIndex: "planAt" }
                    ]}
                  />
                )
              },
              {
                key: "strategy",
                label: "销售策略",
                children: (
                  <div className="sales-strategy-panel">
                    <Text type="secondary" className="sales-strategy-meta">最近更新：{salesStrategyUpdatedAt}</Text>
                    <div className="sales-strategy-content">
                      {salesStrategyRows.map((row) => (
                        <Paragraph key={row.title}>
                          <Text strong>{row.title}：</Text>{row.text}
                        </Paragraph>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                key: "lifecycle",
                label: "流程阶段",
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
              }
            ]}
          />
        </div>
      </Drawer>
    </>
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
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [humanizationRows, setHumanizationRows] = useState([
    {
      key: "h1",
      title: "测试风格",
      enabled: false,
      antiGrabWaits: [3, 1, 6],
      splitEnabled: true,
      minSplitLength: 80,
      maxSplitSegments: 3,
      prompt: "语言比较柔和，客气",
      agentRoleId: ""
    },
    {
      key: "h2",
      title: "销售风格",
      enabled: false,
      antiGrabWaits: [8, 3],
      splitEnabled: true,
      minSplitLength: 80,
      maxSplitSegments: 3,
      prompt: "1. 像真人微信私聊，大白话，短句为主。 2. 默认短回复，控制在 30-50 字。 3. 用户问一个问题先回答一个点，不要一次性堆太多信息。",
      agentRoleId: "sales"
    }
  ]);
  const waitFirst = Form.useWatch("waitFirst", form);
  const waitSecond = Form.useWatch("waitSecond", form);
  const waitThird = Form.useWatch("waitThird", form);

  const getModalValues = (record) => ({
    title: record?.title || "",
    prompt: record?.prompt || "",
    waitFirst: record?.antiGrabWaits?.[0] ?? 3,
    waitSecond: record?.antiGrabWaits?.[1] ?? 1,
    waitThird: record?.antiGrabWaits?.[2] ?? 6,
    splitEnabled: record?.splitEnabled ?? true,
    minSplitLength: record?.minSplitLength ?? 80,
    maxSplitSegments: record?.maxSplitSegments ?? 3,
    enabled: record?.enabled ?? false
  });

  const openEditor = (record = null) => {
    setEditing(record);
    form.setFieldsValue(getModalValues(record));
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const nextRow = {
      key: editing?.key || `h-${Date.now()}`,
      title: values.title,
      enabled: values.enabled,
      antiGrabWaits: [values.waitFirst, values.waitSecond, values.waitThird],
      splitEnabled: values.splitEnabled,
      minSplitLength: values.minSplitLength,
      maxSplitSegments: values.maxSplitSegments,
      prompt: values.prompt,
      agentRoleId: editing?.agentRoleId || ""
    };

    setHumanizationRows((items) => (
      editing
        ? items.map((item) => (item.key === editing.key ? nextRow : item))
        : [nextRow, ...items]
    ));
    setModalOpen(false);
    setEditing(null);
  };

  const columns = [
    { title: "标题", dataIndex: "title", width: 160, render: (value) => <Text>{value}</Text> },
    { title: "启用", dataIndex: "enabled", width: 96, render: statusTag },
    { title: "防抢答", dataIndex: "antiGrabWaits", width: 130, render: (value) => <Text>{`[${value.join(",")}]`}</Text> },
    { title: "拆分长回复", dataIndex: "splitEnabled", width: 150, render: (value) => statusTag(value) },
    {
      title: "提示词",
      dataIndex: "prompt",
      ellipsis: true,
      render: (value) => <Text className="humanization-prompt-preview">{value}</Text>
    },
    {
      title: "操作",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => openEditor(record)}>编辑</Button>
          <Button
            type="link"
            danger
            onClick={() => Modal.confirm({
              title: "删除拟人化配置",
              content: `确认删除 ${record.title}？`,
              okText: "删除",
              okButtonProps: { danger: true },
              cancelText: "取消",
              onOk: () => setHumanizationRows((items) => items.filter((item) => item.key !== record.key))
            })}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  const waitRows = [
    ["第1条消息", "waitFirst", waitFirst ?? 3],
    ["第2条消息", "waitSecond", waitSecond ?? 1],
    ["第3条消息", "waitThird", waitThird ?? 6]
  ];

  return (
    <>
      <Card
        className="humanization-config-card"
        title={(
          <PanelTitle
            title="拟人化策略配置"
            desc="不同智能体可配置不同的 AI 回复风格。agentRoleId 为空 = 全局默认。"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>新增配置</Button>}
          />
        )}
      >
        <Table
          className="admin-table humanization-table"
          rowKey="key"
          columns={columns}
          dataSource={humanizationRows}
          pagination={false}
          scroll={{ x: 980 }}
        />
      </Card>

      <Modal
        title={editing ? "编辑拟人化" : "新增拟人化"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
        width={880}
        centered
        className="humanization-modal"
      >
        <Form form={form} className="humanization-form" layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} requiredMark={false} colon={false}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: "请输入标题" }]}>
            <Input placeholder="例如：销售风格" />
          </Form.Item>
          <Form.Item label="提示词" name="prompt" rules={[{ required: true, message: "请输入提示词" }]}>
            <Input.TextArea className="humanization-prompt-input" rows={7} placeholder="请输入 AI 回复风格、语气、短句规则和禁用表达" />
          </Form.Item>
          <Form.Item label={<Space size={6}>防抢答等待<Tooltip title="控制连续消息的等待时间，避免客户正在输入时 AI 抢先回复。"><span className="form-help-dot">?</span></Tooltip></Space>}>
            <div className="anti-grab-list">
              {waitRows.map(([label, name, value]) => (
                <div className="anti-grab-row" key={name}>
                  <Text>{label}</Text>
                  <Form.Item name={name} noStyle>
                    <Slider min={0} max={10} step={1} tooltip={{ formatter: null }} />
                  </Form.Item>
                  <Text className="anti-grab-value">{value}s</Text>
                </div>
              ))}
            </div>
          </Form.Item>
          <Form.Item label="拆分长回复" name="splitEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="最小拆分长度">
            <Space align="center" size={14} className="humanization-number-row">
              <Form.Item name="minSplitLength" noStyle rules={[{ required: true, message: "请输入最小拆分长度" }]}>
                <InputNumber min={20} max={300} className="humanization-number" />
              </Form.Item>
              <Text type="secondary">长于此字符数的回复才会被拆分</Text>
            </Space>
          </Form.Item>
          <Form.Item label="最大拆分段数">
            <Space align="center" size={14} className="humanization-number-row">
              <Form.Item name="maxSplitSegments" noStyle rules={[{ required: true, message: "请输入最大拆分段数" }]}>
                <InputNumber min={2} max={6} className="humanization-number" />
              </Form.Item>
              <Text type="secondary">随机拆分成 2 到 3 段</Text>
            </Space>
          </Form.Item>
          <Form.Item label="启用" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
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
  const allowedMenuItems = getAllowedMenuItems(menuItems, user.menuKeys);
  const allowedLeafMenuItems = flattenMenuItems(allowedMenuItems).filter((item) => !item.children);
  const allowedPageTitle = Object.fromEntries(allowedLeafMenuItems.map((item) => [item.key, item.label]));
  const [route, setRoute] = useState(allowedPageTitle[initialRoute] ? initialRoute : "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleMenuSelect = (key) => {
    if (!allowedPageTitle[key]) return;
    setRoute(key);
    setMobileMenuOpen(false);
  };

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
    agentManager: <IntelligentAgentPage />,
    strategy: <StrategyPage />,
    skills: <AISkillPage />,
    tools: <ToolsPage />,
    knowledge: <KnowledgePage />,
    tagLibrary: <TagLibraryPage />,
    massMessage: <MassMessagePage />,
    wecom: <WecomPage />,
    sales: <SalesPage />,
    humanization: <HumanizationPage />,
    conversations: (
      <ConversationsPage
        activeWecom={activeWecom}
        activeConversationKey={activeConversationKey}
        visibleWecomKeys={visibleWecomKeys}
        onActiveWecomChange={(key) => {
          setActiveWecom(key);
          setActiveConversationKey("");
        }}
      />
    ),
    suggestions: <SuggestionsPage />,
    settings: <SettingsPage platform={platform} />
  })[route], [route, platform, activeWecom, activeConversationKey, visibleWecomKeys.join("|")]);

  return (
    <Layout className="app-layout">
      <Sider className="app-sider" width={220} collapsedWidth={80} collapsed={collapsed} trigger={null}>
        <div className="brand">
          <div className="brand-mark"><RobotOutlined /></div>
          {!collapsed ? <Title level={4}>Sabuddy</Title> : null}
        </div>
        <Menu theme="light" mode="inline" selectedKeys={[route]} defaultOpenKeys={["agentGroup", "userOpsGroup"]} items={allowedMenuItems} onClick={({ key }) => handleMenuSelect(key)} />
        <Tooltip title={collapsed ? "展开导航" : "收起导航"} placement={collapsed ? "right" : "top"}>
          <Button
            className="sider-collapse-button"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
          >
            {!collapsed ? "收起" : null}
          </Button>
        </Tooltip>
      </Sider>
      <Layout>
        <Header className="app-header">
          <Space className="header-title-wrap" align="center">
            <div className="page-heading">
              <Button className="mobile-menu" type="text" icon={<MenuUnfoldOutlined />} onClick={() => setMobileMenuOpen(true)} />
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
                </>
              ) : null}
            </div>
          </Space>
          <Space className="header-actions" wrap>
            {!platform ? <Tag color="blue">{user.company}</Tag> : null}
            <Button shape="round" icon={<Avatar size={24}>{user.badge}</Avatar>}>{user.name}</Button>
            <Button onClick={onLogout}>退出</Button>
          </Space>
        </Header>
        <Content className="app-content">{content}</Content>
      </Layout>
      <Drawer
        title="Sabuddy 导航"
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={260}
        className="mobile-nav-drawer"
      >
        <Menu mode="inline" selectedKeys={[route]} defaultOpenKeys={["agentGroup"]} items={allowedMenuItems} onClick={({ key }) => handleMenuSelect(key)} />
      </Drawer>
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
