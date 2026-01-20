import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCurrentUser(res.data.data);
                } catch (err) {
                    console.error("Error fetching user", err);
                }
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${id}`);
                setProject(res.data.data);
            } catch (err) {
                console.error('Error fetching project:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleLike = async () => {
        if (!currentUser) return alert("Please login to like this project");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProject({ ...project, likes: res.data.data });
        } catch (err) {
            console.error('Error likely project', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!currentUser) return alert("Please login to comment");
        setSubmittingComment(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${id}/comment`, { text: commentText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProject({ ...project, comments: res.data.data });
            setCommentText('');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading Project Details...</div>;
    if (!project) return <div className="text-white text-center py-20">Project not found</div>;

    const images = project.images || [];
    const isLiked = currentUser && project.likes?.includes(currentUser._id);
    const hasCommented = currentUser && project.comments?.some(c => c.user === currentUser._id);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link to="/projects" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="w-full h-96 rounded-3xl overflow-hidden glass-card border border-gray-700/50 relative group">
                        {images.length > 0 ? (
                            <img
                                src={images[activeImage].startsWith('http') ? images[activeImage] : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${images[activeImage]}`}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Images</div>
                        )}

                        {/* Like Button Overlay */}
                        <button
                            onClick={handleLike}
                            className="absolute top-4 right-4 p-3 rounded-full glass-card hover:bg-white/10 transition-colors group"
                            title={isLiked ? "Unlike" : "Like"}
                        >
                            <svg className={`w-8 h-8 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white fill-transparent'}`} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-accent-blue ring-2 ring-accent-blue/50' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img
                                        src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${img}`}
                                        alt={`Thumbnail ${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex bg-gray-900/40 p-4 rounded-xl items-center gap-4 text-gray-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            <span className="font-bold">{project.likes?.length || 0} Likes</span>
                        </div>
                        <div className="w-px h-6 bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <span className="font-bold">{project.comments?.length || 0} Comments</span>
                        </div>
                    </div>
                </div>

                {/* Project Info & Social */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-4 leading-tight">{project.title}</h1>
                        <div className="flex items-center gap-3 text-gray-400 text-sm mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xs border border-accent-blue/30">
                                    {project.user?.name ? project.user.name.charAt(0) : 'U'}
                                </div>
                                <span className="text-white font-medium">{project.user?.name || 'Unknown User'}</span>
                            </div>
                            <span>•</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
                    </div>

                    {project.liveLink && (
                        <div className="flex gap-4 pt-6 border-t border-gray-800">
                            <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex-1 bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                Live Demo
                            </a>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="pt-8 border-t border-gray-800">
                        <h3 className="text-2xl font-bold text-white mb-6">Discussion</h3>

                        {/* Comment Form */}
                        {currentUser ? (
                            !hasCommented ? (
                                <form onSubmit={handleComment} className="mb-8 bg-gray-900/30 p-4 rounded-2xl border border-gray-700/50">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment... (Limit 1 per project)"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-accent-blue mb-2"
                                        rows="3"
                                        required
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submittingComment}
                                            className="bg-brand-cyan hover:bg-cyan-400 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {submittingComment ? "Posting..." : "Post Comment"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mb-8 p-4 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl text-brand-cyan text-center text-sm font-medium">
                                    You have shared your thoughts on this project.
                                </div>
                            )
                        ) : (
                            <div className="mb-8 p-4 bg-gray-800 rounded-xl text-center text-gray-400 text-sm">
                                Please <Link to="/login" className="text-accent-blue hover:underline">login</Link> to join the discussion.
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {project.comments && project.comments.length > 0 ? (
                                project.comments.map(comment => (
                                    <div key={comment._id} className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50 flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex-shrink-0 flex items-center justify-center text-white font-bold border border-gray-500">
                                            {comment.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-white font-bold">{comment.name}</h4>
                                                <span className="text-gray-500 text-xs">{new Date(comment.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-8">No comments yet. Be the first!</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
