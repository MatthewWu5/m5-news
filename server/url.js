var config = ['getData1', 'getData2', 'getJsonData', 'getPageData', 'getHot24Data', 'getMoreData', 'getMoreVideoData',
    'getIncrementalData', 'getLiveData', 'getLivePageData', 'sendLoadImageFlag', 'getEndingData']

var exportObj = {}
for(index in config){
    var prop = config[index]
     exportObj[prop] = '/' + prop
}
// for (let prop of config) {
//     exportObj[prop] = '/' + prop;
// }
module.exports = exportObj