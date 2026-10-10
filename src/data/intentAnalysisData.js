export const intentAnalysisSchedule = {
  frequency: "每天一次",
  runAt: "09:00",
  lastRunAt: "2026-10-10 09:00",
  nextRunAt: "2026-10-11 09:00",
  scope: "当前处于第3、4、5节课的用户"
};

export const intentLevelDefinitions = [
  { level: 0, label: "观察中", color: "default", description: "没有到课记录，聊天较少或尚未出现病情相关表达" },
  { level: 1, label: "开始关注", color: "blue", description: "没有到课记录，但聊天较多且出现病情相关表达" },
  { level: 2, label: "开始行动", color: "cyan", description: "至少有1天有效看课记录" },
  { level: 3, label: "持续参与", color: "orange", description: "至少到课2天，第三节课后仍然持续沟通" },
  { level: 4, label: "重点培育", color: "purple", description: "连续到课3天、累计观看超过40分钟，并表达感受或询价" },
  { level: 5, label: "高意向", color: "red", description: "连续到课3天、累计观看超过80分钟，询价且课后持续表达感受" }
];

const illnessKeywords = ["厌学", "情绪", "焦虑", "亲子冲突", "抑郁", "失眠", "暴躁", "沉迷手机", "不想上学"];

export const calculateIntentLevel = (metrics) => {
  const hasIllnessKeyword = metrics.hasIllnessKeyword ?? illnessKeywords.some((keyword) => metrics.recentChat?.includes(keyword));
  const hasAttendance = metrics.attendanceDays > 0;
  if (metrics.consecutiveAttendanceDays >= 3 && metrics.totalWatchMinutes > 80 && metrics.askedPrice && metrics.expressedAfterAllLessons) return 5;
  if (metrics.consecutiveAttendanceDays >= 3 && metrics.totalWatchMinutes > 40 && (metrics.expressedAfterLessons123 || metrics.askedPrice)) return 4;
  if (metrics.attendanceDays >= 2 && metrics.chattedAfterLesson3) return 3;
  if (metrics.attendanceDays >= 1) return 2;
  if (!hasAttendance && metrics.chatCount > 20 && hasIllnessKeyword) return 1;
  return 0;
};

const profiles = [
  { name: "陈女士", relation: "孩子妈妈", conversationKey: "c1", lesson: 3, manager: "林晓", concern: "厌学、亲子冲突" },
  { name: "李先生", relation: "孩子爸爸", conversationKey: "c2", lesson: 4, manager: "周宁", concern: "孩子情绪波动" },
  { name: "王女士", relation: "孩子妈妈", conversationKey: "c3", lesson: 5, manager: "陈妍", concern: "焦虑与睡眠问题" },
  { name: "赵女士", relation: "孩子妈妈", conversationKey: "c4", lesson: 3, manager: "林晓", concern: "沉迷手机" },
  { name: "周先生", relation: "孩子爸爸", conversationKey: "c5", lesson: 4, manager: "周宁", concern: "学习动力不足" },
  { name: "孙女士", relation: "孩子妈妈", conversationKey: "c6", lesson: 5, manager: "陈妍", concern: "亲子沟通困难" }
];

const metricTemplates = [
  { chatCount: 8, attendanceDays: 0, consecutiveAttendanceDays: 0, totalWatchMinutes: 0, hasIllnessKeyword: false, askedPrice: false, expressedAfterLessons123: false, expressedAfterAllLessons: false, chattedAfterLesson3: false },
  { chatCount: 32, attendanceDays: 0, consecutiveAttendanceDays: 0, totalWatchMinutes: 0, hasIllnessKeyword: true, askedPrice: false, expressedAfterLessons123: false, expressedAfterAllLessons: false, chattedAfterLesson3: false },
  { chatCount: 28, attendanceDays: 1, consecutiveAttendanceDays: 1, totalWatchMinutes: 12, hasIllnessKeyword: true, askedPrice: false, expressedAfterLessons123: false, expressedAfterAllLessons: false, chattedAfterLesson3: false },
  { chatCount: 42, attendanceDays: 2, consecutiveAttendanceDays: 2, totalWatchMinutes: 28, hasIllnessKeyword: true, askedPrice: false, expressedAfterLessons123: false, expressedAfterAllLessons: false, chattedAfterLesson3: true },
  { chatCount: 56, attendanceDays: 3, consecutiveAttendanceDays: 3, totalWatchMinutes: 52, hasIllnessKeyword: true, askedPrice: false, expressedAfterLessons123: true, expressedAfterAllLessons: false, chattedAfterLesson3: true },
  { chatCount: 68, attendanceDays: 3, consecutiveAttendanceDays: 3, totalWatchMinutes: 96, hasIllnessKeyword: true, askedPrice: true, expressedAfterLessons123: true, expressedAfterAllLessons: true, chattedAfterLesson3: true }
];

const followUpByLevel = {
  0: "继续以低压力方式提醒家长了解课程，暂不主动推进咨询转化。",
  1: "围绕孩子当前困扰进行共情和信息收集，邀请家长完成第一节课程。",
  2: "关注家长的首次看课反馈，及时发送课程复盘并推动下一节学习。",
  3: "在第三节课后主动询问孩子变化和家庭感受，建立专业信任。",
  4: "建议由课程顾问承接，结合家长已表达的问题介绍适合的后续服务方案。",
  5: "建议优先人工跟进，基于已询价和连续学习行为推进正式咨询预约。"
};

const buildUser = (index) => {
  const profile = profiles[index % profiles.length];
  const targetLevelSequence = [
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    3, 3, 3, 3, 3, 3,
    2, 2, 2, 2, 2, 2,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 0
  ];
  const metrics = { ...metricTemplates[targetLevelSequence[index % targetLevelSequence.length]] };
  const level = calculateIntentLevel(metrics);
  const lastChatAt = `2026-10-${String(10 - (index % 5)).padStart(2, "0")} ${String(9 + (index % 10)).padStart(2, "0")}:${String((index * 11) % 60).padStart(2, "0")}`;
  return {
    id: `intent-user-${index + 1}`,
    ...profile,
    courseName: "观心实验室·儿童心理健康医疗课程",
    currentLesson: profile.lesson,
    metrics,
    level,
    levelInfo: intentLevelDefinitions[level],
    recentChatAt: lastChatAt,
    analysisAt: "2026-10-10 09:00",
    followUp: followUpByLevel[level]
  };
};

export const intentAnalysisUsers = Array.from({ length: 42 }, (_, index) => buildUser(index));
export { illnessKeywords };
