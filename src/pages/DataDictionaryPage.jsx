import React, { useState } from "react";
import { Button, Card, Col, Row, Select, Space, Statistic, Table, Tabs, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { conversations } from "../data/conversations";
import { getTagDisplayLabel } from "../data/appData";

const { Paragraph, Text, Title } = Typography;

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

function DataDictionaryPage() {
  const [sampleUserKey, setSampleUserKey] = useState(conversations.find((item) => item.type === "single")?.key || conversations[0]?.key);
  const [sampleScene, setSampleScene] = useState("AI自动打标");
  const sampleUser = conversations.find((item) => item.key === sampleUserKey) || conversations.find((item) => item.type === "single") || conversations[0];
  const dataObjects = [
    { key: "profile", name: "用户", code: "profile", scope: "客户基础信息", fields: 8, variables: 6, owner: "销售 / 班主任", status: "启用", desc: "承载客户身份、阶段、来源、标签等稳定画像信息。" },
    { key: "conversation", name: "会话", code: "conversation", scope: "企微沟通记录", fields: 12, variables: 7, owner: "销售 / 市场", status: "启用", desc: "承载用户主动消息、AI回复、人工接管和最近沟通摘要。" },
    { key: "customer_file", name: "客户档案", code: "customer_file", scope: "企业客户档案", fields: 10, variables: 5, owner: "销售 / 班主任", status: "启用", desc: "承载孩子问题、家长诉求、服务记录和人工补充信息。" },
    { key: "course", name: "课程", code: "course", scope: "订单与上课数据", fields: 9, variables: 4, owner: "班主任 / 销售", status: "启用", desc: "承载课程阶段、排课、到课、老师和课后反馈数据。" },
    { key: "tag", name: "标签", code: "tag", scope: "统一标签库", fields: 7, variables: 4, owner: "运营 / 销售", status: "启用", desc: "承载正式标签、AI标签、标签组和标签规则版本。" }
  ];
  const fieldRows = [
    { key: "f1", object: "会话", name: "最近用户主动消息", code: "recent_user_messages", type: "列表文本", source: "企微会话", desc: "最近 N 条由用户主动发出的消息，按时间升序输出。", example: "孩子总是拖延作业；试听课几点开始？", status: "启用" },
    { key: "f2", object: "会话", name: "完整沟通记录", code: "full_messages", type: "列表文本", source: "企微会话", desc: "当前用户与 AI / 员工的完整可授权沟通内容。", example: "用户消息、AI回复、人工回复、时间", status: "启用" },
    { key: "f3", object: "用户", name: "当前服务阶段", code: "lifecycle_stage", type: "枚举", source: "角色流程", desc: "用户当前所处的业务服务阶段。", example: sampleUser?.lifecycle || "了解阶段", status: "启用" },
    { key: "f4", object: "客户档案", name: "核心诉求摘要", code: "need_summary", type: "长文本", source: "客户档案", desc: "人工或 AI 沉淀的用户问题、诉求、异议摘要。", example: "家长关注孩子学习动力和课程效果", status: "启用" },
    { key: "f5", object: "课程", name: "到课状态", code: "attendance_status", type: "枚举", source: "排课系统", desc: "当前课程是否已排课、是否已上课。", example: "已排课 / 已上课 / 未上课", status: "启用" },
    { key: "f6", object: "标签", name: "当前用户标签", code: "current_tags", type: "列表文本", source: "标签库", desc: "用户当前已生效的正式标签，包含人工和 AI 打标结果。", example: (sampleUser?.tags || []).join("、"), status: "启用" }
  ];
  const variableRows = [
    { key: "v1", name: "最近用户沟通内容", variable: "{{conversation.recent_user_messages}}", source: "会话 / 最近用户主动消息", scene: ["AI自动打标", "AI标签库生成"], permission: "销售、班主任", desc: "用于识别用户近期真实表达的需求、情绪和购买意向。", status: "启用" },
    { key: "v2", name: "完整会话上下文", variable: "{{conversation.full_messages}}", source: "会话 / 完整沟通记录", scene: ["AI标签库生成", "个性化提示词生成"], permission: "销售", desc: "用于分析连续沟通中的问题变化、异议和转化机会。", status: "启用" },
    { key: "v3", name: "客户档案摘要", variable: "{{customer_file.need_summary}}", source: "客户档案 / 核心诉求摘要", scene: ["AI自动打标", "个性化提示词生成"], permission: "销售、班主任", desc: "用于补充对话之外的客户背景，避免只看单轮消息。", status: "启用" },
    { key: "v4", name: "当前服务阶段", variable: "{{profile.lifecycle_stage}}", source: "用户 / 当前服务阶段", scene: ["AI自动打标", "策略洞察"], permission: "销售、市场、班主任", desc: "用于判断同一标签在不同服务阶段下的业务含义。", status: "启用" },
    { key: "v5", name: "当前用户标签", variable: "{{tag.current_tags}}", source: "标签 / 当前用户标签", scene: ["AI标签库生成", "AI自动打标"], permission: "销售、市场", desc: "用于和已有标签去重，避免重复生成或重复写入。", status: "启用" }
  ];
  const objectColumns = [
    { title: "数据对象", dataIndex: "name", width: 120, render: (value, record) => <Space direction="vertical" size={0}><Text>{value}</Text><Text type="secondary" className="data-code">{record.code}</Text></Space> },
    { title: "业务范围", dataIndex: "scope", width: 150 },
    { title: "字段数", dataIndex: "fields", width: 80, render: (value) => <Tag>{value}</Tag> },
    { title: "AI变量数", dataIndex: "variables", width: 96, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "使用角色", dataIndex: "owner", width: 160 },
    { title: "说明", dataIndex: "desc", ellipsis: true },
    { title: "状态", dataIndex: "status", width: 86, render: statusTag },
    { title: "操作", width: 120, fixed: "right", render: () => <Button type="link">配置字段</Button> }
  ];
  const fieldColumns = [
    { title: "所属对象", dataIndex: "object", width: 100, render: (value) => <Tag color="processing">{value}</Tag> },
    { title: "字段名称", dataIndex: "name", width: 150 },
    { title: "字段编码", dataIndex: "code", width: 190, render: (value) => <Text code>{value}</Text> },
    { title: "类型", dataIndex: "type", width: 100 },
    { title: "数据来源", dataIndex: "source", width: 120 },
    { title: "数据说明", dataIndex: "desc", width: 260 },
    { title: "示例值", dataIndex: "example", ellipsis: true },
    { title: "状态", dataIndex: "status", width: 86, render: statusTag }
  ];
  const variableColumns = [
    { title: "变量名称", dataIndex: "name", width: 150 },
    { title: "变量字符", dataIndex: "variable", width: 250, render: (value) => <Text code>{value}</Text> },
    { title: "数据来源", dataIndex: "source", width: 190 },
    { title: "可用场景", dataIndex: "scene", width: 230, render: (items) => <Space size={[4, 4]} wrap>{items.map((item) => <Tag key={item}>{item}</Tag>)}</Space> },
    { title: "权限角色", dataIndex: "permission", width: 160 },
    { title: "变量说明", dataIndex: "desc", ellipsis: true },
    { title: "状态", dataIndex: "status", width: 86, render: statusTag },
    { title: "操作", width: 96, fixed: "right", render: () => <Button type="link">编辑</Button> }
  ];
  const previewRows = [
    { key: "p1", label: "{{conversation.recent_user_messages}}", value: (sampleUser?.messages || []).filter((item) => item.from === "customer").map((item) => item.text).slice(-5).join("\n") || "暂无用户主动消息" },
    { key: "p2", label: "{{customer_file.need_summary}}", value: sampleUser?.remark || sampleUser?.reason || "暂无客户档案摘要" },
    { key: "p3", label: "{{profile.lifecycle_stage}}", value: sampleUser?.lifecycle || "-" },
    { key: "p4", label: "{{tag.current_tags}}", value: (sampleUser?.tags || []).map(getTagDisplayLabel).join("、") || "暂无标签" }
  ];
  const previewColumns = [
    { title: "变量", dataIndex: "label", width: 260, render: (value) => <Text code>{value}</Text> },
    { title: "解析结果", dataIndex: "value", render: (value) => <Paragraph className="variable-preview-text">{value}</Paragraph> }
  ];

  const tabItems = [
    {
      key: "objects",
      label: "数据对象",
      children: <Table className="admin-table" rowKey="key" columns={objectColumns} dataSource={dataObjects} pagination={false} scroll={{ x: 1080 }} />
    },
    {
      key: "fields",
      label: "字段字典",
      children: <Table className="admin-table" rowKey="key" columns={fieldColumns} dataSource={fieldRows} pagination={false} scroll={{ x: 1280 }} />
    },
    {
      key: "variables",
      label: "AI变量",
      children: <Table className="admin-table" rowKey="key" columns={variableColumns} dataSource={variableRows} pagination={false} scroll={{ x: 1320 }} />
    },
    {
      key: "test",
      label: "变量测试",
      children: (
        <Space direction="vertical" size={14} className="full-width">
          <div className="variable-test-toolbar">
            <Space wrap size={12}>
              <Select
                value={sampleUserKey}
                onChange={setSampleUserKey}
                className="variable-test-select"
                options={conversations.filter((item) => item.type === "single").map((item) => ({ value: item.key, label: `${item.name} / ${item.owner}` }))}
              />
              <Select
                value={sampleScene}
                onChange={setSampleScene}
                className="variable-scene-select"
                options={["AI自动打标", "AI标签库生成", "个性化提示词生成", "策略洞察"].map((value) => ({ value, label: value }))}
              />
              <Button type="primary">测试解析</Button>
            </Space>
            <Text type="secondary">用于确认 AI 在“{sampleScene}”任务执行前实际拿到的数据内容。</Text>
          </div>
          <Table className="admin-table variable-preview-table" rowKey="key" columns={previewColumns} dataSource={previewRows} pagination={false} />
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size={16} className="page-stack data-dictionary-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="data-overview-card">
            <Statistic title="数据对象" value={dataObjects.length} suffix="个" />
            <Text type="secondary">用户、会话、客户档案、课程、标签</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="data-overview-card">
            <Statistic title="字段字典" value={fieldRows.length} suffix="项" />
            <Text type="secondary">定义字段含义、类型、来源和示例</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="data-overview-card">
            <Statistic title="AI变量" value={variableRows.length} suffix="个" />
            <Text type="secondary">供 AI 标签、洞察、提示词任务复用</Text>
          </Card>
        </Col>
      </Row>
      <Card
        title={<PanelTitle title="数据字典 / 变量配置" desc="统一管理 AI 可用的数据对象、字段定义、变量字符和解析测试，后续 SaaS 化时按企业配置字段映射。" extra={<><Button>导入字段</Button><Button type="primary" icon={<PlusOutlined />}>新增变量</Button></>} />}
        className="data-dictionary-card"
      >
        <Tabs items={tabItems} />
      </Card>
    </Space>
  );
}

export default DataDictionaryPage;
