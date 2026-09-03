import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
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
  Typography
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { agentTools } from "../data/appData";

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

function ToolsPage() {
  const [form] = Form.useForm();
  const [toolRows, setToolRows] = useState(agentTools);
  const [editingTool, setEditingTool] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("全部状态");

  useEffect(() => {
    if (editingTool) {
      form.resetFields();
      form.setFieldsValue(editingTool);
    }
  }, [editingTool, form]);

  const filteredRows = toolRows.filter((item) => {
    const keywordText = keyword.trim().toLowerCase();
    const matchesKeyword = !keywordText || [item.name, item.description, item.prompt].some((value) => String(value).toLowerCase().includes(keywordText));
    const matchesStatus = status === "全部状态" || (status === "启用" ? item.enabled : !item.enabled);
    return matchesKeyword && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingTool({
      key: "",
      id: toolRows.length ? Math.max(...toolRows.map((item) => item.id)) + 1 : 1,
      name: "",
      description: "",
      prompt: "",
      enabled: true,
      updatedAt: new Date().toISOString().slice(0, 19)
    });
  };

  const handleSave = (values) => {
    const nextTool = {
      ...editingTool,
      ...values,
      updatedAt: new Date().toISOString().slice(0, 19)
    };
    if (editingTool.key) {
      setToolRows((items) => items.map((item) => (item.key === editingTool.key ? nextTool : item)));
    } else {
      setToolRows((items) => [...items, { ...nextTool, key: `tool-${Date.now()}` }]);
    }
    setEditingTool(null);
  };

  const handleEnabledChange = (record, checked) => {
    setToolRows((items) => items.map((item) => (item.key === record.key ? { ...item, enabled: checked, updatedAt: new Date().toISOString().slice(0, 19) } : item)));
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 90 },
    { title: "工具名称", dataIndex: "name", width: 220 },
    { title: "描述", dataIndex: "description", ellipsis: true },
    {
      title: "启用",
      dataIndex: "enabled",
      width: 120,
      render: (value, record) => <Switch checked={value} onChange={(checked) => handleEnabledChange(record, checked)} />
    },
    { title: "更新时间", dataIndex: "updatedAt", width: 190, ellipsis: true },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => setEditingTool(record)}>编辑</Button>
          <Button
            type="link"
            danger
            onClick={() => Modal.confirm({
              title: "删除工具提示词",
              content: `确认删除 ${record.name}？删除后该工具将不可被 Agent 调用。`,
              okText: "删除",
              okButtonProps: { danger: true },
              cancelText: "取消",
              onOk: () => setToolRows((items) => items.filter((item) => item.key !== record.key))
            })}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      <Space direction="vertical" size={16} className="page-stack">
        <Card>
          <Row gutter={[24, 16]} align="middle" className="tool-filter-row">
            <Col xs={24} md={10} xl={6}>
              <Form.Item label="关键词" className="filter-form-item">
                <Input placeholder="请输入" value={keyword} onChange={(event) => setKeyword(event.target.value)} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} xl={6}>
              <Form.Item label="状态" className="filter-form-item">
                <Select value={status} onChange={setStatus} options={["全部状态", "启用", "停用"].map((value) => ({ value, label: value === "全部状态" ? "请选择" : value }))} />
              </Form.Item>
            </Col>
            <Col xs={24} xl={12} className="tool-filter-actions">
              <Divider type="vertical" className="tool-filter-divider" />
              <Space>
                <Button type="primary">查询</Button>
                <Button onClick={() => { setKeyword(""); setStatus("全部状态"); }}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card title={<PanelTitle title="AI工具提示词" desc="维护可供 Agent 调用的工具名称、描述、提示词内容和启用状态。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>新增工具</Button>} />}>
          <Table
            className="admin-table tool-table"
            rowKey="key"
            columns={columns}
            dataSource={filteredRows}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            scroll={{ x: 1160 }}
          />
        </Card>
      </Space>
      <Modal
        title={editingTool?.key ? "编辑工具提示词" : "新增工具提示词"}
        open={Boolean(editingTool)}
        onCancel={() => setEditingTool(null)}
        onOk={() => form.submit()}
        okText="保存"
        cancelText="取消"
        width={1080}
      >
        <Form form={form} layout="horizontal" labelCol={{ xs: 24, sm: 4 }} wrapperCol={{ xs: 24, sm: 20 }} onFinish={handleSave}>
          <Form.Item label="工具名称" name="name" rules={[{ required: true, message: "请输入工具名称" }]}>
            <Input placeholder="请输入工具名称" />
          </Form.Item>
          <Form.Item label="工具描述" name="description" rules={[{ required: true, message: "请输入工具描述" }]}>
            <Input.TextArea rows={3} placeholder="请输入工具描述" />
          </Form.Item>
          <Form.Item label="提示词内容" name="prompt" rules={[{ required: true, message: "请输入提示词内容" }]}>
            <Input.TextArea rows={11} placeholder="请输入 Agent 调用该工具时使用的提示词，可使用 {{变量名}} 作为上下文占位符。" />
          </Form.Item>
          <Form.Item label="启用" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Text type="secondary">工具提示词保存后可用于 AI Agent 调用。</Text>
        </Form>
      </Modal>
    </>
  );
}

export default ToolsPage;
