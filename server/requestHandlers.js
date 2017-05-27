function start(response) {
    response.write("start page");
    response.end();
}

function upload(response) {
    response.write("upload page");
    response.end();
}

exports.start = start;
exports.upload = upload;