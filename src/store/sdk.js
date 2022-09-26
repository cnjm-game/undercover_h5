/*
 * @Description: 这是用户信息页面（组件）
 * @Date: 2021-06-01 11:26:45
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-10 20:52:38
 */
const state = {
  // sdk初始化完成
  sdkInit: false,
  // 静态图片地址
  imgBaseUrl: process.env.VUE_APP_OSS_BASEURL,
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
};
const actions = {};
const getters = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
