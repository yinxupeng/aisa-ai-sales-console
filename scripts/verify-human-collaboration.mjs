import assert from "node:assert/strict";
import fs from "node:fs";

const appSource = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const dataSource = fs.readFileSync(new URL("../src/data/appData.js", import.meta.url), "utf8");
const pageSource = fs.readFileSync(new URL("../src/pages/HumanCollaborationPage.jsx", import.meta.url), "utf8");

assert.match(appSource, /key: "humanCollaboration"/);
assert.doesNotMatch(appSource, /key: "humanCollaboration"[^}]*children:/);
assert.match(appSource, /humanCollaboration: <HumanCollaborationPage/);
assert.match(appSource, /\["intentAnalysis", "dailyReport"\]\.includes\(rawInitialRoute\)/);
assert.doesNotMatch(appSource, /intentAnalysis: <IntentAnalysisPage/);
assert.doesNotMatch(appSource, /dailyReport: <DailyReportPage/);
assert.match(dataSource, /menuKeys: \["dashboard", "conversations", "humanCollaboration"/);
assert.doesNotMatch(dataSource, /menuKeys: \[[^\]]*"intentAnalysis"/);
assert.doesNotMatch(dataSource, /menuKeys: \[[^\]]*"dailyReport"/);
assert.match(pageSource, /Tabs/);
assert.match(pageSource, /用户意向度分析/);
assert.match(pageSource, /用户沟通日报/);

console.log("HUMAN COLLABORATION TAB STRUCTURE: PASS");
