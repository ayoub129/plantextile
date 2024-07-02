import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import Input from './Input';
import Button from './Button';

const PostForm = ({ postId, onPostSaved }) => {
  const [data, setData] = useState({
    logistique: '',
    la_coupe: '',
    production: '',
    repassage: '',
    control_final: '',
    depot: ''
  });

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${postId}`);
          setData(response.data);
        } catch (error) {
          console.error('Error fetching post:', error);
          toast.error('Error fetching post.');
        }
      };

      fetchPost();
    }
  }, [postId]);

  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (postId) {
        await api.put(`/posts/${postId}`, data);
      } else {
        await api.post('/posts', data);
      }

      toast.success('Post saved successfully.');
      onPostSaved();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Error saving post.');
    }
  };

  return (
    <div className='ml-[16.66%] mr-5 pt-[6rem]'>
      <ToastContainer />
      <form className='ml-7' onSubmit={handleSubmit}>
        <Input
          container="mb-4"
          label="Logistique"
          type='text'
          name="logistique"
          text={data.logistique}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="La Coupe"
          type='text'
          name="la_coupe"
          text={data.la_coupe}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Production"
          type='text'
          name="production"
          text={data.production}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Repassage"
          type='text'
          name="repassage"
          text={data.repassage}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Control Final"
          type='text'
          name="control_final"
          text={data.control_final}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Depot"
          type='text'
          name="depot"
          text={data.depot}
          handleChange={onChange}
        />

        <Button classes="bg-blue-500 my-5 mb-8">Save Post</Button>
      </form>
    </div>
  );
}

export default PostForm;
