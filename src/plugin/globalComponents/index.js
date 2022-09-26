/*
 * @Description: 这是全局组件入口页面（组件）
 * @Date: 2021-06-03 16:25:34
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2021-08-11 10:40:15
 */
import Vue from "vue";

const comList = require.context("@/components/global", false, /.vue$/);
comList.keys().forEach((item) => {
  const comName = item.substring(2, item.length - 4);
  Vue.component(comName, comList(item).default);
});
