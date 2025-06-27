// src/components/Hero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
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
    <section className="w-full min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
        <img src={logo} alt="MinT Logo" className="h-12" />
        
        <button
          onClick={() => navigate("/intern-login")}
          className="bg-[#144145] hover:bg-[#0f3232] text-white px-5 py-2 rounded-md font-medium transition duration-200"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex items-center justify-center text-center px-6 md:px-12 py-20 bg-gradient-to-b from-white to-[#f8f9fa] overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Blurred Circles */}
          <div className="absolute w-[400px] h-[400px] bg-[#D25B24] opacity-10 rounded-full top-[-100px] left-[-100px] blur-2xl"></div>
          <div className="absolute w-[500px] h-[500px] bg-[#144145] opacity-10 rounded-full bottom-[-150px] right-[-150px] blur-2xl"></div>

          {/* Triangle */}
          <svg className="absolute top-10 right-10 w-20 h-20 text-[#144145] opacity-10 rotate-12" viewBox="0 0 100 100">
            <polygon points="50,0 100,100 0,100" fill="currentColor" />
          </svg>

          {/* Semicircle */}
          <svg className="absolute bottom-20 left-10 w-32 h-32 text-[#144145] opacity-10 rotate-[-30deg]" viewBox="0 0 100 50">
            <path d="M 0 50 A 50 50 0 0 1 100 50" fill="currentColor" />
          </svg>

          {/* Hollow Circle */}
          <svg className="absolute top-1/3 left-1/2 w-24 h-24 text-[#D25B24] opacity-10 -translate-x-1/2" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" fill="none" />
          </svg>
        </div>

        <div className="z-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#144145] leading-tight mb-4">
            <span className="text-[#D25B24] block">MinT Internships</span>
            Ignite Your Career with Purpose
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Ethiopia’s official software internship program under the Ministry of Innovation and Technology.
          </p>
          <button
            onClick={() => navigate("/apply")}
            className="bg-[#D25B24] hover:bg-[#b3471c] text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg transition duration-200"
          >
            Apply Now
          </button>
        </div>
      </main>

      {/* Decorative Wave */}
      <div className="w-full -mt-1">
        <svg viewBox="0 0 1440 100" className="w-full h-24 text-[#f8f9fa]">
          <path fill="#f8f9fa" d="M0,64L1440,0L1440,320L0,320Z"></path>
        </svg>
      </div>

      {/* Features Section */}
      <section className="bg-[#f8f9fa] py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#144145] mb-12">
            Why Join the MinT Internship?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition duration-300 text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#144145] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcement Section */}
      <section className="bg-[#144145] text-white py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">🚨 Don’t Miss Out!</h2>
          <p className="text-lg mb-6">
            Secure your spot in Ethiopia’s most prestigious tech internship.
          </p>
          <button
            onClick={() => navigate("/apply")}
            className="bg-[#D25B24] hover:bg-[#b3471c] px-6 py-3 rounded-lg font-semibold text-white transition duration-200"
          >
            Submit Application
          </button>
        </div>
      </section>
    </section>
  );
};

export default Hero;
