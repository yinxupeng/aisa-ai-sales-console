import assert from "node:assert/strict";
import { INDUSTRY_SKILL_DATA, INDUSTRY_TOOL_DATA, capabilityPageSize, filterCapabilities, getCapabilityPage } from "../src/data/industryCapabilityData.js";

assert.equal(INDUSTRY_SKILL_DATA.length, 24);
assert.equal(INDUSTRY_TOOL_DATA.length, 24);
assert.equal(capabilityPageSize, 10);
assert.equal(filterCapabilities(INDUSTRY_SKILL_DATA, "医疗健康", "预约").length, 1);
assert.equal(getCapabilityPage(INDUSTRY_TOOL_DATA, 3).length, 4);

console.log("industry capability checks passed");
