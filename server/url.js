var config = ['getData1', 'getData2', 'getJsonData', 'getPageData', 'getHot24Data', 'getMoreData', 'getMoreVideoData',
    'getIncrementalData', 'getLiveData', 'getLivePageData', 'sendLoadImageFlag', 'getEndingData']

var exportObj = {}
config.forEach(function(item){
    exportObj[item] = '/' + item
})
//Do not use 'for in' on array
// for (let index in config) {
//     if (config.hasOwnProperty(index)) {
//         var prop = config[index]
//         exportObj[prop] = '/' + prop
//     }
// }
// for (let prop of config) {
//     exportObj[prop] = '/' + prop;
// }
module.exports = exportObj