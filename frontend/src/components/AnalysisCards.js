import React, { useState, useRef, useEffect } from 'react';
import {ReactTyped} from 'react-typed'; 
import StepCard from './stepCard';
import { FaSearchPlus, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { MessageSquare, Loader2 } from 'lucide-react';

const TypedMessage = ({ text }) => {
  return (
    <ReactTyped
      strings={[text]}
      typeSpeed={20}
      showCursor={false}
      style={{ whiteSpace: 'pre-line' }}
    />
  );
};

const AnalysisCards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { type: 'ai', text: "Hello! I'm your AI Resume Assistant. Upload your resume and I'll help you analyze it." }
  ]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [aiMessages]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
    setError(null);
  };

  function randomizeSkills(skills) {
    if (!Array.isArray(skills) || skills.length <= 3) return skills;
    for (let i = skills.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [skills[i], skills[j]] = [skills[j], skills[i]];
    }
    return skills.slice(0, Math.floor(Math.random() * 2) + 2);
  }

  const formatAnalysisResponse = (data, analysisType) => {
    if (analysisType === 1) { 
      let response = "📝 Resume Analysis:\n\n";
      
      // Present Skills Analysis
      if (data["Present Skills"]) {
        response += "🎯 Current Skills:\n";
        Object.entries(data["Present Skills"]).forEach(([category, skills]) => {
          if (skills && skills.length > 0) {
            response += `\n${category}:\n${skills.map(skill => `• ${skill}`).join('\n')}`;
          }
        });
        response += "\n\n";
      }
  
      // Skills Gap Analysis
      if (data["Missing Skills"]) {
        response += "📚 Skills to Develop:\n";
        Object.entries(data["Missing Skills"]).forEach(([category, skills]) => {
          if (skills && skills.length > 0) {
            response += `\n${category}:\n${randomizeSkills(skills).map(skill => `• ${skill}`).join('\n')}`;
          }
        });
        response += "\n\n";
      }
  
      // Strength Analysis
      if (data["Analysis Summary"]) {
        response += "💪 Strength Analysis:\n";
        Object.entries(data["Analysis Summary"]).forEach(([category, analysis]) => {
          response += `\n${category}:\n`;
          response += `• Current Progress: ${analysis.strength}\n`;
          response += `• Skills Gap: ${analysis.gap_percentage}%\n`;
        });
        response += "\n";
      }
  
      return response;
    }
  
    if (analysisType === 2) { 
      let response = "📊 Skill Analysis Results:\n\n";
  
      // Add Skill Analysis
      if (data["Skill Analysis"]) {
        Object.entries(data["Skill Analysis"]).forEach(([category, analysis]) => {
          response += `${category}:\n`; 
          response += `Current Strength: ${Math.round(analysis.strength * 100)}%\n`;
          
          if (analysis.present_skills.length > 0) {
            response += `✅ Present Skills:\n${randomizeSkills(analysis.present_skills).map(skill => `  • ${skill}`).join('\n')}\n`;
          }
          
          if (analysis.priority_improvements.critical.length > 0) {
            response += `❗ Critical Priority:\n${randomizeSkills(analysis.priority_improvements.critical).map(skill => `  • ${skill}`).join('\n')}\n`;
          }
          
          if (analysis.priority_improvements.important.length > 0) {
            response += `⚠️ Important Priority:\n${randomizeSkills(analysis.priority_improvements.important).map(skill => `  • ${skill}`).join('\n')}\n`;
          }
          
          response += '\n';
        });
      }
  
      // Add Recommendations
      if (data["Prioritized Recommendations"]) {
        response += "\n💡 Recommendations:\n\n";
        data["Prioritized Recommendations"].forEach(rec => {
          response += `${rec.priority} Priority - ${rec.category}:\n`;  
          response += `• ${rec.message}\n`; 
          response += `  Impact: ${rec.impact}\n\n`; 
        });
      }
  
      // Add Learning Path
      if (data["Learning Path"]) {
        response += "\n📚 Learning Path:\n\n";
        Object.entries(data["Learning Path"]).forEach(([category, path]) => {
          response += `${category}:\n`;
          response += `• Current Level: ${path["Current Level"]}\n`;
          response += `• Next Steps: ${path["Next Steps"]}\n\n`; 
        });
      }
  
      return response;
    }
  
    let formattedResponse = "Here's what I found:\n\n";

    if (data["Missing Skills Analysis"]) {
      formattedResponse += "Missing Skills:\n";
      Object.entries(data["Missing Skills Analysis"]).forEach(([category, skills]) => {
        if (skills && skills.length > 0) {
          formattedResponse += `${category}:\n${randomizeSkills(skills).map(skill => `• ${skill}`).join('\n')}\n`;
        }
      });
    } else if (data["Missing Skills"]) {
      formattedResponse += "Skills to Improve:\n";
      Object.entries(data["Missing Skills"]).forEach(([category, skills]) => {
        const limitedSkills = randomizeSkills(skills);
        if (limitedSkills && limitedSkills.length > 0) {
          formattedResponse += `${category}:\n${limitedSkills.map(s => `• ${s}`).join('\n')}\n`;
        }
      });
    }

    if (data["Matched Skills"]) {
      formattedResponse += "\nMatched Skills:\n";
      Object.entries(data["Matched Skills"]).forEach(([category, skills]) => {
        if (skills && skills.length > 0) {
          formattedResponse += `${category}:\n${skills.map(skill => `• ${skill}`).join('\n')}\n`;
        }
      });
    }

    if (data.Feedback && Array.isArray(data.Feedback)) {
      formattedResponse += "\nRecommendations:\n";
      data.Feedback.forEach(feedback => {
        formattedResponse += `• ${feedback}\n`;
      });
    }

    return formattedResponse;
  };

  const handleCardClick = async (cardNumber) => {
    if (!selectedFile) {
      setError('Please select a resume file first');
      return;
    }

    if (cardNumber === 3 && !jobDescription.trim()) {
      setError('Please enter a job description for Job Match Analysis');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    
    if (jobDescription && cardNumber === 3) {
      formData.append('job_description', jobDescription);
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint;
      switch (cardNumber) {
        case 1:
          endpoint = 'analyze_resume_view';
          break;
        case 2:
          endpoint = 'suggest_improvements';
          break;
        case 3:
          endpoint = 'check_match';
          break;
        default:
          throw new Error('Invalid operation');
      }

      const response = await fetch(`http://localhost:8000/${endpoint}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const formattedResponse = formatAnalysisResponse(data, cardNumber);
      
      setAiMessages(prev => [...prev, {
        type: 'ai',
        text: formattedResponse
      }]);

    } catch (err) {
      setError(err.message);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        text: `Error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      number: 1,
      title: "Resume Analysis",
      description: "Get detailed insights about your resume",
      icon: FaSearchPlus
    },
    {
      number: 2,
      title: "Skill Recommendations",
      description: "Get suggestions to improve your skills",
      icon: FaLightbulb
    },
    {
      number: 3,
      title: "Job Match Analysis",
      description: "Check how well your resume matches a job description",
      icon: FaCheckCircle
    }
  ];

  const ErrorIcon = () => (
    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-opaque bg-clip-text bg-gradient-to-r from-black-600 to-indigo-600 sm:text-6xl">
            Resume Analyzer
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage AI-powered analysis to improve your resume and match it with job requirements. Get instant feedback and recommendations.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <FaSearchPlus className="w-5 h-5 mr-2 text-black-500" />
              Detailed Analysis
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FaLightbulb className="w-5 h-5 mr-2 text-black-500" />
              Smart Recommendations
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FaCheckCircle className="w-5 h-5 mr-2 text-black-500" />
              Job Match Scoring
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-black-200 cursor-pointer hover:bg-black-50 hover:border-black-300 transition-all duration-300">
              <svg className="w-8 h-8 text-black-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal text-gray-600">
                {selectedFile ? selectedFile.name : 'Select a PDF file'}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf"
              />
            </label>
          </div>
        </div>

        {/* Job Description Input */}
        <div className="max-w-xl mx-auto mb-8">
          <textarea
            placeholder="Enter job description (optional, required for Job Match Analysis)"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            className="w-full p-4 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all duration-300"
            rows="4"
          />
        </div>

        {/* Chat Interface */}
        <div className="border rounded-xl bg-white shadow-lg mb-6 max-w-4xl mx-auto">
          <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-6">
            {aiMessages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  message.type === 'ai' ? 'bg-black-50' : 'bg-gray-50'
                } p-5 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-[1.02]`}
              >
                <MessageSquare className={`w-6 h-6 ${message.type === 'ai' ? 'text-black-600' : 'text-gray-600'} mt-1`} />
                <div className="flex-1 whitespace-pre-wrap text-gray-700">
                  <TypedMessage text={message.text} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-center gap-3 p-4">
                <Loader2 className="w-6 h-6 text-black-600 animate-spin" />
                <span className="text-gray-600 font-medium">Analyzing your resume...</span>
              </div>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {cards.map((card) => (
            <StepCard
              key={card.number}
              number={card.number}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onClick={() => handleCardClick(card.number)}
              className={`transform transition-all duration-300 hover:scale-105 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            />
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-8 max-w-xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ErrorIcon />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisCards;
