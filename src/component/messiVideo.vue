<template>
    <div class="row">
        <!--<div>改用在后台用nodejs发web request试试 傻逼直播吧开发因为跨域server端callback json却返回了字符串导致我不能做梅西单独的视频，傻逼！ 害我在网上查了一晚上，结果不是我的问题！！！</div>-->
        <div class="search-area">
            <input type="text" v-model="intervalDay" style="width:120px"></input>
            Days
            <button @click="moreVideoOnClick">More</button>
            <span style="color: #a8c6e2;font-weight: bold;margin-left:10px">
                        {{'Min Time: '+_currentMinDateString}}
                    </span> {{requestStatus}}
        </div>
        <div class="content-container leo-container">
            <div v-for="n in leoVideo" v-bind:key="n">
                <a :href="n.url" target="_blank">{{n.title}}</a>
                <!--<span>{{n.time}}</span>-->
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import url from '../../server/url'
export default {
    name: 'messiVideo',
    data() {
        return {
            leoVideo: [],
            intervalDay: 10,
            currentMinDate: new Date(),
            requestStatus: ''
        }
    },
    computed: {
        _currentMinDateString: function () {
            var date = this.currentMinDate;
            return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
        }
    },
    methods: {
        getMoreVideo: function () {
            var self = this;
            self.requestStatus = 'loading...';
            axios.post(url.getMoreVideoData, { currentMinDate: self.currentMinDate, intervalDay: self.intervalDay })
                .then(resp => {
                    self.$nextTick(function () {
                        self.leoVideo = self.leoVideo.concat(resp.data.data.source)
                        self.currentMinDate = new Date(resp.data.data.minDate)
                        self.requestStatus = '';
                    })
                }).catch(err => {
                    console.error(err)
                })
        },

        moreVideoOnClick: function () {
            this.getMoreVideo();
        }
    },
    mounted: function () {
        this.getMoreVideo();
    }
}
</script>

<style>

</style>

