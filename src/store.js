import Vue from 'vue'
import Vuex from 'vuex'
import {STORAGE_KEY, USER_TYPE} from '@/util/constants.js'
import storage from '@/util/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    loginModalVisiable: false,
    registerModalVisiable: false,
    undos: [],
    dones: [],
    user: {}
  },


  mutations: {
    changeLoginModalVisiable(state, {visiable}) {
      state.loginModalVisiable = visiable
    },
    changeRegisterModalVisiable(state, {visiable}) {
      state.registerModalVisiable = visiable
    },
    changeUser(state, {user}) {
      if(user.id) {
        storage.set(STORAGE_KEY.USER, user)
      } else {
        storage.remove(STORAGE_KEY.USER)
      }
      state.user = user;
    },
    setUndos(state, {undos}) {
      state.undos = undos
    },
    setDones(state, {dones}) {
      state.dones = dones
    },
    addUndo(state, {undo}) {
      state.undos.push(undo)
    },
    addDone(state, {done}) {
      state.dones.push(done)
    },
    removeUndo(state, {undo}) {
      var idx = state.undos.findIndex((e) => e.id === undo.id)
      state.undos.splice(idx, 1)
    },
    removeDone(state, {done}) {
      var idx = state.dones.findIndex((e) => e.id === done.id)
      state.dones.splice(idx, 1)
    }
  },


  getters: {
    user: state => state.user,
    isAuthed: state => !!state.user.id,
    isAdmin: state => state.user.type >= USER_TYPE.ADMIN,
    isSuperAdmin: state => state.user.type === USER_TYPE.SUPER_ADMIN,
    undos: state => state.undos,
    dones: state => state.dones,
  },


  actions: {
    getUser({commit}) {
      new Promise((resolve, reject) => {
          Vue.prototype.axios.get('/user/profile')
            .then(response => resolve(response))
            .catch(() => reject());
      }).then(response => {
          commit('changeUser', {user: response.data.data.user || {}});
      }).catch(() => commit('changeUser', {user: {}}))
    },
    changeLoginModalVisiable({commit}, playload) {
      commit('changeLoginModalVisiable', playload)
    },
    changeRegisterModalVisiable({commit}, playload) {
      commit('changeRegisterModalVisiable', playload)
    },
    changeUser({commit}, playload) {
      commit('changeUser', playload);
    },
    addUndo({commit}, playload) {
      commit('addUndo', playload);
    },
    addDone({commit}, playload) {
      commit('addDone', playload);
    },
    removeUndo({commit}, playload) {
      commit('removeUndo', playload);
    },
    removeDone({commit}, playload) {
      commit('removeDone', playload);
    },
    clearAll({commit}) {
      commit('changeUser', {});
      commit('setUndos', {undos: []});
      commit('setDones', {dones: []});
    }
  },


  strict: process.env.NODE_ENV !== 'production'
})
