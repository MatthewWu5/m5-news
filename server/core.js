module.exports = {
    getTestData1: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '1', hehe2: req.body.pData2 } });
    },
    getTestData2: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '2', hehe2: req.body.pData2 } });
    },
    getNewsData: function (req, res) {
        //TODO: write a interception for crossdomain request
        //Access-Origin-Allow:*
        var this_req = req;
        var dataPromise = new Promise(function (resolve, reject) {
            var https = require('https');
            var url = require('url');
            // var options = url.parse('https://news.zhibo8.cc/zuqiu/json/2017-07-20.htm');
            // options.headers = {};

            //if https, should not use port and set protocol: 'https', and headers can be empty
            var options = {
                //'news.zhibo8.cc'
                host: this_req.body.host,
                //port: 80,
                //'/zuqiu/json/2017-07-20.htm'
                path: this_req.body.path,
                method: 'GET',
                headers: {
                    'Content-Type': 'text/html'
                },
                protocol: 'https:'
            };
            var req = https.request(options, function (resp) {
                var buffers = [];
                resp.on('data', function (chunk) {
                    buffers.push(chunk);
                });
                resp.on('end', function (chunk) {
                    var wholeData = Buffer.concat(buffers);
                    var dataStr = wholeData.toString('utf8');
                    res.send({ code: 200, msg: 'done', data: JSON.parse(wholeData) });
                });
            });
            req.end();
        })
    }
}