import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrimTable = () => {
  const [primes, setPrimes] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [primeToDelete, setPrimeToDelete] = useState(null);
  const [primeToUpdate, setPrimeToUpdate] = useState(null);
  const [newPrime, setNewPrime] = useState({ model_id: "", amount: "" });
  const [updatePrime, setUpdatePrime] = useState({ amount: "" });

  const role = localStorage.getItem("role");
  const allowedRoles = ["admin", "superadmin", "developer", "Méthode"];

  useEffect(() => {
    const fetchPrimes = async () => {
      setLoading(true);
      try {
        const response = await api.get("/primes");
        setPrimes(response.data);
      } catch (error) {
        toast.error("Error fetching primes.");
      } finally {
        setLoading(false);
      }
    };

    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
      } catch (error) {
        toast.error("Error fetching models.");
      }
    };

    fetchPrimes();
    fetchModels();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await api.post("/primes", newPrime);
      setPrimes([...primes, response.data]);
      toast.success("Prime created successfully");
      setShowModal(false);
      setNewPrime({ model_id: "", amount: "" });
    } catch (error) {
      toast.error("Error creating prime.");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.post(
        `/primes/${primeToUpdate.id}`,
        updatePrime
      );
      setPrimes(
        primes.map((prime) =>
          prime.id === primeToUpdate.id ? response.data : prime
        )
      );
      toast.success("Prime updated successfully");
      setShowUpdateModal(false);
      setUpdatePrime({ amount: "" });
      setPrimeToUpdate(null);
    } catch (error) {
      toast.error("Error updating prime.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/primes/${primeToDelete}`);
      setPrimes(primes.filter((prime) => prime.id !== primeToDelete));
      toast.success("Prime deleted successfully");
      setShowDeleteModal(false);
      setPrimeToDelete(null);
    } catch (error) {
      toast.error("Error deleting prime.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex ml-0 md:ml-[16.67%] items-center justify-between pt-[6rem]">
        <h4 className="text-[#4E4A4A] font-bold ml-7 ">Primes</h4>
        {allowedRoles.includes(role) ? (
          <button
            onClick={() => setShowModal(true)}
            className="text-[#fff] font-bold flex items-center justify-center mr-7 bg-blue-400 h-[30px] w-[30px] rounded"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="ml-0 md:ml-[16.67%]">
        <div className="ml-7 mr-7 overflow-x-auto">
          <table className="bg-slate-200 mt-5 w-full">
            <thead>
              <tr>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Modèle
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Image
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Amount
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center text-xl my-5">
                    Loading ...
                  </td>
                </tr>
              ) : (
                primes.map((prime) => (
                  <tr key={prime.id} className="bg-gray-50">
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {prime.model.modele}
                    </td>
                    <td className="p-[1rem] min-w-[200px]">
                      <img
                        src={`http://localhost:8000${prime.model.image}`}
                        alt={prime.model.modele}
                        className="h-[100px] w-[100px] mx-auto"
                      />
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {prime.amount}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      <button
                        onClick={() => {
                          setPrimeToUpdate(prime);
                          setUpdatePrime({ amount: prime.amount });
                          setShowUpdateModal(true);
                        }}
                        className="mr-2 text-yellow-400"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      {allowedRoles.includes(role) && (
                        <button
                          onClick={() => {
                            setPrimeToDelete(prime.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-500"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Create Prime</h2>
            <div className="mb-4">
              <label className="block mb-2">Model</label>
              <select
                className="w-full border p-2"
                value={newPrime.model_id}
                onChange={(e) =>
                  setNewPrime({ ...newPrime, model_id: e.target.value })
                }
              >
                <option value="">Select a Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.modele}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Amount</label>
              <input
                type="number"
                className="w-full border p-2"
                value={newPrime.amount}
                onChange={(e) =>
                  setNewPrime({ ...newPrime, amount: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Update Prime</h2>
            <div className="mb-4">
              <label className="block mb-2">Amount</label>
              <input
                type="number"
                className="w-full border p-2"
                value={updatePrime.amount}
                onChange={(e) =>
                  setUpdatePrime({ ...updatePrime, amount: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this prime?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrimTable;
