var gm = require('gm').subClass({imageMagick: true});
var fileType = require('file-type');
var FileTransformManager = function(api) {
    this.api = api;
};

var fileTransformManager = FileTransformManager.prototype;

fileTransformManager.transform = function(filePath, p, cb) {
    var me = this;
    var height = p.height;
    var width = p.width;
    var crop = p.crop;
    gm(filePath).size(function(err, res) {
        if (err) {
            cb(err, null);
            return;
        }
        var image = gm(filePath);
        
        if (height && !width ) {
            image.resize(null, height);
        }else if (!height && width) {
            image.resize(width, null);
        }else if (height && width && !crop) {
            image.resize(width, height, "!");
        }else if (height && width && crop) {
            var targetSize = {
                width: width,
                height: height
            };
            var sizes = getImageSize(res, targetSize);
            image.resize(sizes.width, sizes.height, "!");
            
            var cropSizes = getCrop(sizes, targetSize, crop);
            image.crop(width, height, cropSizes.x, cropSizes.y);
        }
        image.stream(function(err, stdout, stderr) {
            if (err) {
                cb(err, null);
                return;
            }

            cb(null, {
                stream: stdout
            });
        });

    });
};


var getImageSize = function(imageSize, targetSize) {
    var coefX = targetSize.width / imageSize.width;
    var coefY = targetSize.height / imageSize.height;

    var mainCoef = Math.max(coefX, coefY);

    var result = {
        width: imageSize.width * mainCoef,
        height: imageSize.height * mainCoef
    };
    return result;
};


var getCrop = function(imageSize, targetSize, crop) {
    var offsetX = imageSize.width - targetSize.width;
    var offsetY = imageSize.height - targetSize.height;

    var cropObj = {
        "TL": {x: 0, y: 0},
        "TC": {x: offsetX / 2, y: 0},
        "TR": {x: offsetX, y: 0},
        "ML": {x: 0, y: offsetY / 2},
        "MC": {x: offsetX / 2, y: offsetY / 2},
        "MR": {x: offsetX, y: offsetY / 2},
        "BL": {x: 0, y: offsetY},
        "BC": {x: offsetX / 2, y: offsetY},
        "BR": {x: offsetX, y: offsetY}
    };

    return cropObj[crop];
};


module.exports = FileTransformManager;

///home/levan/Desktop/fileplace/555d/e82f/2318/eda7/1206/0367/5542274207ad950b34337892555de82f2318eda712060367