# 					     

   <div align="center" style="margin-bottom: 10px;"><h1>GLOAM-HTTP</h1></div>

<p align="center">
    <a target="_blank" href="https://github.com/moxy-hub/gloam-http/blob/release/LICENSE">
     	<img alt="" src="https://img.shields.io/github/license/dromara/payment-spring-boot"/>
    </a>
    <a target="_blank" href="https://github.com/moxy-hub">
     	<img alt="" src="https://img.shields.io/badge/gloam-framework-blue?style=flat&logo=gloam&labelColor=green&color=white
/>
    </a>   
    <a target="_blank" href="https://www.typescriptlang.org/zh/">
     	<img alt="" src="https://img.shields.io/badge/type%20script-brightgreen"/>
    </a>   
    <a target="_blank" href="https://www.npmjs.com/package/gloam-http">
     	<img alt="" src="https://img.shields.io/npm/v/gloam-http"/>
    </a>   



</p>

## 介绍

基于java-gloam开发框架封装的http基础能力包



## 快速使用

> 安装
>
>  ```shell
>  npm install gloam-http
>  ```
>
> 卸载
>
> ```shell
> npm uninstall gloam-http
> ```



## 使用说明

> - 当前框架基于Axios实现，在使用本框架时，请一同将Axios进行安装
>
>   ```shell
>   npm install axios
>   npm install gloam-http
>   ```
>
> - 在vite环境中，与原生axios配置方式一致，需要使用代理



## 快速开始

>- 接入框架
>
>  ```ts
>  import {HttpClientOptions} from "gloam-http/types/domain/httpClientOptions";
>  import {HttpClient} from "gloam-http";
>  
>  // 基础配置
>  const options: HttpClientOptions = {}
>  // 实例化客户端
>  const httpClient = new HttpClient(options)
>  // 导出使用
>  export {httpClient}
>  ```
>
>  



## 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
