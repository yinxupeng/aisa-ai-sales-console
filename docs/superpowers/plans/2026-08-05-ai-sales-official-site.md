# AI Sales Official Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone responsive official website for the AI sales platform, inheriting product context from the current project and presenting personal, team, and enterprise-private editions.

**Architecture:** Create a separate Vite + React + TypeScript project outside the current app at `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site`. Use a data-driven single-page architecture where copy, pricing plans, feature lists, and scenario cards live in typed content files, and presentational sections consume those data objects. Keep the first version static with a client-side demo form state only.

**Tech Stack:** React, TypeScript, Vite, CSS Modules or plain CSS, lucide-react icons, static build.

## Global Constraints

- New project path must be `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site`.
- Copy `docs/product-context.md` from the source project into the new project at `docs/product-context.md`.
- Copy the approved website design into the new project at `docs/website-design.md`.
- Build a single-page official website for desktop and mobile.
- Include navigation, Hero, pain/value, product capabilities, business loop, applicable scenarios, version plans, private deployment, demo request, and footer.
- Version plans must include `个人版`, `团队版`, and `企业私有化版`.
- Do not hardcode concrete prices in the first version; use `申请体验`, `预约演示`, and `联系商务`.
- Position the product as `面向私域销售团队的企微 AI 销售托管平台`.
- Avoid presenting the product as a generic chatbot or customer-service bot.
- Use an enterprise B2B SaaS visual style with realistic product UI signals.
- Do not implement real backend submission for the demo form in the first version.
- Verify with build and at least one automated DOM/content check.

---

## File Structure

Create:

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/package.json`  
  Project scripts and dependencies.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/index.html`  
  Vite HTML entry and SEO metadata.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/tsconfig.json`  
  TypeScript settings.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/vite.config.ts`  
  Vite React config.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/main.tsx`  
  React app mount.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/App.tsx`  
  Page composition and section ordering.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/content/siteContent.ts`  
  Typed content objects for nav, metrics, features, flow, scenarios, plans, private deployment, and footer.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/components/SectionHeader.tsx`  
  Shared section title component.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Hero.tsx`  
  First viewport and product UI preview.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/PainValue.tsx`  
  Pain points and corresponding value statements.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Capabilities.tsx`  
  Core product capabilities grid.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/BusinessLoop.tsx`  
  Standard business loop visualization.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Scenarios.tsx`  
  Applicable industry scenarios.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Pricing.tsx`  
  Personal, team, and enterprise-private plan cards and comparison.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/PrivateDeployment.tsx`  
  Local deployment and delivery capabilities.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/DemoRequest.tsx`  
  Static demo request form with validation-like UI feedback.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Footer.tsx`  
  Footer links and product statement.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/styles.css`  
  Global responsive styling.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/scripts/verify-site.mjs`  
  Automated content/build artifact verification.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/docs/product-context.md`  
  Copied product context.

- `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/docs/website-design.md`  
  Copied website design spec.

---

### Task 1: Project Scaffold And Context

**Files:**
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/package.json`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/index.html`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/tsconfig.json`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/vite.config.ts`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/main.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/App.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/styles.css`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/docs/product-context.md`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/docs/website-design.md`

**Interfaces:**
- Consumes: Source documents from `/Users/yinxupeng/Desktop/codex_progect/2026-06-12_企微智能销售1期/docs/product-context.md` and `/Users/yinxupeng/Desktop/codex_progect/2026-06-12_企微智能销售1期/docs/superpowers/specs/2026-08-05-ai-sales-official-site-design.md`.
- Produces: A runnable empty React/Vite shell with copied docs and scripts `npm run dev`, `npm run build`, and `npm run verify`.

- [ ] **Step 1: Create project directories**

Run:

```bash
mkdir -p /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src
mkdir -p /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/docs
mkdir -p /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/scripts
```

- [ ] **Step 2: Copy context documents**

Run:

```bash
cp /Users/yinxupeng/Desktop/codex_progect/2026-06-12_企微智能销售1期/docs/product-context.md /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/docs/product-context.md
cp /Users/yinxupeng/Desktop/codex_progect/2026-06-12_企微智能销售1期/docs/superpowers/specs/2026-08-05-ai-sales-official-site-design.md /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/docs/website-design.md
```

- [ ] **Step 3: Create `package.json`**

Use this content:

```json
{
  "name": "ai-sales-official-site",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "verify": "node scripts/verify-site.mjs"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.0",
    "typescript": "^5.6.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {}
}
```

- [ ] **Step 4: Create Vite and TypeScript config**

Use `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

Use `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 5: Create HTML entry**

Use `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="面向私域销售团队的企微 AI 销售托管平台，让 AI 按销售流程持续跟进每一个企微客户。"
    />
    <title>企微 AI 销售托管平台</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create minimal React shell**

Use `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Use `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <h1>企微 AI 销售托管平台</h1>
      <p>让 AI 按你的销售流程，持续跟进每一个企微客户。</p>
    </main>
  );
}
```

Use `src/styles.css`:

```css
:root {
  color: #172033;
  background: #f6f8fb;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px 20px;
  text-align: center;
}
```

- [ ] **Step 7: Install dependencies and run build**

Run:

```bash
cd /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site
npm install
npm run build
```

Expected: build succeeds and creates `dist`.

---

### Task 2: Typed Content Model

**Files:**
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/content/siteContent.ts`
- Modify: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/App.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/scripts/verify-site.mjs`

**Interfaces:**
- Consumes: React shell from Task 1.
- Produces: `siteContent` typed export with `navItems`, `metrics`, `pains`, `capabilities`, `flowSteps`, `scenarios`, `plans`, `deploymentItems`, and `contactOptions`.

- [ ] **Step 1: Create content directory**

Run:

```bash
mkdir -p /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/content
```

- [ ] **Step 2: Create typed content**

Use `src/content/siteContent.ts`:

```ts
export type NavItem = {
  label: string;
  href: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type PainValue = {
  pain: string;
  value: string;
};

export type Capability = {
  title: string;
  description: string;
};

export type FlowStep = {
  title: string;
  description: string;
};

export type Scenario = {
  title: string;
  description: string;
};

export type Plan = {
  name: string;
  tag: string;
  audience: string;
  cta: string;
  highlighted?: boolean;
  features: string[];
};

export type DeploymentItem = {
  title: string;
  description: string;
};

export const navItems: NavItem[] = [
  { label: '产品能力', href: '#capabilities' },
  { label: '适用场景', href: '#scenarios' },
  { label: '版本方案', href: '#pricing' },
  { label: '私有化部署', href: '#deployment' },
  { label: '预约演示', href: '#demo' },
];

export const metrics: Metric[] = [
  { value: '7x24', label: 'AI 持续跟进' },
  { value: '全链路', label: '执行记录追踪' },
  { value: '私有化', label: '本地服务器部署' },
];

export const pains: PainValue[] = [
  { pain: '销售跟进依赖个人经验', value: '把标准 SOP 拆成生命周期阶段和 Skill，让每次跟进有章可循。' },
  { pain: '客户阶段和后续任务不可见', value: '在会话中心直接查看当前阶段、定时任务和 AI 执行情况。' },
  { pain: '企微客户分散，人工响应不稳定', value: '多企微账号统一托管，AI 自动跟进，运营人员可随时接管。' },
  { pain: 'AI 回复过程像黑盒', value: '保留 Prompt、工具调用和执行记录，方便复盘、排查和验收。' },
];

export const capabilities: Capability[] = [
  { title: '企微账号托管', description: '同步企微账号，绑定运营人员和智能体，支持 AI 托管与人工接管。' },
  { title: '智能体管理', description: '按岗位配置课程顾问、市场顾问、班主任等 AI 销售角色。' },
  { title: '生命周期销售流程', description: '定义客户从新客到成交的阶段路径，按阶段推进客户旅程。' },
  { title: 'Skill/SOP 任务编排', description: '把欢迎、跟进、推荐、异议处理、下单等动作配置成可复用 Skill。' },
  { title: '工具与第三方 API', description: '对接用户画像、订单、下单、通知等业务系统能力。' },
  { title: '会话中心', description: '集中查看聊天记录、客户信息、订单信息、生命周期和定时任务。' },
  { title: '执行记录追踪', description: '记录 AI 回复、Prompt、工具调用、阶段调整和策略任务。' },
  { title: '私有化交付', description: '支持部署到客户本地服务器，满足数据安全和内网集成要求。' },
];

export const flowSteps: FlowStep[] = [
  { title: '企微账号接入', description: '配置句子通道并同步企微账号。' },
  { title: '绑定智能体', description: '为企微账号指定运营人员和岗位智能体。' },
  { title: '客户进入会话', description: '客户消息进入会话中心并触发跟进流程。' },
  { title: '生命周期启动', description: '系统识别客户当前阶段并加载阶段目标。' },
  { title: 'Skill 自动执行', description: 'AI 按销售阶段执行回复、判断、触达和推进。' },
  { title: '工具调用', description: '需要业务数据时调用画像、订单、下单等接口。' },
  { title: '人工介入', description: '高风险或高意向场景通知运营接管。' },
  { title: '复盘优化', description: '通过执行记录持续优化话术、任务和流程。' },
];

export const scenarios: Scenario[] = [
  { title: '教育培训', description: '自动完成新客欢迎、学员信息收集、课程推荐、试听邀约和报名转化。' },
  { title: '咨询服务', description: '围绕客户需求识别、方案推荐、资料收集和顾问介入提升转化效率。' },
  { title: '本地生活', description: '适合门店咨询、预约到店、活动邀约、二次跟进等私域场景。' },
  { title: '企业服务', description: '支持线索培育、客户分层、方案沟通和商机推进。' },
];

export const plans: Plan[] = [
  {
    name: '个人版',
    tag: '适合个人体验',
    audience: '个人销售、小团队负责人、早期试用用户',
    cta: '申请体验',
    features: ['单个企微账号体验', '基础 AI 销售对话', '基础 Skill 模板', '简单会话记录', '标准模型额度'],
  },
  {
    name: '团队版',
    tag: '适合销售团队',
    audience: '5-50 人销售团队，适合先跑通标准 AI 销售流程',
    cta: '预约演示',
    highlighted: true,
    features: ['多企微账号托管', '多智能体配置', '生命周期销售流程', 'Skill/SOP 任务编排', '团队账号与权限', '运营数据看板'],
  },
  {
    name: '企业私有化版',
    tag: '适合本地部署',
    audience: '对数据安全、内网部署、深度集成有要求的企业',
    cta: '联系商务',
    features: ['本地服务器部署', '独立数据库', '私有模型或专属模型接入', 'CRM/订单系统深度集成', '权限审计与日志备份', '专属实施和培训'],
  },
];

export const deploymentItems: DeploymentItem[] = [
  { title: '本地服务器部署', description: '支持部署到客户自有服务器，满足私有化交付要求。' },
  { title: '业务系统集成', description: '对接 CRM、订单系统、企微中台和客户自有接口。' },
  { title: '数据与权限可控', description: '独立数据库、角色权限、执行记录和日志审计。' },
  { title: '专属实施培训', description: '提供部署、配置、联调、培训和验收支持。' },
];
```

- [ ] **Step 3: Wire content into temporary App smoke render**

Use `src/App.tsx`:

```tsx
import { capabilities, plans } from './content/siteContent';

export default function App() {
  return (
    <main className="app-shell">
      <h1>企微 AI 销售托管平台</h1>
      <p>让 AI 按你的销售流程，持续跟进每一个企微客户。</p>
      <p>
        已配置 {capabilities.length} 项核心能力，{plans.length} 个版本方案。
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Create verification script**

Use `scripts/verify-site.mjs`:

```js
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'docs/product-context.md',
  'docs/website-design.md',
  'src/content/siteContent.ts',
  'src/App.tsx',
  'index.html',
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');
const content = readFileSync(join(root, 'src/content/siteContent.ts'), 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8');

const requiredText = [
  '企微 AI 销售托管平台',
  '让 AI 按你的销售流程',
  '个人版',
  '团队版',
  '企业私有化版',
  '私有化部署',
];

for (const text of requiredText) {
  if (!`${app}\n${content}\n${html}`.includes(text)) {
    throw new Error(`Missing required text: ${text}`);
  }
}

console.log('Site verification passed.');
```

- [ ] **Step 5: Run build and verification**

Run:

```bash
cd /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site
npm run build
npm run verify
```

Expected: both commands pass.

---

### Task 3: Section Components And Page Composition

**Files:**
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/components/SectionHeader.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Hero.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/PainValue.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Capabilities.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/BusinessLoop.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Scenarios.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Pricing.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/PrivateDeployment.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/DemoRequest.tsx`
- Create: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections/Footer.tsx`
- Modify: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/App.tsx`

**Interfaces:**
- Consumes: `siteContent` typed exports from Task 2.
- Produces: A complete static page with section IDs `capabilities`, `scenarios`, `pricing`, `deployment`, and `demo`.

- [ ] **Step 1: Create section directories**

Run:

```bash
mkdir -p /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/components
mkdir -p /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/sections
```

- [ ] **Step 2: Create shared section header**

Use `src/components/SectionHeader.tsx`:

```tsx
type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Create Hero**

Use `src/sections/Hero.tsx`:

```tsx
import { ArrowRight, Bot, CheckCircle2, MessageSquareText, ShieldCheck } from 'lucide-react';
import { metrics } from '../content/siteContent';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">企微 AI 销售托管平台</div>
        <h1>让 AI 按你的销售流程，持续跟进每一个企微客户</h1>
        <p className="hero-lead">
          通过智能体、生命周期流程、Skill/SOP 任务和第三方工具调用，把私域客户跟进流程标准化、自动化、可追踪。
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#demo">
            预约演示 <ArrowRight size={18} />
          </a>
          <a className="btn ghost" href="#pricing">查看版本方案</a>
        </div>
        <div className="metric-row">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="product-preview" aria-label="产品界面概览">
        <div className="preview-top">
          <span className="dot green" />
          <span>会话中心</span>
          <strong>AI 托管中</strong>
        </div>
        <div className="preview-body">
          <aside>
            <div className="account active">企微账号 A</div>
            <div className="account">企微账号 B</div>
            <div className="account">企微账号 C</div>
          </aside>
          <main>
            <div className="chat user">客户：想了解一下课程价格</div>
            <div className="chat ai">AI：我先了解孩子年级和英语基础，再给您推荐合适方案。</div>
            <div className="logic-strip">
              <CheckCircle2 size={16} /> 当前阶段：信息收集
            </div>
          </main>
          <div className="preview-panel">
            <div><Bot size={16} /> Skill：获取学员信息</div>
            <div><MessageSquareText size={16} /> 定时任务：2 小时后跟进</div>
            <div><ShieldCheck size={16} /> 人工介入：未触发</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create content sections**

Use the section files exactly as described:

`src/sections/PainValue.tsx`:

```tsx
import { pains } from '../content/siteContent';
import { SectionHeader } from '../components/SectionHeader';

export function PainValue() {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="业务痛点"
        title="解决销售跟进不可控的问题"
        description="把经验型销售动作转成可配置、可执行、可复盘的 AI 销售流程。"
      />
      <div className="pain-grid">
        {pains.map((item) => (
          <article className="pain-card" key={item.pain}>
            <h3>{item.pain}</h3>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

`src/sections/Capabilities.tsx`:

```tsx
import { capabilities } from '../content/siteContent';
import { SectionHeader } from '../components/SectionHeader';

export function Capabilities() {
  return (
    <section className="section" id="capabilities">
      <SectionHeader
        eyebrow="产品能力"
        title="从企微托管到执行追踪的完整闭环"
        description="围绕企业微信、智能体、生命周期、Skill、工具调用和执行记录构建 AI 销售运营能力。"
      />
      <div className="capability-grid">
        {capabilities.map((item, index) => (
          <article className="capability-card" key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

`src/sections/BusinessLoop.tsx`:

```tsx
import { flowSteps } from '../content/siteContent';
import { SectionHeader } from '../components/SectionHeader';

export function BusinessLoop() {
  return (
    <section className="section loop-section">
      <SectionHeader
        eyebrow="业务闭环"
        title="AI 不是只会聊天，而是按销售流程做事"
        description="每个客户进入会话后，平台会根据配置好的生命周期和 Skill 推进后续动作。"
      />
      <div className="flow-grid">
        {flowSteps.map((step, index) => (
          <article className="flow-step" key={step.title}>
            <strong>{index + 1}</strong>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

`src/sections/Scenarios.tsx`:

```tsx
import { scenarios } from '../content/siteContent';
import { SectionHeader } from '../components/SectionHeader';

export function Scenarios() {
  return (
    <section className="section" id="scenarios">
      <SectionHeader
        eyebrow="适用场景"
        title="适合重视私域转化的销售团队"
        description="尤其适合客户生命周期长、需要多次跟进、销售流程可标准化的业务。"
      />
      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <article className="scenario-card" key={scenario.title}>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create pricing, deployment, demo, and footer sections**

Use `src/sections/Pricing.tsx`:

```tsx
import { Check } from 'lucide-react';
import { plans } from '../content/siteContent';
import { SectionHeader } from '../components/SectionHeader';

export function Pricing() {
  return (
    <section className="section pricing-section" id="pricing">
      <SectionHeader
        eyebrow="版本方案"
        title="从个人体验到企业私有化交付"
        description="首版不写死价格，根据企微账号数量、模型调用量、部署方式和集成范围制定方案。"
      />
      <div className="plan-grid">
        {plans.map((plan) => (
          <article className={`plan-card ${plan.highlighted ? 'highlighted' : ''}`} key={plan.name}>
            <span className="plan-tag">{plan.tag}</span>
            <h3>{plan.name}</h3>
            <p>{plan.audience}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} /> {feature}
                </li>
              ))}
            </ul>
            <a className={plan.highlighted ? 'btn primary full' : 'btn ghost full'} href="#demo">
              {plan.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Use `src/sections/PrivateDeployment.tsx`:

```tsx
import { deploymentItems } from '../content/siteContent';
import { SectionHeader } from '../components/SectionHeader';

export function PrivateDeployment() {
  return (
    <section className="section deployment-section" id="deployment">
      <SectionHeader
        eyebrow="私有化部署"
        title="面向企业本地服务器交付"
        description="适合对数据安全、内网系统集成、模型访问和运维管控有明确要求的企业。"
      />
      <div className="deployment-layout">
        <div className="deployment-copy">
          <h3>交付不仅是安装系统，还包括业务流程落地</h3>
          <p>
            我们会协助完成部署、模型配置、企微通道、第三方接口、智能体流程、培训演示和验收支持。
          </p>
        </div>
        <div className="deployment-list">
          {deploymentItems.map((item) => (
            <article key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Use `src/sections/DemoRequest.tsx`:

```tsx
import { FormEvent, useState } from 'react';

export function DemoRequest() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="section demo-section" id="demo">
      <div className="demo-copy">
        <span className="eyebrow">预约演示</span>
        <h2>带着你的销售流程来，我们一起看怎么托管给 AI</h2>
        <p>适合想评估企微托管、Skill/SOP 配置、第三方系统集成和本地化部署的团队。</p>
      </div>
      <form className="demo-form" onSubmit={handleSubmit}>
        <label>
          姓名
          <input name="name" placeholder="请输入姓名" required />
        </label>
        <label>
          公司
          <input name="company" placeholder="请输入公司名称" required />
        </label>
        <label>
          手机号
          <input name="phone" placeholder="请输入手机号" required />
        </label>
        <label>
          需求类型
          <select name="plan" defaultValue="enterprise">
            <option value="personal">个人版体验</option>
            <option value="team">团队版演示</option>
            <option value="enterprise">企业私有化部署</option>
          </select>
        </label>
        <label className="wide">
          留言
          <textarea name="message" placeholder="可以简单描述企微账号数量、行业和希望接入的业务系统" />
        </label>
        <button className="btn primary full" type="submit">提交预约</button>
        {submitted ? <p className="form-success">已记录预约信息，正式版本可接入企业表单或 CRM。</p> : null}
      </form>
    </section>
  );
}
```

Use `src/sections/Footer.tsx`:

```tsx
import { navItems } from '../content/siteContent';

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>企微 AI 销售托管平台</strong>
        <p>让 AI 按企业定义的销售流程持续跟进客户。</p>
      </div>
      <nav>
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>
    </footer>
  );
}
```

- [ ] **Step 6: Compose full page**

Use `src/App.tsx`:

```tsx
import { navItems } from './content/siteContent';
import { Hero } from './sections/Hero';
import { PainValue } from './sections/PainValue';
import { Capabilities } from './sections/Capabilities';
import { BusinessLoop } from './sections/BusinessLoop';
import { Scenarios } from './sections/Scenarios';
import { Pricing } from './sections/Pricing';
import { PrivateDeployment } from './sections/PrivateDeployment';
import { DemoRequest } from './sections/DemoRequest';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#">AI Sales</a>
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="header-cta" href="#demo">预约演示</a>
      </header>
      <main>
        <Hero />
        <PainValue />
        <Capabilities />
        <BusinessLoop />
        <Scenarios />
        <Pricing />
        <PrivateDeployment />
        <DemoRequest />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Run build and verify**

Run:

```bash
cd /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site
npm run build
npm run verify
```

Expected: both commands pass.

---

### Task 4: Visual Styling And Responsiveness

**Files:**
- Modify: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/src/styles.css`

**Interfaces:**
- Consumes: All section class names from Task 3.
- Produces: Responsive enterprise SaaS visual design with stable layout, no obvious text overflow, and mobile-friendly sections.

- [ ] **Step 1: Replace global CSS**

Use `src/styles.css`:

```css
:root {
  color: #182235;
  background: #f5f8fb;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 68px;
  padding: 0 6vw;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #e5ecf4;
  backdrop-filter: blur(14px);
}

.brand {
  font-size: 18px;
  font-weight: 700;
  color: #0b5d8f;
  white-space: nowrap;
}

.site-header nav,
.footer nav {
  display: flex;
  gap: 22px;
  color: #536174;
  font-size: 14px;
}

.site-header nav a:hover,
.footer nav a:hover {
  color: #0b6ea8;
}

.header-cta,
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn.primary,
.header-cta {
  color: #fff;
  background: #0b6ea8;
  box-shadow: 0 10px 24px rgba(11, 110, 168, 0.2);
}

.btn.ghost {
  color: #0b5d8f;
  background: #fff;
  border-color: #c8d9e8;
}

.btn.full {
  width: 100%;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(460px, 1.08fr);
  gap: 48px;
  align-items: center;
  min-height: calc(100vh - 68px);
  padding: 72px 6vw 64px;
  background:
    linear-gradient(135deg, rgba(230, 247, 255, 0.75), rgba(246, 248, 251, 0) 42%),
    #f5f8fb;
}

.eyebrow,
.section-header span,
.plan-tag {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  color: #0b6ea8;
  background: #e6f4ff;
  font-size: 13px;
  font-weight: 600;
}

.hero h1 {
  max-width: 760px;
  margin: 20px 0 18px;
  color: #111b2f;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.06;
  letter-spacing: 0;
}

.hero-lead {
  max-width: 680px;
  margin: 0;
  color: #4c5a6d;
  font-size: 18px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  max-width: 620px;
  margin-top: 38px;
}

.metric {
  padding: 18px;
  border: 1px solid #dfe8f2;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
}

.metric strong {
  display: block;
  color: #0f6f64;
  font-size: 26px;
}

.metric span {
  color: #66758a;
  font-size: 13px;
}

.product-preview {
  overflow: hidden;
  border: 1px solid #d9e5ef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 30px 70px rgba(24, 34, 53, 0.14);
}

.preview-top {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 18px;
  border-bottom: 1px solid #e7edf4;
  color: #536174;
  font-size: 14px;
}

.preview-top strong {
  margin-left: auto;
  color: #0f6f64;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.green {
  background: #27b37e;
}

.preview-body {
  display: grid;
  grid-template-columns: 150px minmax(220px, 1fr) 210px;
  min-height: 420px;
}

.preview-body aside,
.preview-panel {
  padding: 16px;
  background: #f7f9fc;
}

.account,
.chat,
.logic-strip,
.preview-panel div {
  border-radius: 8px;
}

.account {
  padding: 12px;
  color: #536174;
  font-size: 13px;
}

.account.active {
  color: #0b5d8f;
  background: #e6f4ff;
}

.preview-body main {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px 20px;
}

.chat {
  max-width: 82%;
  padding: 13px 14px;
  color: #263247;
  background: #f0f4f8;
  font-size: 14px;
}

.chat.ai {
  align-self: flex-end;
  background: #e8f6f2;
}

.logic-strip {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: #0f6f64;
  background: #eefaf6;
  font-size: 13px;
}

.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 1px solid #e7edf4;
}

.preview-panel div {
  display: flex;
  gap: 8px;
  padding: 12px;
  color: #48576a;
  background: #fff;
  font-size: 13px;
}

.section {
  padding: 84px 6vw;
}

.section-header {
  max-width: 760px;
  margin-bottom: 34px;
}

.section-header h2,
.demo-copy h2 {
  margin: 14px 0 12px;
  color: #111b2f;
  font-size: 36px;
  line-height: 1.18;
  letter-spacing: 0;
}

.section-header p,
.demo-copy p {
  margin: 0;
  color: #59687a;
  font-size: 16px;
}

.pain-grid,
.capability-grid,
.scenario-grid,
.plan-grid,
.flow-grid {
  display: grid;
  gap: 18px;
}

.pain-grid,
.scenario-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.capability-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.flow-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.plan-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
}

.pain-card,
.capability-card,
.scenario-card,
.flow-step,
.plan-card,
.deployment-copy,
.deployment-list article,
.demo-form {
  border: 1px solid #dfe8f2;
  border-radius: 8px;
  background: #fff;
}

.pain-card,
.capability-card,
.scenario-card,
.flow-step {
  padding: 22px;
}

.pain-card h3,
.capability-card h3,
.scenario-card h3,
.flow-step h3,
.plan-card h3,
.deployment-copy h3,
.deployment-list h4 {
  margin: 0 0 10px;
  color: #152238;
  font-size: 18px;
  letter-spacing: 0;
}

.pain-card p,
.capability-card p,
.scenario-card p,
.flow-step p,
.plan-card p,
.deployment-copy p,
.deployment-list p {
  margin: 0;
  color: #627186;
  font-size: 14px;
}

.capability-card span,
.flow-step strong {
  display: block;
  margin-bottom: 14px;
  color: #0b6ea8;
  font-size: 14px;
}

.loop-section,
.pricing-section {
  background: #ffffff;
}

.plan-card {
  display: flex;
  flex-direction: column;
  padding: 26px;
}

.plan-card.highlighted {
  border-color: #0b6ea8;
  box-shadow: 0 20px 46px rgba(11, 110, 168, 0.16);
}

.plan-card ul {
  display: grid;
  gap: 10px;
  margin: 22px 0 24px;
  padding: 0;
  list-style: none;
}

.plan-card li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #405067;
  font-size: 14px;
}

.plan-card .btn {
  margin-top: auto;
}

.deployment-layout,
.demo-section {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  gap: 24px;
  align-items: start;
}

.deployment-copy,
.demo-copy {
  padding: 30px;
}

.deployment-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.deployment-list article {
  padding: 22px;
}

.demo-section {
  background: #10243a;
}

.demo-copy h2,
.demo-copy p {
  color: #fff;
}

.demo-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 24px;
}

.demo-form label {
  display: grid;
  gap: 8px;
  color: #4b596c;
  font-size: 13px;
}

.demo-form .wide,
.demo-form button,
.form-success {
  grid-column: 1 / -1;
}

.demo-form input,
.demo-form select,
.demo-form textarea {
  width: 100%;
  min-height: 42px;
  border: 1px solid #cfdae6;
  border-radius: 8px;
  padding: 10px 12px;
  color: #1d2a3d;
  font: inherit;
}

.demo-form textarea {
  min-height: 96px;
  resize: vertical;
}

.form-success {
  margin: 0;
  color: #0f6f64;
  font-size: 13px;
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 34px 6vw;
  color: #627186;
  background: #fff;
  border-top: 1px solid #e5ecf4;
}

.footer strong {
  color: #142238;
}

.footer p {
  margin: 8px 0 0;
  font-size: 14px;
}

@media (max-width: 1120px) {
  .hero,
  .deployment-layout,
  .demo-section {
    grid-template-columns: 1fr;
  }

  .preview-body {
    grid-template-columns: 140px 1fr;
  }

  .preview-panel {
    grid-column: 1 / -1;
    border-left: 0;
    border-top: 1px solid #e7edf4;
  }

  .pain-grid,
  .capability-grid,
  .scenario-grid,
  .flow-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px 20px;
  }

  .site-header nav {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .header-cta {
    display: none;
  }

  .hero,
  .section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .metric-row,
  .plan-grid,
  .deployment-list,
  .demo-form {
    grid-template-columns: 1fr;
  }

  .pain-grid,
  .capability-grid,
  .scenario-grid,
  .flow-grid {
    grid-template-columns: 1fr;
  }

  .preview-body {
    grid-template-columns: 1fr;
  }

  .preview-body aside {
    display: none;
  }

  .chat {
    max-width: 100%;
  }

  .section-header h2,
  .demo-copy h2 {
    font-size: 28px;
  }

  .footer {
    flex-direction: column;
  }
}
```

- [ ] **Step 2: Run build and verify**

Run:

```bash
cd /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site
npm run build
npm run verify
```

Expected: both commands pass.

---

### Task 5: Final Verification And Local Preview

**Files:**
- Modify: `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/scripts/verify-site.mjs`
- Read-only: built files under `/Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site/dist`

**Interfaces:**
- Consumes: Completed website from Tasks 1-4.
- Produces: Verified build and a running local preview URL.

- [ ] **Step 1: Strengthen verification script**

Replace `scripts/verify-site.mjs` with:

```js
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'docs/product-context.md',
  'docs/website-design.md',
  'src/content/siteContent.ts',
  'src/App.tsx',
  'src/styles.css',
  'index.html',
  'dist/index.html',
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const sourceFiles = [
  'index.html',
  'src/App.tsx',
  'src/content/siteContent.ts',
  'src/sections/Hero.tsx',
  'src/sections/Pricing.tsx',
  'src/sections/PrivateDeployment.tsx',
  'src/sections/DemoRequest.tsx',
];

const sourceText = sourceFiles
  .map((file) => readFileSync(join(root, file), 'utf8'))
  .join('\n');

const requiredText = [
  '企微 AI 销售托管平台',
  '让 AI 按你的销售流程',
  '个人版',
  '团队版',
  '企业私有化版',
  '申请体验',
  '预约演示',
  '联系商务',
  '私有化部署',
  '本地服务器部署',
  '执行记录',
];

for (const text of requiredText) {
  if (!sourceText.includes(text)) {
    throw new Error(`Missing required text: ${text}`);
  }
}

const assetDir = join(root, 'dist/assets');
if (!existsSync(assetDir) || readdirSync(assetDir).length === 0) {
  throw new Error('Missing built assets in dist/assets');
}

console.log('Site verification passed.');
```

- [ ] **Step 2: Run full verification**

Run:

```bash
cd /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site
npm run build
npm run verify
```

Expected: both commands pass.

- [ ] **Step 3: Start local dev server**

Run:

```bash
cd /Users/yinxupeng/Desktop/codex_progect/ai-sales-official-site
npm run dev -- --port 5177
```

Expected: Vite serves the site at `http://localhost:5177/`.

- [ ] **Step 4: Final manual check**

Open `http://localhost:5177/` and check:

- Hero first screen is not blank.
- Header navigation works.
- Pricing contains all three plans.
- Mobile width does not show obvious horizontal overflow.
- Demo form submission displays the local success message.

## Self-Review

- Spec coverage: The plan covers the approved sections, version scheme, private deployment positioning, static form behavior, copied context docs, and build verification.
- Placeholder scan: No `TBD`, `TODO`, `implement later`, or ambiguous fill-in steps remain.
- Type consistency: Content types in `siteContent.ts` match the fields consumed by the section components.

