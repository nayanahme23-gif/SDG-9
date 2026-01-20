import React, { useState } from 'react';
import axios from 'axios';

const CrackAnalysis = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const onFileChange = e => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const onUpload = async e => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data.data);
        } catch (err) {
            console.error(err);
            alert('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
                <span className="bg-purple-900/30 text-purple-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">AI Powered Tool</span>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Structural Analysis</h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Upload images of infrastructure to detect, classify, and analyze structural anomalies using our advanced computer vision model.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="glass-card p-8 rounded-3xl h-fit">
                    <form onSubmit={onUpload} className="space-y-6">
                        <div className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${file ? 'border-accent-blue bg-accent-blue/5' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                            />

                            {!preview ? (
                                <div className="space-y-4">
                                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-lg">Drop your image here</p>
                                        <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-20">
                                    <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-lg shadow-lg" />
                                    <p className="mt-4 text-accent-blue text-sm font-medium flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        Click to change image
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 shadow-lg ${!file || loading
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-accent-blue to-brand-cyan hover:from-cyan-400 hover:to-teal-400 text-gray-900 transform hover:-translate-y-1'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing Structure...
                                </span>
                            ) : 'RUN ANALYSIS'}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                <div className="glass-card p-8 rounded-3xl h-full min-h-[500px] flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Diagnostic Report</h2>

                    {!result ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-4">
                            <div className="w-24 h-24 rounded-full bg-gray-900/50 flex items-center justify-center border border-gray-800">
                                <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <p className="text-center">Waiting for analysis input...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className={`p-6 rounded-2xl border ${result.has_crack ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`w-3 h-3 rounded-full ${result.has_crack ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`}></div>
                                    <h3 className={`text-xl font-bold ${result.has_crack ? 'text-red-400' : 'text-green-400'}`}>
                                        {result.has_crack ? 'Structural Defect Detected' : 'Structure Intact'}
                                    </h3>
                                </div>
                                <p className="text-gray-300 ml-7">{result.message}</p>
                            </div>

                            {result.has_crack && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Defect Type</p>
                                            <p className="text-white font-bold">{result.crack_type}</p>
                                        </div>
                                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Severity Level</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${result.severity === 'High' ? 'bg-red-500/20 text-red-500' :
                                                    result.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-green-500/20 text-green-500'
                                                    }`}>
                                                    {result.severity.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700">
                                        <h4 className="text-accent-blue font-bold mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                            Recommended Remedy
                                        </h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{result.remedy}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-5 rounded-xl border border-indigo-500/20">
                                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Educational Insight
                                        </h4>
                                        <p className="text-indigo-200 text-sm leading-relaxed italic border-l-2 border-indigo-500 pl-4">{result.educational_info}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrackAnalysis;
