import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/authSlice';
import authService from '../services/authServices';
import profileService from '../services/profileServices';


const UpdateProfile = () => {
  const user = useSelector(state => state.auth.user) || localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
  };

  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Enter a valid 10-digit phone number").required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address1: Yup.string().required("Address Line 1 is required"),
    address2: Yup.string(),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipcode: Yup.string().matches(/^\d{5,6}$/, "Enter a valid zip code").required("Zipcode is required"),
  });

  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formPayload = new FormData();
      for (let key in values) {
        formPayload.append(key, values[key]);
      }
      if (profilePic) {
        formPayload.append("profilePic", profilePic);
      }
  
      // 🔁 Update Profile
      const profileRes = await profileService.updateProfile(formPayload, token);
      const profileData = profileRes.data;
  
      // 🔁 Update User Info (name + email)
      const userRes = await authService.updateUser({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
      }, token);
      const userData = userRes.data;
  
      // ✅ Final updates
      alert("Profile and user info updated successfully!");
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(loginSuccess({ user: userData, token }));
      resetForm();
      setProfilePic(null);
  
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message;
      if (message?.includes("Profile")) {
        alert(`Profile error: ${message}`);
      } else if (message?.includes("User")) {
        alert(`User error: ${message}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
    
  };
  

  const fields = [
    { label: "First Name", type: "text", name: "firstName" },
    { label: "Last Name", type: "text", name: "lastName" },
    { label: "Phone", type: "text", name: "phone" },
    { label: "Email", type: "email", name: "email" },
    { label: "Address Line 1", type: "text", name: "address1" },
    { label: "Address Line 2", type: "text", name: "address2" },
    { label: "City", type: "text", name: "city" },
    { label: "State", type: "text", name: "state" },
    { label: "Zipcode", type: "text", name: "zipcode" },
  ];

  return (
    <div className="px-10 py-6">
      <div className="flex flex-col items-start">
        <h2 className="text-3xl font-bold text-[#6a1b9a] mb-6">Update Profile</h2>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form encType="multipart/form-data">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map((field, idx) => (
                  <div key={idx} className="flex flex-col">
                    <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-600">
                      {field.label}
                    </label>
                    <Field
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.label}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a1b9a]"
                    />

                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                ))}
              </div>

              <div className="text-right mt-6">
                <button
                  type="submit"
                  className="bg-[#6a1b9a] hover:bg-[#5a1780] transition text-white px-6 py-2 rounded-full"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateProfile;
