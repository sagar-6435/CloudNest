import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, Mail, Phone, MapPin, Shield, Key, Bell, CheckCircle } from 'lucide-react';

const Profile = () => {
    const [userProfile, setUserProfile] = useState({ name: '', email: '', mobileNumber: '', password: '' });
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${userInfo.token}` }
                    });
                    setUserProfile({ name: data.name, email: data.email, mobileNumber: data.mobileNumber || '' });
                }
            } catch (error) {
                console.error("Error fetching settings data:", error);
            }
        };
        fetchProfileData();
    }, []);

    const handleSave = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/auth/profile`, userProfile, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            // Optionally update the local storage if we cache the name
            userInfo.name = data.name;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Failed to update profile.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-textMain">Profile Settings</h1>
                <p className="text-textMuted mt-1">Manage your account details and preferences.</p>
            </div>

            <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
                {/* Cover Image */}
                <div className="h-32 bg-primary/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Profile Info */}
                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:-mt-12 group">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-background bg-secondary overflow-hidden shrink-0 shadow-md">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm9UTyM_KJCJvDsaamIEg48gj5BMowIcHw1KzAMEoxjg&s=10"
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform">
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className="mt-4 sm:mt-0 flex gap-3">
                            <button className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
                                    <Shield size={18} className="text-primary" />
                                    Personal Information
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-textMuted uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            value={userProfile.name}
                                            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-textMain"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-textMuted uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-textMuted" />
                                            </div>
                                            <input
                                                type="email"
                                                value={userProfile.email}
                                                readOnly // Usually emails aren't updated easily, or we can just leave it as value
                                                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                                                className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-textMain"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-textMuted uppercase tracking-wider">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone size={16} className="text-textMuted" />
                                            </div>
                                            <input
                                                type="text"
                                                value={userProfile.mobileNumber}
                                                onChange={(e) => setUserProfile({ ...userProfile, mobileNumber: e.target.value })}
                                                className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-textMain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
                                    <Key size={18} className="text-primary" />
                                    Account Security
                                </h3>

                                <div className="space-y-4">
                                    <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-textMain">Two-Factor Authentication</p>
                                            <p className="text-xs text-textMuted mt-0.5">Add an extra layer of security.</p>
                                        </div>
                                        <button className="text-sm font-semibold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg">
                                            Comming Soon
                                        </button>
                                    </div>

                                    <div className="p-4 border border-border rounded-xl flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-textMain">Password</p>
                                                <p className="text-xs text-textMuted mt-0.5">Change your password</p>
                                            </div>
                                            {!isEditingPassword ? (
                                                <button onClick={() => setIsEditingPassword(true)} className="text-sm font-semibold text-textMain hover:bg-secondary border border-border px-3 py-1.5 rounded-lg transition-colors">
                                                    Update
                                                </button>
                                            ) : (
                                                <button onClick={() => setIsEditingPassword(false)} className="text-sm text-textMuted hover:text-textMain px-2 py-1">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                        {isEditingPassword && (
                                            <input
                                                type="password"
                                                placeholder="Enter new password..."
                                                onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value })}
                                                className="w-full mt-2 px-3 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-textMain"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2 mt-8">
                                    <Bell size={18} className="text-primary" />
                                    Notifications
                                </h3>

                                <div className="space-y-3">
                                    {['Email Reminders', 'Product Updates', 'New Logins'].map((item, i) => (
                                        <label key={i} className="flex items-center justify-between group cursor-pointer">
                                            <span className="text-sm font-medium text-textMain">{item}</span>
                                            <div className="relative inline-flex items-center">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={i !== 1} />
                                                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
