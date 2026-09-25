import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Contact from "./pages/Contact.jsx";

/**
 * Ensures the browser scrolls back to the top when navigating between pages.
 * Without this, clicking a footer link might load the new page already scrolled to the bottom.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // 'instant' prevents jarring scroll animations on route change
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <Navbar />
      
      {/* 
        main-content wrapper ensures the footer is pushed to the bottom 
        even if a page has very little content.
      */}
      <main className="main-content" style={{ flex: "1 0 auto", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}