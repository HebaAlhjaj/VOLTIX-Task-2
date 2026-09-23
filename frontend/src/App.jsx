import { useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
import ServiceManagement from "./components/ServiceManagement";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function Home() {
  const [showContentManagement, setShowContentManagement] =
    useState(false);

  const [showServiceManagement, setShowServiceManagement] =
    useState(false);

  return (
    <>
      <Navbar
        onAdminClick={() =>
          setShowContentManagement(true)
        }
        onServiceAdminClick={() =>
          setShowServiceManagement(true)
        }
      />

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
          onClose={() =>
            setShowContentManagement(false)
          }
        />
      )}

      {showServiceManagement && (
        <ServiceManagement
          onClose={() =>
            setShowServiceManagement(false)
          }
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

