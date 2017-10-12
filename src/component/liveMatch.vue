<template>
    <div>
        <!--https://www.zhibo8.cc/index.html-->
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import url from '../../server/url'
export default {
    name: 'liveMatch',
    created: function() {
        axios.post(url.getLiveData).then(resp => {
            console.log(resp.data.data)
        }).catch(err => {
            console.error(err)
        })
    }
}
</script>
<style>

</style>
