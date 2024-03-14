import {Filter} from "../filter";
import {InternalRequestConfig} from "../../domain/httpRequestConfig";
import {HttpClientOptions} from "../../domain/httpClientOptions";
import {isString, setObjToUrlParams} from "../../util/beanUtils";
import {MethodEnum} from "../../enum";
import {formatRequestDate, joinTimestamp} from "./helper";
import {obtainEvent} from "../../event/httpEventHelper";
import {buildUUID} from "../../util/uuid";
import {aesEncryptHeader} from "../../util/encrypt";
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Result} from "../../domain/result";


/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const defaultFilter: Filter = {
    order(): number {
      return 0;
    },
    /**
     * 请求基础配置
     * 1、配置请求的requestOptions参数
     * 2、配置请求的token相关
     */
    request(config: InternalRequestConfig<any>, options: HttpClientOptions): InternalRequestConfig<any> {
      // 处理基础的请求配置
      config = handlerRequestOptions(config, options);
      // 处理token配置
      return handlerToken(config, options);
    },

    /**
     * 响应基础拦截，过滤含有认证信息的响应，将认证信息感知到外部
     * @description: 响应拦截器处理
     */
    response(res: AxiosResponse<Result> | Result, options: HttpClientOptions): AxiosResponse<Result> | Result {
      const event = obtainEvent(options);
      res = res as AxiosResponse<Result>;
      // 保存token
      if (res.headers['authorization']) {
        try {
          // @ts-ignore
          event?.authorizationTokenAware(res.headers['authorization']);
        } catch (error) {
          console.warn("请检查是否实现响应token感知事件", error);
        }
      }
      return res;
    },

    /**
     * 响应的错误拦截，将服务器返回的错误进行分组，然后使用不同的事件感知器回调到业务中
     * @param _axiosInstance
     * @param error
     * @param options
     */
    responseCatch(_axiosInstance: AxiosInstance, error: any, options: HttpClientOptions): Promise<Error> {
      const event = obtainEvent(options);
      const {response, code, message} = error || {};
      const msg: string = response?.data?.message ?? "";
      const err: string = error?.toString?.() ?? "";
      let errMessage = `${msg}`;
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }
      // todo 添加自动重试机制 保险起见 只针对GET请求
      // const retryRequest = new AxiosRetry();
      // const { isOpenRetry } = config.requestOptions.retryRequest;
      // config.method?.toUpperCase() === RequestEnum.GET &&
      //   isOpenRetry &&
      //   // @ts-ignore
      //   retryRequest.retry(axiosInstance, error);
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        errMessage = "请求超时";
        try {
          // @ts-ignore
          event?.onTimeoutError(error, errMessage);
        } catch (error) {
          console.warn("请检查是否实现状态错误感知", error);
        }
        return Promise.reject(error);
      }
      if (err?.includes("Network Error")) {
        errMessage = "网络错误";
        try {
          // @ts-ignore
          event?.onNetworkError(error, errMessage);
        } catch (error) {
          console.warn("请检查是否实现状态错误感知", error);
        }
        return Promise.reject(error);
      }
      try {
        // @ts-ignore
        event?.onStatusError(error, error?.response?.status, errMessage);
      } catch (error) {
        console.warn("请检查是否实现状态错误感知", error);
      }
      return Promise.reject(error);
    }
  }
;

const handlerToken = (config: InternalRequestConfig, options: HttpClientOptions): InternalRequestConfig => {
  if (!options.requestToken) {
    return config;
  }
  const {
    enable = false,
    authenticationScheme,
    aesKey,
    split
  } = options.requestToken!;
  if (!enable) {
    return config;
  }
  // 为每个请求添加nonce请求头
  config.headers = Object.assign({}, config.headers, {nonce: buildUUID()});
  const event = obtainEvent(options);
  // 请求之前处理config
  let token = null;
  try {
    // @ts-ignore
    token = event.authorizationTokenInfuse();
  } catch (error) {
    console.warn("调用token注入失败,请检查是否实现该方法", error);
  }
  if (!token) {
    console.error("[HttpClient]: 请求开启了token认证，但是没有在事件中获取到token，请检查相关代码");
    return config;
  }
  let authorization = aesEncryptHeader(token, config.headers.nonce, aesKey, split);
  if (authenticationScheme) {
    authorization = authenticationScheme + authorization;
  }
  (config as Record<string, any>).headers.Authorization = authorization;
  return config;
}
const handlerRequestOptions = (config: InternalRequestConfig, options: HttpClientOptions): InternalRequestConfig => {
  if (!options.requestOptions) {
    return config;
  }
  const {
    apiUrl,
    joinPrefix,
    formatDate,
    urlPrefix
  } = options.requestOptions;
  // 添加请求前缀
  if (joinPrefix) {
    config.url = `${urlPrefix}${config.url}`;
  }
  // 添加请求api
  if (apiUrl && isString(apiUrl)) {
    config.url = `${apiUrl}${config.url}`;
  }
  // 处理请求时间参数
  if (formatDate) {
    config = handlerFormDate(config, options)
  }
  return config;
}
const handlerFormDate = (config: InternalRequestConfig, options: HttpClientOptions): InternalRequestConfig => {
  const {
    joinParamsToUrl,
    formatDate,
    joinTime = true,
  } = options.requestOptions!;
  const params = config.params || {};
  const data = config.data || false;
  data && !isString(data) && formatRequestDate(data)
  if (config.method?.toUpperCase() === MethodEnum.GET) {
    if (!isString(params)) {
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
      config.params = Object.assign(
        params || {},
        joinTimestamp(joinTime, false)
      );
    } else {
      // 兼容restful风格
      config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
      config.params = undefined;
    }
  } else {
    if (!isString(params)) {
      formatDate && formatRequestDate(params);
      if (
        Reflect.has(config, "data") &&
        config.data &&
        (Object.keys(config.data).length > 0 ||
          config.data instanceof FormData)
      ) {
        config.data = data;
        config.params = params;
      } else {
        // 非GET请求如果没有提供data，则将params视为data
        config.data = params;
        config.params = undefined;
      }
      if (joinParamsToUrl) {
        config.url = setObjToUrlParams(
          config.url as string,
          Object.assign({}, config.params, config.data)
        );
      }
    } else {
      // 兼容restful风格
      config.url = config.url + params;
      config.params = undefined;
    }
  }
  return config;
}
