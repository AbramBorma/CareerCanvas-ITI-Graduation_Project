import api from '../utils/api';

import useAxios from "../utils/useAxios";

import axios from 'axios';


const API_URL = "http://127.0.0.1:8000";

const getAuthToken = () => {
    const authTokens = localStorage.getItem('authTokens');
    if (authTokens) {
        const tokens = JSON.parse(authTokens);
        console.log("Retrieved Tokens:", tokens);  // Log the entire token object
        return tokens.access;  // Return the access token
    }
    console.warn("No tokens found in localStorage.");
    return null;  // Return null if no tokens are found
};


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

    // Users APIs:

  // Fetch all supervisors
  const getSupervisors = async () => {
    try {
      const response = await axiosInstance.get('/users/supervisors/');
      return response.data;
    } catch (error) {
      console.error("Error fetching supervisors", error);
      throw error;
    }
  };

  // Approve a supervisor
  const approveSupervisor = async (id) => {
    try {
      const response = await axiosInstance.post(`/users/approve-supervisor/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error approving supervisor", error);
      throw error;
    }
  };

    return {
        fetchGitHubData,
        fetchHackerRankData,
        getSupervisors,
        approveSupervisor
    }

}
export default useApi;




//Exam APIs


// export const getQuestions = async (subject,level) => {
//     return await api.get(`${API_URL}/exams/fetchQuestions/${subject}/${level}`);
//   };

//   export const submitExam = async (answers) => {
//     return await api.post(`${API_URL}/exams/submit/`,answers);
//   };



export const getQuestions = async (subject, level) => {
  const token = getAuthToken();  // Ensure this retrieves the correct token
  console.log("Using Access Token for Questions Request:", token);  // Log token to verify

  try {
      const response = await axios.get(`${API_URL}/exams/fetchQuestions/${subject}/${level}`, {
          headers: {
              Authorization: `Bearer ${token}`,  // Include the token correctly
          },
      });
      return response.data;  // Handle the response data as needed
  } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
  }
};

export const submitExam = async (answers) => {
  const token = getAuthToken();  // Ensure this retrieves the correct token
  console.log("Using Access Token for Submit Exam Request:", token);  // Log token to verify

  try {
      const response = await axios.post(`${API_URL}/exams/submit/`, answers, {
          headers: {
              Authorization: `Bearer ${token}`,  // Include the token correctly
          },
      });
      return response.data;  // Handle the response data as needed
  } catch (error) {
      console.error("Error submitting exam:", error);
      throw error;
  }
};



export const getAssignedSubjects = async (user_id) => {
  const token = getAuthToken();  // Ensure this retrieves the correct token
  console.log("Using Access Token for Questions Request:", token);  // Log token to verify

  try {
      const response = await axios.get(`${API_URL}/exams/assigned-subjects/${user_id}`, {
          headers: {
              Authorization: `Bearer ${token}`,  // Include the token correctly
          },
      });
      return response.data;  // Handle the response data as needed
  } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
  }
};


  // Users APIs:

// Fetch all supervisors
export const getSupervisors = async () => {
    const token = getAuthToken();  // Ensure this retrieves the correct token
    console.log("Using Access Token for Supervisors Request:", token); // Log token to verify

    try {
        const response = await axios.get(`${API_URL}/users/supervisors/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token correctly
            }
        });
        return response.data;  // Handle the response data as needed
    } catch (error) {
        console.error("Error fetching supervisors:", error);
        throw error;
    }
};


// Approve a supervisor
export const approveSupervisor = async (id) => {
    const token = getAuthToken();  // Retrieve the token
    try {
        const response = await axios.post(`${API_URL}/users/approve-supervisor/${id}/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error approving supervisor", error);
        throw error;
    }
};

export const deleteSupervisor = async (id) => {
    const token = getAuthToken();  // Retrieve the token
    try {
        const response = await axios.delete(`${API_URL}/users/delete_supervisor/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting supervisor", error);
        throw error;
    }
};

export const getStudents = async () => {
    const token = getAuthToken();  // Ensure this retrieves the correct token
    console.log("Using Access Token for Supervisors Request:", token); // Log token to verify

    try {
        const response = await axios.get(`${API_URL}/users/students/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token correctly
            }
        });
        return response.data;  // Handle the response data as needed
    } catch (error) {
        console.error("Error fetching students:", error);
        throw error;
    }
};

export const approveStudent = async (id) => {
    const token = getAuthToken();  // Retrieve the token
    try {
        const response = await axios.post(`${API_URL}/users/approve-student/${id}/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error approving student", error);
        throw error;
    }
};

export const deleteStudent = async (id) => {
    const token = getAuthToken();  // Retrieve the token
    try {
        const response = await axios.delete(`${API_URL}/users/delete-student/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting student", error);
        throw error;
    }
};

export const leetCode = async (id) => {
    const token = getAuthToken();  // Retrieve the token
    try {
        const response = await axios.get(`${API_URL}/portfolio/student-leetcode/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching student LeetCode Statistics", error);
        throw error;
    }
};

export const hackerrank = async (id) => {
    const token = getAuthToken();  // Retrieve the token
    try {
        const response = await axios.get(`${API_URL}/portfolio/student-hackerrank/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching student HackerRank Statistics", error);
        throw error;
    }
};

export const studentPortfolio = async (id) => {
    const token = getAuthToken();  // Retrieve the token
    try {
        const response = await axios.get(`${API_URL}/portfolio/student-portfolio/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching student portfolio", error);
        throw error;
    }
};
