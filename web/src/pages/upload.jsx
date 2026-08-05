import React, { useState, useRef } from 'react';
import { CloudUpload, File, Image as ImageIcon, Video, X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Upload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgresses, setUploadProgresses] = useState({});
    const inputRef = useRef(null);

    // Handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Try to parse dropped files
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (newFiles) => {
        // Convert FileList to Array and add to state
        setFiles(prev => [...prev, ...Array.from(newFiles)]);
    };

    const removeFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <ImageIcon size={24} className="text-blue-500" />;
        if (type.startsWith('video/')) return <Video size={24} className="text-red-500" />;
        return <File size={24} className="text-amber-500" />;
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUploadSubmit = async () => {
        if (files.length === 0) return;
        setUploading(true);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo || !userInfo.token) {
            alert('Please sign in to upload files');
            setUploading(false);
            return;
        }

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                await axios.post(`${import.meta.env.VITE_API_URL}/files/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${userInfo.token}`
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgresses(prev => ({ ...prev, [i]: percentCompleted }));
                    }
                });
            }
            alert("All files uploaded successfully!");
            setFiles([]);
            setUploadProgresses({});
        } catch (error) {
            console.error(error);
            alert("Error uploading files: " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-textMain mb-2">Upload Files</h1>
            <p className="text-textMuted mb-2">Drag and drop your images, videos, and documents to safely store them in CloudNest.</p>
            <p className="text-sm font-semibold text-primary mb-8 bg-primary/10 inline-block px-3 py-1 rounded-full">Limit: 10GB of storage allowed per user.</p>

            <form
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onSubmit={(e) => e.preventDefault()}
                className={`relative w-full h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all bg-white
                    ${dragActive ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border hover:border-gray-400 hover:bg-gray-50'}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                />

                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <CloudUpload size={36} className="text-primary" />
                </div>

                <h3 className="text-xl font-bold text-textMain mb-2">
                    {dragActive ? 'Drop files here!' : 'Drag & drop files here'}
                </h3>
                <p className="text-sm font-medium text-textMuted mb-6">Or click to browse your computer</p>

                <button
                    onClick={onButtonClick}
                    className="px-6 py-2.5 bg-secondary text-textMain font-bold rounded-xl hover:bg-border transition-colors border border-border"
                >
                    Browse Files
                </button>
            </form>

            {/* File Queue Section */}
            {files.length > 0 && (
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-textMain">Ready to upload ({files.length})</h2>
                        <button
                            onClick={handleUploadSubmit}
                            disabled={uploading}
                            className={`px-8 py-2.5 font-bold rounded-xl text-white transition-all shadow-lg ${uploading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {uploading ? 'Uploading...' : 'Upload All'}
                        </button>
                    </div>

                    <div className="space-y-3 bg-white p-4 rounded-3xl border border-border">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-secondary/50 hover:bg-secondary/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-textMain truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                                        <p className="text-xs font-medium text-textMuted mt-0.5">{formatBytes(file.size)}</p>
                                    </div>
                                </div>

                                {uploading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgresses[index] || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-textMain min-w-[32px]">
                                            {uploadProgresses[index] || 0}%
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-2 text-textMuted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;
