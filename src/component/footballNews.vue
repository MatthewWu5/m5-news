<template>
  <div>
    <div class="row" v-show="!gotoPage">
      <div class="search-area">
        <div>
          <button @click="OnLabelChange" tag="Mancity">City</button>
          <button @click="OnLabelChange" tag="Barca">Barca</button>
          <button @click="OnLabelChange" tag="Barclays">Eng</button>
          <button @click="OnLabelChange" tag="All">All</button>
          <div style="display:inline-block;position:relative">
            <i @click="OnLoadImageClick" class="fa fa-picture-o" :class="loadImage?'image-press':''"></i>
          </div>
          <div style="display:inline-block;position:relative">
            <input type="checkbox" @click="OnCheck" class="checkbox-option">
          </div>
          <i class="fa fa-refresh" @click="refreshOnClick"></i>
        </div>
        <div v-show="showOption" style="margin-top:5px">
          <input type="text" v-model="intervalDay" class="interval-days"></input>
          Days
          <button @click="moreNewsOnClick">More</button>
          <input type="text" placeholder="Search" v-model="searchKey" class="search-input" v-show="showOption"></input>
          <i class="fa fa-times removeBtn" @click="OnResetSearch" v-show="showOption"></i>
        </div>
        <div style="margin-top:5px">
          <button class="page-btn" @click="OnGoPageClick">Page</button>
          <span style="color: #a8c6e2;font-weight: bold;margin-left:10px">
            {{'Min Time: '+_currentMinDateString}}
          </span>
          <span style="margin-left:10px">{{requestStatus}}</span>
        </div>
      </div>

      <div class="tab-container">
        <span @click="OnCategoryChange">News</span>
        <span @click="OnCategoryChange">HotVideo</span>
        <span @click="OnCategoryChange">Others</span>
      </div>
      <div class="content-container" :class="showOption?'content-container-showOption':''">
        <swipe ref="homeSwipe" :speed="100" :default-index="1" :auto="0" :continuous="false" :show-indicators="false" @change="changeSwipe">
          <swipe-item>Back to page comment...</swipe-item>
          <swipe-item>
            <div v-for="item in _filteredNews" v-bind:key="item">
              <div v-for="n in item.news" v-bind:key="n" :title="n.time">
                <a href="#" :class="getClass(n)" @click="OnPageClick(n)">{{n.title}}</a>
                <!--<span>{{n.time}}</span>-->
              </div>
            </div>
          </swipe-item>
          <swipe-item>Go to page content...</swipe-item>
        </swipe>
      </div>
    </div>

    <newsPage :page="page" :comments="comments" :showComment="showComment" :time="newsTime" v-show="gotoPage" v-on:listenToChildEvent="messageFromChild" ref="newsPage"></newsPage>

  </div>
</template>

<script>
import $ from 'jquery'
import const_news from '../../server/const'
import axios from 'axios'
import url from '../../server/url'
import newsPage from './newsPage'
import { Swipe, SwipeItem } from '../lib/vue-swipe'
export default {
  name: 'footballNews',
  components: { newsPage, Swipe, SwipeItem },
  data() {
    return {
      footballNews: [],
      searchKey: '',
      label: '',
      categories: [const_news.Category.News],
      intervalDay: 2,
      currentMinDate: new Date(),
      requestStatus: '',

      page: '',
      comments: [],
      gotoPage: false,
      showComment: false,
      showOption: false,
      newsTime: '',

      imageData: [],
    }
  },
  computed: {
    _filteredNews: function() {
      var key = this.searchKey;
      var label = this.label;
      var categories = this.categories;
      return this.footballNews.filter(f => categories.indexOf(f.category) != -1).map(function(x) {
        return {
          category: x.category,
          news: x.news.filter(y => (y.title.indexOf(key) != -1 && y.lable.indexOf(label) != -1 && (label == "英超" ? y.lable.indexOf("曼城") == -1 : y.lable != '')))
        }
      })
    },

    _currentMinDateString: function() {
      var date = this.currentMinDate;
      return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
    },

    _class: function() {
      //i want subscope but 'this' always be global scope
      console.log('_class', this)
      let _class = '';
      if (this.isLeo) {
        _class += 'leo-news-color ';
      }
      if (this.isIncremental) {
        _class += 'incremental ';
      }
      if (this.isReaded) {
        _class += 'readed ';
      }
      return _class;
    }
  },
  methods: {
    getClass: function(n) {
      let _class = '';
      if (n.isLeo) {
        _class += 'leo-news-color ';
      }
      if (n.isIncremental) {
        _class += 'incremental ';
      }
      if (n.isReaded) {
        _class += 'readed ';
      }
      return _class;
    },
    OnLabelChange: function(event) {
      $('button.button-press').removeClass('button-press')
      var self = this;
      this.$nextTick(function() {
        var tag = $(event.target).attr('tag')
        if (tag == 'Barca') {
          self.label = '巴塞罗那';
        } else if (tag == 'Mancity') {
          self.label = '曼城';
        } else if (tag == 'Barclays') {
          self.label = '英超';
        } else {
          self.label = '';
        }
        $('.content-container').scrollTop(0)
      })
      $(event.target).addClass('button-press');
    },
    OnCategoryChange: function() {
      $('span.button-press').removeClass('button-press')
      var self = this;
      this.$nextTick(function() {
        if (event.target.innerText == 'News') {
          self.categories = [const_news.Category.News];
        } else if (event.target.innerText == 'HotVideo') {
          self.categories = [const_news.Category.Video];
        } else if (event.target.innerText == 'Others') {
          self.categories = [const_news.Category.Official, const_news.Category.Conclusion, const_news.Category.FunnyTime];
        } else {
          self.categories = []
        }
        $('.content-container').scrollTop(0)
      })
      $(event.target).addClass('button-press');
    },
    OnLoadImageClick: function() {
      if ($(event.target).hasClass('image-press')) {
        $('meta[name="referrer"]').attr('content', 'always')
        $(event.target).removeClass('image-press')
        axios.post(url.sendLoadImageFlag, { loadImage: false })
      } else {
        $('meta[name="referrer"]').attr('content', 'never')
        $(event.target).addClass('image-press')
        axios.post(url.sendLoadImageFlag, { loadImage: true })
      }
    },
    OnCheck: function() {
      this.showOption = event.target.checked
    },
    OnResetSearch: function() {
      //Both ok
      // var self = this;
      // this.$nextTick(function () {
      //   self.searchKey = '';
      // })
      // setTimeout(function () {
      //   self.searchKey = '';
      // }, 5000)
      this.searchKey = '';
      $('.content-container').scrollTop(0)
    },
    OnPageClick: function(n) {
      let host = n.host, path = n.path, updatetime = n.time;
      let self = this;
      self.requestStatus = 'going...';
      axios.post(url.getPageData, { host: host, path: path })
        .then(resp => {
          self.$nextTick(function() {
            self.page = resp.data.data.page;
            self.comments = resp.data.data.comments;
            self.requestStatus = '';
            self.gotoPage = true;
            self.newsTime = updatetime;
            n.isReaded = true;
            self.$refs.newsPage.GotoPageContent()
          })
        }).catch(err => {
          console.error(err)
        })
    },
    OnGoPageClick: function() {
      this.gotoPage = true
      this.$refs.newsPage.GotoPageContent()
    },
    changeSwipe: function(newIndex, oldIndex) {
      this.$refs.homeSwipe.goto(1)
      this.gotoPage = true
      this.showComment = newIndex == 0
      if(newIndex == 0){
        this.$refs.newsPage.GotoPageComment()
      }
    },
    messageFromChild: function() {
      this.gotoPage = false;
    },
    moreNewsOnClick: function() {
      var self = this;
      self.requestStatus = 'loading...';
      axios.post(url.getMoreData, { currentMinDate: self.currentMinDate, intervalDay: self.intervalDay })
        .then(resp => {
          let source = resp.data.data.source;
          let objKeys = Object.keys(source)
          self.$nextTick(function() {
            for (let i = 0; i < objKeys.length; i++) {
              var current = self.footballNews.find(x => x.category == objKeys[i])
              current.news = current.news.concat(source[objKeys[i]].news)
            }
            self.currentMinDate = new Date(resp.data.data.minDate)
            self.requestStatus = '';
          })
        }).catch(err => {
          console.error(err)
        })
    },
    refreshOnClick: function() {
      var self = this;
      self.requestStatus = 'loading...';
      var maxDateList = self.footballNews.map(x => {
        return {
          category: x.category,
          maxDate: x.maxDate,
        }
      })
      axios.post(url.getIncrementalData, { maxDateList: maxDateList })
        .then(resp => {
          var incremental = resp.data.data.source;
          self.$nextTick(function() {
            for (let i = 0; i < self.footballNews.length; i++) {
              var item = self.footballNews[i];
              if (item.category != const_news.Category.Video && incremental[item.category]) {
                var currentIncrementalNews = incremental[item.category].news;
                if (currentIncrementalNews && currentIncrementalNews.length > 0) {
                  currentIncrementalNews.forEach(function(element) {
                    element.isIncremental = true;
                  })
                  item.news = currentIncrementalNews.concat(item.news).distinct('path')
                  item.maxDate = incremental[item.category].maxDate;
                  $('.content-container').scrollTop(0)
                }
              }
            }
            self.requestStatus = '';
          })
        }).catch(err => {
          console.error(err)
        })
    },
  },
  created: function() {
    //https://soccer.hupu.com/home/latest-news?league=%E8%A5%BF%E7%94%B2&page=1
    var self = this;
    //Server
    self.requestStatus = 'initing...';
    axios.post(url.getHot24Data)
      .then(resp => {
        self.$nextTick(function() {
          self.footballNews = resp.data.data.source;
          self.currentMinDate = new Date(resp.data.data.minDate)
          self.requestStatus = '';
          self.loadImage = resp.data.data.loadImage
          if (self.loadImage) {
            $('meta[name="referrer"]').attr('content', 'never')
          } else {
            $('meta[name="referrer"]').attr('content', 'always')
          }
        })
      }).catch(err => {
        console.error(err)
      })

    //Client
    // var ajaxPromise = new Promise(function (resolve, reject) {
    //   $.ajax({
    //     url: 'https://m.zhibo8.cc/json/hot/24hours.htm',
    //     dataType: "json",
    //     success: function (data) {
    //       let videoData = data.video.filter(x => x.type == 'zuqiujijin' && self.isTop5League(x.lable));
    //       let footballData = data.news.filter(x => x.type == 'zuqiu');
    //       var result = self.assembleFootballData(footballData)
    //       let _hotVideo = self.getFormatNewsData(const_news.Category.Video, videoData, 'video')
    //       let minDate = new Date()
    //       let newsList = result._international.news;
    //       if (newsList.length > 0) minDate = new Date(newsList[newsList.length - 1].updatetime)
    //       let resultArray = self.toArray(result)
    //       resultArray.push(_hotVideo)
    //       resolve({ source: resultArray, minDate: minDate })
    //     }
    //   })
    // })

    // var self = this;
    // ajaxPromise.then(function (res) {
    //   self.footballNews = res.source;
    //   self.currentMinDate = res.minDate;
    // })
  }
}
</script>

<style>
.image-press {
  color: #23527c;
}
</style>

