import api from '../utils/api'; // importing abou gabal's api

const API_URL = "http://127.0.0.1:8000";

export const getQuestions = async (subject,level) => {
    return await api.get(`${API_URL}/exams/fetchQuestions/${subject}/${level}`);
  };
