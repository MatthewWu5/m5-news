// Array.prototype.distinct = function (prop) {
//     var cacheKey = [];
//     var cache = [];
//     if (this.length == 0 || !this[0].hasOwnProperty(prop)) {
//         return;
//     }
//     // for (let item of this) {
//     for (index in this) {
//         var item = this[index]
//         if (cacheKey.indexOf(item[prop]) == -1) {
//             cacheKey.push(item[prop])
//             cache.push(item)
//         }
//     }
//     return cache;
// }

//In vue page???But why array.forEach and array.filter can catch the extension method, i can't understand!!!
module.exports = {
    distinct: function (source, prop) {
        var cacheKey = [];
        var cache = [];
        if (source.length == 0 || !source[0].hasOwnProperty(prop)) {
            return;
        }
        // for (let item of source) {
        for (index in source) {
            var item = source[index]
            if (cacheKey.indexOf(item[prop]) == -1) {
                cacheKey.push(item[prop])
                cache.push(item)
            }
        }
        return cache;
    }
}