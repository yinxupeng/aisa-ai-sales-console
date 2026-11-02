import React from "react";
import { Button, Space, Switch, Tooltip, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

export function TaskConfigHeader({ title, backLabel, onBack, actions }) {
  return <header className="intent-config-toolbar">
    <div className="intent-config-toolbar-main">
      <Button type="text" icon={<ArrowLeftOutlined />} aria-label={backLabel} title={backLabel} onClick={onBack} />
      <Typography.Title level={4}>{title}</Typography.Title>
    </div>
    <div className="intent-config-toolbar-actions">{actions}</div>
  </header>;
}

export function TaskEnableSwitch({ label = "启用定时分析", checked, onChange, tooltip }) {
  return <Space size={8}><Typography.Text>{label}</Typography.Text><Tooltip title={tooltip}><Switch aria-label={label} checked={checked === true} checkedChildren="开启" unCheckedChildren="关闭" onChange={onChange} /></Tooltip></Space>;
}
