import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n'
import store from './store'
require('keyboardevent-key-polyfill').polyfill()
Vue.config.productionTip = false
/* eslint-disable*/
Vue.use(VueI18n)

const i18n = new VueI18n({
  fallbackLocale: 'en',
  locale: window.localStorage.language || navigator.language || 'en'
})
var app = new Vue({
  el: '#app',
  // router,
  template: '<App/>',
  components: { App },
  store,
  i18n
})
