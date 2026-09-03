import React, { useState } from "react";
import {
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
  Tabs,
  Tag,
  Tooltip,
  Typography
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ToolOutlined
} from "@ant-design/icons";
import { aiSkills, agentTools } from "../data/appData";
import {
  KnowledgeResourcePickerModal,
  buildKnowledgeResourceRows,
  getKnowledgeBaseKeysFromResources
} from "../components/KnowledgeResourcePickerModal";
import SkillLogicRichEditor from "../components/SkillLogicRichEditor";

const { Paragraph, Text, Title } = Typography;

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
          <Typography.Title level={4}>{title}</Typography.Title>
          {desc ? <Text type="secondary">{desc}</Text> : null}
        </div>
      </div>
      {extra ? <Space wrap>{extra}</Space> : null}
    </div>
  );
}

function AISkillPage() {
  const [rows, setRows] = useState(aiSkills);
  const [configSkill, setConfigSkill] = useState(null);
  const [knowledgePickerOpen, setKnowledgePickerOpen] = useState(false);
  const [knowledgePickerKeys, setKnowledgePickerKeys] = useState([]);
  const [toolPickerOpen, setToolPickerOpen] = useState(false);
  const [toolPickerKeys, setToolPickerKeys] = useState([]);
  const [toolPickerKeyword, setToolPickerKeyword] = useState("");
  const [toolPickerCategory, setToolPickerCategory] = useState("全部类型");
  const skillAbilityTypes = ["信息总结", "策略判断", "产品匹配", "固定话题回复", "合规检查", "用户标签", "消息生成", "任务触发", "数据同步"];
  const skillTypeOptions = ["全部能力类型", ...skillAbilityTypes].map((value) => ({ value }));
  const statusOptions = ["全部状态", "启用", "停用"].map((value) => ({ value }));
  const skillEditTypeOptions = skillAbilityTypes.map((value) => ({ value }));
  const skillOutputTypeOptions = ["策略判断", "结构化档案", "标签", "建议话术", "任务结果", "合规检查"].map((value) => ({ value }));
  const skillOutputTargetOptions = ["智能体内部", "客户档案", "会话记录", "运营标签", "企微标签", "生成真人销售建议", "触发后续任务"].map((value) => ({ value }));
  const skillDefaultConfig = {
    outputType: "结构化档案",
    outputTargets: ["智能体内部"]
  };
  const normalizeSkillConfig = (skill) => ({
    ...skillDefaultConfig,
    ...skill,
    knowledgeResourceKeys: skill.knowledgeResourceKeys || (skill.knowledgeBaseKeys || []).map((key) => `base:${key}`)
  });
  const createDraft = () => ({
    ...skillDefaultConfig,
    key: "",
    name: "",
    description: "",
    type: "信息总结",
    scenario: "",
    trigger: "",
    input: "",
    output: "",
    boundAgents: [],
    status: "启用",
    prompt: "# Skill目标\n\n## 输入上下文\n\n## 输出要求\n",
    knowledgeBaseKeys: [],
    knowledgeResourceKeys: [],
    toolKeys: [],
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ")
  });
  const updateConfigSkill = (changes) => {
    setConfigSkill((skill) => skill ? { ...skill, ...changes } : skill);
  };
  const saveConfigSkill = () => {
    if (!configSkill) return;
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const nextSkill = {
      ...configSkill,
      updatedAt: timestamp,
      createdAt: configSkill.createdAt || timestamp
    };
    if (configSkill.key) {
      setRows((items) => items.map((item) => (item.key === configSkill.key ? nextSkill : item)));
    } else {
      setRows((items) => [...items, { ...nextSkill, key: `aiskill-${Date.now()}` }]);
    }
    setConfigSkill(null);
  };
  const duplicateSkill = (record) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    setRows((items) => [...items, { ...record, key: `${record.key}-copy-${Date.now()}`, name: `${record.name} 副本`, createdAt: timestamp, updatedAt: timestamp }]);
  };
  const columns = [
    { title: "Skill名称", dataIndex: "name", width: 140 },
    { title: "Skill描述", dataIndex: "description", width: 300, render: (value) => <Paragraph className="ai-skill-description-cell">{value}</Paragraph> },
    { title: "类型", dataIndex: "type", width: 78, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "已绑定智能体", dataIndex: "boundAgents", width: 150, render: (items = []) => <Space wrap size={[4, 4]}>{items.map((item) => <Tag key={item}>{item}</Tag>)}</Space> },
    { title: "更新时间", dataIndex: "updatedAt", width: 128 },
    { title: "状态", dataIndex: "status", width: 68, render: (value, record) => <Switch checked={value === "启用"} onChange={(checked) => setRows((items) => items.map((item) => item.key === record.key ? { ...item, status: checked ? "启用" : "停用" } : item))} /> },
    {
      title: "操作",
      width: 130,
      render: (_, record) => (
        <Space wrap={false} size={4} className="ai-skill-action-group">
          <Button type="link" onClick={() => setConfigSkill(normalizeSkillConfig(record))}>编辑</Button>
          <Button type="link" className="link-warning" onClick={() => duplicateSkill(record)}>复制</Button>
          <Button type="link" danger onClick={() => Modal.confirm({ title: "删除Skill", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setRows((items) => items.filter((item) => item.key !== record.key)) })}>删除</Button>
        </Space>
      )
    }
  ];
  if (configSkill) {
    const knowledgeResourceRows = buildKnowledgeResourceRows();
    const selectedKnowledgeResources = knowledgeResourceRows.filter((item) => (configSkill.knowledgeResourceKeys || []).includes(item.key));
    const skillToolRows = agentTools.map((tool) => ({
      key: tool.key,
      name: tool.name,
      type: tool.enabled ? "可用工具" : "停用工具",
      description: tool.description,
      scenario: "外部查询、通知、跳转、托管控制",
      input: "任务上下文、客户标识、会话阶段、业务参数",
      output: "调用状态、关键字段、异常信息、结构化摘要",
      status: tool.enabled ? "启用" : "停用",
      updatedAt: tool.updatedAt
    }));
    const selectedTools = skillToolRows.filter((item) => (configSkill.toolKeys || []).includes(item.key));
    const saveKnowledgeResources = () => {
      const nextKeys = Array.from(new Set(knowledgePickerKeys));
      updateConfigSkill({
        knowledgeResourceKeys: nextKeys,
        knowledgeBaseKeys: getKnowledgeBaseKeysFromResources(nextKeys)
      });
      setKnowledgePickerOpen(false);
    };
    const openSkillToolPicker = () => {
      setToolPickerKeys(configSkill.toolKeys || []);
      setToolPickerKeyword("");
      setToolPickerCategory("全部类型");
      setToolPickerOpen(true);
    };
    const toggleSkillToolSelection = (key) => {
      setToolPickerKeys((keys) => (
        keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key]
      ));
    };
    const saveSkillTools = () => {
      updateConfigSkill({ toolKeys: Array.from(new Set(toolPickerKeys)) });
      setToolPickerOpen(false);
    };
    const removeSkillTool = (key) => {
      updateConfigSkill({ toolKeys: (configSkill.toolKeys || []).filter((item) => item !== key) });
    };
    const renderSkillToolPickerModal = () => {
      const categories = ["全部类型", ...Array.from(new Set(skillToolRows.map((item) => item.type)))];
      const keywordText = toolPickerKeyword.trim().toLowerCase();
      const pickerRows = skillToolRows.filter((item) => {
        const matchesCategory = toolPickerCategory === "全部类型" || item.type === toolPickerCategory;
        const matchesKeyword = !keywordText || [item.name, item.type, item.description, item.scenario].some((value) => String(value || "").toLowerCase().includes(keywordText));
        return matchesCategory && matchesKeyword;
      });
      return (
        <Modal
          title="选择工具"
          open={toolPickerOpen}
          onCancel={() => setToolPickerOpen(false)}
          footer={<Button type="primary" onClick={saveSkillTools}>确认关联</Button>}
          width={900}
          className="agent-relation-picker-modal"
        >
          <div className="agent-relation-picker-toolbar">
            <Input.Search
              allowClear
              placeholder="搜索工具名称、类型或说明"
              value={toolPickerKeyword}
              onChange={(event) => setToolPickerKeyword(event.target.value)}
            />
            <Select
              value={toolPickerCategory}
              options={categories.map((value) => ({ value }))}
              onChange={setToolPickerCategory}
            />
          </div>
          <div className="agent-relation-card-list">
            {pickerRows.map((item) => {
              const checked = toolPickerKeys.includes(item.key);
              return (
                <div className={checked ? "agent-relation-resource-card selected" : "agent-relation-resource-card"} key={item.key}>
                  <div className="agent-relation-resource-head">
                    <Space size={8} wrap>
                      <span className="agent-relation-resource-icon"><ToolOutlined /></span>
                      <Text className="agent-relation-resource-name">{item.name}</Text>
                      <Tag color="blue">{item.type}</Tag>
                      {statusTag(item.status)}
                      {checked ? <Tag color="success">已选择</Tag> : null}
                    </Space>
                    <Button size="small" type={checked ? "default" : "primary"} onClick={() => toggleSkillToolSelection(item.key)}>
                      {checked ? "移除" : "选择"}
                    </Button>
                  </div>
                  <Text type="secondary" className="agent-relation-resource-desc">{item.description}</Text>
                  <div className="agent-relation-resource-meta">
                    <div><Text type="secondary">适用场景</Text><Text>{item.scenario}</Text></div>
                    <div><Text type="secondary">输入摘要</Text><Text>{item.input}</Text></div>
                    <div><Text type="secondary">输出摘要</Text><Text>{item.output}</Text></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      );
    };
    return (
      <>
        <Space direction="vertical" size={16} className="page-stack ai-skill-page">
          <Card
            title={
              <PanelTitle
                title={`${configSkill.name || "新增Skill"} · 编辑`}
                desc="维护 Skill 的名称、提示词、知识库、工具和调试测试。"
                before={<Button icon={<ArrowLeftOutlined />} onClick={() => setConfigSkill(null)}>返回Skill管理</Button>}
                extra={<Button type="primary" icon={<CheckCircleOutlined />} onClick={saveConfigSkill}>保存Skill</Button>}
              />
            }
          >
          <Tabs
            items={[
              {
                key: "base",
                label: "基本信息",
                children: (
                  <Form
                    layout="vertical"
                    initialValues={normalizeSkillConfig(configSkill)}
                    onValuesChange={(_, values) => updateConfigSkill(values)}
                    className="ai-skill-edit-form"
                  >
                    <Row gutter={16}>
                      <Col span={12}><Form.Item label="Skill名称" name="name" rules={[{ required: true, message: "请输入Skill名称" }]}><Input placeholder="例如：定时总结用户基本信息" /></Form.Item></Col>
                      <Col span={12}><Form.Item label="能力类型" name="type"><Select options={skillEditTypeOptions} /></Form.Item></Col>
                      <Col span={12}><Form.Item label="输出类型" name="outputType"><Select options={skillOutputTypeOptions} placeholder="选择 Skill 默认输出类型" /></Form.Item></Col>
                      <Col span={12}><Form.Item label="默认输出去向" name="outputTargets"><Select mode="multiple" options={skillOutputTargetOptions} placeholder="选择默认输出去向" /></Form.Item></Col>
                      <Col span={24}><Form.Item label="Skill描述" name="description"><Input.TextArea rows={4} placeholder="简要说明该 Skill 的能力边界、复用价值和典型输出。" /></Form.Item></Col>
                      <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
                    </Row>
                  </Form>
                )
              },
              {
                key: "prompt",
                label: "Skill提示词",
                children: (
                  <Card size="small" title="Skill提示词" className="agent-config-card">
                    <SkillLogicRichEditor defaultValue={configSkill.prompt || ""} onChange={(value) => updateConfigSkill({ prompt: value })} />
                  </Card>
                )
              },
              {
                key: "knowledge",
                label: "关联知识库",
                children: (
                  <Space direction="vertical" size={16} className="full-width skill-relation-tab">
                    <Card
                      title={
                        <PanelTitle
                          title="已关联知识资源"
                          desc="选择该 Skill 可引用的知识库资源；可关联文件夹或具体资源文件，执行时按资源路径引用内容。"
                          extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setKnowledgePickerKeys(configSkill.knowledgeResourceKeys || []); setKnowledgePickerOpen(true); }}>添加知识资源</Button>}
                        />
                      }
                    >
                      <Table className="admin-table skill-knowledge-resource-table" rowKey="key" pagination={false} columns={[
                        { title: "资源名称", dataIndex: "name", width: 180 },
                        { title: "资源路径", dataIndex: "path", render: (value) => <Tooltip title={value} placement="topLeft"><Text className="skill-resource-path">{value}</Text></Tooltip> },
                        { title: "关联类型", dataIndex: "relationType", width: 92, render: (value) => <Tag color={value === "文件夹" ? "processing" : "blue"}>{value}</Tag> },
                        { title: "内容类型", dataIndex: "contentType", width: 112 },
                        { title: "状态", dataIndex: "status", width: 78, render: statusTag },
                        { title: "操作", dataIndex: "key", width: 72, render: (key) => <Button type="link" danger size="small" onClick={() => {
                          const nextKeys = (configSkill.knowledgeResourceKeys || []).filter((item) => item !== key);
                          updateConfigSkill({
                            knowledgeResourceKeys: nextKeys,
                            knowledgeBaseKeys: getKnowledgeBaseKeysFromResources(nextKeys)
                          });
                        }}>移除</Button> }
                      ]} dataSource={selectedKnowledgeResources} />
                    </Card>
                  </Space>
                )
              },
              {
                key: "tools",
                label: "关联工具",
                children: (
                  <Space direction="vertical" size={16} className="full-width skill-relation-tab">
                    <Card
                      className="agent-relation-config-card"
                      title={
                        <PanelTitle
                          title="已关联工具"
                          desc="选择该 Skill 可调用的工具；工具用于确定性的外部查询、通知、跳转和托管动作。"
                          extra={<Button type="primary" icon={<PlusOutlined />} onClick={openSkillToolPicker}>添加工具</Button>}
                        />
                      }
                    >
                      {selectedTools.length ? (
                        <Table className="admin-table agent-relation-table" rowKey="key" pagination={false} scroll={{ x: 1180 }} columns={[
                          { title: "名称", dataIndex: "name", width: 180 },
                          { title: "类型", dataIndex: "type", width: 110, render: (value) => <Tag color="blue">{value}</Tag> },
                          { title: "说明", dataIndex: "description", width: 260, render: (value) => <Text type="secondary" className="agent-relation-desc">{value}</Text> },
                          { title: "适用场景", dataIndex: "scenario", width: 220 },
                          { title: "状态", dataIndex: "status", width: 80, render: statusTag },
                          { title: "更新时间", dataIndex: "updatedAt", width: 160 },
                          { title: "操作", fixed: "right", width: 84, render: (_, record) => <Button type="link" size="small" danger onClick={() => removeSkillTool(record.key)}>移除</Button> }
                        ]} dataSource={selectedTools} />
                      ) : (
                        <button type="button" className="agent-relation-empty" onClick={openSkillToolPicker}>
                          <span className="agent-relation-empty-icon"><ToolOutlined /></span>
                          <span className="agent-relation-empty-title">当前 Skill 暂未配置工具</span>
                          <span className="agent-relation-empty-desc">添加后，Skill 可在提示词允许的场景中调用对应工具。</span>
                          <span className="agent-relation-empty-action">添加工具</span>
                        </button>
                      )}
                    </Card>
                  </Space>
                )
              },
              {
                key: "debug",
                label: "调试测试",
                children: (
                  <Card size="small" title="调试测试" className="agent-config-card">
                    <Space direction="vertical" size={12} className="full-width">
                      <Input.TextArea rows={6} placeholder="输入模拟客户资料、聊天记录或阶段上下文，用于测试 Skill 输出。" />
                      <Space>
                        <Button type="primary">运行测试</Button>
                        <Button>清空</Button>
                      </Space>
                    </Space>
                  </Card>
                )
              }
            ]}
          />
          </Card>
        </Space>
        <KnowledgeResourcePickerModal
          open={knowledgePickerOpen}
          selectedKeys={knowledgePickerKeys}
          onSelectedChange={setKnowledgePickerKeys}
          onClose={() => setKnowledgePickerOpen(false)}
          onOk={saveKnowledgeResources}
        />
        {renderSkillToolPickerModal()}
      </>
    );
  }
  return (
    <Space direction="vertical" size={16} className="page-stack ai-skill-page">
      <Card>
        <div className="toolbar compact-card-toolbar">
          <Space wrap>
            <Select defaultValue="全部能力类型" options={skillTypeOptions} />
            <Select defaultValue="全部状态" options={statusOptions} />
            <Input placeholder="搜索Skill名称或描述" allowClear className="strategy-search-input" />
            <Button type="primary">搜索</Button>
            <Button>重置</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setConfigSkill(createDraft())}>新增Skill</Button>
        </div>
        <Table className="admin-table ai-skill-table" rowKey="key" columns={columns} dataSource={rows} pagination={false} scroll={{ x: 994 }} />
      </Card>
    </Space>
  );
}

export default AISkillPage;
