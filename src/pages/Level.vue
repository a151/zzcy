<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" src="../assets/images/cancel.png" @click="toPrev()" />
    </div>
    <div class="topcon">
      <div class="con">
        <div class="bodcon">
          当前级别为
          <span class="fontstyle">{{name}}</span>
        </div>
        <img style="margin-left:-20%;width:14%;" :src="src" />
      </div>
    </div>
    <div class="allcon">
      <div class="title">我要升级为</div>
      <div
        class="list"
        v-on:click="Commpensation(item,name)"
        v-for="(item,index) in roleList"
        :key="index"
      >
        <span>{{item}}</span>
      </div>

      <div class="remark" style="margin-top:0.52rem;">温馨提示：</div>
      <div class="remark">1、首次认种的一个月时间内您可进行补差升级。</div>
      <div class="remark">2、每个用户有且只有一次机会。</div>
      <div class="remark">3、补差升级后，您首次认种的礼包直接替换成升级后的礼包且收益日期以升级日期为准。</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      name: "",
      price: "",
      level_num: "",
      src: ""
    };
  },
  methods: {
    Commpensation: function(item,name) {
      this.$router.replace({
        path: "/Commpensation",
        query: { name: item ,level:name}
      });
    },
    toPrev: function() {
      this.$router.replace({ path: "/" });
    }
  },
  created() {
    this.name = this.$route.query.senior;
    // console.log(this.name);
    if (this.name == "游客") {
      this.roleList = ["萌小青", "游菜侠", "憨大臣", "俏皇后", "菜国王"];
    } else if (this.name == "萌小青") {
      this.roleList = ["游菜侠", "憨大臣", "俏皇后", "菜国王"];
      this.src = require("../assets/images/mengxiaoqing.png");
    } else if (this.name == "游菜侠") {
      this.roleList = ["憨大臣", "俏皇后", "菜国王"];
      this.src = require("../assets/images/chivalrous.png");
    } else if (this.name == "憨大臣") {
      this.roleList = ["俏皇后", "菜国王"];
      this.src = require("../assets/images/ministers.png");
    } else if (this.name == "俏皇后") {
      this.roleList = ["菜国王"];
      this.src = require("../assets/images/queens.png");
    }
    // for (const item of this.roleList) {
    //   item.level = levelName[item.level];
    //   item.rewardMoney = levelColor[item.level];
    // }
  }
};
</script>
<style scoped>
body {
  background: #fff;
  cursor: pointer;
}
.content {
  font-size: 14px;
  cursor: pointer;
}
.topcon {
  width: 100%;
  height: 2.61rem;
  background: #f8f8f8;
  cursor: pointer;
}
.con {
  width: 92%;
  position: relative;
  top: 0.3rem;
  left: 3%;
  background: #ecffed;
  border-radius: 8px;
  height: 2rem;
  line-height: 2rem;
  cursor: pointer;
  box-shadow: 0px 5px 18px rgba(42, 42, 42, 0.06);
}
.bodcon {
  width: 70%;
  float: left;
  height: 100%;
  cursor: pointer;
  font-size: 0.32rem;
  color: #333;
}
.fontstyle {
  margin-left: 3%;
  font-size: 0.36rem;
  color: #3d8141;
  cursor: pointer;
}
.allcon {
  width: 92%;
  margin: 10px auto;
  text-align: left;
  cursor: pointer;
  font-size: 0.32rem;
}
.list {
  width: 100%;
  height: 0.88rem;
  line-height: 0.88rem;
  margin-top: 0.28rem;
  margin-left: 0;
  text-align: left;
  cursor: pointer;
  background-image: url("../assets/images/level2.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: cover;
  color: #333;
}
.list:hover {
  background-image: url("../assets/images/level1.png");
  color: #3d8141;
  cursor: pointer;
}
.list span {
  width: 70%;
  float: left;
  margin-left: 0.32rem;
  cursor: pointer;
}
.icons {
  width: 30px;
  height: 30px;
  float: right;
  margin-right: 3%;
  margin-top: 5px;
  cursor: pointer;
}
.remark {
  line-height: 0.45rem;
  font-size: 0.26rem;
  color: #999999;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
</style>
