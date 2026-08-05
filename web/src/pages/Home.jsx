import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Cloud,
    ShieldCheck,
    Zap,
    RefreshCcw,
    CheckCircle2,
    Star,
    Download,
    Globe,
    Mail,
    Menu,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/dashboard');
        }
    }, [navigate]);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">

            {/* Navigation Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Cloud className="text-blue-600" size={28} />
                    <span className="text-xl font-bold text-gray-900 tracking-tight">CloudNest</span>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">How it Works</a>
                    <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/signin" className="hidden md:block text-sm font-medium text-blue-600 hover:text-blue-700">
                        Sign In
                    </Link>
                    <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                        Get Started
                    </Link>
                    <button className="md:hidden text-gray-500 hover:text-gray-900">
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-xl"
                >
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
                        Your Memories.<br />
                        Your Files.<br />
                        <span className="text-blue-600">Anywhere.</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Experience the next generation of personal cloud storage.
                        Secure, lightning-fast, and designed for your digital
                        lifestyle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <Link to="/signin" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 text-center transition-all hover:scale-[1.02]">
                            Start free
                        </Link>
                        <button className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                            <Download size={18} />
                            Download App
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e2e8f0`} alt={`User ${i}`} />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Joined by 2M+ users worldwide</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative h-[500px] w-full hidden md:block"
                >
                    {/* Main Interface Mockup */}
                    <div className="absolute top-0 right-0 w-[80%] h-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform translate-x-4">
                        <div className="w-full h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-4 flex items-center gap-2">
                                <Cloud size={14} className="text-blue-500" />
                                <span className="text-xs font-semibold text-gray-600">CloudNest</span>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 h-full">
                            <div className="w-full h-40 bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Nature" />
                            </div>
                            <div className="flex gap-3">
                                <div className="w-1/2 h-20 bg-white rounded-lg shadow-sm border border-gray-100"></div>
                                <div className="w-1/2 h-20 bg-white rounded-lg shadow-sm border border-gray-100"></div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Element 1 - PDF */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[200px] left-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-48 flex items-center gap-3 z-10"
                    >
                        <div className="bg-red-100 p-2 rounded-lg text-red-500">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900 truncate">Q3_Report.pdf</p>
                            <p className="text-[10px] text-gray-500">2.4 MB • Today</p>
                        </div>
                    </motion.div>

                    {/* Floating Element 2 - Upload Progress */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-20 right-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-56 flex items-center gap-3 z-10"
                    >
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Cloud size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900 mb-1">Syncing files...</p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[75%] rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-white shrink-0">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Storage designed for how you live.</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-16">
                        CloudNest isn't just a place for files. It is a sanctuary for your digital life, built with the strongest security and fastest speeds.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-left hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">End-to-end Encryption</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Your files are encrypted before they even leave your device. Only you hold the keys to your digital nest.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-left hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning speed</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Our global network of servers ensures that your uploads and downloads happen at the speed of thought.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-left hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <RefreshCcw size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Cross-device sync</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Start work on your Mac, refine it on your iPhone, and present from your tablet. Everything is always up to date.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Setup Steps Section */}
            <section id="how-it-works" className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
                            Setup in seconds.<br />Secure for a lifetime.
                        </h2>

                        <div className="space-y-10">
                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-2 text-blue-600">Create Account</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">Sign up with your email and set up your biometric security for instant access across all your devices.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-2 text-blue-600">Drag & Drop</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">Move your folders, photos, and documents into CloudNest. Our smart organizer categorizes them automatically.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-2 text-blue-600">Stay Connected</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">Access your files from any browser or our native apps. Share securely with a simple click or link.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                        <img
                            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200"
                            alt="Setup on Laptop"
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Simple, transparent pricing.</h2>
                    <p className="text-gray-600 max-w-xl mx-auto mb-16">
                        Choose the nest that fits your digital footprint.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
                        {/* Free */}
                        <div className="border border-gray-200 rounded-3xl p-8 bg-gray-50 flex flex-col hover:border-gray-300 transition-colors">
                            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Free</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                                <span className="text-gray-500 text-sm font-medium">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> 10 GB Storage
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> 2 Devices
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> Standard Encryption
                                </li>
                            </ul>
                            <button className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors">
                                Current Plan
                            </button>
                        </div>

                        {/* Premium */}
                        <div className="border-2 border-blue-600 rounded-3xl p-8 bg-blue-50 flex flex-col relative transform mb-4 xl:mb-0 xl:-translate-y-4 shadow-xl shadow-blue-900/5">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                Most Popular
                            </div>
                            <h3 className="text-sm font-bold text-blue-600 mb-4 uppercase">Premium</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-gray-900">$9</span>
                                <span className="text-gray-500 text-sm font-medium">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-600" /> 2 TB Storage
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-600" /> Unlimited Devices
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-600" /> Advanced Encryption
                                </li>
                            </ul>
                            <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md">
                                Choose Premium
                            </button>
                        </div>

                        {/* Pro */}
                        <div className="border border-gray-200 rounded-3xl p-8 bg-gray-50 flex flex-col hover:border-gray-300 transition-colors">
                            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Pro</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-gray-900">$19</span>
                                <span className="text-gray-500 text-sm font-medium">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> 5 TB Storage
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> Priority Support
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> File Recovery (30 days)
                                </li>
                            </ul>
                            <button className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors">
                                Choose Pro
                            </button>
                        </div>

                        {/* Family */}
                        <div className="border border-gray-200 rounded-3xl p-8 bg-gray-50 flex flex-col hover:border-gray-300 transition-colors">
                            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Family</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-gray-900">$29</span>
                                <span className="text-gray-500 text-sm font-medium">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> 10 TB Storage
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> Up to 6 Members
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 size={18} className="text-blue-500" /> Shared Family Vault
                                </li>
                            </ul>
                            <button className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors">
                                Choose Family
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-16">Trusted by millions of creators.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                            <div>
                                <div className="flex gap-1 text-orange-400 mb-6">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-6">"CloudNest changed how I manage my photography portfolio. The speed at which I can preview RAW files is unrivaled."</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4" alt="Sarah" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Sarah Jenkins</p>
                                    <p className="text-[11px] text-gray-500">Photographer</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                            <div>
                                <div className="flex gap-1 text-orange-400 mb-6">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-6">"As a developer, security is my #1 concern. CloudNest's zero-knowledge architecture is exactly what I was looking for."</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=c0aede" alt="David" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">David Chen</p>
                                    <p className="text-[11px] text-gray-500">Full Stack Developer</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                            <div>
                                <div className="flex gap-1 text-orange-400 mb-6">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-6">"We use the Family plan to share all our kids' photos with grandparents across the country. It's so simple even they can use it."</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfbf" alt="Elena" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Elena Rodriguez</p>
                                    <p className="text-[11px] text-gray-500">Designer & Mom</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto bg-blue-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Start your 30-day free trial.</h2>
                        <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto mb-10">
                            No credit card required. Experience premium cloud storage with all features unlocked for 30 days.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signin" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-bold transition-colors">
                                Create Account
                            </Link>
                            <button className="bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-500/50 px-8 py-3.5 rounded-xl font-bold transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Cloud className="text-blue-600" size={24} />
                        <span className="text-xl font-bold text-gray-900 tracking-tight">CloudNest</span>
                    </div>

                    <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                        <a href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase">Product</a>
                        <a href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase">Features</a>
                        <a href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase">Security</a>
                        <a href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase">Privacy Policy</a>
                        <a href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase">Terms of Service</a>
                    </nav>

                    <div className="flex items-center gap-4 text-gray-400">
                        <Globe size={20} className="hover:text-gray-900 cursor-pointer transition-colors" />
                        <Mail size={20} className="hover:text-gray-900 cursor-pointer transition-colors" />
                    </div>
                </div>
                <div className="text-center mt-12 text-xs text-gray-400 font-medium">
                    © 2026 CloudNest Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
