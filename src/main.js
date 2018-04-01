import Vue from 'vue'
//import axios from 'axios'
import App from './App.vue'
import router from './router'

//obsolete in vue2
Vue.config.debug = true;

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})

//instead of router index init path
//router.push('test')
