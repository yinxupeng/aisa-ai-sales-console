import React from "react";
import { Tabs } from "antd";

import IntentAnalysisPage from "./IntentAnalysisPage";
import DailyReportPage from "./DailyReportPage";

export default function HumanCollaborationPage({ onViewConversation = () => {} }) {
  return (
    <div className="human-collaboration-page">
      <Tabs
        className="human-collaboration-tabs"
        defaultActiveKey="intent"
        items={[
          {
            key: "intent",
            label: "用户意向度分析",
            children: <IntentAnalysisPage onViewConversation={onViewConversation} />
          },
          {
            key: "daily",
            label: "用户沟通日报",
            children: <DailyReportPage onViewConversation={onViewConversation} />
          },
          {
            key: "insight",
            label: "用户洞察与建议",
            children: null
          }
        ]}
      />
    </div>
  );
}
