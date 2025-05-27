import React, { useState } from "react";
import LoginLayout from "../components/adminComponents/loginLayout";
import { Link } from "react-router-dom";

const SupervisorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Supervisor login:", { email, password });
  };

  return (
    <LoginLayout
      title="Supervisor Login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      footer={<Link to="/admin-login" className="text-[#D25B24] hover:underline">Login as Admin</Link>}
    />
  );
};

export default SupervisorLogin;
