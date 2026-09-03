import React, { useState } from "react";
import { Button, Card, Col, Modal, Row, Space, Table, Tag, Typography } from "antd";
import {
  AlertOutlined,
  CommentOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  WechatOutlined
} from "@ant-design/icons";
import { conversations, lifecycleStages } from "../data/conversations";
import { PanelTitle } from "../components/PageChrome";


const { Text, Title } = Typography;


function DashboardPage({ setRoute, conversationsData = conversations }) {
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

export { DashboardPage as Dashboard };
export default DashboardPage;
