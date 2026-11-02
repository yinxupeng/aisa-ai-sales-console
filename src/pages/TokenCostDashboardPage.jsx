import React, { useState } from "react";
import {
  Alert,
  App as AntApp,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Segmented,
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
  ArrowDownOutlined,
  ArrowUpOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  ReloadOutlined,
  RobotOutlined,
  RocketOutlined,
  SettingOutlined,
  TeamOutlined,
  ThunderboltOutlined
} from "@ant-design/icons";
import {
  tokenDailyHistory,
  tokenModelConfig,
  tokenScenarioBreakdown,
  topExpensiveTasks,
  wecomAccountTokenStats
} from "../data/tokenCostData";

const { Text, Paragraph, Title } = Typography;

export default function TokenCostDashboardPage() {
  const { message } = AntApp.useApp();
  const [timeRange, setTimeRange] = useState("yesterday");
  const [trendMetric, setTrendMetric] = useState("cost");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 根据筛选维度确定当前看板主体数据
  const currentSummary = timeRange === "today" ? tokenDailyHistory[0] : tokenDailyHistory[1];
  const isTodayView = timeRange === "today";

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      message.success("已同步火山方舟最新调用与计费数据！");
    }, 500);
  };

  const handleExport = () => {
    message.success("已导出 Token 消耗明细与财务对账单 (CSV)");
  };

  const handleSaveAlertConfig = () => {
    setIsAlertModalOpen(false);
    message.success("预算预警规则已保存生效！");
  };

  // Top 高耗任务表格列（去掉多余加粗，保持排版工整）
  const topTaskColumns = [
    {
      title: "任务 / 业务场景",
      dataIndex: "taskName",
      key: "taskName",
      width: 280,
      render: (text, record) => (
        <Space direction="vertical" size={2}>
          <Space>
            <Text style={{ color: "#1f2329" }}>{text}</Text>
            <Tag color="blue" style={{ fontSize: 11 }}>{record.module}</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.key}</Text>
        </Space>
      )
    },
    {
      title: "单次平均 Prompt 长度",
      dataIndex: "avgPromptLength",
      key: "avgPromptLength",
      width: 190,
      render: (val, record) => (
        <Space>
          <Text style={{ color: record.isPromptTooLong ? "#cf1322" : "#389e0d" }}>
            {val}
          </Text>
          {record.isPromptTooLong ? (
            <Tooltip title="Prompt 超过 40k tokens，存在历史会话未裁剪或全量知识库注入风险">
              <Tag color="error" icon={<ExclamationCircleOutlined />}>超长预警</Tag>
            </Tooltip>
          ) : (
            <Tag color="success">健康区间</Tag>
          )}
        </Space>
      )
    },
    {
      title: "日调用量",
      dataIndex: "dailyCalls",
      key: "dailyCalls",
      width: 120,
      render: (val) => `${val.toLocaleString()} 次`
    },
    {
      title: "日消耗 Token",
      dataIndex: "dailyTokens",
      key: "dailyTokens",
      width: 150
    },
    {
      title: "预估日费用",
      dataIndex: "dailyCost",
      key: "dailyCost",
      width: 120,
      sorter: (a, b) => a.dailyCost - b.dailyCost,
      defaultSortOrder: "descend",
      render: (val) => <Text style={{ color: "#cf1322" }}>¥{val.toFixed(2)}</Text>
    },
    {
      title: "缓存命中率",
      dataIndex: "cacheHitRate",
      key: "cacheHitRate",
      width: 110,
      render: (val) => <Tag color="cyan">{val}</Tag>
    },
    {
      title: "FinOps 降本优化建议",
      dataIndex: "optimizeTip",
      key: "optimizeTip",
      render: (tip, record) => (
        <div style={{ background: record.isPromptTooLong ? "#fff7f0" : "#f6ffed", padding: "6px 12px", borderRadius: 6, fontSize: 13, border: record.isPromptTooLong ? "1px solid #ffd591" : "1px solid #b7eb8f" }}>
          <Space align="start">
            <RocketOutlined style={{ color: record.isPromptTooLong ? "#fa541c" : "#52c41a", marginTop: 3 }} />
            <Text style={{ color: record.isPromptTooLong ? "#d4380d" : "#389e0d" }}>{tip}</Text>
          </Space>
        </div>
      )
    }
  ];

  // 企微账号排行表格列
  const wecomColumns = [
    {
      title: "销售企微账号",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (text, record) => (
        <Space>
          <TeamOutlined style={{ color: "#1890ff" }} />
          <div>
            <Text style={{ color: "#1f2329" }}>{text}</Text>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{record.department}</Text></div>
          </div>
        </Space>
      )
    },
    {
      title: "托管客户规模",
      dataIndex: "activeCustomers",
      key: "activeCustomers",
      width: 130,
      render: (val) => `${val} 人`
    },
    {
      title: "大模型调用次数",
      dataIndex: "dailyCalls",
      key: "dailyCalls",
      width: 150,
      render: (val) => `${val.toLocaleString()} 次`
    },
    {
      title: "总消耗 Token 数量",
      dataIndex: "dailyTokens",
      key: "dailyTokens",
      width: 180
    },
    {
      title: "全企微消耗占比",
      dataIndex: "percent",
      key: "percent",
      width: 180,
      render: (val) => (
        <div style={{ width: 140 }}>
          <Progress percent={val} size="small" strokeColor="#1890ff" format={(p) => `${p}%`} />
        </div>
      )
    },
    {
      title: "预估总费用",
      dataIndex: "cost",
      key: "cost",
      render: (val) => <Text style={{ color: "#cf1322" }}>¥{val.toFixed(2)}</Text>
    }
  ];

  // 历史明细表列
  const historyColumns = [
    {
      title: "统计日期",
      dataIndex: "date",
      key: "date",
      width: 190,
      render: (text, record) => (
        <Space>
          <Text style={{ color: "#1f2329" }}>{text}</Text>
          <Tag style={{ fontSize: 11 }}>{record.weekday}</Tag>
          {record.isToday && <Tag color="processing">今日进行中</Tag>}
          {record.isYesterday && <Tag color="success">已核算</Tag>}
        </Space>
      )
    },
    {
      title: "总调用次数",
      dataIndex: "totalCalls",
      key: "totalCalls",
      width: 130,
      render: (val) => `${val.toLocaleString()} 次`
    },
    {
      title: "调用场景分布",
      key: "breakdownCalls",
      width: 220,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          定时任务: {r.agentTaskCalls.toLocaleString()} 次 | 会话即时: {r.chatReplyCalls} 次
        </Text>
      )
    },
    {
      title: "输入 Token (Prompt)",
      dataIndex: "promptTokens",
      key: "promptTokens",
      width: 180,
      render: (val, r) => (
        <div>
          <div>{(val / 100000000).toFixed(2)} 亿</div>
          <Text type="secondary" style={{ fontSize: 11 }}>命中缓存: {(r.cachedTokens / 100000000).toFixed(2)} 亿</Text>
        </div>
      )
    },
    {
      title: "输出 Token (生成)",
      dataIndex: "completionTokens",
      key: "completionTokens",
      width: 140,
      render: (val) => `${(val / 10000).toFixed(1)} 万`
    },
    {
      title: "总消耗 Token",
      dataIndex: "totalTokens",
      key: "totalTokens",
      width: 150,
      render: (val) => <Text>{(val / 100000000).toFixed(2)} 亿</Text>
    },
    {
      title: "缓存节省金额",
      dataIndex: "savedByCache",
      key: "savedByCache",
      width: 130,
      render: (val) => <Text style={{ color: "#389e0d" }}>+¥{val.toFixed(2)}</Text>
    },
    {
      title: "最终结算费用",
      dataIndex: "cost",
      key: "cost",
      width: 130,
      render: (val) => <Text style={{ color: "#cf1322" }}>¥{val.toFixed(2)}</Text>
    }
  ];

  return (
    <div className="token-cost-page" style={{ padding: "0 2px" }}>
      <Space direction="vertical" size={16} orientation="vertical" style={{ display: "flex", width: "100%" }}>

        {/* 顶部控制栏与模型状态（上层模型信息，下层左侧时间筛选，右侧操作按钮） */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "14px 18px",
          background: "#ffffff",
          borderRadius: 8,
          border: "1px solid #edf1f7",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)"
        }}>
          {/* 上层：模型与计费口径说明 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <Space size={8} wrap style={{ alignItems: "center" }}>
              <Tag color="purple" style={{ margin: 0, padding: "2px 8px" }}>
                接入模型: {tokenModelConfig.modelName}
              </Tag>
              <Tag color="blue" style={{ margin: 0, padding: "2px 8px" }}>
                官方服务商: {tokenModelConfig.providerName}
              </Tag>
              <Text type="secondary" style={{ fontSize: 13, marginLeft: 6 }}>
                计费口径：未缓存输入 0.0008元/k · 缓存输入 0.00016元/k · 输出生成 0.002元/k
              </Text>
            </Space>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* 下层：左侧时间切换，右侧操作按钮 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <Segmented
              options={[
                { label: "今日实时", value: "today" },
                { label: "昨日结算", value: "yesterday" },
                { label: "近 10 天", value: "10days" },
                { label: "近 30 天", value: "30days" }
              ]}
              value={timeRange}
              onChange={setTimeRange}
            />

            <Space size={10} style={{ alignItems: "center" }}>
              <Button icon={<ReloadOutlined spin={isRefreshing} />} onClick={handleRefresh}>
                同步数据
              </Button>
              <Button icon={<InfoCircleOutlined />} onClick={() => setIsPricingModalOpen(true)}>
                计费单价
              </Button>
              <Button icon={<SettingOutlined />} onClick={() => setIsAlertModalOpen(true)}>
                告警限额
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
                导出对账单
              </Button>
            </Space>
          </div>
        </div>

        {/* 缓存高效运行提示条（文字正常粗细，清晰醒目） */}
        <Alert
          type="info"
          showIcon
          icon={<ThunderboltOutlined style={{ color: "#1890ff" }} />}
          message="火山方舟 Context 缓存策略生效中"
          description={`昨日系统命中缓存 Token 达 ${(currentSummary.cachedTokens / 100000000).toFixed(2)} 亿，Prompt 缓存命中率 ${currentSummary.cacheHitRate}%，直接为业务节约模型支出 ¥${currentSummary.savedByCache.toFixed(2)} 元 (相比未缓存标准价节省 48.5%)。`}
          action={<Tag color="green" style={{ margin: 0 }}>缓存运行良好</Tag>}
          style={{ borderRadius: 8, border: "1px solid #d4e8ff", background: "#f6faff" }}
        />

        {/* 4 大核心数据指标卡片（规整对齐，信息丰富完整） */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card tone-red">
              <div className="metric-tile">
                <div className="metric-card-head">
                  <Text type="secondary" className="metric-label">
                    <DollarOutlined style={{ color: "#cf1322" }} />
                    <span>预估总费用支出</span>
                  </Text>
                  <Tag color="red" style={{ margin: 0, fontSize: 11 }}>
                    {isTodayView ? "今日实时累计" : "昨日完整核算"}
                  </Tag>
                </div>
                <Title level={2} style={{ margin: "4px 0", color: "#cf1322", fontWeight: 600 }}>
                  ¥{currentSummary.cost.toFixed(2)}
                </Title>
                <div className="metric-foot" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    较前日环比 ↑ 8.4% (处于业务正常波动区间)
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, color: "#8c8c8c" }}>
                    未缓存输入: ¥{((currentSummary.promptTokens - currentSummary.cachedTokens) * 0.0008 / 1000).toFixed(2)} | 缓存输入: ¥{(currentSummary.cachedTokens * 0.00016 / 1000).toFixed(2)} | 输出: ¥{(currentSummary.completionTokens * 0.002 / 1000).toFixed(2)}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card tone-blue">
              <div className="metric-tile">
                <div className="metric-card-head">
                  <Text type="secondary" className="metric-label">
                    <LineChartOutlined style={{ color: "#1890ff" }} />
                    <span>总消耗 Token 数量</span>
                  </Text>
                  <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>吞吐正常</Tag>
                </div>
                <Title level={2} style={{ margin: "4px 0", color: "#1890ff", fontWeight: 600 }}>
                  {(currentSummary.totalTokens / 100000000).toFixed(2)} 亿
                </Title>
                <div className="metric-foot" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    输入 Prompt 占比 98.9% (其中已缓存 {(currentSummary.cachedTokens / 100000000).toFixed(2)} 亿)
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, color: "#8c8c8c" }}>
                    输入上下文: {(currentSummary.promptTokens / 100000000).toFixed(2)} 亿 Token | 输出生成: {(currentSummary.completionTokens / 10000).toFixed(1)} 万 Token
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card tone-purple">
              <div className="metric-tile">
                <div className="metric-card-head">
                  <Text type="secondary" className="metric-label">
                    <RobotOutlined style={{ color: "#722ed1" }} />
                    <span>大模型总调用次数</span>
                  </Text>
                  <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>成功率 99.8%</Tag>
                </div>
                <Title level={2} style={{ margin: "4px 0", color: "#722ed1", fontWeight: 600 }}>
                  {currentSummary.totalCalls.toLocaleString()} 次
                </Title>
                <div className="metric-foot" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    平均调用耗时 1.25 秒 / 次 | 接口健康
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, color: "#8c8c8c" }}>
                    SOP定时任务: {currentSummary.agentTaskCalls.toLocaleString()} 次 | 会话即时: {currentSummary.chatReplyCalls} 次 | 其他: {currentSummary.otherCalls} 次
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card tone-green">
              <div className="metric-tile">
                <div className="metric-card-head">
                  <Text type="secondary" className="metric-label">
                    <ThunderboltOutlined style={{ color: "#52c41a" }} />
                    <span>Prompt 缓存命中率</span>
                  </Text>
                  <Tag color="green" style={{ margin: 0, fontSize: 11 }}>
                    节省 ¥{currentSummary.savedByCache.toFixed(2)}
                  </Tag>
                </div>
                <Title level={2} style={{ margin: "4px 0", color: "#52c41a", fontWeight: 600 }}>
                  {currentSummary.cacheHitRate}%
                </Title>
                <div className="metric-foot" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    命中缓存享受 2 折计费 (0.00016 vs 0.0008元/k)
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, color: "#8c8c8c" }}>
                    单次平均调用成本 ¥{(currentSummary.cost / currentSummary.totalCalls).toFixed(4)} (合 ¥{((currentSummary.cost / currentSummary.totalCalls) * 1000).toFixed(2)} / 千次)
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 中间主要区域：近7天走势图与场景拆解（严格等高对齐，消除空白空洞） */}
        <Row gutter={[16, 16]} style={{ display: "flex", alignItems: "stretch" }}>
          {/* 左侧：近10天走势 */}
          <Col xs={24} xl={14} style={{ display: "flex" }}>
            <Card
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space>
                    <LineChartOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontSize: 15 }}>最近 10 天成本与消耗走势</span>
                  </Space>
                  <Segmented
                    size="small"
                    options={[
                      { label: "费用金额 (¥)", value: "cost" },
                      { label: "Token 吞吐量", value: "tokens" },
                      { label: "调用次数", value: "calls" }
                    ]}
                    value={trendMetric}
                    onChange={setTrendMetric}
                  />
                </div>
              }
              style={{ borderRadius: 8, width: "100%", display: "flex", flexDirection: "column" }}
              styles={{ body: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px 20px" } }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tokenDailyHistory.map((item) => {
                  const maxCost = Math.max(...tokenDailyHistory.map((d) => d.cost)) * 1.05;
                  const maxTokens = Math.max(...tokenDailyHistory.map((d) => d.totalTokens)) * 1.05;
                  const maxCalls = Math.max(...tokenDailyHistory.map((d) => d.totalCalls)) * 1.05;
                  let percent = 0;
                  let displayVal = "";

                  if (trendMetric === "cost") {
                    percent = Math.min(100, Math.round((item.cost / maxCost) * 100));
                    displayVal = `¥${item.cost.toFixed(2)}`;
                  } else if (trendMetric === "tokens") {
                    percent = Math.min(100, Math.round((item.totalTokens / maxTokens) * 100));
                    displayVal = `${(item.totalTokens / 100000000).toFixed(2)} 亿 Token`;
                  } else {
                    percent = Math.min(100, Math.round((item.totalCalls / maxCalls) * 100));
                    displayVal = `${item.totalCalls.toLocaleString()} 次`;
                  }

                  return (
                    <div
                      key={item.date}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12
                      }}
                    >
                      <div style={{ width: 115, fontSize: 13, color: "#1f2329" }}>
                        <span>{item.date.slice(5)}</span>{" "}
                        <Text type="secondary">({item.weekday})</Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Progress
                          percent={percent}
                          strokeColor={
                            trendMetric === "cost"
                              ? item.cost > 1300 ? "#cf1322" : "#1890ff"
                              : trendMetric === "tokens"
                                ? "#722ed1"
                                : "#13c2c2"
                          }
                          showInfo={false}
                          size={[undefined, 9]}
                        />
                      </div>
                      <div style={{ width: 130, textAlign: "right", fontSize: 13, color: "#1f2329" }}>
                        {displayVal}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #edf1f7", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#667085" }}>
                <span>10天累计支出: ¥{tokenDailyHistory.reduce((s, d) => s + d.cost, 0).toFixed(2)} 元</span>
                <span>日均 Token: {(tokenDailyHistory.reduce((s, d) => s + d.totalTokens, 0) / tokenDailyHistory.length / 100000000).toFixed(1)} 亿</span>
                <span>日均调用: {Math.round(tokenDailyHistory.reduce((s, d) => s + d.totalCalls, 0) / tokenDailyHistory.length).toLocaleString()} 次</span>
              </div>
            </Card>
          </Col>

          {/* 右侧：场景消耗拆解 */}
          <Col xs={24} xl={10} style={{ display: "flex" }}>
            <Card
              title={
                <Space>
                  <FireOutlined style={{ color: "#fa541c" }} />
                  <span style={{ fontSize: 15 }}>各业务场景消耗分布</span>
                </Space>
              }
              style={{ borderRadius: 8, width: "100%", display: "flex", flexDirection: "column" }}
              styles={{ body: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px 20px" } }}
            >
              <div>
                <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 14 }}>
                  拆解各业务模块对大模型的调用与费用占比，用于识别高消耗功能并制定优化方案：
                </Paragraph>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {tokenScenarioBreakdown.map((item) => (
                    <div key={item.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <Space size={6}>
                          <Badge color={item.color} />
                          <Text style={{ fontSize: 13, color: "#1f2329" }}>{item.scenario}</Text>
                        </Space>
                        <Space size={6}>
                          <Text style={{ color: "#cf1322" }}>¥{item.cost.toFixed(1)}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>({item.costPercent}%)</Text>
                        </Space>
                      </div>
                      <Progress percent={item.costPercent} strokeColor={item.color} showInfo={false} size={[undefined, 8]} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "#8c8c8c" }}>
                        <span>日调用 {item.callCount.toLocaleString()} 次</span>
                        <span>单次 Prompt 均长: {item.avgPromptTokens.toLocaleString()} tok</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14, background: "#f8fafd", border: "1px solid #e9eef6", padding: "10px 12px", borderRadius: 6, fontSize: 12, color: "#475467" }}>
                建议：定时任务与画像打标占据了 91% 的大模型费用，主要原因为会话上下文未截断。对这两类批量任务裁剪至近 15 轮会话，预计可实现 35% 的整体降本。
              </div>
            </Card>
          </Col>
        </Row>

        {/* 底部详细下钻表格标签页（全宽大卡片，内容充实，排版对齐） */}
        <Card style={{ borderRadius: 8 }} styles={{ body: { padding: "16px 20px" } }}>
          <Tabs
            defaultActiveKey="topTasks"
            items={[
              {
                key: "topTasks",
                label: (
                  <Space>
                    <RocketOutlined />
                    <span>Top 高耗任务与 Prompt 优化建议榜 (LLM FinOps)</span>
                    <Tag color="error" style={{ marginLeft: 4, fontSize: 11 }}>2 项超长预警</Tag>
                  </Space>
                ),
                children: (
                  <div>
                    <div style={{ marginBottom: 12, color: "#667085", fontSize: 13 }}>
                      监控单次 Prompt 超过 40k 的重型调用任务。输入上下文过长是费用偏高的主要原因，建议针对性实施提示词裁剪或向量切片召回：
                    </div>
                    <Table
                      size="middle"
                      columns={topTaskColumns}
                      dataSource={topExpensiveTasks}
                      pagination={false}
                      rowKey="key"
                    />
                  </div>
                )
              },
              {
                key: "wecomStats",
                label: (
                  <Space>
                    <TeamOutlined />
                    <span>各销售企微账号消耗明细排行 (Top 10)</span>
                  </Space>
                ),
                children: (
                  <div>
                    <div style={{ marginBottom: 12, color: "#667085", fontSize: 13 }}>
                      核算前 10 位真实销售企微名下客户交互与定时推进所产生的大模型 Token 及成本支出：
                    </div>
                    <Table
                      size="middle"
                      columns={wecomColumns}
                      dataSource={wecomAccountTokenStats}
                      pagination={false}
                      rowKey="key"
                    />
                  </div>
                )
              },
              {
                key: "dailyAudit",
                label: (
                  <Space>
                    <AuditOutlined />
                    <span>每日消耗核算历史与对账单</span>
                  </Space>
                ),
                children: (
                  <div>
                    <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ color: "#667085", fontSize: 13 }}>
                        按北京时间 (00:00 - 23:59:59) 核算的每日结算账单，支持按天核对输入、缓存、输出 Token 与实际结算费用：
                      </div>
                      <Button size="small" icon={<DownloadOutlined />} onClick={handleExport}>
                        导出对账单 (CSV)
                      </Button>
                    </div>
                    <Table
                      size="middle"
                      columns={historyColumns}
                      dataSource={tokenDailyHistory}
                      pagination={false}
                      rowKey="date"
                    />
                  </div>
                )
              }
            ]}
          />
        </Card>

      </Space>

      {/* 预算与告警限额配置弹窗 */}
      <Modal
        title="成本预算与告警阈值设置"
        open={isAlertModalOpen}
        onCancel={() => setIsAlertModalOpen(false)}
        onOk={handleSaveAlertConfig}
        okText="保存配置"
        cancelText="取消"
        width={540}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="单日费用告警预算 (元)" extra="当单日费用消耗超过此限额时，将自动通过企微机器人向技术与运营主管发送紧急预警">
            <InputNumber
              prefix="¥"
              defaultValue={tokenModelConfig.dailyBudgetLimit}
              min={100}
              max={100000}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Prompt 超长拦截熔断开关" extra="当单个任务 Prompt 超过 60,000 tokens 时，自动降级并裁剪历史会话，避免天价账单">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="告警通知 Webhook 机器人地址" extra="支持企业微信群机器人或飞书机器人">
            <Input defaultValue="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=prod-alarm-token-cost" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 模型计费规则说明弹窗 */}
      <Modal
        title="火山方舟 (豆包 2.0 Pro) 计费标准说明"
        open={isPricingModalOpen}
        onCancel={() => setIsPricingModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsPricingModalOpen(false)}>
            我知道了
          </Button>
        ]}
        width={560}
      >
        <div style={{ marginTop: 12 }}>
          <Paragraph>当前平台接入的模型为火山引擎官方：<strong>{tokenModelConfig.model}</strong></Paragraph>
          <Table
            size="small"
            pagination={false}
            columns={[
              { title: "计费项", dataIndex: "item" },
              { title: "刊例单价", dataIndex: "price" },
              { title: "计费说明", dataIndex: "desc" }
            ]}
            dataSource={[
              { key: "1", item: "未命中缓存输入 (Prompt)", price: "¥0.0008 / 千 Token", desc: "标准 Prompt 输入单价" },
              { key: "2", item: "命中缓存输入 (Cached Prompt)", price: "¥0.00016 / 千 Token", desc: "命中上下文缓存时享受 2 折优惠 (立省 80%)" },
              { key: "3", item: "模型生成输出 (Completion)", price: "¥0.0020 / 千 Token", desc: "含回复正文及思考链推理 Token" }
            ]}
          />
          <Paragraph style={{ marginTop: 16, fontSize: 13, color: "#8c8c8c" }}>
            * 费用计算公式：总费用 = (未命中 Prompt × 0.0008 + 缓存 Prompt × 0.00016 + 输出 Token × 0.002) ÷ 1000。
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
}
