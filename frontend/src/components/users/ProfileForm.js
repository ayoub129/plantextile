import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../ui/Input';
import ImageInput from '../ui/ImageInput';
import Button from '../ui/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileForm = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    image: '',
    justEdit: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setProfile(response.data);
      } catch (error) {
        toast.error('Error fetching profile.');
      }
    };

    fetchProfile();
  }, [id]);

  const onChange = (name, value) => {
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProfile({
      ...profile,
      image: e.target.files[0],
      justEdit: true,
    });
  };
  
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(profile).forEach((key) => {
      if (key === 'image' && profile[key]) {
        formData.append('image', profile[key]);
      } else {
        formData.append(key, profile[key]);
      }
    });
  
    try {
      await api.post(`/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='pt-[6rem] ml-6 md:ml-[18.5%] mr-6'>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl font-bold mb-4'>Profile</h1>
        <div className='mb-4'>
          <ImageInput label='Profile Image' handleFileChange={handleFileChange} />
          {profile.image && profile.justEdit ?  (
            <img src={URL.createObjectURL(profile.image)} alt='Profile' className='mt-4' style={{ width: '100px', height: '100px' }} />
          )  :  (
            <img src={`http://localhost:8000${profile.image}`} alt='Profile' className='mt-4' style={{ width: '100px', height: '100px' }} />
          )}
        </div>
        <div className='flex items-center justify-between'>
            <div className='mb-4 w-[49%]'>
            <Input label='Name' id='name' name='name' handleChange={(name, value) => onChange(name, value)} text={profile.name} />
            </div>
            <div className='mb-4 w-[49%]'>
            <Input label='Email' id='email' name='email' handleChange={(name, value) => onChange(name, value)} text={profile.email} />
            </div>
        </div>
        <div className='mb-4'>
          <Input label='Role' id='role' name='role' handleChange={(name, value) => onChange(name, value)} text={profile.role} disabled={true} />
        </div>
        <Button type='submit' classes='bg-blue-500 text-white'>{loading ? 'Updating...' : 'Update Profile'}</Button>
      </form>
    </div>
  );
};

export default ProfileForm;