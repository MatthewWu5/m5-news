<template>
    <div class="row">
        <div>改用在后台用nodejs发web request试试</div>
        傻逼直播吧开发因为跨域server端callback json却返回了字符串导致我不能做梅西单独的视频，傻逼！
        害我在网上查了一晚上，结果不是我的问题！！！
        <div v-for="n in leoVideo" v-bind:key="n">
            <a :href="n.url" target="_blank">{{n.title}}</a>
            <span>{{n.time}}</span>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: 'messiVideo',
    data() {
        return {
            leoVideo: [],
        }
    },
    mounted: function () {
        return;
        var ajaxPromise = function (url) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    jsonp: "callback",
                    success: function (data) {
                        debugger;
                        console.log(data)
                        console.log('get resp')
                        let jsonData = JSON.parse(data)
                        let videoData = jsonData.video_arr.filter(x => x.type == 'zuqiujijin' && x.lable.indexOf('梅西') != -1);
                        let _leoData = getFormatNewsData(videoData)
                        console.log(_leoData)
                        resolve(_leoData)
                    },
                    error: function (err) {
                        console.log(err)
                        console.log('get err')
                    }
                })
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
        }

        var self = this;
        debugger;
        Promise.all([ajaxPromise('https://www.zhibo8.cc/zuqiu/json/2017-07-20.htm'), ajaxPromise('https://www.zhibo8.cc/zuqiu/json/2017-07-19.htm')]).then(function (res) {
            console.log(res)
            console.log('get res')
            res.forEach(x => {
                self.leoVideo = self.leoVideo.concat(x)
            })
            console.log(self.leoVideo)
            console.log('get leo')
        })
    }
}
</script>

<style>

</style>

