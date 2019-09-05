<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(totalNum)" src="../assets/images/cancel.png" />自提
    </div>
    <div>
      <!--选择地址-->
      <div class="address" v-on:click="Selectaddress(num)" v-if="noaddress">
        <div class="icon"></div>
        <span class="text_address">选择收货地址</span>
        <div class="go"></div>
      </div>
      <div class="address2" v-on:click="Selectaddress(num)" v-else>
        <div class="address_name">
          {{moren[0].emsName}}
          <span>{{moren[0].emsPhone}}</span>
        </div>
        <div class="address_det clearfix">
          <div class="default" v-show="moren[0].isDefault == 1">默认</div>
          <p
            class="addressp"
          >{{moren[0].emsProvince}}&nbsp;&nbsp;{{moren[0].emsCity}}&nbsp;&nbsp;{{moren[0].emsDistrict}}&nbsp;&nbsp;{{moren[0].emsAddress}}</p>
        </div>
        <div class="goto"></div>
      </div>
      <!--信息-->
      <div class="text_veg">
        <span>自提蔬菜信息</span>
      </div>
      <div class="gift">
        <div class="photo"></div>
        <span class="text_gift">蔬菜礼包</span>
        <span class="text_quantity">{{num}}箱</span>
      </div>
      <!--运费-->
      <div class="money">
        <span class="text_freight">运费</span>
        <span class="text_total">￥{{freight}}</span>
      </div>
      <!--选择支付-->
      <div class="text_balance" v-show="pay">
        <div class="balance">
          <p class="quantity">我的菜宝数量: {{xProperty}}</p>
          <p class="quantity">我的金豆数量: {{money}}</p>
        </div>
        <div class="optionname">
          <div @click="cur=0,frename='菜宝'" v-if="this.xProperty >= 15">
            <p class="typeof">使用15菜宝</p>
            <div class="radiobox">
              <span :class="{active:cur==0}"></span>
            </div>
          </div>
          <div class="curshow" v-else>
            <p class="notava">不可用</p>
          </div>
          <div @click="cur=1,frename='金豆'" v-if="this.money >= 15">
            <p class="typeof">使用15金豆</p>
            <div class="radioboxj">
              <span :class="{active:cur==1}"></span>
            </div>
          </div>
          <div class="curshow" v-else>
            <p class="notava">不可用</p>
          </div>
        </div>
      </div>
      <!--支付-->
      <div class="defray">
        <div class="defraytext">
          <span class="text_l">待支付:</span>
          <span class="text_r">{{freight}}{{frename}}</span>
        </div>
        <div class="defraybtn" v-on:click="Submitted(moren[0].id)">{{defrayy}}</div>
      </div>
    </div>
    <div class="passWordInput" :class="popupVisible ? 'show' : '' ">
      <div class="pwd_input">
        <!-- 提示 -->
        <div class="pwd_tips">
          <img src="../assets/images/img_cancel.png" alt @click="close" />
          <span class="please_input">请输入交易密码</span>
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
        <p v-show="warn" class="warning">为保证账号安全，密码错误5次，交易冻结，如忘记密码，请点击忘记交易密码进行修改</p>
        <div class="forget" @click="toForget">忘记密码？</div>
      </div>
    </div>
    <div class="tishi_s" v-show="confirm">
      <div class="tishi_c_s">
        <div class="tishi_main_s">
          <div class="tishi_1_s">
            <img style="width: 70px;margin-top: 20px;" alt />
            <span style="font-size:18px;margin:10px 0 20px;color:#333333">交易密码冻结</span>
            <span
              style="font-size:15px;color:#333333;padding:0 20px;text-align:left;"
            >密码错误次数过多,为保证账号安全，交易被终止，请于12小时后重试，或联系官方确认身份</span>
          </div>
          <div class="tishi_2_s clr">
            <!-- <span @click="no">取消转赠</span> -->
            <span @click="handleAnswer">确认</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tishi" v-show="xpcity">
      <div class="tishi_c">
        <div class="tishi_main">
          <div class="tishi_1">
            <span>菜宝数量不足，请进行充值</span>
          </div>
          <div class="tishi_2 clr">
            <span @click="no">取消充值</span>
            <span @click="Recharge(num,frequ)">确认充值</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Toast } from "mint-ui";
import { handleCofirm } from "@/api/confirm";
import md5 from "js-md5";
import crypto from "crypto";
let list = [];
let goodsInfoList = [];
export default {
  watch: {
    realInput(newV, oldV) {
      this.disInputs = newV.split("");
      if (newV.length == 6) {
        this.refreshUserData();
      }
    }
  },
  data() {
    return {
      defrayy: "",
      useless: false,
      confirm: false,
      noaddress: false,
      warn: false,
      isBlink1: false,
      popupVisible: false,
      cur: -1,
      pay: true,
      cb: "",
      jd: "",
      // 箱数
      num: "",
      pho: true,
      picked: 0,
      options: "",
      xProperty: "",
      money: "",
      realInput: "",
      popupVisible: false,
      url: Global.url,
      // address: [],
      docmHeight: document.documentElement.clientHeight, //默认屏幕高度
      showHeight: document.documentElement.clientHeight, //实时屏幕高度
      moren: [
        {
          emsName: "",
          emsPhone: "",
          emsProvince: "",
          emsCity: "",
          emsDistrict: ""
        }
      ],
      freight: 0,
      frename: "",
      frequ: "",
      totalNum: "",
      // 支付类型
      paytype: "",
      disInputs: [],
      emsid: "",
      addindex: [
        {
          emsName: "",
          emsPhone: "",
          emsProvince: "",
          emsCity: "",
          emsDistrict: ""
        }
      ],
      taskaddress: 0,
      xpcity: false
    };
  },
  methods: {
    go() {
      if (this.freight != 0) {
        this.defrayy = "去支付";
      } else {
        this.defrayy = "提交订单";
      }
    },
    Recharge: function(num, frequ) {
      this.$router.replace({
        path: "/Recharge",
        query: { num: num, frequ: frequ }
      });
    },
    no() {
      this.xpcity = false;
    },
    handleAnswer: function() {
      this.confirm = false;
    },
    refreshUserData: function() {
      post(this.url + "/base/comparePass", {
        phone: localStorage.getItem("phone"),
        token: localStorage.getItem("token"),
        pass: md5(this.realInput)
      })
        .then(resp => {
          post(this.url + "/goods/selforder", {
            emsid: this.emsid,
            paytype: this.paytype,
            payval: this.freight,
            phone: localStorage.getItem("phone"),
            token: localStorage.getItem("token"),
            val: this.num
          })
            .then(resp => {
              let address = this.moren[0];
              let paytype = resp.data.data.payType;
              if (paytype == 1 || paytype == 2) {
                post(this.url + "/goods/paySelfOrder", {
                  ip: localStorage.getItem("phone"),
                  orderId: localStorage.getItem("phone"),
                  paymentType: this.paytype,
                  phone: localStorage.getItem("phone"),
                  totalFee: this.freight
                }).then(resp => {
                  this.popupVisible = false;
                  this.refresh(address, paytype,this.freight);
                });
              } else if (paytype == 5) {
                this.popupVisible = false;
                this.refresh(address, paytype,this.freight);
              }
              // Toast("转出成功");
              // console.log(address);
            })
            .catch(err => {
              Toast(err.msg);
            });
        })
        .catch(err => {
          get(
            this.url + "/base/limittpnum?phone=" + localStorage.getItem("phone")
          ).then(resp => {
            // console.log(resp.data);
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
            this.realInput = "";
            Toast("密码错误");
          }, 300);
        });
    },
    toForget: function() {
      this.$router.replace({ path: "/ForgetPwd" });
    },
    // 是否有地址
    queryaddress() {
      get(this.url + "/ems/list?phone=" + localStorage.getItem("phone"))
        .then(resp => {
          let address = resp.data;
          let moren = [1];
          let newadd = address.filter(item => {
            {
              return moren.includes(item.isDefault);
            }
          });
          if (newadd == null) {
            this.moren = newadd;

          } else {
            this.moren = address;
          }
        })
        .catch(err => {
          this.noaddress = true;
          console.log(err);
        });
    },
    Checked() {
      this.pho = false;
    },
    total: function() {
      get(
        this.url + "/user/selReReNum?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        this.totalNum = resp.data;
      });
    },
    // 返回
    Cancel: function(totalNum) {
      this.$router.replace({
        path: "/SelfMentionbtn",
        query: { name: totalNum }
      });
      // this.$router.go(1);
    },
    // 跳转选择地址页面
    Selectaddress: function(num) {
      if (this.noaddress == true) {
        this.$router.replace({ path: "/AddSelfadd", query: { name: num } });
      } else {
        this.$router.replace({ path: "/Selfaddress", query: { name: num } });
      }
    },
    // 提交订单
    Submitted(emsid) {
      if (this.moren[0].emsCity == "") {
        Toast("请选择地址");
        return true;
      }
      if (this.xProperty < 15 && this.money < 15 && this.freight != 0) {
        this.xpcity = true;
        this.popupVisible = false;
        return true;
      }
      if (this.cur == 0) {
        this.emsid = emsid;
        this.paytype = 2;
        this.inInput();
        this.getbackMoney();
        this.popupVisible = true;
      } else if (this.cur == 1) {
        this.emsid = emsid;
        this.paytype = 1;
        this.inInput();
        this.getbackMoney();
        this.popupVisible = true;
      } else if (this.frequ == 0 && this.num == 1) {
        this.emsid = emsid;
        this.paytype = 5;
        this.inInput();
        this.getbackMoney();
        this.popupVisible = true;
      } else {
        Toast("请选择支付方式");
        return true;
      }
    },
    // 跳转自提成功页面
    // SelfMentionedSuccessfully: function() {
    //   this.$router.replace({ path: "/SelfMentionedSuccessfully" });
    // }
    refresh: function(address, type,val) {
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
              path: "/SelfMentionedSuccessfully",
              query: { name: address, item: type,pay:val }
            });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
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
      window.scroll(0, document.body.clientHeight);
      var idObj = document.getElementById("focusid");

      idObj.addEventListener("blur", function() {
        setTimeout(function() {
          window.scroll(0, document.body.clientHeight);
        }, 100);
      });
    },
    getbackMoney: function() {
      var idObj = document.getElementById("focusid");
      idObj.focus();
      this.isBlink1 = true;
      // window.scrollTo(0, 0);
    }
  },
  created() {
    this.taskaddress = this.$route.query.taskaddress;
    this.addindex = this.$route.query.item;
    // console.log(this.addindex);
    if (this.taskaddress == undefined) {
      // console.log("1");
      this.queryaddress();
    } else if (this.taskaddress == 1) {
      this.moren[0] = this.addindex;
      // console.log("2");
    }
    if (this.cur == 0) {
      this.frename = "菜宝";
    } else if (this.cur == 1) {
      this.frename = "金豆";
    } else {
      this.frename = "菜宝/金豆";
    }
    this.total();
    this.num = this.$route.query.name;
    this.xProperty = Number(localStorage.getItem("xProperty"));
    this.money = Number(localStorage.getItem("money"));
    // console.log(this.num);
    this.frequ = this.$route.query.frequ;
    if (this.frequ == 0 && this.num == 1) {
      this.freight = 0;
      this.paytype = 5;
      this.frename = "菜宝/金豆";
      this.pay = false;
    } else {
      if (this.xProperty < 15 && this.money < 15) {
        this.freight = 15;
        this.frename = "菜宝/金豆";
        this.useless = true;
      } else if (this.xProperty >= 15 && this.money >= 15) {
        this.freight = 15;
      } else if (this.cur == -1) {
        this.frename = "菜宝/金豆";
        this.freight = 15;
      }
    }
    if (this.ur) {
    }
    this.go();
  }
};
</script>

<style scoped>
@import "../style/pwd.css";
.content {
  width: 100%;
  height: 100%;
  touch-action: none;
  background-color: #f6f6f6;
}
.head {
  font-size: 0.36rem;
  cursor: pointer;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  cursor: pointer;
}
.address {
  background-color: #fbfff8;
  width: 100%;
  height: 1.8rem;
  font-size: 0.36rem;
  color: black;
}
.address2 {
  position: relative;
  background-color: #fbfff8;
  width: 100%;
  height: 100%;
  font-size: 0.36rem;
  color: black;
  padding: 0 0.3rem;
}
.icon {
  float: left;
  width: 0.25rem;
  height: 0.4rem;
  margin: 0.67rem 0 0 0.3rem;
  background-image: url("../assets/images/address_1.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.text_address {
  float: left;
  position: relative;
  top: 0.58rem;
  left: 0.25rem;
}
.go {
  float: right;
  width: 0.15rem;
  height: 0.3rem;
  margin: 0.71rem 0.3rem 0 0;
  background-image: url("../assets/images/go.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.goto {
  /* float: right; */
  position: absolute;
  top: 38px;
  right: 50px;
  width: 0.15rem;
  height: 0.3rem;
  /* margin: 0.71rem 0.3rem 0 0; */
  background-image: url("../assets/images/go.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.text_veg {
  font-size: 0.34rem;
  color: black;
  text-align: left;
  padding: 0.24rem 0 0.24rem 0.3rem;
}
.gift {
  width: 100%;
  height: 1.6rem;
  background-color: #fbfff8;
}
.photo {
  float: left;
  width: 1.6rem;
  height: 1rem;
  margin: 0.3rem 0 0 0.15rem;
  background-image: url("../assets/images/lettuce.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.text_gift {
  font-size: 0.32rem;
  color: black;
  position: relative;
  top: 0.52rem;
  right: 1.6rem;
}
.text_quantity {
  font-size: 0.32rem;
  color: black;
  position: relative;
  top: 0.52rem;
  left: 1.6rem;
}
.money {
  width: 100%;
  height: 1rem;
  margin: 0.1rem 0 0 0;
  background-color: #fbfff8;
}
.text_freight {
  font-size: 0.32rem;
  color: black;
  position: relative;
  top: 0.23rem;
  right: 2.75rem;
}
.text_total {
  font-size: 0.32rem;
  color: red;
  position: relative;
  top: 0.23rem;
  left: 2.75rem;
}
.text_balance {
  width: 100%;
  height: 2.1rem;
  margin-top: 0;
  background-color: #fbfff8;
  font-size: 0.32rem;
  color: black;
}
.balance {
  float: left;
  text-align: left;
  margin: 0 0 0 0.3rem;
}
.quantity {
  color: rgb(131, 131, 131);
  margin: 0.27rem 0 0.27rem 0;
}
.optionname {
  float: right;
  position: relative;
  margin: 0 0.3rem 0 0;
}
.btn {
  float: right;
  margin: 0 0.2rem 0 0;
}
.t1 {
  width: 0.4rem;
  height: 0.4rem;
  background-image: url("../assets/images/agree.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin-top: 0.35rem;
}
.t2 {
  width: 0.4rem;
  height: 0.4rem;
  background-image: url("../assets/images/nagree.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin-top: 0.35rem;
}
.defray {
  width: 100%;
  height: 1rem;
  background-color: #fbfff8;
  margin: 0 auto;
  position: fixed;
  bottom: 0;
  text-align: center;
  font-size: 0.32rem;
}
.defraytext {
  float: left;
  margin: 0.3rem 0 0 0.5rem;
}
.text_l {
  color: #656666;
}
.text_r {
  color: red;
}
.defraybtn {
  width: 3rem;
  height: 100%;
  float: right;
  color: #feffff;
  line-height: 1rem;
  background-image: url("../assets/images/defraybtn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
}
/* 是否默认 */
.default {
  color: #3d8141;
  padding: 0 0.06rem;
  margin-right: 5px;
  background: #d8e6d9;
  float: left;
  font-size: 0.26rem;
  cursor: pointer;
  line-height: 0.36rem;
}
.address_name {
  padding-top: 20px;
  height: 16px;
  width: 100%;
  text-align: left;
  color: #333333;
  line-height: 16px;
  font-size: 16px;
  cursor: pointer;
}
.address_name span {
  font-size: 14px;
  color: #666;
  margin-left: 3%;
  cursor: pointer;
}
.address_det {
  margin-top: 16px;
  /* margin-bottom: 5px; */
  line-height: 20px;
  font-size: 15px;
  cursor: pointer;
  color: #333;
}
.radio {
  position: relative;
  display: block;
  font-weight: 400;
}
.addressp {
  width: 88%;
  text-align: left;
  /* position: absolute; */
  left: 60px;
  margin: 0 0 0.2rem;
}
.typeof {
  margin: 0.27rem 0.54rem 0 0;
}
.radiobox {
  position: absolute;
  top: 0.35rem;
  right: 0.02rem;
  width: 16px;
  height: 16px;
  border: 1px solid #3d8141;
  border-radius: 50%;
  display: inline-block;
}
.radioboxj {
  position: absolute;
  top: 1.13rem;
  right: 0.02rem;
  width: 16px;
  height: 16px;
  border: 1px solid #3d8141;
  border-radius: 50%;
  display: inline-block;
}
.active {
  display: inline-block;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #3d8141;
}
.text_balance .optionname .curshow {
  text-align: right;
  margin: 0.27rem 0 0 0;
}
.notava {
  color: rgb(131, 131, 131);
  margin: 0.27rem 0 0 0;
}
.tishi {
  font-size: 0.32rem;
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
  width: 75%;
  height: 2.6rem;
  position: absolute;
  left: 50%;
  top: 50%;
  /* margin-top: 50%; */
  background: #fff;
  border-radius: 8px;
  transform: translate(-50%, -50%);
}
.tishi_1 {
  color: black;
  display: flex;
  flex-direction: column;
  background: url() bottom center repeat-x;
  margin: 0.4rem 0 0 0;
}
.tishi_1 .del {
  position: absolute;
  top: 200px;
}
.tishi_2 {
  margin: 0.5rem 0 0.3rem 0;
}
.tishi_1,
.tishi_2 span {
  width: 100%;
  height: auto;
  line-height: 30px;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.tishi_2 span:nth-child(1) {
  width: 1.8rem;
  display: inline-block;
  line-height: 0.7rem;
  color: #999;
  background-color: #e9e9e9 !important;
  border-radius: 3px;
  margin-right: 0.47rem !important;
  cursor: pointer;
}
.tishi_2 span:nth-child(2) {
  /* border-left: 1px solid #cccccc; */
  display: inline-block;
  color: rgb(1, 105, 163);
  width: 1.8rem;
  line-height: 0.7rem;
  color: #fff !important;
  border-radius: 3px;
  background-image: url("../assets/images/confirm.png");
  margin-left: 0.4rem;
}
.tishi_s {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.tishi_c_s {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.6);
}
.tishi_main_s {
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
.tishi_1_s {
  display: flex;
  flex-direction: column;
  background: url() bottom center repeat-x;
}
.tishi_1_s .del {
  position: absolute;
  top: 200px;
}
.tishi_2_s {
  margin: 20px 0;
}
.tishi_1_s,
.tishi_2_s span {
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
.tishi_2_s span:nth-child(1) {
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
