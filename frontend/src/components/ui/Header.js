import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='h-20 flex fixed top-0 w-full left-0 z-10'>
        <div className='w-1/3 md:w-1/6 bg-blue-400 h-full flex justify-center items-center'>
            <Link to={"/"} className='font-bold text-white text-2xl'>Plantextile</Link>
        </div>
        <div className='w-2/3 md:w-5/6 bg-blue-500 h-full flex justify-between items-center'>
          <div className='items-center flex'>
            <i className="fa-solid fa-bars text-white ml-7 cursor-pointer"></i>
          </div>
          <div className='items-center flex relative'>
             <i className="fa-solid fa-bell text-[1.25rem] text-white mr-[35px] cursor-pointer"></i>
             <div className='bg-green-400 rounded-full w-[20px] h-[20px] font-semibold absolute text-white top-0 left-[10px] flex items-center justify-center'>1</div>
             <div className='mr-5 cursor-pointer '>
               <img alt='user account' className='rounded-full object-cover w-[45px] h-[45px]' src='images/account-1.jpg' />
             </div>
          </div>
        </div>
    </div>
  )
}

export default Header
