var exports = function(api) {
    var schema = {
        path: {type: String, allowNull: false, unique: true},
        readActive: {type: Boolean, allowNull: false},
        writeActive: {type: Boolean, allowNull: false},
        //buffer defines how much free space should be left untouched on the storage
        buffer: {type: Number, default: (100 * 1024 * 1024)},
        name: {type: String, allowNull: false, unique: true}


    };
    schema = api.mongoose.Schema(schema, {collection: 'storages'});
    return api.mongoose.mongoose.model('storage', schema);
};


module.exports = exports;

