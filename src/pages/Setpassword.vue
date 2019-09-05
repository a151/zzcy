<template>
  <div class="contant">
    <!-- head -->
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png">设置密码
    </div>
    <!-- 内容 -->
    <div class="box">
      <div class="text">
        <h1 class="text1">设置6位转出密码</h1>
        <p class="text2">为了保证您的资金安全</p>
        <p class="text2">在资金变动时需要使用6位转出密码进行验证</p>
      </div>
      <div class="pwd_content">
        <div class="passwords" id="one">
          <label for>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
          <input
            type="password"
            maxlength="6"
            class="realInput"
            v-model="realInput"
            id="focusid"
            ref="input1"
          >
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
        <div class="passwords" id="tow">
          <label for>确认密码：</label>
          <input
            type="password"
            maxlength="6"
            class="realInput"
            v-model="realInput2"
            id="focusid2"
            ref="input2"
          >
          <ul class="write-input" @click="getbackMoney2">
            <li
              v-for="(disInput2,index) in [1,2,3,4,5,6]"
              :key="index"
              :class="{pwd_blink:disInputs2.length == index&&isBlink2 == true}"
            >
              <span class="passWord" v-show="index < disInputs2.length">*</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="btn" @click="submit">完成</div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post } from "@/api/global";
import md5 from "js-md5";
import crypto from "crypto";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      url: Global.url,
      messagepacket: false,
      realInput: "",
      realInput2: "",
      disInputs: [],
      disInputs2: [],
      msg: "",
      isBlink1: false,
      isBlink2: false
    };
  },
  methods: {
    Cancel: function() {
      if (this.msg.orderNum > 0) {
        this.$router.replace({ path: "/" });
      } else {
        this.$router.replace({ path: "/Personal" });
      }
    },
    //密码输入功能
    getbackMoney: function() {
      this.isBlink2 = false;
      var idObj = document.getElementById("focusid");
      idObj.focus();
      this.isBlink1 = true;
      //点击进来自动获取焦点
    },

    //确认密码
    getbackMoney2: function() {
      this.isBlink1 = false;
      var idObj = document.getElementById("focusid2");
      idObj.focus();
      this.isBlink2 = true;
      //点击进来自动获取焦点
    },

    // 提交密码
    submit: function() {
      let _this = this;
      if (this.realInput=="" && this.realInput2==""){
        Toast("请设置密码");
        return true;
      }else{
        if (this.realInput == this.realInput2) {
        post(this.url + "/base/setPass", {
          phone: localStorage.getItem("phone"),
          token: localStorage.getItem("token"),
          pass: md5(this.realInput)
        })
          .then(resp => {
            if (resp.data.code == 100) {
              Toast("设置成功");
              this.refresh();
              // setTimeout(function () {
              //     _this.$router.go(-1);
              // },2000)
            }
          })
          .catch(err => {
            Toast(err.msg);
          });
        } else {
          Toast("请保持密码一致");
        }
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
            if (localStorage.getItem("isPwd") == 1) {
              localStorage.setItem("readOnly", "1");
              this.$router.replace({
                path: "/Selectaddress",
                query: {
                  totalPrice: localStorage.getItem("tp"),
                  orderNum: localStorage.getItem("tn"),
                  goodsInfoList: this.msg.goodsInfoList
                }
              });
            }else if(this.msg.name == '菜宝'||'菜金'||'金豆'||'下单'){
                let _this = this;
                setTimeout(function () {
                    _this.realInput = "";
                    _this.realInput2 = "";
                    _this.disInputs = [];
                    _this.disInputs2 = [];
                    _this.$router.go(-1)
                },2000)
            } else {
              this.$router.replace({ path: "/Personal" });
            }
          } else {
            // alert("，请稍后重试");
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
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
    }
  },
  created: function() {
    this.msg = this.$route.query;
    if (this.msg.orderNum > 0) {
      localStorage.setItem("isPwd", "1");
    } else {
      localStorage.removeItem("isPwd");
    }

  },
  watch: {
    realInput(newV, oldV) {
      this.disInputs = newV.split("");
    },
    realInput2(newV, oldV) {
      this.disInputs2 = newV.split("");
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
  cursor: pointer;
}
.text1 {
  padding-bottom: 0.48rem;
  font-size: 0.32rem;
  color: rgba(51, 51, 51, 1);
  cursor: pointer;
}
.text2 {
  font-size: 0.28rem;
  padding-bottom: 0.18rem;
  color: rgba(153, 153, 153, 1);
  cursor: pointer;
}

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
}
.passwords label {
  width: 1.52rem;
  font-size: 0.28rem;
  text-align: left;
  display: block;
  margin-left: 0.2rem;
  cursor: pointer;
}
/* 密码输入框 */
input {
  width: 5.4rem;
  height: 1rem;
  cursor: pointer;
  line-height: normal;
  transform: translateZ(0);
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
  /* padding: 0 0.8rem; */
  box-sizing: border-box;
  cursor: pointer;
  line-height: normal;
  transform: translateZ(0);
}

.write-input li {
  width: 0.86rem;
  height: 0.48rem;
  background-color: #fff;
  text-align: center;
  font-size: 0.16rem;
  border-right: solid 1px #dcdcdc;
  list-style-type: none;
  cursor: pointer;
  position: relative;
}
.write-input li:last-child {
  border: none;
  cursor: pointer;
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
.passWord {
  color: #000;
  font-size: 22px;
  margin-top: 20px;
}
</style>
