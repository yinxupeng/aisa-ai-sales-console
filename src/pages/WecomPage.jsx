import React from "react";
import { Button, Card, Col, Form, Input, List, Row, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { PanelTitle } from "../components/PageChrome";


const { Text, Title } = Typography;


function WecomPage() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={10}>
        <Card title={<PanelTitle title="句子通道状态" desc="检查企微消息接收、发送和客户标签同步。" extra={<><Tag color="success">已连接</Tag><Button>查看回调日志</Button></>} />}>
          <List dataSource={["消息接收正常 最近同步 2026-05-30 14:20", "消息发送正常 AI代理账号 online", "客户标签同步 今日同步128个客户"]} renderItem={(item) => <List.Item><Space><CheckCircleOutlined className="ok-icon" />{item}</Space></List.Item>} />
        </Card>
      </Col>
      <Col xs={24} xl={14}>
        <Card title="句子与企微参数">
          <Form layout="vertical">
            {["CorpID", "AgentID", "Secret", "Token", "EncodingAESKey", "AI代理账号"].map((label) => <Form.Item key={label} label={label}><Input.Password visibilityToggle={label === "Secret"} defaultValue={label === "Secret" ? "secret-value" : label.toLowerCase()} /></Form.Item>)}
            <Space><Button>测试连接</Button><Button type="primary">保存配置</Button></Space>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default WecomPage;
