// Importer les composants React et les routeurs de React
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Importer des composants personnalisés
import Input from "../ui/Input";
import ImageInput from "../ui/ImageInput";
import Button from "../ui/Button";
// Importer l'API et les toasts
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Importer DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddProductForm = () => {
  // Gérer la navigation et obtenir le paramètre id
  const navigate = useNavigate();
  const { id } = useParams();
  // Gérer les états de chargement, de produit et d'édition
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({
    modele: "",
    category: "",
    image: "",
    description: "",
    client: "",
    quantite_demandee: "",
    quantityReceived: "",
    qte_societe: "",
    prixMOver: "",
    devise: "MAD",
    prixFacture: "",
    dateEtude: "",
    cours_devise_etude: "",
    dateImport: "",
    cours_devise_import: "",
    dateExport: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  // Gérer les taux de conversion
  const [conversionRate, setConversionRate] = useState(1);

  useEffect(() => {
    const updateModel = async () => {
      // Si l'identifiant existe, alors modifier
      if (id) {
        // Définir isEdit à true et obtenir un seul modèle
        try {
          setIsEdit(true);
          const response = await api.get(`/models/${id}`);
          setProducts(response.data);
        } catch (error) {
          toast.error("Erreur lors de la récupération du produit :", error);
        }
      }
    };

    updateModel();
  }, [id]);

  // Gérer les modifications du champ de saisie
  const onChange = (name, value) => {
    setProducts({
      ...products,
      [name]: value,
    });
  };

  // Gérer l'événement de changement de fichier pour le champ de saisie d'image
  const handleFileChange = (e) => {
    setProducts({
      ...products,
      image: e.target.files[0],
    });
  };

  // Gérer l'événement de changement de date pour les champs de date
  const handleDateChange = (date, key) => {
    setProducts({
      ...products,
      [key]: date,
    });
  };

  // Récupérer les taux de change pour la devise sélectionnée
  const fetchExchangeRates = async (currency = "USD") => {
    // URL de l'API des taux de change
    const url = `https://v6.exchangerate-api.com/v6/6610059cf4c8cb5955adc828/latest/${currency}`;

    try {
      // Obtenir les taux de change et les retourner
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Statut HTTP ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Échec de la récupération des taux de change :", error);
    }
  };

  useEffect(() => {
    // Vérifier si la devise du produit est disponible et différente de MAD, et si le prix et la quantité de l'entreprise sont disponibles
    if (
      products.devise &&
      products.devise !== "MAD" &&
      products.prixMOver &&
      products.qte_societe
    ) {
      fetchExchangeRates(products.devise).then((data) => {
        setConversionRate(data.conversion_rates.MAD); // Définir l'état du taux de conversion
      });
    }
  }, [products.devise, products.prixMOver, products.qte_societe]);

  useEffect(() => {
    // Calculer le prix facture si le taux de conversion est disponible
    if (products.prixMOver && products.qte_societe) {
      const prixFacture =
        products.prixMOver * conversionRate * products.qte_societe;
      // Assigner le prix facture
      setProducts((prevProducts) => ({ ...prevProducts, prixFacture }));
    }
  }, [conversionRate, products.prixMOver, products.qte_societe]);

  // Créer ou mettre à jour un produit
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    Object.keys(products).forEach((key) => {
      if (products[key] instanceof Date) {
        const localDate = new Date(
          products[key].getTime() - products[key].getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        formData.append(key, localDate);
      } else if (
        products[key] &&
        typeof products[key] === "object" &&
        "toISOString" in products[key]
      ) {
        const localDate = new Date(
          products[key].getTime() - products[key].getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        formData.append(key, localDate);
      } else if (key === "image" && products[key]) {
        if (products.image instanceof File) {
          formData.append("image", products.image);
        }
      } else {
        formData.append(key, products[key]);
      }
    });

    try {
      if (isEdit) {
        await api.post(`/models/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/models", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/products");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-0 md:ml-[16.67%] pt-[5rem] mr-5  mx-auto ">
      <ToastContainer />
      <form className="ml-7" onSubmit={handleSubmit}>
        <h4 className="mb-5 text-[#4E4A4A] font-bold pt-7 text-xl">
          {isEdit ? "Mettre à jour le produit" : "Créer un produit"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Input
              label="Modèle"
              id="modele"
              name={"modele"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.modele}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Catégorie"
              id="category"
              name={"category"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.category}
            />
          </div>
        </div>
        <div className="mb-4">
          <ImageInput label="image" handleFileChange={handleFileChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Input
              label="Client"
              id="client"
              name={"client"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.client}
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              label="Quantité demandée"
              id="quantite_demandee"
              name={"quantite_demandee"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.quantite_demandee}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Input
              type="number"
              label="Quantité reçue"
              id="quantityReceived"
              name={"quantityReceived"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.quantityReceived}
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              label="Quantité entreprise"
              id="qte_societe"
              name={"qte_societe"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.qte_societe}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 flex items-center ">
            <Input
              container={"w-[80%]"}
              type="number"
              label="Prix M' OVR"
              id="prixMOver"
              name={"prixMOver"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.prixMOver}
            />
            <select
              className="w-[20%] mt-8"
              name="devise"
              onChange={(e) => onChange("devise", e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                choisir devise
              </option>
              <option value="MAD">MAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="mb-4">
            <Input
              type="number"
              disabled={true}
              label="Prix facture"
              id="prixFacture"
              name={"prixFacture"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.prixFacture}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 font-semibold">
            <label className="block " htmlFor="dateEtude">
              Date étude
            </label>
            <DatePicker
              selected={
                products.dateEtude ? new Date(products.dateEtude) : null
              }
              onChange={(date) => handleDateChange(date, "dateEtude")}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              label="Cours devise étude"
              id="coursDeviseEtude"
              name={"cours_devise_etude"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.cours_devise_etude}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 font-semibold">
            <label className="block" htmlFor="dateImport">
              Date import
            </label>
            <DatePicker
              selected={
                products.dateImport ? new Date(products.dateImport) : null
              }
              onChange={(date) => handleDateChange(date, "dateImport")}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              label="Cours devise import"
              id="coursDeviseImport"
              name={"cours_devise_import"}
              handleChange={(name, value) => onChange(name, value)}
              text={products.cours_devise_import}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 font-semibold">
            <label className="block" htmlFor="dateExport">
              Date export
            </label>
            <DatePicker
              selected={
                products.dateExport ? new Date(products.dateExport) : null
              }
              onChange={(date) => handleDateChange(date, "dateExport")}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
        </div>
        <Button type="submit" classes={"bg-blue-400	mb-5"}>
          {loading
            ? "Création en cours ..."
            : isEdit
            ? "Mettre à jour le produit"
            : "Ajouter le produit"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductForm;
