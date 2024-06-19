import React from 'react'
import { Link } from 'react-router-dom'

const LinkIcon = ({link , icon , text}) => {
  return (
    <Link to={link} className='py-5 px-8 flex items-center justify-between hover:bg-gray-100'>
        <div className='flex items-center'>
            <i className={`fa-solid text-gray-500 fa-${icon}`}></i>
            <div className='text-gray-500 ml-[6px] font-semibold'>
                {text}
            </div>
        </div>
        <i className="fa-solid text-gray-500 fa-caret-right"></i>
    </Link>
  )
}

export default LinkIcon
