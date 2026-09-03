import React, { useState } from "react";
import { Button, Card, Col, Descriptions, Divider, Input, Row, Select, Space, Statistic, Table, Tabs, Tag, Typography } from "antd";
import { AlertOutlined, CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import { pendingMessages, proactivePlans } from "../data/appData";
import { PanelTitle, statusTag } from "../components/PageChrome";


const { Text, Title, Paragraph } = Typography;



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

export default SuggestionsPage;
