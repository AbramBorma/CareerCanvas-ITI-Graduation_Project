import axios from "axios";
import {jwtDecode} from "jwt-decode";  // Corrected import
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";  // Assuming this is your AuthContext file

const baseURL = "http://127.0.0.1:8000";  // Your Django API base URL

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },  // Include the access token in the headers
  });

  // Interceptor to handle token expiration and refreshing
  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens) {
      return req;  // If no authTokens are present, return the request as-is
    }

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;  // Check if the token is expired

    if (!isExpired) return req;  // If token is not expired, proceed with the request

    // If the token is expired, attempt to refresh it
    try {
      const response = await axios.post(`${baseURL}/users/token/refresh/`, {
        refresh: authTokens.refresh,  // Send the refresh token to get a new access token
      });

      // Save the new tokens and update the auth context
      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);  // Update the tokens in context
      setUser(jwtDecode(response.data.access));  // Update the user details from the new access token

      req.headers.Authorization = `Bearer ${response.data.access}`;  // Update the Authorization header with the new token
    } catch (error) {
      console.error("Token refresh failed", error);  // Handle token refresh errors (optional)
      // Optionally log the user out or perform another action if token refresh fails
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
