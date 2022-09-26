<template>
  <div class="tabbar fixed bottom-0 w100 color-white border-top-d8 z-index-10">
    <ul class="flex align-center h100">
      <li
        v-for="item in menu"
        :key="item.id"
        class="nav-item text-color-gray flex flex-direction align-center justify-center flex-sub text-md"
        @click="changeToggle(item)"
      >
        <div class="tabbar-icon margin-bottom-xs">
          <van-image
            :src="isCurrent(item.id) ? item.activeImg : item.normalImg"
          />
        </div>

        <div class="text" :class="{ 'text-color-dark': isCurrent(item.id) }">
          {{ item.menuName }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("page");
const { mapState: routerMapState } = createNamespacedHelpers("router");
export default {
  data() {
    return {
      navList: [],
    };
  },
  created() {},
  methods: {
    /**
     * @description: tab跳转
     * @param {*}
     * @return {*}
     */

    async changeToggle({ path }) {
      console.log("path-", path);
      this.$router.replace({
        path,
      });
    },
    /**
     * @description: 是否为当前页
     * @param {*} id
     * @return {*}
     */

    isCurrent(id) {
      return this.menu.some(
        (item) => item.id === id && item.path === this.$route.path
      );
    },
  },
  computed: {
    ...mapState(["menu"]),
    ...routerMapState(["query"]),
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.tabbar {
  height: @navBarHeight;
  border-top: 1px solid black; /*no*/
  .tabbar-icon {
    width: 62px;
    height: 42px;
  }
}
</style>
