const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please add a file name'],
        },
        googleDriveFileId: {
            type: String, // To be integrated with Google Drive storage logic
            required: false,
        },
        size: {
            type: Number,
            required: [true, 'Please provide file size'],
        },
        type: {
            type: String,
            enum: ['image', 'video', 'document', 'folder', 'other'],
            default: 'other',
        },
        mimeType: {
            type: String,
        },
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File', // Self-referencing for folder structures
            default: null,
        },
        isStarred: {
            type: Boolean,
            default: false,
        },
        isTrashed: {
            type: Boolean,
            default: false,
        },
        sharedWith: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('File', fileSchema);
