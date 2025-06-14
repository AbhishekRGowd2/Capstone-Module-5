import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import pic from '../assets/images/OIP.jpeg';
import appointmentService from '../services/appointmentServices';

const GetAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await appointmentService.getAppointments(token);
        const data = res.data || [];
  
        setAppointments(data);
        setFilteredAppointments(data);
  
        const uniqueYears = [
          ...new Set(data.map(appt => new Date(appt.datetime).getFullYear()))
        ];
        setYears(uniqueYears.sort((a, b) => b - a));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
  
    fetchAppointments();
  }, [token]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (year === "All") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(appt =>
        new Date(appt.datetime).getFullYear().toString() === year
      );
      setFilteredAppointments(filtered);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Appointments</h2>

      {/* Year Filter Dropdown */}
      <div className="flex justify-center mb-6 text-[#6a1b9a] ">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 shadow bg-white"
        >
          <option value="All">All Years</option>
          {years.map((year, idx) => (
            <option key={idx} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAppointments.map((appt, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={pic}
              alt="Doctor"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-[#5f88e8] text-white">
              <p className="text-sm text-right font-semibold">
                {new Date(appt.datetime).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>

              <p className="mt-2 font-semibold">Doctor Details</p>
              <p>Name: {appt.doctor?.name || "Urvshi Singla"}</p>
              <p>Department: {appt.department || "Gynecologist"}</p>
              <p>Rating: {appt.rating || "4.8"}</p>

              <p className="mt-4 font-bold uppercase">
                Patient Name: {appt.profile?.firstName && appt.profile?.lastName
                  ? `${appt.profile.firstName} ${appt.profile.lastName}`
                  : "Alina Joe"}
              </p>

              <div className="flex justify-end mt-4">
                <button className="bg-white text-blue-700 font-bold py-1 px-4 rounded shadow hover:bg-blue-100 transition">
                  JOIN
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default GetAppointments;
