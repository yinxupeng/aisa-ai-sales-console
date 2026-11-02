import React, { useState } from "react";
import {
  Alert, App as AntApp, Button, Card, Checkbox, Col, Divider,
  Input, Modal, Progress, Radio, Row, Segmented, Select, Slider,
  Space, Steps, Switch, Tag, Tooltip, Typography, Upload
} from "antd";
import {
  ApartmentOutlined, BookOutlined, BuildOutlined, CheckCircleOutlined,
  CheckOutlined, ClearOutlined, ClockCircleOutlined, CodeOutlined,
  CopyOutlined, DeleteOutlined, FileExcelOutlined, FilePdfOutlined,
  FileWordOutlined, LeftOutlined, MessageOutlined, PlusOutlined,
  RightOutlined, RobotOutlined, RocketOutlined, SaveOutlined, SendOutlined,
  ThunderboltOutlined, ToolOutlined, UploadOutlined
} from "@ant-design/icons";
import {
  availableVariables, complianceChecklist, elementsMeta,
  initialKnowledgeBaseList, initialScheduledTasksList, initialSkillsList, initialToolsList,
  promptTemplates, rawBusinessIntakeSamples, virtualCustomerPersonas
} from "../data/promptStudioData";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const elementIconMap = {
  MessageOutlined: <MessageOutlined style={{ color: "#1890ff" }} />,
  ClockCircleOutlined: <ClockCircleOutlined style={{ color: "#13c2c2" }} />,
  BookOutlined: <BookOutlined style={{ color: "#722ed1" }} />,
  ToolOutlined: <ToolOutlined style={{ color: "#fa8c16" }} />,
  ApartmentOutlined: <ApartmentOutlined style={{ color: "#f5222d" }} />,
  CodeOutlined: <CodeOutlined style={{ color: "#52c41a" }} />
};

export default function PromptStudioPage() {
  const { message } = AntApp.useApp();

  // 当前总流程阶段：0: 调研与收集资料, 1: AI拆解与确认, 2: 六要素生成与自由修改
  const [currentStep, setCurrentStep] = useState(0);

  // 阶段 1：调研与收集资料状态（每个资料类型支持上传文件）
  const [selectedTemplateId, setSelectedTemplateId] = useState(promptTemplates[0].id);
  const activeTemplate = promptTemplates.find(t => t.id === selectedTemplateId) || promptTemplates[0];

  const [scheduleFile, setScheduleFile] = useState({ name: "【19a】Day1_营期排期与触达节奏表.xlsx", size: "148 KB", type: "excel" });
  const [scriptFile, setScriptFile] = useState({ name: "【19a】Day1_销冠话术手册与红线制度.docx", size: "320 KB", type: "word" });
  const [productFile, setProductFile] = useState({ name: "【19a】Day1_体验课大纲与CRM标签说明.pdf", size: "512 KB", type: "pdf" });

  const [rawScheduleInput, setRawScheduleInput] = useState(rawBusinessIntakeSamples.sopSchedule);
  const [rawScriptInput, setRawScriptInput] = useState(rawBusinessIntakeSamples.salesScript);
  const [rawProductInput, setRawProductInput] = useState(rawBusinessIntakeSamples.productDoc);

  // 阶段 3：可编辑修改的六要素配置状态 (支持修改)
  const [subEditTab, setSubEditTab] = useState("prompt");
  const [agentName, setAgentName] = useState(promptTemplates[0].config.agentName);
  const [stageGoal, setStageGoal] = useState(promptTemplates[0].config.stageGoal);
  const [tone, setTone] = useState(promptTemplates[0].config.tone);
  const [toneValue, setToneValue] = useState(promptTemplates[0].config.toneValue);
  const [responseLength, setResponseLength] = useState(promptTemplates[0].config.responseLength);
  const [branches, setBranches] = useState(promptTemplates[0].config.branches);
  const [checkedConstraints, setCheckedConstraints] = useState(complianceChecklist.filter(c => c.defaultChecked).map(c => c.label));
  const [rawPrompt, setRawPrompt] = useState(promptTemplates[0].config.rawPrompt);
  const [viewMode, setViewMode] = useState("wizard");

  // 可编辑列表数据
  const [scheduledTasksList, setScheduledTasksList] = useState(initialScheduledTasksList);
  const [knowledgeList, setKnowledgeList] = useState(initialKnowledgeBaseList);
  const [toolsList, setToolsList] = useState(initialToolsList);
  const [skillsList, setSkillsList] = useState(initialSkillsList);

  // 弹窗状态
  const [isPolisherOpen, setIsPolisherOpen] = useState(false);
  const [polisherInput, setPolisherInput] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);

  // 沙箱模拟对练状态
  const [selectedPersonaId, setSelectedPersonaId] = useState(virtualCustomerPersonas[0].id);
  const currentPersona = virtualCustomerPersonas.find(p => p.id === selectedPersonaId) || virtualCustomerPersonas[0];
  const [sandboxMessages, setSandboxMessages] = useState([
    { sender: "customer", text: "你们讲的方法听起来挺好，但换我们家孩子根本不配合，管用吗？", time: "10:14" },
    {
      sender: "agent",
      text: "李妈妈特别理解您的顾虑！初二孩子自我意识觉醒，如果直接跟他说'去听课/去改正'，孩子本能就会防御对抗。我们领航营的方法第一步不是要求孩子改，而是先教家长用'非说教式沟通'卸下孩子防备。今晚开营第一讲就有真实同班孩子的对话还原，您可以先听听看孩子适不适合这种引导方式。",
      decisionChain: { stage: "【19a】Day1 开课第一天", matchedBranch: "当家长主动倾诉孩子手机成瘾/厌学叛逆时", complianceChecked: "通过 (未夸大承诺、未提前报价、未指责孩子)", personaApplied: "共情亲和 (语气温和、消除对抗感)" },
      time: "10:15"
    }
  ]);
  const [customTestInput, setCustomTestInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  // 上传文件处理
  const handleFileUpload = (type, file) => {
    const fileSize = file.size ? `${(file.size / 1024).toFixed(1)} KB` : "120 KB";
    const fileType = file.name.endsWith(".xlsx") || file.name.endsWith(".xls") ? "excel"
      : file.name.endsWith(".docx") || file.name.endsWith(".doc") ? "word"
      : file.name.endsWith(".pdf") ? "pdf" : "doc";

    if (type === "schedule") {
      setScheduleFile({ name: file.name, size: fileSize, type: fileType });
      message.success(`已上传排期文件：${file.name}，AI 已自动解析时间节点！`);
    } else if (type === "script") {
      setScriptFile({ name: file.name, size: fileSize, type: fileType });
      message.success(`已上传话术文件：${file.name}，AI 已自动解析沟通策略！`);
    } else if (type === "product") {
      setProductFile({ name: file.name, size: fileSize, type: fileType });
      message.success(`已上传课纲文件：${file.name}，AI 已自动解析教研大纲与标签！`);
    }
  };

  // 载入真实物料样例
  const handleLoadSample = () => {
    setScheduleFile({ name: "【19a】Day1_营期排期与触达节奏表.xlsx", size: "148 KB", type: "excel" });
    setScriptFile({ name: "【19a】Day1_销冠话术手册与红线制度.docx", size: "320 KB", type: "word" });
    setProductFile({ name: "【19a】Day1_体验课大纲与CRM标签说明.pdf", size: "512 KB", type: "pdf" });
    setRawScheduleInput(rawBusinessIntakeSamples.sopSchedule);
    setRawScriptInput(rawBusinessIntakeSamples.salesScript);
    setRawProductInput(rawBusinessIntakeSamples.productDoc);
    message.success("已成功载入【19a】Day1 真实生产业务资料与对应文件！");
  };

  const handleRunDecomposition = () => {
    if (!rawScheduleInput.trim() && !rawScriptInput.trim() && !scheduleFile && !scriptFile) {
      message.warning("请至少上传资料文件或输入资料内容！"); return;
    }
    setCurrentStep(1);
    message.success("AI 已结合您上传的资料文件与内容，完成六要素智能拆解！");
  };

  const handleAddBranch = () => setBranches([...branches, { id: `b_${Date.now()}`, condition: "当客户提问涉及某场景时", strategy: "在此输入对应的引导与应答策略" }]);
  const handleRemoveBranch = (id) => setBranches(branches.filter(b => b.id !== id));
  const handleUpdateBranch = (id, field, value) => setBranches(branches.map(b => b.id === id ? { ...b, [field]: value } : b));

  const handleAddScheduledTask = () => {
    setScheduledTasksList([...scheduledTasksList, { id: `st_${Date.now()}`, time: "12:00", title: "新建定时跟进提醒", content: "输入推送内容或话术提醒...", enabled: true }]);
    message.info("已新增定时任务，可直接修改时间和内容");
  };
  const handleRemoveScheduledTask = (id) => setScheduledTasksList(scheduledTasksList.filter(t => t.id !== id));
  const handleUpdateScheduledTask = (id, field, value) => setScheduledTasksList(scheduledTasksList.map(t => t.id === id ? { ...t, [field]: value } : t));

  const handleInsertVariable = (varName) => {
    setRawPrompt(prev => `${prev}\n- 引用变量: ${varName}`);
    message.info(`已插入变量 ${varName}`);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard?.writeText(rawPrompt);
    message.success("已复制完整 Prompt 源码到剪贴板！");
  };

  const handleRunPolisher = () => {
    if (!polisherInput.trim()) { message.warning("请输入您的粗略意图或想法！"); return; }
    setIsPolishing(true);
    setTimeout(() => {
      setIsPolishing(false); setIsPolisherOpen(false);
      setAgentName(`${activeTemplate.name} (AI优化版)`);
      setRawPrompt(`# 角色定位\n你是体验营专属顾问。\n\n# 核心业务目标\n${polisherInput}\n\n# 阶段分支策略\n- 针对客户疑虑：先共情日常不易，再给出轻量方案，不增加心理负担。\n- 针对决策拖延：提供锁定名额机制与专属案例。\n\n# 红线约束\n严禁承诺保过；严禁私下报价；单次回复控制在100字内。`);
      message.success("AI 已成功将白话意图结构化装配为工业级提示词！");
    }, 700);
  };

  const handleSendTestMessage = (testText) => {
    const textToSend = testText || customTestInput;
    if (!textToSend.trim()) return;

    setSandboxMessages(prev => [...prev, { sender: "customer", text: textToSend, time: new Date().toTimeString().slice(0, 5) }]);
    setCustomTestInput("");
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      let replyText = "家长您的顾虑非常现实！很多初次了解我们的家长也都有同样的疑问。";
      let matchedBranch = "默认应答应答规则";

      if (textToSend.includes("贵") || textToSend.includes("折") || textToSend.includes("钱")) {
        replyText = "张爸爸，特别理解您对家庭开支的精打细算！4980 元看似是一笔集中支出，但它是覆盖全年 365 天的家庭教练陪跑，折算下来每天才 13 块多，还不如一杯咖啡。相比去线下单次 800-1200 元的心理咨询，体系化学习能从根源帮您省下巨额试错成本。";
        matchedBranch = "当客户提出'价格太贵/超出预算'时 -> 采用日均成本拆解法";
      } else if (textToSend.includes("没时间") || textToSend.includes("退") || textToSend.includes("加班")) {
        replyText = "陈女士，知道您平时工作特别辛苦，晚上还要为孩子操心，太不容易了！您千万别有心理负担，这次体验营主要是帮您理清关键卡点。老师昨晚直播的精华我已经提炼成了 3 分钟思维导图，您忙完了在手机上花两分钟瞅一眼就能抓住核心。";
        matchedBranch = "当学员表示'没时间/想退课'时 -> 消除自责，提供精简讲义";
      } else if (textToSend.includes("骗人") || textToSend.includes("资质") || textToSend.includes("管用吗")) {
        replyText = "李妈妈您问得很专业！现在的确市面上噱头很多，做家长的慎重是完全对的。观心团队全部由中科院心理所及高校家庭教育专家领衔，所有咨询师均具备国家级心理咨询或家庭教育指导师证书。我们绝不承诺所谓的'三天包治'，而是教您一套可复现的亲子沟通工具，您今晚听听实操案例就会有直观感受。";
        matchedBranch = "当家长质疑师资资质或实际效果时 -> 摆资质证明、拆解科学路径、不夸大";
      }

      setSandboxMessages(prev => [...prev, {
        sender: "agent", text: replyText,
        decisionChain: { stage: activeTemplate.stage, matchedBranch, complianceChecked: "通过 (未私自降价、未承诺保过、符合字数约束)", personaApplied: `${tone} (倾向度 ${toneValue}%)` },
        time: new Date().toTimeString().slice(0, 5)
      }]);
    }, 600);
  };

  return (
    <div className="prompt-studio-page" style={{ padding: "0 2px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* 顶部控制栏 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "12px 18px", background: "#fff", borderRadius: 8, border: "1px solid #edf1f7", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)" }}>
          <Space size={8} wrap style={{ alignItems: "center" }}>
            <Tag color="purple" icon={<BuildOutlined />} style={{ margin: 0, padding: "2px 8px" }}>阶段智能体设计工坊</Tag>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1f2329" }}>{activeTemplate.name}</span>
            <Tag color="blue">{activeTemplate.tag}</Tag>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>全流程：资料上传收集 ➔ AI智能拆解确认 ➔ 生成六要素并支持自由修改 ➔ 沙箱对练</Text>
          </Space>
          <Space size={10} style={{ alignItems: "center" }}>
            <Button icon={<ThunderboltOutlined style={{ color: "#722ed1" }} />} onClick={() => setIsPolisherOpen(true)}>AI 白话扩写</Button>
            <Button icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />} onClick={() => setIsHealthModalOpen(true)}>健康体检 (94分)</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => setIsPublishSuccessOpen(true)}>保存并发布</Button>
          </Space>
        </div>

        {/* 核心3步闭环进度条 */}
        <Card size="small" style={{ borderRadius: 8, background: "#ffffff", border: "1px solid #edf1f7" }}>
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            size="small"
            items={[
              { title: "步骤 1: 业务调研与资料收集", content: "上传或输入排期表/话术手册/产品文档" },
              { title: "步骤 2: 六要素智能拆解与确认", content: "AI自动拆分为Prompt/任务/知识库/工具/技能/变量" },
              { title: "步骤 3: 六要素配置与自由修改", content: "逐项在线修改、沙箱对抗演练与发布上线" }
            ]}
          />
        </Card>

        {/* ===================== 阶段 1：业务调研与资料收集 (每个资料类型支持上传) ===================== */}
        {currentStep === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Alert
              type="info"
              showIcon
              title="甲方业务资产输入（支持直接上传文件或在线输入）"
              description="每个资料类型均支持上传 Word (.docx)、Excel (.xlsx)、PDF 或 TXT 格式文档。上传后 AI 会自动解析内容并智能解耦为六要素。"
              action={<Button size="small" type="primary" ghost onClick={handleLoadSample}>⚡ 载入【19a】Day1 真实生产物料样例</Button>}
            />

            <Row gutter={[14, 14]}>
              {[
                { key: "schedule", title: "资料 1: 营期排期与触达节奏表", icon: <ClockCircleOutlined style={{ color: "#13c2c2" }} />, tag: "拆解定时任务", tagColor: "cyan", file: scheduleFile, setFile: setScheduleFile, val: rawScheduleInput, setVal: setRawScheduleInput, fileIcon: <FileExcelOutlined style={{ color: "#52c41a" }} />, hint: "支持 Excel / Word / PDF 文件" },
                { key: "script", title: "资料 2: 销冠话术手册与红线制度", icon: <MessageOutlined style={{ color: "#1890ff" }} />, tag: "拆解Prompt与分支", tagColor: "blue", file: scriptFile, setFile: setScriptFile, val: rawScriptInput, setVal: setRawScriptInput, fileIcon: <FileWordOutlined style={{ color: "#1890ff" }} />, hint: "支持 Word (.docx) / PDF / TXT" },
                { key: "product", title: "资料 3: 产品课纲与系统信息", icon: <BookOutlined style={{ color: "#722ed1" }} />, tag: "拆解知识库与工具", tagColor: "purple", file: productFile, setFile: setProductFile, val: rawProductInput, setVal: setRawProductInput, fileIcon: <FilePdfOutlined style={{ color: "#f5222d" }} />, hint: "支持 PDF / Word / FAQ 手册" }
              ].map(card => (
                <Col xs={24} lg={8} key={card.key}>
                  <Card
                    size="small"
                    title={<Space>{card.icon}<span style={{ fontSize: 13, fontWeight: 600 }}>{card.title}</span></Space>}
                    extra={
                      <Space size={6}>
                        <Tag color={card.tagColor}>{card.tag}</Tag>
                        <Upload beforeUpload={(file) => { handleFileUpload(card.key, file); return false; }} showUploadList={false} accept=".xlsx,.xls,.docx,.doc,.pdf,.txt">
                          <Button size="small" type="link" icon={<UploadOutlined />} style={{ padding: 0 }}>上传</Button>
                        </Upload>
                      </Space>
                    }
                    style={{ borderRadius: 8, height: "100%", border: "1px solid #edf1f7" }}
                  >
                    {card.file ? (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", background: "#f0f5ff", borderRadius: 6, border: "1px solid #d6e4ff", marginBottom: 6 }}>
                        <Space size={4} wrap>
                          {card.fileIcon}
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#1f2329" }}>{card.file.name}</span>
                          <span style={{ fontSize: 11, color: "#8c8c8c" }}>({card.file.size})</span>
                          <Tag color="green" style={{ fontSize: 10, lineHeight: "16px", padding: "0 4px" }}>已解析</Tag>
                        </Space>
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => card.setFile(null)} />
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", background: "#fbfbfb", borderRadius: 6, border: "1px dashed #d9d9d9", marginBottom: 6 }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>{card.hint}</Text>
                        <Upload beforeUpload={(file) => { handleFileUpload(card.key, file); return false; }} showUploadList={false} accept=".xlsx,.xls,.docx,.doc,.pdf,.txt">
                          <Button size="small" icon={<UploadOutlined />}>上传文件</Button>
                        </Upload>
                      </div>
                    )}
                    <TextArea rows={9} value={card.val} onChange={(e) => card.setVal(e.target.value)} style={{ fontSize: 12, lineHeight: 1.5, background: "#fafbfd" }} />
                  </Card>
                </Col>
              ))}
            </Row>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" size="large" icon={<RobotOutlined />} onClick={handleRunDecomposition}>
                提交资料，AI 智能拆解六要素 <RightOutlined />
              </Button>
            </div>
          </div>
        )}

        {/* ===================== 阶段 2：六要素智能拆解确认 ===================== */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Alert
              type="success"
              showIcon
              title="AI 智能拆解完成！请检查六要素分工方案"
              description="AI 已从您上传的 3 份资料中完成语义解耦：将对话心智提取入Prompt，时间节点提取入定时任务，课纲手册提取入知识库，写库指令提取入工具。请确认拆解方案："
            />

            <Row gutter={[14, 14]}>
              {elementsMeta.map((elem) => {
                const elemData = activeTemplate.deconstruction[elem.key];
                return (
                  <Col xs={24} md={12} lg={8} key={elem.key}>
                    <Card
                      size="small"
                      title={<Space>{elementIconMap[elem.icon]}<span style={{ fontSize: 14, fontWeight: 600 }}>{elem.title}</span><Tag color={elem.color}>{elem.tag}</Tag></Space>}
                      style={{ borderRadius: 8, height: "100%", border: `1px solid ${elem.border}`, background: elem.bg }}
                    >
                      <div style={{ fontSize: 12, color: "#595959", marginBottom: 6 }}><strong>职责定位：</strong>{elemData.roleDesc}</div>
                      <div style={{ background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #eef3f9", marginBottom: 8 }}>
                        <div style={{ fontSize: 11, color: "#8c8c8c", marginBottom: 4 }}>提炼出的配置项：</div>
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#1f2329", lineHeight: 1.5 }}>
                          {elemData.coreItems.map((item, idx) => (<li key={idx}>{item}</li>))}
                        </ul>
                      </div>
                      <div style={{ fontSize: 11, color: "#595959", background: "#f8f9fa", padding: "4px 8px", borderRadius: 4, border: "1px dashed #e9ecef" }}>
                        💡 <strong>为什么不写进提示词？</strong>{elemData.whyHere}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            <Card size="small" style={{ borderRadius: 8, background: "#f8fafd", border: "1px solid #e6f0fc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2329" }}>📊 拆解成效确认：原本 3 份大物料已规范化解耦</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>确认后将生成 6 项完整配置，且每一项都支持在工作台中直接进行二次编辑与增删！</Text>
                </div>
                <Space>
                  <Button onClick={() => setCurrentStep(0)}><LeftOutlined /> 返回重新上传资料</Button>
                  <Button type="primary" size="large" onClick={() => setCurrentStep(2)}><CheckOutlined /> 确认拆解方案，生成六要素配置 (可直接修改)</Button>
                </Space>
              </div>
            </Card>
          </div>
        )}

        {/* ===================== 阶段 3：六要素配置与自由修改 (支持修改) ===================== */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "10px 16px", borderRadius: 8, border: "1px solid #edf1f7", flexWrap: "wrap", gap: 10 }}>
              <Segmented
                size="middle"
                value={subEditTab}
                onChange={setSubEditTab}
                options={[
                  { label: "🧠 提示词修改", value: "prompt" },
                  { label: `⏰ 定时任务修改 (${scheduledTasksList.length}项)`, value: "tasks" },
                  { label: "📚 知识库管理", value: "knowledge" },
                  { label: "🛠️ 业务工具与技能", value: "tools" },
                  { label: "💬 沙箱对练与发布", value: "sandbox" }
                ]}
              />
              <Space>
                <Tag color="green">全部要素已生成并支持在线修改</Tag>
                <Button size="small" onClick={() => setCurrentStep(1)}>查看拆解蓝图</Button>
              </Space>
            </div>

            {/* 子模块 1：提示词修改 */}
            {subEditTab === "prompt" && (
              <Row gutter={[16, 16]} style={{ display: "flex", alignItems: "stretch" }}>
                <Col xs={24} xl={14} style={{ display: "flex" }}>
                  <Card
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space><BuildOutlined style={{ color: "#1890ff" }} /><span style={{ fontSize: 14 }}>提示词积木装配（支持随时修改）</span></Space>
                        <Radio.Group size="small" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                          <Radio.Button value="wizard">积木表单模式</Radio.Button>
                          <Radio.Button value="code">Markdown 源码</Radio.Button>
                        </Radio.Group>
                      </div>
                    }
                    style={{ borderRadius: 8, width: "100%", display: "flex", flexDirection: "column" }}
                    styles={{ body: { flex: 1, padding: "16px 20px" } }}
                  >
                    {viewMode === "wizard" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <Tag color="blue">积木 1</Tag><span style={{ fontSize: 13 }}>智能体定位与核心目标</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                            <Input addonBefore="智能体名称" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
                            <Select mode="tags" style={{ width: "100%" }} value={stageGoal} onChange={setStageGoal} />
                          </div>
                        </div>

                        <Divider style={{ margin: 0 }} />

                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <Space size={6}><Tag color="cyan">积木 2</Tag><span style={{ fontSize: 13 }}>沟通温度与单次回复字数</span></Space>
                            <Text type="secondary" style={{ fontSize: 12 }}>当前风格：{tone} (倾向度 {toneValue}%)</Text>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 180px", gap: 14, alignItems: "center" }}>
                            <Radio.Group value={tone} onChange={(e) => setTone(e.target.value)} size="small">
                              <Radio.Button value="共情亲和">亲和共情</Radio.Button>
                              <Radio.Button value="专业严谨">专业严谨</Radio.Button>
                              <Radio.Button value="温和坚定">温和坚定</Radio.Button>
                            </Radio.Group>
                            <Slider value={toneValue} onChange={setToneValue} marks={{ 0: "平实中立", 50: "标准温度", 100: "极度热情" }} />
                            <Input size="small" addonBefore="单次字数" value={responseLength} onChange={(e) => setResponseLength(e.target.value)} />
                          </div>
                        </div>

                        <Divider style={{ margin: 0 }} />

                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <Space size={6}><Tag color="orange">积木 3</Tag><span style={{ fontSize: 13 }}>业务分支策略器 (When-Then 规则引擎)</span></Space>
                            <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={handleAddBranch}>添加分支场景</Button>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {branches.map((b, idx) => (
                              <div key={b.id} style={{ background: "#fafbfd", border: "1px solid #edf1f7", borderRadius: 6, padding: "6px 8px", display: "grid", gridTemplateColumns: "auto 1fr 1fr auto", gap: 8, alignItems: "center" }}>
                                <Tag style={{ margin: 0 }}>分支 {idx + 1}</Tag>
                                <Input size="small" addonBefore="当【场景】" value={b.condition} onChange={(e) => handleUpdateBranch(b.id, "condition", e.target.value)} />
                                <Input size="small" addonBefore="执行【策略】" value={b.strategy} onChange={(e) => handleUpdateBranch(b.id, "strategy", e.target.value)} />
                                <Button size="small" type="text" danger onClick={() => handleRemoveBranch(b.id)} disabled={branches.length <= 1}>删除</Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Divider style={{ margin: 0 }} />

                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <Tag color="red">积木 4</Tag><span style={{ fontSize: 13 }}>安全红线与合规禁忌 (系统防范底线)</span>
                          </div>
                          <Checkbox.Group value={checkedConstraints} onChange={setCheckedConstraints} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                            {complianceChecklist.map((c) => (<Checkbox key={c.id} value={c.label}><span style={{ fontSize: 12, color: "#344054" }}>{c.label}</span></Checkbox>))}
                          </Checkbox.Group>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>由表单编译的标准 Markdown 结构（支持直接编辑）：</Text>
                          <Button size="small" icon={<CopyOutlined />} onClick={handleCopyPrompt}>复制源码</Button>
                        </div>
                        <TextArea rows={17} value={rawPrompt} onChange={(e) => setRawPrompt(e.target.value)} style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, background: "#fafbfd", borderRadius: 6 }} />
                      </div>
                    )}
                  </Card>
                </Col>

                <Col xs={24} xl={10} style={{ display: "flex" }}>
                  <Card
                    title={<Space><CodeOutlined style={{ color: "#52c41a" }} /><span style={{ fontSize: 14 }}>可用动态变量插槽</span></Space>}
                    style={{ borderRadius: 8, width: "100%", display: "flex", flexDirection: "column" }}
                    styles={{ body: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px" } }}
                  >
                    <div>
                      <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 10 }}>点击下方标签，可一键将千人千面变量插入提示词末尾：</Paragraph>
                      <Space size={6} wrap>
                        {availableVariables.map((v) => (
                          <Tooltip key={v.name} title={`${v.desc} (${v.category})`}>
                            <Tag style={{ cursor: "pointer", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "2px 6px" }} onClick={() => handleInsertVariable(v.name)}>
                              + {v.name}
                            </Tag>
                          </Tooltip>
                        ))}
                      </Space>
                    </div>

                    <div style={{ background: "#f8fafd", border: "1px solid #edf1f7", borderRadius: 8, padding: "12px", marginTop: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2329", marginBottom: 6 }}>💡 提示词状态</div>
                      <div style={{ fontSize: 12, color: "#595959", lineHeight: 1.8 }}>
                        <div>• 活跃分支：{branches.length} 条 When-Then 规则</div>
                        <div>• 合规红线：{checkedConstraints.length} 条已生效</div>
                        <div>• 健康度评分：94 分 (优秀)</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            {/* 子模块 2：定时任务修改 */}
            {subEditTab === "tasks" && (
              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Space>
                      <ClockCircleOutlined style={{ color: "#13c2c2" }} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>定时任务管理与编辑 (时间事件驱动，支持直接修改时间与内容)</span>
                      <Tag color="cyan">共 {scheduledTasksList.length} 项</Tag>
                    </Space>
                    <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddScheduledTask}>添加新定时任务</Button>
                  </div>
                }
                style={{ borderRadius: 8, border: "1px solid #edf1f7" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {scheduledTasksList.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: task.enabled ? "#fafbfd" : "#f5f5f5",
                        border: "1px solid #edf1f7", borderRadius: 6, padding: "8px 12px",
                        display: "grid", gridTemplateColumns: "70px 140px 1fr 60px 40px",
                        gap: 12, alignItems: "center"
                      }}
                    >
                      <Input size="small" value={task.time} onChange={(e) => handleUpdateScheduledTask(task.id, "time", e.target.value)} placeholder="07:30" />
                      <Input size="small" value={task.title} onChange={(e) => handleUpdateScheduledTask(task.id, "title", e.target.value)} placeholder="任务标题" />
                      <Input size="small" value={task.content} onChange={(e) => handleUpdateScheduledTask(task.id, "content", e.target.value)} placeholder="触达内容或说明" />
                      <Switch size="small" checked={task.enabled} onChange={(val) => handleUpdateScheduledTask(task.id, "enabled", val)} />
                      <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveScheduledTask(task.id)} disabled={scheduledTasksList.length <= 1} />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 子模块 3：知识库管理 */}
            {subEditTab === "knowledge" && (
              <Card title={<Space><BookOutlined style={{ color: "#722ed1" }} /><span style={{ fontSize: 14 }}>挂载知识库管理 (静态百科)</span></Space>} style={{ borderRadius: 8, border: "1px solid #edf1f7" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {knowledgeList.map((kb) => (
                    <div key={kb.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fbfaff", border: "1px solid #eedbff", borderRadius: 6 }}>
                      <Space size={10}>
                        <Checkbox checked={kb.bound} onChange={(e) => setKnowledgeList(knowledgeList.map(item => item.id === kb.id ? { ...item, bound: e.target.checked } : item))} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2329" }}>{kb.name}</div>
                          <Text type="secondary" style={{ fontSize: 11 }}>适用场景：{kb.scope} ({kb.size})</Text>
                        </div>
                      </Space>
                      <Tag color={kb.bound ? "purple" : "default"}>{kb.bound ? "已挂载 RAG 检索" : "未挂载"}</Tag>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 子模块 4：业务工具与技能 */}
            {subEditTab === "tools" && (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title={<Space><ToolOutlined style={{ color: "#fa8c16" }} /><span style={{ fontSize: 14 }}>授权业务工具 (系统动作与写库)</span></Space>} style={{ borderRadius: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {toolsList.map(t => (
                        <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#fffdfa", border: "1px solid #ffd591", borderRadius: 6 }}>
                          <div><div style={{ fontSize: 12, fontWeight: 600, color: "#1f2329" }}>{t.name}</div><Text type="secondary" style={{ fontSize: 11 }}>{t.desc}</Text></div>
                          <Switch size="small" checked={t.enabled} onChange={(val) => setToolsList(toolsList.map(item => item.id === t.id ? { ...item, enabled: val } : item))} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title={<Space><ApartmentOutlined style={{ color: "#f5222d" }} /><span style={{ fontSize: 14 }}>挂载复合技能 (高阶研判模型)</span></Space>} style={{ borderRadius: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {skillsList.map(sk => (
                        <div key={sk.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#fffdfd", border: "1px solid #ffccc7", borderRadius: 6 }}>
                          <div><div style={{ fontSize: 12, fontWeight: 600, color: "#1f2329" }}>{sk.name}</div><Text type="secondary" style={{ fontSize: 11 }}>{sk.desc}</Text></div>
                          <Switch size="small" checked={sk.enabled} onChange={(val) => setSkillsList(skillsList.map(item => item.id === sk.id ? { ...item, enabled: val } : item))} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            {/* 子模块 5：沙箱对练与发布 */}
            {subEditTab === "sandbox" && (
              <Row gutter={[16, 16]} style={{ display: "flex", alignItems: "stretch" }}>
                <Col xs={24} xl={14} style={{ display: "flex" }}>
                  <Card
                    title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Space><RocketOutlined style={{ color: "#fa541c" }} /><span style={{ fontSize: 14 }}>虚拟客户对抗沙箱模拟器</span></Space><Tag color="green">沙箱环境就绪</Tag></div>}
                    style={{ borderRadius: 8, width: "100%", display: "flex", flexDirection: "column" }}
                    styles={{ body: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px" } }}
                  >
                    <div>
                      <div style={{ background: "#f8fafd", border: "1px solid #edf1f7", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>选择对练虚拟客户画像：</Text>
                          <Select size="small" value={selectedPersonaId} onChange={setSelectedPersonaId} style={{ width: 220 }} options={virtualCustomerPersonas.map(p => ({ label: p.name, value: p.id }))} />
                        </div>
                        <div style={{ fontSize: 12, color: "#475467", lineHeight: 1.5 }}><strong>{currentPersona.tag}：</strong>{currentPersona.description}</div>
                      </div>

                      <div style={{ marginBottom: 10 }}>
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>点击快捷提问体验模型应答与分支命中：</Text>
                        <Space size={6} wrap orientation="horizontal">
                          {currentPersona.sampleQuestions.map((q) => (
                            <Tag key={q} style={{ cursor: "pointer", background: "#f2f4f7", border: "1px solid #d0d5dd", color: "#344054", fontSize: 12 }} onClick={() => handleSendTestMessage(q)}>
                              💬 {q.slice(0, 16)}...
                            </Tag>
                          ))}
                        </Space>
                      </div>

                      <Divider style={{ margin: "8px 0" }} />

                      <div style={{ height: 310, overflowY: "auto", padding: "8px 10px", background: "#f9fafb", borderRadius: 6, border: "1px solid #edf1f7", display: "flex", flexDirection: "column", gap: 10 }}>
                        {sandboxMessages.map((m, idx) => (
                          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Tag color={m.sender === "customer" ? "volcano" : "blue"} style={{ margin: 0, fontSize: 11 }}>{m.sender === "customer" ? currentPersona.name : agentName}</Tag>
                              <Text type="secondary" style={{ fontSize: 11 }}>{m.time}</Text>
                            </div>
                            <div style={{ background: m.sender === "customer" ? "#ffffff" : "#f0f7ff", border: m.sender === "customer" ? "1px solid #e5eaf2" : "1px solid #d0e4ff", borderRadius: 6, padding: "8px 12px", fontSize: 13, lineHeight: 1.6, color: "#1f2329", maxWidth: "96%" }}>
                              {m.text}
                            </div>
                            {m.decisionChain && (
                              <div style={{ background: "#f4f6fa", border: "1px dashed #d5deeb", borderRadius: 4, padding: "6px 10px", fontSize: 11, color: "#667085", lineHeight: 1.6, width: "96%" }}>
                                <div>🎯 <strong>命中分支：</strong>{m.decisionChain.matchedBranch}</div>
                                <div>🛡️ <strong>合规校验：</strong>{m.decisionChain.complianceChecked}</div>
                                <div>🎨 <strong>应用风格：</strong>{m.decisionChain.personaApplied}</div>
                              </div>
                            )}
                          </div>
                        ))}
                        {isSimulating && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#1890ff", fontSize: 12, padding: 8 }}>
                            <RobotOutlined spin /><span>阶段智能体正在根据 Prompt 规则推理生成回答...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <Input value={customTestInput} onChange={(e) => setCustomTestInput(e.target.value)} placeholder="输入自定义客户提问测试智能体回答..." onPressEnter={() => handleSendTestMessage()} />
                      <Button type="primary" icon={<SendOutlined />} onClick={() => handleSendTestMessage()} loading={isSimulating}>发送测试</Button>
                      <Tooltip title="清空沙箱聊天记录"><Button icon={<ClearOutlined />} onClick={() => setSandboxMessages([])} /></Tooltip>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} xl={10} style={{ display: "flex" }}>
                  <Card
                    title={<Space><SaveOutlined style={{ color: "#52c41a" }} /><span style={{ fontSize: 14 }}>生产发布控制台</span></Space>}
                    style={{ borderRadius: 8, width: "100%", display: "flex", flexDirection: "column" }}
                    styles={{ body: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px" } }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 14px", background: "#f6ffed", borderRadius: 8, border: "1px solid #b7eb8f" }}>
                        <Progress type="circle" percent={96} size={56} strokeColor="#52c41a" />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2329" }}>综合就绪度评估：96 分</div>
                          <Text type="secondary" style={{ fontSize: 12 }}>修改已生效，六要素拓扑完整，合规覆盖 100%</Text>
                        </div>
                      </div>

                      <div style={{ background: "#fafafa", borderRadius: 8, padding: "10px 12px", border: "1px solid #f0f0f0" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2329", marginBottom: 6 }}>📦 本次发布挂载拓扑清单：</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, color: "#595959" }}>
                          {[
                            { label: "目标阶段", val: activeTemplate.stage },
                            { label: "智能体名称", val: agentName },
                            { label: "定时任务", val: `已激活 ${scheduledTasksList.filter(t => t.enabled).length} 项定时主动触达` },
                            { label: "知识库挂载", val: `已绑定 ${knowledgeList.filter(k => k.bound).length} 份教研文档` },
                            { label: "工具调用权限", val: `已授权 ${toolsList.filter(t => t.enabled).length} 个 CRM 动作工具` }
                          ].map((item, idx) => (
                            <div key={idx}><CheckCircleOutlined style={{ color: "#52c41a", marginRight: 6 }} /><strong>{item.label}：</strong>{item.val}</div>
                          ))}
                        </div>
                      </div>

                      <div style={{ padding: "8px 10px", background: "#f0f5ff", borderRadius: 6, border: "1px solid #d6e4ff" }}>
                        <div style={{ fontSize: 12, color: "#1d39c4" }}>
                          🚀 发布后，该阶段智能体将即时接管<strong>企微所有处于该生命周期阶段的客户会话</strong>，销售人员企微侧边栏同步生效。
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                      <Button type="primary" size="large" icon={<RocketOutlined />} onClick={() => setIsPublishSuccessOpen(true)} style={{ background: "#52c41a", borderColor: "#52c41a" }}>
                        保存并一键发布至生产环境
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

          </div>
        )}

      </div>

      {/* AI 智能白话扩写弹窗 */}
      <Modal
        title={<Space><ThunderboltOutlined style={{ color: "#722ed1" }} /><span>AI 随身提示词架构师 · 白话智能扩写</span></Space>}
        open={isPolisherOpen}
        onCancel={() => setIsPolisherOpen(false)}
        onOk={handleRunPolisher}
        okText="一键结构化扩写"
        cancelText="取消"
        confirmLoading={isPolishing}
        width={560}
      >
        <div style={{ marginTop: 12 }}>
          <Paragraph type="secondary" style={{ fontSize: 13 }}>
            您只需要用口语输入这阶段想让 AI 做什么、语气偏向什么、针对什么情况回复，系统内置的 Prompt Meta-Agent 会自动为您编译出工业级提示词：
          </Paragraph>
          <TextArea
            rows={5}
            value={polisherInput}
            onChange={(e) => setPolisherInput(e.target.value)}
            placeholder="示例：我想让智能体在 Day1 上午主动问候家长，语气要温柔温和，别给压力，把今晚直播安排发给他们，同时探寻一下家庭最近核心困扰是什么。"
          />
        </div>
      </Modal>

      {/* 提示词健康度体检诊断报告弹窗 */}
      <Modal
        title="阶段智能体提示词健康度诊断报告"
        open={isHealthModalOpen}
        onCancel={() => setIsHealthModalOpen(false)}
        footer={[<Button key="ok" type="primary" onClick={() => setIsHealthModalOpen(false)}>我知道了</Button>]}
        width={560}
      >
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, padding: "12px 16px", background: "#f6ffed", borderRadius: 8, border: "1px solid #b7eb8f" }}>
            <Progress type="circle" percent={94} size={64} strokeColor="#52c41a" />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1f2329" }}>总体健康度评分：94 分 (优秀)</div>
              <Text type="secondary" style={{ fontSize: 12 }}>【19a】Day1 线上标准已完全满足生产上线合规与业务逻辑标准</Text>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <CheckCircleOutlined style={{ color: "#52c41a", marginTop: 3 }} />
              <div><strong>阶段目标完整：</strong>明确定义了破冰建信与痛点摸底，首日严禁报价。</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <CheckCircleOutlined style={{ color: "#52c41a", marginTop: 3 }} />
              <div><strong>定时任务完备：</strong>覆盖 07:30 至 21:30 全天关怀节点。</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <CheckCircleOutlined style={{ color: "#52c41a", marginTop: 3 }} />
              <div><strong>六要素分离彻底：</strong>课纲已转入知识库，画像打标调用工具，未给提示词造成负担。</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 发布成功通知弹窗 */}
      <Modal
        title="阶段智能体发布上线成功"
        open={isPublishSuccessOpen}
        onCancel={() => setIsPublishSuccessOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsPublishSuccessOpen(false)}>留在当前页</Button>,
          <Button key="submit" type="primary" onClick={() => setIsPublishSuccessOpen(false)}>完成</Button>
        ]}
        width={500}
      >
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a", marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1f2329", marginBottom: 6 }}>{agentName} 已成功上线！</div>
          <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
            阶段配置已推送到生产运行时，当前企微该阶段的客户在收到消息时将由该阶段智能体提供辅助决策。
          </Paragraph>
          <div style={{ background: "#f8fafd", border: "1px solid #edf1f7", borderRadius: 8, padding: "10px 14px", textAlign: "left", fontSize: 12, color: "#595959" }}>
            <div>• <strong>当前接管阶段：</strong>{activeTemplate.stage}</div>
            <div>• <strong>同步覆盖账号：</strong>10 位在职企微销售（刘俊彤、严闽龙、吴尚宇等）</div>
            <div>• <strong>版本编号：</strong>v2.4.{Date.now().toString().slice(-4)}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
