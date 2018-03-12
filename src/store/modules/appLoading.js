/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
import groundData from '../../assetsData/groundData.js'
import objectsData from '../../assetsData/objectsData.js'
import {
  APP_LOADING_START,
  APP_LOADING_TASK_DONE,
  APP_LOADING_DONE,
  APP_LOADING_NEED_TO_LOAD
} from '../mutations-types/appLoading'

import {
  MAP_SCREEN_LOAD
} from '../mutations-types/mapScreen'

const loadingMain = {
  state: {
    isShown: false,
    tasks: [
      {id: 'userInfo', done: false},
      {id: 'mapPage',
        done: false,
        mapData: {
          map: {
            heightMap: groundData[1].heightmap,
            texture: groundData[1].texture,
            width: 1000,
            height: 1000,
            subDiv: 100,
            minHeight: 0,
            maxHeight: 500
          },
          objects: Object.values(objectsData)
        }
      }
    ],
    network: '',
    userId: '',
    needToLoad: 0,
    loaded: 0
  },
  mutations: {
    [APP_LOADING_START] (state, { userId, network }) {
      Object.assign(state, {userId: userId, network: network, isShown: true})
      setTimeout(() => { this.dispatch('appStart') }, 100)
    },
    [APP_LOADING_DONE] (state) {
      state.isShown = false
    },
    [APP_LOADING_NEED_TO_LOAD] (state, { count }) {
      state.needToLoad += count
    },
    [APP_LOADING_TASK_DONE] (state, { id }) {
      state.loaded++
      if (state.loaded === state.needToLoad) {
        this.commit(APP_LOADING_DONE)
      }
    }
  },
  actions: {
    appStart ({ commit, state }) {
      commit('APP_LOADING_NEED_TO_LOAD', {count: 1})

      var mapData = state.tasks.find(task => task.id === 'mapPage').mapData,
        modelsIds = mapData.objects.map(function (model, index, self) {
          return model.id
        }),
        modelsLength = modelsIds.filter((value, index, self) => {
          return self.indexOf(value) === index
        }).length,
        mapTasksCount = 1 + modelsLength
      commit('APP_LOADING_NEED_TO_LOAD', {count: mapTasksCount})
      commit(MAP_SCREEN_LOAD, {
        map: mapData.map,
        objects: mapData.objects,
        needLoaded: mapTasksCount,
        loadedEvent: () => {
          commit('APP_LOADING_TASK_DONE', {id: 'mapPage'})
        }
      })
      commit(APP_LOADING_TASK_DONE, {id: 'userInfo'})
    }
  }
}
export default loadingMain
