
<template>
  <div>
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item,index) in imglist" :key="index">
        <img :src="item" style="width:100%">
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import vue from "vue";
import Global from "@/api/global";
import {get} from "@/api/global";
import { Toast } from "mint-ui";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  components: {
    swiper,
    swiperSlide,
    Global
  },
  data() {
    return {
      swiperOption: {
        autoplay: 1000,
        speed: 2000,
        loop:true
      },
      url: Global.url,
      imglist: []
    };
  },
  mounted() {
    this.getBanner();
  },
  methods: {
    getBanner: function() {
      get(this.url + "/base/bannerList?type=2")
        .then(resp => {
          this.imglist = resp.data;
        })
        .catch(err => {
          if(err.status == 500){
            Toast('网络错误')
          }else{
            Toast(err.msg);
          }
          
        });
    }
  }
};
</script>
