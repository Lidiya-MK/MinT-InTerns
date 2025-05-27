import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoginLayout from "../../components/adminComponents/loginLayout";
import { Link, useNavigate } from "react-router-dom";

const InternLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/api/interns/login", {
        email,
        password,
      });

      toast.success("Login successful");
      localStorage.setItem("internToken", data.token);
      navigate("/internDashboard"); // ✅ Updated path
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <LoginLayout
      title="Intern Login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      footer={
        <Link to="/supervisor-login" className="text-[#D25B24] hover:underline">
          Login as Supervisor
        </Link>
      }
    />
  );
};

export default InternLogin;
