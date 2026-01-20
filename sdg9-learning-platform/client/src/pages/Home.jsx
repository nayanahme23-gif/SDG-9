import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen text-white">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                    alt="Infrastructure Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 animate-fade-in-up">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 font-bold uppercase tracking-widest text-sm mb-4">
                        Sustainable Development Goal 9
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight">
                        <span className="text-white">Industry,</span><br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Innovation</span> & <br />
                        <span className="text-accent-blue">Infrastructure</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Building resilient infrastructure, promoting inclusive and sustainable industrialization, and fostering innovation for a better future.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                        <button
                            onClick={() => navigate('/courses')}
                            className="px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-500/20"
                        >
                            Start Learning
                        </button>
                        <button
                            onClick={() => handleNavigation('/crack-analysis')}
                            className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg border border-gray-600 transition-all transform hover:-translate-y-1"
                        >
                            AI Crack Detection
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Pillars Section */}
            <div className="py-24 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4"><span className="text-orange-500">3 Pillars</span> of SDG 9</h2>
                        <p className="text-gray-400">The foundation for a sustainable and prosperous society.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="glass-card p-8 rounded-3xl border border-gray-800 hover:border-orange-500/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Infrastructure</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Develop quality, reliable, sustainable and resilient infrastructure to support economic development and human well-being.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="glass-card p-8 rounded-3xl border border-gray-800 hover:border-blue-500/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Industrialization</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Promote inclusive and sustainable industrialization and substantially increase industry's share of employment and gross domestic product.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-card p-8 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Innovation</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Enhance scientific research, upgrade the technological capabilities of industrial sectors, and encourage innovation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why it matters */}
            <div className="py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-blue/5 to-transparent"></div>

                <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop"
                            alt="Technology Lab"
                            className="rounded-3xl shadow-2xl border border-gray-700"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-4xl font-bold">Why AI in Manufacturing?</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Artificial Intelligence is revolutionizing SDG 9 by predicting infrastructure failures before they happen. Our platform demonstrates this with our <span className="text-accent-blue font-bold">Structural Crack Detection</span> tool.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            By automating maintenance checks, we extend the lifespan of bridges, roads, and buildings, reducing waste and ensuring safety.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={() => handleNavigation('/crack-analysis')}
                                className="text-accent-blue hover:text-white font-bold flex items-center gap-2 transition-colors"
                            >
                                Try the AI Tool
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
