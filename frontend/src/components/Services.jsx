import { motion } from "framer-motion";
import {
  FiCode,
  FiSmartphone,
  FiPenTool,
  FiCpu,
  FiArrowUpRight,
} from "react-icons/fi";

const services = [
  {
    number: "01",
    icon: FiCode,
    title: "Web Development",
    description:
      "Fast, responsive, and scalable websites and web applications built for modern businesses.",
  },
  {
    number: "02",
    icon: FiPenTool,
    title: "UI / UX Design",
    description:
      "Thoughtful interfaces and smooth experiences designed around real users and business goals.",
  },
  {
    number: "03",
    icon: FiSmartphone,
    title: "Mobile Development",
    description:
      "Modern mobile experiences that help brands connect with customers wherever they are.",
  },
  {
    number: "04",
    icon: FiCpu,
    title: "Custom Software",
    description:
      "Tailored digital solutions built around your workflows, challenges, and long-term growth.",
  },
];

function Services() {
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
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.article
              className="service-card"
              key={service.number}
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
                <span>{service.number}</span>
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
        })}
      </div>
    </section>
  );
}

export default Services;