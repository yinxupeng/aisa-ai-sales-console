import React from "react";
import { AlertOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Modal, Radio, Space, Tag, Typography } from "antd";
import { getTagDisplayLabel, isAiGeneratedTag, tagSelectionGroups } from "../data/appData";

const { Text } = Typography;

function CommonTagSelectButton({ value = [], placeholder, onClick, onChange, disabled = false }) {
  const onTagRemove = (event, tagValue) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    onChange?.(value.filter((item) => item !== tagValue));
  };
  return (
    <Button block className="common-tag-select-control mass-tag-select-control" onClick={onClick} disabled={disabled}>
      {value.length ? (
        <Space wrap size={[6, 4]}>
          {value.map((tag) => (
            <Tag
              className={isAiGeneratedTag(tag) ? "customer-selected-ai-tag" : "customer-selected-tag"}
              key={tag}
              closable={Boolean(onChange) && !disabled}
              onClose={(event) => onTagRemove(event, tag)}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {getTagDisplayLabel(tag)}
            </Tag>
          ))}
        </Space>
      ) : (
        <Text type="secondary">{placeholder}</Text>
      )}
    </Button>
  );
}

function CommonTagPickerModal({
  open,
  title,
  selected = [],
  keyword = "",
  rule = "以下标签满足其一",
  ruleOptions = ["以下标签满足其一", "以下标签同时满足", "无任何标签"],
  tip = "标签来自统一标签库，AI自动打标的标签会显示（AI）标识。",
  onKeywordChange,
  onRuleChange,
  onSelectedChange,
  onOk,
  onCancel
}) {
  const disabled = rule === "无任何标签";
  const toggleTag = (tagValue) => {
    onSelectedChange?.(
      selected.includes(tagValue)
        ? selected.filter((value) => value !== tagValue)
        : [...selected, tagValue]
    );
  };
  const updateGroup = (groupTags, checked) => {
    const groupValues = groupTags.map((tag) => tag.value);
    const nextSelected = checked
      ? Array.from(new Set([...selected, ...groupValues]))
      : selected.filter((value) => !groupValues.includes(value));
    onSelectedChange?.(nextSelected);
  };
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="确定"
      cancelText="取消"
      width={760}
      className="common-tag-picker-modal mass-tag-picker-modal"
    >
      <div className="mass-tag-picker-tip"><AlertOutlined />{tip}</div>
      <Input.Search
        placeholder="请输入要查找的标签或标签组"
        allowClear
        value={keyword}
        onChange={(event) => onKeywordChange?.(event.target.value)}
        className="mass-tag-picker-search"
      />
      <div className="mass-tag-picker-rule">
        <Text>筛选：</Text>
        <Radio.Group
          value={rule}
          options={ruleOptions.map((value) => ({ value, label: value }))}
          onChange={(event) => {
            const nextRule = event.target.value;
            onRuleChange?.(nextRule);
            if (nextRule === "无任何标签") onSelectedChange?.([]);
          }}
        />
      </div>
      <div className="mass-tag-picker-list">
        {tagSelectionGroups
          .map((group) => ({
            ...group,
            tags: group.tags.filter((tag) => {
              const keywordText = keyword.trim();
              return !keywordText || group.name.includes(keywordText) || tag.label.includes(keywordText) || tag.value.includes(keywordText);
            })
          }))
          .filter((group) => group.tags.length)
          .map((group) => {
            const allChecked = group.tags.every((tag) => selected.includes(tag.value));
            return (
              <div className="mass-tag-picker-group" key={group.name}>
                <div className="mass-tag-picker-group-head">
                  <Text>{group.name} <Text type="secondary">（{group.tags.length}）</Text></Text>
                  <Checkbox checked={allChecked} disabled={disabled} onChange={(event) => updateGroup(group.tags, event.target.checked)} />
                </div>
                <Space wrap size={[10, 10]}>
                  {group.tags.map((tag) => {
                    const checked = selected.includes(tag.value);
                    return (
                      <Button
                        key={tag.value}
                        disabled={disabled}
                        type={checked ? "primary" : "default"}
                        ghost={checked}
                        className="mass-tag-picker-tag"
                        onClick={() => toggleTag(tag.value)}
                      >
                        {tag.label}
                      </Button>
                    );
                  })}
                </Space>
              </div>
            );
          })}
      </div>
      <div className="mass-tag-picker-footer">
        <Text type="secondary">已选：</Text>
        <Space wrap size={[8, 6]}>
          {selected.length ? selected.map((tag) => (
            <Tag
              key={tag}
              className={isAiGeneratedTag(tag) ? "customer-selected-ai-tag" : "customer-selected-tag"}
              closable
              onClose={(event) => {
                event.preventDefault();
                toggleTag(tag);
              }}
            >
              {getTagDisplayLabel(tag)}
            </Tag>
          )) : <Text type="secondary">暂无</Text>}
        </Space>
      </div>
    </Modal>
  );
}

export { CommonTagSelectButton, CommonTagPickerModal };
