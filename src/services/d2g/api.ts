// @ts-ignore
/* eslint-disable */

import { request } from '@umijs/max';
import HOST from '../../../config/hosts';

// 注册接口
export async function register(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/account/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/account/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/account/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/account/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 修改密码 */
export async function changePassword(
  body: { email: any; oldPassword: any; newPassword: any },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/account/changePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取 Dashboard列表  */
export async function getRescues(
  params: {
    page?: number;
    pageSize?: number;
    [key: string]: any;
  } = {},
  options?: { [key: string]: any },
) {
  // 默认分页参数
  const defaultParams = {
    page: 1,
    pageSize: 50,
  };
  return request<API.ApiResponse<API.RescuePageData>>('/api/d2l/rescue', {
    method: 'GET',
    params: {
      ...defaultParams,
      ...params,
    },
    ...(options || {}),
  });
}

// 上传接口
export const uploadFileWuliuExcel = `${HOST['/base']}/api/d2l/rescue/upload/csv`;

// 获取site
export async function getAllSites(options?: { [key: string]: any }) {
  return request<API.ApiResponse<string[]>>('/api/d2l/rescue/sites', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取area
export async function getAllAreas(params?: {}, options?: { [key: string]: any }) {
  return request<API.ApiResponse<string[]>>('/api/d2l/rescue/areas', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// api/d2l/rescue/export/csv?startDate=2024-01-01&endDate=2024-01-01&site=FL,WB

// 导出
export async function exportCsv(
  params: {
    page?: number;
    pageSize?: number;
    [key: string]: any;
  } = {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.RescuePageData>>('/api/d2l/rescue/export/csv', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
//
export async function formula(
  params: {
    weight?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.FormulaResultData>>('/api/d2l/formula', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getTotalWeight(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/d2l/rescue/totalWeight', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出html
export async function exportHtmlFL(
  params: {
    site?: string;
    area?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.FormulaResultData>>('/api/d2l/statistics/export/html', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
