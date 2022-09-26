import store from "@/plugin/store";
import { toast } from "@/plugin/vant";
import router from "@/plugin/router";
import $throw from "@/plugin/throw";
import { isLocalhost } from "@/utils/common";

/**
 * @description: sdk获取位置
 * @param {*}
 * @return {*}
 */
export const getLocation = async () => {
  try {
    const platform = store.state.router.query.platform;
    switch (platform) {
      case "h5": {
        await h5Location();
        break;
      }
      case "wechat": {
        await wechatLocation();
        break;
      }
      case "app": {
        // app端传过来
        appLocation();
        break;
      }
    }
  } catch (error) {
    $throw(error, "定位失败");
    return error;
  }
};

/**
 * @description: 延时获取地址，获取不到跳转至手动选取地址
 * @param {*}
 * @return {*}
 */
export const getAddress = async () => {
  // 已完成定位
  const locationInit = await store.getters["user/locationInit"];
  if (locationInit) {
    return;
  }
  // 如果sdk定位失败，需要定位时直接选择城市
  if (!store.state.user.sdkLocation) {
    router.push({ path: "/page/modules/selectCity" });
  }
  const loadingToast = toast({
    type: "loading",
    message: "定位中",
    forbidClick: true,
    duration: 3000,
  });
  // 最多轮询三秒
  let num = 0;
  const roll = () => {
    return new Promise((resolve) => {
      const repeat = () =>
        setTimeout(async () => {
          const locationInit = await store.getters["user/locationInit"];
          if (locationInit) {
            resolve();
            return;
          }
          if (num >= 6) {
            // 定位超时则调起城市列表选择
            router.push({ path: "/page/modules/selectCity" });
            resolve();
            return;
          }
          num++;
          repeat();
        }, 500);
      repeat();
    });
  };
  await roll();
  loadingToast.clear();
};

const h5Location = () => {
  return new Promise((resolve, reject) => {
    resolve("err");
    // dmcGetLocation("mofangheika")
    //   .then((res) => {
    //     /* eslint-disable camelcase */
    //     const { province, city, district, lat, lng, street, street_number } =
    //       res;
    //     store
    //       .dispatch("user/setLocation", {
    //         location: { longitude: lng, latitude: lat },
    //         address: {
    //           province,
    //           city,
    //           district: district || "",
    //           street: street || "",
    //           street_number: street_number || "",
    //         },
    //       })
    //       .then(() => {
    //         resolve();
    //       });
    //   })
    //   .catch((err) => {
    //     reject(err);
    //   });
  });
};

/**
 * @description: 微信定位
 * @param {*}
 * @return {*}
 */
const wechatLocation = () => {
  // 本地开发不走腾讯定位
  if (isLocalhost()) {
    return;
  }
  return new Promise((resolve, reject) => {
    let loadingToast = null;
    // 3秒后弹窗
    setTimeout(async () => {
      const locationExpiration = await store.state.user.locationExpiration;
      if (locationExpiration && new Date().getTime() > locationExpiration) {
        loadingToast = toast({
          type: "loading",
          message: "定位中",
          forbidClick: true,
          duration: 0,
        });
      }
    }, 3000);
    const wx = store.state.sdk.wx;
    wx.getLocation({
      type: "gcj02",
      success(res) {
        loadingToast && loadingToast.clear();
        // const { latitude, longitude } = res;
        // dmcGetLocationByLoc({ latitude, longitude })
        //   .then((loc) => {
        //     const { province, city, district, street, street_number } =
        //       loc.address_components;
        //     const { lat, lng } = loc.location;
        //     store
        //       .dispatch("user/setLocation", {
        //         location: { longitude: lng, latitude: lat },
        //         address: { province, city, district, street, street_number },
        //       })
        //       .then(() => {
        //         loadingToast && loadingToast.clear();
        //         resolve();
        //       });
        //   })
        //   .catch((err) => {
        //     loadingToast && loadingToast.clear();
        //     console.log({ err });
        //     reject(err);
        //   });
      },
      fail(err) {
        console.log(err);
        toast.fail("定位失败");
        loadingToast && loadingToast.clear();
        store.commit("user/sdkLocation", false);
        reject(err);
      },
    });
  });
};

/**
 * @description: app传递过来定位
 * @param {*}
 * @return {*}
 */
const appLocation = () => {
  store.state.sdk.flutterSetMethod({});
  store.state.sdk.flutterPostMessage({ method: "getLocation" });
};
