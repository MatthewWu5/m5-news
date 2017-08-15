<template>
  <div>
    <div class="row" v-show="!gotoPage">
      <div class="search-area">
        <div>
          <button @click="OnLabelChange">Barca</button>
          <button @click="OnLabelChange">Mancity</button>
          <button @click="OnLabelChange">Barclays</button>
          <button @click="OnLabelChange">All</button>
          <input type="text" placeholder="Search" v-model="searchKey" class="search-input"></input>
          <i class="fa fa-times removeBtn" @click="OnResetSearch"></i>
        </div>
        <div>
          <input type="text" v-model="intervalDay" class="interval-days"></input>
          Days
          <button @click="moreNewsOnClick">More</button>
          {{requestStatus}}
        </div>
        <div>
          <button @click="OnGoPageClick">Go Page</button>
          <input type="checkbox" v-model="original" style="width:30px;height:30px">Original</input>
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
            <a href="#" :class="n.isLeo?'leo-news-color':''" @click="OnPageClick(n.host,n.path,n.time,n.url)">{{n.title}}</a>
            <!--<span>{{n.time}}</span>-->
          </div>
        </div>
      </div>
    </div>
    <newsPage :page="page" :comments="comments" :showComment="showComment" :time="newsTime" v-show="gotoPage" v-on:listenToChildEvent="messageFromChild"></newsPage>
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

      original: false,

      page: '',
      comments: [],
      gotoPage: false,
      showComment: false,
      newsTime: ''
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
    }
  },
  methods: {
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
    },

    OnPageClick: function (host, path, updatetime, linkUrl) {
      let self = this;
      if (self.original) {
        window.open(linkUrl)
      } else {
        self.requestStatus = 'goto page...';
        axios.post(url.getPageData, { host: host, path: path })
          .then(resp => {
            self.$nextTick(function () {
              self.page = resp.data.data.page;
              self.comments = resp.data.data.comments;
              self.requestStatus = '';
              self.gotoPage = true;
              self.newsTime = updatetime;
            })
          }).catch(err => {
            console.error(err)
          })
      }
    },

    OnGoPageClick: function () {
      this.gotoPage = !this.gotoPage;
      this.showComment = false;
    },

    messageFromChild: function () {
      this.gotoPage = false;
    },

    moreNewsOnClick: function () {
      this.getMore2();
    },

    formatRequestDate: function (minDate, index) {
      let date = new Date(minDate)
      date.setDate(date.getDate() - index);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      return date.getFullYear() + '-' + month + '-' + day;
    },

    getMore2: function () {
      var self = this;
      self.requestStatus = 'loading...';
      axios.post(url.getMoreData, { currentMinDate: self.currentMinDate, intervalDay: self.intervalDay })
        .then(resp => {
          let source = resp.data.data.source;
          let objKeys = Object.keys(source)
          self.$nextTick(function () {
            for (let i = 0; i < objKeys.length; i++) {
              var current = self.footballNews.find(x => x.category == objKeys[i])
              console.log(current)
              current.news = current.news.concat(source[objKeys[i]].news)
            }
            self.currentMinDate = new Date(resp.data.data.minDate)
          })
          // self.$nextTick(function () {
          //   for (assembleProp in source) {
          //     console.log('assembleProp', assembleProp)
          //     self.footballNews[assembleProp].news = self.footballNews[assembleProp].news.concat(source[assembleProp].news)
          //   }
          //   self.currentMinDate = new Date(resp.data.data.minDate)
          // })
        }).catch(err => {
          console.error(err)
        })
    },

    getMore: function () {
      var self = this;
      self.requestStatus = 'loading...';
      self.$nextTick(function () {
        if (self.intervalDay > 30) self.intervalDay = 30;
        var promiseArray = [];
        for (var i = 1; i < self.intervalDay + 1; i++) {
          promiseArray.push(self.moreRequest(self.formatRequestDate(self.currentMinDate, i)));
        }
        Promise.all(promiseArray).then(function (resps) {
          // for(let i = 0; i<resps.length;i++){
          //   if (resps[i]) self.appendNews(self.footballNews, resps[i])
          // }
          resps.forEach(x => {
            if (x) self.appendNews(self.footballNews, x)
          })

          self.requestStatus = '';
          //in order to call computed prop
          var currentDate = self.currentMinDate;
          currentDate.setDate(currentDate.getDate() - self.intervalDay);
          self.currentMinDate = new Date(currentDate.getFullYear() + '.' + self.formatTime(currentDate))
        }).catch(err => {
          console.error('Promise.all:', err)
        })
      })
    },
    moreRequest: function (date) {
      console.log('more request date:', date)
      var self = this;
      return new Promise((resolve, reject) => {
        axios.post(url.getJsonData, { host: 'news.zhibo8.cc', path: '/zuqiu/json/' + date + '.htm' })
          .then(resp => {
            var data = resp.data.data;
            let footballData = data.video_arr.filter(x => x.type == 'zuqiu');
            var result = self.assembleFootballData(footballData)
            resolve(self.toArray(result))
          }).catch(err => {
            reject(err);
          })
      }).catch(err => {
        console.error(err);
      })
    },
    getFormatNewsData: function (category, rawData, urlType = 'news') {
      var self = this;
      var result = rawData.map(function (x) {
        return {
          title: x.title,
          url: (urlType == 'news' ? 'https://news.zhibo8.cc' : 'https://www.zhibo8.cc') + x.url,
          host: (urlType == 'news' ? 'news.zhibo8.cc' : 'www.zhibo8.cc'),
          path: x.url,
          time: self.formatTime(x.updatetime),
          updatetime: x.updatetime,
          lable: x.lable,
          isLeo: x.title.indexOf('梅西') != -1 || x.title.toLowerCase().indexOf('messi') != -1
        }
      }).sort((x, y) => { return new Date(x.updatetime) < new Date(y.updatetime) ? 1 : -1; })

      return {
        category: category,
        news: result
      }
    },
    isTop5League: function (str) {
      if (str.indexOf('英超') != -1 || str.indexOf('西甲') != -1 || str.indexOf('德甲') != -1 || str.indexOf('法甲') != -1 || str.indexOf('意甲') != -1) {
        return true;
      }
      return false;
    },
    indexOf: function (sourceStr, indexStr) {
      if (sourceStr.indexOf(indexStr) != -1) {
        return true;
      }
    },
    filterTabData: (str) => {
      if (str.indexOf('官方') != -1 || str.indexOf('盘点') != -1 || str.indexOf('趣图') != -1 || str.indexOf('GIF-') != -1) {
        return false;
      }
      return true;
    },
    formatTime: function (dateTime) {
      let date = new Date(dateTime)
      return date.getMonth() + 1 + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    },
    assembleFootballData: function (footballData) {
      var self = this;
      let top5LeagueData = footballData.filter(x => self.isTop5League(x.lable))
      let internationalData = top5LeagueData.filter(x => self.filterTabData(x.title))
      let international_official = top5LeagueData.filter(x => self.indexOf(x.title, '官方'))
      let international_conclusion = top5LeagueData.filter(x => self.indexOf(x.title, '盘点'))
      let international_funnyTime = footballData.filter(x => self.indexOf(x.title, '趣图'))

      let _international = self.getFormatNewsData(const_news.Category.News, internationalData)
      let _official = self.getFormatNewsData(const_news.Category.Official, international_official)
      let _conclusion = self.getFormatNewsData(const_news.Category.Conclusion, international_conclusion)
      let _funnyTime = self.getFormatNewsData(const_news.Category.FunnyTime, international_funnyTime)

      return {
        _international: _international,
        _official: _official,
        _conclusion: _conclusion,
        _funnyTime: _funnyTime,
      }
    },
    toArray: (obj) => {
      var arr = [];
      for (var item in obj) {
        arr.push(obj[item]);
      }
      return arr;
    },
    appendNews: (footballNews, assembleItem) => {
      for (prop of assembleItem) {
        footballNews.filter(x => x.category == prop.category).forEach(x => {
          if (x) x.news = x.news.concat(prop.news)
        })
      }
    },
  },
  created: function () {
    //https://soccer.hupu.com/home/latest-news?league=%E8%A5%BF%E7%94%B2&page=1
    var self = this;
    //Server
    axios.post(url.getHot24Data)
      .then(resp => {
        self.$nextTick(function () {
          self.footballNews = resp.data.data.source;
          self.currentMinDate = new Date(resp.data.data.minDate)
        })
      }).catch(err => {
        console.error(err)
      })
    return;

    //Client
    var ajaxPromise = new Promise(function (resolve, reject) {
      $.ajax({
        url: 'https://m.zhibo8.cc/json/hot/24hours.htm',
        dataType: "json",
        success: function (data) {
          let videoData = data.video.filter(x => x.type == 'zuqiujijin' && self.isTop5League(x.lable));
          let footballData = data.news.filter(x => x.type == 'zuqiu');
          var result = self.assembleFootballData(footballData)
          let _videoData = self.getFormatNewsData(const_news.Category.Video, videoData, 'video')
          let minDate = new Date()
          let newsList = result._international.news;
          if (newsList.length > 0) minDate = new Date(newsList[newsList.length - 1].updatetime)
          let resultArray = self.toArray(result)
          resultArray.push(_videoData)
          resolve({ source: resultArray, minDate: minDate })
        }
      })
    })

    var self = this;
    ajaxPromise.then(function (res) {
      self.footballNews = res.source;
      self.currentMinDate = res.minDate;
    })
  }
}
</script>

<style>

</style>

