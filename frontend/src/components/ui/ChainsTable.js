import React, { useState } from 'react';
import Modal from 'react-modal';

const ChainsTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState('');

  const data = [
    { id: 1, name: 'Chain 1' },
    { id: 2, name: 'Chain 2' },
    { id: 3, name: 'Chain 3' },
  ];

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Chain created:', name);
    // Handle form submission logic, such as sending the data to an API
    closeModal();
  };

  return (
    <div className="ml-[19%] pt-[7rem] p-3 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Chains</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Create
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className='text-left'>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ChainsTable;
