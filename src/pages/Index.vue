<template>
  <div class="content con-index">
    <div class="head">众种菜园</div>
    <div class="bacimage">
      <div class="swiper-container">
        <IndexBanner />
      </div>
    </div>
    <div class="con">
      <div class="sapn">
        我的菜宝数量：
        <span style="font-size:16px;">{{xProperty}}个</span>
      </div>
      <div class="recharge" v-on:click="Recharge"></div>
    </div>
    <div class="title">
      <span class="select">请选择认种的礼包</span>
      <div class="rule" v-on:click="Rule">
        规则
        <div class="go_rule">
          <img src="../assets/images/go.png" alt />
        </div>
      </div>
    </div>
    <div style="clear:both"></div>
    <!-- 礼包 -->
    <div class="alllist">
      <ul class="list">
        <li v-for="(item,index) in goodsList" :key="item.id">
          <div class="back_img">
            <img :src="item.src" alt />
          </div>
          <div class="back_top">
            <div class="leftcon" v-on:click="Detail(item)">
              <div class="topcon">
                <img :src="item.pack_pic" />
              </div>
              <span>{{item.pack_name}}</span>
            </div>
            <div class="rightcon">
              <div class="caibao">
                <span class="figure">{{item.pack_price}}</span>菜宝
              </div>
              <div class="allbtn">
                <div class="add" @click="add(index,item)"></div>
                <div class="num">{{item.pack_num}}</div>
                <div class="reduce" @click="reduce(index,item)"></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div style="clear:both"></div>
      <!-- <div class="creat_btn" v-if="isUpdate=false">
        <div class="upgrade" v-on:click="Level" v-show="isUpdate">补差升级</div>
        <div class="sure-l" @click="createOrder(totalNum,totalPrice)">确定 {{totalNum}}份</div>
      </div>-->
      <div class="creat_btn" v-show="showquest">
        <div class="sure-m" @click="createOrder(totalNum,totalPrice)">确定 {{totalNum}}份</div>
      </div>
      <div class="creat_btn" v-show="showbc">
        <div class="upgrade" v-on:click="Level(senior)">补差升级</div>
        <div class="sure-l" @click="createOrder(totalNum,totalPrice)">确定 {{totalNum}}份</div>
      </div>

      <div class="passWordInput" :class="popupVisible ? 'show' : '' ">
        <div class="pwd_input">
          <!-- 提示 -->
          <div class="pwd_tips">
            <img src="../assets/images/img_cancel.png" alt @click="close" />
            <span class="please_input">请输入密码</span>
          </div>
          <!-- 输入密码 -->
          <div>
            <div class="passwords" id="one">
              <input
                type="password"
                maxlength="6"
                class="realInput"
                v-model="realInput"
                @focus="inInput"
                @blur="outInput"
                id="focusid"
                ref="input1"
              />
              <ul class="write-input" @click="getbackMoney">
                <li
                  v-for="(disInput2,index) in [1,2,3,4,5,6]"
                  :key="index"
                  :class="{pwd_blink:disInputs.length == index&&isBlink1 == true}"
                >
                  <span class="passWord" v-show="index < disInputs.length">*</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 忘记密码 -->
          <p v-show="warn" class="warning">为保证账号安全，密码错误5次，交易冻结，如忘记密码，请点击忘记交易密码进行修改</p>
          <div class="forget" @click="toForget">忘记密码？</div>
        </div>
      </div>
    </div>
    <!-- 密码冻结弹框 -->
    <div class="tishi" v-show="confirm">
      <div class="tishi_c">
        <div class="tishi_main">
          <div class="tishi_1">
            <img style="width: 70px;margin-top: 20px;" alt />
            <span style="font-size:18px;margin:10px 0 20px;color:#333333">交易密码冻结</span>
            <span
              style="font-size:15px;color:#333333;padding:0 20px;text-align:left;"
            >密码错误次数过多,为保证账号安全，交易被终止，请于12小时后重试，或联系官方确认身份</span>
          </div>
          <div class="tishi_2 clr">
            <!-- <span @click="no">取消转赠</span> -->
            <span @click="handleAnswer">确认</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部导航栏 -->
    <foot :index="index"></foot>
  </div>
</template>

<script>
import Swiper from "swiper";
import IndexBanner from "@/components/IndexBanner";
import Global from "@/api/global";
import { Popup } from "mint-ui";
import { post, get } from "@/api/global";
import { Toast } from "mint-ui";
// 弹窗
import { handleCofirm } from "@/api/confirm";
import md5 from "js-md5";
import crypto from "crypto";
// 底部导航栏
import foot from "../components/foot";
let list = [];
let goodsInfoList = [];
export default {
  created() {
    // this.getOrderList();
    let url = window.location.href;
    let start = url.indexOf("?code");
    let end = url.indexOf("#");
    if (start > -1) {
      window.location.replace(
        url.substring(0, start) + url.substring(end, url.length)
      );
    }
    // this.refresh();
    this.address = this.$route.query.addressItem;
    let type = localStorage.getItem("succ");
    if (type == 1) {
      this.createSucc();
      this.getList();
      localStorage.removeItem("isAdd");
      localStorage.removeItem("isPwd");
    }
    if (localStorage.getItem("phone")) {
      this.xProperty = Number(localStorage.getItem("xProperty"));
      if (this.xProperty > 0) {
        this.isUpdate = true;
      } else if (localStorage.getItem("level") == "菜国王") {
        this.isUpdate = false;
      }
    } else {
      this.xProperty = 0;
    }
    this.senior = localStorage.getItem("level");
    this.isUpgrade = localStorage.getItem("update");
    this.level_shoping = localStorage.getItem("level_num");
    if (this.isUpgrade == 0) {
      if (
        this.senior == "菜国王" ||
        this.senior == "游客" ||
        this.senior == "萌小青" ||
        this.level_shoping == 1 ||
        this.level_shoping == 2
      ) {
        this.showbc = false;
        this.showquest = true;
      } else {
        this.showquest = false;
        this.showbc = true;
      }
    } else {
      this.showquest = true;
    }
  },
  data() {
    return {
      promotion: "",
      passnum: "",
      confirm: false,
      popupVisible: false,
      url: Global.url,
      index: 1,
      goodsList: [],
      // 菜宝数量
      xProperty: "",
      address: [],
      senior: "",
      realInput: "",
      disInputs: [],
      src: "",
      inPwd: "",
      // 补差升级
      showquest: false,
      showbc: false,
      levelnum: "",
      isUpgrade: "",
      isBlink1: false,
      warn: false,
      orderList: [],
      user_level: [],
      docmHeight: document.documentElement.clientHeight, //默认屏幕高度
      showHeight: document.documentElement.clientHeight //实时屏幕高度
    };
  },

  methods: {
    // 认种列表
    // getOrderList: function() {
    //   get(
    //     this.url + "/goods/orderList?phone=" + localStorage.getItem("phone")
    //   ).then(resp => {
    //     this.orderList = resp.data;
    //     console.log(this.orderList);
    //     this.user_level = this.orderList[this.orderList.length - 1].packName;
    //     // console.log(this.user_level)
    //     if (this.isUpgrade == 0) {
    //       if (
    //         this.senior == "菜国王" ||
    //         this.senior == "游客" ||
    //         this.user_level == "萌小青礼包"
    //       ) {
    //         this.showbc = false;
    //         this.showquest = true;
    //       } else {
    //         this.showquest = false;
    //         this.showbc = true;
    //       }
    //     } else {
    //       this.showquest = true;
    //     }
    //   });
    // },
    handleAnswer: function() {
      this.confirm = !this.confirm;
    },
    // 关闭密码
    close: function() {
      this.realInput = "";

      this.popupVisible = false;
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        window.scrollTo(0, 0);
      }
    },
    // 忘记密码
    toForget: function() {
      this.$router.replace({ path: "/ForgetPwd" });
    },
    outInput() {},
    inInput() {
      window.scroll(0, document.body.clientHeight);
      var idObj = document.getElementById("focusid");

      idObj.addEventListener("blur", function() {
        setTimeout(function() {
          window.scroll(0, document.body.clientHeight);
        }, 100);
      });
    },
    // 添加数量
    add: function(index, item) {
      if (localStorage.getItem("level_num")) {
        Toast("当前级别不能购买礼包");
      } else {
        if (item.id == 11) {
          // 萌小青礼包只能买一份
          if (this.goodsList[index].pack_num == 1) {
            Toast("此礼包限购一份");
          } else {
            this.goodsList[index].pack_num = 1;
            localStorage.setItem("first_status", "1");
          }
        } else {
          this.goodsList[index].pack_num++;
        }
      }
    },
    // 减
    reduce: function(index, item) {
      this.goodsList[index].pack_num != 0
        ? this.goodsList[index].pack_num--
        : "";
      if (item.id == 11) {
        if (this.goodsList[index].pack_num == 0) {
          localStorage.setItem("first_status", "0");
        }
      }
    },

    // 余额不足
    failDialog: function() {
      handleCofirm("菜宝数量不足", "请进行充值", "确认充值", "取消充值")
        .then(action => {
          if (action == "confirm") {
            this.$router.replace({ path: "/Recharge" });
          }
        })
        .catch(error => {
          if (error == "cancel") {
          }
        });
    },
    // 点击跳转充值页面
    Recharge: function() {
      if (localStorage.getItem("level_num")) {
        Toast("当前级别不能进行充值");
      } else {
        if (localStorage.getItem("phone")) {
          this.$router.replace({ path: "/Recharge" });
        } else {
          this.$router.replace({ path: "/Index" });
        }
      }
    },
    // 点击跳转认种规则页面
    Rule: function() {
      if (localStorage.getItem("phone")) {
        this.$router.replace({ path: "/Rule" });
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 跳转补差升级
    Level: function(senior) {
      this.$router.replace({ path: "/Level", query: { senior: senior } });
    },
    // 跳转详情页面
    Detail: function(item) {
      this.$router.replace({ path: "/Detail", query: { item: item } });
    },
    // 获取礼包列表
    getList: function() {
      let phone = "";
      if (localStorage.getItem("phone")) {
        phone = localStorage.getItem("phone");
      } else {
        phone = "99999999999";
      }
      get(this.url + "/goods/list?phone=" + phone)
        .then(resp => {
          this.goodsList = resp.data;
          for (var i = 0; i < this.goodsList.length; i++) {
            this.$set(this.goodsList[i], "pack_num", "0");
            if (this.goodsList[i].id == 11) {
              this.$set(
                this.goodsList[i],
                "src",
                require("../assets/images/one.png")
              );
            } else if (this.goodsList[i].id == 12) {
              this.$set(
                this.goodsList[i],
                "src",
                require("../assets/images/two.png")
              );
            } else if (this.goodsList[i].id == 13) {
              this.$set(
                this.goodsList[i],
                "src",
                require("../assets/images/three.png")
              );
            } else if (this.goodsList[i].id == 14) {
              this.$set(
                this.goodsList[i],
                "src",
                require("../assets/images/four.png")
              );
            } else if (this.goodsList[i].id == 15) {
              this.$set(
                this.goodsList[i],
                "src",
                require("../assets/images/five.png")
              );
            }
          }
        })
        .catch(err => {
          Toast("网络错误");
        });
    },
    //密码输入功能
    getbackMoney: function() {
      var idObj = document.getElementById("focusid");
      idObj.focus();
      this.isBlink1 = true;
      // window.scrollTo(0, 0);
    },
    // 校验密码
    refreshUserData: function() {
      post(this.url + "/base/comparePass", {
        phone: localStorage.getItem("phone"),
        token: localStorage.getItem("token"),
        pass: md5(this.realInput)
      })
        .then(resp => {
          if (resp.data.code == 100) {
            localStorage.setItem("readOnly", "1");
            this.$router.replace({
              path: "/Selectaddress",
              query: {
                totalPrice: localStorage.getItem("tp"),
                orderNum: localStorage.getItem("tn"),
                goodsInfoList: goodsInfoList
              }
            });
          }
        })
        .catch(err => {
          get(
            this.url + "/base/limittpnum?phone=" + localStorage.getItem("phone")
          ).then(resp => {
            // Toast("密码错误");
            // 效验密码错误次数
            list = [];
            goodsInfoList = [];
            this.popupVisible = false;
            this.passnum = resp.data;
            if (this.passnum > 0) {
              this.popupVisible = false;
              this.realInput = "";
            }
            if (this.passnum >= 3) {
              this.warn = true;
            }
            if (resp.data >= 5) {
              this.confirm = true;
            }
            return true;
          });
          setTimeout(function() {
            var idObj = document.getElementById("focusid");
            idObj.blur();
            window.scroll(0, 0);
            // this.close();
            Toast("密码错误");
          }, 300);
          this.getList();
        });
    },
    // 创建订单
    createOrder: function(totalNum, totalPrice) {
      list = [];
      goodsInfoList = [];
      localStorage.removeItem("tn");
      localStorage.removeItem("tp");
      if (localStorage.getItem("phone")) {
        if (totalNum > 0) {
          localStorage.setItem("tn", totalNum);
          localStorage.setItem("tp", totalPrice);
          for (var i in this.goodsList) {
            var obj = {};
            if (this.goodsList[i].pack_num > 0) {
              obj["packId"] = this.goodsList[i].id;
              obj["orderNum"] = this.goodsList[i].pack_num;
            }
            list.push(obj);
          }

          for (var i in list) {
            if (JSON.stringify(list[i]) !== "{}") {
              goodsInfoList.push(list[i]);
            }
          }

          // 判断余额是否充足
          if (totalPrice > this.xProperty) {
            this.failDialog();
          } else if (localStorage.getItem("pwd") == 1) {
            // 判断是否有密码
            this.succDialog();
          } else {
            this.$router.replace({
              path: "/pwd",
              query: {
                totalPrice: localStorage.getItem("tp"),
                orderNum: localStorage.getItem("tn"),
                goodsInfoList: goodsInfoList
              }
            });
          }
        } else {
          Toast("请选择认种礼包");
        }
      } else {
        this.$router.replace({ path: "/Index" });
      }
    },
    // 创建订单后弹窗
    succDialog: function() {
      var that = this;
      handleCofirm(
        "此过程消耗" + localStorage.getItem("tp") + "菜宝",
        "确认认种？",
        "确认认种",
        "取消认种"
      )
        .then(action => {
          if (action == "confirm") {
            // 输入交易密码
            // 密码输入
            this.popupVisible = true;
            this.inInput = true;
            var idObj = document.getElementById("focusid");
            idObj.focus();
            setTimeout(() => {
              window.scroll(0, that.docmHeight);
            }, 300);
          }
        })
        .catch(error => {
          if (error == "cancel") {
          }
        });
    },

    // 用户刷新
    refresh: function() {
      post(
        this.url + "/login/refreshUser?phone=" + localStorage.getItem("phone")
      ).then(resp => {
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
      });
    },
    // 认种成功提示
    createSucc: function() {
      Toast("认种成功");
      localStorage.setItem("readOnly", "0");
      localStorage.removeItem("succ");
    },
    hiddenBtn: function() {
      isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

      if (fn.isIOS) {
        window.history.pushState({}, "title", "#");
      }
    }
  },
  components: {
    IndexBanner,
    foot
  },
  mounted() {
    this.getList();
    this.hiddenBtn();
    new Swiper(".swiper-container", {
      autoplay: true,
      // 如果需要分页器
      pagination: ".swiper-pagination",
      // 如果需要前进后退按钮
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      // 如果需要滚动条
      scrollbar: ".swiper-scrollbar"
    });
  },
  watch: {
    realInput(newV, oldV) {
      this.disInputs = newV.split("");
      if (newV.length == 6) {
        this.refreshUserData();
      }
    }
  },
  computed: {
    totalNum: function() {
      var total = 0;
      for (var i = 0; i < this.goodsList.length; i++) {
        total += this.goodsList[i].pack_num / 1;
      }
      return total;
    },

    totalPrice: function() {
      var price = 0;
      for (var i = 0; i < this.goodsList.length; i++) {
        price +=
          ((this.goodsList[i].pack_num / 1) * this.goodsList[i].pack_price) / 1;
      }
      return price;
    }
  }
};
</script>


<style scoped>
@import "../style/pwd.css";
@media only screen and (max-width: 300px) and (min-height: 480px) {
  .content .recharge {
    width: 90px;
  }
}
@media only screen and (max-width: 300px) and (min-height: 568px) {
  .content .recharge {
    width: 90px;
  }
}
.head {
  width: 100%;
  height: 50px;
  background: #3d8141;
  color: #fff;
  line-height: 50px;
  cursor: pointer;
}
.swiper-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.swiper-container img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.add,
.reduce {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  cursor: pointer;
}
.add {
  background-image: url("../assets/images/add.png");
  box-shadow: 0px 14px 13px 1px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.reduce {
  background-image: url("../assets/images/reduce.png");
  cursor: pointer;
}
.content {
  font-size: 14px;
  cursor: pointer;
}
.bacimage {
  width: 94%;
  height: 162px;
  margin: 10px auto;
  cursor: pointer;
}
.bacimage img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.con {
  width: 94%;
  margin: 0 auto;
  background: linear-gradient(
    23deg,
    rgba(62, 130, 65, 1),
    rgba(98, 167, 105, 1)
  );
  border: 2px solid rgba(255, 212, 136, 1);
  box-shadow: 0px 5px 5px 1px rgba(0, 0, 0, 0.13),
    0px 3px 6px 0px rgba(0, 0, 0, 0.35);
  color: #fff;
  height: 60px;
  line-height: 60px;
  text-align: left;
  cursor: pointer;
}
.sapn {
  margin-left: 3%;
  float: left;
  cursor: pointer;
}
.recharge {
  width: 93px;
  height: 30px;
  background-image: url("../assets/images/zu.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin-top: 15px;
  margin-right: 3%;
  float: right;
  cursor: pointer;
}
.title {
  width: 94%;
  color: #414141;
  margin: 20px auto;
  cursor: pointer;
}
.select {
  position: relative;
  top: -0.06rem;
  width: 50%;
  float: left;
  font-size: 18px;
  border-left: 3px solid #3d8141;
  text-align: left;
  padding-left: 10px;
  color: #333;
  cursor: pointer;
}
.rule {
  float: right;
  font-size: 16px;
  line-height: 0.32rem;
  cursor: pointer;
}
.go_rule {
  float: right;
  width: 0.16rem;
  height: 0.26rem;
  margin-left: 0.1rem;
  cursor: pointer;
}
.go_rule img {
  width: 100%;
  margin-top: 0.05rem;
  cursor: pointer;
}
.alllist {
  width: 100%;
  padding-bottom: 60px;
  padding-top: 10px;
  background: linear-gradient(
    0deg,
    rgba(200, 219, 201, 1),
    rgba(61, 129, 65, 1)
  );
  overflow: hidden;
  zoom: 1;
  margin-top: 10px;
  cursor: pointer;
}
/* 礼包列表 */
.list {
  margin: auto;
  margin: 10px 15px;
  cursor: pointer;
}
.list li {
  width: 100%;
  overflow: hidden;
  zoom: 1;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  padding-bottom: 8px;
}
.back_img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
.back_img img {
  width: 100%;
  height: 100%;
  border: 0;
  margin: 0;
  cursor: pointer;
}
.back_top {
  overflow: hidden;
  zoom: 1;
  cursor: pointer;
  position: relative;
}
.leftcon {
  width: 32%;
  float: left;
  font-weight: bold;
  font-size: 0.3rem;
  cursor: pointer;
  text-align: center;
}
.topcon {
  width: 1.4rem;
  height: 1.4rem;
  margin: 0 auto;
  z-index: 2;
  cursor: pointer;
}
.topcon img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.rightcon {
  width: 68%;
  float: left;
  cursor: pointer;
}
.caibao {
  line-height: 2rem;
  float: left;
  font-size: 0.28rem;
  color: #333;
  text-align: left;
  cursor: pointer;
}
.figure {
  margin-right: 0.1rem;
  color: #ffa200;
  font-weight: bold;
  font-size: 0.36rem;
  line-height: 1;
  cursor: pointer;
}
.allbtn {
  float: right;
  margin-top: 0.6rem;
  cursor: pointer;
}
.reduce {
  width: 0.56rem;
  height: 0.6rem;
  float: right;
  font-size: 20px;
  cursor: pointer;
}
.num {
  float: right;
  margin: 0 0.2rem 0;
  line-height: 0.6rem;
  text-align: center;
  height: 0.56rem;
  width: 1rem;
  text-align: center;
  border: 1px solid rgba(187, 187, 187, 1);
  border-radius: 2px;
  cursor: pointer;
}

.add {
  width: 0.56rem;
  height: 0.6rem;
  font-size: 18px;
  float: right;
  margin-right: 10px;
  box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
/* 创建订单按钮 */
.creat_btn {
  text-align: center;
  overflow: hidden;
  zoom: 1;
  margin: 0 0.3rem 0.4rem;
  cursor: pointer;
}
.upgrade,
.sure-l,
.sure-m {
  width: 2.8rem;
  height: 1rem;
  border-radius: 0.5rem;
  line-height: 1rem;
  cursor: pointer;
  font-size: 0.3rem;
}
.upgrade {
  float: left;
  background: #fff;
  color: #ffa200;
  cursor: pointer;
  margin: 0 0 0.2rem 0.2rem;
}
.sure-l {
  float: right;
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
  margin: 0 0.2rem 0.2rem 0;
}
.sure-m {
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
  margin: 0 0 0.2rem 2.05rem;
}
.tishi {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.tishi_c {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.6);
}
.tishi_main {
  width: 90%;
  height: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  /* margin-top: 50%; */
  background: #fff;
  border-radius: 8px;
  transform: translate(-50%, -50%);
}
.tishi_1 {
  display: flex;
  flex-direction: column;
  background: url() bottom center repeat-x;
}
.tishi_1 .del {
  position: absolute;
  top: 200px;
}
.tishi_2 {
  margin: 20px 0;
}
.tishi_1,
.tishi_2 span {
  width: 100%;
  height: auto;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  justify-content: center;
  align-items: center;
}
/* .tishi_2 span:nth-child(1) {
  width: 1.8rem;
  display: inline-block;
  line-height: 0.7rem;
  color: #999;
  background-color: #e9e9e9 !important;
  border-radius: 3px;
  margin-right: 0.47rem !important;
  cursor: pointer;
  font-size: 0.28rem;
} */
.tishi_2 span:nth-child(1) {
  /* border-left: 1px solid #cccccc; */
  display: inline-block;
  border-radius: 8px;
  color: rgb(1, 105, 163);
  width: 2rem;
  line-height: 0.8rem;
  color: #fff !important;
  background-image: url("../assets/images/confirm.png");
  /* margin-left: 0.4rem; */
  font-size: 0.28rem;
}
</style>
