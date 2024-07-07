import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import my custom components
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import AddUserForm from '../components/users/AddUserForm'

// add user
const AddUser = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // redirect to home if not logged in
    if (!token) {
      navigate('/');
    } else {
      // Check for the role
      const allowedRoles = ['admin', 'superadmin', 'developer' , 'HR'];
      if (!allowedRoles.includes(role)) {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return (
    <div>
      {/* header */}
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      {/* sidebar */}
      <Sidebar sidebar={sidebar} />
      {/* Add User Form */}
      <AddUserForm />
    </div>
  )
}

export default AddUser
