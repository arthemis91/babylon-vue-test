import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import login from './modules/login'
import appLoading from './modules/appLoading'
import mapScreen from './modules/mapScreen'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules: {
    login: login,
    appLoading: appLoading,
    mapScreen: mapScreen
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
