// 此文件用于加密请求体
import CryptoJs from 'crypto-js';
import {isString} from "./beanUtils";
import {JSEncrypt} from "jsencrypt";

/**
 * aes加密token
 * @param token
 * @param nonce
 * @param aesKeyHeader
 * @param splip
 */
export const aesEncryptHeader = (
  token: string,
  nonce: string,
  aesKeyHeader: string = "WdzH675478d6df4359987cf2f90c6d89",
  splip: string = "-:WDZH:TIME:-"
): string => {
  const content = nonce + splip + Date.now().toString() + splip + token;
  return aesEncryptData(content, aesKeyHeader);
};

/**
 * 使用信封加密，返回加密的数据
 */
export const envelopeEncrypt = (data: any, aesKey: string, rsaPublicKey: string): Object => {
  // 处理数据
  let handlerData: string;
  if (isString(data)) {
    handlerData = data;
  } else {
    // 解析json数据
    handlerData = CryptoJs.enc.Utf8.parse(JSON.stringify(data)) as unknown as string;
  }
  // aes加密数据
  const encryptData = aesEncryptData(handlerData, aesKey);
  // rsa加密aes密钥
  const encryptAesKey = rsaEncrypt(aesKey, rsaPublicKey);
  return {
    data: encryptData,
    key: encryptAesKey,
  };
}

/**
 * 获取随机aes密钥
 */
export const getRandomAesKey = (): string => {
  const prefix = "gloam";
  const currentTime = new Date().getTime();
  return CryptoJs.MD5(prefix + currentTime)
    .toString()
    .substring(0, 16);
};

/**
 * aes加密数据
 */
const aesEncryptData = (data: any, aesKey: string): string => {
  const cipher = CryptoJs.AES.encrypt(data,
    CryptoJs.enc.Utf8.parse(aesKey), {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7,
    });
  return cipher.ciphertext.toString();
};

/**
 * aes解密
 */
export const aesDecryptData = (encryptData: any, aesKey: string): string => {
  aesKey = CryptoJs.enc.Utf8.parse(aesKey) as unknown as string;
  // 解密数据
  const cipher = CryptoJs.AES.decrypt(encryptData, aesKey, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7,
  });
  return cipher.toString();
};

// rsa加密aes密钥
const rsaEncrypt = (data: string, rsaPublicKey: string) => {
  // 初始化rsa加密对象
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(rsaPublicKey);
  // 加密密钥
  return jsEncrypt.encrypt(data);
};
