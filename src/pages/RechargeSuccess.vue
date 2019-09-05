<template>
  <div class="content">
    <div class="head">
      <div class="head">
        <img class="cancelicon" src="../assets/images/cancel.png" @click="toPrev()">充值成功
      </div>
    </div>
    <div class="showimg">
      <img src="../assets/images/rechargesuccess.png">
    </div>
    <div class="info">恭喜你充值成功</div>
    <div class="btn" v-on:click="Index">去认种</div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post } from "@/api/global";
import { Toast } from "mint-ui";
export default {
  data(){
    return{
      url: Global.url,
    }
  },
  methods: {
    Index: function() {
      this.$router.replace({ path: "/" });
    },
    toPrev: function() {
      this.$router.replace({path:'/Recharge'});
    },
    // 用户刷新
    refresh: function() {
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
            // this.$router.replace({ path: "/RechargeSuccess" });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
  },
  mounted(){
    this.refresh()
  },
};
</script>
<style scoped>
.content {
  font-size: 14px;
  cursor: pointer;
}
.showimg {
  width: 150px;
  height: 126px;
  margin: 100px auto 10px auto;
  cursor: pointer;
}
.showimg img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.info {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  color: #3d8141;
  text-align: center;
  cursor: pointer;
}
.btn {
  width: 160px;
  height: 44px;
  line-height: 44px;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  border-radius: 30px;
  color: #fff;
  margin: 20px auto;
  cursor: pointer;
}
</style>
