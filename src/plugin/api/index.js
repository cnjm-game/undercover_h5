/*
 * @Description: 这是api初始化页面（组件）
 * @Date: 2021-06-07 10:36:21
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2021-07-23 16:24:11
 */
const apiList = require.context("../../api", false, /.js$/);
const api = apiList.keys().reduce((total, item) => {
  const apiName = item.substring(2, item.length - 3);
  return Object.keys(apiList(item)).reduce((apiTotal, key) => {
    apiTotal[apiName + key.replace(key[0], key[0].toUpperCase())] =
      apiList(item)[key];
    return apiTotal;
  }, total);
}, {});

export default api;
