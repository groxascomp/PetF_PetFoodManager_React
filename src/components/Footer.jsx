import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import "../App.css";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
  <div className="w-full px-0 footer__inner flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
    
    {/* Far left: contact info */}
    <div className="flex flex-col text-sm md:order-1 md:text-left w-full md:w-auto"
    style={{
      paddingLeft: "50px",
    }}
    >
      <span>📞 +639 123 6767 420</span>
      <span>✉️ carlyn.vane.diana@gian-pat.com</span>
    </div>

    {/* Center: copyright */}
    <div className="text-center md:order-2 w-full md:w-auto">
      <p>© {new Date().getFullYear()} PetF. All rights reserved.</p>
    </div>

    {/* Far right: social icons */}
    <div className="flex gap-3 text-white md:order-3 md:justify-end w-full md:w-auto"
    style={{
      paddingRight: "50px",
      paddingLeft: "142px",
    }}
    
    >
      <a
        href="https://web.facebook.com/gianexequiel"
        aria-label="Facebook"
        className="hover:text-blue-400 transition"
      >
        <FaFacebookF />
      </a>
      <a
        href="https://www.google.com/search?q=giga+squidward"
        aria-label="Twitter"
        className="hover:text-blue-400 transition"
      >
        <FaTwitter />
      </a>
      <a
        href="https://www.linkedin.com/in/exe0107g"
        aria-label="LinkedIn"
        className="hover:text-blue-400 transition"
      >
        <FaLinkedinIn />
      </a>
    </div>
  </div>
</footer>

  );
}
