<template>
    <div>
        <h>c1 - Jsonp test</h>
        <div>{{jsonpResult}}
        </div>
        <router-link :to="{name: 'Component2'}">Redirect to Component2</router-link>
    </div>
</template>


<script>
import $ from 'jquery'
export default {
    name: 'c1',
    data() {
        return {
            jsonpResult: 'loading...',
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
    created() {
        this.testCrossDomain();
    }
}
</script>
