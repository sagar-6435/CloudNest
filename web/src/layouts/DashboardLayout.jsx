import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

const DashboardLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('userInfo')) {
            navigate('/signin');
        }
    }, [navigate]);
    return (
        <div className="flex h-screen bg-secondary/30 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col relative h-full min-w-0">
                <TopNav />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
