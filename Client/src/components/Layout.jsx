import React from 'react';
import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Pencil } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileServices';


const Layout = () => {
  //const user = JSON.parse(localStorage.getItem("user"));
  const user = useSelector(state => state?.auth.user);
  console.log("User from redux : ", user);
  console.log(user?.user?.name);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const isActive = (path) => location.pathname === path;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Set initial state on mount
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await profileService.getProfile(token);
        console.log("Profile data : ", res.data);
        setProfile(res.data);
        setProfilePic(res.data?.profilePic || null);
        console.log("state data", profile, profilePic);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    console.log("Updated profilePic:", profilePic);
    console.log("Pic url:", `${BASE_URL}/uploads/profile-pics/${profilePic}`);
  }, [profilePic]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());                     // Clear Redux state
    localStorage.removeItem("user");        // Clear localStorage
    localStorage.removeItem("token");
    navigate("/");                          // Redirect to login
  };


  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('profilePic', selectedImage);

    try {
      const res = await profileService.updateProfile(formData, localStorage.getItem('token'));

      setProfilePic(res.data.profilePic);
      setShowEdit(false);
      setSelectedImage(null);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <div className="min-h-screen flex flex-col overflow-x-hidden"> */}
      {/* Navbar */}
      <div className="bg-[#6a1b9a] flex justify-between items-center p-4 text-white relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="text-white"
            aria-label="Toggle sidebar menu"
          >
            <Menu size={28} />
          </button>
          {/* {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-white"
              aria-label="Toggle sidebar menu"
            >
              <Menu size={28} />
            </button>
          )} */}


          <div className="text-xl font-semibold">Patient System</div>
        </div>

        <div className="hidden md:flex gap-4">
          <Link to="/get-services" className="bg-white text-[#6a1b9a] px-3 py-1 rounded">Services</Link>
          <Link to="/book-appointment" className="bg-white text-[#6a1b9a] px-3 py-1 rounded">Book an appointment</Link>
          <Link to="/get-appointment" className="bg-white text-[#6a1b9a] px-3 py-1 rounded">My appointments</Link>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`bg-gray-100 p-4 space-y-16 w-64 transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden'}`}>
          {/* <div className={`bg-gray-100 p-4 space-y-16 w-64 transition-all duration-300 ${isMobile ? (sidebarOpen ? 'block' : 'hidden') : 'block'}`}> */}
          <div className="text-center relative group">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={`${BASE_URL}/uploads/profile-pics/${profilePic}` || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover border-2 border-[#6a1b9a]"
              />

              <button
                onClick={() => setShowEdit(!showEdit)}
                className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <Pencil size={16} className="text-[#6a1b9a]" />
              </button>
            </div>

            {showEdit && (
              <div className="mt-2 space-y-2">
                {/* Styled file input */}
                <label className="block cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium py-1 px-3 rounded transition duration-200 text-sm w-fit mx-auto">
                  Select Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Image preview if selected */}
                {selectedImage && (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Preview"
                    className="w-20 h-20 mx-auto rounded-full object-cover border border-gray-300"
                  />
                )}

                {/* Save button */}
                <button
                  onClick={handleUpload}
                  className="bg-[#6a1b9a] text-white px-4 py-1 rounded hover:bg-[#58117d] transition duration-200 block mx-auto text-sm"
                >
                  Save
                </button>
              </div>
            )}


            <div className="font-bold mt-2">{user?.user?.name || user?.name}</div>
            <div className="text-sm text-gray-600">{user?.user?.email || user?.email}</div>

            {/* <div className="font-bold mt-2">
              {profile?.firstName && profile?.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : user?.name}
            </div>
            <div className="text-sm text-gray-600">
              {profile?.email || user?.email}
            </div> */}


          </div>

          <div>
            <Link
              to="/dashboard"
              className={`block p-2 rounded text-center mb-4 
                        ${isActive('/dashboard') ? 'bg-purple-500 text-white' : 'bg-purple-200'}`}
            >
              Home
            </Link>
            <Link
              to="/profile"
              className={`block p-2 rounded text-center mb-4 
                        ${isActive('/profile') ? 'bg-purple-500 text-white' : 'bg-purple-200'}`}
            >
              Profile Settings
            </Link>

            {/* {isMobile && (
              <div className="space-y-2">
                <Link to="/get-services" className="block p-2 bg-purple-200 rounded text-center">
                  Services
                </Link>
                <Link to="/book-appointment" className="block p-2 bg-purple-200 rounded text-center">
                  Book Appointment
                </Link>
                <Link to="/get-appointment" className="block p-2 bg-purple-200 rounded text-center">
                  My Appointments
                </Link>
              </div>
            )} */}


            <button
              onClick={handleLogout}
              className="block p-2 bg-red-500 rounded w-full text-center text-white"
            >
              Logout
            </button>

          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
