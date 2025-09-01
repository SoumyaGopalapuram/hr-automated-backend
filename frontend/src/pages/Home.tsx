import React, { useState } from 'react';
import axios from 'axios';
import ResumeCard from '../components/ResumeCard';
import './Home.css'; // Import CSS animations

function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);
  const [visaStatus, setVisaStatus] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/jobs/create-and-match', {
        job_description: jobDescription,
        location,
        years_experience: yearsExperience,
        visa_status: visaStatus,
      });
      setMatches(response.data.matches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-400 to-blue-700 text-white p-8">
      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="circle animate-float-slow" style={{ top: '10%', left: '20%' }}></div>
        <div className="circle animate-float" style={{ top: '30%', left: '70%' }}></div>
        <div className="circle animate-float-fast" style={{ top: '60%', left: '40%' }}></div>
        <div className="circle animate-float" style={{ top: '80%', left: '80%' }}></div>
    </div>

      <div className="max-w-3xl mx-auto bg-white text-gray-900 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Job Profile Matcher
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="number"
            placeholder="Years of Experience"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(Number(e.target.value))}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="text"
            placeholder="Visa Status"
            value={visaStatus}
            onChange={(e) => setVisaStatus(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105"
          >
            {loading ? 'Matching...' : 'Find Matches'}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Matching Resumes</h2>
          {matches.length === 0 && <p className="text-gray-600">No matches yet.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((resume) => (
              <ResumeCard key={resume.resume_id} resume={resume} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
