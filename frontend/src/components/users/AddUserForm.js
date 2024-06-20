import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const AddUserForm = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const currentUserRole = localStorage.getItem('role');
  const navigate = useNavigate();
  
  useEffect(() => {
    const userRoles = ["HR", "superadmin", "admin", "developer"];
    if (userRoles.indexOf(currentUserRole) === -1) {
      navigate('/dashboard');
    }

    // Fetch the user data if the ID is present in the URL
    if (id) {
      api.get(`/users/${id}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          toast.error('Failed to fetch user data');
        });
    }
  }, [currentUserRole, navigate, id]);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  console.log(user)

  const roles = currentUserRole === 'HR'
    ? ['HR', 'Logistique', 'Method', 'Production coupe', 'Production repassage', 'Production Control final', 'Production magasin']
    : ['HR', 'admin', 'Logistique', 'Method', 'Production coupe', 'Production repassage', 'Production Control final', 'Production magasin'];

  const onChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    if (id) {
      // Update user
      api.put(`/users/${id}`, user)
        .then(response => {
          setLoading(false);
          navigate('/users');
          toast.success('User updated successfully!');
        })
        .catch(error => {
          setLoading(false);
          toast.error('There was an error updating the user!' + error);
        });
    } else {
      // Create user
      api.post('/users', user)
        .then(response => {
          setLoading(false);
          navigate('/users');
          toast.success('User created successfully!');
        })
        .catch(error => {
          setLoading(false);
          toast.error('There was an error creating the user!' + error);
        });
    }
  };

  return (
    <div className='ml-[18.5%] mr-5 mx-auto pt-[6rem]'>
      <ToastContainer />
      <form onSubmit={onSubmit}>
        <div className='mb-4'>
          <Input
            container=""
            label="Name"
            id="name"
            name="name"
            handleChange={onChange}
            text={user.name}
            placeholder="Enter user name"
            order=""
          />
        </div>
        <div className='mb-4'>
          <Input
            container=""
            label="Email"
            id="email"
            name="email"
            handleChange={onChange}
            text={user.email}
            placeholder="Enter user email"
            order=""
          />
        </div>
        <div className='mb-4'>
          <Input
            container=""
            label="Password"
            id="password"
            name="password"
            handleChange={onChange}
            text={user.password}
            placeholder="Enter password"
            type="password"
            order=""
          />
        </div>
        <div className='mb-4'>
          <Input
            container=""
            label="Confirm Password"
            id="password_confirmation"
            name="password_confirmation"
            handleChange={onChange}
            text={user.password_confirmation}
            placeholder="Confirm password"
            type="password"
            order=""
          />
        </div>
        <div className='mb-4'>
          <label className="block font-semibold" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={(e) => onChange('role', e.target.value)}
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
          >
            <option value="">Select role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <Button classes="bg-blue-500" type="submit">{loading ? (id ? "Updating User ..." : "Adding User ...") : (id ? "Update User" : "Add User")}</Button>
      </form>
    </div>
  );
};

export default AddUserForm;
