const multer = require('multer');
const multerS3 = require('multer-s3');
const {S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const uuid = require('uuid').v4;

const uploadFileInBucket = async (req, res, next, option, callback) => {

    const s3Client = new S3Client({
        region: "default",
        endpoint: option.endpoint,
        credentials: {
            accessKeyId: option.accessKeyId,
            secretAccessKey: option.secretAccessKey,
        },
    });

    const upload = multer({
        storage: multerS3({
            s3: s3Client,
            bucket: option.bucket,
            key: function (req, file, cb) {
                cb(null, file.mimetype.split('/')[0] + '/' + Date.now() + '_' + uuid() + '.' + file.mimetype.split('/')[1]);
            },
        }),        
    })

    const uploadObject = await upload.array(option.objectKey);

    uploadObject(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: 'ذخیره نشد',
            });
        } else {
            callback();
        }
    })
}

const deleteFileInBucket = async (req, res, next, option, callback = () => {}) => {
    const s3Client = new S3Client({
        region: "default",
        endpoint: option.endpoint,
        credentials: {
            accessKeyId: option.accessKeyId,
            secretAccessKey: option.secretAccessKey,
        },
    });

    const params = {
        Bucket: option.bucket,
        Key: option.key
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
        callback();
    } catch (err) {
        const error = new Error("فایل حذف نشد.");
        error.statusCode = 400;
        next(error)
    }
}

module.exports = {
    uploadFileInBucket,
    deleteFileInBucket
}
