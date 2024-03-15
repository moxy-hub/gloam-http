<div align="center" style="margin-bottom: 10px;"><h1>GLOAM-HTTP</h1></div>
<p align="center">
    <a target="_blank" href="https://github.com/moxy-hub/gloam-http/blob/master/LICENSE">
     <img alt="xxx" src="https://img.shields.io/github/license/dromara/payment-spring-boot"/>
    </a>
    <a target="_blank" href="https://github.com/moxy-hub">
     <img alt="" src="https://img.shields.io/badge/gloam-framework-blue？style=flat&logo=gloam&labelColor=green&color=white/>
    </a>   
    <a target="_blank" href="https://www.typescriptlang.org/zh/">
     <img alt="" src="https://img.shields.io/badge/type%20script-brightgreen"/>
    </a>   
    <a target="_blank" href="https://www.npmjs.com/package/gloam-http">
     <img alt="" src="https://img.shields.io/npm/v/gloam-http"/>
    </a>   
</p>

> gloam-http源于日常项目开发中进行的重复性劳动，使用ts封装axios，更加快捷方便的使用方法，支持filter过滤器、过滤器排序、token认证、body体加密，内置事件系统，支持业务系统的感知处理

[toc]

## 版本更新

> - 2024.3.15  -【1.0.6】发布🚀
>   - 基于ts封装axios，实现请求的快捷使用
>   - 封装axios的拦截器，增加filter过滤器，支持过滤器排序执行
>   - 新增事件系统，支持系统内部多种事件的感知
>   - 增强axios创建的配置参数，使用httpClient进行创建
>   - 配置支持同一添加前缀，时间戳等
>   - 支持token认证，采用aes加密方式进行传输，需要后端同样适配
>   - 支持body体加密，采用rsa+aes的信封加密方式



## 快速开始

- 安装

  > NPM镜像安装

  ```shell
  npm install gloam-http
  ```

- 实例

  ```typescript
  // 基础配置
  const options: HttpClientOptions = {}
  // 实例化客户端
  const httpClient = new HttpClient(options)
  // 导出使用
  export {httpClient}
  ```

- 使用

  ```typescript
  const res = await httpClient.get({url: "http://www.baidu.com"}})
  ```

  

## 基础配置

### 1、HttpClientOptions

> 在实例化HttpClient时的配置，属于全局配置，适用于每一个请求



|    配置字段    |                         配置说明                         |
| :------------: | :------------------------------------------------------: |
| requestOptions | 请求基础配置，详见[RequestOptions](# 2、RequestOptions)  |
|  requestToken  | 请求token基础配置，详见[RequestToken](# 3、RequestToken) |
|  webEnvelope   | 请求体加密基础配置，详见[WebEnvelope](# 4、WebEnvelope)  |
|    filters     |        过滤器基础配置，详见[Filter](# 5、Filter)         |
|     event      |      事件基础配置，详见[HttpEvent](# 6、HttpEvent)       |



**案例**

```typescript
const options: HttpClientOptions = {
  requestOptions:{},
  requestToken:{},
  webEnvelope:{},
  filters:[],
  event:{}
}
// 实例化客户端
const httpClient = new HttpClient(options)
// 导出使用
export {httpClient}
```



### 2、RequestOptions

> 配置请求的基本参数

|    配置字段     |                          配置说明                           | 类型    | 默认  |
| :-------------: | :---------------------------------------------------------: | ------- | ----- |
| joinParamsToUrl |                 post请求的时候添加参数到url                 | boolean | false |
|   formatDate    | 格式化提交参数时间，会将时间数据格式化为YYYY-MM-DD HH:mm:ss | boolean | false |
|   joinPrefix    |        默认将prefix 添加到url，prefix配置为urlPrefix        | boolean | false |
|    urlPrefix    |                        接口拼接地址                         | string  | ‘’    |
|     apiUrl      |                          接口地址                           | string  | ‘’    |
|    joinTime     |        是否加入时间戳，会在GET请求后面加上时间戳参数        | boolean | true  |



**案例**

```typescript
const options: HttpClientOptions = {
  requestOptions:{
    joinParamsToUrl:true,
    formatDate:true,
    joinPrefix:true,
    urlPrefix:'service-gateway',
    apiUrl:'http://127.0.0.1',
    joinTime:true
  }
}
// 实例化客户端
const httpClient = new HttpClient(options)
// 导出使用
export {httpClient}
```



### 3、RequestToken

> 请求携带token的相关配置

|       配置字段       |      配置说明       |  类型   | 默认  |
| :------------------: | :-----------------: | :-----: | :---: |
|        enable        |  是否开启token认证  | boolean | false |
| authenticationScheme |    认证信息前缀     | string  |  ""   |
|        aesKey        | 认证信息aes加密密钥 | string  |  ""   |
|        split         |  认证信息token分割  | string  |  ""   |



**案例**

```typescript
const options: HttpClientOptions = {
  requestToken:{
    enable:true,
    authenticationScheme:'bearer',
    aesKey:'485s8s8d4df8df1f8aqw5f8f49d5ew78',
    split:'-SPLIT-'
  }
}
// 实例化客户端
const httpClient = new HttpClient(options)
// 导出使用
export {httpClient}
```



### 4、WebEnvelope

> 请求体加密参数

| 配置字段 |        配置说明        |  类型   | 默认  |
| :------: | :--------------------: | :-----: | :---: |
|  enable  | 是否开启开启请求体加密 | boolean | false |



**案例**

```typescript
const options: HttpClientOptions = {
  webEnvelope:{
    enable:true
  }
}
// 实例化客户端
const httpClient = new HttpClient(options)
// 导出使用
export {httpClient}
```



### 5、Filter

> 请求过滤器

| 配置字段 |         配置说明         |      类型      | 默认 |
| :------: | :----------------------: | :------------: | :--: |
| filters  | 配置实现Filter接口的对象 | Array\<Filter> | [ ]  |



**案例**

```typescript
const options: HttpClientOptions = {
  filters:[
    // 外部实现的filter
    MyFilter,
    // 内部实现的filter
    {
      order(): number {
        return 0;
      }
    }
  ]
}
// 实例化客户端
const httpClient = new HttpClient(options)
// 导出使用
export {httpClient}
```



### 6、HttpEvent

> 请求事件系统

| 配置字段 |         配置说明          | 类型  | 默认 |
| :------: | :-----------------------: | :---: | :--: |
|  event   | 配置实现Event抽象类的对象 | Event | { }  |



**案例**

```typescript
const options: HttpClientOptions = {
  event: {
    onNetworkError(error: Error, defaultMessage: string): void {
      console.log("网络错误了", error, defaultMessage)
    }
  }
}
// 实例化客户端
const httpClient = new HttpClient(options)
// 导出使用
export {httpClient}
```



## Filter

> 过滤器的实现是基于Axios的请求响应拦截原理，在其基础上增强了顺序编排，在Gloam-Http中存在三个默认的执行器

### 1、接口

```typescript
export interface Filter {

  /**
   * @description: 请求拦截器
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
   * @description: 执行顺序
   */
  order: () => number
}
```



### 2、默认拦截器

- **DefaultFilter**

  > 执行顺序为 0
  >
  > **【请求过滤器】**：主要负责对请求的基础配置，配置RequestOptions参数以及Token相关参数
  >
  > **【响应过滤器】**：主要负责监听响应头中携带的Token信息，通过事件模块进行业务的感知

  

- **EncryptFilter**

  > 执行顺序为 1
  >
  > **【请求过滤器】**：主要负责对需要加密的请求进行数据加密操作
  >
  > **【响应过滤器】**：主要负责对响应的数据进行解密

  

- **TimeFilter**

  > 执行顺序为 1
  >
  > **【请求过滤器】**：主要负责对请求中数据为‘createTimeStart’和‘createTimeEnd’的字段进行时间处理，格式为时间戳

  

### 3、实现案例

```typescript
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
```



## Event

> 通过事件系统，可以让业务系统感知到请求的节点，配合完成整个请求链路

### 1、抽象类

```typescript
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
```



## Token

### 1、实现原理

> - 在进行携带token时，会先调用**事件系统**的‘authorizationTokenInfuse( )’方法获取到由业务系统保管的token
>
> - 请求中会生成nonce字段（由配置的aesKey加密）放入请求头 nonce
>
> - 请求会将token按照一定顺序拼接，然后使用配置的aesKey加密，放入请求头 Authorization
>
>   > 加密排列：nonce + splip(配置的分隔符) + Date.now().toString() + splip(配置的分隔符) + token;



### 2、结合事件系统进行token的获取与注入

> 在后端生成token后，应该放置Authorization请求头，gloam-http会解析每次响应的token，如果存在则会调用**事件系统**的authorizationTokenAware( )方法，此时业务系统应该将token存入本地缓冲，并在**事件系统**的authorizationTokenInfuse( )方法中将token重新交与gloam-http



## WebEnvelope

### 1、原理

- 请求加密的使用需要后端配合提供RSA公钥或获取公钥的接口，在**事件系统**中由rsaPublicKeyInfuse( )方法告知gloam-http

- gloam-http在发送请求时，将会随机生成aesKey，由aesKey对数据进行加密，然后由后端提供的公钥将aesKey进行加密

- 请求后端的格式

  ```json
  {
       data:"由aes加密的数据",
       key:"由rsa加密的aesKey"
  }
  ```



### 2、使用

- 在之前的创建实例的配置中，存在是否开启加密的参数，需要注意的是该参数为true时表示加密功能可用，不是全部请求加密，如果为false则表示全局不使用加密，在局部配置也是无效的

- GET请求或者body中为空时不会进行加密

- 在创建实例时开启加密功能的情况下，如下使用：

  ```typescript
  const res = await httpClient.get({
    url: "http://www.baidu.com",
    encrypt: true,
    data: {
      a: "传输中会被加密"
    }
  })
  ```

  

## 参与贡献

1.  **Fork 本仓库**
2.  **新建 Feat_xxx 分支**
3.  **提交代码**
4.  **新建 Pull Request**

**【注】：commit时请将修改信息填写清楚**