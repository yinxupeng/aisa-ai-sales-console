import React from "react";
import { Button, Card, Input, Select, Space, Table, Tag, Typography } from "antd";
import WecomAvatar from "../components/WecomAvatar";
import { conversations } from "../data/conversations";
import { managedWecomAccounts } from "../data/appData";

const { Text, Title } = Typography;

function PanelTitle({ title, desc, extra, before }) {
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

function CustomersPage({ onViewConversation, visibleWecomKeys = managedWecomAccounts.map((item) => item.key) }) {
  const customerRows = conversations.filter((item) => item.type === "single" && visibleWecomKeys.includes(item.accountKey));
  const columns = [
    { title: "客户", dataIndex: "name", width: 180, render: (_, record) => <Space><WecomAvatar item={record} size={38} /><div><Text strong>{record.name}</Text><br /><Text type="secondary">{record.remark}</Text></div></Space> },
    { title: "微信号", dataIndex: "wecomId", width: 150 },
    { title: "手机号", dataIndex: "phone", width: 130 },
    { title: "所属销售", dataIndex: "owner" },
    { title: "企微标签", dataIndex: "intent", render: (v) => <Tag color={v === "高" ? "red" : "gold"}>{v}意向</Tag> },
    { title: "当前状态", dataIndex: "status" },
    { title: "最近消息", dataIndex: "last" },
    { title: "操作", fixed: "right", width: 88, render: (_, record) => <Button type="link" onClick={() => onViewConversation(record)}>查看</Button> }
  ];
  return (
    <Card title={<PanelTitle title="客户中心" desc="汇总企微好友、客户标签、最近会话和AI跟进状态，后续承接客户档案侧边栏。" />}>
      <Space className="toolbar" wrap>
        <Select defaultValue="全部销售" options={["全部销售", "李销售", "陈销售", "周销售"].map((value) => ({ value }))} />
        <Select defaultValue="全部标签" options={["全部标签", "高意向", "中意向", "待人工接管", "AI接待中"].map((value) => ({ value }))} />
        <Input.Search placeholder="搜索客户姓名、企微备注或最近消息" allowClear />
      </Space>
      <Table className="admin-table" rowKey="key" columns={columns} dataSource={customerRows} pagination={false} scroll={{ x: 1180 }} />
    </Card>
  );
}

export default CustomersPage;
