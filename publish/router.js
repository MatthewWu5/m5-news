let core = require('../server/core')
let url = require('../server/url')
var express = require('express')
var router = express.Router()

//dynamic loading router
// router.post(url.getJsonData, core.getJsonData)
for (prop in url) {
  router.post(url[prop], core[prop])
}
router.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});
router.get('/*', function (req, res) {
  if (req.url == '/__webpack_hmr') {
    res.send()
  } else {
    res.sendFile(__dirname + '/dist' + req.url)
  }
});

module.exports = router;