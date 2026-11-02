export const cohortConversionDefinition = { type: "conversion", presentation: "cohortConversion", days: 7, stage: "all", role: "all", group: "owner" };
export function buildCohortConversionReport(definition, visibleKeys, accounts, generatedAt) {
  const rows = [];
  for (let day = 0; day < 7; day++) for (let period = 1; period <= 2; period++) accounts.forEach((account, salesIndex) => {
    if (!visibleKeys.includes(account.key) || (definition.role !== "all" && definition.role !== account.role)) return;
    const participants = 28 + (day * 7 + period * 11 + salesIndex * 5) % 30;
    const enrolled = Math.floor(participants * (0.14 + ((day + period + salesIndex * 2) % 9) * .025));
    const date = `2026-10-${23 + day}`;
    rows.push({ key: `${date}-${period}-${account.key}`, date, cohort: `${date.slice(5)} 体验课第${period}期`, accountKey: account.key, owner: account.name, role: account.role, participants, enrolled, rate: participants ? Number((enrolled / participants * 100).toFixed(1)) : 0 });
  });
  const groups = accounts.filter((account) => visibleKeys.includes(account.key) && (definition.role === "all" || definition.role === account.role)).map((account) => {
    const own = rows.filter((row) => row.accountKey === account.key);
    const participants = own.reduce((sum, row) => sum + row.participants, 0), enrolled = own.reduce((sum, row) => sum + row.enrolled, 0);
    return { key: account.key, owner: account.name, participants, enrolled, rate: participants ? Number((enrolled / participants * 100).toFixed(1)) : 0 };
  });
  const participants = rows.reduce((sum, row) => sum + row.participants, 0), enrolled = rows.reduce((sum, row) => sum + row.enrolled, 0);
  return { definition, presentation: "cohortConversion", title: "最近一周体验课转化率 · 按销售与期次", range: `2026-10-23—2026-10-29 · ${definition.role === "all" ? "全部角色" : definition.role}`, period: "2026-10-23—2026-10-29", generatedAt,
    rows, groups, chart: groups.map((group) => ({ name: group.owner, value: group.rate })),
    metrics: [["体验课人次", participants], ["报名人数", enrolled], ["整体转化率", `${participants ? (enrolled / participants * 100).toFixed(1) : "0.0"}%`], ["体验课期次", new Set(rows.map((row) => row.cohort)).size]],
    conclusion: `已按${groups.length}位销售、${new Set(rows.map((row) => row.cohort)).size}个期次统计。整体转化率按报名人数÷体验课人次计算，不直接平均各期转化率。建议结合期次人数和报名量比较销售表现。` };
}
