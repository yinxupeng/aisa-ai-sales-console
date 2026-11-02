// 原型演示批次：已执行批次的口径独立保存，不跟随当前待生效配置变化。
export const intentGenerationRecords = Array.from({ length: 10 }, (_, index) => {
  const day = String(10 - index).padStart(2, "0");
  const expectedUsers = 42 - index;
  const incompleteUsers = index === 3 ? 2 : 0;
  return {
    id: `intent-run-202610${day}-0900`,
    executedAt: `2026-10-${day} 09:00`,
    scheduleLabel: "每天 09:00",
    scope: "当前处于第三节课、第四节课、第5节课的用户",
    expectedUsers,
    successfulUsers: expectedUsers - incompleteUsers,
    incompleteUsers,
    status: incompleteUsers ? "部分完成" : "已完成",
    duration: `${68 + index * 3}秒`,
    summary: incompleteUsers
      ? "已完成大部分家长的意向分析；2名用户缺少关键到课或聊天信号，暂不强行归入低意向，待补充数据后再分析。"
      : "结合儿童心理健康课程的到课、观看时长、询价与课后反馈完成用户分档，并生成针对性的人工跟进建议。",
    details: [
      { label: "历史聊天数", value: "不限" },
      { label: "当天聊天数", value: "不限" },
      { label: "托管状态", value: "不限" },
      { label: "规则版本", value: "v1" },
      { label: "意向度分析 Skill", value: "用户意向度分析" },
      { label: "跟进策略与行动 Skill", value: "用户画像总结" }
    ]
  };
});

export const dailyReportGenerationRecords = Array.from({ length: 10 }, (_, index) => {
  const day = String(10 - index).padStart(2, "0");
  const previousDay = index === 9 ? "2026-09-30" : `2026-10-${String(9 - index).padStart(2, "0")}`;
  const expectedUsers = 20 + index % 4;
  const incompleteUsers = index === 4 ? 1 : 0;
  return {
    id: `daily-run-202610${day}-1800`,
    executedAt: `2026-10-${day} 18:00`,
    scheduleLabel: "每天 18:00",
    scope: "当前企微账号下所有用户（统计周期内有用户回复）",
    expectedUsers,
    successfulUsers: expectedUsers - incompleteUsers,
    incompleteUsers,
    status: incompleteUsers ? "部分完成" : "已完成",
    duration: `${42 + index * 2}秒`,
    summary: incompleteUsers
      ? "已生成大部分当天有效沟通用户的对话总结，1名用户的总结生成失败。已完成结果保留，可从用户沟通日报查看。"
      : "已汇总家长在统计周期内的有效沟通，整理孩子情绪、亲子互动、课程反馈及后续支持诉求，帮助销售了解当天沟通重点。",
    details: [
      { label: "统计时间范围", value: `${previousDay} 18:00 至 2026-10-${day} 18:00` },
      { label: "用户总数", value: "291 人" },
      { label: "有效聊天口径", value: "统计周期内至少有1条用户回复；AI或销售单向发送不算" },
      { label: "分析数据来源", value: "用户档案、统计周期内聊天记录" },
      { label: "分析 Skill", value: "用户画像总结" }
    ]
  };
});
