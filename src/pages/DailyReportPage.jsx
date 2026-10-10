import React from "react";
import { Card, Empty, Tag, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function DailyReportPage() {
  return (
    <div className="collaboration-placeholder-page">
      <Card className="collaboration-placeholder-card" bordered={false}>
        <Tag color="blue" icon={<CalendarOutlined />}>观心实验室 · 儿童心理健康医疗课程</Tag>
        <Title level={3}>用户日报分析</Title>
        <Paragraph type="secondary">日报分析将汇总每日到课、沟通、意向变化和重点跟进用户。</Paragraph>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="日报分析模块即将上线" />
      </Card>
    </div>
  );
}
