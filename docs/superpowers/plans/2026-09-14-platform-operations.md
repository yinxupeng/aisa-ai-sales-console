# 平台运营中心 Implementation Plan

**Goal:** 在现有仓库增加可独立打开的平台运营原型，并贯通企业端席位分配。
**Architecture:** 平台使用独立 TSX 入口与构建产物；共享纯函数业务模型和浏览器持久化仓库；既有企业端以局部改动读取指定企业授权。
**Tech Stack:** React 19、Ant Design 6、TypeScript/JSX、esbuild、localStorage。
**Spec:** `docs/platform/product-design.md`

## Global Constraints
保留当前未提交修改和企业端文件位置；不发布、不提交用户的既有修改；本次为前端演示，不连接真实外部服务。

## Tasks
- [ ] 1. 共享业务模型：`src/shared/platformDomain.ts` 定义企业、授权、账号和变更类型；`scripts/verify-platform.mjs` 验证额度、企业隔离、有效期、同步边界。先运行失败测试，再实现。
- [ ] 2. 持久化：`src/shared/platformStore.ts` 管理种子、快照、订阅、日志和跨标签更新；所有事务读取最新快照再校验。
- [ ] 3. 平台页面：`src/platform/PlatformApp.tsx` 管理独立登录与导航，企业列表/详情、三步开通、调整/续期、同步、账号管理和日志拆为独立模块。
- [ ] 4. 企业集成：`src/pages/WecomAccountPage.jsx` 使用企业授权与账号共享数据，席位和 AI 运行状态分开；`src/App.jsx` 添加指定企业登录与演示上下文。
- [ ] 5. 入口与样式：独立 `platform.html` / `portal.html`，更新 `scripts/build.mjs` 输出 main 与 platform 两套文件，新增平台样式隔离。
- [ ] 6. 验证：运行既有业务测试、SSR、平台规则测试及构建；浏览器测试错误密码、新建企业、详情、额度调整、同步、企业分配、刷新持久化、退出登录及窄屏布局。记录结果至 `docs/platform/README.md` 并交付链接。
