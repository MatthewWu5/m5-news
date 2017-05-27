import Vue from 'vue'
import Router from 'vue-router'

import Base from '../component/base.vue'
import Component1 from '../component/c1.vue'
import Component2 from '../component/c2.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/pages/'
        },
        {
            path: '/pages',
            name: 'Base',
            component: Base,
            children: [
                {
                    path: '',
                    redirect: '/pages/home'
                },
                {
                    path: 'home',
                    name: 'HomeView',
                    component: Component1
                },
                {
                    path: 'c2',
                    name: 'Component2',
                    component: Component2
                },
            ]
        },
        {
            path: '*',
            redirect: '/pages/'
        }
    ]
    // routes: [
    //     {
    //         path: '/test1',
    //         component: Component1
    //     },
    //     {
    //         path: '/test2',
    //         component: Component2
    //     }]
})