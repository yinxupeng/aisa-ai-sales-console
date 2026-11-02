import { computeSalesReport, reportTime } from "./salesReports.js";

export function createReportArtifact({ definition, pendingSchedule, result, demoPage, name, generatedAt = reportTime() }) {
  if (demoPage === "intentAnalysis" || result?.presentation === "intentAnalysis") return JSON.parse(JSON.stringify({ kind: "intentAnalysis", title: `${name || "用户意向度分析"}.report`, generatedAt, definition, result, pendingSchedule }));
  if (!definition || !result) return null;
  return JSON.parse(JSON.stringify({ kind: "report", title: `${name || result.title}.report`, generatedAt, definition, pendingSchedule, result }));
}
export function migrateReportArtifacts(workspace, visibleKeys) {
  return { ...workspace, sessions: workspace.sessions.map((session) => {
    if (["cohortConversion", "orderQuery"].includes(session.definition?.presentation) && !session.pageGenerated) return session;
    // Old messages have no per-message snapshot. Only recover the latest known result.
    const index = session.messages.findLastIndex((item) => item.role === "assistant" && item.status !== "generating" && item.status !== "stopped" && /已按|已载入|已整理/.test(item.text));
    if (index < 0 || session.messages[index].artifact || (!session.definition && !session.demoPage)) return session;
    const result = session.definition ? computeSalesReport(session.definition, visibleKeys) : null;
    const artifact = createReportArtifact({ definition: session.definition, pendingSchedule: session.pendingSchedule, result, demoPage: session.demoPage, generatedAt: session.updatedAt });
    if (!artifact) return session;
    return { ...session, messages: session.messages.map((item, position) => position === index ? { ...item, artifact } : item) };
  }) };
}
