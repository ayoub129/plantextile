import React, { useState, useEffect } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
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
  const [loading , setLoading] = useState(false);
  const [products, setProducts] = useState({
    name: '',
    modele: '',
    description: '',
    category: '',
    photos: '',
    client: '',
    quantityRequested: '',
    quantityReceived: '',
    qteCasual: '',
    prixMOver: '',
    devise: '',
    prixFacture: '',
    dateEtude: '',
    coursDeviseEtude: '',
    dateImport: '',
    coursDeviseImport: '',
    dateExport: '',
    consStandardFil: '',
    consReelleFil: '',
    consoStandardPlastique: '',
    consReellePlastique: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      api.get(`/products/${id}`)
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [id]);


  const onChange = (e, key) => {
    setProducts({
      ...products,
      [key]: e.target.value
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
    const url = `https://api.centralbankofmorocco.ma/cours/Version0/api/CoursBBE?libDevise=${currency}&date=${date}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'Ocp-Apim-Subscription-Key': '1a669c806518432da8b3aa75cc462d29'
        }
      });
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
    if (products.devise && products.devise !== "MAD" && products.prixMOver && products.qteCasual) {
      fetchExchangeRates(products.devise).then(data => console.log(data));
    }
  }, [products.devise, products.prixMOver, products.qteCasual]);
  
  


  const handleSubmit = async (e) => {
    setLoading(true)
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
      }  else {
        formData.append(key, products[key]);
      }
    });

    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    
  

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, formData,  {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/products', formData ,  {
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
        setLoading(false)
    }
  };

  return (
    <div className='ml-[16.67%] my-10 mr-5  mx-auto '>
      <ToastContainer />
      <form className='ml-7' onSubmit={handleSubmit}>
        <h4 className='mb-5 text-[#4E4A4A] font-bold pt-7 text-xl'>Créer un produit</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Nom du produit" id="name" handleChange={(e) => onChange(e, 'name')} text={products.name} />
          </div>
          <div className='mb-4'>
            <Input label="Modèle" id="modele" handleChange={(e) => onChange(e, 'modele')} text={products.modele} />
          </div>
        </div>
        <div className='mb-4'>
          <Input label="Description du produit" id="description" handleChange={(e) => onChange(e, 'description')} text={products.description} bigInput />
        </div>
        <div className='mb-4'>
          <ImageInput label="Photos" handleFileChange={handleFileChange}  />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Catégorie" id="category" handleChange={(e) => onChange(e, 'category')} text={products.category} />
          </div>
          <div className='mb-4'>
            <Input label="Client" id="client" handleChange={(e) => onChange(e, 'client')} text={products.client} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Quantité demandée" id="quantityRequested" handleChange={(e) => onChange(e, 'quantityRequested')} text={products.quantityRequested} />
          </div>
          <div className='mb-4'>
            <Input label="Quantité reçue" id="quantityReceived" handleChange={(e) => onChange(e, 'quantityReceived')} text={products.quantityReceived} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Qte enterprise" id="qteCasual" handleChange={(e) => onChange(e, 'qteCasual')} text={products.qteCasual} />
          </div>
          <div className='mb-4 flex items-center '>
            <Input container={"w-[80%]"} label="Prix M' OVR" id="prixMOver" handleChange={(e) => onChange(e, 'prixMOver')} text={products.prixMOver} />
            <select className='w-[20%] mt-8' onChange={(e) => onChange(e, 'devise')} defaultValue="">
              <option value="" disabled>choisir devise</option>
              <option value="MAD">MAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Prix facture" id="prixFacture" handleChange={(e) => onChange(e, 'prixFacture')} text={products.prixFacture} />
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
            <Input label="Cours devise étude" id="coursDeviseEtude" handleChange={(e) => onChange(e, 'coursDeviseEtude')} text={products.coursDeviseEtude} />
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
            <Input label="Cours devise import" id="coursDeviseImport" handleChange={(e) => onChange(e, 'coursDeviseImport')} text={products.coursDeviseImport} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4 font-semibold'>
            <label className='block' htmlFor="dateExport">Date export</label>
            <DatePicker
              selected={products.dateExport ? new Date(products.dateExport) : null}
              onChange={(date) => handleDateChange(date, 'dateExport')}
              dateFormat="yyyy-MM-dd"
              className="w-full outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
          <div className='mb-4'>
            <Input label="Cons. Standard fil" id="consStandardFil" handleChange={(e) => onChange(e, 'consStandardFil')} text={products.consStandardFil} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='mb-4'>
            <Input label="Cons. reelle fil" id="consReelleFil" handleChange={(e) => onChange(e, 'consReelleFil')} text={products.consReelleFil} />
          </div>
          <div className='mb-4'>
            <Input label="Conso. Standard Plastique" id="consoStandardPlastique" handleChange={(e) => onChange(e, 'consoStandardPlastique')} text={products.consoStandardPlastique} />
          </div>
        </div>
        <div className='mb-4'>
          <Input label="Cons. reelle plastique" id="consReellePlastique" handleChange={(e) => onChange(e, 'consReellePlastique')} text={products.consReellePlastique} />
        </div>
        <Button container="mt-4" classes="bg-blue-500" handlePress={handleSubmit}>
         {loading ? "submitting ..." : isEdit ? "Modifie le produit" : "Créer le produit"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductForm;
