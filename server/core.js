module.exports = {
    getTestData1: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '1', hehe2: req.body.pData2 } });
    },
    getTestData2: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '2', hehe2: req.body.pData2 } });
    },
    getNewsData: function (req, res) {
        var this_req = req;
        var dataPromise = new Promise(function (resolve, reject) {
            var http = require('http');
            if (this_req.body.type == 'more') {
                var options = {
                    host: 'news.zhibo8.cc',
                    // host: 'm.zhibo8.cc',
                    port: 80,
                    path: '/zuqiu/json/2017-07-20.htm',// status 301
                    // path: '/json/hot/24hours.htm', // status 200
                    method: 'GET',
                    headers: {
                        // 'Content-Type': 'text/html'
                        'Server': 'nginx/1.0.6',
                        'Content-Type': 'text/html',
                        'Content-Length': 190576,
                        'Connection': 'keep-alive',
                        'Vary': 'Accept-Encoding',
                        'Accept-Ranges': 'bytes',
                    }
                };
                var req = http.get(options, function (resp) {
                    var buffers = [];
                    resp.on('data', function (chunk) {
                        buffers.push(chunk);
                        console.log('data: ' + chunk.toString());
                    });
                    resp.on('end', function (chunk) {
                        var wholeData = Buffer.concat(buffers);
                        var dataStr = wholeData.toString('utf8');
                        console.log('content: ' + wholeData);

                        //res.send({ code: 200, msg: 'done', data: wholeData });
                    });
                });
            }
        })
    }
}