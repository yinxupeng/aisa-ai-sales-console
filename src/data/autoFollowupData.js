import { aiSkills, managedWecomAccounts } from "./appData";
import { formatAutoTime } from "../domain/autoFollowup.js";

export const autoFollowupSkillOptions = aiSkills.filter((skill) => skill.status === "启用" && ["aiskill-auto-followup", "aiskill-1", "aiskill-2"].includes(skill.key)).map((skill) => ({ value: skill.key, label: skill.name }));
export const defaultAutoFollowupConfig = { enabled: true, wecomRole: "all", hostingStatus: "不限", accountKeys: ["all"], stages: ["all"], silenceMinutes: 60, sendStart: "09:00", sendEnd: "20:00", protectionMinutes: 60, skillKey: "aiskill-auto-followup", sendMode: "auto" };

export function createAutoFollowupDemo(now = new Date().toISOString()) {
  const day = formatAutoTime(now).slice(0, 10);
  const at = (time) => `${day}T${time}:00+08:00`;
  const profiles = [
    ["陈女士", "wecom-li", "李老师企微", "第三节课", "c1", "孩子最近不愿意和我说话，我想知道怎么开口才不容易吵架。", "亲子沟通开场", "上午您提到孩子不太愿意交流。如果您方便，我可以先发一个不容易引起抵触的开场示例，您看看是否适合。"],
    ["李先生", "wecom-chen", "陈老师企微", "第四节课", "c2", "我怕问得多孩子会烦，不问又担心错过他的情绪变化。", "家长陪伴困惑", "关于您提到的陪伴和留出空间，我们可以先从一个低压力的小步骤聊起。您方便时我发给您看看。"],
    ["王女士", "wecom-zhou", "周老师企微", "第5节课", "c3", "昨晚尝试先听孩子说完了，但我不太确定自己回应得对不对。", "课程练习复盘", "上午聊到您尝试先听孩子说完，这一步很不容易。如果您愿意，可以说说当时最拿不准的一句话，我们一起复盘。"],
    ["赵女士", "wecom-li", "李老师企微", "第二节课", "c4", "手机使用的规则总是执行不下去，我不想一提就吵。", "低冲突家庭规则", "您提到希望减少谈手机时的冲突。如果方便，我可以发一个先协商、再尝试的小规则示例，不需要一下改变很多。"],
    ["周先生", "wecom-chen", "陈老师企微", "第一节课", "c5", "课程说先接住情绪，我理解方向，但还不知道怎么做。", "首次看课反馈", "上午您提到想把课上的方法用起来。我可以先分享一个具体场景的回应示例，您有空再看就好。"],
    ["孙女士", "wecom-zhou", "周老师企微", "课后", "c6", "我想记录孩子这一周的变化，但是不知道要记些什么。", "家庭观察记录", "关于您上午提到的观察记录，可以先从作息、愿意交流的时刻和家长的回应记起。方便的话我发一个简短示例供您参考。"]
  ];
  const users = profiles.map((item, index) => ({ id: `auto-user-${index + 1}`, name: item[0], accountKey: item[1], accountName: item[2], stage: item[3], conversationKey: item[4], hosted: true, humanTakenOver: false, refused: false, risk: false, topicResolved: false, lastUserAt: at("09:10"), lastHumanAt: null, lastFollowupSentAt: null, opportunity: { purpose: item[6], topicKey: `topic-${index + 1}`, content: item[7], plannedAt: at(index % 2 ? "15:30" : "15:00"), expiresAt: at("19:00"), evidence: [{ at: at("09:10"), text: item[5] }] } }));
  const config = structuredClone(defaultAutoFollowupConfig);
  const tasks = users.slice(0, 5).map((user, index) => ({ id: `auto-demo-${index + 1}`, userId: user.id, user: user.name, accountKey: user.accountKey, accountName: user.accountName, stage: user.stage, conversationKey: user.conversationKey, ...structuredClone(user.opportunity), createdAt: at("10:30"), basisUserAt: user.lastUserAt, requiresReview: index === 2 || index === 4, confirmed: false, status: index === 2 || index === 4 ? "review" : "pending", configSnapshot: structuredClone(config), reason: "尚未到期，发送前将再次检查", checks: [] }));
  const relatedTasks = [
    { id: "manual-demo-1", userId: users[1].id, accountKey: users[1].accountKey, source: "manual", status: "pending", plannedAt: at("15:10"), purpose: "课程学习提醒", topicKey: "lesson-reminder", content: "今天的课程重点已整理好，您方便时可以查看。" },
    { id: "event-demo-1", userId: users[3].id, accountKey: users[3].accountKey, source: "event", status: "pending", plannedAt: at("15:40"), purpose: "心理评测完成反馈", topicKey: "assessment-feedback", content: "您的自评已提交，稍后由顾问说明结果和服务边界。" },
    { id: "manual-demo-2", userId: users[0].id, accountKey: users[0].accountKey, source: "manual", status: "pending", plannedAt: at("17:30"), purpose: "当日课程提醒", topicKey: "lesson-reminder", content: "今天的学习资料已经准备好，有空再看即可。" }
  ];
  const yesterday = formatAutoTime(new Date(Date.parse(at("12:00")) - 86400000).toISOString()).slice(0, 10);
  const history = Array.from({ length: 9 }, (_, index) => {
    const task = structuredClone(tasks[index % tasks.length]);
    const sent = index % 3 === 0;
    const failed = index === 5;
    const finishedAt = index < 3 ? at("09:00") : `${yesterday}T16:${String(index).padStart(2, "0")}:00+08:00`;
    return { ...task, id: `auto-history-${index + 1}`, createdAt: `${yesterday}T14:00:00+08:00`, basisUserAt: `${yesterday}T12:00:00+08:00`, plannedAt: finishedAt, expiresAt: `${day}T19:00:00+08:00`, status: sent ? "sent" : failed ? "failed" : "cancelled", finishedAt, reasonCode: sent ? "sent" : failed ? "send_failed" : index % 2 ? "conflict" : "reply", reason: sent ? "演示发送成功，等待家长回复" : failed ? "模拟通道发送失败，未发送给家长" : index % 2 ? "与人工任务冲突，AI主动避让" : "用户已回复，原跟进计划失效", ...(sent ? { actualSentAt: finishedAt, actualContent: task.content } : {}), checks: [] };
  });
  return { config, accounts: managedWecomAccounts, now: at("11:00"), users, tasks: [...tasks, ...history], relatedTasks, outbounds: [], skillKeys: autoFollowupSkillOptions.map((option) => option.value) };
}
