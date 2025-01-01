import React, { useState, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaPhone, FaMailBulk, FaLinkedin, FaTwitter, FaGithub, FaGripVertical, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { FiDownload, FiMaximize } from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';

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
  const [sectionOrder, setSectionOrder] = useState([
    'skills',
    'education',
    'projects',
    'internships',
    'work',
    'achievements',
    'certifications',
    'profiles'
  ]);
  const [isFullPreview, setIsFullPreview] = useState(false);
  const componentRef = useRef();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSectionOrder(items);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const moveSection = (e, index, direction) => {
    e.preventDefault();  
    const newOrder = [...sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < sectionOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setSectionOrder(newOrder);
  };

  const renderFormSection = (section, index) => (
    <div key={section.title} className="bg-white rounded-lg p-4 mb-4 relative">
      <div className="flex items-center mb-3">
        <div className="flex items-center gap-2 mr-4">
          <button
            type="button"
            onClick={(e) => moveSection(e, index, 'up')}
            disabled={index === 0}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
          >
            <FaArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => moveSection(e, index, 'down')}
            disabled={index === SECTIONS.length - 1}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
          >
            <FaArrowDown className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-lg font-bold text-gray-800 flex-grow">{section.title}</h3>
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
          {/* Add Project 3 */}
          {formData.project3_title && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="font-bold">{formData.project3_title}</div>
                <div className="italic text-gray-600">{formData.pduration3}</div>
              </div>
              {formData.project3_languages && <div className="text-gray-600 italic">{formData.project3_languages}</div>}
              <ul className="list-disc ml-4">
                {formData.pdescription3.split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
              {formData.project3_github && (
                <a href={formData.project3_github} target="_blank" rel="noopener noreferrer" className="text-black-600 hover:underline flex items-center gap-1">
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
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
          <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1 font-['Book_Antiqua']">Professional Profiles</div>
          <ul className="list-none pl-[15px] my-[3px]">
            {formData.prof1 && formData.proflink1 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                <a href={formData.proflink1} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                  {formData.prof1}
                </a>
              </li>
            )}
            {formData.prof2 && formData.proflink2 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                <a href={formData.proflink2} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                  {formData.prof2}
                </a>
              </li>
            )}
            {formData.prof3 && formData.proflink3 && (
              <li className="mb-[2px] relative pl-3 before:content-['•'] before:absolute before:left-[-12px]">
                <a href={formData.proflink3} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                  {formData.prof3}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );

  const renderSection = (sectionId) => {
    switch(sectionId) {
      case 'personal':
        return renderPersonalInfo();
      case 'skills':
        return renderSkills();
      case 'education':
        return renderEducation();
      case 'projects':
        return renderProjects();
      default:
        return null;
    }
  };

  const renderPersonalInfo = () => {
    return (
      <div className="mb-4">
        <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1">
          Personal Information
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div>{formData.name}</div>
          <div>{formData.location}</div>
          <div className="flex gap-2">
            {formData.email && <div>{formData.email}</div>}
            {formData.phone && <div>{formData.phone}</div>}
          </div>
          <div className="flex gap-2">
            {formData.linkedin && <div>LinkedIn: {formData.linkedin}</div>}
            {formData.x && <div>X: {formData.x}</div>}
          </div>
        </div>
      </div>
    );
  };
  
  const renderSkills = () => {
    if (!formData.skills) return null;
    return (
      <div className="mb-4">
        <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1">
          Technical Skills
        </div>
        <div className="skills-section">
          {formData.skills.split('\n').map((skill, index) => (
            <div key={index}>{skill}</div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderEducation = () => {
    const hasEducation = formData.degree1 || formData.degree2 || formData.degree3;
    if (!hasEducation) return null;
    
    return (
      <div className="mb-4">
        <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1">
          Education
        </div>
        {[1, 2, 3].map(num => {
          if (!formData[`degree${num}`]) return null;
          return (
            <div key={num} className="mb-2">
              <div className="font-bold">
                {formData[`college${num}`]}
                <span className="float-right">{formData[`year${num}`]}</span>
              </div>
              <div className="italic">{formData[`degree${num}`]}</div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderProjects = () => {
    const hasProjects = formData.project1_title || formData.project2_title || formData.project3_title;
    if (!hasProjects) return null;
  
    return (
      <div className="mb-4">
        <div className="text-[13pt] font-bold border-b border-black pb-0.5 mb-1">
          Projects
        </div>
        {[1, 2, 3].map(num => {
          if (!formData[`project${num}_title`]) return null;
          return (
            <div key={num} className="mb-2">
              <div className="flex justify-between">
                <div className="font-bold">{formData[`project${num}_title`]}</div>
                <div>{formData[`pduration${num}`]}</div>
              </div>
              {formData[`project${num}_languages`] && (
                <div className="italic">{formData[`project${num}_languages`]}</div>
              )}
              <ul className="list-disc ml-4">
                {formData[`pdescription${num}`].split('\n').map((line, i) => 
                  line.trim() && <li key={i}>{line.trim()}</li>
                )}
              </ul>
              {formData[`project${num}_github`] && (
                <a href={formData[`project${num}_github`]} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  GitHub Link
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Update the section rendering helper
  const getSectionComponent = (sectionId) => {
    switch(sectionId) {
      case 'skills':
        return formData.skills && (
          <div className="mb-[16px]">
            <div className="text-[13pt] font-bold border-b border-black pb-[2px] mb-[4px] font-['Book_Antiqua','Palatino_Linotype',serif]">
              Technical Skills
            </div>
            <div className="skills-section mb-[10px] leading-[1.4]">
              {formData.skills.split('\n').map((skill, index) => {
                if (!skill.trim()) return null;
                const [title, ...rest] = skill.split(':');
                const content = rest.join(':');
                return (
                  <div key={index} className="mb-[4px]">
                    {title && <strong className="font-['Georgia',serif] text-[10pt]">{title.trim()}:</strong>}
                    {content && <span className="text-[10pt]"> {content}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'education':
        return (formData.degree1 || formData.degree2 || formData.degree3) && (
          <div className="mb-[16px]">
            <div className="text-[13pt] font-bold border-b border-black pb-[2px] mb-[4px] font-['Book_Antiqua','Palatino_Linotype',serif]">
              Education
            </div>
            {[1, 2, 3].map(num => {
              if (!formData[`degree${num}`]) return null;
              return (
                <div key={num} className="mb-[8px]">
                  <div className="font-['Georgia',serif] text-[10pt] font-bold">
                    {formData[`college${num}`]}
                    <span className="float-right text-[9.5pt] font-bold">
                      {formData[`year${num}`]}
                    </span>
                  </div>
                  <div className="font-['Bookman_Old_Style','Georgia',serif] italic text-[9.5pt]">
                    {formData[`degree${num}`]}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'projects':
      case 'internships':
      case 'work':
      case 'achievements':
      case 'certifications':
      case 'profiles':
        const sectionContent = renderAdditionalSections();
        return sectionContent.props.children.find(
          section => section && section.props?.children[0]?.props?.children === SECTIONS.find(s => s.id === sectionId)?.title
        );

      default:
        return null;
    }
  };

  // Add handle print function
  const handlePrint = useCallback(() => {
    if (componentRef.current) {
      window.print();
    }
  }, []);

  // Add toggle preview function
  const toggleFullPreview = () => {
    setIsFullPreview(!isFullPreview);
  };

  // Add transition styles
  const printStyles = `
    @media print {
      @page {
        size: A4;
        margin: 15mm 20mm;
      }
      body {
        background: none;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
      #resumeContent {
        width: 210mm !important;
        min-height: 297mm !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }

    @keyframes downloadAnimation {
      0% { transform: translateY(0); }
      50% { transform: translateY(2px); }
      100% { transform: translateY(0); }
    }

    @keyframes blinkAnimation {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .download-icon:hover {
      animation: downloadAnimation 1s infinite;
    }

    .preview-icon:hover {
      animation: blinkAnimation 1s infinite;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-20px);
      }
    }

    .preview-transition-enter {
      animation: slideIn 0.3s ease-out forwards;
    }

    .preview-transition-exit {
      animation: slideOut 0.3s ease-out forwards;
    }

    .form-container {
      transition: width 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
    }

    .preview-container {
      transition: width 0.3s ease-out, padding 0.3s ease-out;
    }

    .form-slide-exit {
      transform: translateX(0);
      opacity: 1;
      width: 50%;
      transition: all 0.3s ease-out;
    }

    .form-slide-exit-active {
      transform: translateX(-100%);
      opacity: 0;
      width: 0;
      transition: all 0.3s ease-out;
    }

    .preview-expand {
      transition: all 0.3s ease-out;
    }

    .preview-expand-active {
      width: 100% !important;
      padding-left: 4rem;
      padding-right: 4rem;
    }
  `;

  return (
    <>
      <style>{printStyles}</style>
      <div className="flex min-h-screen bg-gray-100">
        {/* Form Section with slide animation */}
        <div 
          className={`${
            isFullPreview ? 'w-0 opacity-0' : 'w-1/2 opacity-100'
          } overflow-hidden no-print`}
          style={{
            transform: isFullPreview ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'all 0.3s ease-out',
            padding: isFullPreview ? 0 : '1rem',
          }}
        >
          <div className="sticky top-0 bg-gray-100 z-10 pb-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">Resume Builder</h1>
            <p className="text-center text-gray-600 text-sm mt-1">Use arrows to reorder sections</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            {renderFormSection(SECTIONS.find(s => s.title === 'Personal Information'), -1)}
            {sectionOrder.map((sectionId, index) => {
              const section = SECTIONS.find(s => s.id === sectionId);
              return section ? renderFormSection(section, index) : null;
            })}
          </form>
        </div>
  
        {/* Preview Section with expand animation */}
        <div 
          className={`transition-all duration-300 ease-out ${
            isFullPreview ? 'w-full px-16' : 'w-1/2 px-8'
          } overflow-y-auto relative bg-gray-100`}
        >
          {/* Buttons container with updated text */}
          <div className="sticky top-0 z-10 flex justify-end gap-4 mb-4 no-print">
            <button
              onClick={toggleFullPreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-300 hover:shadow-lg"
            >
              <FiMaximize 
                className={`w-4 h-4 preview-icon transition-transform duration-300 ${
                  isFullPreview ? 'rotate-180' : ''
                }`} 
              />
              <span className="transition-all duration-300">
                {isFullPreview ? 'Show Form' : 'Full Preview'}
              </span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-all duration-300 hover:shadow-lg"
            >
              <FiDownload className="w-4 h-4 download-icon" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Resume Content with responsive width */}
          <div 
            ref={componentRef}
            id="resumeContent"
            className="bg-white rounded-lg shadow-md print:shadow-none mx-auto"
            style={{ 
              fontFamily: 'Georgia, serif',
              fontSize: '11pt',
              lineHeight: '1.3',
              width: isFullPreview ? '210mm' : '100%',
              minHeight: 'fit-content',
              padding: '20mm',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease-out',
              maxWidth: isFullPreview ? '210mm' : '100%',
              transform: `scale(${isFullPreview ? 1 : 0.9})`,
            }}
          >
            {/* Update Personal Information section */}
            <div className="text-center mb-[12px] print:w-full">
              <div className="text-[20pt] mb-[3px] font-['Century','Times_New_Roman',serif] print:text-center">
                {formData.name && formData.name.toUpperCase()}
              </div>
              <div className="text-[11pt] text-[#333] mb-[8px] font-['Georgia',serif] print:text-center">
                {formData.location}
              </div>
              <div className="flex flex-wrap justify-center items-center gap-[8px] text-[10pt] leading-[1.2] print:justify-center print:w-full">
                {formData.phone && (
                  <span className="flex items-center gap-[4px] whitespace-nowrap">
                    <FaPhone className="w-[14px] h-[14px] align-middle print:inline" />
                    {formData.phone}
                  </span>
                )}
                {formData.email && (
                  <span className="flex items-center gap-[4px] whitespace-nowrap">
                    <FaMailBulk className="w-[14px] h-[14px] print:inline" />
                    {formData.email}
                  </span>
                )}
                {formData.linkedin && (
                  <span className="flex items-center gap-[4px] whitespace-nowrap">
                    <FaLinkedin className="w-[14px] h-[14px] print:inline" />
                    <a href={`https://linkedin.com/in/${formData.linkedin}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-black no-underline">
                      LinkedIn: {formData.linkedin}
                    </a>
                  </span>
                )}
                {formData.x && (
                  <span className="flex items-center gap-[4px] whitespace-nowrap">
                    <FaTwitter className="w-[14px] h-[14px] print:inline" />
                    <a href={`https://x.com/${formData.x}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-black no-underline">
                      X: {formData.x}
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Render sections in order */}
            {sectionOrder.map(sectionId => {
              // Skip personal info as it's already rendered
              if (sectionId === 'personal') return null;
              return getSectionComponent(sectionId);
            })}
          </div>
        </div>
      </div>

      {/* Add print-specific styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #resumeContent, #resumeContent * {
              visibility: visible;
            }
            #resumeContent {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm !important;
              margin: 0 !important;
              padding: 20mm !important;
            }
          }

          @media screen and (min-width: 1024px) {
            #resumeContent {
              transform-origin: center top;
            }
          }
        `}
      </style>
    </>
  );
};

// Update SECTIONS array to include IDs
const SECTIONS = [
  {
    id: 'personal',
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
    id: 'skills',
    title: 'Skills',
    fields: [{ name: 'skills', label: 'Skills', type: 'textarea' }],
  },
  {
    id: 'education',
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
    id: 'projects',
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
    id: 'internships',
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
    id: 'work',
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
    id: 'achievements',
    title: 'Achievements',
    fields: [
      { name: 'achievement1', label: 'Achievement 1' },
      { name: 'achievement2', label: 'Achievement 2' },
      { name: 'achievement3', label: 'Achievement 3' },
    ],
  },
  {
    id: 'certifications',
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
    id: 'profiles',
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
