import assert from "node:assert/strict";
import { getAiSeatUsage } from "../src/domain/aiSeats.js";

const license = { total: 2, expiresAt: "2027-06-30" };
const rows = [
  { key: "sale1", aiSeatEnabled: true, online: false, hosted: false },
  { key: "sale2", aiSeatEnabled: false },
  { key: "sale3", aiSeatEnabled: false }
];
assert.deepEqual(getAiSeatUsage(rows, license), { total: 2, enabled: 1, remaining: 1 }, "账号离线或暂停 AI 仍占用额度");
assert.deepEqual(getAiSeatUsage(rows, {...license,total:5}), {total:5,enabled:1,remaining:4}, "扩容只更新企业账号额度");
assert.deepEqual(getAiSeatUsage(rows, {...license,expiresAt:'2028-06-30'}), getAiSeatUsage(rows,license), "企业续期不改变已分配账号数");
assert.deepEqual(getAiSeatUsage([], license), {total:2,enabled:0,remaining:2});
assert.deepEqual(getAiSeatUsage(rows.map(row=>({...row,aiSeatEnabled:true})), {...license,total:3}), {total:3,enabled:3,remaining:0});
console.log("AI_SEAT_RULES_OK: 企业统一额度、离线占用、扩容和续期");
