<template>
  <div class="play_bill">
    <!-- 海报 -->
    <!-- 二维码 -->
    <div class="qr_code">
      <vue-qr :bgSrc="config.logo" :logoSrc="config.logo" :text="config.value" :size="130"></vue-qr>
    </div>
    <!-- 提示文字 -->
    <div class="tips">
      <div class="tips_content">
        来自好友张婷婷的分享
        邀请您加入众种菜园
      </div>
    </div>
  </div>
</template>
<script>
import VueQr from "vue-qr";
export default {
  data() {
    return {
      config: {
        value: "4efb4085beceb164f0ad7c5dfc5b6c4a" //显示的值、跳转的地址
      }
    };
  },
  components: {
    VueQr
  }
};
</script>
<style scoped>
.play_bill {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  background: url("../assets/images/slice.png");
  background-size: 100% 100%;
  cursor: pointer;
}
/* 二维码 */
.qr_code {
  width: 2.6rem;
  height: 2.6rem;
  position: absolute;
  bottom: 16.3%;
  left: 32.8%;
  cursor: pointer;
}
/* 提示 */
.tips {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.8rem;
  cursor: pointer;
}
.tips_content {
  margin: 0 auto;
  width: 3rem;
  line-height: 0.4rem;
  font-size: 15px;
  color: #2a1113;
  margin-top: 0.1rem;
  cursor: pointer;
}
</style>
