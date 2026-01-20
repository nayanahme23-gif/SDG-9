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
    const [currentUser, setCurrentUser] = useState(null);

    // Quiz State
    // ...

    useEffect(() => {
        // Fetch current user
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCurrentUser(res.data.data);
                } catch (err) {
                    console.error('Failed to fetch user', err);
                }
            }
        };
        fetchUser();
    }, []);

    // ... (fetchData useEffect) ...

    // Quiz State
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerSelect = (optionIndex) => {
        setUserAnswers({ ...userAnswers, [currentQuestion]: optionIndex });
    };

    const handleNextQuestion = () => {
        if (currentQuestion < course.quizzes.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const submitQuiz = async () => {
        let correctCount = 0;
        course.quizzes.forEach((quiz, index) => {
            if (userAnswers[index] === quiz.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setQuizSubmitted(true);

        // Send to backend
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}/quiz`, {
                    score: correctCount,
                    totalQuestions: course.quizzes.length
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error("Failed to submit quiz score", err);
        }
    };

    const resetQuiz = () => {
        setUserAnswers({});
        setQuizSubmitted(false);
        setScore(0);
        setCurrentQuestion(0);
        setShowQuiz(false);
    };

    // ... (fetchData useEffect remains same) ...

    // Analytics State for Instructor
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const courseRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}`);
                setCourse(courseRes.data.data);

                if (token) {
                    // Check if current user is instructor (need to decode token or wait for user fetch)
                    // Simplified: We try to fetch enrollment first
                    try {
                        const enrollRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}/enrollment`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setEnrollment(enrollRes.data.data);
                    } catch (e) {
                        // ignore if not enrolled
                    }

                    // Try to fetch analytics (will fail if not instructor)
                    try {
                        const analyticsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}/analytics`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setAnalytics(analyticsRes.data.data);
                    } catch (e) {
                        // Not instructor or error
                    }
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
                            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                                <h1 className="text-4xl font-black text-white mb-2 leading-tight shadow-sm">{course.title}</h1>
                                {currentUser && (currentUser.role === 'admin' || (course.instructor && currentUser._id === course.instructor._id)) && (
                                    <Link
                                        to={`/courses/edit/${course._id}`}
                                        className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors mb-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Edit
                                    </Link>
                                )}
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

                    {/* Quiz Section */}
                    {course.quizzes && course.quizzes.length > 0 && (
                        <div className="glass-card rounded-3xl p-8 mt-8 border border-gray-700/50">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Course Quiz</h2>
                                {!showQuiz && !quizSubmitted && (
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="bg-brand-cyan hover:bg-cyan-400 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Take Quiz
                                    </button>
                                )}
                            </div>

                            {showQuiz && !quizSubmitted && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Question {currentQuestion + 1} of {course.quizzes.length}</span>
                                    </div>

                                    <h3 className="text-xl text-white font-semibold">{course.quizzes[currentQuestion].question}</h3>

                                    <div className="space-y-3">
                                        {course.quizzes[currentQuestion].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswerSelect(idx)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all ${userAnswers[currentQuestion] === idx
                                                    ? 'bg-accent-blue/20 border-accent-blue text-white'
                                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <button
                                            onClick={handlePrevQuestion}
                                            disabled={currentQuestion === 0}
                                            className="text-gray-400 hover:text-white disabled:opacity-30"
                                        >
                                            Previous
                                        </button>

                                        {currentQuestion === course.quizzes.length - 1 ? (
                                            <button
                                                onClick={submitQuiz}
                                                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                            >
                                                Submit Answers
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleNextQuestion}
                                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {quizSubmitted && (
                                <div className="text-center space-y-4 animate-fade-in">
                                    <div className="inline-block p-4 rounded-full bg-gray-800 mb-2">
                                        <span className={`text-4xl font-bold ${score >= course.quizzes.length / 2 ? 'text-green-400' : 'text-red-400'}`}>
                                            {Math.round((score / course.quizzes.length) * 100)}%
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        You scored {score} out of {course.quizzes.length}
                                    </h3>
                                    <p className="text-gray-400">
                                        {score >= course.quizzes.length / 2
                                            ? "Great job! You've mastered this topic."
                                            : "You might want to review the course materials and try again."}
                                    </p>
                                    <button
                                        onClick={resetQuiz}
                                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-4"
                                    >
                                        Retry Quiz
                                    </button>
                                </div>
                            )}
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

                        {/* Instructor Analytics Section */}
                        {analytics.length > 0 && (
                            <div className="glass-card rounded-2xl p-6 mt-6 sticky top-[500px] border-l-4 border-yellow-500">
                                <h3 className="text-xl font-bold text-white mb-4">Student Progress</h3>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {analytics.map((enr, idx) => (
                                        <div key={idx} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-white text-sm">{enr.user ? enr.user.name : 'Unknown User'}</p>
                                                    <p className="text-xs text-gray-400">{new Date(enr.enrolledAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded font-bold ${enr.isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {enr.isCompleted ? 'Completed' : 'In Progress'}
                                                </span>
                                            </div>
                                            {enr.quizScores && enr.quizScores.length > 0 ? (
                                                <div className="text-sm bg-black/30 p-2 rounded">
                                                    <p className="text-gray-300">Latest Quiz:</p>
                                                    <p className={`font-mono font-bold ${enr.quizScores[enr.quizScores.length - 1].score >= enr.quizScores[enr.quizScores.length - 1].totalQuestions / 2 ? 'text-green-400' : 'text-red-400'}`}>
                                                        Score: {enr.quizScores[enr.quizScores.length - 1].score}/{enr.quizScores[enr.quizScores.length - 1].totalQuestions}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-500 italic">No quiz taken</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
