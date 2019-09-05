<template>
  <div class="content">
    <van-search
      placeholder="请输入搜索关键词"
      v-model="value"
      shape="round"
      background="#FD8402"
      input-align="center"
      @focus="centre"
      :left-icon="img"
    />
    <div v-if="showBox">
      <van-sidebar v-model="activeKey" id="sliderUp">
        <van-sidebar-item
          :title="item.name"
          @click="categorylist(index,item.id)"
          v-for="(item,index) in catelist"
          :key="index"
        />
      </van-sidebar>
      <van-tabs @click="onClick" id="topS" ref="scroller">
        <van-tab
          v-for="index in categoryname.length"
          :key="index"
          :title="categoryname[index-1].name"
        />
        <van-loading v-if="lodding" class="tab-lodding" />
        <van-pull-refresh
          v-model="isLoading"
          @refresh="onRefresh"
          pulling-text="下拉可以刷新"
          loading-text="正在刷新..."
          success-text="刷新完成"
          v-else
        >
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="加载完成"
            @load="onLoad"
            loading-text="正在加载..."
            :offset="number"
            :immediate-check="initial"
          >
            <div v-if="platform == 23" ref="list">
              <van-card
                :desc="item.goodsVal+moneyThree"
                :title="item.goodsName"
                v-for="(item,index) in categoryshop"
                :key="index"
                :thumb="item.goodsPic"
                @click="details(item.goodsId,item.channel)"
                id="contentList"
              >
                >
                <div slot="tags" style="text-align:left">
                  <van-tag plain type="danger">或￥{{item.goodsVal}}</van-tag>
                </div>
              </van-card>
            </div>
            <div v-else ref="list">
              <van-card
                :desc="item.gold+money+item.money"
                :title="item.goodsName"
                v-for="(item,index) in categoryshop"
                :key="index"
                :thumb="item.goodsPic"
                @click="details(item.goodsId,item.channel)"
              >
                <div slot="tags" style="text-align:left">
                  <van-tag plain type="danger">或￥{{item.goodsVal}}</van-tag>
                </div>
              </van-card>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tabs>
    </div>
    <div class="result" v-else>
      <img src="../assets/images/newwork.png" alt />
      <p>网络出现异常</p>
      <img src="../assets/images/Reload.png" alt @click="reload" />
    </div>
    <foot :index="index"></foot>
  </div>
</template>
<script>
import axios from "axios";
import foot from "../components/foot";
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Search, TreeSelect, Card, List, PullRefresh, Toast } from "vant";
export default {
  created() {
    this.mallList();
    // setTimeout(() => {
    // }, 1000);
  },
  // 记录滚动条位置
  beforeRouteLeave(to, from, next) {
    this.scrollTop = document.getElementById("topS").scrollTop;
    this.sliderUp = document.getElementById("sliderUp").scrollTop;
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.getElementById("topS").scrollTop = vm.scrollTop;
      document.getElementById("sliderUp").scrollTop = vm.sliderUp;
    });
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
    if (!this.onLine) {
      this.showBox = !this.showBox;
    }
    this.$nextTick(function() {});
  },
  data() {
    return {
      // 网络状态
      onLine: navigator.onLine,
      showBox: true,
      initial: false,
      loading: false,
      finished: false,
      // 菊花图
      lodding: false,
      number: -10,
      // 初始化商品页数
      page: 0,
      isLoading: false,
      checkPage: 0,
      index: 3,
      activeKey: 0,
      value: "",
      url: Global.url,
      // 兑兑
      category: 23,
      // 三斤
      catethree: 24,
      categoryname: [],
      // 右侧商品列表
      categoryshop: [],
      categorysid: 0,
      // 左部导航列表
      catelist: [],
      moneyThree: "菜金",
      money: "菜金 + ￥",
      // 判断平台
      platform: 0,
      leftP: false,
      img: require("../assets/images/search.png"),
      searchPage: 0,
      catethreeNum: 0,
      // scrollTop: 0
      a: "0",
      // 下拉刷新获取的id
      onRefreshid: ""
    };
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
  methods: {
    reload() {
      // location.reload();
      setTimeout(() => {
        this.categoryStart();
      }, 1000);
      this.mallList();
    },
    // 网络状态
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === "online";
    },
    // 跳转详情页
    details(goodsId, channel) {
      // shop跳转
      this.$router.replace({
        path: "/productDetails",
        query: { id: goodsId, nel: channel, num: 1, page: this.activeKey }
      });
    },
    // 上拉刷新
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        if (this.checkPage != 0) {
          this.loading = false;

          this.catethreeNum = this.catethreeNum + 1;
          this.page = this.checkPage;
          this.againRefresh();
          // this.finished = true;
        } else {
          this.loading = false;

          this.catethreeNum = this.catethreeNum + 1;
          // this.page = this.checkPage;
          this.againRefresh();
          // this.finished = true;
        }
      }, 1000);

    },
    againRefresh() {
      if (this.platform == 23) {
        this.loading = true;
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.category +
            "&sid=" +
            this.categorysid +
            "&page=" +
            this.page
        )
          .then(resp => {
            for (var i = 0; i < resp.data.length; i++) {
              this.categoryshop.push(resp.data[i]);
              this.checkPage = Number(resp.data[i].page);
            }
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            Toast("暂无数据");
            this.loading = false;
            this.finished = true;
          });
      } else {
        this.loading = true;
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.catethree +
            "&sid=" +
            this.onRefreshid +
            "&page=" +
            this.catethreeNum
        )
          .then(resp => {
            for (var i = 0; i < resp.data.length; i++) {
              // for (var i = 0; i < this.categoryshop.length; i++) {
              this.$set(
                resp.data[i],
                "money",
                (resp.data[i].goodsVal * 0.9).toFixed(1)
              );
              this.$set(
                resp.data[i],
                "gold",
                (resp.data[i].goodsVal * 0.1).toFixed(1)
              );
              this.categoryshop.push(resp.data[i]);
            }
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            Toast("暂无数据");
            this.loading = false;
            this.finished = true;
          });
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.downFresh();
      }, 500);
    },
    onClick(name, title) {
      this.categorysid = name;
      // window.scroll(0, 0);
      this.categoryStart();
    },
    // 初始化获取类目
    categoryStart() {
      this.lodding = true;
      if (this.platform == 23) {
        get(this.url + "/mall/catelist?pid=" + this.category)
          .then(resp => {
            this.categoryname = resp.data;
            // console.log(this.categoryname);
          })
          .catch(err => {
            console.log(err);
          });
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.category +
            "&sid=" +
            this.categorysid +
            "&page=" +
            0
        )
          .then(resp => {
            this.categoryshop = resp.data;
            this.lodding = false;
            this.showBox = true;
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
          });
      } else {
        // console.log(this.catelist[0].id);
        get(this.url + "/mall/catelist?pid=" + this.catethree)
          .then(resp => {
            this.categoryname = resp.data;
            // console.log(this.categoryname);
          })
          .catch(err => {
            console.log(err);
          });
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.catethree +
            "&sid=" +
            this.onRefreshid +
            "&page=" +
            0
        )
          .then(resp => {
            this.categoryshop = resp.data;
            for (var i = 0; i < this.categoryshop.length; i++) {
              this.$set(
                this.categoryshop[i],
                "money",
                (this.categoryshop[i].goodsVal * 0.9).toFixed(2)
              );
              this.$set(
                this.categoryshop[i],
                "gold",
                (this.categoryshop[i].goodsVal * 0.1).toFixed(2)
              );
            }
            this.lodding = false;
            this.showBox = true;
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
          });
      }
    },
    // 右侧类目列表
    categorylist(item, id) {
      document.getElementById("topS").scroll(0, 0);
      if (item == this.catelist.length - 1) {
        this.finished = false;
        // console.log(item);
        this.loading = true;
        // this.lodding = true;
        // console.log(item);
        this.platform = 23;
        this.page = 0;
        // console.log(this.platform);
        get(this.url + "/mall/catelist?pid=" + this.category)
          .then(resp => {
            setTimeout(() => {
              this.categoryname = resp.data;
              this.loading = false;
            }, 100);
            // this.lodding = false;
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
            this.finished = true;
          });
        this.categorypid();
      } else if (item != this.catelist.length - 1) {
        this.loading = true;
        this.platform = 24;
        this.catethreeNum = 0;
        this.categorysid = 0;
        this.finished = false;
        // this.lodding = true;
        get(this.url + "/mall/catelist?pid=" + this.catethree)
          .then(resp => {
            setTimeout(() => {
              this.categoryname = resp.data;
              this.loading = false;
            }, 100);
            // this.lodding = false;
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
            this.finished = true;
          });
        this.categorypid(id);
      }
    },
    // 右侧商品列表
    categorypid(id) {
      if (this.platform == 23) {
        this.lodding = true;
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.category +
            "&sid=" +
            this.categorysid +
            "&page=" +
            this.page
        )
          .then(resp => {
            this.categoryshop = resp.data;
            for (var i = 0; i < resp.data.length; i++) {
              this.checkPage = Number(resp.data[i].page);
              // console.log(this.checkPage);
              this.lodding = false;
            }
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
          });
      } else {
        this.onRefreshid = id;
        // console.log(this.onRefreshid)
        this.lodding = true;
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.catethree +
            "&sid=" +
            id +
            "&page=" +
            0
        )
          .then(resp => {
            this.categoryshop = resp.data;
            for (var i = 0; i < this.categoryshop.length; i++) {
              this.$set(
                this.categoryshop[i],
                "money",
                (this.categoryshop[i].goodsVal * 0.9).toFixed(2)
              );
              this.$set(
                this.categoryshop[i],
                "gold",
                (this.categoryshop[i].goodsVal * 0.1).toFixed(2)
              );
            }
            this.lodding = false;
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
          });
      }
    },
    // 下拉刷新
    downFresh() {
      if (this.platform == 23) {
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.category +
            "&sid=" +
            this.categorysid +
            "&page=" +
            0
        )
          .then(resp => {
            this.categoryshop = resp.data;
            for (var i = 0; i < resp.data.length; i++) {
              this.checkPage = Number(resp.data[i].page);
              // console.log(this.checkPage);
            }
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
          });
      } else {
        get(
          this.url +
            "/mall/goodslist?pid=" +
            this.catethree +
            "&sid=" +
            this.onRefreshid +
            "&page=" +
            0
        )
          .then(resp => {
            this.categoryshop = resp.data;
            for (var i = 0; i < this.categoryshop.length; i++) {
              this.$set(
                this.categoryshop[i],
                "money",
                (this.categoryshop[i].goodsVal * 0.9).toFixed(2)
              );
              this.$set(
                this.categoryshop[i],
                "gold",
                (this.categoryshop[i].goodsVal * 0.1).toFixed(2)
              );
            }
            // console.log(this.categoryshop);
          })
          .catch(err => {
            console.log(err);
            Toast("网络异常");
          });
      }
    },
    // 左侧商品类目
    mallList() {
      get(this.url + "/mall/catelist?pid=" + 0)
        .then(resp => {
          this.catelist = resp.data.reverse();
          this.onRefreshid = this.catelist[0].id;
          this.showBox = true;
          this.categoryStart();
        })
        .catch(err => {
          Toast("网络异常");
        });
    },
    getlistShop() {
      get(
        this.url +
          "/mall/goodslist?pid=" +
          this.catethree +
          "&sid=" +
          this.catelist[1].id +
          "&page=" +
          0
      )
        .then(resp => {
          this.categoryshop = resp.data;
          for (var i = 0; i < this.categoryshop.length; i++) {
            this.$set(
              this.categoryshop[i],
              "money",
              (this.categoryshop[i].goodsVal * 0.9).toFixed(2)
            );
            this.$set(
              this.categoryshop[i],
              "gold",
              (this.categoryshop[i].goodsVal * 0.1).toFixed(2)
            );
          }
          // console.log(this.categoryshop);
        })
        .catch(err => {
          console.log(err);
          Toast("网络异常");
        });
    },
    // 搜索获取焦点
    centre() {
      if (this.showBox == false) {
        return true;
      } else {
        this.$router.replace({ path: "/Searchgoods" });
      }
    }
  },

  components: {
    foot
  }
};
</script>
<style scoped>
@media only screen and (max-width: 320px) and (min-height: 568px) {
  .content .van-cell >>> .van-field__left-icon {
    left: 1.1rem;
  }
  .content >>> .van-tabs {
    width: 73%;
  }
}
@media only screen and (max-width: 320px) and (min-height: 480px) {
  .content .van-cell >>> .van-field__left-icon {
    left: 1.1rem;
  }
  .content >>> .van-tabs {
    width: 73%;
  }
}
.newtab {
  margin-left: 50px;
}
.van-sidebar-item {
  padding: 12px 12px 12px 8px;
}
.van-sidebar {
  position: fixed;
  margin-top: 54px;
  padding-bottom: 100px;
  background-color: #f8f8f8;
  overflow-y: scroll;
  height: 85%;
}
.content /deep/ .van-sidebar .van-sidebar-item:last-child {
  margin-bottom: 20px;
}
/* 隐藏滚动条 */
.van-sidebar::-webkit-scrollbar {
  display: none;
}
.van-sidebar-item:not(:last-child)::after {
  border-bottom-width: 0;
}
.van-search__content {
  background-color: #fff;
}
.van-cell >>> .van-field__left-icon {
  left: 1.2rem;
}
.van-search >>> .van-search__content {
  padding-left: 0;
}
.van-search {
  padding: 10px 50px;
  width: 100%;
  z-index: 999;
  position: fixed;
}
.content /deep/ .van-tab--active {
  font-size: 15px;
}
.content /deep/ .van-card {
  background-color: #fff;
  border-top: 1px solid #e7e7e7;
  padding: 16px 0;
  margin: 0 16px;
  text-align: left;
}
.content /deep/ .van-tabs__line {
  background-color: transparent;
}
.content /deep/ [class*="van-hairline"]::after {
  border: 0 solid transparent;
}
.van-tabs >>> .van-tabs__wrap {
  position: fixed;
  z-index: 999;
  width: 80%;
}
.van-tabs >>> .van-tabs__content {
  margin-top: 44px;
  margin-bottom: 60px;
}
.van-card:last-child {
  border-bottom: 0;
}

.van-sidebar .van-sidebar-item--select {
  border-color: #fd8402;
}
.van-sidebar-item--select {
  color: #fd8402;
}
.van-tabs {
  overflow-y: scroll;
  position: absolute;
  top: 54px;
  left: 85px;
  padding: 0;
  height: 90%;
  width: 76%;
}
.content /deep/ .van-ellipsis {
  white-space: normal !important;
  width: 100px;
}
.content /deep/ .van-icon__image {
  width: 0.8em;
  height: 0.8em;
}
.content /deep/ .van-field__left-icon {
  line-height: 21px;
}
.content /deep/ .van-tab {
  padding: 0;
}
.content /deep/ .van-card__desc {
  color: #fd8402;
  text-align: left;
  margin-top: 0.2rem;
  width: 100%;
  font-size: 13px;
}
.van-card__price {
  color: #999999;
}
.van-card__bottom {
  text-align: left;
}
.content /deep/ .van-tag {
  padding: 0;
  font-size: 12px;
  color: #999999;
}
.tab-lodding {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}
.result {
  height: 100%;
}
.result img:first-child {
  width: 2.12rem;
  margin-top: 50%;
}
.result img:last-child {
  width: 1.8rem;
  margin-top: 5%;
}
.result p {
  text-align: center;
  color: #333333;
  letter-spacing: 1px;
}
</style>
