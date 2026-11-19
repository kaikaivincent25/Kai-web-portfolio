import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";

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

function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pages = {
      "/": { title: "Vincent Kaikai — Full-stack developer", description: "Vincent Kaikai builds practical web and mobile products with React, React Native, FastAPI, and PostgreSQL." },
      "/about": { title: "About Vincent Kaikai — Software developer", description: "Learn about Vincent Kaikai’s approach to building practical, user-focused web and mobile software." },
      "/projects": { title: "Projects — Vincent Kaikai", description: "Selected web and mobile projects built with React, React Native, FastAPI, PostgreSQL, and CSS." },
      "/contact": { title: "Contact Vincent Kaikai", description: "Get in touch with Vincent Kaikai about a software role, collaboration, or product to build." },
    };
    const page = pages[pathname] || pages["/"];
    document.title = page.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = page.description;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://vincentkaikai.vercel.app${pathname}`;
  }, [pathname]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/me")) {
    return <Admin />;
  }

  return (
    <div className="app-layout">
      <ScrollToTop />
      <PageMeta />
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
