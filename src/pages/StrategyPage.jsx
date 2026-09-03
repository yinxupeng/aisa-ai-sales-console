import React, { useState, useEffect } from "react";
import {
  App as AntApp,
  Button,
  Card,
  Col,
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
import { PlusOutlined } from "@ant-design/icons";
import { strategies } from "../data/appData";
import StrategyEditor from "./StrategyEditor";

const { Text, Title } = Typography;

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

function StrategyPage() {
  const { message } = AntApp.useApp();
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingBasicSkill, setEditingBasicSkill] = useState(null);
  const [strategyRows, setStrategyRows] = useState(strategies);
  const createSkillDraft = () => ({
    key: "",
    code: "",
    name: "新增智能体",
    agentCategory: "会话智能体",
    type: "SOP会话",
    trigger: "课程阶段进入 / 课前提醒 / 课后回访",
    channel: "Sabuddy内部能力",
    input: "聊天记录、学员年级、英语基础、课程意向",
    output: "下一步沟通建议、待发送话术、触发动作",
    agent: "小学英语课程顾问",
    calls: 0,
    createdAt: "2026-08-16 14:49:52",
    updatedAt: "2026-08-16 16:00:54",
    status: "启用"
  });
  const duplicateSkill = (record) => {
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    setStrategyRows((items) => [
      ...items,
      {
        ...record,
        key: `${record.key}-copy-${Date.now()}`,
        name: `${record.name} 副本`,
        createdAt,
        updatedAt: createdAt
      }
    ]);
    message.success("智能体已复制");
  };
  const saveBasicSkill = (values) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const nextSkill = {
      ...(editingBasicSkill || {}),
      ...values,
      updatedAt: timestamp,
      createdAt: editingBasicSkill?.createdAt || timestamp
    };
    if (editingBasicSkill?.key) {
      setStrategyRows((items) => items.map((item) => (item.key === editingBasicSkill.key ? nextSkill : item)));
    } else {
      setStrategyRows((items) => [...items, { ...nextSkill, key: `agent-${Date.now()}` }]);
    }
    setEditingBasicSkill(null);
    message.success("智能体基础信息已保存");
  };
  const columns = [
    { title: "智能体", dataIndex: "name", width: 180 },
    { title: "分类", dataIndex: "agentCategory", width: 110, render: (value) => <Tag color={value === "策略智能体" ? "purple" : "blue"}>{value || "会话智能体"}</Tag> },
    { title: "触发方式", dataIndex: "trigger", width: 320 },
    { title: "创建时间", dataIndex: "createdAt", width: 150 },
    { title: "修改时间", dataIndex: "updatedAt", width: 150 },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (v, record) => (
        <Switch
          checked={v === "启用"}
          onChange={(checked) => setStrategyRows((items) => items.map((item) => item.key === record.key ? { ...item, status: checked ? "启用" : "停用" } : item))}
        />
      )
    },
    {
      title: "操作",
      width: 260,
      render: (_, record) => (
        <Space wrap={false} size={4} className="ai-skill-action-group">
          <Button type="link" onClick={() => setEditingBasicSkill(record)}>编辑</Button>
          <Button type="link" onClick={() => setEditingSkill(record)}>配置</Button>
          <Button type="link" className="link-warning" onClick={() => duplicateSkill(record)}>复制</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除智能体", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setStrategyRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  if (editingSkill) return <StrategyEditor skill={editingSkill} onBack={() => setEditingSkill(null)} />;
  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card title={<PanelTitle title="智能体列表" desc="会话智能体按业务流程 SOP 阶段配置；策略智能体用于客户策略、标签和任务编排。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setEditingBasicSkill(createSkillDraft())}>新增智能体</Button>} />}>
        <Space className="toolbar" wrap>
          <Select defaultValue="全部智能体分类" options={["全部智能体分类", "会话智能体", "策略智能体"].map((value) => ({ value }))} />
          <Select defaultValue="全部能力类型" options={["全部能力类型", "SOP会话", "策略编排"].map((value) => ({ value }))} />
          <Select defaultValue="全部状态" options={["全部状态", "启用", "停用"].map((value) => ({ value }))} />
          <Input placeholder="搜索智能体、触发方式或调用通道" allowClear className="strategy-search-input" />
          <Button type="primary">搜索</Button>
          <Button>重置</Button>
        </Space>
        <Table
          className="admin-table"
          rowKey="key"
          columns={columns}
          dataSource={strategyRows}
          pagination={false}
          scroll={{ x: 1110 }}
        />
      </Card>
      <StrategyBasicModal
        agent={editingBasicSkill}
        onClose={() => setEditingBasicSkill(null)}
        onSave={saveBasicSkill}
      />
    </Space>
  );
}

function StrategyBasicModal({ agent, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (agent) {
      form.setFieldsValue({
        code: agent.code || `${agent.key || "agent"}_agent`,
        name: agent.name,
        agentCategory: agent.agentCategory || "会话智能体",
        type: agent.type || "消息生成",
        status: agent.status || "启用",
        description: agent.description || `${agent.name || "该智能体"} 用于在指定业务场景中独立完成 AI 任务，并可按需关联工具与 Skill。`
      });
    } else {
      form.resetFields();
    }
  }, [agent, form]);
  return (
    <Modal
      title="智能体基础信息"
      open={Boolean(agent)}
      onCancel={onClose}
      okText="保存"
      cancelText="取消"
      width={760}
      onOk={() => form.validateFields().then(onSave)}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="agent-basic-edit-form">
        <Row gutter={16}>
          <Col span={24}><Form.Item label="Agent Code" name="code"><Input placeholder="请输入 Agent Code" /></Form.Item></Col>
          <Col span={24}><Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入智能体名称" }]}><Input placeholder="请输入智能体名称" /></Form.Item></Col>
          <Col span={12}><Form.Item label="智能体分类" name="agentCategory"><Select options={["会话智能体", "策略智能体"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="能力类型" name="type"><Input placeholder="例如：消息生成、策略编排" /></Form.Item></Col>
          <Col span={24}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={24}><Form.Item label="描述" name="description"><Input.TextArea rows={5} showCount maxLength={255} placeholder="说明该智能体负责的场景、调用边界和服务目标。" /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

export { StrategyPage, StrategyBasicModal };
export default StrategyPage;
