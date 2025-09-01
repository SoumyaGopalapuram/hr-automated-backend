import { useState } from 'react';

type JobFormProps = {
  onSubmit: (data: any) => void;
};

export default function JobForm({ onSubmit }: JobFormProps) {
  const [form, setForm] = useState({
    job_description: '',
    location: '',
    years_experience: 0,
    visa_status: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md space-y-4">
      <textarea
        name="job_description"
        placeholder="Job Description"
        value={form.job_description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="years_experience"
        type="number"
        placeholder="Years of Experience"
        value={form.years_experience}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="visa_status"
        placeholder="Visa Status"
        value={form.visa_status}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
    </form>
  );
}
