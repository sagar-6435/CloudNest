const { google } = require('googleapis');
const stream = require('stream');

// Initialize Google Auth using OAuth2 Client (Directly operates as the Gmail User)
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

// We rely on the refresh token to continuously fetch access tokens indefinitely
try {
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
} catch (error) {
    console.warn('Google Auth initialized without valid refresh token.', error);
}

const drive = google.drive({ version: 'v3', auth: oauth2Client });

/**
 * Creates a unique folder for the User.
 * @param {string} userName - The name to assign to the folder
 * @returns {Promise<string>} The Google Drive Folder ID.
 */
const createUserFolder = async (userName) => {
    try {
        const fileMetadata = {
            name: userName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: process.env.MASTER_ADMIN_FOLDER_ID ? [process.env.MASTER_ADMIN_FOLDER_ID] : [],
        };

        const folder = await drive.files.create({
            resource: fileMetadata,
            fields: 'id',
        });

        const folderId = folder.data.id;

        return folderId;
    } catch (error) {
        console.error('Error creating Google Drive User Folder:', error);
        throw error;
    }
};

/**
 * Uploads a file buffer to Google Drive.
 * @param {Buffer} fileBuffer - The file content.
 * @param {string} fileName - The name of the file to save as.
 * @param {string} mimeType - The mime type of the file.
 * @param {string} folderId - The Google Drive Folder to put it inside.
 * @returns {Promise<Object>} The Google Drive file metadata.
 */
const uploadToDrive = async (fileBuffer, fileName, mimeType, folderId) => {
    try {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        const requestBody = {
            name: fileName,
            parents: folderId ? [folderId] : [],
        };

        const media = {
            mimeType: mimeType,
            body: bufferStream,
        };

        const response = await drive.files.create({
            requestBody,
            media,
            fields: 'id, webViewLink, webContentLink',
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw error;
    }
};

/**
 * Deletes a file from Google Drive.
 * @param {string} fileId - The Google Drive object ID.
 */
const deleteFromDrive = async (fileId) => {
    try {
        await drive.files.delete({ fileId });
    } catch (error) {
        console.error('Error deleting from Google Drive:', error);
        throw error;
    }
};

module.exports = {
    createUserFolder,
    uploadToDrive,
    deleteFromDrive
};
