import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    objImg: undefined,
    boxes: []
  },
  mutations: {
    setObjImg (state, val) {
      state.objImg = val
    },
    
    setBoxes (state, val) {
      state.boxes = val
    }
  }
})
