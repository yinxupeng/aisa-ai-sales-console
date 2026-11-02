import React, { useEffect, useRef, useState } from "react";
import { App, Avatar, Button, Card, Drawer, Empty, Form, Input, Modal, Select, Space, Switch, Table, Tag, Typography } from "antd";
import { BarChartOutlined, StopOutlined, LeftOutlined, RightOutlined, PlusOutlined, RobotOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import SalesReportPreview from "../components/SalesReportPreview";
import SalesAssistantProgress from "../components/SalesAssistantProgress";
import AnalysisHistoryList from "../components/AnalysisHistoryList";
import { changeAnalysisHistory, listAnalysisHistory } from "../data/analysisHistory";
import ReportScheduleFields from "../components/ReportScheduleFields";
import ReportAutomationPanel from "../components/ReportAutomationPanel";
import { defaultReportSchedule, validateReportSchedule, describeReportSchedule, interpretScheduleRequest, simulateReportRun } from "../data/reportSchedules";
import { computeSalesReport, defaultReportDefinition, interpretReportRequest, reportTime, reportTypes, seedReportWorkspace, workspaceStorageKey } from "../data/salesReports";
import { startSalesAssistantDemo } from "../data/salesAssistantProgress";
import { intentDemoSessionId, withIntentAnalysisDemo, cohortDemoSessionId, withCohortConversionDemo, orderDemoSessionId, withOrderQueryDemo } from "../data/salesAssistantDemo";
import OrderQueryReport from "../components/OrderQueryReport";
import CohortConversionReport from "../components/CohortConversionReport";
import IntentAnalysisPage from "./IntentAnalysisPage";
import SalesReportDetailPage from "./SalesReportDetailPage";
import SalesReportArtifactLink from "../components/SalesReportArtifactLink";
import { createReportArtifact, migrateReportArtifacts } from "../data/salesReportArtifacts";
const { Text, Title, Paragraph } = Typography;
const starters = ["查询昨天（10月29日）销售企微生成多少订单，排除班主任", "分析最近一周每天每期次体验课转化率，分销售看，先输出数据", "生成最近7天各销售的有效沟通报表", "分析最近7天用户意向分布", "看看最近7天自动跟进任务的执行情况", "分析最近30天沟通至报名的转化情况"];

export default function SalesReportingPage({ mode = "assistant", user = { key: "demo", name: "平台管理员", company: "观心实验室" }, visibleWecomKeys = [], onNavigate = () => {}, onViewConversation = () => {} }) {
  const { message } = App.useApp();
  const storageKey = workspaceStorageKey(user.key, user.company, visibleWecomKeys);
  const [workspace, setWorkspace] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (Array.isArray(saved?.sessions) && Array.isArray(saved?.reports)) return migrateReportArtifacts(withOrderQueryDemo(withCohortConversionDemo(withIntentAnalysisDemo({ ...saved, sessions: saved.sessions.map((item) => ({ ...item, messages: item.messages.map((entry) => entry.status === "generating" ? { ...entry, status: "stopped", text: "上次生成已中断，请重新发送。" } : entry) })) }), visibleWecomKeys)), visibleWecomKeys); } catch {} return migrateReportArtifacts(withOrderQueryDemo(withCohortConversionDemo(withIntentAnalysisDemo(seedReportWorkspace(visibleWecomKeys)), visibleWecomKeys)), visibleWecomKeys); });
  const [activeId, setActiveId] = useState(() => workspace.sessions.find((item) => item.id === orderDemoSessionId && !item.archived)?.id || workspace.sessions.find((item) => item.id === cohortDemoSessionId && !item.archived)?.id || workspace.sessions.find((item) => item.id === intentDemoSessionId && !item.archived)?.id || null), [input, setInput] = useState("");
  const [reportCollapsed, setReportCollapsed] = useState(true);
  const [previewArtifact, setPreviewArtifact] = useState(null);
  const [intentReportReady, setIntentReportReady] = useState(null);
  const [historyArchived, setHistoryArchived] = useState(false);
  const [renameId, setRenameId] = useState(null), [renameForm] = Form.useForm();
  const [saveOpen, setSaveOpen] = useState(false), [saveForm] = Form.useForm();
  const [saveSchedule, setSaveSchedule] = useState(null);
  const [scheduleId, setScheduleId] = useState(null), [scheduleDraft, setScheduleDraft] = useState(defaultReportSchedule);
  const [reportTab, setReportTab] = useState("reports");
  const [keyword, setKeyword] = useState(""), [type, setType] = useState("all"), [detailId, setDetailId] = useState(null);
  const endRef = useRef(null);
  const generationRef = useRef(null);
  const [generation, setGeneration] = useState(null);
  const stopGeneration = () => {
    const job = generationRef.current;
    if (!job) return;
    job.cancel(); generationRef.current = null; setGeneration(null);
    setWorkspace((state) => ({ ...state, sessions: state.sessions.map((item) => item.id === job.sessionId ? { ...item, messages: item.messages.map((entry) => entry.id === job.messageId ? { ...entry, status: "stopped", text: "已停止生成，本次未更新报表。" } : entry) } : item) }));
  };
  useEffect(() => () => { generationRef.current?.cancel(); generationRef.current = null; }, []);
  useEffect(() => { if (mode !== "assistant") stopGeneration(); }, [mode]);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(workspace)); } catch { message.warning("本地空间不足，报表暂时只在本次页面保留"); } }, [workspace, storageKey]);
  const session = workspace.sessions.find((item) => item.id === activeId);
  const isIntentDemo = previewArtifact ? previewArtifact.kind === "intentAnalysis" : session?.demoPage === "intentAnalysis";
  const previewDefinition = previewArtifact?.definition || (isIntentDemo ? intentReportReady?.definition : session?.definition);
  const previewSchedule = previewArtifact ? previewArtifact.pendingSchedule : session?.pendingSchedule;
  const result = previewArtifact?.result || (isIntentDemo ? intentReportReady?.result || null : session?.definition ? computeSalesReport(session.definition, visibleWecomKeys) : null);
  const hasReport = Boolean(previewArtifact || isIntentDemo || (result && (!["cohortConversion", "orderQuery"].includes(session?.definition?.presentation) || session.pageGenerated)));
  useEffect(() => { setReportCollapsed(true); setPreviewArtifact(null); setIntentReportReady(null); }, [activeId]);
  const openArtifact = (artifact) => { setPreviewArtifact(artifact); setReportCollapsed(false); };
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [activeId, session?.messages.length, generation?.stage]);
  const selectSession = (id) => { if (id !== activeId) stopGeneration(); setActiveId(id); };
  const newSession = () => { stopGeneration(); setActiveId(null); setInput(""); setReportCollapsed(true); setHistoryArchived(false); };
  const historyAction = (item, action) => {
    if (action === "rename") { renameForm.setFieldsValue({ title: item.title }); setRenameId(item.id); return; }
    const apply = () => {
      if ((action === "delete" || action === "archive") && item.id === activeId) newSession();
      setWorkspace((state) => ({ ...state, sessions: changeAnalysisHistory(state.sessions, item.id, action) }));
      if (action === "archive") message.success("分析记录已归档，可在归档列表恢复");
      if (action === "restore") message.success("分析记录已恢复");
    };
    if (action === "delete") Modal.confirm({ title: "删除这条分析记录？", content: "删除后无法恢复。已保存的报表和定时任务继续保留。", okText: "删除", cancelText: "取消", okButtonProps: { danger: true }, onOk: apply });
    else apply();
  };
  const renameHistory = async () => {
    let values; try { values = await renameForm.validateFields(); } catch { return; }
    setWorkspace((state) => ({ ...state, sessions: changeAnalysisHistory(state.sessions, renameId, "rename", values.title) }));
    setRenameId(null); message.success("名称已更新");
  };
  const send = (request = input) => {
    const text = request.trim(); if (!text || generationRef.current) return;
    if (session?.archived) { message.info("请先恢复此记录，再继续分析"); return; }
    const scheduling = interpretScheduleRequest(text);
    const pageRequested = /(?:生成|做成|转成|整理成).*(?:页面|网页)/.test(text) && !/不用|不要|先不/.test(text);
    const analysis = pageRequested && session?.definition ? { definition: session.definition } : interpretReportRequest(text, session?.definition || defaultReportDefinition);
    const outcome = scheduling ? { definition: analysis.definition || session?.definition || defaultReportDefinition, error: scheduling.error || (/预测|营收|利润|退款|其他企业|其他公司|到课|完课|时长/.test(text) ? analysis.error : null) } : analysis;
    const id = session?.id || `analysis-${Date.now()}`;
    const messageId = `reply-${Date.now()}`;
    const dataOnly = !outcome.error && !scheduling && !pageRequested && ["cohortConversion", "orderQuery"].includes(outcome.definition.presentation);
    const generatedReport = outcome.error ? null : pageRequested && ["cohortConversion", "orderQuery"].includes(session?.definition?.presentation) && session?.dataResult ? session.dataResult : computeSalesReport(outcome.definition, visibleWecomKeys);
    const reply = outcome.error || (dataOnly && outcome.definition.presentation === "orderQuery" ? "昨天（10月29日）销售企微促成的正价课订单共22笔，成交总额为106,500元。主力商品为《青少年同行者计划领航营》（20笔）。以下是模拟数据与口径说明。" : dataOnly ? `已统计最近一周（2026-10-23至10-29）各销售、各体验课期次的转化数据。整体转化率为${generatedReport.metrics[2][1]}。以下先展示数据结果，暂不生成页面。确认后可以告诉我“把结果生成页面”。` : pageRequested ? "已把上面的数据生成报表页面，并保留已确认的统计结果和统计口径。点击下方文件可在右侧查看，再决定是否保存报表或定时生成；当前未自动保存或创建任务。" : scheduling?.schedule ? `已整理定时方案：${describeReportSchedule(scheduling.schedule)}（北京时间）。请点击右侧“定时生成”，确认报表名称、执行节奏和时间后保存任务。原型尚未接入后台定时调度。` : `已按${generatedReport.range}整理${reportTypes[outcome.definition.type]}。右侧可核对统计口径与用户明细，也可以继续要求“按角色分组”“只看第三节课”或“改为最近30天”。`);
    const next = { ...(session || { id, title: text.slice(0, 24), messages: [] }), updatedAt: reportTime(), messages: [...(session?.messages || []), { role: "user", text }, { id: messageId, role: "assistant", text: "", status: "generating" }] };
    setWorkspace((state) => ({ ...state, sessions: [next, ...state.sessions.filter((item) => item.id !== id)] })); setActiveId(id); setInput("");
    const cancel = startSalesAssistantDemo({ text: reply,
      onStage: (stage) => setGeneration({ sessionId: id, messageId, stage, text: "" }),
      onText: (output) => setGeneration((current) => current ? { ...current, text: output } : current),
      onComplete: () => {
        generationRef.current = null; setGeneration(null);
        const artifact = outcome.error || dataOnly ? null : createReportArtifact({ definition: outcome.definition, result: generatedReport, pendingSchedule: scheduling?.schedule || session?.pendingSchedule });
        setWorkspace((state) => ({ ...state, sessions: state.sessions.map((item) => item.id === id ? { ...item,
          definition: outcome.error ? item.definition : outcome.definition || item.definition,
          demoPage: outcome.error ? item.demoPage : undefined,
          dataResult: dataOnly ? generatedReport : item.dataResult,
          pageGenerated: outcome.error ? item.pageGenerated : !dataOnly,
          pendingSchedule: !outcome.error && scheduling?.schedule ? scheduling.schedule : item.pendingSchedule,
          messages: item.messages.map((entry) => entry.id === messageId ? { ...entry, status: "complete", text: reply, ...(dataOnly ? generatedReport.presentation === "orderQuery" ? { orderReport: generatedReport } : { chatReport: generatedReport } : {}), ...(artifact ? { artifact } : {}) } : entry)
        } : item) }));
        if (artifact) openArtifact(artifact);
        else if (dataOnly) { setPreviewArtifact(null); setReportCollapsed(true); }
      }
    });
    generationRef.current = { cancel, sessionId: id, messageId };
  };
  const save = async () => {
    let values; try { values = await saveForm.validateFields(); } catch { return; }
    let schedule; try { schedule = saveSchedule ? validateReportSchedule(saveSchedule) : null; } catch (error) { message.error(error.message); return; }
    const report = { id: `report-${Date.now()}`, name: values.name.trim(), definition: { ...previewDefinition }, result, creator: user.name, createdAt: reportTime(), schedule };
    setWorkspace((state) => ({ ...state, reports: [report, ...state.reports] })); setSaveOpen(false); message.success("已保存，可在数据报表中查看");
  };
  const beginSave = (scheduled) => { saveForm.setFieldsValue({ name: result.title }); setSaveSchedule(scheduled ? previewSchedule || defaultReportSchedule() : null); setSaveOpen(true); };
  const configureSchedule = (report) => { setScheduleId(report.id); setScheduleDraft(report.schedule || defaultReportSchedule()); };
  const saveReportSchedule = () => {
    let schedule; try { schedule = validateReportSchedule(scheduleDraft); } catch (error) { message.error(error.message); return; }
    setWorkspace((state) => ({ ...state, reports: state.reports.map((report) => report.id === scheduleId ? { ...report, schedule } : report) })); setScheduleId(null); message.success("定时生成配置已保存（原型演示）");
  };
  const simulate = (report) => {
    if (!report.schedule?.enabled) { message.info("请先开启任务"); return; }
    const record = simulateReportRun(report, visibleWecomKeys);
    setWorkspace((state) => ({ ...state, records: [record, ...(state.records || [])], reports: state.reports.map((item) => item.id === report.id ? { ...item, ...(record.status === "成功" ? { result: record.result } : {}), lastRunAt: record.executedAt, lastRunStatus: record.status } : item) }));
    message[record.status === "成功" ? "success" : "error"](record.status === "成功" ? "已模拟生成一次，结果已保存到生成记录" : record.reason);
  };
  const editReport = (report) => {
    const id = `analysis-${Date.now()}`;
    const next = { id, title: report.name, updatedAt: reportTime(), definition: report.definition, messages: [{ role: "assistant", text: `已载入“${report.name}”的分析定义。你可以继续调整，保存后将生成新的报表，原报表继续保留。`, artifact: createReportArtifact({ definition: report.definition, result: report.result, pendingSchedule: report.schedule, name: report.name }) }] };
    setWorkspace((state) => ({ ...state, sessions: [next, ...state.sessions] })); setActiveId(id); setDetailId(null); onNavigate("salesAssistant");
    setHistoryArchived(false);
  };
  const detail = workspace.reports.find((item) => item.id === detailId);
  if (mode === "reports" && detail) return <SalesReportDetailPage report={detail} onBack={() => setDetailId(null)} onContinue={editReport} />;
  return <div className="sales-reporting-page">
    {mode !== "assistant" ? <div className="sales-report-page-head"><div><Title level={4}>数据报表</Title><Text type="secondary">沉淀分析结果，持续查看销售表现</Text></div><Space><Tag>原型演示 · 模拟数据</Tag><Button onClick={() => onNavigate("salesAssistant")}>去销售助理分析</Button></Space></div> : null}
    {mode === "assistant" ? <div className={`sales-assistant-workspace${!hasReport ? " is-report-empty" : reportCollapsed ? " is-report-collapsed" : ""}`}>
      <aside className="sales-assistant-history"><div className="sales-assistant-history-head"><Button type="primary" icon={<PlusOutlined />} block onClick={newSession}>新建任务</Button></div><div className="sales-assistant-history-scroll"><AnalysisHistoryList sessions={workspace.sessions} activeId={activeId} archived={historyArchived} onArchivedChange={(archived) => { newSession(); setHistoryArchived(archived); }} onSelect={selectSession} onAction={historyAction} /><div className="sales-assistant-data-source"><Text strong>当前分析数据</Text><Text type="secondary">观心实验室</Text><Text type="secondary">儿童心理健康课程</Text><Tag color="green">{visibleWecomKeys.length} 个可见企微账号</Tag></div></div></aside>
      <section className="sales-assistant-chat"><div className="sales-assistant-chat-head"><Space><Avatar icon={<RobotOutlined />} style={{ background: "#eef2ff", color: "#4f46e5" }} /><div className="sales-assistant-session-heading"><Text strong className="sales-assistant-session-title" title={session?.title || "新建任务"}>{session?.title || "新建任务"}</Text></div></Space><div className="sales-assistant-compact-controls"><Select aria-label="历史分析" placeholder="历史分析" value={activeId || undefined} onChange={selectSession} style={{ width: 110 }} options={listAnalysisHistory(workspace.sessions, Boolean(session?.archived)).map((item) => ({ value: item.id, label: item.title }))} /><Button size="small" icon={<PlusOutlined />} onClick={newSession}>新建任务</Button></div></div>
        <div className="sales-assistant-messages">{!session ? <div className="sales-assistant-welcome"><RobotOutlined /><Title level={4}>今天想了解哪些销售数据？</Title><Paragraph type="secondary">描述你的业务问题，生成图表、明细和跟进建议。</Paragraph><div>{starters.map((text) => <button key={text} onClick={() => send(text)}><BarChartOutlined />{text}</button>)}</div></div> : session.messages.map((item, index) => <div key={index} className={`sales-assistant-message ${item.role}`}><Avatar size={28} icon={item.role === "user" ? <UserOutlined /> : <RobotOutlined />} /><div>{item.status === "generating" ? <SalesAssistantProgress stage={generation?.stage ?? 0} text={generation?.text || ""} /> : <>{item.status === "complete" ? <div className="sales-assistant-complete-label">分析已完成</div> : null}{item.text}{item.orderReport ? <OrderQueryReport report={item.orderReport} /> : null}{item.chatReport ? <CohortConversionReport report={item.chatReport} inChat /> : null}<SalesReportArtifactLink artifact={item.artifact} onOpen={openArtifact} /></>}</div></div>)}<div ref={endRef} /></div>
        <div className="sales-assistant-composer"><Input.TextArea disabled={Boolean(session?.archived)} aria-label="输入业务分析问题" value={input} onChange={(event) => setInput(event.target.value)} placeholder="例如：生成最近7天各销售的有效沟通报表" autoSize={{ minRows: 2, maxRows: 5 }} onPressEnter={(event) => { if (!event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} /><div><Text type="secondary">Enter发送 · Shift+Enter换行</Text>{generation ? <Button icon={<StopOutlined />} onClick={stopGeneration}>停止生成</Button> : <Button type="primary" icon={<SendOutlined />} disabled={!input.trim() || Boolean(session?.archived)} onClick={() => send()}>发送</Button>}</div></div>
      </section>
      {!hasReport ? null : reportCollapsed ? <aside className="sales-report-collapsed-rail"><Button type="text" icon={<LeftOutlined />} aria-label="展开报表预览" aria-expanded={false} title="展开报表预览" onClick={() => setReportCollapsed(false)} /><button className="sales-report-rail-label" onClick={() => setReportCollapsed(false)} aria-label="展开右侧报表">报表预览</button></aside>
        : <section className="sales-assistant-report"><div className="sales-assistant-chat-head"><Text strong>报表预览</Text><Space size={8} wrap><Button type="primary" disabled={!result || Boolean(generation)} onClick={() => beginSave(false)}>保存报表</Button><Button disabled={!result || Boolean(generation)} onClick={() => beginSave(true)}>定时生成</Button><Button type="text" icon={<RightOutlined />} aria-label="收起报表预览" aria-expanded={true} title="收起报表预览" onClick={() => setReportCollapsed(true)} /></Space></div><div className={`sales-assistant-report-scroll${isIntentDemo ? " sales-assistant-intent-demo" : ""}`}>{isIntentDemo ? <IntentAnalysisPage key={previewArtifact?.generatedAt || "intent-demo"} embedded visibleWecomKeys={visibleWecomKeys} reportSnapshot={previewArtifact?.result?.intentSnapshot} onReportReady={setIntentReportReady} onViewConversation={onViewConversation} /> : <SalesReportPreview report={result} />}</div></section>}
    </div> : <ReportAutomationPanel workspace={workspace} tab={reportTab} onTabChange={setReportTab} onConfigure={configureSchedule} onSimulate={simulate} onToggle={(id, enabled) => setWorkspace((state) => ({ ...state, reports: state.reports.map((item) => item.id === id ? { ...item, schedule: { ...item.schedule, enabled } } : item) }))}><Card><Space wrap style={{ marginBottom: 16 }}><Input.Search placeholder="搜索报表名称" allowClear value={keyword} onChange={(event) => setKeyword(event.target.value)} style={{ width: 260 }} /><Select aria-label="报表类型" value={type} onChange={setType} style={{ width: 160 }} options={[{ value: "all", label: "全部报表类型" }, ...Object.entries(reportTypes).map(([value, label]) => ({ value, label }))]} /><Text type="secondary">当前账号可见范围内的分析报表</Text></Space><Table rowKey="id" size="middle" dataSource={workspace.reports.filter((report) => report.name.includes(keyword) && (type === "all" || report.definition.type === type))} pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: 1000 }} columns={[
      { title: "报表名称", dataIndex: "name", render: (value, row) => <Button type="link" onClick={() => setDetailId(row.id)}>{value}</Button> }, { title: "类型", render: (_, row) => <Tag>{reportTypes[row.definition.type]}</Tag> }, { title: "分析范围", render: (_, row) => row.result.range }, { title: "创建人", dataIndex: "creator" }, { title: "最近计算", render: (_, row) => row.result.generatedAt }, { title: "操作", width: 340, render: (_, row) => <Space size={0}><Button type="link" onClick={() => setDetailId(row.id)}>查看</Button><Button type="link" onClick={() => { setWorkspace((state) => ({ ...state, reports: state.reports.map((item) => item.id === row.id ? { ...item, result: computeSalesReport(item.definition, visibleWecomKeys) } : item) })); message.success("已按报表定义重新计算模拟样本，数据截止日期保持不变"); }}>刷新</Button><Button type="link" onClick={() => editReport(row)}>继续分析</Button><Button type="link" onClick={() => configureSchedule(row)}>定时生成</Button><Button type="link" danger onClick={() => Modal.confirm({ title: "删除此报表？", content: row.name, okText: "删除", cancelText: "取消", onOk: () => setWorkspace((state) => ({ ...state, reports: state.reports.filter((item) => item.id !== row.id) })) })}>删除</Button></Space> }
    ]} /></Card></ReportAutomationPanel>}
    <Modal title="重命名分析" open={Boolean(renameId)} onCancel={() => setRenameId(null)} onOk={renameHistory} okText="保存" cancelText="取消"><Form form={renameForm} layout="vertical"><Form.Item name="title" label="分析名称" rules={[{ required: true, whitespace: true, message: "请输入分析名称" }, { max: 60, message: "最多60个字符" }]}><Input maxLength={60} autoFocus onPressEnter={renameHistory} /></Form.Item></Form></Modal>
    <Modal title={saveSchedule ? "保存报表并配置定时任务" : "保存到数据报表"} open={saveOpen} onCancel={() => setSaveOpen(false)} onOk={save} okText="保存" cancelText="取消"><Form form={saveForm} layout="vertical"><Form.Item label="报表名称" name="name" rules={[{ required: true, whitespace: true, message: "请填写报表名称" }]}><Input maxLength={60} /></Form.Item><Form.Item label="定时生成"><Switch checked={Boolean(saveSchedule)} onChange={(enabled) => setSaveSchedule(enabled ? previewSchedule || defaultReportSchedule() : null)} /></Form.Item>{saveSchedule ? <ReportScheduleFields value={saveSchedule} onChange={setSaveSchedule} /> : <Text type="secondary">保存分析范围、指标口径、展示方式和当前结果，可在数据报表中重新计算。</Text>}</Form></Modal>
    <Drawer title="定时生成配置" open={Boolean(scheduleId)} onClose={() => setScheduleId(null)} size={560} extra={<Button type="primary" onClick={saveReportSchedule}>保存配置</Button>}><Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}><Form.Item label="报表名称"><Text strong>{workspace.reports.find((item) => item.id === scheduleId)?.name}</Text></Form.Item><Form.Item label="分析范围"><Text>{workspace.reports.find((item) => item.id === scheduleId)?.result.range}</Text></Form.Item><ReportScheduleFields value={scheduleDraft} onChange={setScheduleDraft} /></Form></Drawer>
  </div>;
}
