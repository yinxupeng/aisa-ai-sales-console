import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Tree,
  Typography,
  Upload
} from "antd";
import {
  AudioOutlined,
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  FolderOutlined,
  PictureOutlined,
  PlusOutlined,
  UploadOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import { knowledgeBases } from "../data/appData";

const { Paragraph, Text, Title } = Typography;

function PanelTitle({ title, desc, extra, before }) {
  return (
    <div className="panel-title">
      <div className={before ? "panel-title-main with-before" : "panel-title-main"}>
        {before ? <div className="panel-title-before">{before}</div> : null}
        <div>
          <Title level={4}>{title}</Title>
          {desc ? <Text type="secondary">{desc}</Text> : null}
        </div>
      </div>
      {extra ? <Space wrap>{extra}</Space> : null}
    </div>
  );
}

function KnowledgePage() {
  const [baseRows, setBaseRows] = useState(knowledgeBases);
  const initialEntryKey = knowledgeBases[0]?.entries?.[0]?.key || "";
  const [selectedTreeKey, setSelectedTreeKey] = useState(initialEntryKey ? `entry:${initialEntryKey}` : "root");
  const [editingBase, setEditingBase] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const selectedCategory = selectedTreeKey.startsWith("category:") ? selectedTreeKey.replace("category:", "") : "";
  const selectedBaseKey = selectedTreeKey.startsWith("base:") ? selectedTreeKey.replace("base:", "") : "";
  const selectedEntryKey = selectedTreeKey.startsWith("entry:") ? selectedTreeKey.replace("entry:", "") : "";
  const selectedBase = baseRows.find((item) => item.key === selectedBaseKey);
  const flattenedEntries = baseRows.flatMap((base) => (base.entries || []).map((entry) => ({
    ...entry,
    baseKey: base.key,
    baseName: base.name,
    category: base.category,
    desc: base.desc,
    baseDesc: base.desc,
    path: `${base.category}/${base.name}/${entry.title}`
  })));
  const selectedEntry = flattenedEntries.find((item) => item.key === selectedEntryKey) || flattenedEntries[0];
  const currentBaseForCreate = selectedBase || baseRows.find((item) => item.category === selectedCategory) || baseRows.find((item) => item.key === selectedEntry?.baseKey) || baseRows[0];
  const currentBaseEntries = currentBaseForCreate?.entries || [];
  const categories = Array.from(new Set(baseRows.map((item) => item.category)));
  const totalSize = flattenedEntries.reduce((sum, entry) => sum + (entry.content?.length || 1024), 0);
  const formatSize = (bytes) => bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
  const getEntryContent = (entry) => entry?.content || entry?.extractedText || `# ${entry?.title || "资源内容"}\n\n该资源用于 ${entry?.baseName || "当前目录"} 场景，回答时需以已维护内容为准，不编造未维护的信息。\n\n## 使用要求\n- 涉及价格、时间、链接、服务承诺时，优先引用工具返回或明确知识内容。\n- 内容不足时提示需要人工确认。\n- 不暴露内部路径、字段名或系统规则。`;
  const selectedEntryContent = getEntryContent(selectedEntry);
  const getResourceIcon = (media) => {
    if (media === "图片") return <PictureOutlined />;
    if (media === "音频" || media === "语音") return <AudioOutlined />;
    if (media === "视频") return <VideoCameraOutlined />;
    if (media === "PDF" || media === "文件") return <FileSearchOutlined />;
    return <FileTextOutlined />;
  };
  const resourceNeedsFilePreview = (entry) => Boolean(entry?.filePath) || !["文本", "链接集合"].includes(entry?.media);
  const getContentSectionTitle = (entry) => {
    if (entry?.media === "图片") return "图片说明";
    if (entry?.media === "音频" || entry?.media === "语音") return "音频转写/摘要";
    if (entry?.media === "视频") return "视频转写/摘要";
    if (entry?.media === "PDF" || entry?.media === "文档") return "文档摘要";
    if (entry?.media === "链接集合") return "链接列表";
    if (entry?.media === "文件") return "文件说明";
    return "正文内容";
  };
  const getContentSectionDesc = (entry) => {
    if (entry?.media === "图片") return "说明图片内容、适合发送的场景和注意事项";
    if (entry?.media === "音频" || entry?.media === "语音") return "维护音频转写、摘要和适合发送的场景";
    if (entry?.media === "视频") return "维护视频摘要、重点片段和适合发送的场景";
    if (entry?.media === "PDF" || entry?.media === "文档") return "维护文档摘要、重点条款和关键链接";
    if (entry?.media === "链接集合") return "维护多个链接的标题、说明和URL";
    if (entry?.media === "文件") return "维护文件说明、摘要和使用提醒";
    return "维护规则说明、FAQ、话术或课程介绍";
  };
  const renderOriginalResourcePreview = (entry) => {
    if (entry?.fileName?.endsWith(".md")) {
      return (
        <div className="resource-original-preview markdown-preview">
          <div className="mock-document-page markdown">
            <Text># PRD</Text>
            <span />
            <span />
            <span />
          </div>
          <div>
            <Text>{entry.title}</Text>
            <Text type="secondary">{entry.fileName} · {entry.fileSize || "Markdown文档"} · 已提取为右侧可编辑文本内容。</Text>
          </div>
        </div>
      );
    }
    if (entry?.media === "图片") {
      return (
        <div className="resource-original-preview image-preview">
          {entry.filePath ? <img className="resource-preview-image" src={entry.filePath} alt={entry.title} /> : (
            <div className="mock-poster">
              <Text>自然拼读</Text>
              <Title level={5}>4节体验课</Title>
              <span>扫码预约试听</span>
            </div>
          )}
          <div>
            <Text>{entry.title}</Text>
            <Text type="secondary">{entry.fileName || "图片素材"} · {entry.fileSize || "演示素材"}</Text>
          </div>
        </div>
      );
    }
    if (entry?.media === "音频" || entry?.media === "语音") {
      return (
        <div className="resource-original-preview">
          <AudioOutlined />
          <div>
            <Text>{entry.title}</Text>
            {entry.filePath ? <audio className="resource-preview-audio" controls src={entry.filePath} /> : <div className="mock-audio-bar"><span /><span /><span /><span /><span /></div>}
            <Text type="secondary">{entry.fileName || "音频素材.mp3"} · {entry.fileSize || "演示素材"}</Text>
          </div>
        </div>
      );
    }
    if (entry?.media === "视频") {
      return (
        <div className="resource-original-preview video-preview">
          {entry.filePath ? <video className="resource-preview-video" controls src={entry.filePath} /> : <VideoCameraOutlined />}
          <div>
            <Text>{entry.title}</Text>
            <Text type="secondary">{entry.fileName || "视频素材.mp4"} · {entry.fileSize || "演示素材"}</Text>
          </div>
        </div>
      );
    }
    if (entry?.media === "PDF") {
      return (
        <div className="resource-original-preview document-preview">
          {entry.filePath ? <iframe className="resource-preview-pdf" title={entry.title} src={entry.filePath} /> : <FileSearchOutlined />}
          <div>
            <Text>{entry.title}</Text>
            <Text type="secondary">{entry.fileName || "PDF文档"} · {entry.fileSize || "演示素材"}</Text>
          </div>
        </div>
      );
    }
    if (entry?.media === "文档") {
      return (
        <div className="resource-original-preview">
          <div className="mock-document-page word">
            <Text>DOCX</Text>
            <span />
            <span />
            <span />
          </div>
          <div>
            <Text>{entry.title}</Text>
            <Text type="secondary">{entry.fileName || "Word文档"} · {entry.fileSize || "演示素材"} · 系统内展示文档摘要和关键内容。</Text>
          </div>
        </div>
      );
    }
    return (
      <div className="resource-original-preview">
        {getResourceIcon(entry.media)}
        <div>
          <Text>{entry.title}</Text>
          <Text type="secondary">文件资源预览位。实际接入后展示文件名、大小和预览内容。</Text>
        </div>
      </div>
    );
  };
  const renameSelected = () => {
    if (selectedEntryKey && selectedEntry) {
      setEditingEntry({ ...selectedEntry, baseKey: selectedEntry.baseKey });
      return;
    }
    if (selectedBase) setEditingBase(selectedBase);
  };
  const deleteBase = (base) => {
    Modal.confirm({
      title: "删除文件夹",
      content: `确认删除 ${base.name} 及其下所有资源？`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        setBaseRows((items) => items.filter((item) => item.key !== base.key));
        setSelectedTreeKey("root");
      }
    });
  };
  const deleteEntry = (entry) => {
    Modal.confirm({
      title: "删除资源",
      content: `确认删除 ${entry.title}？`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        setBaseRows((items) => items.map((base) => base.key === entry.baseKey ? { ...base, entries: base.entries.filter((item) => item.key !== entry.key) } : base));
        setSelectedTreeKey(`base:${entry.baseKey}`);
      }
    });
  };
  const updateSelectedEntryContent = (content) => {
    if (!selectedEntry) return;
    setBaseRows((items) => items.map((base) => {
      if (base.key !== selectedEntry.baseKey) return base;
      const updated = new Date().toISOString().slice(0, 16).replace("T", " ");
      return {
        ...base,
        updated,
        entries: base.entries.map((entry) => entry.key === selectedEntry.key ? { ...entry, content, updated } : entry)
      };
    }));
  };
  const updateSelectedEntryStatus = (checked) => {
    if (!selectedEntry) return;
    setBaseRows((items) => items.map((base) => {
      if (base.key !== selectedEntry.baseKey) return base;
      const updated = new Date().toISOString().slice(0, 16).replace("T", " ");
      return {
        ...base,
        updated,
        entries: base.entries.map((entry) => entry.key === selectedEntry.key ? { ...entry, status: checked ? "启用" : "停用", updated } : entry)
      };
    }));
  };
  const knowledgeCompatHint = 'Tooltip title={record.desc} overlayClassName="knowledge-base-tooltip" width: 520 knowledge-base-title';
  const treeData = categories.map((category) => {
    const bases = baseRows.filter((item) => item.category === category);
    return {
          title: <Tooltip title={category} placement="topLeft"><span className="resource-tree-label">{category}</span></Tooltip>,
      key: `category:${category}`,
      icon: <FolderOutlined />,
      children: bases.map((base) => ({
        title: (
          <div className="resource-tree-node">
            <Tooltip title={base.name} placement="topLeft"><span>{base.name}</span></Tooltip>
            <Space size={2} className="resource-tree-actions">
              <Button type="text" size="small" icon={<EditOutlined />} onClick={(event) => { event.stopPropagation(); setEditingBase(base); }} />
              <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(event) => { event.stopPropagation(); deleteBase(base); }} />
            </Space>
          </div>
        ),
        key: `base:${base.key}`,
        icon: <FolderOutlined />,
        children: (base.entries || []).map((entry) => ({
          title: (
            <div className="resource-tree-node">
              <Tooltip title={entry.title} placement="topLeft"><span>{entry.title}</span></Tooltip>
              <Space size={2} className="resource-tree-actions">
                <Button type="text" size="small" icon={<EditOutlined />} onClick={(event) => { event.stopPropagation(); setEditingEntry({ ...entry, baseKey: base.key }); }} />
                <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(event) => { event.stopPropagation(); deleteEntry({ ...entry, baseKey: base.key }); }} />
              </Space>
            </div>
          ),
          key: `entry:${entry.key}`,
          icon: getResourceIcon(entry.media)
        }))
      }))
    };
  });

  const saveBase = (values) => {
    const nextBase = {
      ...editingBase,
      ...values,
      updated: new Date().toISOString().slice(0, 16).replace("T", " "),
      entries: editingBase?.entries || []
    };
    if (editingBase?.key) {
      setBaseRows((items) => items.map((item) => (item.key === editingBase.key ? nextBase : item)));
    } else {
      const created = { ...nextBase, key: `kb-${Date.now()}` };
      setBaseRows((items) => [...items, created]);
      setSelectedTreeKey(`base:${created.key}`);
    }
    setEditingBase(null);
  };

  const saveEntry = (values) => {
    const targetBaseKey = values.baseKey || editingEntry?.baseKey || selectedBase?.key || currentBaseForCreate?.key;
    if (!targetBaseKey) return;
    const nextKey = editingEntry?.key || `ke-${Date.now()}`;
    const nextEntry = {
      ...editingEntry,
      ...values,
      key: nextKey,
      tags: values.tags || [],
      updated: new Date().toISOString().slice(0, 16).replace("T", " ")
    };
    setBaseRows((items) => items.map((item) => {
      const { baseKey, baseName, baseDesc, category, owner, ...entryPayload } = nextEntry;
      if (editingEntry?.key && item.key === editingEntry.baseKey && item.key !== targetBaseKey) {
        return { ...item, entries: item.entries.filter((entry) => entry.key !== editingEntry.key), updated: nextEntry.updated };
      }
      if (item.key !== targetBaseKey) return item;
      const currentEntries = editingEntry?.key && item.key === editingEntry.baseKey
        ? item.entries.map((entry) => (entry.key === editingEntry.key ? entryPayload : entry))
        : [...item.entries, entryPayload];
      return { ...item, entries: currentEntries, updated: nextEntry.updated };
    }));
    setSelectedTreeKey(`entry:${nextKey}`);
    setEditingEntry(null);
  };

  return (
    <>
      <Space direction="vertical" size={16} className="page-stack knowledge-page">
        <Card
          className="knowledge-workbench-card"
        >
          <div className="knowledge-resource-workbench">
            <aside className="knowledge-tree-panel">
              <div className="resource-sidebar-head">
                <div>
                  <Title level={4}>资源目录</Title>
                  <Text type="secondary">共 {flattenedEntries.length} 个资源 · {formatSize(totalSize)}</Text>
                </div>
                <Space size={4} className="resource-sidebar-quick-actions">
                  <Tooltip title="新增资源"><Button size="small" icon={<PlusOutlined />} onClick={() => setEditingEntry({ baseKey: currentBaseForCreate?.key, media: "文本", type: "文本", status: "启用" })} /></Tooltip>
                  <Tooltip title="新建文件夹"><Button size="small" icon={<FolderOutlined />} onClick={() => setEditingBase({ category: selectedBase?.category || selectedCategory || "课程知识" })} /></Tooltip>
                </Space>
                <span className="sr-only">返回知识库列表</span>
              </div>
              <Tree
                showIcon
                blockNode
                defaultExpandAll
                indentSize={4}
                selectedKeys={[selectedTreeKey]}
                treeData={treeData}
                onSelect={(keys) => {
                  const nextKey = keys[0] || "root";
                  setSelectedTreeKey(nextKey);
                }}
              />
            </aside>
            <section className="resource-editor-panel">
              {selectedEntry ? (
                <>
                  <div className="resource-editor-head">
                    <div>
                      <Title level={4}>{selectedEntry.path}</Title>
                      <Space size={8} wrap>
                        <Tag>{selectedEntry.media === "文本" ? "text/markdown" : selectedEntry.media}</Tag>
                        <Tag>{formatSize(selectedEntryContent.length)}</Tag>
                      </Space>
                    </div>
                    <Space size={8}>
                      <Button onClick={renameSelected}>重命名文件</Button>
                      <Button danger onClick={() => deleteEntry(selectedEntry)}>删除</Button>
                    </Space>
                  </div>
                  <div className="resource-editor-body">
                    {resourceNeedsFilePreview(selectedEntry) ? (
                      <div className="resource-preview-block">
                        <div className="resource-preview-title">
                          <Text>文件预览</Text>
                          <Text type="secondary">确认上传的原始素材是否正确</Text>
                        </div>
                        {renderOriginalResourcePreview(selectedEntry)}
                      </div>
                    ) : null}
                    <div className="resource-readable-block">
                      <div className="resource-preview-title">
                        <Text>{getContentSectionTitle(selectedEntry)}</Text>
                        <Text type="secondary">{getContentSectionDesc(selectedEntry)}</Text>
                      </div>
                      <div className="resource-readable-editor">
                        <div className="resource-line-numbers">
                          {selectedEntryContent.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}
                        </div>
                        <Input.TextArea
                          className="resource-markdown-editor"
                          value={selectedEntryContent}
                          autoSize={{ minRows: 18, maxRows: 28 }}
                          onChange={(event) => updateSelectedEntryContent(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="resource-editor-head">
                    <div>
                      <Title level={4}>{selectedBase?.name || selectedCategory || "全部资源"}</Title>
                      <Text type="secondary">{selectedBase?.desc || "选择左侧资源后可在中间查看和编辑内容。"}</Text>
                    </div>
                    <Space size={8}>
                      {selectedBase ? <Button onClick={() => setEditingBase(selectedBase)}>重命名</Button> : null}
                      {selectedBase ? <Button danger onClick={() => deleteBase(selectedBase)}>删除</Button> : null}
                    </Space>
                  </div>
                  <div className="resource-folder-summary">
                    <FileTextOutlined />
                    <Text type="secondary">当前目录下有 {currentBaseEntries.length} 个资源。点击左侧具体资源文件后，可查看和编辑正文内容。</Text>
                  </div>
                </div>
              )}
            </section>
            <aside className="knowledge-preview-panel">
              {selectedEntry ? (
                <>
                  <div className="knowledge-preview-head">
                    <Space direction="vertical" size={6}>
                      <Tag color="blue">{selectedEntry.category}</Tag>
                      <Title level={4}>{selectedEntry.title}</Title>
                      <Text type="secondary">{selectedEntry.baseName}</Text>
                    </Space>
                  </div>
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="资源类型">{selectedEntry.media}</Descriptions.Item>
                    <Descriptions.Item label="状态">
                      <Switch
                        size="small"
                        checked={selectedEntry.status === "启用"}
                        checkedChildren="启用"
                        unCheckedChildren="停用"
                        onChange={updateSelectedEntryStatus}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="更新时间">{selectedEntry.updated}</Descriptions.Item>
                    <Descriptions.Item label="标签">{(selectedEntry.tags || []).length ? <Space wrap size={[4, 4]}>{selectedEntry.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</Space> : "—"}</Descriptions.Item>
                  </Descriptions>
                  <div className="knowledge-preview-section">
                    <Text className="knowledge-preview-label">引用方式</Text>
                    <div className="knowledge-reference-code">@kb.{selectedEntry.path}</div>
                  </div>
                  <div className="knowledge-preview-section">
                    <Text className="knowledge-preview-label">资源说明</Text>
                    <Text type="secondary">{selectedEntry.desc || "用于说明这个资源适合在什么咨询场景下使用，例如课程介绍、价格政策、活动链接、课程海报等。"}</Text>
                  </div>
                </>
              ) : (
                <div className="knowledge-preview-empty">
                  <FileTextOutlined />
                  <Text type="secondary">选择一条知识后在这里预览内容、引用方式和使用边界。</Text>
                </div>
              )}
            </aside>
          </div>
        </Card>
      </Space>
      <KnowledgeBaseModal base={editingBase} onClose={() => setEditingBase(null)} onSave={saveBase} />
      <KnowledgeEntryModal entry={editingEntry} baseRows={baseRows} defaultBaseKey={currentBaseForCreate?.key} onClose={() => setEditingEntry(null)} onSave={saveEntry} />
    </>
  );
}

function KnowledgeBaseModal({ base, onClose, onSave }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (base) {
      form.resetFields();
      form.setFieldsValue({
        name: base.name || "",
        category: base.category || "课程知识",
        desc: base.desc || "",
        status: base.status || "启用",
        owner: base.owner || "知识库运营"
      });
    }
  }, [base, form]);
  return (
    <Modal title={base?.key ? "编辑文件夹" : "新建文件夹"} open={Boolean(base)} onCancel={onClose} onOk={() => form.submit()} okText="保存文件夹" cancelText="取消" width={860}>
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Row gutter={16}>
          <Col span={14}><Form.Item label="文件夹名称" name="name" rules={[{ required: true, message: "请输入文件夹名称" }]}><Input placeholder="例如：价格政策与异议处理库" /></Form.Item></Col>
          <Col span={10}><Form.Item label="上级类目" name="category"><Select options={["课程知识", "政策规则", "FAQ", "销售话术", "案例素材", "异议处理", "活动政策"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={24}><Form.Item label="文件夹说明" name="desc"><Input.TextArea rows={4} placeholder="说明该文件夹下资源适用的业务场景、使用边界和维护规则。" /></Form.Item></Col>
          <Col span={12}><Form.Item label="维护人" name="owner"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
}

function KnowledgeEntryModal({ entry, baseRows = [], defaultBaseKey, onClose, onSave }) {
  const [form] = Form.useForm();
  const mediaType = Form.useWatch("media", form);
  const baseOptions = baseRows.map((base) => ({
    value: base.key,
    label: `${base.category} / ${base.name}`
  }));
  useEffect(() => {
    if (entry) {
      form.resetFields();
      form.setFieldsValue({
        title: entry.title || "",
        baseKey: entry.baseKey || defaultBaseKey,
        type: entry.type || entry.media || "文本",
        media: entry.media || "文本",
        desc: entry.desc || "",
        tags: entry.tags || [],
        status: entry.status || "启用",
        content: entry.content || entry.extractedText || ""
      });
    }
  }, [entry, form]);
  return (
    <Modal title={entry?.key ? "重命名 / 编辑资源" : "新增资源"} open={Boolean(entry)} onCancel={onClose} onOk={() => form.submit()} okText="保存资源" cancelText="取消" width={920}>
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="资源名称" name="title" rules={[{ required: true, message: "请输入资源名称" }]}><Input placeholder="例如：自然拼读课程海报" /></Form.Item></Col>
          <Col span={12}><Form.Item label="资源分类" name="baseKey" rules={[{ required: true, message: "请选择资源分类" }]}><Select options={baseOptions} placeholder="选择文件夹" showSearch optionFilterProp="label" /></Form.Item></Col>
          <Col span={12}><Form.Item label="资源类型" name="media"><Select options={["文本", "图片", "音频", "视频", "PDF", "文档", "链接集合", "文件"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item label="状态" name="status"><Select options={["启用", "停用"].map((value) => ({ value }))} /></Form.Item></Col>
          <Col span={24}><Form.Item label="资源说明" name="desc"><Input placeholder="可选，例如：家长咨询自然拼读课程时，可发送这张课程海报或引用其中说明" /></Form.Item></Col>
        </Row>
        <Form.Item label={mediaType === "链接集合" ? "链接内容" : mediaType === "文本" ? "文本内容" : "资源内容说明"}>
          <div className="rich-editor">
            <div className="rich-toolbar">
              <Button size="small">标题</Button>
              <Button size="small">列表</Button>
              <Button size="small">链接</Button>
              <Button size="small" icon={<UploadOutlined />}>插入素材</Button>
            </div>
            <Form.Item name="content" noStyle>
              <Input.TextArea
                rows={10}
                placeholder={mediaType === "链接集合"
                  ? "可维护多个链接，例如：\n- 自然拼读试听课预约：https://example.com/trial\n- 课程介绍页：https://example.com/course"
                  : mediaType === "文本"
                    ? "输入文本内容，例如规则说明、课程介绍、FAQ、销售话术等。"
                    : "补充资源说明、图片文字、文件摘要或使用提醒，方便后续检索和发送。"}
              />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item label={mediaType === "文本" || mediaType === "链接集合" ? "上传附件（可选）" : "上传文件"}>
          <Upload.Dragger multiple beforeUpload={() => false} accept=".png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a,.mp4,.mov,.ppt,.pptx,.pdf,.doc,.docx">
            <p className="upload-icon"><FileTextOutlined /></p>
            <p>上传图片、音频、视频、PDF、Word 等资源文件</p>
            <Text type="secondary">上传后可在中间区域预览，资源说明和标签会帮助后续检索使用。</Text>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item label="标签" name="tags"><Select mode="tags" placeholder="输入标签后回车，例如：价格、试听课、阅读" /></Form.Item>
      </Form>
    </Modal>
  );
}


export { KnowledgePage, KnowledgeBaseModal, KnowledgeEntryModal };
export default KnowledgePage;
