import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import ImageInput from '../ui/ImageInput';
import Button from '../ui/Button';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({
    modele: '',
    category: '',
    photos: '',
    description: '',
    client: '',
    quantite_demandee: '',
    quantityReceived: '',
    qte_societe: '',
    prixMOver: '',
    devise: '',
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

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      api.get(`/models/${id}`)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [id]);

  const onChange = (name, value) => {
    setProducts({
      ...products,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setProducts({
      ...products,
      photos: e.target.files[0]
    });
  };

  const handleDateChange = (date, key) => {
    setProducts({
      ...products,
      [key]: date
    });
  };

  const fetchExchangeRates = async (currency = 'USD', date = new Date().toISOString().slice(0, 10)) => {
    const url = `https://v6.exchangerate-api.com/v6/44567619eec22c4875e3a8c0/latest/${currency}`;

    try {
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
    if (products.devise && products.devise !== "MAD" && products.prixMOver && products.qte_societe) {
      fetchExchangeRates(products.devise).then(data => console.log(data));
    }
  }, [products.devise, products.prixMOver, products.qte_societe]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    Object.keys(products).forEach(key => {
      if (products[key] instanceof Date) {
        formData.append(key, products[key].toISOString().split('T')[0]); // Format date as 'YYYY-MM-DD'
      } else if (products[key] && typeof products[key] === 'object' && 'toISOString' in products[key]) {
        formData.append(key, products[key].toISOString().split('T')[0]);
      } else if (key === 'photos' && products[key]) {
        if (products.photos instanceof File) {
          formData.append('photos', products.photos);
        }
      } else {
        formData.append(key, products[key]);
      }
    });

    try {
      if (isEdit) {
        await api.put(`/models/${id}`, formData, {
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
      navigate("/products")
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product.');
    } finally {
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
          <ImageInput label="Photos" handleFileChange={handleFileChange} />
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
            <Input type='number' label="Prix facture" id="prixFacture" name={'prixFacture'} handleChange={(name, value) => onChange(name, value)} text={products.prixFacture} />
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
