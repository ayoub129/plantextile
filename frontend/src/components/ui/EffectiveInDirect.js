import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EffectiveIndirect = () => {
  const [data, setData] = useState({
    chain: '',
    modele: '',
    mag_four: '',
    mag_fin: '',
    machines_sp_manuelle: '',
    cont_fin: '',
    mach_retouche: '',
    repassage: '',
    gabaret: '',
    preparation_stagieres: '',
    preparation: '',
    preparation_elastique: '',
    matlasseurs: '',
    coupeurs: '',
    tiquitage: '',
    vesline: ''
  });
  const [chains, setChains] = useState(['Chain1', 'Chain2', 'Chain3']);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/models');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Error fetching models.');
      }
    };

    fetchModels();
  }, []);

  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const effectiveIndirectData = {
      chain: data.chain,
      modele: data.modele,
      mag_four: data.mag_four,
      mag_fin: data.mag_fin,
      machines_sp_manuelle: data.machines_sp_manuelle,
      cont_fin: data.cont_fin,
      mach_retouche: data.mach_retouche,
      repassage: data.repassage,
      gabaret: data.gabaret,
      preparation_stagieres: data.preparation_stagieres,
      preparation: data.preparation,
      preparation_elastique: data.preparation_elastique
    };

    try {
      const response = await api.post('/effectif_indirects', effectiveIndirectData);
      const effectifIndirectId = response.data.id;

      const coupeData = {
        effectif_indirect_id: effectifIndirectId,
        matlasseurs: data.matlasseurs,
        coupeurs: data.coupeurs,
        tiquitage: data.tiquitage,
        vesline: data.vesline
      };

      await api.post('/coupes', coupeData);
      toast.success('Data saved successfully.');
      setData({
        chain: '',
        modele: '',
        mag_four: '',
        mag_fin: '',
        machines_sp_manuelle: '',
        cont_fin: '',
        mach_retouche: '',
        repassage: '',
        gabaret: '',
        preparation_stagieres: '',
        preparation: '',
        preparation_elastique: '',
        matlasseurs: '',
        coupeurs: '',
        tiquitage: '',
        vesline: ''
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving data.');
    }
  };

  return (
    <div className='ml-[16.66%] mr-5 pt-[6rem]'>
      <ToastContainer />
      <form className='ml-7' onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Chain</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.chain}
            onChange={(e) => onChange('chain', e.target.value)}
          >
            <option value="">Select Chain</option>
            {chains.map((chain, index) => (
              <option key={index} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Model</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.modele}
            onChange={(e) => onChange('modele', e.target.value)}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.modele}>
                {model.modele}
              </option>
            ))}
          </select>
        </div>

        <Input
          container="mb-4"
          label="Mag Four"
          type='number'
          name="mag_four"
          text={data.mag_four}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Mag Fin"
          type='number'
          name="mag_fin"
          text={data.mag_fin}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Machines Sp Manuelle"
          type='number'
          name="machines_sp_manuelle"
          text={data.machines_sp_manuelle}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Cont Fin"
          type='number'
          name="cont_fin"
          text={data.cont_fin}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Mach Retouche"
          type='number'
          name="mach_retouche"
          text={data.mach_retouche}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Repassage"
          type='number'
          name="repassage"
          text={data.repassage}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Gabaret"
          type='number'
          name="gabaret"
          text={data.gabaret}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Preparation Stagieres"
          type='number'
          name="preparation_stagieres"
          text={data.preparation_stagieres}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Preparation"
          type='number'
          name="preparation"
          text={data.preparation}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Preparation Elastique"
          type='number'
          name="preparation_elastique"
          text={data.preparation_elastique}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Matlasseurs"
          type='number'
          name="matlasseurs"
          text={data.matlasseurs}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Coupeurs"
          type='number'
          name="coupeurs"
          text={data.coupeurs}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Tiquitage"
          type='number'
          name="tiquitage"
          text={data.tiquitage}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Vesline"
          type='number'
          name="vesline"
          text={data.vesline}
          handleChange={onChange}
        />

        <Button classes="bg-blue-500 my-5 mb-8">Save Effective Indirect</Button>
      </form>
    </div>
  );
}

export default EffectiveIndirect;
