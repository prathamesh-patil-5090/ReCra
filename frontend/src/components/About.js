import React from 'react';
import { Users, Star, Trophy, Clock } from 'lucide-react';
const About = () => {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Career Success Stories"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Customer Rating"
    },
    {
      icon: Trophy,
      value: "98%",
      label: "Interview Success Rate"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Support Available"
    }
  ];

  const values = [
    {
      title: "Expert Guidance",
      description: "Our team of career experts and AI technology work together to provide you with the best career advice."
    },
    {
      title: "Innovation",
      description: "We continuously update our AI algorithms to match the latest industry trends and recruitment practices."
    },
    {
      title: "User Success",
      description: "Your career growth is our priority. We measure our success through your achievements."
    }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Empowering Your Career Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ReCra combines advanced AI technology with expert career guidance to help you create 
            winning resumes and advance your career goals.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 animate-fadeIn">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-black text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            To democratize career success by providing accessible, AI-powered tools 
            and expert guidance that help everyone reach their professional potential, 
            regardless of their background or experience level.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;