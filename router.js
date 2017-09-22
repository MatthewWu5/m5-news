let core = require('./server/core')
let url = require('./server/url')
var express = require('express')
var router = express.Router()

//dynamic loading router
// router.post(url.getJsonData, core.getJsonData)
for (prop in url) {
    router.post(url[prop], core[prop])
}
router.get('/', function(req, res){
  res.sendFile(__dirname + '/publish/index.html');
});
router.get('/app.js', function(req, res){
  res.sendFile(__dirname + '/publish/app.js');
});

module.exports = router;