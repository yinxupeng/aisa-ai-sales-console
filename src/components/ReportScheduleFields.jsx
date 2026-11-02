import React from "react";
import { Button, Form, Input, InputNumber, Select, Space, Switch, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { defaultReportSchedule, nextReportRun } from "../data/reportSchedules";

export default function ReportScheduleFields({ value, onChange }) {
  const config = value || defaultReportSchedule();
  const update = (patch) => onChange({ ...config, ...patch });
  return <div className="report-schedule-fields">
    <Form.Item label="任务状态"><Switch checked={config.enabled} checkedChildren="开启" unCheckedChildren="暂停" onChange={(enabled) => update({ enabled })} /></Form.Item>
    <Form.Item label="执行节奏"><Select value={config.frequency} onChange={(frequency) => update({ frequency })} options={[{ value: "daily", label: "每天" }, { value: "weekly", label: "每周" }, { value: "interval", label: "每隔几天" }]} /></Form.Item>
    {config.frequency === "weekly" ? <Form.Item label="执行日" required><Select mode="multiple" value={config.weekdays} onChange={(weekdays) => update({ weekdays })} options={[1, 2, 3, 4, 5, 6, 0].map((value) => ({ value, label: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][value] }))} /></Form.Item> : null}
    {config.frequency === "interval" ? <><Form.Item label="执行间隔"><Space>每<InputNumber min={1} max={30} precision={0} value={config.intervalDays} onChange={(intervalDays) => update({ intervalDays })} />天执行一次</Space></Form.Item><Form.Item label="开始日期" required><Input type="date" value={config.anchorDate} onChange={(event) => update({ anchorDate: event.target.value })} /></Form.Item></> : null}
    <Form.Item label="执行时间" required><Space direction="vertical" style={{ width: "100%" }}>{config.times.map((time, index) => <Space key={index}><Input aria-label={`执行时间${index + 1}`} type="time" value={time} onChange={(event) => update({ times: config.times.map((item, position) => position === index ? event.target.value : item) })} style={{ width: 150 }} />{config.times.length > 1 ? <Button type="link" danger onClick={() => update({ times: config.times.filter((_, position) => position !== index) })}>移除</Button> : null}</Space>)}<Button type="dashed" icon={<PlusOutlined />} disabled={config.times.length >= 6} onClick={() => update({ times: [...config.times, ""] })}>增加执行时间</Button></Space></Form.Item>
    <div className="report-schedule-next"><Typography.Text type="secondary">下次生成时间</Typography.Text><Typography.Text strong>{nextReportRun(config) || (config.enabled ? "请完善执行配置" : "已暂停")}</Typography.Text><Typography.Text type="secondary">时区：北京时间 UTC+8</Typography.Text></div>
    <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>按照保存的分析定义生成，每次保留独立结果，并更新报表的最近结果。原型支持配置与执行演示，后台定时调度尚未接入。</Typography.Paragraph>
  </div>;
}
