import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Upload, X, FileText, AlertCircle, MessageSquare } from 'lucide-react';
import Typed from 'typed.js';
import StepCard from './stepCard.js';

// Custom hook for Typed.js
const useTyped = (el, text) => {
  useEffect(() => {
    if (!el.current) return;

    const typed = new Typed(el.current, {
      strings: [text],
      typeSpeed: 20,
      showCursor: false,
    });

    return () => {
      typed.destroy();
    };
  }, [text]);
};

// Modified TypedMessage component
const TypedMessage = ({ text }) => {
  const el = useRef(null);
  useTyped(el, text);

  return <span ref={el}></span>;
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [aiMessages, setAiMessages] = useState([
    { type: 'ai', text: "Hello! I'm your AI Resume Assistant. Upload your resume and paste the job description, and I'll help you analyze how well they match. What would you like to know?" }
  ]);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  const handleFileSelection = (selectedFile) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile?.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setFile(null);
      return;
    }
    if (selectedFile.size > maxSize) {
      setError('File size should be less than 5MB');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeResume = async (analysisType) => {
    if (!file) {
      setError('Please upload a resume');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('job_description', jobDescription);
      formData.append('analysis_type', analysisType);

      setAiMessages(prev => [...prev, {
        type: 'ai',
        text: `Analyzing your resume for ${analysisType.replace('_', ' ')}...`
      }]);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = {
        analyze_resume: "Based on your resume analysis:\n\n• Strong technical background in React and Python development\n• Good experience with modern web technologies\n• Clear demonstration of project leadership\n• Effective communication of technical concepts",
        improve_skills: "Here are my recommended improvements:\n\n• Consider adding cloud certification (AWS/Azure)\n• Strengthen experience with CI/CD pipelines\n• Add more quantifiable achievements\n• Include specific examples of problem-solving",
        match_percentage: "Let me break down the job match for you:\n\n• Overall Match: 85%\n• Technical Skills: 90%\n• Experience Level: 80%\n• Required Qualifications: 85%"
      };
      
      setAiMessages(prev => [...prev, {
        type: 'ai',
        text: responses[analysisType]
      }]);
      setActiveStep(analysisType);
    } catch (err) {
      setAiMessages(prev => [...prev, {
        type: 'ai',
        text: "I encountered an error during the analysis. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiMessages]);

  return (
    <>
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Resume Analyzer</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <textarea
              className="w-full min-h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-y"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 hover:border-black ${
              dragActive ? 'border-black bg-gray-50' : 'border-gray-300'
            } ${file ? 'bg-gray-50' : 'hover:bg-gray-100'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelection(e.target.files?.[0])}
            />
            
            {!file ? (
              <div className="space-y-3">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports PDF up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-black" />
                  <span className="text-sm font-medium">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-red-50 rounded-full text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StepCard
              number="analyze_resume"
              title="Analyze Resume"
              description="Get detailed insights about your resume"
              icon={FileText}
              onClick={() => analyzeResume('analyze_resume')}
              className={`transition-transform duration-300 hover:scale-105 ${activeStep === 'analyze_resume' ? 'ring-2 ring-black' : ''}`}
            />
            
            <StepCard
              number="improve_skills"
              title="Suggest Improvements"
              description="Get recommendations to enhance your profile"
              icon={FileText}
              onClick={() => analyzeResume('improve_skills')}
              className={`transition-transform duration-300 hover:scale-105 ${activeStep === 'improve_skills' ? 'ring-2 ring-black' : ''}`}
            />
            
            <StepCard
              number="match_percentage"
              title="Check Match"
              description="See how well your resume matches the job"
              icon={FileText}
              onClick={() => analyzeResume('match_percentage')}
              className={`transition-transform duration-300 hover:scale-105 ${activeStep === 'match_percentage' ? 'ring-2 ring-black' : ''}`}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-gray-50 mb-6">
        <div 
          ref={chatContainerRef}
          className="h-[300px] overflow-y-auto p-4 space-y-4"
        >
          {aiMessages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.type === 'ai' ? 'bg-white' : 'bg-gray-100'
              } p-4 rounded-lg shadow-sm`}
            >
              <MessageSquare className="w-6 h-6 text-black mt-1" />
              <div className="flex-1">
                <TypedMessage text={message.text} />
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 p-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-gray-600">Thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ResumeAnalyzer;