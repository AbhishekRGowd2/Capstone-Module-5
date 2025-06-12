// src/components/Patient/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PatientDashboard = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // if using token auth


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // if required
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const fields = [
    { label: "First Name", value: profile.firstName },
    { label: "Last Name", value: profile.lastName },
    { label: "Phone", value: profile.phone },
    { label: "Email", value: profile.email },
    { label: "Address Line 1", value: profile.address1 },
    { label: "Address Line 2", value: profile.address2 },
    { label: "City", value: profile.city },
    { label: "State", value: profile.state },
    { label: "Zipcode", value: profile.zipcode },
  ];

  return (
    <div className="py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#6a1b9a] mb-6">Patient Dashboard</h2>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">

          <h3 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Patient Details</h3>

          {loading ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-500">{field.label}</p>
                  <p className="text-base font-medium text-gray-800">
                    {field.value || <span className="italic text-gray-400">Not yet updated</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
