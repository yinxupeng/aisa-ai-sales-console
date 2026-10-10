import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/pages/DashboardPage.jsx", import.meta.url), "utf8");

assert.doesNotMatch(source, /title="意向分布"/);
assert.doesNotMatch(source, /title="人机协同动作"/);

console.log("DASHBOARD EXCLUDED COLLABORATION SECTIONS: PASS");
