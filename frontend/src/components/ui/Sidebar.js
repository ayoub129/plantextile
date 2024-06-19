import React from 'react'
import LinkIcon from './LinkIcon'

const Sidebar = () => {
  return (
    <div className='w-full md:w-1/6 bg-white fixed  md:h-full'>
      <LinkIcon link={'/dashboard'} text={"Dashboard"} icon={"gauge"} />
      <LinkIcon link={'/products'} text={"Products"} icon={"shop"} />
      <LinkIcon link={'/users'} text={"Users"} icon={"user"} />
      <LinkIcon link={'/planning'} text={"Planification"} icon={"brain"} />
      {/* <LinkIcon link={'/calendar'} text={"Calendar"} icon={"calendar"} />
      <LinkIcon link={'/data'} text={"Real Data"} icon={"database"} />
      <LinkIcon link={'/working'} text={"Effective planifier"} icon={"brain"} />
      <LinkIcon link={'/realwork'} text={"Effective Reel"} icon={"database"} />
      <LinkIcon link={'/settings'} text={"Settings"} icon={"sliders"} /> */}
    </div>
  )
}

export default Sidebar
