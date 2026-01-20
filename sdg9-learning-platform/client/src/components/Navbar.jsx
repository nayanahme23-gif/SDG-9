import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'text-accent-blue font-bold border-b-2 border-accent-blue' : 'text-gray-300 hover:text-white transition-colors';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 mb-8 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-80 transition-opacity">
                        SDG 9 Platform
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/courses" className={`text-sm tracking-wide ${isActive('/courses')}`}>COURSES</Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/dashboard" className={`text-sm tracking-wide ${isActive('/dashboard')}`}>DASHBOARD</Link>
                                <Link to="/crack-analysis" className={`text-sm tracking-wide ${isActive('/crack-analysis')}`}>ANALYSIS TOOL</Link>
                                <div className="h-6 w-px bg-gray-700 mx-2"></div>
                            </>
                        )}

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className={`text-sm tracking-wide ${isActive('/login')}`}>LOGIN</Link>
                                <Link to="/register" className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                                    REGISTER
                                </Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="text-sm tracking-wide text-red-400 hover:text-red-300 transition-colors font-bold border border-red-500/30 px-4 py-1.5 rounded-lg hover:bg-red-500/10">
                                LOGOUT
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in border-t border-gray-800 pt-4">
                        <Link onClick={() => setIsMenuOpen(false)} to="/courses" className={`block py-2 ${isActive('/courses')}`}>COURSES</Link>
                        {isAuthenticated && (
                            <>
                                <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className={`block py-2 ${isActive('/dashboard')}`}>DASHBOARD</Link>
                                <Link onClick={() => setIsMenuOpen(false)} to="/crack-analysis" className={`block py-2 ${isActive('/crack-analysis')}`}>ANALYSIS TOOL</Link>
                                <hr className="border-gray-800" />
                            </>
                        )}

                        {!isAuthenticated ? (
                            <>
                                <Link onClick={() => setIsMenuOpen(false)} to="/login" className={`block py-2 ${isActive('/login')}`}>LOGIN</Link>
                                <Link onClick={() => setIsMenuOpen(false)} to="/register" className="block w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold">
                                    REGISTER
                                </Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400 font-bold">
                                LOGOUT
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
