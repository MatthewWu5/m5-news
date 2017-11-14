var const_news = require('./const')
var parseJson = function (str) {
    try {
        return JSON.parse(str)
    } catch (err) {
        console.error('parseJson error =======> ', err)
    }
}
var sortByTimeDesc = function (x, y) {
    return new Date(x.updatetime) < new Date(y.updatetime) ? 1 : -1;
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
var isMatchInLive = function (str) {
    if (str.indexOf('足球') != -1) {
        if (str.indexOf('曼城') != -1 || str.indexOf('曼联') != -1
            || str.indexOf('阿森纳') != -1 || str.indexOf('切尔西') != -1
            || str.indexOf('利物浦') != -1 || str.indexOf('热刺') != -1
            || str.indexOf('巴塞罗那') != -1 || str.indexOf('皇家马德里') != -1
            || str.indexOf('巴黎圣日耳曼') != -1
            || str.indexOf('拜仁慕尼黑') != -1
            || str.indexOf('巴西') != -1
            || str.indexOf('阿根廷') != -1
            || str.indexOf('西班牙') != -1
            || str.indexOf('法国') != -1
            || str.indexOf('德国') != -1
            || str.indexOf('比利时') != -1
            || str.indexOf('英格兰') != -1
            || str.indexOf('葡萄牙') != -1
            || str.indexOf('意大利') != -1) {
            return true
        }
    }
    return false
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
        news: result,
        maxDate: result.length > 0 ? new Date(result[0].updatetime).toString() : ''
    }
}
var formatRequestDate = function (minDate, index = 0) {
    let date = new Date(minDate)
    date.setDate(date.getDate() - index);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return date.getFullYear() + '-' + month + '-' + day;
}
var assembleFootballData = function (footballData, maxDateList) {
    let top5LeagueData = footballData.filter(x => isTop5League(x.lable))
    let internationalData, international_official, international_conclusion, international_funnyTime;
    if (maxDateList) {
        let internationalMaxDate = maxDateList.find(x => x.category == const_news.Category.News).maxDate;
        let officialMaxDate = maxDateList.find(x => x.category == const_news.Category.Official).maxDate;
        let conclusionMaxDate = maxDateList.find(x => x.category == const_news.Category.Conclusion).maxDate;
        let funnyTimeMaxDate = maxDateList.find(x => x.category == const_news.Category.FunnyTime).maxDate;
        internationalData = top5LeagueData.filter(x => filterTabData(x.title) && new Date(x.updatetime) > new Date(internationalMaxDate))
        international_official = top5LeagueData.filter(x => indexOf(x.title, '官方') && new Date(x.updatetime) > new Date(officialMaxDate))
        international_conclusion = top5LeagueData.filter(x => indexOf(x.title, '盘点') && new Date(x.updatetime) > new Date(conclusionMaxDate))
        international_funnyTime = footballData.filter(x => indexOf(x.title, '趣图') && new Date(x.updatetime) > new Date(funnyTimeMaxDate))
    } else {
        internationalData = top5LeagueData.filter(x => filterTabData(x.title))
        international_official = top5LeagueData.filter(x => indexOf(x.title, '官方'))
        international_conclusion = top5LeagueData.filter(x => indexOf(x.title, '盘点'))
        international_funnyTime = footballData.filter(x => indexOf(x.title, '趣图'))
    }

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
        assembleItem[prop].news.sort(sortByTimeDesc)
    }
}

module.exports = {
    parseJson: parseJson,
    sortByTimeDesc: sortByTimeDesc,
    getFormatNewsData: getFormatNewsData,
    isTop5League: isTop5League,
    isMatchInLive: isMatchInLive,
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