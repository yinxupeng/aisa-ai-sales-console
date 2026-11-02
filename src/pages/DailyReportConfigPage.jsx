import React, { useState } from "react";
import { App, Button, Card, Checkbox, Col, Form, Row, Select, TimePicker, Typography } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { aiSkills } from "../data/appData";
import { TaskConfigHeader, TaskEnableSwitch } from "../components/TaskConfigChrome";
import WecomRoleSelect from "../components/WecomRoleSelect";

const { Title, Paragraph, Text } = Typography;
const stageOptions = ["全部阶段", "开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];
const thresholds = ["不限", ...Array.from({ length: 20 }, (_, index) => `大于${index + 1}条`)];
const skillOptions = aiSkills.filter((item) => ["用户画像总结", "回复合规检查"].includes(item.name));
export const dailyReportDataSources = ["用户档案", "统计周期内聊天记录"];

export const defaultDailyReportConfig = {
  scheduleEnabled: false,
  wecomRole: "all",
  dailyTimes: ["18:00"],
  userStage: "全部阶段",
  hostingStatus: "不限",
  historicalChatThreshold: "不限",
  todayChatThreshold: "不限",
  summarySkillKey: skillOptions.find((item) => item.name === "用户画像总结")?.key
};

export const getDailyReportScheduleLabel = (config) => `每天 ${config.dailyTimes.join("、")}`;
export const getDailyReportScopeLabel = (config) => {
  const scope = config.userStage === "全部阶段" ? "当前企微账号下所有用户" : `当前企微账号下${config.userStage}用户`;
  return `${config.hostingStatus === "不限" ? scope : `${scope} · ${config.hostingStatus}`}${!config.wecomRole || config.wecomRole === "all" ? "" : ` · 企微角色：${config.wecomRole}`}`;
};

export default function DailyReportConfigPage({ initialConfig, onSave, onBack }) {
  const { message } = App.useApp();
  const [config, setConfig] = useState(() => ({ ...defaultDailyReportConfig, ...initialConfig }));
  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (config.dailyTimes.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time || ""))) return message.warning("请选择完整的执行时间");
    if (new Set(config.dailyTimes).size !== config.dailyTimes.length) return message.warning("两次执行时间不能相同");
    if (!skillOptions.some((item) => item.key === config.summarySkillKey)) return message.warning("请选择有效的日报总结 Skill");
    onSave({ ...config, dailyTimes: config.dailyTimes.slice().sort() });
    message.success("用户沟通日报配置已保存");
    onBack();
  };

  return (
    <div className="user-insight-config-page">
      <TaskConfigHeader title="沟通日报配置" backLabel="返回用户沟通日报" onBack={onBack} actions={<Button type="primary" icon={<SaveOutlined />} onClick={save}>保存配置</Button>} />
      <Card className="user-insight-config-card" title="执行与分析范围" extra={<TaskEnableSwitch checked={config.scheduleEnabled} onChange={(value) => update("scheduleEnabled", value)} tooltip="保存后生效；关闭仅停止后续定时分析，配置与历史结果保留。" />}>
        <section aria-label="选择执行节奏">
          <Text strong className="user-insight-config-section-title">选择执行节奏</Text>
          <Row gutter={20}>
            <Col xs={24} md={5}><Form.Item label="执行节奏"><Text strong>每天执行</Text></Form.Item></Col>
            <Col xs={24} md={5}><Form.Item label="每日执行次数"><Select value={config.dailyTimes.length} options={[{ value: 1, label: "每天 1 次" }, { value: 2, label: "每天 2 次" }]} onChange={(count) => update("dailyTimes", count === 1 ? [config.dailyTimes[0]] : [config.dailyTimes[0], config.dailyTimes[0] === "09:00" ? "18:00" : "09:00"])} /></Form.Item></Col>
            {config.dailyTimes.map((time, index) => <Col xs={24} md={6} key={index}><Form.Item label={config.dailyTimes.length === 1 ? "执行时间" : `执行时间 ${index + 1}`}><TimePicker allowClear={false} format="HH:mm" minuteStep={5} value={time ? dayjs(`2000-01-01T${time}:00`) : null} onChange={(value) => update("dailyTimes", config.dailyTimes.map((item, position) => position === index ? value?.format("HH:mm") : item))} /></Form.Item></Col>)}
          </Row>
          <div className="user-insight-schedule-preview"><Text type="secondary">执行预览：</Text><Text strong>{getDailyReportScheduleLabel(config)}</Text></div>
          <Paragraph type="secondary" style={{ marginTop: 12 }}>每次统计上一次计划执行时间到本次执行时间的沟通；默认统计昨天 18:00 至今天 18:00。</Paragraph>
        </section>
        <div className="user-insight-config-divider" />
        <section aria-label="分析用户范围">
          <Text strong className="user-insight-config-section-title">分析用户范围</Text>
          <Row gutter={16}>
            <Col xs={24} md={12}><Form.Item label="企微角色"><WecomRoleSelect value={config.wecomRole} onChange={(value) => update("wecomRole", value)} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="用户阶段"><Select value={config.userStage} onChange={(value) => update("userStage", value)} options={stageOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="托管状态"><Select value={config.hostingStatus} onChange={(value) => update("hostingStatus", value)} options={["不限", "已托管", "未托管"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="历史聊天数"><Select value={config.historicalChatThreshold} onChange={(value) => update("historicalChatThreshold", value)} options={thresholds.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="当天聊天数"><Select value={config.todayChatThreshold} onChange={(value) => update("todayChatThreshold", value)} options={thresholds.map((value) => ({ value, label: value }))} /></Form.Item></Col>
          </Row>
          <Paragraph type="secondary">仅为统计周期内有客户回复的用户生成对话总结；“不限”仍保留这一条件。当天聊天数统计本周期内客户发送的消息。</Paragraph>
        </section>
        <Form.Item label="分析用户数据来源"><Checkbox.Group value={dailyReportDataSources} options={dailyReportDataSources.map((value) => ({ value, label: value, disabled: true }))} /></Form.Item>
        <div className="user-insight-config-divider" />
        <section aria-label="选择分析的skill">
          <Text strong className="user-insight-config-section-title">选择分析的skill</Text>
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <Form.Item label="日报对话总结"><Select value={config.summarySkillKey} onChange={(value) => update("summarySkillKey", value)} options={skillOptions.map((item) => ({ value: item.key, label: item.name }))} /></Form.Item>
              <Text type="secondary">{skillOptions.find((item) => item.key === config.summarySkillKey)?.description}</Text>
            </Col>
          </Row>
          <div className="user-insight-skill-boundary"><Text type="secondary">根据本周期沟通归纳家长诉求、孩子近况、沟通进展和跟进建议；不作医疗诊断、不承诺疗效。</Text></div>
        </section>
      </Card>
    </div>
  );
}
