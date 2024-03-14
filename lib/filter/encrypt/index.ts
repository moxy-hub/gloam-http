import {Filter} from "../filter";
import {InternalRequestConfig} from "../../domain/httpRequestConfig";
import {HttpClientOptions} from "../../domain/httpClientOptions";
import {obtainEvent} from "../../event/httpEventHelper";
import {aesDecryptData, envelopeEncrypt, getRandomAesKey} from "../../util/encrypt";
import {AxiosResponse} from "axios";
import {Result} from "../../domain/result";
import {HttpEvent} from "../../event/httpEvent";

export const encryptFilter: Filter = {

  order(): number {
    return 1;
  },

  /**
   * 请求加密配置配置
   * 1、配置请求的requestOptions参数
   * 2、配置请求的token相关
   */
  request(config: InternalRequestConfig<any>, options: HttpClientOptions): InternalRequestConfig<any> {
    const url = config.url || "";
    const data = config.data;
    // get统一不加密, 空data不加密
    if (config.method == "get" || !data) {
      console.log(
        "%c %s %c %s %c %s",
        "border-radius: 5px;padding: 3px 4px;color: white;background-color: #3fc2f8;margin-right:5px",
        "接口请求",
        "border-radius: 5px;padding: 3px 4px;color: white;background-color: #0dbc5c;margin-right:5px",
        url,
        "color: #fecf00; font-weight: bold;",
        "参数:",
        data
      );
      return config;
    }
    if (config.encrypt) {
      console.log(
        "%c %s %c %s %c %s",
        "border-radius: 5px;padding: 3px 4px;color: white;background-color: #3fc2f8;margin-right:5px",
        "接口请求",
        "border-radius: 5px;padding: 3px 4px;color: white;background-color: #0dbc5c;margin-right:5px",
        url,
        "color: #fecf00; font-weight: bold;",
        "加密参数:",
        data
      );
      config.data = encryptEnvelope(data, config, options);
    }
    return config;
  },

  /**
   * 1、后端返回的响应应该都是200，如果处理不成功，则会在响应的result内部的状态码是500或success为false
   * 2、如果后端返回的响应为500，则代表后端处理逻辑错误
   * 3、当前过滤器优化级高，所以这里是将响应转换为result的关键，如果拦截响应，应该设置优先级高于当前过滤器
   * @description: 响应拦截器处理
   */
  response(res: AxiosResponse<Result>, options: HttpClientOptions): Result {
    const event = obtainEvent(options);
    const result: Result = res.data;
    // 检查key
    const config = res.config as InternalRequestConfig;
    const aesKey = config?.aesKey;
    if (!aesKey) {
      return handlerResult(event, result, res.config.url);
    }
    if (!result.data) {
      return handlerResult(event, result, res.config.url);
    }
    // 解密
    result.data = aesDecryptData(result.data, aesKey);
    return handlerResult(event, result, res.config.url);
  }

}

const encryptEnvelope = (data: any, config: InternalRequestConfig<any>, options: HttpClientOptions) => {
  if (!options.webEnvelope) {
    return config;
  }
  const {enable = false} = options.webEnvelope;
  if (!enable) {
    console.warn("[HttpClient]: 没有全局打开加密，跳过加密")
    return config;
  }
  const event = obtainEvent(options);
  let rsaPublicKey;
  // 获取rsa公钥
  try {
    // @ts-ignore
    rsaPublicKey = event.rsaPublicKeyInfuse();
  } catch (error) {
    console.warn("请检查是否实现rsa公钥注入事件", error);
  }
  if (!rsaPublicKey || rsaPublicKey.length < 1) {
    throw new Error("[请求加密数据失败]: 未获取到rsa公钥");
  }
  // 获取随机的aeskey
  const randomAesKey = getRandomAesKey();
  // 进行加密
  data = envelopeEncrypt(data, randomAesKey, rsaPublicKey)
  if (data) {
    config.aesKey = randomAesKey;
  }
  return data;
}
const handlerResult = (
  event: HttpEvent,
  result: Result,
  url?: string
): Result => {
  try {
    // @ts-ignore
    event?.webResultAware(result, url);
  } catch (error) {
    console.warn("请检查是否实现请求结果感知事件", error);
  }
  return result;
};
