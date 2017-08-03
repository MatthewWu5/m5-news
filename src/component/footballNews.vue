<template>
  <div class="row" style="margin-left:15px">
    <div class="search-area">
      <div>
        <input type="text" placeholder="Search" v-model="searchKey"></input>
        <i class="fa fa-times removeBtn" @click="OnResetSearch"></i>
      </div>
      <button @click="OnLabelChange">Barca</button>
      <button @click="OnLabelChange">Mancity</button>
      <button @click="OnLabelChange">All</button>
    </div>
    <div>
      <input type="text" v-model="intervalDay" style="width:120px"></input>
      Days
      <button @click="moreNewsOnClick">More</button>
    </div>
    <div class="search-area">
      <span @click="OnCategoryChange">News</span>
      <span @click="OnCategoryChange">Video</span>
      <span @click="OnCategoryChange">Official</span>
      <span @click="OnCategoryChange">Conclusion</span>
    </div>
    <div class="fixed-width">
      <div v-for="item in _filteredNews" v-bind:key="item" class="col-md-3 col-xs-3 col-sm-12">
        <!--{{item.category}}-->
        <div v-for="n in item.news" v-bind:key="n">
          <a :href="n.url" target="_blank" :class="n.isLeo?'leo-news-color':''">{{n.title}}</a>
          <span>{{n.time}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import const_news from '../const.js'
import axios from 'axios'
import url from '../../server/url'
export default {
  name: 'footballNews',
  data() {
    return {
      footballNews: [],
      searchKey: '',
      label: '',
      category: const_news.Category.News,
      intervalDay: 10,
      currentMinDate: new Date(),
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
        } else if (event.target.innerText == 'Video') {
          self.category = const_news.Category.Video;
        } else if (event.target.innerText == 'Official') {
          self.category = const_news.Category.Official;
        } else if (event.target.innerText == 'Conclusion') {
          self.category = const_news.Category.Conclusion;
        } else {
          self.category = '';
        }
      })
      $(event.target).addClass('button-press');
    },

    OnResetSearch: function () {
      var self = this;
      this.$nextTick(function () {
        self.searchKey = '';
      })
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

    getMore: function () {
      var self = this;
      this.$nextTick(function () {
        if (self.intervalDay > 100) self.intervalDay = 100;
        var promiseArray = [];
        for (var i = 0; i < self.intervalDay; i++) {
          promiseArray.push(self.moreRequest(self.formatRequestDate(self.currentMinDate, i)));
        }
        Promise.all(promiseArray).then(function (resps) {
          console.log(resps)
          resps.forEach(x => {
            if (x) {
              self.footballNews = self.footballNews.concat(x)
            }
          })
          self.currentMinDate.setDate(self.currentMinDate.getDate() - self.intervalDay);
          console.log(self.intervalDay)
          console.log(self.currentMinDate)
        }).catch(err => {
          console.log('Promise.all error:')
          console.log(err)
        })
      })
    },

    moreRequest: function (date) {
      var self = this;
      return new Promise((resolve, reject) => {
        axios.post(url.getNewsData, { host: 'news.zhibo8.cc', path: '/zuqiu/json/' + date + '.htm' })
          .then(resp => {
            var data = resp.data.data;
            console.log(data);
            console.log('get data')
            let footballData = data.video_arr.filter(x => x.type == 'zuqiu');
            let videoData = data.video_arr.filter(x => x.type == 'zuqiujijin' && self.isTop5League(x.lable));
            let internationalData = footballData.filter(x => self.isTop5League(x.lable));
            let international_official = internationalData.filter(x => self.isOfficial(x.title));
            let international_conclusion = internationalData.filter(x => self.isConclusion(x.title));
            let _international = self.getFormatNewsData(const_news.Category.News, internationalData)
            let _official = self.getFormatNewsData(const_news.Category.Official, international_official)
            let _conclusion = self.getFormatNewsData(const_news.Category.Conclusion, international_conclusion)
            let _videoData = self.getFormatNewsData(const_news.Category.Video, videoData, 'video')
            resolve([_international, _videoData, _official, _conclusion])
          }).catch(err => {
            reject(err);
          })
      }).catch(err => {
        console.error(err);
      })
    },

    moreNewsOnClick: function () {
      this.getMore();
    },

    getFormatNewsData: function (category, rawData, urlType = 'news') {
      var self = this;
      return {
        category: category,
        news: rawData.map(function (x) {
          return {
            title: x.title,
            url: (urlType == 'news'? 'https://news.zhibo8.cc' : 'https://www.zhibo8.cc') + x.url,
            time: self.formatTime(x.updatetime),
            lable: x.lable,
            isLeo: x.title.indexOf('梅西') != -1 || x.title.toLowerCase().indexOf('messi') != -1
          }
        })
      }
    },
    isTop5League: function (str) {
      if (str.indexOf('英超') != -1 || str.indexOf('西甲') != -1 || str.indexOf('德甲') != -1 || str.indexOf('法甲') != -1 || str.indexOf('意甲') != -1) {
        return true;
      }
      return false;
    },
    isChampionLeague: function (str) {
      if (str.indexOf('欧冠') != -1) {
        return true;
      }
    },
    isOfficial: function (str) {
      if (str.indexOf('官方') != -1) {
        return true;
      }
    },
    isConclusion: function (str) {
      if (str.indexOf('盘点') != -1) {
        return true;
      }
    },
    formatTime: function (dateTime) {
      let date = new Date(dateTime)
      return date.getMonth() + 1 + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    },

  },
  created: function () {
    var self = this;
    //https://soccer.hupu.com/home/latest-news?league=%E8%A5%BF%E7%94%B2&page=1
    var ajaxPromise = new Promise(function (resolve, reject) {
      $.ajax({
        url: 'https://m.zhibo8.cc/json/hot/24hours.htm',
        dataType: "json",
        success: function (data) {
          let videoData = data.video.filter(x => x.type == 'zuqiujijin' && self.isTop5League(x.lable));
          let footballData = data.news.filter(x => x.type == 'zuqiu');
          let internationalData = footballData.filter(x => self.isTop5League(x.lable));
          // let championLeagueData = footballData.filter(x => isChampionLeague(x.lable));
          let international_official = internationalData.filter(x => self.isOfficial(x.title));
          let international_conclusion = internationalData.filter(x => self.isConclusion(x.title));

          let _international = self.getFormatNewsData(const_news.Category.News, internationalData)
          let _official = self.getFormatNewsData(const_news.Category.Official, international_official)
          let _conclusion = self.getFormatNewsData(const_news.Category.Conclusion, international_conclusion)
          let _videoData = self.getFormatNewsData(const_news.Category.Video, videoData, 'video')
          resolve([_international, _videoData, _official, _conclusion])
        }
      })
    })

    var self = this;
    ajaxPromise.then(function (res) {
      self.footballNews = res;
    })
  }
}
</script>

<style>

</style>

