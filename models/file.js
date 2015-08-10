var exports = function(api) {
    var schema = {
        storageId: {type: api.mongoose.Schema.Types.ObjectId},
        path: {type: String, required: true},
        name: {type: String},
        mimeType: {type: String, default: null},
        filePath: {type: String, required: true},
        size: {type: Number, required: true},
        key : {type: String, default : null },
        createDate : { type: Date, default: function(){
            return new Date();
        }}
    };

    schema = api.mongoose.Schema(schema, {collection: 'files'});

    return api.mongoose.mongoose.model('file', schema);
};


module.exports = exports;

