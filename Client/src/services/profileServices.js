import axios from 'axios';
import profileEndpoint from '../endpoints/profileEndpoint';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const profileService = {
  getProfile: async (token) => {
    return axios.get(`${BASE_URL}${profileEndpoint.getProfile}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // if you're using cookies
    });
  },

  updateProfile: async (formData, token) => {
    return axios.post(`${BASE_URL}${profileEndpoint.updateProfile}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default profileService;
