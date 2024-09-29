import api from '../utils/api';

import useAxios from "../utils/useAxios";

const API_URL = "http://127.0.0.1:8000";

const  useApi = async (username) => {

    const axiosInstance = useAxios();

    const fetchGitHubData = async (username) => {
        try {
            const response = await axiosInstance.get(`/api/github/${username}/`);
            return response.data;
        } catch (error) {
            console.error("Error fetching GitHub data", error);
            throw error;
        }
    }

    const fetchHackerRankData = async (username) => {
        try {
            const response = await axiosInstance.get(`/api/hackerrank/${username}/`);
            return response.data;
        } catch (error) {
            console.error("Error fetching HackerRank data", error);
            throw error
        }
    }
    return {
        fetchGitHubData,
        fetchHackerRankData
    }
}
export default useApi;


export const getQuestions = async (subject,level) => {
    return await api.get(`${API_URL}/exams/fetchQuestions/${subject}/${level}`);
  };

  export const submitExam = async (answers) => {
    return await api.post(`${API_URL}/exams/submit/`,answers);
  };