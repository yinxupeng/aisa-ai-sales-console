import React, { useEffect, useMemo, useState } from "react";
import {
  App,
  Avatar,
  Button,
  Card,
  Drawer,
  Empty,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography
} from "antd";
import {
  CommentOutlined,
  EyeOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  intentAnalysisSchedule,
  intentAnalysisUsers,
  followUpByLevel
} from "../data/intentAnalysisData";
import { defaultIntentConfig, getIntentScheduleLabel, getIntentScopeLabel, getIntentNextRun } from "./IntentAnalysisConfigPage";
import { describeIntentRule, evaluateIntentRules, filterIntentUsersByScope, migrateIntentRules, validateIntentRules } from "../data/intentRules";
import AnalysisGenerationRecordsPage from "./AnalysisGenerationRecordsPage";
import IntentConfigComparisonPage from "./IntentConfigComparisonPage";
import { IntentConfigViewPage } from "./CollaborationConfigViewPage";
import { GenerationScheduleStrip } from "../components/TaskConfigReadOnly";
import { intentGenerationRecords } from "../data/analysisGenerationRecords";
import { aiSkills, managedWecomAccounts } from "../data/appData";
import { buildIntentReportResult } from "../data/intentReportResult";

const { Title, Paragraph, Text } = Typography;
const intentStorageKey = "sales-ai-intent-analysis-config";
const validSavedConfig = (config) => config && !validateIntentRules(config.rules, { allowLegacy: true }) && Array.isArray(config.dailyTimes) && config.dailyTimes.length >= 1 && config.dailyTimes.length <= 2 && config.dailyTimes.every((time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time)) && Array.isArray(config.userStages) && config.userStages.length > 0;

function MetricTag({ children, color }) {
  return <Tag color={color}>{children}</Tag>;
}

function IntentDetailDrawer({ user, open, onClose, config }) {
  if (!user) return null;
  const { metrics } = user;
  return (
    <Drawer
      title={<Space><span>{user.name}的意向分析</span><Tag color={user.levelInfo.color}>{user.level < 0 ? user.levelInfo.label : `${user.level}档 · ${user.levelInfo.label}`}</Tag></Space>}
      width={560}
      open={open}
      onClose={onClose}
    >
      <div className="intent-detail-profile">
        <Avatar size={56} icon={<UserOutlined />} />
        <div><Title level={4}>{user.name}</Title><Text type="secondary">{user.relation} · 课程第{user.currentLesson}节 · {user.manager}负责</Text></div>
      </div>
      <Card size="small" title="当前判断" className="intent-detail-card">
        <div className="intent-level-highlight"><Tag color={user.levelInfo.color}>{user.level < 0 ? "待确认" : `${user.level}档`}</Tag><div><Text strong>{user.levelInfo.label}</Text><Paragraph type="secondary">{user.levelInfo.description}</Paragraph></div></div>
        <div className="intent-detail-conclusion">{user.followUp}</div>
      </Card>
      <Card size="small" title="到课分析" className="intent-detail-card">
        <div className="intent-detail-grid"><Text type="secondary">当前课程</Text><Text>{user.courseName} · 第{user.currentLesson}节</Text><Text type="secondary">到课天数</Text><Text>{metrics.attendanceDays}天</Text><Text type="secondary">连续到课</Text><Text>{metrics.consecutiveAttendanceDays}天</Text><Text type="secondary">累计观看</Text><Text>{metrics.totalWatchMinutes}分钟</Text><Text type="secondary">第三节后沟通</Text><Text>{metrics.chattedAfterLesson3 ? "是" : "否"}</Text></div>
      </Card>
      <Card size="small" title="聊天与意向信号" className="intent-detail-card">
        <div className="intent-detail-grid"><Text type="secondary">累计聊天</Text><Text>{metrics.chatCount}条</Text><Text type="secondary">病情相关词</Text><Text>{metrics.hasIllnessKeyword ? "已出现" : "未出现"}</Text><Text type="secondary">命中内容</Text><Text>{user.concern}</Text><Text type="secondary">是否询价</Text><Text>{metrics.askedPrice ? "已询价" : "未询价"}</Text><Text type="secondary">课后感受</Text><Text>{metrics.expressedAfterAllLessons ? "每节课后均有表达" : metrics.expressedAfterLessons123 ? "前1、2、3节课后有表达" : "暂未表达"}</Text></div>
      </Card>
      <Card size="small" title="分析说明" className="intent-detail-card"><Paragraph>分析时间：{user.analysisAt}</Paragraph><Paragraph type="secondary">执行配置：{getIntentScheduleLabel(config)}；分析范围：{getIntentScopeLabel(config)}。</Paragraph></Card>
    </Drawer>
  );
}

export default function IntentAnalysisPage({ onViewConversation = () => {}, embedded = false, visibleWecomKeys, reportSnapshot, onReportReady }) {
  const { message } = App.useApp();
  const [savedState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(intentStorageKey));
      if (!validSavedConfig(saved?.config) || !validSavedConfig(saved?.batch?.config) || typeof saved.batch.runAt !== "string") return null;
      if (saved.config.rules.length === 6) saved.config = { ...saved.config, rules: migrateIntentRules(saved.config.rules), ruleVersion: (saved.config.ruleVersion || 1) + 1 };
      return saved;
    } catch { return null; }
  });
  const [view, setView] = useState("results");
  const [analysisConfig, setAnalysisConfig] = useState(() => ({ ...defaultIntentConfig, ...(reportSnapshot?.batch.config || savedState?.config) }));
  const [analysisBatch] = useState(reportSnapshot?.batch || savedState?.batch || { config: defaultIntentConfig, runAt: intentAnalysisSchedule.lastRunAt });
  useEffect(() => {
    if (embedded) return;
    try { localStorage.setItem(intentStorageKey, JSON.stringify({ config: analysisConfig, batch: analysisBatch })); }
    catch { message.warning("本地存储不可用，配置仅在本次页面内保留"); }
  }, [analysisConfig, analysisBatch, embedded]);
  const [keyword, setKeyword] = useState("");
  const [level, setLevel] = useState("all");
  const [lesson, setLesson] = useState("all");
  const [manager, setManager] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const intentLevelDefinitions = analysisBatch.config.rules.map((rule) => ({ ...rule, description: describeIntentRule(rule) })).sort((a, b) => a.level - b.level);
  const resultUsers = useMemo(() => reportSnapshot?.users || filterIntentUsersByScope(intentAnalysisUsers, analysisBatch.config, managedWecomAccounts).filter((user) => !embedded || !visibleWecomKeys || visibleWecomKeys.includes(user.accountKey)).map((user) => {
    const result = evaluateIntentRules(user.metrics, analysisBatch.config.rules);
    const rule = analysisBatch.config.rules.find((item) => item.level === result.level);
    const rank = analysisBatch.config.rules.slice().sort((a, b) => a.level - b.level).findIndex((item) => item.level === result.level);
    const suggestionLevel = analysisBatch.config.rules.length === 6 ? result.level : rank === 0 ? 0 : rank + 6 - analysisBatch.config.rules.length;
    return { ...user, level: result.level ?? -1, analysisAt: analysisBatch.runAt, levelInfo: rule ? { ...rule, description: describeIntentRule(rule) } : { label: result.status === "pending" ? "待 AI 判断" : result.status === "missing" ? "待补充数据" : "未匹配", color: "warning", description: result.reason }, followUp: result.level === null ? (result.status === "pending" ? "等待 AI 按提示词完成判断，暂不按低意向处理。" : "补充关键数据或调整规则后重新分析，暂不按低意向处理。") : followUpByLevel[suggestionLevel] };
  }), [analysisBatch, embedded, visibleWecomKeys, reportSnapshot]);
  useEffect(() => {
    if (!onReportReady) return;
    const definition = { type: "intent", presentation: "intentAnalysis", intentConfig: analysisBatch.config };
    onReportReady({ definition, result: buildIntentReportResult(definition, visibleWecomKeys || managedWecomAccounts.map((item) => item.key), managedWecomAccounts, analysisBatch.runAt, resultUsers) });
  }, [analysisBatch, resultUsers, onReportReady, visibleWecomKeys]);
  const managers = Array.from(new Set(resultUsers.map((user) => user.manager)));
  const filteredUsers = useMemo(() => resultUsers.filter((user) => {
    const searchText = `${user.name} ${user.concern} ${user.courseName}`.toLowerCase();
    return (!keyword || searchText.includes(keyword.toLowerCase()))
      && (level === "all" || (level === "pending" ? user.level < 0 : user.level === Number(level)))
      && (lesson === "all" || user.currentLesson === Number(lesson))
      && (manager === "all" || user.manager === manager);
  }).sort((left, right) => right.level - left.level || right.recentChatAt.localeCompare(left.recentChatAt)), [resultUsers, keyword, level, lesson, manager]);
  const pageUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  const levelCounts = Object.fromEntries(intentLevelDefinitions.map((item) => [item.level, resultUsers.filter((user) => user.level === item.level).length]));
  const pendingCount = resultUsers.filter((user) => user.level < 0).length;
  const openUser = (user) => { setSelectedUser(user); setDrawerOpen(true); };
  const clearFilters = () => { setKeyword(""); setLevel("all"); setLesson("all"); setManager("all"); setPage(1); };

  const columns = [
    { title: "用户", dataIndex: "name", width: 180, render: (_, user) => <Space><Avatar icon={<UserOutlined />} /><div><Text strong>{user.name}</Text><div><Text type="secondary">{user.relation} · {user.manager}</Text></div></div></Space> },
    { title: "当前阶段", dataIndex: "currentLesson", width: 150, render: (value) => <Text>第{value}节课</Text> },
    { title: "意向档位", dataIndex: "level", width: 130, render: (value, user) => <Tag color={user.levelInfo.color}>{value < 0 ? user.levelInfo.label : `${value}档 · ${user.levelInfo.label}`}</Tag> },
    { title: "到课表现", key: "attendance", width: 180, render: (_, user) => <Space wrap><MetricTag color="cyan">到课{user.metrics.attendanceDays}天</MetricTag><MetricTag color="blue">观看{user.metrics.totalWatchMinutes}分钟</MetricTag></Space> },
    { title: "意向信号", key: "signals", width: 200, render: (_, user) => <Space wrap>{user.metrics.hasIllnessKeyword ? <MetricTag color="orange">病情词</MetricTag> : null}{user.metrics.askedPrice ? <MetricTag color="red">已询价</MetricTag> : null}{user.metrics.expressedAfterLessons123 ? <MetricTag color="purple">表达感受</MetricTag> : null}</Space> },
    { title: "AI建议的跟进策略和行动", key: "followUp", width: 300, render: (_, user) => <div className="intent-follow-up-cell"><Text>{user.followUp}</Text></div> },
    { title: "聊天", key: "chat", width: 100, render: (_, user) => <Text>{user.metrics.chatCount} 条</Text> },
    { title: "最近沟通", dataIndex: "recentChatAt", width: 145, render: (value) => <Text type="secondary">{value}</Text> },
    { title: "操作", key: "action", fixed: "right", width: 180, render: (_, user) => <Space direction="vertical" size={0}><Button type="link" icon={<EyeOutlined />} onClick={() => openUser(user)}>查看分析</Button><Button type="link" icon={<CommentOutlined />} onClick={() => onViewConversation(user)}>查看聊天</Button></Space> }
  ];

  if (view === "config") return <IntentConfigComparisonPage initialConfig={analysisConfig} onSave={setAnalysisConfig} onBack={() => setView("results")} />;
  if (view === "config-view") return <IntentConfigViewPage config={analysisConfig} onBack={() => setView("results")} />;
  if (view === "records") {
    const latestRecord = {
      ...intentGenerationRecords[0],
      id: `intent-batch-${analysisBatch.runAt}`,
      executedAt: analysisBatch.runAt,
      scheduleLabel: getIntentScheduleLabel(analysisBatch.config),
      scope: getIntentScopeLabel(analysisBatch.config),
      expectedUsers: resultUsers.length,
      successfulUsers: resultUsers.length - pendingCount,
      incompleteUsers: pendingCount,
      status: pendingCount ? "部分完成" : "已完成",
      summary: `本次分析 ${resultUsers.length} 名课程用户，成功分档 ${resultUsers.length - pendingCount} 人，待补充或未匹配 ${pendingCount} 人。${intentLevelDefinitions.slice().reverse().map((item) => `${item.level}档“${item.label}”${levelCounts[item.level]}人`).join("，")}。`,
      details: [
        { label: "规则版本", value: `v${analysisBatch.config.ruleVersion}` },
        { label: "历史聊天数", value: analysisBatch.config.historicalChatThreshold },
        { label: "当天聊天数", value: analysisBatch.config.todayChatThreshold },
        { label: "托管状态", value: analysisBatch.config.hostingStatus },
        { label: "意向度分析 Skill", value: aiSkills.find((item) => item.key === analysisBatch.config.analysisSkillKey)?.name || "未配置" },
        { label: "跟进策略与行动 Skill", value: aiSkills.find((item) => item.key === analysisBatch.config.followUpSkillKey)?.name || "未配置" },
        ...intentLevelDefinitions.slice().reverse().map((item) => ({ label: `${item.level}档 · ${item.label}`, value: describeIntentRule(item) }))
      ]
    };
    return <AnalysisGenerationRecordsPage type="intent" records={[latestRecord, ...intentGenerationRecords.filter((item) => item.executedAt < analysisBatch.runAt)]} onBack={() => setView("results")} />;
  }

  return (
    <div className="intent-analysis-page">
      <div className="intent-analysis-header"><div><Title level={3}>用户意向度分析</Title><Paragraph type="secondary">观心实验室 · 儿童心理健康医疗课程用户意向度分层与跟进建议</Paragraph></div>{!embedded ? <Space wrap>{analysisConfig.ruleVersion !== analysisBatch.config.ruleVersion ? <Tag color="gold">新规则待生效</Tag> : null}<Button icon={<SettingOutlined />} onClick={() => setView("config")}>分析配置（管理员）</Button><Button icon={<EyeOutlined />} onClick={() => setView("config-view")}>查看配置（普通员工）</Button><Button onClick={() => setView("records")}>查看记录</Button></Space> : null}</div>
      <GenerationScheduleStrip lastGeneratedAt={analysisBatch.runAt} nextGeneratedAt={getIntentNextRun(analysisConfig)} />
      <div className="intent-level-summary" style={{ "--intent-tier-count": intentLevelDefinitions.length }}>
        {intentLevelDefinitions.slice().reverse().map((item, index) => (
          <Card key={item.level} className={`intent-level-card intent-level-card-${index === intentLevelDefinitions.length - 1 ? 0 : 5 - index} ${index < 2 ? "intent-level-card-priority" : ""}`} bordered={false} onClick={() => { setLevel(String(item.level)); setPage(1); }}>
            <div className="intent-level-card-heading"><Tooltip title={`${item.level}档 · ${item.label}`}><Text className="intent-level-card-title">{item.level}档 · {item.label}</Text></Tooltip>{index < 2 ? <Tag color={index === 0 ? "red" : "purple"}>重点跟进</Tag> : null}</div>
            <div className="intent-level-card-metric"><Text strong>{levelCounts[item.level]}</Text><Text>人</Text></div>
            <Tooltip title={item.description}><Text type="secondary" className="intent-level-card-description">{item.description}</Text></Tooltip>
          </Card>
        ))}
      </div>
      {pendingCount ? <Button className="intent-rule-pending-button" onClick={() => { setLevel("pending"); setPage(1); }}>待补充数据 / 未匹配：{pendingCount}人，点击查看</Button> : null}
      <Card className="intent-filter-card" bordered={false}><Space wrap size={[8, 10]}><Input allowClear value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} placeholder="搜索用户、问题或课程" style={{ width: 230 }} /><Select value={level} onChange={(value) => { setLevel(value); setPage(1); }} options={[{ value: "all", label: "全部意向档位" }, ...intentLevelDefinitions.map((item) => ({ value: String(item.level), label: `${item.level}档 · ${item.label}` })), { value: "pending", label: "待补充数据 / 未匹配" }]} /><Select value={lesson} onChange={(value) => { setLesson(value); setPage(1); }} options={[{ value: "all", label: "全部课程节次" }, ...Array.from(new Set(resultUsers.map((user) => user.currentLesson))).sort().map((value) => ({ value: String(value), label: `第${value}节课` }))]} /><Select value={manager} onChange={(value) => { setManager(value); setPage(1); }} options={[{ value: "all", label: "全部负责人" }, ...managers.map((value) => ({ value, label: value }))]} /><Button onClick={clearFilters}>重置</Button></Space></Card>
      <Card className="intent-table-card" bordered={false} title={<Space><span>用户意向度列表</span><Text type="secondary">共 {filteredUsers.length} 人</Text></Space>}><Table rowKey="id" columns={columns} dataSource={pageUsers} pagination={false} scroll={{ x: 1250 }} locale={{ emptyText: <Empty description="暂无符合条件的用户" /> }} onRow={(user) => ({ onClick: () => openUser(user), className: "intent-table-row" })} /><div className="intent-pagination"><Pagination current={page} pageSize={pageSize} total={filteredUsers.length} showSizeChanger onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }} /></div></Card>
      <IntentDetailDrawer user={selectedUser} config={analysisBatch.config} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
