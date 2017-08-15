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
        let splits = req.body.path.split('/')
        let tailUrl = splits[splits.length - 1].split('.')[0];
        let commentPath = '/json/' + splits[splits.length - 2].replace(/-/g, '_') + '/news/zuqiu/'
            + tailUrl + '_hot.htm';

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
                let _videoData = util.getFormatNewsData(const_news.Category.Video, videoData, 'video')
                let minDate = new Date()
                let newsList = result._international.news;
                if (newsList.length > 0) minDate = new Date(newsList[newsList.length - 1].updatetime)
                let resultArray = util.toArray(result)
                resultArray.push(_videoData)
                res.send({ code: 200, msg: 'done', data: { source: resultArray, minDate: minDate.toString() } });
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
    }
}