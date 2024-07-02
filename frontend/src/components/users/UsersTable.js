import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const currentUserRole = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const userRoles = ["HR", "superadmin", "admin", "developer"];
    if (userRoles.indexOf(currentUserRole) === -1) {
      navigate('/dashboard');
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserRole, navigate]);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${userToDelete}`);
      setUsers(users.filter(user => user.id !== userToDelete));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user.');
    } finally {
      setShowModal(false);
    }
  };

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
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Role</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? "Loading ..." : users.map((user) => (
              <tr key={user.id} className="bg-gray-50">
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{user.name}</td>
                <td className='p-[1rem]'>
                  <img src={`${user.image ? '/' + user.image : 'https://via.placeholder.com/40'}`} alt={user.name} className='h-[100px] w-[100px] mx-auto' />
                </td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{user.email}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{user.role}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold flex justify-center items-center gap-2'>
                  <Link to={`/users/${user.id}`}>
                    <i className='fa-solid fa-pen text-yellow-400'></i>
                  </Link>
                  {["HR", "superadmin", "admin", "developer"].includes(currentUserRole) && (
                    <button onClick={() => { setUserToDelete(user.id); setShowModal(true); }}>
                      <i className='fa-solid fa-trash text-red-500'></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
