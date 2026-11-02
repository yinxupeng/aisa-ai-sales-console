import React, { useState } from "react";
import { Button, Segmented, Tabs, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import IntentAnalysisConfigPage from "./IntentAnalysisConfigPage";
import IntentChatConfigPage from "./IntentChatConfigPage";

export default function IntentConfigComparisonPage({ initialConfig, onSave, onBack }) {
  const [activeKey, setActiveKey] = useState("form");
  const renderHeader = (actions) => <header className="intent-config-toolbar">
    <div className="intent-config-toolbar-main">
      <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回意向度分析" title="返回意向度分析" onClick={onBack} />
      <Typography.Title level={4}>意向度配置</Typography.Title>
      <Segmented aria-label="切换配置方案" value={activeKey} onChange={setActiveKey} options={[{ value: "form", label: "方案一：表单配置" }, { value: "chat", label: "方案二：AI 对话配置" }]} />
    </div>
    <div className="intent-config-toolbar-actions">{actions}</div>
  </header>;
  return <div className="intent-config-comparison"><Tabs activeKey={activeKey} renderTabBar={() => null} destroyOnHidden={false} items={[
    { key: "form", label: "方案一：表单配置", children: <IntentAnalysisConfigPage initialConfig={initialConfig} onSave={onSave} onBack={onBack} renderHeader={renderHeader} /> },
    { key: "chat", label: "方案二：AI 对话配置", children: <IntentChatConfigPage onBack={onBack} renderHeader={renderHeader} /> }
  ]} /></div>;
}
