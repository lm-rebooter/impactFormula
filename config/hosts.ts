const { REACT_APP_ENV } = process.env;
const development = {
  '/base': 'http://1.15.25.13:8080',
};

const test = {
  '/base': 'http://1.15.25.13:8080',
};

const pre = {
  '/base': 'http://1.15.25.13:8080',
};

export const hostsObj = {
  development,
  test,
  pre,
};

export default { development, test, pre }[REACT_APP_ENV || 'development'];
