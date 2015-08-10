var ValidationError = require('mongoose/lib/error/validation');
var ValidatorError = require('mongoose/lib/error/validator');
var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        , ObjectId = Schema.ObjectId;
var fs = require('fs');
var path = require('path');

var loadModels = function(api, next) {
    var modelsPath = path.normalize(api.path + '/models');
    api.models = {};
    fs.readdir(modelsPath, function(err, files) {
        if (err) {
            throw err;
        }
        files.forEach(function(file) {
            // Get the Model
            var name = file.replace('.js', '');
            var model = require(modelsPath + '/' + name)(api);
            api.models[name] = model;
        });
        next();
    });
};

module.exports = {
    loadPriority: 100,
    startPriority: 1000,
    stopPriority: 1000,
    initialize: function(api, next) {
        api.mongoose = {
            mongoose: mongoose,
            ValidationError : ValidationError,
            ValidatorError : ValidatorError,
            Schema : Schema,
            ObjectId : ObjectId
        };
        var conf = api.config.mongoose;
        mongoose.connect("mongodb://"+conf.host+":"+conf.port+"/"+conf.db);
        loadModels(api, next);
    },
    start: function(api, next) {

        next();
    },
    stop: function(api, next) {
        next();
    }
};