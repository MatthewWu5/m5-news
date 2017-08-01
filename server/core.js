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
            //if (req.type == 'more') {
            var options = {
                host: 'www.zhibo8.cc',
                port: 80,
                path: '/zuqiu/json/2017-07-20.htm',
                method: 'GET',
                headers: {
                    'Content-Type': 'text/html'
                }
            };
            var req = http.get(options, function (resp) {
                //resp.setEncoding('uft8');
                resp.on('data', function (data, data2, data3) {
                    console.log(data);
                    resolve(data);
                });
            });

            var options2 = {
                host: 'api.douban.com',
                port: 80,
                path: '/v2/movie/in_theaters',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            };
            var req2 = http.get(options, function (resp) {
                //resp.setEncoding('utf8');
                resp.on('data', function (data) {
                    console.log(data);
                });
            });
            //}
        })

        res.send({ code: 200, msg: 'done', data: '' });
    }
}