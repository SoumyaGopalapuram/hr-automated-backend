import React from 'react';

interface Resume {
  resume_id: number;
  name: string;
  experience_years: number;
  location: string;
  visa_status: string;
  skills: string[] | null;
}

const ResumeCard: React.FC<{ resume: Resume }> = ({ resume }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300">
      <h3 className="text-lg font-bold">{resume.name}</h3>
      <p className="text-gray-600">
        {resume.experience_years} yrs experience | {resume.location} | {resume.visa_status}
      </p>
      {resume.skills && resume.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {resume.skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeCard;
