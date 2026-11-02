import React from "react";
import { CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { salesAssistantSteps } from "../data/salesAssistantProgress";

export default function SalesAssistantProgress({ stage, text }) {
  return <div className="sales-assistant-progress">
    <div className="sales-assistant-progress-label">分析过程 <span>演示</span></div>
    <ol>{salesAssistantSteps.map((step, index) => <li className={index < stage ? "done" : index === stage ? "current" : "waiting"} key={step.title}>
      {index < stage ? <CheckCircleFilled /> : index === stage ? <LoadingOutlined spin /> : <span className="sales-assistant-progress-dot" />}
      <div><strong>{step.title}</strong>{index === stage ? <p role="status">{step.description}</p> : null}</div>
    </li>)}</ol>
    {text ? <div className="sales-assistant-stream">{text}<span className="sales-assistant-stream-cursor" /></div> : null}
  </div>;
}
