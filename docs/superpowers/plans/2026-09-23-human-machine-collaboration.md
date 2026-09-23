# 人机协作一期 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在“会话中心”下方新增“人机协作”一级菜单，并实现一期的协作总览、AI 转人工、人工派给 AI、任务详情和演示数据闭环。

**Architecture:** 新增独立的 `HumanMachineCollaborationPage` 页面和独立演示数据文件，页面内部用三个视图 Tab 管理统一任务模型。`App.jsx` 只负责菜单、路由和页面挂载；任务筛选、分页、状态变化、详情抽屉和新建任务状态全部由页面管理，不改造现有会话中心的聊天实现。

**Tech Stack:** React 19、Ant Design 6、@ant-design/icons、现有 JSX/CSS 架构、现有 esbuild runtime/build 验证脚本。

**Spec:** `docs/superpowers/specs/2026-09-23-human-machine-collaboration-design.md`

## Global Constraints

- “人机协作”作为“会话中心”下方的独立一级菜单。
- 页面包含协作总览、AI 转人工、人工派给 AI 三个视图。
- AI 输出涉及发送消息、修改客户阶段、修改标签、创建跟进任务等外部动作时，必须先进入“待人工确认”。
- 一期使用演示数据，不接入真实 AI API、真实队列调度、复杂审批链或规则引擎。
- 延续现有 Ant Design 后台风格，支持行业、企业、方向、状态、任务类型、优先级、负责人筛选和分页。
- 不覆盖或重置工作区现有改动；每次修改只触碰本计划列出的文件。

## Review Focus

- 菜单权限：账号没有 `humanCollaboration` 权限时，菜单和路由都不可见；已有账号菜单行为不改变。
- 角色视图：销售/班主任只能看到自己的任务，运营能看到全量任务、分配和转派操作。
- 外部动作安全：需要人工确认的 AI 结果不能直接显示为“已完成”或“已执行”。
- 筛选分页组合：切换筛选条件、视图或新建任务后分页回到第 1 页，空结果有明确空状态。
- 详情联动：关闭详情抽屉、完成/驳回任务、打开会话中心入口后，列表状态和路由不出现过期数据。

### Task 1: 建立人机协作演示任务数据与领域常量

**Files:**
- Create: `src/data/collaborationTasks.js`
- Modify: `src/data/appData.js`（仅在需要复用现有账号/角色名称时增加只读导出，不复制已有数据）

**Interfaces:**
- Produces `collaborationTasks`: 至少 24 条任务，包含教育、医疗、保险、企业服务、本地生活等行业。
- Produces `collaborationTaskTypes`: 任务类型元数据，包含方向、名称、描述和默认 SLA。
- Produces `collaborationTaskStatuses`, `collaborationPriorities` 和 `collaborationRoles`：供页面统一渲染筛选项、Tag 颜色和权限视图。
- 每条任务至少包含：`id`、`direction`、`type`、`title`、`customer`、`conversationKey`、`enterprise`、`industry`、`agent`、`priority`、`status`、`assignee`、`assigneeRole`、`createdAt`、`dueAt`、`aiReason`、`aiConfidence`、`input`、`output`、`requiresHumanConfirmation`、`auditLogs`。

- [ ] **Step 1: 设计并写入两种方向的最小任务样本**

  数据中至少覆盖：高意向承接、投诉升级、敏感业务确认、AI 无法回答、工具失败、回复审核、会话总结、客户画像、意向判断、回复建议、产品推荐和跟进计划；至少包含待处理、处理中、待人工确认、已完成、已驳回、已超时、执行失败和已转派状态。

- [ ] **Step 2: 加入可计算的时间与权限字段**

  使用固定的演示时间字符串和 `dueAt`，不要在数据文件中调用 `Date.now()` 造成 SSR 与浏览器展示不一致；为销售账号和运营账号准备可过滤的负责人字段。

- [ ] **Step 3: 检查数据完整性**

  运行：`node -e "import('./src/data/collaborationTasks.js').then(({ collaborationTasks }) => { if (collaborationTasks.length < 24 || collaborationTasks.some((item) => !item.id || !item.direction || !item.status || !item.industry)) process.exit(1); console.log('collaboration task fixtures valid'); })"`

- [ ] **Step 4: Commit**

  ```bash
  git add src/data/collaborationTasks.js src/data/appData.js
  git commit -m "feat: add collaboration task fixtures"
  ```

### Task 2: 创建人机协作页面骨架、筛选和统一任务列表

**Files:**
- Create: `src/pages/HumanMachineCollaborationPage.jsx`
- Modify: `src/app.css`（新增以 `collaboration-` 为前缀的页面样式）

**Interfaces:**
- Exports default `HumanMachineCollaborationPage({ userRole = "operator", onViewConversation })`。
- Consumes `collaborationTasks` 和 Task 1 的常量。
- Produces `onViewConversation(record)` 调用所需的 `conversationKey`，由 App 跳转回现有会话中心。

- [ ] **Step 1: 写页面渲染冒烟测试入口**

  在 `scripts/verify-runtime.mjs` 临时构造页面实例并渲染，断言页面不会抛出异常；页面实现完成后把该案例保留为正式回归项。

- [ ] **Step 2: 实现页面状态和基础布局**

  页面维护 `activeView`、`filters`、`page`、`pageSize`、`selectedTask`、`drawerOpen`、`tasks` 和 `newTaskModalOpen`。页面结构依次为：角色视图提示、顶部统计卡片、筛选栏、视图 Tab、任务内容区和分页。

- [ ] **Step 3: 实现统计卡片和视图切换**

  协作总览展示待我处理、即将超时、已超时、AI 执行中、待人工审核和今日已完成；卡片点击后切换到对应视图或应用状态筛选。AI 转人工和人工派给 AI 使用统一列表组件，列内容根据方向显示。

- [ ] **Step 4: 实现筛选、排序和分页**

  支持方向、状态、行业、企业、任务类型、优先级、负责人和关键词筛选；状态变化或视图切换后 `page` 重置为 1。列表使用 `Pagination`，无结果显示空状态，不让操作按钮挤出容器。

- [ ] **Step 5: 实现销售/运营数据范围差异**

  `userRole === "employee"` 时只保留当前销售负责和自己发起的任务，并隐藏全量统计、分配和转派操作；`userRole === "operator"` 或 `platform_admin` 时展示全量任务和管理操作。演示账号映射在 Task 3 传入。

- [ ] **Step 6: 加入页面样式并完成局部验证**

  运行：`npm run build`

  预期：构建成功；页面静态结构包含三个视图入口、分页组件和任务空状态。

- [ ] **Step 7: Commit**

  ```bash
  git add src/pages/HumanMachineCollaborationPage.jsx src/app.css
  git commit -m "feat: add collaboration task views"
  ```

### Task 3: 接入菜单、路由、权限和会话中心跳转

**Files:**
- Modify: `src/App.jsx:1-120`（图标、菜单项、页面标题、页面导入）
- Modify: `src/App.jsx:160-285`（路由渲染、角色参数和会话跳转）
- Modify: `src/data/appData.js`（账号的菜单权限数组，若该字段集中在此文件）
- Modify: `scripts/verify-runtime.mjs`（导入并渲染新页面）

**Interfaces:**
- Menu key 固定为 `humanCollaboration`。
- `AppShell` 通过 `user.role` 向页面传入 `userRole`。
- `handleViewConversation` 复用已有逻辑，根据任务的 `conversationKey` 跳回 `conversations` 路由。

- [ ] **Step 1: 为菜单增加权限项**

  在 `conversations` 后面插入 `{ key: "humanCollaboration", icon: <UserSwitchOutlined />, label: "人机协作" }`，并为现有演示账号增加对应菜单权限；保留现有 `getAllowedMenuItems` 逻辑，不修改其他菜单层级。

- [ ] **Step 2: 挂载页面路由**

  导入 `HumanMachineCollaborationPage`，在 `content` 映射中增加 `humanCollaboration`，传入 `userRole` 和 `handleViewConversation`；页面标题由 `pageTitle` 自动生成。

- [ ] **Step 3: 验证 hash 路由和移动端菜单**

  确认直接访问 `#humanCollaboration` 能进入页面，切换菜单会更新 hash，移动端菜单选择后正常关闭；无权限账号访问该 hash 时回到允许的默认页面。

- [ ] **Step 4: 增加 runtime 页面案例**

  在 `scripts/verify-runtime.mjs` 中加入：

  ```js
  import HumanMachineCollaborationPage from './src/pages/HumanMachineCollaborationPage.jsx';
  ['operator', 'employee'].forEach((userRole) => {
    renderToString(React.createElement(HumanMachineCollaborationPage, { userRole, onViewConversation: () => {} }));
  });
  ```

- [ ] **Step 5: 运行回归并提交**

  运行：`npm run test:runtime && npm run build`

  预期：所有页面均能 SSR 渲染，构建成功。

  ```bash
  git add src/App.jsx src/data/appData.js scripts/verify-runtime.mjs
  git commit -m "feat: add human machine collaboration menu"
  ```

### Task 4: 实现任务详情、状态动作和新建 AI 任务

**Files:**
- Modify: `src/pages/HumanMachineCollaborationPage.jsx`
- Modify: `src/app.css`

**Interfaces:**
- 页面内部定义 `openTask(task)`、`updateTaskStatus(taskId, status)`、`handleAssign(taskId, assignee)`、`handleCreateTask(values)`；不引入外部状态管理。
- 详情抽屉读取当前 `selectedTask`，所有操作通过 task id 更新页面本地 `tasks` 数组。

- [ ] **Step 1: 实现详情抽屉**

  抽屉展示任务概览、客户与会话、AI 判断、AI 结果、人工处理和操作日志；AI 结果显示“AI生成”标识和置信度。

- [ ] **Step 2: 实现安全的人工确认动作**

  当 `requiresHumanConfirmation` 为 true 时，显示“待人工确认”提示；只有点击“确认并完成”后才能转为 `已完成`。编辑后发送、采纳、驳回、重新执行均追加一条审计日志；不得把打开详情或查看结果自动当作完成。

- [ ] **Step 3: 实现分配、转派和状态操作**

  运营视图支持选择负责人和修改优先级；销售视图保留接管、完成、驳回等与个人任务相关的动作。完成、驳回、关闭后关闭抽屉并刷新筛选结果。

- [ ] **Step 4: 实现“新建 AI 任务”Modal**

  表单字段为客户/会话、任务类型、智能体、优先级、是否需要人工确认和补充说明。提交后追加一条 `human_to_ai`、`待处理` 任务，默认生成固定演示输出摘要，且不执行任何真实外部动作。

- [ ] **Step 5: 运行行为验证**

  运行：`npm run test:runtime && npm run build`

  手动检查：打开 AI 转人工任务详情、确认一条待人工确认任务、驳回一条任务、新建一条人工派给 AI 任务、切换销售/运营账号、分页和筛选后再打开详情。

- [ ] **Step 6: Commit**

  ```bash
  git add src/pages/HumanMachineCollaborationPage.jsx src/app.css
  git commit -m "feat: add collaboration task actions"
  ```

### Task 5: 最终验证与交付回归

**Files:**
- Modify only if verification reveals a concrete regression: `src/App.jsx`, `src/pages/HumanMachineCollaborationPage.jsx`, `src/data/collaborationTasks.js`, `src/app.css`, `scripts/verify-runtime.mjs`

- [ ] **Step 1: Run all existing verification scripts**

  运行：`npm test && npm run test:runtime && npm run build`

  预期：既有 Skill 编排校验、页面 SSR 校验和生产构建全部通过。

- [ ] **Step 2: Verify route and permission matrix**

  使用演示账号 1、2、3 分别登录，确认人机协作菜单显示符合账号权限；从菜单进入、刷新页面、直接访问 `#humanCollaboration` 均不白屏。

- [ ] **Step 3: Verify UI acceptance cases**

  确认总览统计可点击筛选；两种方向任务都可分页；行业和状态筛选可组合；详情抽屉能查看日志；需要确认的任务不会绕过人工确认；会话入口能回到对应会话。

- [ ] **Step 4: Review diff and commit**

  运行：`git diff --check && git status --short`

  确认没有生成临时 bundle、无关格式化或覆盖用户已有改动后，提交最终变更：

  ```bash
  git add src/App.jsx src/data/appData.js src/data/collaborationTasks.js src/pages/HumanMachineCollaborationPage.jsx src/app.css scripts/verify-runtime.mjs
  git commit -m "feat: complete human machine collaboration MVP"
  ```

## Self-Review Checklist

- Spec coverage: 菜单、三个视图、角色权限、统一任务模型、行业数据、筛选分页、详情抽屉、人工确认、日志、SLA 和一期边界分别覆盖在 Task 1-5。
- Placeholder scan: 计划不依赖 TODO/TBD；演示数据、路由 key、字段名、验证命令和提交范围均已明确。
- Type consistency: 页面使用 `userRole`、`onViewConversation`；任务使用 `direction`、`status`、`requiresHumanConfirmation`；所有后续任务沿用同一命名。
- Review focus coverage: 权限在 Task 3、角色视图与安全动作在 Task 2/4、筛选分页在 Task 2、详情联动在 Task 4/5 中验证。

