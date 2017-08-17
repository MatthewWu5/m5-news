<template>
  <div>
    <div v-html="imageData"></div>
    <button @click="OnImageChange">Image</button>
    <div class="row" v-show="!gotoPage">
      <div class="search-area">
        <div>
          <button @click="OnLabelChange">Barca</button>
          <button @click="OnLabelChange">Mancity</button>
          <button @click="OnLabelChange">Barclays</button>
          <button @click="OnLabelChange">All</button>
          <input type="text" placeholder="Search" v-model="searchKey" class="search-input"></input>
          <i class="fa fa-times removeBtn" @click="OnResetSearch"></i>
          <i class="fa fa-refresh" @click="refreshOnClick"></i>
        </div>
        <div>
          <input type="text" v-model="intervalDay" class="interval-days"></input>
          Days
          <button @click="moreNewsOnClick">More</button>
          {{requestStatus}}
        </div>
        <div>
          <button @click="OnGoPageClick">Go Page</button>
          <span style="color: #a8c6e2;font-weight: bold;margin-left:10px">
                    {{'Min Time: '+_currentMinDateString}}
                  </span>
        </div>
      </div>
  
      <div class="tab-container">
        <span @click="OnCategoryChange">News</span>
        <span @click="OnCategoryChange">Official</span>
        <span @click="OnCategoryChange">Conclusion</span>
        <span @click="OnCategoryChange">FunnyTime</span>
        <span @click="OnCategoryChange">HotVideo</span>
      </div>
      <div class="content-container">
        <div v-for="item in _filteredNews" v-bind:key="item" class="col-md-3 col-xs-3 col-sm-12">
          <div v-for="n in item.news" v-bind:key="n" :title="n.time">
            <a href="#" :class="getClass(n)" @click="OnPageClick(n)">{{n.title}}</a>
            <!--<span>{{n.time}}</span>-->
          </div>
        </div>
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
export default {
  name: 'footballNews',
  components: { newsPage },
  data() {
    return {
      footballNews: [],
      searchKey: '',
      label: '',
      category: const_news.Category.News,
      intervalDay: 2,
      currentMinDate: new Date(),
      requestStatus: '',

      page: '',
      comments: [],
      gotoPage: false,
      showComment: false,
      newsTime: '',

      imageData: [],
    }
  },
  computed: {
    _filteredNews: function () {
      var key = this.searchKey;
      var label = this.label;
      var category = this.category;
      return this.footballNews.filter(f => f.category.indexOf(category) != -1).map(function (x) {
        return {
          category: x.category,
          news: x.news.filter(y => (y.title.indexOf(key) != -1 && y.lable.indexOf(label) != -1))
        }
      })
    },

    _currentMinDateString: function () {
      var date = this.currentMinDate;
      return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
    },

    _class: function () {
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
    getClass: function (n) {
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
    OnLabelChange: function (event) {
      $('button.button-press').removeClass('button-press')
      var self = this;
      this.$nextTick(function () {
        if (event.target.innerText == 'Barca') {
          self.label = '巴塞罗那';
        } else if (event.target.innerText == 'Mancity') {
          self.label = '曼城';
        } else if (event.target.innerText == 'Barclays') {
          self.label = '英超';
        } else {
          self.label = '';
        }
        $('.content-container').scrollTop(0)
      })
      $(event.target).addClass('button-press');
    },
    OnCategoryChange: function () {
      $('span.button-press').removeClass('button-press')
      var self = this;
      this.$nextTick(function () {
        if (event.target.innerText == 'News') {
          self.category = const_news.Category.News;
        } else if (event.target.innerText == 'HotVideo') {
          self.category = const_news.Category.Video;
        } else if (event.target.innerText == 'Official') {
          self.category = const_news.Category.Official;
        } else if (event.target.innerText == 'Conclusion') {
          self.category = const_news.Category.Conclusion;
        } else if (event.target.innerText == 'FunnyTime') {
          self.category = const_news.Category.FunnyTime;
        } else {
          self.category = '';
        }
        $('.content-container').scrollTop(0)
      })
      $(event.target).addClass('button-press');
    },
    OnResetSearch: function () {
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
    OnPageClick: function (n) {
      let host = n.host, path = n.path, updatetime = n.time;
      let self = this;
      self.requestStatus = 'goto page...';
      axios.post(url.getPageData, { host: host, path: path })
        .then(resp => {
          self.$nextTick(function () {
            self.page = resp.data.data.page;
            self.comments = resp.data.data.comments;
            self.requestStatus = '';
            self.gotoPage = true;
            self.newsTime = updatetime;
            n.isReaded = true;
            //self.$refs,newsPage.ScrollTop()
          })
        }).catch(err => {
          console.error(err)
        })
    },
    OnGoPageClick: function () {
      this.gotoPage = !this.gotoPage;
      this.showComment = false;
    },
    messageFromChild: function () {
      this.gotoPage = false;
    },
    moreNewsOnClick: function () {
      var self = this;
      self.requestStatus = 'loading...';
      axios.post(url.getMoreData, { currentMinDate: self.currentMinDate, intervalDay: self.intervalDay })
        .then(resp => {
          let source = resp.data.data.source;
          let objKeys = Object.keys(source)
          self.$nextTick(function () {
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
    refreshOnClick: function () {
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
          self.$nextTick(function () {
            for (let i = 0; i < self.footballNews.length; i++) {
              var item = self.footballNews[i];
              if (item.category != const_news.Category.Video && incremental[item.category]) {
                var currentIncrementalNews = incremental[item.category].news;
                if (currentIncrementalNews && currentIncrementalNews.length > 0) {
                  currentIncrementalNews.forEach(function (element) {
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
    OnImageChange: function () {
      var self = this;
      axios.post(url.getImageData).then(resp => {
        self.$nextTick(function () {
          self.imageData = resp.data.data.source;
        })
      })
    }
  },
  created: function () {
    //https://soccer.hupu.com/home/latest-news?league=%E8%A5%BF%E7%94%B2&page=1
    var self = this;
    //Server
    self.requestStatus = 'initing...';
    axios.post(url.getHot24Data)
      .then(resp => {
        self.$nextTick(function () {
          self.footballNews = resp.data.data.source;
          self.currentMinDate = new Date(resp.data.data.minDate)
          self.requestStatus = '';
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

</style>

