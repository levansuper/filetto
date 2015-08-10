//var formidable = require('formidable');
var actions = {};

actions.FilesSaveFile = {
    "name": "FilesSaveFile",
    "description": 'save file',
    "inputs": {
        "file": {
            "required": true
        },
        "key": {
            "required": false
        }
    },
    //middleware : ['connection middleware'],
    "blockedConnectionTypes": [],
    "outputExample": {},
    "run": function(api, connection, next) {
        var file = connection.params.file;
        var key = connection.params.key || null;
        connection.params.file = "[FILTERED]";
        api.managers.FileManager.saveFile(file, key, function(err, res) {
            connection.response.result = {
                data : res
            };
            next(err);
        });
    }
};


actions.FilesGetFile = {
    "name": "FilesGetFile",
    "description": 'get file',
    "inputs": {
        "fileId": {
            "required": true
        },
        "key": {
            "required": false
        }
    },
    "blockedConnectionTypes": [],
    "outputExample": {},
    "run": function(api, connection, next) {
        var fileId = connection.params.fileId;
        var key = connection.params.key || null;
        var date = new Date();
        var time = date.getTime();

        api.managers.FileManager.getFile(fileId, key, function(err, res) {

            if (err) {
                next(err);
                return;
            }
            var headers = {
                'Content-disposition': 'filename=' + res.metaData.name
            };
            if (res.metaData.mimeType) {
                headers['Content-type'] = res.metaData.mimeType;
            }

            var response = connection.connection.rawConnection.res;
            response.writeHead(200, headers);
            res.stream.on('data', function(chunk) {
                response.write(chunk);
            });
            res.stream.on('end', function() {
                response.end();
                next();
                console.log(new Date() - date, "stream");
            });
            res.stream.on('error', function(err) {
                next(api.utils.error('readFile', null));
            });
        });
    }
};

actions.FilesGetImage = {
    "name": "FilesGetImage",
    "description": 'get image',
    "inputs": {
        "fileId": {
            "required": true
        },
        "width": {
            "required": false
        },
        "height": {
            "required": false
        },
        "crop": {
            "required": false
        },
        "key": {
            "required": false
        }
    },
    "blockedConnectionTypes": [],
    "outputExample": {},
    "run": function(api, connection, next) {
        var date = new Date();
        var time = date.getTime();
        var fileId = connection.params.fileId;
        var key = connection.params.key || null;
        var p = {
            width: connection.params.width || null,
            height: connection.params.height || null,
            crop: connection.params.crop || null
        };

        if (connection.params.crop
            && !api.config.transform.supportedCrops[connection.params.crop]) {
            next(api.utils.error('crop', null));
            return;
        }

        api.managers.FileManager.getImage(fileId, key, p, function(err, res) {
            if (err) {
                next(err);
                return;
            }
            var headers = {
                'Content-disposition': 'filename=' + res.metaData.name
            };
            if (res.metaData.mimeType) {
                headers['Content-type'] = res.metaData.mimeType;
            }
            var response = connection.connection.rawConnection.res;
            response.writeHead(200, headers);
            res.stream.on('data', function(chunk) {
                response.write(chunk);
            });
            res.stream.on('end', function() {
                response.end();
                next();
                console.log(new Date() - date, "stream");
            });
            res.stream.on('error', function(err) {
                next(api.utils.error('readFile', null));
            });
        });

    }
};


actions.FilesAddStorage = {
    "name": "FilesAddStorage",
    "description": 'save file',
    "inputs": {
        "file": {
            "required": true,
            "filterInLog": true
        }
    },
    "blockedConnectionTypes": [],
    "outputExample": {},
    "run": function(api, connection, next) {
        a = {
            "buffer": 100857600,
            "readActive": true,
            "writeActive": true,
            "path": "/home/fs/fileStorage",
            "name": "first"
        }

        var storage = new api.models.storage(a);
        storage.save(function(err, res) {
            connection.response.result = res;
            next(err);
        })


    }
};


module.exports = actions;
