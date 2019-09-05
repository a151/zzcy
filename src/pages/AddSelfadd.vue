<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(number)" src="../assets/images/cancel.png" />添加地址
    </div>
    <div class="list">
      <div class="info">
        <div class="title">收货人：</div>

        <input class="inp" v-model="emsname" placeholder="请输入收货人姓名" />
        <div style="clear: both;"></div>
      </div>
      <div class="info">
        <div class="title">联系电话：</div>
        <input class="inp" v-model="emsphone" maxlength="11" placeholder="请输入收货人电话" />
        <div style="clear: both;"></div>
      </div>
      <div class="info">
        <div class="title">所在地区：</div>
        <input class="inp" v-model="MyAddress" readonly placeholder="请选择所在地区" @click="showPopup" />
        <mt-popup v-model="popupVisible" position="bottom">
          <div class="pick_title">
            <span class="title_l" @click="caclePick">取消</span>
            <span class="title_r" @click="saveData">确定</span>
          </div>
          <mt-picker ref="pickCom" :slots="dataList" @change="onValuesChange" valueKey="name"></mt-picker>
        </mt-popup>

        <div style="clear: both;"></div>
      </div>
      <div class="info">
        <div class="title">详细地址：</div>
        <input class="inp" v-model="address" placeholder="请输入详细地址" />
        <div style="clear: both;"></div>
      </div>
      <div class="default">
        <img :src="isSure?src1:src2" class="icons" @click="agree()" />
        设为默认地址
      </div>
    </div>
    <div class="sure" v-on:click="Submit(number)">确定</div>
  </div>
</template>
<script>
import { XAddress, Group, ChinaAddressV4Data } from "vux";
import { PopupPicker } from "vux";
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Toast } from "mint-ui";
let cityId = "";
let districtId = "";
export default {
  data() {
    return {
      isMsg: false,
      popupVisible: false,
      // 省份
      provinceList: [],
      // 市
      cityList: [],
      // 区
      districtList: [],
      isSure: false,
      src1: require("../assets/images/sure.png"),
      src2: require("../assets/images/agree.png"),
      //
      emsname: "",
      emsphone: "",
      address: "",
      MyAddress: [],
      title: "",
      ChinaAddressV4Data: ChinaAddressV4Data,
      // 省份
      emsProvince: "",
      // 省份编码
      emsProvinceCode: "",
      // 市
      emsCity: "",
      // 市编码
      emsCityCode: "",
      // 区
      emsDistrict: "",
      // 区编码
      emsDistrictCode: "",
      isDefault: "",
      phone: "",
      token: "",
      url: Global.url,
      addressList: [],
      msg: "",
      num: 0,
      number: ""
    };
  },
  methods: {
    showPopup: function() {
      this.popupVisible = true;
    },
    // 取消地图
    caclePick: function() {
      let _this = this;
      _this.popupVisible = false;
    },
    // 确定地址
    saveData: function() {
      this.popupVisible = false;
      var value1 = this.$refs.pickCom.getSlotValue(0);
      var value2 = this.$refs.pickCom.getSlotValue(1);
      var value3 = this.$refs.pickCom.getSlotValue(2);
      this.emsProvinceCode = value1.id;
      this.emsCityCode = value2.id;
      this.emsDistrictCode = value3.id;
      var newArry = [];
      newArry.push(value1.name, value2.name, value3.name);
      this.MyAddress = newArry.toString();
    },
    onValuesChange: function(picker, values) {
      this.getCityArr(picker.getSlotValue(0).id);
      this.getCountyArr(picker.getSlotValue(1).id);
    },
    // 获取省份
    getProvinceArr: function() {
      let provinceList = [],
        that = this;
      get(this.url + "/base/region?pid=0").then(resp => {
        that.provinceList = resp.data;
      });
    },
    // 市
    getCityArr: function(pid) {
      get(this.url + "/base/region?pid=" + pid).then(resp => {
        this.cityList = resp.data;
      });
    },
    // 区
    getCountyArr: function(pid) {
      get(this.url + "/base/region?pid=" + pid).then(resp => {
        this.districtList = resp.data;
      });
    },
    // 是否为默认地址
    agree: function() {
      this.isSure = !this.isSure;
    },
    // 提交地址
    Submit: function(number) {
      this.num++;
      if (this.num == 1) {
        this.isDefault = this.isSure ? 0 : 1;
        if (!/^1[3456789]\d{9}$/.test(this.emsphone)) {
          Toast("请输入正确的手机号");
        } else {
          post(this.url + "/ems/add", {
            emsName: this.emsname,
            emsPhone: this.emsphone,
            emsAddress: this.address,
            emsProvince: this.emsProvinceCode,
            emsCity: this.emsCityCode,
            emsDistrict: this.emsDistrictCode,
            isDefault: this.isDefault,
            phone: localStorage.getItem("phone"),
            token: localStorage.getItem("token")
          })
            .then(resp => {
              if (resp.data.code == 100) {
                post(
                  this.url +
                    "/login/refreshUser?phone=" +
                    localStorage.getItem("phone")
                )
                  .then(resp => {
                    // this.addressList = resp.data.data;
                    // if (localStorage.getItem("isAdd")) {
                    //   this.choiceAddress();
                    // } else {
                    this.$router.replace({
                      path: "/Selfaddress",
                      query: { name: number }
                    });
                    // }
                  })
                  .catch(err => {
                    console.log(err);
                    Toast(err.msg);
                  });
              }
            })
            .catch(err => {
              console.log(err);
              Toast(err.msg);
            });
        }
      }
    },
    Cancel: function(number) {
      // this.$router.replace({ path: "/Selfaddress", query: { name: number } });
      this.$router.replace({ path: "/SubmitOrder", query: { name: number } });
    },
    //创建订单
    choiceAddress: function() {
      post(this.url + "/goods/create", {
        address: this.addressList.emsAddress,
        city: this.addressList.emsCityCode,
        createTime: "",
        district: this.addressList.emsDistrictCode,
        goodsInfoList: this.msg.goodsInfoList,
        invitorPhone: localStorage.getItem("tel"),
        name: this.addressList.emsName,
        phone: localStorage.getItem("phone"),
        province: this.addressList.emsProvinceCode,
        token: localStorage.getItem("token"),
        totalPrice: this.msg.totalPrice
      })
        .then(resp => {
          if (resp.data.code == 100) {
            this.refresh();
          }
        })
        .catch(err => {
          Toast(err.msg);
        });
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
            localStorage.setItem("first_status", "0");
            localStorage.removeItem("isAdd");
            this.$router.replace({ path: "/", query: { succ: 1 } });
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
  components: {
    XAddress,
    Group,
    PopupPicker
  },
  computed: {
    dataList: function() {
      let _this = this;
      _this.province = this.provinceList;
      _this.city = this.cityList;
      _this.district = this.districtList;
      let slots = [
        {
          flex: 1,
          values: this.province, //省份数组
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "",
          className: "slot2"
        },
        {
          flex: 1,
          values: this.city,
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "",
          className: "slot4"
        },
        {
          flex: 1,
          values: this.district,
          className: "slot5",
          textAlign: "center"
        }
      ];
      return slots;
    }
  },
  mounted() {},
  created() {
    this.getProvinceArr();
    this.number = this.$route.query.name;
    // this.msg = this.$route.query.msg;
    // if (this.msg.orderNum > 0) {
    //   this.isMsg = true;
    // }
    // if (this.msg.orderNum > 0) {
    //   localStorage.setItem("isAdd", "1");
    // } else {
    //   localStorage.removeItem("isAdd");
    // }
  }
};
</script>
<style scoped>
.content {
  font-size: 14px;
  text-align: left;
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
.list {
  width: 100%;
  background: #fff;
  text-align: left;
  padding-bottom: 10px;
  cursor: pointer;
}
.info {
  width: 94%;
  margin: 5px auto;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}
.title {
  width: 25%;
  float: left;
  font-size: 16px;
  cursor: pointer;
}
.inp {
  width: 75%;
  float: right;
  border-bottom: 1px solid #ededed !important;
  margin-top: 11px;
  height: 0.6rem;
  cursor: pointer;
  line-height: 0.6rem;
}

.inp::-webkit-input-placeholder {
  color: #999;
  font-size: 0.28rem;
  line-height: 0.6rem;
}

.inp::-moz-placeholder {
  color: #999;
  font-size: 0.28rem;
  line-height: 0.6rem;
}

.inp:-moz-placeholder {
  color: #999;
  font-size: 0.28rem;
  line-height: 0.6rem;
}

.inp:-ms-input-placeholder {
  color: #999;
  font-size: 0.28rem;
  line-height: 0.6rem;
}
.default {
  width: 94%;
  margin: 10px auto;
  cursor: pointer;
}
.default img {
  position: relative;
  top: 5px;
  margin-right: 2%;
  cursor: pointer;
}
.sure {
  width: 140px;
  height: 40px;
  line-height: 40px;
  border-radius: 30px;
  color: #fff;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
  margin: 0 auto;
  text-align: center;
  cursor: pointer;
}
/* 地址确定取消按钮 */
.pick_title {
  width: 100%;
  padding: 0 0.4rem;
  background-color: #fbf9fe;
  color: #f90;
  font-size: 16px;
  height: 50px;
  cursor: pointer;
}
.title_l {
  float: left;
  color: #828282;
  cursor: pointer;
}
.title_r {
  float: right;
  margin-right: 0.8rem;
  cursor: pointer;
}
</style>
