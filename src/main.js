import Vue from 'vue'
// import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import storage from './util/storage.js'
import { STORAGE_KEY, RESPONSE, SERVER, USER_TYPE } from './util/constants.js'
import './plugins/iview.js'
import '../vue.config.js'


Vue.config.productionTip = false
axios.defaults.withCredentials = true
axios.defaults.baseURL= SERVER + '/api'
Vue.use(VueAxios, axios)

Date.prototype.format = function (fmt) {
  if(!this) return ''
  var o = {
  "M+": this.getMonth() + 1,
  "d+": this.getDate(),
  "h+": this.getHours(),
  "m+": this.getMinutes(),
  "s+": this.getSeconds(),
  "q+": Math.floor((this.getMonth() + 3) / 3),
  "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) 
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


Vue.prototype.$error = (s) => Vue.prototype.$Message.error(s)
Vue.prototype.$info = (s) => Vue.prototype.$Message.info(s)
Vue.prototype.$success = (s) => Vue.prototype.$Message.success(s)


router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
      if (storage.get(STORAGE_KEY.USER)) {
          if(to.meta.requireAdmin) {
            if (storage.get(STORAGE_KEY.USER).type >= USER_TYPE.ADMIN) {
                next()
            } else {
                Vue.prototype.$error('您不是管理员呢:)')
                next(false)
            }
          }
          next()
      } else {
          Vue.prototype.$error('您还没有登录哦:)')
          next(false)
          store.dispatch('changeLoginModalVisiable', {visiable: true})
      }
    
  } else {
    next()
  }
})


// axios.interceptors.request.use(
//   config => {
//       if (store.state.token) {
//           config.headers.Authorization = `token ${store.state.token}`;
//       }
//       return config;
//   },
//   err => {
//       return Promise.reject(err);
//   }
// );

axios.interceptors.response.use(
  response => {
      if(response.data) {
        if(response.data.code === RESPONSE.SESSION_EXPIRE) {
          store.dispatch('changeUser', {user: {}})
          // store.dispatch('changeLoginModalVisiable', {visiable: true})
        } else if(response.data.code === RESPONSE.EXCEPTION) {
          Vue.prototype.$error('服务器异常');
        }
      } else {
        Vue.prototype.$error('服务器异常');
      }
      return response;
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              // case 401:
                  // store.commit(types.LOGOUT);
              case 500:
                Vue.prototype.$error('服务器异常');
          }
      }
      return Promise.reject(error.response.data);
  }
);



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
