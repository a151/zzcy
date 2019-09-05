<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />选择地址
    </div>
    <div class="nocon" v-if="false">
      <img src="../assets/images/noadd.png" style="margin-top:100px;margin-left:35%;width:30%" />
      <div class="tit">您暂时没有地址</div>
      <div class="bbtn" v-on:click="Addaddress">去添加地址</div>
    </div>
    <div class="havecon">
      <div class="remark" v-show="isMsg">必选！不选择无法认种成功！</div>
      <div class="alllist">
        <div
          class="list"
          v-for="item in addresslist"
          :key="item.id"
          :class="{back_color:isBg == item.id}"
        >
          <div class="leftcon" @click="choiceAddress(item)">
            <!-- 姓名 电话 -->
            <div class="title">
              {{item.emsName}}
              <span>{{item.emsPhone}}</span>
            </div>
            <!-- 地址 -->
            <div class="address">
              <div class="default" v-if="item.isDefault == 1">默认</div>
              {{item.emsProvince}} {{item.emsCity}} {{item.emsDistrict}} {{item.emsAddress}}
            </div>
          </div>
          <div class="rightcon">
            <img src="../assets/images/edit.png" v-on:click="Editaddress(item)" :data-id="item.id" />
          </div>
          <div style="clear: both"></div>
        </div>
      </div>
      <div class="add" v-on:click="Addaddress">添加新地址</div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { setTimeout, clearTimeout, clearInterval } from "timers";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isMsg: false,
      url: Global.url,
      addresslist: [],
      phone: "",
      nocon: true,
      isBg: 0,
      msg: "",
      upgrade: "",
      packId: 0
    };
  },
  methods: {
    // 点击添加页面
    Addaddress: function() {
      this.$router.replace({ path: "/Addaddress", query: { msg: this.msg } });
    },
    // 点击编辑页面
    Editaddress: function(item) {
      this.$router.replace({
        path: "/Editaddress",
        query: { item: item, msg: this.msg }
      });
    },
    Cancel: function() {
      if (this.msg.orderNum > 0) {
        this.$router.replace({ path: "/" });
      } else {
        this.$router.replace({ path: "/Personal" });
      }
    },
    // 地址列表
    getList: function() {
      var phone = localStorage.getItem("phone");
      get(this.url + "/ems/list?phone=" + phone)
        .then(resp => {
          if (resp.code == 100) {
            this.addresslist = resp.data;
          }
        })
        .catch(err => {
          if (err.code == 995) {
            this.$router.replace({
              path: "/Addaddress",
              query: { msg: this.msg }
            });
          }
        });
    },
    // 选择地址
    // 创建订单
    choiceAddress: function(item) {
      var level_name = localStorage.getItem("level");
      if (level_name == "萌小青") {
        if (this.packId == 12) {
          this.upgrade = 2;
        } else if (this.packId == 13) {
          this.upgrade = 3;
        } else if (this.packId == 14) {
          this.upgrade = 4;
        } else if (this.packId == 15) {
          this.upgrade = 5;
        }
        post(this.url + "/user/isUpgrade", {
          level: this.upgrade,
          phone: localStorage.getItem("phone"),
          token: localStorage.getItem("token")
        })
          .then(resp => {
            Toast("升级成功");
            this.refresh();
          })
          .catch(err => {
            Toast(err.msg);
          });
        return true;
      } else {
        localStorage.removeItem("tn");
        localStorage.removeItem("tp");
        var readOnly = localStorage.getItem("readOnly");
        if (readOnly == 1) {
          this.isBg = item.id;
          post(this.url + "/goods/create", {
            address: item.emsAddress,
            city: item.emsCityCode,
            createTime: "",
            district: item.emsDistrictCode,
            goodsInfoList: this.msg.goodsInfoList,
            invitorPhone: localStorage.getItem("tel"),
            name: item.emsName,
            phone: localStorage.getItem("phone"),
            province: item.emsProvinceCode,
            token: localStorage.getItem("token"),
            totalPrice: this.msg.totalPrice
          })
            .then(resp => {
              this.refresh();
            })
            .catch(err => {
              Toast(err.msg);
            });
        }
      }
    },
    // 用户刷新
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
            localStorage.setItem("first_status", "0");
            localStorage.setItem("succ", 1);
            this.$router.replace({ path: "/" });
          }
        })
        .catch(err => {
          Toast(err.msg);
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
    }
  },
  mounted() {},
  created() {
    this.getList();
    if (this.$route.query.id) {
      this.msg = this.$route.query.msg;
    } else {
      this.msg = this.$route.query;
    }
    if (this.msg.orderNum > 0) {
      this.isMsg = false;
    }
    this.packId = this.msg.goodsInfoList[0].packId;
  }
};
</script>
<style scoped>
.content {
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}
.tit {
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.bbtn {
  width: 160px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  margin: 10px auto;
  border-radius: 30px;
  cursor: pointer;
}
.remark {
  width: 94%;
  height: 40px;
  line-height: 40px;
  color: red;
  margin-left: 3%;
  font-size: 12px;
  margin-bottom: 5px;
  cursor: pointer;
}
.alllist {
  width: 94%;
  margin-left: 3%;
  margin-bottom: 0.72rem;
  cursor: pointer;
}
.list {
  border-bottom: 1px solid #eaeaea;
  line-height: 62px;
  overflow: hidden;
  zoom: 1;
  cursor: pointer;
}
.leftcon {
  width: 80%;
  float: left;
  padding: 15px 0 13px 0;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
}
.back_color {
  background-color: #ededed;
  cursor: pointer;
}
/* 姓名 电话 */
.title {
  height: 16px;
  width: 100%;
  line-height: 16px;
  font-size: 16px;
  cursor: pointer;
}
.title span {
  font-size: 14px;
  color: #666;
  margin-left: 3%;
  cursor: pointer;
}
/* 地址 */
.address {
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 20px;
  font-size: 15px;
  cursor: pointer;
  color: #333;
}
/* 是否默认 */
.default {
  color: #3d8141;
  padding: 0 0.06rem;
  margin-right: 5px;
  background: #d8e6d9;
  float: left;
  font-size: 0.26rem;
  cursor: pointer;
  line-height: 0.36rem;
}
.rightcon {
  float: right;
  margin-top: 21px;
  border-left: 1px solid #eaeaea;
  padding-left: 20px;
  height: 29px;
  line-height: 29px;
  cursor: pointer;
}
.add {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 16px;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  position: fixed;
  bottom: 0;
  text-align: center;
  cursor: pointer;
}
</style>
