import React, { useState, useEffect } from "react";
import {
  App as AntApp,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography
} from "antd";
import {
  CloudSyncOutlined,
  UserOutlined
} from "@ant-design/icons";
import { agents, salesAccounts } from "../data/appData";

const { Paragraph, Text, Title } = Typography;

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


export default SalesPage;
