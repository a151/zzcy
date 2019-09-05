<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />
      {{level}}
    </div>
    <div>
      <img :src="src" class="rule" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: require("../assets/images/visitor.png"),
      level: "游客"
    };
  },
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    }
  },
  mounted() {
    this.level = localStorage.getItem("level");
    if (localStorage.getItem("level_num") == 1) {
      this.src =
        "http://res.shosen.cn:8080/wx/garden/images/mine/quxianRule.png";
    } else if (localStorage.getItem("level_num") == 2) {
      this.src =
        "http://res.shosen.cn:8080/wx/garden/images/mine/chengshiRule.png";
    }
    switch (this.level) {
      case "萌小青":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/mengxiaoqing.png";
        break;
      case "游菜侠":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/youcaixia.png";
        break;
      case "憨大臣":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/handachen.png";
        break;
      case "俏皇后":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/qiaohuanghou.png";
        break;
      case "菜国王":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/caiguowang.png";
        break;
      default:
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  overflow: auto;
  cursor: pointer;
}
.content .rule {
  width: 100%;
  cursor: pointer;
}
</style>