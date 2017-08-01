let core = require('./core');
let url = require('./url');
var express = require('express');
var router = express.Router();

router.post(url.getData1, core.getTestData1);
router.post(url.getData2, core.getTestData2);
router.post(url.getNewsData, core.getNewsData);

module.exports = router;