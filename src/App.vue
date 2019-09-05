<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script src='https://cdn.bootcss.com/babel-polyfill/6.23.0/polyfill.min.js'>
</script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script>
export default {
  name: "App",
    data() {
        return {
        };
    },

    methods: {},
    mounted() {
        // wx.ready(function(){
        //     wx.showMenuItems({
        //         menuList: ['menuItem:exposeArticle'] // 要显示的菜单项，所有menu项见附录3
        //     });
        // });
    },
    created() {
    }
};
</script>

<style lang='less'>
@import "~vux/src/styles/reset.less";
html,
body {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-overflow-scrolling: touch;
  background: #fff;
}
#app {
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
h1,
h2 {
  font-weight: normal;
  cursor: pointer;
}
ul {
  list-style-type: none;
  cursor: pointer;
  padding: 0;
}
li {
  display: inline-block;
  cursor: pointer;
}
a {
  color: #42b983;
  cursor: pointer;
}
input {
  border: none;
  outline: none;
  cursor: pointer;
}

/* 清浮动 */
.clearfix::after {
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}

.clearfix {
  zoom: 1;
}
/* flex布局 */
.layout {
  display: -moz-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
/* align-item */
.align_center {
  -moz-box-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  -moz-box-pack: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
}
.align_left {
  -moz-box-align: flex-start;
  -webkit-box-align: flex-start;
  -ms-flex-align: flex-start;
  -webkit-align-items: flex-start;
  align-items: flex-start;
  -moz-box-pack: flex-start;
  -webkit-box-pack: flex-start;
  -ms-flex-pack: flex-start;
}
/* justify */
.justify {
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -moz-box-pack: space-between;
  -webkit-box-pack: space-between;
  box-pack: space-between;
}
.justify_around {
  -webkit-justify-content: space-around;
  justify-content: space-around;
  -moz-box-pack: space-around;
  -webkit-box-pack: space-around;
  box-pack: space-around;
}
.justify_center {
  justify-content: center;
  -webkit-justify-content: center;
  -moz-box-pack: center;
  -webkit-box-pack: center;
  box-pack: center;
}
/* flex-direction */
.flex_diection {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
}
.flex_row {
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  -o-flex-direction: row;
  flex-direction: row;
}

.content {
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}
.head {
  width: 100%;
  height: 1rem;
  background: linear-gradient(to top, #4f9354, #65a96c);
  color: #fff;
  line-height: 1rem;
  font-size: 0.36rem;
  text-align: center;
  cursor: pointer;
}
.head img {
  position: absolute;
  left: 0;
  cursor: pointer;
}
.headEdit {
  background: #fff;
  color: #333333;
}
.headEdit img {
  width: 0.23rem;
  height: 0.38rem;
}
.foot {
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0;
  background: #fff;
  cursor: pointer;
}
.sel {
  width: 25%;
  float: left;
  height: 100%;
  cursor: pointer;
}
.icon {
  width: 0.5rem;
  height: 0.5rem;
  margin: 0.1rem auto;
  cursor: pointer;
}
.icon img {
  width: 100%;
  height: 100%;
}
.cancelicon {
  float: left;
  margin-left: 0.3rem;
  margin-top: 15px;
  cursor: pointer;
}

/* 光标 */
.pwd_blink {
  display: inline-block;
  position: relative;
}

.pwd_blink::after {
  position: absolute;
  content: "";
  width: 2px;
  height: 0.3rem;
  left: 50%;
  background: #409eff;
  top: 25%;
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-delay: 1s; /**延迟动画**/
  animation-delay: 1s;
}
.pwd_blink::after-enter-active,
.pwd_blink::after-leave-active {
  transition: opacity 0.5s;
}
.pwd_blink::after-enter,
.pwd_blink::after-leave-to {
  opacity: 0;
}
@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
// 弹窗
.mint-msgbox {
  width: 90%;
  height: 4rem;
  border-radius: 0.1rem;
  font-family: "微软雅黑";
  color: #333;
  cursor: pointer;
}
// 弹窗标题
.mint-msgbox-title {
  font-weight: 400;
  cursor: pointer;
  padding: 10px 0;
}
// 弹窗内容
.mint-msgbox-content {
  padding-top: 0 !important;
  border: none !important;
  cursor: pointer;
}
.mint-msgbox-message {
  color: #333;
  font-size: 16px;
  cursor: pointer;
}
// 弹窗按钮
.mint-msgbox-btns {
  margin: 0 0.47rem;
  cursor: pointer;
}
.mint-msgbox-btn {
  border: none;
  font-size: 0.3rem;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
}
// 取消按钮
.mint-msgbox-cancel {
  width: 1.75rem;
  height: 0.8rem;
  color: #999;
  background-color: #e9e9e9 !important;
  border-radius: 3px;
  margin-right: 0.47rem !important;
  cursor: pointer;
}
// 确定按钮
.mint-msgbox-confirm {
  width: 1.75rem;
  height: 0.8rem;
  color: #fff !important;
  background-image: url("./assets/images/confirm.png");
  margin-left: 0.47rem;
  cursor: pointer;
}
.mt-progress-content .mt-progress-runway {
  background-color: #5b9a64;
}
.mt-progress-content .mt-progress-progress {
  background-color: #7cbf85;
}
.passWord {
  color: #000;
  font-size: 22px;
  margin-top: 5px !important;
  display: inline-block;
}
.realInput {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  resize: none;
  outline: none;
  border: 0;
  z-index: 0;
  background: none;
  display: block;
  margin-left: -30%;
  caret-color: #fff;
  color: #000;
  opacity: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  right: 0;
  cursor: pointer;
  line-height: normal;
  transform: translateZ(0);
}
.pwd_content {
  margin-top: 0.72rem !important;
  cursor: pointer;
}

// 地图
.mint-popup {
  width: 100%;
  cursor: pointer;
  top: 35%;
}
.vux-cell-box {
  width: 75%;
  float: right;
  height: 30px;
  margin-top: 10px;
  border-bottom: 1px solid #ededed;
  line-height: 30px !important;
  cursor: pointer;
}
.vux-cell-box::before {
  border-top: none !important;
  cursor: pointer;
}
.vux-popup-picker-select {
  text-align: left !important;
  cursor: pointer;
}
.vux-popup-picker-value,
.vux-popup-picker-placeholder {
  font-size: 14px !important;
  cursor: pointer;
}
/* 输入框 */
.inp {
  border: none !important;
  width: 70%;
  float: left;
  text-align: left;
  height: 0.48rem;
  font-size: 0.28rem;
  line-height: 0.48rem;
  cursor: pointer;
}
// 密码输入
.disInput {
  position: absolute;
  top: 0;
  left: 0;
}
// 输入框内字体颜色

input::-webkit-input-placeholder {
  /* WebKit browsers*/
  color: #a2a2a2;
  font-size: 0.28rem;
  line-height: 0.48rem;
  cursor: pointer;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18*/
  color: #a2a2a2;
  font-size: 0.28rem;
  line-height: 0.48rem;
  cursor: pointer;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+*/
  color: #a2a2a2;
  font-size: 0.28rem;
  line-height: 0.48rem;
  cursor: pointer;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10+*/
  color: #a2a2a2;
  font-size: 0.28rem;
  line-height: 0.48rem;
  cursor: pointer;
}
//toast弹窗
.mint-toast {
  z-index: 9999;
  cursor: pointer;
  position: fixed;
  top: 50%;
  margin-bottom: -25%;
  left: 50%;
}

.van-tab {
  color: #666666;
  // font-size: 0.32rem;
}
.van-tab--active .van-ellipsis {
  color: #fd8402;
}
/*.van-tabs__line {*/
/*  background-color: #fd8402 !important;*/
/*}*/
.commodity_details_img img {
  width: 100% !important;
}
</style>
