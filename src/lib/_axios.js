import axios from 'axios'

let _axios = Object.create(axios)

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    _axios.__proto__[method] = function (url, config) {
        $loading.show('loading...')
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url
        }));
    };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    _axios.__proto__[method] = function (url, data, config) {
        $loading.show('loading...')
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
});

module.exports = _axios