import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import ContentManagement from "./pages/ContentManagement";

function Home() {
  const [showContentManagement, setShowContentManagement] = useState(false);

  return (
    <>
      <Navbar onAdminClick={() => setShowContentManagement(true)} />

      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Projects />
        <Testimonials />
        <CTA />
        <Contact />
      </main>

      <Footer />

      {showContentManagement && (
        <ContentManagement
          onClose={() => setShowContentManagement(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;