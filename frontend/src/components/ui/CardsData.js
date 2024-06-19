import React from 'react'
import Card from './Card'

const CardsData = () => {
  return (
    <div className='bg-slate-200 ml-0 md:ml-[16.67%]'>
        <h4 className='text-[#4E4A4A] font-bold ml-7 pt-[6rem]'>Dashboard</h4>
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-7 mt-5'>
            <Card newData={1200} oldData={1650} title="Products" icon="cube" />
            <Card newData={10} oldData={8} title="Chains" icon="link" />
            <Card newData={200} oldData={250} title="Workers" icon="user-group" />
            <Card newData={3200} oldData={2050} title="Profits" icon="dollar-sign" />
        </div>
    </div>
  )
}

export default CardsData
