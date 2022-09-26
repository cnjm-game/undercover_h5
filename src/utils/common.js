import { parse } from "qs";

/**
 * @description: 固定长度队列
 * @param {*} total/所有元素
 * @param {*} item/入队列元素
 * @param {*} count/队列长度
 * @return {*}
 */
export const queue = (total, item, count) => {
  const stackTotal = [...total];
  if (stackTotal.length < count) {
    stackTotal.push(item);
  } else {
    stackTotal.push(item);
    stackTotal.shift();
  }
  return stackTotal;
};

/**
 * @description: store未初始化时获取参数
 * @param {*}
 * @return {*}
 */
export const getQuery = () => {
  return parse(window.location.href.split("?")[1]) || {};
};

/**
 * @description: 添加script
 * @param {*}
 * @return {*}
 */
export const addScript = (url) => {
  return new Promise((resolve) => {
    const head = document.getElementsByTagName("head").item(0);
    const script = document.createElement("script");
    script.type = "text/javascript";
    let src = url;
    if (url.indexOf("http") === -1) {
      src = window.location.protocol + url;
    }
    script.onload = () => {
      resolve();
    };
    script.src = src;
    head.appendChild(script);
  });
};

/**
 * @description: 责任链
 * @param {*} fn
 * @return {*}
 */
/* eslint-disable no-extend-native */
Function.prototype.after = function (fn) {
  const self = this;
  return function (...args) {
    const result = self.apply(null, args);
    /* eslint-disable no-useless-call */
    return fn.call(null, result);
  };
};
export const compose = function (...args) {
  if (args.length) {
    return args.reduce(function (f1, f2) {
      return f1.after(f2);
    });
  }
};

/**
 * @description: 柯里化
 * @param {*}
 * @return {*}
 */
export const curry = (fn, ...args) =>
  args.length >= fn.length
    ? fn(...args)
    : (..._args) => curry(fn, ...args, ..._args);

/**
 * @description: 数字类型与字符串数字转化
 * @param {*}
 * @return {*}
 */
export const toNumber = (val) => {
  if (Object.prototype.toString.call(val) === "[object Number]") {
    return val;
  }
  //非负浮点数
  const regPos = /^\d+(\.\d+)?$/;
  //负浮点数
  const regNeg =
    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
  if (regPos.test(val) || regNeg.test(val)) {
    return Number(val);
  }
  return false;
};

/**
 * @description: 将数字千分化
 * @param {*}  num/数值
 * @return {*}
 */
export const formatMoney = (num) => {
  const result = [];
  let counter = 0;
  num = (num || 0).toString().split("");
  for (let i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 3) && i !== 0) {
      result.unshift(",");
    }
  }
  return result.join("");
};

/**
 * @description: 是否为本地环境
 * @param {*}
 * @return {*}
 */
export const isLocalhost = () => {
  const domain = process.env.VUE_APP_DOMAIN;
  const host = window.location.host;
  return host.indexOf(domain) === -1;
};

/**
 * @description: 根据身份证判断年龄
 * @param {*}idcard 身份证号
 * @return {*}
 */
export const analyzeIdCard = (idcard) => {
  const identityNo = idcard.toString();
  // 获取出生日期
  const yearBirth = Number(identityNo.substring(6, 10));
  const monthBirth = Number(identityNo.substring(10, 12));
  const dayBirth = Number(identityNo.substring(12, 14));

  // 获取当前的时间
  let age = new Date().getFullYear() - yearBirth;
  const monthNow = new Date().getMonth() + 1;
  const dayNow = new Date().getDate();
  if (monthNow < monthBirth || (monthNow === monthBirth && dayNow < dayBirth)) {
    age--;
  }
  return age;
};

/**
 * @description: 身份证判断性别
 * @param {*}
 * @return {*}true/男；false/女
 */
export const sexIdCard = (idcard) => {
  const identityNo = idcard.toString();
  const sex = Number(identityNo.charAt(16)) || 0;
  return sex % 2 === 1;
};

/**
 * @description: 复制剪切板
 * @param {*}text/复制文字
 * @return {*}
 */
export const copyToClipboard = (text) => {
  try {
    const input = document.createElement("input");
    input.setAttribute("id", "input_for_copyText");
    input.value = text;
    document.getElementsByTagName("body")[0].appendChild(input);
    document.getElementById("input_for_copyText").select();
    document.execCommand("copy");
    document.getElementById("input_for_copyText").remove();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description: 判断值不为Undefined或Null
 * @param {*}val
 * @return {*}
 */
export const isVal = (val) => {
  const type = Object.prototype.toString.call(val);
  if (type === "[object Undefined]" || type === "[object Null]") {
    return false;
  }
  return true;
};

/**
 * @description: 判断是否超时
 * @param {*} timeStamp 毫秒时间戳
 * @param {*} timeOut 超时时间
 * @return {*}
 */
export const checkTimeOut = function (timeStamp = 0, timeOut = 0) {
  // 首先要获取缓存中的时间戳
  const currentTime = new Date().getTime();
  return (currentTime - timeStamp) / 1000 > timeOut;
};
