<template>
    <div>
        <!--<div v-for="fn in footballNews">
                                        <FootballNews :catagory="fn.catagory" :news="fn.news">    
                                        </FootballNews>
                                    </div>-->
        <!--<router-link :to="{name: 'Component2'}">Component2</router-link>-->
    </div>
</template>


<script>
import $ from 'jquery'
import FootballNews from './footballNews'
export default {
    name: 'c1',
    components: { FootballNews },
    data() {
        return {
            jsonpResult: 'loading...',
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
                url: 'https://www.zhibo8.cc/zuqiu/json/2017-07-20.htm?callback=jCallback&message=Hello',
                dataType: "jsonp",
                // jsonp: "callback",
                // jsonpCallback: 'jCallback',
                processData: false,

                type: 'get',

                data: "{}",
                success: function (data) {
                    console.log(data)
                    this.jsonpResult = data
                },
                error: function (err, res) {
                    console.log(err, res)
                    console.log('err')
                }
            })

            // $.getJSON('https://api.douban.com/v2/movie/in_theaters?callback=?', function (res) {
            //     console.log(res)
            // })
        }
    },
    created: function () {
        this.testCrossDomain()
    }
}
</script>
