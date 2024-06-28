import React, { useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import CardsData from '../components/ui/CardsData';
import LineChart from '../components/ui/LineChart';
import BarChart from '../components/ui/BarChart';

const Dashboard = () => {
  const [sidebar, setSidebar] = useState(false);

  const lineChartData = {
    labels: ['2024-04-17', '2024-04-18', '2024-04-19', '2024-04-20', '2024-04-22', '2024-04-23'],
    datasets: [
      {
        label: 'Production Réelle dépôt',
        data: [0, 0, 0, 510, 1675, 1050],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
      {
        label: 'Production Réelle chaine',
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
        <CardsData />
        <div className='bg-slate-200 ml-0 md:ml-[16.67%] flex items-center pt-[2rem] '>
          <div className='responsive-table ml-7 mr-7'>
            <table >
              <thead>
                <tr>
                  <th>Date de production</th>
                  <th>Jour</th>
                  <th>Production Réelle dépôt</th>
                  <th>Production Réelle chaine</th>
                  <th>Prix modèle</th>
                  <th>Production dépôt en valeur</th>
                  <th>Production chaine en valeur</th>
                  <th>Effectif direct CH3</th>
                  <th>Nombre d'heures travaillées par jour</th>
                  <th>Nombre total d'heures travaillées </th>
                  <th>Masse salariale 16,29</th>
                  <th>Masse salariale 17,00</th>
                  <th>Masse salariale 17,50</th>
                  <th>Congé annuel</th>
                  <th>Masse salariale directe</th>
                  <th>Effectif indirect</th>
                  <th>QP effectif</th>
                  <th>Nombre d'heures travaillées par jour</th>
                  <th>Nombre total d'heures travaillées </th>
                  <th>Masse salariale 16,29</th>
                  <th>Masse salariale 17,00</th>
                  <th>Masse salariale 17,50</th>
                  <th>Congé annuel</th>
                  <th>Masse salariale indirecte</th>
                  <th>Total masse salariale</th>
                  <th>Capacité par unité de transport</th>
                  <th>Nombre unités à utiliser</th>
                  <th>Prix par trajet</th>
                  <th>Refacturation transport MOD directe</th>
                  <th>Refacturation transport MOD indirecte</th>
                  <th>Total refacturation transport</th>
                  <th>Prix amendis </th>
                  <th>Consommation fils</th>
                  <th>Consommation plastique</th>
                  <th>Charges fixes indirectes</th>
                  <th>Coût de revient</th>
                  <th>Marge brute dépôt</th>
                  <th>IS dépôt</th>
                  <th>Marge nette dépôt</th>
                  <th>Taux de marge nette dépôt</th>
                  <th>Marge brute chaine</th>
                  <th>IS chaine</th>
                  <th>Marge nette chaine</th>
                  <th>Taux de marge nette chaine</th>
                  <th>Production standard</th>
                  <th>Production point mort</th>
                  <th>Cumul réél</th>
                  <th>Cumul standard</th>
                  <th>Ecart</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01/01/2021</td>
                  <td>Lundi</td>
                  <td>2000</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>200000</td>
                  <td>100000</td>
                  <td>1000</td>
                  <td>8</td>
                  <td>80</td>
                  <td>200000</td>
                  <td>200000</td>
                  <td>200000</td>
                  <td>0</td>
                  <td>200000</td>
                  <td>2000</td>
                  <td>1000</td>
                  <td>8</td>
                  <td>80</td>
                  <td>200000</td>
                  <td>2000</td>
                  <td>1000</td>
                  <td>1000</td>
                  <td>200000</td>
                  <td>100000</td>
                  <td>1000</td>
                  <td>8</td>
                  <td>80</td>
                  <td>200000</td>
                  <td>200000</td>
                  <td>200000</td>
                  <td>0</td>
                  <td>200000</td>
                  <td>2000</td>
                  <td>1000</td>
                  <td>8</td>
                  <td>80</td>
                  <td>200000</td>
                  <td>200000</td>
                  <td>200000</td>
                  <td>200000</td>
                  <td>0</td>
                  <td>200000</td>
                  <td>2000</td>
                  <td>1000</td>
                  <td>8</td>
                  <td>80</td>
                  <td>200000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
