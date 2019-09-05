<template>
  <div class="content">
    <div class="head headEdit">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/backBlack_ico.png" />下单成功
    </div>
    <div class="content_box">
      <div class="content_box_img">
         <img src="../assets/images/order_success.png"/>
      </div>
      <p class="content_box_tittle">
        恭喜您支付成功
      </p>
      <div class="content_box—botton">
        <router-link tag="span" :to="{path:'/OrderList',query: {state:0}}" >
          查看订单
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "SuccessfulPayment",
        data() {
            return {

            };
        },
        computed: {},
        methods: {
            Cancel: function() {
                this.$router.replace({ path: "/Shop",query:{index:3} });
            },
            //跳转订单列表
            toOderList(){
                this.$router.replace({ path: "/OrderList" ,query:{state:0}});
            }
        },
        created() {

        },
        mounted() {

        },
        watch: {

        },
    }
</script>

<style scoped>
  .content{
    height: 100%;
  }
  .content_box{
    width: 100%;
  }
  .content_box_img{
    display: flex;
    justify-content: center;
    margin-top: 1.88rem;
  }
  .content_box_img img{
    width: 1.5rem;
    height: 1.5rem;
  }
  .content_box_tittle{
    color: #333333;
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.5rem;
  }
  .content_box—botton{
    display: flex;
    justify-content: center;
    margin-top: 0.8rem;
  }
  .content_box—botton span{
    display: block;
    width: 3.08rem;
    height: 0.89rem;
    background: #FD8402;
    color: #fff;
    text-align: center;
    line-height: 0.89rem;
    font-size: 0.32rem;
    border-radius: 0.45rem;
  }
</style>
