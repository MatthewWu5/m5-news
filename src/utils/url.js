import config from '../config'

var serverUrl = config.serverPrefixUrl
var action = ['getPageData', 'getHot24Data', 'getMoreData', 'getMoreVideoData',
    'getIncrementalData', 'getLiveData', 'getLivePageData', 'getEndingData', 'sendLoadImageFlag']

var urlObj = {}
for (let item of action) {
    urlObj[item] = serverUrl + item
}

module.exports = urlObj