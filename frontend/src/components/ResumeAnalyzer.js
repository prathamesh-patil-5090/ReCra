import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Upload, X, FileText, AlertCircle, MessageSquare } from 'lucide-react';
import Typed from 'typed.js';
import StepCard from './stepCard.js';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Get CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

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

    if (analysisType !== 'analyze_resume' && !jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('job_description', jobDescription);  // Make sure this is passed

      let endpoint;
      switch(analysisType) {
        case 'analyze_resume':
          endpoint = 'analyze_resume_view';  // Remove trailing slash
          break;
        case 'improve_skills':
          endpoint = 'suggest_improvements';
          break;
        case 'match_percentage':
          endpoint = 'check_match';
          break;
        default:
          setError('Invalid analysis type');
          setLoading(false);
          return;
      }

      console.log('Making request to:', endpoint);
      console.log('Job Description:', jobDescription);  // Debug log

      const response = await axios({
        method: 'post',
        url: `/${endpoint}/`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      console.log('Server Response:', response);  // Debug log

      // Wait for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log('Fetching JSON from:', `/analysis/${analysisType}`);
      // Fetch the analysis result JSON file
      const jsonResponse = await axios.get(`/analysis/${analysisType}`);
      console.log('JSON Response:', jsonResponse.data);

      const analysisData = jsonResponse.data;

      let responseText = '';

      switch(analysisType) {
        case 'analyze_resume':
          responseText = "Resume Analysis Results:\n\n";
          responseText += "Missing Skills Analysis:\n";
          Object.entries(analysisData["Missing Skills Analysis"]).forEach(([category, skills]) => {
            if (skills.length > 0) {
              responseText += `\n${category}:\n${skills.map(skill => `- ${skill}`).join('\n')}`;
            }
          });
          if (analysisData.Feedback) {
            responseText += "\n\nRecommendations:\n";
            analysisData.Feedback.forEach(feedback => {
              responseText += `\n${feedback}`;
            });
          }
          break;

        case 'improve_skills':
          responseText = "Improvement Suggestions:\n\n";
          if (analysisData.Feedback) {
            analysisData.Feedback.forEach(feedback => {
              responseText += `${feedback}\n`;
            });
          }
          break;

        case 'match_percentage':
          responseText = "Resume to Job Match Analysis:\n\n";
          if (analysisData["Matched Skills"]) {
            responseText += "Matched Skills:\n";
            Object.entries(analysisData["Matched Skills"]).forEach(([category, skills]) => {
              if (skills.length > 0) {
                responseText += `${category}: ${skills.join(', ')}\n`;
              }
            });
          }
          if (analysisData["Missing Skills"]) {
            responseText += "\nMissing Skills:\n";
            Object.entries(analysisData["Missing Skills"]).forEach(([category, skills]) => {
              if (skills.length > 0) {
                responseText += `${category}: ${skills.join(', ')}\n`;
              }
            });
          }
          break;
        default:
          responseText = "Sorry, I encountered an error. The requested analysis type is not supported.";
          break;
      }

      setAiMessages(prev => [...prev, {
        type: 'ai',
        text: responseText
      }]);
      setActiveStep(analysisType);

    } catch (err) {
      console.error('Full error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        endpoint: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers
      });
      
      let errorMessage = 'An error occurred while processing your request.';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setAiMessages(prev => [...prev, {
        type: 'ai',
        text: `Error: ${errorMessage}`
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