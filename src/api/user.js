/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-06-07 10:54:45
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2021-07-27 10:35:49
 */
import axios from "@/plugin/axios";

export const getToken = (data) =>
  axios({ url: "http://fanyi.youdao.com/translate", data, cacheTime: 500 });
