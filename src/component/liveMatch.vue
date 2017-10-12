<template>
    <!--https://www.zhiboba.com-->
    <div class="liveMatch content-container">
        <div>{{status}}</div>
        <div v-for="item in liveData" v-bind:key="item">
            <div>{{item.date}}</div>
            <div v-for="m in item.match" v-bind:key="m" class="live-link-overflow">
                <a v-bind:href="m.href" target="_blank" :class="getClass(m)">{{m.text}}</a>
                <!--<a href="#" :class="getClass(n)" @click="OnPageClick(n)">{{n.title}}</a>-->
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import url from '../../server/url'
export default {
    name: 'liveMatch',
    data() {
        return {
            status: '',
            liveData: []
        }
    },
    created: function() {
        var self = this
        self.status = 'loading'
        axios.post(url.getLiveData).then(resp => {
            self.$nextTick(function() {
                self.liveData = resp.data.data
                self.status = ''
            })
        }).catch(err => {
            console.error(err)
        })
    },
    methods: {
        getClass: function(m) {
            if (m.myFollow) {
                return 'my-follow'
            }
            return ''
        },
    }
}
</script>
<style>
.live-link-overflow {
    height: 70px;
    overflow-y: hidden;
}

.my-follow {
    color: #12abf7;
    font-weight: bolder;
}
</style>
