import React, { useState } from "react";
import { App, Button, Collapse, Input, InputNumber, Modal, Popconfirm, Radio, Select, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { appendIntentTier, removeIntentTier, defaultIntentRules, describeIntentRule, evaluateIntentRules, intentNumberOperators, intentRuleFields, validateIntentRules } from "../data/intentRules";
import { intentAnalysisUsers } from "../data/intentAnalysisData";

const { Text, Paragraph } = Typography;
let sequence = 0;
const nextId = () => `intent-condition-${Date.now()}-${++sequence}`;
const newCondition = () => ({ id: nextId(), field: "chatCount", operator: "gt", value: 20 });

export default function IntentRuleEditor({ value, onChange }) {
  const { message } = App.useApp();
  const [previewRows, setPreviewRows] = useState(null);
  const [activeKeys, setActiveKeys] = useState([String(value.length)]);
  const highestLevel = Math.max(...value.map((rule) => rule.level));
  const addTier = () => {
    if (value.length >= 5) return;
    const next = appendIntentTier(value);
    onChange(next);
    setActiveKeys([String(next.length)]);
  };
  const deleteTier = (level) => {
    if (value.length <= 3) return;
    const next = removeIntentTier(value, level);
    onChange(next);
    setActiveKeys([String(next.length)]);
    message.info("已删除档位并连续编号，请检查其余档位条件是否覆盖完整");
  };
  const updateRule = (level, changes) => onChange(value.map((rule) => rule.level === level ? { ...rule, ...changes } : rule));
  const updateGroup = (rule, groupId, changes) => updateRule(rule.level, { groups: rule.groups.map((group) => group.id === groupId ? { ...group, ...changes } : group) });
  const updateCondition = (rule, group, id, changes) => updateGroup(rule, group.id, { conditions: group.conditions.map((condition) => condition.id === id ? { ...condition, ...changes } : condition) });
  const preview = () => {
    const error = validateIntentRules(value);
    if (error) return message.warning(error);
    setPreviewRows(intentAnalysisUsers.map((user) => {
      const result = evaluateIntentRules(user.metrics, value);
      return { ...user, result, matchedRule: value.find((rule) => rule.level === result.level) };
    }));
  };

  return (
    <section aria-label="意向分档规则">
      <div className="intent-rule-section-head">
        <Space><Text strong className="user-insight-config-section-title">意向分档规则</Text><Tag>{value.length} / 5 档</Tag></Space>
        <Space wrap>
          <Button icon={<PlusOutlined />} disabled={value.length >= 5} onClick={addTier}>新增档位</Button>
          <Popconfirm title="恢复默认分档规则？" description="将恢复为5档，并替换本页尚未保存的分档设置。" onConfirm={() => { onChange(JSON.parse(JSON.stringify(defaultIntentRules))); setActiveKeys(["5"]); }} okText="恢复" cancelText="取消"><Button icon={<ReloadOutlined />}>恢复默认规则</Button></Popconfirm>
          <Button onClick={preview}>预览分档结果</Button>
        </Space>
      </div>
      <Collapse className="intent-rule-collapse" activeKey={activeKeys} onChange={setActiveKeys} items={value.slice().sort((a, b) => b.level - a.level).map((rule) => ({
        key: String(rule.level),
        label: <div className="intent-rule-header">
          <div className="intent-rule-overview">
            <div className="intent-rule-overview-title"><Tag color={rule.color}>{rule.level}档</Tag><span className="intent-rule-overview-name" title={rule.label}>{rule.label || "未命名档位"}</span></div>
            <div className="intent-rule-overview-meta"><span>{rule.mode === "prompt" ? "提示词配置" : `${rule.groups.reduce((sum, group) => sum + group.conditions.length, 0)} 个条件`}</span>{rule.level >= highestLevel - 1 ? <Tag color="red">重点跟进</Tag> : null}</div>
          </div>
        </div>,
        extra: <span onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}><Popconfirm title={`删除${rule.level}档？`} description="该档条件将删除，其余档位将按低到高重新编号。" disabled={value.length <= 3} onConfirm={() => deleteTier(rule.level)} okText="删除" cancelText="取消"><Button type="text" danger icon={<DeleteOutlined />} disabled={value.length <= 3} aria-label={`删除${rule.level}档`}>删除此档位</Button></Popconfirm></span>,
        children: <div className="intent-rule-body">
          <div className="intent-rule-meta intent-rule-meta-single">
            <label><Text>档位名称</Text><Input aria-label={`${rule.level}档名称`} value={rule.label} maxLength={20} onChange={(event) => updateRule(rule.level, { label: event.target.value })} placeholder="请输入档位名称" /></label>
          </div>
          <div className="intent-rule-mode">
            <Text>配置方式</Text>
            <Radio.Group aria-label={`${rule.level}档配置方式`} optionType="button" buttonStyle="solid" value={rule.mode || "conditions"} options={[{ label: "条件配置", value: "conditions" }, { label: "提示词配置", value: "prompt" }]} onChange={(event) => updateRule(rule.level, { mode: event.target.value })} />
          </div>
          {rule.mode === "prompt" ? <div className="intent-rule-prompt">
            <Text strong>分档提示词</Text>
            <Input.TextArea aria-label={`${rule.level}档分档提示词`} value={rule.prompt || ""} maxLength={5000} showCount autoSize={{ minRows: 5, maxRows: 12 }} placeholder="请描述本档位的判定标准。例如：家长主动询问儿童心理支持服务的费用，并明确希望预约进一步沟通。请结合客户原话判断，证据不足时标记待补充。" onChange={(event) => updateRule(rule.level, { prompt: event.target.value })} />
          </div> : rule.groups.map((group) => <div className="intent-rule-group" key={group.id}>
            <div className="intent-rule-group-head">
              <Space wrap><Text strong>分档条件</Text><Tag>全部满足（且）</Tag></Space>
              <Button type="link" icon={<PlusOutlined />} onClick={() => updateGroup(rule, group.id, { conditions: [...group.conditions, newCondition()] })}>添加条件</Button>
            </div>
            {group.conditions.map((condition) => {
              const field = intentRuleFields.find((item) => item.value === condition.field);
              return <div className="intent-rule-condition" key={condition.id}>
                <Select aria-label="判断字段" value={condition.field} options={intentRuleFields.map(({ value: fieldValue, label }) => ({ value: fieldValue, label }))} onChange={(fieldValue) => {
                  const nextField = intentRuleFields.find((item) => item.value === fieldValue);
                  updateCondition(rule, group, condition.id, { field: fieldValue, operator: nextField.type === "boolean" ? "eq" : "gte", value: nextField.type === "boolean" ? true : 1 });
                }} />
                {field?.type === "boolean" ? <><Select aria-label="比较关系" value="eq" options={[{ value: "eq", label: "是否满足" }]} disabled /><Select aria-label="判断值" value={typeof condition.value === "boolean" ? String(condition.value) : undefined} options={[{ value: "true", label: "是" }, { value: "false", label: "否" }]} onChange={(nextValue) => updateCondition(rule, group, condition.id, { value: nextValue === "true" })} /></> : <><Select aria-label="比较关系" value={condition.operator} options={intentNumberOperators} onChange={(operator) => updateCondition(rule, group, condition.id, { operator })} /><InputNumber aria-label="条件阈值" min={0} precision={field?.integer ? 0 : 2} value={condition.value} addonAfter={field?.unit} onChange={(nextValue) => updateCondition(rule, group, condition.id, { value: nextValue })} /></>}
                <Button danger type="text" icon={<DeleteOutlined />} disabled={group.conditions.length === 1} aria-label="删除条件" onClick={() => updateGroup(rule, group.id, { conditions: group.conditions.filter((item) => item.id !== condition.id) })} />
              </div>;
            })}
          </div>)}
        </div>
      }))} />
      <Modal title="分档结果预览" open={Boolean(previewRows)} onCancel={() => setPreviewRows(null)} footer={null} width={860}>
        <Paragraph type="secondary">使用 {intentAnalysisUsers.length} 名演示用户验证当前分档规则，未保存的修改也会参与预览；此处不执行实际生成任务。</Paragraph>
        <Space wrap className="intent-rule-preview-counts">
          {value.slice().sort((a, b) => b.level - a.level).map((rule) => <Tag color={rule.color} key={rule.level}>{rule.level}档 · {previewRows?.filter((row) => row.result.level === rule.level).length || 0}人</Tag>)}
          <Tag>待判断 / 待补充 / 未匹配 · {previewRows?.filter((row) => row.result.level === null).length || 0}人</Tag>
        </Space>
        <Table size="small" rowKey="id" dataSource={previewRows || []} pagination={{ pageSize: 6, showSizeChanger: false }} scroll={{ x: 620 }} columns={[
          { title: "用户", dataIndex: "name", width: 100 },
          { title: "分档结果", key: "result", width: 160, render: (_, row) => row.matchedRule ? <Tag color={row.matchedRule.color}>{row.matchedRule.level}档 · {row.matchedRule.label}</Tag> : <Tag color="warning">{row.result.status === "pending" ? "待 AI 判断" : row.result.status === "missing" ? "待补充数据" : "未匹配"}</Tag> },
          { title: "规则说明", key: "reason", render: (_, row) => <span className="intent-rule-preview-reason">{row.result.reason}</span> }
        ]} />
      </Modal>
    </section>
  );
}
