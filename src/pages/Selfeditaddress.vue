<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(num)" src="../assets/images/cancel.png" />编辑地址
    </div>
    <div class="list" :data="list">
      <div class="info" prop>
        <div class="title">收货人：</div>
        <input class="inp" v-model="list.emsName" placeholder="请输入收货人姓名" />
        <div style="clear: both;"></div>
      </div>
      <div class="info">
        <div class="title">联系电话：</div>
        <input class="inp" v-model="list.emsPhone" placeholder="请输入收货人电话" />
        <div style="clear: both;"></div>
      </div>
      <div class="info">
        <div class="title">所在地区：</div>
        <input class="inp" v-model="MyAddress" placeholder="请选择所在地区" @click="showPopup" />
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
        <input class="inp" v-model="list.emsAddress" placeholder="请输入详细地址" />
        <div style="clear: both;"></div>
      </div>
      <div class="default">
        <img :src="isSure?src1:src2" class="icons" @click="agree()" />
        设为默认地址
      </div>
    </div>
    <div class="deletebtn" v-on:click="Delete(num)">删除</div>
    <div class="save" v-on:click="Save(num)">保存</div>
  </div>
</template>
<script>
import Global from "@/api/global";
import axios from "axios";
import { XAddress, Group, ChinaAddressV4Data } from "vux";
import { PopupPicker } from "vux";
import { Toast } from "mint-ui";
let cityId = "";
let districtId = "";
export default {
  data() {
    return {
      popupVisible: false,
      // 省份
      provinceList: [],
      // 市
      cityList: [],
      // 区
      districtList: [],
      list: [],
      isSure: false,
      src1: require("../assets/images/sure.png"),
      src2: require("../assets/images/agree.png"),

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
      num: "",
      frequ: "",
      number: 0
    };
  },

  methods: {
    // 唤醒地图
    showPopup: function() {
      this.MyAddress.splice(0, 3);
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
      this.MyAddress.push(value1.name, value2.name, value3.name);
    },
    onValuesChange: function(picker, values) {
      this.getCityArr(picker.getSlotValue(0).id);
      this.getCountyArr(picker.getSlotValue(1).id);
    },
    // 获取省份
    getProvinceArr: function() {
      let provinceList = [],
        that = this;
      axios.get(this.url + "/base/region?pid=0").then(resp => {
        that.provinceList = resp.data.data;
      });
    },
    // 市
    getCityArr: function(pid) {
      axios.get(this.url + "/base/region?pid=" + pid).then(resp => {
        this.cityList = resp.data.data;
      });
    },
    // 区
    getCountyArr: function(pid) {
      axios.get(Global.url + "/base/region?pid=" + pid).then(resp => {
        this.districtList = resp.data.data;
      });
    },
    // 是否为默认地址
    agree: function() {
      this.isSure = !this.isSure;
    },
    // 保存地址
    Save: function(num) {
      this.isDefault = this.isSure ? 0 : 1;
      if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.list.emsPhone)) {
        axios
          .post(this.url + "/ems/edit", {
            id: this.list.id,
            emsName: this.list.emsName,
            emsPhone: this.list.emsPhone,
            emsAddress: this.list.emsAddress,
            emsProvince: this.list.emsProvinceCode,
            emsCity: this.list.emsCityCode,
            emsDistrict: this.list.emsDistrictCode,
            isDefault: this.isDefault,
            phone: localStorage.getItem("phone"),
            token: localStorage.getItem("token")
          })
          .then(resp => {
            this.addressList = resp.data.data;
            this.$router.replace({
              path: "/Selfaddress",
              query: { name: num }
            });
          });
      } else {
        Toast("请输入正确的手机号");
      }
    },
    // 点击删除
    Delete: function(num) {
      axios
        .post(this.url + "/ems/del?id=" + this.list.id)
        .then(resp => {
          if (resp.data.code == 100) {
            Toast("删除成功");
            this.$router.replace({
              path: "/SubmitOrder",
              query: { name: num }
            });
          }
        })
        .catch(err => {
          Toast(err.data.msg);
        });
    },
    // 点击返回
    Cancel: function(num) {
      this.$router.replace({ path: "/Selfaddress", query: { name: num } });
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
  mounted() {
    this.list = this.$route.query.item;
    this.isSure = this.list.isDefault == 0 ? true : false;
    this.MyAddress.push(
      this.list.emsProvince,
      this.list.emsCity,
      this.list.emsDistrict
    );
    this.msg = this.$route.query.msg;
  },
  created() {
    this.getProvinceArr();
    this.num = this.$route.query.name;
    this.frequ = this.$route.query.frequ;
  }
};
</script>
<style scoped>
.content {
  font-size: 14px;
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  background: #f8f8f8;
  cursor: pointer;
}
.list {
  width: 100%;
  padding-top: 40px;
  background: #fff;
  text-align: left;
  padding-bottom: 10px;
  cursor: pointer;
}
.info {
  width: 94%;
  margin: 5px auto;
  height: 40px;
  line-height: 40px;
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
  height: 30px;
  cursor: pointer;
}
/* placeholder颜色 */
.inp::-webkit-input-placeholder {
  color: #999;
}

.inp::-moz-placeholder {
  color: #999;
}

.inp:-moz-placeholder {
  color: #999;
}

.inp:-ms-input-placeholder {
  color: #999;
}
.default {
  width: 94%;
  margin: 10px auto;
  margin-top: 28px;
  cursor: pointer;
}
.default img {
  position: relative;
  top: 5px;
  margin-right: 2%;
  cursor: pointer;
}
.deletebtn {
  width: 100%;
  background: #fff;
  margin-top: 20px;
  color: red;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.save {
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 40px;
  line-height: 40px;
  color: #fff;
  background: linear-gradient(to right, #3e8241, #4f9354, #65a96c);
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
/* 取消 */
.title_l {
  float: left;
  color: #828282;
  cursor: pointer;
}
/*  确定 */
.title_r {
  float: right;
  margin-right: 0.8rem;
  cursor: pointer;
}
</style>
