import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users');
        setUsers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='w-full'>
      <ToastContainer />
      <div className='flex ml-[16.67%] items-center justify-between pt-[6rem]'>
        <h4 className='text-[#4E4A4A] font-bold ml-7 '>Users</h4>
        <Link to="/adduser" className='text-[#fff] font-bold flex items-center justify-center mr-7 bg-blue-400 h-[30px] w-[30px] rounded'>
          <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <div className='ml-[16.67%] overflow-x-auto '>
        <table className="bg-slate-200 ml-7 mr-7 mt-5 w-[96%] shadow">
          <thead>
            <tr>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Name</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Image</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Email</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Authorization Level</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <p className='text-center text-xl my-5'>Loading ...</p> : users.map((user) => (
              <tr key={user.id} className="bg-gray-50">
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{user.name}</td>
                <td className='p-[1rem]'>
                  <img src={`/${user.image}`} alt={user.name} className='h-[100px] w-[100px] mx-auto' />
                </td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{user.email}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{user.authorization_level}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>
                    <Link to={`/users/${user.id}`}><i className='fa-solid fa-pen text-yellow-400'></i></ Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;