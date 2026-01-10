import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-2 text-sm">
      <div className="flex gap-4">
        <span>📞 +639 123 6767 420</span>
        <span>✉️ carlyn.vane.diana@gian-pat.com</span>
      </div>
      <div className="flex gap-3">
        <a
          href="https://web.facebook.com/gianexequiel"
          aria-label="Facebook"
          className="hover:text-blue-300 transition"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://www.google.com/search?q=giga+squidward"
          aria-label="Twitter"
          className="hover:text-blue-300 transition"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.linkedin.com/in/exe0107g"
          aria-label="LinkedIn"
          className="hover:text-blue-300 transition"
        >
          <FaLinkedinIn />
        </a>
      </div>
    </div>
  );
}
