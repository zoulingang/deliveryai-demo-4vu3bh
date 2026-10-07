[English](./README.md) | **简体中文** | [日本語](./README.ja.md) | [Español](./README.md#espanol)

# 沸点火锅点单演示

一个面向火锅门店场景的移动端点单与履约流程演示项目，用于展示从绑定餐桌、多人点餐到订单履约和结账支付的完整体验。

> 本项目为概念演示，不代表正式产品。

## 功能介绍

- 绑定餐桌并进入点餐流程
- 按分类浏览、搜索和选择菜品
- 配置菜品规格、口味及下单人（选择「超级辣」锅底时会弹出风险确认）
- 多人协同点餐与购物车管理
- 查看订单制作及上菜进度
- 呼叫加汤、饮料、餐具和结账服务
- 通过演示控制台模拟菜品售罄、服务响应及履约状态
- 模拟结账和支付成功流程
- 中英文界面切换
- 老人模式（大字号）
- 浅色、深色及跟随系统三种主题
- 支持人民币、美元、欧元、日元、港币、新台币六种货币展示，以人民币底价按固定汇率换算

主题、货币和老人模式的选择会保存在 `localStorage` 中。

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- i18next
- Playwright
- Express（演示服务端）

## 环境要求

- Node.js 18 或更高版本（CI 使用 Node.js 20）
- npm 9 或更高版本

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

服务默认运行在 `http://localhost:5173`。如果该端口已被占用，Vite 会自动选择其他可用端口，请以启动日志为准。

## 常用命令

```bash
# 启动开发服务
npm run dev

# 执行代码检查
npm run lint

# 类型检查并构建生产版本
npm run build

# 运行 Playwright 端到端测试（会自动启动开发服务）
npx playwright test
```

生产构建产物会生成在 `dist/` 目录。

Playwright 配置默认使用 `/opt/chromium.org/chromium/chrome` 启动 Chromium，可通过环境变量 `PLAYWRIGHT_CHROMIUM_PATH` 指定其他浏览器路径。

## 演示服务端

`server/` 目录下是一个最小化的 Express 服务，仅提供 `GET /ping` 健康检查接口，监听 `3001` 端口。

```bash
cd server
npm install
npm run dev
```

## 预览模式

访问以下地址可以直接进入已绑定餐桌并带有购物车数据的菜单预览：

```text
http://localhost:5173/?preview=menu
```

实际端口以 Vite 启动日志为准。

## 部署

推送到 `main` 分支会触发 `.github/workflows/deploy-pages.yml`，自动构建并将 `dist/` 部署到 GitHub Pages。Vite 配置了 `base: './'`，构建产物可以部署在任意子路径下。

## 容器化部署（Docker）

`Dockerfile` 先用 Node 20 构建站点，再用 nginx 在 80 端口托管 `dist/`。`nginx.conf` 会把未知路径回退到 `index.html`，并对 `/assets/` 下带哈希的文件缓存一年。

```bash
# 构建镜像
docker build -t feidian-hotpot .

# 后台运行，映射到本机 8080 端口
docker run -d --name feidian-hotpot -p 8080:80 feidian-hotpot
```

启动后访问 `http://localhost:8080`。停止并删除容器：`docker rm -f feidian-hotpot`。

镜像只包含前端页面，不包含 `server/` 下的演示服务端。

## 项目结构

```text
.
├── .github/workflows/      # GitHub Pages 部署
├── docs/specs/             # 需求澄清文档
├── e2e/                    # Playwright 端到端测试
├── openspec/               # OpenSpec 变更提案与规格
├── server/                 # 演示服务端（Express）
├── src/
│   ├── assets/             # 图片资源
│   ├── components/         # 页面及通用组件
│   ├── data/               # 菜单等演示数据
│   ├── hooks/              # React Hooks（主题、货币、老人模式）
│   ├── lib/                # 工具函数、货币换算与格式化
│   ├── state/              # 订单状态管理
│   ├── App.tsx             # 应用入口组件
│   ├── i18n.ts             # 中英文文案
│   └── index.css           # 全局样式
├── Dockerfile              # 容器镜像构建
├── index.html
├── nginx.conf              # 镜像内的 nginx 配置
├── playwright.config.ts
├── tailwind.config.js
└── vite.config.ts
```
