import {
  LOGIN_REQUEST,
  LOGIN_SUCCES,
  LOGIN_FAIL,
  LOGIN_ALREADY_DONE
} from '../mutations-types/login'

import {
  APP_LOADING_START
} from '../mutations-types/appLoading'

import {
  fbLogin
} from '../../socials/facebook.js'

import {
  vkLogin
} from '../../socials/vkontakte.js'

const login = {
  state: {
    isShown: true,
    disabled: false,
    alreadyLogged: false,
    error: ''
  },
  mutations: {
    [LOGIN_REQUEST] (state) {
      Object.assign(state, {disabled: true, error: ''})
    },
    [LOGIN_SUCCES] (state, { userId, network }) {
      this.commit(APP_LOADING_START, {userId: userId, network: network})
      Object.assign(state, {isShown: false, error: ''})
    },
    [LOGIN_FAIL] (state, { error }) {
      Object.assign(state, {disabled: false, error: error})
    },
    [LOGIN_ALREADY_DONE] (state, { userId, network }) {
      this.commit(APP_LOADING_START, {userId: userId, network: network})
      Object.assign(state, {isShown: false, userId: userId, alreadyLogged: network})
    }
  },
  actions: {
    alreadyLogged ({ commit, state }, { userId, network }) {
      commit(LOGIN_ALREADY_DONE, {userId: userId, network: network})
    },
    tryLogin ({ commit, state }, network) {
      switch (network) {
        case 'vk':
          commit(LOGIN_REQUEST)
          vkLogin().then(response => {
            if (response.session) {
              commit(LOGIN_SUCCES, {userId: response.session.user.id, network: 'vk'})
            } else {
              commit(LOGIN_FAIL, {error: 'Authorisation error'})
            }
          }, () => commit(LOGIN_FAIL, {error: 'Authorisation error'}))
          break
        case 'fb':
          if (state.alreadyLogged === 'fb') {
            commit(LOGIN_SUCCES, {userId: state.userId, network: 'fb'})
            break
          }
          commit(LOGIN_REQUEST)
          fbLogin().then(response => {
            if (response.status === 'connected') {
              commit(LOGIN_SUCCES, {userId: response.id, network: 'fb'})
            } else {
              commit(LOGIN_FAIL, {error: 'Authorisation error'})
            }
          }, () => commit(LOGIN_FAIL, {error: 'Authorisation error'}))
          break
      }
    }
  }
}
export default login
