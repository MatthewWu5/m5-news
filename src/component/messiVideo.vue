<template>
    <div class="row">
        <!--<div>改用在后台用nodejs发web request试试 傻逼直播吧开发因为跨域server端callback json却返回了字符串导致我不能做梅西单独的视频，傻逼！ 害我在网上查了一晚上，结果不是我的问题！！！</div>-->
    
        <input type="text" v-model="intervalDay" style="width:120px"></input>
        Days
        <button @click="moreVideoOnClick">More</button>
        <span style="color: #a8c6e2;font-weight: bold;margin-left:10px">
                                          {{'Min Time: '+_currentMinDateString}}
                                        </span> {{requestStatus}}
        <div class="content-container">
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
        formatRequestDate: function (minDate, index) {
            let date = new Date(minDate)
            date.setDate(date.getDate() - index);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            return date.getFullYear() + '-' + month + '-' + day;
        },

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
            return;




            this.$nextTick(function () {
                if (self.intervalDay > 100) self.intervalDay = 100;
                var promiseArray = [];
                for (var i = 0; i < self.intervalDay; i++) {
                    promiseArray.push(self.moreVideoRequest(self.formatRequestDate(self.currentMinDate, i)));
                }
                Promise.all(promiseArray).then(function (resps) {
                    console.log(resps)
                    resps.forEach(x => {
                        if (x) {
                            self.leoVideo = self.leoVideo.concat(x)
                        }
                    })
                    self.currentMinDate.setDate(self.currentMinDate.getDate() - self.intervalDay);
                    self.requestStatus = '';
                }).catch(err => {
                    console.log('Promise.all error:')
                    console.log(err)
                })
            })
        },

        moreVideoRequest: function (date) {
            return new Promise((resolve, reject) => {
                // axios.post(url.getJsonData, { host: 'news.zhibo8.cc', path: '/zuqiu/json/2017-07-20.htm' })
                axios.post(url.getJsonData, { host: 'www.zhibo8.cc', path: '/zuqiu/json/' + date + '.htm' })
                    .then(resp => {
                        let respData = resp.data;
                        let videoData = respData.data.video_arr.filter(x => x.type == 'zuqiujijin' && x.lable.indexOf('梅西') != -1);
                        let _leoData = getFormatNewsData(videoData)
                        resolve(_leoData)
                    }).catch(err => {
                        reject(err);
                    })

                let getFormatNewsData = function (rawData) {
                    return rawData.map(function (x) {
                        return {
                            title: x.title,
                            url: 'https://www.zhibo8.cc' + x.url,
                            time: formatTime(x.updatetime),
                        }
                    })
                }

                let formatTime = function (dateTime) {
                    let date = new Date(dateTime)
                    return date.getMonth() + 1 + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
                }
            }).catch(err => {
                console.error(err);
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

