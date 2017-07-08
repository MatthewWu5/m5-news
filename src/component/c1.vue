<template>
    <div>
    
        <FootballNews></FootballNews>
    
        <!--<div v-for="fn in footballNews">
                    <FootballNews :catagory="fn.catagory" :news="fn.news">    
                    </FootballNews>
                </div>-->
        <router-link :to="{name: 'Component2'}">Component2</router-link>
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
            $.ajax({
                url: 'https://api.douban.com/v2/movie/in_theaters',
                dataType: "jsonp",
                jsonp: "callback",
                success: function (data) {
                    console.log(data)
                    this.jsonpResult = data
                },
                error: function (err) {
                    console.log('err')
                    console.log(err)
                }
            })
        }
    },

}
</script>
