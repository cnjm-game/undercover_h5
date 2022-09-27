<template>
  <div class="page-container w100 h100">
    <div class="flex flex-direction justify-between h100 w100">
      <div class="main flex-sub overflow-y-auto" ref="pageContent">
        <transition :name="transitionName">
          <!-- <keep-alive :max="10" v-if="$route.meta.keepAlive === true">
            <router-view></router-view>
          </keep-alive>
          <router-view v-else></router-view> -->
          <router-view></router-view>
        </transition>
      </div>
      <tab-bar v-if="menu.length > 1"></tab-bar>
    </div>
  </div>
</template>

<script>
import TabBar from "./com/layout/tabBar";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("page");
const { mapState: routerMapState, mapMutations: routerMapMutations } =
  createNamespacedHelpers("router");
export default {
  meta: {
    title: "谁是卧底",
  },
  components: {
    TabBar,
  },
  data() {
    return {
      transitionName: "",
    };
  },
  created() {},
  mounted() {
    // this.init();
  },
  computed: {
    ...mapState(["menu"]),
    ...routerMapState(["query", "isBack", "history"]),
  },
  methods: {
    ...routerMapMutations(["goBack"]),
  },
};
</script>

<style lang="less" scoped>
.loading-img {
  width: 150px;
  height: 150px;
}
.slide-right-leave-to,
.slide-left-leave-to {
  display: none;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 300ms;
  position: absolute;
}

.slide-right-enter {
  z-index: 1;
}

.slide-right-leave-class {
  z-index: 20;
}

.slide-right-leave-active {
  z-index: 20;
  transform: translate(100%, 0);
}

.slide-left-enter {
  transform: translate(100%, 0);
}
</style>
