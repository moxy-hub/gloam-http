import {CreateAxiosDefaults} from "axios";
import {Filter} from "../filter/filter";
import {HttpEvent} from "../event/httpEvent";

/**
 * 创建httpClient的参数
 */
export interface HttpClientOptions extends CreateAxiosDefaults {

  /**
   * 请求基础配置
   */
  requestOptions?: RequestOptions

  /**
   * token机制
   */
  requestToken?: RequestToken

  /**
   * 加密配置
   */
  webEnvelope?: WebEnvelope

  /**
   * 请求重试机制
   */
  retryRequest?: RetryRequest

  /**
   * 过滤器
   */
  filters?: Array<Filter>

  /**
   * 事件系统
   */
  event?: HttpEvent
}

/**
 * 基础配置
 */
export interface RequestOptions {
  /**
   * post请求的时候添加参数到url
   */
  joinParamsToUrl?: boolean

  /**
   * 格式化提交参数时间
   */
  formatDate?: boolean

  /**
   * 【目前未实现】是否返回原生响应头 比如：需要获取响应头时使用该属性
   */
  isReturnNativeResponse?: boolean

  /**
   * 默认将prefix 添加到url
   */
  joinPrefix?: boolean

  /**
   * 接口地址
   */
  apiUrl?: string

  /**
   * 接口拼接地址
   */
  urlPrefix?: string

  /**
   * 是否加入时间戳
   */
  joinTime?: boolean

  /**
   * 【目前未实现】忽略重复请求
   */
  ignoreCancelToken?: boolean
}

/**
 * token配置
 */
export interface RequestToken {
  /**
   * 是否开启token认证
   */
  enable?: boolean

  /**
   * 认证信息前缀
   */
  authenticationScheme?: string

  /**
   * 认证信息aes加密密钥
   */
  aesKey?: string

  /**
   * 认证信息token分割
   */
  split?: string
}

/**
 * 加解密配置
 */
export interface WebEnvelope {
  enable?: boolean
}

export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}
