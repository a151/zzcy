<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" src="../assets/images/cancel.png" @click="toPrev()" />确认支付
    </div>
    <div class="rechargemoney">
      <div class="money">需支付金额</div>
      <span>￥{{pay_num}}</span>
    </div>
    <div class="alltype">
      <div class="paytype">
        <div class="wxtype">
          <img src="../assets/images/wxlogo.png" />
          微信支付
        </div>
        <div class="select" @click="choiceWx()">
          <img :src="isWx?src2:src1" alt />
        </div>
      </div>
      <!-- <div class="paytype" style="border-bottom:none">
        <div class="wxtype">
          <img src="../assets/images/zfblogo.png">
          支付宝支付
        </div>
        <div class="select" @click="choiceWx()">
          <img :src="isWx?src1:src2" alt>
        </div>
      </div>-->
    </div>
    <div class="paynow" v-on:click="Paynow">立即支付</div>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
<script>
import Global from "@/api/global";
import { post } from "@/api/global";
import { websiteUrl } from "@/api/global";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      pay_num: 0,
      isWx: false,
      src1: require("../assets/images/selected.png"),
      src2: require("../assets/images/select.png"),
      isApl: false,
      url: Global.url,
      token: "",
      phone: "",
      payList: [],
      openId: "",
      count: false
    };
  },
  methods: {
    // 生成充值订单
    Paynow: function() {
      if (!this.pay_num) {
        return "";
      } else {
        post(this.url + "/charge/submitApp", {
          phone: this.phone,
          token: this.token,
          val: this.pay_num
        })
          .then(resp => {
            if (resp.data.data) {
              var orderId = resp.data.data.chargeNo;
              var totalFee = resp.data.data.chargeVal;
              this.webPay(orderId, totalFee);
            }
          })
          .catch(err => {
            Toast(err.msg);
          });
      }
    },
    // h5公众号支付
    webPay: function(orderId, totalFee) {
      var that = this;
      if (!this.count) {
        this.count = true;
        post(this.url + "/pay/webPay", {
          openId: this.openId,
          orderId: orderId,
          totalFee: totalFee
        })
          .then(resp => {
            this.payList = resp.data.data;
            if (resp.data.code == 100) {
              // 微信支付
              function onBridgeReady() {
                WeixinJSBridge.invoke(
                  "getBrandWCPayRequest",
                  {
                    appId: resp.data.data.appId, //公众号名称，由商户传入
                    timeStamp: resp.data.data.timeStamp, //时间戳，自1970年以来的秒数
                    nonceStr: resp.data.data.nonceStr, //随机串
                    package: resp.data.data.package_str,
                    signType: resp.data.data.signType, //微信签名方式：
                    paySign: resp.data.data.paySign //微信签名
                  },
                  function(res) {
                    that.count = false;
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                      // this.refresh();
                      window.location.href =
                          websiteUrl+"/#/RechargeSuccess";

                      // 使用以上方式判断前端返回,微信团队郑重提示：
                      //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    } else {
                      window.location.href =
                          websiteUrl+"/#/RechargeFail";
                    }
                  }
                );
              }
              if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                  document.addEventListener(
                    "WeixinJSBridgeReady",
                    onBridgeReady,
                    false
                  );
                } else if (document.attachEvent) {
                  document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                  document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
                }
              } else {
                onBridgeReady();
              }
            } else {
              // this.$router.replace({ path: "/RechargeFail" });
            }
          })
          .catch(err => {
            Toast(err.msg);
          });
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
            this.$router.replace({ path: "/RechargeSuccess" });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    // 返回上一页
    toPrev: function() {
      this.$router.replace({ path: "/Recharge" });
    },
    // 支付方式
    // 微信
    choiceWx: function() {
      this.isWx = !this.isWx;
    },
    // 支付宝
    choiceAli: function() {
      this.isApl = !this.isApl;
    }
  },
  mounted() {
    this.pay_num = this.$route.query.value;
    this.token = localStorage.getItem("token");
    this.phone = localStorage.getItem("phone");
    this.openId = localStorage.getItem("openId");
  },
  created() {
    // onBridgeReady()
  }
};
</script>
<style scoped>
body {
  background: #f8f8f8;
}
.rechargemoney {
  width: 100%;
  padding-top: 60px;
  padding-bottom: 60px;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
  font-size: 18px;
  cursor: pointer;
}
.rechargemoney span {
  color: red;
  cursor: pointer;
}
/* 须支付金额 */
.money {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  line-height: 20px;
  cursor: pointer;
}
.alltype {
  width: 100%;
  background: #fff;
  cursor: pointer;
}
.paytype {
  width: 94%;
  margin: 0 auto;
  height: 60px;
  border-bottom: 1px solid #eaeaea;
  text-align: left;
  line-height: 60px;
  cursor: pointer;
}
.wxtype img {
  width: 20px;
  position: relative;
  top: 5px;
  margin-right: 2%;
  cursor: pointer;
}
.wxtype {
  width: 80%;
  float: left;
  cursor: pointer;
}
/* 支付方式图标 */
.select {
  width: 20px;
  height: 20px;
  float: right;
  line-height: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.select img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.paynow {
  width: 120px;
  height: 40px;
  line-height: 40px;
  border-radius: 30px;
  text-align: center;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  color: #fff;
  margin: 40px auto;
  cursor: pointer;
}
</style>
