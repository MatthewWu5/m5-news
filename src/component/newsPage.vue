<template>
    <div class="newsPage">
        <button @click="OnBackClick">Back</button>
        <button v-show="comments && comments.length>0" @click="showComment">{{'Comment:'+showComment}}</button>
        <div class="news-page-container">
            <swipe ref="mySwipe" :speed="100" :default-index="1" :auto="0" :continuous="false" :show-indicators="false" @change="changeSwipe">
                <swipe-item></swipe-item>
                <swipe-item>
                    <div class="page">
                        <div class="time">{{time}}</div>
                        <div v-html="_page"></div>
                    </div>
                </swipe-item>
                <swipe-item v-if="comments && comments.length>0">
                    <div class="comment">
                        <div class="row" v-for="comment in comments" v-bind:key="comment">
                            <div class="col-sm-2" style="color:#a8c6e2">{{comment.up}}</div>
                            <div class="col-sm-10">{{comment.content}}</div>
                        </div>
                    </div>
                </swipe-item>
            </swipe>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
// require('vue-swipe/dist/vue-swipe.css')
// import { Swipe, SwipeItem } from 'vue-swipe'
import { Swipe, SwipeItem } from '../lib/vue-swipe'
export default {
    name: 'newsPage',
    components: { Swipe, SwipeItem },
    props: {
        page: String,
        comments: Array,
        showComment: Boolean,
        time: String,
    },
    data() {
        return {
            //showComment: false
        }
    },
    computed: {
        _page: function() {
            if (this.page) {
                this.showComment = false;
                var container = $('<div></div>')
                //TODO: ineffective scroll top
                $('.page').scrollTop(0)
                $('.comment').scrollTop(0)

                $(this.page).each(function(index, element) {
                    container.append($(element))
                })
                return container.html()
            }
        }
    },
    methods: {
        OnBackClick: function() {
            this.$emit('listenToChildEvent')
        },
        ScrollTop: function() {
            //TODO: how to call subcomponent's method by parent
            console.log('ScrollTop', $('.page'))
            $('.page').scrollTop(0)
            $('.comment').scrollTop(0)
        },
        showComment: function() {
            if (this.showComment) {
                this.$refs.mySwipe.goto(1)
            } else {
                this.$refs.mySwipe.goto(2)
            }
            this.showComment = !this.showComment
        },
        changeSwipe: function(newIndex, oldIndex) {
            if (oldIndex == 1 && newIndex == 0) {
                this.$refs.mySwipe.goto(1)
                this.OnBackClick()
            }
            else if (oldIndex == 1 && newIndex == 2) {
                this.showComment = true
            }
            else if (oldIndex == 2 && newIndex == 1) {
                this.showComment = false
            }
        }
    },
}

</script>
<style>
.newsPage {
    margin-left: -15px;
}

.comment {
    margin-top: 10px;
    margin-right: 20px;
}

.page {
    margin-top: 10px
}

.page img:not(.jijin-img) {
    width: 600px;
    height: 300px;
    max-width: 1000px !important;
}

.news-page-container,
.news-page-container .page,
.news-page-container .comment {
    height: 900px;
}

.news-page-container .page,
.news-page-container .comment {
    overflow: auto;
    padding-bottom: 40px;
}

.news-page-container {
    border-bottom: solid 1px #a8c6e2;
}

.news-page-container .comment .row {
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-bottom: solid 1px #a8c6e2
}

@media (max-width: 992px) {
    .newsPage>button {
        display: none;
    }
    .news-page-container {
        font-size: 50px;
        border-bottom: solid 2px #a8c6e2;
    }
    .news-page-container,
    .news-page-container .page,
    .news-page-container .comment {
        height: 1360px !important;
    }
    .news-page-container .page .time {
        font-size: 40px;
    }
    .news-page-container .page h1 {
        font-size: 40px;
        margin-bottom: 20px
    }
    .news-page-container .comment .row {
        border-bottom: solid 2px #a8c6e2
    }
    .news-page-container .page img:not(.jijin-img) {
        width: 920px;
        height: 460px;
    }
}
</style>
