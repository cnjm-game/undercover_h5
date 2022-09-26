import { queue } from "@/utils/common";
import cloneDeep from "lodash/cloneDeep";
const hash = require("object-hash");

const state = {
  // 请求队列(instance:请求数据, cancel：取消请求函数, status：请求是否在进行)
  http: [],
  // 禁止网络请求
  forbid: false,
  // 缓存请求
  cache: new Map(),
};
const mutations = {
  /**
   * @description: 推入请求
   * @param {*}instance/请求数据
   * @param {*}cancel/取消请求函数：cancel()
   * @return {*}
   */
  pushHttp: (state, { instance, cancel }) => {
    state.http = queue(state.http, { instance, cancel, status: true }, 30);
  },
  /**
   * @description: 完成请求
   * @param {*}t/请求时间戳
   * @return {*}
   */
  finishHttp: (state, t) => {
    state.http = state.http.map((item) => {
      if (item.instance.t === t) {
        return { ...item, status: false };
      }
      return item;
    });
  },
  /**
   * @description: 缓存请求
   * @param {*} state
   * @param {*} obj/入参
   * @return {*}
   */
  cacheHttp(state, obj) {
    // 是否需要缓存
    if (!obj.cacheTime) {
      return;
    }
    const t = obj.params.t;
    const arg = cloneDeep(obj);
    delete arg.params.t;
    delete arg.cacheTime;
    const key = hash(arg);
    const value = state.cache.get(key);
    // 查询是否有缓存
    if (!value) {
      state.cache.set(key, { t: [t], expirationTime: t + obj.cacheTime });
      return;
    }
    // 缓存是否过期
    const nowTime = new Date().getTime();
    if (value.expirationTime < nowTime) {
      state.cache.set(key, { t: [t], expirationTime: t + obj.cacheTime });
      return;
    }
    state.cache.set(key, { ...value, t: [...value.t, t] });
  },
  /**
   * @description: 缓存接口数据
   * @param {*}response/响应数据
   * @param {*}t/请求时间戳
   * @return {*}
   */
  cacheHttpData(state, { response, t }) {
    // 防并发再次判断
    for (const key of state.cache.keys()) {
      const value = state.cache.get(key);
      const index = value.t.indexOf(t);
      if (index !== -1) {
        const cache = { ...value, cache: response };
        state.cache.set(key, cache);
      }
    }
  },
};
const actions = {};
const getters = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
