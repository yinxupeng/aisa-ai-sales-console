import { computeSalesReport } from "./salesReports.js";
import { createReportArtifact } from "./salesReportArtifacts.js";
import { cohortConversionDefinition } from "./cohortConversionReport.js";
import { orderQueryDefinition, enrichOrderQueryWorkspace } from "./orderQueryReport.js";
export const orderDemoSessionId = "sales-assistant-yesterday-orders-demo";
export function withOrderQueryDemo(workspace) {
  if (workspace.orderDemoInitialized) return enrichOrderQueryWorkspace(workspace);
  const result = computeSalesReport(orderQueryDefinition, []);
  const demo = { id: orderDemoSessionId, title: "昨日销售订单查询 · 10月29日", updatedAt: "2026-10-30 10:00", pinned: true, pinnedAt: 3, definition: { ...orderQueryDefinition }, dataResult: result, pageGenerated: false,
    messages: [
      { role: "user", text: "查一下昨天（10月29日）生成多少订单，统计销售企微促成的正价课订单和成交额，排除交付班主任角色。" },
      { role: "assistant", status: "complete", text: "昨天（10月29日）销售企微促成的正价课订单共22笔，成交总额为106,500元。主力商品为《青少年同行者计划领航营》，共20笔。以下按你提供的模拟数据说明日志情况、统计口径和剔除项。", orderReport: result }
    ] };
  return { ...workspace, orderDemoInitialized: true, sessions: workspace.sessions.some((item) => item.id === demo.id) ? workspace.sessions : [demo, ...workspace.sessions] };
}
export const cohortDemoSessionId = "sales-assistant-cohort-conversion-demo";
export function withCohortConversionDemo(workspace, visibleKeys) {
  if (workspace.cohortDemoInitialized) return workspace;
  const result = computeSalesReport(cohortConversionDefinition, visibleKeys);
  const demo = { id: cohortDemoSessionId, title: "近一周体验课转化率 · 分销售与期次", updatedAt: "2026-10-30 09:00", pinned: true, pinnedAt: 2,
    definition: { ...cohortConversionDefinition }, dataResult: result, pageGenerated: true,
    messages: [
      { role: "user", text: "帮我看最近一周每天、每个期次体验课的转化率，分销售看。先在对话里输出数据结果，不用生成页面。" },
      { role: "assistant", status: "complete", text: `已统计2026-10-23至10-29的体验课数据，共14个期次。先展示各销售汇总和每天、每期次明细。整体转化率为${result.metrics[2][1]}，按总报名人数÷总体验课人次计算。以下为模拟数据。`, chatReport: result },
      { role: "user", text: "把上面的数据生成一个页面，保留销售汇总、每日每期次明细和转化率图表。" },
      { role: "assistant", status: "complete", text: "已将上面的数据生成报表页面，数据与聊天中的结果一致。点击下方报表文件可在右侧打开。你可以先检查，再决定是否保存报表或配置定时生成；当前未自动保存或创建任务。", artifact: createReportArtifact({ definition: cohortConversionDefinition, result, name: "最近一周体验课转化率（分销售与期次）" }) }
    ] };
  return { ...workspace, cohortDemoInitialized: true, sessions: workspace.sessions.some((item) => item.id === demo.id) ? workspace.sessions : [demo, ...workspace.sessions] };
}

export const intentDemoSessionId = "sales-assistant-intent-analysis-demo";
export function withIntentAnalysisDemo(workspace) {
  if (workspace.intentDemoInitialized) return workspace;
  const demo = {
    id: intentDemoSessionId, title: "用户意向度分析 · 演示", demoPage: "intentAnalysis",
    updatedAt: "2026-10-29 09:00", pinned: true, pinnedAt: 1,
    messages: [
      { role: "user", text: "帮我整理观心实验室课程用户的意向度，展示各档位人数、用户明细和跟进策略。" },
      { role: "assistant", status: "complete", text: "已整理用户意向度分析演示。右侧展示与人机协作一致的意向档位、筛选条件、用户列表和跟进建议，可点击档位筛选，或查看具体用户分析。你也可以新建任务，通过聊天生成其他报表。" }
    ]
  };
  return { ...workspace, intentDemoInitialized: true, sessions: workspace.sessions.some((item) => item.id === demo.id) ? workspace.sessions : [demo, ...workspace.sessions] };
}
