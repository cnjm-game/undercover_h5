/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-05-31 15:03:16
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-12 09:56:56
 */
import store from "@/plugin/store";
// import { platformInit } from "@/utils/platform";
// import { sensorsInit } from "@/plugin/sensors";
// import { redirectToLogin } from "@/utils/router";

const beforeEach = async (to, from, next) => {
  console.log("beforEach------", to);
  await store.dispatch("router/saveQuery", { ...to.query });
  store.commit("page/setTitle", to.meta.title || store.state.page.title);
  window.scrollTo(0, 0);
  // 平台初始化
  // if (!store.state.sdk.sdkInit) {
  //     sensorsInit();
  //     store.commit("sdk/update", { key: "sdkInit", value: true });
  //     await platformInit(to.path);
  // }
  // const token = await store.state.user.token;
  // const pathArr = to.path.split("/");
  // const isEntrance = (pathArr.length > 2 && pathArr[1] === "entrance") || store.state.router.query.preview;
  // console.log("token---", token, isEntrance);
  // if (!token && !isEntrance) {
  //     // 如果没有token 并且不是entrance的页面 则回到登录页
  //     redirectToLogin();
  // }
  next();
};

export default beforeEach;
