/*
 * @Description: 这是个人信息页面（组件）
 * @Date: 2021-06-01 11:26:45
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-11 16:41:12
 */
import { local } from "@/plugin/localforage";
import { isLocalhost } from "@/utils/common";
// import { sensorsLogin } from "@/plugin/sensors";
import store from "@/plugin/store";

const state = {
  token: local.getItem("token"),
  // 用户信息
  userInfo: {},
  ua: navigator.userAgent.toLowerCase(),
  // 经纬度
  location: local.getItem("location"),
  // 地址
  address: local.getItem("address"),
  // 定位过期时间
  locationExpiration: local.getItem("locationExpiration"),
  // sdk定位是否成功
  sdkLocation: true,
  // 默认定位
  defaultLocation: {
    // 经度，纬度
    location: { longitude: 113.65, latitude: 34.76 },
    // 省，市，区，街，号
    address: {
      province: "河南省",
      city: "郑州市",
      district: "",
      street: "",
      street_number: "",
    },
  },
};
const mutations = {
  /**
   * @description: 更新值
   * @param {*}
   * @return {*}
   */
  update: (state, { key, value }) => {
    state[key] = value;
  },
  /**
   * @description: 保存用户信息
   * @param {*}
   * @return {*}
   */
  setUserInfo: (state, userInfo) => {
    // 用户登录
    if (!state.userInfo.userId) {
      //   sensorsLogin(userInfo.userId);
    }
    state.userInfo = userInfo || {};
  },
};
const actions = {
  setToken: async ({ commit }, token) => {
    await local.setItem("token", token);
    commit("update", { key: "token", value: token });
  },
  /**
   * @description: 设置地址
   * @param {*}select/是否为选择城市
   * @return {*}
   */
  setLocation: async (
    { state, commit, rootState },
    { location, address, select = false }
  ) => {
    // 获取经纬度
    let locationData = await state.location;
    locationData = {
      ...state.defaultLocation.location,
      ...locationData,
      ...location,
    };
    // 缓存经纬度
    await local.setItem("location", locationData);
    commit("update", { key: "location", value: locationData });
    // 获取地址
    let addressData = await state.address;
    addressData = {
      ...state.defaultLocation.address,
      ...addressData,
      ...address,
    };
    // 缓存地址
    await local.setItem("address", addressData);
    commit("update", { key: "address", value: addressData });
    // 缓存时间
    // 如果是默认定位，则不缓存时间
    let locationExpiration = new Date().getTime() + 1000 * 60 * 60 * 24;
    if ((!location || !Object.keys(location).length) && !select) {
      locationExpiration = await state.locationExpiration;
      locationExpiration = locationExpiration || 0;
    }
    await local.setItem("locationExpiration", locationExpiration);
    commit("update", { key: "locationExpiration", value: locationExpiration });
    await store.dispatch("page/clearPageData", {
      pageId: rootState.router.query.pageId,
    });
  },
  /**
   * @description: 选择城市
   * @param {*}
   * @return {*}
   */
  setCity: async ({ dispatch }, cityName) => {
    // 本地开发不走腾讯定位
    if (isLocalhost()) {
      await dispatch("setLocation", {
        address: { city: cityName },
        location: {},
        select: true,
      });
    }
  },
};
const getters = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
