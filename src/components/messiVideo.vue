<template>
    <div class="">
        <div class="tool-bar">
            <button class="button button-positive button-clear button-small" @click="showActionSheet">Days</button>
            <span class="min-time">
                {{'Min Time: '+_currentMinDateString}}
            </span>
        </div>
        <list class="content-container">
            <item v-for="item in this.leoVideo" v-bind:key="item">
                <a :href="item.url" target="_blank">{{item.title}}</a>
                <span class="item-note">{{item.time}}</span>
            </item>
        </list>
    </div>
</template>

<script>
import axios from '../lib/_axios'
import url from '../utils/url'
export default {
    name: 'messiVideo',
    data() {
        return {
            leoVideo: [],
            currentMinDate: new Date(),
        }
    },
    computed: {
        _currentMinDateString: function() {
            var date = this.currentMinDate;
            return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
        }
    },
    methods: {
        getMoreVideo(intervalDay = 10) {
            var self = this;
            axios.get(url.getMoreVideoData, { params: { currentMinDate: self.currentMinDate, intervalDay: intervalDay } })
                .then(resp => {
                    self.$nextTick(function() {
                        self.leoVideo = self.leoVideo.concat(resp.data.data.source)
                        self.currentMinDate = new Date(resp.data.data.minDate)
                    })
                })
        },

        showActionSheet() {
            $actionSheet.show({
                theme: '', //ios
                title: 'Interval days',
                buttons: {
                    '10': () => {
                        this.getMoreVideo()
                    },

                    '20': () => {
                        this.getMoreVideo(20)
                    },

                    '30': () => {
                        this.getMoreVideo(30)
                    }
                }
            })
        }
    },
    mounted: function() {
        this.getMoreVideo();
    }
}
</script>
<style lang="scss">
$container-height-phone: 592px;

.content-container {
    height: $container-height-phone;
}
</style>

