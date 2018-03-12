import {
  APP_LOADING_START
} from '../mutations-types/appLoading'

const mainScreen = {
  state: {
    isShown: false
  },
  mutations: {
    [APP_LOADING_START] (state) {
      Object.assign(state, {isShown: true})
    }
  },
  actions: {}
}
export default mainScreen
