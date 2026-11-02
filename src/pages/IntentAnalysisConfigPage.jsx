import React, { useState } from "react";
import { App, Button, Card, Checkbox, Col, Form, Row, Select, Space, Switch, TimePicker, Typography } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { aiSkills } from "../data/appData";
import IntentRuleEditor from "../components/IntentRuleEditor";
import WecomRoleSelect from "../components/WecomRoleSelect";
import { defaultIntentRules, simplifyIntentRules, validateIntentRules } from "../data/intentRules";
export { getNextAnalysisRun as getIntentNextRun } from "../data/analysisSchedule";

const { Title, Paragraph, Text } = Typography;
const stageOptions = ["开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];
const thresholds = ["不限", ...Array.from({ length: 20 }, (_, index) => `大于${index + 1}条`)];
const skills = aiSkills.filter((item) => item.status === "启用" && ["用户意向度分析", "推品时机判断", "用户画像总结", "回复合规检查"].includes(item.name));
const sources = ["用户档案", "历史聊天记录", "课程到课记录"];

export const defaultIntentConfig = {
  scheduleEnabled: false,
  wecomRole: "all",
  rules: defaultIntentRules,
  ruleVersion: 1,
  dailyTimes: ["09:00"],
  userStages: ["第三节课", "第四节课", "第5节课"],
  hostingStatus: "不限",
  historicalChatThreshold: "不限",
  todayChatThreshold: "不限",
  analysisSkillKey: skills.find((item) => item.name === "用户意向度分析")?.key,
  followUpSkillKey: skills.find((item) => item.name === "用户画像总结")?.key
};

export const getIntentScheduleLabel = (config) => `每天 ${config.dailyTimes.join("、")}`;
export const getIntentScopeLabel = (config) => {
  const stages = config.userStages.length === stageOptions.length ? "全部阶段用户" : `当前处于${config.userStages.join("、")}的用户`;
  return `${stages}${config.hostingStatus === "不限" ? "" : ` · ${config.hostingStatus}`}${!config.wecomRole || config.wecomRole === "all" ? "" : ` · 企微角色：${config.wecomRole}`}`;
};

export default function IntentAnalysisConfigPage({ initialConfig = defaultIntentConfig, onSave, onBack, renderHeader }) {
  const { message } = App.useApp();
  const [config, setConfig] = useState(() => ({ ...defaultIntentConfig, ...initialConfig, rules: simplifyIntentRules(initialConfig.rules || defaultIntentRules) }));
  const update = (field, value) => setConfig((current) => ({ ...current, [field]: value }));
  const save = () => {
    if (!config.userStages.length) return message.warning("请至少选择一个用户阶段");
    if (config.dailyTimes.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time || ""))) return message.warning("请选择完整的执行时间");
    if (new Set(config.dailyTimes).size !== config.dailyTimes.length) return message.warning("两次执行时间不能相同");
    if (!skills.some((item) => item.key === config.analysisSkillKey) || !skills.some((item) => item.key === config.followUpSkillKey)) return message.warning("请选择有效的分析 Skill");
    const rulesError = validateIntentRules(config.rules);
    if (rulesError) return message.warning(rulesError);
    const rules = config.rules.map((rule) => ({ ...rule, label: rule.label.trim() }));
    const changed = JSON.stringify(rules) !== JSON.stringify(initialConfig.rules || defaultIntentRules);
    onSave({ ...config, rules, ruleVersion: (initialConfig.ruleVersion || 1) + (changed ? 1 : 0), dailyTimes: config.dailyTimes.slice().sort() });
    message.success(config.scheduleEnabled ? "配置已保存，定时分析已启用" : "配置已保存，定时分析已停用");
    onBack();
  };
  return (
    <div className="user-insight-config-page">
      {renderHeader ? renderHeader(<Button type="primary" icon={<SaveOutlined />} onClick={save}>保存配置</Button>) : <div className="user-insight-config-header">
        <div>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>返回意向度分析</Button>
          <Title level={3}>意向度分析配置</Title>
          <Paragraph type="secondary">配置执行时间、分析用户范围、意向分档规则和分析 Skill。</Paragraph>
        </div>
        <Button type="primary" icon={<SaveOutlined />} onClick={save}>保存配置</Button>
      </div>}
      <Card className="user-insight-config-card" title="执行与分析范围" extra={<Space><Text>启用定时分析</Text><Switch aria-label="方案一定时分析" checked={config.scheduleEnabled === true} checkedChildren="开启" unCheckedChildren="关闭" onChange={(enabled) => update("scheduleEnabled", enabled)} /></Space>}>
        <section aria-label="选择执行节奏">
          <Text strong className="user-insight-config-section-title">选择执行节奏</Text>
          <Row gutter={[20, 0]}>
            <Col xs={24} md={5}><Form.Item label="执行节奏"><Text strong>每天执行</Text></Form.Item></Col>
            <Col xs={24} md={5}><Form.Item label="每日执行次数"><Select value={config.dailyTimes.length} options={[{ value: 1, label: "每天 1 次" }, { value: 2, label: "每天 2 次" }]} onChange={(count) => update("dailyTimes", count === 1 ? [config.dailyTimes[0]] : [config.dailyTimes[0], config.dailyTimes[0] === "18:00" ? "09:00" : "18:00"])} /></Form.Item></Col>
            {config.dailyTimes.map((time, index) => <Col xs={24} md={6} key={index}><Form.Item label={config.dailyTimes.length === 1 ? "执行时间" : `执行时间 ${index + 1}`}><TimePicker allowClear={false} format="HH:mm" minuteStep={5} value={time ? dayjs(`2000-01-01T${time}:00`) : null} onChange={(value) => update("dailyTimes", config.dailyTimes.map((item, position) => position === index ? value?.format("HH:mm") : item))} /></Form.Item></Col>)}
          </Row>
          <div className="user-insight-schedule-preview"><Text type="secondary">执行预览：</Text><Text strong>{getIntentScheduleLabel(config)}</Text></div>
        </section>
        <div className="user-insight-config-divider" />
        <section aria-label="分析用户范围">
          <Text strong className="user-insight-config-section-title">分析用户范围</Text>
          <Row gutter={16}>
            <Col xs={24} md={12}><Form.Item label="企微角色"><WecomRoleSelect value={config.wecomRole} onChange={(value) => update("wecomRole", value)} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="用户阶段"><Select mode="multiple" value={config.userStages} onChange={(value) => update("userStages", value)} options={stageOptions.map((value) => ({ value, label: value }))} placeholder="请选择用户阶段" /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="托管状态"><Select value={config.hostingStatus} onChange={(value) => update("hostingStatus", value)} options={["不限", "已托管", "未托管"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="历史聊天数"><Select value={config.historicalChatThreshold} onChange={(value) => update("historicalChatThreshold", value)} options={thresholds.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="当天聊天数"><Select value={config.todayChatThreshold} onChange={(value) => update("todayChatThreshold", value)} options={thresholds.map((value) => ({ value, label: value }))} /></Form.Item></Col>
          </Row>
        </section>
        <Form.Item label="分析用户数据来源"><Checkbox.Group value={sources} options={sources.map((value) => ({ value, label: value, disabled: true }))} /></Form.Item>
        <div className="user-insight-config-divider" />
        <IntentRuleEditor value={config.rules} onChange={(rules) => update("rules", rules)} />
        <div className="user-insight-config-divider" />
        <section aria-label="选择分析的skill">
          <Text strong className="user-insight-config-section-title">选择分析的skill</Text>
          <Row gutter={[20, 16]}>
            {[{ field: "analysisSkillKey", label: "意向度分析" }, { field: "followUpSkillKey", label: "跟进策略与行动" }].map(({ field, label }) => <Col xs={24} md={12} key={field}>
              <Form.Item label={label}><Select value={config[field]} onChange={(value) => update(field, value)} options={skills.map((item) => ({ value: item.key, label: item.name }))} /></Form.Item>
              <Text type="secondary">{skills.find((item) => item.key === config[field])?.description}</Text>
            </Col>)}
          </Row>
          <div className="user-insight-skill-boundary"><Text type="secondary">程序按已保存的分档规则确定档位；Skill 识别询价、课后感受等聊天信号，并结合档位生成跟进建议。</Text></div>
        </section>
      </Card>
    </div>
  );
}
