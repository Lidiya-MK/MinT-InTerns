import React from "react";
import interns from "../assets/intern01.png";

const ImageTextSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-20 py-16 font-mont">
      
      {/* Left Text Content */}
      <div className="md:w-1/2 w-full text-center md:text-left">
        <h2 className="text-[#144145] text-[40px] md:text-[50px] font-bold mb-4">
          Who can become our Intern?
        </h2>
        <p className="text-[#848383] text-[18px] md:text-[20px] leading-relaxed">
          We welcome passionate students and recent graduates in computer science, software engineering, and related fields. If you're eager to solve real-world problems, collaborate on national digital solutions, and grow under expert mentorship, then this internship is for you. Your drive and curiosity matter more than experience.
        </p>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 w-full">
        <img
          src={interns}
          alt="Descriptive Visual"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>
    </section>
  );
};

export default ImageTextSection;
