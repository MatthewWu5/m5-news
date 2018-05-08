<template>
    <!--https://www.zhiboba.com-->
    <div>
        <a class="button button-positive button-clear button-small" href="https://www.zhibo8.cc/zuqiu/luxiang.htm">Record</a>

        <swipe ref="liveSwiper" class="live-swiper" :speed="100" :auto="0" :continuous="false" :show-indicators="false">
            <swipe-item>
                <div class="content-container">
                    <list v-for="item in endData" v-bind:key="item">
                        <item thin>
                            {{item.date}}
                        </item>
                        <item v-for="m in item.match" v-bind:key="m" class="live-link-overflow" :class="getClass(m)">
                            <a v-bind:href="m.highlight" target="_blank">{{m.text}}</a>
                        </item>
                    </list>

                    <list v-for="item in liveData" v-bind:key="item">
                        <item thin>
                            {{item.date}}
                        </item>
                        <item v-for="m in item.match" v-bind:key="m" class="live-link-overflow" @click.native="OnLivePageClick(m)" :class="getClass(m)">
                            {{m.text}}
                        </item>
                    </list>

                    <!--<a v-bind:href="m.href" target="_blank" :class="getClass(m)">{{m.text}}</a>-->

                    <!--do not use <a> it will load footballNews.vue, i don't know why-->
                    <!--<a href="#" :class="getClass(m)" @click="OnLivePageClick(m)">{{m.text}}</a>-->

                </div>
            </swipe-item>
            <swipe-item>
                <newsPage :page="page" :comments="comments"></newsPage>
            </swipe-item>
        </swipe>
    </div>
</template>

<script>
import axios from '../lib/_axios'
import url from '../utils/url'
import newsPage from './newsPage'
import { Swipe, SwipeItem } from '../lib/vue-swipe'
export default {
    name: 'liveMatch',
    components: { newsPage, Swipe, SwipeItem },
    data() {
        return {
            liveData: [],
            page: '',
            comments: [],
        }
    },
    created: function() {
        var self = this
        axios.get(url.getLiveData).then(resp => {
            self.$nextTick(function() {
                self.liveData = resp.data.data
            })
        })

        axios.get(url.getEndingData).then(resp => {
            self.$nextTick(function() {
                self.endData = resp.data.data
            })
        })
    },
    methods: {
        getClass: function(m) {
            if (m.myFollow) {
                return 'my-follow'
            }
            return ''
        },
        OnLivePageClick: function(n) {
            let host = n.host, path = n.path
            let self = this
            axios.get(url.getLivePageData, {
                params: {
                    host: host, path: path
                }
            }).then(resp => {
                self.$nextTick(function() {
                    self.page = resp.data.data.page
                    self.comments = resp.data.data.comments
                    this.$refs.liveSwiper.next()
                })
            })
        }
    }
}
</script>
<style lang="scss">
$container-height-phone: 592px;

.live-swiper {
    height: $container-height-phone !important;
    .content-container {
        height: 100%;
    }
}

.live-link-overflow.my-follow,
.live-link-overflow.my-follow>a {
    color: #4a90e2;
}

.live-link-overflow > a {
    color: #b5b5b5;
    text-decoration: initial;
}

.live-link-overflow {
    overflow-y: hidden;
}
</style>
