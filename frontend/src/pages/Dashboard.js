import React from 'react'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import CardsData from '../components/ui/CardsData'
import LineChart from '../components/ui/LineChart'
import BarChart from '../components/ui/BarChart'
import UsersTables from '../components/ui/UsersTables'
import ModelTables from '../components/ui/ModelTables'

const Dashboard = () => {
  const users = [
    {
      id:1,
      name: 'John',
      email: 'John@gmail.com',
    },
    {
      id:2,
      name: 'Ayoub',
      email: 'Ayoub@gmail.com',
    }
  ]

  const usersHeader = [
    {
      key: 'Users',
      name: "Name",
    },
    {
      key: 'Email',
      name: "Email",
    }
  ]

  const models = [
    {
      id:1,
      model: 'model 1',
      description: 'model 1 descript',
    },
    {
      id:2,
      model: 'model 2',
      description: 'model 2 descript',
    }
  ]

  const modelsHeader = [
    {
      key: 'model',
      name: "Model",
    },
    {
      key: 'description',
      name: "Descriptions",
    }
  ]



  return (
    <div>
        <Header />
        <Sidebar />
        <CardsData />
        <div className='bg-slate-200 ml-0 md:ml-[16.67%] flex items-center pt-[3rem]'>
          <div className='w-2/3 ml-7'>
            <LineChart />
          </div>
          <div className='w-1/3 ml-3 mr-5'>
            <BarChart />
          </div>
        </div>
        <div className='bg-slate-200 ml-0 md:ml-[16.67%] flex items-center pt-[1rem] pb-[2rem]'>
          <div className='w-2/3 ml-7'>
            <UsersTables title="Users" data={users} header={usersHeader}  />
          </div>
          <div className='w-1/3 ml-3 mr-5'>
            <ModelTables title="Models" data={models} header={modelsHeader} />
          </div>
        </div>
    </div>
  )
}

export default Dashboard
