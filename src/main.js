import Vue from 'vue'
// import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import storage from './util/storage.js'
import { STORAGE_KEY, RESPONSE } from './util/constants.js'
import './plugins/iview.js'
import '../vue.config.js'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
axios.defaults.baseURL='http://localhost:8000/api'
Vue.use(VueAxios, axios)

Vue.prototype.$error = (s) => Vue.prototype.$Message.error(s)
Vue.prototype.$info = (s) => Vue.prototype.$Message.info(s)
Vue.prototype.$success = (s) => Vue.prototype.$Message.success(s)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (storage.get(STORAGE_KEY.USER)) {
        next();
    } else {
        Vue.prototype.$error('您还没有登录哦:)');
        next(false);
    }
  }
  else {
      next();
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
          storage.remove(STORAGE_KEY.USER)
          router.replace('/');
        }
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
