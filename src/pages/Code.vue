<template>
  <div>
    <div class="content" ref="faultTree">
      <!-- 二维码 -->
      <div class="head">
        <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />二维码
      </div>
      <div class="code">
        <img src="../assets/images/sharecode.54077ee.png" alt class="code" />
        <div class="qr_code">
          <vue-qr
            :bgSrc="config.logo"
            :dot-scale="1"
            :logoSrc="config.logo"
            :text="config.value"
            :size="130"
            :margin="0"
          ></vue-qr>
        </div>
        <div class="sharing" @click="showPopup">
          <img src="../assets/images/friend.png" alt />
        </div>
        <van-popup
          v-model="show"
          position="bottom"
          :overlay="opcity"
          :close-on-click-overlay="overlay"
        >
          <span>分享到</span>
          <div class="share">
            <ul>
              <!-- <li>
                <img src="../assets/images/WeChat.png" alt />
                <p>微信</p>
              </li> -->
              <li v-on:click="Copynum" class="second" :data-clipboard-text="link+phone">
                <img src="../assets/images/share.png" alt />
                <p>复制链接</p>
              </li>
              <!-- <li v-on:click="save" @closed="save">
                <img src="../assets/images/download.png" alt />
                <p>保存图片</p>
              </li> -->
            </ul>
          </div>
          <span @click="close" class="close">取消</span>
        </van-popup>
      </div>
    </div>
  </div>
</template>
<script>
import VueQr from "vue-qr";
import Clipboard from "clipboard";
import { Popup, Toast } from "vant";
import html2canvas from "html2canvas";
import Global from "@/api/global";
import { post } from "@/api/global";
import { websiteUrl } from "@/api/global";
export default {
  data() {
    return {
      opcity: true,
      phone: "",
      show: false,
      overlay: false,
      number: 0,
      link: "http://res.shosen.cn:8080/garden/login.html?invitor=",
      config: {
        value:
          // "http://foodyake.h.broteam.cn/#/Relation?phone=" +
          // localStorage.getItem("phone") //显示的值、跳转的地址
          websiteUrl+"/#/Relation?phone=" +
          localStorage.getItem("phone") //显示的值、跳转的地址
      }
    };
  },
  methods: {
    getMessage(){

    },
    save: function() {
      this.number = 3;
      this.show = false;
      setTimeout(() => {
        this.down();
      }, 500);
    },
    down() {
      let canvasID = this.$refs.faultTree;
      let that = this;
      let a = document.createElement("a");
      html2canvas(canvasID).then(canvas => {
        let dom = document.body.appendChild(canvas);
        dom.style.display = "none";
        a.style.display = "none";
        document.body.removeChild(dom);
        let blob = that.dataURLToBlob(dom.toDataURL("image/png"));
        a.setAttribute("href", URL.createObjectURL(blob));
        a.setAttribute("download", "poster.png");
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
      });
      Toast("图片已保存至您的手机相册”，快去分享吧~");
    },
    dataURLToBlob(dataurl) {
      //ie 图片转格式
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    Copynum: function() {
      let clipboard = new Clipboard(".second");
      clipboard.on("success", e => {
        Toast("链接复制成功，快去粘贴分享吧~");
      });
      this.close();
    },
    close() {
      this.show = false;
    },
    showPopup() {
      this.show = true;
    },
    Rule: function() {
      this.$router.replace({ path: "/Sharerule" });
    },
    // 海报
    Bill: function() {
      this.$router.replace({ path: "/PlayBill" });
    },
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    }
  },
  components: {
    VueQr
  },
  created() {
    this.phone = localStorage.getItem("phone");
  }
};
</script>
<style scoped>
.content {
  display: flex;
  display: -webkit-flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
  height: 100%;
  z-index: 999;
}
.code {
  width: 100%;
  height: 100vh;
  /* position: fixed;
  top: 50px;
  bottom: 0; */
  /* background: url("http://zhonghuatuteng.com/wx/h5/sharecode.54077ee.png"); */
  background-size: 100% 100%;
  cursor: pointer;
  position: relative;
  /* margin-top:50px */
}
/* 二维码 */
.qr_code {
  width: 2.6rem;
  height: 2.6rem;
  position: absolute;
  top: 33.5%;
  left: 32.8%;
  cursor: pointer;
}
.bottomcon {
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 180px;
  cursor: pointer;
}
/* 生成海报按钮 */
.btn {
  width: 160px;
  height: 40px;
  line-height: 40px;
  background: #ffb22b;
  color: #fff;
  text-align: center;
  border-radius: 30px;
  margin: 20px auto;
  cursor: pointer;
}
/* 规则 */
.rule {
  font-size: 16px;
  color: #ffb22b;
  cursor: pointer;
}
/* 进阶 */
.level {
  width: 100%;
  height: 70px;
  position: relative;
  cursor: pointer;
}
/* 人数 */
.people_num {
  position: absolute;
  top: -0.52rem;
  left: 2.26rem;
  width: 30px;
  height: 19px;
  background-image: url("../assets/images/num.png");
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: contain;
  color: #d97c00;
  font-size: 11px;
  line-height: 0.28rem;
  cursor: pointer;
}
/* 进度条 */
.line {
  margin-top: 30px;
  width: 100%;
  height: 10px;
  cursor: pointer;
}
/* 实际进度 */
.line_l {
  float: left;
  width: 32%;
  height: 10px;
  background-color: #ffd998;
  cursor: pointer;
}
/* 剩余进度 */
.line_r {
  float: right;
  width: 68%;
  height: 10px;
  background-color: #ffea97;
  cursor: pointer;
}
/* 等级名称 */
.level_name {
  margin: 4px 10px 0;
  font-size: 14px;
  cursor: pointer;
}
.low {
  float: left;
  color: #d97c00;
  cursor: pointer;
}
.next {
  float: right;
  color: #d97c00;
  opacity: 0.7;
  cursor: pointer;
}
.sharing {
  position: absolute;
  left: 50%;
  top: 10rem;
  transform: translateX(-50%);
}
.sharing img {
  width: 3.5rem;
  height: 1.4rem;
}
.van-popup span {
  font-size: 0.35rem;
  display: inline-block;
  padding: 0.3rem 0;
}
.van-popup {
  font-size: 0.28rem;
}
.share img {
  width: 56px;
  height: 56px;
}
.share ul {
  display: flex;
  flex-flow: row;
}
.share ul li {
  padding: 0.3rem 0;
  flex: 1;
}
.close {
  width: 90%;
  border-top: 1px solid #f8f8f8;
}
</style>
