<template>
  <div class="newsPage">
    <!--:propagation-first-page="true"-->
    <swipe ref="mySwipe" :speed="100" :auto="0" :continuous="false" :show-indicators="false" propagation="true">
      <swipe-item>
        <div class="page-container">
          <div class="time">{{time}}</div>
          <div v-html="this.page"></div>
        </div>
      </swipe-item>
      <swipe-item>
        <list class="list-ios container-for-scroll">
          <item v-for="item in this.comments" v-bind:key="item">
            <p style="line-height:20px;white-space:normal">{{item.content}}</p>
            <div class="item-note">
              <span>{{item.up}}</span> -
              <span>{{item.down}}</span>
            </div>
          </item>
        </list>
      </swipe-item>
    </swipe>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from '../lib/vue-swipe'
export default {
  name: 'newsPage',
  components: { Swipe, SwipeItem },
  props: {
    page: String,
    comments: Array,
    time: String
  },
  updated() {
    var page = document.querySelector('.newsPage .page')
    if (page) {
      page.scrollTop = 0
    }
  }
}
</script>
<style lang="scss">
.newsPage {
  height: 100%;
  .page-container {
    height: 100%;
    overflow: auto;
    padding: 10px;
    width: initial;
    color: #666;
    background-color: #fff;
    h1 {
      color: #666;
      font-size: 20px;
    }
    #signals p {
      line-height: 23px;
    }
    img:not(.jijin-img) {
      width: 100%;
      max-width: initial !important;
    }
  }
  .container-for-scroll {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  } 
}
</style>
