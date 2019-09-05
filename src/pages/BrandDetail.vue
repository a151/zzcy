<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png">汇款信息
    </div>
    <div class="allcon">
      <div class="topcon">
        <div class="title">众种菜园汇款信息</div>
        <div class="con">
          <div>用户名：</div>
          <div>广东众种菜园农业科技发展有限公司</div>
          </div>
        <div class="copy copyname" data-clipboard-text="广东众种菜园农业科技发展有限公司" v-on:click="Copyname">复制</div>
        <div class="cle"></div>
        <div class="con">
          <div>开户行：</div>
          <div>中国农业银行股份有限公司清新领秀<br/>支行<div
            class="copy brandnum"
            data-clipboard-text="中国农业银行股份有限公司清新领秀支行"
            v-on:click="Copynum"
          >复制</div></div>


        </div>

        <div class="cle"></div>
        <div class="con">
          <div>银行卡号：</div>
          <div>44690301040007046</div>
          </div>
        <div class="copy number" data-clipboard-text="44690301040007046" v-on:click="Copynumber">复制</div>
        <div class="cle"></div>
      </div>
      <div class="topcon">
        <div class="title">汇款后请填写并提交个人汇款信息</div>
        <div class="info">
          <span>*</span>
          <div class="name">用户名：</div>
          <input v-model="userName">
        </div>
        <div class="cle"></div>
        <div class="info">
          <span>*</span>
          <div class="name">银行卡号：</div>
          <input v-model="bankCard">
        </div>
        <div class="cle"></div>
        <div class="info">
          <span>*</span>
          <div class="name">汇款金额：</div>
          <input v-model="money">
        </div>
        <div class="cle"></div>
        <div class="info">
          <div class="name" style="margin-left:2%">备注：</div>
          <input v-model="remark">
        </div>
        <div class="cle"></div>
      </div>
      <div class="btn" @click="submit">提交</div>
      <div class="tips">
        <img src="@/assets/images/tips.png" alt>
      </div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post } from "@/api/global";
import Clipboard from "clipboard";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      url: Global.url,
      userName: "",
      bankCard: "",
      money: "",
      userPhone: "",
      remark: ""
    };
  },
  methods: {
    Cancel: function() {
      this.$router.replace({ path: "/Recharge" });
    },
    Copyname: function() {
      let clipboard = new Clipboard(".copyname");
      clipboard.on("success", e => {
        Toast("复制成功");
      });
    },
    Copynum: function() {
      let clipboard = new Clipboard(".brandnum");
      clipboard.on("success", e => {
        Toast("复制成功");
      });
    },
    Copynumber: function() {
      let clipboard = new Clipboard(".number");
      clipboard.on("success", e => {
        Toast("复制成功");
      });
    },
    // 提交银行汇款信息
    submit: function() {
      // 姓名正则
      var nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
      if (this.userName != "" && this.bankCard != "" && this.money != "") {
        if (nameReg.test(this.userName)) {
          // 银行卡号正则
          var bank_Card = /^(\d{16}|\d{17}|\d{19})$/;
          if (bank_Card.test(this.bankCard)) {
            if (this.money > 0) {
              post(this.url + "/user/bankPayAdd", {
                bankCard: this.bankCard, //银行卡号
                money: this.money, //金额
                remark: this.remark, //备注(选填)
                userName: this.userName, //用户姓名
                userPhone: localStorage.getItem("phone") //用户手机号
              })
                .then(resp => {
                  if (resp.data.code == 100) {
                    Toast("信息已提交");
                    this.$router.replace({ path: "/Remittance" });
                  }
                })
                .catch(err => {
                  Toast(err.msg);
                });
            } else {
              Toast("金额有误");
            }
          } else {
            Toast("银行卡位数有误");
          }
        } else {
          Toast("请输入正确的用户名");
        }
      } else {
        Toast("请填写完整信息。");
      }
    }
  }
};
</script>
<style scoped>
.content {
  background: #f8f8f8;
  height: 100%;
  overflow-y: auto;
}
.allcon {
  width: 94%;
  margin: 20px auto;
  text-align: left;
  cursor: pointer;
  font-family: PingFangSC-Medium;
}
.topcon {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 1px 2px 1px #eaeaea;
  line-height: 25px;
  cursor: pointer;
  background: #fff;
  color: #333;
  font-size: 0.32rem;
}
.title,
.con {
  margin-left: 3%;
  cursor: pointer;
}
.title {
  padding: 0.18rem 0 0.25rem;
}
.con {
  float: left;
  padding-bottom: 5px;
  cursor: pointer;
}
.con div{
  float:left;
}
/* 复制 */
.copy {
  float: left;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  font-size: 0.22rem;
  padding: 0.08rem 0.11rem;
  margin-left: 5px;
  cursor: pointer;
  line-height: 1;
  margin-top: 0.05rem;
  color: #666;
}
.brandnum {
  float: right!important;
  font-weight: normal;
  margin-right: 70%;
}
.cle {
  clear: both;
  cursor: pointer;
}
.info {
  margin-left: 2%;
  padding-bottom: 0.3rem;
  overflow: hidden;
  zoom: 1;
  cursor: pointer;
}
.info span {
  color: red;
  float: left;
  cursor: pointer;
}
.info input {
  border-bottom: 1px solid #eaeaea !important;
  width: 72%;
  float: right;
  margin-right: 2%;
  height: 0.4rem;
  cursor: pointer;
}
.name {
  float: left;
  cursor: pointer;
}
.btn {
  width: 140px;
  line-height: 40px;
  height: 40px;
  border-radius: 30px;
  margin: 0.3rem auto 0.5rem;
  text-align: center;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  color: #fff;
  cursor: pointer;
}
.tips {
  width: 100%;
  cursor: pointer;
}
.tips img {
  width: 100%;
}
</style>
