/*
 * @Description: 这是axios实例封装页面（组件）
 * @Date: 2021-06-01 11:18:22
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-11 14:45:28
 */
import Vue from "vue";
import axios from "axios";
import store from "../store";
import { redirectToLogin } from "@/utils/router";
import cloneDeep from "lodash/cloneDeep";
const hash = require("object-hash");

const instance = axios.create({
  // 超时时间
  timeout: 60 * 1000,
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await store.state.user.token;
    config.headers["X-ACCESS-TOKEN"] = token || "";

    // 禁止请求
    if (store.state.axios.forbid) {
      const httpList = store.state.axios.http;
      const index = httpList.findIndex(
        (item) => item.instance.t === config.params.t
      );
      index !== -1 && httpList[index].cancel();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (res) => {
    const { root } = res.config;
    const { code, payload, message } = res.data;
    const t = res.config.params.t;
    store.commit("axios/finishHttp", t);
    if (code === 200 || code === "00000") {
      // 存在root 表示返回全部的数据
      let result = root ? res.data : payload;
      result = result !== null && result !== undefined ? result : res.data;
      store.commit("axios/cacheHttpData", { response: result, t });
      return result;
    }
    // 用户登录状态异常
    const loginCode = ["A0100", "A0101", "A0104"];
    if (loginCode.indexOf(code) !== -1) {
      // 重定向到登录页
      redirectToLogin();
      return Promise.reject(res.data);
    }
    Vue.prototype.$toast.fail(message);
    return Promise.reject(res.data);
  },
  (error) => {
    Vue.prototype.$toast.fail("网络请求失败");
    return Promise.reject(error);
  }
);

const axiosInstance = (obj) => {
  // 有缓存且没过期
  const arg = cloneDeep(obj);
  delete arg.params.t;
  delete arg.cancelToken;
  let cache = null;
  let cacheKey = Math.random().toString();
  try {
    cacheKey = hash(arg);
  } catch (error) {
    // 表单不做缓存
    if (Object.prototype.toString.call(obj.data) !== "[object FormData]") {
      console.log(error);
    }
  }
  for (const [key, value] of store.state.axios.cache.entries()) {
    const nowTime = new Date().getTime();
    if (value.expirationTime > nowTime && key === cacheKey) {
      cache = value.cache || null;
    }
  }
  if (cache !== null && cache !== undefined) {
    return new Promise((resolve) => {
      resolve(cache);
    });
  }
  // 没缓存
  return instance(obj);
};

export default axiosInstance;
