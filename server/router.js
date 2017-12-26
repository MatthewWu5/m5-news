let core = require('./core')
let url = require('./url')
var express = require('express')
var router = express.Router()

//dynamic loading router
// router.post(url.getJsonData, core.getJsonData)
for (let prop in url) {
    function addCatch(req, res) {
        try {
            core[prop](req, res)
        } catch (ex) {
            console.log(req.url, ex)
        }
    }
    router.post(url[prop], addCatch)
}

module.exports = router;