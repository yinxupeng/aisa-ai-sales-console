import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { agentTools } from "../data/appData";
import { INDUSTRY_TOOL_DATA, capabilityIndustryOptions, capabilityPageSize, filterCapabilities, getCapabilityPage } from "../data/industryCapabilityData";
import { PanelTitle } from "../components/PageChrome";


const { Text, Title } = Typography;


function ToolsPage() {
  const [form] = Form.useForm();
  const [toolRows, setToolRows] = useState(() => [
    ...agentTools.map((item) => ({ ...item, industry: "教育培训" })),
    ...INDUSTRY_TOOL_DATA
  ]);
  const [editingTool, setEditingTool] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("全部状态");
  const [industry, setIndustry] = useState("全部行业");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (editingTool) {
      form.resetFields();
      form.setFieldsValue(editingTool);
    }
  }, [editingTool, form]);

  const filteredRows = useMemo(() => filterCapabilities(toolRows, industry, keyword).filter((item) => {
    const matchesStatus = status === "全部状态" || (status === "启用" ? item.enabled : !item.enabled);
    return matchesStatus;
  }), [toolRows, industry, keyword, status]);
  const pagedRows = useMemo(() => getCapabilityPage(filteredRows, currentPage), [filteredRows, currentPage]);
  useEffect(() => setCurrentPage(1), [industry, keyword, status]);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredRows.length / capabilityPageSize));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [currentPage, filteredRows.length]);

  const openCreateModal = () => {
    setEditingTool({
      key: "",
      id: toolRows.length ? Math.max(...toolRows.map((item) => item.id)) + 1 : 1,
      name: "",
      description: "",
      prompt: "",
      industry: "教育培训",
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
    { title: "行业", dataIndex: "industry", width: 110, render: (value) => <Tag color="cyan">{value || "教育培训"}</Tag> },
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
                <Input prefix={<SearchOutlined />} placeholder="请输入" value={keyword} onChange={(event) => setKeyword(event.target.value)} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} xl={6}>
              <Form.Item label="行业" className="filter-form-item">
                <Select value={industry} onChange={setIndustry} options={capabilityIndustryOptions.map((value) => ({ value, label: value === "全部行业" ? "请选择" : value }))} />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} xl={6}>
              <Form.Item label="状态" className="filter-form-item">
                <Select value={status} onChange={setStatus} options={["全部状态", "启用", "停用"].map((value) => ({ value, label: value === "全部状态" ? "请选择" : value }))} />
              </Form.Item>
            </Col>
            <Col xs={24} xl={6} className="tool-filter-actions">
              <Space>
                <Button type="primary">查询</Button>
                <Button onClick={() => { setKeyword(""); setIndustry("全部行业"); setStatus("全部状态"); }}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card title={<PanelTitle title="AI工具提示词" desc="维护可供 Agent 调用的工具名称、描述、提示词内容和启用状态。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>新增工具</Button>} />}>
          <Table
            className="admin-table tool-table"
            rowKey="key"
            columns={columns}
            dataSource={pagedRows}
            pagination={false}
            scroll={{ x: 1270 }}
          />
          <div className="strategy-pagination-wrap"><Pagination current={currentPage} pageSize={capabilityPageSize} total={filteredRows.length} showSizeChanger={false} showTotal={(total, range) => `${range[0]}-${range[1]} / 共 ${total} 个`} onChange={setCurrentPage} /></div>
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
          <Form.Item label="行业分类" name="industry" rules={[{ required: true, message: "请选择行业分类" }]}>
            <Select options={capabilityIndustryOptions.filter((value) => value !== "全部行业").map((value) => ({ value }))} />
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
