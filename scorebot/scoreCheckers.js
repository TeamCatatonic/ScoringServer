var request = require("request");

var checker = module.exports;

checker.ftp = function(data, callback) {
    return true;
}

checker.http = function(data, callback) {
    request(data.name, function (error, response, body) {
        if (error) return callback(false);
        if (body) return callback(true);
        return callback(false);
    });
}