import React from 'react';
import { ArrowRight, FileText, Upload, Search, Star, Users, Award, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Update the import path
import StepCard from './stepCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/create-resume');
    } else {
      navigate('/login');
    }
  };

  const steps = [
    {
      number: 1,
      title: "Create Resume",
      description: "Build your professional resume using our intuitive editor",
      icon: FileText
    },
    {
      number: 2,
      title: "Upload Resume",
      description: "Upload your existing resume for analysis and improvement",
      icon: Upload
    },
    {
      number: 3,
      title: "Get Analysis",
      description: "Receive detailed feedback and suggestions to enhance your resume",
      icon: Search
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "This platform helped me land my dream job at a top tech company. The AI suggestions were spot-on!",
      company: "Tech Giant Corp"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      content: "The ATS-friendly templates made a huge difference. I got more interviews within weeks!",
      company: "Digital Marketing Pro"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "Clean, professional templates and excellent customization options. Highly recommended!",
      company: "Creative Studios"
    }
  ];

  return (
    <>
      <div className="text-center space-y-8 py-12 animate-fadeIn">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-lg text-gray-600 mb-8">
            Create professional resumes in minutes with our AI-powered platform. 
            Get personalized suggestions and stand out from the crowd.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleGetStarted}
              className="transition-all hover:scale-105 hover:shadow-lg w-full sm:w-auto rounded-lg bg-black px-8 py-3.5 text-white transition-colors hover:bg-gray-800 font-medium inline-flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate('/learn-more')}
              className="transition-all hover:scale-105 hover:shadow-lg w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-8 py-3.5 text-gray-600 transition-colors hover:bg-gray-50 font-medium"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 mt-12">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              onClick={(stepNumber) => console.log(`Step ${stepNumber} clicked`)}
            />
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="bg-white text-black py-16 mt-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Trusted by Professionals Worldwide</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Users className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold mb-2">90%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-gray-400">User Rating</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-gray-400">Templates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.content}</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;