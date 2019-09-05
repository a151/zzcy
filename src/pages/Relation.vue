<template>
  <!-- 关联手机号 -->
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />绑定注册
    </div>
    <img src="../assets/images/topbac.png" class="logo" />
    <div class="info">
      <div class="title">手机号码</div>
      <input placeholder="请输入手机号" @blur="outInput" class="inp" maxlength="11" v-model="phone" />
    </div>
    <div class="info">
      <div class="title">昵称（必填）</div>
      <input placeholder="请输入昵称" @blur="outInput" class="inp" maxlength="11" v-model="username" />
    </div>
    <div class="info">
      <div class="title">验证码</div>
      <input placeholder="请输入验证码" @blur="outInput" v-model="smsCode" maxlength="4" class="inp" />
      <div class="btn" v-on:click="getCode" v-show="isShow">获取验证码</div>
      <div class="btn" v-on:click="getCode" v-show="!isShow">{{auth_time}}秒后重发</div>
    </div>
    <div class="login ll" v-on:click="action">注册</div>
  </div>
</template>

<script>
import Global from "@/api/global";
import { post } from "@/api/global";
import { get } from "@/api/global";
import $ from "jquery";
// 弹窗
import { handleCofirm } from "@/api/confirm";
import { Toast } from "mint-ui";
import { stat, truncate, truncateSync } from "fs";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      isShow: true,
      nickName: "",
      pic: "",
      url: Global.url,
      smsCode: "",
      phone: "",
      agree: true,
      loginstyle: 'url("../assets/images/nologin.png");',
      levelName: "",
      openId: "",
      auth_time: 0,
      plantform: "web",
      sending: false,
      token: "",
      loginList: {},
      province: "",
      city: "",
      district: "",
      username: "",
      invitorPhone: ""
    };
  },

  methods: {
    // 失去焦点
    outInput: function() {
      window.scroll(0, 0);
      $("body").height($("body")[0].clientHeight);
    },
    Cancel: function() {
      this.$router.replace({ path: "/Index" });
    },
    // 登录判断
    action: function() {
      let tel = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      let that = this;
      this.unbind = true;
      if (!tel.test(that.phone)) {
        Toast("请输入正确的手机号");
        return true;
      }
      if (this.username == "") {
        Toast("请输入昵称");
        return true;
      }
      if (this.smsCode == "") {
        Toast("请输入验证码");
        return true;
      }
      this.oldUser();
    },
    // 获取验证码
    getCode: function() {
      let tel = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      let that = this;
      if (!tel.test(that.phone)) {
        Toast("请输入正确的手机号");
        return true;
      }
      if (!this.sending) {
        var auth_timetimer;
        post(this.url + "/base/getCode?phone=" + this.phone).then(resp => {
          if (resp.data.msg != "发送验证码成功") {
            Toast("发送验证码失败");
          } else {
            that.isShow = !that.isShow;
            that.auth_time = 60;
            auth_timetimer = setInterval(function() {
              that.auth_time--;
              if (that.auth_time <= 0) {
                that.isShow = true;
                clearInterval(auth_timetimer);
              }
            }, 1000);
            that.sending = true;
          }
        });
      }
    },
    getUrlParam: function() {
      let url = window.location.href;
      let start = url.indexOf("phone=");
      let phone = url.substring(start + 6, url.length);
      return phone;
    },
    // web端登录
    Login: function() {
      post(
        this.url + "/login/h5Validate",
        "phone=" +
          this.phone +
          "&smsCode=" +
          this.smsCode +
          "&nickName=" +
          this.username +
          "&pic=" +
          this.pic +
          "&invitorPhone=" +
          this.invitorPhone,
        {
          method: "post"
        }
      )
        .then(resp => {
          if (resp.data.code == 100) {
            var regionList = resp.data.data.regionList;
            if (resp.data.data.level == 0) {
              this.levelName = "游客";
            } else if (resp.data.data.level == 1) {
              this.levelName = "萌小青";
            } else if (resp.data.data.level == 2) {
              this.levelName = "游菜侠";
            } else if (resp.data.data.level == 3) {
              this.levelName = "憨大臣";
            } else if (resp.data.data.level == 4) {
              this.levelName = "俏皇后";
            } else if (resp.data.data.level == 5) {
              this.levelName = "菜国王";
            } else if (resp.data.data.level == 98) {
              localStorage.setItem("level_num", "1");
              if (regionList != null) {
                for (let i in regionList) {
                  if (
                    regionList[0].id == 1 ||
                    regionList[0].id == 2 ||
                    regionList[0].id == 9 ||
                    regionList[0].id == 22
                  ) {
                    (this.province = regionList[0].name),
                      (this.city = regionList[2].name);
                  } else {
                    (this.province = regionList[0].name),
                      (this.city = regionList[1].name),
                      (this.district = regionList[2].name);
                  }
                }
              }
              this.levelName = this.province + this.city + "服务商";
            } else if (resp.data.data.level == 99) {
              localStorage.setItem("level_num", "2");
              if (regionList != null) {
                for (let i in regionList) {
                  if (
                    regionList[0].id == 1 ||
                    regionList[0].id == 2 ||
                    regionList[0].id == 9 ||
                    regionList[0].id == 22
                  ) {
                    (this.province = regionList[0].name),
                      (this.city = regionList[2].name);
                  } else {
                    (this.province = regionList[0].name),
                      (this.city = regionList[1].name),
                      (this.district = regionList[2].name);
                  }
                }
              }
              this.levelName = this.city + "召集人";
            }

            // 等级
            localStorage.setItem("level", this.levelName);
            localStorage.setItem("token", resp.data.data.token);
            localStorage.setItem("phone", resp.data.data.phone);
            //  推荐人手机号
            localStorage.setItem("tel", resp.data.data.invitorUserPhone);
            // 地区
            localStorage.setItem("address", resp.data.data.address);
            localStorage.setItem("city", resp.data.data.city);
            localStorage.setItem("province", resp.data.data.province);
            //  用户头像
            localStorage.setItem("headImg", resp.data.data.headImg);
            // 推荐人手机号
            localStorage.setItem(
              "invitorUserPhone",
              resp.data.data.invitorUserPhone
            );
            //  昵称
            localStorage.setItem("nick_name", resp.data.data.nickName);
            // 是否手动升级
            localStorage.setItem("update", resp.data.data.isUpgrade);
            // 金豆数量
            localStorage.setItem("money", resp.data.data.money);
            // 菜宝数量
            localStorage.setItem("xProperty", resp.data.data.xProperty);
            // 菜金数量
            localStorage.setItem("rewardMoney", resp.data.data.rewardMoney);
            // 己分享认种人数
            localStorage.setItem("shareInt", resp.data.data.shareInt);
            // 交易密码
            localStorage.setItem("pwd", resp.data.data.conPass);
            localStorage.setItem("uid", resp.data.data.uid);
            Toast("注册成功");
            // setTimeout(function() {
            this.$router.replace({ path: "/" });
            // }, 1300);
          }
        })
        .catch(err => {
          console.log(err);
          Toast(err.msg);
        });
    },
    //判断是否老用户
    oldUser:function () {
        let _this=this;
        get(
            this.url + "/user/isRegister?phone="+this.phone
        ).then(res =>{
          if(res.msg == '操作成功'){
              _this.Login();
          }else if(res.msg == '账号已存在') {
              Toast("您的账号已经注册，系统自动导航到登陆页面 ");
              setTimeout(function () {
                  _this.$router.replace({ path: "/Index" });
              },2000)
          }
        }).catch(error =>{
              Toast('网络错误')
        });
    }
  },
  created() {
    this.invitorPhone = this.$route.query.phone;
  }
};
</script>

<style scoped>
.logo {
  margin: 0 auto;
  margin-top: 0.43rem;
  cursor: pointer;
}
/* 关联手机号 */
.relation_phone {
  font-size: 0.42rem;
  text-align: left;
  margin: 1.48rem 0 0.8rem 0.28rem;
  line-height: 1;
  cursor: pointer;
}
.content {
  font-size: 14px;
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  overflow: auto;
  width: 100%;
  cursor: pointer;
  background-color: #fff;
}
.nologin {
  background: url("../assets/images/nologin.png");
  cursor: pointer;
}
.ll {
  background: url("../assets/images/login.png");
  cursor: pointer;
}
.head {
  width: 100%;
  height: 50px;
  background: #3d8141;
  color: #fff;
  line-height: 50px;
  cursor: pointer;
}
.bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  cursor: pointer;
}
.bottom img {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  cursor: pointer;
}
.info {
  width: 94%;
  margin: 14px auto;
  border-bottom: 1px solid #ededed;
  height: 65px;
  cursor: pointer;
}
.title {
  width: 100%;
  height: 38px;
  line-height: 38px;
  text-align: left;
  cursor: pointer;
}
.inp {
  border: none !important;
  width: 70%;
  float: left;
  text-align: left;
  cursor: pointer;
}
.btn {
  float: right;
  color: #3d8141;
  cursor: pointer;
}
.login {
  width: 3.2rem;
  height: 0.88rem;
  line-height: 0.88rem;
  background-size: 100% 100%;
  border-radius: 30px;
  margin: 0 auto;
  color: #fff;
  cursor: pointer;
  margin-top: 0.8rem;
  font-size: 0.36rem;
  cursor: pointer;
}
</style>
