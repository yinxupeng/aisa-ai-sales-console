import React, { useState } from "react";
import { App, Button, Card, Col, Form, InputNumber, Radio, Row, Select, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { autoFollowupStages, validateAutoConfig } from "../domain/autoFollowup";
import { autoFollowupSkillOptions, defaultAutoFollowupConfig } from "../data/autoFollowupData";
import { TaskConfigHeader, TaskEnableSwitch } from "../components/TaskConfigChrome";
import WecomRoleSelect from "../components/WecomRoleSelect";

const { Text } = Typography;
const selection = (values) => values.at(-1) === "all" ? ["all"] : values.filter((value) => value !== "all");

export default function AutoScheduledTaskConfigPage({ initialConfig = defaultAutoFollowupConfig, accountOptions = [], onSave = () => {}, onBack = () => {} }) {
  const { message } = App.useApp();
  const [config, setConfig] = useState(() => ({ wecomRole: "all", hostingStatus: "不限", ...structuredClone(initialConfig) }));
  const update = (field, value) => setConfig((current) => ({ ...current, [field]: value }));
  const save = () => {
    const error = validateAutoConfig(config, autoFollowupSkillOptions.map((option) => option.value));
    if (error) return message.warning(error);
    try { onSave(config); } catch (error) { message.warning(error.message); }
  };
  return <div className="user-insight-config-page auto-scheduled-config-page">
    <TaskConfigHeader title="自动定时任务配置" backLabel="返回自动定时任务" onBack={onBack} actions={<Button type="primary" icon={<SaveOutlined />} onClick={save}>保存配置</Button>} />
    <Card size="small" className="auto-config-section" title="用户范围" extra={<TaskEnableSwitch label="启用自动跟进" checked={config.enabled} onChange={(value) => update("enabled", value)} tooltip="保存后生效；关闭后暂停未发送的AI任务，不影响人工任务；重新开启时复核后恢复。" />}>
      <Form layout="horizontal" labelAlign="left" labelCol={{ flex: "160px" }} wrapperCol={{ flex: "auto" }} colon={false}>
        <Row gutter={20}>
          <Col xs={24} md={12}><Form.Item label="企微角色"><WecomRoleSelect value={config.wecomRole} onChange={(value) => update("wecomRole", value)} /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="所属企微账号" required><Select mode="multiple" maxTagCount="responsive" aria-label="所属企微账号" value={config.accountKeys} onChange={(value) => update("accountKeys", selection(value))} options={[{ value: "all", label: "全部企微账号" }, ...accountOptions]} placeholder="请选择企微账号" /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="用户阶段" required><Select mode="multiple" maxTagCount="responsive" aria-label="用户阶段" value={config.stages} onChange={(value) => update("stages", selection(value))} options={[{ value: "all", label: "全部阶段" }, ...autoFollowupStages.map((value) => ({ value, label: value }))]} placeholder="请选择用户阶段" /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="托管状态" tooltip="范围筛选不会绕过发送保护；未托管或人工接管的用户不自动发送消息。"><Select aria-label="托管状态" value={config.hostingStatus} onChange={(value) => update("hostingStatus", value)} options={["不限", "已托管", "未托管"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
        </Row>
        <Text type="secondary" className="auto-config-scope-note">仅对已开启 AI 托管且未被人工接管的用户生效；拒绝联系或出现风险信号时停止普通自动跟进。</Text>
      </Form>
    </Card>
    <Card size="small" className="auto-config-section" title="跟进策略">
      <Form layout="horizontal" labelAlign="left" labelCol={{ flex: "160px" }} wrapperCol={{ flex: "auto" }} colon={false}>
        <Row gutter={20}>
          <Col xs={24} md={12}><Form.Item label="用户沉默时长" required tooltip="用户最后一次回复后，达到此时长才触发 AI 判断；不保证生成任务。"><InputNumber aria-label="用户沉默时长" min={1} max={1440} precision={0} suffix="分钟" value={config.silenceMinutes} onChange={(value) => update("silenceMinutes", value)} /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="冲突保护间隔" required tooltip="与人工任务、事件任务及近期发送消息冲突时，AI 跟进主动避让。"><InputNumber aria-label="冲突保护间隔" min={1} max={1440} precision={0} suffix="分钟" value={config.protectionMinutes} onChange={(value) => update("protectionMinutes", value)} /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="发送方式"><Radio.Group optionType="button" buttonStyle="solid" aria-label="发送方式" value={config.sendMode} onChange={(event) => update("sendMode", event.target.value)} options={[{ value: "auto", label: "自动发送" }, { value: "review", label: "人工确认后发送" }]} /></Form.Item></Col>
        </Row>
      </Form>
      <div className="auto-config-safety"><Text strong>执行保护</Text><ul><li>每位用户最多一条待处理 AI 跟进，成功发送后未回复，不再追加。</li><li>人工任务优先；发送前重新检查风险、用户回复与任务冲突。</li><li>人工确认不绕过安全校验，原有系统发送限制继续生效。</li></ul></div>
    </Card>
    <Card size="small" className="auto-config-section" title="选择生成的skill">
      <Form layout="horizontal" labelAlign="left" labelCol={{ flex: "160px" }} wrapperCol={{ flex: "auto" }} colon={false}>
        <Row gutter={20}>
          <Col xs={24} md={12}><Form.Item label="跟进判断与话术规划" required><Select aria-label="跟进判断与话术规划 Skill" value={config.skillKey} onChange={(value) => update("skillKey", value)} options={autoFollowupSkillOptions} /></Form.Item></Col>
        </Row>
      </Form>
    </Card>
  </div>;
}
