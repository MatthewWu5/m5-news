<template>
    <div class="row">
        <!--<div>改用在后台用nodejs发web request试试 傻逼直播吧开发因为跨域server端callback json却返回了字符串导致我不能做梅西单独的视频，傻逼！ 害我在网上查了一晚上，结果不是我的问题！！！</div>-->
    
        <input type="text" placeholder="10 Days" v-model="intervalDay"></input>
        <button @click="moreVideoOnClick">More</button>
        <div v-for="n in leoVideo" v-bind:key="n">
            <a :href="n.url" target="_blank">{{n.title}}</a>
            <span>{{n.time}}</span>
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
            currentMinDate,
        }
    },
    methods: {
        //can not set data
        getMoreVideo: function () {
            debugger;
            var self = this;
            this.$nextTick(function () {
                debugger;
                if (self.currentMinDate == '') {
                    self.currentMinDate = new Date();
                }
                if (self.intervalDay > 30) self.intervalDay = 30;

                var promiseArray = [];
                for (var i = 0; i < self.intervalDay; i++) {
                    console.log('in: ')
                    console.log(formatRequestDate)
                    console.log(self.moreVideoRequest)
                    promiseArray.push(self.moreVideoRequest(formatRequestDate(self.currentMinDate, i)));
                }
                console.log(promiseArray)
                console.log('promiseArray')
                Promise.all(promiseArray).then(function (resps) {
                    resps.forEach(x => {
                        self.leoVideo = self.leoVideo.concat(x)
                    })
                    self.currentMinDate.setDate(self.currentMinDate.getDate() - self.intervalDay);
                }).catch(err => {
                    console.log('Promise.all error:')
                    console.log(err)
                })

                let formatRequestDate = function (minDate, index) {
                    console.log(minDate)
                    console.log('minDate')
                    let date = new Date(minDate)
                    date.setDate(date.getDate() - index);
                    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                }
            });
        },

        moreVideoRequest: function (date) {
            return new Promise((resolve, reject) => {
                // axios.post(url.getNewsData, { host: 'news.zhibo8.cc', path: '/zuqiu/json/2017-07-20.htm' })
                axios.post(url.getNewsData, { host: 'www.zhibo8.cc', path: '/zuqiu/json/' + date + '.htm' })
                    .then(resp => {
                        let respData = resp.data;
                        let videoData = respData.data.video_arr.filter(x => x.type == 'zuqiujijin' && x.lable.indexOf('梅西') != -1);
                        let _leoData = getFormatNewsData(videoData)
                        resolve(_leoData)
                    })
                    .catch(err => {
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
                console.log(err);
                console.log('internal error')
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

