import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: [] // Array of { title, videoUrl, materialUrl }
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const { title, description, content } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = e => setImageFile(e.target.files[0]);

    // Handle dynamic content fields
    const addContentModule = () => {
        setFormData({
            ...formData,
            content: [...content, { title: '', videoUrl: '', materialUrl: '' }]
        });
    };

    const onContentChange = (index, e) => {
        const newContent = [...content];
        newContent[index][e.target.name] = e.target.value;
        setFormData({ ...formData, content: newContent });
    };

    const removeContentModule = (index) => {
        const newContent = content.filter((_, i) => i !== index);
        setFormData({ ...formData, content: newContent });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            // Create FormData to send file + text
            const data = new FormData();
            data.append('title', title);
            data.append('description', description);
            // Since 'content' is array of objects, we need to stringify or append loop. 
            // Better to append individual fields if backend parser supports it, but usually backend expects specific structure.
            // But express body-parser doesn't handle mixed multipart/json well unless we parse manually.
            // Multer handles file, but messes up nested objects.
            // Strategy: Send content as JSON string and parse it in backend or separate fields?
            // Let's send content as JSON string and verify backend parsing, OR loop over it.
            // Backend `req.body` with multer usually flattens it.
            // A common trick: JSON.stringify array and send as 'content' field.
            // NOTE: We need to ensure backend body-parser runs AFTER multer or multer allows fields.
            // Multer handles fields too.
            // Let's JSON stringify the complex array.
            // Wait, standard `create` might expect array.
            // Let's iterate.
            content.forEach((item, index) => {
                data.append(`content[${index}][title]`, item.title);
                data.append(`content[${index}][videoUrl]`, item.videoUrl);
                data.append(`content[${index}][materialUrl]`, item.materialUrl);
            });

            if (imageFile) {
                data.append('image', imageFile);
            }

            // Fallback for simple content array parsing if backend expects raw JSON body (which multer blocks)
            // Actually, best to JSON stringify it if we rewrite controller to parse it. 
            // But since we are using std URL params, let's try strict mapping or just simple appends.

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/courses');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to create course');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="glass-card rounded-3xl p-8 border border-gray-700/50">
                <div className="mb-8 border-b border-gray-700 pb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Create New Course</h1>
                    <p className="text-gray-400">Share your knowledge about sustainable infrastructure.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-accent-blue">Course Details</h3>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-accent-blue text-white"
                                placeholder="e.g. Introduction to Earthquake Resistant Design"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={onChange}
                                rows="4"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-accent-blue text-white"
                                placeholder="What will students learn in this course?"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Course Cover Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={onFileChange}
                                className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-blue file:text-white hover:file:bg-cyan-600"
                            />
                        </div>
                    </div>

                    {/* Content Modules */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <h3 className="text-xl font-bold text-accent-blue">Course Curriculum</h3>
                            <button
                                type="button"
                                onClick={addContentModule}
                                className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600"
                            >
                                + Add Module
                            </button>
                        </div>

                        {content.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/20">
                                <p className="text-gray-500">No modules added yet. Click "Add Module" to begin.</p>
                            </div>
                        )}

                        {content.map((module, index) => (
                            <div key={index} className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 relative group animate-fade-in">
                                <button
                                    type="button"
                                    onClick={() => removeContentModule(index)}
                                    className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-60 hover:opacity-100 p-1"
                                    title="Remove Module"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>

                                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-gray-700 text-xs w-6 h-6 flex items-center justify-center rounded-full">{index + 1}</span>
                                    Module {index + 1}
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="title"
                                            value={module.title}
                                            onChange={(e) => onContentChange(index, e)}
                                            placeholder="Module Title (e.g. Chapter 1: Foundation)"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="videoUrl"
                                            value={module.videoUrl}
                                            onChange={(e) => onContentChange(index, e)}
                                            placeholder="Video Embed URL (Optional)"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none"
                                        />
                                        <input
                                            type="text"
                                            name="materialUrl"
                                            value={module.materialUrl}
                                            onChange={(e) => onContentChange(index, e)}
                                            placeholder="Study Material/PDF URL (Optional)"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Creating Course...' : 'Publish Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
