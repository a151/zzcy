<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />我的菜友
    </div>
    <!--搜索框-->
    <div class="bkgrd">
      <div class="text-input">
        <i class="icon-user"></i>
        <input
          type="text"
          class="searchtext"
          placeholder="搜索"
          v-model="find"
          @input="specifiName($event)"
        />
      </div>
      <div class="button">
        <p @click="search">搜索</p>
      </div>
      <div class="type">
        <span class="text_l">全部</span>
        <span class="text_r">菜友总人数:&nbsp;{{addresslist.length}}人</span>
      </div>
    </div>
    <!--没有搜索结果-->
    <div class="box" v-show="xpeople">
      <img src="../assets/images/td.png" />
      <p>暂时没有搜索结果</p>
    </div>
    <!-- 暂无团队 -->
    <div class="box" v-show="nopeople">
      <img src="../assets/images/td.png" />
      <p>您暂时还没有菜友</p>
    </div>

    <!--菜友列表-->
    <div class="tabulation" v-for="infor in addresslist" :key="infor.id">
      <img v-bind:src="infor.headImg" class="sculptrue" v-if="infor.headImg != ''"/>
      <img src="../assets/images/mineHeader.png" class="sculptrue" v-else/>
      <div class="information">
        <span class="nickname">{{infor.nickName}}</span>&nbsp;
        <!-- <div class="grade" :style="background=color">{{infor.level}}</div> -->
        <div class="grade" :style="{background:infor.rewardMoney}">{{infor.level}}</div>
        <br />
        <span class="phone">手机号:&nbsp;{{infor.phone}}</span>
        <p class="invitorName">推荐人:&nbsp;{{infor.invitorName}}</p>
        <p class="createTime">{{infor.createTime | date}}</p>
      </div>

      <div class="way">
        <span>来源:</span>
      </div>
      <div>
        <img src="../assets/images/qricon.png" class="qrcode" />
      </div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Toast } from "mint-ui";
export default {
  created() {
    this.getList();
  },
  data() {
    return {
      nopeople: false,
      url: Global.url,
      addresslist: [],
      find: "",
      color: "",
      xpeople: false
      // level_num: "",
    };
  },
  methods: {
    search() {
      if (this.find == "") {
        Toast("内容不能为空");
      } else {
        this.findPeople();
      }
    },
    findPeople() {
      get(
        this.url +
          "/user/team?phone=" +
          localStorage.getItem("phone") +
          "&content=" +
          this.find
      )
        .then(resp => {
          this.addresslist = resp.data.list;
          if (this.addresslist.length == 0) {
            this.xpeople = true;
            // this.
          } else {
            let levelName = {
              0: "游客",
              1: "萌小青",
              2: "油菜侠",
              3: "憨大臣",
              4: "俏皇后",
              5: "菜国王",
              98: "城市召集人",
              99: "区县服务商"
            };
            let levelColor = {
              游客: "#999999",
              萌小青: "#AB9CFC",
              油菜侠: "#FBB92B",
              憨大臣: "#72BCFD",
              俏皇后: "#6ED774",
              菜国王: "#3EB94E",
              城市召集人: "#3D8141",
              区县服务商: "#FF8828"
            };
            for (const item of resp.data.list) {
              item.level = levelName[item.level];
              item.rewardMoney = levelColor[item.level];
            }
          }
        })
        .catch(err => {
          // this.
        });
    },
    specifiName: function(e) {
      var val = e.target.value;
      if (val == "") {
        this.xpeople = false;
        this.getList();
      }
    },
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
          // Toast(err.msg);
        });
    },
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    getList: function() {
      get(this.url + "/user/team?phone=" + localStorage.getItem("phone"))
        .then(resp => {
          this.addresslist = resp.data.list.reverse();
          // this.xpeople = false;
          let levelName = {
            0: "游客",
            1: "萌小青",
            2: "油菜侠",
            3: "憨大臣",
            4: "俏皇后",
            5: "菜国王",
            98: "城市召集人",
            99: "区县服务商"
          };
          let levelColor = {
            游客: "#999999",
            萌小青: "#AB9CFC",
            油菜侠: "#FBB92B",
            憨大臣: "#72BCFD",
            俏皇后: "#6ED774",
            菜国王: "#3EB94E",
            城市召集人: "#3D8141",
            区县服务商: "#FF8828"
          };
          // let imgnull = {"":'../assets/images/bactd.png'};
          for (const item of resp.data.list) {
            item.level = levelName[item.level];
            item.rewardMoney = levelColor[item.level];
            // item.headImg = imgnull[item.headimg];
          }
          // let newimg = this.addresslist.filter(item => {
          //   {
          //     return imgnull.includes(item.headImg);
          //   }
          // });
        })
        .catch(err => {
          this.nopeople = true;
        });
    },
  }
};
</script>
<style scoped>
p {
  margin: 0;
  padding: 0;
}
.bkgrd {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
  padding-top: 4%;
  color: #666767;
}
.text-input input {
  font-size: 0.28rem;
  display: inline-block;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-family: PingFang-SC-Regular;
  text-indent: 0.4rem;
  color: #333;
  padding-left: 0.15rem;
  float: left;
}
.icon-user {
  position: absolute;
  left: 6%;
  margin-top: 0.14rem;
  background-image: url("../assets/images/search.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 0.32rem;
  height: 0.32rem;
}
.searchtext {
  width: 76%;
  height: 0.6rem;
  border-radius: 6px;
  border: #d5d5d5 1px solid;
  margin-left: 4%;
  padding-left: 6%;
  font-size: 0.3rem;
}
.button {
  box-sizing: border-box;

  width: 14%;
  height: 0.6rem;
  line-height: 0.6rem;
  border-radius: 5px;
  font-size: 0.28rem;
  color: black;
  background-color: #fffefd;
  border: 1px solid #d5d5d5;
  float: right;
  margin-right: 4%;
}
.type {
  width: 100%;
  height: 0.4rem;
  margin: 0.8rem 0 0.3rem 0;
  font-size: 0.3rem;
}
.text_l {
  position: relative;
  right: 2.05rem;
}
.text_r {
  position: relative;
  left: 2.05rem;
}
.tabulation {
  display: flex;
  width: 96%;
  height: 2.2rem;
  border-bottom: 0.5px solid #d5d5d5;
  margin-left: 2%;
  margin-right: 2%;
  position: relative;
}
.sculptrue {
  width: 0.8rem;
  float: left;
  border-radius: 50%;
  margin: 0.7rem 0;
}
.information {
  width: 45%;
  float: left;
  text-align: left;
  margin: 0.15rem 0.3rem;
}
.nickname {
  font-size: 0.28rem;
}
.grade {
  font-size: 0.24rem;
  text-align: center;
  color: #fff;
  /* width: 0.9rem; */
  line-height: 0.38rem;
  background-color: red;
  border-radius: 5px;
  display: inline-block;
  padding: 0 4px;
  /* background-color: red; */
}
.phone {
  font-size: 0.3rem;
}
.invitorName {
  font-size: 0.28rem;
  color: #716c6c;
}
.createTime {
  font-size: 0.23rem;
  color: #a19c9c;
}
.way {
  font-size: 0.25rem;
  color: #a19c9c;
  height: 0.4rem;
  float: left;
  line-height: 0.4rem;
  margin-left: 1.3rem;
  margin-top: 0.9rem;
}
.qrcode {
  width: 0.38rem;
  margin-top: 0.9rem;
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
