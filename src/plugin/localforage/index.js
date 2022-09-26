/*
 * @Description: 这是持久化数据仓库页面（组件）
 * @Date: 2021-06-11 11:46:01
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2022-01-10 10:35:06
 */
import localforage from "localforage";

let local = null;

/**
 * @description: 创建数据库
 * @param {*} name/数据库名称（传入项目名称）
 * @param {*} storeName/数据仓库名称（传入唯一标识，如account等）
 * @param {*} store/store
 * @return {*}
 */
const createDataStore = (name, storeName, store) => {
  return new Promise((resolve) => {
    local = localforage.createInstance({
      name,
      storeName,
    });
    // 仓库初始化完成
    local.ready().then(() => {
      // @/store目录下的文件自动挂载为 store 模块
      const moduleList = require.context("@/store", false, /.js$/);
      const modules = moduleList.keys().reduce((total, item) => {
        const moduleName = item.substring(2, item.length - 3);
        const sub = moduleList(item).default;
        total[moduleName] = Object.keys(sub).reduce(
          (sTotal, key) => {
            sTotal[key] = { ...sub[key] };
            return sTotal;
          },
          { namespaced: true }
        );
        store.registerModule(moduleName, total[moduleName]);
        return total;
      }, {});
      resolve(modules);
    });
  });
};

export { local, createDataStore };
