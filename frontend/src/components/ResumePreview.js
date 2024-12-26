import React, { useState } from 'react';
import { Phone, Mail, Linkedin, Github } from 'react-icons/fa';

const ResumePreview = () => {
  const [data, setData] = useState({
    name: "JOHN DOE",
    location: "San Francisco, CA",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    linkedin: "johndoe",
    skills: "Languages: JavaScript, Python, HTML5, CSS3\nFrameworks: React.js, Node.js, Django\nTools: Git, Docker, AWS",
    degree1: "Master of Science in Computer Science",
    college1: "Stanford University",
    year1: "2023",
    project1_title: "AI-Powered Resume Builder",
    project1_languages: "React, Python, OpenAI",
    pduration1: "2023",
    pdescription1: "Built an AI-powered resume builder using React and OpenAI API<br>Implemented real-time preview with matching templates<br>Integrated with Django backend for data persistence",
    project1_github: "https://github.com/johndoe/resume-builder",
  });

  return (
    <div className="max-w-[800px] mx-auto p-4 font-serif text-[11pt] leading-[1.3]">
      {/* Header */}
      <div className="text-center mb-3">
        <div className="text-[20pt] mb-1 font-['Century']">{data.name}</div>
        <div className="text-[11pt] text-gray-700 mb-2">{data.location}</div>
        
        {/* Contact Info */}
        <div className="flex justify-center items-center gap-2 flex-wrap text-[10pt]">
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {data.phone}
            </span>
          )}
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {data.email}
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noopener noreferrer">
                LinkedIn: {data.linkedin}
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">
          Technical Skills
        </div>
        <div className="grid gap-0.5">
          {data.skills.split('\n').map((skill, index) => (
            <div key={index} className="mb-1">
              {skill.includes(':') ? (
                <>
                  <strong>{skill.split(':')[0]}:</strong>
                  {skill.split(':')[1]}
                </>
              ) : skill}
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      {data.degree1 && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">
            Education
          </div>
          <div className="mb-2">
            <div className="font-bold text-[10pt] flex justify-between">
              {data.college1}
              <span className="font-bold text-[9.5pt]">{data.year1}</span>
            </div>
            <div className="italic text-[9.5pt]">{data.degree1}</div>
          </div>
        </div>
      )}

      {/* Projects */}
      {data.project1_title && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">
            Projects
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[10pt]">{data.project1_title}</span>
                {data.project1_languages && (
                  <>
                    <span>|</span>
                    <span className="italic text-gray-600 text-[10pt]">{data.project1_languages}</span>
                  </>
                )}
                {data.project1_github && (
                  <>
                    <span>|</span>
                    <a href={data.project1_github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </>
                )}
              </div>
              <span className="font-bold text-[9.5pt]">{data.pduration1}</span>
            </div>
            <ul className="list-none pl-4">
              {data.pdescription1.split('<br>').map((point, index) => (
                <li key={index} className="relative mb-0.5 before:content-['•'] before:absolute before:left-[-1rem]">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
