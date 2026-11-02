import React, { useState } from "react";
import { Button, Dropdown, Empty, Typography } from "antd";
import { DeleteOutlined, EditOutlined, EllipsisOutlined, InboxOutlined, PushpinOutlined, UndoOutlined } from "@ant-design/icons";
import { listAnalysisHistory } from "../data/analysisHistory";

function HistoryRow({ item, active, onSelect, onAction }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    ...(!item.archived ? [{ key: "pin", label: item.pinned ? "取消置顶" : "置顶", icon: <PushpinOutlined /> }] : []),
    { key: "rename", label: "重命名", icon: <EditOutlined /> },
    { key: item.archived ? "restore" : "archive", label: item.archived ? "恢复到最近分析" : "归档", icon: item.archived ? <UndoOutlined /> : <InboxOutlined /> },
    { type: "divider" }, { key: "delete", label: "删除", icon: <DeleteOutlined />, danger: true }
  ];
  return <div className={`analysis-history-row${active ? " active" : ""}${menuOpen ? " menu-open" : ""}`}>
    <button className="analysis-history-select" onClick={() => onSelect(item.id)} aria-current={active ? "true" : undefined} title={item.title}>
      <span className="analysis-history-title">{item.pinned ? <PushpinOutlined className="analysis-history-pin" /> : null}<span>{item.title}</span></span>
      <small>{item.updatedAt}</small>
    </button>
    <Dropdown trigger={["click"]} placement="bottomRight" open={menuOpen} onOpenChange={setMenuOpen} menu={{ items, onClick: ({ key, domEvent }) => { domEvent.stopPropagation(); setMenuOpen(false); onAction(item, key); } }}>
      <Button className="analysis-history-more" type="text" size="small" icon={<EllipsisOutlined />} aria-label={`更多操作：${item.title}`} aria-haspopup="menu" aria-expanded={menuOpen} onClick={(event) => event.stopPropagation()} />
    </Dropdown>
  </div>;
}

export default function AnalysisHistoryList({ sessions, activeId, archived, onArchivedChange, onSelect, onAction }) {
  const visible = listAnalysisHistory(sessions, archived);
  const archivedCount = sessions.filter((item) => item.archived).length;
  return <>
    <div className="analysis-history-section-head"><Typography.Text type="secondary">{archived ? "已归档分析" : "最近分析"}</Typography.Text><Button type="text" size="small" onClick={() => onArchivedChange(!archived)}>{archived ? "返回" : `归档${archivedCount ? ` ${archivedCount}` : ""}`}</Button></div>
    {visible.length ? visible.map((item) => <HistoryRow key={item.id} item={item} active={activeId === item.id} onSelect={onSelect} onAction={onAction} />) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={archived ? "暂无归档记录" : "暂无历史分析"} />}
  </>;
}
