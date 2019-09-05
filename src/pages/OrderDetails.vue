<template>
  <div class="content">
    <div class="head headEdit">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/backBlack_ico.png" />我的订单
    </div>
    <div class="bg_banner">
      <div class="bg_content_con">
        <span>{{states(orderData.status)}}</span>
        <div>
          <img v-show="orderData.status == 2" src="../assets/images/code/package_order.png"/>
          <img v-show="orderData.status == 3" src="../assets/images/code/distribution_order.png"/>
          <img v-show="orderData.status == 4" src="../assets/images/code/cancelOrder_ico.png"/>
          <img v-show="orderData.status == 5" src="../assets/images/code/over_order.png"/>
        </div>
      </div>
    </div>
    <div class="goods_receiving_content">
        <div class="address_receiving">
             <p class="personal_info">
                <span class="name">{{orderData.emsName}}</span>
                <span class="phone">{{orderData.emsPhone}}</span>
             </p>
             <p class="address_txt">
               {{orderData.emsProvince}} {{orderData.emsCity}} {{orderData.emsDistrict}} {{orderData.emsAddress}}
             </p>
        </div>
        <div>
          <ul>
            <li class="order_info_li">
              <div class="order_header">
                <a href="javascript:;" class="order-card__thumb">
                  <div class="order-img">
                    <img :src="orderData.skuImage"/>
                  </div>
                </a>
                <div class="order-card__text">
                  <a @click="toProduct()" href="javascript:;">
                    <p>{{orderData.goodsName.length>35?orderData.goodsName.substring(0,35)+'...':orderData.goodsName}}</p>
                  </a>
                  <div class="order-card__num">
                    <p>
                      <span v-if="orderData.channel ==23">{{(Number(orderData.amount)/Number(orderData.goodsNum)).toFixed(2)}}菜金</span>
                      <span v-else>{{(Number(orderData.amount)/Number(orderData.goodsNum)*0.1).toFixed(2)}}菜金 + ¥{{(Number(orderData.amount)/Number(orderData.goodsNum)*0.9).toFixed(2)}}</span>
                      <span>或 ¥{{(Number(orderData.amount)/Number(orderData.goodsNum)).toFixed(2)}}</span>
                    </p>
                    <span>x{{orderData.goodsNum}}</span>
                  </div>
                </div>
              </div>
              <div @click="cancelOrder(orderData.orderSn)"  v-show="orderData.status == 2" class="order-card__operation">
                <a href="javascript:;">取消订单</a>
              </div>
              <div @click="comfirmOrder(orderData.orderSn)" v-show="orderData.status == 3" class="order-card__confirm">
                <a href="javascript:;">确认收货</a>
              </div>
            </li>
          </ul>
        </div>
        <div class="txt_content">
          <p class="merchandise_subtotal bottom_border">
              <span>商品小计</span>
              <span class="merchandise_subtotal_money">¥{{orderData.amount}}</span>
          </p>
          <p>
              <span>菜金</span>
              <span :class="{'cut_red':Number(orderData.vegetGold)>0}">-¥{{orderData.vegetGold}}</span>
          </p>
          <p v-show="orderData.channel !=23">
              <span>金豆</span>
              <span :class="{'cut_red':Number(orderData.goldCoin)>0}">-¥{{orderData.goldCoin}}</span>
          </p>
          <p v-show="orderData.channel !=23">
            <span>菜宝</span>
            <span :class="{'cut_red':Number(orderData.vegetTreasure)>0}">-¥{{orderData.vegetTreasure}}</span>
          </p>
          <p class="top_border">
            <span>运费</span>
            <span>¥{{orderData.emsVal}}</span>
          </p>
          <div class="actual_payment top_border">
            <p>
               <span>实付:&nbsp</span>
               <span class="actual_payment_money">￥{{orderData.cashVal}}</span>
            </p>
          </div>
        </div>
        <div class="txt_content order_time_num">
          <p>
             <span>下单时间：{{time(orderData.createTime)}}</span>
          </p>
          <p>
            <span>订单编号：{{orderData.orderSn}}</span>
            <i class="copy orderNum" :data-clipboard-text="orderData.orderSn" v-on:click="CopyOrder">复制</i>
          </p>
          <p>
            <span>支付方式：{{orderData.cashType ==0 ?'其他':orderData.cashType == 1 ?'微信':'支付宝'}}</span>
          </p>
        </div>
    </div>
    <div class="tishi" v-show="tips">
      <div class="tishi_c">
        <div class="tishi_main">
          <div class="tishi_1">
            <img style="width: 70px;margin-top: 20px;" alt />
            <span style="font-size:18px;margin:10px 0;color:#333333">{{tipsTxt}}</span>
          </div>
          <div class="tishi_2 clr">
            <span @click="no">取消</span>
            <span @click="handleAnswer">确认</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import { post, get } from "@/api/global";
    import Clipboard from "clipboard";
    import { Toast } from "mint-ui";
    export default {
        name: "OrderDetails",
        data() {
            return {
                orderSn:'',//订单id
                orderData:{},//订单详情
                tipsTxt:'',//提示文字
                tips:false,//确认取消订单
                orderState:'',//订单状态
            };
        },
        methods: {
            Cancel: function() {
                this.$router.go(-1);
            },
            //复制文字
            CopyOrder:function () {
                let clipboard = new Clipboard(".orderNum");
                clipboard.on("success", e => {
                    Toast("复制成功");
                });
            },
            //时间转化
            time(v) {
                var v = v / 1;
                var date = new Date(v);
                return (
                    date.getFullYear() + "-" +
                    (date.getMonth() + 1).toString().padStart(2, "0") + "-" +
                    date.getDate().toString().padStart(2, "0") + " "+date.getHours().toString().padStart(2, "0")+
                    ":"+date.getMinutes().toString().padStart(2, "0")+":"+date.getSeconds().toString().padStart(2, "0")
                );
            },
            //状态转化
            states(num){
                if(num == 0){
                    return '已完成'
                }else if(num == 1){
                    return '未支付'
                }else if(num == 2){
                    return '待发货'
                }else if(num == 3){
                    return '配送中'
                }else if(num == 4){
                    return '已取消'
                }else if(num == 5){
                    return '已完成'
                }
            },
            //获取订单详情
            getOrderDetails(){
                get("/mallorder/findOrder", {
                    orderSn:this.orderSn,
                }).then(res => {
                    if(res.code == 100){
                       this.orderData = res.data;
                    }
                }).catch(error => {
                    Toast('网络出错')
                });
            },
            //取消订单
            cancelOrder(orderState){
                this.tipsTxt = '确认取消订单？';
                this.orderState = 1;
                this.orderSn = orderState;
                this.tips = true;

            },
            //确认收货
            comfirmOrder(orderState){
                this.tipsTxt = '是否确认收货？';
                this.orderState = 2;
                this.orderSn = orderState;
                this.tips = true;
            },
            //取消确认弹窗
            no(){
                this.tips = false;
            },
            //确认取消订单
            handleAnswer(){
                if( this.orderState == 1){//取消订单
                    this.cancelShopOrder();
                }else if(this.orderState == 2){
                    this.receiptConfirm();
                }
            },
            //取消订单
            cancelShopOrder(){
                get("/mallorder/cancelShopOrder", {
                    orderSn:this.orderSn,
                }).then(res => {
                    if(res.code == 100){
                        this.tips = false;
                        Toast('取消订单成功');
                        this.getOrderDetails();
                    }
                }).catch(error => {
                    Toast('网络出错')
                });
            },
            //确认收货
            receiptConfirm(){
                let postData = this.$qs.stringify({
                    orderSn:this.orderSn
                });
                post("/mallorder/receiptConfirm", postData).then(res => {
                    if(res.data.code == 100){
                        this.tips = false;
                        Toast('确认收货成功');
                        this.getOrderDetails();
                    }
                }).catch(error => {
                    Toast('网络出错')
                });
            },
            //跳转商品详情
            toProduct(){
                this.$router.replace({path:'/productDetails',query:{id:this.orderData.goodsId, nel:this.orderData.channel, num:1, page:0}})
            }
        },
        components: {},
        created() {
            this.orderSn = this.$route.query.orderSn;
            this.getOrderDetails();
        },
        mounted() {
        }
    }
</script>

<style scoped>
  .content{
    height: 100%;
    background: #f8f8f8;
    padding-bottom: 3rem;
  }
  .bg_banner{
    width: 100%;
    height: 2.08rem;
    background: #FD8402;
    border-radius: 0.1rem 0.1rem 0 0;
    box-sizing: border-box;
  }
  .bg_content_con{
    display: flex;
    width: 100%;
    height: 1.3rem;
    align-items: center;
    justify-content:space-between;
    box-sizing: border-box;
    padding: 0 0.4rem;
  }
  .bg_content_con span{
    color: #FFFFFF;
    font-size: 0.34rem;
    font-weight: 500;
  }
  .bg_content_con img{
    width: auto;
    height: 0.7rem;
  }
  .goods_receiving_content{
    padding: 0 0.2rem;
    box-sizing: border-box;
    margin-top: -0.8rem;
  }
  .address_receiving{
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
    margin-top: 0.5rem;
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
    margin-top: 0.4rem;
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
    line-height: 0.7rem;
  }
  .txt_content p span:first-of-type{
    color: #333333;
    font-size: 0.32rem;
  }
  .txt_content p span:last-of-type{
    color: #666666;
    font-size: 0.24rem;
  }
  .txt_content p span.cut_red{
    color: #F95959;
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
  .order_time_num p{
    line-height: 0.64rem;
  }
  .order_time_num p span:first-of-type{
    color: #999999;
    font-size: 0.28rem;
  }
  .order-card__operation{
    text-align: right;
  }
  .order-card__operation a{
    display: inline-block;
    padding: 0.11rem 0.24rem;
    margin: 0.45rem 0 0 0.3rem ;
    border: 1px solid #B4B4B4;
    border-radius: 0.05rem;
    color: #999999;
    font-size: 0.3rem;
  }
  .order-card__confirm{
    text-align: right;
  }
  .order-card__confirm a{
    display: inline-block;
    padding: 0.11rem 0.24rem;
    margin: 0.45rem 0 0 0.3rem ;
    border: 1px solid #FD8402;
    border-radius: 0.05rem;
    color: #FD8914;
    font-size: 0.3rem;
  }
  .tishi {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: height 2s, width 2s;
  }
  .tishi_c {
    width: 100%;
    height: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .tishi_main {
    width: 70%;
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
    display: flex;
    justify-content: space-around;
  }
  .tishi_1,
  .tishi_2 span {
    width: 100%;
    height: auto;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
  }
  .tishi_2 span:nth-child(1) {
    width: 1.8rem;
    display: inline-block;
    line-height: 0.7rem;
    color: #999;
    background-color: #e9e9e9 !important;
    border-radius: 3px;
    /* margin-right: 0.47rem !important; */
    cursor: pointer;
    font-size: 0.28rem;
  }
  .tishi_2 span:nth-child(2) {
    /* border-left: 1px solid #cccccc; */
    display: inline-block;
    color: rgb(1, 105, 163);
    width: 1.8rem;
    line-height: 0.7rem;
    color: #fff !important;
    background: linear-gradient(
      23deg,
      rgba(62, 130, 65, 1),
      rgba(101, 169, 108, 1)
    );
    margin-left: 0.4rem;
    font-size: 0.28rem;
  }
</style>
