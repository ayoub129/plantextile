// Importer les composants React et certains routeurs
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Importer l'API et Toast
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductTables = () => {
  // États des produits et du chargement
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // Afficher et masquer la modal
  const [showModal, setShowModal] = useState(false);
  // Choisir un produit à supprimer
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    // Récupérer les produits depuis le backend
    const fetchProducts = async () => {
      // Définir l'état de chargement à vrai
      setLoading(true);
      try {
        // Obtenir les produits ou les modèles depuis le backend
        const response = await api.get("/models");
        setProducts(response.data);
      } catch (error) {
        // Afficher un message d'erreur
        toast.error("Erreur lors de la récupération des produits.", error);
      } finally {
        // Définir l'état de chargement à faux
        setLoading(false);
      }
    };
    // Appeler la fonction fetchProducts
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      // Supprimer un produit de la base de données
      await api.delete(`/models/${productToDelete}`);
      setProducts(products.filter((product) => product.id !== productToDelete));
      toast.success("Modèle supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du modèle.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex ml-0 md:ml-[16.67%] items-center justify-between pt-[6rem]">
        <h4 className="text-[#4E4A4A] font-bold ml-7 ">Produits</h4>
        <Link
          to="/addproducts"
          className="text-[#fff] font-bold flex items-center justify-center mr-7  bg-blue-400 h-[30px] w-[30px] rounded"
        >
          <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <div className="ml-0 md:ml-[16.67%]">
        <div className=" ml-7 mr-7 overflow-x-auto">
          <table className="bg-slate-200 mt-5 ">
            <thead>
              <tr>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Modèle
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Photos
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Catégorie
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Client
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Quantité demandée
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Quantité reçue
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Quantité entreprise
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Prix M' OVR
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Devise
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Prix facture
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Date étude
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Cours devise étude
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Date import
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Cours devise import
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Date export
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="18" className="text-center text-xl my-5">
                    Chargement ...
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="bg-gray-50">
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.modele}
                    </td>
                    <td className="p-[1rem] min-w-[200px]">
                      <img
                        src={`http://localhost:8000${product.image}`}
                        alt={product.name}
                        className="h-[100px] w-[100px] mx-auto"
                      />
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.category}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.client}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.quantite_demandee}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.quantityReceived}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.qte_societe}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.prixMOver}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.devise}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.prixFacture}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.dateEtude}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {parseInt(product.cours_devise_etude).toFixed(2)}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.dateImport}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {parseInt(product.cours_devise_import).toFixed(2)}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {product.dateExport}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      <Link to={`${product.id}`}>
                        <i className="fa-solid fa-pen text-yellow-400"></i>{" "}
                      </Link>
                      <button
                        onClick={() => {
                          setProductToDelete(product.id);
                          setShowModal(true);
                        }}
                      >
                        <i className="fa-solid fa-trash text-red-500"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg">
              <h2 className="text-xl mb-4">Confirmer la suppression</h2>
              <p className="mb-4">
                Êtes-vous sûr de vouloir supprimer ce modèle ?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductTables;
