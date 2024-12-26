import React, { useState } from 'react';
import { FaPhone, FaMailBulk, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa'; // Change GitHub to Twitter
import Navbar from './NavBar';

const DEFAULT_STATE = {
  name: '',
  location: '',
  email: '',
  phone: '',
  linkedin: '',
  x: '',
  skills: '',
  degree1: '',
  college1: '',
  year1: '',
  degree2: '',
  college2: '',
  year2: '',
  degree3: '',
  college3: '',
  year3: '',
  project1_title: '',
  pduration1: '',
  pdescription1: '',
  project1_github: '',
  project1_languages: '',
  project2_title: '',
  pduration2: '',
  pdescription2: '',
  project2_github: '',
  project2_languages: '',
  project3_title: '',
  pduration3: '',
  pdescription3: '',
  project3_github: '',
  project3_languages: '',
  icompany1: '',
  ipost1: '',
  iduration1: '',
  internship1_description: '',
  icompany2: '',
  ipost2: '',
  iduration2: '',
  internship2_description: '',
  icompany3: '',
  ipost3: '',
  iduration3: '',
  internship3_description: '',
  company1: '',
  post1: '',
  duration1: '',
  work_description1: '',
  company2: '',
  post2: '',
  duration2: '',
  work_description2: '',
  company3: '',
  post3: '',
  duration3: '',
  work_description3: '',
  achievement1: '',
  achievement2: '',
  achievement3: '',
  cert5: '',
  cert4: '',
  cert3: '',
  cert2: '',
  cert1: '',
  prof1: '',
  prof2: '',
  prof3: '',
  proflink1: '',
  proflink2: '',
  proflink3: '',
};

const ResumeCreator = () => {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [activeSection, setActiveSection] = useState('Personal Information');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderFormSection = (section) => (
    <div key={section.title} className="bg-white rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
        <button 
          type="button" 
          onClick={() => setActiveSection(activeSection === section.title ? null : section.title)}
          className="text-gray-500 hover:text-gray-700"
        >
          {activeSection === section.title ? '−' : '+'}
        </button>
      </div>
      
      {activeSection === section.title && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map((field) => (
            <div key={field.name} className={`${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPreviewSection = (section) => (
    <div key={section.title} className="mb-6">
      <h3 className="text-lg font-bold border-b mb-2">{section.title}</h3>
      {section.fields.map((field) =>
        formData[field.name] ? (
          <div key={field.name} className="mb-2">
            <strong>{field.label}:</strong> {formData[field.name]}
          </div>
        ) : null
      )}
    </div>
  );
  
  // Render additional sections:
  const renderAdditionalSections = () => (
    <>
      {/* Projects Section */}
      {(formData.project1_title || formData.project2_title || formData.project3_title) && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">Projects</div>
          {formData.project1_title && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.project1_title}</div>
                <div className="italic text-gray-600">{formData.pduration1}</div>
              </div>
              {formData.project1_languages && <div className="text-gray-600 italic">{formData.project1_languages}</div>}
              <ul className="list-disc ml-4">
                {formData.pdescription1.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
              {formData.project1_github && (
                <a href={formData.project1_github} target="_blank" rel="noopener noreferrer" className="text-black-600 hover:underline flex items-center gap-1">
                  <FaGithub className="w-4 h-4" /> {/* Show GitHub icon */}
                </a>
              )}
            </div>
          )}
          {formData.project2_title && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.project2_title}</div>
                <div className="italic text-gray-600">{formData.pduration2}</div>
              </div>
              {formData.project2_languages && <div className="text-gray-600 italic">{formData.project2_languages}</div>}
              <ul className="list-disc ml-4">
                {formData.pdescription2.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
              {formData.project2_github && (
                <a href={formData.project2_github} target="_blank" rel="noopener noreferrer" className="text-black-600 hover:underline flex items-center gap-1">
                  <FaGithub className="w-4 h-4" /> {/* Show GitHub icon */}
                </a>
              )}
            </div>
          )}
          {/* Repeat similar structure for project3 */}
        </div>
      )}

      {/* Internship Section */}
      {(formData.icompany1 || formData.icompany2 || formData.icompany3) && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">Internships</div>
          {formData.icompany1 && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.icompany1} {formData.ipost1 && `- ${formData.ipost1}`}</div>
                <div className="italic text-gray-600">{formData.iduration1}</div>
              </div>
              <ul className="list-disc ml-4">
                {formData.internship1_description.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
            </div>
          )}
          {formData.icompany2 && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.icompany2} {formData.ipost2 && `- ${formData.ipost2}`}</div>
                <div className="italic text-gray-600">{formData.iduration2}</div>
              </div>
              <ul className="list-disc ml-4">
                {formData.internship2_description.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
            </div>
          )}
          {formData.icompany3 && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.icompany3} {formData.ipost3 && `- ${formData.ipost3}`}</div>
                <div className="italic text-gray-600">{formData.iduration3}</div>
              </div>
              <ul className="list-disc ml-4">
                {formData.internship3_description.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
  
      {/* Work Experience Section */}
      {(formData.company1 || formData.company2 || formData.company3) && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">Work Experience</div>
          {formData.company1 && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.company1} {formData.post1 && `- ${formData.post1}`}</div>
                <div className="italic text-gray-600">{formData.duration1}</div>
              </div>
              <ul className="list-disc ml-4">
                {formData.work_description1.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
            </div>
          )}
          {formData.company2 && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.company2} {formData.post2 && `- ${formData.post2}`}</div>
                <div className="italic text-gray-600">{formData.duration2}</div>
              </div>
              <ul className="list-disc ml-4">
                {formData.work_description2.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
            </div>
          )}
          {formData.company3 && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.company3} {formData.post3 && `- ${formData.post3}`}</div>
                <div className="italic text-gray-600">{formData.duration3}</div>
              </div>
              <ul className="list-disc ml-4">
                {formData.work_description3.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
  
      {/* Achievements Section */}
      {(formData.achievement1 || formData.achievement2 || formData.achievement3) && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">Achievements</div>
          <ul className="list-none pl-[15px] my-[3px]">
            {formData.achievement1 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.achievement1}
              </li>
            )}
            {formData.achievement2 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.achievement2}
              </li>
            )}
            {formData.achievement3 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.achievement3}
              </li>
            )}
          </ul>
        </div>
      )}
  
      {/* Certifications Section */}
      {(formData.cert1 || formData.cert2 || formData.cert3 || formData.cert4 || formData.cert5) && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">Certifications</div>
          <ul className="list-none pl-[15px] my-[3px]">
            {formData.cert1 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.cert1}
              </li>
            )}
            {formData.cert2 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.cert2}
              </li>
            )}
            {formData.cert3 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.cert3}
              </li>
            )}
            {formData.cert4 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.cert4}
              </li>
            )}
            {formData.cert5 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                {formData.cert5}
              </li>
            )}
          </ul>
        </div>
      )}
  
      {/* Professional Links Section */}
      {(formData.prof1 || formData.prof2 || formData.prof3) && (
        <div className="mb-4">
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">Professional Links</div>
          <ul className="list-none pl-[15px] my-[3px]">
            {formData.prof1 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                <a href={formData.proflink1} target="_blank" rel="noopener noreferrer">{formData.prof1}</a>
              </li>
            )}
            {formData.prof2 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                <a href={formData.proflink2} target="_blank" rel="noopener noreferrer">{formData.prof2}</a>
              </li>
            )}
            {formData.prof3 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                <a href={formData.proflink3} target="_blank" rel="noopener noreferrer">{formData.prof3}</a>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
  
  return (
    <>
    <Navbar brandName="ReCra" />
    <div className="flex min-h-screen bg-gray-100">
      {/* Form Section */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <div className="sticky top-0 bg-gray-100 z-10 pb-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">Resume Builder</h1> {/* Consistent font size */}
          <p className="text-center text-gray-600 text-sm mt-1">Click on each section to expand/collapse</p> {/* Consistent text size */}
        </div>
        <form className="space-y-2">
          {SECTIONS.map(renderFormSection)}
        </form>
      </div>
  
      {/* Preview Section */}
      <div className="w-1/2 p-8 overflow-y-auto transition-opacity duration-300 ease-in">
        <div className="bg-white rounded-lg shadow-md p-6" style={{ 
          fontFamily: 'Georgia, serif',
          fontSize: '11pt', /* Consistent font size */
          lineHeight: '1.3', /* Consistent line height */
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Personal Information Section */}
          <div className="text-center mb-3">
            <div className="text-2xl mb-1 font-[Century, 'Times New Roman', serif]">{formData.name}</div> {/* Consistent font size */}
            <div className="text-[11pt] text-[#333] mb-2 font-[Georgia, serif]">{formData.location}</div> {/* Consistent font size and color */}
            <div className="flex justify-center items-center gap-2 flex-wrap text-[10pt] leading-[1.2]">
              {formData.phone && (
                <span className="flex items-center gap-1">
                  <FaPhone className="w-4 h-4" />
                  {formData.phone}
                </span>
              )}
              {formData.email && (
                <span className="flex items-center gap-1">
                  <FaMailBulk className="w-4 h-4" />
                  {formData.email}
                </span>
              )}
              {formData.linkedin && (
                <span className="flex items-center gap-1">
                  <FaLinkedin className="w-4 h-4" />
                  <a href={`https://linkedin.com/in/${formData.linkedin}`} target="_blank" rel="noopener noreferrer">
                    LinkedIn: {formData.linkedin}
                  </a>
                </span>
              )}
              {formData.x && (
                <span className="flex items-center gap-1">
                  <FaTwitter className="w-4 h-4" /> {/* Changed from FaGithub to FaTwitter */}
                  <a href={`https://x.com/${formData.x}`} target="_blank" rel="noopener noreferrer">
                    X: {formData.x}
                  </a>
                </span>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {formData.skills && (
            <div className="mb-4">
              <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua','Palatino_Linotype',serif]">
                Technical Skills
              </div>
              <div className="skills-section mb-[10px] leading-[1.4]">
                {formData.skills.split(/(?:<br>|\n)/).map((line, index) => {
                  if (!line.trim()) return null;
                  const [title, ...rest] = line.split(':');
                  const content = rest.join(':');
                  return (
                    <div key={index} className="mb-1">
                      {title && <strong className="font-['Georgia',serif] text-[10pt]">{title.trim()}:</strong>}
                      {content && <span className="text-[10pt]">{content}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education Section */}
          {(formData.degree1 || formData.degree2 || formData.degree3) && (
            <div className="mb-4">
              <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua','Palatino_Linotype',serif]">
                Education
              </div>
              {formData.degree1 && (
                <div className="mb-2">
                  <div className="font-['Georgia',serif] text-[10pt] font-bold">
                    {formData.college1}
                    {formData.year1 && <span className="float-right font-bold text-[9.5pt]">{formData.year1}</span>}
                  </div>
                  <div className="font-['Bookman_Old_Style','Georgia',serif] italic text-[9.5pt]">{formData.degree1}</div>
                </div>
              )}
              {formData.degree2 && (
                <div className="mb-2">
                  <div className="font-['Georgia',serif] text-[10pt] font-bold">
                    {formData.college2}
                    {formData.year2 && <span className="float-right font-bold text-[9.5pt]">{formData.year2}</span>}
                  </div>
                  <div className="font-['Bookman_Old_Style','Georgia',serif] italic text-[9.5pt]">{formData.degree2}</div>
                </div>
              )}
              {formData.degree3 && (
                <div className="mb-2">
                  <div className="font-['Georgia',serif] text-[10pt] font-bold">
                    {formData.college3}
                    {formData.year3 && <span className="float-right font-bold text-[9.5pt]">{formData.year3}</span>}
                  </div>
                  <div className="font-['Bookman_Old_Style','Georgia',serif] italic text-[9.5pt]">{formData.degree3}</div>
                </div>
              )}
            </div>
          )}

          {/* Project Section - Update styling */}
          {(formData.project1_title || formData.project2_title || formData.project3_title) && (
            <div className="mb-4">
              <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua','Palatino_Linotype',serif]">
                Projects
              </div>
              {/* Project items with updated styling */}
              {formData.project1_title && (
                <div className="mb-2">
                  <div className="project-header flex items-center gap-2 mb-[2px]">
                    <div className="project-title-container flex items-center gap-2 mr-auto">
                      <span className="font-bold text-[10pt]">{formData.project1_title}</span>
                      {formData.project1_languages && (
                        <>
                          <span className="mx-2">|</span>
                          <span className="italic text-[#666] text-[10pt]">{formData.project1_languages}</span>
                        </>
                      )}
                    </div>
                    {formData.pduration1 && <span className="float-right font-bold text-[9.5pt]">{formData.pduration1}</span>}
                  </div>
                  <ul className="list-none pl-[15px] my-[3px]">
                    {formData.pdescription1.split('\n').map((line, i) => 
                      line.trim() && (
                        <li key={i} className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                          {line.trim()}
                        </li>
                      )
                    )}
                  </ul>
                  {formData.project1_github && (
                    <a href={formData.project1_github} target="_blank" rel="noopener noreferrer" className="text-black-600 hover:underline flex items-center gap-1">
                      <FaGithub className="w-4 h-4" /> {/* Show GitHub icon */}
                    </a>
                  )}
                </div>
              )}
              {/* Repeat for project2 and project3 with same styling */}
            </div>
          )}

          {/* Continue updating other sections with similar precise styling */}
          {renderAdditionalSections()}
          
        </div>
      </div>
    </div>
  </>
  );
  

  
};

const SECTIONS = [
  {
    title: 'Personal Information',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'location', label: 'Location' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'linkedin', label: 'LinkedIn' },
      { name: 'x', label: 'X' },
    ],
  },
  {
    title: 'Skills',
    fields: [{ name: 'skills', label: 'Skills', type: 'textarea' }],
  },
  {
    title: 'Education',
    fields: [
      { name: 'degree1', label: 'Degree 1' },
      { name: 'college1', label: 'College 1' },
      { name: 'year1', label: 'Year 1' },
      { name: 'degree2', label: 'Degree 2' },
      { name: 'college2', label: 'College 2' },
      { name: 'year2', label: 'Year 2' },
      { name: 'degree3', label: 'Degree 3' },
      { name: 'college3', label: 'College 3' },
      { name: 'year3', label: 'Year 3' },
    ],
  },
  {
    title: 'Projects',
    fields: [
      { name: 'project1_title', label: 'Project 1 Title' },
      { name: 'pduration1', label: 'Project 1 Duration' },
      { name: 'pdescription1', label: 'Project 1 Description', type: 'textarea' },
      { name: 'project1_github', label: 'Project 1 GitHub Link' },
      { name: 'project1_languages', label: 'Project 1 Technology Stack' },
      { name: 'project2_title', label: 'Project 2 Title' },
      { name: 'pduration2', label: 'Project 2 Duration' },
      { name: 'pdescription2', label: 'Project 2 Description', type: 'textarea' },
      { name: 'project2_github', label: 'Project 2 GitHub Link' },
      { name: 'project2_languages', label: 'Project 2 Technology Stack' },
      { name: 'project3_title', label: 'Project 3 Title' },
      { name: 'pduration3', label: 'Project 3 Duration' },
      { name: 'pdescription3', label: 'Project 3 Description', type: 'textarea' },
      { name: 'project3_github', label: 'Project 3 GitHub Link' },
      { name: 'project3_languages', label: 'Project 3 Technology Stack' },
    ],
  },
  {
    title: 'Internships',
    fields: [
      { name: 'icompany1', label: 'Company 1 Name' },
      { name: 'ipost1', label: 'Post 1' },
      { name: 'iduration1', label: 'Duration 1' },
      { name: 'internship1_description', label: 'Internship 1 Description', type: 'textarea' },
      { name: 'icompany2', label: 'Company 2 Name' },
      { name: 'ipost2', label: 'Post 2' },
      { name: 'iduration2', label: 'Duration 2' },
      { name: 'internship2_description', label: 'Internship 2 Description', type: 'textarea' },
      { name: 'icompany3', label: 'Company 3 Name' },
      { name: 'ipost3', label: 'Post 3' },
      { name: 'iduration3', label: 'Duration 3' },
      { name: 'internship3_description', label: 'Internship 3 Description', type: 'textarea' },
    ],
  },
  {
    title: 'Work Experience',
    fields: [
      { name: 'company1', label: 'Company 1 Name' },
      { name: 'post1', label: 'Post 1' },
      { name: 'duration1', label: 'Duration 1' },
      { name: 'work_description1', label: 'Work Description 1', type: 'textarea' },
      { name: 'company2', label: 'Company 2 Name' },
      { name: 'post2', label: 'Post 2' },
      { name: 'duration2', label: 'Duration 2' },
      { name: 'work_description2', label: 'Work Description 2', type: 'textarea' },
      { name: 'company3', label: 'Company 3 Name' },
      { name: 'post3', label: 'Post 3' },
      { name: 'duration3', label: 'Duration 3' },
      { name: 'work_description3', label: 'Work Description 3', type: 'textarea' },
    ],
  },
  {
    title: 'Achievements',
    fields: [
      { name: 'achievement1', label: 'Achievement 1' },
      { name: 'achievement2', label: 'Achievement 2' },
      { name: 'achievement3', label: 'Achievement 3' },
    ],
  },
  {
    title: 'Certifications',
    fields: [
      { name: 'cert5', label: 'Certification 5' },
      { name: 'cert4', label: 'Certification 4' },
      { name: 'cert3', label: 'Certification 3' },
      { name: 'cert2', label: 'Certification 2' },
      { name: 'cert1', label: 'Certification 1' },
    ],
  },
  {
    title: 'Professional Profiles',
    fields: [
      { name: 'prof1', label: 'Professional Profile 1' },
      { name: 'prof2', label: 'Professional Profile 2' },
      { name: 'prof3', label: 'Professional Profile 3' },
      { name: 'proflink1', label: 'Professional Profile Link 1' },
      { name: 'proflink2', label: 'Professional Profile Link 2' },
      { name: 'proflink3', label: 'Professional Profile Link 3' },
    ],
  },
];

export default ResumeCreator;
