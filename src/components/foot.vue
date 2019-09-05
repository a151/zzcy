<template>
  <div class="foot_wrap">
    <div class="foot">
      <div class="sel">
        <div class="icon" @click="Index">
          <img :src="isIndex?srcIndex1:srcIndex" />
        </div>
        <div class="tit">首页</div>
      </div>
      <div class="sel" v-on:click="Brand">
        <div class="icon">
          <img :src="isBrand?srcBrand1:srcBrand" />
        </div>
        <div class="tit">品牌</div>
      </div>
      <div class="sel" @click="Shop">
        <div class="icon">
          <img :src="isShop?srcShop1:srcShop" />
        </div>
        <div class="tit">商城</div>
      </div>
      <div class="sel" v-on:click="Personal">
        <div class="icon">
          <img :src="isMy?srcMy1:srcMy" />
        </div>
        <div class="tit">我的</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["index"],
  data() {
    return {
      // 首页
      isIndex: false,
      srcIndex: require("../assets/images/index.png"),
      srcIndex1: require("../assets/images/index1.png"),
      // 品牌
      isBrand: false,
      srcBrand: require("../assets/images/brand.png"),
      srcBrand1: require("../assets/images/brand1.png"),
      // 商城
      isShop: false,
      srcShop: require("../assets/images/shop.png"),
      srcShop1: require("../assets/images/shop1.png"),
      // 我的
      isMy: false,
      srcMy: require("../assets/images/my.png"),
      srcMy1: require("../assets/images/my1.png")
    };
  },
  methods: {
    // 点击跳转首页
    Index: function() {
      this.$router.replace({ path: "/", query: { index: 1 } });
    },
    // 点击跳转品牌页面
    Brand: function() {
      this.$router.replace({ path: "/Brand", query: { index: 2 } });
    },
    // 点击跳转商城页面
    Shop: function() {
      this.$router.replace({ path: "/Shop", query: { index: 3 } });
    },
    // 点击跳转个人页面
    Personal: function() {
      this.$router.replace({ path: "/Personal", query: { index: 4 } });
    }
  },
  mounted() {
    var num = this.index;
    if (num == 1) {
      this.isIndex = true;
    }
    if (num == 2) {
      this.isBrand = true;
    }
    if (num == 3) {
      this.isShop = true;
    }
    if (num == 4) {
      this.isMy = true;
    }
  }
};
</script>

<style scoped>
.foot_wrap {
  overflow: hidden;
  zoom: 1;
}
</style>
