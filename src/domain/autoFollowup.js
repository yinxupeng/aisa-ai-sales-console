import { matchesWecomRole } from "../data/wecomRoleScope.js";
export const autoFollowupStages = ["开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];
export const openAutoStatuses = ["pending", "review", "paused"];
export const autoStatusLabels = { pending: "待发送", review: "待人工确认", paused: "已暂停", sent: "已发送", cancelled: "已取消", failed: "执行失败" };
export const autoStatusColors = { pending: "processing", review: "warning", paused: "default", sent: "success", cancelled: "default", failed: "error" };
const millis = (value) => value ? Date.parse(value) : NaN;
const sameUser = (a, b) => a.userId === b.userId && a.accountKey === b.accountKey;
export const formatAutoTime = (value) => Number.isFinite(millis(value)) ? new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(value)) : "—";
const inWindow = (value, config) => {
  const time = formatAutoTime(value).slice(11, 16);
  return time >= config.sendStart && time < config.sendEnd;
};

export function validateAutoConfig(config, skillKeys = []) {
  if (typeof config.enabled !== "boolean") return "请选择启用状态";
  if (config.hostingStatus !== undefined && !["不限", "已托管", "未托管"].includes(config.hostingStatus)) return "请选择有效的托管状态";
  if (!config.accountKeys?.length || !config.stages?.length) return "请至少选择一个企微账号和用户阶段";
  if (config.stages.some((stage) => stage !== "all" && !autoFollowupStages.includes(stage))) return "存在无效的用户阶段";
  if (!Number.isInteger(config.silenceMinutes) || config.silenceMinutes < 1 || config.silenceMinutes > 1440) return "沉默时长应为1～1440分钟整数";
  if (!Number.isInteger(config.protectionMinutes) || config.protectionMinutes < 1 || config.protectionMinutes > 1440) return "保护间隔应为1～1440分钟整数";
  if (![config.sendStart, config.sendEnd].every((value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)) || config.sendStart >= config.sendEnd) return "发送时段需在同一天内，结束时间须晚于开始时间";
  if (!["auto", "review"].includes(config.sendMode)) return "请选择发送方式";
  if (!skillKeys.includes(config.skillKey)) return "请选择有效的已启用分析 Skill";
  return "";
}

export function findAutoConflicts(state, task, now = task.plannedAt) {
  const interval = state.config.protectionMinutes * 60000;
  const sendTime = Math.max(millis(task.plannedAt), millis(now));
  const queued = state.relatedTasks.filter((item) => sameUser(item, task) && item.status === "pending"
    && (Math.abs(millis(item.plannedAt) - sendTime) <= interval || (task.topicKey && item.topicKey === task.topicKey)));
  const recent = state.outbounds.filter((item) => sameUser(item, task) && millis(item.sentAt) <= millis(now) && millis(now) - millis(item.sentAt) <= interval);
  const user = state.users.find((item) => item.id === task.userId && item.accountKey === task.accountKey);
  const humanSnapshot = user?.lastHumanAt && millis(user.lastHumanAt) <= sendTime && sendTime - millis(user.lastHumanAt) <= interval
    ? [{ id: `human-snapshot-${user.id}`, userId: user.id, accountKey: user.accountKey, source: "manual", sentAt: user.lastHumanAt, content: "近期人工主动沟通快照" }] : [];
  return [...queued, ...recent, ...humanSnapshot];
}

export function checkAutoTask(state, task, now = state.now) {
  const checks = [];
  const decision = (outcome, reason, reasonCode) => ({ outcome, reason, reasonCode, checks });
  const gate = (label, passed, detail) => { checks.push({ label, status: passed ? "passed" : "blocked", detail }); return passed; };
  if (!openAutoStatuses.includes(task.status)) return decision("terminal", "任务已结束，不会再次发送", "terminal");
  if (!gate("时间有效", Number.isFinite(millis(now)) && Number.isFinite(millis(task.plannedAt)) && Number.isFinite(millis(task.expiresAt)), "计划、失效与检查时间必须有效")) return decision("cancel", "时间信息不完整", "invalid");
  if (!gate("启用状态", state.config.enabled, state.config.enabled ? "自动任务已启用" : "配置已关闭，暂停未发送任务")) return decision("pause", "自动任务配置已关闭", "disabled");
  if (validateAutoConfig(state.config, state.skillKeys)) return decision("pause", "当前配置或分析 Skill 不可用", "config");
  if (!gate("任务期限", millis(now) < millis(task.expiresAt), `失效时间 ${formatAutoTime(task.expiresAt)}`)) return decision("cancel", "任务已过期，不补发旧消息", "expired");
  const user = state.users.find((item) => item.id === task.userId && item.accountKey === task.accountKey);
  if (!gate("用户关联", Boolean(user), "校验所属企微和用户标识")) return decision("cancel", "用户或企微账号已不可用", "missing");
  const hostingInScope = !state.config.hostingStatus || state.config.hostingStatus === "不限" || (state.config.hostingStatus === "已托管" ? user.hosted === true : user.hosted === false);
  const inScope = hostingInScope && (state.config.accountKeys.includes("all") || state.config.accountKeys.includes(user.accountKey)) && (state.config.stages.includes("all") || state.config.stages.includes(user.stage)) && matchesWecomRole(state.config.wecomRole, user.accountKey, state.accounts);
  if (!gate("分析范围", inScope, `${user.accountName} · ${user.stage}`)) return decision("cancel", "用户已不在配置范围内", "scope");
  const tests = [
    ["AI托管", user.hosted === true, "用户未开启AI托管", "hosting"],
    ["人工接管", user.humanTakenOver === false, "人工已接管，停止自动跟进", "takeover"],
    ["联系意愿", user.refused === false, "用户拒绝联系，停止发送", "refused"],
    ["风险信号", user.risk === false, "发现风险信号，停止普通跟进并交由人工处理", "risk"],
    ["话题状态", user.topicResolved === false, "跟进话题已失效或已解决", "resolved"],
    ["用户新回复", Number.isFinite(millis(user.lastUserAt)) && millis(user.lastUserAt) <= millis(task.basisUserAt), "用户已有新回复，旧计划取消，需根据新对话重新判断", "reply"],
    ["人工主动沟通", !user.lastHumanAt || millis(user.lastHumanAt) <= millis(task.createdAt), "人工已主动沟通，避免重复打扰", "human"],
    ["单次跟进", !user.lastFollowupSentAt || millis(user.lastFollowupSentAt) < millis(user.lastUserAt), "上次AI跟进后家长未回复，不重复跟进", "single"]
  ];
  for (const [label, passed, reason, code] of tests) if (!gate(label, passed, passed ? "当前快照未发现阻碍，发送前仍将复核" : reason)) return decision("cancel", reason, code);
  const duplicate = state.tasks.some((item) => item.id !== task.id && sameUser(item, task) && openAutoStatuses.includes(item.status));
  if (!gate("任务去重", !duplicate, "同一企微用户最多保留一条未完成AI跟进")) return decision("cancel", "已有同用户的待处理AI任务", "duplicate");
  const conflicts = findAutoConflicts(state, task, now);
  if (!gate("统一冲突检查", !conflicts.length, conflicts.length ? "存在相近时间的人工/事件任务、近期发送或同目的任务" : "当前演示队列无冲突")) return decision("cancel", "与人工/事件任务或近期主动消息冲突，AI主动避让", "conflict");
  if (!gate("计划发送窗口", inWindow(task.plannedAt, state.config), `${state.config.sendStart}—${state.config.sendEnd}`)) return decision("cancel", "计划时间已不在允许发送时段内", "window");
  if ((task.requiresReview || state.config.sendMode === "review") && !task.confirmed) {
    checks.push({ label: "人工审核", status: "waiting", detail: "确认计划后才可执行，确认也不能绕过风险及冲突限制" });
    return decision("review", "等待人工确认发送计划", "review");
  }
  if (millis(now) < millis(task.plannedAt)) { checks.push({ label: "执行时间", status: "waiting", detail: "尚未到期；以上只是当前快照检查，不是最终发送授权" }); return decision("waiting", "未到计划时间，发送前将再次检查", "waiting"); }
  if (!gate("当前发送时段", inWindow(now, state.config), "到期后也不能在免打扰时段补发")) return decision("pause", "当前处于非发送时段", "quiet");
  return decision("ready", "发送前检查通过，可模拟发送", "ready");
}

function replaceTask(state, task, now) { return { ...state, now, tasks: state.tasks.map((item) => item.id === task.id ? task : item) }; }
function findTask(state, id) { const task = state.tasks.find((item) => item.id === id); if (!task) throw new Error("任务不存在"); return task; }
function checkedTask(state, task, now) {
  const result = checkAutoTask(state, task, now);
  const status = result.outcome === "cancel" ? "cancelled" : result.outcome === "pause" ? "paused" : result.outcome === "review" ? "review" : task.confirmed || (!task.requiresReview && state.config.sendMode === "auto") ? "pending" : "review";
  return { ...task, status, reason: result.reason, reasonCode: result.reasonCode, checks: result.checks, lastCheckedAt: now, ...(status === "cancelled" ? { finishedAt: now } : {}) };
}

export function createAutoTask(state, userId, now = state.now) {
  const reject = (reason) => ({ state, created: false, reason });
  const user = state.users.find((item) => item.id === userId);
  if (!user) return reject("用户不存在");
  if (validateAutoConfig(state.config, state.skillKeys)) return reject("请先保存有效配置与分析Skill");
  if (!state.config.enabled) return reject("自动任务配置已关闭");
  if (!Number.isFinite(millis(user.lastUserAt)) || millis(now) - millis(user.lastUserAt) < state.config.silenceMinutes * 60000) return reject("用户沉默时长不足，暂不生成任务");
  if (state.tasks.some((task) => task.userId === user.id && task.accountKey === user.accountKey && openAutoStatuses.includes(task.status))) return reject("已有待处理任务，不重复创建");
  const suggestion = user.opportunity;
  if (!suggestion?.purpose || !suggestion.content?.trim() || !suggestion.evidence?.length) return reject("没有需要继续跟进的话题，不必生成任务");
  if (!Number.isFinite(millis(suggestion.plannedAt)) || millis(suggestion.plannedAt) <= millis(now) || millis(suggestion.expiresAt) <= millis(suggestion.plannedAt)) return reject("没有合适的未来发送时间，放弃本次跟进");
  const task = { id: `auto-${globalThis.crypto.randomUUID()}`, userId, user: user.name, accountKey: user.accountKey, accountName: user.accountName, stage: user.stage, conversationKey: user.conversationKey, ...structuredClone(suggestion), content: suggestion.content.trim(), createdAt: now, basisUserAt: user.lastUserAt, requiresReview: state.config.sendMode === "review", confirmed: false, status: state.config.sendMode === "review" ? "review" : "pending", configSnapshot: structuredClone(state.config) };
  const result = checkAutoTask(state, task, now);
  if (["cancel", "pause", "terminal"].includes(result.outcome)) return reject(result.reason);
  return { state: { ...state, now, tasks: [...state.tasks, checkedTask(state, task, now)] }, created: true, reason: "已根据演示聊天生成单次跟进计划" };
}

export function executeAutoTask(state, id, now = state.now, fail = false) {
  const task = findTask(state, id);
  if (!openAutoStatuses.includes(task.status)) return state;
  const result = checkAutoTask(state, task, now);
  if (result.outcome !== "ready") return replaceTask(state, checkedTask(state, task, now), now);
  const next = { ...task, status: fail ? "failed" : "sent", reason: fail ? "演示发送失败，未向用户发出消息" : "演示发送成功；家长未回复前不再追加任务", reasonCode: fail ? "send_failed" : "sent", finishedAt: now, checks: result.checks, lastCheckedAt: now, ...(fail ? {} : { actualSentAt: now, actualContent: task.content }) };
  const updated = replaceTask(state, next, now);
  return fail ? updated : { ...updated, users: updated.users.map((user) => user.id === task.userId && user.accountKey === task.accountKey ? { ...user, lastFollowupSentAt: now } : user), outbounds: [...updated.outbounds, { id: task.id, userId: task.userId, accountKey: task.accountKey, source: "ai", sentAt: now, content: task.content }] };
}

export function saveAutoConfig(state, config, now = state.now) {
  const error = validateAutoConfig(config, state.skillKeys);
  if (error) throw new Error(error);
  let next = { ...state, now, config: structuredClone(config) };
  for (const task of next.tasks.filter((item) => openAutoStatuses.includes(item.status))) next = replaceTask(next, checkedTask(next, task, now), now);
  return next;
}

export function editAutoTask(state, id, patch, now = state.now) {
  const task = findTask(state, id);
  if (!openAutoStatuses.includes(task.status)) throw new Error("已结束的任务不能编辑");
  if (!patch.content?.trim() || patch.content.trim().length > 1000) throw new Error("消息内容需为1～1000个字符");
  if (!Number.isFinite(millis(patch.plannedAt)) || millis(patch.plannedAt) <= millis(now) || millis(patch.plannedAt) >= millis(task.expiresAt) || !inWindow(patch.plannedAt, state.config)) throw new Error("计划时间须晚于演示当前时间、早于失效时间，并在允许发送时段内");
  const next = { ...task, content: patch.content.trim(), plannedAt: patch.plannedAt, requiresReview: task.requiresReview || Boolean(task.approvedAt) || state.config.sendMode === "review", confirmed: false, approvedAt: null, editedAt: now };
  const updated = replaceTask(state, next, now);
  return replaceTask(updated, checkedTask(updated, next, now), now);
}

export function confirmAutoTask(state, id, now = state.now) {
  const task = findTask(state, id);
  if (!openAutoStatuses.includes(task.status)) throw new Error("已结束的任务不能确认");
  const next = { ...task, confirmed: true, approvedAt: now };
  const updated = replaceTask(state, next, now);
  return replaceTask(updated, checkedTask(updated, next, now), now);
}

export function cancelAutoTask(state, id, now = state.now) {
  const task = findTask(state, id);
  if (!openAutoStatuses.includes(task.status)) return state;
  return replaceTask(state, { ...task, status: "cancelled", reason: "人工取消该跟进计划", reasonCode: "manual_cancel", finishedAt: now }, now);
}

export function updateDemoUser(state, userId, patch) {
  return { ...state, users: state.users.map((user) => user.id === userId ? { ...user, ...patch } : user) };
}

export function simulateAutoReply(state, userId) {
  const user = state.users.find((item) => item.id === userId);
  if (!user) throw new Error("用户不存在");
  const eventAt = Math.max(millis(state.now), (millis(user.lastUserAt) || 0) + 60000, (millis(user.lastFollowupSentAt) || 0) + 60000);
  const now = new Date(eventAt).toISOString();
  const next = updateDemoUser(state, userId, { lastUserAt: now, opportunity: { ...user.opportunity, plannedAt: new Date(eventAt + 7200000).toISOString(), expiresAt: new Date(eventAt + 14400000).toISOString(), evidence: [{ at: now, text: "刚才的方法我想再了解一下，具体可以怎么开始？" }] } });
  return saveAutoConfig({ ...next, now }, next.config, now);
}
