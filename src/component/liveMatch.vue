<template>
    <!--https://www.zhiboba.com-->
    <div>
        <div v-show="!gotoPage">
            <div class="search-area">
                <button @click="OnGoPageClick">Page</button>
                <span style="margin-left:10px">{{requestStatus}}</span>
            </div>
            <div class="liveMatch content-container">
                <div v-for="item in liveData" v-bind:key="item">
                    <div>{{item.date}}</div>
                    <div v-for="m in item.match" v-bind:key="m" class="live-link-overflow">
                        <!--<a v-bind:href="m.href" target="_blank" :class="getClass(m)">{{m.text}}</a>-->

                        <!--do not use <a> it will load footballNews.vue, i don't know why-->
                        <!--<a href="#" :class="getClass(m)" @click="OnLivePageClick(m)">{{m.text}}</a>-->
                        <p class="p-link" :class="getClass(m)" @click="OnLivePageClick(m)">{{m.text}}</p>
                    </div>
                </div>
            </div>
        </div>
        <newsPage :page="page" :comments="comments" :showComment="showComment" v-show="gotoPage" v-on:listenToChildEvent="messageFromChild"></newsPage>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import url from '../../server/url'
import newsPage from './newsPage'
export default {
    name: 'liveMatch',
    components: { newsPage },
    data() {
        return {
            liveData: [],
            requestStatus: '',
            page: '',
            comments: [],
            gotoPage: false,
            showComment: false,
        }
    },
    created: function() {
        var self = this
        self.requestStatus = 'loading'
        axios.post(url.getLiveData).then(resp => {
            self.$nextTick(function() {
                self.liveData = resp.data.data
                self.requestStatus = ''
            })
        }).catch(err => {
            console.error(err)
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
            self.requestStatus = 'goto page...'
            axios.post(url.getLivePageData, { host: host, path: path })
                .then(resp => {
                    self.$nextTick(function() {
                        self.page = resp.data.data.page
                        self.comments = resp.data.data.comments
                        self.requestStatus = ''
                        self.gotoPage = true
                        //self.$refs,newsPage.ScrollTop()
                    })
                }).catch(err => {
                    console.error(err)
                })
        },
        OnGoPageClick: function() {
            this.gotoPage = !this.gotoPage
            this.showComment = false
        },
        messageFromChild: function() {
            this.gotoPage = false
        },
    }
}
</script>
<style>
.live-link-overflow {
    height: 70px;
    overflow-y: hidden;
}

.live-link-overflow>p.my-follow {
    color: #12abf7;
    font-weight: bolder;
}

.p-link {
    color: #337ab7;
}
</style>
