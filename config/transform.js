exports.default = {
    transform: function(api) {
        return {
            supportedImageFormats: {
                "image/png": true,
                "image/jpeg": true,
                "image/pjpeg": true
            },
            supportedCrops: {
                "TL": true,
                "TC": true,
                "TR": true,
                "ML": true,
                "MC": true,
                "MR": true,
                "BL": true,
                "BC": true,
                "BR": true
            }
        };
    }
};