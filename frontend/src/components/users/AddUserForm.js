import React, { useEffect, useState } from "react";
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
    const checkRoleAndFetchUser = async () => {
      const userRoles = ["RH", "superadmin", "admin", "developer"];
      if (userRoles.indexOf(currentUserRole) === -1) {
        navigate("/dashboard");
        return;
      }

      if (id) {
        try {
          const response = await api.get(`/users/${id}`);
          setUser(response.data);
        } catch (error) {
          toast.error(`Failed to fetch user data: ${error}`);
        }
      }
    };

    checkRoleAndFetchUser();
  }, [currentUserRole, navigate, id]);

  const roles =
    currentUserRole === "RH"
      ? [
          "RH",
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
      toast.error("Name is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return false;
    }

    if (password.length < 5) {
      toast.error("Password must be at least 5 characters long");
      return false;
    }

    if (password !== password_confirmation) {
      toast.error("Passwords do not match");
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
        toast.error("There was an error updating the user!" + error);
      }
    } else {
      try {
        await api.post("/users", user);
        setLoading(false);
        navigate("/users");
      } catch (error) {
        setLoading(false);
        toast.error("There was an error creating the user!" + error);
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
            label="Name"
            id="name"
            name="name"
            handleChange={onChange}
            text={user.name}
            placeholder="Enter user name"
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
            placeholder="Enter user email"
            order=""
          />
        </div>
        <div className="mb-4">
          <Input
            container=""
            label="Password"
            id="password"
            name="password"
            handleChange={onChange}
            text={user.password}
            placeholder="Enter password"
            type="password"
            order=""
          />
        </div>
        <div className="mb-4">
          <Input
            container=""
            label="Confirm Password"
            id="password_confirmation"
            name="password_confirmation"
            handleChange={onChange}
            text={user.password_confirmation}
            placeholder="Confirm password"
            type="password"
            order=""
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={(e) => onChange("role", e.target.value)}
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
          >
            <option value="">Select role</option>
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
              ? "Updating User ..."
              : "Adding User ..."
            : id
            ? "Update User"
            : "Add User"}
        </Button>
      </form>
    </div>
  );
};

export default AddUserForm;
