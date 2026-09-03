import React, { useState } from "react";
import {
  App as AntApp,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography
} from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { conversations } from "../data/conversations";
import { CommonTagPickerModal, CommonTagSelectButton } from "../components/CommonTagPicker";

const { Text, Paragraph, Title } = Typography;

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

function StrategyInsightPage({ onViewConversation }) {
  const { message } = AntApp.useApp();
  const insightRows = [
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
  const buildInsightUserRows = (insight, source) => {
    const seedCustomers = insight.customers || [];
    const targetCount = source.count || seedCustomers.length || insight.focus || 0;
    return Array.from({ length: targetCount }, (_, index) => {
      const sourceCustomer = seedCustomers[index % Math.max(seedCustomers.length, 1)] || {};
      const conversation = insightConversationPool.find((item) => item.key === sourceCustomer.key || item.name === sourceCustomer.name) || insightConversationPool[index % insightConversationPool.length];
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
  };
  const openInsightUserList = (source) => {
    if (!selectedInsight) return;
    setInsightUserList({
      title: source.title,
      count: source.count,
      rows: buildInsightUserRows(selectedInsight, source)
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
  return (
    <>
      <Space direction="vertical" size={16} className="page-stack strategy-insight-page">
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
      </Space>
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
              <Table size="small" className="admin-table" rowKey="key" columns={customerColumns} dataSource={buildInsightUserRows(selectedInsight, { key: "focus-table", title: "重点用户", count: selectedInsight.customers.length })} pagination={false} scroll={{ x: 1420 }} />
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
