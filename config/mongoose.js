exports.default = {
    mongoose: function(api) {
        return {
            host: '192.168.1.183',
            port: '27017',
            db: 'fileServer'
        };
    }
};

exports.prod = {
    mongoose: function() {
        return {
            host: '192.168.1.183',
            port: '27017',
            db: 'fileServer'
        };
    }       
};


exports.dev = {
    mongoose: function() {
        return {
            host: '192.168.23.218',
            port: '27017',
            db: 'fileServer'
        };
    }       
};
