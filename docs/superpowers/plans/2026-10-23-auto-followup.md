# 自动定时任务 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现已确认的自动单次跟进原型和冲突复核闭环。

**Architecture:** 纯函数接收state、用户ID、任务ID和显式时间，返回新state；数据模块提供可复现心理课程演示场景；现有AntD页面集成配置、详情与记录。所有发送均为模拟，不使用网络或真实定时器。

**Tech Stack:** React JSX、Ant Design 6、JavaScript领域模块、Node断言与SSR。

**Spec:** docs/superpowers/specs/2026-10-23-auto-followup-design.md

## Global Constraints
- 仅观心实验室儿童心理健康课程数据。
- 人工与事件任务只读；同账号用户去重；家长未回复不二次跟进。
- 所有时间明确Asia/Shanghai；演示发送不得调用外部服务。
- 保留现有未提交改动，不提交、不推送、不切换工作区。

## Review Focus
- 取消/暂停/人工审核状态是否会误发。
- 人工任务创建在AI计划之后仍须阻止发送。
- 跨账号同名用户不能误判冲突。
- 保存配置、修改消息、过期、零条记录等边界。
- 演示控制不能被误认为真实企微任务调度或会话接入。

## Task 1：规则与模拟数据
Files: src/domain/autoFollowup.js, src/data/autoFollowupData.js, scripts/verify-auto-followup.mjs。
Interfaces: createAutoTask(state,userId,now)、checkAutoTask(state,task,now)、executeAutoTask(state,id,now,fail=false)、saveAutoConfig(state,config,now)、editAutoTask(state,id,patch,now)、confirmAutoTask(state,id,now)、cancelAutoTask(state,id,now)、updateDemoUser(state,userId,patch)。全部保持输入不变。
- [x] 写测试并验证新增tab/模块缺失时失败。
- [x] 实现范围、沉默、单轮发送、重复、时段、过期、风险、人工优先及幂等规则，完成数据集。
- [x] 运行node scripts/verify-auto-followup.mjs，覆盖Review Focus，预期AUTO_FOLLOWUP_OK。

## Task 2：配置与任务页面
Files: src/pages/AutoScheduledTasksPage.jsx, src/pages/AutoScheduledTaskConfigPage.jsx, src/components/AutoScheduledTaskDrawer.jsx, src/pages/HumanCollaborationPage.jsx, src/app.css。
Consumes: Task 1 interfaces。配置验证失败不可保存；对记录页和主页面共用详情、修改与取消即时刷新列表；风险不能通过人工确认变为自动发送。
- [x] 添加SSR检查并观察失败。
- [x] 实现主列表、筛选卡片、独立配置页和记录页、详情与显式演示控制。
- [x] 在现有tab最后添加自动定时任务，不新增侧边菜单。
- [x] 添加分析Skill及安全提示词，配置引用系统内可见的启用Skill。
- [x] 运行构建、SSR、业务与既有回归；报告原有失败。

## Task 3：验证及复核
- [x] 独立审阅新增模块及接入，关注Review Focus。
- [x] 修复重要发现并补回归测试。
- [x] 更新执行记录并给出原型边界；浏览器访问限制仍有效，不绕过、不宣称视觉验收通过。

## Execution ledger

Ruling: 在用户正在使用的既有工作区原地扩展，避免复制未提交原型并导致预览不更新；不执行任何提交或推送。
Ruling: 人工/事件队列和新聊天仅以明确的演示快照接入复核，不把该原型表述为已打通真实调度。

Task 1: complete — verify-auto-followup.mjs已先红后绿，覆盖创建、复核、审核、暂停/恢复、人工与事件冲突、单轮限制和幂等；任务消息改后需重新审核，即使配置切回自动模式。
Task 2: complete — 新增tab、四张统计卡、筛选分页、配置、记录、详情、演示控制和独立可见的AI主动跟进规划Skill；SSR扩展至33个页面用例并通过。
Verification: 既有全量回归verify-skill-orchestration.mjs先在“所属部门”字段断言处失败；该列已由用户明确要求删除，旧断言未与产品改动同步。本次不恢复被删除字段。
Task 3: complete — 独立审阅发现3项重要边界，均以复现测试RED→GREEN修复：延迟发送使用实际发送时间避让人工队列；仅人工沟通时间快照也触发保护间隔；冻结演示时钟下的即时回复推进事件时间，确实开启新轮次。另补模式切换后修改已审核消息仍须复审的回归。
Final review: 3项重要问题已修复，无未处理的重要发现；没有合并、提交、推送或真实发送操作。
