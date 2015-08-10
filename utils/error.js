var errors = {
    unknown: {
        code: 30000,
        message: "unknown error"
    },
    noWriteStorage: {
        code: 30001,
        message: "no active storage to write file"
    },
    noStorageSpace: {
        code: 30002,
        message: "there is no space on any storage"
    },
    fileSave: {
        code: 30003,
        message: "error while making a file directory"
    },
    invalidStorage: {
        code: 30004,
        message: "invalid storage"
    },
    dbError: {
        code: 30005,
        message: "db error"
    },
    readInactiveStorage: {
        code: 30006,
        message: "storage is not read active"
    },
    readFile: {
        code: 30007,
        message: "missing or can't read the file on storage"
    },
    mimeNotsupported: {
        code: 30008,
        message: "not supported mime type"
    },
    dimensionsNotsupported: {
        code: 30009,
        message: "dimensions that you passed are not supported"
    },
    fileTransform: {
        code: 30010,
        message: "error while transforming the file"
    },
    fileId: {
        code: 30011,
        message: "invalid file id or insufficient privilegies"
    },
    crop: {
        code: 30012,
        message: "invalid crop "
    },
    resizeFormat: {
        code: 30013,
        message: "unsupported resize format"
    }
};

var errorCode = function(keyword, error) {    
    return {
        message: errors[keyword].message,
        code: errors[keyword].code,
        keyword: keyword,
        error: error
    };
};


module.exports = errorCode;