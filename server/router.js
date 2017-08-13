let core = require('./core')
let url = require('./url')
var express = require('express')
var router = express.Router()

//TODO: dynamic loading router
router.post(url.getData1, core.getTestData1)
router.post(url.getData2, core.getTestData2)
router.post(url.getJsonData, core.getJsonData)
router.post(url.getPageData, core.getPageData)

module.exports = router;