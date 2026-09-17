import React, { useState } from "react";
import { Button, Card, Checkbox, Col, Form, Input, List, Row, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined, CloudSyncOutlined } from "@ant-design/icons";
import { PanelTitle } from "../components/PageChrome";

const { Paragraph, Text, Title } = Typography;

function WecomChannelPage() {
  const [testing, setTesting] = useState(false);
  const [savedAt, setSavedAt] = useState("14:20");

  const handleTest = () => {
    setTesting(true);
    window.setTimeout(() => setTesting(false), 600);
  };

  const handleSave = () => {
    const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
    setSavedAt(now);
  };

  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card className="channel-entry-card">
        <div className="channel-entry">
          <div>
            <Space size={10} align="center">
              <CloudSyncOutlined className="channel-entry-icon" />
              <Title level={4}>句子通道配置</Title>
              <Tag color="success">已打通</Tag>
            </Space>
            <Paragraph type="secondary">
              配置 Sabuddy 与句子互动平台的企业级打通关系，用于同步企微账号、客户、托管状态和人工介入数据。
            </Paragraph>
          </div>
          <Text type="secondary">最近保存 {savedAt}</Text>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card title={<PanelTitle title="连接状态" desc="检查消息通道、客户同步和回调服务是否正常。" />}>
            <List
              dataSource={["企微账号同步正常 最近同步 14:20", "客户数据同步正常 今日同步128个客户", "人工介入回调正常"]}
              renderItem={(item) => <List.Item><Space><CheckCircleOutlined className="ok-icon" />{item}</Space></List.Item>}
            />
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card title="句子互动参数">
            <Form
              layout="vertical"
              initialValues={{
                aiEndpoint: "https://ai.aisa.com/open/wecom/sync",
                juziTenantId: "xinghe-edu",
                syncScope: ["企微账号", "客户数据", "托管状态", "人工介入"],
                callbackToken: "aisa_juzi_sync_token"
              }}
            >
              <Row gutter={16}>
                <Col span={12}><Form.Item label="Sabuddy同步地址" name="aiEndpoint"><Input /></Form.Item></Col>
                <Col span={12}><Form.Item label="句子互动企业ID" name="juziTenantId"><Input /></Form.Item></Col>
                <Col span={12}><Form.Item label="句子互动 App Key" name="juziAppKey"><Input placeholder="请输入 App Key" /></Form.Item></Col>
                <Col span={12}><Form.Item label="句子互动 App Secret" name="juziAppSecret"><Input.Password placeholder="请输入 App Secret" /></Form.Item></Col>
                <Col span={24}><Form.Item label="同步数据范围" name="syncScope"><Checkbox.Group options={["企微账号", "客户数据", "托管状态", "人工介入"]} /></Form.Item></Col>
                <Col span={24}><Form.Item label="回调校验 Token" name="callbackToken"><Input.Password /></Form.Item></Col>
              </Row>
              <Space>
                <Button loading={testing} onClick={handleTest}>测试连接</Button>
                <Button type="primary" onClick={handleSave}>保存配置</Button>
                <Button>查看同步日志</Button>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export default WecomChannelPage;
