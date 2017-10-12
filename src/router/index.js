import Vue from 'vue'
import Router from 'vue-router'

import Base from '../component/base.vue'
import Component1 from '../component/c1.vue'
import Component2 from '../component/c2.vue'
import FootballNews from '../component/footballNews.vue'
import MessiVideo from '../component/messiVideo.vue'
import NewsBase from '../component/newsBase.vue'
import LiveMatch from '../component/liveMatch.vue'
import Video from '../component/video.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/news/'
        },
        {
            path: '/news',
            name: 'NewsBase',
            component: NewsBase,
            children: [
                {
                    path: '',
                    redirect: '/news/football'
                },
                {
                    path: 'football',
                    name: 'FootballNews',
                    component: FootballNews
                },
                {
                    path: 'leoVideo',
                    name: 'MessiVideo',
                    component: MessiVideo
                },
                {
                    path: 'liveMatch',
                    name: 'LiveMatch',
                    component: LiveMatch
                },
            ]
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
            path: '/video',
            name: 'Video',
            component: Video,
        },
        // {
        //     path: '*',
        //     redirect: '/news/'
        // }
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