var https = require('https')
var url = require('url')
var cheerio = require('cheerio')
var getRequestData = function (host, path) {
    console.log('begin=>', new Date().toString(), path)
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
                console.log('end=>', new Date().toString(), path)
                resolve({ data: dataStr, path: path })
            })
        })
        req.end();
    })
}

module.exports = {
    getTestData1: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '1', hehe2: req.body.pData2 } });
    },
    getTestData2: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '2', hehe2: req.body.pData2 } });
    },
    getJsonData: function (req, res) {
        getRequestData(req.body.host, req.body.path).then(function (data) {
            var jsonResult;
            try {
                jsonResult = JSON.parse(data.data)
            } catch (err) {
                console.error(err)
            }
            res.send({ code: 200, msg: 'done', data: jsonResult });
        })
    },
    getPageData: function (req, res) {
        console.log('begin', new Date().toString())
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
                        $('#signals img').each(function (i, x) {
                            var src = $(x).attr('src')
                            if (src.indexOf('http') == -1) {
                                src = 'https:' + src
                            } else {
                                src = src.replace('http', 'https')
                            }
                            $(x).attr('src', src)
                        })
                        comments = JSON.parse(commentData)
                    } catch (err) {
                        console.error(err)
                    }
                    console.log('end', new Date().toString())
                    res.send({ code: 200, msg: 'done', data: { page: $('#signals').html(), comments: comments } })
                }
                else {
                    res.send({ code: 200, msg: 'error', data: {} })
                }
            }).catch(function (err) {
                console.error(err)
            })
    }
}