<template>
    <div>
        <h>c1 - Jsonp test</h>
        <div v-for="fn in footballNews">
            <FootballNews :catagory="fn.catagory" :news="fn.news">    
            </FootballNews>
        </div>
        <router-link :to="{name: 'Component2'}">Redirect to Component2</router-link>
    </div>
</template>


<script>
import $ from 'jquery'
import FootballNews from './footballNews'
export default {
    name: 'c1',
    components: { FootballNews },
    data() {
        return {
            jsonpResult: 'loading...',
            fakeNews: [{catagory: 'hehe', news: {title: '123', url: '1'}}],
            footballNews: [],
            
        }
    },
    methods: {
        testCrossDomain: function () {
            // this.$http.jsonp('https://api.douban.com/v2/movie/in_theaters')
            //     .then(function (response) {
            //         this.guodu = false
            //         this.in_theaters_data = response
            //         this.in_theaters_data_body = response.body
            //         this.in_theaters_data_body_subjects = response.body.subjects
            //     })
            //     .catch(function (response) {
            //         console.log(response)
            //     })
            $.ajax({
                url: 'https://api.douban.com/v2/movie/in_theaters',
                dataType: "jsonp",
                jsonp: "callback",
                success: function (data) {
                    console.log(data)
                    this.jsonpResult = data
                },
                error: function (err) {
                    console.log('err')
                    console.log(err)
                }
            })
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
                    // console.log(jijin)
                    // console.log(internationalData)
                    // //console.log(championLeagueData)
                    // console.log(international_official)
                    // console.log(international_conclusion)
                    this.footballNews = international_conclusion.map(function (x) {
                        return {
                            catagory: '国际',
                            news: {
                                title: x.title,
                                url: x.url,
                            }
                        }
                    });
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
