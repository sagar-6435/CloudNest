import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p className="text-lg leading-relaxed mb-8">
                            At CloudNest, we prioritize your privacy and security. This Privacy Policy outlines our uncompromising standards for protecting your data within our zero-knowledge architecture.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                        <p className="mb-6">
                            When you register an account, we collect basic identifying metrics such as your name, email address, and mobile number strictly for authentication protocols and communication. Your actual uploaded files are heavily encrypted; we do not have backend access to their raw contents.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Zero-Knowledge Infrastructure</h2>
                        <p className="mb-6">
                            All files placed into your CloudNest dashboard are tied exclusively to your authenticated tokens. Our engineering team utilizes secure architecture frameworks to ensure that nobody except you—not even our database administrators—can access your sensitive documents natively.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Third-Party Sharing</h2>
                        <p className="mb-6">
                            CloudNest will never sell, rent, or lease your personal information or file metadata to third-party tracking corporations.
                        </p>

                        <p className="text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
