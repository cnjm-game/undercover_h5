/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-05-31 10:26:50
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-10 11:39:10
 */
import Vue from "vue";
import App from "./App.vue";
// 插件
import "@/plugin";

import router from "@/plugin/router";
import store from "@/plugin/store";
import { createDataStore } from "@/plugin/localforage";
Vue.config.productionTip = false;

const init = async () => {
  // 初始化数据仓库
  await createDataStore("undercover", "h5", store);
  const app = new Vue({
    store,
    router,
    render: (h) => h(App),
  });
  app.$mount("#app");
};
init();
