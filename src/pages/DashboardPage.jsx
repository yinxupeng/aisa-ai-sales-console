import React, { useState } from "react";
import { App as AntApp, Button, Card, Col, Modal, Row, Segmented, Space, Table, Tag, Tooltip, Typography } from "antd";
import {
  AlertOutlined,
  CommentOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  WechatOutlined
} from "@ant-design/icons";
import { conversations, lifecycleStages } from "../data/conversations";
import { managedWecomAccounts } from "../data/appData";
import { buildInsightUserRows, insightRows } from "../data/strategyInsights";
import { PanelTitle } from "../components/PageChrome";


const { Paragraph, Text, Title } = Typography;


function DashboardPage({ setRoute, onViewConversation, conversationsData = conversations, dashboardWecomFilter = "all", dashboardPeriodFilter = "all" }) {
  const { message } = AntApp.useApp();
  const [dashboardModal, setDashboardModal] = useState("");
  const [insightUserList, setInsightUserList] = useState(null);
  const [selectedInteractionBucket, setSelectedInteractionBucket] = useState(null);
  const [interventionQueueFilter, setInterventionQueueFilter] = useState("全部");
  const [selectedTrialPeriod, setSelectedTrialPeriod] = useState(null);
  const [selectedStageDistribution, setSelectedStageDistribution] = useState(null);
  const wecomAccountMap = Object.fromEntries(managedWecomAccounts.map((item) => [item.key, item]));
  const trialPeriodSamples = [
    { period: "06月10日 A类体验课第1期", startTime: "2026-06-10 19:30", currentStage: lifecycleStages[1].title },
    { period: "06月12日 A类体验课第2期", startTime: "2026-06-12 19:30", currentStage: lifecycleStages[2].title },
    { period: "06月15日 A类体验课第3期", startTime: "2026-06-15 19:30", currentStage: lifecycleStages[3].title },
    { period: "06月18日 A类体验课第4期", startTime: "2026-06-18 19:30", currentStage: lifecycleStages[0].title }
  ];
  const getTrialPeriod = (item, index) => trialPeriodSamples.find((period) => period.period === item.trialPeriod) || trialPeriodSamples[index % trialPeriodSamples.length];
  const rawCustomerConversations = conversationsData.filter((item) => item.type === "single");
  const dashboardConversationRows = rawCustomerConversations.map((item, index) => {
    const dashboardTrialPeriodMeta = getTrialPeriod(item, index);
    return {
      ...item,
      dashboardTrialPeriod: dashboardTrialPeriodMeta.period,
      dashboardTrialPeriodMeta
    };
  });
  const dashboardFilterConversations = dashboardConversationRows.filter((item) => {
    const matchesWecom = dashboardWecomFilter === "all" || item.accountKey === dashboardWecomFilter;
    const matchesPeriod = dashboardPeriodFilter === "all" || item.dashboardTrialPeriod === dashboardPeriodFilter;
    return matchesWecom && matchesPeriod;
  });
  const customerConversations = dashboardFilterConversations;
  const latestInsight = insightRows[0];
  const hostedWecomCount = new Set(customerConversations.filter((item) => item.hosted).map((item) => item.accountKey)).size;
  const activeChatCount = customerConversations.filter((item) => item.status === "AI接待中").length;
  const humanInterventionCount = customerConversations.filter((item) => item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认").length;
  const lifecycleColors = ["#1b63d9", "#0c9588", "#d97706", "#dc2626", "#7c3aed"];
  const interactionBuckets = [
    { label: "5条以下", min: 0, max: 4, color: "#138a59" },
    { label: "5-10条", min: 5, max: 10, color: "#1b63d9" },
    { label: "10-20条", min: 11, max: 20, color: "#0c9588" },
    { label: "20-30条", min: 21, max: 30, color: "#d97706" },
    { label: "30-40条", min: 31, max: 40, color: "#7c3aed" },
    { label: "40-50条", min: 41, max: 50, color: "#dc2626" },
    { label: "50条以上", min: 51, max: Infinity, color: "#b45309" }
  ];
  const interactionCountSamples = [3, 8, 16, 24, 36, 45, 58, 4, 9, 18, 27, 38, 49, 63, 2, 6, 12, 22, 34, 47, 55, 1, 10, 20, 29, 40, 50, 72];
  const getCustomerReplyMessages = (item) => (item.messages || []).filter((messageItem) => messageItem.from === "customer");
  const getInteractionBucket = (count) => interactionBuckets.find((bucket) => count >= bucket.min && count <= bucket.max) || interactionBuckets[interactionBuckets.length - 1];
  const interactionUserRows = customerConversations.map((item, index) => {
    const customerMessages = getCustomerReplyMessages(item);
    const latestReply = customerMessages[customerMessages.length - 1];
    const interactionCount = Math.max(customerMessages.length, interactionCountSamples[index % interactionCountSamples.length]);
    const bucket = getInteractionBucket(interactionCount);
    return {
      key: item.key,
      conversationKey: item.key,
      accountKey: item.accountKey,
      name: item.name,
      owner: item.owner,
      interactionCount,
      latestReplyContent: latestReply?.text || item.last || "-",
      latestReplyTime: latestReply?.time || item.addedAt || "-",
      bucketLabel: bucket.label
    };
  });
  const interactionFrequencyData = interactionBuckets.map((bucket) => ({
    ...bucket,
    count: interactionUserRows.filter((item) => item.bucketLabel === bucket.label).length
  }));
  const maxInteractionFrequencyCount = Math.max(...interactionFrequencyData.map((item) => item.count), 1);
  const parseAmount = (amount = "") => Number(String(amount).replace(/[^\d.]/g, "")) || 0;
  const getOrderTime = (order, item) => {
    if (order.paidAt && order.paidAt !== "-") return order.paidAt;
    const dateMatch = String(order.id).match(/20\d{6}/);
    if (dateMatch) return `${dateMatch[0].slice(0, 4)}-${dateMatch[0].slice(4, 6)}-${dateMatch[0].slice(6, 8)}`;
    return item.addedAt?.slice(0, 10) || "-";
  };
  const aiOrders = customerConversations
    .filter((item) => item.hosted && item.orders?.some((order) => parseAmount(order.amount) > 0))
    .map((item) => ({ ...item, orderAmount: item.orders.reduce((total, order) => total + parseAmount(order.amount), 0) }));
  const aiOrderAmount = aiOrders.reduce((total, item) => total + item.orderAmount, 0);
  const aiOrderRows = customerConversations.flatMap((item) =>
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
  const interventionQueueFilterOptions = ["全部", "高意向", "超时未处理", "价格异议", "情绪/投诉风险", "报名付款相关", "AI无法判断", "用户要求真人"];
  const getInterventionTags = (item, index) => {
    const sourceText = `${item.last || ""}${item.order || ""}${item.reason || ""}${(item.tags || []).join("")}`;
    const tags = [];
    if (item.intent === "高") tags.push("高意向");
    if (item.intent === "高" || index % 4 === 2) tags.push("超时未处理");
    if (/价格|贵|费用|预算|优惠/.test(sourceText)) tags.push("价格异议");
    if (/焦虑|投诉|负面|生气|哭|叛逆|冲突|风险/.test(sourceText)) tags.push("情绪/投诉风险");
    if (/报名|付款|名额|订单|链接/.test(sourceText)) tags.push("报名付款相关");
    if (item.sendMode === "人工确认" || item.status === "待确认发送") tags.push("AI无法判断");
    if (/真人|人工|老师|顾问/.test(sourceText) || index % 5 === 1) tags.push("用户要求真人");
    return Array.from(new Set(tags.length ? tags : ["AI无法判断"]));
  };
  const getInterventionReason = (item, index) => {
    const tags = getInterventionTags(item, index);
    if (tags.includes("情绪/投诉风险")) return "情绪/投诉风险";
    if (tags.includes("报名付款相关")) return "报名付款相关";
    if (tags.includes("价格异议")) return "价格异议";
    if (tags.includes("用户要求真人")) return "用户要求真人";
    if (tags.includes("高意向")) return "高意向";
    if (tags.includes("AI无法判断")) return "AI无法判断";
    return "普通跟进";
  };
  const matchInterventionQueueFilter = (record) => interventionQueueFilter === "全部" || record.interventionTags.includes(interventionQueueFilter);
  const getWaitingTime = (item, index) => {
    const waitingSamples = ["8分钟", "16分钟", "28分钟", "43分钟", "1小时12分钟", "2小时05分钟"];
    if (item.intent === "高") return waitingSamples[(index + 2) % waitingSamples.length];
    return waitingSamples[index % waitingSamples.length];
  };
  const handleViewIntervention = (record) => {
    onViewConversation?.({ key: record.conversationKey, accountKey: record.accountKey });
  };
  const handleContinueAiHosting = (record) => {
    message.success(`${record.user}已继续AI托管`);
  };
  const interventionQueueRows = customerConversations
    .filter((item) => item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认")
    .map((item, index) => ({
      key: item.key,
      conversationKey: item.key,
      accountKey: item.accountKey,
      user: item.name,
      wecomAccount: wecomAccountMap[item.accountKey]?.label || item.owner || item.accountKey,
      period: item.dashboardTrialPeriod,
      lifecycle: item.lifecycle,
      interventionReason: getInterventionReason(item, index),
      interventionTags: getInterventionTags(item, index),
      intent: item.intent,
      waitingTime: getWaitingTime(item, index),
      owner: item.owner
    }));
  const pendingColumns = [
    { title: "用户", dataIndex: "user", width: 88, fixed: "left", render: (value, record) => <Button type="link" size="small" onClick={() => handleViewIntervention(record)}>{value}</Button> },
    { title: "所属企微", dataIndex: "wecomAccount", width: 116, ellipsis: true },
    { title: "期次", dataIndex: "period", width: 170, ellipsis: true },
    { title: "当前阶段", dataIndex: "lifecycle", width: 112, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "介入原因", dataIndex: "interventionReason", width: 150, ellipsis: true },
    { title: "意向", dataIndex: "intent", width: 64, render: (v) => <Tag color={v === "高" ? "red" : "gold"}>{v}</Tag> },
    { title: "等待时长", dataIndex: "waitingTime", width: 92 },
    { title: "负责人", dataIndex: "owner", width: 88 },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" type="link" onClick={() => handleViewIntervention(record)}>查看</Button>
          <Button size="small" type="link" onClick={() => handleContinueAiHosting(record)}>继续AI托管</Button>
        </Space>
      )
    }
  ];
  const trialPeriodUserRows = customerConversations.map((item, index) => {
    const orderAmount = (item.orders || []).reduce((total, order) => total + parseAmount(order.amount), 0);
    const manualNeeded = item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认";
    const silent = item.unread === 0 && item.status !== "AI接待中";
    const trialPeriod = item.dashboardTrialPeriodMeta || getTrialPeriod(item, index);
    return {
      key: item.key,
      conversationKey: item.key,
      accountKey: item.accountKey,
      user: item.name,
      wecomAccount: wecomAccountMap[item.accountKey]?.label || item.owner || item.accountKey,
      period: trialPeriod.period,
      startTime: trialPeriod.startTime,
      lifecycle: trialPeriod.currentStage,
      intent: item.intent,
      manualNeeded,
      silent,
      converted: item.hosted && orderAmount > 0,
      lastMessage: item.last,
      owner: item.owner
    };
  });
  const trialPeriodRows = trialPeriodSamples.map((trialPeriod) => {
    const rows = trialPeriodUserRows.filter((item) => item.period === trialPeriod.period);
    const userCount = rows.length;
    const convertedCount = rows.filter((item) => item.converted).length;
    return {
      key: trialPeriod.period,
      period: trialPeriod.period,
      startTime: trialPeriod.startTime,
      currentStage: trialPeriod.currentStage,
      userCount,
      manualCount: rows.filter((item) => item.manualNeeded).length,
      highIntentCount: rows.filter((item) => item.intent === "高").length,
      silentCount: rows.filter((item) => item.silent).length,
      convertedCount,
      conversionRate: userCount ? Math.round((convertedCount / userCount) * 100) : 0
    };
  }).filter((item) => item.userCount > 0);
  const openTrialPeriod = (record) => {
    setSelectedTrialPeriod(record);
  };
  const openTrialPeriodCustomerChat = (record) => {
    setSelectedTrialPeriod(null);
    onViewConversation?.({ key: record.conversationKey, accountKey: record.accountKey });
  };
  const trialPeriodColumns = [
    { title: "期次", dataIndex: "period", width: 180, fixed: "left", render: (value, record) => <Button type="link" size="small" onClick={() => openTrialPeriod(record)}>{value}</Button> },
    { title: "开课时间", dataIndex: "startTime", width: 140 },
    { title: "用户数", dataIndex: "userCount", width: 80, render: (value) => `${value}人` },
    { title: "当前阶段", dataIndex: "currentStage", width: 116, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "需人工", dataIndex: "manualCount", width: 80, render: (value) => <Tag color={value ? "red" : "default"}>{value}人</Tag> },
    { title: "高意向", dataIndex: "highIntentCount", width: 80, render: (value) => <Tag color={value ? "volcano" : "default"}>{value}人</Tag> },
    { title: "沉默", dataIndex: "silentCount", width: 72, render: (value) => `${value}人` },
    { title: "已转正价课", dataIndex: "convertedCount", width: 102, render: (value) => `${value}人` },
    { title: "转化率", dataIndex: "conversionRate", width: 82, render: (value) => `${value}%` }
  ];
  const trialPeriodUserColumns = [
    { title: "用户", dataIndex: "user", width: 90, fixed: "left", render: (value, record) => <Button type="link" size="small" onClick={() => openTrialPeriodCustomerChat(record)}>{value}</Button> },
    { title: "所属企微", dataIndex: "wecomAccount", width: 116, ellipsis: true },
    { title: "当前阶段", dataIndex: "lifecycle", width: 116, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "意向", dataIndex: "intent", width: 64, render: (value) => <Tag color={value === "高" ? "red" : "gold"}>{value}</Tag> },
    { title: "需人工", dataIndex: "manualNeeded", width: 80, render: (value) => value ? <Tag color="red">是</Tag> : <Tag>否</Tag> },
    { title: "最近消息", dataIndex: "lastMessage", width: 260, ellipsis: true },
    { title: "负责人", dataIndex: "owner", width: 88 },
    { title: "操作", fixed: "right", width: 86, render: (_, record) => <Button type="link" size="small" onClick={() => openTrialPeriodCustomerChat(record)}>查看会话</Button> }
  ];
  const selectedTrialPeriodUserRows = selectedTrialPeriod
    ? trialPeriodUserRows.filter((item) => item.period === selectedTrialPeriod.period)
    : [];
  const stageDistributionUserRows = customerConversations.map((item) => {
    const manualNeeded = item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认";
    const silent = item.unread === 0 && item.status !== "AI接待中";
    return {
      key: item.key,
      conversationKey: item.key,
      accountKey: item.accountKey,
      user: item.name,
      wecomAccount: wecomAccountMap[item.accountKey]?.label || item.owner || item.accountKey,
      stage: item.lifecycle,
      lifecycle: item.lifecycle,
      intent: item.intent,
      manualNeeded,
      silent,
      lastMessage: item.last,
      owner: item.owner
    };
  });
  const maxStageDistributionCount = Math.max(
    ...lifecycleStages.map((stage) => stageDistributionUserRows.filter((item) => item.stage === stage.title).length),
    1
  );
  const stageDistributionRows = lifecycleStages.map((stage, index) => {
    const rows = stageDistributionUserRows.filter((item) => item.stage === stage.title);
    return {
      key: stage.title,
      stage: stage.title,
      stageCount: rows.length,
      highIntentCount: rows.filter((item) => item.intent === "高").length,
      manualCount: rows.filter((item) => item.manualNeeded).length,
      silentCount: rows.filter((item) => item.silent).length,
      barPercent: Math.max(4, (rows.length / maxStageDistributionCount) * 100),
      color: lifecycleColors[index % lifecycleColors.length]
    };
  });
  const openStageDistribution = (record) => {
    setSelectedStageDistribution(record);
  };
  const openStageDistributionCustomerChat = (record) => {
    setSelectedStageDistribution(null);
    onViewConversation?.({ key: record.conversationKey, accountKey: record.accountKey });
  };
  const stageDistributionColumns = [
    { title: "阶段", dataIndex: "stage", width: 118, fixed: "left", render: (value, record) => <Button type="link" size="small" onClick={() => openStageDistribution(record)}>{value}</Button> },
    {
      title: "阶段人数",
      dataIndex: "stageCount",
      width: 178,
      render: (value, record) => (
        <div className="stage-distribution-count-cell">
          <div className="stage-distribution-bar-track">
            <span style={{ width: `${record.barPercent}%`, background: record.color }} />
          </div>
          <Text strong>{value}人</Text>
        </div>
      )
    },
    { title: "高意向人数", dataIndex: "highIntentCount", width: 104, render: (value) => <Tag color={value ? "volcano" : "default"}>{value}人</Tag> },
    { title: "需人工介入人数", dataIndex: "manualCount", width: 126, render: (value) => <Tag color={value ? "red" : "default"}>{value}人</Tag> }
  ];
  const stageDistributionUserColumns = [
    { title: "用户", dataIndex: "user", width: 90, fixed: "left", render: (value, record) => <Button type="link" size="small" onClick={() => openStageDistributionCustomerChat(record)}>{value}</Button> },
    { title: "所属企微", dataIndex: "wecomAccount", width: 116, ellipsis: true },
    { title: "阶段用户", dataIndex: "stage", width: 118, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "意向", dataIndex: "intent", width: 64, render: (value) => <Tag color={value === "高" ? "red" : "gold"}>{value}</Tag> },
    { title: "需人工", dataIndex: "manualNeeded", width: 80, render: (value) => value ? <Tag color="red">是</Tag> : <Tag>否</Tag> },
    { title: "沉默", dataIndex: "silent", width: 70, render: (value) => value ? <Tag color="orange">是</Tag> : <Tag>否</Tag> },
    { title: "最近消息", dataIndex: "lastMessage", width: 260, ellipsis: true },
    { title: "操作", fixed: "right", width: 86, render: (_, record) => <Button type="link" size="small" onClick={() => openStageDistributionCustomerChat(record)}>查看会话</Button> }
  ];
  const selectedStageDistributionUserRows = selectedStageDistribution
    ? stageDistributionUserRows.filter((item) => item.stage === selectedStageDistribution.stage)
    : [];
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
  const statusColorMap = { 待处理: "warning", 处理中: "processing", 已处理: "success", 已跟进: "success", 待跟进: "warning" };
  const isManualNeeded = (item) => item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认";
  const isRiskCustomer = (item) => /焦虑|投诉|负面|生气|哭|叛逆|冲突|风险/.test(`${item.last || ""}${item.order || ""}${item.reason || ""}${(item.tags || []).join("")}`);
  const isConvertedCustomer = (item) => item.hosted && (item.orders || []).some((order) => parseAmount(order.amount) > 0);
  const buildIntentionUserRows = (source, rows) => rows.map((item, index) => ({
    key: `${source.key}-${item.key}-${index}`,
    name: item.name,
    level: source.level,
    tags: [source.name, item.lifecycle, item.intent === "高" ? "高意向（AI）" : "AI分层"],
    reason: source.reason,
    action: source.aiAction,
    owner: item.owner,
    status: isManualNeeded(item) ? "待处理" : "AI跟进中",
    accountKey: item.accountKey,
    conversationKey: item.key
  }));
  const totalIntentionUsers = Math.max(customerConversations.length, 1);
  const createIntentionRow = (config) => {
    const rows = customerConversations.filter(config.match);
    const manualCount = rows.filter(isManualNeeded).length;
    const convertedCount = rows.filter(isConvertedCustomer).length;
    return {
      ...config,
      count: rows.length,
      percent: customerConversations.length ? Math.round((rows.length / totalIntentionUsers) * 100) : 0,
      manualCount,
      convertedCount,
      users: buildIntentionUserRows(config, rows)
    };
  };
  const intentionDistributionRows = [
    createIntentionRow({
      key: "high-intent",
      name: "高意向",
      level: "A",
      color: "#dc2626",
      bg: "#fff1f2",
      match: (item) => item.intent === "高" && !isRiskCustomer(item),
      reason: "咨询价格、报名、名额、付款或效果保障，转化窗口已经出现。",
      aiAction: "补充案例、整理顾虑、发送报名路径，避免重复追问。",
      humanAction: "30分钟内人工跟进，确认班型、决策人和付款阻力。",
      risk: "跟进慢会错过付款窗口"
    }),
    createIntentionRow({
      key: "medium-intent",
      name: "中意向",
      level: "B",
      color: "#d97706",
      bg: "#fffbeb",
      match: (item) => item.intent !== "高" && item.status === "AI接待中" && !isRiskCustomer(item),
      reason: "有问题描述或看课动作，但尚未明确询价、报名或付款。",
      aiAction: "持续价值铺垫，发送同类案例、课程反馈和家长课片段。",
      humanAction: "人工抽查高互动用户，优先处理价格、效果顾虑。",
      risk: "过早人工强推会增加决策压力"
    }),
    createIntentionRow({
      key: "low-intent",
      name: "低意向/沉默",
      level: "C",
      color: "#1b63d9",
      bg: "#eff6ff",
      match: (item) => item.intent !== "高" && item.status !== "AI接待中" && !isRiskCustomer(item),
      reason: "响应弱、互动少或阶段推进慢，短期成交信号不足。",
      aiAction: "低频唤醒，结合开课节点推送轻量内容，不高频打扰。",
      humanAction: "暂不大规模人工跟进，只保留重点样本复盘。",
      risk: "频繁触达容易造成流失"
    }),
    createIntentionRow({
      key: "risk-intent",
      name: "风险关注",
      level: "R",
      color: "#7c3aed",
      bg: "#f5f3ff",
      match: isRiskCustomer,
      reason: "出现投诉、负面、亲子冲突、家长情绪波动或AI不宜独立推进。",
      aiAction: "暂停强转化话术，只做共情、信息收集和边界提醒。",
      humanAction: "人工谨慎介入，先确认事实和风险，再决定是否继续转化。",
      risk: "处理不当会扩大投诉或服务风险"
    })
  ];
  const maxIntentionCount = Math.max(...intentionDistributionRows.map((item) => item.count), 1);
  const intentionSummary = `当前筛选范围内共 ${customerConversations.length} 人，高意向 ${intentionDistributionRows[0].count} 人，需人工优先跟进 ${intentionDistributionRows.reduce((total, item) => total + item.manualCount, 0)} 人，AI继续培育 ${intentionDistributionRows[1].count + intentionDistributionRows[2].count} 人，风险关注 ${intentionDistributionRows[3].count} 人。`;
  const openInsightUserList = (source) => {
    setInsightUserList({
      title: source.title,
      count: source.count,
      rows: source.rows || buildInsightUserRows(latestInsight, source, customerConversations)
    });
  };
  const openInsightCustomerChat = (record) => {
    setInsightUserList(null);
    if (record.conversationKey) {
      onViewConversation?.({ key: record.conversationKey, accountKey: record.accountKey });
    } else {
      message.info("该演示用户暂无同步会话");
    }
  };
  const openInteractionBucket = (bucket) => {
    setSelectedInteractionBucket(bucket);
  };
  const openInteractionCustomerChat = (record) => {
    setSelectedInteractionBucket(null);
    onViewConversation?.({ key: record.conversationKey, accountKey: record.accountKey });
  };
  const renderClickableCount = (source) => (
    <Button type="link" className="insight-clickable-count" onClick={() => openInsightUserList(source)}>
      {source.count}{source.suffix || "人"}
    </Button>
  );
  const userListColumns = [
    { title: "用户", dataIndex: "name", width: 86, render: (value, record) => <Button type="link" size="small" className="insight-user-name-link" onClick={() => openInsightCustomerChat(record)}>{value}</Button> },
    { title: "等级", dataIndex: "level", width: 56, render: (value) => <span className={`customer-level-pill level-${value}`}>{value}</span> },
    {
      title: "关键标签",
      dataIndex: "tags",
      width: 210,
      render: (tags) => (
        <Space wrap size={[4, 4]} className="insight-user-tag-cell">
          {tags.map((tag) => <Tag className={tag.includes("AI") ? "customer-selected-ai-tag" : "customer-selected-tag"} key={tag}>{tag}</Tag>)}
        </Space>
      )
    },
    { title: "命中原因", dataIndex: "reason", width: 260, render: (value) => <div className="insight-wrap-cell">{value}</div> },
    { title: "建议动作", dataIndex: "action", width: 260, render: (value) => <div className="insight-wrap-cell">{value}</div> },
    {
      title: "操作",
      fixed: "right",
      width: 86,
      render: (_, record) => <Button type="link" size="small" onClick={() => openInsightCustomerChat(record)}>查看会话</Button>
    }
  ];
  const interactionUserColumns = [
    {
      title: "用户",
      dataIndex: "name",
      width: 96,
      render: (value, record) => (
        <Button
          type="link"
          size="small"
          className="insight-user-name-link"
          onClick={(event) => {
            event.stopPropagation();
            openInteractionCustomerChat(record);
          }}
        >
          {value}
        </Button>
      )
    },
    { title: "销售", dataIndex: "owner", width: 88 },
    { title: "回复条数", dataIndex: "interactionCount", width: 90, sorter: (a, b) => a.interactionCount - b.interactionCount, render: (value) => `${value}条` },
    { title: "最近回复内容", dataIndex: "latestReplyContent", width: 320, ellipsis: true },
    { title: "最近回复时间", dataIndex: "latestReplyTime", width: 112 },
    {
      title: "操作",
      fixed: "right",
      width: 86,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            openInteractionCustomerChat(record);
          }}
        >
          查看会话
        </Button>
      )
    }
  ];
  const selectedInteractionUserRows = selectedInteractionBucket
    ? interactionUserRows.filter((item) => item.bucketLabel === selectedInteractionBucket.label)
    : [];
  const interventionRows = interventionQueueRows;
  const filteredInterventionRows = interventionRows.filter(matchInterventionQueueFilter);
  const getInterventionQueueFilterCount = (filter) => filter === "全部"
    ? interventionRows.length
    : interventionRows.filter((record) => record.interventionTags.includes(filter)).length;
  const interventionQueueSegmentOptions = interventionQueueFilterOptions.map((filter) => ({
    value: filter,
    label: (
      <span className="intervention-filter-option">
        <span>{filter}</span>
        <span className="intervention-filter-count">{getInterventionQueueFilterCount(filter)}</span>
      </span>
    )
  }));
  const overdueInterventionCount = interventionRows.filter((item) => item.intent === "高").length;
  const overdueHelp = (
    <div className="metric-help-content">
      <div>紧急：10分钟，投诉/负面/要求真人</div>
      <div>高：30分钟，高意向、报名付款</div>
      <div>中：1小时，价格异议、效果顾虑</div>
      <div>低：24小时，沉默唤醒、普通跟进</div>
    </div>
  );
  const metricCards = [
    { label: "托管企微数", icon: WechatOutlined, value: hostedWecomCount, previous: "昨日 4", trend: "+20%", trendType: "up", tone: "cyan" },
    { label: "托管用户数", icon: TeamOutlined, value: customerConversations.length, previous: "昨日 18", trend: "+35%", trendType: "up", tone: "purple" },
    { label: "当前AI接待中", icon: CommentOutlined, value: activeChatCount, previous: "昨日 12", trend: "+23%", trendType: "up", tone: "blue" },
    { label: "需人工介入", icon: AlertOutlined, value: humanInterventionCount, previous: "昨日 6", trend: "+48%", trendType: "down", tone: "red", type: "warning" },
    { label: "超时未处理", icon: AlertOutlined, value: overdueInterventionCount, previous: "昨日 3", trend: "+15%", trendType: "down", tone: "red", type: "warning", help: overdueHelp },
    { label: "AI参与订单金额", icon: DollarOutlined, value: `¥${aiOrderAmount.toLocaleString()}`, previous: `转化订单数 ${aiOrderRows.length}单`, trend: "+42%", trendType: "up", tone: "orange" }
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
                    {item.help ? (
                      <Tooltip title={item.help} placement="top">
                        <QuestionCircleOutlined className="metric-help-icon" />
                      </Tooltip>
                    ) : null}
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
      <Card className="intervention-card" title={<PanelTitle title="人工介入队列" desc="按用户、企微、期次和介入原因集中处理需要人工接手的会话。" extra={<Button type="link" size="small" onClick={() => setDashboardModal("intervention")}>更多</Button>} />}>
        <div className="intervention-queue-filter">
          <Text className="intervention-filter-label">队列筛选</Text>
          <Segmented size="small" options={interventionQueueSegmentOptions} value={interventionQueueFilter} onChange={setInterventionQueueFilter} />
        </div>
        <Table size="small" className="admin-table compact-warning-table" rowKey="key" columns={pendingColumns} dataSource={filteredInterventionRows.slice(0, 5)} pagination={false} scroll={{ x: 900 }} />
      </Card>
      <Card className="dashboard-card" title={<PanelTitle title="体验课期次看板" desc="按开课期次汇总用户阶段、人工压力和正价课转化情况。" />}>
        <Table
          size="small"
          className="admin-table trial-period-table"
          rowKey="key"
          columns={trialPeriodColumns}
          dataSource={trialPeriodRows}
          pagination={false}
          scroll={{ x: 930 }}
          onRow={(record) => ({
            onClick: () => openTrialPeriod(record),
            className: "clickable-table-row"
          })}
        />
      </Card>
      <Row gutter={[16, 16]} className="dashboard-analysis-row">
        <Col xs={24} xl={12} className="dashboard-analysis-col">
          <Card className="dashboard-card stage-distribution-card" title={<PanelTitle title="阶段用户分布" desc="直接展示当前所处每个阶段的用户数和人工介入情况。" />}>
            <Table
              size="small"
              className="admin-table stage-distribution-table"
              rowKey="key"
              columns={stageDistributionColumns}
              dataSource={stageDistributionRows}
              pagination={false}
              scroll={{ x: 580 }}
              onRow={(record) => ({
                onClick: () => openStageDistribution(record),
                className: "clickable-table-row"
              })}
            />
          </Card>
        </Col>
        <Col xs={24} xl={12} className="dashboard-analysis-col">
          <Card
            className="dashboard-insight-card intention-action-card"
            title={<PanelTitle title="意向分布" desc="按用户意向度拆解分布、人工压力和转化订单。" extra={<Tag color={statusColorMap[latestInsight.status] || "default"}>{latestInsight.status}</Tag>} />}
          >
            <div className="intention-action-layout">
              <section className="intention-summary-bar">
                <Text>{intentionSummary}</Text>
              </section>
              <section className="intention-distribution-panel">
                <div className="insight-section-title">意向度分布</div>
                <div className="intention-distribution-list">
                  {intentionDistributionRows.map((item) => (
                    <button type="button" className="intention-distribution-row" key={item.key} onClick={() => openInsightUserList({ title: item.name, count: item.count, rows: item.users })}>
                      <span className="intention-row-name">
                        <i style={{ background: item.color }} />
                        {item.name}
                      </span>
                      <span className="intention-progress-track">
                        <span style={{ width: `${Math.max(4, (item.count / maxIntentionCount) * 100)}%`, background: item.color }} />
                      </span>
                      <span className="intention-row-metrics">
                        <Text strong>{item.count}人</Text>
                        <Text type="secondary">{item.percent}%</Text>
                        <Tag color={item.manualCount ? "red" : "default"}>需人工 {item.manualCount}</Tag>
                        <Tag color={item.convertedCount ? "green" : "default"}>转化订单 {item.convertedCount}</Tag>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </Card>
        </Col>
      </Row>
      <Card className="dashboard-card intention-strategy-section-card" title={<PanelTitle title="人机协同动作" desc="按意向分层给出AI继续托管和人工介入的转化动作。" />}>
        <div className="intention-strategy-grid">
          {intentionDistributionRows.map((item) => (
            <div className="intention-strategy-card" key={item.key} style={{ background: item.bg }}>
              <div className="intention-strategy-head">
                <Tag color={item.key === "risk-intent" ? "purple" : item.key === "high-intent" ? "red" : item.key === "medium-intent" ? "orange" : "blue"}>{item.name}</Tag>
                <Button type="link" size="small" onClick={() => openInsightUserList({ title: item.name, count: item.count, rows: item.users })}>{item.count}人</Button>
              </div>
              <div className="intention-strategy-copy">
                <Paragraph type="secondary"><Text strong>情况：</Text>{item.reason}</Paragraph>
                <Paragraph><Text strong>AI动作：</Text>{item.aiAction}</Paragraph>
                <Paragraph><Text strong>人工动作：</Text>{item.humanAction}</Paragraph>
                <Paragraph type="secondary"><Text strong>当前风险：</Text>{item.risk}</Paragraph>
              </div>
              <Space size={6} wrap>
                <Button size="small" onClick={() => openInsightUserList({ title: item.name, count: item.count, rows: item.users })}>查看用户</Button>
                <Button size="small">生成跟进任务</Button>
                <Button size="small">加入群发人群</Button>
              </Space>
            </div>
          ))}
        </div>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="intervention-card ai-order-card" title={<PanelTitle title="AI参与订单" desc="统计由AI参与沟通、推荐课程或推动报名的订单。" extra={<Button type="link" size="small" onClick={() => setDashboardModal("orders")}>更多</Button>} />}>
            <Table size="small" className="admin-table compact-warning-table" rowKey="key" columns={orderColumns} dataSource={aiOrderRows.slice(0, 5)} pagination={false} scroll={{ x: 460 }} />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="dashboard-card" title={<PanelTitle title="互动屏次分布" desc="统计用户发出信息条数对应的人数分布。" />}>
            <div className="interval-chart">
              {interactionFrequencyData.map((item) => (
                <div className="interval-item" key={item.label}>
                  <button type="button" className="interval-bar-button" onClick={() => openInteractionBucket(item)} aria-label={`查看${item.label}互动用户`}>
                    <span className="interval-bar" style={{ height: `${Math.max(18, (item.count / maxInteractionFrequencyCount) * 190)}px`, background: item.color }} />
                  </button>
                  <Text strong>{item.count}</Text>
                  <Text type="secondary" title={item.label}>{item.label}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
    <Modal title="人工介入队列" open={dashboardModal === "intervention"} onCancel={() => setDashboardModal("")} footer={null} width={1180}>
      <Space direction="vertical" size={12} className="full-width">
        <div className="intervention-queue-filter modal-filter">
          <Text className="intervention-filter-label">队列筛选</Text>
          <Segmented size="small" options={interventionQueueSegmentOptions} value={interventionQueueFilter} onChange={setInterventionQueueFilter} />
        </div>
        <Table size="small" className="admin-table" rowKey="key" columns={pendingColumns} dataSource={filteredInterventionRows} pagination={{ pageSize: 8, showSizeChanger: true }} scroll={{ x: 940 }} />
      </Space>
    </Modal>
    <Modal
      title={selectedTrialPeriod ? `${selectedTrialPeriod.period} · 用户列表` : "体验课期次用户列表"}
      open={Boolean(selectedTrialPeriod)}
      onCancel={() => setSelectedTrialPeriod(null)}
      footer={null}
      width={1080}
    >
      <Table
        size="small"
        className="admin-table"
        rowKey="key"
        columns={trialPeriodUserColumns}
        dataSource={selectedTrialPeriodUserRows}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 900 }}
        onRow={(record) => ({
          onClick: () => openTrialPeriodCustomerChat(record),
          className: "clickable-table-row"
        })}
      />
    </Modal>
    <Modal
      title={selectedStageDistribution ? `${selectedStageDistribution.stage} · 阶段用户` : "阶段用户"}
      open={Boolean(selectedStageDistribution)}
      onCancel={() => setSelectedStageDistribution(null)}
      footer={null}
      width={1120}
    >
      <Table
        size="small"
        className="admin-table"
        rowKey="key"
        columns={stageDistributionUserColumns}
        dataSource={selectedStageDistributionUserRows}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 940 }}
        onRow={(record) => ({
          onClick: () => openStageDistributionCustomerChat(record),
          className: "clickable-table-row"
        })}
      />
    </Modal>
    <Modal title="AI参与订单" open={dashboardModal === "orders"} onCancel={() => setDashboardModal("")} footer={null} width={980}>
      <Table size="small" className="admin-table" rowKey="key" columns={orderModalColumns} dataSource={aiOrderRows} pagination={{ pageSize: 8, showSizeChanger: true }} scroll={{ x: 760 }} />
    </Modal>
    <Modal
      title={selectedInteractionBucket ? `互动屏次分布 · ${selectedInteractionBucket.label}` : "互动屏次分布"}
      open={Boolean(selectedInteractionBucket)}
      onCancel={() => setSelectedInteractionBucket(null)}
      footer={null}
      width={980}
    >
      <Table
        size="small"
        className="admin-table"
        rowKey="key"
        columns={interactionUserColumns}
        dataSource={selectedInteractionUserRows}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 790 }}
        onRow={(record) => ({
          onClick: () => openInteractionCustomerChat(record),
          className: "clickable-table-row"
        })}
      />
    </Modal>
    <Modal
      title={insightUserList ? `${insightUserList.title}名单` : "用户清单"}
      open={Boolean(insightUserList)}
      onCancel={() => setInsightUserList(null)}
      footer={null}
      width={1060}
      className="insight-user-list-modal"
    >
      {insightUserList ? (
        <div className="insight-user-list-content">
          <div className="insight-user-list-head">
            <Text type="secondary">对应用户数</Text>
            <Text>{insightUserList.count} 人</Text>
          </div>
          <Table
            size="small"
            className="admin-table insight-user-list-table"
            rowKey="key"
            columns={userListColumns}
            dataSource={insightUserList.rows}
            pagination={{ pageSize: 8, showSizeChanger: false }}
          />
        </div>
      ) : null}
    </Modal>
    </>
  );
}

export { DashboardPage as Dashboard };
export default DashboardPage;
