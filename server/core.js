module.exports = {
    getTestData1: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '1', hehe2: req.body.pData2 } });
    },
    getTestData2: function (req, res) {
        res.send({ code: 200, msg: 'done', data: { hehe: '2', hehe2: req.body.pData2 } });
    },
    getNewsData: function (req, res) {
        var dataPromise = new Promise(function (resolve, reject) {
            var http = require('http');
            var querystring = require('querystring');
            //if (req.type == 'more') {
            var options = {
                host: 'www.zhibo8.cc',
                path: '/zuqiu/json/2017-07-20.htm',
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded',
                //     'Content-Length': contents.length
                // }
            };
            var options = {
                host: 'www.zhibo8.cc',
                port: 80,
                path: '/zuqiu/json/2017-07-20.htm',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var req = http.request(options, function (res) {
                //res.setEncoding('uft8');
                res.on('data', function (data) {
                    console.log(data);
                    resolve(data);
                });
            });
            //}
        })

        res.send({ code: 200, msg: 'done', data: dataPromise });
    }
}