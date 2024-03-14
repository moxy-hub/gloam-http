import {HttpClientOptions} from "../lib/domain/httpClientOptions";
// import {HttpClient} from "../lib/httpClient";
import {test} from "vitest";
import {HttpClient} from "../lib";


const options: HttpClientOptions = {}
const httpClient = new HttpClient(options)
test('httpClient', async () => {

  const res = await httpClient.get({
    url: "http://www.baidu.com", encrypt: true, data: {
      a: "sdsdsd"
    }
  })
  console.log(res)

})
export {httpClient}
