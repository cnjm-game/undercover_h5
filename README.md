### 使用说明

npm install

npm run dev

### 目录结构

```
├─public
└─src
    ├─api//api存放
    ├─assets//静态文件
    │  ├─css
    │  ├─img
    │  └─json
    ├─components//公用组件（在此建立文件夹，组件文件夹里面的index.vue文件为公用组件）
    │  └─global//全局组件（在此建立文件夹，组件文件夹里面的index.vue文件会自动挂载在全局）
    ├─plugin//项目插件
    │  ├─axios//请求封装（请求成功后请求内容默认在vuex缓存500毫秒，缓存时间内重复请求会返回缓存内容）
    │  ├─router//路由封装（对views文件夹中自动生成路由，路由为文件路径，entrance为无需token页面，index为需要token页面）
    │  ├─store//状态管理封装
    │  ├─localforage//本地持久化缓存（并在此挂载store模块）
    │  ├─sensors//神策埋点
    │  └─vant//vant封装
    │      └─com//vant自定义组件
    │      └─vant.less//vant的主题样式
    ├─router//路由守卫
    ├─store//在该文件夹下创建状态管理js文件，自动挂载在store中（其命名空间为文件名）
    ├─utils//公用方法
    │  └─common.js//公用方法
    │─views//视图文件
    │  ├─entrance//无需token页面
    │  ├─index//需token页面
```

### 规范说明

1、文件名与变量名使用小驼峰

2、views 文件夹下创建文件夹，其中的 index.vue 为页面文件，该文件夹中创建 com 文件夹存放该页面所使用的组件
示例：

```
├─views//视图文件
      └─index//首页
          └─index.vue//首页
          └─com//页面组件
              └─banner.vue//首页的banner组件
              └─list.vue//首页的列表组件
```

3、禁止使用 var；优先使用 const

4、禁止使用==、!=,使用全等符===

9、所有高度除最外层布局外，使用边距撑起，使用设计规范

10、vant 的主题样式需在 plugin/vant/vant.less 中定义

11、api 文件夹下存放所有接口

使用时方法名称前加入接口文件名，如：
api 新建文件 user.js，其中加入接口 getToken，调用时

```
this.$api.userGetToken()
```

12、每个 vue 文件中的 export default 中，meta 为路由 meta，其中的 title 为页面 title，如：

```js
export default {
  meta: {
    title: "首页",
  },
};
```

13、禁止使用 mixin，如需继承，可考虑使用高阶组件

14、请勿在 App.vue 与 main.js 入口文件中写入过多逻辑，请于 router 文件夹下的 beforeEach.js 文件中写判断逻辑

15、如需使用 持久化缓存，需在 store 中使用 ，禁止在非 store 中直接使用缓存，具体使用方式参考 store 文件夹下的 user 缓存 token，[localforage 的 api](http://localforage.docschina.org/#api)

```
使用token：
const token=await this.$store.state.user.token;
设置token：
this.$store.dispatch("setToken",1111)
```

17、条件语句尽量使用

```js
if(a){
  ...
  return
}
if(b){
  ...
  return
}
...
```

而非 if/else，增强可读性与扩展性
