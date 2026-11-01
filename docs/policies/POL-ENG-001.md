---
id: POL-ENG-001
owner: zoulingang
status: draft          # 未经 Owner 批准的规则不能作为生效门禁
level: MUST            # MUST | SHOULD | MAY
severity: medium       # high | medium | low
scope:
  - "**/*"
enforcement:
  type: automated
  command:
    - npm
    - run
    - verify
---

# 提交前工程验证

## 规则

提交前以及主分支部署构建时必须执行 `npm run verify`；命令必须同时通过 ESLint 零警告检查和 TypeScript/Vite 生产构建。涉及 UI 或交互的变更还必须执行相关 Playwright 用例，但它们保持为按变更范围选择的独立检查。

## 理由

本地开发与 GitHub Pages CI 复用同一基础验证入口，可以在部署前发现静态检查、类型检查和生产构建问题，同时避免所有变更无条件依赖特定 Chromium 安装环境。
