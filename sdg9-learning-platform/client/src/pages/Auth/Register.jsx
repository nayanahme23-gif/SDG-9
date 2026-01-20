import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const navigate = useNavigate();
    const { name, email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, formData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            } else {
                alert(res.data.message || 'Registration successful. Waiting for approval.');
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.error || 'Registration failed. Please check your connection.';
            alert(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-card p-10 rounded-2xl w-full max-w-md border border-gray-700/50">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-gray-400">Join the platform today</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">I am a...</label>
                        <select
                            name="role"
                            value={role}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent text-white transition-all duration-200"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mt-4"
                    >
                        Get Started
                    </button>
                    <p className="text-center text-gray-400 mt-6 text-sm">
                        Already have an account? <Link to="/login" className="text-accent-blue font-semibold hover:text-cyan-300 transition-colors">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
