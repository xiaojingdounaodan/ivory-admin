import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  state: {
    clinic: '',
    patientList: null,
    casesList: null
  },
  mutations: {
    setClinic(state, data) {
      state.clinic = data
    },
    setPatientList(state, data) {
      state.patientList = data
    },
    clearPatientList(state) {
      state.patientList = null
    },
    setCasesList(state, data) {
      state.casesList = data
    },
    clearCasesList(state) {
      state.casesList = null
    }
  },
  actions: {
    setClinic(store, data) {
      store.commit('setClinic', data)
    },
    setPatientList(store, data) {
      store.commit('setPatientList', data)
    },
    clearPatientList(store) {
      store.commit('clearPatientList')
    },
    setCasesList(store, data) {
      store.commit('setCasesList', data)
    },
    clearCasesList(store) {
      store.commit('clearCasesList')
    }
  }
})

export default store
