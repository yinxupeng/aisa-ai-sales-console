import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Pagination,
  Popover,
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
  Typography
} from "antd";
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudSyncOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PaperClipOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
  UserOutlined,
  WechatOutlined
} from "@ant-design/icons";
import { CommonTagPickerModal, CommonTagSelectButton } from "../components/CommonTagPicker";
import { conversations, customerServiceStages, lifecycleStages } from "../data/conversations";
import {
  accounts,
  createCustomerTagValues,
  customerTagGroups,
  getTagDisplayLabel,
  isAiGeneratedTag,
  managedWecomAccounts,
  pendingMessages,
  proactivePlans
} from "../data/appData";
import WecomAvatar from "../components/WecomAvatar";
import { PanelTitle, statusTag } from "../components/PageChrome";


const { Text, Title, Paragraph } = Typography;



function ConversationsPage({ activeWecom, activeConversationKey, autoOpenCustomerDrawerToken = 0, visibleWecomKeys = managedWecomAccounts.map((item) => item.key), onActiveWecomChange }) {
  const { message } = AntApp.useApp();
  const visibleConversations = conversations.filter((item) => visibleWecomKeys.includes(item.accountKey));
  const accountConversations = visibleConversations.filter((item) => item.accountKey === activeWecom);
  const activeConversation = activeConversationKey ? visibleConversations.find((item) => item.key === activeConversationKey) : null;
  const [selected, setSelected] = useState(activeConversation || accountConversations[0] || visibleConversations[0] || null);
  const [customerPhoneValues, setCustomerPhoneValues] = useState({});
  const [hostingMode, setHostingMode] = useState(selected?.hosted ? "ai" : "manual");
  const [manualReply, setManualReply] = useState("");
  const [composerItems, setComposerItems] = useState([]);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [customerDrawerTab, setCustomerDrawerTab] = useState("profile");
  const [selectedCourseOrderKey, setSelectedCourseOrderKey] = useState(null);
  const [customerTagValues, setCustomerTagValues] = useState(() => createCustomerTagValues(selected));
  const [hostingOverrides, setHostingOverrides] = useState({});
  const [sessionKeyword, setSessionKeyword] = useState("");
  const [quickFilter, setQuickFilter] = useState("全部");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionPageSize, setSessionPageSize] = useState(10);
  const [tagPickerState, setTagPickerState] = useState({ open: false, field: "tags", title: "选择客户标签", selected: [], keyword: "", rule: "满足任一" });
  const [confirmedStrategyTaskKeys, setConfirmedStrategyTaskKeys] = useState({});
  const [strategyInsightDrafts, setStrategyInsightDrafts] = useState({});
  const [strategyInsightEditing, setStrategyInsightEditing] = useState(false);
  const [strategyInsightDraft, setStrategyInsightDraft] = useState("");
  const defaultSessionFilters = {
    tags: [],
    tagMatch: "满足任一",
    excludeTags: [],
    customerType: "全部客户类型",
    customerLevel: "全部等级",
    intent: "全部意向",
    relationStatus: "全部企微关系",
    hostingStatus: "全部用户",
    unreadStatus: "全部消息状态",
    lifecycle: "全部用户",
    scheduleStatus: "全部用户",
    attendanceStatus: "全部用户",
    courseStatus: "全部课程状态",
    watchTime: "全部看课时长",
    conflictLevel: "全部亲子冲突"
  };
  const [sessionFilters, setSessionFilters] = useState(defaultSessionFilters);
  const needsHumanIntervention = (item) => item.status === "待确认发送" || item.status === "人工接管" || item.sendMode === "人工确认";
  const getHosted = (item) => hostingOverrides[item.key] ?? item.hosted;
  const sessionInsightMap = {
    c1: { courseStatus: "已上体验课未报名", watchMinutes: 52, conflictLevel: "中", relationStatus: "好友正常", customerType: "曾购买398", customerLevel: "A", todayActive: true },
    c2: { courseStatus: "待预约体验课", watchMinutes: 0, conflictLevel: "低", relationStatus: "好友正常", customerType: "纯新用户", customerLevel: "B", todayActive: true },
    c3: { courseStatus: "已上体验课未报名", watchMinutes: 68, conflictLevel: "中", relationStatus: "好友正常", customerType: "其他", customerLevel: "S", todayActive: true },
    c4: { courseStatus: "待预约体验课", watchMinutes: 0, conflictLevel: "低", relationStatus: "好友正常", customerType: "纯新用户", customerLevel: "B", todayActive: true },
    c5: { courseStatus: "已上体验课未报名", watchMinutes: 35, conflictLevel: "低", relationStatus: "好友正常", customerType: "其他", customerLevel: "A", todayActive: true },
    c6: { courseStatus: "待预约体验课", watchMinutes: 0, conflictLevel: "低", relationStatus: "好友正常", customerType: "纯新用户", customerLevel: "B", todayActive: true },
    "li-demo-1": { courseStatus: "已预约体验课", watchMinutes: 0, conflictLevel: "低", relationStatus: "好友正常", customerType: "仅体验", customerLevel: "S", todayActive: true },
    "li-demo-2": { courseStatus: "已上体验课未报名", watchMinutes: 18, conflictLevel: "中", relationStatus: "好友正常", customerType: "其他", customerLevel: "A", todayActive: false },
    "li-demo-3": { courseStatus: "待预约体验课", watchMinutes: 0, conflictLevel: "低", relationStatus: "好友正常", customerType: "纯新用户", customerLevel: "A", todayActive: true },
    "li-demo-4": { courseStatus: "已上体验课未报名", watchMinutes: 41, conflictLevel: "中", relationStatus: "好友正常", customerType: "其他", customerLevel: "B", todayActive: false },
    "li-demo-5": { courseStatus: "已上体验课未报名", watchMinutes: 8, conflictLevel: "高", relationStatus: "已删除企微", customerType: "仅体验", customerLevel: "C", todayActive: false },
    "li-demo-6": { courseStatus: "待付款", watchMinutes: 74, conflictLevel: "低", relationStatus: "好友正常", customerType: "曾购买398", customerLevel: "S", todayActive: true },
    "li-demo-7": { courseStatus: "待选择课程", watchMinutes: 22, conflictLevel: "低", relationStatus: "好友正常", customerType: "其他", customerLevel: "B", todayActive: false },
    "li-demo-8": { courseStatus: "待预约体验课", watchMinutes: 0, conflictLevel: "中", relationStatus: "好友正常", customerType: "纯新用户", customerLevel: "C", todayActive: false },
    "li-demo-9": { courseStatus: "群运营", watchMinutes: 0, conflictLevel: "低", relationStatus: "群聊", customerType: "其他", customerLevel: "B", todayActive: true }
  };
  const getSessionInsights = (item) => {
    const base = sessionInsightMap[item.key] || {};
    return {
      courseStatus: base.courseStatus || (item.order?.includes("未报名") ? "未报名" : "待跟进"),
      watchMinutes: base.watchMinutes ?? 0,
      conflictLevel: base.conflictLevel || "低",
      relationStatus: base.relationStatus || (item.type === "group" ? "群聊" : "好友正常"),
      customerType: base.customerType || "其他",
      customerLevel: base.customerLevel || (item.intent === "高" ? "A" : item.intent === "中" ? "B" : "C"),
      todayActive: base.todayActive ?? ["待确认发送", "AI接待中"].includes(item.status)
    };
  };
  const quickFilterOptions = ["全部", "高意向", "今日有互动", "需人工介入", "已上体验课未报名", "已删除企微", "看课>30分钟"];
  const watchTimeMatches = (minutes, rule) => {
    if (rule === "全部看课时长") return true;
    if (rule === "不足10分钟") return minutes < 10;
    if (rule === "大于10分钟") return minutes > 10;
    if (rule === "大于30分钟") return minutes > 30;
    if (rule === "大于60分钟") return minutes > 60;
    return true;
  };
  const getScheduleStatus = (insights) => {
    if (["待预约体验课", "待选择课程", "群运营"].includes(insights.courseStatus)) return "未排课";
    return "已排课";
  };
  const getAttendanceStatus = (insights) => {
    if (insights.courseStatus.includes("已上") || insights.watchMinutes > 0) return "已上课";
    return "未上课";
  };
  const getCustomerServiceStage = (item) => {
    const total = customerServiceStages.length;
    const currentIndex = Math.min(Math.max(item.lifecycleStage ?? 0, 0), total - 1);
    const baseTime = item.addedAt ? dayjs(item.addedAt) : dayjs("2026-08-23 23:06");
    const enteredAt = baseTime.add(currentIndex, "day").format("MM-DD HH:mm");
    const nextAt = currentIndex < total - 1 ? baseTime.add(currentIndex + 1, "day").format("MM-DD HH:mm") : "已完成";
    return {
      total,
      currentIndex,
      currentNumber: currentIndex + 1,
      currentName: customerServiceStages[currentIndex],
      nextName: customerServiceStages[currentIndex + 1] || "服务结束",
      enteredAt,
      nextAt
    };
  };
  const getRecentConversationInfo = (item) => {
    const messages = item.messages || [];
    const lastMessage = messages[messages.length - 1];
    const text = lastMessage?.text || item.last || "暂无最近沟通";
    const baseDate = item.addedAt ? dayjs(item.addedAt).format("MM-DD") : dayjs().format("MM-DD");
    const time = lastMessage?.time ? `${baseDate} ${lastMessage.time}` : baseDate;
    return { time, text };
  };
  const renderServiceStageProgress = (item) => {
    const stage = getCustomerServiceStage(item);
    return (
      <Popover
        trigger="hover"
        placement="topLeft"
        content={
          <div className="service-stage-popover">
            <div><Text type="secondary">当前服务阶段</Text><Text>{stage.currentName}</Text></div>
            <div><Text type="secondary">阶段进度</Text><Text>{stage.currentNumber}/{stage.total}</Text></div>
            <div><Text type="secondary">进入时间</Text><Text>{stage.enteredAt}</Text></div>
            <div><Text type="secondary">下一阶段</Text><Text>{stage.nextName}</Text></div>
            <div><Text type="secondary">预计进入</Text><Text>{stage.nextAt}</Text></div>
          </div>
        }
      >
        <div className="service-stage-progress" aria-label={`阶段进度 ${stage.currentNumber}/${stage.total}`}>
          {customerServiceStages.map((stageName, index) => (
            <span
              key={stageName}
              className={index < stage.currentIndex ? "service-stage-dot done" : index === stage.currentIndex ? "service-stage-dot current" : "service-stage-dot"}
            />
          ))}
        </div>
      </Popover>
    );
  };
  const matchesQuickFilter = (item) => {
    const insights = getSessionInsights(item);
    if (quickFilter === "全部") return true;
    if (quickFilter === "高意向") return item.intent === "高";
    if (quickFilter === "今日有互动") return insights.todayActive;
    if (quickFilter === "需人工介入") return needsHumanIntervention(item);
    if (quickFilter === "已上体验课未报名") return insights.courseStatus === "已上体验课未报名";
    if (quickFilter === "已删除企微") return insights.relationStatus === "已删除企微";
    if (quickFilter === "看课>30分钟") return insights.watchMinutes > 30;
    return true;
  };
  const filteredConversations = accountConversations.filter((item) => {
    const keywordText = sessionKeyword.trim();
    const insights = getSessionInsights(item);
    const tagValues = item.tags || [];
    const matchesKeyword = !keywordText || [item.name, item.last, item.remark, ...tagValues].some((value) => String(value).includes(keywordText));
    const matchesTags = sessionFilters.tags.length === 0 || (sessionFilters.tagMatch === "同时满足"
      ? sessionFilters.tags.every((tag) => tagValues.includes(tag))
      : sessionFilters.tags.some((tag) => tagValues.includes(tag)));
    const excludesTags = sessionFilters.excludeTags.length > 0 && sessionFilters.excludeTags.some((tag) => tagValues.includes(tag));
    const matchesCustomerType = sessionFilters.customerType === "全部客户类型" || insights.customerType === sessionFilters.customerType;
    const matchesCustomerLevel = sessionFilters.customerLevel === "全部等级" || insights.customerLevel === sessionFilters.customerLevel;
    const matchesIntent = sessionFilters.intent === "全部意向" || item.intent === sessionFilters.intent.replace("意向", "");
    const matchesRelation = sessionFilters.relationStatus === "全部企微关系" || insights.relationStatus === sessionFilters.relationStatus;
    const matchesHosting = sessionFilters.hostingStatus === "全部用户" || (sessionFilters.hostingStatus === "已托管" ? getHosted(item) : !getHosted(item));
    const matchesUnread = sessionFilters.unreadStatus === "全部消息状态" || (sessionFilters.unreadStatus === "有未读消息" ? item.unread > 0 : item.unread === 0);
    const matchesLifecycle = sessionFilters.lifecycle === "全部用户" || item.lifecycle === sessionFilters.lifecycle;
    const matchesSchedule = sessionFilters.scheduleStatus === "全部用户" || getScheduleStatus(insights) === sessionFilters.scheduleStatus;
    const matchesAttendance = sessionFilters.attendanceStatus === "全部用户" || getAttendanceStatus(insights) === sessionFilters.attendanceStatus;
    const matchesCourse = sessionFilters.courseStatus === "全部课程状态" || insights.courseStatus === sessionFilters.courseStatus;
    const matchesWatch = watchTimeMatches(insights.watchMinutes, sessionFilters.watchTime);
    const matchesConflict = sessionFilters.conflictLevel === "全部亲子冲突" || insights.conflictLevel === sessionFilters.conflictLevel;
    return matchesKeyword && matchesQuickFilter(item) && matchesTags && !excludesTags && matchesCustomerType && matchesCustomerLevel && matchesIntent && matchesRelation && matchesHosting && matchesUnread && matchesLifecycle && matchesSchedule && matchesAttendance && matchesCourse && matchesWatch && matchesConflict;
  });
  const activeFilterCount = [
    quickFilter !== "全部",
    sessionFilters.tags.length > 0,
    sessionFilters.excludeTags.length > 0,
    sessionFilters.customerType !== "全部客户类型",
    sessionFilters.customerLevel !== "全部等级",
    sessionFilters.intent !== "全部意向",
    sessionFilters.relationStatus !== "全部企微关系",
    sessionFilters.hostingStatus !== "全部用户",
    sessionFilters.unreadStatus !== "全部消息状态",
    sessionFilters.lifecycle !== "全部用户",
    sessionFilters.scheduleStatus !== "全部用户",
    sessionFilters.attendanceStatus !== "全部用户",
    sessionFilters.courseStatus !== "全部课程状态",
    sessionFilters.watchTime !== "全部看课时长",
    sessionFilters.conflictLevel !== "全部亲子冲突"
  ].filter(Boolean).length;
  const effectiveSessionPage = Math.min(sessionPage, Math.max(1, Math.ceil(filteredConversations.length / sessionPageSize)));
  const paginatedConversations = filteredConversations.slice((effectiveSessionPage - 1) * sessionPageSize, effectiveSessionPage * sessionPageSize);
  useEffect(() => {
    setSessionPage(1);
  }, [activeWecom, activeConversationKey, visibleWecomKeys.join("|"), sessionKeyword, quickFilter, JSON.stringify(sessionFilters)]);
  useEffect(() => {
    setSelected(activeConversation || filteredConversations[0] || accountConversations[0] || visibleConversations[0] || null);
  }, [activeWecom, activeConversationKey, visibleWecomKeys.join("|"), sessionKeyword, quickFilter, JSON.stringify(sessionFilters)]);
  useEffect(() => {
    if (selected) setHostingMode(getHosted(selected) ? "ai" : "manual");
    if (selected) {
      setCustomerTagValues(createCustomerTagValues(selected));
    }
    setSelectedCourseOrderKey(null);
    setManualReply("");
    setComposerItems([]);
    setStrategyInsightEditing(false);
  }, [selected?.key, hostingOverrides]);
  useEffect(() => {
    if (autoOpenCustomerDrawerToken && activeConversationKey && selected?.key === activeConversationKey) {
      setCustomerDrawerTab("profile");
      setCustomerDrawerOpen(true);
    }
  }, [autoOpenCustomerDrawerToken, activeConversationKey, selected?.key]);
  const confirmHostingChange = (checked) => {
    Modal.confirm({
      title: checked ? "确认开启AI托管？" : "确认关闭AI托管？",
      content: checked ? "开启后，AI将继续参与该会话的接待与回复建议。" : "关闭后，该会话将切换为人工跟进。",
      okText: checked ? "确认开启" : "确认关闭",
      cancelText: "取消",
      onOk: () => {
        setHostingMode(checked ? "ai" : "manual");
        setHostingOverrides((items) => ({ ...items, [selected.key]: checked }));
      }
    });
  };
  const confirmListHostingChange = (item, checked) => {
    Modal.confirm({
      title: checked ? "确认开启AI托管？" : "确认关闭AI托管？",
      content: checked ? `开启后，AI将继续参与 ${item.name} 的接待与回复建议。` : `关闭后，${item.name} 将切换为人工跟进。`,
      okText: checked ? "确认开启" : "确认关闭",
      cancelText: "取消",
      onOk: () => {
        setHostingOverrides((items) => ({ ...items, [item.key]: checked }));
        if (selected?.key === item.key) setHostingMode(checked ? "ai" : "manual");
      }
    });
  };
  const openCustomerDetail = (item, tabKey = "profile") => {
    setSelected(item);
    setCustomerDrawerTab(tabKey === "chat" ? "profile" : tabKey);
    setCustomerDrawerOpen(true);
  };
  const openSessionTagPicker = (field) => {
    setTagPickerState({
      open: true,
      field,
      title: field === "tags" ? "选择客户标签" : "选择排除标签",
      selected: sessionFilters[field] || [],
      keyword: "",
      rule: field === "tags" && sessionFilters.tagMatch === "同时满足" ? "以下标签同时满足" : "以下标签满足其一"
    });
  };
  const saveSessionTagPicker = () => {
    setSessionFilters((item) => ({
      ...item,
      [tagPickerState.field]: tagPickerState.selected,
      tagMatch: tagPickerState.field === "tags" ? (tagPickerState.rule === "以下标签同时满足" ? "同时满足" : "满足任一") : item.tagMatch
    }));
    setTagPickerState((item) => ({ ...item, open: false }));
  };
  const visibleWecomAccounts = managedWecomAccounts.filter((item) => visibleWecomKeys.includes(item.key));
  const activeWecomAccount = visibleWecomAccounts.find((item) => item.key === activeWecom) || visibleWecomAccounts[0];
  const wecomAccountRows = visibleWecomAccounts.map((account) => {
    const accountConversations = visibleConversations.filter((item) => item.accountKey === account.key);
    return {
      ...account,
      customerTotal: accountConversations.length,
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
            <Text type="secondary" className="wecom-account-count">{account.customerTotal}</Text>
          </List.Item>
        )}
      />
    </aside>
  );
  const renderSessionFilterPanel = () => {
    const resetFilters = () => {
      setSessionKeyword("");
      setQuickFilter("全部");
      setSessionFilters(defaultSessionFilters);
    };
    const focusFirstResult = () => {
      if (filteredConversations[0]) setSelected(filteredConversations[0]);
    };
    return (
      <div className="session-filter-panel">
        <div className="session-filter-grid">
          <label className="session-filter-control session-filter-search">
            <Input.Search placeholder="搜索客户、群或消息" allowClear value={sessionKeyword} onChange={(event) => setSessionKeyword(event.target.value)} onSearch={focusFirstResult} />
          </label>
          <label className="session-filter-control">
            <Select value={sessionFilters.hostingStatus} options={[{ value: "全部用户", label: "筛选托管" }, ...["已托管", "未托管"].map((value) => ({ value, label: value }))]} onChange={(value) => setSessionFilters((item) => ({ ...item, hostingStatus: value }))} />
          </label>
          <label className="session-filter-control session-filter-stage">
            <Select value={sessionFilters.lifecycle} options={[{ value: "全部用户", label: "筛选阶段" }, ...Array.from(new Set(visibleConversations.map((item) => item.lifecycle).filter(Boolean))).map((value) => ({ value, label: value }))]} onChange={(value) => setSessionFilters((item) => ({ ...item, lifecycle: value }))} />
          </label>
          <label className="session-filter-control session-filter-tags">
            <CommonTagSelectButton value={sessionFilters.tags} placeholder="选择客户标签" onClick={() => openSessionTagPicker("tags")} onChange={(value) => setSessionFilters((item) => ({ ...item, tags: value }))} />
          </label>
          <div className="session-filter-actions">
            <Button onClick={resetFilters}>重置</Button>
            <Button type="primary" onClick={focusFirstResult}>搜索</Button>
          </div>
        </div>
      </div>
    );
  };
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
        {renderWecomAccountList()}
        <aside className="wecom-session-list">
          {renderSessionFilterPanel()}
          <List className="session-list" dataSource={[]} locale={{ emptyText: "当前权限下暂无同步会话" }} />
        </aside>
      </div>
    );
  }
  const selectedOrder = selected.orders?.[0];
  const insightStatus = selectedOrder?.amount && selectedOrder.amount.startsWith("¥") ? `曾购买${selectedOrder.amount.replace("¥", "")}` : selected.order;
  const insightRows = [
    { label: "孩子情况", value: selected.key === "c1" ? "三年级，英语不敢开口，词汇记得慢，阅读有点吃力" : selected.remark },
    { label: "主要问题", value: selected.key === "c1" ? "词汇量少，单词记忆慢；阅读理解跟不上；需要先判断自然拼读和校内同步基础" : selected.last },
    { label: "亲子冲突", value: selected.key === "c1" ? "家长担心孩子三年级后英语拉开差距，希望先找到适合班型，不想盲目报长期课" : "需要先确认家长期望、孩子基础和可上课时间，避免直接推长期班" },
    { label: "用户目标", value: selected.key === "c1" ? "找回开口信心与背词方法；通过诊断试听确认班型；优先提升词汇和阅读基础" : selected.suggestion }
  ];
  const customerCourseOrders = (() => {
    const baseOrders = selected.key === "c1"
      ? [
          {
            key: "order-trial-c1",
            type: "体验课",
            product: "青少年同行者计划 · 4节体验课",
            amount: "¥398",
            status: "已支付",
            orderedAt: "2026-08-18 19:58:11",
            teacher: "韩冰老师",
            advisor: selected.owner,
            totalLessons: 4,
            completedLessons: 1,
            currentLesson: "第2节 · 家庭沟通观察",
            latestLessonAt: "2026-08-24 20:00",
            lessons: [
              { key: "trial-c1-1", index: 1, name: "第1节 · 问题梳理与家庭沟通评估", status: "已上课", planAt: "2026-08-23 20:00", finishedAt: "2026-08-23 20:52", duration: "52分钟" },
              { key: "trial-c1-2", index: 2, name: "第2节 · 孩子学习动力与情绪观察", status: "待上课", planAt: "2026-08-25 20:00", finishedAt: "—", duration: "—" },
              { key: "trial-c1-3", index: 3, name: "第3节 · 亲子沟通方式调整", status: "待上课", planAt: "2026-08-27 20:00", finishedAt: "—", duration: "—" },
              { key: "trial-c1-4", index: 4, name: "第4节 · 体验课复盘与方案建议", status: "待上课", planAt: "2026-08-29 20:00", finishedAt: "—", duration: "—" }
            ]
          },
          {
            key: "order-formal-c1",
            type: "正价课",
            product: "家庭教育陪跑营 · 12周系统课",
            amount: "¥4,980",
            status: "待支付",
            orderedAt: "2026-08-24 21:10:36",
            teacher: "课程中心待分配",
            advisor: selected.owner,
            totalLessons: 12,
            completedLessons: 0,
            currentLesson: "待确认班型",
            latestLessonAt: "—",
            lessons: [
              { key: "formal-c1-1", index: 1, name: "第1周 · 家庭关系评估与目标确认", status: "待排课", planAt: "—", finishedAt: "—", duration: "—" },
              { key: "formal-c1-2", index: 2, name: "第2周 · 孩子状态识别与沟通边界", status: "待排课", planAt: "—", finishedAt: "—", duration: "—" },
              { key: "formal-c1-3", index: 3, name: "第3周 · 学习动力重建策略", status: "待排课", planAt: "—", finishedAt: "—", duration: "—" }
            ]
          }
        ]
      : [];
    if (baseOrders.length) return baseOrders;
    return (selected.orders || []).map((order, index) => ({
      key: order.id || `order-${selected.key}-${index}`,
      type: order.amount === "免费试听" || order.product?.includes("试听") ? "体验课" : order.amount?.startsWith("¥") ? "正价课" : "其他",
      product: order.product || selected.order || "课程订单",
      amount: order.amount || "—",
      status: order.status?.includes("预约") ? "已预约" : order.status || "待确认",
      orderedAt: order.paidAt && order.paidAt !== "-" ? order.paidAt : selected.addedAt || "—",
      teacher: selected.key === "c3" ? "张老师" : "课程中心待分配",
      advisor: selected.owner,
      totalLessons: order.amount === "免费试听" || order.product?.includes("试听") ? 4 : 8,
      completedLessons: getSessionInsights(selected).watchMinutes > 0 ? 1 : 0,
      currentLesson: getSessionInsights(selected).watchMinutes > 0 ? "第2节 · 待跟进" : "第1节 · 待预约",
      latestLessonAt: getSessionInsights(selected).watchMinutes > 0 ? "2026-08-24 20:00" : "—",
      lessons: [
        { key: `${order.id || selected.key}-lesson-1`, index: 1, name: "第1节 · 课程体验与问题评估", status: getSessionInsights(selected).watchMinutes > 0 ? "已上课" : "待预约", planAt: selected.addedAt || "—", finishedAt: getSessionInsights(selected).watchMinutes > 0 ? "2026-08-24 20:00" : "—", duration: getSessionInsights(selected).watchMinutes > 0 ? `${getSessionInsights(selected).watchMinutes}分钟` : "—" },
        { key: `${order.id || selected.key}-lesson-2`, index: 2, name: "第2节 · 家庭沟通与学习状态复盘", status: "待上课", planAt: "待确认", finishedAt: "—", duration: "—" },
        { key: `${order.id || selected.key}-lesson-3`, index: 3, name: "第3节 · 个性化方案建议", status: "待上课", planAt: "待确认", finishedAt: "—", duration: "—" },
        { key: `${order.id || selected.key}-lesson-4`, index: 4, name: "第4节 · 体验总结与后续规划", status: "待上课", planAt: "待确认", finishedAt: "—", duration: "—" }
      ]
    }));
  })();
  const activeCourseOrder = customerCourseOrders.find((order) => order.key === selectedCourseOrderKey) || customerCourseOrders[0];
  const courseSummaryItems = activeCourseOrder
    ? [
        { key: "product", label: "课程名称", children: activeCourseOrder.product },
        { key: "type", label: "课程类型", children: activeCourseOrder.type },
        { key: "progress", label: "课节进度", children: `${activeCourseOrder.completedLessons}/${activeCourseOrder.totalLessons}` },
        { key: "current", label: "当前课节", children: activeCourseOrder.currentLesson },
        { key: "latest", label: "最近上课", children: activeCourseOrder.latestLessonAt },
        { key: "teacher", label: "负责老师", children: activeCourseOrder.teacher },
        { key: "advisor", label: "课程顾问", children: activeCourseOrder.advisor }
      ]
    : [];
  const conversationMetrics = {
    sent: Math.max(393, (selected.messages || []).filter((item) => item.from === "customer").length * 76 + selected.unread * 23),
    received: Math.max(351, (selected.messages || []).filter((item) => item.from === "ai").length * 88 + 175)
  };
  const selectedCustomerPhone = customerPhoneValues[selected.key] ?? selected.phone ?? "";
  const updateCustomerPhone = (value) => {
    setCustomerPhoneValues((items) => ({ ...items, [selected.key]: value }));
    setSelected((item) => (item?.key === selected.key ? { ...item, phone: value } : item));
  };
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
    {
      label: "电话",
      value: (
        <Input
          className="customer-phone-input"
          value={selectedCustomerPhone}
          allowClear
          placeholder="手动输入客户电话"
          onChange={(event) => updateCustomerPhone(event.target.value)}
        />
      )
    },
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
  const salesStrategyUpdatedAt = "2026-08-19 12:30:18";
  const salesStrategyRows = [
    { title: "孩子情况", text: selected.key === "c1" ? "三年级，英语不敢开口，单词记忆慢，阅读理解有压力；家长希望先通过 4 节体验课判断孩子是否能跟上，并确认是否需要长期系统训练。" : "女，19岁，现半休学在家，原就读港澳台联考班，因证件问题今年未报考，计划明年再考；与父亲、哥哥无沟通，和母亲共同生活；有严重洁癖，初中曾休学一年服药近两年，后考上高中。" },
    { title: "用户洞察", text: selected.key === "c1" ? "家长已经明确表达孩子问题和课程咨询意愿，关注点不是单纯价格，而是孩子是否适合、能否坚持、老师是否能给出清晰判断。当前适合用体验课结果建立信任，再引导确认后续方案。" : "家长长期处于焦虑和无力状态，表层诉求是改善亲子沟通，深层诉求是希望有人帮助判断孩子状态和家庭互动问题。当前阶段需要先承接情绪和事实，不适合直接推销。" },
    { title: "关键风险", text: selected.key === "c1" ? "如果过早强调报名优惠，容易让家长觉得销售导向过强；应先围绕孩子课堂表现、薄弱点和可执行改善路径沟通。" : "孩子存在明显情绪和行为风险，销售沟通中不能做诊断、不能承诺疗效，也不能持续追问敏感家庭冲突细节；必要时应提示人工销售介入。" },
    { title: "销售建议", text: selected.key === "c1" ? "下一轮建议先反馈孩子体验课观察结果，再给出 2 个可选路径：短期补弱巩固或系统班型规划。若家长追问价格，可说明班型需要结合孩子课堂表现确认，并邀请人工顾问进一步沟通。" : "先围绕母亲当前最痛的沟通僵局做承接，帮助其确认孩子长期状态、家庭互动模式和可执行的第一步干预方向。若用户主动问服务或方案，可引导人工介入，重点说明需要系统性评估与持续陪跑。" }
  ];
  const personalizedPrompt = selected.key === "c1"
    ? "该用户处于体验课转化阶段。会话智能体应先反馈孩子课堂观察和学习薄弱点，再自然引导家长确认后续班型；避免直接催单，避免承诺短期提分效果。若家长主动询问价格或名额，引导人工销售介入。"
    : "该用户情绪敏感且亲子冲突较高。会话智能体应先共情家长压力，围绕事实收集和可执行小步骤沟通；避免诊断、避免承诺疗效、避免连续追问孩子敏感行为。涉及方案和费用时转人工销售。";
  const defaultStrategyInsightText = [
    ...salesStrategyRows.map((row) => `${row.title}：${row.text}`),
    `提示词摘要：${personalizedPrompt}`
  ].join("\n\n");
  const strategyInsightText = strategyInsightDrafts[selected.key] || defaultStrategyInsightText;
  useEffect(() => {
    setStrategyInsightDraft(strategyInsightDrafts[selected?.key] || defaultStrategyInsightText);
  }, [selected?.key, defaultStrategyInsightText, strategyInsightDrafts]);
  const startEditStrategyInsight = () => {
    setStrategyInsightDraft(strategyInsightText);
    setStrategyInsightEditing(true);
  };
  const cancelEditStrategyInsight = () => {
    setStrategyInsightDraft(strategyInsightText);
    setStrategyInsightEditing(false);
  };
  const saveStrategyInsight = () => {
    setStrategyInsightDrafts((items) => ({ ...items, [selected.key]: strategyInsightDraft }));
    setStrategyInsightEditing(false);
    message.success("销售策略内容已保存");
  };
  const userChatMetrics = useMemo(() => {
    if (selected?.key === "c1") {
      return { sent: 23, received: 45 };
    }
    const customerMsgs = (selected?.messages || []).filter((item) => item.from === "customer").length;
    const aiMsgs = (selected?.messages || []).filter((item) => item.from !== "customer").length;
    return {
      sent: Math.max(15, customerMsgs * 3 + 12),
      received: Math.max(28, aiMsgs * 4 + 21)
    };
  }, [selected?.key, selected?.messages]);
  const trialLessons = useMemo(() => [
    {
      index: 1,
      title: "第1节 · 习惯测评与基础诊断",
      format: "录播",
      status: "已结束",
      attended: true,
      duration: "34min"
    },
    {
      index: 2,
      title: "第2节 · 核心考点与动力激发",
      format: "直播",
      status: "已结束",
      attended: true,
      duration: "42min"
    },
    {
      index: 3,
      title: "第3节 · 亲子沟通与个性规划",
      format: "直播",
      status: "已开始",
      attended: false,
      duration: "待上课"
    },
    {
      index: 4,
      title: "第4节 · 阶段成果与长线方案",
      format: "直播",
      status: "未开始",
      attended: false,
      duration: "待上课"
    }
  ], []);
  const trialLessonColumns = [
    {
      title: "课节名称",
      dataIndex: "title",
      key: "title",
      render: (title) => <span style={{ fontWeight: 500, color: "#1e293b" }}>{title}</span>
    },
    {
      title: "上课形式",
      dataIndex: "format",
      key: "format",
      width: 82,
      align: "center",
      render: (format) => <Tag color={format === "直播" ? "purple" : "cyan"}>{format}</Tag>
    },
    {
      title: "课程状态",
      dataIndex: "status",
      key: "status",
      width: 82,
      align: "center",
      render: (status) => (
        <Tag color={status === "已结束" ? "default" : status === "已开始" ? "processing" : "warning"}>
          {status}
        </Tag>
      )
    },
    {
      title: "是否到课",
      dataIndex: "attended",
      key: "attended",
      width: 82,
      align: "center",
      render: (attended) => (
        <span style={{ color: attended ? "#16a34a" : "#94a3b8", fontWeight: attended ? 500 : 400 }}>
          {attended ? "已到课" : "未到课"}
        </span>
      )
    },
    {
      title: "上课总时长",
      dataIndex: "duration",
      key: "duration",
      width: 96,
      align: "center",
      render: (duration, record) => (
        record.attended ? (
          <span style={{ fontWeight: 600, color: "#0f172a" }}>{duration}</span>
        ) : (
          <span style={{ color: "#faad14" }}>待上课</span>
        )
      )
    }
  ];
  const formatStageDate = (value) => {
    if (!value || ["—", "待确认", "未排课", "待进入", "当前进行中", "已进入后续阶段"].includes(value)) return "";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("MM.DD") : "";
  };
  const formatStageDateTime = (value) => {
    if (!value || ["—", "待确认", "未排课", "待上课"].includes(value)) return value || "—";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("MM-DD HH:mm") : value;
  };
  const getServiceStageTimeRange = (index) => {
    const baseTime = selected.addedAt ? dayjs(selected.addedAt) : dayjs("2026-08-23 23:06");
    const start = baseTime.add(index, "day");
    const end = baseTime.add(index + 1, "day");
    return {
      startAt: start.format("MM-DD HH:mm"),
      endAt: end.format("MM-DD HH:mm"),
      shortRange: `${start.format("MM.DD")}-${end.format("MM.DD")}`
    };
  };
  const getCourseStageAttendance = (stageName, index) => {
    const serviceTime = getServiceStageTimeRange(index);
    if (!stageName.includes("节课")) {
      return {
        type: "service",
        label: index < currentStageIndex ? "已完成" : index === currentStageIndex ? "当前阶段" : "未开始",
        icon: null,
        plannedAt: serviceTime.startAt,
        finishedAt: "—",
        stageStartAt: serviceTime.startAt,
        stageEndAt: serviceTime.endAt,
        courseStartAt: "—",
        courseEndAt: "—",
        attendanceAt: "—",
        timeRange: serviceTime.shortRange
      };
    }
    const lessonIndex = index - 1;
    const lesson = activeCourseOrder?.lessons?.[lessonIndex];
    const isAttended = lesson?.status === "已上课" || (lesson?.finishedAt && lesson.finishedAt !== "—");
    const isScheduled = !isAttended && lesson && !["待排课", "待预约"].includes(lesson.status) && lesson.planAt && !["—", "待确认"].includes(lesson.planAt);
    const plannedDate = formatStageDate(lesson?.planAt);
    const finishedDate = formatStageDate(lesson?.finishedAt);
    const fallbackRange = getServiceStageTimeRange(index).shortRange;
    const timeRange = plannedDate && finishedDate && plannedDate !== finishedDate
      ? `${plannedDate}-${finishedDate}`
      : plannedDate || finishedDate || fallbackRange;
    if (isAttended) {
      return {
        type: "attended",
        label: "已上课",
        icon: <CheckCircleOutlined />,
        plannedAt: lesson.planAt || "—",
        finishedAt: lesson.finishedAt || "—",
        stageStartAt: serviceTime.startAt,
        stageEndAt: serviceTime.endAt,
        courseStartAt: formatStageDateTime(lesson.planAt || "—"),
        courseEndAt: formatStageDateTime(lesson.finishedAt || "—"),
        attendanceAt: formatStageDateTime(lesson.finishedAt || "—"),
        timeRange
      };
    }
    if (isScheduled) {
      return {
        type: "scheduled",
        label: "已排课未上课",
        icon: <ClockCircleOutlined />,
        plannedAt: lesson.planAt || "—",
        finishedAt: "—",
        stageStartAt: serviceTime.startAt,
        stageEndAt: serviceTime.endAt,
        courseStartAt: formatStageDateTime(lesson.planAt || "—"),
        courseEndAt: "待上课",
        attendanceAt: "—",
        timeRange
      };
    }
    return {
      type: "not-attended",
      label: "未上课",
      icon: <MinusCircleOutlined />,
      plannedAt: lesson?.planAt || "未排课",
      finishedAt: "—",
      stageStartAt: serviceTime.startAt,
      stageEndAt: serviceTime.endAt,
      courseStartAt: formatStageDateTime(lesson?.planAt || "未排课"),
      courseEndAt: "—",
      attendanceAt: "—",
      timeRange: lesson?.planAt && lesson.planAt !== "待确认" ? timeRange : "待定"
    };
  };
  const renderStagePopoverContent = (stage) => (
    <div className="service-stage-popover">
      <div><Text type="secondary">流程阶段</Text><Text>{stage.currentName}</Text></div>
      <div><Text type="secondary">阶段进度</Text><Text>{stage.currentNumber}/{stage.total}</Text></div>
      <div><Text type="secondary">阶段开始</Text><Text>{stage.enteredAt}</Text></div>
      <div><Text type="secondary">阶段结束</Text><Text>{stage.nextAt}</Text></div>
      <div><Text type="secondary">课程开始</Text><Text>—</Text></div>
      <div><Text type="secondary">课程结束</Text><Text>—</Text></div>
      <div><Text type="secondary">到课时间</Text><Text>—</Text></div>
      <div><Text type="secondary">上课老师</Text><Text>{activeCourseOrder?.teacher || "课程中心待分配"}</Text></div>
    </div>
  );
  const renderCourseStagePopoverContent = (stageName, index, attendance) => (
    <div className="service-stage-popover">
      <div><Text type="secondary">流程阶段</Text><Text>{stageName}</Text></div>
      <div><Text type="secondary">阶段进度</Text><Text>{index + 1}/{customerServiceStages.length}</Text></div>
      <div><Text type="secondary">阶段开始</Text><Text>{attendance.stageStartAt}</Text></div>
      <div><Text type="secondary">阶段结束</Text><Text>{attendance.stageEndAt}</Text></div>
      <div><Text type="secondary">课程开始</Text><Text>{attendance.courseStartAt}</Text></div>
      <div><Text type="secondary">课程结束</Text><Text>{attendance.courseEndAt}</Text></div>
      <div><Text type="secondary">到课时间</Text><Text>{attendance.attendanceAt}</Text></div>
      <div><Text type="secondary">上课老师</Text><Text>{activeCourseOrder?.teacher || "课程中心待分配"}</Text></div>
    </div>
  );
  const renderSelectedStageTimeline = () => {
    const stage = getCustomerServiceStage(selected);
    return (
      <div className="chat-stage-timeline" aria-label={`当前阶段 ${stage.currentName} ${stage.currentNumber}/${stage.total}`}>
        {customerServiceStages.map((stageName, index) => {
          const attendance = getCourseStageAttendance(stageName, index);
          const stageClassName = index < stage.currentIndex
            ? "chat-stage-segment done"
            : index === stage.currentIndex
              ? "chat-stage-segment current"
              : "chat-stage-segment";
          return (
            <Popover key={stageName} trigger="hover" placement="bottomLeft" content={stageName.includes("节课") ? renderCourseStagePopoverContent(stageName, index, attendance) : renderStagePopoverContent(stage)}>
            <button
              type="button"
              className={`${stageClassName} attendance-${attendance.type}`}
              aria-label={`${stageName} ${attendance.label}`}
            >
              <span className="chat-stage-main">
                <span className="chat-stage-name">{stageName}</span>
                {attendance.icon ? <span className="chat-stage-attendance-icon">{attendance.icon}</span> : null}
              </span>
              <span className="chat-stage-time">{attendance.timeRange}</span>
            </button>
          </Popover>
          );
        })}
      </div>
    );
  };
  const renderConversationList = () => (
    <div className="session-conversation-column">
      <List
        className="conversation-list"
        dataSource={paginatedConversations}
        locale={{ emptyText: "当前企微暂无同步会话" }}
        renderItem={(item) => {
          const insights = getSessionInsights(item);
          const recentConversation = getRecentConversationInfo(item);
          const manualTakeover = !getHosted(item) || needsHumanIntervention(item);
          return (
            <List.Item className={selected.key === item.key ? "conversation-list-item active" : "conversation-list-item"} onClick={() => setSelected(item)}>
              <WecomAvatar item={item} />
              <div className="conversation-list-main">
                <div className="conversation-list-name-row">
                  <Text ellipsis>{item.name}</Text>
                  {item.type === "group" ? <Tag color="green">群</Tag> : null}
                  {insights.relationStatus === "已删除企微" ? <Tag color="red" className="system-status-tag">删</Tag> : null}
                </div>
                <Tooltip title={`${recentConversation.time} · ${recentConversation.text}`} placement="topLeft">
                  <div className="conversation-list-recent">
                    <Text type="secondary">{recentConversation.time}</Text>
                    <Text type="secondary" ellipsis>{recentConversation.text}</Text>
                  </div>
                </Tooltip>
              </div>
              {manualTakeover ? (
                <Tooltip title="人工接管：AI 已断开托管，需要员工关注" placement="left">
                  <span className="manual-takeover-icon" aria-label="人工接管">
                    <UserOutlined />
                  </span>
                </Tooltip>
              ) : <span className="manual-takeover-placeholder" />}
            </List.Item>
          );
        }}
      />
      <div className="conversation-list-pagination">
        <Pagination
          size="small"
          current={effectiveSessionPage}
          pageSize={sessionPageSize}
          total={filteredConversations.length}
          pageSizeOptions={["10", "20", "50"]}
          showSizeChanger
          onChange={(page, pageSize) => {
            setSessionPage(page);
            setSessionPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
  const renderMainChatPanel = () => {
    const insights = getSessionInsights(selected);
    const scheduleStatus = getScheduleStatus(insights);
    return (
      <section className="wecom-chat-panel">
        <div className="chat-header">
          <div className="chat-header-top">
            <div className="chat-header-user">
              <WecomAvatar item={selected} size={34} />
              <Title level={4}>{selected.name}</Title>
              <span className={scheduleStatus === "已排课" ? "chat-schedule-pill arranged" : "chat-schedule-pill"}>{scheduleStatus}</span>
            </div>
            <div className="chat-header-actions">
              <span className="hosting-switch-wrap">
                <Text className="hosting-label">托管给AI</Text>
                <Switch
                  size="small"
                  className="hosting-switch"
                  checked={hostingMode === "ai"}
                  checkedChildren="开"
                  unCheckedChildren="关"
                  onChange={confirmHostingChange}
                />
              </span>
              <Button icon={<CloudSyncOutlined />} onClick={() => message.success("客户资料已同步")}>同步资料</Button>
              <Button icon={<UserOutlined />} onClick={() => openCustomerDetail(selected, "profile")}>客户资料</Button>
            </div>
          </div>
          <div className="chat-header-stage-row">
            {renderSelectedStageTimeline()}
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
            key={`${selected.key}-main-manual`}
            value={manualReply}
            rows={4}
            placeholder="输入人工回复内容（可粘贴图片发送）"
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
      </section>
    );
  };
  return (
    <>
      <div className="wecom-workbench">
        {renderWecomAccountList()}
        <aside className="wecom-session-list">
          {renderSessionFilterPanel()}
          <div className="session-chat-layout">
            {renderConversationList()}
            {renderMainChatPanel()}
          </div>
        </aside>
      </div>
      <Drawer
        title="客户筛选"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        width={520}
        className="session-filter-drawer"
        extra={<Space><Button onClick={() => { setQuickFilter("全部"); setSessionFilters(defaultSessionFilters); }}>重置</Button><Button type="primary" onClick={() => setFilterDrawerOpen(false)}>完成</Button></Space>}
      >
        <div className="session-filter-summary">
          <Text>当前结果</Text>
          <Text className="session-filter-count">{filteredConversations.length} 个客户</Text>
        </div>
        <div className="session-filter-section">
          <div className="session-filter-section-title">客户标签</div>
          <Form layout="vertical">
            <Form.Item label="包含标签">
              <CommonTagSelectButton value={sessionFilters.tags} placeholder="选择需要查看的客户标签" onClick={() => openSessionTagPicker("tags")} onChange={(value) => setSessionFilters((item) => ({ ...item, tags: value }))} />
            </Form.Item>
            <Form.Item label="标签关系">
              <Radio.Group
                value={sessionFilters.tagMatch}
                options={["满足任一", "同时满足"].map((value) => ({ value, label: value }))}
                onChange={(event) => setSessionFilters((item) => ({ ...item, tagMatch: event.target.value }))}
              />
            </Form.Item>
            <Form.Item label="排除标签">
              <CommonTagSelectButton value={sessionFilters.excludeTags} placeholder="选择不希望出现在结果里的标签" onClick={() => openSessionTagPicker("excludeTags")} onChange={(value) => setSessionFilters((item) => ({ ...item, excludeTags: value }))} />
            </Form.Item>
          </Form>
        </div>
        <div className="session-filter-section">
          <div className="session-filter-section-title">补充状态</div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="意向等级">
                <Select value={sessionFilters.intent} options={["全部意向", "高意向", "中意向", "低意向"].map((value) => ({ value }))} onChange={(value) => setSessionFilters((item) => ({ ...item, intent: value }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="当前阶段">
                <Select value={sessionFilters.lifecycle} options={["全部阶段", ...Array.from(new Set(visibleConversations.map((item) => item.lifecycle).filter(Boolean)))].map((value) => ({ value }))} onChange={(value) => setSessionFilters((item) => ({ ...item, lifecycle: value }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="企微关系">
                <Select value={sessionFilters.relationStatus} options={["全部企微关系", "好友正常", "已删除企微", "群聊"].map((value) => ({ value }))} onChange={(value) => setSessionFilters((item) => ({ ...item, relationStatus: value }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="消息状态">
                <Select value={sessionFilters.unreadStatus} options={["全部消息状态", "有未读消息", "无未读消息"].map((value) => ({ value }))} onChange={(value) => setSessionFilters((item) => ({ ...item, unreadStatus: value }))} />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="session-filter-section">
          <div className="session-filter-section-title">课程与成交行为</div>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item label="课程状态">
                <Select value={sessionFilters.courseStatus} options={["全部课程状态", "待预约体验课", "已预约体验课", "已上体验课未报名", "待付款", "未报名", "待选择课程", "群运营"].map((value) => ({ value }))} onChange={(value) => setSessionFilters((item) => ({ ...item, courseStatus: value }))} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Drawer>
      <CommonTagPickerModal
        title={tagPickerState.title}
        open={tagPickerState.open}
        selected={tagPickerState.selected}
        keyword={tagPickerState.keyword}
        rule={tagPickerState.rule}
        ruleOptions={tagPickerState.field === "tags" ? ["以下标签满足其一", "以下标签同时满足"] : ["以下标签满足其一"]}
        tip="标签来自统一标签库，用于筛选需要查看和跟进的客户；带（AI）的标签表示由策略智能体判断写入。"
        onCancel={() => setTagPickerState((item) => ({ ...item, open: false }))}
        onOk={saveSessionTagPicker}
        onKeywordChange={(keyword) => setTagPickerState((item) => ({ ...item, keyword }))}
        onRuleChange={(rule) => setTagPickerState((item) => ({ ...item, rule }))}
        onSelectedChange={(selected) => setTagPickerState((item) => ({ ...item, selected }))}
      />
      <Drawer
        title={`${selected.name} · 客户详情`}
        open={customerDrawerOpen}
        onClose={() => setCustomerDrawerOpen(false)}
        width={720}
        className="customer-side-drawer"
        extra={
          <Space>
            <Text type="secondary">托管给AI</Text>
            <Switch
              size="small"
              checked={hostingMode === "ai"}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={confirmHostingChange}
            />
          </Space>
        }
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
                                      <span className={isAiGeneratedTag(tag.value) ? "customer-ai-tag-option" : undefined}>
                                        {getTagDisplayLabel(tag.value)}
                                      </span>
                                    )
                                  }))}
                                  placeholder={`选择${group.name}标签`}
                                  maxTagCount="responsive"
                                  allowClear
                                  tagRender={({ value, closable, onClose }) => {
                                    const isAiTag = isAiGeneratedTag(value);
                                    return (
                                      <Tag
                                        className={isAiTag ? "customer-selected-ai-tag" : "customer-selected-tag"}
                                        closable={closable}
                                        onClose={onClose}
                                        onMouseDown={(event) => event.preventDefault()}
                                      >
                                        {getTagDisplayLabel(value)}
                                      </Tag>
                                    );
                                  }}
                                  onChange={(value) => updateGroupedCustomerTags("customer", group.key, value)}
                                />
                              </div>
                            ))}
                          </div>
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
                  <div className="customer-course-tab">
                    <section className="customer-profile-section">
                      <div className="customer-section-head">
                        <Text>用户订单</Text>
                        <Text type="secondary">共 {customerCourseOrders.length} 个订单</Text>
                      </div>
                      <Table
                        className="customer-course-table customer-order-table"
                        size="small"
                        rowKey="key"
                        pagination={false}
                        dataSource={customerCourseOrders}
                        rowClassName={(record) => record.key === activeCourseOrder?.key ? "customer-order-row active" : "customer-order-row"}
                        onRow={(record) => ({
                          onClick: () => setSelectedCourseOrderKey(record.key)
                        })}
                        columns={[
                          { title: "类型", dataIndex: "type", width: 74, render: (value) => <Tag color={value === "正价课" ? "blue" : value === "体验课" ? "orange" : "default"}>{value}</Tag> },
                          { title: "商品", dataIndex: "product", ellipsis: true },
                          { title: "金额", dataIndex: "amount", width: 82 },
                          { title: "状态", dataIndex: "status", width: 88, render: (value) => <Tag color={value === "已支付" || value === "已预约" ? "success" : value === "待支付" ? "warning" : "default"}>{value}</Tag> },
                          { title: "下单时间", dataIndex: "orderedAt", width: 138 }
                        ]}
                      />
                    </section>
                    {activeCourseOrder ? (
                      <>
                        <section className="customer-profile-section">
                          <div className="customer-section-head">
                            <Text>当前订单课程概览</Text>
                            <Text type="secondary">{activeCourseOrder.completedLessons}/{activeCourseOrder.totalLessons} 节</Text>
                          </div>
                          <Descriptions className="customer-course-summary" size="small" column={2} bordered items={courseSummaryItems} />
                        </section>
                        <section className="customer-profile-section">
                          <div className="customer-section-head">
                            <Text>课节进度</Text>
                            <Text type="secondary">{activeCourseOrder.product}</Text>
                          </div>
                          <Table
                            className="customer-course-table customer-lesson-table"
                            size="small"
                            rowKey="key"
                            pagination={false}
                            dataSource={activeCourseOrder.lessons}
                            columns={[
                              { title: "#", dataIndex: "index", width: 44 },
                              { title: "课节名称", dataIndex: "name", ellipsis: true },
                              { title: "状态", dataIndex: "status", width: 84, render: (value) => <Tag color={value === "已上课" ? "success" : value === "待上课" ? "processing" : "default"}>{value}</Tag> },
                              { title: "计划上课", dataIndex: "planAt", width: 130 },
                              { title: "完成时间", dataIndex: "finishedAt", width: 130 },
                              { title: "看课时长", dataIndex: "duration", width: 82 }
                            ]}
                          />
                        </section>
                      </>
                    ) : (
                      <div className="empty-panel">暂无课程订单</div>
                    )}
                  </div>
                )
              },
              {
                key: "strategy",
                label: "销售策略",
                children: (
                  <div className="sales-strategy-panel">
                    {/* 1. 用户对话数据 */}
                    <section className="sales-strategy-section">
                      <div className="sales-strategy-section-title">用户对话数据</div>
                      <div className="customer-chat-stats-grid">
                        <div className="customer-chat-stat-card">
                          <span className="customer-chat-stat-label">用户发送</span>
                          <span className="customer-chat-stat-value">
                            <strong>{userChatMetrics.sent}</strong> 条
                          </span>
                        </div>
                        <div className="customer-chat-stat-card">
                          <span className="customer-chat-stat-label">用户接收</span>
                          <span className="customer-chat-stat-value">
                            <strong>{userChatMetrics.received}</strong> 条
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* 2. 用户上课信息 */}
                    <section className="sales-strategy-section">
                      <div className="sales-strategy-section-head">
                        <div className="sales-strategy-section-title">用户上课信息</div>
                        <span className="trial-lessons-total-tag">体验课共 4 节课</span>
                      </div>
                      <Table
                        className="trial-lessons-table"
                        rowKey="index"
                        columns={trialLessonColumns}
                        dataSource={trialLessons}
                        pagination={false}
                        size="small"
                        bordered
                        scroll={{ x: 440 }}
                      />
                    </section>

                    {/* 策略智能体输出结果 */}
                    <div className="sales-strategy-header">
                      <div>
                        <Text className="sales-strategy-title">策略智能体输出结果</Text>
                        <Text type="secondary" className="sales-strategy-meta">最近更新：{salesStrategyUpdatedAt} · 来源：体验课转化策略智能体</Text>
                      </div>
                    </div>
                    <section className="sales-strategy-section">
                      <div className="sales-strategy-section-head">
                        <div className="sales-strategy-section-title">用户洞察与销售建议</div>
                        {strategyInsightEditing ? (
                          <Space size={8}>
                            <Button size="small" onClick={cancelEditStrategyInsight}>取消</Button>
                            <Button size="small" type="primary" onClick={saveStrategyInsight}>保存</Button>
                          </Space>
                        ) : (
                          <Button size="small" icon={<EditOutlined />} onClick={startEditStrategyInsight}>编辑</Button>
                        )}
                      </div>
                      {strategyInsightEditing ? (
                        <Input.TextArea
                          value={strategyInsightDraft}
                          rows={12}
                          className="sales-strategy-editor"
                          onChange={(event) => setStrategyInsightDraft(event.target.value)}
                        />
                      ) : (
                        <Paragraph className="sales-strategy-content">{strategyInsightText}</Paragraph>
                      )}
                    </section>
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

export default ConversationsPage;
