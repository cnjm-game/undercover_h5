<template>
  <div class="digital-bomb">
    <div v-if="!bomb" class="page-init">
      <div class="title">欢迎使用数字炸弹</div>
      <div class="begin" @click="onBegin">开始游戏</div>
    </div>
    <div class="content" v-else>
      <div class="come-back" @click="comeBack">重来</div>
      <div :class="showBomb ? 'peek peek-to' : 'peek'" @click="toPeek">
        {{ bomb }}
      </div>
      <div class="tips">
        炸弹在<span class="range">{{ minBomb }}-{{ maxBomb }}</span
        >之间
      </div>
      <div>
        <van-field
          v-model="checkBomb"
          label=""
          placeholder="请输入"
          type="number"
          @blur="
            () => {
              if (checkBomb && checkBomb > maxBomb) checkBomb = maxBomb;
              if (checkBomb && checkBomb < minBomb) checkBomb = minBomb;
            }
          "
        />
      </div>
      <div class="confirm" @click="onConfirm">拆炸弹</div>
      <div
        class="check-record"
        v-if="recordList.length > 0"
        @click="showPopup = true"
      >
        查看拆弹记录
      </div>
    </div>

    <van-popup v-model="showPopup" position="bottom">
      <div class="record">
        <div
          class="record-item"
          v-for="(item, index) in recordList"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import dayjs from "dayjs";
const MAX_NUM = 100;
const MIN_NUM = 1;
export default {
  meta: {
    title: "数字炸弹",
  },
  data() {
    return {
      bomb: null,
      showBomb: false,
      showPopup: false,
      minBomb: MAX_NUM,
      maxBomb: MAX_NUM,
      checkBomb: "",
      timer: null,
      recordList: [],
    };
  },

  mounted() {},
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  },
  methods: {
    // 开始游戏
    onBegin() {
      this.bomb = Math.round(Math.random() * (MAX_NUM - MIN_NUM) + MIN_NUM);
      this.recordList = [];
      this.showBomb = false;
      this.minBomb = MIN_NUM;
      this.maxBomb = MAX_NUM;
      this.timer && clearTimeout(this.timer);
    },
    comeBack() {
      this.onBegin();
    },
    toPeek() {
      if (this.showBomb) {
        return;
      }
      this.showBomb = true;
      this.timer = setTimeout(() => {
        this.showBomb = false;
      }, 5000);
    },
    onConfirm() {
      if (!this.checkBomb) {
        return;
      }
      const checkBomb = Number(this.checkBomb);
      if (checkBomb < this.minBomb || checkBomb > this.maxBomb) {
        return alert("超出炸弹范围");
      }
      this.checkBomb = "";
      this.recordList.push(
        `${dayjs(new Date()).format(
          "YYYY-MM-DD HH:mm:ss"
        )}：尝试使用${checkBomb}进行拆弹`
      );
      if (checkBomb === this.bomb) {
        // 重新开始
        this.onBegin();
        alert("哦豁，炸飞了");
        return;
      }
      if (checkBomb > this.bomb) {
        this.maxBomb = checkBomb;
      }
      if (checkBomb < this.bomb) {
        this.minBomb = checkBomb;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes rotateAnima {
  0% {
    box-shadow: 0.5px 2px 3.6px -15px #bcb494, 4px 16px 29px -15px #bcb494;
    transform-origin: 40% -25%;
    transform: rotate(0deg);
  }
  30% {
    box-shadow: 0 0 0 0 #bcb494, 0 0 0 0 #bcb494;
    transform-origin: 40% -25%;
    transform: rotate(-50deg);
  }
  80% {
    box-shadow: 0 0 0 0 #bcb494, 0 0 0 0 #bcb494;
    transform-origin: 40% -25%;
    transform: rotate(-50deg);
  }
  100% {
    box-shadow: 0.5px 2px 3.6px -15px #bcb494, 4px 16px 29px -15px #bcb494;
    transform-origin: 40% -25%;
    transform: rotate(0deg);
  }
}
@keyframes shadowAnima {
  0% {
    box-shadow: 0 0 0 0 #c1914d, 0 0 0 0 #c1914d;
  }
  30% {
    box-shadow: 0.5px 2px 3.6px -15px #c1914d, 4px 16px 29px -15px #c1914d;
  }
  80% {
    box-shadow: 0.5px 2px 3.6px -15px #c1914d, 4px 16px 29px -15px #c1914d;
  }
  100% {
    box-shadow: 0 0 0 0 #c1914d, 0 0 0 0 #c1914d;
  }
}
.digital-bomb {
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  .page-init {
    width: 500px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    .title {
      margin: 0 auto 350px;
      text-align: center;
      font-size: 48px;
      color: #d4a464;
      font-weight: bold;
      letter-spacing: 6px;
    }
    .begin {
      height: 73px;
      width: 321px;
      line-height: 73px;
      text-align: center;
      font-size: 28px;
      color: #fff;
      font-weight: bold;
      letter-spacing: 12px;
      border-radius: 20px;
      background: url("./images/begin.png") no-repeat;
      background-size: 100%;
      margin: 0 auto 0;
    }
  }

  .come-back {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #e4bc7c;
  }
  .peek {
    position: relative;
    height: 180px;
    width: 180px;
    line-height: 180px;
    text-align: center;
    border-radius: 50%;
    background: #f6ebc9;
    color: #c1914d;
    font-size: 38px;
    margin-bottom: 80px;
    &::after {
      content: "偷看炸弹";
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      border: 1px solid #bcb494;
      background: #f6f6f6;
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #bcb494;
      box-shadow: 0.5px 2px 3.6px -15px #bcb494, 4px 16px 29px -15px #bcb494;
    }
  }
  .peek-to {
    animation: shadowAnima 5s forwards;
    &::after {
      animation: rotateAnima 5s forwards;
    }
  }
  .tips {
    margin-bottom: 50px;
    color: #666;
    .range {
      color: #d4a464;
      font-weight: bold;
    }
  }
  /deep/.van-field {
    width: 500px;
    border-radius: 20px;
    border: 1px solid #f6ebc9;
    margin-bottom: 80px;
    .van-field__control {
      color: #d4a464;
      font-size: 28px;
    }
  }
  .confirm {
    width: 400px;
    height: 88px;
    line-height: 88px;
    background: linear-gradient(270deg, #e3cfa3 0%, #d4a464 100%);
    box-shadow: 0px 4px 16px 0px #e3cfa3;
    border-radius: 44px;
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    letter-spacing: 12px;
  }
  .check-record {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: #999;
    font-size: 24px;
  }
  .record {
    height: 35vh;
    padding: 25px 30px;
    overflow-y: scroll;
    .record-item {
      color: #999;
      line-height: 50px;
    }
  }
}
</style>
