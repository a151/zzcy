<template>
  <div class="content">
    <div class="topcon">
      <div class="head">
        <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />
        我的{{name}}
      </div>
      <div style="margin-top:50px;color:#fff;font-size:0.36rem;">{{name}}</div>
      <div
        style="margin-top:10px;color:#fff;font-size:0.4rem;"
      >{{name == "菜宝"?xProperty:name == "菜金"?rewardMoney:money}}</div>
    </div>
    <div v-show="property">
      <div class="list" v-on:click="giving(name)">
        {{name}}转赠
        <img src="../assets/images/goon.png" />
      </div>
      <div class="list" v-on:click="turnout(name)">
        {{name}}转出
        <img src="../assets/images/goon.png" />
      </div>
      <div class="list" v-on:click="Detailed(name)">
        {{name}}明细
        <img src="../assets/images/goon.png" />
      </div>
    </div>
    <div v-show="reward">
      <div class="list" v-on:click="Detailed(name)">
        {{name}}明细
        <img src="../assets/images/goon.png" />
      </div>
    </div>
    <div v-show="jmoney">
      <div class="list" v-on:click="turnout(name)">
        {{name}}转出
        <img src="../assets/images/goon.png" />
      </div>
      <div class="list" v-on:click="Withdrawal(name)">
        {{name}}提现
        <img src="../assets/images/goon.png" />
      </div>
      <div class="list" v-on:click="Detailed(name)">
        {{name}}明细
        <img src="../assets/images/goon.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { post, get } from "@/api/global";
import Global from "@/api/global";
import url from "@/api/global";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      property: true,
      reward: true,
      jmoney: true,
      name: "",
      item: "",
      // 菜宝
      xProperty: "",
      // 菜金
      rewardMoney: "",
      // 金豆
      money: ""
    };
  },
  methods: {
    giving(name) {
      this.$router.replace({ path: "/Giving", query: { name: name } });
    },
    getname() {
      let mname = this.name;
      if (mname == "菜金") {
        this.property = false;
        this.jmoney = false;
      } else if (mname == "菜宝") {
        this.reward = false;
        this.jmoney = false;
      } else {
        this.property = false;
        this.reward = false;
      }
    },
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    Detailed: function(name) {
      this.$router.replace({ path: "/Detailcomponent", query: { name: name } });
    },
    turnout: function(name) {
      if (name == "菜宝") {
        this.$router.replace({ path: "/turnout", query: { name: name } });
      } else if (name == "金豆") {
        this.$router.replace({ path: "/Golbout", query: { name: name } });
      }
    },
    Withdrawal: function(name) {
      this.$router.replace({ path: "/Withdrawal", query: { name: name } });
    },
    increase: function() {},
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
    tryrefrch() {
      this.xProperty = Number(localStorage.getItem("xProperty"));
      this.money = Number(localStorage.getItem("money"));
    },
    refresh: function(name) {
      post(
         "/login/refreshUser?phone=" + localStorage.getItem("phone")
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
  },
  mounted() {
    this.name = this.$route.query.name;
    this.item = this.$route.query.item;
    this.xProperty = Number(localStorage.getItem("xProperty"));
    this.rewardMoney = localStorage.getItem("rewardMoney");
    this.money = Number(localStorage.getItem("money"));
    this.getname();
  },
  created() {
    this.refresh();
    this.tryrefrch();
  }
};
</script>
<style scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  font-size: 14px;
  align-items: center;
  cursor: pointer;
}
.head {
  background: none !important;
  cursor: pointer;
}
.topcon {
  width: 100%;
  height: 200px;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  cursor: pointer;
}
.list {
  width: 100%;
  height: 1.02rem;
  font-size: 0.32rem;
  display: flex;
  padding: 0 0.32rem;
  box-sizing: border-box;
  background-color: white;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.list img {
  width: 20px;
  cursor: pointer;
}
</style>
