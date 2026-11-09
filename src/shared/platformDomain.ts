export type LicenseState = 'draft' | 'active' | 'suspended';
export interface License { total: number; expiresAt: string; status: LicenseState }
// Pick the current fields so legacy cached start dates cannot re-enter authorization data.
export function normalizeLicense({total, expiresAt, status}: License): License {
  return {total, expiresAt, status};
}
export interface WecomAccount {
  key: string; name: string; wecom: string; wecomId: string; department: string;
  assignedUser: string; accountRole: string; role: string; channel: string; online: boolean;
  aiSeatEnabled: boolean; hosted: boolean;
  customerTotal: number; hostedCustomers: number; manualCustomers?: number; syncedAt: string; dedicatedInfo?: string;
}
// Preserve account settings while retiring legacy per-account authorization dates.
export function normalizeWecomAccount(account: WecomAccount & {aiSeatOpenedAt?: string; aiSeatClosedAt?: string}): WecomAccount {
  const {aiSeatOpenedAt, aiSeatClosedAt, ...current} = account;
  return current;
}
export interface Enterprise {
  consultationId?: string;
  id: string; name: string; industry: string; contact: string; phone: string; note: string;
  adminName: string; adminLogin: string; demoPassword: string; activated: boolean;
  license: License; appliedLicense: License; accounts: WecomAccount[];
  createdAt: string; syncedAt: string; revision: number; appliedRevision: number;
}
export interface AuditEntry { id: string; at: string; actor: string; companyId: string; company: string; action: string; detail: string }
export interface Operator { id: string; name: string; login: string; password: string; role: 'admin' | 'operator'; enabled: boolean }
export interface PlatformData { version: 1; enterprises: Enterprise[]; operators: Operator[]; logs: AuditEntry[] }

export const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const dateValue = (value: string) => Date.parse(`${value}T00:00:00Z`);
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(dateValue(value)) && new Date(dateValue(value)).toISOString().slice(0,10) === value;
export function serviceStatus(license: License, today = todayString()) {
  if (license.status !== 'active') return license.status;
  if (license.expiresAt < today) return 'expired';
  if (dateValue(license.expiresAt) - dateValue(today) <= 30 * 86400000) return 'expiring';
  return 'active';
}
export function validateLicense(license: License, accounts: Pick<WecomAccount,'aiSeatEnabled'>[]) {
  if (!Number.isInteger(license.total) || license.total < 0 || license.total > 100000) throw new Error('席位额度须为 0～100000 的整数');
  if (license.total < accounts.filter(a => a.aiSeatEnabled).length) throw new Error('授权额度不能低于当前已分配席位，请企业先释放席位');
  if (!validDate(license.expiresAt)) throw new Error('请输入有效的服务到期时间');
}
export function seatUsage(company: Pick<Enterprise,'accounts'|'appliedLicense'>) {
  const used = company.accounts.filter(a => a.aiSeatEnabled).length;
  return {total: company.appliedLicense.total, used, remaining: Math.max(0,company.appliedLicense.total-used)};
}
export function assignSeats(company: Enterprise, keys: string[], enabled: boolean, today = todayString()): Enterprise {
  if (keys.some(key => !company.accounts.some(a => a.key === key))) throw new Error('所选企微账号不存在于当前企业');
  if (enabled && !['active','expiring'].includes(serviceStatus(company.appliedLicense,today))) throw new Error('当前企业服务未生效、已停用或已过期，无法分配席位');
  const count = company.accounts.filter(a => keys.includes(a.key) && !a.aiSeatEnabled).length;
  if (enabled && count > seatUsage(company).remaining) throw new Error('托管席位已用完，请联系平台扩容');
  return {...company, accounts:company.accounts.map(a => !keys.includes(a.key) ? a : enabled ? {...normalizeWecomAccount(a), aiSeatEnabled:true} : {...normalizeWecomAccount(a),aiSeatEnabled:false,hosted:false})};
}
export function syncLicense(company: Enterprise): Enterprise {
  validateLicense(company.license,company.accounts);
  return {...company,appliedLicense:normalizeLicense(company.license),appliedRevision:company.revision,syncedAt:new Date().toLocaleString('zh-CN',{hour12:false}),accounts:company.accounts.map(a => ['active','expiring'].includes(serviceStatus(company.license)) ? a : {...a,hosted:false})};
}
export const statusLabels: Record<string,string> = {draft:'待开通',active:'服务中',suspended:'已停用',expired:'已到期',expiring:'即将到期'};
export const statusColors: Record<string,string> = {draft:'default',active:'success',suspended:'default',expired:'error',expiring:'warning'};
