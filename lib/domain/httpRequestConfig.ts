import {AxiosRequestConfig, InternalAxiosRequestConfig} from 'axios'

/**
 * 每次请求的配置
 */
export interface HttpRequestConfig<D> extends AxiosRequestConfig<D> {

  /**
   * 是否加密body体
   */
  encrypt?: boolean

  /**
   * aes加密key
   */
  aesKey?: string

}

/**
 * httpClient内部请求配置
 */
export interface InternalRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {
  /**
   * 是否加密body体
   */
  encrypt?: boolean

  /**
   * aes加密key
   */
  aesKey?: string
}

