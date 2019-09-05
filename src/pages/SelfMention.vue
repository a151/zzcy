<template>
  <!-- 自提 -->
  <div class="content">
    <div class="topcon clearfix">
      <div class="head">
        <img class="cancelicon" v-on:click="Cancel(act)" src="../assets/images/cancel.png" />自提
      </div>
      <!-- 待发货 -->
      <div class="shipped">{{ordername}}</div>
      <!-- 订单信息 -->
      <div class="order_msg clearfix">
        <div class="order_box">
          <!-- 收货地址 -->
          <div class="order_address">
            <div class="address_title">收货地址</div>
            <!-- 姓名 电话 -->
            <div class="address_name">
              <span>{{orderSnlist.emsname}}</span>
              <span class="address_phone">{{orderSnlist.phone}}</span>
            </div>
            <!-- 地址 -->
            <div class="address_det clearfix">
              <div class="default" v-if="orderSnlist.isDefault == 1">默认</div>
              <!-- <div class="default">默认</div> -->
              {{orderSnlist.province}}&nbsp;&nbsp;{{orderSnlist.city}}&nbsp;&nbsp;{{orderSnlist.district}}&nbsp;&nbsp;{{orderSnlist.address}}
            </div>
          </div>
          <!-- 自提蔬菜信息 -->
          <div class="vegetable_msg clearfix">
            <div class="address_title vege_title">自提蔬菜信息</div>
            <div class="vege_msg clearfix">
              <!-- 图片 -->
              <div class="vege_img">
                <img src="../assets/images/clb.png" alt />
              </div>
              <div class="vege_gift">蔬菜礼包</div>
              <div class="vege_gift vege_num">{{orderSnlist.val}}箱</div>
            </div>
          </div>
          <!-- 订单信息 -->
          <div class="order_infor">
            <div class="address_title vege_title">订单信息</div>
            <div class="order_sn">订单编号：{{orderSnlist.orderSn}}</div>
            <div class="order_sn order_time">订单时间：{{orderSnlist.createTime | date}}</div>
          </div>
          <!-- 运费 -->
          <div class="freight">
            <div class="clearfix">
              <div class="freight_name">运费：</div>
              <div class="freight_money">￥{{freight}}</div>
            </div>
            <div class="clearfix">
              <div class="freight_name">实付：</div>
              <div class="freight_money">15{{valtype}}</div>
            </div>
          </div>
          <div class="cancelorder" v-on:click="cancelbtn" v-show="sure">
            <span>取消订单</span>
          </div>
        </div>
      </div>
    </div>
    <!--取消弹窗-->
    <div class="tishi" v-show="xpcity">
      <div class="tishi_c">
        <div class="tishi_main">
          <div class="tishi_1">
            <span>确认取消该订单?</span>
          </div>
          <div class="tishi_2 clr">
            <span @click="no">取消</span>
            <span @click="handleAnswer">确认</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get, post } from "@/api/global";
import Global from "@/api/global";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      analysisRank: [],
      xpcity: false,
      sure: true,
      status: "",
      act: "",
      orderSn: "",
      url: Global.url,
      orderSnlist: "",
      ordername: "",
      freight: "",
      valtype: "",
      url: Global.url,
      payVal: 0,
      payType: 0
    };
  },
  methods: {
    Cancel: function(act) {
      this.$router.replace({
        path: "/Recognition",
        query: { name: name, act: act }
      });
    },
    cancelbtn() {
      this.xpcity = true;
    },
    no() {
      this.xpcity = false;
    },
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
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    handleAnswer() {
      post(
        this.url +
          "/goods/canselforder?phone=" +
          localStorage.getItem("phone") +
          "&ordersn=" +
          this.orderSn
      )
        .then(resp => {
          Toast("取消订单成功");
          this.ordername = "已取消";
          this.xpcity = false;
          this.sure = !this.sure;
          this.refresh();
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    details() {
      post(
        this.url +
          "/goods/selfOrderDetail?phone=" +
          localStorage.getItem("phone") +
          "&orderSn=" +
          this.orderSn
      )
        .then(resp => {
          this.orderSnlist = resp.data.data;
          this.$nextTick(function() {
            this.payType = this.orderSnlist.payType;
            this.payVal = this.orderSnlist.payVal;
            if (this.payVal == 0) {
              this.freight = "免费";
              this.valtype = "0";
            } else {
              this.freight = "15";
            }
            if (this.orderSnlist.payType == 2) {
              this.valtype = "菜宝";
            } else {
              this.valtype = "金豆";
            }
          });
        })
        .catch(err => {
          Toast(err.msg);
        });
    }
  },
  created() {
    this.status = this.$route.query.name;
    this.act = this.$route.query.act;
    this.orderSn = this.$route.query.orderSn;
    this.details();
    if (this.status == "待发货") {
      this.ordername = "待发货";
    } else if (this.status == "已发货") {
      this.ordername = "已发货";
    } else if (this.status == "已完成") {
      this.ordername = "已完成";
    } else if (this.status == "已取消") {
      this.ordername = "已取消";
      this.sure = false;
    }
    // if(this.orderSnlist.payType || this.orderSnlist.payVal){

    // }
  }
};
</script>
<style scoped>
.content {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  cursor: pointer;

  background: linear-gradient(to right, rgba(62, 130, 65), rgba(77, 145, 82));
}
.topcon {
  width: 100%;
  background-image: url("../assets/images/bactd.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
}
.head {
  background: none !important;
  cursor: pointer;
}
/* 待发货 */
.shipped {
  font-size: 0.4rem;
  text-align: left;
  margin: 0.2rem 0 0.3rem 0.3rem;
}
/* 订单信息 */
.order_msg {
  width: 92%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 0.17rem;
}
.order_box {
  padding: 0.2rem 0.3rem;
}
/* 收货地址 */
.order_address,
.vegetable_msg,
.order_infor {
  border-bottom: 1px solid #ddd;
  text-align: left;
}
.address_title {
  font-size: 0.32rem;
  color: #000;
}
/* 收货人姓名 */
.address_name {
  color: #333;
  font-size: 0.32rem;
  line-height: 0.54rem;
  cursor: pointer;
}
/* 电话 */
.address_phone {
  font-size: 0.28rem;
  color: #666;
  cursor: pointer;
}
.address_det {
  line-height: 0.54rem;
  font-size: 0.3rem;
  color: #333;
  cursor: pointer;
  margin-bottom: 0.15rem;
}
/* 是否默认 */
.default {
  color: #3d8141;
  padding: 0 0.06rem;
  margin-right: 5px;
  margin-top: 4px;
  background: #d8e6d9;
  float: left;
  font-size: 0.26rem;
  cursor: pointer;
  line-height: 0.36rem;
}
/* 自提蔬菜信息 */
.vege_title {
  margin: 0.3rem 0 0.1rem;
  cursor: pointer;
}
.vege_msg {
  margin: 0 0 0.28rem;
  line-height: 0.89rem;
  cursor: pointer;
}
/* 图片 */
.vege_img {
  width: 1.41rem;
  height: 0.89rem;
  float: left;
  margin-right: 0.3rem;
  cursor: pointer;
}
.vege_img img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
/* 礼包 */
.vege_gift {
  float: left;
  color: #333;
  font-size: 0.32rem;
  cursor: pointer;
}
/* 数量 */
.vege_num {
  float: right;
  cursor: pointer;
}
/* 订单信息 */
.order_sn {
  font-size: 0.3rem;
  color: #333;
  cursor: pointer;
}
.order_time {
  margin-bottom: 0.27rem;
}
/* 运费 */
.freight {
  margin: 0 0 0.3rem 0;
}
.freight_name,
.freight_money {
  color: #333;
  font-size: 0.3rem;
  float: left;
  margin-top: 0.1rem;
}
.freight_money {
  float: right;
}
.cancelorder {
  width: 1.6rem;
  height: 0.6rem;
  border-radius: 3px;
  border: #999999 solid 1px;
  color: #999999;
  font-size: 0.29rem;
  line-height: 0.6rem;
  float: right;
  margin: 0 0 0.3rem 0;
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
</style>
