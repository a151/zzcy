<template>
  <div class="content">
    <div class="topcon">
      <div class="head">
        <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />市场分红
      </div>
      <div class="remark">
        {{level}}3月份总销售额
        <!-- <div class="re_rule" @click="marketRule">规则</div> -->
      </div>
      <span class="num">{{sale.currVal}}</span>
      <div class="remark now_re">当前您的区县收益为</div>
      <span class="num">{{sale.gainVal}}</span>
      <!-- <div class="end_date">截止至{{sale.timestamp | date}}</div> -->
    </div>
    <div class="allcon">
      <div class="con">历史收益</div>
      <div class="con">
        <div class="leftcon">时间</div>
        <div class="leftcon">销售额</div>
        <div class="leftcon">收益</div>
      </div>
      <div class="con" v-for="item in list" :key="item.index">
        <div class="leftcon">{{item.createtime | time}}</div>
        <div class="leftcon">{{item.sales}}</div>
        <div class="leftcon">{{item.gain}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { get } from "@/api/global";
import Global from "@/api/global";
export default {
  created() {
    this.getMarketList();
    this.level = localStorage.getItem("level");
  },
  data() {
    return {
      url: Global.url,
      // 地区
      level: "",
      list: [
        // { index: 1, time: "2019-1-1", sale: "200000", profit: "1920" },
        // { index: 2, time: "2019-1-1", sale: "200000", profit: "1920" },
        // { index: 3, time: "2019-1-1", sale: "200000", profit: "1920" },
        // { index: 4, time: "2019-1-1", sale: "200000", profit: "1920" },
        // { index: 5, time: "2019-1-1", sale: "200000", profit: "1920" },
        // { index: 6, time: "2019-1-1", sale: "200000", profit: "1920" },
        // { index: 7, time: "2019-1-1", sale: "200000", profit: "1920" }
      ],
      sale: {}
    };
  },
  methods: {
    getMarketList() {
      get(this.url + "/user/gainList?phone=" + localStorage.getItem("phone")).then(
        resp => {
          this.sale = resp.data;
          this.list = resp.data.list;
        }
      );
    },
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    // 规则
    marketRule: function() {
      this.$router.replace({ path: "/MarketRule" });
    }
  }
};
</script>
<style scoped>
.content {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  background: #f8f8f8;
  cursor: pointer;
  overflow-y: scroll;
  overflow-x: hidden;
}
.head {
  background: none !important;
  cursor: pointer;
}
.topcon {
  width: 100%;
  height: 5.6rem;
  background: linear-gradient(
    23deg,
    rgba(62, 130, 65, 1),
    rgba(101, 169, 108, 1)
  );
  color: #fff;
  cursor: pointer;
}
.remark {
  margin-top: 0.4rem;
  cursor: pointer;
  font-size: 0.3rem;
  position: relative;
}
.re_rule {
  position: absolute;
  right: 0.3rem;
  top: 0;
}
.now_re {
  margin-top: 0.7rem;
}
.num {
  display: inline-block;
  font-size: 0.4rem;
  margin: 0 auto;
  width: 1.83rem;
  border-bottom: 1px solid #fff;
  cursor: pointer;
}
/* 截止日期 */
.end_date {
  font-size: 0.28rem;
  color: #fff;
  text-align: right;
  margin: 0.58rem 0.3rem 0 0;
}
.allcon {
  width: 100%;
  background: #fff;
  cursor: pointer;
}
.con {
  width: 94%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  margin: 0 auto;
  cursor: pointer;
}
.leftcon {
  width: 33.333%;
  float: left;
  text-align: center;
  cursor: pointer;
}
</style>
