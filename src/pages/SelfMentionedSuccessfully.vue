<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />自提成功
    </div>
    <div>
      <img class="photo" src="../assets/images/rechargesuccess.png" alt />
    </div>
    <div>
      <span class="text-infor">恭喜您自提成功</span>
    </div>
    <div class="text-pointout">
      <p>当日15:00前的订单当天发货，超过则次日发货</p>
      <p>请随时关注订单动态。</p>
    </div>
    <div class="address">
      <p>收货地址</p>
      <p>
        {{ordersn.emsName}}&nbsp;&nbsp;
        <span class="phoneC">{{ordersn.emsPhone}}</span>
      </p>
      <p>{{ordersn.emsProvince}}&nbsp;&nbsp;{{ordersn.emsCity}}&nbsp;&nbsp;{{ordersn.emsAddress}}&nbsp;&nbsp;{{ordersn.emsDistrict}}</p>
    </div>
    <div class="payment">
      <span class="text-l">实付</span>
      <span class="text-r">{{val}}{{payType}}</span>
    </div>
  </div>
</template>

<script>
import Global from "@/api/global";
import { post, get } from "@/api/global";
export default {
  data() {
    return {
      ordersn: {},
      addresslist: {},
      payType: "",
      url: Global.url,
        val:''
    };
  },
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Recognition" });
    },
    checkSn() {
      post(
        this.url +
          "/goods/selfOrderDetail?phone=" +
          localStorage.getItem("phone") +
          "&orderSn=" +
          this.ordersn
      )
        .then(resp => {
          this.addresslist = resp.data.data;
        })
        .catch(err => {
          console.log(err.msg);
        });
    },
    pay() {
      if (this.paytype == 1) {
        this.payType = "金豆";
      } else if (this.paytype == 2) {
        this.payType = "菜宝";
      }
    }
  },
  created() {
    this.ordersn = this.$route.query.name;
    this.paytype = this.$route.query.item;
    this.val = this.$route.query.pay;
    this.pay();
    this.checkSn();
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  touch-action: none;
}
.head {
  font-size: 0.36rem;
  cursor: pointer;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  cursor: pointer;
}
.photo {
  width: 3rem;
  height: 2.5rem;
  margin: 0.5rem 0 0 0;
}
.text-infor {
  font-size: 0.42rem;
  position: relative;
  top: 0.2rem;
  color: #418546;
}
.text-pointout {
  margin: 0.2rem 0 0 0;
  font-size: 0.32rem;
  color: #8a8a8a;
}
.address {
  height: 2.2rem;
  font-size: 0.34rem;
  color: black;
  text-align: left;
  padding: 0.5rem 0 0 0;
  margin: 0.4rem 0.2rem 0 0.2rem;
  border-top: #e2e2e2 solid 1px;
  border-bottom: #e2e2e2 solid 1px;
}
.payment {
  margin: 0.2rem 0 0 0;
  font-size: 0.32rem;
  color: black;
}
.text-l {
  position: relative;
  right: 2.7rem;
}
.text-r {
  position: relative;
  left: 2.6rem;
}
.phoneC {
  color: #666666;
}
</style>
