<template>
  <div class="row">
    <div class="search-area">
      <button @click="OnClick">Barca</button>
      <button @click="OnClick">Mancity</button>
      <button @click="OnClick">All</button>
      <!--<button @click="OnCheck">console.log(this)</button>-->
      <input type="text" placeholder="Search" v-model="searchKey"></input>
      <i class="fa fa-times" style="width:10px;height:10px;margin-left:-18px" @click="OnResetSearch"></i>
    </div>
    <div v-for="item in _filteredNews" v-bind:key="item" class="col-md-3 col-xs-3 col-sm-6">
      {{item.category}}
      <div v-for="n in item.news" v-bind:key="n">
        <a :href="n.url" target="_blank" :class="n.isLeo?'leo-news-color':''">{{n.title}}</a>
        <!--<span>{{n.time}}</span>-->
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
    OnCheck: () => {
      console.log(this)
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

