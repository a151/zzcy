<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />自提
    </div>
    <div class="rec">
      <p>当前自有存量总数：{{totalNum}}（棵）</p>
    </div>
    <div class="content-box">
      <div class="text_t">
        <p>请选择自提蔬菜的数量</p>
      </div>
      <div class="allbtn">
        <div class="reduce" @click="reduce"></div>
        <div class="num">
          <input
            onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
            class="inp"
            v-model="number"
            @input="amount($event)"
          />
        </div>
        <span style="font-size: .34rem;">箱</span>
        <div class="add" @click="add"></div>
      </div>
      <div class="surplus" v-show="sur" @click="questactive">
        <div class="radiobox">
          <span :class="{radio:activeClass,radio1:!activeClass}" oninput="questactive"></span>
        </div>
        <span class="rence">剩余箱数不足一箱，是否同发</span>
      </div>
      <div class="text_b">
        <p>每箱蔬菜15棵</p>
        <p>蔬菜种类由众种菜园商城自由搭配，每箱不少于3种</p>
      </div>
      <div class="sure" v-on:click="SubmitOrder(number,frequ)">确定 {{number}}箱</div>
    </div>
  </div>
</template>

<script>
import Global from "@/api/global";
import { post, get } from "@/api/global";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      // index: 0,
      frequ: "",
      // 不足显示 隐藏
      activeClass: false,
      url: Global.url,
      totalNum: 0,
      number: 0,
      length: 15,
      sur: false,
      // 总棵树
      seeds: "",
      num: 0,
      a: 1
      // newnumber:number
    };
  },
  methods: {
    questactive() {
      this.activeClass = !this.activeClass;
      if (this.activeClass == true) {
        this.number = Number(this.number) + 1;
      } else {
        // if (this.activeClass == true) {
        this.number = Number(this.number) - 1;
        // }
      }
    },
    amount() {
      if (this.totalNum != 0) {
        if (this.totalNum % 15 != 0) {
          if (this.number == this.sedds) {
            this.sur = true;
          } else if (this.number > this.sedds) {
            Toast("当前自有存量不足");
            this.sur = true;
            this.number = this.sedds;
          } else if (this.number < this.sedds) {
            this.sur = false;
            this.activeClass = false;
          }
          // else if (this.number == this.sedds - 1) {
          //   this.sur = true;
          // }
        } else {
          this.sur = false;
        }
      } else {
        Toast("当前自有存量不足");
        this.sur = false;
        this.number == 0;
        return true;
      }
    },
    Cancel: function() {
      this.$router.replace({ path: "/Recognition" });
    },
    SubmitOrder: function(number, frequ) {
      if (Number(this.number) == 0) {
        Toast("至少自提一箱");
        return true;
      } else if (Number(this.number) > this.sedds) {
        Toast("当前自有存量不足");
        return true;
      } else {
        // name 箱数 frequ 是否首提 item
        this.$router.replace({
          path: "/SubmitOrder",
          query: { name: number, frequ: frequ }
        });
      }
    },
    // 当前自有存量总数
    total: function() {
      get(
        this.url + "/user/selReReNum?phone=" + localStorage.getItem("phone")
      ).then(resp => {
        this.totalNum = resp.data;
        // console.log(this.totalNum);
      });
    },
    // 加

    add: function() {
      // this.num = Math.floor(this.totalNum / 15);
      // console.log(this.number);
      if (Number(this.number) >= this.sedds) {
        Toast("当前自有存量不足");
      } else {
        this.sur = false;
        this.number == this.number++;
        if (this.number == this.sedds) {
          this.sur = true;
        } else {
          this.sur = false;
        }
      }
    },
    // 减
    reduce: function() {
      if (this.number == Number(this.sedds) + 1 && this.activeClass == true) {
        this.number != 0 ? this.number-- : "";
        this.activeClass = false;
      } else {
        this.number != 0 ? this.number-- : "";
        this.sur = false;
      }
    },
    // 同发
    surpl: function() {
      if (totalNum < 15) {
        this.sur = true;
      }
    },
    sufficiency() {
      get(this.url + "/user/isselforder?phone=" + localStorage.getItem("phone"))
        .then(resp => {
          this.frequ = resp.data;
          // 0免邮 1有邮费
        })
        .catch(err => {
          Toast(err.msg);
        });
    }
  },
  created() {
    this.total();
    this.sufficiency();
    var seeds1 = this.$route.query.name;
    this.sedds = Math.floor(seeds1 / 15);
  },
  watch: {
    number(newV, oldV) {
      // this.number = this.number.replace(/[^\d]/g, "").replace(/^0{1,}/g, "");
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  touch-action: none;
  background-color: #f6f6f6;
}
.head {
  font-size: 0.36rem;
  cursor: pointer;
}
.cancelicon {
  margin: 0.3rem 0 0 0.3rem;
  cursor: pointer;
}
.rec {
  background-color: #fffdfe;
  height: 1.4rem;
  margin-top: 0.2rem;
  text-align: left;
  line-height: 1.5rem;
  padding-left: 0.2rem;
  font-size: 0.34rem;
  color: #333;
  cursor: pointer;
}
.content-box {
  width: 90%;
  background: rgba(255, 255, 255, 1);
  margin-left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 3px 9px 1px rgba(0, 0, 0, 0.06);
  margin-top: 0.2rem;
  border-radius: 8px;
  padding: 20px;
  padding-bottom: 0.2rem;
  box-sizing: border-box;
}
.text_t {
  font-size: 0.34rem;
  margin-top: 0.1rem;
}
.allbtn {
  width: 3.4rem;
  height: 1.3rem;
  margin-top: 0.6rem;
  margin-left: 1.28rem;
}
.reduce {
  float: left;
  width: 0.56rem;
  height: 0.6rem;
  cursor: pointer;
  background-image: url("../assets/images/reduce.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.num {
  float: left;
  margin-left: 0.32rem;
  line-height: 0.6rem;
  text-align: center;
  height: 0.56rem;
  width: 1rem;
  text-align: center;
  border: 1px solid rgba(187, 187, 187, 1);
  border-radius: 2px;
}
.inp {
  width: 1rem;
  height: 0.56rem;
  font-size: 130%;
  overflow: hidden;
  outline: none;
  text-align: center;
}
.add {
  float: right;
  width: 0.56rem;
  height: 0.6rem;
  cursor: pointer;
  background-image: url("../assets/images/add.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.surplus {
  /* text-align: left; */
  line-height: 16px;
  margin: 0 0 0.2rem 0;
}
.surplus .rence {
  color: #333;
  font-size: 0.3rem;
  margin-left: 0.2rem;
}
.surplus .radiobox {
  top: 0.06rem;
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px solid #3d8141;
  border-radius: 50%;
  display: inline-block;
}
.surplus .radiobox .radio {
  position: absolute;
  display: inline-block;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: #3d8141;
}
.surplus .radiobox .radio1 {
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: transparent;
}
.text_sur {
  font-size: 0.25rem;
}
.inp_c {
  float: right;
}
.text_b {
  font-size: 0.26rem;
  color: #848484;
}
.sure {
  width: 3.2rem;
  height: 0.9rem;
  font-size: 0.3rem;
  line-height: 0.9rem;
  margin: 0.55rem 0 0.3rem 1.28rem;
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  color: #fff;
  cursor: pointer;
}
</style>
