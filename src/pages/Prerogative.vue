<template>
  <div class="content">
    <div class="topcon">
      <div class="head">
        <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />我的特权
      </div>
      <!-- 人物信息 -->
      <div class="person_msg">
        <div class="person">
          <div class="photo">
            <img :src="headImg" />
          </div>
          <div class="name">
            <div class="title">{{address}}&nbsp;{{nickName}}</div>
            <div class="remark" v-on:click="Rule">
              <p class="remark_name">{{level}}></p>
            </div>
          </div>
        </div>

        <!-- 进阶 -->
        <!-- <div class="level" v-show="isShow"> -->
        <!-- 人数 -->
        <!-- 进度条 -->
        <!-- <div class="line"> -->
        <!-- <div class="line_l"></div> -->
        <!-- <div class="line_r"></div> -->
        <!-- </div> -->
        <!-- 等级名称 -->
        <!-- <div class="level_name"> -->
        <!-- <span class="low">{{level}}</span> -->
        <!-- <span class="next">{{nextLevel}}</span> -->
        <!-- </div> -->
        <!-- </div> -->
        <mt-progress :value="shareInt*10" :bar-height="5" v-show="isShow" class="progress"></mt-progress>
        <div class="people_num" :style="{left:left}" v-show="isShow">{{shareInt}}人</div>
        <div class="level_name" v-show="isShow">
          <span class="low">{{level}}</span>
          <span class="next">{{nextLevel}}</span>
        </div>
      </div>
    </div>
    <div class="list" @click="toRule('认种会员')">
      <div class="list_box">
        认种会员
        <img src="../assets/images/next.png" />
      </div>
    </div>
    <div class="list" @click="toRule('社区合伙人')">
      <div class="list_box">
        社区合伙人
        <img src="../assets/images/next.png" />
      </div>
    </div>
    <div class="list" @click="toRule('区县服务商')">
      <div class="list_box">
        区县服务商
        <img src="../assets/images/next.png" />
      </div>
    </div>
    <div class="list" @click="toRule('城市召集人')">
      <div class="list_box border_list">
        城市召集人
        <img src="../assets/images/next.png" />
      </div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Progress } from "mint-ui";
export default {
  data() {
    return {
      address: "",
      nickName: "",
      level: "",
      headImg: "",
      nextLevel: "",
      isShow: true,
      recogin: 0,
      shareInt: 0,
      // number: 0,
      url: Global.url,
      nextNum: "",
      left: 0
    };
  },
  created() {},
  methods: {
    // 用户升级
    upgrade: function() {
      if (this.shareInt >= 10) {
        post(this.url + "/user/isUpgrade", {
          level: this.nextNum,
          phone: localStorage.getItem("phone"),
          token: localStorage.getItem("token")
        })
          .then(resp => {
            // console.log(resp);
            this.refresh();
          })
          .catch(err => {});
      }
    },
    // 用户刷新
    refresh: function() {
      post(
        this.url + "/login/refreshUser?phone=" + localStorage.getItem("phone")
      )
        .then(resp => {
          consoloe.log(resp);
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
            localStorage.setItem("first_status", "0");
            this.$router.replace({ path: "/", query: { succ: 1 } });
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    // 角色规则页面
    Rule: function() {
      this.$router.replace({ path: "/RoleRule" });
    },
    // 特权规则页面
    toRule: function(name) {
      this.$router.replace({ path: "/PreRule", query: { name: name } });
    },
  },
  mounted() {
    this.address = localStorage.getItem("address");
    this.shareInt = localStorage.getItem("shareInt");
    // this.number = 1;
    // this.left = this.number * 31 + "px";
    this.left = this.shareInt * 31 + "px";
    this.nickName = localStorage.getItem("nick_name");
    this.level = localStorage.getItem("level");
    this.headImg = localStorage.getItem("headImg");
    // 召集人/服务商
    this.recogin = localStorage.getItem("level_num");
    if (this.level == "萌小青") {
      this.nextLevel = "游菜侠";
      this.nextNum = "2";
    } else if (this.level == "游菜侠") {
      this.nextLevel = "憨大臣";
      this.nextNum = "3";
    } else if (this.level == "憨大臣") {
      this.nextLevel = "俏皇后";
      this.nextNum = "4";
    } else if (this.level == "俏皇后") {
      this.nextLevel = "菜国王";
      this.nextNum = "5";
    }
    if (
      this.level == "游客" ||
      this.level == "菜国王" ||
      this.level == "萌小青" ||
      this.recogin == 1 ||
      this.recogin == 2
    ) {
      this.isShow = false;
    }
    this.upgrade();
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
}
.head {
  background: none !important;
  cursor: pointer;
}
.topcon {
  width: 100%;
  height: 200px;
  background: linear-gradient(to top, #3e8241, #4f9354, #65a96c);
  cursor: pointer;
}
/* 人物信息 */
.person_msg {
  height: 3rem;
}
.person {
  overflow: hidden;
  zoom: 1;
}
.title {
  font-size: 20px;
  cursor: pointer;
}
/* 用户头像 */
.photo {
  float: left;
  margin-left: 10%;
  margin-top: 10px;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  border-radius: 50%;
}
.photo img {
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 50%;
}
/* 昵称 */
.name {
  cursor: pointer;
  float: left;
  color: #fff;
  margin-left: 3%;
  margin-top: 10px;
  text-align: left;
  line-height: 30px;
}
/* 等级 */
.remark {
  background: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
/* 等级名称 */
.remark_name {
  padding: 0 0.3rem;
}
/* 进阶 */
.level {
  width: 100%;
  position: relative;
  cursor: pointer;
}
/* 人数 */
.people_num {
  margin-left: 16px;
  position: absolute;
  top: 2.5rem;
  width: 30px;
  height: 19px;
  background-image: url("../assets/images/pre.png");
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: contain;
  color: #fff;
  opacity: 0.7;
  font-size: 11px;
  line-height: 0.28rem;
  cursor: pointer;
}
/* 进度条 */
.line {
  width: 92%;
  height: 5px;
  margin: 42px 15px 0;
  cursor: pointer;
  border-radius: 2.5px;
  background-color: #589761;
}
/* 实际进度 */
.line_l {
  float: left;
  width: 32%;
  height: 5px;
  background-color: #7cbf85;
  cursor: pointer;
  border-radius: 2.5px;
}
/* 剩余进度 */
.line_r {
  float: right;
  width: 68%;
  height: 5px;
  cursor: pointer;
  border-radius: 2.5px;
}
/* 等级名称 */
.level_name {
  margin: 0 15px 0;
  font-size: 15px;
  cursor: pointer;
  overflow: hidden;
  color: #fff;
}
.low {
  float: left;

  cursor: pointer;
}
.next {
  float: right;
  /* color: #d97c00; */
  opacity: 0.7;
  cursor: pointer;
}
.list {
  width: 100%;
  overflow: hidden;
  zoom: 1;
  padding: 0 0.32rem;
  font-size: 0.32rem;
  background-color: white;
}
.list_box {
  height: 1.02rem;
  width: 92%;
  border-bottom: 1px solid #ddd;
  display: flex;
  box-sizing: border-box;
  color: #333;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.list img {
  width: 8px;
  cursor: pointer;
}
.border_list {
  border: none;
}
.progress {
  margin-left: 50%;
  margin-top: 14px;
  transform: translateX(-50%);
  width: 92%;
}
</style>
