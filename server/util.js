var const_news = require('./const')
var parseJson = function (str) {
    try {
        return JSON.parse(str)
    } catch (err) {
        console.error('parseJson', err)
    }
}
var formatTime = function (dateTime) {
    let date = new Date(dateTime)
    return date.getMonth() + 1 + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
}
var isTop5League = function (str) {
    if (str.indexOf('英超') != -1 || str.indexOf('西甲') != -1 || str.indexOf('德甲') != -1 || str.indexOf('法甲') != -1 || str.indexOf('意甲') != -1) {
        return true;
    }
    return false;
}
var filterTabData = function (str) {
    if (str.indexOf('官方') != -1 || str.indexOf('盘点') != -1 || str.indexOf('趣图') != -1 || str.indexOf('GIF-') != -1) {
        return false;
    }
    return true;
}
var indexOf = function (sourceStr, indexStr) {
    if (sourceStr.indexOf(indexStr) != -1) {
        return true;
    }
}
var getFormatNewsData = function (category, rawData, urlType = 'news') {
    var result = rawData.map(function (x) {
        return {
            title: x.title,
            url: (urlType == 'news' ? 'https://news.zhibo8.cc' : 'https://www.zhibo8.cc') + x.url,
            host: (urlType == 'news' ? 'news.zhibo8.cc' : 'www.zhibo8.cc'),
            path: x.url,
            time: formatTime(x.updatetime),
            updatetime: x.updatetime,
            lable: x.lable,
            isLeo: x.title.indexOf('梅西') != -1 || x.title.toLowerCase().indexOf('messi') != -1
        }
    }).sort((x, y) => { return new Date(x.updatetime) < new Date(y.updatetime) ? 1 : -1; })

    return {
        category: category,
        news: result
    }
}
var formatRequestDate = function (minDate, index) {
    let date = new Date(minDate)
    date.setDate(date.getDate() - index);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return date.getFullYear() + '-' + month + '-' + day;
}
var assembleFootballData = function (footballData) {
    let top5LeagueData = footballData.filter(x => isTop5League(x.lable))
    let internationalData = top5LeagueData.filter(x => filterTabData(x.title))
    let international_official = top5LeagueData.filter(x => indexOf(x.title, '官方'))
    let international_conclusion = top5LeagueData.filter(x => indexOf(x.title, '盘点'))
    let international_funnyTime = footballData.filter(x => indexOf(x.title, '趣图'))

    let _international = getFormatNewsData(const_news.Category.News, internationalData)
    let _official = getFormatNewsData(const_news.Category.Official, international_official)
    let _conclusion = getFormatNewsData(const_news.Category.Conclusion, international_conclusion)
    let _funnyTime = getFormatNewsData(const_news.Category.FunnyTime, international_funnyTime)

    return {
        _international: _international,
        _official: _official,
        _conclusion: _conclusion,
        _funnyTime: _funnyTime,
    }
}
var sortandAssembleItem = function (assembleItem, newOne) {
    for (prop in assembleItem) {
        assembleItem[prop].news = assembleItem[prop].news.concat(newOne[prop].news)
        assembleItem[prop].news.sort((x, y) => { return new Date(x.updatetime) < new Date(y.updatetime) ? 1 : -1; })
    }
}

module.exports = {
    parseJson: parseJson,
    getFormatNewsData: getFormatNewsData,
    isTop5League: isTop5League,
    indexOf: indexOf,
    filterTabData: filterTabData,
    formatTime: formatTime,
    formatRequestDate: formatRequestDate,
    assembleFootballData: assembleFootballData,
    sortandAssembleItem: sortandAssembleItem,
    toArray: (obj) => {
        var arr = [];
        for (var item in obj) {
            arr.push(obj[item]);
        }
        return arr;
    },
}