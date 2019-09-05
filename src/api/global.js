// const url = 'https://39.98.177.106:6092';


// 新地址
// const url = 'https://api6.shosen.cn:7092';
// const url = 'https://api18.totner.com:6092';

import Vue from 'vue'
// import router from '@/router'
import axios from 'axios'
import qs from 'qs'
// 消息提示弹窗
import {
  MessageBox
} from "mint-ui";
import {
  Toast
} from "mint-ui"
Vue.prototype.$qs = qs
// let LoadingInstance, token = '';
// // 环境设置
// // 环境的切换
let url;
export let websiteUrl;
if (process.env.NODE_ENV == 'development') {

  axios.defaults.baseURL = 'https://ade.shosen.cn:6092';
  url = 'https://ade.shosen.cn:6092';
  websiteUrl = 'http://h5test.zzcy413.com';
  // axios.defaults.baseURL = 'http://192.168.1.131:6092';
  // url = 'http://192.168.1.131:6092';
  // // websiteUrl = 'http://h5test.zzcy413.com';
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'https://api6.shosen.cn:7092';
  url = 'https://api6.shosen.cn:7092';
  websiteUrl = 'http://h5test.zzcy413.com';
} else if (process.env.NODE_ENV == 'production') {
  // axios.defaults.baseURL = 'https://api6.shosen.cn:7092';
  // url = 'https://api6.shosen.cn:7092';
  //websiteUrl = 'http://m.zzcy413.com';
  axios.defaults.baseURL = 'https://ade.shosen.cn:6092';
  url = 'https://ade.shosen.cn:6092';
  websiteUrl = 'http://h5test.zzcy413.com';
}
export default {
  url
}



axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// axios.defaults.headers.post['XX-Token'] = '';

// 设置请求超时
axios.defaults.timeout = 5000;
// 请求拦截
// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
// import store from '@/store/index';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使/本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    config.headers.Accept = '*/*'
    return config;
  },
  error => {
    console.log(error)
    return Promise.error(error);
  })
// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.data.code === 100) {
      return Promise.resolve(response);
    } else {
      // Toast(response.data.msg);
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    // LoadingInstance.close()
    console.log(error.response)
    if (error.response.status) {
      return Promise.reject(error.response);
    }
  });

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 **/

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}


export function uploadFile(Url, data) {
  //上传图片的方法
  return new Promise((resolve, reject) => {
    let instance = axios.create({
      baseURL: 'http://xinmeiti.w.bronet.cn/api/',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    instance.post(Url, data).then(res => {
      resolve(res.data.data);
    }).catch(error => {
      reject(error.data)
    })
  });
}

export function toast(message, type) {
  //上传图片的方法
  if (type == 'error') {
    Notification.error({
      title: '错误',
      message: message,
      duration: 1500
    });
  } else {
    Notification.success({
      title: '提示',
      message: message,
      duration: 1500
    });
  }
}
