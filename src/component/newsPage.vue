<template>
    <div class="newsPage">
        <button @click="OnBackClick">Back</button>
        <button v-show="comments && comments.length>0" @click="OnCommentClick">{{'Comment:'+showComment}}</button>
        <div class="news-page-container">
            <swipe ref="mySwipe" :speed="100" :default-index="1" :auto="0" :continuous="false" :show-indicators="false" @change="changeSwipe">
                <swipe-item>Previous to home page...</swipe-item>
                <swipe-item>
                    <div class="page">
                        <div class="time">{{time}}</div>
                        <div v-html="_page"></div>
                    </div>
                </swipe-item>
                <swipe-item>
                    <div class="comment" v-if="comments && comments.length>0">
                        <div class="row" v-for="comment in comments" v-bind:key="comment">
                            <div>{{comment.content}}</div>
                            <div>
                                <span>{{comment.up}}</span>-
                                <span>{{comment.down}}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else>'in comment swipe' To home page...</div>
                </swipe-item>
                <swipe-item v-if="comments && comments.length>0">To home page...</swipe-item>
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
        },
        // _showCommentFlag: function() {
        //     if (this.showComment) {
        //         this.$refs.mySwipe.goto(2)
        //     }
        //     return this.showComment
        // }
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
        GotoPageContent: function() {
            this.$refs.mySwipe.goto(1)
        },
        GotoPageComment: function() {
            if (this.comments && this.comments.length > 0) {
                this.$refs.mySwipe.goto(2)
            }
            else {
                this.$refs.mySwipe.goto(1)
            }
        },
        OnCommentClick: function() {
            console.log(this.showComment)
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
                if (this.comments && this.comments.length > 0) {
                    this.showComment = true
                } else {
                    this.$refs.mySwipe.goto(1)
                    this.OnBackClick()
                }
            }
            else if (oldIndex == 2 && newIndex == 1) {
                if (this.comments && this.comments.length > 0) {
                    this.showComment = false
                }
            }
            else if (oldIndex == 2 && newIndex == 3) {
                this.$refs.mySwipe.goto(1)
                this.OnBackClick()
            }
        }
    },
}

</script>
<style>
.newsPage {
    margin-left: -15px;
}

.page img:not(.jijin-img) {
    /*width: 600px;
    height: 300px;
    max-width: 1000px !important;*/
}

.news-page-container,
.news-page-container .page,
.news-page-container .comment {
    height: 900px;
}

.news-page-container .page,
.news-page-container .comment {
    margin-top: 10px;
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
    margin-left: 0px;
    border-bottom: solid 1px #a8c6e2;
    position: relative;
}

.news-page-container .comment .row>div:nth-child(2) {
    position: absolute;
    right: 0;
    bottom: 0;
}

.news-page-container .comment .row>div:nth-child(2)>span:nth-child(1) {
    color: #3694ec;
}

.news-page-container .comment .row>div:nth-child(2)>span:nth-child(2) {
    color: #404448;
    margin-left: -13px;
}

@media (max-width: 992px) {
    .page,
    .comment {
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 0px;
    }
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
        margin-bottom: 20px;
    }
    .news-page-container .comment .row {
        border-bottom: solid 2px #a8c6e2;
    }
    .news-page-container .page img:not(.jijin-img) {
        /*width: 920px;*/
        /*height: 460px;*/
        width: 100%;
        max-width: initial !important;
    }
}
</style>
