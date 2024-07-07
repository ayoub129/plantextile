import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePass = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const onChange = (name, value) => {
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      await api.post('/update-password', passwordData);
      toast.success('Password updated successfully.');
      navigate('/profile');
    } catch (error) {
      toast.error('Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-[6rem] ml-6 md:ml-[18.5%] mr-6'>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl font-bold mb-4'>Update Password</h1>
        <div className='mb-4'>
          <Input
            type='password'
            label='Current Password'
            id='current_password'
            name='current_password'
            handleChange={(name, value) => onChange(name, value)}
            text={passwordData.current_password}
          />
        </div>
        <div className='mb-4'>
          <Input
            type='password'
            label='New Password'
            id='new_password'
            name='new_password'
            handleChange={(name, value) => onChange(name, value)}
            text={passwordData.new_password}
          />
        </div>
        <div className='mb-4'>
          <Input
            type='password'
            label='Confirm New Password'
            id='new_password_confirmation'
            name='new_password_confirmation'
            handleChange={(name, value) => onChange(name, value)}
            text={passwordData.new_password_confirmation}
          />
        </div>
        <Button type='submit' classes='bg-blue-500 text-white'>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePass;
