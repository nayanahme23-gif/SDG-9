import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]); // Admin only
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard`, config);
                setDashboardData(res.data.data);
                setUser(res.data.data.user);

                // If Admin, fetch pending users
                if (res.data.data.user.role === 'admin') {
                    fetchPendingUsers(token);
                }
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const fetchPendingUsers = async (token) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users?approved=false`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(res.data.data);
        } catch (err) {
            console.error("Failed to fetch pending users", err);
        }
    };

    const approveUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User approved!");
            // Refresh list
            fetchPendingUsers(token);
        } catch (err) {
            console.error(err);
            alert("Failed to approve user");
        }
    };

    if (!dashboardData) return (
        <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-gray-700 opacity-20"></div>
                <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-accent-blue border-t-transparent animate-spin"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header Section */}
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-blue/20 transition-all duration-700"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-purple-400">{user?.name}</span>
                    </h1>
                    <p className="text-gray-400 text-lg flex items-center gap-2">
                        Dashboard <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span> <span className="text-brand-cyan uppercase tracking-wider text-sm font-bold">{user?.role}</span>
                    </p>
                </div>
            </div>

            {/* ADMIN PANEL */}
            {user?.role === 'admin' && (
                <div className="glass-card p-6 rounded-2xl border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-white mb-4">Pending Approvals</h3>
                    {pendingUsers.length > 0 ? (
                        <div className="space-y-4">
                            {pendingUsers.map(u => (
                                <div key={u._id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                    <div>
                                        <p className="text-white font-bold">{u.name}</p>
                                        <p className="text-sm text-gray-400">{u.email} ({u.role})</p>
                                    </div>
                                    <button
                                        onClick={() => approveUser(u._id)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors"
                                    >
                                        Approve
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No pending users.</p>
                    )}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl hover:bg-gray-800/80 transition-all duration-300 border-l-4 border-purple-500">
                    <h3 className="text-gray-400 font-medium mb-2 uppercase text-xs tracking-wider">
                        {user?.role === 'student' ? 'Enrolled Courses' : 'Courses Created'}
                    </h3>
                    <p className="text-5xl font-bold text-white">
                        {user?.role === 'student' ? dashboardData.enrolledCourses?.length || 0 : dashboardData.coursesCreated || 0}
                    </p>
                </div>

                <div className="glass-card p-6 rounded-2xl hover:bg-gray-800/80 transition-all duration-300 border-l-4 border-accent-blue">
                    <h3 className="text-gray-400 font-medium mb-2 uppercase text-xs tracking-wider">
                        {user?.role === 'student' ? 'Modules Completed' : 'Active Students'}
                    </h3>
                    <p className="text-5xl font-bold text-white">
                        {user?.role === 'student' ? dashboardData.completedTests || 0 : dashboardData.totalStudents || 0}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden cursor-pointer" onClick={() => navigate('/crack-analysis')}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">AI Inspector</h3>
                    <p className="text-indigo-100 mb-6 text-sm">Analyze structural integrity using our advanced AI model.</p>
                    <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold text-sm w-full hover:bg-gray-50 transition-colors">
                        Launch Tool
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold text-white">Your Learning Path</h2>
                    <button onClick={() => navigate('/courses')} className="text-sm text-accent-blue hover:text-white transition-colors">View All</button>
                </div>

                {dashboardData.courses && dashboardData.courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardData.courses.map((course, idx) => (
                            <div key={idx} onClick={() => navigate(`/courses/${course._id}`)} className="glass-card rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 group cursor-pointer">
                                <div className="h-40 bg-gray-700 relative">
                                    <img src={`https://placehold.co/800x600/1f2937/66fcf1?text=${encodeURIComponent(course.title)}`} alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Course</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                                    <button className="w-full py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200">
                                        Continue Learning
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 rounded-2xl text-center border-dashed border-2 border-gray-700">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No courses available yet</p>
                        <p className="text-gray-600 mb-6 text-sm">Start by creating a new course module.</p>
                        <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">Browse Library</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
