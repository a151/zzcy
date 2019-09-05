<template>
  <!-- 修改密码 -->
  <div class="contant">
    <!-- head -->
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />修改密码
    </div>
    <!-- 内容 -->
    <div class="box">
      <div class="pwd_content">
        <div class="passwords" id="one">
          <label for>原 密 码：</label>
          <input
            type="password"
            maxlength="6"
            class="realInput"
            v-model="realInput3"
            id="focusid3"
            ref="input3"
          />
          <ul class="write-input" @click="getbackMoney3">
            <li
              v-for="(disInput,index) in [0,1,2,3,4,5]"
              :key="index"
              :class="{pwd_blink:disInputs3.length == index&&isBlink3 == true}"
            >
              <span class="passWord" v-show="index < disInputs3.length">*</span>
            </li>
          </ul>
        </div>
        <div class="passwords" id="one">
          <label for>新 密 码：</label>
          <input
            type="password"
            maxlength="6"
            class="realInput"
            v-model="realInput"
            id="focusid"
            ref="input1"
          />
          <ul class="write-input" @click="getbackMoney">
            <li
              v-for="(disInput,index) in [0,1,2,3,4,5]"
              :key="index"
              :class="{pwd_blink:disInputs.length == index&&isBlink1 == true}"
            >
              <span class="passWord" v-show="index < disInputs.length">*</span>
            </li>
          </ul>
        </div>
        <div class="passwords" id="tow">
          <label for>确认密码：</label>
          <input
            type="password"
            maxlength="6"
            class="realInput"
            v-model="realInput2"
            id="focusid2"
            ref="input2"
          />
          <ul class="write-input" @click="getbackMoney2">
            <li
              v-for="(disInput2,index) in [0,1,2,3,4,5]"
              :key="index"
              :class="{pwd_blink:disInputs2.length == index&&isBlink2 == true}"
            >
              <span class="passWord" v-show="index < disInputs2.length">*</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 忘记密码 -->
      <div class="forget_pwd" @click="toForget">忘记密码？</div>
      <!-- 按钮 -->
      <div class="btn" @click="submit">完成</div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post } from "@/api/global";
import { handleCofirm } from "@/api/confirm";
import { Toast } from "mint-ui";
import md5 from "js-md5";
import crypto from "crypto";
import $ from "jquery";
export default {
  data() {
    return {
      url: Global.url,
      messagepacket: false,
      colorStart: false,
      realInput: "",
      realInput2: "",
      realInput3: "",
      disInputs: [],
      disInputs2: [],
      disInputs3: [],
      phone: "",
      smsCode: "",
      isBlink1: false,
      isBlink2: false,
      isBlink3: false
    };
  },
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    // 忘记密码
    toForget: function() {
      this.$router.replace({ path: "/ForgetPwd" });
    },
    // 原密码
    getbackMoney3: function() {
      var idObj = document.getElementById("focusid3");
      idObj.focus();
      this.isBlink1 = false;
      this.isBlink2 = false;
      this.isBlink3 = true;
    },

    //新密码
    getbackMoney: function() {
      var idObj = document.getElementById("focusid");
      idObj.focus();
      this.isBlink3 = false;
      this.isBlink2 = false;
      this.isBlink1 = true;
    },

    //确认密码
    getbackMoney2: function() {
      var idObj = document.getElementById("focusid2");
      idObj.focus();
      this.isBlink1 = false;
      this.isBlink3 = false;
      this.isBlink2 = true;
    },

    // 提交密码
    submit: function() {
      if (
        this.realInput != "" &&
        this.realInput2 != "" &&
        this.realInput3 != ""
      ) {
        if (this.realInput == this.realInput2) {
          // 新密码加密

          var pass = md5(this.realInput);
          // 原密码加密

          var oldPass = md5(this.realInput3);
          post(this.url + "/base/resetPass", {
            phone: localStorage.getItem("phone"),
            pass: pass,
            oldPass: oldPass,
            token: localStorage.getItem("token")
          })
            .then(resp => {
              if (resp.data.code == 100) {
                localStorage.setItem("pwd1", this.realInput3);
                Toast("修改密码成功");
                this.refresh();
              }
            })
            .catch(err => {
              Toast(err.msg);
            });
        } else {
          Toast("请保持密码一致");
        }
      } else {
        Toast("请输入密码");
        return true;
      }
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
                    this.province = regionList[0].name;
                    this.city = regionList[2].name;
                  } else {
                    this.province = regionList[0].name;
                    this.city = regionList[1].name;
                    this.district = regionList[2].name;
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
            this.$router.replace({ path: "/Personal" });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    }
  },
  mounted() {
    // $("#focusid").bind("blur", function() {
    //   window.scroll(0, 0);
    // });
    // $("#focusid2").bind("blur", function() {
    //   window.scroll(0, 0);
    // });
    // $("#focusid3").bind("blur", function() {
    //   window.scroll(0, 0);
    // });
  },
  created: function() {
    this.phone = this.$route.query.phone;
    this.smsCode = this.$route.query.code;
  },
  watch: {
    realInput(newV, oldV) {
      this.disInputs = newV.split("");
    },
    realInput2(newV, oldV) {
      this.disInputs2 = newV.split("");
    },
    realInput3(newV, oldV) {
      this.disInputs3 = newV.split("");
    }
  }
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
.text {
  line-height: 1;
  margin-top: 0.8rem;
  font-size: 0.34rem;
  cursor: pointer;
}
/* .box{
  overflow: scroll;
  zoom: 1;
} */

.passwords {
  width: 6.9rem;
  height: 0.76rem;
  margin: 0 auto 0.3rem;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  border: 1px solid #dcdcdc;
  border-radius: 0.2rem;
  cursor: pointer;
  line-height: 0.76rem;
  position: relative;
}
.passwords label {
  width: 1.5rem;
  font-size: 0.28rem;
  text-align: left;
  display: block;
  margin-left: 0.2rem;
  cursor: pointer;
}
/* 密码输入框 */
input {
  width: 5.4rem;
  height: 0rem;
  line-height: 0.48rem;
  cursor: pointer;
  color: transparent;
}

.input-active {
  border: 0.02rem solid #cfcfd3;
  cursor: pointer;
}
/* 6位支付密码 */
.write-input {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  line-height: 0;
}

.write-input li {
  width: 0.86rem;
  height: 0.48rem;
  background-color: #fff;
  padding-bottom: 0.06rem;
  font-size: 0.16rem;
  display: flex;
  align-items: center;
  -webkit-display: flex;
  align-items: center;
  justify-content: center;
  border-right: solid 1px #dcdcdc;
  list-style-type: none;
  cursor: pointer;
  position: relative;
}
.write-input li:last-child {
  border: none;
}

.disInput {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  resize: none;
  outline: none;
  border: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 0.06rem;
  text-align: center;
  font-size: 0.5rem;
  background: none !important;
  cursor: pointer;
}
/* 忘记密码 */
.forget_pwd {
  color: #333;
  cursor: pointer;
  font-size: 0.28rem;
  text-align: right;
}
.btn {
  width: 3.08rem;
  height: 0.88rem;
  font-size: 0.3rem;
  color: white;
  margin: 0.5rem auto 0;
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