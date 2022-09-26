/*
 * @Description: 这是神策埋点页面（组件）
 * @Date: 2020-12-23 16:19:59
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-11 18:06:53
 */
import store from "@/plugin/store";
const sensors = require("sa-sdk-javascript");
// 埋点环境
// const isProduction = process.env.NODE_ENV === "production" ? "生产" : "测试";

/**
 * @description: 不进行埋点
 * @param {*}
 * @return {*}
 */
const ban = () => {
  // crm预览不进行埋点
  if (store.state.router.query.preview) {
    return true;
  }
  return false;
};

/**
 * @description: 判空
 * @param {*} val/值
 * @param {*} type/数据类型String/Number/Boolean
 * @return {*}
 */
const judgeNull = (val, type = "String") => {
  switch (type) {
    case "String":
      if (val) {
        return val.toString();
      }
      return "无";
    case "Number":
      if (val) {
        return Number(val);
      }
      return -1;
    case "Boolean":
      if (val) {
        return true;
      }
      return false;
    default:
      return "无";
  }
};

/**
 * @description: 设置公共属性
 * @return {*}
 */
//  const sensorsCommon = () => {
//   sensors.registerPage({
//       heika_common_source_code: judgeNull(store.state.router.query.sourceCode),
//       heika_common_channel_vehicle: store.state.router.query.account === "app" ? "魔方黑卡App" : judgeNull(store.state.router.query.account),
//       heika_common_env: judgeNull(isProduction),
//   });
// };

/**
 * @description: 初始化
 * @param {*} account
 * @param {*} userId
 * @return {*}
 */
export const sensorsInit = (account, userId) => {
  if (ban()) {
    return;
  }
  try {
    //
  } catch (error) {
    console.log(error);
    throw error;
  }
  //  设置公共属性
  // sensors.registerPage({
  //     YUNKE_COMMON_SOURCE: account,
  //     YUNKE_COMMON_ACCOUNT: account,
  //     YUNKE_COMMON_CODE: "无",
  // });
  // 登录/绑定用户
  //接口获取，注意一定要大写
  // const digest = userId;
  // sensors.login(digest);
};

/**
 * @description: 绑定用户
 * @param {*} account
 * @param {*} userId
 * @return {*}
 */
export const sensorsLogin = (userId) => {
  try {
    // 登录/绑定用户
    const id =
      Object.prototype.toString.call(userId) === "[object Number]"
        ? userId.toString()
        : "";
    sensors.login(judgeNull(id));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description: 事件埋点
 * @param {*} name/事件名称
 * @param {*} track/[{key,value,type}]
 * @return {*}
 */
export const sensorsTrack = (name = "", track = []) => {
  try {
    const preName = "yunke_fenxiao_" + name;
    if (track && track.length) {
      const result = track.reduce((total, item) => {
        const { key, value, type } = item;
        total[preName + "_" + key] = judgeNull(value, type);
        return total;
      }, {});
      sensors.track(preName, result);
      return;
    }
    sensors.track(preName);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description: 事件埋点
 * @param {*} name/事件名称
 * @param {*} err/接口返回的错误信息
 * @param {*} code/错误code
 * @param {*} message/错误信息
 * @param {*} ex/额外埋点
 * @return {*}
 */
export const sensorsApi = ({
  name = "",
  code = "00000",
  message = "",
  err = {},
  ex = [],
}) => {
  try {
    // 成功
    if (code === "00000") {
      sensorsTrack(name, [
        ...ex,
        { key: "result", value: true, type: "Boolean" },
        { key: "error_type", value: "" },
        { key: "error_reason", value: "" },
      ]);
      return;
    }
    // 失败
    sensorsTrack(name, [
      ...ex,
      { key: "result", value: false, type: "Boolean" },
      { key: "error_type", value: err.code || code },
      { key: "error_reason", value: err.message || message },
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description: api埋点
 * @param {*} code
 * @param {*} msg
 * @param {*} url
 * @return {*}
 */
// export const sensorsApi = (code, msg, url) => {
//   const value = {
//     YUNKE_API_RESULT_CODE: code || "无",
//     YUNKE_API_RESULT_MSG: msg || "无",
//     YUNKE_API_RESULT_URL: url || "无"
//   };
//   sensors.track("YUNKE_API_RESULT", value);
// };

/**
 * @description: 页面埋点
 * @param {*}
 * @return {*}
 */
export const sensorsPage = () => {
  const value = {
    YUNKE_PAGE_URL: window.location.href || "无",
  };
  sensors.track("YUNKE_PAGE", value);
};

/**
 * @description: 按钮埋点
 * @param {*} name//按钮名称
 * @param {*} path//路由
 * @return {*}
 */
export const sensorsButton = (name, path) => {
  const value = {
    YUNKE_BUTTON_NAME: name || "无",
    YUNKE_PATH: path || "无",
    YUNKE_URL: window.location.href || "无",
  };
  sensors.track("YUNKE_BUTTON", value);
};

/**
 * @description: 自定义埋点
 * @param {*}
 * @return {*}
 */
export const sensorsDiy = (options) => {
  sensors.track(options.name, options.value);
};

/**
 * @description: 通用错误请求埋点
 * @param {*}
 * @return {*}
 */
export const sensorsHttpErr = ({
  code = "",
  message = "",
  url = "",
  data = {},
  headers = {},
  params = {},
}) => {
  try {
    // 错误请求
    sensorsTrack("h5_err_api", [
      { key: "err_code", value: code ? code.toString() : "" },
      { key: "err_message", value: message || "" },
      { key: "err_data", value: data ? JSON.stringify(data) : "" },
      { key: "err_headers", value: JSON.stringify(headers) },
      { key: "err_params", value: JSON.stringify(params) },
      { key: "err_url", value: url },
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description: 错误捕捉
 * @param {*}message/内容
 * @param {*}stack/位置
 * @param {*}name/错误名称
 * @return {*}
 */
export const sensorsError = ({ message, stack, name }) => {
  sensorsTrack("h5_error", [
    { key: "message", value: message },
    { key: "stack", value: stack },
    { key: "name", value: name },
  ]);
};
