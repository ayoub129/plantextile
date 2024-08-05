import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

const AdminAccept = () => {
  const [sidebar, setSidebar] = useState(false);
  const [productPlan, setProductPlan] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/');
    } else {
      const allowedRoles = ['admin', 'superadmin', 'developer', 'RH'];
      if (!allowedRoles.includes(role)) {
        navigate('/dashboard');
      }
    }

    const fetchData = async () => {
      try {
        const response = await api.get('/product_plans_admin');
        const model = await api.get(`/models/${response.data.model_id}`)

        setModel(model.data);
        setProductPlan(response.data);
      } catch (error) {
        toast.error('Failed to fetch data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAction = async (action) => {
    setAction(action)
    setLoading(true);
    try {
      await api.post('/product_plans_admin', { 
        action,
        id: productPlan.id 
      });

      toast.success('Action successfully recorded');
    } catch (error) {
      toast.error('Failed to perform action');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      <div>
        <Sidebar sidebar={sidebar} />
      </div>
      <div className="ml-6 md:ml-[18.5%] pt-[7rem] mr-6 bg-white">
        {loading ? (
          <div className="font-bold text-center">Chargement...</div>
        ) : (
          productPlan && (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="py-2 px-4 border-b">Taux</th>
                  <th className="py-2 px-4 border-b">Model</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">{productPlan.taux}</td>
                  <td className="py-2 px-4 border-b">{model.modele}</td>
                  <td className="py-2 px-4 border-b">
                    {(productPlan.status === 'accepted' || action === 'accepted') ? (
                      <span className="text-green-500 font-bold">Accepted</span>
                    ) : (productPlan.status === 'refused' || action === 'refused') ? (
                      <span className="text-red-500 font-bold">Refused</span>
                    ) : (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleAction('accept')}
                        >
                          Accepter
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                          onClick={() => handleAction('refuse')}
                        >
                          Refuser
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default AdminAccept;