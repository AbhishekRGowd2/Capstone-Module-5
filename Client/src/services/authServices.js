import axios from 'axios';
import authEndpoint from '../endpoints/authEndpoint';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const authService = {
  login: async (formData) => {
    return axios.post(`${BASE_URL}${authEndpoint.login}`, formData, {
      withCredentials: true,
    });
  },

  signup: async (formData) => {
    return axios.post(`${BASE_URL}${authEndpoint.signup}`, formData);
  },

  updateUser: async (userData, token) => {
    return axios.put(`${BASE_URL}${authEndpoint.updateUser}`, userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default authService;
