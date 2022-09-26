const path = require("path");

module.exports = ({ file }) => {
  // 动态设置视口宽度
  const designWidth = file.dirname.includes(path.join("node_modules", "vant"))
    ? 375
    : 750;

  return {
    plugins: {
      autoprefixer: {},
      "postcss-px-to-viewport": {
        // 要转化的单位
        unitToConvert: "px",
        viewportWidth: designWidth,
        // 转换后的精度，即小数点位数
        unitPrecision: 5,
        // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
        propList: ["*"],
        // 指定需要转换成的视窗单位，默认vw
        viewportUnit: "vw",
        // 指定字体需要转换成的视窗单位，默认vw
        fontViewportUnit: "vw",
        selectorBlackList: [],
        // 默认值1，小于或等于1px则不进行转换
        minPixelValue: 1,
        // 是否在媒体查询的css代码中也进行转换，默认false
        mediaQuery: true,
        // 是否转换后直接更换属性值
        replace: true,
        // 设置忽略文件，用正则做目录名匹配
        exclude: [/node_modules/],
        // 是否处理横屏情况
        landscape: false,
        // 指定不转换为视窗单位的类名，该项仅在使用 Circle 组件时需要
        selectorBlackList: ["van-circle__layer"],
      },
    },
  };
};
