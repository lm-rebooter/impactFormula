# D2L-GoodHood.SG

## 项目前端技术栈分析与功能说明

### 一、技术栈介绍

#### 1. 框架与核心库
- **React 18**：现代前端开发的主流库，负责构建用户界面。
- **UmiJS (max)**：基于 Umi 的企业级前端框架，支持约定式路由、插件机制、工程化能力。
- **Ant Design 5** 及 **@ant-design/pro-components**：企业级 UI 组件库，提供丰富的高质量 React 组件，提升开发效率和界面一致性。
- **TypeScript**：为 JavaScript 提供类型系统，提升代码可维护性和开发体验。
- **Dayjs/Moment**：日期处理库，便于时间格式化与计算。
- **Lodash**：实用函数库，简化数据处理。
- **classnames**：动态拼接 className 字符串的工具。
- **js-cookie**：简化 Cookie 操作。
- **react-helmet-async**：管理页面 <head> 元素，支持 SEO 优化。
- **react-pdf**：PDF 文件的渲染与预览。

#### 2. 工程化与开发工具
- **Umi Max CLI**：统一的开发、构建、预览命令。
- **Jest**：单元测试框架。
- **ESLint/Prettier**：代码风格与质量检查。
- **Husky/lint-staged**：Git 钩子，保障提交代码质量。
- **cross-env**：跨平台设置环境变量。
- **gh-pages**：一键部署静态站点到 GitHub Pages。

#### 3. 其他
- **MockJS**：本地数据模拟，便于前后端并行开发。
- **Swagger/OpenAPI**：API 文档与自动生成接口代码。

### 二、如何启动与打包项目

#### 1. 安装依赖
```bash
npm install
# 或
yarn
```

#### 2. 启动开发环境
```bash
npm start
# 或
npm run start:dev
```
- 默认端口：8000（可在 `config/config.ts` 中自定义）

#### 3. 打包生产环境
```bash
npm run build
```
- 打包输出目录：`/dist`
- 可通过 `npm run preview` 进行本地预览

#### 4. 其他常用命令
- 代码风格检查：`npm run lint`
- 自动修复代码风格：`npm run lint:fix`
- 单元测试：`npm test`
- 部署到 GitHub Pages：`npm run deploy`

### 三、项目结构与主要功能说明

#### 1. 目录结构简述
- `/src`
  - `components/`：通用业务组件
  - `pages/`：页面级组件，按路由划分
  - `services/`：接口请求与数据服务
  - `utils/`：工具函数
  - `locales/`：多语言配置
  - `app.tsx`：应用入口
  - `global.tsx`：全局配置
- `/config`
  - `config.ts`：Umi 配置
  - `routes.ts`：路由配置
  - `defaultSettings.ts`：主题与布局配置
  - `hosts.ts`：环境主机配置
  - `oneapi.json`：API 配置
- `manifest.json`：PWA 配置
- `service-worker.js`：离线缓存配置

#### 2. 主要功能模块
- **多语言国际化**：支持多语言切换，适配全球化需求。
- **权限与访问控制**：通过 `access.ts` 配置不同角色的访问权限。
- **全局错误处理**：`requestErrorConfig.ts` 统一处理接口异常。
- **主题与布局自定义**：支持主题色、布局风格切换。
- **Mock 数据支持**：开发环境下可模拟接口数据。
- **PWA 支持**：支持离线访问与缓存。
- **自动化测试与代码质量保障**：集成 Jest、ESLint、Prettier、Husky 等工具。

#### 3. 典型页面与业务流程
- 登录/注册/权限校验
- 数据列表与详情页（表格、表单、图表等）
- 复杂表单与流程审批
- 文件上传与下载
- PDF 预览
- 多端适配与响应式布局

### 四、最佳实践与开发建议

- 推荐使用 TypeScript 进行开发，提升类型安全。
- 组件开发优先复用 `components/` 下的通用组件。
- 路由页面建议按业务模块划分，便于维护。
- 接口请求统一通过 `services/` 目录管理，便于 Mock 与真实数据切换。
- 样式优先使用 Ant Design 组件自带样式，必要时可用 TailwindCSS 或自定义 less。
- 严格遵循代码规范，提交前确保通过 lint 检查。
