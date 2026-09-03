import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Switch, Table, Tag, Typography } from "antd";
import { accounts, companies } from "../data/appData";

const { Text, Title } = Typography;

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

function AccountModal({ title, open, account, platform, onClose }) {
  return (
    <Modal title={title} open={open} onCancel={onClose} onOk={onClose} okText="保存账号" cancelText="取消" width={680}>
      <Form
        layout="vertical"
        key={account?.key || title}
        initialValues={{
          name: account?.name,
          company: companies.find((item) => item.name === account?.company)?.id || "company-1",
          role: account?.role || (platform ? "平台管理员" : "企业管理员"),
          phone: account?.phone,
          login: account?.key ? `${account.key}@company.com` : undefined,
          enabled: account?.status !== "停用"
        }}
      >
        <Row gutter={16}>
          <Col span={12}><Form.Item label="姓名" name="name"><Input placeholder="例如：赵经理" /></Form.Item></Col>
          <Col span={12}><Form.Item label="所属企业" name="company"><Select options={companies.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="角色" name="role"><Select options={["平台管理员", "企业管理员", "销售主管", "知识库运营", "真人销售"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="手机号" name="phone"><Input placeholder="例如：13800008888" /></Form.Item></Col>
          <Col span={24}><Form.Item label="登录账号" name="login"><Input placeholder="例如：manager@company.com" /></Form.Item></Col>
          <Col span={24}><Form.Item label="账号状态" name="enabled" valuePropName="checked"><Switch checkedChildren="启用" unCheckedChildren="停用" /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function SettingsPage({ platform }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [accountRows, setAccountRows] = useState(accounts);
  const columns = [
    { title: "姓名", dataIndex: "name" },
    { title: "所属企业", dataIndex: "company" },
    { title: "角色", dataIndex: "role" },
    { title: "手机号", dataIndex: "phone" },
    { title: "状态", dataIndex: "status", render: statusTag },
    {
      title: "操作",
      fixed: "right",
      width: 130,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setEditing(record)}>编辑</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除账号", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setAccountRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  return (
    <>
      <Card title={<PanelTitle title="账号列表" desc={platform ? "平台管理员可查看和维护平台下账号。" : "当前只显示本企业账号。"} extra={<Button type="primary" onClick={() => setOpen(true)}>新增账号</Button>} />}>
        <Table className="admin-table" rowKey="key" columns={columns} dataSource={platform ? accountRows : accountRows.slice(1)} pagination={false} scroll={{ x: 860 }} />
      </Card>
      <AccountModal title="新增账号" open={open} platform={platform} onClose={() => setOpen(false)} />
      <AccountModal title="编辑账号" account={editing} open={Boolean(editing)} platform={platform} onClose={() => setEditing(null)} />
    </>
  );
}

export default SettingsPage;
