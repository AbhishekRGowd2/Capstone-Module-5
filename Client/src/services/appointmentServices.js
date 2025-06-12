import axios from 'axios';
import appointmentEndpoint from '../endpoints/appointmentsEndpoint'; 

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const appointmentService = {
  bookAppointment: async (formData, token) => {
    return axios.post(`${BASE_URL}/api${appointmentEndpoint.bookAppointment}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default appointmentService;
