<template>
  <div class="row">
    <div class="search-area">
      <button @click="OnClick">Barca</button>
      <button @click="OnClick">Mancity</button>
      <button @click="OnClick">All</button>
      <input type="text" placeholder="Search" v-model="searchKey"></input>
    </div>
    <div v-for="item in footballNews" v-bind:key="item" class="col-md-3 col-xs-3 col-sm-3">
      {{item.category}}
      <div v-for="n in item.news" v-bind:key="n">
        <a :href="n.url" target="_blank">{{n.title}}</a>
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
      _fakeData: [{ category: '1', news: [{ url: 'url1', title: 'haha', lable: 'abc' }] }],
      searchKey: '',
    }
  },
  computed: {
    _filteredNews: function () {
      console.log(this._fakeData);
      console.log('_fakeData');
      let result = [];
      //TODO: Why always true
      if (Boolean(this.searchKey != '' && this._fakeData && this._fakeData.length > 0)) {
        result = this._fakeData.map(function (x) {
          return {
            category: x.category,
            news: x.news.filter(y => y.title.indexOf(this.searchKey) != -1)
          }
        })
      } else {
        result = this._fakeData;
      }

      console.log(result);
      // console.log(this.footballNews);
      return result;
    }
  },
  methods: {
    OnClick: (e) => {

    }
  },
  created: function () {
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

          let _international = getFormatNewsData('国际', internationalData)
          let _official = getFormatNewsData('官方', international_official)
          let _conclusion = getFormatNewsData('直播吧总结', international_conclusion)
          let _videoData = getFormatNewsData('视频集锦', videoData, true)
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
      console.log(self.footballNews)
      console.log('get data')
    })
  }
}
</script>

<style>
.search-area {
  margin-left: 15px;
  padding-bottom: 5px;
}
</style>

