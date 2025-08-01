import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/GeneralComponents/card2";
import { Input } from "../../components/GeneralComponents/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../../components/GeneralComponents/button";
import logo from "../../assets/logo.png";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi"; 
import { Link, useNavigate } from "react-router-dom";

const SupervisorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cohort");
        const cohortArray = Array.isArray(res.data)
          ? res.data
          : res.data.cohorts || [];
        setCohorts(cohortArray);
      } catch (err) {
        console.error("Error fetching cohorts:", err);
        alert("Failed to fetch cohorts. Please try again.");
      }
    };
    fetchCohorts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCohort) {
      alert("Please select a cohort.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/supervisor/login", {
        email,
        password,
        cohortId: selectedCohort,
      });

      const { supervisorId, cohortId, token } = res.data;

      localStorage.setItem("supervisorToken", token);

      navigate(`/supervisorDashboard/${supervisorId}/${cohortId}`);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 relative"
      style={{ backgroundColor: "#144145" }}
    >
       <button
              onClick={() => navigate("/")}
              className="absolute top-6 left-6 flex items-center text-white hover:text-green-50 transition"
            >
              <FiArrowLeft className="mr-1" size={20} />
              Back to Landing
            </button>
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4 text-[#144145]">
          Supervisor Login
        </h1>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="block mb-1 font-medium text-zinc-900">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block mb-1 font-medium text-zinc-900">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="cohort-select"
                className="block mb-2 font-medium text-zinc-900"
              >
                Select Internship Cohort
              </Label>
              <select
                id="cohort-select"
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                required
                className="w-full p-3 rounded-lg border bg-zinc-100"
              >
                <option value="">-- Select a cohort --</option>
                {cohorts.map((cohort) => (
                  <option key={cohort._id} value={cohort._id}>
                    {cohort.name}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full bg-[#D25B24] hover:bg-[#b3471c]">
              Login
            </Button>
          </form>
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-4">
            <Link to="/admin-login" className="text-[#D25B24] hover:underline">
              Login as Admin
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisorLogin;
