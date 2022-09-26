import cloneDeep from "lodash/cloneDeep";

const state = {
  // 菜单
  menu: [],
  // 页面标题
  title: "魔方云客",
  // 页面数据
  pages: {},
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
   * @description: 设置页面标题
   * @param {*}
   * @return {*}
   */
  setTitle: (state, title) => {
    const pageTitle = title || document.title;
    state.title = pageTitle;
    window.document.title = pageTitle;
  },
};

const actions = {
  /**
   * @description: 清空页面数据
   * @param {*} pageId 页面id  all 是否清除全部缓存
   * @return {*}
   */
  clearPageData: ({ state, commit }, p) => {
    const { pageId, all } = p;
    // 获取原本的pageData 数据
    const pageData = cloneDeep(state.pages);
    let value = {};
    if (pageData[pageId] && !all) {
      // 存在旧数据
      pageData[pageId] = {};
      value = { ...state.pages, ...pageData };
    }
    commit("update", { key: "pages", value });
  },
};
const getters = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
