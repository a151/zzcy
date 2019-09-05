<template>
     <div class="content">
       <div class="head headEdit">
         <img class="cancelicon" v-on:click="Cancel" src="../assets/images/backBlack_ico.png" />我的订单
       </div>
       <van-tabs class="aaaa" @click="onClick"  v-model="active">
         <van-tab title="全部">
             <div class="listContent">
               <ul>
                 <li v-for="(item,index) in listAll" :key="index">
                   <p class="order-card__tag">
                     <span>{{time(item.createTime)}}</span>
                     <span>{{states(item.status)}}</span>
                   </p>
                   <div @click="toDetails(item.orderSn)" class="order_header">
                     <a href="javascript:;" class="order-card__thumb">
                       <div class="order-img">
                         <img :src="item.skuImage"/>
                       </div>
                     </a>
                     <div class="order-card__text">
                       <a href="javascript:;">
                         <p>{{item.goodsName}}</p>
                       </a>
                       <div class="order-card__num">
                         <span>x{{item.goodsNum}}</span>
                       </div>
                       <div class="order-card__total">
                         <span>合计：</span>
                         <span>￥{{item.amount}}</span>
                       </div>
                     </div>
                   </div>
                   <div @click="cancelOrder(item.orderSn)"  v-show="item.status == 2" class="order-card__operation">
                     <a href="javascript:;">取消订单</a>
                   </div>
                   <div @click="comfirmOrder(item.orderSn)" v-show="item.status == 3" class="order-card__confirm">
                     <a href="javascript:;">确认收货</a>
                   </div>
                 </li>
               </ul>
             </div>
         </van-tab>
         <van-tab title="待发货">
             <div class="listContent">
               <ul>
                 <li v-for="(item,index) in listAll" :key="index">
                   <p class="order-card__tag">
                     <span>{{time(item.createTime)}}</span>
                     <span>{{states(item.status)}}</span>
                   </p>
                   <div @click="toDetails(item.orderSn)" class="order_header">
                     <a href="javascript:;" class="order-card__thumb">
                       <div class="order-img">
                         <img :src="item.skuImage"/>
                       </div>
                     </a>
                     <div class="order-card__text">
                       <a href="javascript:;">
                         <p>{{item.goodsName}}</p>
                       </a>
                       <div class="order-card__num">
                         <span>x{{item.goodsNum}}</span>
                       </div>
                       <div class="order-card__total">
                         <span>合计：</span>
                         <span>￥{{item.amount}}</span>
                       </div>
                     </div>
                   </div>
                   <div @click="cancelOrder(item.orderSn)" v-show="item.status == 2" class="order-card__operation">
                     <a href="javascript:;">取消订单</a>
                   </div>
                 </li>
               </ul>
             </div>
         </van-tab>
         <van-tab title="配送中">
             <div class="listContent">
               <ul>
                 <li v-for="(item,index) in listAll" :key="index">
                   <p class="order-card__tag">
                     <span>{{time(item.createTime)}}</span>
                     <span>{{states(item.status)}}</span>
                   </p>
                   <div @click="toDetails(item.orderSn)" class="order_header">
                     <a href="javascript:;" class="order-card__thumb">
                       <div class="order-img">
                         <img :src="item.skuImage"/>
                       </div>
                     </a>
                     <div class="order-card__text">
                       <a href="javascript:;">
                         <p>{{item.goodsName}}</p>
                       </a>
                       <div class="order-card__num">
                         <span>x{{item.goodsNum}}</span>
                       </div>
                       <div class="order-card__total">
                         <span>合计：</span>
                         <span>￥{{item.amount}}</span>
                       </div>
                     </div>
                   </div>
                   <div @click="comfirmOrder(item.orderSn)" v-show="item.status == 3" class="order-card__confirm">
                     <a href="javascript:;">确认收货</a>
                   </div>
                 </li>
               </ul>
             </div>
         </van-tab>
         <van-tab title="已完成">
             <div class="listContent">
               <ul>
                 <li v-for="(item,index) in listAll" :key="index">
                   <p class="order-card__tag">
                     <span>{{time(item.createTime)}}</span>
                     <span>{{states(item.status)}}</span>
                   </p>
                   <div @click="toDetails(item.orderSn)" class="order_header">
                     <a href="javascript:;" class="order-card__thumb">
                       <div class="order-img">
                         <img :src="item.skuImage"/>
                       </div>
                     </a>
                     <div class="order-card__text">
                       <a href="javascript:;">
                         <p>{{item.goodsName}}</p>
                       </a>
                       <div class="order-card__num">
                         <span>x{{item.goodsNum}}</span>
                       </div>
                       <div class="order-card__total">
                         <span>合计：</span>
                         <span>￥{{item.amount}}</span>
                       </div>
                     </div>
                   </div>
                 </li>
               </ul>
             </div>
         </van-tab>
         <div v-show="hasList" class="orderNone" ref="orderNone">
           <div>
             <div class="orderNone_img">
               <img src="../assets/images/no_order.png"/>
             </div>
             <p class="orderNone_tittle">您暂时还没有订单</p>
           </div>
         </div>
         <van-loading v-show="loadings"/>
       </van-tabs>
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
    import { Tab, Tabs } from 'vant';
    import { List,Loading  } from 'vant';
    import { post, get } from "@/api/global";
    import { Toast } from "mint-ui";
    import { websiteUrl} from "@/api/global";
    export default {
        name: "OrderList",
        data() {
            return {
                title:['全部','待发货','配送中','已完成'],
                active:0,
                state:0,//订单状态
                loadings:false,//是否正在加载
                listAll: [],//订单列表
                hasList: false,//是否有订单
                tipsTxt:'',//提示文字
                tips:false,//确认取消订单
                orderState:'',//订单状态
                orderSn:'',//订单单号
            };
        },
        methods: {
            Cancel: function() {
                this.$router.replace({ path: "/Personal" });
            },
            //刷新获取金豆等数量
            refresh(){
                post(
                    "/login/refreshUser?phone=" + localStorage.getItem("phone")
                ).then(res => {
                    if (res.data.code == 100) {
                        this.findOrderList(this.state);
                    }
                }).catch(err => {
                    let _this = this;
                    Toast(err.msg);
                    if (localStorage.getItem("phone")) {

                    } else {
                        setTimeout(function () {
                            _this.$router.replace({ path: "/Index" });
                        },2000);
                    }
                });
            },
            //点击切换
            onClick(name, title) {
                if(title == '全部'){
                    this.state = 0
                }else if(title == '待发货'){
                    this.state = 2
                }else if(title == '配送中'){
                    this.state = 3
                }else if(title == '已完成'){
                    this.state = 5
                }
                this.findOrderList(this.state);
            },
            //订单列表
            findOrderList(type){
                let _this = this;
                this.listAll = [];
                this.loadings = true;
                get("/mallorder/findOrderList", {
                    phone:localStorage.getItem("phone"),
                    type:type,
                }).then(res => {
                    if(res.code == 100){
                        this.listAll = res.data;
                        if(!res.data.length){
                            this.hasList = true;
                        }else {
                            this.hasList = false;
                        }
                        this.loadings = false;
                    }
                }).catch(error => {
                    this.loadings = false;
                    Toast('网络出错')
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
                        this.findOrderList(this.state);
                        this.tips = false;
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
                        this.findOrderList(this.state);
                        this.tips = false;
                    }
                }).catch(error => {
                    Toast('网络出错')
                });
            },
            //跳转详情页
            toDetails(orderSn){
                this.$router.push({path:'/OrderDetails',query:{orderSn:orderSn}})
            },
        },
        components: {},
        computed:{
        },
        created() {
            this.active = Number(this.$route.query.state);
            this.state = 0;
            if(this.active == 0){
                this.state = 0
            }else if(this.active == 1){
                this.state = 2
            }else if(this.active == 2){
                this.state = 3
            }else if(this.active == 3){
                this.state = 5
            }
            this.refresh();
            this.$nextTick(function () {
                this.$refs.orderNone.style.height = document.documentElement.clientHeight-95 +'px';
                window.scroll(0, 0);
            });
        },
        activated(){},
        mounted() {
        },
        watch:{

        }
    }
</script>

<style scoped>
  .content{
    height: 100%;
    background: #f8f8f8;
  }
  .listContent{
    padding:0.3rem;
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
  .listContent ul li{
    width: 100%;
    box-sizing: border-box;
    padding: 0.3rem;
    margin-bottom: 0.2rem;
    background: #fff;
    box-shadow:0px 15px 26px 5px rgba(0, 0, 0, 0.07);
    border-radius:0.1rem;
  }
  .listContent ul li .order-card__tag{
    display: flex;
    align-items: center;
    justify-content:space-between;
    padding: 0 0 0.2rem 0;
    border-bottom: 1px solid #F8F8F8;
  }
  .order-card__tag span:first-of-type{
    color: #666666;
    font-weight: 400;
    font-size: 0.3rem;
  }
  .order-card__tag span:last-of-type{
    color: #FD8402;
    font-weight: 400;
    font-family:PingFangSC-Regular;
    font-size: 0.32rem;
  }
  .order-card__text p,.order-card__num{
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
    line-height: 0.6rem;
  }
  .order-card__num span{
    color: #666666;
    font-size: 0.3rem;
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
  .orderNone{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 11.4rem;
    margin-top: -0.6rem;
    background: #fff;
  }
  .orderNone_img{
    width: 2.11rem;
    height: 2.05rem;
    margin-bottom: 0.3rem;
  }
  .orderNone_img img{
    width: 100%;
    height: 100%;
  }
  .orderNone_tittle{
    color: #333333;
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
  .content /deep/ .van-tabs__line {
    background-color: #fd8402 !important;
  }
  .content /deep/ .van-loading{
    position: fixed;
    left: 50%;
    top: 32%;
    margin-left: -15px;
    z-index: 999;
  }
</style>
