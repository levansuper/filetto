var FileManager = function(api) {
    this.api = api;
    this.storages = {};
    this.storagesList = [];
    this.fillStorages();
};

var fileManager = FileManager.prototype;

fileManager.fillStorages = function(cb) {
    var me = this;
    me.api.models.storage.find({}, function(err, res) {
        if (err) {
            cb && cb(me.api.utils.error('dbError', err), null);
            return;
        }
        for(var i in res){
            me.storagesList.push(res[i]);
            me.storages[res[i]._id] = res[i];
        }
        
    });
};






module.exports = FileManager;