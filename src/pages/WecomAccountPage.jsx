import React, { useState } from "react";
import { Alert, App as AntApp, Badge, Button, Card, Form, Input, Modal, Select, Space, Switch, Table, Tag, Typography } from "antd";
import { CloudSyncOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { getAiSeatUsage, getAiSeatView } from "../domain/aiSeats";
import { changeSeats, makeAccounts, selectedEnterpriseId, updateEnterpriseAccounts, usePlatformData } from "../shared/platformStore";
import { serviceStatus, statusLabels, todayString } from "../shared/platformDomain";
import { PanelTitle } from "../components/PageChrome";

const { Paragraph, Text, Title } = Typography;

function WecomAccountPage() {
  const { message, modal } = AntApp.useApp();
  const [botConfigOpen, setBotConfigOpen] = useState(false);
  const data = usePlatformData();
  const enterpriseId = selectedEnterpriseId();
  const company = data.enterprises.find((item) => item.id === enterpriseId);
  const salesRows = company?.accounts || [];
  const aiSalesSeatLicense = { productName: "智能销售 AI 席位", ...(company?.appliedLicense || {total:0, expiresAt:"", status:"draft"}) };
  const serviceAvailable = company && ["active", "expiring"].includes(serviceStatus(company.appliedLicense));
  const setSalesRows = (updater) => updateEnterpriseAccounts(enterpriseId, updater);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [aiSeatFilter, setAiSeatFilter] = useState("全部AI托管");
  const [personalDescriptionAccount, setPersonalDescriptionAccount] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("全部智能体");
  const [departmentFilter, setDepartmentFilter] = useState("全部部门");
  const [accountRoleFilter, setAccountRoleFilter] = useState("全部账号角色");
  const [botForm] = Form.useForm();
  const [personalDescriptionForm] = Form.useForm();
  const latestSyncAt = salesRows.find((item) => item.syncedAt && item.syncedAt !== "未同步")?.syncedAt || "未同步";
  const aiSeatUsage = getAiSeatUsage(salesRows, aiSalesSeatLicense);
  const visibleSalesRows = salesRows.filter((item) => {
    if (keyword && !`${item.name} ${item.wecom} ${item.wecomId} ${item.role}`.includes(keyword)) return false;
    if (roleFilter !== "全部智能体" && item.role !== roleFilter) return false;
    if (departmentFilter !== "全部部门" && item.department !== departmentFilter) return false;
    if (accountRoleFilter !== "全部账号角色" && item.accountRole !== accountRoleFilter) return false;
    const aiSeatView = getAiSeatView(item, aiSalesSeatLicense, todayString());
    if (aiSeatFilter === "已开启托管") return item.aiSeatEnabled;
    if (aiSeatFilter === "未开启托管") return !item.aiSeatEnabled;
    if (aiSeatFilter === "即将到期") return aiSeatView.status === "expiring";
    if (aiSeatFilter === "已过期") return aiSeatView.status === "expired";
    return true;
  });

  const handleSync = () => {
    setSyncing(true);
    const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
    window.setTimeout(() => {
      setSalesRows((items) => (items.length ? items : makeAccounts(enterpriseId, 12)).map((item) => ({ ...item, syncedAt: now })));
      setSyncing(false);
      message.success("已模拟从句子通道同步企微账号");
    }, 600);
  };

  const handleToggleAiSeat = (record, enabled) => {
    const actionText = enabled ? "分配" : "释放";
    modal.confirm({
      title: `确认${actionText}托管席位？`,
      content: enabled
        ? `将为 ${record.name} 分配 1 个席位。当前剩余 ${aiSeatUsage.remaining} 席；分配后可开启 AI。`
        : `将释放 ${record.name} 的 1 个席位并暂停 AI，保留历史记录。`,
      okText: actionText,
      cancelText: "取消",
      okButtonProps: { danger: !enabled, disabled: enabled && (aiSeatUsage.remaining <= 0 || !serviceAvailable) },
      onOk: () => {
        try {
          changeSeats(enterpriseId, [record.key], enabled);
          message.success(`已${actionText}托管席位`);
        } catch (error) {
          message.error(error.message);
        }
      }
    });
  };

  const handleBatchAiSeat = (enabled) => {
    const selectedRows = salesRows.filter((item) => selectedRowKeys.includes(item.key));
    const targetRows = selectedRows.filter((item) => item.aiSeatEnabled !== enabled);
    if (!targetRows.length) {
      message.info(enabled ? "所选账号已开通 AI 能力" : "所选账号均未开通 AI 能力");
      return;
    }
    if (enabled && targetRows.length > aiSeatUsage.remaining) {
      message.error(`当前仅剩 ${aiSeatUsage.remaining} 个 AI 席位，请减少选择账号`);
      return;
    }
    modal.confirm({
      title: enabled ? "批量开通 AI 能力" : "批量关闭 AI 能力",
      content: enabled
        ? `将为 ${targetRows.length} 个企微账号开通 AI 能力，占用 ${targetRows.length} 个席位。`
        : `将关闭 ${targetRows.length} 个企微账号的 AI 能力，并释放对应席位。`,
      okText: enabled ? "开通" : "关闭",
      cancelText: "取消",
      okButtonProps: { danger: !enabled },
      onOk: () => {
        try {
          changeSeats(enterpriseId, targetRows.map(row => row.key), enabled);
          setSelectedRowKeys([]);
          message.success(enabled ? "已批量分配托管席位" : "已批量释放托管席位");
        } catch (error) { message.error(error.message); }
      }
    });
  };

  const handleInlineAccountChange = (record, field, value) => {
    setSalesRows((items) => items.map((item) => (item.key === record.key ? { ...item, [field]: value } : item)));
    message.success("已更新");
  };

  const openPersonalDescription = (record) => {
    setPersonalDescriptionAccount(record);
    personalDescriptionForm.setFieldsValue({
      dedicatedInfo: record.dedicatedInfo || ""
    });
  };

  const handleSavePersonalDescription = () => {
    personalDescriptionForm.validateFields().then((values) => {
      setSalesRows((items) =>
        items.map((item) => (item.key === personalDescriptionAccount?.key ? { ...item, ...values } : item))
      );
      setPersonalDescriptionAccount(null);
      message.success("已保存个性化描述");
    });
  };

  const columns = [
    { title: "员工 / 企微账号", dataIndex: "name", width: 210, render: (_, record) => <div><Text strong>{record.name}</Text><br /><Text type="secondary">{record.wecom} / {record.wecomId}</Text></div> },
    { title: "所属部门", dataIndex: "department", width: 108 },
    { title: "账号角色", dataIndex: "accountRole", width: 96, render: (v) => <Tag color={v === "管理者" ? "processing" : "default"}>{v}</Tag> },
    {
      title: "智能体",
      dataIndex: "role",
      width: 112,
      render: (value, record) => (
        <Select
          className="compact-table-select"
          value={value || "销售"}
          options={["销售", "班主任", "市场"].map((item) => ({ value: item, label: item }))}
          onChange={(nextValue) => handleInlineAccountChange(record, "role", nextValue)}
        />
      )
    },
    {
      title: "登录账号",
      dataIndex: "assignedUser",
      width: 148,
      render: (value, record) => (
        <Select
          className="compact-table-select"
          value={value || "未配置"}
          options={[
            { value: "", label: "未配置" },
            { value: "admin (admin)", label: "admin (admin)" },
            { value: "李老师 (li_sales)", label: "李老师 (li_sales)" },
            { value: "陈老师 (chen_sales)", label: "陈老师 (chen_sales)" }
          ]}
          onChange={(nextValue) => handleInlineAccountChange(record, "assignedUser", nextValue)}
        />
      )
    },
    {
      title: "托管席位",
      dataIndex: "aiSeatEnabled",
      width: 95,
      render: (_, record) => {
        return (
          <Switch
            size="small"
            checked={record.aiSeatEnabled}
            checkedChildren="已分配"
            unCheckedChildren="未分配"
            disabled={!record.aiSeatEnabled && (!serviceAvailable || aiSeatUsage.remaining <= 0)}
            onChange={(checked) => handleToggleAiSeat(record, checked)}
          />
        );
      }
    },
    {
      title: "AI 运行", width: 90,
      render: (_, record) => <Switch size="small" checked={Boolean(record.hosted && record.aiSeatEnabled && serviceAvailable)} disabled={!record.aiSeatEnabled || !serviceAvailable} checkedChildren="运行" unCheckedChildren="暂停" onChange={(value) => handleInlineAccountChange(record, "hosted", value)} />
    },
    {
      title: "AI到期时间",
      dataIndex: "aiSeatOpenedAt",
      width: 112,
      render: (_, record) => {
        const aiSeatView = getAiSeatView(record, aiSalesSeatLicense, todayString());
        return aiSeatView.expiresAt ? <Text>{aiSeatView.expiresAt}</Text> : <Text type="secondary">-</Text>;
      }
    },
    { title: "客户总数", dataIndex: "customerTotal", width: 82 },
    { title: "托管客户数", dataIndex: "hostedCustomers", width: 92 },
    { title: "在线状态", dataIndex: "online", width: 90, render: (v) => <Tag color={v ? "success" : "default"}>{v ? "在线" : "离线"}</Tag> },
    { title: "句子通道", dataIndex: "channel", width: 96, render: (v) => {
      const connected = v.includes("已连接");
      return <Tag color={connected ? "success" : "warning"}>{connected ? "已连接" : "未连接"}</Tag>;
    } },
    {
      title: "操作",
      fixed: "right",
      width: 90,
      render: (_, record) => (
        <Space size={0} wrap={false}>
          <Button type="link" onClick={() => openPersonalDescription(record)}>个性化描述</Button>
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card className="ai-seat-card">
        <div className="ai-seat-overview">
          <div>
            <Space size={10} align="center">
              <SafetyCertificateOutlined className="ai-seat-icon" />
              <Title level={4}>{aiSalesSeatLicense.productName}</Title>
              <Tag color={serviceAvailable ? "processing" : "warning"}>{company ? statusLabels[serviceStatus(company.appliedLicense)] : "未授权"}</Tag>
            </Space>
            <Paragraph type="secondary">
              管理企业同步到平台的企微账号，并为需要 AI 销售能力的账号分配席位和配置 AI 使用方式。
            </Paragraph>
          </div>
          <div className="ai-seat-metrics">
            <div><Text type="secondary">授权席位</Text><strong>{aiSeatUsage.total}</strong></div>
            <div><Text type="secondary">已分配</Text><strong>{aiSeatUsage.enabled}</strong></div>
            <div><Text type="secondary">剩余</Text><strong>{aiSeatUsage.remaining}</strong></div>
            <div><Text type="secondary">到期时间</Text><strong>{aiSalesSeatLicense.expiresAt}</strong></div>
          </div>
        </div>
        <Alert type={!serviceAvailable || aiSeatUsage.remaining <= 0 ? "warning" : "info"} showIcon title={!serviceAvailable ? "当前服务尚未生效、已停用或已到期，请联系平台处理授权。可继续查看或释放席位。" : aiSeatUsage.remaining <= 0 ? "托管席位已用完，请联系平台扩容；也可以释放不再使用的席位。" : `已同步 ${salesRows.length} 个企微账号。分配席位后可开启 AI；暂停 AI 或账号离线不会释放席位。`} />
        {company && company.revision !== company.appliedRevision && <Alert style={{marginTop:10}} type="warning" showIcon title="平台授权有更新，等待同步；当前仍使用原有额度。" />}
      </Card>

      <Card title={<PanelTitle title="企微账号管理" desc="为企微账号分配托管席位和负责人，按需开启或暂停 AI。" extra={<>
        <Button onClick={() => setBotConfigOpen(true)}>通知 Bot</Button>
        <Button className="sync-action" icon={<CloudSyncOutlined />} loading={syncing} onClick={handleSync}>模拟同步企微</Button>
        <Button icon={<UserOutlined />} loading={syncing} onClick={handleSync}>同步客户</Button>
      </>} />}>
        <div className="sync-status">
          <Badge status={syncing ? "processing" : "success"} />
          <Text type="secondary">{syncing ? "正在从句子通道同步企微账号和客户数据" : `最近同步 ${latestSyncAt}，已同步 ${salesRows.length} 个企微账号`}</Text>
        </div>
        <Space className="toolbar" wrap>
          <Select value={roleFilter} onChange={setRoleFilter} options={["全部智能体", "销售", "班主任", "市场"].map((value) => ({ value }))} />
          <Select value={departmentFilter} onChange={setDepartmentFilter} options={["全部部门", ...new Set(salesRows.map(row => row.department))].map((value) => ({ value }))} />
          <Select value={accountRoleFilter} onChange={setAccountRoleFilter} options={["全部账号角色", "普通员工", "管理者"].map((value) => ({ value }))} />
          <Select value={aiSeatFilter} options={["全部AI托管", "已开启托管", "未开启托管", "即将到期", "已过期"].map((value) => ({ value }))} onChange={setAiSeatFilter} />
          <Input.Search placeholder="搜索员工、角色、企微账号或企微ID" allowClear value={keyword} onChange={event=>setKeyword(event.target.value)} />
          <Button disabled={!selectedRowKeys.length || aiSeatUsage.remaining <= 0 || !serviceAvailable} onClick={() => handleBatchAiSeat(true)}>批量开通AI</Button>
          <Button disabled={!selectedRowKeys.length} danger onClick={() => handleBatchAiSeat(false)}>批量关闭AI</Button>
        </Space>
        <Table
          className="admin-table compact-admin-table"
          rowKey="key"
          columns={columns}
          dataSource={visibleSalesRows}
          pagination={false}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal title="通知 Bot 配置" open={botConfigOpen} onCancel={() => setBotConfigOpen(false)} onOk={() => { setBotConfigOpen(false); message.success("已保存通知 Bot 配置"); }} okText="保存" cancelText="取消" width={760}>
        <Form form={botForm} layout="vertical" initialValues={{ webhookUrl: "" }}>
          <Form.Item label="通知 Bot Webhook 地址" name="webhookUrl">
            <Input placeholder="企微机器人 Webhook 地址，留空则关闭通知" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="个性化描述" open={Boolean(personalDescriptionAccount)} onCancel={() => setPersonalDescriptionAccount(null)} onOk={handleSavePersonalDescription} okText="保存" cancelText="取消" width={860}>
        <Paragraph type="secondary">
          为 <Text strong>{personalDescriptionAccount?.name}</Text> 配置专属信息描述，该内容会作为该企微账号的固定上下文注入到后续提示词中。
        </Paragraph>
        <Form form={personalDescriptionForm} layout="vertical">
          <Form.Item label="专属信息描述" name="dedicatedInfo">
            <Input.TextArea rows={8} placeholder="输入该企微账号的个人背景、沟通风格、擅长领域、销售特点等，用于后续 AI 提示词上下文。" />
          </Form.Item>
        </Form>
      </Modal>

    </Space>
  );
}

export default WecomAccountPage;
