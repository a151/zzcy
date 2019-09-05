<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(name)" src="../assets/images/cancel.png" />
      {{name}}明细
    </div>
    <!-- 暂无明细 -->
    <div class="box" v-if="isDetail">
      <img src="../assets/images/mx.png" alt />
      <p>您暂时还没有交易明细</p>
    </div>
    <!-- 内容 -->
    <div
      class="list_item"
      v-for="item in detailList"
      :key="item.id"
      v-else
      @click="Speed(name,item.channel,item.orderSn)"
    >
      <!-- <div class="list_item" v-for="item in detailList" :key="item.id" v-else> -->
      <div class="list_price">
        <p>{{item.type}}</p>
        <span :class="item.value < 0? 'list_span2' : 'list_span1'">{{item.value}}</span>
      </div>
      <p class="list_user">{{item.user}}</p>
      <p class="list_time">{{item.creatTime | date}}</p>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { post, get } from "@/api/global";
import Global from "@/api/global";
// let detailList = [];
// let sign = "";
// let typeValue = "";
export default {
  data() {
    return {
      url: Global.url,
      name: "",
      detailList: [],
      isDetail: true
      // sign: "",
      // typeValue:''
    };
  },
  methods: {
    Speed(name, value, orderSn) {
      if (name == "金豆" && value == 1) {
        // 跳转到提现到账页面
        this.$router.replace({ path: "SeeCath", query: { orderSn: orderSn } });
      } else if (name == "金豆" && value == 109) {
        this.$router.replace({ path: "SeeCath", query: { orderSn: orderSn } });
      } else {
        return true;
      }
    },
    Cancel: function(name) {
      this.$router.replace({ path: "/Summary", query: { name: name } });
    },
    // 获取菜宝明细
    getXpList() {
      // var this = this;
      get(
        this.url + "/xptrans/list?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        if (resp.code == 100) {
          this.detailList = resp.data;
          for (var i = 0; i < resp.data.length; i++) {
            resp.data[i].value = resp.data[i].value;
          }
        }
        if (this.detailList.length > 0) {
          this.isDetail = false;
        }
      });
    },
    // 获取菜金明细
    getRewList() {
      get(
        this.url + "/rewmoney/list?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        if (resp.code == 100) {
          this.detailList = resp.data;
        }
        if (this.detailList.length > 0) {
          this.isDetail = false;
        }
      });
    },
    // 获取金豆明细
    getMtList() {
      get(
        this.url + "/motrans/list?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        if (resp.code == 100) {
          this.detailList = resp.data;
        }
        if (this.detailList.length > 0) {
          this.isDetail = false;
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
    }
  },
  mounted() {},
  created() {
    this.refresh();
    this.name = this.$route.query.name;
    if (this.name == "菜宝") {
      this.getXpList();
    } else if (this.name == "菜金") {
      this.getRewList();
    } else if (this.name == "金豆") {
      this.getMtList();
    }
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.head {
  font-size: 0.36rem;
  cursor: pointer;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  cursor: pointer;
}
.list_item {
  margin: 0 0.3rem;
  /* height: 1.3rem; */
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #f8f8f8;
  cursor: pointer;
}
.list_price {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  line-height: 1;
  padding: 0.3rem 0 0.18rem 0;
  justify-content: space-between;
  cursor: pointer;
}
.list_price p {
  font-size: 0.32rem;
  cursor: pointer;
}
.list_span1 {
  position: relative;
  top: 0.2rem;
  font-size: 0.32rem;
  color: #3d8141;
  cursor: pointer;
}
.list_span2 {
  position: relative;
  top: 0.2rem;
  font-size: 0.32rem;
  color: red;
  cursor: pointer;
}
.list_time {
  text-align: left;
  margin: 0;
  padding: 0;
  font-size: 0.28rem;
  color: #666;
  cursor: pointer;
}
.list_user {
  text-align: left;
  margin: 0;
  padding: 0;
  font-size: 0.28rem;
  font-family: PingFangSC-Regular;
  color: #333;
  cursor: pointer;
}
.list_item:last-child {
  border: 0;
  cursor: pointer;
}
.box {
  margin-top: 45%;
  cursor: pointer;
}
.box img {
  width: 2.12rem;
  cursor: pointer;
}
.box p {
  font-size: 0.3rem;
  color: #333333;
  margin-top: 0.3rem;
  cursor: pointer;
}
</style>
