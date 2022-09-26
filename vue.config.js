const path = require("path");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
  publicPath: "./",
  productionSourceMap: process.env.NODE_ENV !== "production",
  lintOnSave: "error",
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${path.resolve(
            "src/plugin/vant/vant.less"
          )}";@import "${path.resolve("src/assets/css/main.less")}"`,
        },
      },
    },
  },
  configureWebpack: (config) => {
    config.plugins.push(
      new HappyPack({
        id: "js",
        threadPool: happyThreadPool,
        loaders: ["babel-loader"],
      })
    );
    config.plugins.push(
      new HappyPack({
        id: "styles",
        threadPool: happyThreadPool,
        loaders: ["css-loader", "less-loader"],
      })
    );
    config.devtool = "inline-source-map";
  },
};
