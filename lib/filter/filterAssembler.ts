import {AxiosInstance, AxiosResponse} from "axios";
import {Filter} from "./filter";
import {InternalRequestConfig} from "../domain/httpRequestConfig";
import {HttpClientOptions} from "../domain/httpClientOptions";
import {Result} from "../domain/result";
import {defaultFilter} from "./default";
import {encryptFilter} from "./encrypt";
import {timeFilter} from "./time";

export class FilterAssembler {

  /**
   * 默认的过滤器
   */
  private static DEFAULT_FILTERS: Array<Filter> = [defaultFilter, encryptFilter, timeFilter]

  /**
   * 装配过滤器
   */
  public static assemble(axios: AxiosInstance, options: HttpClientOptions) {
    if (!axios) {
      throw new Error("[HttpClient]: 创建过滤器失败，axios实例为空")
    }
    const outFilters: Array<Filter> | undefined = options.filters
    // 合并两个数组的过滤器
    let filters = [...this.DEFAULT_FILTERS]
    if (outFilters != undefined) {
      filters = [...filters, ...outFilters]
    }
    // 过滤器进行排序
    let requestFiltersSorts = filters.sort((a, b) => b.order() - a.order());
    // 装配过滤器
    requestFiltersSorts.forEach(filter => {
      this.assembleRequestFilter(axios, filter, options)
    })
    let responseFiltersSorts = filters.sort((a, b) => a.order() - b.order());
    // 装配过滤器
    responseFiltersSorts.forEach(filter => {
      this.assembleResponseFilter(axios, filter, options)
    })
  }

  public static assembleRequestFilter(axios: AxiosInstance, filter: Filter, options: HttpClientOptions) {
    // 请求拦截器
    axios.interceptors.request.use((config: InternalRequestConfig) => {
        if (!filter.request) {
          console.debug("[HttpClient]: 在过滤器中没有监测到请求过滤器，跳过当前装配")
          return config
        }

        return filter.request(config, options)
      },
      (error) => {
        if (!filter.requestCatch) {
          console.debug("[HttpClient]: 在过滤器中没有监测到请求错误过滤器，跳过当前装配")
          return error
        }
        return filter.requestCatch(error, options)
      },
    )
  }

  public static assembleResponseFilter(axios: AxiosInstance, filter: Filter, options: HttpClientOptions) {
    // 响应拦截器
    axios.interceptors.response.use(
      (config: AxiosResponse | Result) => {
        if (!filter.response) {
          console.debug("[HttpClient]: 在过滤器中没有监测到响应过滤器，跳过当前装配")
          return config
        }
        // 这里不管是什么类型，都应该希望是Result
        return filter.response(config, options) as any
      },
      (error) => {
        if (!filter.responseCatch) {
          console.debug("[HttpClient]: 在过滤器中没有监测到响应错误过滤器，跳过当前装配")
          return error
        }
        return filter.responseCatch(axios, error, options)
      },
    )
  }
}
