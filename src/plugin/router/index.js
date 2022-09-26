/*
 * @Description: 这是路由页面（组件）
 * @Date: 2021-05-31 10:26:50
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-11 20:26:17
 */
import Vue from "vue";
import Router from "vue-router";
import beforeEach from "@/router/beforeEach";
import afterEach from "@/router/afterEach";
import store from "@/plugin/store";

Vue.use(Router);

const getList = (fileList, p) => {
  const list = fileList.keys().filter((item) => item !== "./index.vue");
  const result = list.map((item) => {
    const relativePath = `/${p}${item.substr(1)}`;
    const file = require("@/views" + relativePath);
    const path = relativePath.replace("/index.vue", "");
    return {
      name: path.substr(1).replace(/\//g, "-"),
      path,
      meta: file.default.meta || {},
      component: () => Promise.resolve(file),
    };
  });
  const file = require("@/views/" + p);
  return [
    {
      name: p,
      path: `/${p}`,
      meta: file.default.meta || {},
      component: () => Promise.resolve(file),
      children: result,
    },
  ];
};

const pageFile = require.context("@/views/page", true, /index.vue/);
const entranceFile = require.context("@/views/entrance", true, /index.vue/);
const routesList = [
  ...getList(pageFile, "page"),
  ...getList(entranceFile, "entrance"),
];

const routes = [
  {
    path: "/",
    redirect: { path: "/page/home" },
  },
  ...routesList,
  {
    path: "*",
    redirect: "/page/com/functionPage/404",
  },
];

// 跳转时携带固定参数
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  store.commit("router/update", { key: "isBack", value: false });
  const { query, path } = location;
  store.commit("router/goto", path);
  location.query = { ...store.state.router.params, ...query };
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};

const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location, onResolve, onReject) {
  const { query, path } = location;
  location.query = { ...store.state.router.params, ...query };
  store.commit("router/update", { key: "isBack", value: false });
  store.commit("router/goReplace", path);
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch((err) => err);
};

const router = new Router({
  mode: "hash",
  routes,
});

// 监听浏览器退后
const back = () => {
  store.commit("router/update", { key: "isBack", value: true });
};
window.addEventListener("popstate", back, false);

router.beforeEach((to, from, next) => {
  beforeEach(to, from, next);
});

router.afterEach((to, from) => {
  afterEach(to, from);
});

export default router;
