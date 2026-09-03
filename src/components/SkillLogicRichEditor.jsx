import React, { useState, useEffect, useMemo } from "react";

export function escapeMarkup(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlightSkillLogic(value) {
  return escapeMarkup(value).split("\n").map((line) => {
    const headingMatch = line.match(/^(#{1,6})\s(.+)$/);
    if (headingMatch) {
      const headingLevel = Math.min(headingMatch[1].length, 3);
      return `<span class="logic-token-heading logic-token-heading-${headingLevel}">${line}</span>`;
    }
    return line
      .replace(/`([^`]+)`/g, '<span class="logic-token-code">`$1`</span>')
      .replace(/(\*\*[^*]+\*\*)/g, '<span class="logic-token-strong">$1</span>')
      .replace(/\{\{([\w.-]+)\}\}/g, '<span class="logic-token-var">{{$1}}</span>')
      .replace(/(@tool\.[\w.-]+)/g, '<span class="logic-token-tool">$1</span>')
      .replace(/(@(?:kb|knowledge)\.[\u4e00-\u9fa5\w.-]+)/g, '<span class="logic-token-kb">$1</span>')
      .replace(/\b(if|when|else|否则|如果|当)\b/g, '<span class="logic-token-condition">$1</span>')
      .replace(/(必须|禁止|不要|优先|务必|不得)/g, '<span class="logic-token-rule">$1</span>')
      .replace(/^(\s*)([-*]|\d+\.)\s/, '$1<span class="logic-token-list">$2</span> ');
  }).join("\n");
}

export function SkillLogicRichEditor({ defaultValue, onChange }) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const highlighted = useMemo(() => highlightSkillLogic(value), [value]);
  return (
    <div className="skill-logic-editor-wrap">
      <pre className="skill-logic-highlight" aria-hidden="true" dangerouslySetInnerHTML={{ __html: highlighted }} />
      <textarea
        className="skill-logic-editor"
        value={value}
        spellCheck={false}
        onChange={(event) => {
          setValue(event.target.value);
          onChange?.(event.target.value);
        }}
        onScroll={(event) => {
          const highlight = event.currentTarget.previousElementSibling;
          if (highlight) {
            highlight.scrollTop = event.currentTarget.scrollTop;
            highlight.scrollLeft = event.currentTarget.scrollLeft;
          }
        }}
      />
    </div>
  );
}

export default SkillLogicRichEditor;
