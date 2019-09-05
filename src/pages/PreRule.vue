<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />
      {{name}}
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
      src: "",
      name: ""
    };
  },
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Prerogative" });
    }
  },
  mounted() {
    this.name = this.$route.query.name;
    switch (this.name) {
      case "认种会员":
        this.src = require("../assets/images/rule.png");
        break;
      case "社区合伙人":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/hehuoRule.png";
        break;
      case "区县服务商":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/quxianRule.png";
        break;
      case "城市召集人":
        this.src =
          "http://res.shosen.cn:8080/wx/garden/images/mine/chengshiRule.png";
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
