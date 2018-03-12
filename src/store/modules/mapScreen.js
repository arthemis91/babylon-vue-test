import {
  MAP_SCREEN_LOAD
} from '../mutations-types/mapScreen'

import {
  APP_LOADING_TASK_DONE
} from '../mutations-types/appLoading'

const mapScreen = {
  state: {
    isShown: false,
    needLoaded: 0,
    map: false,
    objects: [],
    loadedEvent: () => {}
  },
  mutations: {
    [MAP_SCREEN_LOAD] (state, {map, objects, loadedEvent, needLoaded}) {
      Object.assign(state, {
        isShown: true,
        map: map,
        objects: objects,
        loadedEvent: loadedEvent,
        needLoaded: needLoaded
      })
    },
    [APP_LOADING_TASK_DONE] (state, { id }) {
      if (id === 'mapPage') {
        state.needLoaded--
      }
    }
  },
  actions: {}
}
export default mapScreen
