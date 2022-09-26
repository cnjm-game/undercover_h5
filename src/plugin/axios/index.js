/*
 * @Description: 这是请求处理页面（组件）
 * @Date: 2021-06-01 11:18:22
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2021-11-23 14:20:04
 */
import Axios from "axios";
import axios from "./instance";
import qs from "qs";
import store from "../store";

const CancelToken = Axios.CancelToken;

/**
 * @description: 请求
 * @param {String} url/请求地址
 * @param {String} method/请求方式（默认为get）
 * @param {Object} headers/请求头
 * @param {Object} data/参数
 * @param {String} contentType/请求体参数形式：json:application/json；form:application/x-www-form-urlencoded；formData:multipart/form-data；
 * @param {String} responseType/响应数据类型：json；blob；text；stream；arraybuffer；
 * @param {String} gateway/网关（默认为api）
 * @param {Number} t/唯一标识，用于标识每个请求实例，默认为时间戳
 * @param {String} cacheTime/请求数据缓存时间,单位毫秒（默认为500，0则不缓存，超过1小时则转化为持久化缓存）
 * @return {*}
 */
const http = (obj = {}) => {
  // 固定参数顺序
  const argument = {
    url: "",
    method: "get",
    headers: {},
    data: {},
    contentType: "json",
    responseType: "json",
    gateway: "api",
    t: new Date().getTime(),
    cacheTime: 500,
    ...obj,
  };
  return new Promise((resolve, reject) => {
    let cancel;
    const instance = {
      url: argument.url,
      method: argument.method,
      headers: argument.headers,
      responseType: argument.responseType,
      baseURL: getGateWay(argument.gateway),
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    };
    if (argument.method === "post" || argument.method === "put") {
      const { params, content } = getContentType(
        argument.data,
        argument.contentType
      );
      instance.data = params;
      instance.params = {};
      instance.headers = { ...instance.headers, "Content-Type": content };
    } else {
      instance.params = argument.data;
    }
    instance.params = { ...instance.params, t: argument.t };
    // 缓存请求
    const cache = { ...instance, cacheTime: argument.cacheTime };
    delete cache.cancelToken;
    store.commit("axios/cacheHttp", cache);
    store.commit("axios/pushHttp", {
      instance: { ...instance, t: argument.t },
      cancel,
    });
    axios(instance)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * @description: 处理参数形式
 * @param {Object} data/参数
 * @param {String} contentType/请求头Content-Type
 * @return {*}
 */
const getContentType = (data, contentType) => {
  let params = {};
  let content = "application/json";
  switch (contentType) {
    case "json":
      content = "application/json";
      params = data;
      break;
    case "form":
      content = "application/x-www-form-urlencoded";
      params = qs.stringify(data);
      break;
    case "formData":
      content = "multipart/form-data";
      params = new FormData();
      params = Object.keys(data).reduce((total, key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => {
            total.append(key + "[]", item);
          });
        } else {
          total.append(key, data[key]);
        }
        return total;
      }, new FormData());
      break;
  }
  return { params, content };
};

/**
 * @description: 获取baseUrl
 * @param {*} gateway/网关缩写
 * @return {*}
 */
const getGateWay = (gateway) => {
  switch (gateway) {
    case "api":
      return process.env.VUE_APP_APIURL;
    default:
      return process.env.VUE_APP_APIURL;
  }
};

export default http;
