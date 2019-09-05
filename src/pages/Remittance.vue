<template>
  <div class="content">
    <div class="head">
      <div class="head">
        <img class="cancelicon" src="../assets/images/cancel.png" @click="toPrev()">汇款信息
      </div>
    </div>
    <div class="showimg">
      <img src="../assets/images/rechargesuccess.png">
    </div>
    <div class="info">恭喜你提交成功</div>
    <div class="tips">
      我们会在2个工作日内核实您的汇款信息
      信息无误后会即刻为您发放菜宝，请耐心等候！
    </div>
    <div class="btn" v-on:click="Index">返回</div>
  </div>
</template>
<script>
export default {
  methods: {
    Index: function() {
      this.$router.replace({ path: "/" });
    },
    toPrev: function() {
      this.$router.replace({ path: "/BrandDetail" });
    }
  }
};
</script>
<style scoped>
.content {
  font-size: 14px;
  cursor: pointer;
}
.showimg {
  width: 3rem;
  height: 2.52rem;
  margin: 2.47rem auto 0.5rem;
  cursor: pointer;
}
.showimg img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.info {
  width: 100%;
  font-size: 0.4rem;
  color: #3d8141;
  text-align: center;
  cursor: pointer;
}
.tips{
    font-size:0.32rem;
    line-height: 0.42rem;
    color:#666;
    margin:0.28rem 0.5rem 0.58rem;
    text-align: center;
}
.btn {
  width: 3.08rem;
  height: 0.89rem;
  line-height: 0.89rem;
  background-image: url('../assets/images/remittance.png');
  background-position: 0 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #333;
  font-size:0.32rem;
  margin: 0 auto;
  cursor: pointer;
}
</style>
