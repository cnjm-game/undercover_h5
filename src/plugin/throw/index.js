/*
 * @Description: 这是错误处理页面（组件）
 * @Date: 2021-10-19 14:52:59
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2021-12-21 10:32:02
 */
import { sensorsError } from "@/plugin/sensors";
/**
 * @description: 错误捕捉
 * @param {*}error/错误
 * @param {*}name/错误名称
 * @return {*}
 */
const errorHandler = (error, name = "错误") => {
  console.error(error);
  try {
    let err = {
      message: error.toString(),
      stack: "",
      name,
    };
    // 错误类型
    if (Object.prototype.toString.call(error) === "[object Error]") {
      err = {
        message: error.message.toString(),
        stack: error.stack.toString(),
        name,
      };
    }
    sensorsError(err);
  } catch (error) {
    console.log(error);
  }
};

export default errorHandler;
