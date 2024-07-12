// Import React components and Routers from React
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import Custom components
import Input from '../ui/Input';
import ImageInput from '../ui/ImageInput';
import Button from '../ui/Button';
// import API and toasts 
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import DatePicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddProductForm = () => {
  // handle navigation and get the id parameter
  const navigate = useNavigate();
  const { id } = useParams();
  // handle loading, product and isEditable states  
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({
    modele: '',
    category: '',
    image: '',
    description: '',
    client: '',
    quantite_demandee: '',
    quantityReceived: '',
    qte_societe: '',
    prixMOver: '',
    devise: 'MAD',
    prixFacture: '',
    dateEtude: '',
    cours_devise_etude: '',
    dateImport: '',
    cours_devise_import: '',
    dateExport: '',
    consStandardFil: '',
    consoStandardPlastique: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  // handle conversion rates
  const [conversionRate, setConversionRate] = useState(1);

  useEffect(() => {
    const updateModel = async () => {
      // if the id exist then edit 
      if (id) {
        // set isEdit to true and get a single model
        try {
          setIsEdit(true);
          const response = await api.get(`/models/${id}`);
          setProducts(response.data);
        } catch (error) {
          toast.error('Error fetching product:', error);          
        }
      }
    };

    updateModel();
  }, [id]);

  // handle change of the input field
  const onChange = (name, value) => {
    setProducts({
      ...products,
      [name]: value
    });
  };

  // handle file change event for the image input field
  const handleFileChange = (e) => {
    setProducts({
      ...products,
      image: e.target.files[0]
    });
  };

  // handle date change event for the date fields
  const handleDateChange = (date, key) => {
    setProducts({
      ...products,
      [key]: date
    });
  };

  // fetch exchange rates for the currency selected now 
  const fetchExchangeRates = async (currency = 'USD') => {
    // url to the exchange rates api endpoint
    const url = `https://v6.exchangerate-api.com/v6/6610059cf4c8cb5955adc828/latest/${currency}`;

    try {
      // get the exchange rates and return it
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    }
  };

  useEffect(() => {
    // check if product devise is available and not equal to MAD also the price and quantity society is available
    if (products.devise && products.devise !== "MAD" && products.prixMOver && products.qte_societe) {
      fetchExchangeRates(products.devise).then(data => {
        setConversionRate(data.conversion_rates.MAD); // Set conversion rate state
      });
    }
  }, [products.devise, products.prixMOver, products.qte_societe]);

  useEffect(() => {
    // calculate the prix facture if conversionRate is available
    if ( products.prixMOver && products.qte_societe) {
      const prixFacture = products.prixMOver * conversionRate * products.qte_societe;
      // assign the prix facture 
      setProducts(prevProducts => ({ ...prevProducts, prixFacture }));
    }
  }, [conversionRate, products.prixMOver, products.qte_societe]);

  // create or update product
  const handleSubmit = async (e) => {
    // start loading state while saving the product
    setLoading(true);
    e.preventDefault();

    // create FormData to send as request body with file data if exist
    const formData = new FormData();
    Object.keys(products).forEach(key => {
      if (products[key] instanceof Date) {
        // Format date as 'YYYY-MM-DD'
        formData.append(key, products[key].toISOString().split('T')[0]); 
      } else if (products[key] && typeof products[key] === 'object' && 'toISOString' in products[key]) {
        // Format date as 'YYYY-MM-DD'
        formData.append(key, products[key].toISOString().split('T')[0]);
      } else if (key === 'image' && products[key]) {
        // append an image to the backend
        if (products.image instanceof File) {
          formData.append('image', products.image);
        }
      } else {
        // append any other text
        formData.append(key, products[key]);
      }
    });

    try {
      // check if edited then update if not then create a new model and after that navigate to the products page
      if (isEdit) {
        await api.post(`/models/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/models', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate("/products");
    } catch (error) {
      // show error message
      toast.error('Error saving product.');
    } finally {
      // set the loading to false
      setLoading(false);
    }
  };

  return (
    <div className='ml-0 md:ml-[16.67%] pt-[5rem] mr-5  mx-auto '>
      <ToastContainer />
      <form className='ml-7' onSubmit={handleSubmit}>
        <h4 className='mb-5 text-[#4E4A4A] font-bold pt-7 text-xl'>Créer un produit</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Modèle" id="modele" name={'modele'} handleChange={(name, value) => onChange(name, value)} text={products.modele} />
          </div>
          <div className='mb-4'>
            <Input label="Catégorie" id="category" name={'category'} handleChange={(name, value) => onChange(name, value)} text={products.category} />
          </div>
        </div>
        <div className='mb-4'>
          <ImageInput label="image" handleFileChange={handleFileChange} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Client" id="client" name={'client'} handleChange={(name, value) => onChange(name, value)} text={products.client} />
          </div>
          <div className='mb-4'>
            <Input type='number' label="Quantité demandée" id="quantite_demandee" name={'quantite_demandee'} handleChange={(name, value) => onChange(name, value)} text={products.quantite_demandee} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input type='number' label="Quantité reçue" id="quantityReceived" name={'quantityReceived'} handleChange={(name, value) => onChange(name, value)} text={products.quantityReceived} />
          </div>
          <div className='mb-4'>
            <Input type='number' label="Qte enterprise" id="qte_societe" name={'qte_societe'} handleChange={(name, value) => onChange(name, value)} text={products.qte_societe} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4 flex items-center '>
            <Input container={"w-[80%]"} type='number' label="Prix M' OVR" id="prixMOver" name={'prixMOver'} handleChange={(name, value) => onChange(name, value)} text={products.prixMOver} />
            <select className='w-[20%] mt-8' name='devise' onChange={(e) => onChange('devise', e.target.value)} defaultValue="">
              <option value="" disabled>choisir devise</option>
              <option value="MAD">MAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className='mb-4'>
            <Input type='number' disabled={true} label="Prix facture" id="prixFacture" name={'prixFacture'} handleChange={(name, value) => onChange(name, value)} text={products.prixFacture} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4 font-semibold'>
            <label className='block ' htmlFor="dateEtude">Date étude</label>
            <DatePicker
              selected={products.dateEtude ? new Date(products.dateEtude) : null}
              onChange={(date) => handleDateChange(date, 'dateEtude')}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
          <div className='mb-4'>
            <Input type='number' label="Cours devise étude" id="coursDeviseEtude" name={"cours_devise_etude"} handleChange={(name, value) => onChange(name, value)} text={products.cours_devise_etude} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4 font-semibold'>
            <label className='block' htmlFor="dateImport">Date import</label>
            <DatePicker
              selected={products.dateImport ? new Date(products.dateImport) : null}
              onChange={(date) => handleDateChange(date, 'dateImport')}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
          <div className='mb-4'>
            <Input type='number' label="Cours devise import" id="coursDeviseImport" name={"cours_devise_import"} handleChange={(name, value) => onChange(name, value)} text={products.cours_devise_import} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4 font-semibold'>
            <label className='block' htmlFor="dateExport">Date export</label>
            <DatePicker
              selected={products.dateExport ? new Date(products.dateExport) : null}
              onChange={(date) => handleDateChange(date, 'dateExport')}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
          <div className='mb-4'>
            <Input type='number' label="Cons. standard fil" id="consStandardFil" name={"consStandardFil"} handleChange={(name, value) => onChange(name, value)} text={products.consStandardFil} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input type='number' label="Cons. standard plastique" id="consoStandardPlastique" name={"consoStandardPlastique"} handleChange={(name, value) => onChange(name, value)} text={products.consoStandardPlastique} />
          </div>
        </div>
        <Button type='submit' classes={'bg-blue-400	mb-5'}>{loading ? "creating ..." : isEdit ? 'Update Product' : 'Add Product'}</Button>
      </form>
    </div>
  );
};

export default AddProductForm;