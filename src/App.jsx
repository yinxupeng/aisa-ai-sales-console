import React, { useEffect, useMemo, useState } from "react";
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Drawer,
  Form,
  Input,
  Layout,
  Menu,
  Radio,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography
} from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BarsOutlined,
  BookOutlined,
  CloudSyncOutlined,
  CommentOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  SendOutlined,
  SettingOutlined,
  SmileOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined
} from "@ant-design/icons";

import { conversations } from "./data/conversations";
import { loginAccounts, managedWecomAccounts } from "./data/appData";

import DashboardPage from "./pages/DashboardPage";
import ConversationsPage from "./pages/ConversationsPage";
import SalesPage from "./pages/SalesPage";
import IntelligentAgentPage from "./pages/IntelligentAgentPage";
import StrategyPage from "./pages/StrategyPage";
import AISkillPage from "./pages/AISkillPage";
import ToolsPage from "./pages/ToolsPage";
import KnowledgePage from "./pages/KnowledgePage";
import HumanizationPage from "./pages/HumanizationPage";
import TagLibraryPage from "./pages/TagLibraryPage";
import DataDictionaryPage from "./pages/DataDictionaryPage";
import StrategyInsightPage from "./pages/StrategyInsightPage";
import MassMessagePage from "./pages/MassMessagePage";
import SettingsPage from "./pages/SettingsPage";
import CustomersPage from "./pages/CustomersPage";
import CompanyPage from "./pages/CompanyPage";
import WecomPage from "./pages/WecomPage";
import WecomChannelPage from "./pages/WecomChannelPage";
import WecomAccountPage from "./pages/WecomAccountPage";
import EnterpriseLogin from "./shared/EnterpriseLogin";
import { selectedEnterpriseId, usePlatformData } from "./shared/platformStore";
import SuggestionsPage from "./pages/SuggestionsPage";

const { Header, Sider, Content } = Layout;
const { Paragraph, Title, Text } = Typography;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "工作台" },
  { key: "conversations", icon: <CommentOutlined />, label: "会话中心" },
  {
    key: "sales",
    icon: <TeamOutlined />,
    label: "企微托管",
    children: [
      { key: "wecomChannel", icon: <CloudSyncOutlined />, label: "通道配置" },
      { key: "wecomAccounts", icon: <TeamOutlined />, label: "企微账号管理" }
    ]
  },
  {
    key: "agentGroup",
    icon: <RobotOutlined />,
    label: "智能体",
    children: [
      { key: "agentManager", icon: <RobotOutlined />, label: "角色管理" },
      { key: "strategy", icon: <BarChartOutlined />, label: "智能体管理" },
      { key: "skills", icon: <FileSearchOutlined />, label: "Skill管理" },
      { key: "tools", icon: <ToolOutlined />, label: "工具管理" },
      { key: "knowledge", icon: <FileTextOutlined />, label: "知识库管理" },
      { key: "humanization", icon: <SmileOutlined />, label: "拟人化设置" }
    ]
  },
  {
    key: "userOpsGroup",
    icon: <TagsOutlined />,
    label: "用户运营",
    children: [
      { key: "tagLibrary", icon: <TagsOutlined />, label: "标签库管理" },
      { key: "dataDictionary", icon: <BookOutlined />, label: "数据字典 / 变量配置" },
      { key: "strategyInsight", icon: <BarChartOutlined />, label: "策略洞察" },
      { key: "massMessage", icon: <SendOutlined />, label: "用户群发" }
    ]
  },
  { key: "settings", icon: <SettingOutlined />, label: "系统管理" }
];

const flattenMenuItems = (items) => items.flatMap((item) => item.children ? [item, ...flattenMenuItems(item.children)] : [item]);
const getAllowedMenuItems = (items, allowedKeys) => items.reduce((result, item) => {
  if (item.children) {
    const children = getAllowedMenuItems(item.children, allowedKeys);
    if (children.length) result.push({ ...item, children });
  } else if (allowedKeys.includes(item.key)) {
    result.push(item);
  }
  return result;
}, []);
const pageTitle = Object.fromEntries(flattenMenuItems(menuItems).map((item) => [item.key, item.label]));

function Login({ onLogin }) {
  const handleAccountLogin = (values) => {
    onLogin(values.account || "1");
  };
  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <div className="login-grid" />
        <div className="flow-line line-a" />
        <div className="flow-line line-b" />
        <div className="flow-line line-c" />
        <div className="message-stream">
          <i />
          <i />
          <i />
        </div>
      </div>
      <Card className="login-card">
        <Space direction="vertical" size={22} className="full-width">
          <div className="login-brand">
            <div className="brand-mark">AI</div>
            <div>
              <Title level={3}>Sabuddy</Title>
              <Text type="secondary">AI销售托管平台</Text>
            </div>
          </div>
          <Form layout="vertical" initialValues={{ account: "1", password: "demo123456" }} onFinish={handleAccountLogin}>
            <Form.Item label="账号" name="account">
              <Input size="large" autoComplete="username" placeholder="输入 1 / 2 / 3" />
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input.Password size="large" autoComplete="current-password" />
            </Form.Item>
            <Paragraph type="secondary">默认演示账号：1 / demo123456。也可输入 2 企业员工或 3 企业管理员，系统会按账号权限展示菜单和数据。</Paragraph>
            <Button type="primary" size="large" block htmlType="submit">
              登录
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
}

function AppShell({ user, onLogout }) {
  const rawInitialRoute = location.hash?.replace("#", "") || "dashboard";
  const initialRoute = ["sales", "aiSeats"].includes(rawInitialRoute) ? "wecomAccounts" : rawInitialRoute;
  const allowedMenuItems = getAllowedMenuItems(menuItems, user.menuKeys);
  const allowedLeafMenuItems = flattenMenuItems(allowedMenuItems).filter((item) => !item.children);
  const allowedPageTitle = Object.fromEntries(allowedLeafMenuItems.map((item) => [item.key, item.label]));
  const [route, setRoute] = useState(allowedPageTitle[initialRoute] ? initialRoute : "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userWecomAccounts = managedWecomAccounts.filter((item) => user.wecomKeys.includes(item.key));
  const [activeOrg, setActiveOrg] = useState("all");
  const [activeWecom, setActiveWecom] = useState(userWecomAccounts[0]?.key || managedWecomAccounts[0].key);
  const [activeConversationKey, setActiveConversationKey] = useState("");
  const [autoOpenCustomerDrawerToken, setAutoOpenCustomerDrawerToken] = useState(0);
  const [conversationViewMode, setConversationViewMode] = useState("card");
  const [dashboardWecomFilter, setDashboardWecomFilter] = useState("all");
  const [dashboardPeriodFilter, setDashboardPeriodFilter] = useState("all");
  const platform = user.role === "platform_admin";
  const showOrgSwitch = user.role !== "employee";
  const scopedWecomAccounts = userWecomAccounts.filter((item) => activeOrg === "all" || item.department === activeOrg || item.employee === activeOrg);
  const visibleWecomAccounts = scopedWecomAccounts.length ? scopedWecomAccounts : userWecomAccounts;
  const visibleWecomKeys = visibleWecomAccounts.map((item) => item.key);
  const scopedConversations = conversations.filter((item) => visibleWecomKeys.includes(item.accountKey));
  const orgOptions = [
    { value: "all", label: user.role === "platform_admin" ? "组织架构 / 全部企业员工" : "组织架构 / 本企业员工" },
    ...Array.from(new Set(userWecomAccounts.map((item) => item.department))).map((value) => ({ value, label: `部门 / ${value}` })),
    ...userWecomAccounts.map((item) => ({ value: item.employee, label: `${item.department} / ${item.employee}` }))
  ];
  const dashboardWecomOptions = [
    { value: "all", label: "全部企微" },
    ...visibleWecomAccounts.map((item) => ({ value: item.key, label: item.label }))
  ];
  const dashboardPeriodOptions = [
    { value: "all", label: "全部期次" },
    { value: "06月10日 A类体验课第1期", label: "06月10日 A类体验课第1期" },
    { value: "06月12日 A类体验课第2期", label: "06月12日 A类体验课第2期" },
    { value: "06月15日 A类体验课第3期", label: "06月15日 A类体验课第3期" },
    { value: "06月18日 A类体验课第4期", label: "06月18日 A类体验课第4期" }
  ];

  useEffect(() => {
    window.history.replaceState(null, "", `#${route}`);
  }, [route]);

  useEffect(() => {
    if (!allowedPageTitle[route]) setRoute("dashboard");
  }, [route, allowedPageTitle]);

  const handleMenuSelect = (key) => {
    if (!allowedPageTitle[key]) return;
    setRoute(key);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!visibleWecomKeys.includes(activeWecom)) {
      setActiveWecom(visibleWecomKeys[0] || managedWecomAccounts[0].key);
      setActiveConversationKey("");
    }
  }, [activeWecom, visibleWecomKeys.join("|")]);

  const handleViewConversation = (record) => {
    const targetConversation = conversations.find((item) => item.key === (record.conversationKey || record.key)) || conversations.find((item) => item.name === record.name);
    if (!targetConversation) return;
    setActiveWecom(targetConversation.accountKey);
    setActiveConversationKey(targetConversation.key);
    setAutoOpenCustomerDrawerToken((value) => value + 1);
    setRoute("conversations");
  };

  const content = useMemo(() => ({
    dashboard: (
      <DashboardPage
        setRoute={setRoute}
        onViewConversation={handleViewConversation}
        conversationsData={scopedConversations}
        dashboardWecomFilter={dashboardWecomFilter}
        dashboardPeriodFilter={dashboardPeriodFilter}
      />
    ),
    customers: <CustomersPage onViewConversation={handleViewConversation} visibleWecomKeys={visibleWecomKeys} />,
    company: <CompanyPage platform={platform} />,
    agentManager: <IntelligentAgentPage />,
    strategy: <StrategyPage />,
    skills: <AISkillPage />,
    tools: <ToolsPage />,
    knowledge: <KnowledgePage />,
    tagLibrary: <TagLibraryPage onViewConversation={handleViewConversation} />,
    dataDictionary: <DataDictionaryPage />,
    strategyInsight: <StrategyInsightPage onViewConversation={handleViewConversation} />,
    massMessage: <MassMessagePage />,
    wecom: <WecomPage />,
    sales: <SalesPage />,
    wecomChannel: <WecomChannelPage />,
    wecomAccounts: <WecomAccountPage />,
    humanization: <HumanizationPage />,
    conversations: (
      <ConversationsPage
        activeWecom={activeWecom}
        activeConversationKey={activeConversationKey}
        autoOpenCustomerDrawerToken={autoOpenCustomerDrawerToken}
        visibleWecomKeys={visibleWecomKeys}
        conversationViewMode={conversationViewMode}
        onConversationViewModeChange={setConversationViewMode}
        onActiveWecomChange={(key) => {
          setActiveWecom(key);
          setActiveConversationKey("");
        }}
      />
    ),
    suggestions: <SuggestionsPage />,
    settings: <SettingsPage platform={platform} />
  })[route], [route, platform, activeWecom, activeConversationKey, autoOpenCustomerDrawerToken, visibleWecomKeys.join("|"), conversationViewMode, dashboardWecomFilter, dashboardPeriodFilter]);

  return (
    <Layout className="app-layout">
      <Sider className="app-sider" width={220} collapsedWidth={80} collapsed={collapsed} trigger={null}>
        <div className="brand">
          <div className="brand-mark"><RobotOutlined /></div>
          {!collapsed ? <Title level={4}>Sabuddy</Title> : null}
        </div>
        <Menu theme="light" mode="inline" selectedKeys={[route]} defaultOpenKeys={["sales", "agentGroup", "userOpsGroup"]} items={allowedMenuItems} onClick={({ key }) => handleMenuSelect(key)} />
        <Tooltip title={collapsed ? "展开导航" : "收起导航"} placement={collapsed ? "right" : "top"}>
          <Button
            className="sider-collapse-button"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
          >
            {!collapsed ? "收起" : null}
          </Button>
        </Tooltip>
      </Sider>
      <Layout>
        <Header className="app-header">
          <Space className="header-title-wrap" align="center">
            <div className="page-heading">
              <Button className="mobile-menu" type="text" icon={<MenuUnfoldOutlined />} onClick={() => setMobileMenuOpen(true)} />
              <Title level={2}>{allowedPageTitle[route] || pageTitle[route]}</Title>
              {route === "conversations" ? (
                <>
                  {showOrgSwitch ? (
                    <Select
                      className="wecom-account-switch"
                      value={activeOrg}
                      onChange={(value) => {
                        setActiveOrg(value);
                        setActiveConversationKey("");
                      }}
                      options={orgOptions}
                    />
                  ) : null}
                </>
              ) : null}
            </div>
          </Space>
          <Space className="header-actions" wrap>
            {route === "dashboard" ? (
              <div className="dashboard-header-filters">
                <Space size={8} className="dashboard-filter-item">
                  <Text className="dashboard-filter-label">企微号</Text>
                  <Select
                    size="middle"
                    value={dashboardWecomFilter}
                    onChange={setDashboardWecomFilter}
                    options={dashboardWecomOptions}
                    popupMatchSelectWidth={false}
                  />
                </Space>
                <Space size={8} className="dashboard-filter-item">
                  <Text className="dashboard-filter-label">期次</Text>
                  <Select
                    size="middle"
                    value={dashboardPeriodFilter}
                    onChange={setDashboardPeriodFilter}
                    options={dashboardPeriodOptions}
                    popupMatchSelectWidth={false}
                  />
                </Space>
              </div>
            ) : null}
            {route === "conversations" ? (
              <div className="conversation-view-switch">
                <Text type="secondary">展示方式</Text>
                <Radio.Group
                  value={conversationViewMode}
                  buttonStyle="solid"
                  onChange={(event) => setConversationViewMode(event.target.value)}
                >
                  <Radio.Button value="card"><AppstoreOutlined /> 卡片模式</Radio.Button>
                  <Radio.Button value="list"><BarsOutlined /> 列表模式</Radio.Button>
                </Radio.Group>
              </div>
            ) : null}
            {!platform ? <Tag color="blue">{user.company}</Tag> : null}
            <Button shape="round" icon={<Avatar size={24}>{user.badge}</Avatar>}>{user.name}</Button>
            <Button onClick={onLogout}>退出</Button>
          </Space>
        </Header>
        <Content className="app-content">{content}</Content>
      </Layout>
      <Drawer
        title="Sabuddy 导航"
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={260}
        className="mobile-nav-drawer"
      >
        <Menu mode="inline" selectedKeys={[route]} defaultOpenKeys={["agentGroup"]} items={allowedMenuItems} onClick={({ key }) => handleMenuSelect(key)} />
      </Drawer>
    </Layout>
  );
}

export default function App() {
  const platformData = usePlatformData();
  const scopedEnterprise = new URLSearchParams(location.search).has("enterprise");
  const enterprise = platformData.enterprises.find((item) => item.id === selectedEnterpriseId());
  const enterpriseSessionKey = `sabuddy-enterprise-session-${selectedEnterpriseId()}`;
  const storedAccount = scopedEnterprise ? (sessionStorage.getItem(enterpriseSessionKey) ? "3" : null) : localStorage.getItem("sales-ai-auth-account");
  const [user, setUser] = useState(loginAccounts[storedAccount] || null);
  const handleLogin = (account) => {
    const accountKey = loginAccounts[String(account).trim()] ? String(account).trim() : "1";
    const nextUser = loginAccounts[accountKey];
    if (scopedEnterprise) sessionStorage.setItem(enterpriseSessionKey, "active");
    else localStorage.setItem("sales-ai-auth-account", accountKey);
    localStorage.removeItem("sales-ai-auth-role");
    setUser(nextUser);
  };
  const handleLogout = () => {
    if (scopedEnterprise) sessionStorage.removeItem(enterpriseSessionKey);
    else localStorage.removeItem("sales-ai-auth-account");
    localStorage.removeItem("sales-ai-auth-role");
    setUser(null);
  };

  return (
    <ConfigProvider theme={{ token: { borderRadius: 8, colorPrimary: "#1b63d9", fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif' } }}>
      <AntApp>
        {scopedEnterprise && !enterprise ? <div style={{padding:48}}><Title level={3}>企业不存在</Title><a href="./portal.html">返回演示入口</a></div> : user ? <AppShell user={scopedEnterprise ? {...loginAccounts["3"], company:enterprise.name, name:enterprise.adminName} : user} onLogout={handleLogout} /> : scopedEnterprise ? <EnterpriseLogin company={enterprise} onLogin={()=>handleLogin("3")} /> : <Login onLogin={handleLogin} />}
      </AntApp>
    </ConfigProvider>
  );
}
