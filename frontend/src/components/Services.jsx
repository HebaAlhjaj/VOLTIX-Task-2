import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiSmartphone,
  FiPenTool,
  FiCpu,
  FiArrowUpRight,
} from "react-icons/fi";

import { getServices } from "../services/servicesApi";

const iconMap = {
  web: FiCode,
  mobile: FiSmartphone,
  design: FiPenTool,
  software: FiCpu,
};

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    }

    // Load services when the page opens
    loadServices();

    // Listen for changes from Service Management
    const handleServicesUpdated = () => {
      loadServices();
    };

    window.addEventListener(
      "servicesUpdated",
      handleServicesUpdated
    );

    return () => {
      window.removeEventListener(
        "servicesUpdated",
        handleServicesUpdated
      );
    };
  }, []);

  return (
    <section className="services-section" id="services">
      <div className="section-container services-header">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">WHAT WE DO</p>

          <h2>
            Solutions built to
            <span> move you forward.</span>
          </h2>
        </motion.div>

        <motion.p
          className="services-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          From first concept to final product, we build digital experiences
          that combine technology, creativity, and measurable business value.
        </motion.p>
      </div>

      <div className="section-container services-grid">
        {loading ? (
          <p className="services-loading">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="services-loading">No services available.</p>
        ) : (
          services.map((service, index) => {
            const Icon = iconMap[service.icon] || FiCode;

            return (
              <motion.article
                className="service-card"
                key={service.id}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -10 }}
              >
                <div className="service-top">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Icon />
                </div>

                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

                <a href="#contact" className="service-link">
                  Learn more
                  <FiArrowUpRight />
                </a>
              </motion.article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Services;