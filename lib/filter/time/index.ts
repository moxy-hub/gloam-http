import {Filter} from "../filter";
import {HttpClientOptions} from "../../domain/httpClientOptions";
import {InternalRequestConfig} from "../../domain/httpRequestConfig";
import {format2Timestamp} from "../../util/dateUtil";

export const timeFilter: Filter = {
  order(): number {
    return 2;
  },
  request(config: InternalRequestConfig<any>, _options: HttpClientOptions): InternalRequestConfig<any> {
    // 处理get请求的时间格式,统一变成时间戳
    const params = config.params
    if (!params) {
      return config
    }
    if (params.createTimeStart) {
      params.createTimeStart = format2Timestamp(params.createTimeStart)
    }
    if (params.createTimeEnd) {
      params.createTimeEnd = format2Timestamp(params.createTimeEnd)
    }
    return config
  }


}
