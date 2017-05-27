function route(handle, pathname, response) {
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response);
    } else {
        console.log("No request handler found for " + pathname);
    }
}

exports.route = route;