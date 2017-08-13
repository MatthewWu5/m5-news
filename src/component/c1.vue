<template>
    <div>
        <div>{{ajaxResult}}</div>
        <!--<router-link :to="{name: 'Component2'}">Component2</router-link>-->
    </div>
</template>


<script>
import $ from 'jquery'
import FootballNews from './footballNews'
import axios from 'axios'
import url from '../../server/url'
export default {
    name: 'c1',
    components: { FootballNews },
    data() {
        return {
            ajaxResult: 'loading...',
            fakeNews: [{ catagory: 'hehe', news: { title: '123', url: '1' } }],
        }
    },
    methods: {
        testCrossDomain: function () {
            // function jCallback(result) {
            //     console.log(result)
            //     console.log('jCallback')
            // }

            var self = this;
            $.ajax({
                // url: 'https://api.douban.com/v2/movie/in_theaters',
                //wrong way by zhibo8 site
                // url: 'https://www.zhibo8.cc/zuqiu/json/2017-07-20.htm',
                url: 'https://news.zhibo8.cc/zuqiu/json/2017-07-20.htm',
                dataType: "jsonp",
                jsonp: "callback",
                // jsonpCallback: 'jCallback',
                success: function (data) {
                    self.ajaxResult = data
                },
                error: function (err, res) {
                    console.error(err, res)
                }
            })

            // $.getJSON('https://news.zhibo8.cc/zuqiu/2017-08-13/599012840c5c0.htm?callback=?', function (res) {
            //     console.log(res)
            // })
        },

        axiosRequest: function () {
            return new Promise((resolve, reject) => {
                axios.post(url.getJsonData, { host: 'news.zhibo8.cc', path: '/zuqiu/2017-08-13/599012840c5c0.htm' })
                    // axios.post(url.getPageData, { host: 'news.zhibo8.cc', path: '/zuqiu/2017-08-12/598ec61e92a37.htm' })
                    .then(resp => {
                        resolve(resp.data);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        },
    },
    created: function () {
        this.testCrossDomain()

        // var self = this;
        // this.axiosRequest().then(function (res) {
        //     self.ajaxResult = res;
        // })
    }
}
</script>
