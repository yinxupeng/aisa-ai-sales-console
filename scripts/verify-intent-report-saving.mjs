import assert from "node:assert/strict";
import { defaultIntentRules } from "../src/data/intentRules.js";
import { computeSalesReport, reportAccounts } from "../src/data/salesReports.js";
import { simulateReportRun } from "../src/data/reportSchedules.js";
import { createReportArtifact } from "../src/data/salesReportArtifacts.js";
const definition = { type: "intent", presentation: "intentAnalysis", intentConfig: {
  rules: structuredClone(defaultIntentRules), userStages: ["第三节课", "第四节课", "第5节课"], wecomRole: "all", hostingStatus: "不限", historicalChatThreshold: "不限", todayChatThreshold: "不限"
} };
const keys = reportAccounts.map((account) => account.key);
const result = computeSalesReport(definition, keys);
assert.equal(result.presentation, "intentAnalysis");
assert.ok(result.intentSnapshot.users.length > 0);
assert.equal(result.intentSnapshot.users.length, result.rows.length);
assert.equal(result.chart.reduce((sum, row) => sum + row.value, 0) + result.rows.filter((row) => row.level < 0).length, result.rows.length);
assert.ok(result.rows.every((row) => keys.includes(row.accountKey)));
const artifact = createReportArtifact({ definition, result });
assert.equal(artifact.kind, "intentAnalysis");
assert.equal(artifact.result.intentSnapshot.users.length, result.rows.length);
const report = { id: "intent", name: "用户意向度分析", definition, result };
const before = JSON.stringify(report);
const execution = simulateReportRun(report, ["wecom-li"]);
assert.equal(execution.status, "成功");
assert.equal(execution.result.presentation, "intentAnalysis");
assert.ok(execution.result.rows.every((row) => row.accountKey === "wecom-li"));
assert.equal(JSON.stringify(report), before, "模拟执行不能覆盖已保存的历史快照");
definition.intentConfig.rules[0].label = "新名称";
assert.notEqual(result.intentSnapshot.batch.config.rules[0].label, "新名称");
console.log("INTENT_REPORT_SAVING_OK");
