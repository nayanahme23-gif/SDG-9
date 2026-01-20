import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import YouTube from 'react-youtube';

// Helper to extract YouTube ID
const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState(0);

    // ... (fetchData useEffect remains same) ...

    useEffect(() => {
        // ... fetchData logic ...
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const courseRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}`);
                setCourse(courseRes.data.data);

                if (token) {
                    const enrollRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}/enrollment`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setEnrollment(enrollRes.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-white text-center py-20">Loading...</div>; // Simplified loading
    if (!course) return <div className="text-white">Not Found</div>;

    const downloadCertificate = async () => {
        // ... (same logic) ...
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}/certificate`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate-${course.title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert("Complete the course first!");
        }
    };

    const markModuleComplete = async (index) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return; // Silent return if not logged in

            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}/progress`,
                { moduleIndex: index },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEnrollment(res.data.data);
        } catch (err) {
            console.error("Progress update failed", err);
        }
    };

    const onVideoEnd = () => {
        markModuleComplete(activeModule);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link to="/courses" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors">
                Back to Library
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Course Header Info */}
                    <div className="glass-card rounded-3xl overflow-hidden">
                        {/* ... (Header Image Logic same as before) ... */}
                        <div className="h-64 bg-gray-800 relative">
                            <img
                                src={course.image && course.image !== 'no-photo.jpg' && !course.image.startsWith('http')
                                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${course.image}`
                                    : course.image && course.image.startsWith('http')
                                        ? course.image
                                        : `https://placehold.co/1200x600/1f2937/66fcf1?text=${encodeURIComponent(course.title)}`}
                                alt="Course Cover"
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h1 className="text-4xl font-black text-white mb-2 leading-tight shadow-sm">{course.title}</h1>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-300 leading-relaxed text-lg">{course.description}</p>
                        </div>
                    </div>

                    {/* Video Player Section */}
                    {course.content[activeModule] && course.content[activeModule].videoUrl && (
                        <div className="glass-card p-2 rounded-2xl">
                            <div className="bg-black rounded-xl overflow-hidden aspect-video relative z-10">
                                {getVideoId(course.content[activeModule].videoUrl) ? (
                                    <YouTube
                                        videoId={getVideoId(course.content[activeModule].videoUrl)}
                                        opts={{
                                            width: '100%',
                                            height: '100%',
                                            playerVars: {
                                                autoplay: 1,
                                                modestbranding: 1,
                                                rel: 0,
                                                origin: window.location.origin
                                            },
                                        }}
                                        className="w-full h-full absolute inset-0"
                                        onEnd={onVideoEnd}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        Invalid Video URL
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="text-lg font-bold text-white">
                                    Now Playing: {course.content[activeModule].title}
                                </h4>
                                <p className="text-sm text-green-400 mt-1">
                                    * Video automatically marks as complete when finished.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Curriculum */}
                <div className="lg:col-span-1">
                    <div className="glass-card rounded-2xl p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Curriculum</h3>
                            <span className="text-sm font-bold text-gray-400">
                                {enrollment ? Math.round((enrollment.completedModules.length / course.content.length) * 100) : 0}% Done
                            </span>
                        </div>

                        <div className="space-y-3">
                            {course.content.length > 0 ? (
                                course.content.map((module, idx) => {
                                    const isCompleted = enrollment?.completedModules.includes(String(idx));
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveModule(idx)}
                                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border relative ${activeModule === idx
                                                ? 'bg-accent-blue/10 border-accent-blue shadow-lg shadow-accent-blue/10'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Status Indicator (Read-Only) */}
                                                <div
                                                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isCompleted
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-600 bg-gray-900/50'
                                                        }`}
                                                >
                                                    {isCompleted && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                </div>

                                                <div>
                                                    <h4 className={`text-sm font-bold ${activeModule === idx ? 'text-white' : 'text-gray-300'}`}>
                                                        {module.title}
                                                    </h4>
                                                    <div className="flex gap-2 mt-2">
                                                        {module.videoUrl && <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Video</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-gray-500 text-center py-4">No content modules yet.</p>
                            )}
                        </div>
                        {/* Certificate Button Section remains same */}


                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <button
                                onClick={downloadCertificate}
                                disabled={!enrollment?.isCompleted}
                                className={`w-full py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold ${enrollment?.isCompleted
                                    ? 'bg-brand-cyan hover:bg-cyan-400 text-gray-900 cursor-pointer shadow-lg shadow-cyan-500/20'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                {enrollment?.isCompleted ? 'Download Certificate' : 'Complete All Modules'}
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                {enrollment?.isCompleted ? 'Congratulations!' : 'Certificate unlocks at 100%'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
