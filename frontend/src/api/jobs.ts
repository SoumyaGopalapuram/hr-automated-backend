// frontend/src/api/jobs.ts
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const createAndMatchJob = async (jobData: any) => {
  const res = await axios.post(`${API_BASE}/jobs/create-and-match`, jobData);
  return res.data;
};
