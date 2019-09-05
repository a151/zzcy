<template>
  <div class="content" id="content" ref="contents">
    <div class="head headEdit" >
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/backBlack_ico.png" />客服
    </div>
    <div id="iframe-box" ref="iframeBox" >
<!--      <iframe width="100%" id="ifram" scrolling="no"  src="http://p.qiao.baidu.com/cps/chat?siteId=13873934&userId=28827634"></iframe>-->
    </div>
  </div>
</template>

<script>
    export default {
        name: "CustomerService",
        data() {
            return {};
        },
        methods: {
            Cancel: function() {
                this.$router.go(-1);
            }
        },
        components: {},
        computed:{},
        created() {
            this.$nextTick(function () {
                if (navigator.userAgent.match(/iPad|iPhone/i)) {
                    this.$refs.contents.style.height = document.documentElement.clientHeight+'px';
                    document.getElementById("content").innerHTML = '<object type="text/html" data="http://p.qiao.baidu.com/cps/chat?siteId=13872524&userId=28827634" width="100%" height="100%"></object>';
                }else {
                    this.$refs.iframeBox.style.height = document.documentElement.clientHeight-60+'px';
                    document.getElementById("iframe-box").innerHTML = '<object type="text/html" data="http://p.qiao.baidu.com/cps/chat?siteId=13872524&userId=28827634" width="100%" height="100%"></object>';
                }
            });
        },
        activated(){},
        mounted() {
            //document.getElementById('iframe-box').style.height = document.documentElement.clientHeight;
        },
        watch:{}
    }
</script>
<style scoped>
  .content{
    height: 100%;
    background: #fff;
  }
  .servicePerson{
    width: 100%;
  }
  iframe{
    height: 100%;
    width: 100%;
    font-style: normal;
    border: none;
  }
  #newBridge .qiao-mobile-lite-webimlite{
    position: inherit !important;
  }
</style>
