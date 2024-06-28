import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = ({setSidebar , sidebar}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleSidebar = () => {
    setSidebar(!sidebar)
  };

  return (
    <div className='h-20 flex fixed top-0 w-full left-0 z-10'>
        <div className='w-1/2 md:w-1/6 bg-blue-400 h-full flex justify-center items-center'>
            <Link to={"/"} className='font-bold text-white text-2xl'>Plantextile</Link>
        </div>
        <div className='w-2/3 md:w-5/6 bg-blue-500 h-full flex justify-between items-center'>
          <div className='items-center flex' onClick={toggleSidebar}>
            <i className="fa-solid fa-bars text-white ml-7 cursor-pointer"></i>
          </div>
          <div className='items-center flex relative'>
             <div className='mr-5 cursor-pointer' onClick={toggleDropdown}>
               <img alt='user account' className='rounded-full object-cover w-[45px] h-[45px]' src='images/account-1.jpg' />
             </div>
             {dropdownVisible && (
               <div className='absolute top-10 right-5 mt-2 w-48 bg-white border rounded shadow-md'>
                 <Link to="/profile" className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>Profile</Link>
                 <Link to="/update-password" className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>Update Password</Link>
                 <Link to="/logout" className='block px-4 py-2 text-red-500 hover:bg-gray-200'>Logout</Link>
               </div>
             )}
          </div>
        </div>
    </div>
  )
}

export default Header
