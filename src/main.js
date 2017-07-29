import Vue from 'vue'
//import axios from 'axios'
import App from './App.vue'
import router from './router'
import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css'
//import url from '../server/url'
// import VueResource from 'vue-resource'

// Vue.use(VueResource)

//obsolete in vue2
Vue.config.debug = true;
//Vue.prototype.url = url;

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  // data: {
  //   defaultStr: 'default page string...'
  // }
  // template: '<App/>',
  // components: { App }
})

//instead of router index init path
//router.push('test1')
