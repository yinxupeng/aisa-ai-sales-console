// 企微账号角色范围，不使用员工权限角色或销售姓名匹配。
export function buildWecomRoleOptions(accounts) {
  return [{ value: "all", label: "全部" }, ...Array.from(new Set(accounts.map((account) => account.role).filter(Boolean))).map((role) => ({ value: role, label: role }))];
}
export function matchesWecomRole(role = "all", accountKey, accounts = []) {
  return role === "all" || accounts.some((account) => account.key === accountKey && account.role === role);
}
