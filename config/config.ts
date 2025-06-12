// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import { join } from 'path';
import defaultSettings from './defaultSettings';
// import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV = 'dev' } = process.env;

console.log('--------9--------', REACT_APP_ENV);
// console.log(process,'--------10--------');

// console.log('--------13--------',proxy[REACT_APP_ENV as keyof typeof proxy]);
export default defineConfig({
  /**
   * @name Enable hash mode
   * @description Let the build output include a hash suffix. Usually used for incremental release and to avoid browser cache loading.
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  /**
   * @name Compatibility settings
   * @description Setting ie11 may not be perfectly compatible, you need to check all dependencies you use
   * @doc https://umijs.org/docs/api/config#targets
   */
  // targets: {
  //   ie: 11,
  // },
  /**
   * @name Route configuration, files not imported in the route will not be compiled
   * @description Only supports configuration of path, component, routes, redirect, wrappers, title
   * @doc https://umijs.org/docs/guides/routes
   */
  // umi routes: https://umijs.org/docs/routing
  routes,
  /**
   * @name Theme configuration
   * @description Although it is called theme, it is actually just a less variable setting
   * @doc antd theme settings https://ant.design/docs/react/customize-theme-cn
   * @doc umi theme configuration https://umijs.org/docs/api/config#theme
   */
  theme: {
    // If you don't want configProvide dynamic theme setting, set this to default
    // Only when set to variable, can you use configProvide to dynamically set the main color
    'root-entry-name': 'variable',
  },
  /**
   * @name moment internationalization configuration
   * @description If you have no requirements for internationalization, turning it on can reduce the size of the js package
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,
  /**
   * @name Proxy configuration
   * @description Allows your local server to proxy to your server, so you can access server data
   * @see Note: Proxy can only be used during local development, not after build.
   * @doc Proxy introduction https://umijs.org/docs/guides/proxy
   * @doc Proxy configuration https://umijs.org/docs/api/config#proxy
   */
  // proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  proxy: {
    '/api': {
      // The address to be proxied
      target: 'http://api-test.taocheche.com/',
      // Configuring this allows http to be proxied to https
      // Features that depend on origin may need this, such as cookies
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  /**
   * @name Fast refresh configuration
   * @description A good hot update component that can retain state during updates
   */
  fastRefresh: true,
  //============== The following are max plugin configurations ===============
  /**
   * @name Data flow plugin
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * A global initial data flow, which can be used to share data between plugins
   * @description Can be used to store some global data, such as user information or some global state. The global initial state is created at the very beginning of the entire Umi project.
   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @name layout plugin
   * @doc https://umijs.org/docs/max/layout-menu
   */
  title: 'D2L-GoodHood.SG',
  layout: {
    locale: true,
    ...defaultSettings,
  },
  /**
   * @name moment2dayjs plugin
   * @description Replace moment in the project with dayjs
   * @doc https://umijs.org/docs/max/moment2dayjs
   */
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  /**
   * @name Internationalization plugin
   * @doc https://umijs.org/docs/max/i18n
   */
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  /**
   * @name antd plugin
   * @description Built-in babel import plugin
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {},
  /**
   * @name Network request configuration
   * @description Provides a unified network request and error handling solution based on axios and ahooks' useRequest.
   * @doc https://umijs.org/docs/max/request
   */
  request: {},
  /**
   * @name Access control plugin
   * @description Access control plugin based on initialState, must enable initialState first
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  /**
   * @name Extra scripts in <head>
   * @description Configure extra scripts in <head>
   */
  headScripts: [
    // Solve the problem of white screen on first load
    { src: '/scripts/loading.js', async: true },
  ],
  //================ pro plugin configuration =================
  presets: ['umi-presets-pro'],
  /**
   * @name openAPI plugin configuration
   * @description Generate serve and mock based on openapi specification, can reduce a lot of boilerplate code
   * @doc https://pro.ant.design/zh-cn/docs/openapi/
   */
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      // Or use the online version
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  mfsu: {
    strategy: 'normal',
  },
  esbuildMinifyIIFE: true,
  requestRecord: {},
});
