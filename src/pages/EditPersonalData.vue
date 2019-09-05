<template>
  <div ref="orderNone" class="content">
      <!-- 修改个人资料 -->
      <div class="head">
        <img class="cancelicon" v-on:click="Cancel" src="../assets/images/cancel.png" />编辑资料
      </div>
      <div class="dataContent">
        <ul>
           <li class="data-li">
             <div class="dataLiList">
               <span class="dataLiTxt">修改头像</span>
               <div  class="dataLiImg">
                 <a class="goEditImg" href="javascript:;">
                   <van-uploader :after-read="afterRead" />
                   <img :src="imgUrl"/>
                 </a>
                 <span class="go_rule">
                   <img src="../assets/images/go.png" alt />
                 </span>
               </div>
             </div>
           </li>
           <li class="data-li">
            <div class="dataLiList">
              <span class="dataLiTxt">修改昵称</span>
              <div  class="dataLiImg">
                   <input type="text" class="nickName" v-model="nickName" value="菜友00000">
              </div>
            </div>
          </li>
           <li class="data-li">
            <div class="dataLiList">
              <span class="dataLiTxt">性别</span>
              <div  class="dataLiImg selectSex">
                <span @click="sex(1)">
                  <img v-if="sexIndex == 1"  src="../assets/images/agree.png" class="icon" />
                  <img v-else src="../assets/images/sure.png" class="icon"/>
                  <i>男</i>
                </span>
                <span @click="sex(2)">
                  <img v-if="sexIndex == 2"  src="../assets/images/agree.png" class="icon" />
                  <img v-else src="../assets/images/sure.png" class="icon"/>
                  <i>女</i>
                </span>
              </div>
            </div>
          </li>
        </ul>
        <div @click="saveInfo()" class="preserve">
            <p>保存</p>
        </div>
      </div>
    </div>
</template>

<script>
    import { Uploader } from 'vant';
    import { post, get } from "@/api/global";
    import { Toast } from "mint-ui";
    export default {
        name: "EditPersonalData",
        data() {
            return {
                nickName:'菜友',
                sexIndex:1,
                imgUrl:'',
            };
        },
        methods: {
            Cancel: function() {
                this.$router.replace({ path: "/Personal" });
            },
            sex:function (type) {
               this.sexIndex = type;
            },
            afterRead(file) {
                // 此时可以自行将文件上传至服务器
                this.imgUrl = file.content;
            },
            //保存
            saveInfo(){
                let imgtype = 0;
                if(this.nickName.length>18){
                    Toast('昵称字数过长');
                    return
                }
                if(this.imgUrl == localStorage.getItem("headImg")){
                    imgtype = 1;
                }
                let postData = this.$qs.stringify({
                    token:localStorage.getItem("token"),
                    nickName:this.nickName,//昵称
                    file:imgtype ? '' : this.imgUrl,//头像
                    sex:this.sexIndex,//性别
                    phone:localStorage.getItem("phone"),//手机号
                });
                post("/user/editUser", postData).then(res => {
                    if(res.data.code == 100){
                      Toast('保存成功');
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        components: {},
        created() {
            this.nickName = localStorage.getItem("nick_name");
            this.imgUrl = localStorage.getItem("headImg");
        },
        mounted() {
            this.$nextTick(function () {
                document.getElementsByClassName("van-uploader__upload")[0].style.height = '1rem';
                this.$refs.orderNone.style.height = document.documentElement.clientHeight+'px';
            })
        }
    }
</script>

<style scoped>
  .fl{float: left;}
  .fr{float: right;}
  .clearfix:after{
    display: block;
    content: '';
    clear: both;
    zoom: 1;
  }
  .content{
    width: 100%;
    height: 100%;
    background: #F8F8F8;
  }
  i{font-style: normal}
  .dataContent{
    color: #333333;
  }
  .dataContent ul{
    padding: 0 0.3rem;
    background: #fff;
  }
  .dataContent ul li{
    display: block;
  }
  .dataLiList{
    display: flex;
    padding: 0.2rem 0;
    align-items: center;
    justify-content:space-between;
    border-bottom: 1px solid #F8F8F8;
  }
  .dataLiTxt{
    flex: 1;
    text-align: left;
  }
  .dataLiImg{
    flex: 1;
    display: flex;
    text-align: right;
    align-items: center;
    justify-content:flex-end;
  }
  .selectSex{
    display: flex;
    justify-content: flex-end;
  }
  .selectSex span:first-of-type{
    margin-right: 0.5rem;
  }
  .dataLiList .goEditImg{
    position: relative;
    width: auto;
    height: auto;
    margin-right: 0.2rem;
  }
  .dataLiList .goEditImg img{
    width: 1.1rem;
    height: 1.1rem;
    border-radius:100%;
  }
  .goEditImg{
    flex: 1;
  }
  .go_rule {
    display: block;
    width: 0.16rem;
    height: 0.26rem;
    margin-left: 0.1rem;
    cursor: pointer;
  }
  .go_rule img {
    width: 100%;
    margin-top: 0.05rem;
    cursor: pointer;
  }
  .nickName{
    text-align: right;
  }
  .icon {
    width: 15px;
    height: 15px;
    cursor: pointer;
    margin-bottom: -0.05rem;
  }
  .dateSelectSex{
    flex: 1;
    margin-right: 0.5rem;
  }
  .preserve{
    background: #fff;
    margin-top: 0.5rem;
    line-height: 0.88rem;
  }
  .van-uploader{
    opacity: 0;
    position: absolute;
    width: 1.2rem;
    height: 1rem;
    right: -0.15rem;
    top: 0.05rem;
  }
</style>
