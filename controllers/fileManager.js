const Folder = require('../models/folder');
const File = require('../models/file');
const {uploadFileInBucket, deleteFileInBucket} = require('../middlewares/multer');

const getData = async (req, res, next) => {
    try{
        let address = [];
        let parentId;
        if(req.query.id === '') parentId = null  
        else {
            parentId = req.query.id;
            address.push({
                name: req.query.name,
                id: req.query.id
            });
        }

        const folders = await Folder.find({parentId});
        const files = await File.find({parentId});
        for(const obj of address) {
            const folder = await Folder.findById(obj.id);
            if (folder.parentId === null) break;
            address.push({
                name: folder.name,
                id: folder.parentId
            });
        }

        return res.status(200).json({
            result: 'success',
            address,
            folders,
            files,
        })
    } catch (err) {
        next(err);
    }
}

// validation
const createFolder = async (req, res, next) => {
    try{
        let folder;
        if(req.body.parentId === '') {
            folder = await Folder.create({
                name: req.body.name,
            })
        } else {
            folder = await Folder.create({
                name: req.body.name,
                parentId: req.body.parentId
            })
        }
        if(!folder) throw {message: 'پوشه ساخته نشد.', statusCode: 400};
        res.status(201).json({ 
            result: 'success',
            name: req.body.name,
            id: folder.id
        })
    } catch (err) {
        next(err);
    }

}

const deleteFolder = async (req, res, next) => {
    let filesKey = [];
    let idies = []
    try{
        if(req.body.idies === []) throw new Error('پوشه یا فایلی را برای حذف کردن انتخاب کنید.').statusCode = 422; 
        idies = req.body.idies.slice();
        for (const id of idies)  {
            
            const folders = await Folder.find({parentId: id});
            for (const folder of folders){
                idies.push(folder.id);

            }

            const files = await File.find({parentId: id});
            for (const file of files) {
                idies.push(file.id);
                filesKey.push(file.key);

            }
        };

        await idies.forEach(async id => await Folder.findByIdAndDelete(id))
        
        await filesKey.forEach(key => {
            deleteFileInBucket(req, res, next, {
                endpoint: process.env.LIARA_ENDPOINT,
                accessKeyId: process.env.LIARA_ACCESS_KEY,
                secretAccessKey: process.env.LIARA_SECRET_KEY,
                bucket: process.env.LIARA_BUCKET_NAME,
                key
            });
        })

        await idies.forEach(async id => await File.findByIdAndDelete(id));

        return res.status(200).json({
            result: 'success',
        })
    } catch (err) {
        next(err);
    }
}

const uploadFile = async (req, res, next) => {
    uploadFileInBucket(req, res, next,{
        endpoint: process.env.LIARA_ENDPOINT,
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY,
        bucket: process.env.LIARA_BUCKET_NAME,
        objectKey: 'objectKey',
    },
    async () => {
        try{
            let files = [];
            for (const file of req.files) {
                const name = file.originalname;
                const key = file.key;
                const address = file.location;
                const parentId = req.query.parentId;
                const size = file.size;
                const type = file.mimetype;
                
                let f;
                if(req.query.id === '') {
                    f = await File.create({name, key, address, size, type})
                } else {
                    f = await File.create({name, key, address, parentId, size, type})
                    console.log('f: \n', f);
                }
                if(!f) throw new Error('فایل ها در پایگاه داده ذخیره نشد.').statusCode = 400;
                files.push(f);
            }
            console.log(files);
            return res.status(200).json({
                result: 'success',
                files
            });
        } catch (err) {
            next(err);
        }
    })
}

// حذف چند فایل
// const deleteFile = (req, res, next) => {
//     deleteFileInBucket(req, res, next, {
//         endpoint: process.env.LIARA_ENDPOINT,
//         accessKeyId: process.env.LIARA_ACCESS_KEY,
//         secretAccessKey: process.env.LIARA_SECRET_KEY,
//         bucket: process.env.LIARA_BUCKET_NAME,
//         key: req.params.bucketFolder + '/' + req.params.fileKey
//     },
//     async (req) => {
//         let file;
//         try{
//             file = await File.findOneAndRemove({key: req.params.bucketFolder + '/' + req.params.fileKey});
//             if(file === null) throw err;
//             return res.status(200).json({
//                 result: 'success'
//             })

//         } catch (err) {
//             const error = file !== null ? new Error('مشکلی پیش آمده') : new Error('همچین فایلی پیدا نشد');
//             error.statusCode = file !== null ? 400 : 404;
//             next(error);
//         }
//     })
// }

module.exports = {
    getData,
    createFolder,
    deleteFolder,
    uploadFile,
    // deleteFile,
}
