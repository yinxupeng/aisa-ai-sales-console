import React from "react";
import { Card, Table, Tag, Typography } from "antd";
const money = (value) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export default function OrderQueryReport({ report }) {
  const data = report.summary;
  return <div className="order-query-result">
    <div className="order-query-head"><Typography.Text strong>10月29日 · 销售订单查询</Typography.Text><Tag>模拟数据</Tag></div>
    <div className="order-query-section"><Typography.Text strong>系统日志（模拟）</Typography.Text><p>{data.logs}</p></div>
    <div className="order-query-section"><Typography.Text strong>业务数据</Typography.Text><p>仅统计纯销售企微促成的正价课订单，严格剔除交付班主任角色。</p><div className="order-query-metrics"><div><span>销售转化订单</span><strong>{data.salesOrders} 笔</strong></div><div><span>成交额（GMV）</span><strong>{money(data.gmv)}</strong></div></div><ul><li>覆盖 {data.paidStudents} 位独立付费学员，无重复支付。</li><li>转化高峰：{data.peakTime}，直播临门与结营黄金期集中产生 {data.peakOrders} 笔正价课转化。</li><li>主力商品：《{data.primaryProduct}》，共 {data.primaryProductOrders} 笔；另含少年说30天服务1笔、亲子成长2日营1笔。</li></ul></div>
    <div className="order-query-excluded"><Typography.Text strong>已剔除：交付服务角色订单</Typography.Text><p>另有 {data.excludedOrders} 笔订单挂载在班主任账号名下，合计 {money(data.excludedGmv)}，属于学员交付履约或续费，未计入销售端转化。</p></div>
    <Card size="small" title="销售人员出单战报榜（10月29日）"><Table size="small" rowKey="key" dataSource={report.groups} scroll={{ x: 850 }} pagination={{ pageSize: 6, showSizeChanger: false, size: "small" }} columns={[
      { title: "销售人员", dataIndex: "owner", width: 90 }, { title: "企微角色定位", dataIndex: "role", width: 180 }, { title: "成交单数", dataIndex: "orders", width: 90, render: (value) => `${value} 单` }, { title: "成交总额", dataIndex: "amount", width: 130, render: money }, { title: "涉及主推商品", dataIndex: "products", width: 360 }
    ]} /></Card>
    <Card size="small" title="22笔销售订单明细"><Table size="small" rowKey="key" dataSource={report.rows} scroll={{ x: 1000 }} pagination={{ pageSize: 6, showSizeChanger: false, size: "small", showTotal: (total) => `共${total}笔` }} columns={[
      { title: "序号", dataIndex: "number", width: 60 }, { title: "支付时间", dataIndex: "paidAt", width: 100 }, { title: "转化销售", dataIndex: "owner", width: 90 }, { title: "客户昵称", dataIndex: "customer", width: 150 }, { title: "联系电话", dataIndex: "phone", width: 130 }, { title: "购买商品", dataIndex: "product", width: 320 }, { title: "实付金额", dataIndex: "amount", width: 130, render: money }
    ]} /></Card>
    <Typography.Text type="secondary" className="order-query-source">数据和日志结论均来自本次提供的演示样本，未查询真实日志或订单系统。</Typography.Text>
  </div>;
}
