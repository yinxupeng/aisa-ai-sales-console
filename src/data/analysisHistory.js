export function listAnalysisHistory(sessions, archived = false) {
  return sessions.filter((item) => Boolean(item.archived) === archived).slice().sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    if (a.pinned && b.pinned && (a.pinnedAt || 0) !== (b.pinnedAt || 0)) return (b.pinnedAt || 0) - (a.pinnedAt || 0);
    return (b.updatedAt || "").localeCompare(a.updatedAt || "");
  });
}
export function changeAnalysisHistory(sessions, id, action, value) {
  if (action === "delete") return sessions.filter((item) => item.id !== id);
  if (!["pin", "rename", "archive", "restore"].includes(action)) throw new Error("不支持的记录操作");
  const title = typeof value === "string" ? value.trim() : "";
  if (action === "rename" && (!title || title.length > 60)) throw new Error("名称需为1—60个字符");
  return sessions.map((item) => {
    if (item.id !== id) return item;
    if (action === "pin") return item.archived ? item : { ...item, pinned: !item.pinned, pinnedAt: item.pinned ? null : Date.now() };
    if (action === "rename") return { ...item, title };
    if (action === "archive") return { ...item, archived: true, pinned: false, pinnedAt: null };
    return { ...item, archived: false };
  });
}
