Array.prototype.distinct = function (prop) {
    var cacheKey = [];
    var cache = [];
    if (this.length == 0 || !this[0].hasOwnProperty(prop)) {
        return;
    }
    // for (let item of this) {
    for (index in this) {
        var item = this[index]
        if (cacheKey.indexOf(item[prop]) == -1) {
            cacheKey.push(item[prop])
            cache.push(item)
        }
    }
    return cache;
}