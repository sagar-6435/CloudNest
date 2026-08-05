import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Video, MoreVertical, Download, Trash2, Folder, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// Mock Data representing backend `/api/files` response
const MY_FILES = [
    { id: '1', name: 'Profile_Picture.png', type: 'image/png', size: 1048576, createdAt: '2023-11-20T10:30:00Z' },
    { id: '2', name: 'Project_Proposal_Q4.pdf', type: 'application/pdf', size: 2540000, createdAt: '2023-11-19T14:20:00Z' },
    { id: '3', name: 'Family_Vacation_2023.mp4', type: 'video/mp4', size: 134217728, createdAt: '2023-11-18T09:15:00Z' },
    { id: '4', name: 'Design_Assets.zip', type: 'application/zip', size: 45000000, createdAt: '2023-11-17T16:45:00Z' },
    { id: '5', name: 'Database_Backup.sql', type: 'text/plain', size: 12000000, createdAt: '2023-11-16T11:10:00Z' },
    { id: '6', name: 'Meeting_Notes.txt', type: 'text/plain', size: 45000, createdAt: '2023-11-15T08:00:00Z' }
];

const MyData = () => {
    const location = useLocation();
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(location.state?.filterType || 'all');

    useEffect(() => {
        if (location.state?.filterType) {
            setCategoryFilter(location.state.filterType);
        }
    }, [location.state?.filterType]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) return;

                const isTrash = categoryFilter === 'trash';
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/files${isTrash ? '?trashed=true' : ''}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });

                // Map db results to fit existing UI components seamlessly
                const mappedFiles = data.map(file => ({
                    id: file._id,
                    name: file.name,
                    type: file.mimeType,
                    size: file.size,
                    createdAt: file.createdAt
                }));

                setFiles(mappedFiles);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, [categoryFilter]);

    const getFileIcon = (type) => {
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

    const handleDownload = async (fileId, fileName) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/files/download/${fileId}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Error downloading file. (Wait and try again if file is still processing)");
        }
    };

    const handleView = async (fileId, fileType) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/files/download/${fileId}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            const fileBlob = new Blob([response.data], { type: fileType || response.headers['content-type'] });
            const url = window.URL.createObjectURL(fileBlob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("View failed:", error);
            alert("Error viewing file.");
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm("Move this file to trash?")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.delete(`${import.meta.env.VITE_API_URL}/files/${fileId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Error deleting file");
        }
    };

    const filteredFiles = files.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (categoryFilter === 'all') return true;
        if (categoryFilter === 'trash') return true; // Only trashed files were fetched

        if (categoryFilter === 'recent') {
            const fileDate = new Date(f.createdAt);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return fileDate >= sevenDaysAgo;
        }

        const t = f.type || '';

        if (categoryFilter === 'image') return t.startsWith('image/');
        if (categoryFilter === 'media') return t.startsWith('video/') || t.startsWith('audio/');
        if (categoryFilter === 'archive') return t.includes('zip') || t.includes('rar') || t.includes('archive');
        if (categoryFilter === 'document') return !t.startsWith('image/') && !t.startsWith('video/') && !t.startsWith('audio/') && !t.includes('zip') && !t.includes('rar') && !t.includes('archive');
        return true;
    });

    return (
        <div className="w-full h-full flex flex-col">
            {categoryFilter !== 'all' && (
                <div className="mb-4 flex items-center justify-between bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl">
                    <span className="text-sm font-semibold">Filtering by category: {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}</span>
                    <button onClick={() => setCategoryFilter('all')} className="text-xs py-1 px-3 bg-white/50 hover:bg-white rounded-lg transition-colors border border-primary/30">Clear Filter</button>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-textMain mb-1">My Data</h1>
                    <p className="text-textMuted text-sm">View and manage all your uploaded files.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-textMuted" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search your files..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-border rounded-xl text-textMuted hover:bg-secondary hover:text-textMain transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-secondary/50 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1 p-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-textMuted text-xs font-semibold uppercase tracking-wider border-b border-border/50">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Date Uploaded</th>
                                <th className="px-6 py-4">File Size</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredFiles.map((file, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={file.id}
                                    className="hover:bg-secondary/30 transition-colors group rounded-2xl"
                                >
                                    <td className="px-6 py-4 rounded-l-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-secondary/80 shadow-sm border border-white`}>
                                                {getFileIcon(file.type)}
                                            </div>
                                            <span onClick={() => handleView(file.id, file.type)} className="font-bold text-[14px] text-textMain max-w-sm border-b border-transparent hover:border-primary cursor-pointer truncate">{file.name}</span>
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
                                            <button onClick={() => handleDownload(file.id, file.name)} className="p-2.5 text-textMuted hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                                                <Download size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(file.id)} className="p-2.5 text-textMuted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                            <button onClick={() => alert("More options coming soon!")} className="p-2.5 text-textMuted hover:text-textMain hover:bg-secondary rounded-xl transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}

                            {filteredFiles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-20">
                                        <Folder size={48} className="text-border mx-auto mb-4" />
                                        <p className="text-textMain font-bold mb-1">No files found</p>
                                        <p className="text-sm text-textMuted">Try adjusting your search criteria or upload new files.</p>
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

export default MyData;
