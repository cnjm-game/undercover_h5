import { getQuery } from "./common";
import store from "@/plugin/store";
import { getLocation } from "./location";
import api from "@/plugin/api";
// import { redirectToLogin } from "@/utils/router";
import $throw from "@/plugin/throw";

/**
 * @description: store初始化时获取平台
 * @param {*}
 * @return {*}
 */
export const getPlatform = () => {
  // store初始化完成时有值直接取值
  if (store && store.state.router && store.state.router.query.platform) {
    return store.state.router.query.platform;
  }
  // store未初始化时
  const platform = getQuery().platform;
  if (platform) {
    return platform;
  }
  const env = getPageEnv();
  // store尚未初始化时不执行
  if (store && store.state.router) {
    store.commit("router/update", {
      key: "params",
      value: { ...store.state.router.query, platform: env },
    });
  }
  return env;
};

/**
 * @description: 获取真实平台
 * @param {*}
 * @return {*}
 */
export const getPageEnv = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.match(/isapp/i)) {
    return "app";
  }
  if (ua.match(/MicroMessenger/i)) {
    return "wechat";
  }
  return "h5";
};

/**
 * @description: 移动端判断操作系统
 * @return {*}
 */
export const getOS = () => {
  const ua = store.state.user.ua;
  if (
    ua.indexOf("iphone") > -1 ||
    ua.indexOf("Mac") > -1 ||
    ua.indexOf("iPad") > -1
  ) {
    return "ios";
  }
  if (ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1) {
    return "android";
  }
  return "android";
};

/**
 * @description:平台初始化
 * @param {*}
 * @return {*}
 */
export const platformInit = async (path) => {
  const platform = getPlatform();
  const pathArr = path.split("/");
  // entrance页面或预览无需token
  const isEntrance =
    (pathArr.length > 2 && pathArr[1] === "entrance") ||
    store.state.router.query.preview;
  // 判断微信链接 在 非 微信环境下 打开 则提示去微信环境
  if (platform === "wechat" && getPageEnv() !== "wechat") {
    return;
  }
  try {
    switch (platform) {
      case "h5": {
        break;
      }
      case "wechat": {
        if (!isEntrance || path === "/entrance/login") {
          await weixinInit();
        }
        break;
      }
      case "app": {
        break;
      }
    }
  } catch (error) {
    $throw(error, "平台初始化失败");
  }
  // 设置默认定位
  await store.dispatch("user/setLocation", { location: {}, address: {} });

  // sdk定位异步进行
  const locationInit = await store.getters["user/locationInit"];
  if (!locationInit) {
    getLocation();
  }
};

/**
 * @description: 微信初始化
 * @param {*}
 * @return {*}
 */
const weixinInit = () => {
  return new Promise((resolve, reject) => {
    import("weixin-js-sdk").then((wx) => {
      api
        .userGetWechatSign({
          account: store.state.router.query.account,
          url: window.location.href.split("#")[0],
        })
        .then((res) => {
          wx.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            // 必填，公众号的唯一标识
            appId: res.appid,
            // 必填，生成签名的时间戳
            timestamp: res.timestamp,
            // 必填，生成签名的随机串
            nonceStr: res.nonceStr,
            // 必填，签名
            signature: res.signature1,
            // 必填，需要使用的JS接口列表
            jsApiList: ["getLocation", "hideMenuItems"],
            // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
            openTagList: [],
          });
          wx.ready(() => {
            store.commit("sdk/update", { key: "wx", value: wx });
            resolve();
          });
          wx.error((err) => {
            reject(err.errMsg);
          });
        });
    });
  });
};
