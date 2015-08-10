var path = require('path');
var fs = require('fs');
module.exports = {
    loadPriority: 100,
    startPriority: 100,
    stopPriority: 100,
    initialize: function(api, next) {
        var dir = path.normalize(api.projectRoot + '/utils');
        fs.readdirSync(dir).forEach(function(file) {
            var nameParts = file.split("/");
            
            var name = nameParts[(nameParts.length - 1)].split(".")[0];
            var module = require(api.projectRoot + "/utils/" + nameParts)
            api.utils[name] = module;
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
