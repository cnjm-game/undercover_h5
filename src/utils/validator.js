import { compose, curry } from "@/utils/common";

/**
 * @description: 正则校验
 * @param {*}reg/正则
 * @param {*}val/值
 * @return {*}
 */
const validator = (reg, val) => {
  return reg.test(val) ? val : null;
};

const validatorCurry = curry(validator);

// 非空校验
export const validatorNull = (val) => {
  return val !== null && val !== undefined && val.trim() !== "";
};

// 手机号正则
export const phoneReg = /1\d{10}/;

// 姓名正则
export const nameReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,30}$/;

// 身份证正则
export const IDCardReg =
  /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;

// 校验手机号
export const validatorPhone = (val) => {
  return compose(validatorCurry(phoneReg), validatorNull)(val);
};

//校验姓名
export const validatorName = (val) => {
  return compose(validatorCurry(nameReg), validatorNull)(val);
};

//校验身份证
export const validatorIdNo = (val) => {
  return compose(validatorCurry(IDCardReg), validatorNull)(val);
};
