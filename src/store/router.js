import { getQuery, toNumber } from "@/utils/common";
import { local } from "@/plugin/localforage";

const state = {
  // 每次跳转携带的参数
  paramskey: ["platform", "code", "preview", "vconsole"],
  // 固定参数
  params: {},
  // 进入页面时缓存固定参数
  localParamsKey: [],
  // 默认参数值
  paramsDefault: {},
  // 持久化缓存固定参数
  localParams: local.getItem("localParams"),
  // 浏览器是否后退
  isBack: false,
  // 页面参数
  query: getQuery(),
  // 用于刷新
  pageShow: true,
  // 路由栈
  history: ["/"],
  // 平台是否已初始化
  platformInit: false,
  // 登录后重定向地址
  redirect: { path: "", query: {} },
  // 拦截浏览器后退
  interceptBack: {
    path: "/",
    fuc: () => {},
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
   * @description: 页面隐藏
   * @param {*}
   * @return {*}
   */
  pageHidden: (state) => {
    state.pageShow = false;
  },
  /**
   * @description: 页面显示
   * @param {*}
   * @return {*}
   */
  pageShow: (state) => {
    state.pageShow = true;
  },
  /**
   * @description: 页面路由栈
   * @param {*}
   * @return {*}
   */
  goto: (state, path) => {
    state.history.push(path);
  },
  goBack: (state) => {
    state.history.pop();
  },
  goReplace: (state, path) => {
    state.history = [path];
  },
};

const actions = {
  /**
   * @description: 储存参数
   * @param {*}
   * @return {*}
   */
  saveQuery: async ({ state, commit }, val = {}) => {
    const localParamsOrigin = await state.localParams;
    const value = { ...state.paramsDefault, ...localParamsOrigin, ...val };
    const keys = state.paramskey;
    const localKeys = state.localParamsKey;
    const { query, params, localParams } = Object.keys(value).reduce(
      (total, key) => {
        const p = value[key];
        // 纯数字或字符串数字转化为数字类型
        const item = toNumber(p) === false ? p : toNumber(p);
        total.query[key] = item;
        if (keys.indexOf(key) !== -1) {
          total.params[key] = item;
        }
        if (localKeys.indexOf(key) !== -1) {
          total.localParams[key] = item;
        }
        return total;
      },
      { query: {}, params: {}, localParams: {} }
    );
    commit("update", { key: "query", value: query });
    commit("update", { key: "params", value: params });
    commit("update", { key: "localParams", value: localParams });
    await local.setItem("localParams", localParams);
  },
  /**
   * @description: 手动刷新页面
   * @param {*}
   * @return {*}
   */
  refresh: ({ commit }) => {
    commit("pageHidden");
    setTimeout(() => {
      commit("pageShow");
    }, 500);
  },
};
const getters = {
  /**
   * @description: 环境判断
   * @param {*}
   * @return {*}
   */
  platform: (state) => {
    return state.params.platform;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
