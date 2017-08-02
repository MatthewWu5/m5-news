<template>
  <div class="row">
    <div class="search-area">
      <div>
        <input type="text" placeholder="Search" v-model="searchKey"></input>
        <i class="fa fa-times removeBtn" @click="OnResetSearch"></i>
      </div>
      <button @click="OnLabelChange">Barca</button>
      <button @click="OnLabelChange">Mancity</button>
      <button @click="OnLabelChange">All</button>
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
export default {
  name: 'footballNews',
  data() {
    return {
      footballNews: [],
      searchKey: '',
      label: '',
      category: const_news.Category.News,
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
    }
  },
  created: function () {
    //https://soccer.hupu.com/home/latest-news?league=%E8%A5%BF%E7%94%B2&page=1
    var ajaxPromise = new Promise(function (resolve, reject) {
      $.ajax({
        url: 'https://m.zhibo8.cc/json/hot/24hours.htm',
        dataType: "json",
        success: function (data) {

          let videoData = data.video.filter(x => x.type == 'zuqiujijin' && isTop5League(x.lable));
          let footballData = data.news.filter(x => x.type == 'zuqiu');
          let internationalData = footballData.filter(x => isTop5League(x.lable));
          let championLeagueData = footballData.filter(x => isChampionLeague(x.lable));
          let international_official = internationalData.filter(x => isOfficial(x.title));
          let international_conclusion = internationalData.filter(x => isConclusion(x.title));

          let _international = getFormatNewsData(const_news.Category.News, internationalData)
          let _official = getFormatNewsData(const_news.Category.Official, international_official)
          let _conclusion = getFormatNewsData(const_news.Category.Conclusion, international_conclusion)
          let _videoData = getFormatNewsData(const_news.Category.Video, videoData, true)
          resolve([_international, _videoData, _official, _conclusion])
        }
      })
    })
    let getFormatNewsData = function (category, rawData, isVideo = false) {
      return {
        category: category,
        news: rawData.map(function (x) {
          return {
            title: x.title,
            url: (isVideo ? 'https://www.zhibo8.cc' : 'https://news.zhibo8.cc') + x.url,
            time: formatTime(x.updatetime),
            lable: x.lable,
            isLeo: x.title.indexOf('梅西') != -1 || x.title.toLowerCase().indexOf('messi') != -1
          }
        })
      }
    }
    let isTop5League = function (str) {
      if (str.indexOf('英超') != -1 || str.indexOf('西甲') != -1 || str.indexOf('德甲') != -1 || str.indexOf('法甲') != -1 || str.indexOf('意甲') != -1) {
        return true;
      }
      return false;
    }
    let isChampionLeague = function (str) {
      if (str.indexOf('欧冠') != -1) {
        return true;
      }
    }
    let isOfficial = function (str) {
      if (str.indexOf('官方') != -1) {
        return true;
      }
    }
    let isConclusion = function (str) {
      if (str.indexOf('盘点') != -1) {
        return true;
      }
    }
    let formatTime = function (dateTime) {
      let date = new Date(dateTime)
      return date.getMonth() + 1 + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    }

    var self = this;
    ajaxPromise.then(function (res) {
      self.footballNews = res;
    })
  }
}
</script>

<style>

</style>

