import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Index from '@/pages/Index'
import Recharge from '@/pages/Recharge'
import RechargeSuccess from '@/pages/RechargeSuccess'
import RechargeFail from '@/pages/RechargeFail'
import Level from '@/pages/Level'
import Commpensation from '@/pages/Commpensation'
import Editaddress from '@/pages/Editaddress'
import Selectaddress from '@/pages/Selectaddress'
import Addaddress from '@/pages/Addaddress'
import Team from '@/pages/Team'
import Personal from '@/pages/Personal'
import Brand from '@/pages/Brand'
import Shop from '@/pages/Shop'
import Recognition from '@/pages/Recognition'
import Sett from '@/pages/Sett'
import Submitpay from '@/pages/Submitpay'
import Rule from '@/pages/Rule'
import TeamManage from '@/pages/TeamManage'
import Prerogative from '@/pages/Prerogative'
import Code from '@/pages/Code'
import Sharerule from '@/pages/Sharerule'
import Detail from '@/components/Detail'
import Detailcomponent from '@/components/Detailcomponent'
import Summary from '@/components/Summary'
import BrandDetail from '@/pages/BrandDetail'
// 生成海报
import PlayBill from '@/pages/PlayBill'
// 角色规则
import RoleRule from '@/pages/RoleRule'
// 设置密码
import SetPassword from '@/pages/Setpassword'
// 忘记密码
import ForgetPwd from '@/pages/ForgetPwd'
// 重置密码
import ResetPwd from '@/pages/ResetPwd'
// 修改密码
import ModifyPwd from '@/pages/ModifyPwd'
// 关联手机号
import Relation from '@/pages/Relation'
// 特权规则
import PreRule from '@/pages/PreRule'
// 汇款信息
import Remittance from '@/pages/Remittance'
// 市场分红
import Market from '@/pages/Market'
// 市场规则
import MarketRule from '@/pages/MarketRule'
// 自提
import SelfMention from '@/pages/SelfMention'
import Turnout from '@/components/Turnout'
import Golbout from '@/components/Golbout'
import Withdrawal from '@/components/Withdrawal'
import SelfMentionbtn from '@/pages/SelfMentionbtn'
import SelfMentionedSuccessfully from '@/pages/SelfMentionedSuccessfully'
//提交订单
import SubmitOrder from '@/pages/SubmitOrder'
import Giving from '@/components/Giving'
// 转赠规则
import Transfer from '@/components/Transfer'
import Selfaddress from '@/pages/Selfaddress'
import AddSelfadd from '@/pages/AddSelfadd'
import Selfeditaddress from '@/pages/Selfeditaddress'
//修改个人资料
import EditPersonalData from '@/pages/EditPersonalData'
// 商品搜索
import Searchgoods from '@/pages/Searchgoods'
// 提现成功
import CathResult from '@/pages/CathResult'
// 提现进度
import SeeCath from '@/pages/SeeCath'
Vue.use(Router)

export default new Router({
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [{
      path: '/AddSelfadd',
      name: 'AddSelfadd',
      component: AddSelfadd
    },
    {
      path: '/Selfeditaddress',
      name: 'Selfeditaddress',
      component: Selfeditaddress
    },
    // 自提地址
    {
      path: '/Selfaddress',
      name: 'Selfaddress',
      component: Selfaddress
    },
    // 提交订单
    {
      path: '/SubmitOrder',
      name: 'SubmitOrder',
      component: SubmitOrder
    },
    // 自提页面
    {
      path: '/SelfMentionbtn',
      name: 'SelfMentionbtn',
      component: SelfMentionbtn
    },
    // 转赠
    {
      path: "/Giving",
      name: "/Giving",
      component: Giving
    },
    // 转赠规则
    {
      path: "/Transfer",
      name: "/Transfer",
      component: Transfer
    },
    // 自提成功
    {
      path: '/SelfMentionedSuccessfully',
      name: 'SelfMentionedSuccessfully',
      component: SelfMentionedSuccessfully
    },
    // 菜宝转出
    {
      path: '/Turnout',
      name: 'Turnout',
      component: Turnout
    },
    // 金豆转出
    {
      path: '/Golbout',
      name: 'Golbout',
      component: Golbout
    },
    // 提现页面
    {
      path: '/Withdrawal',
      name: 'Withdrawal',
      component: Withdrawal
    },
    // 自提
    {
      path: '/SelfMention',
      name: 'SelfMention',
      component: SelfMention
    },
    // 我的认种
    {
      path: '/Recognition',
      name: 'Recognition',
      component: Recognition
    },
    // 市场规则
    {
      path: '/MarketRule',
      name: 'MarketRule',
      component: MarketRule
    },
    // 市场分红
    {
      path: '/Market',
      name: 'Market',
      component: Market
    },
    // 汇款信息
    {
      path: '/Remittance',
      name: 'Remittance',
      component: Remittance
    },
    // 特权规则
    {
      path: '/PreRule',
      name: 'PreRule',
      component: PreRule
    },
    // 关联手机号
    {
      path: '/Relation',
      name: 'Relation',
      component: Relation,
    },
    // 修改密码
    {
      path: '/ModifyPwd',
      name: 'ModifyPwd',
      component: ModifyPwd,
    },
    // 重置密码
    {
      path: '/ResetPwd',
      name: 'ResetPwd',
      component: ResetPwd,
    },
    // 忘记密码
    {
      path: '/ForgetPwd',
      name: 'ForgetPwd',
      component: ForgetPwd
    },
    // 角色规则
    {
      path: '/RoleRule',
      name: 'RoleRule',
      component: RoleRule
    },
    // 生成海报
    {
      path: '/PlayBill',
      name: 'PlayBill',
      component: PlayBill
    },
    {
      path: '/BrandDetail',
      name: 'BrandDetail',
      component: BrandDetail
    },
    {
      path: '/Shop',
      // name: 'Shop',
      component: Shop,
      meta: {
        keepAlive: true
      },
    },
    {
      path: '/Summary',
      name: 'Summary',
      component: Summary
    },
    // 各种宝明细
    {
      path: '/Detailcomponent',
      name: 'Detailcomponent',
      component: Detailcomponent
    },
    // 详情
    {
      path: '/Detail',
      name: 'Detail',
      component: Detail
    },
    // 分享规则
    {
      path: '/Sharerule',
      name: 'Sharerule',
      component: Sharerule
    },
    // 二维码
    {
      path: '/Code',
      name: 'Code',
      component: Code
    },
    // 我的特权
    {
      path: '/Prerogative',
      name: 'Prerogative',
      component: Prerogative
    },
    // 团队管理奖
    {
      path: '/TeamManage',
      name: 'TeamManage',
      component: TeamManage
    },
    // 认种规则
    {
      path: '/Rule',
      name: 'Rule',
      component: Rule
    },
    // 确认支付
    {
      path: '/Submitpay',
      name: 'Submitpay',
      component: Submitpay
    },
    // 设置
    {
      path: '/Sett',
      name: 'Sett',
      component: Sett
    },

    // 品牌
    {
      path: '/Brand',
      name: 'Brand',
      component: Brand
    },
    // 我的
    {
      path: '/Personal',
      name: 'Personal',
      component: Personal
    },
    // 我的团队
    {
      path: '/Team',
      name: 'Team',
      component: Team
    },
    // 添加地址
    {
      path: '/Addaddress',
      name: 'Addaddress',
      component: Addaddress
    },
    // 选择地址
    {
      path: '/Selectaddress',
      name: 'Selectaddress',
      component: Selectaddress
    },
    // 编辑地址
    {
      path: '/Editaddress',
      name: 'Editaddress',
      component: Editaddress
    },
    // 补差升级
    {
      path: '/Commpensation',
      name: 'Commpensation',
      component: Commpensation
    },
    // 级别
    {
      path: '/Level',
      name: 'Level',
      component: Level
    },
    // 充值失败
    {
      path: '/RechargeFail',
      name: 'RechargeFail',
      component: RechargeFail
    },
    // 充值成功
    {
      path: '/RechargeSuccess',
      name: 'RechargeSuccess',
      component: RechargeSuccess
    },
    // 充值
    {
      path: '/Recharge',
      name: 'Recharge',
      component: Recharge
    },
    // 首页
    {
      path: '/',
      component: Index,
    },
    // 登录
    {
      path: '/Index',
      name: 'Index',
      component: Login
    },
    // 密码
    {
      path: '/pwd',
      name: 'SetPassword',
      component: SetPassword
    },
    // 修改个人资料EditPersonalData
    {
      path: '/EditPersonalData',
      name: 'EditPersonalData',
      component: EditPersonalData
    },
    // 搜索商品页面
    {
      path: '/Searchgoods',
      name: 'Searchgoods',
      component: Searchgoods,
      meta: {
        keepAlive: true
      },
    },
    //订单列表
    {
      path: "/OrderList",
      name: "OrderList",
      component: resolve => require(["@/pages/OrderList"], resolve),
    },
    //订单详情
    {
      path: "/OrderDetails",
      name: "OrderDetails",
      component: resolve => require(["@/pages/OrderDetails"], resolve),
    },
    //商品详情
    {
      path: "/productDetails",
      name: "productDetails",
      component: resolve => require(["@/pages/productDetails"], resolve),
    },
    //下单详情
    {
      path: "/ConfirmOrder",
      name: "ConfirmOrder",
      component: resolve => require(["@/pages/ConfirmOrder"], resolve),
    },
    //下单成功
    {
      path: "/SuccessfulPayment",
      name: "SuccessfulPayment",
      component: resolve => require(["@/pages/SuccessfulPayment"], resolve),
    },
    //下单失败
    {
      path: "/FailurePay",
      name: "FailurePay",
      component: resolve => require(["@/pages/FailurePay"], resolve),
    },
    {
      path: "/CathResult",
      name: "CathResult",
      component: resolve => require(["@/pages/CathResult"], resolve),
    },
    {
      path: "/SeeCath",
      name: "SeeCath",
      component: resolve => require(["@/pages/SeeCath"], resolve),
    },
    //客服
    {
      path: "/CustomerService",
      name: "CustomerService",
      component: resolve => require(["@/components/CustomerService"], resolve),
    },
  ]
})
