import assert from "node:assert/strict";
import fs from "node:fs";

const pageSource = fs.readFileSync(new URL("../src/pages/UserInsightPage.jsx", import.meta.url), "utf8");
const dataSource = fs.readFileSync(new URL("../src/data/userInsightData.js", import.meta.url), "utf8");

assert.match(pageSource, /用户洞察与建议/);
assert.match(pageSource, /历史有效聊天人数/);
assert.match(pageSource, /聊天总结/);
assert.match(pageSource, /用户洞察/);
assert.match(pageSource, /关键风险/);
assert.match(pageSource, /销售建议/);
assert.match(pageSource, /提示词摘要/);
assert.match(pageSource, /onViewConversation/);
assert.match(dataSource, /totalUsers: 291/);
assert.match(dataSource, /historicalValidChatUsers:/);

console.log("USER INSIGHT PAGE STRUCTURE: PASS");
