import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

const Cards = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      return;
    }
    setSelectedFile(file);
    setError(null);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
    setError(null);
  };

  const handleSubmit = async (endpoint) => {
    if (!selectedFile) {
      setError('Please select a resume file');
      return;
    }

    if (endpoint === 'check_match' && !jobDescription.trim()) {
      setError('Please enter a job description for Job Match Analysis');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    try {
      const response = await fetch(`http://localhost:8000/${endpoint}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Resume Analysis",
      description: "Get detailed insights about your resume",
      endpoint: "analyze_resume_view",
      requiresJobDescription: false
    },
    {
      title: "Skill Recommendations",
      description: "Get suggestions to improve your skills",
      endpoint: "suggest_improvements",
      requiresJobDescription: false
    },
    {
      title: "Job Match Analysis",
      description: "Check how well your resume matches a job description",
      endpoint: "check_match",
      requiresJobDescription: true
    }
  ];

  function randomizeSkills(skills) {
    if (!Array.isArray(skills) || skills.length <= 3) return skills;
    for (let i = skills.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [skills[i], skills[j]] = [skills[j], skills[i]];
    }
    return skills.slice(0, Math.floor(Math.random() * 2) + 2); 
  }

  const formatResults = (data) => {
    if (!data) return null;

    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Missing Skills Section */}
          {data["Missing Skills"] && (
            <div className="divide-y divide-gray-200">
              {Object.entries(data["Missing Skills"]).map(([category, skills]) => {
                const limitedSkills = randomizeSkills(skills); 
                if (!limitedSkills || !limitedSkills.length) return null;
                
                return (
                  <div key={category} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                        {limitedSkills.length} skills to improve
                      </span>
                    </div>
                    <div className="space-y-2">
                      {limitedSkills.map((skill, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-600"></span>
                          <span className="text-gray-600">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommendations Section */}
          {data.Feedback && data.Feedback.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-4">
                  {data.Feedback.map((feedback, idx) => (
                    <div key={idx} 
                      className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-gray-700">{feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 sm:text-6xl">
            Resume Analysis Tools
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered tools analyze your resume to help you stand out in the job market. Get personalized insights and recommendations.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
              <div className="text-sm text-gray-600">Upload Resume</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">2</div>
              <div className="text-sm text-gray-600">Select Analysis</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
              <div className="text-sm text-gray-600">Get Results</div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-40 border-4 border-dashed border-blue-200 hover:border-blue-300 rounded-lg hover:bg-blue-50 transition-all duration-300 ease-in-out">
              <div className="flex flex-col items-center justify-center pt-7">
                <FaCloudUploadAlt className="w-16 h-16 text-blue-500" />
                <p className="pt-3 text-sm font-medium text-gray-600 group-hover:text-gray-600">
                  {selectedFile ? selectedFile.name : 'Upload your resume (PDF)'}
                </p>
              </div>
              <input
                type="file"
                className="opacity-0"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Job Description Input */}
        <div className="max-w-xl mx-auto mb-12">
          <textarea
            className="w-full p-4 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Enter job description (optional)"
            rows="4"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          ></textarea>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {card.description}
                </p>
                <button
                  onClick={() => handleSubmit(card.endpoint)}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 max-w-xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && formatResults(results)}
      </div>
    </div>
  );
};

export default Cards;
