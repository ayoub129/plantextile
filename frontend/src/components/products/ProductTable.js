import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductTables = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/models');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className='flex ml-[16.67%] items-center justify-between pt-[6rem]'>
        <h4 className='text-[#4E4A4A] font-bold ml-7 '>Products</h4>
        <Link to="/addproducts" className='text-[#fff] font-bold flex items-center justify-center mr-7  bg-blue-400 h-[30px] w-[30px] rounded'>
          <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <div className='ml-[16.67%] overflow-x-auto'>
        <table className="bg-slate-200 ml-7 mr-7 mt-5 ">
          <thead>
            <tr>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Modèle</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Photos</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Catégorie</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Client</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Quantité demandée</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Quantité reçue</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Qte Enterprise</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Prix M' OVR</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Devise</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Prix facture</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Date étude</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Cours devise étude</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Date import</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Cours devise import</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Date export</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Cons. Standard fil</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Cons. reelle fil</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Conso. Standard Plastique</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Cons. reelle plastique</th>
              <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <p className='text-center text-xl my-5'>Loading ...</p> : products.map((product) => (
              <tr key={product.id} className="bg-gray-50">
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.modele}</td>
                <td className='p-[1rem]'>
                  <img src={`http://localhost:8000/storage/${product.photos}`} alt={product.name} className='h-[100px] w-[100px] mx-auto' />
                </td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.category}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.client}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.quantityRequested}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.quantityReceived}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.qteCasual}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.prixMOver}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.devise}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.prixFacture}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.dateEtude}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.coursDeviseEtude}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.dateImport}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.coursDeviseImport}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.dateExport}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.consStandardFil}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.consReelleFil}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.consoStandardPlastique}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>{product.consReellePlastique}</td>
                <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold'>
                    <Link to={`${product.id}`}><i className='fa-solid fa-pen text-yellow-400'></i> </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTables;
