export const salesAssistantSteps = [
  { title: "理解需求", description: "整理分析目标、时间范围和筛选条件" },
  { title: "核对数据口径", description: "匹配模拟数据，准备指标和分组结果" },
  { title: "生成输出", description: "组织分析说明与报表预览" }
];

// Demonstration progress only; these labels are task status, not model reasoning.
export function startSalesAssistantDemo({ text, onStage, onText, onComplete, setTimer = setTimeout, clearTimer = clearTimeout }) {
  let stopped = false;
  const timers = new Set();
  const later = (callback, delay) => {
    const id = setTimer(() => { timers.delete(id); if (!stopped) callback(); }, delay);
    timers.add(id);
  };
  onStage(0);
  later(() => onStage(1), 750);
  later(() => {
    onStage(2);
    const characters = Array.from(text);
    let length = 0;
    const stream = () => {
      length = Math.min(length + 6, characters.length);
      onText(characters.slice(0, length).join(""));
      if (length < characters.length) later(stream, 35);
      else { stopped = true; onComplete(); }
    };
    stream();
  }, 1700);
  return () => { stopped = true; for (const timer of timers) clearTimer(timer); timers.clear(); };
}
