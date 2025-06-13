import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import Cookies from 'js-cookie';
// Error handling scheme: error types
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// Response data format agreed with the backend
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name Error Handling
 * Error handling provided by pro, you can make your own changes here
 * @doc https://umijs.org/docs/max/request#configuration
 */
export const errorConfig: RequestConfig = {
  // Error handling: error handling scheme of umi@3.
  errorConfig: {
    // Error throwing
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // Throw custom error
      }
    },
    // Error receiving and handling
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // Error thrown by our errorThrower.
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios error
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
        message.error('None response! Please retry.');
      } else {
        // Something happened in setting up the request
        message.error('Request error, please retry.');
      }
    },
  },

  // Request interceptors
  requestInterceptors: [
    (config: RequestOptions) => {
      // Intercept request config for customization.
      const token = Cookies.get('token');
      // Do not add Authorization header for login and register
      const isAuthApi =
        config?.url?.includes('/api/account/login') ||
        config?.url?.includes('/api/account/register');
      if (token && !isAuthApi) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${Cookies.get('token')}`,
        };
      }
      let url = config?.url;
      console.log(url, 'urlurl');
      // api/account/login
      // /api/account/register

      if (config?.url && config.url.indexOf('http') !== 0) {
        if (process.env.RUNTIME_ENV !== 'production') {
          // Enable mock mode for local debugging
          if (process.env.MOCK === 'yes') {
            url = `${config.url}`;
          } else {
            url = `//1.15.25.13:8080${url}`;
          }
        } else {
          //  url = `//1.15.25.13:8080/${url}`;
          url = `//1.15.25.13:8080${url}`;
        }
      }

      console.log({ ...config, url }, '{ ...config, url }');

      // const url = config?.url?.concat('?token = 123');
      return { ...config, url };
    },
  ],

  // Response interceptors
  responseInterceptors: [
    (response) => {
      // Intercept response data for customization
      const { data } = response as unknown as ResponseStructure;

      if (data?.success === false) {
        message.error('Request failed!');
      }
      return response;
    },
  ],
};
