import React from "react";


const Footer = () => {


  return (
    <footer className="bg-[#0f3232] text-white px-6 md:px-12 pt-12 pb-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About Section */}
        <div>
          <h4 className="text-xl font-bold mb-4">MinT Internships</h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            Empowering young developers through real-world tech experiences, led by the Ministry of Innovation and Technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <a href="#about" className="hover:text-white transition">About</a>
            </li>
            <li>
              <a href="#cohorts" className="hover:text-white transition">Cohorts</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </li>
            <li>
              <a href="/faq" className="hover:text-white transition">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-xl font-bold mb-4">Connect with Us</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: <a href="mailto:info@mint.gov.et" className="underline hover:text-white">info@mint.gov.et</a></li>
            <li>Twitter: <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">@MinT_Ethiopia</a></li>
            <li>Location: Addis Ababa, Ethiopia</li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-[#1a4a4a] text-center text-xs text-gray-400 mt-10 pt-4">
        © {new Date().getFullYear()} Ministry of Innovation and Technology. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
