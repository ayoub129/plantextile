import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Button from './Button';
import Input from './Input';

const AddConstantSystem = () => {
  const [formData, setFormData] = useState({
    Nombre_d_heures_par_jour: '',
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
    Production: '',
    Repassage_final: '',
    Contrôle_final: '',
    Magasin_final: '',
    Magasin_fournitures: '',
    Achats_Logistique: '',
    Transit: '',
    Comptabilité_Finances: '',
    RH: '',
    Ménage: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };


  useEffect(() => {
    api.get(`/system_constants_latest`)
      .then(response => {
        if (response.data) {
          console.log(response.data)
          const { id, created_at, updated_at, ...filteredData } = response.data;
          setFormData(filteredData);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetching
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const { id, created_at, updated_at, ...dataToSubmit } = formData;
    
    api.post('/system_constants', dataToSubmit)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setSaving(false); 
      });
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <form className='ml-[18.5%] mr-5 mx-auto pt-[6rem]' onSubmit={handleSubmit}>
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
        <Button handlePress={handleSubmit} classes="bg-blue-500">
          {saving ? 'Saving...' : 'Save Constant'}
        </Button>
      </div>
    </form>
  );
};

export default AddConstantSystem;