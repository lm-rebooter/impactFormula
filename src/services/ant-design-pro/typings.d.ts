// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
  type AreaList = {
    data?: string[];
    /** 列表的内容总数 */
    total?: number;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    name?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
    name?: string;
    email?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  // 通用 API 响应结构
  type ApiResponse<T = any> = {
    code: number;
    success: boolean;
    message?: string;
    data: T;
  };

  // getRescues 接口返回的数据部分
  type RescuePageData = {
    page: {
      content: RuleListItem[];
      totalElements: number;
      totalPages?: number;
      size?: number;
      number?: number;
    };
    totalFoodRescued?: number;
    co2Saved?: number;
    waterSaved?: number;
    equivTreesPlanted?: number;
    carKMOffTheRoad?: number;
    electricitySaved?: number;
    naturalGasSaved?: number;
  };

  // formula 接口返回的数据部分
  type FormulaResultData = {
    c02Saved?: number; // 保持现有代码中的拼写，但建议统一为 co2Saved
    waterSaved?: number;
    equivTreesPlanted?: number;
    carKMOffTheRoad?: number;
    electricitySaved?: number;
    naturalGasSaved?: number;
  };
}
