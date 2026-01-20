import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`);
                setProjects(res.data.data);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="text-white text-center py-20">Loading Projects...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Student Projects</h1>
                    <p className="text-gray-400">Showcase of innovation and creativity.</p>
                </div>
                <Link to="/projects/create" className="bg-brand-cyan hover:bg-cyan-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Share Your Project
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(project => (
                    <Link to={`/projects/${project._id}`} key={project._id} className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 block group">
                        <div className="h-48 relative overflow-hidden">
                            {project.images && project.images.length > 0 ? (
                                <img
                                    src={project.images[0].startsWith('http') ? project.images[0] : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${project.images[0]}`}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white line-clamp-1">{project.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xs border border-accent-blue/30">
                                        {project.user?.name ? project.user.name.charAt(0) : 'U'}
                                    </div>
                                    <span className="text-sm text-gray-300">{project.user?.name || 'Unknown'}</span>
                                </div>
                                <span className="text-brand-cyan text-sm font-bold flex items-center gap-1">
                                    View Gallery
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-gray-700 border-dashed">
                    <p className="text-gray-500 text-xl">No projects shared yet. Be the first!</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
