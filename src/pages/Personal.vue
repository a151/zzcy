<template>
  <div class="content">
    <div class="head">我的</div>
    <div class="main_container">
      <div class="topcon">
        <div class="bac" @click="toLogin">
          <div class="photo">
            <img :src="headImg" />
          </div>
          <div class="name" v-show="isLogin">
            <!-- <div class="title">{{address}}&nbsp;{{nickName}}</div> -->
            <div class="title">
              {{nickName}}
              <i v-if="false" @click="toEditInfo()" class="edit_info"></i>
            </div>
            <div class="remark" v-on:click="Rule">
              <p class="level_name">{{level}}></p>
            </div>
          </div>
          <!-- 未登录 -->
          <div class="no_login" v-show="isNo">未登录</div>
        </div>
        <div class="pcon">
          <div
            class="num"
            @click="Summary(item)"
            v-for="item in list"
            :key="item.index"
            :class="{border_right:item.index == 3}"
          >
            <div>{{item.index == 1?xProperty:item.index == 2?rewardMoney:money}}</div>
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="bottomcon">
        <div class="orderInfo">
          <div class="myOrders">
            <span class="myOrdersTittle">我的订单</span>
            <router-link :to="{path:'/OrderList',query: {state:0}}" exact class="checkAllOrder">
              <span>查看全部订单</span>
              <span class="go_rule">
                <img src="../assets/images/go.png" alt />
              </span>
            </router-link>
          </div>
          <ul class="orderUl">
            <li class="afterShipped">
              <router-link tag="div" :to="{path:'/OrderList',query: {state:1}}" exact>
                <img src="../assets/images/code/afterShipped_ico.png" />
                <span>待发货</span>
              </router-link>
            </li>
            <li class="distribution">
              <router-link tag="div" :to="{path:'/OrderList',query: {state:2}}" exact>
                <img src="../assets/images/code/distribution_ico.png" />
                <span>配送中</span>
              </router-link>
            </li>
            <li class="overShipped">
              <router-link tag="div" :to="{path:'/OrderList',query: {state:3}}" exact>
                <img src="../assets/images/code/overShipped_ico.png" />
                <span>已完成</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottomcon">
        <ul class="alllist">
          <li v-on:click="Team">
            <div class="img">
              <img src="../assets/images/myteam.png" />
            </div>
            <span>我的菜友</span>
          </li>
          <li v-on:click="TeamManage">
            <div class="img">
              <img src="../assets/images/myaddress.png" />
            </div>
            <span>销售业绩</span>
          </li>
          <li style="border-right:none;" v-on:click="Prerogative">
            <div class="img">
              <img src="../assets/images/myprivilege.png" />
            </div>
            <span>我的特权</span>
          </li>
          <li v-on:click="ShareCode">
            <div class="img">
              <img src="../assets/images/code.png" />
            </div>
            <span>二维码</span>
          </li>
          <li v-on:click="Recognition" v-if="recogin != null">
            <div class="img">
              <img src="../assets/images/Market.png" />
            </div>
            <span>市场分红</span>
          </li>
          <li v-on:click="Recognition" v-else>
            <div class="img">
              <img src="../assets/images/myrecognition.png" />
            </div>
            <span>我的认种</span>
          </li>
          <!-- <li style="border-right:none;" v-on:click="Selectaddress"> -->
          <li style="border-right:none;" v-on:click="Selectaddress">
            <div class="img">
              <img src="../assets/images/address.png" />
            </div>
            <span>我的地址</span>
          </li>
          <li style="border-bottom:none;" v-on:click="Sett">
            <div class="img">
              <img src="../assets/images/set.png" />
            </div>
            <span>设置</span>
          </li>
          <li style="border-bottom:none;" v-on:click="Dialog">
            <div class="img">
              <img src="../assets/images/contact.png" />
            </div>
            <span>联系我们</span>
          </li>
          <!-- <li style="border-bottom:none;"></li> -->
          <!-- <li style="border-bottom:none;border-right:none;"></li> -->
        </ul>
        <div style="clear: both"></div>
      </div>
    </div>
    <a href="tel:13764567708" v-show="tel">电话</a>
    <foot :index="index"></foot>
  </div>
</template>
<script>
import foot from "../components/foot";
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Toast } from "mint-ui";
import { Dialog } from "vant";
export default {
  created() {
    // this.nickName = localStorage.getItem("nick_name");
    this.address = localStorage.getItem("address");
    this.recogin = localStorage.getItem("level_num");
    if (localStorage.getItem("phone")) {
      this.headImg = localStorage.getItem("headImg");
      this.isLogin = true;
      this.isNo = false;
      this.refresh();
    } else {
      this.isNo = true;
      this.isLogin = false;
      this.xProperty = 0;
      this.rewardMoney = 0;
      this.money = 0;
      this.headImg = require("../assets/images/photo.png");
    }
  },
  data() {
    return {
      isLogin: false,
      isNo: true,
      isNo: 3,
      index: 4,
      // num: 0,
      list: [
        { index: 1, name: "菜宝" },
        { index: 2, name: "菜金" },
        { index: 3, name: "金豆" }
      ],
      // 用户头像
      headImg: "",
      // 用户等级
      level: "",
      // 用户昵称
      nickName: "",
      // 地址
      address: "",
      // 菜宝
      xProperty: "",
      // 菜金
      rewardMoney: "",
      // 金豆
      money: "",
      // 我的认种 市场分红
      recogin: "",
      // 服务商
      recoginmrk: false,
      recoginmgr: false,
      url: Global.url,
      tel: 15201295833
    };
  },
  methods: {
    Dialog() {
      Dialog.confirm({
        title: "15201295833",
        confirmButtonText: "拨打",
        confirmButtonColor: "#ffb22b",
        cancelButtonColor: "#ffb22b"
      })
        .then(() => {
          this.confirm();
        })
        .catch(() => {
          this.cancel();
        });
    },
    confirm() {
      window.location.href = "tel:" + this.tel;
    },
    cancel() {
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
            this.level = this.levelName;
            localStorage.setItem("phone", resp.data.data.phone);
            //  推荐人手机号
            localStorage.setItem("tel", resp.data.data.invitorUserPhone);
            // 地区
            localStorage.setItem("address", resp.data.data.address);
            localStorage.setItem("city", resp.data.data.city);
            localStorage.setItem("province", resp.data.data.province);
            //  用户头像
            localStorage.setItem("headImg", resp.data.data.headImg);
            this.headImg = resp.data.data.headImg;
            //  昵称
            localStorage.setItem("nick_name", resp.data.data.nickName);
            this.nickName = resp.data.data.nickName;
            // 是否手动升级
            localStorage.setItem("update", resp.data.data.isUpgrade);
            // 金豆数量
            localStorage.setItem("money", resp.data.data.money);
            this.money = resp.data.data.money;
            // 菜宝数量
            localStorage.setItem("xProperty", resp.data.data.xProperty);
            this.xProperty = resp.data.data.xProperty;
            // 菜金数量
            localStorage.setItem("rewardMoney", resp.data.data.rewardMoney);
            this.rewardMoney = resp.data.data.rewardMoney;
            // 己分享认种人数
            localStorage.setItem("shareInt", resp.data.data.shareInt);
            // 交易密码
            localStorage.setItem("pwd", resp.data.data.conPass);
            localStorage.setItem("uid", resp.data.data.uid);
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
    },
    // 角色规则
    Rule: function() {
      this.$router.replace({ path: "/RoleRule" });
    },
    toLogin: function() {
      if (localStorage.getItem("phone")) {
        // this.$router.replace({ path: "/Summary",query:{name:item.name} });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    Summary: function(item) {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/Summary", query: { name: item.name } });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    //跳转修改个人信息页
    toEditInfo: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/EditPersonalData" });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 二维码
    ShareCode: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/Code" });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 跳转地址
    Selectaddress: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/Selectaddress" });
      } else {
        // console.log(window.location.href);/
        this.$router.replace({ path: "/Index" });
      }
    },
    // 我的特权
    Prerogative: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/Prerogative" });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 团队管理奖
    TeamManage: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/TeamManage" });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 跳转团队页面
    Team: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/Team" });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 跳转首页
    Index: function() {
      this.$router.replace({ path: "/" });
    },
    // 跳转认种页面
    Recognition: function() {
      if (localStorage.getItem("phone")) {
        if (localStorage.getItem("level_num")) {
          this.$router.replace({ path: "/Market" });
        } else {
          this.$router.replace({ path: "/Recognition" });
        }
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 跳转设置页面
    Sett: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/Sett" });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    }
  },
  components: {
    foot
  },
  mounted() {}
};
</script>
<style scoped>
.content {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #f8f8f8;
  cursor: pointer;
  display: flex;
  -webkit-display: flex;
  flex-flow: column;
}
.bac {
  width: 100%;
  height: 120px;
  background: linear-gradient(to top, #3e8241, #4f9354);
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
  border-radius: 50%;
  cursor: pointer;
}
.name {
  cursor: pointer;
  float: left;
  color: #fff;
  margin-left: 3%;
  margin-top: 10px;
  text-align: left;
  line-height: 30px;
}
/* 未登录 */
.no_login {
  font-size: 0.4rem;
  color: #fff;
  overflow: hidden;
  line-height: 1;
  padding-top: 0.6rem;
  text-align: left;
  padding-left: 0.28rem;
  cursor: pointer;
}
.title {
  font-size: 0.38rem;
  cursor: pointer;
}
.remark {
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  width: auto;
}
/* 等级名称 */
.level_name {
  padding: 0 0.3rem;
}
.pcon {
  width: 94%;
  background: #fff;
  margin-top: -5%;
  margin-left: 3%;
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
}
.num {
  width: 33%;
  float: left;
  line-height: 10px;
  cursor: pointer;
  position: relative;
}
.num:after {
  position: absolute;
  right: 0;
  bottom: 0.1rem;
  content: "";
  width: 1px;
  height: 0.59rem;
  background-color: #e9e9e9;
}
.border_right:after {
  background-color: #fff;
}
.num div {
  height: 40px;
  color: #ffb22b;
  font-size: 16px;
  font-weight: bold;
  line-height: 40px;
  cursor: pointer;
}
.bottomcon {
  width: 94%;
  border-radius: 4px;
  margin: 10px auto;
  background: #fff;
  /* margin-bottom:60px; */
  cursor: pointer;
  overflow-y: auto;
  zoom: 1;
}
.alllist {
  overflow: hidden;
  zoom: 1;
  background: #fff;
}
.alllist li {
  width: 33%;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
  height: 100px;
  float: left;
  cursor: pointer;
}
.img {
  width: 0.7rem;
  height: 0.7rem;
  margin: 0 auto;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.2rem;
}
.img img {
  width: 100%;
}
.main_container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
}
.edit_info {
  display: inline-block;
  width: 0.25rem;
  height: 0.25rem;
  background: url("../../src/assets/images/code/editPerson_ico.png") no-repeat;
  background-size: 100% 100%;
}
.myOrders {
  display: flex;
  padding: 0.3rem 0;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f8f8f8;
}
.orderInfo {
  margin: 0 0.3rem;
}
.myOrdersTittle {
  -webkit-box-flex: 1;
  flex: 1;
  text-align: left;
  font-size: 0.32rem;
  font-weight: 400;
  color: #333333;
}
.checkAllOrder {
  -webkit-box-flex: 1;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
}
.checkAllOrder span {
  -webkit-box-flex: 1;
  flex: 1;
}
.checkAllOrder span:first-of-type {
  font-size: 0.28rem;
  color: #666666;
}
.go_rule {
  width: 0.16rem;
  height: 0.26rem;
  margin-left: 0.1rem;
  cursor: pointer;
}
.go_rule img {
  width: 0.16rem;
  height: 0.26rem;
  margin-top: 0.05rem;
  cursor: pointer;
}
.orderUl {
  display: flex;
  padding: 0.3rem 0;
  align-items: center;
  justify-content: space-around;
}
.orderUl li {
  -webkit-box-flex: 1;
  flex: 1;
}
.orderUl li span {
  display: block;
  font-size: 0.28rem;
  color: #333333;
}
.orderUl .afterShipped img {
  width: 0.5rem;
  height: 0.44rem;
}
.orderUl .distribution {
  flex-grow: 2;
}
.orderUl .distribution img {
  width: 0.56rem;
  height: 0.46rem;
}
.orderUl .overShipped img {
  width: 0.47rem;
  height: 0.47rem;
}
.edit_info {
  display: inline-block;
  width: 0.25rem;
  height: 0.25rem;
  background: url("../../src/assets/images/code/editPerson_ico.png") no-repeat;
  background-size: 100% 100%;
}
.van-dialog {
  width: 70%;
  border-radius: 8px;
}
</style>
