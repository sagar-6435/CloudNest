import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Cloud,
    Home,
    Folder,
    Image as ImageIcon,
    Video,
    FileText,
    Settings,
    Trash2,
    Users,
    LogOut,
    Star,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${userInfo.token}` }
                    });
                    setUserProfile(data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/signin');
    };

    const routes = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} />, filterKey: null },
        { name: 'My Data', path: '/dashboard/mydata', icon: <Folder size={20} />, filterKey: 'all' },
        { name: 'Recent', path: '/dashboard/mydata', icon: <Clock size={20} />, filterKey: 'recent' },
        { name: 'Shared', path: '/shared', icon: <Users size={20} />, filterKey: null },
        { name: 'Trash', path: '/dashboard/trash', icon: <Trash2 size={20} />, filterKey: null },
    ];

    const types = [
        { name: 'Photos', filterKey: 'image', icon: <ImageIcon size={20} />, color: 'text-blue-500' },
        { name: 'Videos', filterKey: 'media', icon: <Video size={20} />, color: 'text-red-500' },
        { name: 'Documents', filterKey: 'document', icon: <FileText size={20} />, color: 'text-amber-500' },
    ];

    return (
        <aside className="w-64 bg-background border-r border-border flex flex-col h-screen overflow-y-auto hidden md:flex shrink-0">
            <div className="p-6 flex items-center gap-3">
                <Cloud size={28} className="text-primary" />
                <span className="text-xl font-bold tracking-tight">CloudNest</span>
            </div>

            <div className="px-4 pb-4">
                <NavLink to="/dashboard/upload" className="w-full bg-primary hover:bg-blue-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-semibold transition-all shadow-md shadow-primary/20 active:scale-[0.98]">
                    <span className="text-xl">+</span> New Upload
                </NavLink>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1">
                <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 px-3 mt-4">Menu</p>
                {routes.map((route) => (
                    route.filterKey !== null ? (
                        <button
                            key={route.name}
                            onClick={() => navigate(route.path, { state: { filterType: route.filterKey } })}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-textMuted hover:bg-secondary hover:text-textMain text-left"
                        >
                            {route.icon}
                            {route.name}
                        </button>
                    ) : (
                        <NavLink
                            key={route.name}
                            to={route.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-textMuted hover:bg-secondary hover:text-textMain'
                                }`
                            }
                        >
                            {route.icon}
                            {route.name}
                        </NavLink>
                    )
                ))}

                <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 px-3 mt-8">Categories</p>
                {types.map((type) => (
                    <button
                        key={type.name}
                        onClick={() => navigate('/dashboard/mydata', { state: { filterType: type.filterKey } })}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-textMuted hover:bg-secondary hover:text-textMain text-left"
                    >
                        <div className={type.color}>{type.icon}</div>
                        {type.name}
                    </button>
                ))}
            </nav>

            {(() => {
                const storageUsed = userProfile?.storageUsed || 0;
                const storageLimit = userProfile?.storageLimit || 10737418240;
                const percentage = Math.min(Math.round((storageUsed / storageLimit) * 100), 100);

                const formatBytes = (bytes) => {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                };

                return (
                    <div className="p-4 mt-auto">
                        <div className="bg-secondary rounded-xl p-4 mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-textMain">Storage</span>
                                <span className="text-textMuted">{percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-primary rounded-full"
                                />
                            </div>
                            <p className="text-xs text-textMuted mt-2">{formatBytes(storageUsed)} of {formatBytes(storageLimit)} used</p>
                        </div>

                        <div className="space-y-1">
                            <NavLink to="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-textMuted hover:bg-secondary hover:text-textMain transition-colors">
                                <Settings size={20} />
                                Settings
                            </NavLink>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut size={20} />
                                Log Out
                            </button>
                        </div>
                    </div>
                );
            })()}
        </aside>
    );
};

export default Sidebar;
