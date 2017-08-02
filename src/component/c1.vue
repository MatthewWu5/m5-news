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
            // this.$http.jsonp('https://api.douban.com/v2/movie/in_theaters')
            //     .then(function (response) {
            //         this.guodu = false
            //         this.in_theaters_data = response
            //         this.in_theaters_data_body = response.body
            //         this.in_theaters_data_body_subjects = response.body.subjects
            //     })
            //     .catch(function (response) {
            //         console.log(response)
            //     })

            function jCallback(result) {
                console.log(result)
                console.log('jCallback')
            }

            $.ajax({
                // url: 'https://api.douban.com/v2/movie/in_theaters',
                //wrong way by zhibo8 site
                // url: 'https://www.zhibo8.cc/zuqiu/json/2017-07-20.htm',
                url: 'https://news.zhibo8.cc/zuqiu/json/2017-07-20.htm',
                dataType: "jsonp",
                jsonp: "callback",
                // jsonpCallback: 'jCallback',
                success: function (data) {
                    this.ajaxResult = data
                    console.log(data)
                },
                error: function (err, res) {
                    console.log(err, res)
                    console.log('err')
                }
            })

            // $.getJSON('https://api.douban.com/v2/movie/in_theaters?callback=?', function (res) {
            //     console.log(res)
            // })
        },

        axiosRequest: function () {
            return new Promise((resolve, reject) => {
                // axios.post(url.getNewsData, { host: 'news.zhibo8.cc', path: '/zuqiu/json/2017-07-20.htm' })
                axios.post(url.getNewsData, { host: 'www.zhibo8.cc', path: '/zuqiu/json/2017-07-20.htm' })
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
        //this.testCrossDomain()

        var self = this;
        this.axiosRequest().then(function (res) {
            self.ajaxResult = res;
        })
    }
}
</script>
