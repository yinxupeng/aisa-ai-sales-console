import assert from "node:assert/strict";
import { startSalesAssistantDemo } from "../src/data/salesAssistantProgress.js";
function clock() {
  let now = 0, sequence = 0;
  const queue = new Map();
  return {
    setTimer: (callback, delay) => { const id = ++sequence; queue.set(id, { callback, at: now + delay }); return id; },
    clearTimer: (id) => queue.delete(id),
    advance: (end) => {
      while (queue.size) {
        const [id, task] = [...queue].sort((a, b) => a[1].at - b[1].at)[0];
        if (task.at > end) break;
        now = task.at; queue.delete(id); task.callback();
      }
      now = end;
    },
    pending: () => queue.size
  };
}
const events = [], outputs = [], time = clock(); let completions = 0;
const reply = "已整理家长沟通🙂报表，支持查看用户明细。";
startSalesAssistantDemo({ text: reply, onStage: (stage) => events.push(stage), onText: (text) => outputs.push(text), onComplete: () => completions++, ...time });
assert.deepEqual(events, [0]); assert.equal(completions, 0); assert.equal(outputs.length, 0);
time.advance(750); assert.deepEqual(events, [0, 1]); assert.equal(outputs.length, 0);
time.advance(1700); assert.deepEqual(events, [0, 1, 2]); assert.equal(completions, 0); assert.ok(outputs[0].length < reply.length);
time.advance(10000); assert.equal(outputs.at(-1), reply); assert.equal(completions, 1); assert.equal(time.pending(), 0);
assert.ok(outputs.every((text) => reply.startsWith(text)), "逐步输出不能乱序");
const stopClock = clock(); let stoppedComplete = 0, stoppedOutput = 0;
const cancel = startSalesAssistantDemo({ text: reply, onStage: () => {}, onText: () => stoppedOutput++, onComplete: () => stoppedComplete++, ...stopClock });
stopClock.advance(1700); cancel(); const outputBeforeStop = stoppedOutput;
stopClock.advance(10000); assert.equal(stoppedComplete, 0); assert.equal(stoppedOutput, outputBeforeStop); assert.equal(stopClock.pending(), 0);
cancel();
console.log("SALES_ASSISTANT_PROGRESS_OK");
