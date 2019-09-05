<template>
  <div class="user_container">
    <div class="content">
      <div class="head">登录</div>
      <img src="../assets/images/topbac.png" class="logo" />
      <div class="info">
        <div class="title">手机号码</div>
        <input type="number" placeholder="请输入手机号" class="inp" @blur="outInput" maxlength="11" v-model="phone" />
      </div>
      <div class="info">
        <div class="title">推荐人（首次登录必填）</div>
        <input
          placeholder="请输入推荐人手机号"
          type="number"
          class="inp"
          @blur="outInput"
          maxlength="11"
          v-model="invitorPhone"
        />
      </div>
      <div class="info">
        <div class="title">验证码</div>
        <input type="number" placeholder="请输入验证码" @blur="outInput" v-model="smsCode" maxlength="4" class="inp" />
        <div class="btn" v-on:click="getCode" v-show="isShow">获取验证码</div>
        <div class="btn" v-show="!isShow">{{auth_time}}秒后重发</div>
      </div>
      <div class="login ll" v-on:click="Login">登录</div>
      <div class="remark">
        <div class="remark_box">
          <img v-show="sure" src="../assets/images/sure.png" class="icon" v-on:click="noagree" />
          <img v-show="agree" src="../assets/images/agree.png" class="icon" v-on:click="yesagree" />
          <span>
            我已阅读并同意
            <span style="color:#3d8141">《众种菜园用户协议》</span>
          </span>
        </div>
      </div>
      <!-- 微信登录 -->
      <!-- <div class="wx_login" @click="getWx">
      <div class="wx_top">
        <img src="../assets/images/wx.png" alt @click="wxIcon">
      </div>
      <div class="wx_bot">微信登录</div>
      </div>-->
    </div>
  </div>
</template>

<script>
import Global from "@/api/global";
import { post } from "@/api/global";
import $ from "jquery";
// 弹窗
import { handleCofirm } from "@/api/confirm";
import { Toast } from "mint-ui";
import { truncate } from "fs";
// import FastClick from "fastclick"
export default {
  data() {
    return {
      isShow: true,
      nickName: "",
      pic: "",
      url: Global.url,
      smsCode: "",
      phone: "",
      invitorPhone: "",
      sure: true,
      agree: false,
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
      unbind: false,
      cliHeight: ""
    };
  },

  methods: {
    // 不同意
    noagree() {
      if (this.sure == true) {
        this.sure = false;
        this.agree = true;
      }
    },
    yesagree() {
      if (this.sure == false) {
        this.sure = true;
        this.agree = false;
      }
    },
    // 同意
    // 失去焦点
    outInput: function() {
      window.scroll(0, 0);
    },
    // 登录
    getWx: function() {
      var param = {
        app: app,
        origin_url: window.location.href
      };
      var queryString = getSignature(param) + "&" + getQueryString(param); // 未授权，跳转到授权页面
      if (!localStorage.getItem("wxcode")) {
        window.location.href =
          "http://wx.linktodeal.com/sns/authorization?" + queryString;
      }
    },
    // 环境判断
    Init: function() {
      var is_weixin = (function() {
        return (
          navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1
        );
      })();
      this.getOpenId();
      // if (is_weixin) {
      //   this.plantform = "wx";
      //   this.getOpenId();
      //   console.log('判断环境')
      // }
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
      // this.Init();
      this.Login();
      // if (this.plantform == "wx") {
      //   this.wxLogin();
      // } else {
      //   this.Login();
      // }
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
            Toast(resp.data.msg);
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

    //获取code
    getOpenId: function() {
      var AppId = "wxa724281df7f4db44";
      var code = this.getUrlParam("code");
      var local = window.location.href;

      if (code == null || code == "") {
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          AppId +
          "&redirect_uri=" +
          encodeURIComponent(local) +
          "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      } else {
        this.getOpen(code);
      }
    },
    // 获取OpenId
    getOpen: function(code) {
      post(this.url + "/pay/getOpenId?code=" + code)
        .then(res => {
          if (res.data.code == 100) {
            this.openId = res.data.data;
            localStorage.setItem("openId", res.data.data);
            // this.wxLogin();
            // this.Login();
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    // 微信登录获取用户信息
    wxLogin() {
      post(
        this.url + "/wclogin/login?openId=" + this.openId ||
          localStorage.getItem("openId")
      )
        .then(resp => {
          let data = resp.data.data;
          this.pic = data.headImg;
          this.nickName = data.nickName;
          // console.log(data);
          // var regionList = resp.data.data.regionList;
          // if (resp.data.code == 100) {
          //   if (resp.data.data.level == 0) {
          //     this.levelName = "游客";
          //   } else if (resp.data.data.level == 1) {
          //     this.levelName = "萌小青";
          //   } else if (resp.data.data.level == 2) {
          //     this.levelName = "游菜侠";
          //   } else if (resp.data.data.level == 3) {
          //     this.levelName = "憨大臣";
          //   } else if (resp.data.data.level == 4) {
          //     this.levelName = "俏皇后";
          //   } else if (resp.data.data.level == 5) {
          //     this.levelName = "菜国王";
          //   } else if (resp.data.data.level == 98) {
          //     localStorage.setItem("level_num", "1");
          //     if (regionList != null) {
          //       for (let i in regionList) {
          //         if (
          //           regionList[0].id == 1 ||
          //           regionList[0].id == 2 ||
          //           regionList[0].id == 9 ||
          //           regionList[0].id == 22
          //         ) {
          //           (this.province = regionList[0].name),
          //             (this.city = regionList[2].name);
          //         } else {
          //           (this.province = regionList[0].name),
          //             (this.city = regionList[1].name),
          //             (this.district = regionList[2].name);
          //         }
          //       }
          //     }
          //     this.levelName = this.province + this.city + "服务商";
          //   } else if (resp.data.data.level == 99) {
          //     localStorage.setItem("level_num", "1");
          //     if (regionList != null) {
          //       for (let i in regionList) {
          //         if (
          //           regionList[0].id == 1 ||
          //           regionList[0].id == 2 ||
          //           regionList[0].id == 9 ||
          //           regionList[0].id == 22
          //         ) {
          //           (this.province = regionList[0].name),
          //             (this.city = regionList[2].name);
          //         } else {
          //           (this.province = regionList[0].name),
          //             (this.city = regionList[1].name),
          //             (this.district = regionList[2].name);
          //         }
          //       }
          //     }
          //     this.levelName = this.city + "召集人";
          //   }
          //   // this.phone = data.phone;
          //   this.token = data.token;

          //   this.pic = data.headImg;
          //   this.nickName = data.nickName;
          //   this.loginList = data;
          //   // 等级

          //   localStorage.setItem("level", this.levelName);
          //   localStorage.setItem("token", data.token);
          //   localStorage.setItem("phone", data.phone);
          //   //  推荐人手机号
          //   localStorage.setItem("tel", data.invitorUserPhone);
          //   // 地区
          //   localStorage.setItem("address", data.address);
          //   localStorage.setItem("city", data.city);
          //   localStorage.setItem("province", data.province);
          //   //  用户头像
          //   localStorage.setItem("headImg", data.headImg);

          //   //  昵称
          //   localStorage.setItem("nick_name", data.nickName);
          //   // 是否手动升级
          //   localStorage.setItem("update", data.isUpgrade);
          //   // 金豆数量
          //   localStorage.setItem("money", data.money);
          //   // 菜宝数量
          //   localStorage.setItem("xProperty", data.xProperty);
          //   // 菜金数量
          //   localStorage.setItem("rewardMoney", data.rewardMoney);
          //   // 己分享认种人数
          //   localStorage.setItem("shareInt", data.shareInt);
          //   // 交易密码
          //   localStorage.setItem("pwd", data.conPass);
          //   localStorage.setItem("uid", data.uid);
          // let url = window.location.href;
          // let start = url.indexOf('?');
          // let end = url.indexOf('#');
          // if(start>-1){
          // window.location.replace(url.substring(0, start) + url.substring(end, url.length))
          // }
          // this.$router.replace({ path: "/" });
          // }
        })
        .catch(err => {
          // Toast(err.msg)
          // if (err.code == 999) {
          //   this.unbind ? this.wcLogin() : "";
          // }
        });
    },
    // 用户注册
    wcLogin: function() {
      post(this.url + "/wclogin/register", {
        nickName: localStorage.getItem("nick_name"),
        openId: localStorage.getItem("openId"),
        phone: this.phone,
        pic: this.pic,
        smsCode: this.smsCode
      })
        .then(resp => {
          let data = resp.data.data;
          var regionList = resp.data.data.regionList;
          if (resp.data.code == 100) {
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
            // this.phone = data.phone;
            this.token = data.token;

            this.pic = data.headImg;
            this.nickName = data.nickName;
            this.loginList = data;
            // 等级

            localStorage.setItem("level", this.levelName);
            localStorage.setItem("token", data.token);
            localStorage.setItem("phone", data.phone);
            //  推荐人手机号
            localStorage.setItem("tel", data.invitorUserPhone);
            // 地区
            localStorage.setItem("address", data.address);
            localStorage.setItem("city", data.city);
            localStorage.setItem("province", data.province);
            //  用户头像
            localStorage.setItem("headImg", data.headImg);

            //  昵称
            localStorage.setItem("nick_name", data.nickName);
            // 是否手动升级
            localStorage.setItem("update", data.isUpgrade);
            // 金豆数量
            localStorage.setItem("money", data.money);
            // 菜宝数量
            localStorage.setItem("xProperty", data.xProperty);
            // 菜金数量
            localStorage.setItem("rewardMoney", data.rewardMoney);
            // 己分享认种人数
            localStorage.setItem("shareInt", data.shareInt);
            // 交易密码
            localStorage.setItem("pwd", data.conPass);
            localStorage.setItem("uid", data.uid);
            this.bindWx();
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    // 微信绑定web端
    bindWx: function() {
      post(this.url + "/wclogin/loginRegister", {
        nickName: this.nickName,
        openId: localStorage.getItem("openId"),
        phone: localStorage.getItem("phone"),
        pic: this.pic,
        smsCode: this.smsCode,
        token: localStorage.getItem("token")
      })
        .then(resp => {
          if (resp.data.code == 100) {
            this.$router.replace({ path: "/" });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    //调用第三方h5支付接口

    getUrlParam: function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },
    // web端登录
    Login: function() {
      let tel = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      let that = this;
      if (that.agree == false) {
        Toast("请阅读并同意《众种菜园用户协议》");
        return true;
      }
      if (!tel.test(that.phone)) {
        Toast("请输入正确的手机号");
        return true;
      }
      if (this.smsCode == "") {
        Toast("请输入验证码");
        return true;
      }
      this.agin();
    },
    agin: function() {
      post(
        this.url + "/login/h5Validate",
        "phone=" +
          this.phone +
          "&smsCode=" +
          this.smsCode +
          "&nickName=" +
          this.nickName +
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
            //           //  推荐人手机号
            localStorage.setItem("tel", resp.data.data.invitorUserPhone);
            // 地区
            localStorage.setItem("address", resp.data.data.address);
            localStorage.setItem("city", resp.data.data.city);
            localStorage.setItem("province", resp.data.data.province);
            //  用户头像
            localStorage.setItem("headImg", resp.data.data.headImg);

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
            this.$router.replace({ path: "/" });
          }
        })
        .catch(err => {
          console.log(err.msg);
          Toast(err.msg);
        });
    },

    // 微信图标登录
    // wxIcon: function() {
    //   this.getOpenId();
    // }
    pushHistory() {
      //写入空白历史路径
      let state = {
        title: "title",
        url: "#"
      };
      window.history.pushState(state, state.title, state.url);
    },
    back() {
      this.pushHistory();
      window.addEventListener(
        "popstate",
        function(e) {
          location.href = "/";
        },
        false
      );
    },
    hiddenBtn: function() {
      isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

      if (fn.isIOS) {
        window.history.pushState({}, "title", "#");
      }
    }
  },
  // computed() {},
  mounted() {
    this.hiddenBtn();
  },
  created() {
    this.Init();
      wx.ready(function(){
          wx.showMenuItems({
              menuList: ['menuItem:exposeArticle'] // 要显示的菜单项，所有menu项见附录3
          });
      });
  }
};
</script>

<style scoped>
.user_container {
  font-size: 14px;
  background: url("../assets/images/bottombac.png");
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  cursor: pointer;
  /* display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column; */
}
.content {
  width: 100%;
  position: relative;
  height: 100vh;
  overflow-y: auto;
  cursor: pointer;
}
.logo {
  margin: 0 auto;
  margin-top: 0.43rem;
  cursor: pointer;
}
/* .nologin {
  background: url("../assets/images/nologin.png");
  cursor: pointer;
  z-index:2
} */
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
  margin: 10px auto;
  border-bottom: 1px solid #ededed;
  height: 65px;
  cursor: pointer;
  overflow: hidden;
}
.title {
  width: 100%;
  height: 40px;
  line-height: 40px;
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
  height: 0.48rem;
}
.login {
  width: 3.2rem;
  height: 0.88rem;
  line-height: 0.88rem;
  background-size: 100% 100%;
  border-radius: 30px;
  margin: 20px auto;
  color: #fff;
  cursor: pointer;
}
.icon {
  position: relative;
  top: 8px;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
/* 协议 */
.remark {
  text-align: left;
  cursor: pointer;
}
.remark_box {
  margin-left: 10px;
  cursor: pointer;
}
/* 微信登录 */
.wx_login {
  text-align: center;
  margin-top: 0.5rem;
  cursor: pointer;
}
/* 微信logo */
.wx_top {
  width: 0.6rem;
  height: 0.5rem;
  margin: 0 auto;
  cursor: pointer;
}
.wx_top img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
/* 微信登录 */
.wx_bot {
  color: #333;
  font-size: 0.28rem;
  line-height: 1;
  margin-top: 0.18rem;
  cursor: pointer;
}
</style>
