<template>
  <div class="content">
    <div class="head">
      <div class="head">
        <img class="cancelicon" src="../assets/images/cancel.png" @click="toPrev">充值失败
      </div>
    </div>
    <div class="showimg">
      <img src="../assets/images/rechargefail.png">
    </div>
    <div class="info">充值失败</div>
    <div class="btn" @click="toPrev()">返回</div>
  </div>
</template>
<script>
export default {
  methods: {
    toPrev: function() {
      this.$router.replace({path:'/'});
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
  width: 142px;
  height: 130px;
  margin: 100px auto 10px auto;
  cursor: pointer;
}
.showimg img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.info {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  color: #3d8141;
  cursor: pointer;
}
.btn {
  width: 160px;
  height: 44px;
  line-height: 44px;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  border-radius: 30px;
  color: #fff;
  margin: 20px auto;
  cursor: pointer;
}
</style>
