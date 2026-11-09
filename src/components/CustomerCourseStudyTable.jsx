import React, { useEffect, useMemo, useRef, useState } from "react";
import { Segmented, Table, Tag, Tooltip, Typography } from "antd";
import { buildCustomerCourseStudy, flattenStudyLeaves, formatStudyDuration, formatStudyUnlockAt, getCurrentStudyPath, getInitialStudyExpandedKeys } from "../data/customerCourseStudy";

export default function CustomerCourseStudyTable({ customer, order, role, active = true }) {
  const profile = useMemo(() => buildCustomerCourseStudy(customer, order, role), [customer.key, customer.courseClassCode, order.key, order.classCode, order.classStudy, order.type, order.status, role]);
  const [format, setFormat] = useState(profile.defaultFormat || "录播");
  const tree = profile.collapsible ? profile.trees[format] || [] : profile.rows;
  const currentPath = useMemo(() => profile.collapsible ? getCurrentStudyPath(tree, profile.currentKeys?.[format]) : [], [tree, profile, format]);
  const currentLeaf = currentPath.at(-1), currentWeek = currentPath.find((item) => item.kind === "week");
  const [expandedKeys, setExpandedKeys] = useState(() => getInitialStudyExpandedKeys(tree, profile.currentKeys?.[format]));
  const containerRef = useRef(null);
  useEffect(() => {
    setExpandedKeys(getInitialStudyExpandedKeys(tree, profile.currentKeys?.[format]));
    if (!active || !currentLeaf) return;
    let second;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      const row = containerRef.current?.querySelector('[data-current-study="true"]');
      const body = containerRef.current?.querySelector(".ant-table-body");
      if (row && body) body.scrollTop += row.getBoundingClientRect().top - body.getBoundingClientRect().top - body.clientHeight / 2 + row.clientHeight / 2;
    }); });
    return () => { cancelAnimationFrame(first); if (second) cancelAnimationFrame(second); };
  }, [active, format, currentLeaf?.key]);
  const columns = [
    { title: "上课时间", dataIndex: "unlockAt", width: 116, render: formatStudyUnlockAt },
    { title: "课程名称", dataIndex: "title", render: (title, row) => <div className="customer-study-course-name"><Tooltip title={title}><span className="customer-study-course-title">{title}</span></Tooltip>{row.key === currentWeek?.key ? <Tag color="processing">当前听课周</Tag> : row.key === currentLeaf?.key ? <Tag color="blue">正在学习</Tag> : null}</div> },
    { title: "上课形式", dataIndex: "format", width: 64, align: "center", render: (value) => value === "直播" || value === "录播" ? <Tag color={value === "直播" ? "purple" : "cyan"}>{value}</Tag> : "-" },
    { title: "课程状态", dataIndex: "status", width: 70, align: "center", render: (value) => <Tag color={value === "进行中" ? "processing" : value === "未开始" ? "default" : "success"}>{value}</Tag> },
    { title: "是否到课", dataIndex: "attended", width: 70, align: "center", render: (value) => <Tag color={value ? "success" : "error"}>{value ? "已到课" : "未到课"}</Tag> },
    { title: "上课总时长", width: 82, align: "center", render: (_, row) => formatStudyDuration(row) }
  ];
  return <section className="customer-profile-section customer-study-section" ref={containerRef}>
    <div className="customer-section-head customer-study-section-head"><Typography.Text>用户上课信息</Typography.Text>{profile.collapsible ? <Segmented size="small" value={format} options={[{ value: "录播", label: "录播课" }, { value: "直播", label: "直播课" }]} onChange={setFormat} /> : <Typography.Text type="secondary" className="customer-study-header-summary">{profile.label}</Typography.Text>}</div>
    {profile.collapsible ? <div className="customer-study-class-label"><Typography.Text type="secondary">{profile.label} · 共{flattenStudyLeaves(tree).length}节课</Typography.Text></div> : null}
    <Table className={`trial-lessons-table customer-study-table${profile.collapsible ? " is-tree" : ""}`} rowKey="key" columns={columns} dataSource={tree} pagination={false} size="small" bordered tableLayout="fixed" scroll={profile.collapsible ? { y: 400 } : undefined}
      expandable={profile.collapsible ? { expandedRowKeys: expandedKeys, onExpandedRowsChange: setExpandedKeys, indentSize: 8, expandIconColumnIndex: 1, expandRowByClick: true } : undefined}
      rowClassName={(row) => row.key === currentLeaf?.key ? "customer-study-current-row" : row.key === currentWeek?.key ? "customer-study-current-week" : ""}
      onRow={(row) => ({ "data-current-study": row.key === currentLeaf?.key ? "true" : undefined })} locale={{ emptyText: "暂无班级课表" }} />
  </section>;
}
