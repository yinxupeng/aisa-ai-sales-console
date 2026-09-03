import React, { useState } from "react";
import dayjs from "dayjs";
import {
  App as AntApp,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload
} from "antd";
import {
  FileTextOutlined,
  LinkOutlined,
  PaperClipOutlined,
  PictureOutlined,
  PlusOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import {
  managedWecomAccounts,
  isAiGeneratedTag,
  getTagDisplayLabel
} from "../data/appData";
import { lifecycleStages } from "../data/conversations";
import {
  CommonTagPickerModal,
  CommonTagSelectButton
} from "../components/CommonTagPicker";

const { Text } = Typography;

function MassMessagePage() {
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();
  const audienceStatusFields = [
    { name: "hostingStatus", label: "托管状态", all: "全部托管状态", options: ["已托管", "未托管"] },
    { name: "lifecycle", label: "所处阶段", all: "全部阶段", options: lifecycleStages.map((item) => item.title) }
  ];
  const getDefaultAudienceStatuses = () => audienceStatusFields.reduce((result, item) => ({ ...result, [item.name]: item.all }), {});
  const getAudienceStatusSummary = (statuses = {}) => audienceStatusFields
    .map((item) => statuses[item.name])
    .filter((value, index) => value && value !== audienceStatusFields[index].all);
  const initialRows = [
    {
      key: "mass-1",
      name: "体验后未报名家长回访",
      role: "销售",
      targetWecomAccounts: ["wecom-li", "wecom-wu", "wecom-lin"],
      audienceMode: "筛选客户",
      audienceStatuses: { ...getDefaultAudienceStatuses(), hostingStatus: "已托管", lifecycle: "催单阶段" },
      audienceTags: ["高意向", "体验后未报名", "关注效果保障"],
      excludeTags: ["明确拒绝", "删除企微风险"],
      estimatedCount: 128,
      sendTime: "2026-08-20 09:30",
      status: "待发送",
      creator: "运营-张敏",
      updatedAt: "2026-08-19 15:20"
    },
    {
      key: "mass-2",
      name: "今晚家长直播课提醒",
      role: "班主任",
      targetWecomAccounts: ["wecom-chen"],
      audienceMode: "筛选客户",
      audienceStatuses: { ...getDefaultAudienceStatuses(), hostingStatus: "已托管", lifecycle: "提升认知" },
      audienceTags: ["直播课用户", "适合邀约直播课"],
      excludeTags: ["删除企微风险"],
      estimatedCount: 86,
      sendTime: "2026-08-19 18:30",
      status: "发送中",
      creator: "班主任-陈老师",
      updatedAt: "2026-08-19 18:02"
    },
    {
      key: "mass-3",
      name: "周末家庭教育直播邀约",
      role: "市场",
      targetWecomAccounts: ["wecom-zhou"],
      audienceMode: "筛选客户",
      audienceStatuses: { ...getDefaultAudienceStatuses(), lifecycle: "定义用户" },
      audienceTags: ["家长高焦虑", "亲子冲突高", "父母成长营意向"],
      excludeTags: ["投诉风险", "不适合AI继续沟通"],
      estimatedCount: 214,
      sendTime: "立即发送",
      status: "草稿",
      creator: "市场-周老师",
      updatedAt: "2026-08-18 17:45"
    }
  ];
  const [rows, setRows] = useState(initialRows);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");
  const [activeTask, setActiveTask] = useState(null);
  const [tagPicker, setTagPicker] = useState({ open: false, field: "audienceTags", title: "选择标签", selected: [], keyword: "", rule: "以下标签满足其一" });
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [roleFilter, setRoleFilter] = useState("全部角色");
  const isViewMode = drawerMode === "view";
  const getDefaultMassContent = () => "早上好家长～\n\n昨天课程结束后，老师这边已经整理出孩子当前学习里的几个关键点。您方便的话，我晚点把孩子的课堂表现和下一步建议发您，我们一起看看后面怎么安排更合适。";
  const getTaskFormValues = (record = {}) => {
    const sendMode = record.sendTime === "立即发送" ? "立即发送" : "定时发送";
    const sendAt = sendMode === "定时发送" && record.sendTime && record.sendTime !== "未设置" ? dayjs(record.sendTime) : null;
    const defaultAccounts = managedWecomAccounts.map((item) => item.key);
    return {
      name: record.name || "",
      description: record.description || "",
      role: record.role || "全部角色",
      targetWecomAccounts: record.targetWecomAccounts || (record.sendAccounts && record.sendAccounts.length ? record.sendAccounts : defaultAccounts),
      audienceMode: record.audienceMode || "全部客户",
      audienceTags: record.audienceTags || [],
      excludeTags: record.excludeTags || [],
      audienceTagRule: record.audienceTagRule || "以下标签满足其一",
      excludeTagRule: record.excludeTagRule || "以下标签满足其一",
      ...getDefaultAudienceStatuses(),
      ...(record.audienceStatuses || {}),
      sendMode,
      sendAt,
      content: record.content || getDefaultMassContent(),
      materialType: record.materialType || "文本"
    };
  };
  const estimateCount = () => {
    const values = form.getFieldsValue();
    const accounts = values.targetWecomAccounts || [];
    const accountRatio = accounts.length ? accounts.length / managedWecomAccounts.length : 1;
    if (values.audienceMode === "全部客户") return Math.round(1268 * accountRatio);
    const tagCount = (values.audienceTags || []).length;
    const excludeCount = (values.excludeTags || []).length;
    const statusCount = audienceStatusFields.filter((item) => values[item.name] && values[item.name] !== item.all).length;
    return Math.max(18, Math.round((96 + tagCount * 32 - excludeCount * 14 - statusCount * 11) * accountRatio));
  };
  const openCreate = () => {
    form.resetFields();
    setDrawerMode("create");
    setActiveTask(null);
    form.setFieldsValue(getTaskFormValues());
    setDrawerOpen(true);
  };
  const openTaskDrawer = (mode, record) => {
    form.resetFields();
    setDrawerMode(mode);
    setActiveTask(record);
    form.setFieldsValue(getTaskFormValues(record));
    setDrawerOpen(true);
  };
  const closeTaskDrawer = () => {
    setDrawerOpen(false);
    setActiveTask(null);
    setDrawerMode("create");
  };
  const openTagPicker = (field) => {
    const values = form.getFieldsValue();
    setTagPicker({
      open: true,
      field,
      title: field === "audienceTags" ? "选择标签" : "选择排除标签",
      selected: (field === "audienceTags" ? values.audienceTags : values.excludeTags) || [],
      keyword: "",
      rule: (field === "audienceTags" ? values.audienceTagRule : values.excludeTagRule) || "以下标签满足其一"
    });
  };
  const saveTagPicker = () => {
    const ruleField = tagPicker.field === "audienceTags" ? "audienceTagRule" : "excludeTagRule";
    form.setFieldsValue({ [tagPicker.field]: tagPicker.selected, [ruleField]: tagPicker.rule });
    setTagPicker((item) => ({ ...item, open: false }));
  };
  const saveTask = () => {
    form.validateFields().then((values) => {
      const now = new Date().toISOString().slice(0, 16).replace("T", " ");
      const previousSendTime = drawerMode === "edit" ? activeTask?.sendTime : null;
      const sendTime = values.sendMode === "立即发送" ? "立即发送" : values.sendAt ? values.sendAt.format("YYYY-MM-DD HH:mm") : previousSendTime || "未设置";
      const taskPayload = {
        name: values.name,
        description: values.description || "",
        role: values.role || "全部角色",
        audienceMode: values.audienceMode,
        audienceStatuses: values.audienceMode === "全部客户" ? getDefaultAudienceStatuses() : audienceStatusFields.reduce((result, item) => ({ ...result, [item.name]: values[item.name] || item.all }), {}),
        audienceTags: values.audienceMode === "全部客户" ? [] : values.audienceTags || [],
        excludeTags: values.audienceMode === "全部客户" ? [] : values.excludeTags || [],
        audienceTagRule: values.audienceTagRule,
        excludeTagRule: values.excludeTagRule,
        estimatedCount: estimateCount(),
        sendTime,
        sendMode: values.sendMode,
        targetWecomAccounts: values.targetWecomAccounts || [],
        content: values.content,
        materialType: values.materialType || "文本",
        status: values.sendMode === "立即发送" ? "发送中" : activeTask?.status || "待发送",
        updatedAt: now
      };
      if (drawerMode === "edit" && activeTask) {
        setRows((items) => items.map((item) => item.key === activeTask.key ? { ...item, ...taskPayload } : item));
        message.success("群发任务已更新");
      } else {
        setRows((items) => [
          {
            key: `mass-${Date.now()}`,
            ...taskPayload,
            creator: "平台管理员"
          },
          ...items
        ]);
        message.success("群发任务已创建");
      }
      closeTaskDrawer();
    });
  };
  const filteredRows = rows.filter((item) => {
    const matchesKeyword = !keyword.trim() || item.name.includes(keyword.trim());
    const matchesStatus = statusFilter === "全部状态" || item.status === statusFilter;
    const matchesRole = roleFilter === "全部角色" || (item.role || "全部角色") === roleFilter;
    return matchesKeyword && matchesStatus && matchesRole;
  });
  const columns = [
    { title: "群发名称", dataIndex: "name", width: 170 },
    {
      title: "业务角色",
      dataIndex: "role",
      width: 100,
      render: (value) => (
        <Tag color={value === "销售" ? "blue" : value === "班主任" ? "green" : value === "市场" ? "orange" : "default"}>
          {value || "全部角色"}
        </Tag>
      )
    },
    {
      title: "目标人群",
      dataIndex: "audienceTags",
      width: 280,
      render: (items = [], record) => (
        <Space direction="vertical" size={4} className="mass-audience-tags">
          <Text>{record.audienceMode}</Text>
          {record.audienceMode === "筛选客户" ? (
            <Text type="secondary" className="mass-audience-status-summary">
              {getAudienceStatusSummary(record.audienceStatuses).length ? getAudienceStatusSummary(record.audienceStatuses).join(" / ") : "未限制状态条件"}
            </Text>
          ) : null}
          <Space wrap size={[4, 4]}>{items.slice(0, 2).map((item) => <Tag className={isAiGeneratedTag(item) ? "customer-selected-ai-tag" : "customer-selected-tag"} key={item}>{getTagDisplayLabel(item)}</Tag>)}{items.length > 2 ? <Tag>+{items.length - 2}</Tag> : null}</Space>
        </Space>
      )
    },
    { title: "预计发送人数", dataIndex: "estimatedCount", width: 112, align: "center", render: (value) => <span className="mass-estimate-count-cell">{value} 人</span> },
    { title: "发送时间", dataIndex: "sendTime", width: 128 },
    {
      title: "企微账号",
      dataIndex: "targetWecomAccounts",
      width: 170,
      render: (accounts = []) => {
        if (!accounts || !accounts.length) return <Text type="secondary">全部企微</Text>;
        const names = accounts.map((key) => managedWecomAccounts.find((a) => a.key === key)?.label || key);
        if (names.length === 1) return names[0];
        return (
          <Tooltip title={names.join("、")}>
            <span>{names[0]} 等 {names.length} 个企微</span>
          </Tooltip>
        );
      }
    },
    { title: "发送状态", dataIndex: "status", width: 96, render: (value) => <Tag color={value === "已完成" ? "success" : value === "发送中" ? "processing" : value === "待发送" ? "blue" : "default"}>{value}</Tag> },
    { title: "创建人", dataIndex: "creator", width: 104 },
    { title: "更新时间", dataIndex: "updatedAt", width: 132 },
    {
      title: "操作",
      fixed: "right",
      width: 146,
      render: (_, record) => (
        <Space size={4} className="table-action-group">
          <Button type="link" size="small" onClick={() => openTaskDrawer("view", record)}>查看</Button>
          <Button type="link" size="small" onClick={() => openTaskDrawer("edit", record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => setRows((items) => [{ ...record, key: `mass-copy-${Date.now()}`, name: `${record.name} 副本`, status: "草稿" }, ...items])}>复制</Button>
          <Button type="link" size="small" danger onClick={() => setRows((items) => items.filter((item) => item.key !== record.key))}>删除</Button>
        </Space>
      )
    }
  ];
  return (
    <>
      <Space direction="vertical" size={16} className="page-stack mass-message-page">
        <Row gutter={[16, 16]}>
          {[
            ["全部任务", rows.length],
            ["待发送", rows.filter((item) => item.status === "待发送").length],
            ["发送中", rows.filter((item) => item.status === "发送中").length],
            ["已完成", rows.filter((item) => item.status === "已完成").length]
          ].map(([label, value]) => (
            <Col xs={12} lg={6} key={label}><Card><Statistic title={label} value={value} /></Card></Col>
          ))}
        </Row>
        <Card>
          <div className="toolbar compact-card-toolbar">
            <Space wrap>
              <Input.Search placeholder="搜索群发名称" allowClear value={keyword} onChange={(event) => setKeyword(event.target.value)} className="strategy-search-input" />
              <Select value={statusFilter} options={["全部状态", "草稿", "待发送", "发送中", "已完成", "已暂停"].map((value) => ({ value }))} onChange={setStatusFilter} />
              <Select value={roleFilter} options={["全部角色", "销售", "班主任", "市场"].map((value) => ({ value }))} onChange={setRoleFilter} />
              <Button type="primary">搜索</Button>
              <Button onClick={() => { setKeyword(""); setStatusFilter("全部状态"); setRoleFilter("全部角色"); }}>重置</Button>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>创建群发任务</Button>
          </div>
          <Table className="admin-table mass-message-table" rowKey="key" columns={columns} dataSource={filteredRows} pagination={false} scroll={{ x: 1180 }} />
        </Card>
      </Space>
      <Drawer
        title={drawerMode === "view" ? "查看群发任务" : drawerMode === "edit" ? "编辑群发任务" : "创建群发任务"}
        open={drawerOpen}
        onClose={closeTaskDrawer}
        width={920}
        extra={<Space><Button onClick={closeTaskDrawer}>{isViewMode ? "关闭" : "取消"}</Button>{!isViewMode ? <Button type="primary" onClick={saveTask}>保存任务</Button> : null}</Space>}
        className="mass-message-drawer"
      >
        <Form form={form} layout="vertical" className="mass-message-form" disabled={isViewMode}>
          <Card size="small">
            <Row gutter={16}>
              <Col span={14}><Form.Item label="群发名称" name="name" rules={[{ required: true, message: "请输入群发名称" }]}><Input placeholder="群发名称仅内部可见" /></Form.Item></Col>
              <Col span={10}><Form.Item label="群发说明" name="description"><Input placeholder="例如：A类课课后未报名回访" /></Form.Item></Col>
              <Col span={24}>
                <Form.Item label="业务角色" name="role" rules={[{ required: true, message: "请选择业务角色" }]}>
                  <Radio.Group options={["全部角色", "销售", "班主任", "市场"].map((value) => ({ value, label: value }))} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card size="small">
            <Form.Item
              label="选择企微账号"
              name="targetWecomAccounts"
              rules={[{ required: true, message: "请至少选择一个企微账号" }]}
              extra="该登录账号下分配的企微账号，支持多选"
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="请选择企微账号（该登录账号下分配的企微，支持多选）"
                options={managedWecomAccounts.map((item) => ({
                  value: item.key,
                  label: `${item.label}（${item.owner} · ${item.department}）`
                }))}
                maxTagCount="responsive"
              />
            </Form.Item>
            <Form.Item label="选择客户" name="audienceMode" rules={[{ required: true }]}>
              <Radio.Group
                options={["全部客户", "筛选客户"].map((value) => ({ value, label: value }))}
                onChange={(event) => {
                  if (event.target.value === "全部客户") {
                    form.setFieldsValue({ audienceTags: [], excludeTags: [], ...getDefaultAudienceStatuses() });
                  }
                }}
              />
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const audienceMode = getFieldValue("audienceMode");
                const audienceTags = getFieldValue("audienceTags") || [];
                const excludeTags = getFieldValue("excludeTags") || [];
                if (audienceMode !== "筛选客户") {
                  return (
                    <div className="mass-all-audience-box">
                      <Text type="secondary">将发送给所选企微账号下可触达的全部客户。</Text>
                      <div className="mass-estimate-box">
                        <Text type="secondary">预计发送人数</Text>
                        <Text className="mass-estimate-count">{estimateCount()} 人</Text>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="mass-audience-box">
                    <div className="mass-audience-section">
                      <Row gutter={[12, 10]}>
                        {audienceStatusFields.map((item) => (
                          <Col span={12} key={item.name}>
                            <Form.Item label={item.label} name={item.name}>
                              <Select options={[item.all, ...item.options].map((value) => ({ value }))} />
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                    </div>
                    <div className="mass-audience-section">
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item label="标签">
                            <CommonTagSelectButton disabled={isViewMode} value={audienceTags} placeholder="选择标签确定群发人群" onClick={() => openTagPicker("audienceTags")} onChange={(value) => form.setFieldsValue({ audienceTags: value })} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label="排除客户" extra="选择排除标签后，群发时不会发送给这些标签内的客户。">
                            <CommonTagSelectButton disabled={isViewMode} value={excludeTags} placeholder="选择需要排除的客户标签" onClick={() => openTagPicker("excludeTags")} onChange={(value) => form.setFieldsValue({ excludeTags: value })} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                    <div className="mass-estimate-box">
                      <Text type="secondary">预计发送人数</Text>
                      <Text className="mass-estimate-count">{estimateCount()} 人</Text>
                    </div>
                  </div>
                );
              }}
            </Form.Item>
          </Card>
          <Card size="small">
            <Space wrap className="mass-material-actions">
              <Upload showUploadList={false}><Button icon={<PictureOutlined />}>本地上传图片</Button></Upload>
              <Upload showUploadList={false}><Button icon={<VideoCameraOutlined />}>本地上传视频</Button></Upload>
              <Upload showUploadList={false}><Button icon={<PaperClipOutlined />}>本地上传文件</Button></Upload>
              <Button icon={<FileTextOutlined />}>从素材库选择</Button>
              <Button icon={<LinkOutlined />}>远程地址</Button>
            </Space>
            <Form.Item label="任务描述" name="content" rules={[{ required: true, message: "请输入群发内容" }]}>
              <Input.TextArea rows={9} showCount maxLength={5000} placeholder="输入要群发给客户的内容，可搭配图片、视频、文件或素材库资源。" />
            </Form.Item>
          </Card>
          <Card size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="发送方式" name="sendMode">
                  <Radio.Group
                    options={["立即发送", "定时发送"].map((value) => ({ value, label: value }))}
                    onChange={(event) => {
                      if (event.target.value === "立即发送") {
                        form.setFieldsValue({ sendAt: null });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => getFieldValue("sendMode") === "定时发送" ? (
                  <Col span={12}><Form.Item label="定时发送时间" name="sendAt"><DatePicker showTime className="full-width" /></Form.Item></Col>
                ) : null}
              </Form.Item>
            </Row>
          </Card>
        </Form>
      </Drawer>
      <CommonTagPickerModal
        title={tagPicker.title}
        open={tagPicker.open}
        onCancel={() => setTagPicker((item) => ({ ...item, open: false }))}
        onOk={saveTagPicker}
        selected={tagPicker.selected}
        keyword={tagPicker.keyword}
        rule={tagPicker.rule}
        tip="标签来自统一标签库，用于圈定群发人群；带（AI）的标签表示后续可由策略智能体自动判断写入。"
        onKeywordChange={(keyword) => setTagPicker((item) => ({ ...item, keyword }))}
        onRuleChange={(rule) => setTagPicker((item) => ({ ...item, rule }))}
        onSelectedChange={(selected) => setTagPicker((item) => ({ ...item, selected }))}
      />
    </>
  );
}

export default MassMessagePage;
