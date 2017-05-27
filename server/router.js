let api = require('./api');
let url = require('./url');
var express = require('express');
var router = express.Router();

router.post(url.c2, api.getTestData1);
router.post(url.c2, api.getTestData2);

module.exports = router;