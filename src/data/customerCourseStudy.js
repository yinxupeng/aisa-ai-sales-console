export const trialClassNames = {
  "19a": [
    "孩子的“叛逆”，可能是身体在求救-胡老师（第一讲）",
    "《情绪大脑维稳·用心理技术激活大脑学习功能》——胡老师（同行第2讲）",
    "《认知重塑矫正·破解思维误区治厌学躺平，激活自主动力》——胡老师（同行第3讲）"
  ],
  "19b": [
    "D1-测评解读，了解动力不足的底层原因-【1026期】",
    "D2-走进青春期内心世界-【1026期】",
    "D3-接陪推、共性解决方案-【1026期】",
    "D4-孩子手机成瘾背后的秘密（最后一天加播）-【1026期】"
  ]
};

export function flattenStudyLeaves(nodes) {
  return nodes.flatMap((node) => node.children?.length ? flattenStudyLeaves(node.children) : [node]);
}
export function findStudyPath(nodes, key, parents = []) {
  for (const node of nodes) {
    const path = [...parents, node];
    if (node.key === key) return path;
    const found = node.children && findStudyPath(node.children, key, path);
    if (found?.length) return found;
  }
  return [];
}
export function getCurrentStudyPath(nodes, currentKey) {
  const explicit = findStudyPath(nodes, currentKey);
  const leaf = explicit.at(-1);
  if (leaf && !leaf.children?.length && (leaf.watchedSeconds > 0 || leaf.attended)) return explicit;
  const latest = flattenStudyLeaves(nodes).filter((item) => item.watchedSeconds > 0 || item.attended)
    .sort((a, b) => (b.lastStudiedAt || "").localeCompare(a.lastStudiedAt || ""))[0];
  return latest ? findStudyPath(nodes, latest.key) : [];
}
export function getInitialStudyExpandedKeys(nodes, currentKey) {
  const path = getCurrentStudyPath(nodes, currentKey);
  const week = path.find((node) => node.kind === "week");
  const nestedGroups = (items) => items.flatMap((node) => node.children?.length ? [node.key, ...nestedGroups(node.children)] : []);
  return [...new Set([...path.slice(0, -1).map((node) => node.key), ...nestedGroups(week?.children || [])])];
}
export function formatStudyUnlockAt(value) {
  if (!value || value === "-") return "-";
  const source = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(source) || /^\d{2}-\d{2}$/.test(source)) return source;
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(source)) {
    if (/Z$|[+-]\d{2}:?\d{2}$/.test(source)) {
      const parsed = new Date(source);
      if (Number.isNaN(parsed.getTime())) return "-";
      return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(parsed);
    }
    return source.slice(0, 16).replace("T", " ");
  }
  return "-";
}
export function formatStudyDuration(row) {
  if (!row.attended || row.status === "未开始" || !Number.isFinite(row.watchedSeconds)) return "-";
  const seconds = Math.max(0, Math.floor(row.watchedSeconds));
  return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map((part) => String(part).padStart(2, "0")).join(":");
}

const leaf = (key, title, unlockAt, format, progress = {}) => ({ key, title, kind: "sublesson", unlockAt, format, status: "未开始", attended: false, watchedSeconds: null, ...progress });
function group(key, title, kind, unlockAt, children) {
  const leaves = flattenStudyLeaves(children);
  const visited = leaves.filter((item) => item.attended);
  const status = leaves.every((item) => item.status === "已结束") ? "已结束" : leaves.some((item) => item.status === "进行中" || item.attended) ? "进行中" : "未开始";
  return { key, title, kind, unlockAt, format: "-", status, attended: visited.length > 0, watchedSeconds: visited.length ? visited.reduce((sum, item) => sum + (item.watchedSeconds || 0), 0) : null, children };
}
const weeks = ["2026-10-26", "2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30", "2026-12-07", "2026-12-14"];
const themes = ["稳定情绪 静观觉察", "理解孩子 循证陪伴", "学习动力 自主行动", "家庭沟通 共同成长", "临在沟通 疗愈情绪", "亲子协作 设立边界", "激活动力 建立信任", "复盘成长 持续陪伴"];
function buildTeacherTree(format) {
  const prefix = format === "录播" ? "recorded" : "live";
  const weekNodes = weeks.map((date, index) => {
    const key = `${prefix}-week-${index + 1}`;
    const titles = format === "录播"
      ? index === 0 ? ["【内心破碎】失望过后的N次，怎样重新理解孩子", "【眼神空洞】暗淡无光的眼睛，怎样看见孩子的需要"] : [`${themes[index]}：家长心理教育与练习`, `${themes[index]}：家庭共学实践`]
      : index === 0 ? ["破冰/医疗责任会", "领航营7班 第一周", "直播课：亲子沟通与情绪承接"] : [`领航营7班 第${index + 1}周共学直播`, `第${index + 1}周家庭实践答疑`];
    const lessons = titles.map((title, position) => {
      const progress = index !== 0 ? {} : format === "录播"
        ? position === 0 ? { status: "已结束", attended: true, watchedSeconds: 3720, lastStudiedAt: "2026-11-03 19:10" } : { status: "进行中", attended: true, watchedSeconds: 1102, lastStudiedAt: "2026-11-05 20:18" }
        : position === 0 ? { status: "已结束", attended: true, watchedSeconds: 4320, lastStudiedAt: "2026-10-28 20:10" } : position === 1 ? { status: "已结束" } : { status: "进行中", attended: true, watchedSeconds: 1600, lastStudiedAt: "2026-11-05 20:30" };
      return { ...leaf(`${key}-section-${position + 1}`, `第${position + 1}节 · ${title}`, position === 0 ? date : index === 0 ? "2026-10-28" : null, format, progress), kind: "section" };
    });
    return group(key, `第${index + 1}周 · ${themes[index]}`, "week", date, lessons);
  });
  return [
    group(`${prefix}-intro`, "【先导课】青春期孩子常见问题导读", "block", "2026-10-12", [group(`${prefix}-intro-week`, "先导周", "week", "2026-10-12", [{ ...leaf(`${prefix}-intro-section`, "先导课导读", "2026-10-12", format, { status: "已结束" }), kind: "section" }])]),
    group(`${prefix}-block-1`, "【第一板块】家庭协作 陪伴重建", "block", "2026-10-26", weekNodes.slice(0, 4)),
    group(`${prefix}-block-2`, "【第二板块】临在沟通 疗愈情绪", "block", "2026-11-23", weekNodes.slice(4, 6)),
    group(`${prefix}-block-3`, "【第三板块】激活动力 构建信任", "block", "2026-12-07", weekNodes.slice(6))
  ];
}

export function buildCustomerCourseStudy(customer, order, role) {
  if (order?.classStudy) {
    const study = order.classStudy;
    return role === "班主任" ? study : { ...study, collapsible: false, rows: study.rows || flattenStudyLeaves(Object.values(study.trees || {}).flat()) };
  }
  if (role === "班主任") return {
    key: `family-1026-${order.key}`, label: "青少年同行者计划领航营 · 1026期", collapsible: true, defaultFormat: "录播",
    trees: { "录播": buildTeacherTree("录播"), "直播": buildTeacherTree("直播") },
    currentKeys: { "录播": "recorded-week-1-section-2", "直播": "live-week-1-section-3" }
  };
  if (order?.type === "正价课" && order.status === "待支付") return { key: order.key, label: "待确认班级课表", collapsible: false, rows: [] };
  // Explicit class assignments for the prototype; do not infer a class from task dates.
  const assignments = { c1: "19a", c2: "19b", c4: "19b", c5: "19a", c7: "19a", c8: "19b", c9: "19a", c10: "19b", c11: "19a", c12: "19b", c13: "19a" };
  const classCode = order?.classCode || customer.courseClassCode || assignments[customer.key];
  if (!trialClassNames[classCode]) return { key: order.key, label: "暂无班级课表", collapsible: false, rows: [] };
  const dates = classCode === "19a" ? ["2026-10-24 18:56", "2026-10-26 18:58", "2026-10-26 18:56"] : ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29"];
  return { key: `${classCode}-${order.key}`, label: `${classCode} · ${trialClassNames[classCode].length}节体验课`, collapsible: false,
    rows: trialClassNames[classCode].map((title, index) => leaf(`${classCode}-${index + 1}`, title, dates[index], "直播", classCode === "19a"
      ? index === 0 ? { status: "已结束", attended: true, watchedSeconds: 9003 } : index === 1 ? { status: "已结束" } : { status: "进行中", attended: true, watchedSeconds: 2538 }
      : index === 0 ? { status: "已结束", attended: true, watchedSeconds: 2040 } : index === 1 ? { status: "已结束", attended: true, watchedSeconds: 2520 } : index === 2 ? { status: "进行中" } : {})) };
}
