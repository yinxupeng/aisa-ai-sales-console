import assert from "node:assert/strict";
import fs from "node:fs";

const pageSource = fs.readFileSync(new URL("../src/pages/UserInsightPage.jsx", import.meta.url), "utf8");
const configSource = fs.readFileSync(new URL("../src/pages/UserInsightConfigPage.jsx", import.meta.url), "utf8");
const dataSource = fs.readFileSync(new URL("../src/data/userInsightData.js", import.meta.url), "utf8");
const strategyEditorSource = fs.readFileSync(new URL("../src/pages/StrategyEditor.jsx", import.meta.url), "utf8");

assert.match(pageSource, /用户洞察与建议/);
assert.match(pageSource, /历史有效聊天人数/);
assert.match(pageSource, /聊天总结/);
assert.match(pageSource, /用户洞察/);
assert.match(pageSource, /关键风险/);
assert.match(pageSource, /销售建议/);
assert.match(pageSource, /提示词摘要/);
assert.match(pageSource, /onViewConversation/);
assert.match(pageSource, /洞察生成配置/);
assert.match(configSource, /分析人群范围/);
assert.match(configSource, /输出内容/);
assert.match(configSource, /生成提示词/);
assert.match(dataSource, /totalUsers: 291/);
assert.match(dataSource, /historicalValidChatUsers:/);
assert.match(strategyEditorSource, /strategy-agent-config-removed/);

console.log("USER INSIGHT PAGE STRUCTURE: PASS");
