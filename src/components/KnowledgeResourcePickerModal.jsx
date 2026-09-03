import React, { useState, useEffect } from "react";
import { Button, Descriptions, Modal, Space, Tag, Tooltip, Tree, Typography } from "antd";
import { FileTextOutlined, FolderOutlined } from "@ant-design/icons";
import { knowledgeBases } from "../data/appData";

const { Text, Title } = Typography;

function statusTag(status) {
  if (status === "启用" || status === "已连接" || status === true) return <Tag color="success">启用</Tag>;
  if (status === "停用" || status === false) return <Tag>停用</Tag>;
  return <Tag color="processing">{status}</Tag>;
}

export const buildKnowledgeResourceRows = () => knowledgeBases.flatMap((base) => [
  {
    key: `base:${base.key}`,
    name: base.name,
    path: `${base.category} / ${base.name}`,
    relationType: "文件夹",
    contentType: "目录",
    status: base.status,
    desc: base.desc,
    category: base.category,
    updatedAt: base.updated,
    entries: base.entries || []
  },
  ...(base.entries || []).map((entry) => ({
    key: `entry:${entry.key}`,
    name: entry.title,
    path: `${base.category} / ${base.name} / ${entry.title}`,
    relationType: "资源",
    contentType: entry.media === "文本" ? "text/markdown" : entry.media,
    knowledgeType: entry.type,
    status: entry.status,
    desc: entry.content || `${entry.title}：用于 ${base.name} 场景，回答时需以知识库内容为准，不编造未维护的信息。`,
    category: base.category,
    updatedAt: base.updated
  }))
]);

export const getKnowledgeBaseKeysFromResources = (resourceKeys = []) => Array.from(new Set(resourceKeys
  .map((key) => {
    if (key.startsWith("base:")) return key.replace("base:", "");
    if (!key.startsWith("entry:")) return null;
    const entryKey = key.replace("entry:", "");
    const base = knowledgeBases.find((item) => (item.entries || []).some((entry) => entry.key === entryKey));
    return base?.key || null;
  })
  .filter(Boolean)));

export function KnowledgeResourcePickerModal({ open, selectedKeys = [], onSelectedChange, onClose, onOk }) {
  const resourceRows = buildKnowledgeResourceRows();
  const [activeKey, setActiveKey] = useState("");
  useEffect(() => {
    if (!open) return;
    setActiveKey(selectedKeys[0] || resourceRows[0]?.key || "");
  }, [open]);
  const currentResource = resourceRows.find((item) => item.key === activeKey) || resourceRows[0];
  const selectedResourceRows = resourceRows.filter((item) => selectedKeys.includes(item.key));
  const toggleResource = (key) => {
    onSelectedChange?.(
      selectedKeys.includes(key)
        ? selectedKeys.filter((item) => item !== key)
        : [...selectedKeys, key]
    );
  };
  const treeData = Array.from(new Set(knowledgeBases.map((item) => item.category))).map((category) => {
    const bases = knowledgeBases.filter((item) => item.category === category);
    return {
      title: <Tooltip title={category} placement="topLeft"><span className="resource-tree-label">{category}</span></Tooltip>,
      key: `category:${category}`,
      icon: <FolderOutlined />,
      selectable: false,
      disableCheckbox: true,
      children: bases.map((base) => ({
        title: <Tooltip title={base.name} placement="topLeft"><span className="resource-tree-label">{base.name}</span></Tooltip>,
        key: `base:${base.key}`,
        icon: <FolderOutlined />,
        children: (base.entries || []).map((entry) => ({
          title: <Tooltip title={entry.title} placement="topLeft"><span className="resource-tree-label">{entry.title}</span></Tooltip>,
          key: `entry:${entry.key}`,
          icon: <FileTextOutlined />
        }))
      }))
    };
  });
  return (
    <Modal
      title="选择知识资源"
      open={open}
      width={1080}
      onCancel={onClose}
      onOk={onOk}
      okText="确认关联"
      cancelText="取消"
      okButtonProps={{ disabled: !selectedKeys.length }}
      className="knowledge-resource-picker-modal"
    >
      <div className="knowledge-resource-picker">
        <aside className="knowledge-picker-tree">
          <div className="knowledge-picker-title-row">
            <Text className="knowledge-picker-title">资源目录</Text>
            <Tag color="blue">已选 {selectedKeys.length}</Tag>
          </div>
          <Tree
            showIcon
            checkable
            checkStrictly
            blockNode
            defaultExpandAll
            indentSize={4}
            selectedKeys={currentResource ? [currentResource.key] : []}
            checkedKeys={{ checked: selectedKeys, halfChecked: [] }}
            treeData={treeData}
            onSelect={(keys) => {
              const nextKey = keys[0];
              if (nextKey) setActiveKey(nextKey);
            }}
            onCheck={(checkedKeysValue, info) => {
              const nextCheckedKeys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked;
              onSelectedChange?.(nextCheckedKeys.filter((key) => !String(key).startsWith("category:")));
              if (info?.node?.key && !String(info.node.key).startsWith("category:")) setActiveKey(info.node.key);
            }}
          />
        </aside>
        <section className="knowledge-picker-preview">
          <div className="knowledge-picker-preview-head">
            <Title level={4}>{currentResource?.name || "未选择资源"}</Title>
            <Space size={6} wrap>
              {currentResource ? <Tag color={currentResource.relationType === "文件夹" ? "processing" : "blue"}>{currentResource.relationType}</Tag> : null}
              {currentResource ? <Tag>{currentResource.contentType}</Tag> : null}
              {currentResource && selectedKeys.includes(currentResource.key) ? <Tag color="success">已选</Tag> : null}
            </Space>
          </div>
          <div className="knowledge-picker-content">
            {currentResource?.desc || "选择左侧文件夹或资源后，可在这里预览内容。"}
          </div>
        </section>
        <aside className="knowledge-picker-rule">
          <Descriptions size="small" column={1} bordered>
            <Descriptions.Item label="资源路径">{currentResource?.path || "-"}</Descriptions.Item>
            <Descriptions.Item label="关联类型">{currentResource?.relationType || "-"}</Descriptions.Item>
            <Descriptions.Item label="状态">{currentResource ? statusTag(currentResource.status) : "-"}</Descriptions.Item>
          </Descriptions>
          <div className="knowledge-preview-section">
            <Text className="knowledge-preview-label">引用方式</Text>
            <div className="knowledge-reference-code">@kb.{currentResource?.path || "请选择资源"}</div>
          </div>
          <div className="knowledge-preview-section">
            <Text className="knowledge-preview-label">资源规则</Text>
            <Text type="secondary">关联文件夹表示 Skill 可引用目录下全部资源；关联具体资源表示只引用该文件内容。</Text>
          </div>
          <div className="knowledge-preview-section">
            <Text className="knowledge-preview-label">当前资源</Text>
            <Button block size="small" type={currentResource && selectedKeys.includes(currentResource.key) ? "default" : "primary"} disabled={!currentResource} onClick={() => currentResource && toggleResource(currentResource.key)}>
              {currentResource && selectedKeys.includes(currentResource.key) ? "移出已选" : "加入已选"}
            </Button>
          </div>
          <div className="knowledge-preview-section">
            <Text className="knowledge-preview-label">已选资源</Text>
            <div className="knowledge-selected-list">
              {selectedResourceRows.length ? selectedResourceRows.map((item) => (
                <Tag key={item.key} closable onClose={(event) => {
                  event.preventDefault();
                  toggleResource(item.key);
                }}>{item.name}</Tag>
              )) : <Text type="secondary">暂无已选资源</Text>}
            </div>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

export default KnowledgeResourcePickerModal;
