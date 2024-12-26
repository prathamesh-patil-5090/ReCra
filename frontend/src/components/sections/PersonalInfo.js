import React from 'react';
import { FaPhone, FaMailBulk, FaLinkedin, FaTwitter } from 'react-icons/fa';

const PersonalInfo = ({ data, isPreview }) => {
  if (isPreview) {
    return (
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
        <p className="text-gray-600 mb-2">{data.location}</p>
        <div className="flex justify-center items-center gap-4 flex-wrap text-sm">
          {data.phone && (
            <span className="flex items-center gap-1">
              <FaPhone className="text-gray-600" />
              {data.phone}
            </span>
          )}
          {data.email && (
            <span className="flex items-center gap-1">
              <FaMailBulk className="text-gray-600" />
              {data.email}
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center gap-1">
              <FaLinkedin className="text-gray-600" />
              <a href={`https://linkedin.com/in/${data.linkedin}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:underline">
                {data.linkedin}
              </a>
            </span>
          )}
          {data.x && (
            <span className="flex items-center gap-1">
              <FaTwitter className="text-gray-600" />
              <a href={`https://x.com/${data.x}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:underline">
                {data.x}
              </a>
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={data.onChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={data.location}
          onChange={data.onChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="City, Country"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={data.onChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={data.phone}
          onChange={data.onChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="+1 234 567 8900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn Username
        </label>
        <input
          type="text"
          name="linkedin"
          value={data.linkedin}
          onChange={data.onChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="johndoe"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          X (Twitter) Username
        </label>
        <input
          type="text"
          name="x"
          value={data.x}
          onChange={data.onChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="johndoe"
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
