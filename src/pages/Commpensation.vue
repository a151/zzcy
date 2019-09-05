<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" src="../assets/images/cancel.png" @click="toPrev(level)" />补差升级
    </div>
    <img class="level" :src="srcurl" />
    <div class="title">
      升级为
      <span>{{name}}</span>级别，您需要消耗
    </div>
    <div class="price">
      <span>{{price}}</span>菜宝
    </div>
    <div class="btn" v-on:click="Paysuccess">立即支付</div>
    <div class="passWordInput" :class="popupVisible ? 'show' : '' ">
      <div class="pwd_input">
        <!-- 提示 -->
        <div class="pwd_tips">
          <img src="../assets/images/img_cancel.png" alt @click="close" />
          <span class="please_input">请输入密码</span>
        </div>
        <!-- 输入密码 -->
        <div>
          <div class="passwords" id="one">
            <input
              type="password"
              maxlength="6"
              class="realInput"
              v-model="realInput"
              @focus="inInput"
              @blur="outInput"
              id="focusid"
              ref="input1"
            />
            <ul class="write-input" @click="getbackMoney">
              <li
                v-for="(disInput2,index) in [1,2,3,4,5,6]"
                :key="index"
                :class="{pwd_blink:disInputs.length == index&&isBlink1 == true}"
              >
                <span class="passWord" v-show="index < disInputs.length">*</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 忘记密码 -->
        <p v-if="warn" class="warning">为保证账号安全，密码错误5次，交易冻结，如忘记密码，请点击忘记交易密码进行修改</p>
        <div class="forget" @click="toForget">忘记密码？</div>
      </div>
    </div>
    <div class="tishi" v-show="confirm">
      <div class="tishi_c">
        <div class="tishi_main">
          <div class="tishi_1">
            <img style="width: 70px;margin-top: 20px;" alt />
            <span style="font-size:18px;margin:10px 0 20px;color:#333333">交易密码冻结</span>
            <span
              style="font-size:15px;color:#333333;padding:0 20px;text-align:left;"
            >密码错误次数过多,为保证账号安全，交易被终止，请于12小时后重试，或联系官方确认身份</span>
          </div>
          <div class="tishi_2 clr">
            <!-- <span @click="no">取消转赠</span> -->
            <span @click="handleAnswer">确认</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Popup } from "mint-ui";
import { post, get } from "@/api/global";
import { Toast, TabContainer, TabContainerItem, MessageBox } from "mint-ui";
// 弹窗
import { handleCofirm } from "@/api/confirm";
import md5 from "js-md5";
import crypto from "crypto";
import Global from "@/api/global";
export default {
  data() {
    return {
      confirm: false,
      popupVisible: false,
      realInput: "",
      disInputs: [],
      isBlink1: false,
      name: "",
      price: "",
      level: "",
      xProperty: "",
      nextNum: "",
      upgrade: "",
      warn: false,
      url: Global.url,
      srcurl: "",
      // promotion: "",
      current: ""
    };
  },
  methods: {
    failDialog: function() {
      handleCofirm("菜宝数量不足", "请进行充值", "确认充值", "取消充值")
        .then(action => {
          if (action == "confirm") {
            this.$router.replace({ path: "/Recharge" });
          }
        })
        .catch(error => {
          if (error == "cancel") {
            // console.log("点击取消");
          }
        });
    },
    handleAnswer: function() {
      this.confirm = !this.confirm;
    },
    Paysuccess: function() {
      // 输入交易密码
      // 密码输入
      this.inInput();
      this.getbackMoney();
      this.popupVisible = true;
    },
    toPrev: function(level) {
      this.$router.replace({ path: "/Level", query: { senior: level } });
    },
    // 关闭密码
    close: function() {
      this.realInput = "";
      this.popupVisible = false;
    },
    outInput() {},

    inInput() {
      window.scroll(0, document.body.clientHeight);
      var idObj = document.getElementById("focusid");

      idObj.addEventListener("blur", function() {
        setTimeout(function() {
          window.scroll(0, document.body.clientHeight);
        }, 100);
      });
    },
    // 忘记密码
    toForget: function() {
      this.$router.replace({ path: "/ForgetPwd" });
    },
    // 用户刷新
    refresh: function() {
      post(
        this.url + "/login/refreshUser?phone=" + localStorage.getItem("phone")
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
            // 补差升级
            // localStorage.setItem("upgrade", this.promotion);
            // 等级
            localStorage.setItem("level", this.levelName);
            localStorage.setItem("phone", resp.data.data.phone);
            //  推荐人手机号
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
            this.xProperty = Number(localStorage.getItem("xProperty"));
            this.$router.replace({
              path: "/"
            });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    //密码输入功能
    getbackMoney: function() {
      var idObj = document.getElementById("focusid");
      idObj.focus();
      this.isBlink1 = true;
    },
    // 校验密码
    refreshUserData: function() {
      post(this.url + "/base/comparePass", {
        phone: localStorage.getItem("phone"),
        token: localStorage.getItem("token"),
        pass: md5(this.realInput)
      })
        .then(resp => {
          // let promotion = 1;
          // this.popupVisible = false;
          // this.refresh(promotion);
          if (resp.data.code == 100) {
            if (this.price <= this.xProperty) {
              post(this.url + "/user/isUpgrade", {
                level: this.upgrade,
                phone: localStorage.getItem("phone"),
                token: localStorage.getItem("token")
              })
                .then(resp => {
                  Toast("升级成功");
                  this.popupVisible = false;
                  this.refresh();
                })
                .catch(err => {
                  Toast(err.msg);
                });
            } else {
              this.failDialog();
            }
            Toast(resp.msg);
          }
        })
        .catch(err => {
          get(
            this.url + "/base/limittpnum?phone=" + localStorage.getItem("phone")
          ).then(resp => {
            this.passnum = resp.data;
            if (this.passnum > 0) {
              this.popupVisible = false;
              this.realInput = "";
            }
            if (this.passnum >= 3) {
              this.warn = true;
            }
            if (resp.data >= 5) {
              this.confirm = true;
            }
          }),
            setTimeout(function() {
              var idObj = document.getElementById("focusid");
              idObj.blur();
              window.scroll(0, 0);
              this.realInput = "";
              Toast("密码错误");
            }, 300);
        });
    }
  },
  watch: {
    realInput(newV, oldV) {
      this.disInputs = newV.split("");
      if (newV.length == 6) {
        this.refreshUserData();
      }
    }
  },
  created() {
    this.level = localStorage.getItem("level");
    this.xProperty = Number(localStorage.getItem("xProperty"));
    this.name = this.$route.query.name;
    this.current = this.$route.query.level;
    if (this.current == "萌小青") {
      if (this.name == "游菜侠") {
        this.price = 3000;
        this.upgrade = 2;
        this.srcurl = require("../assets/images/chivalrous.png");
        // console.log(this.price);
      } else if (this.name == "憨大臣") {
        this.price = 6000;
        this.upgrade = 3;
        this.srcurl = require("../assets/images/ministers.png");
      } else if (this.name == "俏皇后") {
        this.price = 9000;
        this.upgrade = 4;
        this.srcurl = require("../assets/images/queens.png");
      } else if (this.name == "菜国王") {
        this.price = 12000;
        this.upgrade = 5;
        this.srcurl = require("../assets/images/kings.png");
      }
    } else if (this.current == "游菜侠") {
      if (this.name == "憨大臣") {
        this.price = 3000;
        this.upgrade = 3;
        this.srcurl = require("../assets/images/ministers.png");
      } else if (this.name == "俏皇后") {
        this.price = 6000;
        this.upgrade = 4;
        this.srcurl = require("../assets/images/queens.png");
      } else if (this.name == "菜国王") {
        this.price = 9000;
        this.upgrade = 5;
        this.srcurl = require("../assets/images/kings.png");
      }
    } else if (this.current == "憨大臣") {
      if (this.name == "俏皇后") {
        this.price = 3000;
        this.upgrade = 4;
        this.srcurl = require("../assets/images/queens.png");
      } else if (this.name == "菜国王") {
        this.price = 6000;
        this.upgrade = 5;
        this.srcurl = require("../assets/images/kings.png");
      }
    } else if (this.current == "俏皇后") {
      if (this.name == "菜国王") {
        this.price = 3000;
        this.upgrade = 5;
        this.srcurl = require("../assets/images/queens.png");
      }
    }
  },
  mounted() {}
};
</script>
<style scoped>
@import "../style/pwd.css";
.content {
  font-size: 14px;
  cursor: pointer;
}
.level {
  width: 24%;
  margin: 1rem auto;
  cursor: pointer;
}
.title {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  font-size: 0.32rem;
}
.title span {
  margin-left: 2%;
  margin-right: 2%;
  color: #3d8141;
  font-size: 0.36rem;
  font-weight: 500;
  cursor: pointer;
}
.price {
  width: 100px;
  margin: 10px auto 10px auto;
  border-bottom: 1px solid #eaeaea;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  font-size: 0.28rem;
}
.price span {
  color: #ffb22b;
  font-size: 0.4rem;
  margin-right: 5%;
  cursor: pointer;
}
.btn {
  width: 3.08rem;
  height: 0.89rem;
  line-height: 0.89rem;
  color: #fff;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  border-radius: 30px;
  margin: 0.9rem auto;
  cursor: pointer;
}
.tishi {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.tishi_c {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.6);
}
.tishi_main {
  width: 90%;
  height: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  /* margin-top: 50%; */
  background: #fff;
  border-radius: 8px;
  transform: translate(-50%, -50%);
}
.tishi_1 {
  display: flex;
  flex-direction: column;
  background: url() bottom center repeat-x;
}
.tishi_1 .del {
  position: absolute;
  top: 200px;
}
.tishi_2 {
  margin: 20px 0;
}
.tishi_1,
.tishi_2 span {
  width: 100%;
  height: auto;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  justify-content: center;
  align-items: center;
}
/* .tishi_2 span:nth-child(1) {
  width: 1.8rem;
  display: inline-block;
  line-height: 0.7rem;
  color: #999;
  background-color: #e9e9e9 !important;
  border-radius: 3px;
  margin-right: 0.47rem !important;
  cursor: pointer;
  font-size: 0.28rem;
} */
.tishi_2 span:nth-child(1) {
  /* border-left: 1px solid #cccccc; */
  display: inline-block;
  border-radius: 8px;
  color: rgb(1, 105, 163);
  width: 2rem;
  line-height: 0.8rem;
  color: #fff !important;
  background-image: url("../assets/images/confirm.png");
  /* margin-left: 0.4rem; */
  font-size: 0.28rem;
}
</style>
