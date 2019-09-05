<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(name)" src="../assets/images/cancel.png" />提现结果页
    </div>
    <div>
      <img class="photo" src="../assets/images/rechargesuccess.png" alt />
    </div>
    <div>
      <span class="text-infor">恭喜您提现申请成功</span>
    </div>

    <div class="address">
      <p>
        开户人：
        <span>{{cathData.userName}}</span>
      </p>
      <p>
        储蓄卡号：
        <span>{{cathData.bankNum}}</span>
      </p>
      <p>
        提现金豆：
        <span>{{cathData.val}}</span>
      </p>
      <p>
        提现时间：
        <span>{{cathData.createTime | date}}</span>
      </p>
      <p>
        交易编号：
        <span>{{cathData.sn}}</span>
      </p>
    </div>
    <div class="text-pointout">
      <p>工作人员将在两个工作日内审核并打款(周末不处理)</p>
      <p>如果提现受理信息错误，请及时与客服联系：</p>
      <p>联系电话：+86 15652411986</p>
    </div>
    <div class="text-tips">
      <p>提现申请成功后，进度查询方法：我的金豆 - 金豆明细 - 找到提现明细，点击即可查看提现进度</p>
    </div>
  </div>
</template>

<script>
import Global from "@/api/global";
import { Toast } from "vant";
import { post, get } from "@/api/global";
export default {
  data() {
    return {
      ordersn: {},
      addresslist: {},
      payType: "",
      url: Global.url,
      val: "",
      name: "",
      cathData: {}
    };
  },
  methods: {
    Cancel: function(name) {
      this.$router.replace({ path: "/Withdrawal", query: { name: name } });
    }
  },
  created() {
    this.name = this.$route.query.name;
    this.cathData = this.$route.query.value;
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
  margin: 0.4rem 0.2rem 0.3rem 0.2rem;
  font-size: 0.29rem;
  color: #8a8a8a;
  /* text-align: left; */
}
.text-tips {
  font-size: 0.27rem;
  margin: 0.2rem;
  text-align: left;
  color: red;
}
.address {
  /* height: 100% */
  line-height: 0.63rem;
  font-size: 0.32rem;
  color: #333333;
  text-align: left;
  padding: 0.5rem 0 0 0;
  margin: 0.4rem 0.2rem 0 0.2rem;
  border-top: #e2e2e2 solid 1px;
  /* border-bottom: #e2e2e2 solid 1px; */
}
/* .address span { */
  /* color: #999999; */
  /* font-weight: 400 */
/* } */
.address p {
  color: #333333;
  /* font-weight: 700; */
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
