const { REACT_APP_ENV } = process.env;
const development = {
  '/base': 'http://localhost:8000/bg',
};

const test = {
  '/base': 'https://api-test.taocheche.com/bg',
};

const pre = {
  '/base': 'https://api.taocheche.com/bg',
};

export const hostsObj = {
  development,
  test,
  pre,
};

export default { development, test, pre }[REACT_APP_ENV || 'development'];
