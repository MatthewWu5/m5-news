module.exports = {
    distinct: function (source, prop) {
        var cacheKey = []
        var cache = []
        if (source.length == 0 || !source[0].hasOwnProperty(prop)) {
            return
        }
        // for (let item of source) {
        for (index in source) {
            var item = source[index]
            if (cacheKey.indexOf(item[prop]) == -1) {
                cacheKey.push(item[prop])
                cache.push(item)
            }
        }
        return cache
    }
}