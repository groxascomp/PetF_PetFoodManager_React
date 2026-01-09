import React from "react";
import "../App.css";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__left">
        <span>📞 +639  123 6767 420</span>
        <span>✉️ carlyn.vane.diana@gian-pat.com</span>
      </div>
      <div className="topbar__right">
        <a href="https://web.facebook.com/gianexequiel" aria-label="Facebook">Fb</a>
        <a href="https://www.google.com/search?q=giga+squidward&sca_esv=8f86c1cd49cc125e&udm=2&biw=1490&bih=836&aic=0&sxsrf=ANbL-n6e3jeJ50YsjBfDDPIMyqrtxOmGWA%3A1767924690257&ei=0mNgabq3D4aQvr0PzNDEmAo&oq=giga+sq&gs_lp=Egtnd3Mtd2l6LWltZyIHZ2lnYSBzcSoCCAAyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgQQABgeMgQQABgeMgQQABgeMgQQABgeMgQQABgeMgYQABgeGApInBdQ_ApYwQ1wA3gAkAEAmAGBAaAB-wGqAQMwLjK4AQPIAQD4AQGYAgWgAokCwgIKEAAYgAQYigUYQ8ICBhAAGAgYHsICCBAAGAgYHhgKwgIHECMYyQIYJ5gDAIgGAZIHAzMuMqAHvwmyBwMwLjK4B4ECwgcDMC41yAcKgAgB&sclient=gws-wiz-img" aria-label="Twitter">Tw</a>
        <a href="https://www.linkedin.com/in/exe0107g" aria-label="LinkedIn">In</a>
      </div>
    </div>
  );
}