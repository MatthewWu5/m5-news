import Vue from 'vue'
import Vonic from 'vonic/src/index.js'
import routes from './router'

Vue.use(Vonic.app, {
  routes: routes
})
