// 方案二：独立对比原型，不连接正式分档和标签。
export const intentChatStorageKey = "sales-ai-intent-chat-comparison-v1";
export const intentChatDataSourceOptions = [{ value: "platform", label: "平台数据" }, { value: "business", label: "业务数据" }];
export const chatStageOptions = ["开课前", "第一节课", "第二节课", "第三节课", "第四节课", "第5节课", "课后"];
export const chatThresholdOptions = ["不限", ...Array.from({ length: 20 }, (_, index) => `大于${index + 1}条`)];
export const chatDataCapabilities = [
  { name: "用户档案与历史聊天", source: "平台数据", fields: "用户阶段、托管状态、客户消息、询价与服务诉求" },
  { name: "学习参与记录", source: "甲方业务数据", fields: "到课记录、连续到课天数、累计观看分钟数" }
];
export const intentPromptMaxLength = 50000;
export function migrateIntentChatDraft(draft) {
  if (!draft) return draft;
  const { requirements, tiers, ...rest } = draft;
  if (rest.dataSources === undefined) rest.dataSources = intentChatDataSourceOptions.map((item) => item.value);
  if (rest.wecomRole === undefined) rest.wecomRole = "all";
  if (typeof rest.prompt === "string") return rest;
  const standards = Array.isArray(tiers) ? tiers.map((tier) => `### ${tier.level}档：${tier.name}\n判定标准：${tier.criteria}\n对应标签：意向分档 / ${tier.level}档 · ${tier.name}`).join("\n\n") : "";
  return { ...rest, prompt: `# 用户意向分档分析提示词\n\n## 一、任务目标\n你是当前企业的用户意向分析助手。根据授权取得的用户事实与业务数据，按照下述规则判断意向档位，并给出可追溯的依据。\n${requirements || ""}\n\n## 二、数据来源\n${chatDataCapabilities.map((source) => `- ${source.source}：${source.name}，包含${source.fields}。`).join("\n")}\n只使用已授权且实际取得的数据，不推测缺失字段；以系统传入的分析用户范围为准。\n\n## 三、分档标准\n${standards}\n\n## 四、判档与异常处理\n按档位从高到低判断，命中多个档时取最高档。高档关键信息不足时标记“待判断”，不得直接降为低意向。数据充分但均不满足时标记“未匹配”。执行异常标记“生成失败”，不作为低意向处理。\n只更新本方案的意向分档标签，同一用户只保留一个当前档位，其他业务标签不变，历史结果留档。\n\n## 五、业务与安全边界\n依据客户本人的表达识别询价和服务需求，不能将销售或AI主动介绍的内容当作客户意向。孩子情绪风险不代表购买意向；风险表达独立提示人工。不作诊断，不承诺疗效，不利用焦虑推动成交。\n\n## 六、输出要求\n逐用户输出：用户标识、分析状态、档位编号、档位名称、分档标签、判断依据、使用的数据来源及数据时间、缺失信息、建议跟进动作和生成时间。\n判断依据引用事实或客户原话，不编造数据；“待判断”“未匹配”“生成失败”需说明原因，不输出虚假的档位。` };
}
export function createIntentChatState() {
  return {
    draft: migrateIntentChatDraft({
      dailyTimes: ["09:00"], stages: [...chatStageOptions], hostingStatus: "不限", historicalChatThreshold: "不限", todayChatThreshold: "不限",
      requirements: "结合家长的沟通意愿、课程参与、主动询价和后续服务需求，形成5档意向分层；不得把孩子风险程度当作购买意向。",
      tiers: [
        { level: 5, name: "高意向", criteria: "客户主动咨询服务费用，并明确表达进一步了解方案或预约沟通的意愿。" },
        { level: 4, name: "重点培育", criteria: "持续参与课程、反馈具体感受，并主动询问后续支持；尚未明确预约。" },
        { level: 3, name: "持续关注", criteria: "存在持续互动和学习行为，愿意补充孩子情况，暂未形成明确服务需求。" },
        { level: 2, name: "初步了解", criteria: "已经回复或参与学习，但沟通较少，仍在了解课程和支持方式。" },
        { level: 1, name: "待培育", criteria: "数据足够判断，但尚未出现明确的学习参与或服务兴趣信号。" }
      ]
    }),
    messages: [{ role: "assistant", content: "你好，我是意向分层配置助手。可以告诉我你的业务目标、希望分几档，以及哪些行为代表高意向。当前为交互演示：不会调用真实 AI、读取甲方数据或更新正式标签。左侧已提供可编辑的儿童心理课程示例方案。" }],
    trial: null, active: null, taskEnabled: false
  };
}
export function validateIntentChatDraft(draft) {
  if (!draft || !Array.isArray(draft.dailyTimes) || draft.dailyTimes.length < 1 || draft.dailyTimes.length > 2 || draft.dailyTimes.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) || new Set(draft.dailyTimes).size !== draft.dailyTimes.length) return "请选择完整且不重复的执行时间";
  if (!Array.isArray(draft.stages) || !draft.stages.length || draft.stages.some((stage) => !chatStageOptions.includes(stage))) return "请至少选择一个有效用户阶段";
  if (!["不限", "已托管", "未托管"].includes(draft.hostingStatus) || !chatThresholdOptions.includes(draft.historicalChatThreshold) || !chatThresholdOptions.includes(draft.todayChatThreshold)) return "请选择有效的用户范围";
  if (!Array.isArray(draft.dataSources) || !draft.dataSources.length || draft.dataSources.some((source) => !intentChatDataSourceOptions.some((item) => item.value === source))) return "请至少选择一种有效的数据来源";
  if (typeof draft.prompt !== "string" || !draft.prompt.trim()) return "请填写完整分档提示词";
  if (draft.prompt.length > intentPromptMaxLength) return `分档提示词不能超过${intentPromptMaxLength}字`;
  return "";
}
export function changeIntentChatDraft(state, draft) {
  return { ...state, draft, trial: null };
}
export function appendIntentChatRequirements(previous, content) {
  const next = `${previous}\n${content}`;
  if (next.length > intentPromptMaxLength) throw new Error(`分档提示词不能超过${intentPromptMaxLength}字，请先精简内容后再发送；已有内容未更改`);
  return next;
}
export function tryIntentChatDemo(state) {
  const error = validateIntentChatDraft(state.draft);
  if (error) throw new Error(error);
  // 固定演示结果用于展示流程，不宣称解析自然语言或按草稿真实分档。
  const rows = ["5档 · 高意向", "4档 · 重点培育", "3档 · 持续关注", "2档 · 初步了解", "1档 · 待培育"].map((tag, index) => ({ id: `demo-${index}`, name: ["陈女士", "李先生", "王女士", "赵女士", "周先生"][index], tag, reason: "固定演示样例，不代表按当前提示词实际计算的结果", source: index % 2 ? "平台聊天 + 甲方学习记录（示例）" : "平台档案与聊天（示例）" }));
  rows.push({ id: "missing", name: "孙女士", tag: "待判断", reason: "演示：业务数据缺失，不降为低意向", source: "甲方学习记录缺失（示例）" });
  return { ...state, trial: { fingerprint: JSON.stringify(state.draft), rows } };
}
export function enableIntentChatDemo(state) {
  if (!state.trial || state.trial.fingerprint !== JSON.stringify(state.draft)) throw new Error("请先对当前草稿完成模拟试跑");
  const error = validateIntentChatDraft(state.draft);
  if (error) throw new Error(error);
  return { ...state, taskEnabled: true, active: { version: (state.active?.version || 0) + 1, config: JSON.parse(JSON.stringify(state.draft)) } };
}
export function setIntentChatTaskEnabled(state, enabled) {
  if (enabled && !state.active) throw new Error("请先完成模拟试跑并确认模拟启用");
  return { ...state, taskEnabled: enabled };
}
