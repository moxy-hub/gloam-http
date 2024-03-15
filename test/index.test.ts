import {HttpClientOptions} from "../lib/domain/httpClientOptions";
// import {HttpClient} from "../lib/httpClient";
import {test} from "vitest";
import {HttpClient} from "../lib";
import {Filter} from "../types/filter/filter";

const FF: Filter = {
  order(): number {
    return 0;
  }

}

const options: HttpClientOptions = {
  requestOptions: {
    joinParamsToUrl: true,
    formatDate: true,
    joinPrefix: true,
    urlPrefix: 'service-gateway',
    apiUrl: 'http://127.0.0.1',
    joinTime: true
  },
  requestToken: {
    enable: true,
    authenticationScheme: 'bearer',
    aesKey: '485s8s8d4df8df1f8aqw5f8f49d5ew78',
    split: '-SPLIT-'
  },
  webEnvelope: {
    enable: true
  },
  filters: [
    {
      order(): number {
        return 0;
      }
    }
  ],
  event: {
    onNetworkError(error: Error, defaultMessage: string): void {
      console.log("网络错误了", error, defaultMessage)
    }
  }
}
const httpClient = new HttpClient(options)
test('httpClient', async () => {

  const res = await httpClient.get({
    url: "http://www.baidu.com",
    encrypt: true,
    data: {
      a: "传输中会被加密"
    }
  })
  console.log(res)

})
export {httpClient}
