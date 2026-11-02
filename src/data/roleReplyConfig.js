// 角色回复配置；实际上下文截取与发送前质检由后端接入。
export function getRoleReplyConfig(role = {}) {
  return {
    analysisConversationRounds: role.analysisConversationRounds ?? 100,
    replyQualityEnabled: role.replyQualityEnabled ?? false,
    replyQualitySkillKey: role.replyQualitySkillKey,
    quietHoursEnabled: role.quietHoursEnabled ?? false,
    quietHoursStart: role.quietHoursStart ?? "00:00",
    quietHoursEnd: role.quietHoursEnd ?? "06:00"
  };
}

export function validateRoleReplyConfig(config, skills) {
  if (!Number.isInteger(config.analysisConversationRounds) || config.analysisConversationRounds < 1 || config.analysisConversationRounds > 1000) return "对话轮数请输入1～1000的整数";
  if (config.replyQualityEnabled && !skills.some((skill) => skill.key === config.replyQualitySkillKey && skill.status === "启用")) return "请选择已启用的回复内容质检 Skill";
  if (config.quietHoursEnabled) {
    if (![config.quietHoursStart, config.quietHoursEnd].every((time) => typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time))) return "请选择完整的免打扰开始和结束时间";
    if (config.quietHoursStart === config.quietHoursEnd) return "免打扰开始和结束时间不能相同";
  }
  return "";
}
