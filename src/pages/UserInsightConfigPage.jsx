import React, { useState } from "react";
import { Button, Card, Checkbox, Col, Divider, Form, Input, Row, Select, Space, Switch, Tag, Typography } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;

export const defaultConfig = {
  taskName: "儿童心理健康用户综合洞察",
  scheduleTime: "每天18:00",
  scope: "当前企微账号下全部用户",
  validChatRule: "用户至少有1条回复消息",
  dataSources: ["用户档案", "历史聊天记录", "课程到课记录", "用户标签"],
  outputContent: ["用户背景", "聊天总结", "用户洞察", "关键风险", "销售建议", "提示词摘要"],
  prompt: "请综合分析用户档案、历史聊天、课程到课和标签信息，输出面向人工跟进的用户洞察。必须区分事实与推断，说明用户当前阶段、核心诉求、沟通风险和建议行动；涉及心理健康风险时不得做诊断或承诺疗效，必要时提示人工专业人员介入。",
  enabled: true
};

export default function UserInsightConfigPage({ onBack = () => {}, initialConfig = defaultConfig, onSave = () => {} }) {
  const [config, setConfig] = useState(initialConfig);
  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));
  const save = () => {
    onSave(config);
    onBack({ saved: true, config });
  };
  return (
    <div className="user-insight-config-page">
      <div className="user-insight-config-header">
        <div>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => onBack()}>返回洞察结果</Button>
          <Title level={3}>洞察生成配置</Title>
          <Paragraph type="secondary">配置完成后，系统每天按照当前逻辑生成用户洞察与建议内容。</Paragraph>
        </div>
        <Space><Tag color={config.enabled ? "green" : "default"}>{config.enabled ? "已启用" : "已停用"}</Tag><Button type="primary" icon={<SaveOutlined />} onClick={save}>保存配置</Button></Space>
      </div>
      <Card className="user-insight-config-card" title="1. 基础信息">
        <Row gutter={20}>
          <Col xs={24} md={12}><Form.Item label="任务名称"><Input value={config.taskName} onChange={(event) => update("taskName", event.target.value)} /></Form.Item></Col>
          <Col xs={24} md={6}><Form.Item label="执行时间"><Select value={config.scheduleTime} onChange={(value) => update("scheduleTime", value)} options={["每天18:00", "每天09:00", "每周一18:00"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
          <Col xs={24} md={6}><Form.Item label="任务状态"><Switch checked={config.enabled} checkedChildren="启用" unCheckedChildren="停用" onChange={(value) => update("enabled", value)} /></Form.Item></Col>
        </Row>
      </Card>
      <Card className="user-insight-config-card" title="2. 分析范围与数据来源">
        <Form.Item label="分析人群范围"><Select value={config.scope} onChange={(value) => update("scope", value)} options={["当前企微账号下全部用户"].map((value) => ({ value, label: value }))} /></Form.Item>
        <Form.Item label="有效聊天口径"><Select value={config.validChatRule} onChange={(value) => update("validChatRule", value)} options={["用户至少有1条回复消息", "用户当天至少回复1条消息"].map((value) => ({ value, label: value }))} /></Form.Item>
        <Form.Item label="数据来源"><Checkbox.Group value={config.dataSources} onChange={(value) => update("dataSources", value)} options={["用户档案", "历史聊天记录", "课程到课记录", "用户标签"].map((value) => ({ value, label: value }))} /></Form.Item>
      </Card>
      <Card className="user-insight-config-card" title="3. 输出内容">
        <Paragraph type="secondary">以下字段将生成到“用户洞察与建议”列表中，供人工快速了解用户情况。</Paragraph>
        <Checkbox.Group value={config.outputContent} onChange={(value) => update("outputContent", value)} options={["用户背景", "聊天总结", "用户洞察", "关键风险", "销售建议", "提示词摘要"].map((value) => ({ value, label: value }))} />
      </Card>
      <Card className="user-insight-config-card" title="4. 生成提示词">
        <Input.TextArea value={config.prompt} onChange={(event) => update("prompt", event.target.value)} rows={9} showCount maxLength={1200} />
        <Divider />
        <Text type="secondary">安全边界：涉及心理、情绪、家庭冲突或风险表达时，只输出沟通建议和人工介入提示，不做医疗诊断，不承诺疗效。</Text>
      </Card>
    </div>
  );
}
