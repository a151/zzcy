<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(name)" src="../assets/images/cancel.png" />
      提现
    </div>
    <van-notice-bar mode="closeable" color="#333333" background="#FEE3B7">每天可提现5次，单次最多可提现4万。</van-notice-bar>
    <div class="content-box">
      <div class="bankInfo">填写银行卡信息</div>
      <div class="userInfo">
        <p>开户人姓名</p>
        <input
          class="input"
          type="text"
          placeholder="请输入储蓄卡开户人姓名"
          v-model="userName"
          oninput="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"
          maxlength="15"
        />
      </div>
      <div class="userBank">
        <p>储蓄卡号</p>
        <input
          class="input"
          type="text"
          placeholder="请输入本人银行储蓄卡号"
          v-model="userNumber"
          onkeyup="value=value.replace(/\s/g,'').replace(/\D/g,'').replace(/(\d{4})(?=\d)/g,'$1 ')"
          @blur="checkBankNum"
          maxlength="23"
        />
        <!-- @focus="bankFoucs" -->

        <van-tag plain size="medium" class="bankTag" v-show="bankShow">{{MyBankName}}</van-tag>
      </div>
    </div>
    <div class="content-box">
      <div class="cathInfo">提现</div>
      <div class="userInfo">
        <p>提现金豆</p>
        <span>￥</span>
        <input
          class="input"
          type="text"
          placeholder="请输入提现金豆（限额100金豆起）"
          v-model="wholeVal"
          onkeyup="value=value.replace(/[^\d^\.]+/g,'')"
          @input="amount"
          style="padding-left:0.4rem;box-sizing:border-box; "
          maxlength="this.money.length"
        />
      </div>
      <div class="money">
        当前账号金豆：{{money}}
        <span @click="whole">全部提现</span>
      </div>
      <div class="tips">提现申请成功后，进度查询方法：我的金豆 - 金豆明细 - 找到提现明细，点击即可查看提现进度</div>
    </div>

    <div class="creat_btn">
      <div :class="quest ? 'sure2' :'sure' " @click="Cash()">确定</div>
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
import { NoticeBar, Toast } from "vant";
import { post, get } from "@/api/global";
import Banks from "@/api/bank.json";
import { truncate } from "fs";
import md5 from "js-md5";
import Global from "@/api/global";
export default {
  created() {
    this.limitNum();
    this.name = this.$route.query.name;
    this.money = Number(localStorage.getItem("money"));
  },
  data() {
    return {
      name: "",
      money: 0,
      // 提现金豆
      wholeVal: "",
      // 用户姓名
      userName: "",
      // 用户卡号
      userNumber: "",
      MyBankName: "暂无数据",
      bankShow: false,
      quest: true,
      BankCard: "",
      popupVisible: false,
      realInput: "",
      disInputs: [],
      isBlink1: false,
      warn: false,
      passwordOk: false,
      passnum: 0,
      url: Global.url,
      confirm: false,
      cathData: {},
      limitSecond: -1
    };
  },
  watch: {
    userName(newN, oldN) {
      if (
        this.userName != "" &&
        this.userNumber != "" &&
        this.wholeVal != "" &&
        this.limitSecond < 4
      ) {
        this.quest = false;
      } else {
        this.quest = true;
      }
    },
    userNumber(newB, oldB) {
      if (
        this.userName != "" &&
        this.userNumber != "" &&
        this.wholeVal != "" &&
        this.limitSecond < 4
      ) {
        this.quest = false;
      } else {
        this.quest = true;
      }
    },
    wholeVal(newV, oldV) {
      if (
        this.userName != "" &&
        this.userNumber != "" &&
        this.wholeVal != "" &&
        this.limitSecond < 4
      ) {
        this.quest = false;
      } else {
        this.quest = true;
      }
    },
    realInput(newP, oldP) {
      this.disInputs = newP.split("");
      if (newP.length == 6 && this.passwordOk) {
        this.refreshUserData();
      }
    }
  },
  methods: {
    // bankFoucs() {
    //   this.userNumber = this.userNumber.replace(/[^\d]/g, "");
    //   console.log(this.userNumber);
    // },
    Cancel: function(name) {
      this.$router.replace({ path: "/Summary", query: { name: name } });
    },
    handleAnswer() {
      this.confirm = false;
    },
    // 提现全部
    whole() {
      if (this.money >= 40000) {
        this.wholeVal = 40000;
      } else {
        this.wholeVal = this.money;
      }
    },
    amount() {
      if (this.money >= this.wholeVal && this.wholeVal >= 40000) {
        this.wholeVal = 40000;
      } else if (this.money < this.wholeVal) {
        this.wholeVal = this.money;
      }
    },
    toForget: function() {
      this.$router.replace({ path: "/ForgetPwd" });
    },
    // 提现
    Cash() {
      if (this.userName != "" && this.userNumber != "" && this.wholeVal != "") {
        if (this.limitSecond != 4) {
          if (this.userName.length >= 2) {
            // if (this.BankCard != undefined && this.bankShow == true) {
            if (this.wholeVal >= 100) {
              if (localStorage.getItem("pwd") == 1) {
                this.realInput = "";
                this.passwordOk = true;
                this.inInput();
                this.getbackMoney();
                this.popupVisible = true;
              } else {
                this.$router.replace({
                  path: "/pwd"
                });
              }
            } else {
              Toast("提现限额100金豆起，提现失败");
              this.quest = true;
              return true;
            }
            // } else {
            // Toast("请检查开户人储蓄卡号，是否有误");
            // this.quest = true;
            // return true;
            // }
          } else {
            Toast("请检查开户人姓名，是否有误");
            this.quest = true;
            return true;
          }
        } else {
          Toast("当天提现次数已超过5次，提现失败");
          return true;
        }
      } else {
        Toast("请填写完整信息");
        return true;
      }
    },
    refreshUserData: function() {
      post(this.url + "/base/comparePass", {
        phone: localStorage.getItem("phone"),
        token: localStorage.getItem("token"),
        pass: md5(this.realInput)
      })
        .then(resp => {
          get(
            this.url + "/base/limitCash?phone=" + localStorage.getItem("phone")
          )
            .then(resp => {
              console.log(resp);
              post(this.url + "/base/cashOrder", {
                phone: localStorage.getItem("phone"),
                token: localStorage.getItem("token"),
                bankName: this.MyBankName,
                bankNum: this.userNumber,
                userName: this.userName,
                val: this.wholeVal
              })
                .then(resp => {
                  console.log(resp.data.data);
                  this.popupVisible = false;
                  this.cathData = resp.data.data;
                  Toast("提现成功");
                  this.refresh();
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(err => {
              console.log(err);
              Toast(err);
              this.popupVisible = false;
              return true;
            });
        })
        .catch(err => {
          get(
            this.url + "/base/limittpnum?phone=" + localStorage.getItem("phone")
          ).then(resp => {
            console.log(resp.data);
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
    },
    limitNum() {
      get(
        this.url +
          "/base/getRedisLimit?phone=" +
          localStorage.getItem("phone") +
          "&type=" +
          1
      )
        .then(resp => {
          this.limitSecond = resp.data;
          console.log(this.limitSecond);
        })
        .catch(err => {
          console.log(err);
        });
    },
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
              path: "/CathResult",
              query: { name: this.name, value: this.cathData }
            });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    inInput() {
      window.scroll(0, document.body.clientHeight);
      var idObj = document.getElementById("focusid");

      idObj.addEventListener("blur", function() {
        setTimeout(function() {
          window.scroll(0, document.body.clientHeight);
        }, 100);
      });
    },
    checkBankNum() {
      get(
        "https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?cardNo=" +
          this.userNumber.replace(/[^\d]/g, "") +
          "&cardBinCheck=true"
      )
        .then(resp => {})
        .catch(err => {
          if (err.stat === "ok" && err.validated === false) {
            Toast("卡号输入有误！请重新输入");
            // this.userNumber = "";
            this.popupVisible = false;
            this.bankShow = false;
            return true;
          } else {
            let bankName_ = err.bank;
            var BankName = Banks[bankName_];
            if (BankName === undefined) {
              this.BankCard = BankName;
              this.MyBankName = "无卡号所属银行信息";
              this.bankShow = true;
            } else {
              this.userNumber = this.userNumber
                .replace(/\s/g, "")
                .replace(/\D/g, "")
                .replace(/(\d{4})(?=\d)/g, "$1 ");
              this.bankShow = true;
              this.MyBankName = Banks[bankName_];
            }
          }
          console.log(err);
        });
      if (this.userNumber === "") {
        this.MyBankName = "";
        this.bankShow = false;
      }
    },
    close: function() {
      this.realInput = "";
      this.passwordOk = false;
      this.popupVisible = false;
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        window.scrollTo(0, 0);
      }
    },
    outInput() {},
    getbackMoney: function() {
      var idObj = document.getElementById("focusid");
      idObj.focus();
      this.isBlink1 = true;
      // window.scrollTo(0, 0);
    }
  }
};
</script>

<style scoped>
@import "../style/pwd.css";
.head {
  font-size: 0.36rem;
  cursor: pointer;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  cursor: pointer;
}
.content-box {
  text-align: left;
  font-size: 0.32rem;
  width: 90%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  margin-left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 3px 9px 1px rgba(0, 0, 0, 0.06);
  margin-top: 15px;
  border-radius: 8px;
  padding: 0.38rem 0.3rem;
  padding-bottom: 0.8rem;
  box-sizing: border-box;
}
.userInfo,
.userBank {
  margin-top: 0.4rem;
}
.userInfo p,
.userBank p {
  padding-bottom: 0.1rem;
}
input {
  font-size: 0.28rem;
  border-bottom: 1px solid rgb(241, 241, 241);
  width: 100%;
  height: 32px;
}
.userInfo span {
  position: absolute;
  bottom: 1.54rem;
  font-size: 0.38rem;
}
.money {
  margin-top: 0.2rem;
}
.money span {
  float: right;
  color: #3d8141;
}
.creat_btn {
  text-align: center;
  overflow: hidden;
  zoom: 1;
  margin: 0 0.3rem 0.8rem;
  cursor: pointer;
}
.sure {
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 1.6rem;
  width: 140px;
  height: 40px;
  border-radius: 22.5px;
  line-height: 40px;
  cursor: pointer;
  font-size: 0.3rem;
}
.sure2 {
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 1.6rem;
  width: 140px;
  height: 40px;
  border-radius: 22.5px;
  line-height: 40px;
  cursor: pointer;
  font-size: 0.3rem;
  opacity: 0.7;
}
.content /deep/ .van-notice-bar__wrap {
  font-size: 0.28rem;
}
.bankTag {
  position: absolute;
  right: 0.4rem;
  bottom: 0.92rem;
}
.tips {
  position: absolute;
  bottom: -1.2rem;
  font-size: 0.26rem;
  color: red;
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
.bankInfo {
  font-size: 0.36rem;
  font-weight: 700;
}
.cathInfo {
  font-size: 0.36rem;
  font-weight: 700;
}
</style>
