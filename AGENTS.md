# AGENTS.md

面向 AI 编码 Agent 的作业指导书。人类读者请先看 [README.md](./README.md)。

## 项目概览

沸点火锅点单概念 Demo（`hdl-order-demo`）：纯前端的移动端点单原型，覆盖绑桌、多人点餐、出餐进度、呼叫服务、模拟结账。**没有真实后端、支付或账号体系**，所有数据都是本地 mock。

## 技术栈

版本以 `package.json` / `server/package.json` 中的声明为准。

| 领域 | 选型 | 说明 |
| --- | --- | --- |
| 语言 | TypeScript ~5.6 | `tsconfig.app.json` 开启严格模式；`npm run build` 先跑 `tsc -b` |
| UI 框架 | React 18.3 | 函数组件 + hooks；全局状态用 `useReducer`（`src/state/orderReducer.ts`），没有 Redux 等状态库 |
| 构建 | Vite 6 + `@vitejs/plugin-react` | `@` 别名指向 `src/`；`base: './'` 以支持 Pages 子路径 |
| 样式 | Tailwind CSS 3 + PostCSS + Autoprefixer | `darkMode: 'class'`；品牌色在 `tailwind.config.js` 扩展 |
| 组件基础 | Radix UI Dialog（`@radix-ui/react-tabs` 已安装但目前未使用）、shadcn 风格封装 | 基础组件在 `src/components/ui/`，变体用 `class-variance-authority` |
| 类名工具 | `clsx` + `tailwind-merge` | 统一通过 `cn()`（`src/lib/utils.ts`） |
| 图标 | `lucide-react` | 不要再引入其他图标库 |
| 国际化 | i18next + react-i18next | 仅 `zh` / `en`，文案集中在 `src/i18n.ts` |
| 代码检查 | ESLint 9（flat config）+ typescript-eslint + react-hooks + react-refresh | `--max-warnings 0` |
| 测试 | Playwright 1.6x | 只有 E2E，没有单元测试框架 |
| 演示服务端 | Express 4 + `tsx`（`server/`） | 独立包，`GET /ping`，端口 3001，前端目前不调用 |
| CI / 部署 | GitHub Actions → GitHub Pages | `.github/workflows/deploy-pages.yml`，Node 20，push 到 `main` 触发 |

引入新依赖前先确认现有栈里没有能完成同样事情的库；不要引入第二套 UI 库、状态库或 CSS 方案。

## 环境与命令

包管理器用 **npm**（CI 跑 `npm ci`，以 `package-lock.json` 为准）。仓库里的 `pnpm-lock.yaml` / `pnpm-workspace.yaml` 不参与 CI，改依赖时不要只更新 pnpm 锁文件。

```bash
npm install          # 安装依赖（Node 18+，CI 用 20）
npm run dev          # 开发服务器，http://localhost:5173
npm run lint         # ESLint，--max-warnings 0，任何 warning 都算失败
npm run build        # tsc -b 类型检查 + vite build 到 dist/
npx playwright test  # E2E，会自动拉起 dev server
```

- Playwright 默认使用 `/opt/chromium.org/chromium/chrome`，路径不同时设置 `PLAYWRIGHT_CHROMIUM_PATH`。**不要**运行 `playwright install`。
- 跑单个 spec：`npx playwright test e2e/multi-currency.spec.ts`。
- 调试菜单页可直接访问 `http://localhost:5173/?preview=menu`（已绑 A08 桌、购物车有一件商品）。
- `server/` 有自己的 `package.json`：`cd server && npm install && npm run dev`，类型检查用 `npm run typecheck`。

## 提交前必须通过

1. `npm run lint`（零 warning）
2. `npm run build`（CI 只跑这一步，失败即部署失败）
3. 改动影响 UI 或交互时，跑相关的 `npx playwright test e2e/<spec>`；新增功能要补 E2E 用例

改了 `server/` 时额外跑 `cd server && npm run typecheck`。

## 目录与职责

```text
src/
├── App.tsx              # 根组件：视图切换、弹层、顶栏/底栏；?preview=menu 预览状态
├── main.tsx             # 入口，挂载 CurrencyProvider
├── types.ts             # 全部领域类型与 AppAction 联合类型
├── state/orderReducer.ts# 唯一的全局状态 reducer（useReducer）
├── data/menu.ts         # 菜品、分类、桌台 mock 数据
├── i18n.ts              # zh / en 全部文案 + i18next 初始化
├── hooks/               # 主题、货币、长辈模式
├── lib/utils.ts         # cn()、货币类型、汇率、money() 格式化
├── components/          # 各视图（*View.tsx）与弹层
│   └── ui/              # shadcn 风格基础组件（button、dialog）
└── index.css            # 全局样式、长辈模式覆盖
e2e/                     # Playwright 用例
openspec/                # OpenSpec 变更提案（spec-driven）
docs/specs/              # 需求澄清文档
```

## 编码约定

### 通用

- 导入 `src/` 下的模块统一用 `@/` 别名（如 `@/lib/utils`），不要写相对路径穿越目录。
- 类型导入用 `import type`。
- 代码风格沿用现有文件：2 空格缩进、单引号、无分号。仓库没有 Prettier，靠手动保持一致。
- 注释用中文，写"为什么"，与周边文件密度一致。
- `react-refresh/only-export-components` 规则会报 warning，而 lint 不容忍 warning：一个 `.tsx` 文件只导出组件。需要共享的 context、常量、hook 放到单独的 `.ts` 文件（参考 `hooks/currency-context.ts` + `hooks/use-currency.ts` + `hooks/useCurrency.tsx` 的拆分）。

### 状态

- 全局业务状态只经过 `orderReducer`。新增行为时：先在 `types.ts` 的 `AppAction` 加分支，再在 reducer 里实现，保持不可变更新。
- reducer 里给用户的提示写入 `lastMessage`，文案用 `i18next.t(...)`，不要硬编码。
- 主题、货币、长辈模式这类偏好是独立 hook，不进 reducer。

### 国际化

- 所有用户可见文本（包括 `aria-label`、`document.title`）都走 i18n，不允许硬编码中文或英文。
- 新增 key 时 **`zh` 和 `en` 两份必须同时加**，结构保持一致。默认语言和 fallback 都是 `zh`。
- `data/menu.ts` 里的菜名、描述、选项存的是 i18n key，渲染时再 `t()`。

### 金额与货币

- 所有价格在数据和状态里都是 **CNY 底价**，只在展示时调用 `money(value, currency)` 换算。
- 合计金额先按 CNY 累加，再整体换算，不要逐项换算后相加。
- 汇率是 `lib/utils.ts` 里的固定值，不要接入实时汇率。JPY / TWD 显示整数，其他两位小数。
- 新增货币需同时改 `Currency` 类型、`CURRENCIES`、`rates`、`currencySymbol`、`currencyFormatter`，以及 i18n 的 `common.currency.*`。

### 样式与主题

- 用 Tailwind 工具类，合并类名用 `cn()`。优先使用 `tailwind.config.js` 里的品牌色（`rice`、`chili`、`amber`、`charcoal`）。
- 深色模式是 `darkMode: 'class'`（`<html class="dark">`）。新增或修改的 UI 都要同时写 `dark:` 变体，现有组件都是这样做的。
- 长辈模式通过根节点 `.elderly` 类放大字号，必要的覆盖写在 `index.css`。

### 本地存储

- 读写 `localStorage` 一律包在 `try/catch` 里，失败时降级为内存态，不报错不阻塞（见 `useTheme.ts`）。
- 现有 key：`theme`、`currency`、`elderly-mode`、`i18nextLng`。改名会让老用户的偏好失效，同时会影响 E2E（`playwright.config.ts` 预置了 `theme=light`）。

## E2E 测试约定

- 文件放在 `e2e/`，命名 `<feature>.spec.ts`；用例名带编号前缀，如 `CUR-001: ...`、`DARK-003: ...`。
- 定位优先用 `getByRole` + 名称正则，并同时匹配中英文：`/切换主题|Toggle theme/`。
- 进入菜单页可用 `page.goto('/?preview=menu')`，或按真实流程点击 A08 桌再"进入点餐"。
- 配置是串行（`workers: 1`）、不重试；不要靠加 `retries` 或 `test.skip` 让测试变绿。
- 测试基线是浅色主题；需要别的主题时在用例里显式切换。

## 规格与需求流程

- 较大的功能先在 `openspec/changes/<change-name>/` 写 `proposal.md`、`design.md`、`tasks.md` 和 `specs/`，参考 `cart-recommendations`。完成一项任务就在 `tasks.md` 里勾选 `[x]`，每项任务写明验证方式。
- 需求有歧义时先查 `docs/specs/`，仍不清楚就向人确认，不要自行发明业务规则。

## 提交与 PR

- 提交信息用 Conventional Commits：`feat:`、`fix:`、`docs:`、`test:` 等，描述可以中文或英文。
- 一个 PR 只做一件事；不要顺手重构无关代码。
- 不要提交 `node_modules/`、`dist/`、`e2e-report/`、`test-results/`、`.vefaas/`。
- 改了 README 时，`README.md`、`README.zh-CN.md`、`README.ja.md` 三个语言版本要同步。

## 不要做的事

- 不要引入真实支付、账号、实时汇率或外部 API 调用；这是概念 Demo，页面上的"概念演示 / 非官方"标识不能移除。
- 不要改 `vite.config.ts` 的 `base: './'`，GitHub Pages 子路径部署依赖它。
- 不要绕过 lint（加 `eslint-disable`）或类型检查（`any`、`@ts-ignore`）来通过 CI。
- 不要手改 `package-lock.json`，依赖变更用 `npm install <pkg>` 生成。
