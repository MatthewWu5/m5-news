<template>
  <div>
    <div v-for="item in footballNews" v-bind:key="item">
  
      <div>
        <span v-for="n in item.news" v-bind:key="n">
          <!--//<span>-->
          {{item.catagory+'_'+n.url+'_'+n.title}}
        </span>
        <!--<a v-for="n in item.news" :href="n.url">
                        {{n.title}}
                      </a>-->
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'footballNews',
  // props: {
  //   catagory: String,
  //   news: []
  // },
  data() {
    return {
      fakeNews: [
        { catagory: 'hehe', news: { title: '123', url: '1' } },
        { catagory: 'hehe2', news: { title: '122', url: '12' } }
      ],
      footballNews: [],
    }
  },
  mounted: function () {
    $.ajax({
      url: 'https://m.zhibo8.cc/json/hot/24hours.htm',
      dataType: "json",
      success: function (data) {

        let jijin = data.video.filter(x => x.type == 'zuqiujijin' && isTop5League(x.lable));
        let footballData = data.news.filter(x => x.type == 'zuqiu');
        let internationalData = footballData.filter(x => isTop5League(x.lable));
        let championLeagueData = footballData.filter(x => isChampionLeague(x.lable));
        let international_official = internationalData.filter(x => isOfficial(x.title));
        let international_conclusion = internationalData.filter(x => isConclusion(x.title));
        //console.log(internationalData)
        //console.log(international_official)
        //console.log(international_conclusion)

        // console.log(jijin)
        // //console.log(championLeagueData)

        this.footballNews = internationalData.map(function (x) {
          return {
            catagory: '国际',
            news: {
              title: x.title,
              url: 'https://news.zhibo8.cc' + x.url,
            }
          }
        });
        console.log('console footballNews: ')
        console.log(this.footballNews)
      },
      error: function (err) {
        console.log('err')
        console.log(err)
      }
    })
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
  }
}
</script>

