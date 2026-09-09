import { motion } from "framer-motion";
import { FiArrowUpRight, FiCheckCircle } from "react-icons/fi";

function About() {
  const features = [
    "User-centered design",
    "Modern technologies",
    "Scalable solutions",
    "Reliable support",
  ];

  return (
    <section className="about-section" id="about">
      <div className="section-container">
        <motion.div
          className="about-visual"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <div className="about-glow"></div>

          <div className="about-card">
            <div className="about-card-top">
              <span>01</span>
              <span>ABOUT NOVATECH</span>
            </div>

            <div className="about-symbol">
              N<span>_</span>
            </div>

            <div className="about-card-bottom">
              <span>CREATE</span>
              <span>INNOVATE</span>
              <span>GROW</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="section-label">ABOUT US</p>

          <h2>
            We turn ideas into
            <span> digital impact.</span>
          </h2>

          <p className="about-text">
            NOVATECH is a digital solutions company focused on building
            modern, scalable, and meaningful products. We combine thoughtful
            design with smart technology to help businesses move forward.
          </p>

          <div className="about-features">
            {features.map((feature, index) => (
              <motion.div
                className="about-feature"
                key={feature}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FiCheckCircle />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <a href="#services" className="about-link">
            Discover our services
            <FiArrowUpRight />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default About;