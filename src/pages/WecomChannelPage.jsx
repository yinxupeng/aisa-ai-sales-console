import React, { useEffect, useState } from "react";
import { App, Button, Card, Empty, Form, Input, Modal, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { CloudSyncOutlined, PlusOutlined } from "@ant-design/icons";
import { defaultJuziAccounts, defaultJuziBaseUrl, deleteJuziAccount, maskJuziAppKey, saveJuziAccount, setJuziAccountActive, validateJuziAccount } from "../data/juziChannelAccounts";

const { Paragraph, Text, Title } = Typography;
const pageSize = 8;
const getSyncTime = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());

export function JuziAccountForm({ form, accounts, editingId, onFinish }) {
  const fieldRules = (field) => [{ validator: (_, value) => {
    const errors = validateJuziAccount({ ...form?.getFieldsValue(), [field]: value }, accounts, editingId);
    return errors[field] ? Promise.reject(new Error(errors[field])) : Promise.resolve();
  } }];
  return <Form form={form} layout="vertical" onFinish={onFinish} requiredMark className="juzi-account-form" autoComplete="off">
    <Form.Item label="配置标识" name="label" required rules={fieldRules("label")}><Input autoFocus maxLength={50} placeholder="如 default / backup / corp-a" /></Form.Item>
    <Form.Item label="Base URL" name="baseUrl" required rules={fieldRules("baseUrl")}><Input placeholder={defaultJuziBaseUrl} /></Form.Item>
    <Form.Item label="句子互动 App Key" name="appKey" required rules={fieldRules("appKey")}><Input.Password placeholder="请输入 App Key" autoComplete="new-password" /></Form.Item>
    <Text type="secondary" className="juzi-account-demo-note">原型演示，请勿填写真实密钥；配置仅在当前页面内保留，不连接外部服务。</Text>
  </Form>;
}

export default function WecomChannelPage() {
  const { message } = App.useApp();
  const [accounts, setAccounts] = useState(() => structuredClone(defaultJuziAccounts));
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const activeCount = accounts.filter((account) => account.active).length;

  useEffect(() => {
    if (editorOpen) {
      form.resetFields();
      form.setFieldsValue(editingAccount ? { label: editingAccount.label, baseUrl: editingAccount.baseUrl, appKey: editingAccount.appKey } : { label: "", baseUrl: defaultJuziBaseUrl, appKey: "" });
    }
  }, [editorOpen, editingAccount, form]);

  const openEditor = (account = null) => { setEditingAccount(account); setEditorOpen(true); };
  const closeEditor = () => { form.resetFields(); setEditorOpen(false); setEditingAccount(null); };
  const saveAccount = (values) => {
    try {
      const next = saveJuziAccount(accounts, values, editingAccount?.id);
      const requiresReactivation = editingAccount?.active && !next.find((account) => account.id === editingAccount.id)?.active;
      setAccounts(next);
      if (!editingAccount) setPage(Math.ceil(next.length / pageSize));
      closeEditor();
      message.success(requiresReactivation ? "配置已更新，连接参数已变化，请重新激活账号" : editingAccount ? "账号配置已更新" : "账号配置已保存，可在列表中激活");
    } catch (error) { message.warning(error.message); }
  };
  const changeActivation = (account) => {
    setAccounts((current) => setJuziAccountActive(current, account.id, !account.active, account.active ? null : getSyncTime()));
    message.success(account.active ? "已模拟取消该账号的通道托管，不影响其他账号" : "已模拟激活账号并同步托管企微");
  };
  const removeAccount = (account) => {
    try {
      const next = deleteJuziAccount(accounts, account.id);
      setAccounts(next);
      setPage((current) => Math.min(current, Math.max(1, Math.ceil(next.length / pageSize))));
      message.success("账号配置已删除");
    } catch (error) { message.warning(error.message); }
  };

  return <Space orientation="vertical" size={16} className="page-stack juzi-channel-page">
    <Card className="channel-entry-card">
      <div className="channel-entry">
        <div>
          <Space size={10} align="center" wrap><CloudSyncOutlined className="channel-entry-icon" /><Title level={4}>句子通道配置</Title><Tag color={activeCount ? "success" : "default"}>{activeCount ? `${activeCount} 个账号已激活` : "暂无激活账号"}</Tag></Space>
          <Paragraph type="secondary">管理句子互动账号，支持同时激活多个通道；取消激活仅停用该账号的通道托管，不影响其他账号。</Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>配置账号</Button>
      </div>
    </Card>
    <Card className="juzi-account-list-card" title={<Space><span>已配置账号</span><Text type="secondary">共 {accounts.length} 个</Text></Space>}>
      <Table rowKey="id" tableLayout="fixed" dataSource={accounts} scroll={{ x: 1160 }} pagination={{ current: page, pageSize, showSizeChanger: false, total: accounts.length, onChange: setPage, showTotal: (total) => `共 ${total} 个账号` }} locale={{ emptyText: <Empty description="暂无账号配置，点击“配置账号”添加" /> }} columns={[
        { title: "配置标识", dataIndex: "label", width: 200, ellipsis: { showTitle: true }, render: (value) => <Text strong title={value}>{value}</Text> },
        { title: "Base URL", dataIndex: "baseUrl", width: 300, ellipsis: { showTitle: true } },
        { title: "App Key", dataIndex: "appKey", width: 160, render: (value) => <Text className="juzi-account-key">{maskJuziAppKey(value)}</Text> },
        { title: "激活状态", dataIndex: "active", width: 110, render: (value) => <Tag color={value ? "success" : "default"}>{value ? "已激活" : "未激活"}</Tag> },
        { title: "最近同步", dataIndex: "lastSyncedAt", width: 155, render: (value) => value ? <span className="juzi-account-sync-time">{value.split(" ").map((part, index) => <span key={index}>{part}</span>)}</span> : <Text type="secondary">—</Text> },
        { title: "操作", key: "actions", fixed: "right", width: 235, render: (_, account) => <Space size={12}>
          {account.active ? <Popconfirm title="取消激活该账号？" description="仅停用该账号的通道托管，不影响其他已激活账号。" okText="取消激活" cancelText="暂不取消" onConfirm={() => changeActivation(account)}><Button type="link" className="juzi-account-deactivate">取消激活</Button></Popconfirm> : <Button type="link" onClick={() => changeActivation(account)}>激活</Button>}
          <Button type="link" onClick={() => openEditor(account)}>编辑</Button>
          <Popconfirm title="删除该账号配置？" description="删除后需重新配置才能使用。" disabled={account.active} okText="删除" cancelText="取消" onConfirm={() => removeAccount(account)}><Button type="link" danger disabled={account.active} title={account.active ? "请先取消激活，再删除账号" : "删除账号配置"}>删除</Button></Popconfirm>
        </Space> }
      ]} />
    </Card>
    <Modal title={editingAccount ? "编辑句子账号" : "新增句子账号"} open={editorOpen} onCancel={closeEditor} onOk={() => form.submit()} okText="保存" cancelText="取消" width={600} destroyOnHidden>
      <JuziAccountForm form={form} accounts={accounts} editingId={editingAccount?.id} onFinish={saveAccount} />
    </Modal>
  </Space>;
}
