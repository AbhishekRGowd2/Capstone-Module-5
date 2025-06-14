import axios from 'axios';
import appointmentEndpoint from '../endpoints/appointmentsEndpoint'; 

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const appointmentService = {
  bookAppointment: async (formData, token) => {
    return axios.post(`${BASE_URL}${appointmentEndpoint.bookAppointment}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAppointments: async (token) => {
    return axios.get(`${BASE_URL}${appointmentEndpoint.getAppointments}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default appointmentService;
