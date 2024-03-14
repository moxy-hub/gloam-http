import {HttpClientOptions} from "../domain/httpClientOptions";
import {AxiosInstance, AxiosResponse} from "axios";
import {Result} from "../domain/result";
import {InternalRequestConfig} from "../domain/httpRequestConfig";

/**
 * 基于axios实现的过滤器
 */
export interface Filter {

  /**
   * 请求拦截器
   */
  request?: (config: InternalRequestConfig<any>, options: HttpClientOptions) => InternalRequestConfig<any>

  /**
   * @description: 响应拦截器
   */
  response?: (res: AxiosResponse<Result> | Result, options: HttpClientOptions) => AxiosResponse<Result> | Result

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestCatch?: (error: Error, options: HttpClientOptions) => void

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseCatch?: (axiosInstance: AxiosInstance, error: Error, options: HttpClientOptions) => Promise<Error>

  /**
   * 执行顺序
   */
  order: () => number
}
