// src/components/Hero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Award, Briefcase, Users } from "lucide-react";

const features = [
  {
    title: "Real Projects",
    desc: "Contribute to impactful, government-backed tech projects.",
    icon: <Briefcase className="w-10 h-10 text-[#D25B24]" />,
  },
  {
    title: "Mentorship",
    desc: "Learn from Ethiopia’s best software professionals and mentors.",
    icon: <Users className="w-10 h-10 text-[#D25B24]" />,
  },
  {
    title: "Recognition",
    desc: "Earn official certification that advances your career.",
    icon: <Award className="w-10 h-10 text-[#D25B24]" />,
  },
];
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#f8f9fa] to-white flex flex-col overflow-hidden">

      {/* Header */}
      <header className="w-full bg-white shadow-md px-6 md:px-12 py-2 flex justify-between items-center z-20 relative">
        <img src={logo} alt="MinT Logo" className="h-12 md:h-[60px]" />
        <button
          onClick={() => navigate("/intern-login")}
          className="bg-[#144145] hover:bg-[#0f3232] text-white px-5 py-2 rounded-md text-sm md:text-base font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#144145]"
        >
          Login
        </button>
      </header>

      {/* Hero */}
      <main className="relative flex-1 flex items-center justify-center text-center px-6 md:px-12 py-20 bg-gradient-to-b from-white to-[#f8f9fa] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[400px] h-[400px] bg-[#D25B24] opacity-10 rounded-full top-[-100px] left-[-100px] blur-2xl"></div>
          <div className="absolute w-[500px] h-[500px] bg-[#144145] opacity-10 rounded-full bottom-[-150px] right-[-150px] blur-2xl"></div>
        </div>

        <div className="z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#144145] leading-tight mb-4">
            Ignite Your Career with{" "}
            <span className="text-[#D25B24]">MinT Internships</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-4">
            A gateway to Ethiopia’s official software internship program at the Ministry of Innovation and Technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/apply")}
              className="bg-[#D25B24] hover:bg-[#b3471c] text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md transition duration-200"
            >
              Apply Now
            </button>
            
          </div>
        </div>
      </main>

      {/* Wave Divider */}
      <div className="w-full overflow-hidden ">
        <svg viewBox="0 0 1440 100" className="w-full h-24 text-[#f8f9fa]">
          <path fill="#f8f9fa" d="M0,64L1440,0L1440,320L0,320Z"></path>
        </svg>
      </div>

      {/* Features */}
    <section className="bg-[#f8f9fa] py-20 px-6 md:px-12 text-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md hover:shadow-xl p-8 transition duration-300 flex flex-col items-center text-center"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-[#144145] mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

      {/* Announcement Section */}
    <section className="bg-[#f8f9fa] py-16 px-6 md:px-12 flex justify-center">
  <div className="bg-[#144145] text-white rounded-3xl px-8 py-12 max-w-4xl w-full shadow-lg text-center">
    <h2 className="text-3xl font-bold mb-4">🚨 Don’t Miss Out!</h2>
    <p className="text-lg">
      Be part of the change. Apply for <strong>Cohort 3</strong> before{" "}
      <span className="text-[#D25B24] font-semibold">June 12</span>.
    </p>
    <button
      onClick={() => navigate("/apply")}
      className="mt-6 bg-[#D25B24] hover:bg-[#b3471c] text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
    >
      Submit Application
    </button>
  </div>
</section>


    
    </section>
  );
};

export default Hero;
