<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png">市场分红规则
    </div>
    <div class="detail">
      <img src="../assets/images/marketRule.png">
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Market" });
    }
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
.detail {
  /* position: fixed;
  top: 50px;
  bottom: 0; */
  width:100%;
  height:100%;
  overflow: auto;
  cursor: pointer;
}
.detail img {
  width: 100%;
  cursor: pointer;
}
</style>
