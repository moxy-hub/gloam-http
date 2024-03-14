import {Result} from "../domain/result";

export abstract class HttpEvent {
  /**
   * 在状态错误的请况下，状态不为200
   */
  onStatusError?: (error: Error, statusCode: number, massage: string) => void;

  /**
   * 请求超时错误
   */
  onTimeoutError?: (error: Error, defaultMessage: string) => void;

  /**
   * 网络错误
   */
  onNetworkError?: (error: Error, defaultMessage: string) => void;

  /**
   * 请求结果感知，可以全局拦截到请求结果，进行预处理
   */
  webResultAware?: (result: Result, url?: string) => void;

  /**
   * 响应token感知，如果响应存在token，则会进行感知
   */
  authorizationTokenAware?: (token: string) => void;

  /**
   * 注入token，在每个请求发送时会调用此事件获取token
   */
  authorizationTokenInfuse?: () => string;

  /**
   * 注入rsa加密公钥，请求加解密时必须传入
   * requestConfig: HttpClientInternalRequestConfig
   */
  rsaPublicKeyInfuse?: () => string;
}
