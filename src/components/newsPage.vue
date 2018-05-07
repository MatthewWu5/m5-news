<template>
    <div class="newsPage">
        <div class="news-page-container">
           <!--:propagation-first-page="true"-->
            <swipe ref="mySwipe" :speed="100" :auto="0" :continuous="false" :show-indicators="false" propagation="true">
                <swipe-item>
                    <div class="page">
                        <div class="time">{{time}}</div>
                        <div v-html="this.page"></div>
                    </div>
                </swipe-item>
                <swipe-item>
                    <list class="list-ios container-for-scroll">
                        <item v-for="item in this.comments" v-bind:key="item">
                            <p style="line-height:20px;white-space:normal">{{item.content}}</p>
                            <div class="item-note">
                                <span>{{item.up}}</span> - <span>{{item.down}}</span>
                            </div>
                        </item>
                    </list>
                </swipe-item>
            </swipe>
        </div>
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
    page.scrollTop = 0
  }
}
</script>
<style lang="scss">
$container-height: 900px;
$container-height-phone: 622px;

.news-page-container {
  height: $container-height;
  @media (max-width: 992px) {
    height: $container-height-phone;
  }
  .page,
  .comment {
    height: $container-height;
    overflow: auto;
    padding: 10px;
    width: initial;
    @media (max-width: 992px) {
      height: $container-height-phone;
    }
    color: #666;
    background-color: #fff;
    h1 {
      color: #666;
    }
  }
  @media (max-width: 992px) {
    .page {
      h1 {
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
  }
  .comment {
    .row {
      margin-top: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      margin-left: 0px;
      border-bottom: solid 1px #a8c6e2;
      position: relative;
      > div:nth-child(2) {
        position: absolute;
        right: 0;
        bottom: 0;
        > span {
          &:nth-child(1) {
            color: #3694ec;
          }
          &:nth-child(2) {
            color: #404448;
            margin-left: -3px;
            @media (max-width: 992px) {
              margin-left: -13px;
            }
          }
        }
      }
      @media (max-width: 992px) {
        border-bottom: solid 2px #a8c6e2;
      }
    }
  }
}
</style>
