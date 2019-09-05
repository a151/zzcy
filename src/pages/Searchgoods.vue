<template>
  <div class="content">
    <form action="/" class="search_fiexd">
      <div class="heads">
        <img class="cancelicon" v-on:click="Cancel" src="../assets/images/searchcancel.png" />
      </div>
      <van-search
        v-model="value"
        placeholder="搜索商品"
        show-action
        shape="round"
        @search="onSearch(value)"
        background="#F2F2F2"
        id="focusid"
        maxlength="20"
        @input="maxLength"
        :left-icon="img"
      >
        <div slot="action" @click="onSearch(value)">搜索</div>
      </van-search>
    </form>
    <div class="history" v-show="historyShow" v-if="showBox">
      <div class="history-box">
        <span>搜索历史</span>
        <span @click="clear">清空搜索历史</span>
      </div>
      <div class="Record">
        <van-tag
          round
          size="medium"
          color="#F8F8F8"
          v-for="(item,index) in searches_list"
          :key="index"
          @click="onSearch(item)"
        >{{item}}</van-tag>
      </div>
    </div>
    <div class="result" v-else>
      <img src="../assets/images/newwork.png" alt />
      <p>网络出现异常</p>
      <img src="../assets/images/Reload.png" alt @click="reload" />
    </div>
    <div class="result" v-show="noList">
      <img src="../assets/images/searchShop.png" alt />
      <p>搜索无结果</p>
    </div>
    <div class="tishi" v-show="tips">
      <div class="tishi_c">
        <div class="tishi_main">
          <div class="tishi_1">
            <img style="width: 70px;margin-top: 20px;" alt />
            <span style="font-size:18px;margin:10px 0;color:#333333">确认清除搜索历史</span>
          </div>
          <div class="tishi_2 clr">
            <span @click="no">取消</span>
            <span @click="handleAnswer">确认</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="commodity" class="commodity-box">
      <van-loading v-if="lodding" class="tab-lodding" />
      <!-- 下拉刷新 -->
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        pulling-text="下拉可以刷新"
        loading-text="正在刷新..."
        success-text="刷新完成"
        v-else
      >
        <!-- 上拉刷新 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="加载完成"
          @load="onLoad"
          loading-text="正在加载..."
          :offset="number"
        >
          <van-card
            :desc="item.position+moneyThree+item.pos"
            :title="item.goodsName"
            v-for="(item,index) in shopList"
            :key="index"
            :thumb="item.goodsPic"
            @click="details(item.goodsId,item.channel)"
          >
            <div slot="tags" style="text-align:left">
              <van-tag plain type="danger">或￥{{item.goodsVal}}</van-tag>
            </div>
          </van-card>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Search, Toast, Dialog, List, PullRefresh } from "vant";
import { saveSearch } from "../api/cache.js"; //引用本地存储js
import storage from "good-storage"; //引入good-storage包
export default {
  data() {
    return {
      // 网络状态
      onLine: navigator.onLine,
      showBox: true,
      // 菊花图
      lodding: false,
      count: 0,
      isLoading: false,
      // 请求加载
      loading: false,
      finished: false,
      url: Global.url,
      value: "",
      img: require("../assets/images/search.png"),
      keyword: [],
      page: 0,
      // 兑兑
      category: 23,
      // 三斤
      catethree: 24,
      // 搜索商品列表
      shopList: [],
      noList: false,
      historyShow: true,
      // 历史搜索记录
      searches_list: [],
      tips: false,
      moneyThree: "菜金",
      commodity: false,
      searchValue: "",
      number: 2,
      checkPage: 0,
      scrollNum: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    this.scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.body.scrollTop = document.documentElement.scrollTop =
        vm.scrollTop;
    });
  },
  methods: {
    // 重新加载
    reload() {
      // location.reload();
      this.onSearch();
    },
    // 跳转详情页
    details(goodsId, channel) {
      // shop跳转
      this.$router.replace({
        path: "/productDetails",
        query: { id: goodsId, nel: channel, num: 2, keyword: this.searchValue }
      });
    },
    // 上拉刷新
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.page = this.checkPage;
        this.loading = false;

        if (this.page != 0) {
          this.refreshList();
        } else {
          return true;
        }
        this.finished = true;
      }, 1000);
    },
    // 下拉刷新
    onRefresh() {
      this.page = 0;
      setTimeout(() => {
        this.isLoading = false;
        this.refreshList();
      }, 500);
    },
    refreshList() {
      // if (this.shopList.length < 18) {
      //   Toast("暂无数据");
      //   this.finished = false;
      //   return true;
      // }
      get(
        this.url +
          "/mall/goodssearch?content=" +
          this.searchValue +
          "&page=" +
          this.page +
          "&channel=" +
          this.category
      )
        .then(resp => {
          this.commodity = true;
          this.historyShow = false;
          if (this.page != 0) {
            for (var i = 0; i < resp.data.length; i++) {
              this.shopList.push(resp.data[i]);
              this.checkPage = Number(resp.data[i].page);
              this.finished = false;
            }
          } else {
            this.shopList = resp.data;
          }
          for (var i = 0; i < this.shopList.length; i++) {
            if (this.shopList[i].channel == 24) {
              this.$set(
                this.shopList[i],
                "position",
                (this.shopList[i].goodsVal * 0.1).toFixed(1)
              );
              this.$set(
                this.shopList[i],
                "pos",
                " + ￥" + (this.shopList[i].goodsVal * 0.9).toFixed(1)
              );
            } else {
              this.$set(
                this.shopList[i],
                "position",
                this.shopList[i].goodsVal
              );
              this.$set(this.shopList[i], "pos", "");
            }
          }
        })
        .catch(err => {
          Toast("暂无数据");
          this.finished = true;
          this.loading = false;
          return true;
        });
    },
    no() {
      this.tips = false;
    },
    handleAnswer() {
      storage.remove("_search_");
      this.searches_list = [];
      this.tips = false;
    },
    Cancel: function() {
      if (this.commodity == true) {
        this.commodity = false;
        this.historyShow = true;
        this.value = "";
        this.searches_list = storage.get("_search_");
        this.finished = false;
        this.loading = false;
        return true;
      } else if (this.historyShow == true || this.noList == true) {
        this.$router.replace({ path: "/Shop" });
      }
    },
    // 商品搜索
    onSearch: function(value) {
      this.searchValue = value;
      if (value == "") {
        Toast("请输入搜索内容");
        return true;
      } else {
        saveSearch(value);
        let params = {
          majorInfo: value
        };
        this.lodding = true;
        this.noList = false;
        this.page = 0;
        this.$emit("handleSearch", params);
        get(
          this.url +
            "/mall/goodssearch?content=" +
            value +
            "&page=" +
            this.page +
            "&channel=" +
            this.category
        )
          .then(resp => {
            this.commodity = true;
            this.historyShow = false;
            this.shopList = resp.data;

            for (var i = 0; i < this.shopList.length; i++) {
              this.checkPage = Number(this.shopList[i].page);
              if (this.shopList[i].channel == 24) {
                this.$set(
                  this.shopList[i],
                  "position",
                  (this.shopList[i].goodsVal * 0.1).toFixed(1)
                );
                this.$set(
                  this.shopList[i],
                  "pos",
                  " + ￥" + (this.shopList[i].goodsVal * 0.9).toFixed(1)
                );
              } else {
                this.$set(
                  this.shopList[i],
                  "position",
                  this.shopList[i].goodsVal
                );
                this.$set(this.shopList[i], "pos", "");
              }
            }
            this.lodding = false;
          })
          .catch(err => {
            this.commodity = false;
            this.noList = true;
            this.historyShow = false;
            this.value = "";
            // Toast("网络异常");
          });
      }
    },

    clear: function() {
      if (this.searches_list.length != 0) {
        this.tips = true;
      } else {
        this.tips = false;
        Toast("暂无搜索历史");
      }
    },
    maxLength: function() {
      if (this.value.length == 20) {
        Toast("最多可输入20个字符");
      } else if (this.value.length == 0) {
        this.noList = false;
      }
    }
  },
  created() {
    // ?滚动代码
    // var self = this;
    // $(window).scroll(function() {
    //   let scrollTop = $(this).scrollTop();
    //   console.log(scrollTop);
    //   this.scrollNum = scrollTop;
    //   console.log(this.scrollNum);
    //   console.log("滚动之前的距离" + scrollTop);
    // });
    // ?结束
    this.searches_list = storage.get("_search_");
    if (this.$route.query.num == 1) {
      // this.$nextTick(function() {});

      this.onSearch(this.$route.query.keyword);
      this.historyShow = false;
    }
  },
  mounted() {
    this.$nextTick(function() {
      if (this.$route.query.num == 1) {
        return true;
      } else {
        document.getElementById("focusid").focus();
      }
      // document.querySelector(".commodity-box").scrollTop = vm.scrollTop;
    });
  }
};
</script>

<style scoped>
.content {
  text-align: left;
}
.van-search {
  background-color: #f2f2f2;
  padding-left: 40px;
}
.van-search__content {
  background-color: #ffffff;
}
.van-search--show-action {
  padding-right: 12px;
}
.content /deep/ .van-icon__image {
  width: 0.8em;
  height: 0.8em;
}
.content /deep/ .van-field__left-icon {
  line-height: 21px;
}
.content /deep/ .van-card {
  padding: 16px 0;
  margin: 0 16px;
  background-color: #ffffff;
  border-bottom: 0.1px solid #e7e7e7;
}
.content /deep/ .van-card:last-child {
  border-bottom: 0;
}
.content /deep/ .van-ellipsis {
  white-space: normal !important;
  width: 100px;
}
.content /deep/ .van-card__desc {
  color: #fd8402;
  text-align: left;
  margin-top: 0.2rem;
  width: 100%;
}
.cancelicon {
  cursor: pointer;
  width: 12px;
  height: 19px;
  margin-top: 0.35rem;
  z-index: 999;
}
.heads {
  font-size: 0.36rem;
  cursor: pointer;
  position: absolute;
}
.history {
  padding: 69px 15px 15px 15px;
}
.history-box {
  display: flex;
  justify-content: space-between;
  height: 0.6rem;
  margin-bottom: 0.2rem;
}
.history-box span:first-child {
  color: #333333;
  font-weight: 700;
  font-size: 16px;
  line-height: 0.6rem;
}
.history-box span:last-child {
  color: #999999;
  line-height: 0.6rem;
}
.Record {
  height: 100%;
}
.content /deep/ .van-tag {
  margin-right: 0.3rem;
  margin-bottom: 0.3rem;
  padding: 0.1rem 0.2rem;
  background-color: #f8f8f8;
  color: #333333;
  font-family: PingFangSC-Regular;
}
.content /deep/ .van-tag--plain {
  padding: 0;
  font-size: 11px;
  color: #999999;
  background: transparent;
}
[class*="van-hairline"]::after {
  border: transparent;
}
.van-tag--round {
  border-radius: 2rem;
}
.result {
  height: 100%;
}
.result img {
  width: 2.12rem;
  margin-left: 50%;
  margin-top: 50%;
  transform: translate(-50%);
}
.result p {
  text-align: center;
  color: #333333;
  letter-spacing: 1px;
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
.search_fiexd {
  position: fixed;
  z-index: 999;
  width: 100%;
}
.commodity-box {
  padding-top: 54px;
}
.tab-lodding {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}
</style>
