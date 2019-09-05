<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />设置
    </div>
    <div class="alllist">
      <div class="list">
        版本号
        <span>v1.0</span>
      </div>
      <div class="list" @click="setPwd()">设置密码</div>
      <div class="list" style="border-bottom: none" @click="loginOut">退出登录</div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    // 设置密码
    setPwd: function() {
      var pwdStatus = localStorage.getItem("pwd");
      if (pwdStatus == 1) {
        this.$router.replace({ path: "/ModifyPwd" });
      } else {
        this.$router.replace({ path: "/pwd" });
      }
    },
    // 退出登录
    loginOut: function() {
      localStorage.clear();
      this.$router.replace({ path: "/" });
    }
  },
  created() {}
};
</script>
<style scoped>
body {
  background: #f8f8f8;
}
.alllist {
  width: 100% !important;
  background: #fff !important;
  cursor: pointer;
}
.list {
  width: 94% !important;
  height: 60px !important;
  line-height: 60px !important;
  border-bottom: 1px solid #eaeaea !important;
  margin-left: 3% !important;
  text-align: left !important;
  cursor: pointer;
  font-size: 0.28rem;
}
.list span {
  float: right !important;
  cursor: pointer;
}
</stylescoped>
