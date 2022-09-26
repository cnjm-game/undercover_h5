/*
 * @Description: 这是vant页面（组件）
 * @Date: 2021-06-02 15:30:12
 * @Author:
 * @LastEditors:
 * @LastEditTime: 2021-06-08 19:35:27
 */
import Vue from "vue";
import {
  NavBar,
  Dialog,
  Toast,
  Row,
  Col,
  Cell,
  CellGroup,
  Icon,
  Field,
  Loading,
  Form,
  Tabbar,
  Tab,
  Tabs,
  List,
  TabbarItem,
  PullRefresh,
} from "vant";

import "vant/lib/icon/local.css";

Vue.use(NavBar)
  .use(Dialog)
  .use(Toast)
  .use(Col)
  .use(Row)
  .use(Cell)
  .use(CellGroup)
  .use(Icon)
  .use(Field)
  .use(Loading)
  .use(Form)
  .use(Tabbar)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(TabbarItem)
  .use(PullRefresh);

// 定制组件
const comList = require.context("./com", false, /.vue$/);
comList.keys().forEach((item) => {
  const comName = item.substring(2, item.length - 4);
  Vue.component(
    "van" + comName.replace(comName[0], comName[0].toUpperCase()),
    comList(item).default
  );
});

const medList = require.context("./com", false, /.js$/);
medList.keys().forEach((item) => {
  const medName = item.substring(2, item.length - 3);
  Vue.prototype["$" + medName] = medList(item).default;
});
