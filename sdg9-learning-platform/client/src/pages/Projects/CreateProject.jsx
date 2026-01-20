import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githubLink: '',
        liveLink: ''
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const { title, description, githubLink, liveLink } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = e => setImageFiles(Array.from(e.target.files));

    const onSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Please login to share a project");
            navigate('/login');
            return;
        }

        try {
            const data = new FormData();
            data.append('title', title);
            data.append('description', description);
            if (githubLink) data.append('githubLink', githubLink);
            if (liveLink) data.append('liveLink', liveLink);

            imageFiles.forEach(file => {
                data.append('images', file);
            });

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/projects');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to create project');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="glass-card rounded-3xl p-8 border border-gray-700/50">
                <div className="mb-8 border-b border-gray-700 pb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Share Your Project</h1>
                    <p className="text-gray-400">Showcase your SDG 9 innovation (Gallery)</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Project Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-accent-blue text-white"
                            placeholder="e.g. Smart Bridge Monitoring System"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={onChange}
                            rows="5"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-accent-blue text-white"
                            placeholder="Describe your project details..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">GitHub Repository (Optional)</label>
                            <input
                                type="url"
                                name="githubLink"
                                value={githubLink}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-accent-blue text-white"
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Live Demo (Optional)</label>
                            <input
                                type="url"
                                name="liveLink"
                                value={liveLink}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-accent-blue text-white"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Project Images (Gallery)</label>
                        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 bg-gray-800/30 text-center relative hover:border-accent-blue transition-colors">
                            <input
                                type="file"
                                name="images"
                                multiple
                                onChange={onFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required
                            />
                            <div className="space-y-2">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="text-gray-400">
                                    <span className="text-accent-blue font-medium">Click to upload images</span> or drag and drop
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB (Select multiple)</p>
                            </div>
                            {imageFiles.length > 0 && (
                                <div className="mt-4 text-sm text-green-400 font-medium space-y-1">
                                    {imageFiles.map((f, i) => <div key={i}>{f.name}</div>)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Uploading Gallery...' : 'Submit Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
