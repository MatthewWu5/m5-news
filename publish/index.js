var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 8081;

http.listen(port, function () {
  console.log('listening on *:' + port);
});

var bodyParser = require('body-parser');
var router = require('../server/router');
router.get('/*', function (req, res) {
  if (req.url == '/__webpack_hmr') {
    res.send()
  } else {
    res.sendFile(__dirname + '/dist' + req.url)
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//add router
app.use(router);