/**
 * @name umi route configuration
 * @description Only supports configuration of path, component, routes, redirect, wrappers, name, icon
 * @param path  path only supports two types of placeholders, the first is the dynamic parameter :id, the second is the * wildcard, which can only appear at the end of the route string.
 * @param component The React component path rendered after location and path match. It can be an absolute path or a relative path. If it is a relative path, it will start from src/pages.
 * @param routes Configure sub-routes, usually used when you need to add a layout component for multiple paths.
 * @param redirect Configure route redirection
 * @param wrappers Configure route component wrapper components, which can be used to add more features to the current route component. For example, it can be used for route-level permission verification
 * @param name Configure the route title. By default, it reads the value of menu.xxxx in the internationalization file menu.ts. For example, if name is set to login, it reads the value of menu.login in menu.ts as the title
 * @param icon Configure the route icon. Refer to https://ant.design/components/icon-cn. Note to remove the style suffix and case. For example, if you want to configure the icon as <StepBackwardOutlined />, the value should be stepBackward or StepBackward. If you want to configure the icon as <UserOutlined />, the value should be user or User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './Dashboard',
  },
  {
    path: '/reports',
    name: 'reports', 
    icon: 'CheckCircleOutlined',
    component: './Reports',
  },
  {
    path: '/impactFormula',
    name: 'impactFormula',
    icon: 'form',
    component: './ImpactFormula',
  },
  {
    name: 'account',
    icon: 'user',
    path: '/account',
    routes: [
      {
        path: '/account',
        redirect: '/account/settings',
      },
      {
        name: 'settings',
        icon: 'smile',
        path: '/account/settings',
        component: './account/settings',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
