module.exports = {
    loadPriority: 1,
    startPriority: 1,
    stopPriority: 1,
    initialize: function(api, next) {        
        api.path = __dirname + "/.."; 
        next();
    },
    start: function(api, next) {

        next();
    },
    stop: function(api, next) {
        next();
    }
};

