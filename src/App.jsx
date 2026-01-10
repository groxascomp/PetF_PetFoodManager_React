import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Company from "./components/Company";
import Footer from "./components/Footer";

// Pages
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Level from "./pages/Level";   // ✅ new Level page

export default function App() {
  return (
    <Router>
      {/* Show TopBar + NavBar everywhere except Login */}
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <>
              
              <NavBar />
              <Routes>
                {/* Home page */}
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      {/* You can add <Company /> here if you want it visible on home */}
                    </>
                  }
                />
                {/* Other pages */}
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/level" element={<Level />} />   {/* ✅ new route */}
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}
