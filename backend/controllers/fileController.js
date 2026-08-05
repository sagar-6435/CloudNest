const File = require('../models/File');
const User = require('../models/User');
const { uploadToDrive } = require('../services/googleDriveService');

// @desc    Upload file logic
// @route   POST /api/files/upload
// @access  Private
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided.' });
        }

        const user = await User.findById(req.user.id);
        const { originalname, mimetype, size, buffer } = req.file;

        // Quota Check
        if (user.storageUsed + size > user.storageLimit) {
            return res.status(400).json({ message: 'Storage quota exceeded!' });
        }

        // Upload to Google Drive using the service
        const driveData = await uploadToDrive(buffer, originalname, mimetype, user.driveFolderId);

        // Save metadata to MongoDB
        const newFile = await File.create({
            name: originalname,
            mimeType: mimetype,
            size,
            user: req.user.id,
            googleDriveFileId: driveData.id,
        });

        // Update User Storage Used
        user.storageUsed += size;
        await user.save();

        res.status(201).json(newFile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all files for user
// @route   GET /api/files
// @access  Private
const getFiles = async (req, res) => {
    try {
        const isTrashedReq = req.query.trashed === 'true';
        const files = await File.find({ user: req.user.id, ...(isTrashedReq ? { isTrashed: true } : { isTrashed: false }) }).sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete/Trash a file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Verify Owner
        if (file.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this file' });
        }

        // Move to trash
        file.isTrashed = true;
        await file.save();

        res.status(200).json({ message: 'File moved to trash', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download a file
// @route   GET /api/files/download/:id
// @access  Private
const downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );
        oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        const response = await drive.files.get({ fileId: file.googleDriveFileId, alt: 'media' }, { responseType: 'stream' });

        res.set('Content-Type', file.mimeType);
        res.set('Content-Disposition', 'attachment; filename="' + file.name + '"');

        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const restoreFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        file.isTrashed = false;
        await file.save();

        res.status(200).json({ message: 'File restored successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const permanentlyDeleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        if (user) {
            user.storageUsed = Math.max(0, user.storageUsed - file.size);
            await user.save();
        }

        await File.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'File permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    deleteFile,
    downloadFile,
    restoreFile,
    permanentlyDeleteFile
};
