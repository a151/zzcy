<template>
  <div class="content">
    <div class="head">品牌</div>
    <div class="con">
      <img src="../assets/images/brandcon.png">
    </div>

    <foot :index="index"></foot>
  </div>
</template>
<script>
import foot from "../components/foot";
export default {
  data() {
    return {
      index: 2
    };
  },
  methods: {
    // 点击跳转首页
    Index: function() {
      this.$router.replace({ path: "/" });
    },
    // 点击跳转我的
    Personal: function() {
      this.$router.replace({ path: "/Personal" });
    }
  },
  components: {
    foot
  },
  mounted() {

  }
};
</script>
<style scoped>
.content{
  display: flex;
  display:-webkit-flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
}
.con {
  /* position: fixed;
  bottom: 60px;
  top: 50px; */
  width:100%;
  height:100%;
  overflow: auto;
  cursor: pointer;
  padding-bottom: 1.1rem;
}
.con img {
  width: 100%;
  cursor: pointer;
}
</style>
