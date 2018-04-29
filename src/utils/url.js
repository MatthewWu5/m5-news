var serverUrl = 'http://dapi.eastasia.cloudapp.azure.com:8080/'
var action = ['getPageData', 'getHot24Data', 'getMoreData', 'getMoreVideoData',
    'getIncrementalData', 'getLiveData', 'getLivePageData', 'getEndingData', 'sendLoadImageFlag']

var urlObj = {}
for (let item of action) {
    urlObj[item] = serverUrl + item
}

module.exports = urlObj