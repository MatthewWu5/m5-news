Array.prototype.distinct = function (prop) {
    var cacheKey = [];
    var cache = [];
    if (this.length == 0 || !this[0].hasOwnProperty(prop)) {
        return;
    }
    for (item of this) {
        if (cacheKey.indexOf(item[prop]) == -1) {
            cacheKey.push(item[prop])
            cache.push(item)
        }
    }
    return cache;
}