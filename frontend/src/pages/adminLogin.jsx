import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoginLayout from "../components/adminComponents/loginLayout";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Store token in localStorage
      localStorage.setItem("token", data.token);
  
      toast.success("Login successful!", {
        style: {
          background: "#144145",
          color: "white",
        },
      });
  
      setTimeout(() => {
        navigate("/admin/Cohorts");
      }, 1500);
    } catch (err) {
      toast.error(err.message, {
        style: {
          background: "#144145",
          color: "white",
        },
      });
    }
  };
  

  return (
    <LoginLayout
      title="Admin Login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
    />
  );
};

export default AdminLogin;
