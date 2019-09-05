<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(name)" src="../assets/images/cancel.png" />
      {{name}}转出
    </div>
    <div class="content-box">
      <div class="title">
        <span @click="cur=0,popupVisible=false,golb=''" :class="{active:cur==0}">转出到菜金</span>
        <span @click="cur=1,popupVisible=false,val=''" :class="{active:cur==1}">转出到金豆</span>
      </div>
      <div class="content-vox">
        <div v-show="cur==0" class="box-item">
          <h4>转出金额</h4>
          <div class="turnout">
            <span>￥</span>
            <input
              class="input"
              type="text"
              placeholder="请输入要转出的金额"
              v-model="val"
              oninput="value=value.replace(/[^\d]/g,'')"
              :maxlength="xProperty.length"
            />
          </div>
          <div class="number">可转出数量&nbsp;&nbsp;{{xProperty}}</div>
          <p>
            温馨提示：菜金仅限平台消费，不能用于其他操作。
            <br />此过程不可逆！请慎重
          </p>
          <div class="creat_btn">
            <div class="sure" @click="Deterout()">确定</div>
          </div>
        </div>
        <div v-show="cur==1" class="box-item">
          <h4>转出金额</h4>
          <div class="turnout">
            <span>￥</span>
            <input
              type="text"
              class="input"
              v-model="golb"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入要转出的金额"
              maxlength="6"
            />
          </div>
          <div class="number">可转出数量&nbsp;&nbsp;{{xpglob.remVal}}</div>
          <p>只有首次充值的菜宝可以转出到金豆,首次充值的菜宝被消费后不能再转出</p>
          <div class="creat_btn">
            <div class="sure" @click="Golbout()">确定</div>
          </div>
        </div>
      </div>
    </div>
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
              pattern="\d*"
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
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Toast, TabContainer, TabContainerItem, MessageBox } from "mint-ui";
import { handleCofirm } from "@/api/confirm";
import md5 from "js-md5";
import crypto from "crypto";
let detailList = [];
// let sign = "";
// let typeValue = "";
export default {
  data() {
    return {
      confirm: false,
      disInputs: [],
      realInput: "",
      popupVisible: false,
      cur: 0,
      url: Global.url,
      name: "",
      // 菜宝
      xProperty: "",
      money: 0,
      isDetail: true,
      // 菜宝input框内容
      val: 0,
      // 金豆
      golb: "",
      // sign: "",
      // typeValue:''
      isBlink1: false,
      warn: false,
      xpglob: "",
      passnum: ""
    };
  },
  watch: {
    realInput(newV, oldV) {
      this.disInputs = newV.split("");
      if (newV.length == 6) {
        this.refreshUserData();
      }
    }
  },
  methods: {
    handleAnswer: function() {
      this.confirm = false;
    },
    refreshUserData: function() {
      if (this.cur == 0) {
        post(this.url + "/base/comparePass", {
          phone: localStorage.getItem("phone"),
          token: localStorage.getItem("token"),
          pass: md5(this.realInput)
        })
          .then(resp => {
            post(this.url + "/xptrans/toRewMo", {
              toPhone: localStorage.getItem("phone"),
              fromPhone: localStorage.getItem("phone"),
              token: localStorage.getItem("token"),
              type: 0,
              val: this.val
            })
              .then(resp => {
                this.val = "";
                this.realInput = "";
                this.popupVisible = false;
                Toast("转出成功");
                this.refresh(this.name);
              })
              .catch(err => {
                Toast(err.msg);
                this.val = "";
                this.realInput = "";
              });
          })
          .catch(err => {
            get(
              this.url +
                "/base/limittpnum?phone=" +
                localStorage.getItem("phone")
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
            });
            setTimeout(function() {
              var idObj = document.getElementById("focusid");
              idObj.blur();
              window.scroll(0, 0);
              // this.close();
              Toast("密码错误");
            }, 300);
          });
      } else {
        post(this.url + "/base/comparePass", {
          phone: localStorage.getItem("phone"),
          token: localStorage.getItem("token"),
          pass: md5(this.realInput)
        })
          .then(resp => {
            post(this.url + "/xptrans/xproToMon", {
              toPhone: localStorage.getItem("phone"),
              fromPhone: localStorage.getItem("phone"),
              token: localStorage.getItem("token"),
              type: "",
              val: this.golb
            })
              .then(resp => {
                this.golb = "";
                this.realInput = "";
                this.popupVisible = false;
                Toast("转出到金豆成功");
                this.refresh(this.name);
              })
              .catch(err => {
                Toast(err.msg);
                this.golb = "";
                this.realInput = "";
              });
          })
          .catch(err => {
            get(
              this.url +
                "/base/limittpnum?phone=" +
                localStorage.getItem("phone")
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
              setTimeout(function() {
                var idObj = document.getElementById("focusid");
                idObj.blur();
                window.scroll(0, 0);
                Toast("密码错误");
              }, 300);
            });
          });
      }
    },
    toForget: function() {
      this.$router.replace({ path: "/ForgetPwd" });
    },
    getbackMoney: function() {
      var idObj = document.getElementById("focusid");
      idObj.focus();
      this.isBlink1 = true;
      // window.scrollTo(0, 0);
    },
    close: function() {
      this.realInput = "";

      this.popupVisible = false;
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        window.scrollTo(0, 0);
      }
    },
    outInput() {},
    inInput() {
      window.scroll(0, document.body.scrollHeight);
      var idObj = document.getElementById("focusid");

      idObj.addEventListener("blur", function() {
        setTimeout(function() {
          window.scroll(0, document.body.scrollHeight);
        }, 100);
      });
    },
    Cancel: function(name) {
      this.$router.replace({ path: "/Summary", query: { name: name } });
    },
    // 菜宝转出到菜金
    Deterout() {
      if (Number(this.val) == "" || Number(this.val) == 0) {
        Toast("转出金额错误");
        return true;
      } else if (Number(this.val) > Number(this.xProperty)) {
        Toast("可转数量不足");
        return true;
      } else if (localStorage.getItem("pwd") == 1) {
        this.inInput();
        this.getbackMoney();
        this.popupVisible = true;
      } else {
        this.$router.replace({
          path: "/pwd"
        });
      }
    },
    // 菜宝转出到金豆
    Golbout() {
      if (Number(this.golb) == "" || Number(this.golb) == 0) {
        Toast("转出金额错误");
        return true;
      } else if (Number(this.golb) > Number(this.xpglob.remVal)) {
        Toast("可转数量不足");
        return true;
      } else if (localStorage.getItem("pwd") == 1) {
        this.inInput();
        this.getbackMoney();
        this.popupVisible = true;
      } else {
        this.$router.replace({
          path: "/pwd"
        });
      }
    },
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
          location.href = "http://foodyake.h.broteam.cn/#/Personal";
        },
        false
      );
    },
    // 用户刷新
    refresh: function(name) {
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
            this.$router.replace({ path: "/Summary", query: { name: name } });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    // 首充菜宝
    getXpglob() {
      get(
        this.url + "/user/isXproToMon?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        this.xpglob = resp.data;
      });
    }
  },
  mounted() {
  },
  created() {
    this.getXpglob();
    this.xProperty = Number(localStorage.getItem("xProperty"));
    this.money = Number(localStorage.getItem("money"));
    this.name = this.$route.query.name;
    if (this.name == "菜宝") {
      this.getXpList();
    } else if (this.name == "菜金") {
      this.getRewList();
    } else if (this.name == "金豆") {
      this.getMtList();
    }
  }
};
</script>
<style scoped>
@import "../style/pwd.css";
* {
  margin: 0;
  padding: 0;
}
.head {
  font-size: 0.36rem;
  cursor: pointer;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  cursor: pointer;
}
.content-box {
  width: 90%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  margin-left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 3px 9px 1px rgba(0, 0, 0, 0.06);
  margin-top: 15px;
  border-radius: 8px;
  padding: 20px;
  padding-bottom: 0;
  box-sizing: border-box;
}
.content-box .title span {
  display: inline-block;
  padding: 2px 0;
  font-size: 0.32rem;
  color: #666666;
}
.content-box .title span:first-child {
  margin-right: 20px;
  color: #333333;
}
.content-box .content-vox {
  text-align: left;
  line-height: 30px;
  margin-top: 20px;
}
.content-box .content-vox h4 {
  font-size: 0.32rem;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.content-box .content-vox span {
  font-size: 20px;
}
.content-box .content-vox .turnout {
  width: 100%;
  display: flex;
}
.content-box .content-vox .turnout .input {
  font-size: 0.28rem;
  padding-left: 5px;
  height: 26px;
  border-bottom: 1px solid rgb(241, 241, 241);
  width: 100%;
}
.content-box .content-vox .number {
  color: #666666;
  font-size: 0.29rem;
  display: flex;
  align-items: center;
}
.content-box .content-vox .number img {
  padding-left: 10px;
}
.content-box .content-vox p {
  font-size: 0.25rem;
  line-height: 18px;
  color: #999999;
}
.active {
  border-bottom: 2px solid rgba(61, 129, 65, 1);
}
.creat_btn {
  text-align: center;
  overflow: hidden;
  zoom: 1;
  margin: 0 0.3rem 0.4rem;
  cursor: pointer;
  margin: 16px;
}
.sure {
  width: 140px;
  height: 40px;
  border-radius: 22.5px;
  line-height: 40px;
  cursor: pointer;
  font-size: 0.3rem;
}
.sure {
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
  margin: 0 auto;
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
