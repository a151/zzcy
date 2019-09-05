<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel()" src="../assets/images/cancel.png" />
      提现结果页
    </div>
    <div class="content-box">
      <div class="userCath">提现进度</div>
      <div class="userInfo">
        <p>
          开户人：
          <span>{{detailList.userName}}</span>
        </p>
      </div>
      <div class="userInfo">
        <p>
          储蓄卡号：
          <span>{{detailList.bankNum}}</span>
        </p>
      </div>
      <div class="userInfo">
        <p>
          提现金豆：
          <span>{{detailList.val}}</span>
        </p>
      </div>
    </div>
    <div class="content-handle">
      <div class="userClear">处理进度</div>
      <van-steps
        direction="vertical"
        :active="active"
        :inactive-icon="img"
        :active-icon="detailList.status == 2 ? success : lose"
        v-if="stepShow"
      >
        <van-step>
          <p>{{detailList.createTime | date}}</p>
          <span>已提交，工作人员将在2个工作日内审核并打款（周末不处理）</span>
        </van-step>
      </van-steps>
      <van-steps
        direction="vertical"
        :active="active"
        :inactive-icon="img"
        :active-icon="detailList.status == 2 ? success : lose"
        v-else
      >
        <van-step>
          <p>{{detailList.createTime | date}}</p>
          <span>已提交，工作人员将在2个工作日内审核并打款（周末不处理）</span>
        </van-step>
        <van-step v-if="adopt">
          <p>{{detailList.updateTime1 | date}}</p>
          <span>审核通过，款项已入账，请注意查收</span>
        </van-step>
        <van-step v-else>
          <p>{{detailList.updateTime1 | date}}</p>
          <span>审核未通过，如非提现信息错误，请联系人工客服。联系电话：+86 15652411986</span>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>
<script>
import { NoticeBar, Toast, Step, Steps } from "vant";
import { post, get } from "@/api/global";
import Global from "@/api/global";
export default {
  created() {
    this.orderSn = this.$route.query.orderSn;
    this.getDetail();
  },
  data() {
    return {
      img: require("../assets/images/agree.png"),
      lose: require("../assets/images/lose.png"),
      success: require("../assets/images/selected.png"),
      name: "金豆",
      orderSn: "",
      url: Global.url,
      detailList: {},
      adopt: false,
      active: 1,
      stepShow: true
    };
  },
  methods: {
    Cancel: function() {
      this.$router.replace({
        path: "/Detailcomponent",
        query: { name: this.name }
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
    },
    getDetail() {
      get(this.url + "/motrans/castTDetail?orderSn=" + this.orderSn)
        .then(resp => {
          if (resp.code == 100) {
            this.detailList = resp.data;
            if (this.detailList.status == 2) {
              this.stepShow = false;
              this.active = 1;
              this.adopt = true;
            } else if (this.detailList.status == 4) {
              this.stepShow = false;
              this.active = 1;
              this.adopt = false;
            } else {
              this.stepShow = true;
            }
          }
        })
        .catch(err => {
          Toast(err);
        });
    }
  }
};
</script>

<style scoped>
.head {
  font-size: 0.36rem;
  cursor: pointer;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  cursor: pointer;
}
.content-box {
  text-align: left;
  font-size: 0.32rem;
  width: 90%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  margin-left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 3px 9px 1px rgba(0, 0, 0, 0.06);
  margin-top: 15px;
  border-radius: 8px;
  padding: 0.38rem 0.3rem;
  padding-bottom: 0.8rem;
  box-sizing: border-box;
}
.content-handle {
  text-align: left;
  font-size: 0.32rem;
  width: 90%;
  height: 100%;
  margin-left: 50%;
  transform: translateX(-50%);
  margin-top: 40px;
  padding: 0.38rem 0.3rem;
  padding-bottom: 0.8rem;
  box-sizing: border-box;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.userInfo {
  margin-top: 0.1rem;
}
/* .userInfo p {
  color: #999999;
} */
.userInfo {
  color: #333333;
}
input {
  font-size: 0.28rem;
  border-bottom: 1px solid rgb(241, 241, 241);
  width: 100%;
  height: 32px;
}
.money {
  margin-top: 0.2rem;
}
.money span {
  float: right;
  color: #3d8141;
}
.creat_btn {
  text-align: center;
  overflow: hidden;
  zoom: 1;
  margin: 0 0.3rem 0.8rem;
  cursor: pointer;
}
.sure {
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 0.6rem;
  width: 140px;
  height: 40px;
  border-radius: 22.5px;
  line-height: 40px;
  cursor: pointer;
  font-size: 0.3rem;
}
.sure2 {
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 0.6rem;
  width: 140px;
  height: 40px;
  border-radius: 22.5px;
  line-height: 40px;
  cursor: pointer;
  font-size: 0.3rem;
  opacity: 0.7;
}
.content /deep/ .van-notice-bar__wrap {
  font-size: 0.28rem;
}
.bankTag {
  position: absolute;
  right: 0.4rem;
  bottom: 0.92rem;
}
.userCath {
  padding-bottom: 0.2rem;
  font-size: 0.36rem;
  font-weight: 700;
}
.userClear {
  padding-bottom: 0.2rem;
  font-size: 0.36rem;
  font-weight: 700;
}
.van-step__title p {
  color: #999999;
  font-size: 0.26rem;
  padding-bottom: 0.1rem;
}
.van-step__title span {
  color: #333333;
  font-size: 0.28rem;
}
[class*="van-hairline"]::after {
  border: 0;
}
</style>
