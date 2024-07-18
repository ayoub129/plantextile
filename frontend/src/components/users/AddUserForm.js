// import React components
import React, { useEffect, useState } from "react";
// import routers
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AddUserForm = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const { id } = useParams();
  const currentUserRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const response = await api.get(`/users/${id}`);
          setUser(response.data);
        } catch (error) {
          toast.error(
            `Échec de la récupération des données de l'utilisateur: ${error}`
          );
        }
      }
    };

    fetchUser();
  }, [navigate, id]);

  const roles =
    currentUserRole === "HR"
      ? [
          "HR",
          "Logistique",
          "Méthode",
          "Chaîne_production_entrée",
          "Chaîne_production_sortie",
          "Production_coupe",
          "Production_repassage",
          "Contrôle_final",
          "Magasin_fourniture",
          "Magasin_final",
        ]
      : [
          "RH",
          "admin",
          "Logistique",
          "Méthode",
          "Chaîne_production_entrée",
          "Chaîne_production_sortie",
          "Production_coupe",
          "Production_repassage",
          "Contrôle_final",
          "Magasin_fourniture",
          "Magasin_final",
        ];

  const onChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const validateForm = () => {
    const { name, email, password, password_confirmation } = user;

    if (!name) {
      toast.error("Le nom est obligatoire");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Adresse e-mail invalide");
      return false;
    }

    if (password.length < 5) {
      toast.error("Le mot de passe doit contenir au moins 5 caractères");
      return false;
    }

    if (password !== password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (id) {
      try {
        await api.post(`/users/${id}`, user);
        setLoading(false);
        navigate("/users");
      } catch (error) {
        setLoading(false);
        toast.error(
          "Une erreur s'est produite lors de la mise à jour de l'utilisateur!" +
            error
        );
      }
    } else {
      try {
        await api.post("/users", user);
        setLoading(false);
        navigate("/users");
      } catch (error) {
        setLoading(false);
        toast.error(
          "Une erreur s'est produite lors de la création de l'utilisateur!" +
            error
        );
      }
    }
  };

  return (
    <div className="ml-[18.5%] mr-5 mx-auto pt-[6rem]">
      <ToastContainer />
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <Input
            container=""
            label="Nom"
            id="name"
            name="name"
            handleChange={onChange}
            text={user.name}
            placeholder="Entrez le nom de l'utilisateur"
            order=""
          />
        </div>
        <div className="mb-4">
          <Input
            container=""
            label="Email"
            id="email"
            name="email"
            handleChange={onChange}
            text={user.email}
            placeholder="Entrez l'email de l'utilisateur"
            order=""
          />
        </div>
        <div className="mb-4">
          <Input
            container=""
            label="Mot de passe"
            id="password"
            name="password"
            handleChange={onChange}
            text={user.password}
            placeholder="Entrez le mot de passe"
            type="password"
            order=""
          />
        </div>
        <div className="mb-4">
          <Input
            container=""
            label="Confirmer le mot de passe"
            id="password_confirmation"
            name="password_confirmation"
            handleChange={onChange}
            text={user.password_confirmation}
            placeholder="Confirmez le mot de passe"
            type="password"
            order=""
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold" htmlFor="role">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={(e) => onChange("role", e.target.value)}
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
          >
            <option value="">Sélectionnez le rôle</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <Button classes="bg-blue-500" type="submit">
          {loading
            ? id
              ? "Mise à jour de l'utilisateur en cours ..."
              : "Ajout de l'utilisateur en cours ..."
            : id
            ? "Mettre à jour l'utilisateur"
            : "Ajouter l'utilisateur"}
        </Button>
      </form>
    </div>
  );
};

export default AddUserForm;
