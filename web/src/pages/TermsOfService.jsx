import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-medium mb-8 hover:text-blue-700 transition">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p className="text-lg leading-relaxed mb-8">
                            These Terms of Service govern your use of the CloudNest platform. By creating an account and utilizing our storage dashboards, you agree to comply strictly with the following guidelines.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Account Responsibilities</h2>
                        <p className="mb-6">
                            You are fully responsible for maintaining the confidentiality of your login credentials and OTP codes. Any destructive actions performed strictly under your verified user session are your responsibility.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Prohibited Content</h2>
                        <p className="mb-6">
                            Users are strictly forbidden from uploading malicious software, unlawful documents, or infrastructure-damaging payloads into our cloud nodes. We reserve the right to permanently terminate and block verified accounts that violate these conditions without warning.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Availability Limitations</h2>
                        <p className="mb-6">
                            While we guarantee 99.9% uptime for premium tiers, CloudNest operates on third-party cloud integrations. We are not liable for transient network disruptions beyond our control.
                        </p>

                        <p className="text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
                            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
