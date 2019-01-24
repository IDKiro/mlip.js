import Vue from 'vue'
import Vuetify from 'vuetify'
import vuescroll from 'vuescroll'
import 'vuetify/src/stylus/app.styl'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '../assets/icons/style.css'
import 'vuescroll/dist/vuescroll.css'


Vue.use(Vuetify, {
  iconfont: 'md'
})

Vue.use(vuescroll)
Vue.prototype.$vuescrollConfig = {
  bar: {
    background: '#2196F3    '
  }
}
