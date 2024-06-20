import React from 'react';

const UsersTables = ({title , data , header}) => {

  return (
    <div className='w-full h-full'>
      <h2 className='font-bold text-lg mb-2'>{title}</h2>
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            {header.map((h) => {
                return <th className='py-2 px-4 border-b text-left' key={h.key}>{h.name}</th>
            })}
          </tr>
        </thead>
        <tbody>
            {data.map((item) => (
                <tr key={item.key}>
                    <td className='py-2 px-4 border-b'>{item.name}</td>
                    <td className='py-2 px-4 border-b'>{item.email}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTables;
