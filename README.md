# AISA AI 销售托管平台原型

企微智能销售一期后台原型，包含企微托管、AI 销售角色、Skill 管理、客户中心和待发送建议闭环等核心页面。

## 本地预览

```bash
python3 -m http.server 8010
```

打开 `http://localhost:8010`。

## 构建

```bash
npm ci
npm run build
```

构建产物输出到 `assets/`，入口文件为 `index.html`。

## GitHub Pages 部署

仓库推送到 GitHub 后，`.github/workflows/pages.yml` 会在 `main` 分支每次更新时自动构建并发布到 GitHub Pages。
