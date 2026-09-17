import React, { useState } from "react";
import {
  Alert,
  App as AntApp,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography
} from "antd";
import {
  ArrowRightOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  FireOutlined,
  HistoryOutlined,
  LineChartOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  UserOutlined
} from "@ant-design/icons";
import { conversations } from "../data/conversations";
import {
  buildInsightUserRows,
  insightRows,
  strategyEvolutionRecords
} from "../data/strategyInsights";
import { CommonTagPickerModal, CommonTagSelectButton } from "../components/CommonTagPicker";
import { PanelTitle } from "../components/PageChrome";

const { Text, Paragraph, Title } = Typography;

function StrategyInsightPage({ onViewConversation }) {
  const { message, modal } = AntApp.useApp();
  const [activeMainTab, setActiveMainTab] = useState("evolution");
  const [evolutionRecords, setEvolutionRecords] = useState(strategyEvolutionRecords);
  const [selectedEvolution, setSelectedEvolution] = useState(null);
  const [evolutionDrawerOpen, setEvolutionDrawerOpen] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [evolutionKeyword, setEvolutionKeyword] = useState("");
  const [evolutionStageFilter, setEvolutionStageFilter] = useState("全部阶段");
  const [evolutionStatusFilter, setEvolutionStatusFilter] = useState("全部状态");

  const [selectedInsight, setSelectedInsight] = useState(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [insightUserList, setInsightUserList] = useState(null);
  const [insightGenerateModalOpen, setInsightGenerateModalOpen] = useState(false);
  const [insightTagPickerOpen, setInsightTagPickerOpen] = useState(false);
  const [insightTagKeyword, setInsightTagKeyword] = useState("");
  const [insightGenerateForm] = Form.useForm();
  const [insightAudienceTags, setInsightAudienceTags] = useState(["体验课用户", "体验后未报名"]);
  const statusColorMap = { 待处理: "warning", 处理中: "processing", 已处理: "success", 已跟进: "success", 待跟进: "warning" };
  const insightConversationPool = conversations.filter((item) => item.type === "single");

  const openEvolutionDetail = (record) => {
    setSelectedEvolution(record);
    setEditedPrompt(record.afterRule.promptSnippet);
    setIsEditingPrompt(false);
    setEvolutionDrawerOpen(true);
  };

  const handleApproveEvolution = (record) => {
    setEvolutionRecords((prev) =>
      prev.map((item) => (item.key === record.key ? { ...item, status: "已生效" } : item))
    );
    if (selectedEvolution?.key === record.key) {
      setSelectedEvolution((prev) => ({ ...prev, status: "已生效" }));
    }
    message.success(`已通过并增量热更新至【${record.agentName} · ${record.stage}】生效规则库`);
  };

  const handleRejectEvolution = (record) => {
    setEvolutionRecords((prev) =>
      prev.map((item) => (item.key === record.key ? { ...item, status: "已驳回" } : item))
    );
    if (selectedEvolution?.key === record.key) {
      setSelectedEvolution((prev) => ({ ...prev, status: "已驳回" }));
    }
    message.info("已驳回该策略优化建议");
  };

  const handleSaveEditedPrompt = () => {
    if (!selectedEvolution) return;
    setEvolutionRecords((prev) =>
      prev.map((item) =>
        item.key === selectedEvolution.key
          ? { ...item, afterRule: { ...item.afterRule, promptSnippet: editedPrompt } }
          : item
      )
    );
    setSelectedEvolution((prev) => ({
      ...prev,
      afterRule: { ...prev.afterRule, promptSnippet: editedPrompt }
    }));
    setIsEditingPrompt(false);
    message.success("策略 Prompt 规则已完成微调更新");
  };

  const handleTriggerEvolutionMining = () => {
    message.loading({ content: "正在调度后台分析近24小时 328 场真实会话与成败归因...", key: "mining", duration: 1.5 });
    setTimeout(() => {
      message.success({ content: "策略复盘分析完成！未发现新的高频掉单漏洞，当前策略体系稳定运行中", key: "mining" });
    }, 1500);
  };
  const insightGenerateInitialValues = {
    insightType: "用户洞察日报",
    audienceType: "当前服务用户",
    stageAudience: ["体验课转化阶段"],
    dataScope: ["用户沟通数据", "客户档案", "课程行为", "标签数据"],
    generateMode: "立即生成",
    outputContent: ["人群整体结论", "分层洞察", "重点用户清单", "销售建议"],
    insightGeneratePrompt: `你是一位资深青少年心理教育行业客户洞察专家。

请基于所选用户沟通数据、客户档案、课程行为和标签数据，生成用户洞察日报。

请完成以下分析：
1. 汇总当前人群的整体状态和主要变化
2. 识别需要重点关注的用户及原因
3. 将用户按相似问题、购买意向、风险状态进行分层
4. 给出每类人群的销售跟进建议
5. 输出重点用户清单，包括命中原因和建议动作

判断要求：
1. 不要基于单条对话做过度判断
2. 涉及风险、医疗边界、极端情绪时，只做风险提醒，不做诊断
3. 销售建议要可执行，避免空泛描述
4. 重点用户必须说明判断依据`,
    reviewMode: "生成后直接进入洞察列表"
  };
  const openInsightDetail = (record) => {
    setSelectedInsight(record);
    setDetailDrawerOpen(true);
  };
  const openInsightGenerateModal = () => {
    insightGenerateForm.setFieldsValue({
      ...insightGenerateInitialValues,
      audienceTags: insightAudienceTags
    });
    setInsightGenerateModalOpen(true);
  };
  const submitInsightGenerate = async () => {
    await insightGenerateForm.validateFields();
    setInsightGenerateModalOpen(false);
    message.success("已提交AI生成洞察任务，生成后进入洞察列表");
  };
  const openInsightUserList = (source) => {
    if (!selectedInsight) return;
    setInsightUserList({
      title: source.title,
      count: source.count,
      rows: buildInsightUserRows(selectedInsight, source, insightConversationPool)
    });
  };
  const openInsightCustomerChat = (record) => {
    setInsightUserList(null);
    setDetailDrawerOpen(false);
    if (record.conversationKey) {
      onViewConversation?.({ key: record.conversationKey, accountKey: record.accountKey });
    } else {
      message.info("该演示用户暂无同步会话");
    }
  };
  const columns = [
    { title: "洞察名称", dataIndex: "name", width: 210 },
    { title: "策略任务", dataIndex: "task", width: 160 },
    { title: "分析人群", dataIndex: "audience", width: 240 },
    { title: "覆盖人数", dataIndex: "total", width: 86, align: "center", render: (value) => `${value} 人` },
    { title: "重点人数", dataIndex: "focus", width: 86, align: "center", render: (value) => <Text type="danger">{value} 人</Text> },
    { title: "日报类型", dataIndex: "type", width: 120 },
    { title: "生成时间", dataIndex: "generatedAt", width: 140 },
    { title: "处理状态", dataIndex: "status", width: 90, render: (value) => <Tag color={statusColorMap[value] || "default"}>{value}</Tag> },
    {
      title: "操作",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size={4} className="table-action-group">
          <Button type="link" size="small" onClick={() => openInsightDetail(record)}>查看详情</Button>
          <Button type="link" size="small" onClick={() => message.success("已按重点用户生成跟进任务")}>创建跟进任务</Button>
        </Space>
      )
    }
  ];
  const customerColumns = [
    { title: "用户", dataIndex: "name", width: 86, render: (value, record) => <Button type="link" size="small" className="insight-user-name-link" onClick={() => openInsightCustomerChat(record)}>{value}</Button> },
    { title: "等级", dataIndex: "level", width: 62, render: (value) => <span className={`customer-level-pill level-${value}`}>{value}</span> },
    { title: "当前阶段", dataIndex: "lifecycle", width: 112 },
    { title: "关键标签", dataIndex: "tags", width: 220, render: (tags) => <Space wrap size={[4, 4]}>{tags.map((tag) => <Tag className={tag.includes("AI") ? "customer-selected-ai-tag" : "customer-selected-tag"} key={tag}>{tag}</Tag>)}</Space> },
    { title: "命中原因", dataIndex: "reason", width: 260 },
    { title: "建议动作", dataIndex: "action", width: 260 },
    { title: "负责人", dataIndex: "owner", width: 82 },
    { title: "处理状态", dataIndex: "status", width: 90, render: (value) => <Tag color={statusColorMap[value] || "default"}>{value}</Tag> },
    {
      title: "操作",
      fixed: "right",
      width: 88,
      render: (_, record) => (
        <Space size={4} className="table-action-group">
          <Button type="link" size="small" onClick={() => openInsightCustomerChat(record)}>查看会话</Button>
        </Space>
      )
    }
  ];
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
  const renderClickableCount = (source) => (
    <Button type="link" className="insight-clickable-count" onClick={() => openInsightUserList(source)}>
      {source.count}{source.suffix || "人"}
    </Button>
  );
  const filteredEvolutionRecords = evolutionRecords.filter((item) => {
    const matchKeyword =
      !evolutionKeyword ||
      item.name.includes(evolutionKeyword) ||
      item.agentName.includes(evolutionKeyword) ||
      item.summary.includes(evolutionKeyword);
    const matchStage = evolutionStageFilter === "全部阶段" || item.stage === evolutionStageFilter;
    const matchStatus = evolutionStatusFilter === "全部状态" || item.status === evolutionStatusFilter;
    return matchKeyword && matchStage && matchStatus;
  });

  const pendingEvolutionCount = evolutionRecords.filter((r) => r.status === "待审核").length;
  const approvedEvolutionCount = evolutionRecords.filter((r) => r.status === "已生效").length;

  const evolutionColumns = [
    {
      title: "策略提案名称",
      dataIndex: "name",
      width: 260,
      render: (value, record) => (
        <div>
          <Space size={6} style={{ marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>{value}</Text>
            <Tag color={record.category === "新增策略" ? "green" : record.category === "优化规则" ? "blue" : "orange"}>
              {record.category}
            </Tag>
          </Space>
          <div style={{ color: "#667085", fontSize: 12, lineHeight: 1.4 }}>
            {record.summary}
          </div>
        </div>
      )
    },
    {
      title: "归属智能体 & 阶段",
      dataIndex: "agentName",
      width: 200,
      render: (value, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{value}</div>
          <Tag color="cyan" style={{ marginTop: 4 }}>{record.stage}</Tag>
        </div>
      )
    },
    {
      title: "挖掘学习样本",
      dataIndex: "sampleCount",
      width: 170,
      render: (value, record) => (
        <div>
          <div><Text strong>{value}</Text> 场真实会话</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            <span style={{ color: "#52c41a" }}>成单 {record.winCount}</span> / <span style={{ color: "#ff4d4f" }}>掉单 {record.lossCount}</span>
          </div>
        </div>
      )
    },
    {
      title: "预估成单提升",
      dataIndex: "projectedLift",
      width: 120,
      align: "center",
      render: (value) => (
        <Tag color="success" style={{ fontWeight: 600, fontSize: 13, padding: "2px 8px" }}>
          {value}
        </Tag>
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (value) => {
        const color = value === "已生效" ? "success" : value === "待审核" ? "warning" : "default";
        return <Badge status={color} text={value} />;
      }
    },
    {
      title: "生成时间",
      dataIndex: "generatedAt",
      width: 140,
      render: (value) => <span style={{ color: "#8c8c8c", fontSize: 12 }}>{value}</span>
    },
    {
      title: "操作",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space size={6} className="table-action-group">
          <Button type="link" size="small" onClick={() => openEvolutionDetail(record)}>
            查看对比
          </Button>
          {record.status === "待审核" && (
            <>
              <Button
                type="link"
                size="small"
                style={{ color: "#52c41a" }}
                onClick={() => handleApproveEvolution(record)}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => handleRejectEvolution(record)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <Space direction="vertical" size={16} className="page-stack strategy-insight-page">
        <div className="strategy-top-tab-wrapper">
          <Segmented
            value={activeMainTab}
            onChange={setActiveMainTab}
            className="strategy-main-segmented"
            options={[
              {
                value: "evolution",
                label: (
                  <Space size={6} style={{ padding: "4px 8px" }}>
                    <ThunderboltOutlined style={{ color: "#fa8c16", fontSize: 15 }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>AI 策略进化审核</span>
                    {pendingEvolutionCount > 0 && (
                      <Badge count={pendingEvolutionCount} style={{ backgroundColor: "#ff4d4f", marginLeft: 4 }} />
                    )}
                  </Space>
                )
              },
              {
                value: "dailyReport",
                label: (
                  <Space size={6} style={{ padding: "4px 8px" }}>
                    <LineChartOutlined style={{ color: "#1677ff", fontSize: 15 }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>销售日报与数据洞察</span>
                  </Space>
                )
              }
            ]}
          />
        </div>

        {activeMainTab === "evolution" ? (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={12} lg={6}>
                <Card>
                  <Statistic
                    title="待审核策略建议"
                    value={pendingEvolutionCount}
                    suffix="条"
                    valueStyle={{ color: pendingEvolutionCount > 0 ? "#fa8c16" : "#3f8600", fontWeight: 700 }}
                    prefix={<ThunderboltOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} lg={6}>
                <Card>
                  <Statistic
                    title="累计挖掘进化策略"
                    value={evolutionRecords.length}
                    suffix="条"
                    valueStyle={{ fontWeight: 700 }}
                    prefix={<RobotOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} lg={6}>
                <Card>
                  <Statistic
                    title="综合成单胜率预估提升"
                    value={35}
                    precision={0}
                    prefix="+"
                    suffix="%"
                    valueStyle={{ color: "#52c41a", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} lg={6}>
                <Card>
                  <Statistic
                    title="已热更生效中"
                    value={approvedEvolutionCount}
                    suffix="条"
                    valueStyle={{ color: "#1677ff", fontWeight: 700 }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>
            <Card
              title={
                <PanelTitle
                  title="AI 策略进化建议清单"
                  desc="AI 销售系统每日全自动回溯真实成败会话，萃取销冠攻防话术并生成优化规则，经主管审核后一键增量热更至智能体生效。"
                  extra={
                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      onClick={handleTriggerEvolutionMining}
                    >
                      发起 AI 策略复盘挖掘
                    </Button>
                  }
                />
              }
            >
              <Space className="toolbar" wrap>
                <Input.Search
                  placeholder="搜索策略名称、智能体或摘要"
                  allowClear
                  value={evolutionKeyword}
                  onChange={(e) => setEvolutionKeyword(e.target.value)}
                  style={{ width: 260 }}
                />
                <Select
                  value={evolutionStageFilter}
                  onChange={setEvolutionStageFilter}
                  options={["全部阶段", "正价课转化阶段", "决策确认阶段", "体验课交付阶段", "破冰加微阶段"].map((v) => ({ value: v, label: v }))}
                  style={{ width: 150 }}
                />
                <Select
                  value={evolutionStatusFilter}
                  onChange={setEvolutionStatusFilter}
                  options={["全部状态", "待审核", "已生效", "已驳回"].map((v) => ({ value: v, label: v }))}
                  style={{ width: 120 }}
                />
                <Button
                  onClick={() => {
                    setEvolutionKeyword("");
                    setEvolutionStageFilter("全部阶段");
                    setEvolutionStatusFilter("全部状态");
                  }}
                >
                  重置
                </Button>
              </Space>
              <Table
                className="admin-table strategy-insight-table"
                rowKey="key"
                columns={evolutionColumns}
                dataSource={filteredEvolutionRecords}
                pagination={false}
                scroll={{ x: 1200 }}
              />
            </Card>
          </>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={12} lg={6}><Card><Statistic title="今日洞察" value={3} /></Card></Col>
              <Col xs={12} lg={6}><Card><Statistic title="覆盖用户" value={174} suffix="人" /></Card></Col>
              <Col xs={12} lg={6}><Card><Statistic title="重点用户" value={42} suffix="人" /></Card></Col>
              <Col xs={12} lg={6}><Card><Statistic title="待处理" value={2} /></Card></Col>
            </Row>
            <Card title={<PanelTitle title="洞察列表" desc="展示策略智能体每天面向当前服务用户生成的用户洞察日报。" extra={<Button type="primary" icon={<RobotOutlined />} onClick={openInsightGenerateModal}>AI生成洞察</Button>} />}>
              <Space className="toolbar" wrap>
                <Input.Search placeholder="搜索日报名称或分析人群" allowClear className="strategy-search-input" />
                <Select defaultValue="全部状态" options={["全部状态", "待处理", "处理中", "已处理"].map((value) => ({ value }))} />
                <Button type="primary">搜索</Button>
                <Button>重置</Button>
              </Space>
              <Table className="admin-table strategy-insight-table" rowKey="key" columns={columns} dataSource={insightRows} pagination={false} scroll={{ x: 1180 }} />
            </Card>
          </>
        )}
      </Space>

      <Drawer
        title={
          selectedEvolution ? (
            <Space size={8}>
              <ThunderboltOutlined style={{ color: "#fa8c16" }} />
              <span>策略自主进化详情：{selectedEvolution.name}</span>
            </Space>
          ) : "策略自主进化详情"
        }
        open={evolutionDrawerOpen}
        onClose={() => setEvolutionDrawerOpen(false)}
        width={1060}
        className="strategy-evolution-drawer"
        extra={
          selectedEvolution ? (
            <Space size={8}>
              <Badge
                status={selectedEvolution.status === "已生效" ? "success" : selectedEvolution.status === "待审核" ? "warning" : "default"}
                text={selectedEvolution.status}
              />
              {selectedEvolution.status === "待审核" && (
                <>
                  <Button danger onClick={() => handleRejectEvolution(selectedEvolution)}>驳回建议</Button>
                  <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    onClick={() => handleApproveEvolution(selectedEvolution)}
                  >
                    审核通过并热更新至智能体
                  </Button>
                </>
              )}
              {selectedEvolution.status === "已生效" && (
                <Tag color="success">已热更新至执行规则库</Tag>
              )}
              {selectedEvolution.status === "已驳回" && (
                <Tag color="default">已驳回</Tag>
              )}
            </Space>
          ) : null
        }
      >
        {selectedEvolution && (
          <div className="strategy-evolution-drawer-content">
            <Alert
              type="info"
              showIcon
              icon={<RobotOutlined />}
              message={
                <div style={{ lineHeight: 1.6 }}>
                  <b>AI 自主进化引擎洞察：</b>基于近 24 小时 <b>{selectedEvolution.sampleCount}</b> 场真实会话比对（成单组 <b>{selectedEvolution.winCount}</b> 场 vs 掉单组 <b>{selectedEvolution.lossCount}</b> 场），提炼出此策略。
                  审核通过后将即刻增量热更新至【<b>{selectedEvolution.agentName}</b> · <b>{selectedEvolution.stage}</b>】，自主销售机器人立即应用新话术。
                </div>
              }
              style={{ marginBottom: 16 }}
            />

            <div className="strategy-evolution-diff-section">
              <div className="insight-section-title" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><b>1. 策略规则与 Prompt 差异对比 (Before vs After)</b></span>
                <Tag color="orange" style={{ fontWeight: 600 }}>预估转化胜率提升 {selectedEvolution.projectedLift}</Tag>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    size="small"
                    className="strategy-diff-card before"
                    title={
                      <Space size={6}>
                        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                        <span style={{ color: "#cf1322", fontWeight: 600 }}>{selectedEvolution.beforeRule.title}</span>
                      </Space>
                    }
                  >
                    <div className="strategy-diff-diagnosis">
                      <Text type="secondary" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                        【掉单根因诊断】
                      </Text>
                      <div className="strategy-diagnosis-box loss">
                        {selectedEvolution.beforeRule.diagnosis}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                        【原执行 Prompt 规则】
                      </Text>
                      <pre className="strategy-prompt-pre before-pre">
                        {selectedEvolution.beforeRule.promptSnippet}
                      </pre>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    size="small"
                    className="strategy-diff-card after"
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space size={6}>
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          <span style={{ color: "#389e0d", fontWeight: 600 }}>{selectedEvolution.afterRule.title}</span>
                        </Space>
                        {!isEditingPrompt ? (
                          <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => setIsEditingPrompt(true)}
                          >
                            微调 Prompt
                          </Button>
                        ) : (
                          <Space size={4}>
                            <Button size="small" onClick={() => setIsEditingPrompt(false)}>取消</Button>
                            <Button type="primary" size="small" onClick={handleSaveEditedPrompt}>保存修改</Button>
                          </Space>
                        )}
                      </div>
                    }
                  >
                    <div className="strategy-diff-diagnosis">
                      <Text type="secondary" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                        【销冠打法突破亮点】
                      </Text>
                      <div className="strategy-diagnosis-box win">
                        {selectedEvolution.afterRule.highlights}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                        【建议热更新 Prompt 规则】
                      </Text>
                      {isEditingPrompt ? (
                        <Input.TextArea
                          rows={7}
                          value={editedPrompt}
                          onChange={(e) => setEditedPrompt(e.target.value)}
                          className="strategy-prompt-textarea"
                        />
                      ) : (
                        <pre className="strategy-prompt-pre after-pre">
                          {selectedEvolution.afterRule.promptSnippet}
                        </pre>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="strategy-evidence-section" style={{ marginTop: 20 }}>
              <div className="insight-section-title" style={{ marginBottom: 12 }}>
                <b>2. 真实会话归因佐证 (成败样本直观交锋)</b>
                <span style={{ color: "#8c8c8c", fontSize: 12, marginLeft: 8 }}>
                  （真实企微私聊留存记录，点击可联动至左侧完整会话流）
                </span>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    size="small"
                    className="strategy-case-box win"
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space size={6}>
                          <Tag color="success">成单组标杆</Tag>
                          <Text strong>{selectedEvolution.evidence.winCase.customer}</Text>
                        </Space>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => {
                            setEvolutionDrawerOpen(false);
                            onViewConversation?.({
                              key: selectedEvolution.evidence.winCase.conversationKey,
                              accountKey: selectedEvolution.evidence.winCase.accountKey
                            });
                          }}
                        >
                          查看原会话 &gt;
                        </Button>
                      </div>
                    }
                  >
                    <div className="strategy-case-desc win">
                      {selectedEvolution.evidence.winCase.description}
                    </div>
                    <div className="strategy-dialogue-flow">
                      {selectedEvolution.evidence.winCase.dialogue.map((msg, idx) => (
                        <div key={idx} className={`strategy-bubble-row ${msg.sender}`}>
                          <div className="strategy-bubble-sender">
                            {msg.sender === "ai" ? <Tag color="blue">销冠AI</Tag> : <Tag>客户</Tag>}
                          </div>
                          <div className={`strategy-bubble ${msg.sender}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    size="small"
                    className="strategy-case-box loss"
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space size={6}>
                          <Tag color="error">掉单组痛点</Tag>
                          <Text strong>{selectedEvolution.evidence.lossCase.customer}</Text>
                        </Space>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => {
                            setEvolutionDrawerOpen(false);
                            onViewConversation?.({
                              key: selectedEvolution.evidence.lossCase.conversationKey,
                              accountKey: selectedEvolution.evidence.lossCase.accountKey
                            });
                          }}
                        >
                          查看原会话 &gt;
                        </Button>
                      </div>
                    }
                  >
                    <div className="strategy-case-desc loss">
                      {selectedEvolution.evidence.lossCase.description}
                    </div>
                    <div className="strategy-dialogue-flow">
                      {selectedEvolution.evidence.lossCase.dialogue.map((msg, idx) => (
                        <div key={idx} className={`strategy-bubble-row ${msg.sender}`}>
                          <div className="strategy-bubble-sender">
                            {msg.sender === "ai" ? <Tag color="default">老版AI</Tag> : <Tag>客户</Tag>}
                          </div>
                          <div className={`strategy-bubble ${msg.sender}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Drawer>
      <Modal
        title="AI生成用户洞察日报"
        open={insightGenerateModalOpen}
        onCancel={() => setInsightGenerateModalOpen(false)}
        onOk={submitInsightGenerate}
        okText="生成洞察"
        cancelText="取消"
        width={760}
        className="insight-generate-modal"
      >
        <Form form={insightGenerateForm} layout="vertical" initialValues={insightGenerateInitialValues}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="洞察类型" name="insightType" rules={[{ required: true, message: "请选择洞察类型" }]}>
                <Select options={["用户洞察日报"].map((value) => ({ value }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="分析人群" name="audienceType" rules={[{ required: true, message: "请选择分析人群" }]}>
                <Select options={["当前服务用户", "指定标签人群", "指定阶段人群"].map((value) => ({ value }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="指定标签人群" name="audienceTags">
                <CommonTagSelectButton
                  value={insightAudienceTags}
                  placeholder="选择用于生成洞察的客户标签"
                  onClick={() => setInsightTagPickerOpen(true)}
                  onChange={(value) => {
                    setInsightAudienceTags(value);
                    insightGenerateForm.setFieldsValue({ audienceTags: value });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="指定阶段人群" name="stageAudience">
                <Select mode="multiple" options={["体验课转化阶段", "课前待激活", "课后未报名", "长期培育"].map((value) => ({ value }))} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="数据范围" name="dataScope">
            <Checkbox.Group options={["用户沟通数据", "客户档案", "课程行为", "标签数据"].map((value) => ({ label: value, value }))} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="生成时间" name="generateMode">
                <Radio.Group options={["立即生成", "定时生成"].map((value) => ({ label: value, value }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="定时生成时间" name="generateAt">
                <DatePicker showTime format="YYYY-MM-DD HH:mm" placeholder="选择生成时间" className="full-width" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="输出内容" name="outputContent">
            <Checkbox.Group options={["人群整体结论", "分层洞察", "重点用户清单", "销售建议"].map((value) => ({ label: value, value }))} />
          </Form.Item>
          <div className="insight-generate-logic">
            <Text className="insight-generate-logic-title">生成逻辑</Text>
            <Form.Item label="任务提示词" name="insightGeneratePrompt" rules={[{ required: true, message: "请输入任务提示词" }]}>
              <Input.TextArea rows={12} />
            </Form.Item>
          </div>
          <Form.Item label="审核方式" name="reviewMode">
            <Select options={["生成后直接进入洞察列表", "需人工确认后入库"].map((value) => ({ value }))} />
          </Form.Item>
        </Form>
      </Modal>
      <CommonTagPickerModal
        open={insightTagPickerOpen}
        title="选择指定标签人群"
        selected={insightAudienceTags}
        keyword={insightTagKeyword}
        onKeywordChange={setInsightTagKeyword}
        onSelectedChange={(value) => {
          setInsightAudienceTags(value);
          insightGenerateForm.setFieldsValue({ audienceTags: value });
        }}
        onOk={() => setInsightTagPickerOpen(false)}
        onCancel={() => setInsightTagPickerOpen(false)}
      />
      <Drawer
        title={selectedInsight?.name || "策略洞察详情"}
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        width={1080}
        className="strategy-insight-detail-drawer"
        extra={selectedInsight ? (
          <Space>
            <Tag color={statusColorMap[selectedInsight.status] || "default"}>{selectedInsight.status}</Tag>
            <Button onClick={() => message.success("已导出用户洞察日报")}>导出</Button>
          </Space>
        ) : null}
      >
        {selectedInsight ? (
          <div className="insight-detail-grid">
            <section className="insight-detail-section">
              <div className="insight-section-title">洞察摘要</div>
              <div className="insight-summary-grid">
                {[
                  { label: "策略任务", value: selectedInsight.task },
                  { label: "分析人群", value: selectedInsight.audience },
                  { label: "覆盖人数", source: { key: "summary-total", title: "覆盖用户", count: selectedInsight.total } },
                  { label: "重点人数", source: { key: "summary-focus", title: "重点用户", count: selectedInsight.focus } },
                  { label: "生成时间", value: selectedInsight.generatedAt },
                  { label: "输出来源", value: "策略洞察 / AI生成洞察" }
                ].map((item) => (
                  <div className="insight-summary-item" key={item.label}>
                    <Text type="secondary">{item.label}</Text>
                    {item.source ? renderClickableCount(item.source) : <Text>{item.value}</Text>}
                  </div>
                ))}
              </div>
            </section>
            <section className="insight-detail-section insight-conclusion">
              <div className="insight-section-title">人群整体结论</div>
              <Paragraph>{selectedInsight.conclusion}</Paragraph>
            </section>
            <section className="insight-detail-section">
              <div className="insight-section-title">人群分层</div>
              <div className="insight-segment-list">
                {selectedInsight.segments.map((segment) => (
                  <div className="insight-segment-card" key={segment.name}>
                    <div className="insight-segment-head">
                      <Tag color={segment.color}>{segment.name}</Tag>
                      <Space size={4}>
                        {renderClickableCount({ key: `segment-${segment.name}`, title: segment.name, count: segment.count, reason: segment.basis, action: segment.action })}
                        <Text type="secondary">/ {segment.percent}</Text>
                      </Space>
                    </div>
                    <Paragraph type="secondary">主要特征：{segment.feature}</Paragraph>
                    <Paragraph type="secondary">AI判断依据：{segment.basis}</Paragraph>
                    <Paragraph>建议动作：{segment.action}</Paragraph>
                    <Paragraph>建议承接方式：{segment.handoff}</Paragraph>
                  </div>
                ))}
              </div>
            </section>
            <section className="insight-detail-section insight-customer-section">
              <div className="insight-section-title">重点用户清单</div>
              <Table size="small" className="admin-table" rowKey="key" columns={customerColumns} dataSource={buildInsightUserRows(selectedInsight, { key: "focus-table", title: "重点用户", count: selectedInsight.customers.length }, insightConversationPool)} pagination={false} scroll={{ x: 1420 }} />
            </section>
          </div>
        ) : null}
      </Drawer>
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

export default StrategyInsightPage;
