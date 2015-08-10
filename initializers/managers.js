var path = require('path');
var fs = require('fs');
module.exports = {
    loadPriority: 1000,
    startPriority: 1000,
    stopPriority: 1000,
    initialize: function(api, next) {
        api.managers = {};
        var dir = path.normalize(api.projectRoot + '/managers');
        fs.readdirSync(dir).forEach(function(file) {
            var nameParts = file.split("/");

            var name = nameParts[(nameParts.length - 1)].split(".")[0];
            var module = require(api.projectRoot + "/managers/" + nameParts);
            api.managers[name] = new module(api);
        });
        next();
    },
    start: function(api, next) {

        next();
    },
    stop: function(api, next) {
        next();
    }
};
