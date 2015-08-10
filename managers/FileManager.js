var fs = require('fs-extra');
var diskspace = require('diskspace');
var fileType = require('file-type');
var path = require('path');
var ReadableStreamClone = require('readable-stream-clone');
var FileManager = function(api) {
    this.api = api;
};

var fileManager = FileManager.prototype;

fileManager.saveFile = function(file, key, cb) {
    var me = this;
    me.api.models.storage.find({writeActive: true}, function(err, res) {
        if (err || res.length === 0) {
            cb(me.api.utils.error('noWriteStorage', err), null);
            return;
        }
        me.checkStoragesForFreeSpace(res, file.size, 0, function(err, storage) {
            if (err) {
                cb(err, null);
                return;
            }
            var id = me.api.mongoose.mongoose.Types.ObjectId();
            var folder = generateFilePathById(id);
            var filePath = storage.path + folder;
            var fileNameInTheFileSystem = id.toString();
            var writeStream = fs.createOutputStream(filePath + fileNameInTheFileSystem);
            fs.createReadStream(file.path).pipe(writeStream);

            writeStream.on('finish', function() {
                fs.unlink(file.path);
                var fileDB = new me.api.models.file({
                    mimeType: file.type || null,
                    storageId: storage._id,
                    _id: id,
                    name: file.name,
                    filePath: storage._id.toString() + id.toString(),
                    size: file.size,
                    path: folder,
                    key : key
                });
                fileDB.save(function(err, res) {
                    if (err) {
                        cb(me.api.utils.error('dbError', err), null);
                        return;
                    }
                });
                cb(null, fileDB);
            });
        });
    });
};

fileManager.getFile = function(fileId, key, cb) {
    var me = this;
    me.getFilePathById(fileId, key, function(err, res) {
        if (err) {
            cb(err, null);
            return;
        }

        var stream = fs.createReadStream(res.data.filePath);
        cb(null, {
            stream: stream,
            metaData: res.data.metaData
        });
    });
};



fileManager.getImage = function(fileId, key, p, cb) {
    var me = this;

    me.getFilePathById(fileId, key, function(err, res) {
        if (err) {
            cb(err, null);
            return;
        }
        var metaData = res.data.metaData;
        var path = res.data.filePath;

        if (!me.api.config.transform.supportedImageFormats[metaData.mimeType]) {
            cb(me.api.utils.error('resizeFormat', null));
            return;
        }
  
        var transformedFilePath = path + "_" + p.width + "_" + p.height + "_" + p.crop;
        fs.exists(transformedFilePath, function(exists) {
            if (exists) {
                var stream = fs.createReadStream(transformedFilePath);
                cb(null, {
                    stream: stream,
                    metaData: metaData
                });
                return;
            }

            me.api.managers.FileTransformManager.transform(path, p, function(err, res) {
                if (err) {
                    cb(err, null);
                    return;
                }
                res.metaData = metaData;
                var readableStream = new ReadableStreamClone(res.stream);
                var writeStream = fs.createWriteStream(transformedFilePath);
                readableStream.pipe(writeStream);
                cb(null, res);
            });
        });
    });
};


fileManager.getFilePathById = function(fileId, key, cb) {
    var me = this;
    me.getFileInfo(fileId, key, function(err, res) {
        if (err) {
            cb(err, null);
            return;
        }
        var metaData = res.data;
        var storageId = metaData.storageId.toString();
        var storage = me.api.stores.StoragesStore.storages[storageId];
        if (!storage) {
            cb(me.api.utils.error('invalidStorage', {}), null);
            return;
        }
        if (!storage.readActive) {
            cb(me.api.utils.error('writeInactiveStorage', {}), null);
            return;
        }

        var filePath = generateFilePathById(fileId);
        cb(null, {
            data: {
                filePath: storage.path + filePath + fileId,
                metaData: metaData
            }
        });
    });
};


fileManager.getFileInfo = function(id, key, cb) {
    var me = this;
    me.api.models.file.find({
        _id : id,
        $or : [{ key : key }, { key : null }]
    }, function(err, res) {
        if (err) {
            cb(me.api.utils.error('dbError', err), null);
            return;
        }
        if(res.length!==1){
            cb(me.api.utils.error('fileId', err), null);
            return;
        }
        cb(null, {data: res[0]});
    });
};

var generateFilePathById = function(objectId) {
    var id = objectId.toString();
    var path = "";
    for (var i = 0; i < id.length; i += 4) {
        path += id.slice(i, i + 4) + "/";
    }
    return path;
};


fileManager.checkStoragesForFreeSpace = function(storages, fileSize, index, cb) {
    var me = this;
    var currStorage = storages[index];
    if (!currStorage) {
        cb(me.api.utils.error('noStorageSpace', null), null);
        return;
    }
    diskspace.check(currStorage.path, function(err, total, free, status) {
        if (err || free < fileSize + currStorage.buffer) {
            index += 1;
            me.checkStoragesForFreeSpace(storages, fileSize, index, cb);
            return;
        }
        cb(null, currStorage);
    });
};


module.exports = FileManager;