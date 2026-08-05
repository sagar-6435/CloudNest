const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, deleteFile, downloadFile, restoreFile, permanentlyDeleteFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB maximum upload chunk
});

router.route('/').get(protect, getFiles);
router.route('/upload').post(protect, upload.single('file'), uploadFile);
router.route('/:id').delete(protect, deleteFile);
router.route('/download/:id').get(protect, downloadFile);
router.route('/:id/restore').put(protect, restoreFile);
router.route('/:id/permanent').delete(protect, permanentlyDeleteFile);

module.exports = router;
