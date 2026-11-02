import assert from "node:assert/strict";
import { userInsightGenerationRecords } from "../src/data/userInsightData.js";

for (const record of userInsightGenerationRecords) {
  assert.equal(record.failedInsightUsers, record.shouldInsightUsers - record.successfulInsightUsers, "失败人数只包含应洞察但未成功的用户");
  assert.equal(record.failureReasons.reduce((sum, item) => sum + item.count, 0), record.failedInsightUsers, "失败原因人数合计应等于失败人数，每人仅归入一个最终原因");
  assert.ok(record.failureReasons.every((item) => item.reason.trim() && Number.isInteger(item.count) && item.count > 0));
}
assert.ok(userInsightGenerationRecords.some((record) => record.failedInsightUsers > 0), "应提供部分失败的演示批次");
assert.ok(userInsightGenerationRecords.some((record) => record.failedInsightUsers === 0), "应覆盖无失败批次");
console.log("INSIGHT_FAILURES_OK");
