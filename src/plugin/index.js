/*
 * @Description: 这是插件入口页面（组件）
 * @Date: 2021-05-31 10:38:16
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-10 10:56:12
 */
import Vue from "vue";

// 重置样式
import "normalize.css";
// 基础样式
import "@/assets/css/main.css";

// 全局组件
import "./globalComponents";

import "./vant";
import api from "./api";
import VConsole from "vconsole";
import $throw from "./throw";
import { sensorsTrack, sensorsApi } from "@/plugin/sensors";
import { isLocalhost } from "@/utils/common";

if (process.env.NODE_ENV !== "production" && !isLocalhost()) {
  // 不是本地环境 并且 不是生产环境 就开启vconsole
  /* eslint-disable no-new */
  new VConsole();
}

// 请求
Vue.prototype.$api = api;

// 埋点
Vue.prototype.$sensorsTrack = sensorsTrack;
Vue.prototype.$sensorsApi = sensorsApi;

// 错误捕捉
Vue.prototype.$throw = (error) => $throw(error);
