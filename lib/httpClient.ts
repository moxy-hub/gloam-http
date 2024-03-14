import axios, {AxiosInstance} from 'axios'
import {HttpClientOptions} from "./domain/httpClientOptions";
import {FilterAssembler} from "./filter/filterAssembler";
import {Result} from "./domain/result";
import {HttpRequestConfig} from "./domain/httpRequestConfig";
import {deepClone, setObjToUrlParams} from "./util/beanUtils";
import {ContentTypeEnum, MethodEnum} from "./enum";


/**
 * 基于axios的http请求客户端
 */
export class HttpClient {

  /**
   * axios实例
   */
  private readonly axiosInstance: AxiosInstance;

  /**
   * 创建参数
   */
  private readonly options: HttpClientOptions;

  constructor(options: HttpClientOptions) {
    this.options = options;
    // 创建axios
    this.axiosInstance = axios.create(options);
    // 初始化过滤器
    FilterAssembler.assemble(this.axiosInstance, this.options)
  }

  /**
   * 获取axios实例
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * 设置通用请求头
   */
  public setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  public get<T extends Result>(config: HttpRequestConfig<any>): Promise<T> {
    return this.request({...config, method: MethodEnum.GET});
  }

  public post<T extends Result>(config: HttpRequestConfig<any>): Promise<T> {
    return this.request({...config, method: MethodEnum.POST});
  }

  public put<T extends Result>(config: HttpRequestConfig<any>): Promise<T> {
    return this.request({...config, method: MethodEnum.PUT});
  }

  public delete<T extends Result>(config: HttpRequestConfig<any>): Promise<T> {
    return this.request({...config, method: MethodEnum.DELETE});
  }

  /**
   * 基础请求处理
   */
  private request<T extends Result>(
    config: HttpRequestConfig<any>,
  ): Promise<T> {
    // 将内部配置参数进行拷贝
    let innerConfig: HttpRequestConfig<any> = deepClone(config);

    // cancelToken 如果被深拷贝，会导致最外层无法使用cancel方法来取消请求
    if (config.cancelToken) {
      innerConfig.cancelToken = config.cancelToken;
    }
    if (config.signal) {
      innerConfig.signal = config.signal;
    }
    innerConfig = this.supportFormData(innerConfig);
    return this.axiosInstance.request(innerConfig) as Promise<T>;
  }

  /**
   * formData支持,在请求type为formData的时候，自动转化
   */
  private supportFormData(config: HttpRequestConfig<any>) {

    // get请求强制formdata
    if (config.method?.toUpperCase() === MethodEnum.GET) {
      return this.buildFormData(config);
    }
    const headers = config.headers || this.options.headers;
    const contentType = headers?.["Content-Type"] || headers?.["content-type"];
    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, "data")
    ) {
      return config;
    }

    return this.buildFormData(config);
  }

  private buildFormData(config: HttpRequestConfig<any>) {
    if (!Reflect.has(config, "data")) {
      return config;
    }
    return {
      ...config,
      url: setObjToUrlParams(config.url, config.data),
      data: null,
    };
  }
}
