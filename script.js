const routeButtons = document.querySelectorAll("[data-route]");
const views = document.querySelectorAll(".view");
const pageTitle = document.querySelector("#pageTitle");
const menuToggle = document.querySelector("[data-menu-toggle]");
const toast = document.querySelector("#toast");
const conversationStatus = document.querySelector("#conversationStatus");
const modalPanels = document.querySelectorAll("[data-modal]");
const modalCloseButtons = document.querySelectorAll("[data-close-modal]");
const loginForm = document.querySelector("#loginForm");
const loginHint = document.querySelector("#loginHint");
const userRoleLabel = document.querySelector("#userRoleLabel");
const userAvatar = document.querySelector("#userAvatar");
const companySwitch = document.querySelector(".company-switch");
const scopeLabel = document.querySelector("#scopeLabel");
const dashboardHeading = document.querySelector("#dashboardHeading");
const dashboardIntro = document.querySelector("#dashboardIntro");
const companyHeading = document.querySelector("#companyHeading");
const companyIntro = document.querySelector("#companyIntro");
const companyScopeHint = document.querySelector("#companyScopeHint");
const authStoreKey = "sales-ai-auth-role";
const companyList = document.querySelector("#companyList");
const companyForm = document.querySelector("#companyForm");
const companyFormTitle = document.querySelector("#companyFormTitle");
const companyFormStatus = document.querySelector("#companyFormStatus");
const companyStatusButton = document.querySelector("[data-company-status]");
const companyStoreKey = "sales-ai-companies";
const agentList = document.querySelector("#agentList");
const agentForm = document.querySelector("#agentForm");
const agentFormTitle = document.querySelector("#agentFormTitle");
const agentFormModalTitle = document.querySelector("#agentFormModalTitle");
const agentFormStatus = document.querySelector("#agentFormStatus");
const agentStatusButton = document.querySelector("[data-agent-status]");
const agentStatusFilter = document.querySelector("#agentStatusFilter");
const agentSearch = document.querySelector("#agentSearch");
const agentTestTitle = document.querySelector("#agentTestTitle");
const agentStrategyBindTitle = document.querySelector("#agentStrategyBindTitle");
const agentStrategyTypeFilter = document.querySelector("#agentStrategyTypeFilter");
const agentStrategySearch = document.querySelector("#agentStrategySearch");
const agentStrategyBindList = document.querySelector("#agentStrategyBindList");
const agentKnowledgeBindTitle = document.querySelector("#agentKnowledgeBindTitle");
const agentKnowledgeTypeFilter = document.querySelector("#agentKnowledgeTypeFilter");
const agentKnowledgeSearch = document.querySelector("#agentKnowledgeSearch");
const agentKnowledgeBindList = document.querySelector("#agentKnowledgeBindList");
const agentSalesTitle = document.querySelector("#agentSalesTitle");
const agentSalesList = document.querySelector("#agentSalesList");
const agentStoreKey = "sales-ai-agents";
const salesTableBody = document.querySelector("#salesTableBody");
const salesStatusFilter = document.querySelector("#salesStatusFilter");
const salesSearch = document.querySelector("#salesSearch");
const salesRoleForm = document.querySelector("#salesRoleForm");
const salesRoleBindTitle = document.querySelector("#salesRoleBindTitle");
const salesRoleSelect = document.querySelector("#salesRoleSelect");
const salesStoreKey = "sales-ai-sales-accounts";
const accountTableBody = document.querySelector("#accountTableBody");
const accountForm = document.querySelector("#accountForm");
const accountFormTitle = document.querySelector("#accountFormTitle");
const accountFormStatus = document.querySelector("#accountFormStatus");
const accountStatusButton = document.querySelector("[data-account-status]");
const accountCompanySelect = document.querySelector("#accountCompanySelect");
const accountRoleSelect = document.querySelector("#accountRoleSelect");
const accountIntro = document.querySelector("#accountIntro");
const accountScopeHint = document.querySelector("#accountScopeHint");
const accountStoreKey = "sales-ai-accounts";
const knowledgeTableBody = document.querySelector("#knowledgeTableBody");
const knowledgeForm = document.querySelector("#knowledgeForm");
const knowledgeFormTitle = document.querySelector("#knowledgeFormTitle");
const knowledgeFormStatus = document.querySelector("#knowledgeFormStatus");
const knowledgeStatusButton = document.querySelector("[data-knowledge-status]");
const knowledgeSourceType = document.querySelector("#knowledgeSourceType");
const knowledgeTextField = document.querySelector("#knowledgeTextField");
const knowledgeFileField = document.querySelector("#knowledgeFileField");
const knowledgeFileHelp = document.querySelector("#knowledgeFileHelp");
const knowledgeTypeFilter = document.querySelector("#knowledgeTypeFilter");
const knowledgeStatusFilter = document.querySelector("#knowledgeStatusFilter");
const knowledgeSearch = document.querySelector("#knowledgeSearch");
const knowledgeStoreKey = "sales-ai-knowledge";
const strategyTableBody = document.querySelector("#strategyTableBody");
const strategyListView = document.querySelector("#strategyListView");
const strategyEditorView = document.querySelector("#strategyEditorView");
const strategyForm = document.querySelector("#strategyForm");
const strategyTypeFilter = document.querySelector("#strategyTypeFilter");
const strategyStatusFilter = document.querySelector("#strategyStatusFilter");
const strategySearch = document.querySelector("#strategySearch");
const strategyStatusButton = document.querySelector("[data-strategy-status]");
const strategyDiffPreview = document.querySelector("#strategyDiffPreview");
const strategyDiffStatus = document.querySelector("#strategyDiffStatus");
const strategyStoreKey = "sales-ai-strategies";

let companies = loadCompanies();
let selectedCompanyId = companies[0]?.id || null;
let isCreatingCompany = false;
let agents = loadAgents();
let selectedAgentId = agents[0]?.id || null;
let isCreatingAgent = false;
let salesAccounts = loadSalesAccounts();
let selectedSalesId = null;
let accounts = loadAccounts();
let selectedAccountId = null;
let isCreatingAccount = true;
let knowledgeItems = loadKnowledge();
let selectedKnowledgeId = null;
let isCreatingKnowledge = true;
let strategies = loadStrategies();
let selectedStrategyId = null;
let isCreatingStrategy = true;
let strategyOriginalContent = "";
let loginRole = localStorage.getItem(authStoreKey) || "";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function navigate(route) {
  const target = document.querySelector(`#${route}`);
  if (!target) return;

  views.forEach((view) => {
    view.classList.toggle("is-active", view === target);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === route);
  });

  pageTitle.textContent = target.dataset.title || "工作台";
  document.body.classList.remove("menu-open");
  window.history.replaceState(null, "", `#${route}`);
}

function openModal(name) {
  const targetPanel = Array.from(modalPanels).find((panel) => panel.dataset.modal === name);
  modalPanels.forEach((panel) => {
    panel.classList.remove("is-open");
  });
  if (targetPanel) {
    document.body.appendChild(targetPanel);
    targetPanel.classList.add("is-open");
  }
  document.body.classList.add("modal-open");
}

function closeModals() {
  modalPanels.forEach((panel) => panel.classList.remove("is-open"));
  document.body.classList.remove("modal-open");
}

function setLoginRole(role) {
  loginRole = role;
  document.querySelectorAll("[data-login-role]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.loginRole === role);
  });

  const platform = role === "platform";
  loginHint.textContent = platform
    ? "可管理所有企业数据。"
    : "仅可管理本企业数据。";

  getFormField(loginForm, "account").value = platform ? "platform@zhixiao.ai" : "admin@company.com";
}

function applyAuth(role) {
  const isLoggedIn = role === "platform" || role === "enterprise";
  document.body.classList.toggle("login-active", !isLoggedIn);
  document.body.dataset.authRole = role || "";

  if (!isLoggedIn) return;

  const platform = role === "platform";
  userRoleLabel.textContent = platform ? "平台管理员" : "企业管理员";
  userAvatar.textContent = platform ? "平" : "企";
  companySwitch.style.display = platform ? "" : "none";
  scopeLabel.textContent = platform ? "平台供应商视角" : "当前企业";
  dashboardHeading.textContent = platform ? "所有企业的AI销售运行情况" : "本企业的AI销售运行情况";
  dashboardIntro.textContent = platform
    ? "汇总查看平台下各企业的接待、回复、转人工和异常，便于供应商做运营监控。"
    : "只查看本企业的接待、回复、转人工和异常，确认AI销售闭环是否顺畅。";
  companyHeading.textContent = platform ? "开通企业和基础信息" : "本企业基础配置";
  companyIntro.textContent = platform
    ? "平台管理员可以创建企业、切换企业，并维护各企业的基础配置。"
    : "企业管理员只能维护自己公司的基础资料、产品说明和启用状态。";
  companyScopeHint.textContent = platform
    ? "平台管理员可选择任意企业进行配置。"
    : "当前账号仅可管理本企业数据，不可查看或创建其他企业。";
  accountIntro.textContent = platform
    ? "平台管理员可维护平台供应商账号，也可为入驻企业创建企业管理员和运营账号。"
    : "企业管理员只能维护本企业账号，不能创建平台管理员。";
  accountScopeHint.textContent = platform
    ? "平台管理员可查看和维护平台下账号。"
    : "当前只显示本企业账号。";

  if (!platform) {
    selectedCompanyId = companies[0]?.id || null;
    if (selectedCompanyId) selectCompany(selectedCompanyId, false);
  }

  populateAccountCompanyOptions();
  populateAccountRoleOptions();
  renderAccounts();
}

function logout() {
  localStorage.removeItem(authStoreKey);
  loginRole = "platform";
  setLoginRole(loginRole);
  applyAuth("");
  showToast("已退出登录");
}

function getFormField(form, name) {
  return form.elements.namedItem(name) || form.querySelector(`[name="${name}"]`);
}

function loadCompanies() {
  const fallback = [
    {
      id: "company-1",
      name: "星河教育科技",
      industry: "教育",
      contact: "张总",
      phone: "13800008888",
      description: "专注企业销售培训和AI销售助手服务，主要通过企微完成客户沟通和转化。",
      products: "AI销售助手、企微自动接待、销售话术知识库、线索转人工服务。",
      status: "enabled",
      wecomStatus: "已连接企微"
    },
    {
      id: "company-2",
      name: "云帆家装服务",
      industry: "家装",
      contact: "李总",
      phone: "13900009999",
      description: "面向本地家装客户提供设计咨询、施工报价和售后服务。",
      products: "全屋设计、装修套餐、材料报价、到店预约服务。",
      status: "enabled",
      wecomStatus: "未配置企微"
    },
    {
      id: "company-3",
      name: "青木SaaS软件",
      industry: "SaaS",
      contact: "王总",
      phone: "13700007777",
      description: "提供中小企业销售管理和客户运营软件。",
      products: "CRM系统、客户运营工具、销售线索管理、数据看板。",
      status: "disabled",
      wecomStatus: "试用中"
    }
  ];

  try {
    const saved = JSON.parse(localStorage.getItem(companyStoreKey));
    return Array.isArray(saved) && saved.length ? saved : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadAgents() {
  const fallback = [
    {
      id: "agent-1",
      name: "小智销售顾问",
      type: "售前顾问",
      tone: "专业稳重",
      rolePrompt:
        "你是星河教育科技的资深销售顾问，熟悉AI销售助手和企微自动接待产品，擅长根据客户的销售团队规模、沟通渠道和转化目标推荐合适方案。",
      opening: "您好，我是星河教育科技的AI销售顾问，很高兴为您服务。请问您主要想提升哪一类销售沟通效率？",
      forbidden: "不允许承诺未确认的价格、优惠、效果和交付时间；涉及合同、退款、投诉和特殊报价时必须转人工。",
      goals: ["收集客户需求", "介绍产品", "推荐方案", "引导下单", "必要时转人工"],
      status: "enabled"
    },
    {
      id: "agent-2",
      name: "方案专家顾问",
      type: "行业专家顾问",
      tone: "亲和自然",
      rolePrompt: "你是面向企业客户的行业解决方案顾问，擅长围绕客户业务场景拆解需求，并推荐适合的AI销售方案。",
      opening: "您好，我可以先帮您梳理销售沟通场景，再判断AI销售助手适合从哪里切入。",
      forbidden: "不能承诺未经确认的交付周期、定制范围和最终价格。",
      goals: ["收集客户需求", "推荐方案", "必要时转人工"],
      status: "enabled"
    },
    {
      id: "agent-3",
      name: "续费增长顾问",
      type: "续费顾问",
      tone: "简洁高效",
      rolePrompt: "你是客户续费增长顾问，擅长根据客户使用情况解释产品价值，并引导客户续费或升级。",
      opening: "您好，我看到您正在了解后续使用方案，我可以帮您快速确认适合的续费或升级方式。",
      forbidden: "不能承诺未授权折扣和未确认的服务升级内容。",
      goals: ["介绍产品", "引导下单", "必要时转人工"],
      status: "disabled"
    }
  ];

  try {
    const saved = JSON.parse(localStorage.getItem(agentStoreKey));
    return Array.isArray(saved) && saved.length ? saved : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadSalesAccounts() {
  const fallback = [
    {
      id: "sales-1",
      name: "李销售",
      wecom: "lisi",
      aiEnabled: true,
      agentId: "agent-1",
      todayCustomers: 32,
      pending: 3
    },
    {
      id: "sales-2",
      name: "王销售",
      wecom: "wangwu",
      aiEnabled: false,
      agentId: "",
      todayCustomers: 12,
      pending: 0
    },
    {
      id: "sales-3",
      name: "陈销售",
      wecom: "chenqi",
      aiEnabled: true,
      agentId: "agent-1",
      todayCustomers: 28,
      pending: 2
    }
  ];

  try {
    const saved = JSON.parse(localStorage.getItem(salesStoreKey));
    return Array.isArray(saved) && saved.length ? saved : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadAccounts() {
  const fallback = [
    {
      id: "account-1",
      name: "平台运营",
      companyId: "platform",
      role: "平台管理员",
      phone: "136****0001",
      account: "platform@zhixiao.ai",
      status: "enabled"
    },
    {
      id: "account-2",
      name: "张三",
      companyId: "company-1",
      role: "企业管理员",
      phone: "138****8888",
      account: "admin@company.com",
      status: "enabled"
    },
    {
      id: "account-3",
      name: "李四",
      companyId: "company-1",
      role: "销售主管",
      phone: "139****9999",
      account: "saleslead@company.com",
      status: "enabled"
    }
  ];

  try {
    const saved = JSON.parse(localStorage.getItem(accountStoreKey));
    return Array.isArray(saved) && saved.length ? saved : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadKnowledge() {
  const fallback = [
    {
      id: "knowledge-1",
      title: "AI销售助手产品介绍",
      type: "产品知识",
      sourceType: "text",
      content: "AI销售助手可接入企微账号，自动完成客户接待、需求收集、产品介绍、意向判断和转人工。",
      fileName: "",
      fileKind: "",
      status: "enabled",
      updatedAt: "2026-05-30"
    },
    {
      id: "knowledge-2",
      title: "常见价格问题",
      type: "FAQ",
      sourceType: "text",
      content: "价格会根据销售账号数量、服务版本和部署方式不同有所区别，可以先了解客户团队规模后推荐合适方案。",
      fileName: "",
      fileKind: "",
      status: "enabled",
      updatedAt: "2026-05-30"
    },
    {
      id: "knowledge-3",
      title: "产品资料PDF",
      type: "产品知识",
      sourceType: "file",
      content: "",
      fileName: "AI销售助手产品白皮书.pdf",
      fileKind: "PDF",
      status: "enabled",
      updatedAt: "2026-05-29"
    }
  ];

  try {
    const saved = JSON.parse(localStorage.getItem(knowledgeStoreKey));
    return Array.isArray(saved) && saved.length ? saved : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadStrategies() {
  const fallback = [
    {
      id: "strategy-1",
      name: "用户信息收集与手机号绑定、激活",
      description: "新好友添加后，引导用户提供手机号，完成绑定和课程激活。",
      type: "行为策略",
      trigger: "加好友",
      delay: "0",
      tags: "新好友, 未激活",
      content: `名称：新用户欢迎与激活流程
描述：欢迎新学员家长，收集信息，绑定手机，根据试用情况引导激活并发送学习规划
风格：你偏专家型霸总，不要用抱歉、对不起等谦卑词句，你说话尽可能简介明了给出明确指令和要求。

接口：
  绑定联系人：
    地址："{{config.api_base}}/stride/llm/contact/bind"
    方法：POST
    参数：
      phone: "{{vars.phone}}"
      wxid: "{{context.contact_id}}"`,
      status: "enabled"
    },
    {
      id: "strategy-2",
      name: "高意向客户转人工",
      description: "客户表达购买、试用或询价意向时，生成摘要并转给真人销售。",
      type: "意图策略",
      trigger: "客户表达购买意向",
      delay: "0",
      tags: "高意向, 待跟进",
      content: "识别高意向表达，提取客户需求、预算、关注产品和推荐下一步动作，通知销售接管。",
      status: "enabled"
    }
  ];

  try {
    const saved = JSON.parse(localStorage.getItem(strategyStoreKey));
    return Array.isArray(saved) && saved.length ? saved : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveCompanies() {
  try {
    localStorage.setItem(companyStoreKey, JSON.stringify(companies));
  } catch (error) {
    void error;
  }
}

function saveAgents() {
  try {
    localStorage.setItem(agentStoreKey, JSON.stringify(agents));
  } catch (error) {
    void error;
  }
}

function saveSalesAccounts() {
  try {
    localStorage.setItem(salesStoreKey, JSON.stringify(salesAccounts));
  } catch (error) {
    void error;
  }
}

function saveAccounts() {
  try {
    localStorage.setItem(accountStoreKey, JSON.stringify(accounts));
  } catch (error) {
    void error;
  }
}

function saveKnowledgeItems() {
  try {
    localStorage.setItem(knowledgeStoreKey, JSON.stringify(knowledgeItems));
  } catch (error) {
    void error;
  }
}

function saveStrategies() {
  try {
    localStorage.setItem(strategyStoreKey, JSON.stringify(strategies));
  } catch (error) {
    void error;
  }
}

function renderCompanies() {
  if (!companyList) return;

  companyList.innerHTML = companies
    .map(
      (company) => `
        <button class="company-card ${company.id === selectedCompanyId && !isCreatingCompany ? "is-selected" : ""}" type="button" data-company-id="${company.id}">
          <strong>${escapeHtml(company.name)}</strong>
          <span>${escapeHtml(company.industry)} · ${escapeHtml(company.wecomStatus || "未配置企微")}</span>
        </button>
      `
    )
    .join("");

  companyList.querySelectorAll("[data-company-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectCompany(button.dataset.companyId);
    });
  });
}

function selectCompany(id, shouldOpenModal = true) {
  const company = companies.find((item) => item.id === id);
  if (!company) return;

  selectedCompanyId = id;
  isCreatingCompany = false;
  fillCompanyForm(company);
  renderCompanies();
  if (shouldOpenModal) openModal("company");
}

function fillCompanyForm(company) {
  getFormField(companyForm, "name").value = company.name || "";
  getFormField(companyForm, "industry").value = company.industry || "其他";
  getFormField(companyForm, "contact").value = company.contact || "";
  getFormField(companyForm, "phone").value = company.phone || "";
  getFormField(companyForm, "description").value = company.description || "";
  getFormField(companyForm, "products").value = company.products || "";

  const enabled = company.status !== "disabled";
  companyStatusButton.classList.toggle("is-on", enabled);
  companyStatusButton.querySelector("span").textContent = enabled ? "启用企业" : "停用企业";
  companyFormTitle.textContent = isCreatingCompany ? "新建企业" : "企业基础信息";
  companyFormStatus.textContent = isCreatingCompany ? "新建中" : "编辑中";
  companyFormStatus.className = isCreatingCompany ? "badge warning" : "badge success";
}

function startNewCompany() {
  if (loginRole !== "platform") {
    showToast("企业管理员无权新建企业");
    return;
  }

  selectedCompanyId = null;
  isCreatingCompany = true;
  companyForm.reset();
  getFormField(companyForm, "industry").value = "教育";
  fillCompanyForm({
    name: "",
    industry: "教育",
    contact: "",
    phone: "",
    description: "",
    products: "",
    status: "enabled"
  });
  renderCompanies();
  openModal("company");
  getFormField(companyForm, "name").focus();
}

function saveCompanyForm() {
  const nameField = getFormField(companyForm, "name");
  const name = nameField.value.trim();
  if (!name) {
    showToast("请先填写企业名称");
    nameField.focus();
    return;
  }

  const data = {
    id: selectedCompanyId || `company-${Date.now()}`,
    name,
    industry: getFormField(companyForm, "industry").value,
    contact: getFormField(companyForm, "contact").value.trim(),
    phone: getFormField(companyForm, "phone").value.trim(),
    description: getFormField(companyForm, "description").value.trim(),
    products: getFormField(companyForm, "products").value.trim(),
    status: companyStatusButton.classList.contains("is-on") ? "enabled" : "disabled",
    wecomStatus: "未配置企微"
  };

  if (loginRole !== "platform" && selectedCompanyId !== companies[0]?.id) {
    showToast("企业管理员只能保存本企业配置");
    return;
  }

  const existingIndex = companies.findIndex((company) => company.id === data.id);
  if (existingIndex >= 0) {
    data.wecomStatus = companies[existingIndex].wecomStatus || data.wecomStatus;
    companies[existingIndex] = data;
  } else {
    companies.unshift(data);
  }

  selectedCompanyId = data.id;
  isCreatingCompany = false;
  saveCompanies();
  renderCompanies();
  fillCompanyForm(data);
  showToast(existingIndex >= 0 ? "企业配置已保存" : "新企业已创建");
  closeModals();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderAgents() {
  if (!agentList) return;

  const statusFilter = agentStatusFilter.value;
  const keyword = agentSearch.value.trim().toLowerCase();
  const filtered = agents.filter((agent) => {
    const statusText = agent.status === "disabled" ? "停用" : "启用";
    const text = `${agent.name} ${agent.type} ${agent.tone} ${Array.isArray(agent.goals) ? agent.goals.join(" ") : ""}`.toLowerCase();
    return (statusFilter === "全部状态" || statusText === statusFilter) && (!keyword || text.includes(keyword));
  });

  agentList.innerHTML = filtered
    .map(
      (agent) => `
        <tr>
          <td>${escapeHtml(agent.name)}</td>
          <td>${escapeHtml(agent.type)}</td>
          <td>${escapeHtml(agent.tone || "专业稳重")}</td>
          <td>${escapeHtml(Array.isArray(agent.goals) ? agent.goals.slice(0, 3).join("、") : "-")}</td>
          <td>${Array.isArray(agent.strategyIds) ? agent.strategyIds.length : 0} 个</td>
          <td>${Array.isArray(agent.knowledgeIds) ? agent.knowledgeIds.length : 0} 条</td>
          <td><button class="table-action" type="button" data-agent-sales="${agent.id}">${getBoundSalesByAgent(agent.id).length} 个</button></td>
          <td><span class="badge ${agent.status === "disabled" ? "neutral" : "success"}">${agent.status === "disabled" ? "停用" : "启用"}</span></td>
          <td>
            <button class="table-action" type="button" data-test-agent-row="${agent.id}">AI测试</button>
            <button class="table-action" type="button" data-bind-agent-strategy="${agent.id}">绑定策略</button>
            <button class="table-action" type="button" data-bind-agent-knowledge="${agent.id}">绑定知识库</button>
            <button class="table-action" type="button" data-agent-id="${agent.id}">编辑</button>
            <button class="table-action danger-action" type="button" data-delete-agent="${agent.id}">删除</button>
          </td>
        </tr>
      `
    )
    .join("");

  if (!filtered.length) {
    agentList.innerHTML = `<tr><td colspan="9">暂无AI角色，请新增AI角色。</td></tr>`;
  }

  agentList.querySelectorAll("[data-agent-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectAgent(button.dataset.agentId);
    });
  });

  agentList.querySelectorAll("[data-delete-agent]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteAgent(button.dataset.deleteAgent);
    });
  });

  agentList.querySelectorAll("[data-test-agent-row]").forEach((button) => {
    button.addEventListener("click", () => openAgentTest(button.dataset.testAgentRow));
  });

  agentList.querySelectorAll("[data-bind-agent-strategy]").forEach((button) => {
    button.addEventListener("click", () => openAgentStrategyBind(button.dataset.bindAgentStrategy));
  });

  agentList.querySelectorAll("[data-bind-agent-knowledge]").forEach((button) => {
    button.addEventListener("click", () => openAgentKnowledgeBind(button.dataset.bindAgentKnowledge));
  });

  agentList.querySelectorAll("[data-agent-sales]").forEach((button) => {
    button.addEventListener("click", () => openAgentSalesList(button.dataset.agentSales));
  });
}

function getAgentName(agentId) {
  return agents.find((agent) => agent.id === agentId)?.name || "-";
}

function getBoundSalesByAgent(agentId) {
  return salesAccounts.filter((account) => account.agentId === agentId);
}

function renderSalesAccounts() {
  if (!salesTableBody) return;

  const statusFilter = salesStatusFilter.value;
  const keyword = salesSearch.value.trim().toLowerCase();
  const filtered = salesAccounts.filter((account) => {
    const statusText = account.aiEnabled ? "开启" : "关闭";
    const text = `${account.name} ${account.wecom} ${getAgentName(account.agentId)}`.toLowerCase();
    return (statusFilter === "全部AI状态" || statusText === statusFilter) && (!keyword || text.includes(keyword));
  });

  salesTableBody.innerHTML = filtered.length
    ? filtered
        .map(
          (account) => `
            <tr>
              <td>${escapeHtml(account.name)}</td>
              <td>${escapeHtml(account.wecom)}</td>
              <td>
                <button class="switch ${account.aiEnabled ? "is-on" : ""}" type="button" data-toggle-sales="${account.id}">
                  <i></i>${account.aiEnabled ? "开启" : "关闭"}
                </button>
              </td>
              <td>${escapeHtml(getAgentName(account.agentId))}</td>
              <td>${account.todayCustomers}</td>
              <td>${account.pending}</td>
              <td><button class="table-action" type="button" data-config-sales="${account.id}">配置</button></td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="7">暂无销售账号。</td></tr>`;

  salesTableBody.querySelectorAll("[data-toggle-sales]").forEach((button) => {
    button.addEventListener("click", () => toggleSalesAi(button.dataset.toggleSales));
  });

  salesTableBody.querySelectorAll("[data-config-sales]").forEach((button) => {
    button.addEventListener("click", () => openSalesRoleConfig(button.dataset.configSales));
  });
}

function toggleSalesAi(id) {
  const account = salesAccounts.find((item) => item.id === id);
  if (!account) return;
  account.aiEnabled = !account.aiEnabled;
  saveSalesAccounts();
  renderSalesAccounts();
  renderAgents();
}

function openSalesRoleConfig(id) {
  const account = salesAccounts.find((item) => item.id === id);
  if (!account || !salesRoleForm) return;

  selectedSalesId = id;
  salesRoleBindTitle.textContent = `配置AI角色 · ${account.name}`;
  salesRoleSelect.innerHTML = [
    `<option value="">不绑定AI角色</option>`,
    ...agents.map((agent) => `<option value="${agent.id}">${escapeHtml(agent.name)} · ${escapeHtml(agent.type)}</option>`)
  ].join("");
  getFormField(salesRoleForm, "agentId").value = account.agentId || "";
  openModal("sales-role");
}

function saveSalesRoleConfig() {
  const account = salesAccounts.find((item) => item.id === selectedSalesId);
  if (!account || !salesRoleForm) return;

  account.agentId = getFormField(salesRoleForm, "agentId").value;
  if (account.agentId) {
    account.aiEnabled = true;
  }
  saveSalesAccounts();
  renderSalesAccounts();
  renderAgents();
  closeModals();
  showToast("销售账号AI角色已绑定");
}

function openAgentSalesList(agentId) {
  const agent = getAgentById(agentId);
  if (!agent || !agentSalesList) return;

  selectedAgentId = agentId;
  agentSalesTitle.textContent = `${agent.name} · 已绑定销售账号`;
  renderAgentSalesList(agentId);
  openModal("agent-sales");
}

function renderAgentSalesList(agentId) {
  if (!agentSalesList) return;
  const boundSales = getBoundSalesByAgent(agentId);
  agentSalesList.innerHTML = boundSales.length
    ? boundSales
        .map(
          (account) => `
            <tr>
              <td>${escapeHtml(account.name)}</td>
              <td>${escapeHtml(account.wecom)}</td>
              <td><span class="badge ${account.aiEnabled ? "success" : "neutral"}">${account.aiEnabled ? "开启" : "关闭"}</span></td>
              <td>${account.todayCustomers}</td>
              <td>${account.pending}</td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="5">暂无销售账号绑定该AI角色。</td></tr>`;
}

function getCompanyName(companyId) {
  if (companyId === "platform") return "平台供应商";
  return companies.find((company) => company.id === companyId)?.name || "未指定企业";
}

function getVisibleAccounts() {
  if (loginRole === "enterprise") {
    return accounts.filter((account) => account.companyId === companies[0]?.id);
  }
  return accounts;
}

function renderAccounts() {
  if (!accountTableBody) return;

  const visibleAccounts = getVisibleAccounts();
  accountTableBody.innerHTML = visibleAccounts
    .map(
      (account) => `
        <tr>
          <td>${escapeHtml(account.name)}</td>
          <td>${escapeHtml(getCompanyName(account.companyId))}</td>
          <td>${escapeHtml(account.role)}</td>
          <td>${escapeHtml(account.phone || "-")}</td>
          <td><span class="badge ${account.status === "disabled" ? "neutral" : "success"}">${account.status === "disabled" ? "停用" : "启用"}</span></td>
          <td><button class="table-action" type="button" data-edit-account="${account.id}">编辑</button></td>
        </tr>
      `
    )
    .join("");

  if (!visibleAccounts.length) {
    accountTableBody.innerHTML = `<tr><td colspan="6">暂无账号，请新增账号。</td></tr>`;
  }

  accountTableBody.querySelectorAll("[data-edit-account]").forEach((button) => {
    button.addEventListener("click", () => {
      selectAccount(button.dataset.editAccount);
    });
  });
}

function populateAccountCompanyOptions() {
  if (!accountCompanySelect) return;

  const options =
    loginRole === "platform"
      ? [{ id: "platform", name: "平台供应商" }, ...companies.map((company) => ({ id: company.id, name: company.name }))]
      : companies.slice(0, 1).map((company) => ({ id: company.id, name: company.name }));

  accountCompanySelect.innerHTML = options
    .map((company) => `<option value="${escapeHtml(company.id)}">${escapeHtml(company.name)}</option>`)
    .join("");
}

function populateAccountRoleOptions() {
  if (!accountRoleSelect) return;

  const roles =
    loginRole === "platform"
      ? ["平台管理员", "企业管理员", "销售主管", "知识库运营", "真人销售"]
      : ["企业管理员", "销售主管", "知识库运营", "真人销售"];

  accountRoleSelect.innerHTML = roles.map((role) => `<option>${escapeHtml(role)}</option>`).join("");
}

function startNewAccount(shouldOpenModal = true) {
  selectedAccountId = null;
  isCreatingAccount = true;
  accountForm.reset();
  populateAccountCompanyOptions();
  populateAccountRoleOptions();
  fillAccountForm({
    name: "",
    companyId: loginRole === "platform" ? "platform" : companies[0]?.id,
    role: loginRole === "platform" ? "平台管理员" : "企业管理员",
    phone: "",
    account: "",
    status: "enabled"
  });
  if (shouldOpenModal) {
    openModal("account");
    getFormField(accountForm, "name").focus();
  }
}

function selectAccount(id, shouldOpenModal = true) {
  const account = accounts.find((item) => item.id === id);
  if (!account) return;

  if (loginRole === "enterprise" && account.companyId !== companies[0]?.id) {
    showToast("企业管理员无权编辑其他企业账号");
    return;
  }

  selectedAccountId = id;
  isCreatingAccount = false;
  populateAccountCompanyOptions();
  populateAccountRoleOptions();
  fillAccountForm(account);
  if (shouldOpenModal) openModal("account");
}

function fillAccountForm(account) {
  getFormField(accountForm, "name").value = account.name || "";
  getFormField(accountForm, "companyId").value = account.companyId || companies[0]?.id || "platform";
  getFormField(accountForm, "role").value = account.role || (loginRole === "platform" ? "平台管理员" : "企业管理员");
  getFormField(accountForm, "phone").value = account.phone || "";
  getFormField(accountForm, "account").value = account.account || "";

  const enabled = account.status !== "disabled";
  accountStatusButton.classList.toggle("is-on", enabled);
  accountStatusButton.querySelector("span").textContent = enabled ? "启用账号" : "停用账号";
  accountFormTitle.textContent = isCreatingAccount ? "新增账号" : "编辑账号";
  accountFormStatus.textContent = isCreatingAccount ? "新建中" : "编辑中";
  accountFormStatus.className = isCreatingAccount ? "badge warning" : "badge success";
}

function saveAccountForm() {
  const nameField = getFormField(accountForm, "name");
  const name = nameField.value.trim();

  if (!name) {
    showToast("请先填写姓名");
    nameField.focus();
    return;
  }

  const companyId = getFormField(accountForm, "companyId").value;
  const role = getFormField(accountForm, "role").value;

  if (loginRole === "enterprise" && companyId !== companies[0]?.id) {
    showToast("企业管理员只能新增本企业账号");
    return;
  }

  if (loginRole === "enterprise" && role === "平台管理员") {
    showToast("企业管理员不能创建平台管理员");
    return;
  }

  const data = {
    id: selectedAccountId || `account-${Date.now()}`,
    name,
    companyId,
    role,
    phone: getFormField(accountForm, "phone").value.trim(),
    account: getFormField(accountForm, "account").value.trim(),
    status: accountStatusButton.classList.contains("is-on") ? "enabled" : "disabled"
  };

  const existingIndex = accounts.findIndex((account) => account.id === data.id);
  if (existingIndex >= 0) {
    accounts[existingIndex] = data;
  } else {
    accounts.unshift(data);
  }

  selectedAccountId = data.id;
  isCreatingAccount = false;
  saveAccounts();
  renderAccounts();
  fillAccountForm(data);
  showToast(existingIndex >= 0 ? "账号已保存" : "新账号已创建");
  closeModals();
}

function renderKnowledge() {
  if (!knowledgeTableBody) return;

  const typeFilter = knowledgeTypeFilter.value;
  const statusFilter = knowledgeStatusFilter.value;
  const keyword = knowledgeSearch.value.trim().toLowerCase();
  const filtered = knowledgeItems.filter((item) => {
    const statusText = item.status === "disabled" ? "停用" : "启用";
    const contentText = `${item.title} ${item.type} ${item.content || ""} ${item.fileName || ""}`.toLowerCase();
    return (
      (typeFilter === "全部类型" || item.type === typeFilter) &&
      (statusFilter === "全部状态" || statusText === statusFilter) &&
      (!keyword || contentText.includes(keyword))
    );
  });

  knowledgeTableBody.innerHTML = filtered
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.title)}</td>
          <td>${escapeHtml(item.type)}</td>
          <td>${item.sourceType === "file" ? `文件 · ${escapeHtml(item.fileKind || "文件")}` : "文本"}</td>
          <td><span class="badge ${item.status === "disabled" ? "neutral" : "success"}">${item.status === "disabled" ? "停用" : "启用"}</span></td>
          <td>${escapeHtml(item.updatedAt || "-")}</td>
          <td><button class="table-action" type="button" data-edit-knowledge="${item.id}">编辑</button></td>
        </tr>
      `
    )
    .join("");

  if (!filtered.length) {
    knowledgeTableBody.innerHTML = `<tr><td colspan="6">暂无知识，请新增知识。</td></tr>`;
  }

  knowledgeTableBody.querySelectorAll("[data-edit-knowledge]").forEach((button) => {
    button.addEventListener("click", () => {
      selectKnowledge(button.dataset.editKnowledge);
    });
  });
}

function startNewKnowledge(sourceType = "text", shouldOpenModal = true) {
  selectedKnowledgeId = null;
  isCreatingKnowledge = true;
  fillKnowledgeForm({
    title: "",
    type: "产品知识",
    sourceType,
    content: "",
    fileName: "",
    fileKind: "",
    status: "enabled"
  });
  if (shouldOpenModal) {
    openModal("knowledge");
    getFormField(knowledgeForm, "title").focus();
  }
}

function selectKnowledge(id, shouldOpenModal = true) {
  const item = knowledgeItems.find((knowledge) => knowledge.id === id);
  if (!item) return;

  selectedKnowledgeId = id;
  isCreatingKnowledge = false;
  fillKnowledgeForm(item);
  if (shouldOpenModal) openModal("knowledge");
}

function fillKnowledgeForm(item) {
  getFormField(knowledgeForm, "title").value = item.title || "";
  getFormField(knowledgeForm, "type").value = item.type || "产品知识";
  getFormField(knowledgeForm, "sourceType").value = item.sourceType || "text";
  getFormField(knowledgeForm, "content").value = item.content || "";
  getFormField(knowledgeForm, "file").value = "";

  const enabled = item.status !== "disabled";
  knowledgeStatusButton.classList.toggle("is-on", enabled);
  knowledgeStatusButton.querySelector("span").textContent = enabled ? "启用知识" : "停用知识";
  knowledgeFormTitle.textContent = isCreatingKnowledge ? "新增知识" : "编辑知识";
  knowledgeFormStatus.textContent = isCreatingKnowledge ? "新建中" : "编辑中";
  knowledgeFormStatus.className = isCreatingKnowledge ? "badge warning" : "badge success";
  knowledgeFileHelp.textContent = item.fileName
    ? `当前文件：${item.fileName}。重新选择文件后会更新记录。`
    : "支持 PDF、Word、Excel、PPT、TXT、Markdown、图片等。";
  updateKnowledgeSourceFields();
}

function updateKnowledgeSourceFields() {
  const isFile = knowledgeSourceType.value === "file";
  knowledgeTextField.style.display = isFile ? "none" : "";
  knowledgeFileField.style.display = isFile ? "" : "none";
}

function getFileKind(fileName) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return "PDF";
  if (["doc", "docx"].includes(ext)) return "Word";
  if (["xls", "xlsx"].includes(ext)) return "Excel";
  if (["ppt", "pptx"].includes(ext)) return "PPT";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "图片";
  if (["txt", "md"].includes(ext)) return "文本文件";
  return "文件";
}

function saveKnowledgeForm() {
  const titleField = getFormField(knowledgeForm, "title");
  const title = titleField.value.trim();

  if (!title) {
    showToast("请先填写知识标题");
    titleField.focus();
    return;
  }

  const sourceType = getFormField(knowledgeForm, "sourceType").value;
  const file = getFormField(knowledgeForm, "file").files?.[0];
  const existing = knowledgeItems.find((item) => item.id === selectedKnowledgeId);
  const fileName = sourceType === "file" ? file?.name || existing?.fileName || "" : "";

  if (sourceType === "file" && !fileName) {
    showToast("请先选择知识文件");
    return;
  }

  const data = {
    id: selectedKnowledgeId || `knowledge-${Date.now()}`,
    title,
    type: getFormField(knowledgeForm, "type").value,
    sourceType,
    content: sourceType === "text" ? getFormField(knowledgeForm, "content").value.trim() : "",
    fileName,
    fileKind: sourceType === "file" ? getFileKind(fileName) : "",
    status: knowledgeStatusButton.classList.contains("is-on") ? "enabled" : "disabled",
    updatedAt: new Date().toISOString().slice(0, 10)
  };

  const existingIndex = knowledgeItems.findIndex((item) => item.id === data.id);
  if (existingIndex >= 0) {
    knowledgeItems[existingIndex] = data;
  } else {
    knowledgeItems.unshift(data);
  }

  selectedKnowledgeId = data.id;
  isCreatingKnowledge = false;
  saveKnowledgeItems();
  renderKnowledge();
  fillKnowledgeForm(data);
  showToast(existingIndex >= 0 ? "知识已保存" : "新知识已创建");
  closeModals();
}

function renderStrategies() {
  if (!strategyTableBody) return;

  const typeFilter = strategyTypeFilter.value;
  const statusFilter = strategyStatusFilter.value;
  const keyword = strategySearch.value.trim().toLowerCase();
  const filtered = strategies.filter((item) => {
    const statusText = item.status === "disabled" ? "停用" : "启用";
    const text = `${item.name} ${item.description} ${item.trigger} ${item.tags}`.toLowerCase();
    return (
      (typeFilter === "全部类型" || item.type === typeFilter) &&
      (statusFilter === "全部状态" || statusText === statusFilter) &&
      (!keyword || text.includes(keyword))
    );
  });

  strategyTableBody.innerHTML = filtered
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.type)}</td>
          <td>${escapeHtml(item.trigger)}</td>
          <td>${escapeHtml(item.delay)} 分钟</td>
          <td>${escapeHtml(item.tags || "-")}</td>
          <td><span class="badge ${item.status === "disabled" ? "neutral" : "success"}">${item.status === "disabled" ? "停用" : "启用"}</span></td>
          <td>
            <button class="table-action" type="button" data-edit-strategy="${item.id}">编辑</button>
            <button class="table-action danger-action" type="button" data-delete-strategy="${item.id}">删除</button>
          </td>
        </tr>
      `
    )
    .join("");

  if (!filtered.length) {
    strategyTableBody.innerHTML = `<tr><td colspan="7">暂无策略，请新增策略。</td></tr>`;
  }

  strategyTableBody.querySelectorAll("[data-edit-strategy]").forEach((button) => {
    button.addEventListener("click", () => editStrategy(button.dataset.editStrategy));
  });

  strategyTableBody.querySelectorAll("[data-delete-strategy]").forEach((button) => {
    button.addEventListener("click", () => deleteStrategy(button.dataset.deleteStrategy));
  });
}

function showStrategyEditor() {
  strategyListView.style.display = "none";
  strategyEditorView.classList.add("is-active");
  document.body.classList.add("strategy-editing");
}

function showStrategyList() {
  strategyEditorView.classList.remove("is-active");
  strategyListView.style.display = "";
  document.body.classList.remove("strategy-editing");
}

function startNewStrategy() {
  selectedStrategyId = null;
  isCreatingStrategy = true;
  fillStrategyForm({
    name: "",
    description: "",
    type: "行为策略",
    trigger: "加好友",
    delay: "0",
    tags: "",
    content: "",
    status: "enabled"
  });
  showStrategyEditor();
  getFormField(strategyForm, "name").focus();
}

function editStrategy(id) {
  const strategy = strategies.find((item) => item.id === id);
  if (!strategy) return;

  selectedStrategyId = id;
  isCreatingStrategy = false;
  fillStrategyForm(strategy);
  showStrategyEditor();
}

function fillStrategyForm(strategy) {
  getFormField(strategyForm, "name").value = strategy.name || "";
  getFormField(strategyForm, "description").value = strategy.description || "";
  strategyForm.querySelectorAll('input[name="type"]').forEach((radio) => {
    radio.checked = radio.value === (strategy.type || "行为策略");
  });
  getFormField(strategyForm, "trigger").value = strategy.trigger || "加好友";
  getFormField(strategyForm, "delay").value = strategy.delay || "0";
  getFormField(strategyForm, "tags").value = strategy.tags || "";
  getFormField(strategyForm, "content").value = strategy.content || "";

  const enabled = strategy.status !== "disabled";
  strategyStatusButton.classList.toggle("is-on", enabled);
  strategyStatusButton.querySelector("span").textContent = enabled ? "启用策略" : "停用策略";
  strategyOriginalContent = strategy.content || "";
  updateStrategyDiff();
}

function getStrategyType() {
  return strategyForm.querySelector('input[name="type"]:checked')?.value || "行为策略";
}

function saveStrategyForm() {
  const name = getFormField(strategyForm, "name").value.trim();
  if (!name) {
    showToast("请先填写策略名称");
    getFormField(strategyForm, "name").focus();
    return;
  }

  const data = {
    id: selectedStrategyId || `strategy-${Date.now()}`,
    name,
    description: getFormField(strategyForm, "description").value.trim(),
    type: getStrategyType(),
    trigger: getFormField(strategyForm, "trigger").value,
    delay: getFormField(strategyForm, "delay").value || "0",
    tags: getFormField(strategyForm, "tags").value.trim(),
    content: getFormField(strategyForm, "content").value.trim(),
    status: strategyStatusButton.classList.contains("is-on") ? "enabled" : "disabled"
  };

  const existingIndex = strategies.findIndex((item) => item.id === data.id);
  if (existingIndex >= 0) {
    strategies[existingIndex] = data;
  } else {
    strategies.unshift(data);
  }

  selectedStrategyId = data.id;
  isCreatingStrategy = false;
  saveStrategies();
  renderStrategies();
  showStrategyList();
  showToast(existingIndex >= 0 ? "策略已保存" : "新策略已创建");
}

function deleteStrategy(id) {
  const target = strategies.find((item) => item.id === id);
  if (!target) return;

  const confirmed = window.confirm(`确定删除策略「${target.name}」吗？`);
  if (!confirmed) return;

  strategies = strategies.filter((item) => item.id !== id);
  saveStrategies();
  renderStrategies();
  showToast("策略已删除");
}

function getAgentById(id) {
  return agents.find((item) => item.id === id);
}

function openAgentTest(id) {
  const agent = getAgentById(id);
  if (!agent) return;
  selectedAgentId = id;
  agentTestTitle.textContent = `AI测试：${agent.name}`;
  document.querySelector("#testQuestion").value = "你们这个产品多少钱？";
  document.querySelector("#aiResult").innerHTML = `
    <strong>AI回复</strong>
    <p>当前将以「${escapeHtml(agent.name)}」的身份进行测试，回复会参考该角色绑定的策略和知识库。</p>
  `;
  openModal("agent-test");
}

function openAgentStrategyBind(id) {
  const agent = getAgentById(id);
  if (!agent) return;
  selectedAgentId = id;
  agentStrategyBindTitle.textContent = `绑定AI策略：${agent.name}`;
  agentStrategyTypeFilter.value = "全部类型";
  agentStrategySearch.value = "";
  renderAgentStrategyBindList();
  openModal("agent-strategy");
}

function openAgentKnowledgeBind(id) {
  const agent = getAgentById(id);
  if (!agent) return;
  selectedAgentId = id;
  agentKnowledgeBindTitle.textContent = `绑定知识库：${agent.name}`;
  agentKnowledgeTypeFilter.value = "全部类型";
  agentKnowledgeSearch.value = "";
  renderAgentKnowledgeBindList();
  openModal("agent-knowledge");
}

function renderAgentStrategyBindList() {
  const agent = getAgentById(selectedAgentId);
  if (!agent || !agentStrategyBindList) return;

  const typeFilter = agentStrategyTypeFilter.value;
  const keyword = agentStrategySearch.value.trim().toLowerCase();
  const bound = Array.isArray(agent.strategyIds) ? agent.strategyIds : [];
  const filtered = strategies.filter((item) => {
    const text = `${item.name} ${item.description}`.toLowerCase();
    return (typeFilter === "全部类型" || item.type === typeFilter) && (!keyword || text.includes(keyword));
  });

  agentStrategyBindList.innerHTML = filtered.length
    ? filtered
        .map(
          (item) => `
            <label class="bind-item">
              <input type="checkbox" value="${item.id}" ${bound.includes(item.id) ? "checked" : ""} />
              <span>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(item.type)} · ${escapeHtml(item.trigger)}</small>
              </span>
            </label>
          `
        )
        .join("")
    : `<div class="empty-state">暂无可绑定策略</div>`;
}

function renderAgentKnowledgeBindList() {
  const agent = getAgentById(selectedAgentId);
  if (!agent || !agentKnowledgeBindList) return;

  const typeFilter = agentKnowledgeTypeFilter.value;
  const keyword = agentKnowledgeSearch.value.trim().toLowerCase();
  const bound = Array.isArray(agent.knowledgeIds) ? agent.knowledgeIds : [];
  const filtered = knowledgeItems.filter((item) => {
    const text = `${item.title} ${item.content || ""} ${item.fileName || ""}`.toLowerCase();
    return (typeFilter === "全部类型" || item.type === typeFilter) && (!keyword || text.includes(keyword));
  });

  agentKnowledgeBindList.innerHTML = filtered.length
    ? filtered
        .map(
          (item) => `
            <label class="bind-item">
              <input type="checkbox" value="${item.id}" ${bound.includes(item.id) ? "checked" : ""} />
              <span>
                <strong>${escapeHtml(item.title)}</strong>
                <small>${escapeHtml(item.type)} · ${item.sourceType === "file" ? escapeHtml(item.fileName || "文件") : "文本"}</small>
              </span>
            </label>
          `
        )
        .join("")
    : `<div class="empty-state">暂无可绑定知识</div>`;
}

function saveAgentStrategyBind() {
  const agent = getAgentById(selectedAgentId);
  if (!agent) return;
  agent.strategyIds = Array.from(agentStrategyBindList.querySelectorAll("input:checked")).map((input) => input.value);
  saveAgents();
  renderAgents();
  closeModals();
  showToast("AI策略绑定已保存");
}

function saveAgentKnowledgeBind() {
  const agent = getAgentById(selectedAgentId);
  if (!agent) return;
  agent.knowledgeIds = Array.from(agentKnowledgeBindList.querySelectorAll("input:checked")).map((input) => input.value);
  saveAgents();
  renderAgents();
  closeModals();
  showToast("知识库绑定已保存");
}

function updateStrategyDiff() {
  const current = getFormField(strategyForm, "content").value;
  if (current === strategyOriginalContent) {
    strategyDiffStatus.textContent = "无修改";
    strategyDiffPreview.textContent = strategyOriginalContent || "暂无策略内容";
    return;
  }

  strategyDiffStatus.textContent = "有修改";
  strategyDiffPreview.textContent = current
    .split("\n")
    .map((line, index) => `${String(index + 1).padStart(2, " ")}  ${line}`)
    .join("\n");
}

function selectAgent(id, shouldOpenModal = true) {
  const agent = agents.find((item) => item.id === id);
  if (!agent) return;

  selectedAgentId = id;
  isCreatingAgent = false;
  fillAgentForm(agent);
  renderAgents();
  if (shouldOpenModal) openModal("agent");
}

function deleteAgent(id) {
  const target = agents.find((item) => item.id === id);
  if (!target) return;

  const confirmed = window.confirm(`确定删除AI角色「${target.name}」吗？`);
  if (!confirmed) return;

  agents = agents.filter((item) => item.id !== id);
  if (selectedAgentId === id) {
    selectedAgentId = agents[0]?.id || null;
  }
  salesAccounts = salesAccounts.map((account) => (account.agentId === id ? { ...account, agentId: "" } : account));
  saveAgents();
  saveSalesAccounts();
  renderAgents();
  renderSalesAccounts();
  showToast("AI角色已删除");
}

function fillAgentForm(agent) {
  getFormField(agentForm, "name").value = agent.name || "";
  getFormField(agentForm, "type").value = agent.type || "";
  getFormField(agentForm, "tone").value = agent.tone || "专业稳重";
  getFormField(agentForm, "rolePrompt").value = agent.rolePrompt || "";
  getFormField(agentForm, "opening").value = agent.opening || "";
  getFormField(agentForm, "forbidden").value = agent.forbidden || "";

  const goals = Array.isArray(agent.goals) ? agent.goals : [];
  agentForm.querySelectorAll('input[name="goals"]').forEach((checkbox) => {
    checkbox.checked = goals.includes(checkbox.value);
  });

  const enabled = agent.status !== "disabled";
  agentStatusButton.classList.toggle("is-on", enabled);
  agentStatusButton.querySelector("span").textContent = enabled ? "启用角色" : "停用角色";
  if (agentFormTitle) agentFormTitle.textContent = isCreatingAgent ? "新建AI角色" : "AI角色配置";
  agentFormModalTitle.textContent = isCreatingAgent ? "新建AI角色" : "编辑AI角色";
  if (agentFormStatus) {
    agentFormStatus.textContent = isCreatingAgent ? "新建中" : "编辑中";
    agentFormStatus.className = isCreatingAgent ? "badge warning" : "badge success";
  }
}

function startNewAgent() {
  selectedAgentId = null;
  isCreatingAgent = true;
  fillAgentForm({
    name: "",
    type: "",
    tone: "专业稳重",
    rolePrompt: "",
    opening: "",
    forbidden: "",
    goals: ["收集客户需求", "介绍产品", "推荐方案", "必要时转人工"],
    status: "enabled"
  });
  renderAgents();
  openModal("agent");
  getFormField(agentForm, "name").focus();
}

function saveAgentForm() {
  const nameField = getFormField(agentForm, "name");
  const typeField = getFormField(agentForm, "type");
  const name = nameField.value.trim();
  const type = typeField.value.trim();

  if (!name) {
    showToast("请先填写角色名称");
    nameField.focus();
    return;
  }

  if (!type) {
    showToast("请先填写角色类型");
    typeField.focus();
    return;
  }

  const existingAgent = agents.find((agent) => agent.id === selectedAgentId);
  const data = {
    id: selectedAgentId || `agent-${Date.now()}`,
    name,
    type,
    tone: getFormField(agentForm, "tone").value,
    rolePrompt: getFormField(agentForm, "rolePrompt").value.trim(),
    opening: getFormField(agentForm, "opening").value.trim(),
    forbidden: getFormField(agentForm, "forbidden").value.trim(),
    goals: Array.from(agentForm.querySelectorAll('input[name="goals"]:checked')).map((checkbox) => checkbox.value),
    strategyIds: existingAgent?.strategyIds || [],
    knowledgeIds: existingAgent?.knowledgeIds || [],
    status: agentStatusButton.classList.contains("is-on") ? "enabled" : "disabled"
  };

  const existingIndex = agents.findIndex((agent) => agent.id === data.id);
  if (existingIndex >= 0) {
    agents[existingIndex] = data;
  } else {
    agents.unshift(data);
  }

  selectedAgentId = data.id;
  isCreatingAgent = false;
  saveAgents();
  renderAgents();
  fillAgentForm(data);
  showToast(existingIndex >= 0 ? "AI角色已保存" : "新AI角色已创建");
  closeModals();
}

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navigate(button.dataset.route);
  });
});

document.querySelectorAll("[data-login-role]").forEach((button) => {
  button.addEventListener("click", () => {
    setLoginRole(button.dataset.loginRole);
  });
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const account = getFormField(loginForm, "account").value.trim();
  const password = getFormField(loginForm, "password").value.trim();

  if (!account || !password) {
    showToast("请输入账号和密码");
    return;
  }

  localStorage.setItem(authStoreKey, loginRole || "platform");
  applyAuth(loginRole || "platform");
  showToast(loginRole === "enterprise" ? "已以企业管理员登录" : "已以平台管理员登录");
});

document.querySelector("[data-logout]").addEventListener("click", logout);

menuToggle.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModals);
});

document.querySelectorAll("[data-toggle-switch]").forEach((button) => {
  button.addEventListener("click", () => {
    const enabled = !button.classList.contains("is-on");
    button.classList.toggle("is-on", enabled);
    button.lastChild.textContent = enabled ? "开启" : "关闭";
    showToast(enabled ? "已开启AI助手" : "已关闭AI助手");
  });
});

document.querySelector("[data-new-company]").addEventListener("click", startNewCompany);
document.querySelector("[data-new-agent]").addEventListener("click", startNewAgent);
document.querySelector("[data-new-account]").addEventListener("click", startNewAccount);
document.querySelector("[data-new-knowledge]").addEventListener("click", () => startNewKnowledge("text"));
document.querySelector("[data-new-file-knowledge]").addEventListener("click", () => startNewKnowledge("file"));
document.querySelector("[data-new-strategy]").addEventListener("click", startNewStrategy);
document.querySelector("[data-back-strategy]").addEventListener("click", showStrategyList);

companyStatusButton.addEventListener("click", () => {
  const enabled = !companyStatusButton.classList.contains("is-on");
  companyStatusButton.classList.toggle("is-on", enabled);
  companyStatusButton.querySelector("span").textContent = enabled ? "启用企业" : "停用企业";
});

companyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCompanyForm();
});

agentStatusButton.addEventListener("click", () => {
  const enabled = !agentStatusButton.classList.contains("is-on");
  agentStatusButton.classList.toggle("is-on", enabled);
  agentStatusButton.querySelector("span").textContent = enabled ? "启用角色" : "停用角色";
});

agentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAgentForm();
});

accountStatusButton.addEventListener("click", () => {
  const enabled = !accountStatusButton.classList.contains("is-on");
  accountStatusButton.classList.toggle("is-on", enabled);
  accountStatusButton.querySelector("span").textContent = enabled ? "启用账号" : "停用账号";
});

accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAccountForm();
});

knowledgeStatusButton.addEventListener("click", () => {
  const enabled = !knowledgeStatusButton.classList.contains("is-on");
  knowledgeStatusButton.classList.toggle("is-on", enabled);
  knowledgeStatusButton.querySelector("span").textContent = enabled ? "启用知识" : "停用知识";
});

knowledgeSourceType.addEventListener("change", updateKnowledgeSourceFields);

getFormField(knowledgeForm, "file").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  knowledgeFileHelp.textContent = file
    ? `已选择：${file.name}（${getFileKind(file.name)}）`
    : "支持 PDF、Word、Excel、PPT、TXT、Markdown、图片等。";
});

knowledgeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveKnowledgeForm();
});

strategyStatusButton.addEventListener("click", () => {
  const enabled = !strategyStatusButton.classList.contains("is-on");
  strategyStatusButton.classList.toggle("is-on", enabled);
  strategyStatusButton.querySelector("span").textContent = enabled ? "启用策略" : "停用策略";
});

strategyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveStrategyForm();
});

getFormField(strategyForm, "content").addEventListener("input", updateStrategyDiff);

[knowledgeTypeFilter, knowledgeStatusFilter, knowledgeSearch].forEach((control) => {
  control.addEventListener("input", renderKnowledge);
  control.addEventListener("change", renderKnowledge);
});

[strategyTypeFilter, strategyStatusFilter, strategySearch].forEach((control) => {
  control.addEventListener("input", renderStrategies);
  control.addEventListener("change", renderStrategies);
});

[agentStatusFilter, agentSearch].forEach((control) => {
  control.addEventListener("input", renderAgents);
  control.addEventListener("change", renderAgents);
});

[salesStatusFilter, salesSearch].forEach((control) => {
  control.addEventListener("input", renderSalesAccounts);
  control.addEventListener("change", renderSalesAccounts);
});

[agentStrategyTypeFilter, agentStrategySearch].forEach((control) => {
  control.addEventListener("input", renderAgentStrategyBindList);
  control.addEventListener("change", renderAgentStrategyBindList);
});

[agentKnowledgeTypeFilter, agentKnowledgeSearch].forEach((control) => {
  control.addEventListener("input", renderAgentKnowledgeBindList);
  control.addEventListener("change", renderAgentKnowledgeBindList);
});

document.querySelector("[data-save-agent-strategy-bind]").addEventListener("click", saveAgentStrategyBind);
document.querySelector("[data-save-agent-knowledge-bind]").addEventListener("click", saveAgentKnowledgeBind);

salesRoleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveSalesRoleConfig();
});

document.querySelectorAll("[data-open-conversation]").forEach((button) => {
  button.addEventListener("click", () => {
    navigate("conversations");
    showToast("已打开会话详情");
  });
});

document.querySelector("[data-run-test]").addEventListener("click", () => {
  const question = document.querySelector("#testQuestion").value.trim();
  const result = document.querySelector("#aiResult");
  const isPrice = question.includes("钱") || question.includes("价格") || question.includes("优惠");
  const shouldHandoff = question.includes("投诉") || question.includes("合同") || question.includes("人工");
  const agent = getAgentById(selectedAgentId);
  const roleName = agent?.name || "当前AI角色";
  const strategyCount = Array.isArray(agent?.strategyIds) ? agent.strategyIds.length : 0;
  const knowledgeCount = Array.isArray(agent?.knowledgeIds) ? agent.knowledgeIds.length : 0;

  result.innerHTML = `
    <strong>AI回复</strong>
    <p>${isPrice ? `我是${escapeHtml(roleName)}。价格会根据账号数量、服务版本和部署方式有所不同。我会参考已绑定的${strategyCount}个策略和${knowledgeCount}条知识，先了解您的销售团队规模，再推荐合适方案。` : `我是${escapeHtml(roleName)}。我会结合已绑定策略和知识库，先确认您的需求场景，再给出下一步建议。`}</p>
    <dl>
      <div><dt>客户意图</dt><dd>${isPrice ? "询价" : "需求咨询"}</dd></div>
      <div><dt>意向等级</dt><dd>${isPrice ? "中" : "低"}</dd></div>
      <div><dt>是否转人工</dt><dd>${shouldHandoff ? "是" : "否"}</dd></div>
    </dl>
  `;
  showToast("测试回复已生成");
});

document.querySelector("[data-takeover]").addEventListener("click", () => {
  conversationStatus.textContent = "人工接管中";
  conversationStatus.className = "badge warning";
  showToast("已切换为人工接管");
});

document.querySelector("[data-return-ai]").addEventListener("click", () => {
  conversationStatus.textContent = "AI接待中";
  conversationStatus.className = "badge success";
  showToast("已重新交给AI");
});

document.querySelector("[data-close-conversation]").addEventListener("click", () => {
  conversationStatus.textContent = "已结束";
  conversationStatus.className = "badge neutral";
  showToast("会话已标记结束");
});

document.querySelectorAll(".btn.primary, .btn.secondary").forEach((button) => {
  if (
    button.dataset.route ||
    button.dataset.runTest !== undefined ||
    button.dataset.takeover !== undefined ||
    button.dataset.saveCompany !== undefined ||
    button.dataset.newCompany !== undefined ||
    button.dataset.saveAgent !== undefined ||
    button.dataset.newAgent !== undefined ||
    button.dataset.saveAccount !== undefined ||
    button.dataset.newAccount !== undefined ||
    button.dataset.saveKnowledge !== undefined ||
    button.dataset.newKnowledge !== undefined ||
    button.dataset.newFileKnowledge !== undefined ||
    button.dataset.newStrategy !== undefined ||
    button.dataset.saveStrategy !== undefined ||
    button.dataset.saveAgentStrategyBind !== undefined ||
    button.dataset.saveAgentKnowledgeBind !== undefined ||
    button.dataset.saveSalesRole !== undefined
  ) {
    return;
  }
  button.addEventListener("click", () => {
    const text = button.textContent.trim();
    if (text.includes("保存")) showToast("配置已保存");
    if (text.includes("同步")) showToast("企微账号同步完成");
    if (text.includes("测试连接")) showToast("连接测试通过");
    if (text.includes("上传")) showToast("文件上传入口已打开");
    if (text.includes("新增")) showToast("新增表单已准备");
  });
});

const initialRoute = window.location.hash.replace("#", "") || "dashboard";
const storedLoginRole = loginRole;
setLoginRole(loginRole || "platform");
renderCompanies();
if (selectedCompanyId) selectCompany(selectedCompanyId, false);
renderAgents();
if (selectedAgentId) selectAgent(selectedAgentId, false);
renderSalesAccounts();
renderKnowledge();
startNewKnowledge("text", false);
renderStrategies();
populateAccountCompanyOptions();
populateAccountRoleOptions();
startNewAccount(false);
renderAccounts();
applyAuth(storedLoginRole);
navigate(initialRoute);
