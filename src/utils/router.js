import { parse } from "qs";
import store from "@/plugin/store";
import router from "@/plugin/router";

/**
 * @description: 当登录失效，重定向去登录页
 * @param {*}clear/是否清理token
 * @return {*}
 */
export const redirectToLogin = async () => {
  // 清楚用户信息和token
  await store.dispatch("user/setToken", "");
  store.commit("user/setUserInfo", {});
  router.replace({
    path: "/entrance/login",
    query: { ...store.state.router.query },
  });
};

/**
 * @description: 重定向到首页
 * @param {*}
 * @return {*}
 */
export const redirectToIndex = (path = "/page/mine") => {
  router.replace({ path, query: store.state.router.query });
};

/**
 * @description: location.href统一处理
 * @param {*}
 * @return {*}
 */
export const windowOpen = (url, replace = false) => {
  if (replace) {
    window.location.replace(url);
    return;
  }
  window.location.href = url;
};

/**
 * @description: 登录时，若有重定向，直接回到重定向页面
 * @param {*}path/跳转路径
 * @param {*}query/跳转参数
 * @return {*}
 */
export const pagePush = async ({ path = "/page", query = {}, next }) => {
  // 进入前的页面参数
  const originQuery = { ...query };
  const goto =
    (await store.state.user.token) || store.state.router.query.preview;
  // 已登录或预览模式下，重定向
  if (originQuery.redirection && goto) {
    const pathArr = decodeURIComponent(originQuery.redirection).split("?");
    const toPath = pathArr[0];
    const toQuery = parse(pathArr[1]);
    const resultQuery = { ...originQuery, ...toQuery };
    delete resultQuery.redirection;
    // 微信环境下如果登录异常，就删除url的wxCode
    if (store.state.router.query.platform === "wechat") {
      if (resultQuery.wxCode) {
        delete resultQuery.wxCode;
      }
      if (resultQuery.state) {
        delete resultQuery.state;
      }
    }
    router.replace({
      path: router.currentRoute.path === toPath ? path : toPath,
      query: resultQuery,
    });
    return;
  }
  next();
};

/**
 * @description: 监听返回
 * @param {*}path/需要做拦截的页面
 * @param {*}fuc/拦截时调用的函数
 * @return {*}
 */
export const back = (path, fuc) => {
  store.commit("router/update", { key: "interceptBack", value: { path, fuc } });
  const state = {
    title: store.state.page.title,
    url: document.URL,
  };
  history.pushState(state, "title", document.URL);
  window.addEventListener("popstate", (e) => backFuc(e), false);
};

/**
 * @description: 只拦截一次，一直拦截可能会被举报
 * @param {*}
 * @return {*}
 */
const backFuc = async (e) => {
  if (
    (e && e.persisted) ||
    (window.performance && window.performance.navigation.type === 2)
  ) {
    return;
  }
  if (e) {
    if (router.currentRoute.path === store.state.router.interceptBack.path) {
      await store.state.router.interceptBack.fuc();
      window.removeEventListener("popstate", backFuc, false);
    }
  }
};

/**
 * @description: 关闭页面
 * @param {*}
 * @return {*}
 */
export const closePage = () => {
  switch (store.state.router.query.platform) {
    case "h5": {
      window.close();
      // 若没有关闭则打开空白页
      window.location.replace("about:blank");
      break;
    }
    case "wechat": {
      window.WeixinJSBridge.call("closeWindow");
      break;
    }
    case "app": {
      break;
    }
  }
};
