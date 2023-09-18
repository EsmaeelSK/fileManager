const express = require('express');

const fileManager = require('../controllers/fileManager');

const router = express.Router();

router.get('/view', fileManager.getData);
router.post('/createFolder', fileManager.createFolder);
router.delete('/deleteFolder', fileManager.deleteFolder);
router.post('/uploadFile', fileManager.uploadFile);
// router.delete('/deleteFile/:bucketFolder/:fileKey', fileManager.deleteFile);

module.exports = router