// import React components
import React, { useEffect, useState } from "react";
// import routers
import { Link, useNavigate } from "react-router-dom";
// import the API and the toast for error messages
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersTable = () => {
  // users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // get the current user's role from local storage and redirect if not authorized
  const currentUserRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const allowedRoles = ["admin", "superadmin", "developer", "RH"];
    if (!allowedRoles.includes(currentUserRole)) {
      navigate("/dashboard");
    }

    // fetch the users from the database
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des utilisateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserRole, navigate]);

  // handle Delete user
  const handleDelete = async () => {
    try {
      // delete a user from the database
      await api.delete(`/users/${userToDelete}`);
      setUsers(users.filter((user) => user.id !== userToDelete));
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="flex md:ml-[16.67%] items-center justify-between pt-[6rem]">
        <h4 className="text-[#4E4A4A] font-bold ml-7 ">Utilisateurs</h4>
        <Link
          to="/adduser"
          className="text-[#fff] font-bold flex items-center justify-center mr-7 bg-blue-400 h-[30px] w-[30px] rounded"
        >
          <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <div className="md:ml-[16.67%] overflow-x-auto">
        <table className="bg-slate-200 ml-7 mr-7 mt-5 w-[96%] shadow">
          <thead>
            <tr>
              <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Chargement...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="bg-gray-50">
                  <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold">
                    {user.name}
                  </td>
                  <td className="p-[1rem]">
                    <img
                      src={`${
                        user.image
                          ? "http://localhost:8000" + user.image
                          : "https://via.placeholder.com/40"
                      }`}
                      alt={user.name}
                      className="h-[100px] w-[100px] mx-auto"
                    />
                  </td>
                  <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold">
                    {user.email}
                  </td>
                  <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold">
                    {user.role}
                  </td>
                  <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold flex justify-center items-center gap-2">
                    <Link to={`/users/${user.id}`}>
                      <i className="fa-solid fa-pen text-yellow-400"></i>
                    </Link>
                    {["HR", "superadmin", "admin", "developer"].includes(
                      currentUserRole
                    ) && (
                      <button
                        onClick={() => {
                          setUserToDelete(user.id);
                          setShowModal(true);
                        }}
                      >
                        <i className="fa-solid fa-trash text-red-500"></i>
                      </button>
                    )}
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
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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
  );
};

export default UsersTable;
