import React from 'react';
import { Star, Target, Zap, Trophy, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearnMore = () => {
    const navigate = useNavigate();
    const features = [
        {
            icon: <Star className="w-8 h-8 text-yellow-500" />,
            title: "AI-Powered Resume Building",
            description: "Our intelligent system crafts perfect resumes tailored to your industry and experience level."
        },
        {
            icon: <Target className="w-8 h-8 text-blue-500" />,
            title: "ATS-Optimized Templates",
            description: "Stand out with professionally designed templates that pass Applicant Tracking Systems."
        },
        {
            icon: <Zap className="w-8 h-8 text-purple-500" />,
            title: "Real-Time Analysis",
            description: "Get instant feedback and suggestions to improve your resume's impact and effectiveness."
        },
        {
            icon: <Trophy className="w-8 h-8 text-green-500" />,
            title: "Industry Best Practices",
            description: "Leverage proven strategies that hiring managers look for in top candidates."
        },
        {
            icon: <Users className="w-8 h-8 text-red-500" />,
            title: "Expert Insights",
            description: "Access tips and guidance from HR professionals and industry experts."
        },
        {
            icon: <Settings className="w-8 h-8 text-indigo-500" />,
            title: "Easy Customization",
            description: "Modify your resume effortlessly with our intuitive drag-and-drop interface."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Transform Your Career Journey
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Create stunning resumes that capture attention and land your dream job. 
                        Our AI-powered platform makes it easier than ever to showcase your potential.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center bg-black text-white p-8 rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Build Your Perfect Resume?
                    </h2>
                    <p className="text-lg mb-6 text-gray-300">
                        Join thousands of successful professionals who've advanced their careers with our platform.
                    </p>
                    <button 
                        onClick={() => navigate('/create-resume')}
                        className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
                    >
                        Start Building Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LearnMore;
