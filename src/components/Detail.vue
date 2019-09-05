<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />
      {{packName}}
    </div>
    <img class="img" :src="img" />
    <div class="allcon">
      <div class="title">礼包内容</div>
      <div class="list">
        <div class="con" v-for="item in detailList" :key="item.id">{{item.goodsName}}</div>
      </div>
      <div class="bottomlist">
        <div class="con">蔬菜总数：<span>{{totalNum}}棵</span></div><div class="con">每月释放：<span>{{totalRate}}棵</span></div>
        <div class="con">礼包售价：<span>{{price}}菜宝</span></div><div class="con">认种周期：<span>{{period}}天</span></div>
        <div class="con">预期收益率：<span>{{rate}}%</span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Global from '@/api/global'
  import  {get} from '@/api/global'
  import {Toast} from 'mint-ui'
  export default {
    data(){
      return{
        url:Global.url,
        packName:"",
        packId:"",
        detailList:[],
        // 礼包售价
        price:"",
        // 认种周期
        period:"",
        // 收益率
        rate:"",
        img:''
      }
    },

    methods:{
      Cancel:function(){
        this.$router.replace({path:'/'})
      },
      getDetail:function(){
        get(this.url+'/goods/packinfo?id='+this.packId)
          .then(resp => {
            this.detailList = resp.data;
          })
          .catch(err => {
            Toast(err.msg)
        });
      },
    },
    created(){
    },
    mounted(){
      this.packName = this.$route.query.item.pack_name;
      this.packId = this.$route.query.item.id;
      this.price = this.$route.query.item.pack_price;
      this.period = this.$route.query.item.pack_period;
      this.rate = this.$route.query.item.pack_rate;
      this.img = this.$route.query.item.pack_pic;
      this.getDetail();
    },
    computed:{
      totalNum:function(){
        var total = 0
        for(var i = 0 ; i < this.detailList.length ; i ++){
          total += this.detailList[i].goodsNum
        }
        return total
      },
      totalRate:function(){
        var total = 0
        for(var i = 0 ; i < this.detailList.length ; i ++){
          total += this.detailList[i].rate
        }
        return total
      }
    }
  }
</script>
<style scoped>
  .content{
    justify-content: center;
    display: flex;
    flex-direction:column;
    align-items: center;
    cursor: pointer;
  }
  .img{
    width:50%;
    margin-top:20px;
    margin-bottom:20px;
    cursor: pointer;
  }
  .allcon{
    width:96%;
    margin:0 auto;
    text-align:left;
    cursor: pointer;
  }
  .title{
    color:#989898;
    cursor: pointer;
  }
  .list{
    line-height:25px;
    flex-direction: row;
    justify-content: start;
    flex-wrap: nowrap;
    cursor: pointer;
  }
  .con{
    display: inline-block;
    cursor: pointer;
  }
  .con:nth-child(odd){
    width:60%;
    cursor: pointer;
  }
  .con:nth-child(even){
    width:40%;
    cursor: pointer;
  }
  .bottomlist{
    line-height:30px;
    color:#989898;
    font-size:12px;
    cursor: pointer;
  }
  .bottomlist span{
    color:#414141;
    cursor: pointer;
  }
</style>
