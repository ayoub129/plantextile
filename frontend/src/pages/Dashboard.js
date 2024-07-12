import React, { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import CardsData from '../components/ui/CardsData';
import LineChart from '../components/ui/LineChart';
import BarChart from '../components/ui/BarChart';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [models, setModels] = useState([])
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate()

  // get a single model
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/models');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, [])

  // get the planning for the model

  // get the fils - plastique consumation

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    }
  }, []);


  const lineChartData = {
    labels: ['2024-04-17', '2024-04-18', '2024-04-19', '2024-04-20', '2024-04-22', '2024-04-23'],
    datasets: [
      {
        label: 'planning ',
        data: [0, 0, 0, 510, 1675, 1050],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
      {
        label: 'Production Réelle ',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Production',
        },
      },
    },
  };

  const barChartData = {
    labels: ['2024-04-17', '2024-04-18', '2024-04-19', '2024-04-20', '2024-04-22', '2024-04-23'],
    datasets: [
      {
        label: 'Effectif direct CH3',
        data: [55, 57, 54, 63, 66, 65],
        backgroundColor: 'rgba(255,159,64,0.2)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Effectif',
        },
      },
    },
  };

  return (
    <div>
        <Header sidebar={sidebar} setSidebar={setSidebar} />
        <Sidebar sidebar={sidebar} />
        <CardsData models={models} />
        <div className='bg-slate-200 ml-0 md:ml-[16.67%] md:flex items-center pt-[3rem]'>
          <div className='w-full md:w-2/3 md:ml-7 mr-5 md:mr-0'>
            <LineChart data={lineChartData} options={lineChartOptions} />
          </div>
          <div className='w-full md:w-1/3 md:ml-3 mr-5'>
            <BarChart data={barChartData} options={barChartOptions} />
          </div>
        </div>
    </div>
  )
}

export default Dashboard
