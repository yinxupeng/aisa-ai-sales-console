export const orderQueryDefinition = { type: "conversion", presentation: "orderQuery", queryDate: "2026-10-29", dateMode: "fixed" };
const primaryProduct = "青少年同行者计划领航营";
const salesRoles = {
  "司法": "虚拟刘洋", "高曌": "销售A类（刘俊彤1.0）", "陈斌斌": "虚拟刘洋", "高鹏": "虚拟刘洋", "李旭帅": "销售 A 类",
  "车宏祥": "销售A类（刘俊彤1.0）", "刘俊彤": "销售A类（刘俊彤1.0）", "周婷婷": "销售A类（刘俊彤1.0）", "梁章宏": "虚拟刘洋", "蔡文龙": "虚拟刘洋", "王廉喆": "虚拟刘洋", "王俊超": "销售A类（刘俊彤1.0）"
};
const sampleOrders = [
  ["22:38:52", "高鹏", "英子", "153****0110"], ["21:59:41", "高鹏", "韩廷松", "135****8285"],
  ["21:50:51", "司法", "Ly", "138****6318"], ["21:32:33", "司法", "顾一鸣", "139****7069"],
  ["20:59:43", "高曌", "Mary", "155****8532"], ["20:59:43", "司法", "百纳轩特色店", "155****5082"],
  ["20:59:02", "蔡文龙", "无间冬夏", "150****1010"], ["20:57:33", "陈斌斌", "不管我多可爱", "191****0355"],
  ["20:52:23", "陈斌斌", "若水", "135****9723"], ["20:51:45", "王廉喆", "苏蕾", "191****6167"],
  ["20:44:31", "李旭帅", "绿野仙踪", "136****5177"], ["20:36:05", "高曌", "吕利平", "138****6897"],
  ["20:34:57", "高曌", "Ted (Wistar)", "136****1721"], ["20:32:32", "车宏祥", "燕", "138****1118"],
  ["20:31:57", "司法", "火火🔥", "181****3823"], ["20:31:41", "李旭帅", "苏su", "186****8291"],
  ["20:31:18", "周婷婷", "叶亚珍", "189****6289"], ["20:31:16", "刘俊彤", "流年似水", "135****7112"],
  ["17:27:11", "梁章宏", "Wendy Gong", "151****7539"],
  ["13:00:28", "高曌", "芳芳", "138****3745", "少年说30天线上训练营知识服务（升级专用）", 4920],
  ["12:01:48", "王俊超", "浅言", "136****6861", "【青春进化论】亲子成长2日营", 1980],
  ["07:43:55", "陈斌斌", "星凝", "135****6806"]
];
export function buildOrderQueryReport(definition, generatedAt) {
  const rows = sampleOrders.map(([paidAt, owner, customer, phone, product = primaryProduct, amount = 4980], index) => ({ key: `order-demo-${index + 1}`, number: index + 1, paidAt, owner, customer, phone, product, amount }));
  const groups = Object.entries(salesRoles).map(([owner, role]) => {
    const owned = rows.filter((row) => row.owner === owner);
    const products = [...new Set(owned.map((row) => row.product))].map((product) => `${product} × ${owned.filter((row) => row.product === product).length}`).join("、");
    return { key: owner, owner, role, orders: owned.length, amount: owned.reduce((sum, row) => sum + row.amount, 0), products };
  });
  const gmv = rows.reduce((sum, row) => sum + row.amount, 0);
  const peakOrders = rows.filter((row) => row.paidAt >= "20:30:00" && row.paidAt <= "21:00:00").length;
  return {
    definition, presentation: "orderQuery", title: "昨日销售订单查询（10月29日）", generatedAt, range: "2026-10-29 · 纯销售企微 · 排除班主任", period: "2026-10-29",
    rows, groups, chart: groups.map((group) => ({ name: group.owner, value: group.orders })),
    summary: { date: "2026-10-29", salesOrders: rows.length, paidStudents: new Set(rows.map((row) => row.phone)).size, gmv, peakOrders, peakTime: "20:30—21:00", excludedOrders: 12, excludedGmv: 68940, primaryProduct, primaryProductOrders: rows.filter((row) => row.product === primaryProduct).length,
      logs: "未发现订单同步报错或支付回执丢失异常，昨晚转化高峰期数据入库正常。" },
    metrics: [["销售转化订单", rows.length], ["独立付费学员", new Set(rows.map((row) => row.phone)).size], ["成交额（GMV）", `¥${gmv.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`], ["高峰期订单", peakOrders]]
  };
}
export function enrichOrderQueryWorkspace(workspace) {
  let changed = false;
  const enrich = (report) => {
    if (report?.presentation !== "orderQuery" || report.rows?.length === 22) return report;
    changed = true;
    return buildOrderQueryReport(report.definition, report.generatedAt);
  };
  const next = { ...workspace,
    reports: workspace.reports.map((item) => ({ ...item, result: enrich(item.result) })),
    records: workspace.records?.map((item) => ({ ...item, result: enrich(item.result) })),
    sessions: workspace.sessions.map((item) => ({ ...item, dataResult: enrich(item.dataResult), messages: item.messages.map((entry) => ({ ...entry, orderReport: enrich(entry.orderReport), ...(entry.artifact ? { artifact: { ...entry.artifact, result: enrich(entry.artifact.result) } } : {}) })) }))
  };
  return changed ? next : workspace;
}
