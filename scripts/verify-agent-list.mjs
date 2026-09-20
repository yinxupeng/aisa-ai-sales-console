import assert from "node:assert/strict";
import { getAgentPage, filterAgents, agentPageSize, INDUSTRY_AGENT_DATA } from "../src/data/agentCatalog.js";

const sampleRows = [
  { name: "成人教育顾问", industry: "成人教育", trigger: "课程咨询" },
  { name: "医疗健康顾问", industry: "医疗健康", trigger: "预约咨询" }
];

assert.equal(agentPageSize, 10);
assert.equal(INDUSTRY_AGENT_DATA.length, 24);
assert.equal(filterAgents(sampleRows, "医疗健康", "预约").length, 1);
assert.equal(getAgentPage([...sampleRows, ...INDUSTRY_AGENT_DATA], 1).length, 10);

console.log("agent list catalog checks passed");
