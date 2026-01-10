import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import "../App.css";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container footer__inner flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left side: contact info */}
        <div className="flex flex-col text-sm">
          <span>📞 +639 123 6767 420</span>
          <span>✉️ carlyn.vane.diana@gian-pat.com</span>
        </div>

        {/* Middle: copyright */}
        <div className="text-center">
          <p>© {new Date().getFullYear()} PetF. All rights reserved.</p>
        </div>

        {/* Right side: social icons */}
        <div className="flex gap-3 text-white">
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
