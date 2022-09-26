<template>
  <div
    class="relative nav-bar"
    :style="{
      backgroundColor: navColor,
    }"
  >
    <div
      class="arrow padding-left absolute h100 z-index-10"
      @click="goBack"
      v-show="$store.state.router.history.length > 1"
    >
      <div class="flex align-center h100">
        <van-icon :color="arrowColor" name="arrow-left" size="1em" />
      </div>
    </div>
    <div class="text-xl bold-df text-color-black relative w100 h100">
      <div class="flex align-center justify-center h100">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("page");
export default {
  data() {
    return {
      // 导航设计高度
      height: 94,
      // 导航栏背景色
      backgroundColor: "",
    };
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1);
      this.$store.commit("router/goBack");
    },
  },
  computed: {
    ...mapState(["title", "navColor"]),
    /**
     * @description: 箭头颜色
     * @param {*}
     * @return {*}
     */

    arrowColor() {
      // 白底则为黑色
      const color = ["#fff", "#ffffff", "rgb(255,255,255)"];
      return color.indexOf(this.navColor) !== -1 ? "#000" : "#fff";
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.nav-bar {
  height: 94px;
}
</style>
