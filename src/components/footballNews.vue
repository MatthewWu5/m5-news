<template>
  <div>
    <div class="brief-page" v-show="!gotoPage">
      <tabs :tab-items="_labelMaps" :tab-index="labelIndex" :on-tab-click="OnLabelChange"></tabs>

      <!-- <i class="fa fa-refresh" @click="refreshOnClick"></i> -->

      <!-- @click.native -->
      <div class="tool-bar">
        <button class="button button-positive button-clear button-small" @click="showActionSheet">Days</button>
        <button class="button button-positive button-clear button-small" @click="showCustomPopup">Search</button>
        <span class="min-time">
          {{'Min Time: '+_currentMinDateString}}
        </span>
        <label class="toggle toggle-positive"><!----> <input type="checkbox" value="false" @click="onImageChecked"> <div class="track"><div class="handle"></div></div></label>
      </div>
      

      <button-bar class="label-tab" theme="positive" :tab-items="_categoryMaps" :tab-index="categoryIndex" :on-tab-click="OnCategoryChange"></button-bar>

      <!-- <div style="margin-top:5px">
        <button class="page-btn" @click="OnGoPageClick">Page</button>
        <span style="margin-left:10px">{{requestStatus}}</span>
      </div> -->

      <!-- <div class="content-container">
        <swipe ref="homeSwipe" :speed="100" :default-index="1" :auto="0" :continuous="false" :show-indicators="false" @change="changeSwipe">
          <swipe-item>Back to page comment...</swipe-item>
          <swipe-item>
            <div v-for="item in _filteredNews" v-bind:key="item">
              <div v-for="n in item.news" v-bind:key="n" :title="n.time">
                <a href="#" :class="getClass(n)" @click="OnPageClick(n)">{{n.title}}</a>
              </div>
            </div>
          </swipe-item>
          <swipe-item>Go to page content...</swipe-item>
        </swipe>
      </div> -->
      

      <div class="content-container" v-for="item in _filteredNews" v-bind:key="item">
        <item v-for="n in item.news" v-bind:key="n">
          <p @click="OnPageClick(n)">{{n.title}}
            <span class="item-note">
              {{n.time}}
            </span>
          </p>
        </item>
      </div>
    </div>

    <newsPage :page="page" :comments="comments" :showComment="showComment" :time="newsTime" v-show="gotoPage" v-on:listenToChildEvent="messageFromChild" ref="newsPage"></newsPage>

  </div>
</template>

<script>
import const_news from "../utils/const"
import prototypeUtil from "../utils/prototype"
import axios from "axios"
import url from "../utils/url"
import newsPage from "./newsPage"
import { Swipe, SwipeItem } from "../lib/vue-swipe"
// import { VonInput } from 'vonic'

export default {
  name: "footballNews",
  components: { newsPage, Swipe, SwipeItem },
  data() {
    return {
      footballNews: [],
      searchKey: "",
      label: "",
      categories: [const_news.Category.News],
      intervalDay: 2,
      currentMinDate: new Date(),
      requestStatus: "",

      page: "",
      comments: [],
      gotoPage: false,
      showComment: false,
      newsTime: "",

      imageData: [],

      labelIndex: 0,
      labelMaps: {
        All: "",
        Mancity: "曼城",
        Barca: "巴塞罗那",
        Barclays: "英超"
      },
      categoryIndex: 0,
      categoryMaps: {
        News: [const_news.Category.News],
        HotVideo: [const_news.Category.Video],
        Others: [
          const_news.Category.Official,
          const_news.Category.Conclusion,
          const_news.Category.FunnyTime
        ]
      }
    }
  },
  computed: {
    _labelMaps() {
      return Object.keys(this.labelMaps)
    },
    _categoryMaps() {
      return Object.keys(this.categoryMaps)
    },
    _filteredNews: function() {
      var key = this.searchKey
      var label = this.label
      var categories = this.categories
      return this.footballNews
        .filter(f => categories.indexOf(f.category) != -1)
        .map(function(x) {
          return {
            category: x.category,
            news: x.news.filter(
              y =>
                y.title.indexOf(key) != -1 &&
                y.lable.indexOf(label) != -1 &&
                (label == "英超"
                  ? y.lable.indexOf("曼城") == -1
                  : y.lable != "")
            )
          }
        })
    },

    _currentMinDateString: function() {
      var date = this.currentMinDate
      return (
        date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate()
      )
    },

    _class: function() {
      //i want subscope but 'this' always be global scope
      console.log("_class", this)
      let _class = ""
      if (this.isLeo) {
        _class += "leo-news-color "
      }
      if (this.isIncremental) {
        _class += "incremental "
      }
      if (this.isReaded) {
        _class += "readed "
      }
      return _class
    }
  },
  methods: {
    showCustomPopup() {
      let options = {
        effect: "scale",
        title: "",
        buttons: [{ text: "Ok" }, { text: "Cancel" }]
        // components: { VonInput }
      }
      let template = `<von-input type="text" placeholder="search text" value="${
        this.searchKey
      }"></von-input>`
      console.log(template)
      let popup = $popup.fromTemplate(template, options)
      var self = this
      popup.show().then(buttonIndex => {
        if (buttonIndex == 0) {
          self.searchKey = $(".von-popup input").val()
        } else {
          if (self.searchKey != "") {
            self.searchKey = ""
          }
        }
      })
    },
    showActionSheet() {
      $actionSheet.show({
        theme: "", //ios
        title: "Interval days",
        buttons: {
          "2": () => {
            this.moreNewsOnLoad(2)
          },

          "5": () => {
            this.moreNewsOnLoad(5)
          },

          "10": () => {
            this.moreNewsOnLoad(10)
          }
        }
      })
    },
    getClass: function(n) {
      let _class = ""
      if (n.isLeo) {
        _class += "leo-news-color "
      }
      if (n.isIncremental) {
        _class += "incremental "
      }
      if (n.isReaded) {
        _class += "readed "
      }
      return _class
    },
    // todo: scroll top
    OnLabelChange(index) {
      this.labelIndex = index
      this.label = Object.values(this.labelMaps)[index]
    },
    OnCategoryChange(index) {
      this.categoryIndex = index
      this.categories = Object.values(this.categoryMaps)[index]
    },
    onImageChecked(event) {
      let checked = event.target.checked
      $('meta[name="referrer"]').attr("content", checked ? "never" : "always")
      axios.post(url.sendLoadImageFlag, { loadImage: checked })
    },
    OnPageClick: function(n) {
      $loading.show('loading...')
      let host = n.host,
        path = n.path,
        updatetime = n.time
      let self = this
      self.requestStatus = "going..."
      axios
        .get(url.getPageData, {
          params: {
            host: host,
            path: path
          }
        })
        .then(resp => {
          self.$nextTick(function() {
            self.page = resp.data.data.page
            self.comments = resp.data.data.comments
            self.requestStatus = ""
            self.gotoPage = true
            self.newsTime = updatetime
            n.isReaded = true
            self.$refs.newsPage.GotoPageContent()
          })
          $loading.hide()
        })
        .catch(err => {
          console.error(err)
          $loading.hide()
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
      if (newIndex == 0) {
        this.$refs.newsPage.GotoPageComment()
      }
    },
    messageFromChild: function() {
      this.gotoPage = false
    },
    moreNewsOnLoad: function(intervalDay) {
      var self = this
      self.requestStatus = "loading..."
      axios
        .get(url.getMoreData, {
          params: {
            currentMinDate: self.currentMinDate,
            intervalDay: intervalDay
          }
        })
        .then(resp => {
          let source = resp.data.data.source
          let objKeys = Object.keys(source)
          self.$nextTick(function() {
            for (let i = 0; i < objKeys.length; i++) {
              var current = self.footballNews.find(
                x => x.category == objKeys[i]
              )
              current.news = current.news.concat(source[objKeys[i]].news)
            }
            self.currentMinDate = new Date(resp.data.data.minDate)
            self.requestStatus = ""
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    refreshOnClick: function() {
      var self = this
      self.requestStatus = "loading..."
      var maxDateList = self.footballNews.map(x => {
        return {
          category: x.category,
          maxDate: x.maxDate
        }
      })
      axios
        .get(url.getIncrementalData, { params: { maxDateList: maxDateList } })
        .then(resp => {
          var incremental = resp.data.data.source
          self.$nextTick(function() {
            for (let i = 0; i < self.footballNews.length; i++) {
              var item = self.footballNews[i]
              if (
                item.category != const_news.Category.Video &&
                incremental[item.category]
              ) {
                var currentIncrementalNews = incremental[item.category].news
                if (
                  currentIncrementalNews &&
                  currentIncrementalNews.length > 0
                ) {
                  currentIncrementalNews.forEach(function(element) {
                    element.isIncremental = true
                  })
                  item.news = prototypeUtil.distinct(
                    currentIncrementalNews.concat(item.news),
                    "path"
                  )
                  item.maxDate = incremental[item.category].maxDate
                  $(".content-container").scrollTop(0)
                }
              }
            }
            self.requestStatus = ""
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
  },
  created: function() {
    //https://soccer.hupu.com/home/latest-news?league=%E8%A5%BF%E7%94%B2&page=1
    var self = this
    //Server
    self.requestStatus = "initing..."
    axios
      .get(url.getHot24Data)
      .then(resp => {
        self.$nextTick(function() {
          self.footballNews = resp.data.data.source
          self.currentMinDate = new Date(resp.data.data.minDate)
          self.requestStatus = ""
          if (resp.data.data.loadImage) {
            $(".tool-bar .toggle input")[0].checked = true
            $('meta[name="referrer"]').attr("content", "never")
          } else {
            $('meta[name="referrer"]').attr("content", "always")
          }
        })
      })
      .catch(err => {
        console.error(err)
      })
  }
}
</script>

<style lang="scss">
.image-press {
  color: #23527c;
}

.label-tab {
  margin: 0;
}

.button:after {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.tabs-top > .tabs {
  top: 0px;
}

.content-container {
  margin: 5px;
  /* height: calc(100% - 100px); */
  height: 505px;
  overflow-y: auto;
  overflow-x: hidden;

  .item-note {
    margin-top: 5px;
  }
}

.tool-bar {
  margin-top: 52px;
  position: relative;
  .min-time {
    color: #4a90e2;
    margin-left: 10px;
    display: inline-block;
    position: absolute;
    top: 4px;
  }
  .toggle {
    margin-left: 145px;
  }
}
</style>

