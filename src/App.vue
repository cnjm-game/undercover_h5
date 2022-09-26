<template>
  <div id="app">
    <router-view v-if="pageShow"></router-view>
    <div class="v-console" v-if="consoleShow" @click="openConsole"></div>
  </div>
</template>

<script>
import { local } from "@/plugin/localforage";
import VConsole from "vconsole";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("router");
export default {
  data() {
    return {
      consoleShow: false,
      consoleCount: 0,
    };
  },
  created() {
    this.vconsoleSet();
  },
  mounted() {
    // 预览模式清除缓存
    if (this.$store.state.router.query.preview) {
      local.clear();
      console.log("已清除缓存");
    }
  },
  methods: {
    /**
     * @description: 打开vconsole
     * @param {*}
     * @return {*}
     */
    openConsole() {
      this.consoleCount++;
      if (this.consoleCount === 1) {
        /* eslint-disable no-new */
        new VConsole();
        this.consoleShow = false;
      }
    },
    /**
     * @description: 生产环境调试
     * @param {*}
     * @return {*}
     */
    vconsoleSet() {
      if (
        process.env.NODE_ENV === "production" &&
        this.$store.state.router.query.vconsole
      ) {
        this.consoleShow = true;
      }
    },
  },
  computed: {
    ...mapState(["pageShow"]),
  },
};
</script>

<style lang="less">
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.v-console {
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  z-index: 99999;
}
iframe {
  display: block;
}
</style>
