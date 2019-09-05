<template>
  <div class="contant">
    <!-- head -->
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png">忘记密码
    </div>
    <!-- 内容 -->
    <div class="box">
      <!-- 验证账号 -->
      <div class="account">验证账号</div>
      <div class="info">
        <div class="title">手机号码</div>
        <input placeholder="请输入手机号" class="inp" maxlength="11" v-model="phone">
      </div>
      <div class="info">
        <div class="title">验证码</div>
        <input placeholder="请输入验证码" v-model="smsCode" maxlength="4" class="inp">
        <div class="btnCode" v-on:click="getCode" v-show="isShow">获取验证码</div>
        <div class="btnCode" v-show="!isShow">{{auth_time}}秒后重发</div>
      </div>
      <div class="btn" @click="next">下一步</div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post } from "@/api/global";
// 弹窗
import { handleCofirm } from "@/api/confirm";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isShow: true,
      url: Global.url,
      auth_time: 0,
      sending: false,
      phone: "",
      smsCode: ""
    };
  },
  methods: {
    Cancel: function() {
      this.$router.go(-1);
    },
    // 获取验证码
    getCode: function() {
      let tel = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      let that = this;
      if (!tel.test(that.phone)) {
        Toast("请输入正确的手机号");
        return true;
      } else {
        if (!this.sending) {
          var auth_timetimer;

          post(this.url + "/base/getCode", "phone=" + this.phone, {
            method: "post"
          })
            .then(resp => {
              if (resp.data.msg != "发送验证码成功") {
                Toast(err.msg);
              } else {
                that.isShow = !that.isShow;
                that.auth_time = 60;
                auth_timetimer = setInterval(function() {
                  that.auth_time--;
                  if (that.auth_time <= 0) {
                    that.isShow = true;
                    // that.sending = false
                    clearInterval(auth_timetimer);
                  }
                }, 1000);
                that.sending = true;
              }
            })
            .catch(err => {
              Toast(err.msg);
            });
        }
      }
    },

    // 下一步
    next: function() {
      let tel = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      let that = this;
      if (!tel.test(that.phone)) {
        Toast("请输入正确的手机号");
        return true;
      }else{

        // 校验验证码
        post(
          this.url + "/base/validateCode",
          "phone=" + this.phone + "&code=" + this.smsCode
        ).then(resp => {
          if (resp.data.code == 100) {
            this.$router.replace({ path: "/ResetPwd" });
          }
        })
        .catch(err=>{
          Toast(err.msg)
        });
      }
      }

  },
  created: function() {}
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  z-index: 999;
  cursor: pointer;
}
/* 验证账号 */
.account {
  width: 100%;
  height: 2.37rem;
  line-height: 2.37rem;
  text-align: center;
  color: #333;
  font-size: 0.34rem;
  cursor: pointer;
}
/* 手机号 验证码 */
.info {
  width: 94%;
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  height: 65px;
  margin-bottom: 0.6rem;
  cursor: pointer;
}
.title {
  width: 100%;
  height: 38px;
  line-height: 38px;
  text-align: left;
  font-size: 0.34rem;
  cursor: pointer;
}

/* 获取验证码 */
.btnCode {
  float: right;
  color: #3d8141;
  font-size: 0.3rem;
  cursor: pointer;
}
/* 下一步按钮 */
.btn {
  width: 3.08rem;
  height: 0.88rem;
  font-size: 0.3rem;
  color: white;
  margin: 1.6rem auto 0;
  text-align: center;
  line-height: 0.88rem;
  background: linear-gradient(
    23deg,
    rgba(62, 130, 65, 1),
    rgba(101, 169, 108, 1)
  );
  border-radius: 0.42rem;
  cursor: pointer;
}
</style>
