<template>
    <div>
        <button @click="OnBackClick">Back</button>
        <button @click="showComment = !showComment">{{'showComment:'+showComment}}</button>
        <div class="news-page-container">
            <div class="page" v-show="!showComment">
                <div class="time">{{time}}</div>
                <div v-html="_page"></div>
            </div>
            <div class="comment" v-show="showComment">
                <div class="row" v-for="comment in comments" v-bind:key="comment">
                    <div class="col-sm-2" style="color:#a8c6e2">{{comment.up}}</div>
                    <div class="col-sm-10">{{comment.content}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: 'newsPage',
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
        _page: function () {
            if (this.page) {
                this.showComment = false;
                var container = $('<div></div>')
                //TODO: ineffective scroll top
                $('.page').scrollTop(0)
                $('.comment').scrollTop(0)

                $(this.page).each(function (index, element) {
                    container.append($(element))
                })
                return container.html()
            }
        }
    },
    methods: {
        OnBackClick: function () {
            this.$emit('listenToChildEvent')
        },
        ScrollTop: function () {
            //TODO: how to call subcomponent's method by parent
            console.log('scroll top')
            $('.page').scrollTop(0)
            $('.comment').scrollTop(0)
        }
    }
}

</script>
<style>
.comment {
    margin-top: 10px;
    margin-right: 20px;
}

.page {
    margin-top: 10px
}

.page img {
    width: 800px;
    height: 400px;
    max-width: 1000px !important;
}

@media (max-width: 992px) {
    .news-page-container {
        font-size: 50px;
        height: 1320px;
        border-bottom: solid 2px #a8c6e2;
    }
    .news-page-container .page {
        height: 1320px;
        overflow: auto;
    }
    .news-page-container .page .time {
        font-size: 40px;
    }
    .news-page-container .comment {
        height: 1320px;
        overflow: auto;
    }
    .news-page-container .page h1 {
        font-size: 40px;
        margin-bottom: 20px
    }
    .news-page-container .comment .row {
        margin-top: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-bottom: solid 2px #a8c6e2
    }
}
</style>
