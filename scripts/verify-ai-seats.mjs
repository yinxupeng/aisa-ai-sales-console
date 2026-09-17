import assert from "node:assert/strict";

import {
  applyAiSeatChange,
  getAiSeatUsage,
  getAiSeatView
} from "../src/domain/aiSeats.js";

const license = {
  total: 2,
  expiresAt: "2027-06-30"
};

const rows = [
  { key: "sale1", name: "沈海龙", aiSeatEnabled: true },
  { key: "sale2", name: "李老师企微", aiSeatEnabled: false },
  { key: "sale3", name: "陈老师企微", aiSeatEnabled: false }
];

assert.deepEqual(getAiSeatUsage(rows, license), {
  total: 2,
  enabled: 1,
  remaining: 1
});

const enabledRows = applyAiSeatChange(rows, license, "sale2", true);
assert.equal(enabledRows.find((item) => item.key === "sale2").aiSeatEnabled, true);
assert.equal(enabledRows.find((item) => item.key === "sale2").aiSeatOpenedAt, "2026-09-06");
assert.equal(getAiSeatUsage(enabledRows, license).remaining, 0);

assert.throws(
  () => applyAiSeatChange(enabledRows, license, "sale3", true),
  /AI 席位已用完/
);

const disabledRows = applyAiSeatChange(enabledRows, license, "sale1", false);
assert.equal(disabledRows.find((item) => item.key === "sale1").aiSeatEnabled, false);
assert.equal(disabledRows.find((item) => item.key === "sale1").aiSeatClosedAt, "2026-09-06");
assert.equal(getAiSeatUsage(disabledRows, license).remaining, 1);

assert.deepEqual(getAiSeatView({ aiSeatEnabled: true }, license, "2027-05-30"), {
  status: "active",
  label: "已开通",
  color: "success",
  expiresAt: "2027-06-30"
});

assert.deepEqual(getAiSeatView({ aiSeatEnabled: true }, license, "2027-06-20"), {
  status: "expiring",
  label: "即将到期",
  color: "warning",
  expiresAt: "2027-06-30"
});

assert.deepEqual(getAiSeatView({ aiSeatEnabled: true }, license, "2027-07-01"), {
  status: "expired",
  label: "已过期",
  color: "error",
  expiresAt: "2027-06-30"
});

assert.deepEqual(getAiSeatView({ aiSeatEnabled: false }, license, "2027-06-01"), {
  status: "inactive",
  label: "未开通",
  color: "default",
  expiresAt: ""
});

console.log("AI_SEAT_RULES_OK");
