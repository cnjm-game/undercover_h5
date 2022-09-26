<script>
// type:none为无样式按钮
// 其他参数与vant button相同
import throttle from "lodash/throttle";
import { Button } from "vant";
import { sensorsButton } from "@/plugin/sensors";
export default {
  components: { dmcButton: Button },
  render() {
    const scopedSlots = {};
    if (this.$slots) {
      Object.keys(this.$slots).forEach((key) => {
        scopedSlots[key] = () => this.$slots[key];
      });
    }
    const btnClick = (...arg) => {
      sensorsButton(this.$attrs.name, this.$route.path);
      this.$listeners.click && this.$listeners.click(...arg);
    };
    // 节流
    const click = throttle(btnClick, 2000);
    return this.$attrs.type && this.$attrs.type === "none" ? (
      // 无样式按钮
      <div class="w100 h100">{this.$slots.default}</div>
    ) : (
      // vant按钮
      <dmcButton
        {...{
          attrs: { ...this.$attrs },
          on: { ...this.$listeners, click },
          scopedSlots: scopedSlots,
        }}
      >
        {Object.keys(this.$slots).map((key) => {
          return <i slot={key}></i>;
        })}
      </dmcButton>
    );
  },
};
</script>

<style lang="less" scoped></style>
