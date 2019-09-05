<template>
  <div class="content">
    <div class="topcon">
      <div class="head">
        <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />销售业绩
      </div>
      <div class="remark">2019年{{math}}月份累计销售业绩</div>
      <span class="num">{{gainVal}}</span>
    </div>
    <!-- 有业绩 -->
    <div class="allcon" v-show="list.length !== 0?true:false">
      <div class="con_title">历史业绩</div>
      <div class="con first_con">
        <div class="leftcon">时间</div>
        <div class="leftcon">累计业绩</div>
      </div>
      <div class="con" :class="{first_con:item.index == 0}" v-for="item in list" :key="item.id">
        <div class="leftcon" v-cloak>{{item.createtime | time}}</div>
        <div class="leftcon" v-cloak>{{item.sales}}</div>
      </div>
    </div>
    <!-- 无业绩 -->
    <div class="history_no" v-show="list.length == 0?true:false">
      <div class="history_title">历史业绩</div>
      <div class="history_box">
        <div class="img_box">
          <img src="../assets/images/td.png" alt />
        </div>
        <p class="history_tips">您暂时没有历史业绩</p>
      </div>
    </div>
  </div>
</template>
<script>
import Global from "@/api/global";
import { get } from "@/api/global";
export default {
  data() {
    return {
      url: Global.url,
      nowMonth: "",
      list: [],
      math: "",
      gainVal: 0
      // { createtime: "时间", sales: "累计业绩" }/
      // {index:0,time:'时间',money:'累计业绩'},
      // {index:1,time:'2019-1-1',money:'200000'},
      // {index:2,time:'2019-1-1',money:'200000'},
      // {index:3,time:'2019-1-1',money:'200000'},
      // {index:4,time:'2019-1-1',money:'200000'},
    };
  },
  created() {
    this.getList();
    this.getdata();
  },
  methods: {
    getList: function() {
      var phone = localStorage.getItem("phone");
      get(this.url + "/user/teamGain?phone=" + phone)
        .then(resp => {
          if (resp.code == 100) {
            this.gainVal = resp.data.gainVal;
            this.list = resp.data.hlist;
          }
        })
        .catch(err => {
          console.log("错误");
        });
    },
    Cancel: function() {
      this.$router.replace({ path: "/Personal" });
    },
    getdata() {
      var date = new Date();
      this.math = date.getMonth() + 1;
    }
  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.content {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  background: #f8f8f8;
  cursor: pointer;
}
.head {
  background: none !important;
  cursor: pointer;
}
.topcon {
  width: 100%;
  height: 200px;
  background: url("../assets/images/bactd.png");
  color: #fff;
  cursor: pointer;
  background-size: 100% 100%;
}
.remark {
  margin-top: 45px;
  cursor: pointer;
  font-size: 0.3rem;
}
.num {
  font-size: 0.4rem;
  margin: 5px auto;
  border-bottom: 1px solid #fff;
  cursor: pointer;
  width: 1.83rem;
  display: inline-block;
}
.allcon {
  width: 100%;
  background: #fff;
  cursor: pointer;
}
.con_title {
  width: 94%;
  height: 1.08rem;
  line-height: 1.28rem;
  text-align: left;
  font-size: 0.32rem;
  border-bottom: 1px solid #eaeaea;
  margin: 0 auto;
  cursor: pointer;
}
.con {
  width: 94%;
  height: 0.84rem;
  line-height: 0.84rem;
  font-size: 0.28rem;
  color: #333;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  margin: 0 auto;
  cursor: pointer;
}
.first_con {
  height: 0.9rem;
  font-size: 0.32rem;
  color: #666;
  cursor: pointer;
}
.leftcon {
  width: 50%;
  float: left;
  text-align: center;
  cursor: pointer;
}

/* 无历史业绩 */
.history_no {
  height: 100%;
  cursor: pointer;
}
.history_title {
  text-align: left;
  font-size: 0.32rem;
  padding: 0.48rem 0 0 0.27rem;
  cursor: pointer;
}
.img_box {
  width: 2.05rem;
  height: 2.05rem;
  cursor: pointer;
  margin: 2.52rem auto 0;
}
.img_box img {
  width: 100%;
  cursor: pointer;
}
.history_tips {
  margin-top: 0.44rem;
  font-size: 0.3rem;
  color: #333;
  cursor: pointer;
}
</style>
