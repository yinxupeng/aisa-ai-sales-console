# Sabuddy 销售托管平台原型

企微智能销售一期后台原型，包含企微托管、AI 销售角色、智能体管理、客户中心和待发送建议闭环等核心业务模块。

---

## 🚀 快速体验（无需任何 Node 环境）

本工程为高保真静态原型系统，构建产物已内置在 `assets/` 目录中：

### 方式 1：本地轻量服务器（推荐）
```bash
python3 -m http.server 8010
```
在浏览器打开 `http://localhost:8010` 即可流畅体验。

### 方式 2：直接双击体验
直接在文件管理器中双击打开 `index.html` 即可运行。

---

## 🛠️ 研发与构建说明

### 运行环境要求
- **Node.js**: `18.0.0` 或更高版本（或使用 IDE / Codex 内置 Node.js 运行时环境）。
- **说明**：如在 macOS 纯净终端中提示 `command not found: node`，请先配置全局 Node（推荐使用 [nvm](https://github.com/nvm-sh/nvm) 或 [nodejs.org](https://nodejs.org/) 安装）。

### 安装与构建
```bash
# 1. 安装依赖（统一使用 package-lock.json）
npm ci

# 2. 静态编译打包（产物自动输出至 assets/main.js & assets/main.css）
npm run build
```

---

## 🧪 自动化健康度检测

项目内置了两套互补的自动化测试流水线，确保页面健康无白屏：

```bash
# 1. 19 页面深度 SSR 挂载测试（死守 0 白屏、0 变量漏导底线）
npm run test:runtime

# 2. 核心业务与编排静态断言测试
npm test
```

---

## 📁 核心架构目录

```text
├── index.html            # 原型系统统一入口
├── assets/               # 静态构建产物（main.js / main.css）
├── src/
│   ├── App.jsx           # 顶层 AppShell 与页面路由映射
│   ├── app.css           # 全局高保真样式系统
│   ├── pages/            # 19 个高内聚独立业务场景页面
│   ├── components/       # 跨页面沉淀公共组件（PageChrome, CommonTagPicker 等）
│   └── data/             # 全局统一真理源（appData, conversations）
├── scripts/
│   ├── build.mjs         # esbuild 极速编译脚本
│   ├── verify-runtime.mjs# 19 页面零白屏自动化检测
│   └── verify-skill-orchestration.mjs # 业务契约断言测试
└── GEMINI.md             # 工程规范与开发准则
```

---

## 🌐 自动部署

仓库推送到 GitHub 后，`.github/workflows/pages.yml` 会在 `main` 分支每次更新时自动构建并发布到 GitHub Pages。
