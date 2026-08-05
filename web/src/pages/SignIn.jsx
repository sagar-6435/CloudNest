import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            // Redirect to Profile Page
            navigate('/dashboard/settings');
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background aesthetic blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-background rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative z-10"
            >
                {/* Left Section - Branding */}
                <div className="w-full md:w-5/12 bg-primary p-12 text-white flex flex-col justify-between hidden md:flex relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <Cloud size={36} className="text-white" />
                            <span className="text-2xl font-bold tracking-tight">CloudNest</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight mb-6">
                            Store, share, and collaborate seamlessly.
                        </h1>
                        <p className="text-blue-100/90 text-lg">
                            Your safe space in the cloud for all life's important files. Secure enough for business, simple enough for home.
                        </p>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <div className="flex -space-x-4">
                            {/* Avatars */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-medium">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-semibold">1M+ Users</span>
                            <span className="text-xs text-blue-200">Trust CloudNest</span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
                    <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
                        <Cloud size={32} className="text-primary" />
                        <span className="text-xl font-bold text-textMain">CloudNest</span>
                    </div>

                    <div className="max-w-md w-full mx-auto">
                        <h2 className="text-3xl font-bold text-textMain mb-2">Welcome Back</h2>
                        <p className="text-textMuted mb-8">Please enter your details to sign in.</p>

                        <form onSubmit={handleSignIn} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-textMain">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-textMuted" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-textMain">Password</label>
                                    <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-textMuted" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-textMuted hover:text-textMain transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-textMuted">
                                    Remember me for 30 days
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] ${loading ? 'bg-primary/60' : 'bg-primary hover:bg-blue-700'}`}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-textMuted">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary font-semibold hover:underline">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
