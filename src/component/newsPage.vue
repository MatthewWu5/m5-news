<template>
    <div>
        <button @click="OnBackClick">Back</button>
        <button @click="showComment = !showComment">{{'showComment:'+showComment}}</button>
        <div class="news-page-container">
            <div class="page" v-html="_page" v-show="!showComment" style="margin-top:10px"></div>
            <div class="comment" v-show="showComment">
                <div class="row" v-for="comment in comments" v-bind:key="comment" style="margin-top:10px;margin-bottom:10px;border-bottom:solid 2px #a8c6e2">
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
    },
    data() {
        return {
            showComment: false
        }
    },
    computed: {
        _page: function () {
            if (this.page) {
                this.showComment = false;
                var container = $('<div></div>')
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
        }
    }
}

</script>
<style>
.comment {
    margin-top: 10px;
    margin-right: 20px;
}
.page img{
    width:800px;
    height:400px
}
</style>
