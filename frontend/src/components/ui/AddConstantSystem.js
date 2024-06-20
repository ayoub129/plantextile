import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Button from './Button';
import { useParams } from 'react-router-dom'
import Input from './Input';

const AddConstantSystem = () => {
  const { id } = useParams()

  const [formData, setFormData] = useState({
    Nombre_d_heures_par_jour : '',
    Taux_horaire_SMIG_16_29: '',
    Taux_horaire_17_00: '',
    Taux_horaire_17_50: '',
    Masse_salariale_16_29: '',
    Masse_salariale_17_00: '',
    Masse_salariale_17_50: '',
    Capacité_par_unité_transport: '',
    cotisation_entroprise_trans: '',
    Total_prime_par_modèle: '',
    Coût_par_trajet: '',
    Coût_énergie_journalier: '',
    Coût_charges_fixes_journalier: '',
    Coupe: '',
    Production : '',
    Repassage_final : '',
    Contrôle_final : '',
    Magasin_final: '',
    Magasin_fournitures: '',
    Achats_Logistique: '',
    Transit: '',
    Comptabilité_Finances: '',
    RH : '',
    Ménage : ''   
  });

  const handleChange = (name , value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    if(id != null) {

      api.get(`/system_constants/${id}`)
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [id]);


  const handleSubmit = (e) => {
    e.preventDefault();

    if(id != null) {
        api.put(`/system_constants/${id}`, formData)
         .then(response => {
            console.log(response.data);
          })
         .catch(error => {
            console.error(error);
          });
    } else {
        api.post('/system_constants', formData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }
  };

  return (
    <form className='ml-[18.5%] mr-5 mx-auto pt-[6rem]'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {Object.keys(formData).map((key) => (
          <Input
            key={key}
            id={key}
            name={key}
            label={key.replace(/_/g, ' ')}
            text={formData[key]}
            handleChange={handleChange}
            type="number"
          />
        ))}
      </div>
      <div className="mt-4">
        <Button handlePress={handleSubmit} classes="bg-blue-500">Save Constant</Button>
      </div>
    </form>
  );
};

export default AddConstantSystem;