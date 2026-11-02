export const defaultJuziBaseUrl = "https://stride-bg.dpclouds.com/stream-api";

export const defaultJuziAccounts = [
  "观心-林晓顾问组", "观心-周宁顾问组", "观心-陈妍顾问组", "观心-课程服务组",
  "观心-家长沟通组", "观心-课后陪伴组", "观心-预约咨询组", "观心-备用通道", "观心-学习支持组"
].map((label, index) => ({
  id: `juzi-account-${index + 1}`,
  label,
  baseUrl: defaultJuziBaseUrl,
  appKey: `demo_guanxin_channel_${String(index + 1).padStart(4, "0")}`,
  active: index < 3,
  lastSyncedAt: index === 7 ? null : `2026-10-22 ${index < 3 ? "15:36" : "09:53"}`
}));

function normalizeBaseUrl(value) {
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error("请输入有效的 HTTP 或 HTTPS Base URL，不含账号密码、查询参数或片段");
  return url.href.replace(/\/+$/, "");
}

export function validateJuziAccount(values, accounts, editingId = null) {
  const errors = {};
  const label = values.label?.trim();
  if (!label) errors.label = "请输入配置标识";
  else if (label.length > 50) errors.label = "配置标识最多50个字符";
  else if (accounts.some((account) => account.id !== editingId && account.label.toLowerCase() === label.toLowerCase())) errors.label = "配置标识已存在，请使用其他标识";
  try { normalizeBaseUrl(values.baseUrl?.trim()); } catch { errors.baseUrl = "请输入有效的 HTTP 或 HTTPS Base URL，不含账号密码、查询参数或片段"; }
  if (!values.appKey?.trim()) errors.appKey = "请输入 App Key";
  else if (/\s/.test(values.appKey.trim())) errors.appKey = "App Key 不能包含空格或换行";
  return errors;
}

export function saveJuziAccount(accounts, values, editingId = null) {
  const existing = accounts.find((account) => account.id === editingId);
  if (editingId && !existing) throw new Error("账号不存在");
  const errors = validateJuziAccount(values, accounts, editingId);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  const normalized = { label: values.label.trim(), baseUrl: normalizeBaseUrl(values.baseUrl.trim()), appKey: values.appKey.trim() };
  if (!existing) return [...accounts, { id: `juzi-account-${globalThis.crypto.randomUUID()}`, ...normalized, active: false, lastSyncedAt: null }];
  const connectionChanged = normalized.baseUrl !== existing.baseUrl || normalized.appKey !== existing.appKey;
  return accounts.map((account) => account.id === editingId ? { ...account, ...normalized, ...(connectionChanged ? { active: false, lastSyncedAt: null } : {}) } : account);
}

export function setJuziAccountActive(accounts, id, active, syncedAt = null) {
  if (!accounts.some((account) => account.id === id)) throw new Error("账号不存在");
  return accounts.map((account) => account.id === id ? { ...account, active, ...(active ? { lastSyncedAt: syncedAt } : {}) } : account);
}

export function deleteJuziAccount(accounts, id) {
  const account = accounts.find((item) => item.id === id);
  if (!account) throw new Error("账号不存在");
  if (account.active) throw new Error("请先取消激活，再删除账号");
  return accounts.filter((item) => item.id !== id);
}

export function maskJuziAppKey(value) {
  return value.length > 8 ? `${value.slice(0, 4)}****${value.slice(-4)}` : "********";
}
