// import React components
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

const ChainsTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [currentChain, setCurrentChain] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setName("");
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
      await api.post("/chains", { name });
      toast.success("Chaîne créée avec succès!");
      closeModal();
      fetchChains();
    } catch (error) {
      toast.error(
        `Erreur lors de la création de la chaîne: ${error.response.data.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/chains/${currentChain.id}`);
      toast.success("Chaîne supprimée avec succès!");
      closeDeleteModal();
      fetchChains();
    } catch (error) {
      toast.error(
        `Erreur lors de la suppression de la chaîne: ${error.response.data.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChains = async () => {
    setLoading(true);
    try {
      const response = await api.get("/chains");
      setData(response.data);
    } catch (error) {
      toast.error(
        `Erreur lors de la récupération des chaînes: ${error.response.data.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  return (
    <div className="ml-6 md:ml-[18.5%] pt-[7rem] mr-6 bg-white">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Chaînes</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Créer une Chaîne
        </button>
      </div>
      {loading ? (
        <div className="font-bold text-center">Chargement...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nom</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.id}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-red-500 hover:text-red-700 font-semibold"
                    onClick={() => openDeleteModal(item)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de création */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Créer une Chaîne"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Créer une Chaîne</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
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
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Supprimer la Chaîne"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Supprimer la Chaîne</h2>
          <p>
            Êtes-vous sûr de vouloir supprimer la chaîne{" "}
            <strong>{currentChain?.name}</strong>?
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={closeDeleteModal}
            >
              Annuler
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChainsTable;
