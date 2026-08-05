import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Folder, MoreVertical, Image as ImageIcon, Video, FileText, Download, Share2, Trash2, Cloud, HardDrive, Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [userName, setUserName] = useState('');
    const [recentFiles, setRecentFiles] = useState([]);
    const [categoryStats, setCategoryStats] = useState({
        images: { size: 0, count: 0 },
        documents: { size: 0, count: 0 },
        media: { size: 0, count: 0 },
        archive: { size: 0, count: 0 }
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) return;

                setUserName(userInfo.name);

                const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setUserProfile(profileRes.data);

                const filesRes = await axios.get(`${import.meta.env.VITE_API_URL}/files`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });

                const mappedFiles = filesRes.data.slice(0, 5).map(file => ({
                    id: file._id,
                    name: file.name,
                    size: file.size,
                    date: new Date(file.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
                    type: file.mimeType,
                }));

                setRecentFiles(mappedFiles);

                let imgObj = { size: 0, count: 0 };
                let docObj = { size: 0, count: 0 };
                let mediaObj = { size: 0, count: 0 };
                let arcObj = { size: 0, count: 0 };

                filesRes.data.forEach(file => {
                    const t = file.mimeType || '';
                    const size = file.size || 0;
                    if (t.startsWith('image/')) {
                        imgObj.size += size;
                        imgObj.count += 1;
                    }
                    else if (t.startsWith('video/') || t.startsWith('audio/')) {
                        mediaObj.size += size;
                        mediaObj.count += 1;
                    }
                    else if (t.includes('zip') || t.includes('rar') || t.includes('archive')) {
                        arcObj.size += size;
                        arcObj.count += 1;
                    }
                    else {
                        docObj.size += size;
                        docObj.count += 1;
                    }
                });

                setCategoryStats({ images: imgObj, documents: docObj, media: mediaObj, archive: arcObj });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchDashboardData();
    }, []);

    const getFileIcon = (type) => {
        if (!type) return <Folder size={22} className="text-primary" />;
        if (type.startsWith('image/')) return <ImageIcon size={22} className="text-blue-500" />;
        if (type.startsWith('video/')) return <Video size={22} className="text-red-500" />;
        if (type.includes('pdf') || type.includes('text')) return <FileText size={22} className="text-amber-500" />;
        return <Folder size={22} className="text-primary" />;
    };

    const storageUsed = userProfile?.storageUsed || 0;
    const storageLimit = userProfile?.storageLimit || 10737418240; // 10 GB fallback
    const storageUsedPercentage = Math.min(Math.round((storageUsed / storageLimit) * 100), 100);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm("Move this file to trash?")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.delete(`${import.meta.env.VITE_API_URL}/files/${fileId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setRecentFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Error deleting file");
        }
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
            alert("Error downloading file.");
        }
    };

    const dynamicFolderData = [
        { id: 1, name: 'Images', files: categoryStats.images.count, size: formatBytes(categoryStats.images.size), color: 'bg-blue-500', Icon: ImageIcon, filterKey: 'image' },
        { id: 2, name: 'Documents', files: categoryStats.documents.count, size: formatBytes(categoryStats.documents.size), color: 'bg-amber-500', Icon: FileText, filterKey: 'document' },
        { id: 3, name: 'Media & Audio', files: categoryStats.media.count, size: formatBytes(categoryStats.media.size), color: 'bg-red-500', Icon: Video, filterKey: 'media' },
        { id: 4, name: 'Archives', files: categoryStats.archive.count, size: formatBytes(categoryStats.archive.size), color: 'bg-purple-500', Icon: HardDrive, filterKey: 'archive' },
    ];

    return (
        <div className="w-full flex flex-col xl:flex-row gap-8 pb-10">

            {/* Main Content Area */}
            <div className="flex-1 space-y-8 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-textMain tracking-tight">Welcome back, {userName || 'User'}! 👋</h1>
                        <p className="text-textMuted mt-1 text-sm">Here's what's happening with your files today.</p>
                    </div>
                    <button className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
                        <Cloud size={18} />
                        <a href="/dashboard/upload">Upload Files</a>
                    </button>
                </div>

                {/* Folders Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-textMain">Quick Access</h2>
                        <button className="text-sm font-semibold text-primary hover:underline">View All</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {dynamicFolderData.map((folder, index) => (
                            <motion.div
                                onClick={() => navigate('/dashboard/mydata', { state: { filterType: folder.filterKey } })}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={folder.id}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-secondary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group flex flex-col justify-between aspect-[4/3] relative overflow-hidden"
                            >
                                {/* Decorative blob */}
                                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-10 ${folder.color}`}></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-opacity-[0.08] ${folder.color.replace('bg-', 'bg-').replace('500', '500')} ${folder.color.replace('bg-', 'text-')}`}>
                                        <folder.Icon size={28} className="fill-current opacity-20 relative" />
                                        <folder.Icon size={26} className="absolute" />
                                    </div>
                                    <button className="text-textMuted hover:text-textMain p-2 bg-secondary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-bold text-textMain text-lg mb-1 truncate">{folder.name}</h3>
                                    <div className="flex items-center gap-3 text-sm font-medium text-textMuted">
                                        <span>{folder.files} files</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                                        <span>{folder.size}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Recent Files Table */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-textMain">Recent Files</h2>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-semibold bg-secondary rounded-lg text-textMain hover:bg-border transition-colors">This Week</button>
                            <button className="px-4 py-2 text-sm font-semibold bg-transparent rounded-lg text-textMuted hover:bg-secondary transition-colors">See All</button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-secondary/50 overflow-hidden">
                        <div className="overflow-x-auto p-2">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-textMuted text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Date Modified</th>
                                        <th className="px-6 py-4">Size</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {recentFiles.map((file, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (index * 0.05) }}
                                            key={file.id}
                                            className="hover:bg-secondary/30 transition-colors group rounded-2xl"
                                        >
                                            <td className="px-6 py-4 rounded-l-2xl">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-secondary/80 shadow-sm border border-white`}>
                                                        {getFileIcon(file.type)}
                                                    </div>
                                                    <span className="font-bold text-[15px] text-textMain max-w-[200px] sm:max-w-xs truncate">{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-textMuted h-20">
                                                {file.date}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-textMuted">{formatBytes(file.size)}</td>
                                            <td className="px-6 py-4 rounded-r-2xl">
                                                <div className="flex items-center justify-end gap-2">
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Sidebar - Premium Cloud Details */}
            <div className="w-full xl:w-80 shrink-0 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-secondary/50">
                    <h2 className="text-lg font-bold text-textMain mb-6">Storage Overview</h2>

                    <div className="relative w-40 h-40 mx-auto mb-6">
                        <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md">
                            <path
                                className="text-secondary"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-primary transition-all duration-1000 ease-out"
                                strokeDasharray={`${storageUsedPercentage}, 100`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold text-textMain">{storageUsedPercentage}%</span>
                            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Used</span>
                        </div>
                    </div>

                    <p className="text-center text-sm font-semibold text-textMain mb-6">
                        {formatBytes(storageUsed)} <span className="text-textMuted font-medium">used of</span> {formatBytes(storageLimit)}
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-secondary/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                    <ImageIcon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-textMain">Images</p>
                                    <p className="text-xs font-medium text-textMuted">{formatBytes(categoryStats.images.size)}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-textMuted bg-secondary px-2 py-1 rounded-lg">
                                {storageUsed > 0 ? Math.round((categoryStats.images.size / storageUsed) * 100) : 0}%
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-secondary/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-textMain">Documents & Other</p>
                                    <p className="text-xs font-medium text-textMuted">{formatBytes(categoryStats.documents.size)}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-textMuted bg-secondary px-2 py-1 rounded-lg">
                                {storageUsed > 0 ? Math.round((categoryStats.documents.size / storageUsed) * 100) : 0}%
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-secondary/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                                    <Video size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-textMain">Media</p>
                                    <p className="text-xs font-medium text-textMuted">{formatBytes(categoryStats.media.size)}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-textMuted bg-secondary px-2 py-1 rounded-lg">
                                {storageUsed > 0 ? Math.round((categoryStats.media.size / storageUsed) * 100) : 0}%
                            </span>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3.5 font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-xl transition-all hover:shadow-md hover:shadow-primary/20">
                        Upgrade Storage
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
