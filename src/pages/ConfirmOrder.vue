<template>
  <div class="content">
    <div class="head headEdit">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/backBlack_ico.png" />确认订单
    </div>
    <div class="goods_receiving_content">
      <div class="address_receiving" @click="selectAddress()">
        <div v-if="addressNone">
          <p class="personal_info">
            <span class="name">{{selectedAddress.name}}</span>
            <span class="phone">{{selectedAddress.tel}}</span>
          </p>
          <p class="address_txt">
            {{selectedAddress.address}}
          </p>
        </div>
        <div v-else class="no_default_address">
           <i class="address_pos"></i>
           <span>请新增收货地址</span>
        </div>
        <p>
           <span class="go_rule">
              <img src="../assets/images/go.png" alt />
           </span>
        </p>
      </div>
      <div>
        <ul>
          <li class="order_info_li">
            <div class="order_header">
              <a href="javascript:;" class="order-card__thumb">
                <div class="order-img">
                  <img :src="commodityData.goods_img"/>
                </div>
              </a>
              <div class="order-card__text">
                <a @click="toProduct()" href="javascript:;">
                  <p>{{commodityData.goods_name.length>35?commodityData.goods_name.substring(0,35)+'...':commodityData.goods_name}}</p>
                </a>
                <div class="order-card__num">
                  <p>
                    <span v-if="commodityData.channel == 23" class="order-pay__num">{{commodityData.goods_cj}}菜金</span>
                    <span v-else class="order-pay__num">{{commodityData.goods_cj}}菜金 + ¥{{commodityData.goods_surplusPrice}}</span>
                    <span>或 ¥{{commodityData.goods_totalPrice}}</span>
                  </p>
                  <span>x{{commodityData.goods_num}}</span>
                </div>
              </div>
            </div>
            <div class="statistics_pay top_border">
               <span>小计：</span>
               <span>￥{{(Number(commodityData.goods_totalPrice)*Number(commodityData.goods_num)).toFixed(2)}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="txt_content txt_content_edit">
        <p class="merchandise_subtotal " :class="{'bottom_border':commodityData.channel != 23}">
          <span>菜金（余额{{pay_cj}}） <em v-show="commodityData.channel == 23?!computedsData.isShow_cj:!computedsData.isShow_cj&&pay_cj == 0" class="deductible_cash">菜金不足，无法使用</em><em v-show="computedsData.isShow_cj&&selectDeducts.cj" class="deductible_cash">抵扣现金¥{{computedsData.deductCash_cj}}</em>
          </span>
          <i v-if="computedsData.isShow_cj" @click="selectDeduct('cj')"  class="checklist" :class="{'selected':selectDeducts.cj}"></i>
          <i v-else class="checklistNone"></i>
        </p>
        <p v-show="commodityData.channel != 23" class="bottom_border">
          <span>金豆（余额{{pay_jd}}）<em v-show="!computedsData.isShow_jd && pay_jd == 0" class="deductible_cash">金豆不足，无法使用</em><em v-show="computedsData.isShow_jd&&selectDeducts.jd" class="deductible_cash">抵扣现金¥{{computedsData.deductCash_jd}}</em></span>
          <i v-if="computedsData.isShow_jd" @click="selectDeduct('jd')" class="checklist" :class="{'selected':selectDeducts.jd}"></i>
          <i v-else class="checklistNone"></i>
        </p>
        <p v-show="commodityData.channel != 23">
          <span>菜宝（余额{{pay_cb}}）<em v-show="!computedsData.isShow_cb && pay_cb == 0" class="deductible_cash">菜宝不足，无法使用</em><em v-show="computedsData.isShow_cb&&selectDeducts.cb" class="deductible_cash">抵扣现金¥{{computedsData.deductCash_cb}}</em></span>
          <i v-if="computedsData.isShow_cb" @click="selectDeduct('cb')" class="checklist" :class="{'selected':selectDeducts.cb}"></i>
          <i v-else class="checklistNone"></i>
        </p>
      </div>
      <div class="txt_content">
        <p class="merchandise_subtotal merchandise_freight">
          <span>运费：<em>仅支持现金支付</em></span>
          <span class="merchandise_subtotal_money" v-show="freightPrice>0" >¥{{freightPrice}}</span>
          <span class="freight_no" v-show="!freightPrice">免运费</span>
        </p>
      </div>
      <div v-show="needPayPrice > 0" class="txt_content txt_content_edit">
        <p class="merchandise_subtotal bottom_border">
          <span>还需支付：</span>
          <span class="merchandise_subtotal_money">¥{{needPayPrice}}</span>
        </p>
        <p>
          <span class="order_pay"><i class="wx_pay"></i> <span>微信支付</span></span>
          <i @click="toPay('wx')" class="checklist" :class="{'selected':payment == 'wx'}"></i>
        </p>
        <p v-if="false">
          <span class="order_pay"><i class="ali_pay"></i> <span>支付宝支付</span></span>
          <i @click="toPay('ali')" class="checklist" :class="{'selected':payment == 'ali'}"></i>
        </p>
      </div>
    </div>
    <div class="to_payment">
       <p>
         <span>合计</span>
         <b>￥{{needPayPrice}}</b>
       </p>
       <a @click="placeAnOrder()" class="toPay" href="javascript:;">确认支付</a>
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
    <!--地址选择-->
    <van-popup
      v-model="show"
      position="right"
      :style="{ height: '100%',width:'100%' }"
    >
      <div class="head headEdit">
        <img class="cancelicon" v-on:click="backOrder()" src="../assets/images/backBlack_ico.png" />选择地址
      </div>
      <van-address-list
        v-model="chosenAddress.chosenAddressId"
        :list="chosenAddress.list"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelected"
      />
    </van-popup>
    <!--修改地址，新增地址-->
    <van-popup
      v-model="editAddress"
      position="right"
      :style="{ height: '100%',width:'100%' }"
    >
      <div class="head headEdit">
        <img class="cancelicon" v-on:click="backAddressList()" src="../assets/images/backBlack_ico.png" />修改地址
      </div>
      <div  class="van-address-edit">
        <div class="van-cell van-field">
          <div class="van-cell__title van-field__label">
            <span>姓名</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <input type="text" placeholder="收货人姓名" class="van-field__control" v-model="chosenAddress.emsname">
            </div>
          </div>
        </div>
        <div class="van-cell van-field">
          <div class="van-cell__title van-field__label">
            <span>电话</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <input type="tel" placeholder="收货人手机号" class="van-field__control" v-model="chosenAddress.emsphone">
            </div>
          </div>
        </div>
        <div class="van-cell van-field">
          <div class="van-cell__title van-field__label">
            <span>地区</span>
          </div>
          <div class="van-cell__value" @click="selectArea()">
            <div class="van-field__body">
              <input type="text" placeholder="选择省 / 市 / 区" readonly="readonly" class="van-field__control" v-model="chosenAddress.address">
            </div>
          </div>
        </div>
        <div class="van-cell van-address-edit-detail">
          <div class="van-cell__value van-cell__value--alone">
            <div class="van-cell van-field">
              <div class="van-cell__title van-field__label">
                <span>详细地址</span>
              </div>
              <div class="van-cell__value">
                <div class="van-field__body">
                  <textarea v-model="chosenAddress.detailedInfo" rows="1" maxlength="200" placeholder="街道门牌、楼层房间号等信息" class="van-field__control" style="height: 24px;">
                  </textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="van-cell van-cell--center van-switch-cell">
          <div class="van-cell__title">
            <span>设为默认收货地址</span>
          </div>
          <div class="van-cell__value">
            <van-switch v-model="chosenAddress.checked" />
          </div>
        </div>
        <div class="van-address-edit__buttons">
          <button @click="onSave()" class="van-button van-button--danger van-button--normal van-button--block">
            <span class="van-button__text">保存</span>
          </button>
          <button v-show="addressType == 2" @click="onDelete()" class="van-button van-button--default van-button--normal van-button--block">
            <span class="van-button__text">删除</span>
          </button>
        </div>
      </div>
      <mt-popup v-model="popupAddress" position="bottom">
        <div class="pick_title">
          <span class="title_l" @click="caclePick">取消</span>
          <span class="title_r" @click="saveData">确定</span>
        </div>
        <mt-picker ref="pickCom" :slots="dataList" @change="onValuesChange" valueKey="name"></mt-picker>
      </mt-popup>
    </van-popup>
    <van-loading v-show="loadings" color="#FD8402"/>
  </div>
</template>

<script>
    import { post, get } from "@/api/global";
    import { websiteUrl} from "@/api/global";
    import { receivingA } from "@/api/confirm";
    import { XAddress, Group, ChinaAddressV4Data } from "vux";
    import { PopupPicker } from "vux";
    import { AddressList,Popup,AddressEdit,Switch, Loading  } from 'vant';
    import { Toast } from 'vant';
    import md5 from "js-md5";
    export default {
        name: "ConfirmOrder",
        data() {
            return {
                openId:'',//微信openid
                addressNone: true,
                show:false,//地址弹窗
                editAddress:false,//修改地址弹窗
                addressType:0,//添加新地址1 或 修改地址 2
                popupAddress:false,//地址选择
                firstTime:true,
                loadings: false,//加载loading
                // 省份
                provinceList: [],
                // 市
                cityList: [],
                // 区
                districtList: [],
                chosenAddress:{
                    chosenAddressId:1,//选择id
                    list:[],//地址列表
                    searchResult: [],
                    id:'',
                    emsname:'',
                    emsphone:'',
                    address:'',
                    detailedInfo:'',
                    emsProvinceCode:'',
                    emsCityCode:'',
                    emsDistrictCode:'',
                    checked:false,//是否默认选中
                },
                selectedAddress:{
                    address: '',
                    addressTxt: '',
                    emsAddress: '',
                    emsCityCode: '',
                    emsDistrictCode: '',
                    emsProvinceCode: '',
                    id: '',
                    isDefault: '',
                    name: '',
                    tel: '',
                },
                confirm: false,
                popupVisible: false,
                passnum: "",
                realInput:'',//支付输入密码
                isBlink1: false,
                warn: false,//输入5次锁定密码
                disInputs: [],
                selectDeducts:{
                    cj:false,
                    jd:false,
                    cb:false
                },
                pay_cj:0,//菜金
                pay_jd:0,//金豆
                pay_cb:0,//菜宝
                payment:'', //支付宝，微信选择支付
                commodityData:{},//订单数据
                addressList:{},//默认地址
                totalPrice:0,//要支付的总价
                totalPriceCopy:0,//克隆要支付的总价
                freightPrice:0,//运费
                computedsData:{
                    isShow_cj:true,//菜金支付是否可以点击
                    isShow_jd:true,//金豆支付是否可以点击
                    isShow_cb:true,//菜宝支付是否可以点击
                    deductCash_cj:0,//抵扣菜金
                    deductCash_jd:0,//抵扣金豆
                    deductCash_cb:0,//抵扣菜宝
                    wx_ali_isShow:true,//微信，支付宝是否出现
                },
                needPayPrice:0,//最后需要支付金额
                cashType:'',// 支付类型 : 0其他1:微信2:支付宝
                orderSn:'',//支付订单返回id
                Undeliverable:true,//此地区是否可以送达
            };
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
                        values: this.cityList,
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
                        values: this.districtList,
                        className: "slot5",
                        textAlign: "center"
                    }
                ];
                return slots;
            }
        },
        methods: {
            Cancel: function() {
                this.$router.go(-1);
            },
            //返回订单详情页面
            backOrder(){
                this.show = false;
            },
            //返回地址列表
            backAddressList(){
                this.editAddress = false;
            },
            handleAnswer: function() {
                this.confirm = !this.confirm;
            },
            //刷新获取金豆等数量
            refresh(){
                post(
                     "/login/refreshUser?phone=" + localStorage.getItem("phone")
                ).then(res => {
                    if (res.data.code == 100&&res.data != '') {
                       this.pay_cj = res.data.data.rewardMoney;
                       this.pay_jd = res.data.data.money;
                       this.pay_cb = res.data.data.xProperty;
                       this.getAddressList();
                    }
                }).catch(err => {
                    let _this = this;
                    Toast(err.msg);
                    if (localStorage.getItem("phone")) {
                        // this.$router.replace({ path: "/Summary",query:{name:item.name} });
                    } else {
                        setTimeout(function () {
                            _this.$router.replace({ path: "/Index" });
                        },2000);
                    }
                });
            },
            //获取地址列表
            getAddressList(){
                get("/ems/list", {
                    phone:localStorage.getItem("phone"),
                }).then(res => {
                    if(res.code == 100&&res.data != ''){
                        let no_address = 0;
                        this.chosenAddress.list = [];
                        res.data.forEach((item,index) =>{
                            this.chosenAddress.list.push({
                                id: item.id,
                                name: item.emsName,
                                tel: item.emsPhone,
                                address: item.emsProvince +' ' + item.emsCity +' ' +  item.emsDistrict +' ' +  item.emsAddress,
                                addressTxt:item.emsProvince +',' + item.emsCity +',' +  item.emsDistrict ,
                                emsAddress:item.emsAddress,
                                emsProvinceCode:item.emsProvinceCode,
                                emsCityCode:item.emsCityCode,
                                emsDistrictCode:item.emsDistrictCode,
                                isDefault:item.isDefault
                            });
                           if(item.isDefault == 1){
                              no_address = 1;
                              this.selectedAddress.address =  item.emsProvince +' '+ item.emsCity +' '+ item.emsDistrict +' '+ item.emsAddress;
                              this.selectedAddress.emsAddress = item.emsAddress;
                              this.selectedAddress.emsCityCode = item.emsCityCode;
                              this.selectedAddress.emsDistrictCode = item.emsDistrictCode;
                              this.selectedAddress.emsProvinceCode = item.emsProvinceCode;
                              this.selectedAddress.id = item.id;
                              this.selectedAddress.isDefault = item.isDefault;
                              this.selectedAddress.name = item.emsName;
                              this.selectedAddress.tel = item.phone;
                              this.chosenAddress.chosenAddressId = item.id;
                           }
                        })
                        if(res.data.length == 0||no_address == 0){
                            this.addressNone = false;
                        }else {
                            this.addressNone = true;
                        }
                        if(this.commodityData.channel == 23){
                            this.freightPrice = 0;
                            this.comput();
                        }else {
                            this.getFreight();
                        }
                    }
                }).catch(error => {
                    if(error.code == 995){
                        this.chosenAddress.list = [];
                        this.addressNone = false;
                        this.freightPrice = 0;
                        this.comput();
                    }
                });
            },
            //添加地址
            onAdd() {
                this.editAddress = true;
                this.addressType = 1;
                this.chosenAddress.id = '';
                this.chosenAddress.emsname = '';
                this.chosenAddress.emsphone = '';
                this.chosenAddress.address = '';
                this.chosenAddress.detailedInfo = '';
                this.chosenAddress.emsProvinceCode = '';
                this.chosenAddress.emsCityCode = '';
                this.chosenAddress.emsDistrictCode = '';
            },
            //修改地址
            onEdit(item, index) {
                this.editAddress = true;
                this.addressType = 2;
                this.chosenAddress.id = item.id;
                this.chosenAddress.emsname = item.name;
                this.chosenAddress.emsphone = item.tel;
                this.chosenAddress.address = item.addressTxt;
                this.chosenAddress.detailedInfo = item.emsAddress;
                this.chosenAddress.emsProvinceCode = item.emsProvinceCode;
                this.chosenAddress.emsCityCode = item.emsCityCode;
                this.chosenAddress.emsDistrictCode = item.emsDistrictCode;
                this.chosenAddress.checked = item.isDefault ==1 ? true : false;

            },
            //保存地址
            onSave() {
                if(this.chosenAddress.emsname == ''){
                    Toast('姓名不能为空');
                    return;
                }
                if(this.chosenAddress.emsphone == ''){
                    Toast('手机号不能为空');
                    return;
                }
                if(this.chosenAddress.address == ''){
                    Toast('地区不能为空');
                    return;
                }
                if(this.chosenAddress.detailedInfo == ''){
                    Toast('详细地址不能为空');
                    return;
                }
                let type = this.addressType == 2? 'id:'+this.chosenAddress.id+',':'';
                this.isDefault = this.isSure ? 0 : 1;
                if (!/^1[3456789]\d{9}$/.test(this.chosenAddress.emsphone)) {
                    Toast("请输入正确的手机号");
                    return;
                } else {
                    if(this.addressType == 1){
                        post("/ems/add", {
                            emsName: this.chosenAddress.emsname,
                            emsPhone: this.chosenAddress.emsphone,
                            emsAddress: this.chosenAddress.detailedInfo,
                            emsProvince: this.chosenAddress.emsProvinceCode,
                            emsCity: this.chosenAddress.emsCityCode,
                            emsDistrict: this.chosenAddress.emsDistrictCode,
                            isDefault: this.chosenAddress.checked ? 1 : 0,
                            phone: localStorage.getItem("phone"),
                            token: localStorage.getItem("token")
                        }).then(resp => {
                            if (resp.data.code == 100) {
                                Toast('保存地址成功');
                                this.getAddressList()
                                this.editAddress = false;
                            }
                        }).catch(err => {
                            console.log(err);
                            Toast(err.msg);
                        });
                    }else if(this.addressType == 2){
                        post("/ems/edit", {
                            id:this.chosenAddress.id,
                            emsName: this.chosenAddress.emsname,
                            emsPhone: this.chosenAddress.emsphone,
                            emsAddress: this.chosenAddress.detailedInfo,
                            emsProvince: this.chosenAddress.emsProvinceCode,
                            emsCity: this.chosenAddress.emsCityCode,
                            emsDistrict: this.chosenAddress.emsDistrictCode,
                            isDefault: this.chosenAddress.checked ? 1 : 0,
                            phone: localStorage.getItem("phone"),
                            token: localStorage.getItem("token")
                        }).then(resp => {
                            if (resp.data.code == 100) {
                                Toast('保存地址成功');
                                this.getAddressList();
                                this.editAddress = false;
                            }
                        }).catch(err => {
                            console.log(err);
                            Toast(err.msg);
                        });

                    }
                }
            },
            //删除地址
            onDelete() {
                let postData = this.$qs.stringify({
                    id:this.chosenAddress.id
                });
                post("/ems/del",postData).then(resp => {
                    if (resp.data.code == 100) {
                        if(this.chosenAddress.chosenAddressId == this.chosenAddress.id ){
                            this.chosenAddress.chosenAddressId = '';
                            this.selectedAddress.id = '';
                        }
                        Toast('删除地址成功');
                        this.getAddressList();
                        this.editAddress = false;
                    }
                }).catch(err => {
                    console.log(err);
                    Toast('网络出错，删除失败')
                });
            },
            //选择选中地址
            onSelected(item, index){
                this.selectedAddress.address = item.address;
                this.selectedAddress.addressTxt = item.addressTxt;
                this.selectedAddress.emsAddress = item.emsAddress;
                this.selectedAddress.emsCityCode = item.emsCityCode;
                this.selectedAddress.emsDistrictCode = item.emsDistrictCode;
                this.selectedAddress.emsProvinceCode = item.emsProvinceCode;
                this.selectedAddress.id = item.id;
                this.selectedAddress.isDefault = item.isDefault;
                this.selectedAddress.name = item.name;
                this.selectedAddress.tel = item.tel;
                if(this.commodityData.channel == 23){
                    this.freightPrice = 0;
                    this.comput();
                }else {
                    this.getFreight();
                }
                this.show = false;
                this.addressNone = true;
            },
            //选择抵扣金额
            selectDeduct(type){
                if(type == 'cj'){
                    if(this.selectDeducts.cj){
                        this.selectDeducts.cj = false;
                        if(this.commodityData.channel == 23){
                            this.computedsData.wx_ali_isShow = true;
                            this.totalPrice = Number(this.totalPrice) + Number(this.computedsData.deductCash_cj);
                            this.computedsData.deductCash_cj = 0;
                            this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2)
                        }else {
                            this.totalPrice = Number(this.totalPrice) + Number(this.computedsData.deductCash_cj);
                            this.computedsData.deductCash_cj = 0
                        }
                        this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2)
                    }else {
                        this.selectDeducts.cj = true;
                        if(this.commodityData.channel == 23){
                           if(this.pay_cj > 0 && this.pay_cj > this.totalPrice){
                                this.computedsData.deductCash_cj = this.totalPrice;//抵扣金额
                                this.computedsData.isShow_cj = true;//是否可以抵扣菜金
                                if(this.freightPrice>0){
                                    this.computedsData.wx_ali_isShow = true;//微信，支付宝隐藏
                                }else {
                                    this.computedsData.wx_ali_isShow = false;//微信，支付宝隐藏
                                }
                               this.totalPrice = (Number(this.totalPrice) - Number(this.computedsData.deductCash_cj)).toFixed(2);
                               this.needPayPrice =  (Number(this.totalPrice) - Number(this.freightPrice)).toFixed(2)
                            }
                        }else {
                            //菜金使用
                            if(this.pay_cj > 0 && this.pay_cj < (this.totalPriceCopy)*0.1){
                                this.totalPrice = (Number(this.totalPrice) - Number(this.pay_cj)).toFixed(2);
                                this.computedsData.deductCash_cj = this.pay_cj.toFixed(2);
                            }else if(this.pay_cj > 0 && this.pay_cj == (this.totalPriceCopy)*0.1){
                                this.totalPrice = (Number(this.totalPrice) - Number(this.pay_cj)).toFixed(2);
                                this.computedsData.deductCash_cj = this.pay_cj.toFixed(2);
                            }else if(this.pay_cj > 0 && this.pay_cj > (this.totalPriceCopy)*0.1){
                                this.totalPrice = (Number(this.totalPrice) - Number((this.totalPriceCopy)*0.1)).toFixed(2);
                                this.computedsData.deductCash_cj = ((this.totalPriceCopy)*0.1).toFixed(2);
                            }
                            this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2)
                        }
                    }
                }else if(type == 'jd'){
                    if(this.selectDeducts.jd){
                        this.selectDeducts.jd = false;
                        if(this.commodityData.channel != 23){
                          if(this.pay_cj>0){
                              this.computedsData.isShow_cj = true;
                          }else {
                              this.computedsData.isShow_cj = false;
                          }
                            this.computedsData.isShow_cb = true;
                            this.totalPrice = Number(this.totalPrice) + Number(this.computedsData.deductCash_jd);
                            this.computedsData.deductCash_jd = 0
                            this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2)
                        }
                    }else {
                        this.selectDeducts.jd = true;
                        if(this.commodityData.channel != 23){
                            //金豆使用
                            if(this.pay_jd > 0 && this.pay_jd < this.totalPrice){
                                this.totalPrice = (Number(this.totalPrice) - Number(this.pay_jd)).toFixed(2);
                                this.computedsData.deductCash_jd = this.pay_jd.toFixed(2);
                            }else if(this.pay_jd > 0 && this.pay_jd == this.totalPrice){
                                this.computedsData.deductCash_jd = this.pay_jd.toFixed(2);
                                this.totalPrice = (Number(this.totalPrice) - Number(this.pay_jd)).toFixed(2);
                                if(!this.selectDeducts.cj){//等于0时菜金选中
                                   this.computedsData.isShow_cj = false;
                                }
                                if(!this.selectDeducts.cb){//等于0时菜金选中
                                    this.computedsData.isShow_cb = false;
                                }
                            }else if(this.pay_jd > 0 && this.pay_jd > this.totalPrice){
                                this.computedsData.deductCash_jd = this.totalPrice;
                                this.totalPrice = 0;
                                if(!this.selectDeducts.cj){//等于0时菜金选中
                                    this.computedsData.isShow_cj = false;
                                }
                                if(!this.selectDeducts.cb){//等于0时菜金选中
                                    this.computedsData.isShow_cb = false;
                                }
                            }
                            this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2)
                        }
                    }
                }else if(type == 'cb'){
                    if(this.selectDeducts.cb){
                        this.selectDeducts.cb = false;
                        if(this.commodityData.channel != 23){
                            if(this.pay_cj>0){
                                this.computedsData.isShow_cj = true;
                            }else {
                                this.computedsData.isShow_cj = false;
                            }
                            this.computedsData.isShow_jd = true;
                            this.totalPrice = Number(this.totalPrice) + Number(this.computedsData.deductCash_cb);
                            this.computedsData.deductCash_cb = 0;
                            this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2)
                        }
                    }else {
                        this.selectDeducts.cb = true;
                        if(this.commodityData.channel != 23){
                            //金豆使用
                            if(this.pay_cb > 0 && this.pay_cb < this.totalPrice){
                                this.totalPrice = (Number(this.totalPrice) - Number(this.pay_cb)).toFixed(2);
                                this.computedsData.deductCash_cb = this.pay_cb.toFixed(2);
                            }else if(this.pay_cb > 0 && this.pay_cb == this.totalPrice){
                                this.totalPrice = (Number(this.totalPrice) - Number(this.pay_cb)).toFixed(2);
                                this.computedsData.deductCash_cb = this.pay_cb.toFixed(2);
                                if(!this.selectDeducts.cj){//等于0时菜金选中
                                    this.computedsData.isShow_cj = false;
                                }
                                if(!this.selectDeducts.jd){//等于0时菜金选中
                                    this.computedsData.isShow_jd = false;
                                }
                            }else if(this.pay_cb > 0 && this.pay_cb > this.totalPrice){
                                this.computedsData.deductCash_cb = this.totalPrice;
                                this.totalPrice = 0;
                                if(!this.selectDeducts.cj){//等于0时菜金选中
                                    this.computedsData.isShow_cj = false;
                                }
                                if(!this.selectDeducts.jd){//等于0时菜金选中
                                    this.computedsData.isShow_jd = false;
                                }
                            }
                              this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2)
                        }

                    }
                }
            },
            //勾选计算
            comput(){
                if(this.commodityData.channel == 23){
                   if(this.firstTime){
                       if(this.pay_cj < this.totalPrice){
                           this.computedsData.isShow_cj = false;//是否可以抵扣菜金
                       }else if(this.pay_cj > 0&&this.pay_cj == this.totalPrice){//拥有菜金等于商品支付总价
                           this.computedsData.isShow_cj = true;//是否可以抵扣菜金
                       }else if(this.pay_cj > 0&&this.pay_cj > this.totalPrice){
                           this.computedsData.isShow_cj = true;//是否可以抵扣菜金
                       }
                   }
                    this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2);
                }else {
                    if(this.firstTime){
                        if(this.pay_cj == 0){
                            this.computedsData.isShow_cj = false;//是否可以抵扣菜金
                        }
                        if(this.pay_jd == 0){
                            this.computedsData.isShow_jd = false;//是否可以抵扣菜金
                        }
                        if(this.pay_cb == 0){
                            this.computedsData.isShow_cb = false;//是否可以抵扣菜金
                        }
                    }

                    this.needPayPrice =  (Number(this.totalPrice) + Number(this.freightPrice)).toFixed(2);
                    if(this.pay_cj>0&&this.firstTime){
                        this.selectDeduct('cj');
                    }
                }
                this.firstTime = false;
            },
            //获取运费
            getFreight(){
                let postData = this.$qs.stringify({
                    phone:localStorage.getItem("phone"),
                    address:this.selectedAddress.id,
                    itemNum:this.commodityData.goods_num,
                    itemId:this.commodityData.itemId,
                });
                post("/mallorder/shipTemplate", postData).then(res => {
                    if(res.data.code == 100){
                        this.freightPrice = res.data.data.freight;
                        this.Undeliverable = true;
                        this.comput();
                    }
                }).catch(error => {
                    if(error.code == 993){
                        Toast('此地区不能送达！');
                        this.Undeliverable = false;
                    }else {
                        this.comput();
                    }
                });
            },
            //选择地区
            selectAddress(){
                this.show = true;
            },
            //微信，支付宝选择
            toPay(type){
                if(this.payment == type){
                    this.payment = '';
                    this.cashType = 0;
                }else {
                    if(type == 'wx'){
                        if( (Number(this.computedsData.deductCash_jd)+Number(this.computedsData.deductCash_cb)+Number(this.computedsData.deductCash_cj)) >0 ){
                            this.cashType = 0;
                        }else {
                            this.cashType = 1;
                        }

                    }else if(type == 'ali'){
                        this.cashType = 2;
                    }
                    this.payment = type;
                }
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
                this.$router.push({ path: "/ForgetPwd" });
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
                post("/base/comparePass", {
                    phone: localStorage.getItem("phone"),
                    token: localStorage.getItem("token"),
                    pass: md5(this.realInput)
                }).then(resp => {
                        if (resp.data.code == 100) {
                           this.requestOrderModel(this.totalPriceCopy);
                        }
                    })
                    .catch(err => {
                        get(
                            "/base/limittpnum?phone=" + localStorage.getItem("phone")
                        ).then(resp => {
                            // Toast("密码错误");
                            // 效验密码错误次数
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
                    });
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
            //选择地址
            // 获取省份
            getProvinceArr: function() {
                let provinceList = [],
                    that = this;
                get( "/base/region?pid=0").then(resp => {
                    that.provinceList = resp.data;
                   this.getCityArr(resp.data[0].id)
                    setTimeout(function () {
                        that.getCountyArr(that.cityList[0].id)
                    },1000)
                });
            },
            // 市
            getCityArr: function(pid) {
                get( "/base/region?pid=" + pid).then(resp => {
                    this.cityList = resp.data;
                });
            },
            // 区
            getCountyArr: function(pid) {
                get("/base/region?pid=" + pid).then(resp => {
                    this.districtList = resp.data;
                });
            },
            onValuesChange: function(picker, values) {
                this.getCityArr(picker.getSlotValue(0).id);
                this.getCountyArr(picker.getSlotValue(1).id);
            },
            // 取消地图
            caclePick: function() {
                let _this = this;
                _this.popupAddress = false;
            },
            // 确定地址
            saveData: function() {
                this.popupAddress = false;
                var value1 = this.$refs.pickCom.getSlotValue(0);
                var value2 = this.$refs.pickCom.getSlotValue(1);
                var value3 = this.$refs.pickCom.getSlotValue(2);
                this.chosenAddress.emsProvinceCode = value1.id;
                this.chosenAddress.emsCityCode = value2.id;
                this.chosenAddress.emsDistrictCode = value3.id;
                var newArry = [];
                newArry.push(value1.name, value2.name, value3.name);
                this.chosenAddress.address = newArry.toString();
            },
            //选择省，市，县
            selectArea(){
               this.popupAddress = true;
            },
            //下单
            placeAnOrder(){
                let _this = this;
                if(!localStorage.getItem("phone")){
                    Toast('未登录！');
                    setTimeout(function () {
                        _this.$router.replace({ path: "/Index" });
                    },2000)
                    return;
                }
                if(this.selectedAddress.id == ''||this.selectedAddress.id == null || this.selectedAddress.id == undefined ||!this.addressNone){
                    Toast('请选择收货地址！');
                    return
                }
                if(!this.Undeliverable){
                    Toast('此地区不能送达！');
                    return;
                }
                if(this.needPayPrice > 0 && this.payment == ''){
                    Toast('请选择支付方式！');
                    return
                }
                if( (Number(this.computedsData.deductCash_jd)+Number(this.computedsData.deductCash_cb)+Number(this.computedsData.deductCash_cj)) >0 && this.payment != ''){
                    this.cashType = 0;
                }else {
                    this.cashType = 1;
                }
                if(this.needPayPrice == 0){
                    this.cashType = 0;
                    if(localStorage.getItem("pwd") != 1){
                        this.$router.push({
                            path: "/pwd",query:{name:'下单'}
                        });
                    }
                }
                this.loadings = true;
                post(
                    "/mallorder/createOrder" ,{
                        address:this.selectedAddress.id,//地址
                        amount:this.totalPriceCopy,//下单价格
                        cashType:this.cashType,// 支付类型 : 0其他1:微信2:支付宝
                        cashVal:this.needPayPrice,//微信、支付宝支付金额
                        channel:this.commodityData.channel,//渠道来源
                        emsVal :this.freightPrice,//运费
                        goldCoin :this.computedsData.deductCash_jd,//金豆
                        itemId :this.commodityData.itemId,//宝贝id
                        itemNum :this.commodityData.goods_num,//商品购买数量
                        phone:localStorage.getItem("phone"),//用户手机号
                        skuId :this.commodityData.goods_skuId,//规格skuId
                        skuImage:this.commodityData.goods_img,//规格图片
                        vegetGold:this.computedsData.deductCash_cj,//菜金
                        vegetTreasure:this.computedsData.deductCash_cb,//菜宝
                    }
                ).then(res => {
                    if (res.data.code == 100&&res.data != '') {
                      this.orderSn = res.data.data.orderSn;
                      if(this.cashType == 0 && this.needPayPrice == 0){
                          this.popupVisible = true;
                      }else {
                          this.wxPay();
                      }
                      this.loadings = false;
                    }
                }).catch(err => {
                    this.loadings = false;
                    Toast(err.msg);
                });
            },
            //获取订单model
            requestOrderModel(totalFee){
                post(
                    "/mallorder/modifyAmount" ,{
                        orderId:this.orderSn,//订单id
                        paymentType :this.cashType,//支付方式
                        phone:localStorage.getItem("phone"),//手机号
                        totalFee:totalFee,//商品总价
                    }
                ).then(res => {
                    let _this = this;
                    if (res.data.code == 100&&res.data != '') {
                        if(this.cashType == 0 && this.needPayPrice == 0){
                            Toast('支付成功');
                            setTimeout(function () {
                                _this.$router.replace({ path: "/SuccessfulPayment"});
                            },1000)
                        }else{
                            Toast('支付成功');
                            setTimeout(function () {
                                _this.$router.replace({ path: "/SuccessfulPayment"});
                            },1000)
                        }
                    }
                }).catch(err => {
                    Toast('网络出错');
                });
            },
            //h5商城微信支付
            wxPay(){
                post(
                    "/pay/mallH5WxPay" ,{
                        openId:this.openId,
                        orderId:this.orderSn,//订单id
                        paymentType :1,//支付方式
                        phone:localStorage.getItem("phone"),//手机号
                        totalFee:this.needPayPrice,//商品总价
                    }
                ).then(res => {
                    if (res.data.code == 100&&res.data != '') {
                        let that = this;
                        // 微信支付
                        function onBridgeReady() {
                            WeixinJSBridge.invoke(
                                "getBrandWCPayRequest",
                                {
                                    appId: res.data.data.appId, //公众号名称，由商户传入
                                    timeStamp: res.data.data.timeStamp, //时间戳，自1970年以来的秒数
                                    nonceStr: res.data.data.nonceStr, //随机串
                                    package: res.data.data.package_str,
                                    signType: res.data.data.signType, //微信签名方式：
                                    paySign: res.data.data.paySign //微信签名
                                },
                                function(res) {
                                    that.count = false;
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        //that.$router.replace({ path: "/SuccessfulPayment"});
                                        // 使用以上方式判断前端返回,微信团队郑重提示：
                                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                        //that.$router.replace({ path: "/SuccessfulPayment"});
                                        that.requestOrderModel(this.needPayPrice)

                                    } else {
                                        that.$router.push({ path: "/FailurePay"});
                                    }
                                }
                            );
                        }
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener(
                                    "WeixinJSBridgeReady",
                                    onBridgeReady,
                                    false
                                );
                            } else if (document.attachEvent) {
                                document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                                document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
                            }
                        } else {
                            onBridgeReady();
                        }
                    }
                }).catch(err => {
                    Toast('网络出错');
                });
            },
            //跳转商品详情
            toProduct(){
                this.$router.replace({path:'/productDetails',query:{id:this.commodityData.itemId, nel:this.commodityData.channel, num:1, page:0}})
            }
        },
        created() {
            this.realInput = '';
            this.openId = localStorage.getItem("openId");
            this.commodityData = JSON.parse(decodeURI(this.$route.query.commodityData));
            this.totalPrice = (Number(this.commodityData.goods_totalPrice)*Number(this.commodityData.goods_num)).toFixed(2);
            this.totalPriceCopy = (Number(this.commodityData.goods_totalPrice)*Number(this.commodityData.goods_num)).toFixed(2);
            this.refresh();
            this.getProvinceArr();
        },
        mounted() {},
        watch: {
            realInput(newV, oldV) {
                this.disInputs = newV.split("");
                if (newV.length == 6) {
                    this.refreshUserData();
                }
            }
        },
    }
</script>

<style scoped>
  @import "../style/pwd.css";
  .content{
    height: 100%;
    background: #f8f8f8;
    padding-bottom: 3rem;
  }

  .goods_receiving_content{
    padding: 0 0.2rem;
    box-sizing: border-box;
    margin-top: 0.3rem;
  }
  .go_rule {
    width: 0.16rem;
    height: 0.26rem;
    margin-left: 0.1rem;
    cursor: pointer;
  }
  .go_rule img {
    width: 0.16rem;
    height: 0.3rem;
    margin-top: 0.05rem;
    cursor: pointer;
  }
  .address_receiving{
    display: flex;
    align-items: center;
    justify-content:space-between;
    position: relative;
    width: 100%;
    border-radius: 0.1rem 0.1rem 0 0;
    background: #fff;
    padding: 0.3rem 0.3rem;
    box-sizing: border-box;
  }
  .address_receiving p{
    text-align: left;
    line-height: 0.6rem;
  }
  .address_receiving .name{
    font-size: 0.32rem;
    color: #333333;
  }
  .address_receiving .phone{
    font-size: 0.30rem;
    color: #666666;
  }
  .address_receiving .address_txt{
    font-size: 0.32rem;
    color: #333333;
    font-weight: 500;
  }
  .address_receiving::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 3px;
    background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background-size: 80px;
    content: '';
  }
  .order_header{
    display: flex;
  }
  .order-card__thumb{
    flex-grow: 0;
    margin-right: 0.3rem;
  }
  .order-card__text{
    flex-grow: 2;
  }
  .order-card__thumb .order-img{
    width: 100%;
    height: 100%;
  }
  .order-card__thumb .order-img img{
    width: 2.3rem;
    /*height: 2.3rem;*/
    border-radius: 0.05rem;
  }
  .order-card__text p{
    text-align: left;
  }
  .order-card__text a p{
    font-size: 0.32rem;
    color: #333333;
    margin-top: 0.3rem;
    line-height: 0.4rem;
  }
  .order-card__total{
    text-align: right;
  }
  .order-card__total span{
    color: #333333;
    font-size: 0.3rem;
  }
  .order-card__num{
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin-top: 0.2rem;
  }
  .order-card__num p span:first-of-type{
    display: block;
    color: #333333;
    font-size: 0.3rem;
    line-height: 0.3rem;
  }
  .order-card__num p span:last-of-type{
    display: block;
    color: #999999;
    font-size: 0.26rem;
  }
  .order-card__num p span.order-pay__num{
    color: #FD8402;
  }
  .order_info_li{
    width: 100%;
    margin-top: 0.2rem;
    padding: 0.3rem;
    background: #fff;
    border-radius:0.1rem ;
    box-sizing: border-box;
  }
  .txt_content{
    width: 100%;
    box-sizing: border-box;
    margin-top: 0.2rem;
    padding: 0.3rem;
    background: #fff;
    border-radius: 0.1rem;
  }
  .txt_content p{
    display: flex;
    align-items: center;
    justify-content:space-between;
    line-height: 0.9rem;
  }
  .txt_content p span:first-of-type{
    color: #333333;
    font-size: 0.32rem;
  }
  .statistics_pay{
    padding-top: 0.3rem;
    margin-top: 0.3rem;
    color: #333333;
    font-size: 0.32rem;
    font-weight:400;
    text-align: right;
  }
  .bottom_border{
    border-bottom: 1px solid #F8F8F8;
  }
  .top_border{
    border-top: 1px solid #F8F8F8;
  }
  .actual_payment{
    display: flex;
    justify-content:flex-end;
  }
  .txt_content .actual_payment p .actual_payment_money{
    color: #FD8402;
    font-size: 0.32rem;
  }
  .txt_content .merchandise_subtotal .merchandise_subtotal_money{
    color: #333333;
    font-size: 0.32rem;
  }
  .txt_content .copy{
    font-style: normal;
    display: inline-block;
    padding: 0.08rem 0.08rem;
    border: 1px solid #999999;
    border-radius: 0.08rem;
    line-height: 0.21rem;
    font-size: 0.22rem;
  }
  .txt_content_edit{
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
  }
  .order_time_num p{
    line-height: 0.64rem;
  }
  .order_time_num p span:first-of-type{
    color: #999999;
    font-size: 0.28rem;
  }
  .checklist{
    display: block;
    width: 0.38rem;
    height: 0.38rem;
    background: url("../../src/assets/images/select_no_ico.png") no-repeat;
    background-size: 100% 100%;
  }
  .checklistNone{
    display: block;
    width: 0.36rem;
    height: 0.36rem;
    border: 1px solid #E0E0E0;
    background: #E0E0E0;
    border-radius: 50%;
  }
  .checklist.selected{
    background: url("../../src/assets/images/select_ok_ico.png") no-repeat;
    background-size: 100% 100%;
  }
  .txt_content .merchandise_freight{
    line-height: 0.32rem;
  }
  .txt_content .merchandise_freight em{
    font-style: normal;
    color: #999999;
    font-size: 0.28rem;
  }
  .wx_pay{
    display: block;
    width: 0.5rem;
    height: 0.4rem;
    background: url("../../src/assets/images/wx_pay_ico.png") no-repeat;
    background-size: 100% 100%;
  }
  .ali_pay{
    display: block;
    width: 0.45rem;
    height: 0.45rem;
    background: url("../../src/assets/images/ali_pay_ico.png") no-repeat;
    background-size: 100% 100%;
  }
  .order_pay{
    display: flex;
    align-items: center;
  }
  .order_pay i{
    margin-right: 0.5rem;
  }
  .to_payment{
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: #fff;
  }
  .to_payment p{
    padding-left: 0.3rem;
  }
  .to_payment p span{
    color: #666666;
    font-size: 0.32rem;
    margin-right: 0.1rem;
  }
  .to_payment p b{
    color:#FD8402;
    font-weight:500;
    font-size: 0.34rem;
  }
  .toPay{
    display: block;
    width: 2.7rem;
    height: 1.1rem;
    background:#FD8402 ;
    color: #fff;
    text-align: center;
    line-height: 1.1rem;
    font-size: 0.34rem;
  }
  .txt_content .deductible_cash{
    font-style: normal;
    color: #F95959;
    font-size: 0.28rem;
    line-height: 0.28rem;
  }
  .txt_content .freight_no{
    color: #999999;
  }
  .no_default_address{
    display: flex;
    align-items: center;
  }
  .no_default_address span{
    color: #333333;
    font-size: 0.32rem;
    font-weight:500;
    line-height: 1rem;
  }
  .address_pos{
    display: block;
    width: 0.24rem;
    height: 0.32rem;
    background: url("../../src/assets/images/address_pos_ico.png") no-repeat;
    background-size: 100% 100%;
    margin-right: 0.1rem;
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
  .van-radio-group{
    border-top: 0.3rem solid #f8f8f8;
  }
  .van-address-list{
    background: #f8f8f8;
  }
  .van-cell__title{
    text-align: left;
  }
  .van-cell__title van-field__label{
    text-align: left;
  }
  .van-field__body input{
    height: 0.48rem;
  }
  /* 地址确定取消按钮 */
  .pick_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .van-popup--right{
    background: #f8f8f8;
  }
  .van-address-edit{
    margin-top: 0.3rem;
    background: #fff;
  }
  .content /deep/ .van-loading{
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -15px;
    z-index: 999;
  }
</style>
