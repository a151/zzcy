// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import 'swiper/dist/css/swiper.css';
import filters from './filters'
import times from './times/times'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import { Popup } from 'mint-ui';
import Vant from 'vant';
import 'vant/lib/index.css';
import wx from 'weixin-js-sdk';

import FastClick from 'fastclick'
Vue.component(Popup.name, Popup);
import { Picker } from 'mint-ui';
Vue.component(Picker.name, Picker);
Vue.config.debug = true;
import base from './base'
for (var key in filters) {
    Vue.filter(key, filters[key])
}
for (var key in times) {
    Vue.filter(key, times[key])
}
Vue.use(MintUI);
Vue.use(Vant);
Vue.use(wx);
Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
router.beforeEach((to, from, next) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    // console.log(to, from)
    next()

});
