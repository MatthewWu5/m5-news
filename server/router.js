let core = require('./core')
let url = require('./url')
var express = require('express')
var router = express.Router()

//dynamic loading router
// router.post(url.getJsonData, core.getJsonData)
for (prop in url) {
    router.post(url[prop], core[prop])
}

module.exports = router;