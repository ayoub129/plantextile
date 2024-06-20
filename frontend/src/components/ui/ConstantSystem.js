import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ConstantSystem = () => {
  const [constants, setConstants] = useState([]);

  useEffect(() => {
    api.get('/system_constants')
      .then(response => {
        setConstants(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className=" ml-[18%] pt-24">
      <h1 className="text-2xl font-bold mb-4">System Constants</h1>
      <ul className="list-disc pl-5">
        {constants.map((constant) => (
          <li key={constant.id} className="mb-2">
            <Link to={`/update-constant/${constant.id}`} className="text-blue-500 hover:underline">
              {constant.id} - {constant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConstantSystem;
