var https = require('https')
var url = require('url')
var cheerio = require('cheerio')
var util = require('./util')
var const_news = require('./const')
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
        //https://news.zhibo8.cc/zuqiu/2017-08-12/598ec61e92a37.htm
        //https://cache.zhibo8.cc/json/2017_08_12/news/zuqiu/598ec61e92a37_hot.htm

        //https://www.zhibo8.cc/zuqiu/2017/0816-fangshou.htm
        //https://cache.zhibo8.cc/json/2017/zuqiujijin/0816/fangshou_hot.htm

        let commentPath;
        if (req.body.host == 'news.zhibo8.cc') {
            let splits = req.body.path.split('/')
            let tailUrl = splits[splits.length - 1].split('.')[0];
            commentPath = '/json/' + splits[splits.length - 2].replace(/-/g, '_') + '/news/zuqiu/'
                + tailUrl + '_hot.htm';
        } else if (req.body.host == 'www.zhibo8.cc') {
            let splits = req.body.path.split('/')
            //0816-fangshou
            let tailUrl = splits[splits.length - 1].split('.')[0];
            let subStrs = tailUrl.split('-')
            commentPath = '/json/' + splits[splits.length - 2] + '/zuqiujijin/'
                + subStrs[0] + '/' + subStrs[1] + '_hot.htm';
        } else {
            return;
        }

        Promise.all([getRequestData(req.body.host, req.body.path), getRequestData('cache.zhibo8.cc', commentPath)])
            .then(function (data) {
                var comments;
                var commentData;
                var htmlData;
                if (data.length == 2) {
                    if (data[0].path == req.body.path) {
                        htmlData = data[0].data;
                        commentData = data[1].data;
                    } else {
                        htmlData = data[1].data;
                        commentData = data[0].data;
                    }

                    try {
                        $ = cheerio.load(htmlData, { decodeEntities: false })
                        var container = $('<div id="container"></div>')
                        $('#signals img').each(function (i, x) {
                            var src = $(x).attr('src')
                            if (src.indexOf('http') == -1) {
                                src = 'https:' + src
                            } else {
                                src = src.replace('http', 'https')
                            }
                            $(x).attr('src', src)
                            $(x).attr('alt', '')
                        })
                        container.append($('.title h1'))
                        container.append($('#signals'))
                        comments = util.parseJson(commentData)
                    } catch (err) {
                        console.error(err)
                    }
                    //res.setHeader('Content-Type', 'image/jpeg')
                    res.send({ code: 200, msg: 'done', data: { page: container.html(), comments: comments } })
                }
                else {
                    res.send({ code: 200, msg: 'error', data: {} })
                }
            }).catch(function (err) {
                console.error(err)
            })
    },

    getHot24Data: function (req, res) {
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

    getImageData: function (req, res) {
        getRequestData('tu.qiumibao.com', '/uploads/day_170817/5994c9ed1e9d9.jpg').then(function (respData) {
            try {
                res.setHeader("Content-Type", 'image/jpeg');
                res.send({ code: 200, msg: 'done', data: { source: result } });
            }
            catch (err) {
                console.error(err)
                res.send({ code: 200, msg: 'error', data: {} });
            }
        })
    }
}