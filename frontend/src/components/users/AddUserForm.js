import React, { useState } from 'react'
import Input from '../ui/Input'

const AddUserForm = () => {
  const [users, setUsers] = useState({
    name: '',
    description: '',
  })

  const onChange = (e, key) => {
    setUsers({
      ...users,
      [key]: e.target.value
    });
  };


  return (
    <div className='ml-[16.67%] my-10 mr-5  mx-auto '>
        <div className='mb-4'>
          <Input label="Description du produit" id="description" handleChange={(e) => onChange(e, 'description')} text={users.description} bigInput />
        </div>
    </div>
  )
}

export default AddUserForm
