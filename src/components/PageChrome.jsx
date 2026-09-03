import React from "react";
import { Space, Tag, Typography } from "antd";

const { Text, Title } = Typography;

export function statusTag(status) {
  if (status === "启用" || status === "已连接" || status === true) return <Tag color="success">启用</Tag>;
  if (status === "停用" || status === false) return <Tag>停用</Tag>;
  return <Tag color="processing">{status}</Tag>;
}

export function PanelTitle({ title, desc, extra, before }) {
  return (
    <div className="panel-title">
      <div className={before ? "panel-title-main with-before" : "panel-title-main"}>
        {before ? <div className="panel-title-before">{before}</div> : null}
        <div>
          <Title level={4}>{title}</Title>
          {desc ? <Text type="secondary">{desc}</Text> : null}
        </div>
      </div>
      {extra ? <Space wrap>{extra}</Space> : null}
    </div>
  );
}
