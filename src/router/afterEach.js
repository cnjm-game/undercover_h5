/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-05-31 15:03:34
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-10 19:51:41
 */

const afterEach = (to, from) => {
  // 正式环境打印链接
  if (process.env.NODE_ENV === "production") {
    console.log(window.location.href);
  }
};

export default afterEach;
