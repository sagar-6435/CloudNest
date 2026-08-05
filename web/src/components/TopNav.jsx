import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu } from 'lucide-react';

const TopNav = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.name) {
            setUserName(userInfo.name);
        }
    }, []);

    return (
        <header className="h-20 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden text-textMuted hover:text-textMain">
                    <Menu size={24} />
                </button>

                <div className="max-w-xl w-full hidden sm:block relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-textMuted" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search in CloudNest..."
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <button className="relative text-textMuted hover:text-textMain transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                </button>

                <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary py-1.5 px-2 rounded-lg transition-colors">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm9UTyM_KJCJvDsaamIEg48gj5BMowIcHw1KzAMEoxjg&s=10"
                        alt="Profile"
                        className="w-9 h-9 rounded-full bg-secondary"
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-textMain whitespace-nowrap">{userName || 'User'}</p>
                        <p className="text-xs text-textMuted">Pro Plan</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
