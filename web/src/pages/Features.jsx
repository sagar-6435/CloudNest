import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
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
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Features</h1>
                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p className="text-lg leading-relaxed mb-6">
                            Welcome to the CloudNest Features page. We are currently finalizing the detailed documentation for this section. Thank you for your patience as we prepare the official materials.
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Coming Soon</h2>
                        <p className="mb-4">
                            Our team is working hard to ensure that all information provided here is comprehensive, accurate, and easy to understand. Check back soon for full details!
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Features;
