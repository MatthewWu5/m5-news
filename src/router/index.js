import Vue from 'vue'
import Router from 'vue-router'

import FootballNews from '../components/footballNews.vue'
import MessiVideo from '../components/messiVideo.vue'
import NewsBase from '../components/newsBase.vue'
import LiveMatch from '../components/liveMatch.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/news/football'
        },
        {
            path: '/news',
            name: 'NewsBase',
            component: NewsBase,
            children: [
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
        }
    ]
})