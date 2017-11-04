var https = require('https')
var url = require('url')
var cheerio = require('cheerio')
var util = require('./util')
var const_news = require('./const')
require('./prototype')
var getRequestData = function (host, path) {
    return new Promise(function (resolve, reject) {
        // var options = url.parse('https://news.zhibo8.cc/zuqiu/json/2017-07-20.htm');
        // options.headers = {};

        //if https, should not use port and set protocol: 'https', and headers can be empty
        var options = {
            host: host,
            path: path,
            method: 'GET',
            protocol: 'https:',
            headers: {
                'Content-Type': 'text/html'
            },
        }
        var req = https.request(options, function (resp) {
            var buffers = [];
            resp.on('data', function (chunk) {
                buffers.push(chunk);
            })
            resp.on('end', function (chunk) {
                var wholeData = Buffer.concat(buffers);
                var dataStr = wholeData.toString('utf8');
                // var dataStr = wholeData.toString();
                resolve({ data: dataStr, path: path })
            })
        })
        req.end();
    })
}

var hot24HoursCache = {}
var liveDataCache = {}

module.exports = {
    getData1: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '1', hehe2: req.body.pData2 } });
    },
    getData2: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '2', hehe2: req.body.pData2 } });
    },
    getJsonData: function (req, res) {
        getRequestData(req.body.host, req.body.path).then(function (data) {
            let jsonResult = util.parseJson(data.data)
            res.send({ code: 200, msg: 'done', data: jsonResult });
        })
    },
    getPageData: function (req, res) {
        //news
        //https://news.zhibo8.cc/zuqiu/2017-08-12/598ec61e92a37.htm
        //https://cache.zhibo8.cc/json/2017_08_12/news/zuqiu/598ec61e92a37_hot.htm
        //https://cache.zhibo8.cc/json/2017_10_29/news/zuqiu/59f58854150d5_0.htm

        //video
        //https://www.zhibo8.cc/zuqiu/2017/0816-fangshou.htm
        //https://cache.zhibo8.cc/json/2017/zuqiujijin/0816/fangshou_hot.htm

        let hotCommentPath, commentPath
        if (req.body.host == 'news.zhibo8.cc') {
            let splits = req.body.path.split('/')
            let tailUrl = splits[splits.length - 1].split('.')[0];
            hotCommentPath = '/json/' + splits[splits.length - 2].replace(/-/g, '_') + '/news/zuqiu/'
                + tailUrl + '_hot.htm';
            commentPath = '/json/' + splits[splits.length - 2].replace(/-/g, '_') + '/news/zuqiu/'
                + tailUrl + '_0.htm';
            var isMatchContent = parseInt(tailUrl) > 0
        } else if (req.body.host == 'www.zhibo8.cc') {
            let splits = req.body.path.split('/')
            //0816-fangshou
            let tailUrl = splits[splits.length - 1].split('.')[0];
            let subStrs = tailUrl.split('-')
            hotCommentPath = '/json/' + splits[splits.length - 2] + '/zuqiujijin/'
                + subStrs[0] + '/' + subStrs[1] + '_hot.htm';
            commentPath = '/json/' + splits[splits.length - 2] + '/zuqiujijin/'
                + subStrs[0] + '/' + subStrs[1] + '_0.htm';
        } else {
            return;
        }

        /*
        if (req.body.isPage) {
            getRequestData(req.body.host, req.body.path).then(function (data) {
                try {
                    $ = cheerio.load(data.data, { decodeEntities: false })
                    var container = $('<div id="container"></div>')
                    if (hot24HoursCache.date && !hot24HoursCache.loadImage) {
                        if (isMatchContent && !$('#signals').html()) {
                            $('.zb_left img').remove()
                            $('.jijin-link').attr('target', '_blank')
                            container.append($('.zb_left .tzhanbao .title'))
                            container.append($('.zb_left .tzhanbao .content'))
                        }
                        else {
                            $('#signals img').remove()
                            container.append($('.title h1'))
                            container.append($('#signals'))
                        }
                    } else {
                        if (isMatchContent && !$('#signals').html()) {
                            $('.zb_left img').each(function (i, x) {
                                var src = $(x).attr('src')
                                if (src.indexOf('http') == -1) {
                                    src = 'https:' + src
                                }
                                $(x).attr('src', src)
                                $(x).attr('alt', '')
                            })
                            $('.jijin-link').attr('target', '_blank')
                            container.append($('.zb_left .tzhanbao .title'))
                            container.append($('.zb_left .tzhanbao .content'))
                        } else {
                            $('#signals img').each(function (i, x) {
                                var src = $(x).attr('src')
                                if (src.indexOf('http') == -1) {
                                    src = 'https:' + src
                                }
                                $(x).attr('src', src)
                                $(x).attr('alt', '')
                            })
                            container.append($('.title h1'))
                            container.append($('#signals'))
                        }
                    }
                    res.send({ code: 200, msg: 'done', data: { page: container.html() } })
                } catch (err) {
                    res.send({ code: 503, msg: 'error', data: { page: `Error: ${err}` } })
                }
            })
        } else if (req.body.isComment) {
            getRequestData('cache.zhibo8.cc', commentPath).then(function (data) {
                try {
                    res.send({ code: 200, msg: 'done', data: { comments: util.parseJson(data.data) } })
                } catch (err) {
                    res.send({ code: 503, msg: 'error', data: { comments: [], error: err } })
                }
            })
        }
        */

        Promise.all([getRequestData(req.body.host, req.body.path), getRequestData('cache.zhibo8.cc', hotCommentPath), getRequestData('cache.zhibo8.cc', commentPath)])
            .then(function (resps) {
                var hotCommentData;
                var commentData;
                var htmlData;
                if (resps.length == 3) {
                    for (let resp of resps) {
                        switch (resp.path) {
                            case req.body.path: htmlData = resp.data
                                continue
                            case hotCommentPath: hotCommentData = resp.data
                                continue
                            case commentPath: commentData = resp.data
                                continue
                        }
                    }

                    $ = cheerio.load(htmlData, { decodeEntities: false })
                    var container = $('<div id="container"></div>')
                    if (hot24HoursCache.date && !hot24HoursCache.loadImage) {
                        if (isMatchContent && !$('#signals').html()) {
                            $('.zb_left img').remove()
                            $('.jijin-link').attr('target', '_blank')
                            container.append($('.zb_left .tzhanbao .title'))
                            container.append($('.zb_left .tzhanbao .content'))
                        }
                        else {
                            $('#signals img').remove()
                            container.append($('.title h1'))
                            container.append($('#signals'))
                        }
                    } else {
                        if (isMatchContent && !$('#signals').html()) {
                            $('.zb_left img').each(function (i, x) {
                                var src = $(x).attr('src')
                                if (src.indexOf('http') == -1) {
                                    src = 'https:' + src
                                } 
                                $(x).attr('src', src)
                                $(x).attr('alt', '')
                            })
                            $('.jijin-link').attr('target', '_blank')
                            container.append($('.zb_left .tzhanbao .title'))
                            container.append($('.zb_left .tzhanbao .content'))
                        } else {
                            $('#signals img').each(function (i, x) {
                                var src = $(x).attr('src')
                                if (src.indexOf('http') == -1) {
                                    src = 'https:' + src
                                } 
                                $(x).attr('src', src)
                                $(x).attr('alt', '')
                            })
                            container.append($('.title h1'))
                            container.append($('#signals'))
                        }
                    }

                    var comments = util.parseJson(hotCommentData)
                    if (comments && comments.length > 0) {
                        comments = comments.concat(util.parseJson(commentData))
                        comments = comments.distinct('id')
                    } else {
                        comments = util.parseJson(commentData)
                    }

                    var selectedComments = comments.map(function (comment) {
                        return {
                            up: comment.up,
                            down: comment.down,
                            content: comment.content
                        }
                    })
                    res.send({ code: 200, msg: 'done', data: { page: container.html(), comments: selectedComments } })
                }
                else {
                    res.send({ code: 404, msg: 'error', data: {} })
                }
            }).catch(function (err) {
                res.send({ code: 503, msg: 'error', data: { page: `Error: ${err}` } })
            })
    },

    getHot24Data: function (req, res) {
        if (hot24HoursCache.date && (new Date().getTime() - hot24HoursCache.date.getTime()) / 1000 / 3600 < 2) {
            res.send({ code: 200, msg: 'done', data: { source: hot24HoursCache.source, minDate: hot24HoursCache.minDate, loadImage: hot24HoursCache.loadImage } })
            return
        }
        getRequestData('m.zhibo8.cc', '/json/hot/24hours.htm').then(function (respData) {
            try {
                let data = util.parseJson(respData.data)
                let videoData = data.video.filter(x => x.type == 'zuqiujijin' && util.isTop5League(x.lable));
                let footballData = data.news.filter(x => x.type == 'zuqiu');
                var result = util.assembleFootballData(footballData)
                let _hotVideo = util.getFormatNewsData(const_news.Category.Video, videoData, 'video')
                let minDate = new Date()
                let newsList = result._international.news;
                if (newsList.length > 0) minDate = new Date(newsList[newsList.length - 1].updatetime)
                let resultArray = util.toArray(result)
                resultArray.push(_hotVideo)
                hot24HoursCache.date = new Date()
                hot24HoursCache.source = resultArray
                hot24HoursCache.minDate = minDate.toString()
                res.send({ code: 200, msg: 'done', data: { source: resultArray, minDate: minDate.toString() } });
            }
            catch (err) {
                console.error(err)
                res.send({ code: 200, msg: 'error', data: {} });
            }
        })
    },

    getIncrementalData: function (req, res) {
        var maxDateList = req.body.maxDateList;
        getRequestData('m.zhibo8.cc', '/json/hot/24hours.htm').then(function (respData) {
            try {
                let data = util.parseJson(respData.data)
                let videoData = data.video.filter(x => x.type == 'zuqiujijin' && util.isTop5League(x.lable) && new Date(x.updatetime)
                    > new Date(maxDateList.find(x => x.category == const_news.Category.Video).maxDate))
                let footballData = data.news.filter(x => x.type == 'zuqiu');
                var result = util.assembleFootballData(footballData, maxDateList)
                let _hotVideo = util.getFormatNewsData(const_news.Category.Video, videoData, 'video')
                result._hotVideo = _hotVideo;
                if (hot24HoursCache.date) {
                    var insertData = function (incrementalNews, source, category) {
                        if (incrementalNews.length > 0) {
                            var news = source.find(x => x.category == category).news
                            incrementalNews.reverse()
                            for (let incre of incrementalNews) {
                                var findResult = news.find(x => x.path == incre.path)
                                if (findResult) {
                                    findResult.title = incre.title
                                    findResult.url = incre.url
                                    findResult.host = incre.host
                                    findResult.time = incre.time
                                    findResult.updatetime = incre.updatetime
                                    findResult.lable = incre.lable
                                    findResult.isLeo = incre.isLeo
                                } else {
                                    news.unshift(incre)
                                }
                            }
                            // source.find(x => x.category == category).news = news.distinct('path')
                        }
                    }
                    insertData(result._international.news, hot24HoursCache.source, '_international')
                    insertData(result._hotVideo.news, hot24HoursCache.source, '_hotVideo')
                    insertData(result._conclusion.news, hot24HoursCache.source, '_conclusion')
                    insertData(result._funnyTime.news, hot24HoursCache.source, '_funnyTime')
                    insertData(result._official.news, hot24HoursCache.source, '_official')
                }
                res.send({ code: 200, msg: 'done', data: { source: result } });
            }
            catch (err) {
                console.error(err)
                res.send({ code: 200, msg: 'error', data: {} });
            }
        })
    },

    getMoreData: function (req, res) {
        var currentMinDate = new Date(req.body.currentMinDate)
        var intervalDay = parseInt(req.body.intervalDay)
        if (intervalDay > 30) intervalDay = 30;

        var promiseArray = [];
        for (var i = 1; i < intervalDay + 1; i++) {
            var date = util.formatRequestDate(currentMinDate, i)
            promiseArray.push(getRequestData('news.zhibo8.cc', '/zuqiu/json/' + date + '.htm'))
        }
        Promise.all(promiseArray).then(function (respDataArray) {
            try {
                let resultAssembleItem;
                for (respData of respDataArray) {
                    let data = util.parseJson(respData.data)
                    let footballData = data.video_arr.filter(x => x.type == 'zuqiu');
                    let result = util.assembleFootballData(footballData)
                    if (!resultAssembleItem) {
                        resultAssembleItem = result;
                    } else {
                        util.sortandAssembleItem(resultAssembleItem, result)
                    }
                }
                currentMinDate.setDate(currentMinDate.getDate() - intervalDay);

                res.send({ code: 200, msg: 'done', data: { source: resultAssembleItem, minDate: currentMinDate.toString() } });
            }
            catch (err) {
                console.error(err)
                res.send({ code: 200, msg: 'error', data: {} });
            }
        })
    },

    getMoreVideoData: function (req, res) {
        var currentMinDate = new Date(req.body.currentMinDate)
        var intervalDay = parseInt(req.body.intervalDay)
        if (intervalDay > 30) intervalDay = 30;

        var promiseArray = [];
        for (var i = 1; i < intervalDay + 1; i++) {
            var date = util.formatRequestDate(currentMinDate, i)
            promiseArray.push(getRequestData('www.zhibo8.cc', '/zuqiu/json/' + date + '.htm'))
        }
        Promise.all(promiseArray).then(function (respDataArray) {
            try {
                let resultArray = [];
                for (respData of respDataArray) {
                    let data = util.parseJson(respData.data)
                    let videoData = data.video_arr.filter(x => x.type == 'zuqiujijin' && x.lable.indexOf('梅西') != -1);
                    let result = videoData.map(function (x) {
                        return {
                            title: x.title,
                            url: 'https://www.zhibo8.cc' + x.url,
                            time: util.formatTime(x.updatetime),
                            updatetime: x.updatetime,
                        }
                    })
                    result.sort(util.sortByTimeDesc)
                    if (result.length > 0) {
                        if (resultArray.length > 0) {
                            if (new Date(resultArray[0].updatetime) > new Date(result[0].updatetime)) {
                                resultArray = resultArray.concat(result)
                            } else {
                                resultArray = result.concat(resultArray)
                            }

                        } else {
                            //first time
                            resultArray = result;
                        }
                    }
                }
                currentMinDate.setDate(currentMinDate.getDate() - intervalDay)

                res.send({ code: 200, msg: 'done', data: { source: resultArray, minDate: currentMinDate.toString() } })
            }
            catch (err) {
                console.error(err)
                res.send({ code: 200, msg: 'error', data: {} });
            }
        })
    },

    getLiveData: function (req, res) {
        if (liveDataCache.date && (new Date().getTime() - liveDataCache.date.getTime()) / 1000 / 3600 < 2) {
            res.send({ code: 200, msg: 'done', data: liveDataCache.liveData })
            return
        }
        getRequestData('www.zhibo8.cc', '/index.html').then(function (data) {
            var collection = []
            $ = cheerio.load(data.data, { decodeEntities: false })
            $('.schedule_container>div.box').each(function (i, box) {
                var time = $(box).find('.titlebar h2').attr('title')
                var matchPerDay = []
                $(box).find('.content ul>li').each(function (liIndex, liEle) {
                    if ($(liEle).find('b').length > 0) {
                        let label = $(liEle).attr('label')
                        if (util.isMatchInLive(label)) {
                            matchPerDay.push({
                                text: $(liEle).text(),
                                href: 'https://www.zhibo8.cc' + $($(liEle).children('a')[0]).attr('href'),
                                host: 'www.zhibo8.cc',
                                path: $($(liEle).children('a')[0]).attr('href'),
                                myFollow: util.indexOf(label, '曼城') || util.indexOf(label, '巴塞罗那')
                            })
                        }
                    }
                })
                if (matchPerDay.length > 0) {
                    collection.push({ date: time + ' 星期' + new Date(time).getDay(), match: matchPerDay })
                }
            })
            liveDataCache.date = new Date()
            liveDataCache.liveData = collection
            res.send({ code: 200, msg: 'done', data: collection })
        }).catch(function (err) {
            console.error(err)
            res.send({ code: 200, msg: 'error' })
        })
    },

    getLivePageData: function (req, res) {
        //https://www.zhibo8.cc/zhibo/zuqiu/2017/1014liwupuvsmanlian.htm
        //https://cache.zhibo8.cc/json/2017/zuqiu/1014liwupuvsmanlian_hot.htm
        //div.ft_video

        let splits = req.body.path.split('/')
        let tailUrl = splits[splits.length - 1].split('.')[0]
        let commentPath = '/json/' + splits[splits.length - 2] + '/zuqiu/' + tailUrl + '_hot.htm'
        Promise.all([getRequestData(req.body.host, req.body.path), getRequestData('cache.zhibo8.cc', commentPath)])
            .then(function (data) {
                var commentData
                var htmlData
                if (data.length == 2) {
                    if (data[0].path == req.body.path) {
                        htmlData = data[0].data
                        commentData = data[1].data
                    } else {
                        htmlData = data[1].data
                        commentData = data[0].data
                    }

                    $ = cheerio.load(htmlData, { decodeEntities: false })
                    res.send({ code: 200, msg: 'done', data: { page: $('div.ft_video').html(), comments: util.parseJson(commentData) } })
                }
            }).catch(function (err) {
                console.error(err)
                res.send({ code: 200, msg: 'error' })
            })
    },

    getEndingData: function (req, res) {
        if (liveDataCache.date && (new Date().getTime() - liveDataCache.date.getTime()) / 1000 / 3600 < 2) {
            res.send({ code: 200, msg: 'done', data: liveDataCache.endData })
            return
        }
        var today = util.formatRequestDate(new Date())
        var yesterday = util.formatRequestDate(new Date(), 1)
        Promise.all([getRequestData('m.zhibo8.cc', `/json/record/${today}.htm`), getRequestData('m.zhibo8.cc', `/json/record/${yesterday}.htm`)]).then(function (data) {
            if (data.length == 2) {
                var collection = []
                for (let item of data) {
                    var resultList = util.parseJson(item.data).list.filter(x => x.type == 'football' && util.isMatchInLive(x.label))
                    if (resultList.length > 0) {
                        var mapedData = resultList.map(function (x) {
                            return {
                                text: `${x.stime} ${x.league.name_cn} ${x.home_team} - ${x.visit_team}`,
                                highlight: 'https://m.zhibo8.cc' + x.url,
                                record: 'https://www.zhibo8.cc' + x.luxiang_url,
                                myFollow: util.indexOf(x.label, '曼城') || util.indexOf(x.label, '巴塞罗那')
                            }
                        })
                        mapedData.reverse()
                        collection.push({ date: resultList[0].sdate + ' 星期' + new Date(resultList[0].sdate).getDay(), match: mapedData })
                    }
                }
                if (collection.length == 2 && collection[0].date > collection[1].date) {
                    collection = [collection[1], collection[0]]
                }
                liveDataCache.endData = collection
                res.send({ code: 200, msg: 'done', data: collection })
            }
        }).catch(function (err) {
            console.error(err)
            res.send({ code: 200, msg: 'error' })
        })
    },

    sendLoadImageFlag: function (req, res) {
        hot24HoursCache.loadImage = req.body.loadImage
        res.send()
    },
}