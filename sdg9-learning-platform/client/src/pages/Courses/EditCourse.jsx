import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: [], // Array of { title, videoUrl, materialUrl }
        quizzes: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const { title, description, content, quizzes } = formData;

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}`);
                const course = res.data.data;
                setFormData({
                    title: course.title,
                    description: course.description,
                    content: course.content || [],
                    quizzes: course.quizzes || []
                });
                setCurrentImage(course.image);
            } catch (err) {
                console.error(err);
                alert('Failed to load course');
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, navigate]);

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

    // Handle dynamic quiz fields
    const addQuizQuestion = () => {
        setFormData({
            ...formData,
            quizzes: [...quizzes, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
        });
    };

    const onQuizChange = (index, field, value) => {
        const newQuizzes = [...quizzes];
        newQuizzes[index][field] = value;
        setFormData({ ...formData, quizzes: newQuizzes });
    };

    const onOptionChange = (qIndex, oIndex, value) => {
        const newQuizzes = [...quizzes];
        newQuizzes[qIndex].options[oIndex] = value;
        setFormData({ ...formData, quizzes: newQuizzes });
    };

    const removeQuizQuestion = (index) => {
        const newQuizzes = quizzes.filter((_, i) => i !== index);
        setFormData({ ...formData, quizzes: newQuizzes });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const data = new FormData();
            data.append('title', title);
            data.append('description', description);

            // Send as JSON strings
            data.append('content', JSON.stringify(content));
            data.append('quizzes', JSON.stringify(quizzes));

            if (imageFile) {
                data.append('image', imageFile);
            }

            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/courses/${id}`);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to update course');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="glass-card rounded-3xl p-8 border border-gray-700/50">
                <div className="mb-8 border-b border-gray-700 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Edit Course</h1>
                        <p className="text-gray-400">Update course content and quizzes.</p>
                    </div>
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
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Course Cover Image</label>
                            {currentImage && (
                                <img src={currentImage.startsWith('http') ? currentImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${currentImage}`} alt="Current" className="h-20 w-32 object-cover rounded mb-2" />
                            )}
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
                                <p className="text-gray-500">No modules added yet.</p>
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
                                    <input
                                        type="text"
                                        name="title"
                                        value={module.title}
                                        onChange={(e) => onContentChange(index, e)}
                                        placeholder="Module Title"
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none"
                                        required
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="videoUrl"
                                            value={module.videoUrl}
                                            onChange={(e) => onContentChange(index, e)}
                                            placeholder="Video URL"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            name="materialUrl"
                                            value={module.materialUrl}
                                            onChange={(e) => onContentChange(index, e)}
                                            placeholder="Material URL"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quiz Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <h3 className="text-xl font-bold text-accent-blue">Course Quiz</h3>
                            <button
                                type="button"
                                onClick={addQuizQuestion}
                                className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600"
                            >
                                + Add Question
                            </button>
                        </div>

                        {quizzes.length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/20">
                                <p className="text-gray-500">No quiz questions added.</p>
                            </div>
                        )}

                        {quizzes.map((quiz, qIndex) => (
                            <div key={qIndex} className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 relative group animate-fade-in space-y-4">
                                <button
                                    type="button"
                                    onClick={() => removeQuizQuestion(qIndex)}
                                    className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-60 hover:opacity-100 p-1"
                                    title="Remove Question"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 mb-1">Question {qIndex + 1}</label>
                                    <input
                                        type="text"
                                        value={quiz.question}
                                        onChange={(e) => onQuizChange(qIndex, 'question', e.target.value)}
                                        placeholder="Question"
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {quiz.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`correctAnswer-${qIndex}`}
                                                checked={parseInt(quiz.correctAnswer) === oIndex}
                                                onChange={() => onQuizChange(qIndex, 'correctAnswer', oIndex)}
                                                className="w-4 h-4 text-accent-blue bg-gray-700 border-gray-600 focus:ring-accent-blue"
                                            />
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => onOptionChange(qIndex, oIndex, e.target.value)}
                                                placeholder={`Option ${oIndex + 1}`}
                                                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm"
                                                required
                                            />
                                        </div>
                                    ))}
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
                            {submitting ? 'Updating Course...' : 'Update Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;
