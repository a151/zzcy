<template>
  <div class="content recogin">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />我的认种
    </div>
    <div class="nav">
      <p
        v-for="(item,index) in list"
        :key="index"
        @click="tab(index)"
        :class="{nav_actvie:act == index}"
      >{{item}}</p>
    </div>
    <!-- 认种详情 -->
    <div v-show="act==0">
      <div v-if="orderList.length!=0">
        <div class="recogn_det">
          <div class="rec_det">
            <div class="rec_l">
              <p>当前自有存量总数：{{totalNum}}棵</p>
              <p>购买份数：{{orderList.length}}份</p>
              <p>礼包总金额：{{totalPrice}}菜宝</p>
            </div>
            <div class="rec_r">
              <div class="rec_btn" v-on:click="SelfMentionbtn(totalNum)">自提</div>
            </div>
          </div>
        </div>
        <!-- 礼包信息 -->
        <div class="gift_msg" v-for="(item,index) in orderList" :key="index">
          <div class="gift_top">
            <div class="gift_l">
              <p class="gift_date">{{item.createTime | date}}</p>
              <!-- <p v-if="item.packName == level_name">{{item.packName}}（补差升级）</p> -->
              <!-- <p if="item.sign == 1?item.packName:item.packName（补差升级）">{{item.packName}}（补差升级）</p> -->
              <p>{{item.packName}}</p>
              <!-- <p :class="{content_color:item.orderStatus}">{{item.packName}}</p> -->
            </div>
            <div class="gift_r" @click="changeUp(item)">
              <!-- <p
                :class="{content_color:item.orderStatus}"
              >{{item.orderStatus == 2?'已完成':item.orderStatus == 3?'已支付':'查看详情'}}</p>

              <div class="up_down" v-show="!item.orderStatus" @click="changeUp(item)">
                <img :src="item.show ?srcDown:srcUp" alt>
              </div>-->
              <p>查看详情</p>
              <div class="up_down">
                <img :src="item.show ?srcDown:srcUp" alt />
              </div>
            </div>
          </div>

          <div class="gift_bg"></div>
          <!-- 礼包详情 -->
          <div class="gift_det" v-show="!item.show">
            <div>{{item.createTime | date}} 认种{{item.packName}}</div>
            <div>
              <p class="gift_title">蔬菜总数：</p>
              <p class="gift_num">{{item.relTotal}}棵</p>
            </div>
            <div>
              <p class="gift_title">认种周期：</p>
              <p class="gift_num">{{item.packPeriod}}天</p>
            </div>
            <div>
              <p class="gift_title">预期分配：</p>
              <p class="gift_num">{{item.packRate}}%</p>
            </div>
            <div>
              <p class="gift_title">已释放菜品数量：</p>
              <p class="gift_num">{{item.remainNum}}棵</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 暂无数据 -->
      <div class="box" v-else>
        <img src="../assets/images/rz.png" alt />
        <p>您暂时还没有认种</p>
      </div>
    </div>
    <!--订单详情-->
    <div v-show="act==1" :class="{listlength:act}">
      <div v-if="selfList.length!=0">
        <div class="text_self">
          <span>全部订单</span>
        </div>
        <div
          class="content-box"
          v-on:click="SelfMention(book.status,act,book.orderSn)"
          v-for="(book, index) in selfList"
          :key="index"
        >
          <div class="text">
            <span class="text_date">{{book.createTime | date}}</span>
            <span class="text_status" :style="{color:book.one}">{{book.status}}</span>
          </div>
          <div class="infor">
            <div class="photo"></div>
            <span class="text_total">蔬菜礼包 {{book.val}}箱</span>
          </div>
          <div class="btn-I" v-if="book.status == 1">
            <div class="receiptbtn">
              <span>确认收货</span>
            </div>
            <div class="querybtn-o">
              <span>查看物流</span>
            </div>
          </div>
          <div class="btn-I" v-else-if="book.status == 2">
            <div class="querybtn-o">
              <span>查看物流</span>
            </div>
          </div>
          <div v-else></div>
          <!--<div class="btn-I">
            <div class="receiptbtn">
              <span>确认收货</span>
            </div>
            <div class="querybtn-o">
              <span>查看物流</span>
            </div>
          </div>-->
        </div>
      </div>
      <div class="box" v-else>
        <img src="../assets/images/orderSearch.png" alt />
        <p>您暂时还没有订单</p>
      </div>
    </div>
  </div>
  <!--订单详情-->
</template>
<script>
import { get } from "@/api/global";
import Global from "@/api/global";
export default {
  data() {
    return {
      request: 1,
      list: ["我的认种", "自提订单"],
      actiove: -1,
      sel: "",
      act: 0,
      srcUp: require("../assets/images/up.png"),
      srcDown: require("../assets/images/down.png"),
      isTop: true,
      url: Global.url,
      orderList: [],
      selfList: [],
      // 礼包状态
      status: "查看详情",
      totalNum: "",
      have: true,
      state: {
        1: "待发货",
        2: "已发货",
        3: "已完成",
        4: "已取消"
      },
      statuc: {
        待发货: "#FBB92B",
        已发货: "#3D8141",
        已完成: "#3D8141",
        已取消: "#999999"
      },
      listlength: 1,
      level_name: ""
    };
  },
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    // 自提订单
    SelfMention: function(name, act, orderSn, request) {
      this.$router.replace({
        path: "/SelfMention",
        query: { name: name, act: act, orderSn: orderSn }
      });
    },
    tab: function(index) {
      this.actiove = index;
      this.act = index;
    },
    // 查看详情
    changeUp: function(item) {
      item.show = !item.show;
    },
    // 自提页面
    SelfMentionbtn: function(totalNum) {
      this.$router.replace({
        path: "/SelfMentionbtn",
        query: { name: totalNum }
      });
    },
    // 认种列表
    getOrderList: function() {
      get(
        this.url + "/goods/orderList?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        this.orderList = resp.data;
        // var last_num = this.orderList[this.orderList.length - 1];
        for (let i in this.orderList) {
          this.$set(this.orderList[i], "show", "false");
          if (this.orderList[i].sign == 1) {
            this.$set(
              this.orderList[i],
              "packName",
              this.orderList[i].packName + "（补差升级）"
            );
          }
          // if (
          //   this.level_name == this.orderList[i].packName &&
          //   last_num.packName == "萌小青礼包" &&
          //   localStorage.getItem("update") == 1
          // ) {
          //   this.orderList[i].packName =
          //     this.orderList[i].packName + "（补差升级）";
          // }
        }
      });
    },
    // 自有存量总数
    total: function() {
      get(
        this.url + "/user/selReReNum?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        this.totalNum = resp.data;
      });
    },
    // 自提列表
    getSelfList: function() {
      get(
        this.url + "/goods/selflist?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        this.selfList = resp.data;
        this.listlength = this.selfList.length;
        for (var i = 0; i < this.selfList.length; i++) {
          this.$set(this.selfList[i], "one", "");
        }
        for (const item of resp.data) {
          item.status = this.state[item.status];
          item.one = this.statuc[item.status];
        }
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
  mounted() {
    this.getSelfList();
    this.getOrderList();
    this.total();
    this.level_name = localStorage.getItem("level") + "礼包";
    this.isUpgrade = localStorage.getItem("update");
    if ((this.selfList.status = "1")) {
      this.sel = 0;
    } else if ((this.selfList.status = "2")) {
      this.sel = 1;
    } else {
      this.sel = 2;
    }
    if (this.orderList) {
      this.have = true;
    } else {
      this.have = false;
    }
  },
  computed: {
    // 礼包总额
    totalPrice: function() {
      var price = 0;
      let single = 0;
      for (let i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i].packId == 11) {
          single = 300;
        } else if (this.orderList[i].packId == 12) {
          single = 3000;
        } else if (this.orderList[i].packId == 13) {
          single = 6000;
        } else if (this.orderList[i].packId == 14) {
          single = 9000;
        } else if (this.orderList[i].packId == 15) {
          single = 12000;
        }
        price += single;
      }
      return price;
    }
    //
  },
  created() {
    let act = this.$route.query.act;
    if (act == undefined) {
      this.act == 0;
    } else {
      this.act = 1;
    }
  }
};
</script>
<style scoped>
/* 整体 */
.recogin {
  background-color: #f8f8f8;
  overflow: hidden;
  min-height: 100%;
  zoom: 1;
  cursor: pointer;
}
p {
  margin: 0;
  padding: 0;
  cursor: pointer;
}
.nav {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  padding: 0.3rem 1.68rem 0;
  line-height: 1;
  background-color: #fff;
  cursor: pointer;
}
.nav p {
  font-size: 0.3rem;
  color: rgba(102, 102, 102, 1);
  cursor: pointer;
}
.nav_actvie {
  padding-bottom: 0.24rem;
  border-bottom: 0.04rem solid #3d8141;
  cursor: pointer;
}
.box {
  height: 100%;
  /* background-color: #fff; */
  cursor: pointer;
}
.box img {
  margin-top: 45%;
  width: 2.12rem;
  cursor: pointer;
}
.box p {
  font-size: 0.3rem;
  color: #333333;
  margin-top: 0.3rem;
  cursor: pointer;
}
/* 认种详情 */
.recogn_det {
  width: 100%;
  height: 2.3rem;
  margin: 10px 0 10px 0;
  background-color: #fff;
  cursor: pointer;
}
.rec_det {
  overflow: hidden;
  zoom: 1;
  margin: 0 0.26rem;
  cursor: pointer;
}
/* 左侧 */
.rec_l {
  float: left;
  margin-top: 0.5rem;
  text-align: left;
  font-size: 0.34rem;
  color: #333;
  cursor: pointer;
}
/* 右侧 */
.rec_r {
  float: right;
  line-height: 1.32rem;
  cursor: pointer;
}
/* 按钮 */
.rec_btn {
  color: #fff;
  font-size: 0.26rem;
  width: 1.56rem;
  height: 0.52rem;
  background-image: url("../assets/images/zt.png");
  background-repeat: no-repeat;
  background-size: cover;
  text-emphasis: center;
  line-height: 0.52rem;
  margin-top: 0.92rem;
  margin-right: 0.26rem;
  cursor: pointer;
}
/* 礼包详情 */
.gift_msg {
  width: 92%;
  /* height: 1.5rem; */
  overflow: hidden;
  zoom: 1;
  margin: 0 auto;
  margin-bottom: 0.2rem;
  background-color: #fff;
  margin-top: 0.1rem;
  font-size: 0.34rem;
  color: #333;
  cursor: pointer;
}
/* 礼包名称 */
.gift_top {
  overflow: hidden;
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}
.gift_l {
  float: left;
  margin-left: 0.38rem;
  cursor: pointer;
}
.gift_l p {
  margin-top: 0.3rem;
  line-height: 1;
  text-align: left;
  cursor: pointer;
}
/* 礼包时间 */
.gift_date {
  color: #999;
  font-size: 0.28rem;
  cursor: pointer;
}
/* 查看详情 */
.gift_r {
  float: right;
  line-height: 1.5rem;
  margin-right: 0.4rem;
  cursor: pointer;
}
.gift_r p {
  float: left;
  cursor: pointer;
}
/* 上下箭头 */
.up_down {
  width: 0.26rem;
  height: 0.14rem;
  float: right;
  margin-left: 0.12rem;
  cursor: pointer;
}
.up_down img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
/* 中间背景 */
.gift_bg {
  height: 0.1rem;
  background-color: #f8f8f8;
  cursor: pointer;
}
/* 礼包详情 */
.gift_det {
  width: 100%;
  overflow: hidden;
  zoom: 1;
  background: #fff;
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  color: #333;
  font-size: 0.28rem;
  cursor: pointer;
}
.gift_det div {
  margin: 0.3rem 0 0.3rem 0.38rem;
  text-align: left;
  overflow: hidden;
  zoom: 1;
  line-height: 1;
  cursor: pointer;
}
/* 标题 */
.gift_title,
.gift_num {
  float: left;
  font-size: 0.3rem;
  cursor: pointer;
}
.gift_title {
  color: #999;
  cursor: pointer;
}
.text_self {
  margin: 0.2rem 0 0 0.3rem;
  font-size: 0.32rem;
  text-align: left;
}
.content-box {
  width: 92%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  margin-left: 50%;
  margin-top: 0.2rem;
  transform: translateX(-50%);
  box-shadow: 0px 3px 9px 1px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  box-sizing: border-box;
}
.text {
  width: 100%;
  height: 0.8rem;
}
.text_date {
  color: #777777;
  position: relative;
  font-size: 0.32rem;
  top: 0.3rem;
  right: 1.2rem;
}
.text_status {
  color: #4b894e;
  font-size: 0.32rem;
  position: relative;
  top: 0.27rem;
  left: 1.4rem;
}
.infor {
  width: 100%;
  height: 1.2rem;
  margin: 0.2rem 0 0.3rem 0.2rem;
}
.photo {
  float: left;
  width: 1.8rem;
  height: 1.14rem;
  background-image: url("../assets/images/lettuce.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.text_total {
  text-align: left;
  font-size: 0.34rem;
  position: relative;
  right: 1rem;
  line-height: 1.2rem;
}
.btn-I {
  height: 0.7rem;
  margin: 0 0.3rem 0.4rem 0;
}
.querybtn-o {
  float: right;
  width: 1.6rem;
  height: 0.7rem;
  border: #f9b931 1px solid;
  border-radius: 2px;
  color: #f9b931;
  font-size: 0.32rem;
  line-height: 0.7rem;
}
.receiptbtn {
  float: right;
  width: 1.6rem;
  height: 0.7rem;
  border: #418245 1px solid;
  border-radius: 2px;
  color: #418245;
  font-size: 0.32rem;
  line-height: 0.7rem;
  margin: 0 0 0 0.3rem;
}
</style>
