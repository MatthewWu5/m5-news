var http = require("http");
var url = require("url");

function main(route, handle) {
    http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        response.writeHead(200, { "Content-Type": "text/plain" });
        route(handle, pathname, response);
    }).listen(8888);

    console.log("Server has started.");
}

exports.start = main;
