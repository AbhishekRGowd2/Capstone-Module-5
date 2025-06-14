import axios from 'axios';
import serviceEndpoint from '../endpoints/serviceEndpoint';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const facilitiesService = {
  getAllServices: async () => {
    return axios.get(`${BASE_URL}${serviceEndpoint.getAllServices}`);
  },
};

export default facilitiesService;
