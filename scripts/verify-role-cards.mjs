import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { getRolePage, filterRoles, rolePageSize, ROLE_CATALOG_DATA } from "../src/data/roleCatalog.js";

const sampleRoles = Array.from({ length: 16 }, (_, index) => ({
  key: `role-${index}`,
  roleName: `角色${index}`,
  industry: index % 2 ? "医疗健康" : "教育培训"
}));

assert.equal(rolePageSize, 12);
assert.equal(filterRoles(sampleRoles, "医疗健康", "角色15").length, 1);
assert.equal(getRolePage(sampleRoles, 1).length, 12);
assert.equal(getRolePage(sampleRoles, 2).length, 4);
assert.equal(ROLE_CATALOG_DATA.length, 39);
assert.ok(ROLE_CATALOG_DATA.every(({ avatar }) => !avatar.startsWith("/")));
assert.ok(ROLE_CATALOG_DATA.every(({ avatar }) => existsSync(new URL(`../${avatar}`, import.meta.url))));

console.log("role card catalog checks passed");
