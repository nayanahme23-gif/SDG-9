import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`);
                setCourses(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setUserRole(res.data.data.role);
            }).catch(() => { });
        }

        fetchCourses();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent-blue"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Course Library</h1>
                    <p className="text-gray-400">Explore educational resources on resilient infrastructure.</p>
                </div>
                {(userRole === 'teacher' || userRole === 'admin') && (
                    <Link to="/courses/create" className="bg-gradient-to-r from-accent-blue to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Create Course
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div
                            key={course._id}
                            onClick={() => {
                                const token = localStorage.getItem('token');
                                if (!token) {
                                    navigate('/login');
                                } else {
                                    navigate(`/courses/${course._id}`);
                                }
                            }}
                            className="group glass-card rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 border border-gray-700/50 hover:border-accent-blue/50 cursor-pointer"
                        >
                            <div className="h-48 bg-gray-800 relative overflow-hidden">
                                <img
                                    src={course.image && course.image !== 'no-photo.jpg' && !course.image.startsWith('http')
                                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${course.image}`
                                        : course.image && course.image.startsWith('http')
                                            ? course.image
                                            : `https://placehold.co/800x600/1f2937/66fcf1?text=${encodeURIComponent(course.title.slice(0, 20))}...`}
                                    alt="Course Cover"
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">{course.title}</h3>
                                    <p className="text-xs text-brand-cyan uppercase tracking-wider font-semibold">
                                        By {course.instructor?.name || 'Instructor'}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                                    {course.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-700 pt-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                        {course.content?.length || 0} Modules
                                    </span>
                                    <span className="text-accent-blue font-bold group-hover:translate-x-1 transition-transform duration-300">
                                        View Details &rarr;
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Courses Found</h3>
                        <p className="text-gray-400">Check back later for new learning materials.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseList;
