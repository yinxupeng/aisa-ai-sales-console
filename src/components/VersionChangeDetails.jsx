import React from "react";
import { Empty, Tag, Typography } from "antd";
import { getVersionDiffFields, diffVersionText } from "../data/agentVersionDiff";
import { aiSkills, agentTools, knowledgeBases } from "../data/appData";

export default function VersionChangeDetails({ source, target, baselineLabel }) {
  const fields = getVersionDiffFields(source, target, (group, key) => {
    const catalog = group === "Skill" ? aiSkills : group === "工具关联" ? agentTools : knowledgeBases;
    return catalog.find((item) => item.key === key.replace(/^base:/, ""))?.name || key;
  });
  return <section className="version-note-section">
    <div className="version-note-section-head"><Typography.Text strong>改动对比</Typography.Text><Typography.Text type="secondary">{source ? `${fields.length} 项变化 · 仅展示差异` : "缺少基准快照"}</Typography.Text></div>
    {!source ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="此版本未保留基准配置，无法对比" /> : !fields.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="配置与基准版本一致" /> : <>
      <div className="version-diff-legend"><span><i className="before" />修改前 · {baselineLabel}</span><span><i className="after" />修改后 · {target.version}</span></div>
      {fields.map((field) => {
        const diff = diffVersionText(field.before, field.after);
        return <div className="version-diff-field" key={field.key}>
          <div className="version-diff-field-head"><Typography.Text strong>{field.label}</Typography.Text><Tag color={field.type === "新增" ? "green" : field.type === "移除" ? "red" : "blue"}>{field.type}</Tag></div>
          <div className="version-diff-grid">{["before", "after"].map((side) => <div className={`version-diff-value ${side}`} key={side}><div className="version-diff-value-label">{side === "before" ? "修改前" : "修改后"}</div><pre>{diff[side].length ? diff[side].map((part, index) => part.changed ? <mark key={index}>{part.text}</mark> : <React.Fragment key={index}>{part.text}</React.Fragment>) : <Typography.Text type="secondary">{side === "before" ? "原内容为空" : "内容已清空"}</Typography.Text>}</pre></div>)}</div>
        </div>;
      })}
    </>}
  </section>;
}
