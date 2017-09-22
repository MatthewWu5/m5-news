var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 8081;

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var router = require('../router');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//add router
app.use(router);