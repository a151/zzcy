<template>
  <div class="content">
    <div class="goods_banner">
      <van-swipe @change="onChange">
        <van-swipe-item v-for="(item,index) in goodsData.itemPic" :key="index">
          <a @click="clickPicture(index)" href="javascript:;" class="banner_img">
            <img :src="item" />
          </a>
        </van-swipe-item>
        <div class="custom-indicator" slot="indicator">{{ current + 1 }}/{{itemPicLength}}</div>
      </van-swipe>
      <div class="banner_box"  :style="{background:'rgba(255,255,255,'+scrollTop/200+')'}">
        <div class="banner_back" @click="back">
          <a href="javascript:;">
            <img src="../assets/images/code/goods_back_ico.png" />
          </a>
        </div>
        <div class="banner_tittle" :style="{opacity:scrollTop/200}">
            商品详情  <i class="banner_num" style="opacity: 0">{{scrollTop/200}}</i>
        </div>
        <div class="servicePerson" @click="servicePerson()">
            <img src="../assets/images/service_ico_one.png">
        </div>
      </div>
    </div>
    <div class="goods_content">
      <div class="goods_describe">
        <p>{{goodsData.itemName}}</p>
        <span v-show="false">描述描述描述描述描述描述描述描述~</span>
      </div>
      <div class="goods_data_num">
        <div class="goods_txt_um goods_pays_money">
          <b v-if="channel == 23" class="goods_pays_cj">{{goodsData.skuInfo?finalTypeData.marketprice:goodsData.itemPrice}}菜金</b>
          <b v-else class="goods_pays_cj">{{goodsData.rewardMoney}}菜金 + ¥{{goodsData.surplusPrice}}</b>
          <span>或￥{{channel == 23&&goodsData.skuInfo?finalTypeData.marketprice:goodsData.itemPrice}}</span>
          <span
            v-show="finalTypeData.productprice>0&&finalTypeData.productprice>finalTypeData.marketprice"
            class="goods_pays_cut"
          >￥{{ finalTypeData.productprice}}</span>
        </div>
        <div v-if="false" class="goods_txt_um goods_pays_stock">
          <p>
            <span>库存</span>
            <span>{{stockNum}}</span>
<!--            <span v-if="channel == 23">{{goodsData.skuInfo !=null&&goodsData.skuInfo !=''&&goodsData.skuInfo !=undefined?finalTypeData.stock:goodsData.stock == null||goodsData.stock == ''||goodsData.stock == undefined?0:goodsData.stock}}件</span>-->
<!--            <span v-else>{{goodsData.stock?goodsData.stock:0}}件</span>-->
          </p>
        </div>
        <div class="goods_txt_um" style="opacity: 0">
          <i>分享</i>
        </div>
      </div>
    </div>
    <div class="goods_content goods_bottom_no">
      <div class="text_description">
        <h6>规格</h6>
        <p
          v-show="channel == 23&&skuInfo.param !=''&&skuInfo.param != null"
          v-for="(item,index) in skuInfo.param"
          :key="index"
        >
          <span>{{item.title}}：</span>
          <span>{{item.value}}</span>
        </p>
        <p v-show="channel != 23">
          <span>商品规格：</span>
          <span>无</span>
        </p>
      </div>
    </div>
    <div v-show="false" class="goods_content goods_border_top">
      <div class="text_description">
        <h6>配送信息</h6>
        <p>
          <span>快递信息：</span>
          <span>这是快递信息这是快递信息这是快递信息</span>
        </p>
        <p>
          <span>服务信息：</span>
          <span>这是服务信息</span>
        </p>
      </div>
    </div>
    <div class="commodity_details">
      <h6>商品详情</h6>
      <div class="commodity_details_img" v-html="goodsData.itemContent"></div>
    </div>
    <div class="buyNow" @click="buyNow()">
      <p>立即购买</p>
    </div>
    <!--购买弹窗-->
    <van-popup v-model="show" position="bottom">
      <div class="order_info_li">
        <div class="order_header">
          <a href="javascript:;" class="order-card__thumb">
            <div class="order-img">
              <img :src="channel == 23&&goodsData.skuInfo?typeImg:goodsData.itemPic[0]" />
            </div>
          </a>
          <div class="order-card__text">
            <a href="javascript:;">
              <p>{{goodsData.itemName.length>35?goodsData.itemName.substring(0,35)+'...':goodsData.itemName}}</p>
            </a>
            <div class="order-card__num">
              <p>
                <span v-if="channel == 23">{{goodsData.skuInfo?finalTypeData.marketprice:goodsData.itemPrice}}菜金</span>
                <span v-else>{{goodsData.rewardMoney}}菜金 + ¥{{goodsData.surplusPrice}}</span>
                <span>或 ¥{{channel == 23&&goodsData.skuInfo?finalTypeData.marketprice:goodsData.itemPrice}}</span>
              </p>
              <div class="goods_pays_stock">
                <span>库存</span>
                <span>{{stockNum}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-show="skuInfo.spec.length>0" class="scrollHeight">
          <div class="type_selection" v-for="(item,index) in skuInfo.spec" :key="index">
            <h6>{{item.title}}</h6>
            <ul class="type_selection_single clearfix">
              <li
                v-for="(it,i) in over_spec_item[index]"
                @click="selectType(i,index,it.valueId,it.thumb)"
                :class="{'active':selectTypes[index] == i}"
              >
                <img v-show="it.thumb.length>=6" class="fl" :src="it.thumb" />
                <span class="fl" style="text-align: left">{{it.title}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="goods_number">
          <span class="goods_buy_tittle">购买数量</span>
          <div class="goods_number_box">
            <i class="reduce" @click="reduce()"></i>
            <input class="number_inp" @input="inputEdit()" type="number" v-model="goodsNum" />
            <i class="plus" @click="plus()"></i>
          </div>
        </div>
      </div>
      <div v-show="isPurchase" @click="goBuyNow()" class="determine_purchase">
        <p>立即购买</p>
      </div>
      <div v-show="!isPurchase" class="determine_purchase_no">
        <p>库存不足，无法购买</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { post, get } from "@/api/global";
import Global from "@/api/global";
import { Toast } from "mint-ui";
import { Swipe, SwipeItem, Popup,ImagePreview  } from "vant";
export default {
  name: "productDetails",
  data() {
    return {
      current: 0,
      scrollTop: 0,
      show: false, //购买弹窗
      itemId: "", //商品id
      channel: "", //商品来源23兑兑 其余来三斤
      selectTypes: [], //商品类型选择
      itemPicLength: 0, //商品图片数量
      goodsNum: 1, //选择商品数量
      goodsData: {}, //商品所有信息
      stock: 1, //商品库存
      skuInfo: {
        option: [], //不同组合规格价钱等信息
        param: [], //商品介绍类型
        spec: [], //所有可选规格种类
        spec_item: [] //对应的规格
      }, //商品规格兑兑有
      typeImg: "", //选择的图片
      over_spec_item: [], //过滤后的商品规格
      pathType: [], //分割后的商品id组合
      spec_num_arr: [], //选择的商品id组合
      finalTypeData: {}, //最后选出类型匹配价格，库存等
      commodityData: {
        itemId: "", //商品id
        channel: "", //商品平台
        goods_img: "", //商品购买图片
        goods_name: "", //商品购买名称
        goods_num: "", //商品购买数量
        goods_cj: "", //商品购买菜金单价
        goods_surplusPrice: "", //商品购买剩余单价
        goods_totalPrice: "", //商品购买剩余总单价
        goods_skuId: "" //商品购买类型id
      }, //商品下单所需信息
      isPurchase:true,//是否可以购买
      // 判断路由跳转
      num: "",
      // 搜索关键字
      keyword:"",
      stockNum:0,//库存
    };
  },
  methods: {
    //商品轮播index
    onChange(index) {
      this.current = index;
    },
    //商品购买弹窗
    buyNow() {
      this.show = true;
    },
    //类型选择
    selectType(i, index, valueId, img) {
      this.selectTypes[index] = Number(i);
      this.selectTypes.reverse().reverse();
      this.spec_num_arr[index] = valueId;
      if (img != "http:" && img != "https:") {
        this.typeImg = img;
      }
      this.matchType();
    },
    //获取商品详情
    getGoodsInfo() {
      get("/mall/goodsdetail", {
        itemId: this.itemId,
        channel: this.channel
      })
        .then(res => {
          if (res.code == 100 && res.data != "") {
            this.goodsData = res.data;
            this.channel = res.data.channel;
            this.itemPicLength = res.data.itemPic.length;
            if(this.goodsData.channel == 23){
                if(!this.goodsData.skuInfo && (this.goodsData.stock == null||this.goodsData.stock == ''||this.goodsData.stock == undefined)){
                    this.stockNum = 0 ;
                }else if(this.goodsData.skuInfo && (this.goodsData.stock == null||this.goodsData.stock == ''||this.goodsData.stock == undefined)){
                    this.stockNum = 0;
                }else if(!this.goodsData.skuInfo && (this.goodsData.stock != null&&this.goodsData.stock != ''&&this.goodsData.stock != undefined)){
                    this.stockNum = this.goodsData.stock;
                }
            }else {
               if(this.goodsData.stock !='' && this.goodsData.stock !=null &&this.goodsData.stock != 0 &&this.goodsData.stock !=undefined){
                   this.stockNum = this.goodsData.stock;
               }else {
                   this.stockNum = 0;
               }
            }
            if(this.goodsData.channel != 23&&(this.goodsData.stock == 0||this.goodsData.stock == ''||this.goodsData.stock == null)){
                this.isPurchase = false;
            }
            else if(this.goodsData.channel == 23&&!this.goodsData.skuInfo&&(this.goodsData.stock == 0||this.goodsData.stock == ''||this.goodsData.stock == null)){
                  this.isPurchase = false;
            }else {
                  this.isPurchase = true;
            }
            if(res.data.skuInfo){
                this.skuInfo.option = res.data.skuInfo.option;
                this.skuInfo.param = res.data.skuInfo.param;
                this.skuInfo.spec = res.data.skuInfo.spec;
                this.skuInfo.spec_item = res.data.skuInfo.spec_item;
                res.data.skuInfo.spec.forEach((item, index) => {
                    this.selectTypes.push(0);
                    this.over_spec_item.push([]);
                    this.spec_num_arr.push(0);
                    res.data.skuInfo.spec_item.forEach((it, i) => {
                        if (item.propId == it.specid) {
                            this.over_spec_item[index].push(it);
                        }
                    });
                    this.spec_num_arr[index] = this.over_spec_item[index][0].valueId;
                    if (
                        this.over_spec_item[index][0].thumb != "http:" &&
                        this.over_spec_item[index][0].thumb != "https:"
                    ) {
                        this.typeImg = this.over_spec_item[index][0].thumb;
                    }else {
                        this.typeImg = this.goodsData.itemPic[0];
                    }
                });
                this.matchType();
            }else {
                this.typeImg = this.goodsData.itemPic[0];
            }
          }
        })
        .catch(error => {});
    },
    //商品匹配规格
    matchType() {
      let matching = 0;
      this.skuInfo.option.forEach((own, ind) => {
        let isTrue = 0; //商品类型能否匹配
        this.pathType = own.propPath.split(";");
        this.spec_num_arr.forEach((os, inds) => {
          if (this.pathType[inds].indexOf(os) != -1) {
          } else {
            isTrue++;
          }
        });
        if (isTrue > 0) {
        }else {
            matching = 1;
            this.finalTypeData = own;
        }
      });
        if(!matching){
            this.stockNum = 0;
            this.isPurchase = false;
            this.finalTypeData.marketprice = this.goodsData.itemPrice;
        }else if(this.finalTypeData.stock != '' && this.finalTypeData.stock != 0 && this.finalTypeData.stock != null){
            this.isPurchase = true;
        }else {
            this.stockNum = 0;
            this.isPurchase = false;
        }
      let state = 0;
      this.spec_num_arr.forEach((item,index) => {
          if(this.finalTypeData.propPath.indexOf(item) !=-1){
              state++;
          }
      });
      if(state == this.spec_num_arr.length && this.finalTypeData.stock != '' && this.finalTypeData.stock != 0 && this.finalTypeData.stock != null){
          this.isPurchase = true;
          this.stockNum = this.finalTypeData.stock;
      }else {
          this.isPurchase = false;
          this.stockNum = 0;
      }
    },
    //减
    reduce() {
      if (this.goodsNum <= 1) {
        this.goodsNum = this.stockNum == 0 ?0:1;
      } else {
        this.goodsNum--;
      }
    },
    //修改商品数量
    inputEdit() {
      let maxNum = 0;
      if(this.stockNum >= 99){
          maxNum = 99;
      }else {
          maxNum = this.stockNum;
      }
      if (this.goodsNum <= 0) {
        this.goodsNum = this.stockNum == 0 ?0:'';
      } else if (this.goodsNum > maxNum) {
        this.goodsNum = maxNum;
      }
    },
    //加
    plus() {
        let maxNum = 0;
        if(this.stockNum >= 99){
            maxNum = 99;
        }else {
            maxNum = this.stockNum;
        }
      if (this.goodsNum >= maxNum) {
        this.goodsNum = maxNum;
      } else {
        this.goodsNum++;
      }
    },
    //立即购买
    goBuyNow() {
      if(!localStorage.getItem("phone")){
          Toast('未登录');
          let _this = this;
          setTimeout(function () {
              _this.$router.replace({ path: "/Index" });
          },2000);
          return;
      }
      if (this.channel == 23) {
        if (!this.finalTypeData.stock&&(this.goodsData.stock == 0||this.goodsData.stock == null||this.goodsData.stock == '')) {
          Toast("此商品库存为0，无法下单");
          return;
        }
      } else {
        if (!this.goodsData.stock) {
          Toast("此商品库存为0，无法下单");
          return;
        }
      }
      if(this.goodsNum == 0 ||this.goodsNum ==''){
          Toast('下单商品数量不正确');
          return;
      }
      this.commodityData.itemId = this.itemId;
      this.commodityData.channel = this.channel;
      this.commodityData.goods_img = this.channel == 23&&this.goodsData.skuInfo ? this.typeImg : this.goodsData.itemPic[0];
      this.commodityData.goods_name = this.goodsData.itemName;
      this.commodityData.goods_num = this.goodsNum;
      this.commodityData.goods_cj = this.channel == 23&&this.goodsData.skuInfo ? this.finalTypeData.marketprice :this.channel == 23&&!this.goodsData.skuInfo ? this.goodsData.itemPrice:this.goodsData.rewardMoney;
      this.commodityData.goods_surplusPrice = this.channel == 23 ? 0 : this.goodsData.surplusPrice;
      this.commodityData.goods_totalPrice = this.channel == 23&&this.goodsData.skuInfo ? this.finalTypeData.marketprice : this.goodsData.itemPrice;
      this.commodityData.goods_skuId = this.channel == 23&&this.goodsData.skuInfo ? this.finalTypeData.skuId : "";
      this.$router.push({
        path: "/ConfirmOrder",
        query: { commodityData: encodeURI(JSON.stringify(this.commodityData)) }
      });
    },
    //回退
    back() {
      if (this.num == 1) {
        this.$router.replace({ path: "/Shop" });
      } else {
        this.$router.replace({ path: "/Searchgoods",query:{num:1,keyword:this.keyword} });
      }
    },
    //图片放大
    clickPicture(index){
        var images=[];
        this.goodsData.itemPic.forEach((item,index)=>{
            images.push(item);
        });
        ImagePreview({
            images: images,
            startPosition: index,
            onClose() {}
        });
      },
    //滚动高度
    handleScroll () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.scrollTop = scrollTop;
        //this.$refs.bannerBox.style.background =  'rgba(255,255,255,'+this.scrollTop/200+') '
    },
    //客服跳转
    servicePerson(){
        if (navigator.userAgent.match(/iPad|iPhone/i)) {
           window.open('http://p.qiao.baidu.com/cps/chat?siteId=13872524&userId=28827634')
        }else {
            this.$router.push({ path: "/CustomerService" })
        }
    }
  },
  created() {
    this.itemId = this.$route.query.id;
    this.channel = this.$route.query.nel;
    this.num = this.$route.query.num;
    this.keyword = this.$route.query.keyword;
    this.getGoodsInfo();
  },
  activated() {},
  mounted() {
      window.addEventListener('scroll', this.handleScroll)
  },
};
</script>

<style scoped>
  .fl{float: left;}
  .fr{float: right;}
  .clearfix:after{
    display: block;
    content: '';
    clear: both;
    zoom: 1;
  }
   .content{
     height: 100%;
     background: #f8f8f8;
   }
   .goods_banner{
     position: relative;
     width: 100%;
     background: #fff;
   }
   .goods_banner .banner_img{
     display: block;
     width: 100%;
     /*height: 5rem;*/
     overflow: hidden;
    }
   .goods_banner .banner_img img{
     width: 100%;
     max-height: 8rem;
   }
   .banner_back{
     position: absolute;
     margin-left: 0.3rem;
     z-index: 999;
   }
   .banner_num{
     position: absolute;
     left: 50%;
   }
   .servicePerson{
     position: absolute;
     right: 0.3rem;
     height: 0.5rem;
   }
   .servicePerson img{
     width: 0.55rem;
     height: 0.55rem;
   }
   .banner_tittle{
     display: flex;
     align-items: center;
     justify-content: center;
     width: 100%;
     height: 100%;
     font-size: 0.32rem;
     opacity: 0;
     text-align: center;
   }
   .banner_back a{
     display: block;
     width: 0.5rem;
     height: 0.5rem;
   }
   .banner_back a img{
     width: 0.5rem;
     height: 0.5rem;
   }
   .custom-indicator {
     position: absolute;
     right: 0.3rem;
     bottom: 0.2rem;
     padding: 0 11px;
     color: #fff;
     font-size: 12px;
     background: rgba(0, 0, 0, 0.1);
     border-radius: 0.18rem;
   }
   .goods_content{
     width: 100%;
     box-sizing: border-box;
     padding: 0.3rem;
     background: #fff;
     margin-bottom: 0.1rem;
   }
   .goods_describe{
     text-align: left;
   }
   .goods_describe p{
     color: #333333;
     font-size: 0.34rem;
     font-weight:500;
     line-height: 0.45rem;
     text-align: left;
   }
   .goods_describe span{
     color: #F95959;
     font-size: 0.3rem;
     font-weight:400;
     text-align: left;
   }
   .goods_data_num{
     display: flex;
     justify-content:space-between;
     margin-top: 0.1rem;
   }
   .goods_data_num .goods_txt_um .goods_pays_cj{
     display: block;
     color: #FD8402;
     font-size: 0.32rem;
     font-weight:500;
     line-height: 0.45rem;
   }
   .goods_data_num .goods_pays_money{
     text-align: left;
   }
   .goods_data_num .goods_pays_money span{
     color: #999999;
     font-size: 0.26rem;
     line-height: 0.45rem;
    }
   .goods_data_num .goods_pays_money .goods_pays_cut{
     text-decoration:line-through;
     margin-left: 0.1rem;
    }
   .goods_pays_stock{
    margin-left: 0.33rem;
  }
   .goods_pays_stock span{
     color: #999999;
     font-size: 0.26rem;
     line-height: 0.45rem;
   }
   .goods_txt_um i{
      display: block;
      font-style: normal;
      background:rgba(0,0,0,0.3);
      border-radius: 0.2rem;
      padding: 0 0.22rem;
      color: #fff;
      font-size: 0.24rem;
      line-height: 0.4rem;
   }
   .text_description{
     text-align: left;
   }
   .text_description h6{
     color: #333333;
     font-size: 0.32rem;
     line-height: 0.45rem;
     font-weight:400;
     margin-bottom: 0.1rem;
   }
   .text_description p{
     display: flex;
     line-height: 0.56rem;
     padding: 0.1rem 0;
     margin: 0.05rem 0;
     border-bottom: 1px solid #f8f8f8;
   }
   .text_description p span{
     color: #666666;
     font-size: 0.3rem;
     line-height: 0.55rem;
     font-weight:400;
   }
   .text_description p span:first-of-type{
     flex: 0 1 34%;
   }
   .text_description p span:last-of-type{
     flex: 0 1 66%;
   }
   .commodity_details{
     border-top: 0.1rem solid #f8f8f8;
     background: #fff;
     padding-bottom: 0.88rem;
   }
   .commodity_details h6{
     padding: 0.3rem;
     box-sizing: border-box;
     color: #333333;
     font-size: 0.32rem;
     text-align: left;
     font-weight: 400;
   }
   .buyNow{
     position: fixed;
     bottom: 0;
     left: 0;
     width: 100%;
   }
   .buyNow p{
     width: 100%;
     line-height: 0.88rem;
     background: #FD8402;
     color: #fff;
     font-size: 0.32rem;
     font-weight:500;
     text-align: center;
   }
   .order_info_li{
     width: 100%;
     margin-top: 0.2rem;
     padding: 0.3rem 0.3rem 0 0.3rem;
     background: #fff;
     border-radius:0.1rem ;
     box-sizing: border-box;
   }
   .order_header{
     display: flex;
   }
   .order-card__thumb{
     margin-right: 0.3rem;
   }
   .order-card__thumb .order-img{
     width: 100%;
     height: 100%;
   }
   .order-card__thumb .order-img img{
     width: 2.3rem;
     height: 2.3rem;
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
     justify-content:flex-start;
     margin-top: 0.2rem;
   }
   .order-card__num p span:first-of-type{
     display: block;
     color: #FD8402;
     font-size: 0.3rem;
     line-height: 0.3rem;
     font-weight:500;
   }
   .order-card__num p span:last-of-type{
     display: block;
     color: #999999;
     font-size: 0.26rem;
   }
   .goods_border_top{
     border-top: 0.1rem solid #f8f8f8;
   }
   .goods_bottom_no{
     margin-bottom: 0;
   }
   .scrollHeight{
     max-height: 5.4rem;
     overflow-y: scroll;
   }
   .type_selection{
     border-top: 1px solid #E7E7E7;
     box-sizing: border-box;
     margin-top: 0.3rem;
     padding: 0.3rem 0;
   }
   .type_selection h6{
     color: #333333;
     font-size: 0.32rem;
     font-weight:400;
     text-align: left;
   }
   .type_selection_single li{
     display: flex;
     align-items: center;
     float: left;
     padding: 0.09rem 0.3rem;
     margin: 0.3rem 0.3rem 0 0;
     font-size: 0.28rem;
     color: #666666;
     font-weight:400;
     border:1px solid rgba(221, 221, 221, 0.3);
     background: rgba(221, 221, 221, 0.3);
     border-radius: 0.3rem;
     line-height: 0.39rem;
   }
   .type_selection_single li img{
     width: 0.42rem;
     height: 0.42rem;
     margin-right: 0.1rem;
     border-radius: 0.05rem;
   }
   .type_selection_single li.active{
     display: flex;
     align-items: center;
     box-sizing: border-box;
     border:1px solid #FD8402;
     color: #FD8402;
     background: rgba(253, 132, 2, 0.05);
   }
   .goods_number{
     display: flex;
     align-items: center;
     justify-content:space-between;
     padding: 0.3rem 0;
     border-top: 1px solid #E7E7E7;
   }
   .goods_buy_tittle{
     color: #333333;
     font-size: 0.32rem;
   }
   .goods_number_box{
    display: flex;
  }
   .reduce{
     display: block;
     width: 0.65rem;
     height: 0.59rem;
     background: url("../../src/assets/images/reduce_ico.png") no-repeat;
     background-size: 100% 100%;
   }
   .number_inp{
     width: 0.75rem;
     height: 0.59rem;
     border: none;
     background: #F8F8F8;
     text-align: center;
     color: #333333;
     font-size: 0.34rem;
   }
   .plus{
      display: block;
      width: 0.65rem;
      height: 0.59rem;
      background: url("../../src/assets/images/plus_ico.png") no-repeat;
      background-size: 100% 100%;
   }
  .determine_purchase{
    width: 100%;
  }
  .determine_purchase p{
    width: 100%;
    line-height: 0.88rem;
    background: #FD8402;
    color: #fff;
    font-size: 0.32rem;
    font-weight:500;
    text-align: center;
  }
  .determine_purchase_no{
    width: 100%;
  }
  .determine_purchase_no p{
    width: 100%;
    line-height: 0.88rem;
    background: #F95959;
    color: #fff;
    font-size: 0.32rem;
    font-weight:500;
    text-align: center;
  }
  .banner_box{
    position: fixed;
    text-align: left;
    display: flex;
    align-items: center;
    height: 0.9rem;
    left: 0;
    top: 0;
    width: 100%;
    background: rgba(255,255,255,0);
  }
</style>
