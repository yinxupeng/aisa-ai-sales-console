import assert from "node:assert/strict";
import { intentGenerationRecords, dailyReportGenerationRecords } from "../src/data/analysisGenerationRecords.js";
import { dailyReportSummary, dailyReportSchedule } from "../src/data/dailyReportData.js";
import { intentAnalysisUsers, intentAnalysisSchedule } from "../src/data/intentAnalysisData.js";

for (const records of [intentGenerationRecords, dailyReportGenerationRecords]) {
  assert.equal(new Set(records.map((record) => record.id)).size, records.length, "批次ID不可重复");
  assert.ok(records.length > 6, "演示记录应覆盖至少两页");
  records.forEach((record, index) => {
    assert.equal(record.successfulUsers + record.incompleteUsers, record.expectedUsers, "批次数量必须闭合");
    assert.ok(record.successfulUsers >= 0 && record.incompleteUsers >= 0);
    assert.equal(record.status, record.incompleteUsers ? "部分完成" : "已完成");
    if (index) assert.ok(record.executedAt < records[index - 1].executedAt, "批次须按执行时间倒序");
    assert.ok(record.details.length && record.summary, "批次需保存当时的口径及摘要");
  });
}
assert.equal(intentGenerationRecords[0].executedAt, intentAnalysisSchedule.lastRunAt);
assert.equal(intentGenerationRecords[0].expectedUsers, intentAnalysisUsers.length);
assert.equal(dailyReportGenerationRecords[0].executedAt, dailyReportSchedule.generatedAt);
assert.equal(dailyReportGenerationRecords[0].successfulUsers, dailyReportSummary.chatUsers);
assert.equal(dailyReportGenerationRecords[0].details[0].value, "2026-10-09 18:00 至 2026-10-10 18:00");
assert.equal(dailyReportGenerationRecords.at(-1).details[0].value, "2026-09-30 18:00 至 2026-10-01 18:00", "统计周期需处理跨月");
console.log("ANALYSIS_GENERATION_RECORDS_OK");
