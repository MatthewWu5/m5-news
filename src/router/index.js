import FootballNews from '../components/footballNews.vue'
import MessiVideo from '../components/messiVideo.vue'
import NewsBase from '../components/newsBase.vue'
import LiveMatch from '../components/liveMatch.vue'

import Index from '../components/Index.vue'

const routes = [
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
        component: Index
      }
    ]
  }
]

export default routes