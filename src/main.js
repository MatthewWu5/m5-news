import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import VueResource from 'vue-resource'

// Vue.use(VueResource)

//obsolete in vue2
Vue.config.debug = true;

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
