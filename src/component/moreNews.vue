<template>
    <div class="row">
        <div class="search-area">
            <button @click="OnClick">Barca</button>
            <button @click="OnClick">Mancity</button>
            <button @click="OnClick">All</button>
            <input type="text" placeholder="Search" v-model="searchKey"></input>
            <i class="fa fa-times" style="width:10px;height:10px;margin-left:-18px" @click="OnResetSearch"></i>
        </div>
        <div v-for="item in _filteredNews" v-bind:key="item" class="">
            {{item.category}}
            <div v-for="n in item.news" v-bind:key="n">
                <a :href="n.url" target="_blank" :class="n.isLeo?'leo-news-color':''">{{n.title}}</a>
                <span>{{n.time}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: 'footballNews',
    data() {
        return {
            footballNews: [],
            searchKey: '',
            label: '',
        }
    },
    computed: {
        _filteredNews: function () {
            var key = this.searchKey;
            var label = this.label;
            if (key == '') {
                return this.footballNews.map(function (x) {
                    return {
                        category: x.category,
                        news: label == '' ? x.news : x.news.filter(y => y.lable.indexOf(label) != -1)
                    }
                })
            } else {
                return this.footballNews.map(function (x) {
                    return {
                        category: x.category,
                        news: label == '' ? x.news.filter(y => y.title.indexOf(key) != -1)
                            : x.news.filter(y => (y.title.indexOf(key) != -1 && y.lable.indexOf(label) != -1))
                    }
                })
            }
        }
    },
    methods: {
        OnClick: function (event) {
            $('button.button-press').removeClass('button-press')
            var self = this;
            this.$nextTick(function () {
                if (event.target.innerText == 'Barca') {
                    self.label = '巴塞罗那';
                } else if (event.target.innerText == 'Mancity') {
                    self.label = '曼城';
                } else {
                    self.label = '';
                }
            })
            $(event.target).addClass('button-press');
        },
        OnResetSearch: function () {
            var self = this;
            this.$nextTick(function () {
                self.searchKey = '';
            })
        }
    },
    created: function () {
        var ajaxPromise = function (date) {
            //https://news.zhibo8.cc/zuqiu/json/2017-07-20.htm
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: 'https://news.zhibo8.cc/zuqiu/json/' + date + '.htm',
                    dataType: "json",
                    success: function (data) {
                        let _data = data.video_arr.filter(x => x.type == 'zuqiu' && isBarcaMancity(x.lable));
                        resolve(_data.map(function (x) {
                            return {
                                title: x.title,
                                url: 'https://www.zhibo8.cc' + x.url,
                                time: formatTime(x.updatetime),
                                lable: x.lable,
                                isLeo: x.title.indexOf('梅西') != -1 || x.title.toLowerCase().indexOf('messi') != -1
                            }
                        }))
                    }
                })
            })
        }

        let isBarcaMancity = function (str) {
            if (str.indexOf('巴塞罗那') != -1 || str.indexOf('曼城') != -1) {
                return true;
            }
        }
        let formatTime = function (dateTime) {
            let date = new Date(dateTime)
            return date.getMonth() + 1 + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
        }

        var self = this;
        Promise.all([ajaxPromise('2017-07-20'), ajaxPromise('2017-07-19')]).then(function (res) {
            console.log(res)
            console.log('get res')
            res.forEach(x => {
                self.footballNews = self.footballNews.concat(x)
            })
        })
    }
}
</script>

<style>

</style>

