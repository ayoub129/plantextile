import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Header = ({ setSidebar, sidebar }) => {
  // handle clicking on profile picture state
  const [profileImageClicked, setProfileImageClicked] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/40"
  );
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  // show the nav when i click on profile picture
  const toggleShowNavMenu = () => {
    // set the profile to opposite state
    setProfileImageClicked(!profileImageClicked);
  };

  // toggle the sidebar on mobile devices
  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  // fetch the profile image
  const fetchProfileImage = async () => {
    try {
      const response = await api.get("/user/profile_picture");
      if (response.data.image) {
        setProfileImage(`http://localhost:8000${response.data.image}`);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  // handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Redirect to login page
    navigate("/");
  };

  // Fetch the profile image when the component mounts
  useEffect(() => {
    fetchProfileImage();
  }, []);

  return (
    <div className="h-20 flex fixed top-0 w-full left-0 z-10">
      <div className="w-1/2 md:w-1/6 bg-blue-400 h-full flex justify-center items-center">
        <Link to={"/"} className="font-bold text-white text-2xl">
          CCP
        </Link>
      </div>
      <div className="w-2/3 md:w-5/6 bg-blue-500 h-full flex justify-between items-center">
        <div className="items-center flex" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars text-white ml-7 cursor-pointer"></i>
        </div>
        <div className="items-center flex relative">
          <div className="mr-5 cursor-pointer" onClick={toggleShowNavMenu}>
            <img
              alt="user account"
              className="rounded-full object-cover w-[45px] h-[45px]"
              src={profileImage}
            />
          </div>
          {profileImageClicked && (
            <div className="absolute top-10 right-5 mt-2 w-48 bg-white border rounded shadow-md">
              <Link
                to={`/profile/${userId}`}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Profile
              </Link>
              <Link
                to="/update-password"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Update Password
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
