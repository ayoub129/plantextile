import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast , ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ChainsTable = () => {
  const role = localStorage.getItem('role');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [currentChain, setCurrentChain] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const openModal = () => {
    setName('');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openDeleteModal = (chain) => {
    setCurrentChain(chain);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/chains', { name });
      toast.success('Chain created successfully!');
      closeModal();
      fetchChains();
    } catch (error) {
      toast.error(`Error creating chain: ${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/chains/${currentChain.id}`);
      toast.success('Chain deleted successfully!');
      closeDeleteModal();
      fetchChains();
    } catch (error) {
      toast.error(`Error deleting chain: ${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchChains = async () => {
    setLoading(true);
    try {
      const response = await api.get('/chains');
      setData(response.data);
    } catch (error) {
      toast.error(`Error fetching chains: ${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const allowedRoles = ['admin', 'superadmin', 'developer', 'HR'];
    if (!allowedRoles.includes(role)) {
      navigate('/dashboard');
    }

    fetchChains();
  }, [navigate , role]);

  return (
    <div className="ml-6 md:ml-[18.5%] pt-[7rem] mr-6 bg-white">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Chains</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Create Chain
        </button>
      </div>
      {loading ? (
        <div className='font-bold text-center'>Loading...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className='text-left'>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.id}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className='py-2 px-4 border-b'>
                  {["HR", "superadmin", "admin", "developer"].includes(role) && (
                    <>
                      <button
                        className="text-red-500 hover:text-red-700 font-semibold"
                        onClick={() => openDeleteModal(item)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Chain"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Create Chain</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Chain"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Delete Chain</h2>
          <p>Are you sure you want to delete the chain <strong>{currentChain?.name}</strong>?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ChainsTable;
