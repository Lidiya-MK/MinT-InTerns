// src/components/ImageTextSection.jsx
import React from "react"
import interns from "../assets/intern00.png" // Replace with your image

const ImageTextSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-20 py-16 font-mont">
      {/* Left Image */}
      <div className="md:w-1/2 w-full">
        <img
          src={interns}
          alt="Descriptive Visual"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Right Text Content */}
      <div className="md:w-1/2 w-full text-center md:text-left">
        <h2 className="text-[#D25B24] text-[40px] md:text-[50px] font-bold mb-4">
        Why do an internship at MinT?
        </h2>
        <p className="text-[#848383] text-[18px] md:text-[20px] leading-relaxed">
        MinT has been at the forefront of the technological development in Ethiopia for decades. By doing your internship at MinT, You will not only learn from the best in the field but also gain full financial support for your groundbreaking projects. MinT fully supports the production and deployment costs for innovative and impactfull projects proposed by interns.
        </p>
      </div>
    </section>
  )
}

export default ImageTextSection
