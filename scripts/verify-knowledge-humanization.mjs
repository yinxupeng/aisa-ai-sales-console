import assert from "node:assert/strict";
import { INDUSTRY_KNOWLEDGE_BASES, INDUSTRY_HUMANIZATION_DATA, capabilityPageSize } from "../src/data/knowledgeHumanizationData.js";

assert.equal(INDUSTRY_KNOWLEDGE_BASES.length, 24);
assert.equal(INDUSTRY_HUMANIZATION_DATA.length, 24);
assert.equal(capabilityPageSize, 10);
assert.ok(INDUSTRY_KNOWLEDGE_BASES.every((item) => item.industry && item.entries?.length));
assert.ok(INDUSTRY_HUMANIZATION_DATA.every((item) => item.industry && Array.isArray(item.antiGrabWaits)));

console.log("knowledge and humanization checks passed");
