import React, { useState } from "react";
import { Button, Card, Checkbox, Col, Form, Row, Select, Space, TimePicker, Typography } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { aiSkills } from "../data/appData";

const { Paragraph, Text, Title } = Typography;
const skillOptions = aiSkills.filter((item) => ["用户画像总结", "推品时机判断", "回复合规检查"].includes(item.name));
const userStageOptions = ["全部阶段", "开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];
const hostingStatusOptions = ["不限", "已托管", "未托管"];
const chatThresholdOptions = ["不限", ...Array.from({ length: 20 }, (_, index) => `大于${index + 1}条`)];

export const defaultConfig = {
  scheduleMode: "daily",
  scheduleTime: "18:00",
  dailyTimes: ["18:00"],
  dailyRunCount: "1",
  scope: "当前企微账号下全部用户",
  userStage: "全部阶段",
  hostingStatus: "不限",
  validChatRule: "不限",
  historicalChatThreshold: "不限",
  todayChatThreshold: "不限",
  dataSources: ["用户档案", "历史聊天记录"],
  summarySkillKey: "aiskill-1",
  insightSkillKey: "aiskill-1"
};

export default function UserInsightConfigPage({ onBack = () => {}, initialConfig = defaultConfig, onSave = () => {} }) {
  const initialScheduleTime = /^\d{1,2}:\d{2}$/.test(initialConfig.scheduleTime || "") ? initialConfig.scheduleTime : defaultConfig.scheduleTime;
  const initialDailyTimes = Array.isArray(initialConfig.dailyTimes) && initialConfig.dailyTimes.length
    ? initialConfig.dailyTimes.filter((time) => /^\d{1,2}:\d{2}$/.test(time))
    : [initialScheduleTime];
  const normalizedInitialDailyTimes = initialDailyTimes.length ? initialDailyTimes.slice(0, 2) : [defaultConfig.scheduleTime];
  if (initialConfig.dailyRunCount === "2" && normalizedInitialDailyTimes.length === 1) normalizedInitialDailyTimes.push(normalizedInitialDailyTimes[0]);
  const [config, setConfig] = useState({ ...defaultConfig, ...initialConfig, scheduleMode: "daily", scheduleTime: initialScheduleTime, dailyTimes: normalizedInitialDailyTimes, dailyRunCount: initialConfig.dailyRunCount === "2" || initialDailyTimes.length > 1 ? "2" : "1", dataSources: ["用户档案", "历史聊天记录"] });
  const normalizedScheduleTime = /^\d{1,2}:\d{2}$/.test(config.scheduleTime || "") ? config.scheduleTime : defaultConfig.scheduleTime;
  const toTimeValue = (time) => {
    const [hour, minute] = (time || defaultConfig.scheduleTime).split(":").map(Number);
    return dayjs().hour(hour).minute(minute).second(0);
  };
  const dailyTimes = config.dailyTimes?.length ? config.dailyTimes : [normalizedScheduleTime];
  const updateDailyRunCount = (value) => {
    const targetCount = value === "2" ? 2 : 1;
    const paddedTimes = [...dailyTimes];
    while (paddedTimes.length < targetCount) paddedTimes.push(paddedTimes[paddedTimes.length - 1] || "18:00");
    const nextTimes = paddedTimes.slice(0, targetCount);
    update("dailyRunCount", value);
    update("dailyTimes", nextTimes);
    update("scheduleTime", nextTimes[0]);
  };
  const updateDailyTime = (index, value) => {
    const nextTimes = dailyTimes.map((time, timeIndex) => timeIndex === index ? value : time);
    update("dailyTimes", nextTimes);
    update("scheduleTime", nextTimes[0]);
  };
  const dailyPreview = dailyTimes.join("、");
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
        <Space><Button type="primary" icon={<SaveOutlined />} onClick={save}>保存配置</Button></Space>
      </div>
      <Card className="user-insight-config-card">
        <section aria-label="选择执行节奏">
        <Text strong className="user-insight-config-section-title">选择执行节奏</Text>
        <Row gutter={20}>
          <Col xs={24} md={5}><Form.Item label="执行节奏"><Text strong>每天执行</Text></Form.Item></Col>
          <Col xs={24} md={5}><Form.Item label="每日执行次数"><Select value={config.dailyRunCount} onChange={updateDailyRunCount} options={[{ value: "1", label: "每天 1 次" }, { value: "2", label: "每天 2 次" }]} /></Form.Item></Col>
          {dailyTimes.map((time, index) => <Col xs={24} md={5} key={`daily-time-${index}`}><Form.Item label={dailyTimes.length > 1 ? `执行时间 ${index + 1}` : "执行时间"}><TimePicker className="user-insight-daily-time-picker" value={toTimeValue(time)} format="HH:mm" minuteStep={5} onChange={(value) => updateDailyTime(index, value ? value.format("HH:mm") : "18:00")} /></Form.Item></Col>)}
        </Row>
        <div className="user-insight-schedule-preview"><Text type="secondary">执行预览：</Text><Text strong>{`每天 ${dailyPreview}`}</Text></div>
        </section>
        <div className="user-insight-config-divider" />
        <section aria-label="分析用户范围">
          <Text strong className="user-insight-config-section-title">分析用户范围</Text>
          <Row gutter={16}>
            <Col xs={24} md={12}><Form.Item label="用户阶段"><Select value={config.userStage} onChange={(value) => update("userStage", value)} options={userStageOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="托管状态"><Select value={config.hostingStatus} onChange={(value) => update("hostingStatus", value)} options={hostingStatusOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="历史聊天数"><Select value={config.historicalChatThreshold} onChange={(value) => update("historicalChatThreshold", value)} options={chatThresholdOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="当天聊天数"><Select value={config.todayChatThreshold} onChange={(value) => update("todayChatThreshold", value)} options={chatThresholdOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
          </Row>
        </section>
        <Form.Item label="分析用户数据来源"><Checkbox.Group value={config.dataSources} options={["用户档案", "历史聊天记录"].map((value) => ({ value, label: value, disabled: true }))} /></Form.Item>
        <div className="user-insight-config-divider" />
        <section aria-label="选择分析的skill">
        <Text strong className="user-insight-config-section-title">选择分析的skill</Text>
        <Row gutter={20}>
          <Col xs={24} md={12}>
            <Form.Item label="聊天总结"><Select value={config.summarySkillKey} onChange={(value) => update("summarySkillKey", value)} options={skillOptions.map((item) => ({ value: item.key, label: item.name }))} /></Form.Item>
            <Text type="secondary">{skillOptions.find((item) => item.key === config.summarySkillKey)?.description}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="用户洞察"><Select value={config.insightSkillKey} onChange={(value) => update("insightSkillKey", value)} options={skillOptions.map((item) => ({ value: item.key, label: item.name }))} /></Form.Item>
            <Text type="secondary">{skillOptions.find((item) => item.key === config.insightSkillKey)?.description}</Text>
          </Col>
        </Row>
        <div className="user-insight-skill-boundary"><Text type="secondary">生成边界由所选 Skill 负责：涉及心理、情绪、家庭冲突或风险表达时，只输出沟通建议和人工介入提示，不做医疗诊断，不承诺疗效。</Text></div>
        </section>
      </Card>
    </div>
  );
}
