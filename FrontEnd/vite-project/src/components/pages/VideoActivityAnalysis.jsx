//src/components/pages/VideoActivityAnalysis.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, Camera, Video, AlertCircle, CheckCircle, Loader2, ArrowRight, FileText, TrendingUp, Mic, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyzeVideo } from '../../services/api';

const VideoActivityAnalysis = () => {
    const location = useLocation();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(location.state?.analysisResult?.result || null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (location.state?.analysisResult?.result) {
            setResult(location.state.analysisResult.result);
            // Clear location state to prevent reload issues
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError(null);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select or record a video first.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await analyzeVideo(file);
            setResult(data.result);
        } catch (err) {
            console.error("Analysis Error:", err);
            let errorMessage = 'Failed to analyze video. Please try again.';
            
            if (err.detail) {
                if (Array.isArray(err.detail)) {
                     // Handle FastAPI validation error array
                    errorMessage = err.detail.map(e => e.msg).join(', ');
                } else if (typeof err.detail === 'string') {
                    errorMessage = err.detail;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetAnalysis = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto py-4 md:py-8 px-2 md:px-0">
                <div className="mb-6 md:mb-8 text-center md:text-left px-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
                        <Video className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                        AI Activity Analysis
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base">
                        Analyze activities, engagement, and emotions through AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Left Column: Upload/Preview */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 md:p-6 transition-all">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-4">Upload Video</h2>
                        
                        {!previewUrl ? (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="p-3 md:p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                                </div>
                                <p className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-300">Click to Upload</p>
                                <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-500 mt-1 uppercase tracking-wider font-medium">MP4, WebM up to 100MB</p>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-lg">
                                <video 
                                    src={previewUrl} 
                                    className="max-h-full max-w-full" 
                                    controls 
                                />
                                <button 
                                    onClick={resetAnalysis}
                                    className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 p-2 rounded-xl hover:bg-white transition-colors shadow-lg active:scale-95"
                                >
                                    <span className="text-xs font-bold text-red-500">✕</span>
                                </button>
                            </div>
                        )}

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="video/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />

                        {/* Camera Option for Mobile */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Upload size={18} />
                                <span className="text-sm">Upload File</span>
                            </button>
                            <label className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 py-3 px-4 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95">
                                <Camera size={18} />
                                <span className="text-sm">Record Camera</span>
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    capture="user" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button 
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={`w-full mt-6 py-3 px-6 rounded-lg font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-all
                                ${!file || loading 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Video...
                                </>
                            ) : (
                                <>
                                    Analyze Video
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Column: Results */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 min-h-[400px]">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Analysis Results</h2>
                        
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full mb-4">
                                    <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                </div>
                                <p className="text-lg dark:text-gray-500">No analysis yet</p>
                                <p className="text-sm mt-2 max-w-xs dark:text-gray-600">Upload a video to see AI detection of activities and engagement.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Success Badge */}
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg w-fit">
                                    <CheckCircle size={18} />
                                    <span className="font-medium text-sm">Analysis Complete</span>
                                </div>

                                {/* Primary Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Detected Activity</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{result.activity_detected}</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
                                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Emotion</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{result.emotion_detected}</p>
                                    </div>
                                </div>

                                {/* Detailed Metrics */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">Engagement / Attention</span>
                                            <span className="text-gray-900 dark:text-white font-medium">{result.attention_level}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    result.attention_level === 'High' ? 'bg-green-500 w-full' : 
                                                    result.attention_level === 'Medium' ? 'bg-yellow-500 w-2/3' : 
                                                    'bg-red-500 w-1/3'
                                                }`}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">Interaction Score</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">{result.interaction_score}/100</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                                                style={{ width: `${result.interaction_score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Report Section */}
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900/50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
                                        <h3 className="font-bold text-gray-800 dark:text-white">Detailed AI Report</h3>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                        {result.detailed_report}
                                    </p>
                                    
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/50">
                                        <h4 className="text-sm font-bold text-red-500 dark:text-red-400 mb-2 uppercase tracking-wide">Needs Improvement</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {result.needs_improvement && result.needs_improvement.map((item, idx) => (
                                                <li key={idx} className="text-gray-600 dark:text-gray-400 text-sm">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Charts Section */}
                                <div className="space-y-6">
                                    {/* Accuracy Trend */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                                            <h3 className="font-bold text-gray-800 dark:text-white">Accuracy Trend</h3>
                                        </div>
                                        <div className="h-64 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={result.accuracy_trend}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="time_segment" tick={{fontSize: 12, fill: '#94a3b8'}} />
                                                    <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                                                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Accuracy %" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Phoneme Mastery */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Mic className="text-purple-600 dark:text-purple-400" size={20} />
                                            <h3 className="font-bold text-gray-800 dark:text-white">Phoneme Mastery</h3>
                                        </div>
                                        <div className="h-64 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={result.phoneme_mastery}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="phoneme" tick={{fontSize: 12, fill: '#94a3b8'}} />
                                                    <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                                                    <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Score" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Legacy Feedback Section (Updated) */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Additional Insights</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {result.feedback}
                                    </p>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-500 block">Posture</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-300">{result.posture_analysis}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-500 block">Eye Contact</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-300">{result.eye_contact}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoActivityAnalysis;
