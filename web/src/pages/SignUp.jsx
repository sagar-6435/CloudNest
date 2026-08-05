import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Lock, Mail, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                name,
                email,
                password,
                mobileNumber
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard/settings'); // Redirect to Profile page after signup
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
                            Join the secure way to store your life.
                        </h1>
                        <p className="text-blue-100/90 text-lg">
                            Get 10GB of secure cloud storage free when you sign up today. Access anywhere, anytime.
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
                        <h2 className="text-3xl font-bold text-textMain mb-2">Create an account</h2>
                        <p className="text-textMuted mb-8">Start your 30-day free trial on Premium or stay on Free forever.</p>

                        <form onSubmit={handleSignUp} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-textMain">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={18} className="text-textMuted" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

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
                                <label className="text-sm font-medium text-textMain">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-textMuted" />
                                    </div>
                                    <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                                        <span className="text-sm font-medium text-textMain">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-20 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-textMain">Password</label>
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
                                        placeholder="Create a strong password"
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

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-textMain">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-textMuted" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-textMuted hover:text-textMain transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 mt-2 ${loading ? 'bg-primary/50' : 'bg-primary hover:bg-blue-700 active:scale-[0.98]'}`}
                            >
                                {loading ? 'Creating Account...' : 'Get Started'}
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-textMuted">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-primary font-semibold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
