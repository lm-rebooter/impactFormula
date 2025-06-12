# D2L-GoodHood.SG

## Frontend Tech Stack Analysis & Feature Description

### 1. Tech Stack Overview

#### 1. Frameworks & Core Libraries
- **React 18**: The mainstream library for modern frontend development, responsible for building user interfaces.
- **UmiJS (max)**: Enterprise-level frontend framework based on Umi, supporting convention-based routing, plugin mechanism, and engineering capabilities.
- **Ant Design 5** & **@ant-design/pro-components**: Enterprise-level UI component library, providing rich, high-quality React components to improve development efficiency and UI consistency.
- **TypeScript**: Adds a type system to JavaScript, improving code maintainability and development experience.
- **Dayjs/Moment**: Date processing libraries for easy formatting and calculation.
- **Lodash**: Utility library to simplify data processing.
- **classnames**: Tool for dynamically joining className strings.
- **js-cookie**: Simplifies cookie operations.
- **react-helmet-async**: Manages <head> elements for SEO optimization.
- **react-pdf**: Rendering and previewing PDF files.

#### 2. Engineering & Development Tools
- **Umi Max CLI**: Unified commands for development, build, and preview.
- **Jest**: Unit testing framework.
- **ESLint/Prettier**: Code style and quality checking.
- **Husky/lint-staged**: Git hooks to ensure code quality before commits.
- **cross-env**: Cross-platform environment variable setting.
- **gh-pages**: One-click deployment of static sites to GitHub Pages.

#### 3. Others
- **MockJS**: Local data mocking for parallel frontend-backend development.
- **Swagger/OpenAPI**: API documentation and auto-generated interface code.

### 2. How to Start & Build the Project

#### 1. Install Dependencies
```bash
npm install
# or
yarn
```

#### 2. Start Development Server
```bash
npm start
# or
npm run start:dev
```
- Default port: 8000 (can be customized in `config/config.ts`)

#### 3. Build for Production
```bash
npm run build
```
- Build output directory: `/dist`
- Local preview: `npm run preview`

#### 4. Other Common Commands
- Code style check: `npm run lint`
- Auto-fix code style: `npm run lint:fix`
- Unit tests: `npm test`
- Deploy to GitHub Pages: `npm run deploy`

### 3. Project Structure & Main Features

#### 1. Directory Structure Overview
- `/src`
  - `components/`: Common business components
  - `pages/`: Page-level components, organized by route
  - `services/`: API requests and data services
  - `utils/`: Utility functions
  - `locales/`: i18n configuration
  - `app.tsx`: App entry
  - `global.tsx`: Global configuration
- `/config`
  - `config.ts`: Umi configuration
  - `routes.ts`: Route configuration
  - `defaultSettings.ts`: Theme and layout configuration
  - `hosts.ts`: Environment host configuration
  - `oneapi.json`: API configuration
- `manifest.json`: PWA configuration
- `service-worker.js`: Offline cache configuration

#### 2. Main Feature Modules
- **Multilingual Internationalization**: Supports language switching for global needs.
- **Permission & Access Control**: Configure access for different roles via `access.ts`.
- **Global Error Handling**: Unified API error handling in `requestErrorConfig.ts`.
- **Theme & Layout Customization**: Supports theme color and layout style switching.
- **Mock Data Support**: Simulate API data in development.
- **PWA Support**: Offline access and caching.
- **Automated Testing & Code Quality**: Integrated with Jest, ESLint, Prettier, Husky, etc.

#### 3. Typical Pages & Business Flows
- Login/Registration/Permission Check
- Data lists and detail pages (tables, forms, charts, etc.)
- Complex forms and approval flows
- File upload and download
- PDF preview
- Multi-device adaptation and responsive layout

### 4. Best Practices & Development Suggestions

- It is recommended to use TypeScript for development to improve type safety.
- Prefer reusing common components in `components/` for component development.
- Organize route pages by business module for easier maintenance.
- Manage API requests uniformly in the `services/` directory for easy switching between mock and real data.
- Prefer using Ant Design built-in styles for UI; use TailwindCSS or custom less only when necessary.
- Strictly follow code conventions and ensure lint passes before commit.
