import React, { useState } from "react";
import LoginLayout from "../components/adminComponents/loginLayout";
import { Link } from "react-router-dom";

const InternLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Intern login:", { email, password });
    // TODO: connect to backend
  };

  return (
    <LoginLayout
      title="Intern Login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      footer={<Link to="/supervisor-login" className="text-[#D25B24] hover:underline">Login as Supervisor</Link>}
    />
  );
};

export default InternLogin;