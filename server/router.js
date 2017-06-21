let api = require('./api');
let url = require('./url');
var express = require('express');
var router = express.Router();

router.post(url.getData1, api.getTestData1);
router.post(url.getData2, api.getTestData2);

module.exports = router;