// React Packages
import React, { useEffect, useState } from "react";
// Custom Components
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
// api and navigation
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // state for the page 'Error - Email - Password - Loading'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // navigation
  const navigate = useNavigate();

  useEffect(() => {
    // if the token exist redirect to the dashboard
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    // check which role the user belongs to and redirect
    if (token) {
      // redirect the logistique to the products page
      if (role === "Logistique") {
        navigate("/products");
      }
      // redirect the RH to the users page
      else if (role === "HR") {
        navigate("/users");
      }
      // redirect the production guys to there production speciality pages
      else if (role === "Production_coupe") {
        navigate("/coupe");
      } else if (role === "Chaîne_production_entrée") {
        navigate("/production_entre");
      } else if (role === "Chaîne_production_sortie") {
        navigate("/production_sortie");
      } else if (role === "production_repassage") {
        navigate("/repassage");
      } else if (role === "production_control") {
        navigate("/control-final");
      } else if (role === "production_magasin") {
        navigate("/magasin");
      }
      // redirect the method to the effective standard
      else if (role === "Méthode") {
        navigate("/direct");
      }
      // Redirect the Developer and the Admins to the Dashboard
      else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  // handle the login button clicked
  const handleLogin = async (e) => {
    // prevent default of submitting form
    e.preventDefault();
    // set loading to true
    setLoading(true);

    try {
      // send a POST request to the /login endpoint with the email and password
      const response = await api.post("/login", {
        email,
        password,
      });

      // get the token and the user from the backend
      const { token, user } = response.data;
      // set the token and the role in the localstorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      // redirect the logistique to the products page
      if (user.role === "Logistique") {
        navigate("/products");
      }
      // redirect the RH to the users page
      else if (user.role === "HR") {
        navigate("/users");
      }
      // redirect the production guys to there production speciality pages
      else if (user.role === "Production_coupe") {
        navigate("/coupe");
      } else if (user.role === "Chaîne_production_sortie") {
        navigate("/production_sortie");
      } else if (user.role === "Chaîne_production_entrée") {
        navigate("/production_entre");
      } else if (user.role === "Production_repassage") {
        navigate("/repassage");
      } else if (user.role === "Contrôle_final") {
        navigate("/control-final");
      } else if (user.role === "Magasin_fourniture") {
        navigate("/magasin_fourniture");
      } else if (user.role === "Magasin_final") {
        navigate("/magasin");
      }
      // redirect the method to the effective standard
      else if (user.role === "Method") {
        navigate("/planning");
      }
      // Redirect the Developer and the Admins to the Dashboard
      else {
        navigate("/dashboard");
      }
    } catch (err) {
      // catch any error and show this message
      setError("Invalid credentials. Please try again.");
    } finally {
      // set the loading to false
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <Input
            container="mb-4"
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            handleChange={(name, value) => setEmail(value)}
            text={email}
          />
          <Input
            container="mb-6"
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            handleChange={(name, value) => setPassword(value)}
            text={password}
          />
          <Button
            container=""
            classes="bg-blue-500 hover:bg-blue-600 transition duration-200"
            handlePress={handleLogin}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
