import Vue from 'vue'
import Vuex from 'vuex'
import {STORAGE_KEY} from '@/util/constants.js'
import storage from '@/util/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    loginModalVisiable: false,
    registerModalVisiable: false,
    user: {}
  },


  mutations: {
    changeLoginModalVisiable(state, {visiable}) {
      state.loginModalVisiable = visiable;
    },
    changeRegisterModalVisiable(state, {visiable}) {
      state.registerModalVisiable = visiable;
    },
    changeUser(state, {user}) {
      if(user.id) {
        storage.set(STORAGE_KEY.USER, user)
      } else {
        storage.remove(STORAGE_KEY.USER)
      }
      state.user = user;
    }
  },


  getters: {
    user: state => state.user,
    isLogined: state => !!state.user.id
  },


  actions: {
    getUser({commit}) {
      new Promise(resolve => {
          Vue.prototype.axios.get('/user/userinfo').then(response => resolve(response));
      }).then(response => {
          commit('changeUser', {user: response.data.data.user || {}});
      });
    },
    changeLoginModalVisiable({commit}, playload) {
      commit('changeLoginModalVisiable', playload);
    },
    changeRegisterModalVisiable({commit}, playload) {
      commit('changeRegisterModalVisiable', playload);
    },
    changeUser({commit}, playload) {
      commit('changeUser', playload);
    }
  },


  strict: process.env.NODE_ENV !== 'production'
})
