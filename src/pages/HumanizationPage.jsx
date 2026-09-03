import React, { useState } from "react";
import { Button, Card, Form, Input, InputNumber, Modal, Slider, Space, Switch, Table, Tag, Tooltip, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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

function HumanizationPage() {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [humanizationRows, setHumanizationRows] = useState([
    {
      key: "h1",
      title: "测试风格",
      enabled: false,
      antiGrabWaits: [3, 1, 6],
      splitEnabled: true,
      minSplitLength: 80,
      maxSplitSegments: 3,
      prompt: "语言比较柔和，客气",
      agentRoleId: ""
    },
    {
      key: "h2",
      title: "销售风格",
      enabled: false,
      antiGrabWaits: [8, 3],
      splitEnabled: true,
      minSplitLength: 80,
      maxSplitSegments: 3,
      prompt: "1. 像真人微信私聊，大白话，短句为主。 2. 默认短回复，控制在 30-50 字。 3. 用户问一个问题先回答一个点，不要一次性堆太多信息。",
      agentRoleId: "sales"
    }
  ]);
  const waitFirst = Form.useWatch("waitFirst", form);
  const waitSecond = Form.useWatch("waitSecond", form);
  const waitThird = Form.useWatch("waitThird", form);

  const getModalValues = (record) => ({
    title: record?.title || "",
    prompt: record?.prompt || "",
    waitFirst: record?.antiGrabWaits?.[0] ?? 3,
    waitSecond: record?.antiGrabWaits?.[1] ?? 1,
    waitThird: record?.antiGrabWaits?.[2] ?? 6,
    splitEnabled: record?.splitEnabled ?? true,
    minSplitLength: record?.minSplitLength ?? 80,
    maxSplitSegments: record?.maxSplitSegments ?? 3,
    enabled: record?.enabled ?? false
  });

  const openEditor = (record = null) => {
    setEditing(record);
    form.setFieldsValue(getModalValues(record));
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const nextRow = {
      key: editing?.key || `h-${Date.now()}`,
      title: values.title,
      enabled: values.enabled,
      antiGrabWaits: [values.waitFirst, values.waitSecond, values.waitThird],
      splitEnabled: values.splitEnabled,
      minSplitLength: values.minSplitLength,
      maxSplitSegments: values.maxSplitSegments,
      prompt: values.prompt,
      agentRoleId: editing?.agentRoleId || ""
    };

    setHumanizationRows((items) => (
      editing
        ? items.map((item) => (item.key === editing.key ? nextRow : item))
        : [nextRow, ...items]
    ));
    setModalOpen(false);
    setEditing(null);
  };

  const columns = [
    { title: "标题", dataIndex: "title", width: 160, render: (value) => <Text>{value}</Text> },
    { title: "启用", dataIndex: "enabled", width: 96, render: statusTag },
    { title: "防抢答", dataIndex: "antiGrabWaits", width: 130, render: (value) => <Text>{`[${value.join(",")}]`}</Text> },
    { title: "拆分长回复", dataIndex: "splitEnabled", width: 150, render: (value) => statusTag(value) },
    {
      title: "提示词",
      dataIndex: "prompt",
      ellipsis: true,
      render: (value) => <Text className="humanization-prompt-preview">{value}</Text>
    },
    {
      title: "操作",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" onClick={() => openEditor(record)}>编辑</Button>
          <Button
            type="link"
            danger
            onClick={() => Modal.confirm({
              title: "删除拟人化配置",
              content: `确认删除 ${record.title}？`,
              okText: "删除",
              okButtonProps: { danger: true },
              cancelText: "取消",
              onOk: () => setHumanizationRows((items) => items.filter((item) => item.key !== record.key))
            })}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  const waitRows = [
    ["第1条消息", "waitFirst", waitFirst ?? 3],
    ["第2条消息", "waitSecond", waitSecond ?? 1],
    ["第3条消息", "waitThird", waitThird ?? 6]
  ];

  return (
    <>
      <Card
        className="humanization-config-card"
        title={(
          <PanelTitle
            title="拟人化策略配置"
            desc="不同智能体可配置不同的 AI 回复风格。agentRoleId 为空 = 全局默认。"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>新增配置</Button>}
          />
        )}
      >
        <Table
          className="admin-table humanization-table"
          rowKey="key"
          columns={columns}
          dataSource={humanizationRows}
          pagination={false}
          scroll={{ x: 980 }}
        />
      </Card>

      <Modal
        title={editing ? "编辑拟人化" : "新增拟人化"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
        width={880}
        centered
        className="humanization-modal"
      >
        <Form form={form} className="humanization-form" layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} requiredMark={false} colon={false}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: "请输入标题" }]}>
            <Input placeholder="例如：销售风格" />
          </Form.Item>
          <Form.Item label="提示词" name="prompt" rules={[{ required: true, message: "请输入提示词" }]}>
            <Input.TextArea className="humanization-prompt-input" rows={7} placeholder="请输入 AI 回复风格、语气、短句规则和禁用表达" />
          </Form.Item>
          <Form.Item label={<Space size={6}>防抢答等待<Tooltip title="控制连续消息的等待时间，避免客户正在输入时 AI 抢先回复。"><span className="form-help-dot">?</span></Tooltip></Space>}>
            <div className="anti-grab-list">
              {waitRows.map(([label, name, value]) => (
                <div className="anti-grab-row" key={name}>
                  <Text>{label}</Text>
                  <Form.Item name={name} noStyle>
                    <Slider min={0} max={10} step={1} tooltip={{ formatter: null }} />
                  </Form.Item>
                  <Text className="anti-grab-value">{value}s</Text>
                </div>
              ))}
            </div>
          </Form.Item>
          <Form.Item label="拆分长回复" name="splitEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="最小拆分长度">
            <Space align="center" size={14} className="humanization-number-row">
              <Form.Item name="minSplitLength" noStyle rules={[{ required: true, message: "请输入最小拆分长度" }]}>
                <InputNumber min={20} max={300} className="humanization-number" />
              </Form.Item>
              <Text type="secondary">长于此字符数的回复才会被拆分</Text>
            </Space>
          </Form.Item>
          <Form.Item label="最大拆分段数">
            <Space align="center" size={14} className="humanization-number-row">
              <Form.Item name="maxSplitSegments" noStyle rules={[{ required: true, message: "请输入最大拆分段数" }]}>
                <InputNumber min={2} max={6} className="humanization-number" />
              </Form.Item>
              <Text type="secondary">随机拆分成 2 到 3 段</Text>
            </Space>
          </Form.Item>
          <Form.Item label="启用" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default HumanizationPage;
