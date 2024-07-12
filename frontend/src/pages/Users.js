// import custom components
import { useEffect, useState } from 'react';
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import UsersTable from '../components/users/UsersTable'
import { useNavigate } from 'react-router-dom';

// get the users screen
const Users = () => {
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
      {/* Users Table */}
      <UsersTable />
    </div>
  )
}

export default Users