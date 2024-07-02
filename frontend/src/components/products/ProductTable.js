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
      <div className='flex ml-0 md:ml-[16.67%] items-center justify-between pt-[6rem]'>
        <h4 className='text-[#4E4A4A] font-bold ml-7 '>Products</h4>
        <Link
          to='/addproducts'
          className='text-[#fff] font-bold flex items-center justify-center mr-7  bg-blue-400 h-[30px] w-[30px] rounded'
        >
          <i className='fa-solid fa-plus'></i>
        </Link>
      </div>
      <div className='ml-0 md:ml-[16.67%]'>
        <div className=' ml-7 mr-7 overflow-x-auto'>
          <table className='bg-slate-200 mt-5 '>
            <thead>
              <tr>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Modèle
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Photos
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Catégorie
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Client
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Quantité demandée
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Quantité reçue
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Qte Enterprise
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Prix M' OVR
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Devise
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Prix facture
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Date étude
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Cours devise étude
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Date import
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Cours devise import
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Date export
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Cons. Standard fil
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Conso. Standard Plastique
                </th>
                <th className='px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='18' className='text-center text-xl my-5'>
                    Loading ...
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className='bg-gray-50'>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.modele}
                    </td>
                    <td className='p-[1rem] min-w-[200px]'>
                      <img
                        src={`http://localhost:8000/storage/${product.photos}`}
                        alt={product.name}
                        className='h-[100px] w-[100px] mx-auto'
                      />
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.category}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.client}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.quantite_demandee}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.quantityReceived}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.qte_societe}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.prixMOver}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.devise}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.prixFacture}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.dateEtude}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.cours_devise_etude}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.dateImport}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.cours_devise_import}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.dateExport}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.consStandardFil}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      {product.consoStandardPlastique}
                    </td>
                    <td className='p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]'>
                      <Link to={`${product.id}`}>
                        <i className='fa-solid fa-pen text-yellow-400'></i>{' '}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductTables;
