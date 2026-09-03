import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { companies } from "../data/appData";
import { PanelTitle, statusTag } from "../components/PageChrome";


const { Text, Title } = Typography;



function CompanyModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>新建企业</Button>
      <Modal title="企业基础信息" open={open} onCancel={() => setOpen(false)} okText="保存配置" cancelText="取消">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item label="企业名称"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="所属行业"><Select options={["教育", "家装", "医美", "SaaS", "其他"].map((value) => ({ value }))} /></Form.Item></Col>
            <Col span={12}><Form.Item label="联系人"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="联系电话"><Input /></Form.Item></Col>
            <Col span={24}><Form.Item label="企业简介"><Input.TextArea rows={3} /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

function CompanyEditModal({ company, onClose }) {
  return (
    <Modal title="编辑企业" open={Boolean(company)} onCancel={onClose} onOk={onClose} okText="保存企业" cancelText="取消" width={720}>
      <Form layout="vertical" initialValues={company || {}} key={company?.id || "empty"}>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="企业名称" name="name"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="行业" name="industry"><Select options={["教育", "家装", "SaaS", "医美", "其他"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="联系人" name="contact"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="电话" name="phone"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="企微状态" name="wecom"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function CompanyPage({ platform }) {
  const [editing, setEditing] = useState(null);
  const [companyRows, setCompanyRows] = useState(companies);
  const columns = [
    { title: "企业名称", dataIndex: "name" },
    { title: "行业", dataIndex: "industry" },
    { title: "联系人", dataIndex: "contact" },
    { title: "电话", dataIndex: "phone" },
    { title: "企微状态", dataIndex: "wecom" },
    { title: "状态", dataIndex: "status", render: statusTag },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space wrap={false}>
          <Button type="link" icon={<EditOutlined />} onClick={() => setEditing(record)}>编辑</Button>
          {platform ? <Button type="link" danger onClick={() => Modal.confirm({ title: "删除企业", content: `确认删除 ${record.name}？`, okText: "删除", okButtonProps: { danger: true }, cancelText: "取消", onOk: () => setCompanyRows((items) => items.filter((item) => item.id !== record.id)) })}>删除</Button> : null}
        </Space>
      )
    }
  ];
  return (
    <>
      <Card title={<PanelTitle title={platform ? "企业列表" : "本企业基础配置"} desc="维护企业资料、行业信息和启用状态。" extra={platform ? <CompanyModal /> : null} />}>
        <Table className="admin-table" rowKey="id" columns={columns} dataSource={platform ? companyRows : companyRows.slice(0, 1)} pagination={false} scroll={{ x: 980 }} />
      </Card>
      <CompanyEditModal company={editing} onClose={() => setEditing(null)} />
    </>
  );
}

export default CompanyPage;
