import React from 'react';
import { ArrowLeft, AlertTriangle, MapPin, Sparkles } from 'lucide-react';
import { ReportFormData } from '../services/emailService';

interface ReportViewProps {
    onBack: () => void;
    reportForm: ReportFormData;
    setReportForm: (data: ReportFormData) => void;
    reportStatus: 'idle' | 'loading' | 'success' | 'error';
    isSubmittingReport: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
    onBack,
    reportForm,
    setReportForm,
    reportStatus,
    isSubmittingReport,
    onSubmit
}) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-500">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-montenegro-red transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                </div>
            </nav>

            <main className="flex-grow py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-none overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col md:grid md:grid-cols-2">
                        {/* Left Column: Context */}
                        <div className="p-12 md:p-20 bg-slate-900 text-white space-y-8 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-montenegro-red/10 to-transparent"></div>

                            <div className="w-16 h-16 bg-white/5 text-montenegro-gold rounded-none flex items-center justify-center border border-white/10 relative z-10">
                                <AlertTriangle size={32} />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1]">Spotted <br /> an issue?</h1>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                                    Help us keep the Top 5 lists perfect. Whether a place has closed, moved, or changed its name, your verification helps the community.
                                </p>
                            </div>

                            <div className="pt-8 space-y-6 relative z-10">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-montenegro-red/20 group-hover:border-montenegro-red/30 transition-all">
                                        <MapPin size={18} className="text-montenegro-gold" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white">Field Verification</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">We check every report manually</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-montenegro-red/20 group-hover:border-montenegro-red/30 transition-all">
                                        <Sparkles size={18} className="text-montenegro-gold" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white">Local Impact</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Keeping recommendations fresh</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="relative">
                            <form onSubmit={onSubmit} className="p-12 md:p-20 space-y-6">
                                <div className="space-y-2 mb-8">
                                    <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Submit a Report</h3>
                                    <div className="w-12 h-1 bg-montenegro-red"></div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="Jane Doe"
                                            required
                                            value={reportForm.name}
                                            onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                                            className="w-full p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="jane@example.com"
                                            required
                                            value={reportForm.email}
                                            onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                                            className="w-full p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Location Name</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. Konoba Maestral, Kotor"
                                        required
                                        value={reportForm.location}
                                        onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                                        className="w-full p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">The Issue</label>
                                    <textarea
                                        placeholder="What happened? (Closed permanently, moved to new street...)"
                                        rows={5}
                                        required
                                        value={reportForm.issue}
                                        onChange={(e) => setReportForm({ ...reportForm, issue: e.target.value })}
                                        className="w-full p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                                    ></textarea>
                                </div>

                                {reportStatus === 'success' ? (
                                    <div className="p-6 bg-green-50 text-green-700 rounded-none border border-green-100 flex items-center gap-3 animate-in zoom-in-95">
                                        <Sparkles size={20} />
                                        <div>
                                            <p className="font-bold uppercase tracking-widest text-[10px]">Report Received</p>
                                            <p className="text-xs mt-1">Thank you. Our team will verify this within 24 hours.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        disabled={isSubmittingReport}
                                        className={`w-full py-6 bg-slate-900 text-white rounded-none font-bold hover:bg-slate-800 transition shadow-2xl uppercase tracking-[0.3em] text-[10px] ${isSubmittingReport ? 'opacity-50' : ''}`}
                                    >
                                        {isSubmittingReport ? 'Verifying...' : 'Submit Report'}
                                    </button>
                                )}

                                {reportStatus === 'error' && (
                                    <p className="text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">Something went wrong. Please try again.</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
