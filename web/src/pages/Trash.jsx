import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Video, RefreshCw, Trash2, Folder, Search } from 'lucide-react';
import axios from 'axios';

const Trash = () => {
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTrashedFiles = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) return;

                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/files?trashed=true`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });

                const mappedFiles = data.map(file => ({
                    id: file._id,
                    name: file.name,
                    type: file.mimeType,
                    size: file.size,
                    createdAt: file.createdAt
                }));

                setFiles(mappedFiles);
            } catch (error) {
                console.error("Error fetching trashed files:", error);
            }
        };

        fetchTrashedFiles();
    }, []);

    const getFileIcon = (type) => {
        if (!type) return <Folder size={22} className="text-primary" />;
        if (type.startsWith('image/')) return <ImageIcon size={22} className="text-blue-500" />;
        if (type.startsWith('video/')) return <Video size={22} className="text-red-500" />;
        if (type.includes('pdf') || type.includes('text')) return <FileText size={22} className="text-amber-500" />;
        return <Folder size={22} className="text-primary" />;
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleRestore = async (fileId) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`${import.meta.env.VITE_API_URL}/files/${fileId}/restore`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (error) {
            console.error("Restore failed:", error);
            alert("Error restoring file. Please ensure your backend is restarted to load the new endpoints.");
        }
    };

    const handlePermanentDelete = async (fileId) => {
        if (!window.confirm("Are you sure you want to permanently delete this file? This cannot be undone!")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.delete(`${import.meta.env.VITE_API_URL}/files/${fileId}/permanent`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (error) {
            console.error("Permanent delete failed:", error);
            alert("Error permanently deleting file. Please ensure your backend is restarted to load the new endpoints.");
        }
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-red-500 flex items-center gap-2 mb-1">
                        <Trash2 size={24} /> Trash
                    </h1>
                    <p className="text-textMuted text-sm">View and manage heavily discarded items.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-textMuted" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search trash..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-red-50/50 rounded-3xl shadow-sm border border-red-100 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1 p-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-red-900/50 text-xs font-semibold uppercase tracking-wider border-b border-red-100/60">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Date Trashed</th>
                                <th className="px-6 py-4">File Size</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-red-100/60">
                            {filteredFiles.map((file, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={file.id}
                                    className="hover:bg-red-100/50 transition-colors group rounded-2xl"
                                >
                                    <td className="px-6 py-4 rounded-l-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm border border-red-100/50`}>
                                                {getFileIcon(file.type)}
                                            </div>
                                            <span className="font-bold text-[14px] text-textMain max-w-sm border-b border-transparent opacity-75 truncate">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-textMuted h-20">
                                        {formatDate(file.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-textMuted">
                                        {formatBytes(file.size)}
                                    </td>
                                    <td className="px-6 py-4 rounded-r-2xl">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleRestore(file.id)} title="Restore File" className="p-2.5 text-textMuted hover:text-green-600 hover:bg-green-100/50 rounded-xl transition-colors">
                                                <RefreshCw size={18} />
                                            </button>
                                            <button onClick={() => handlePermanentDelete(file.id)} title="Delete Forever" className="p-2.5 text-textMuted hover:text-red-600 hover:bg-red-100/80 rounded-xl transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}

                            {filteredFiles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-20">
                                        <Trash2 size={48} className="text-red-200 mx-auto mb-4" />
                                        <p className="text-textMain font-bold mb-1">Trash is empty</p>
                                        <p className="text-sm text-textMuted">Items you delete will show up here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Trash;
