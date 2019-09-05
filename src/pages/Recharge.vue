<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(num,frequ)" src="../assets/images/cancel.png" />充值
    </div>
    <div class="alllist">
      <span class="choice_num">请选择要充值的菜宝金额</span>
      <ul>
        <li
          class="list"
          v-for="(item,index) in list"
          :key="index"
          :class="{border:isBorder == index}"
          @click="changeBorder(item,index)"
        >{{item}}元</li>
      </ul>
    </div>
    <div style="clear:both"></div>
    <div class="info">
      <div class="title">请输入其他金额</div>
      <span class="symbol">￥</span>
      <input class="inp" type="tel" v-model="value1" />
    </div>
    <div class="rechargebtn btn" v-on:click="PayRecharge">在 线 充 值</div>
    <div class="brankbtn btn" v-on:click="BrandDetail">银 行 汇 款</div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  created() {
    this.num = this.$route.query.num;
    this.frequ = this.$route.query.frequ;
  },
  data() {
    return {
      num: "",
      frequ: "",
      isBorder: 0,
      list: ["3000", "6000", "9000", "12000"],
      value1: 3000
    };
  },
  methods: {
    changeBorder: function(item, index) {
      this.isBorder = index;
      this.value1 = item;
    },
    PayRecharge: function() {
      var num = this.value1;
      // 判断输入金额是否是小数
      if (/^\d{0,8}\.?$/.test(num)) {
        this.$router.replace({ path: "/Submitpay", query: { value: num } });
      } else {
        Toast("请输入整数");
      }
    },
    BrandDetail: function() {
      this.$router.replace({ path: "/BrandDetail" });
    },
    Cancel: function(num, frequ) {
      if (this.num != null || this.frequ != null) {
        this.$router.replace({
          path: "/SubmitOrder",
          query: { name: num, frequ: frequ }
        });
      } else {
        this.$router.replace({ path: "/" });
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
    }
  }
};
</script>
<style scoped>
body {
  background: #fff;
}

.alllist {
  width: 100%;
  margin: 25px 0 0 16px;
  overflow: hidden;
  zoom: 1;
  text-align: left;
  color: #333;
  cursor: pointer;
}
/* 选择充值金额 */
.choice_num {
  font-size: 16px;
  cursor: pointer;
}
.list {
  width: 96px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  margin: 10px 9% 10px 11%;
  float: left;
  text-align: center;
  padding-bottom: 0;
  cursor: pointer;
}
.border {
  background: #ebf2ec;
  /* opacity: 0.1; */
  border-color: #3d8141;
  color: #3d8141;
  cursor: pointer;
}
.info {
  margin: 30px 16px 50px;
  text-align: left;
  overflow: hidden;
  zoom: 1;
  cursor: pointer;
}
/* 请输入金额 */
.title {
  width: 100%;
  margin-bottom: 0;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
  cursor: pointer;
}
/* 钱的符号 */
.symbol {
  float: left;
  cursor: pointer;
}
/* 输入框 */
.inp {
  width: 90%;
  border-bottom: 1px solid #ddd !important ;
  cursor: pointer;
}
.btn {
  width: 160px;
  height: 44px;
  line-height: 44px;
  border-radius: 30px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 30px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
/* 在线充值 */
.rechargebtn {
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  cursor: pointer;
}
/* 银行 */
.brankbtn {
  color: #7c4f00;
  background: linear-gradient(to right, #ffa60a, #ffb22b, #ffbd48);
  cursor: pointer;
}
</style>
